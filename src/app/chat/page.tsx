'use client'

import { Boundary } from '@/ui/component/Boundary';
import { ChatBox } from "@/ui/component/ChatBox";
import { Text } from '@vercel/examples-ui';

const Chat = () => (
  <Boundary>
    <div className="flex flex-col gap-3 mx-4">
      <Text variant="h2">AI Chat Bot:</Text>
      <div className="w-full">
        <ChatBox />
      </div>
    </div>
  </Boundary>
);

export default Chat;