import { ChatGPTMessage } from "@/component/ChatLine";
import { createParser } from 'eventsource-parser'

export interface OnTextCallbackResult {
    // response content
    text: string;
    // cancel for fetch
    cancel: () => void;
}

export async function replay(
    apiKey: string,
    host: string,
    msgs: ChatGPTMessage[],
    onText?: (option: OnTextCallbackResult) => void,
    onError?: (error: Error) => void,
) {
    let prompts: ChatGPTMessage [] = []
    for (let i = msgs.length-1; i>=0; i--) {
        const msg = msgs[i]
        prompts = [msg, ...prompts]
    }
    let hasCancel = false;
    const controller = new AbortController();
    const cancel = () => {
        hasCancel = true;
        controller.abort();
    };
    let temperature = 0
    let fullText = '';
    try {
        const messages = prompts.map(msg => ({ role: msg.role, content: msg.content }))
        console.log(`messags: ${messages}`)
        const response = await fetch(`${host}/v1/chat/completions`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                messages,
                model: 'gpt-3.5-turbo',
                max_tokens: 500,
                temperature,
                stream: true,
            }),
            signal: controller.signal,
        });
        await handleSSE(response, (message) => {
            if (message === '[DONE]') {
                return;
            }
            const data = JSON.parse(message)
            if (data.error) {
                throw new Error(`Error from OpenAI: ${JSON.stringify(data)}`)
            }
            const text = data.choices[0]?.delta?.content
            if (text !== undefined) {
                fullText += text
                if (onText) {
                    onText({ text: fullText, cancel })
                }
            }
        })

    } catch (error) {
        if (hasCancel) {
            return;
        }
        if (onError) {
            onError(error as any)
        }
        throw error
    }
    return fullText
}

export async function handleSSE(response: Response, onMessage: (message: string) => void) {
    if (!response.ok) {
        const error = await response.json().catch(() => null)
        throw new Error(error ? JSON.stringify(error) : `${response.status} ${response.statusText}`)
    }
    if (response.status !== 200) {
        throw new Error(`Error from OpenAI: ${response.status} ${response.statusText}`)
    }
    if (!response.body) {
        throw new Error('No response body')
    }
    const parser = createParser((event) => {
        if (event.type === 'event') {
            onMessage(event.data)
        }
    })
    for await (const chunk of iterableStreamAsync(response.body)) {
        const str = new TextDecoder().decode(chunk)
        parser.feed(str)
    }
}

export async function* iterableStreamAsync(stream: ReadableStream): AsyncIterableIterator<Uint8Array> {
    const reader = stream.getReader();
    try {
        while (true) {
            const { value, done } = await reader.read()
            if (done) {
                return
            } else {
                yield value
            }
        }
    } finally {
        reader.releaseLock()
    }
}