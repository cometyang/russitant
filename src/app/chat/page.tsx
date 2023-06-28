'use client'

import ChatBox from "@/component/ChatBox";

const Chat = () => (
  <div className="flex flex-col w-full h-full p-4">
    <div className="font-bold leading-none text-lg text-primary">AI Chat Bot</div>
    <ChatBox className="w-full h-full" />
  </div>
);

export default Chat;