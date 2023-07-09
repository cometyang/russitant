'use client'

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { invoke } from '@tauri-apps/api/tauri'
import { Event, listen, UnlistenFn } from "@tauri-apps/api/event";
import { type ChatGPTMessage, ChatLine, LoadingChatLine } from './ChatLine'
import TextField from "@/component/TextField";
import { RiSendPlaneFill as SendIcon } from "react-icons/ri";
import clsx from "clsx";
import * as client from "@/services/client"
import useStore from "@/providers/store";
import { useGlobal } from "@/providers/global";

// default first message to display in UI (not necessary to define the prompt)
export const initialMessages: ChatGPTMessage[] = [
  {
    role: 'assistant',
    content: 'Hi! I am a friendly AI assistant. Ask me anything!',
  }
];

type Message = {
  message: string;
};

type ChatBoxProps = {
  className?: string;
};

const ChatBox = (props: ChatBoxProps) => {
  const [input, setInput] = useState<string>('');
  const [loading, setLoading] = useState(false);
 
  const [messages, setMessages] = useState<ChatGPTMessage[]>(initialMessages);
  const ref = useRef<HTMLDivElement | null>(null);
  const {store} = useGlobal();
  useEffect(() => {
    const unlistener: Promise<UnlistenFn> = listen<Message>('NEW_TOKEN', (event: Event<Message>) => {
      setMessages((current) => {
        const lastMessage = current.slice(-1).shift();
        switch (lastMessage?.role) {
          case 'assistant': return [...current.slice(0, current.length-1), { ...lastMessage, content: `${lastMessage.content}${event.payload.message}` }];
          case 'user': return [...current, { role: 'assistant', content: event.payload.message }];
        }
      });
    });

    return () => {
      unlistener.then((unlistenFn) => unlistenFn());
    };
  }, []);

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
    if (store.usingOpenAI) {
      const generate = async(promptMsgs: ChatGPTMessage[], targetMsg: ChatGPTMessage) => {
        await client.replay(
          store.settings.openaiKey,
          store.settings.apiHost,
          promptMsgs,
          ({ text, cancel }) => {
            setMessages((current) => {
              const lastMessage = current.slice(-1).shift();
              switch (lastMessage?.role) {
                case 'assistant': return [...current.slice(0, current.length-1), { ...lastMessage, content: `${text}` }];
                case 'user': return [...current, { role: 'assistant', content: text }];
              }
            });
          }
        )
      
      }
      generate(newMessages, { role: 'user', content: message } as ChatGPTMessage)
    }
    else {
      const response = await invoke("chat", {message: message});
      console.log("using local model")
    }


  }

  const submit = () => {
    setInput('');
    sendMessage(input)
      .catch();
  };

  useLayoutEffect(() => {
    if (ref.current) {
      const options: ScrollToOptions = { top: (ref.current as HTMLDivElement).scrollHeight };
      ref.current?.scrollTo(options);
    }
  }, [ref.current?.scrollHeight]);

  return (
    <div className={ clsx("flex flex-col justify-between w-full h-full overflow-hidden", props.className) }>
      <div ref={ ref } className="w-full h-full mt-4 overflow-y-auto no-scrollbar scroll-smooth rounded-lg">
        {messages.map(({ content, role }, index) => (
          <ChatLine key={index} role={role} content={content} />
        ))}

        {loading && <LoadingChatLine />}

      </div>

      <TextField
        value={ input }
        placeholder={ messages.length < 2 ? "Type a message to start the conversation" : '' }
        onInput={ (e) => setInput((e.target as HTMLInputElement).value) }
        onKeyDown={ (e) => { if (e.key === 'Enter') { submit() } } }
        suffix={ <SendIcon size={ 24 } className="fill-primary cursor-pointer mx-2" onClick={ () => submit() } /> }
        className="w-full min-h-fit mt-4"
        clazz="placeholder:text-primary-mute/60"
      />
    </div>
  )
};

export default ChatBox;