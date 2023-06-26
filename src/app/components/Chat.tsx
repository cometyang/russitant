import { useEffect, useState } from 'react'
import { Button } from './Button'
import { type ChatGPTMessage, ChatLine, LoadingChatLine } from './ChatLine'
import { useCookies } from 'react-cookie'
import { invoke } from '@tauri-apps/api/tauri'
import { listen } from '@tauri-apps/api/event';

const COOKIE_NAME = 'nextjs-example-ai-chat-gpt3'

// default first message to display in UI (not necessary to define the prompt)
export const initialMessages: ChatGPTMessage[] = [
  {
    role: 'assistant',
    content: 'Hi! I am a friendly AI assistant. Ask me anything!',
  }
]

const InputMessage = ({ input, setInput, sendMessage }: any) => (
  <div className="mt-6 flex clear-both">
    <input
      type="text"
      aria-label="chat input"
      required
      className="min-w-0 flex-auto appearance-none rounded-md border border-zinc-900/10 bg-white px-3 py-[calc(theme(spacing.2)-1px)] shadow-md shadow-zinc-800/5 placeholder:text-zinc-400 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/10 sm:text-sm"
      value={input}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          sendMessage(input)
          setInput('')
        }
      }}
      onChange={(e) => {
        setInput(e.target.value)
      }}
    />
    <Button
      type="submit"
      className="ml-4 flex-none"
      onClick={() => {
        sendMessage(input)
        setInput('')
      }}
    >
      Say
    </Button>
  </div>
)

let isGenerating: boolean = false;

export function Chat() {
  const [messages, setMessages] = useState<ChatGPTMessage[]>(initialMessages)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  
  useEffect(() => {
    
      let chunk="";
      const unlistenNewToken = listen<string>('NEW_TOKEN', (event) => {
      if (!isGenerating) 
      {
        return;
      }
        setLoading(true);
        console.log(`Got event in window ${event.windowLabel}, payload: ${event.payload['message']}`);
        chunk += event.payload.message;
        const newMessages = [
          ...messages,
          { role: 'assistant', content: chunk } as ChatGPTMessage,
        ]
        setMessages(newMessages);
        setLoading(false);
        console.log(`${newMessages}`)
      });

      return () => {
        unlistenNewToken;
      }
    
  }, [setMessages])

  // send message to API /api/chat endpoint
  const sendMessage = async (message: string) => {
    setLoading(true)
    const newMessages = [
      ...messages,
      { role: 'user', content: message } as ChatGPTMessage,
    ]
    setMessages(newMessages)
    console.log(`${newMessages}`)
    setLoading(false)
    const last10messages = newMessages.slice(-10) // remember last 10 messages


    const sentMessage= newMessages.slice(-1)
    console.log(`Sent message:${sentMessage}`)
    isGenerating = true;
    const response = await invoke("chat", {message: message});
    isGenerating = false;
   
  }

  return (
    <div className="rounded-2xl border-zinc-100  lg:border lg:p-6">
      {messages.map(({ content, role }, index) => (
        <ChatLine key={index} role={role} content={content} />
      ))}

      {loading && <LoadingChatLine />}

      {messages.length < 2 && (
        <span className="mx-auto flex flex-grow text-gray-600 clear-both">
          Type a message to start the conversation
        </span>
      )}
      <InputMessage
        input={input}
        setInput={setInput}
        sendMessage={sendMessage}
      />
    </div>
  )
}