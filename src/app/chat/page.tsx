'use client'
import { Boundary } from '@/ui/boundary';
import Sidebar from '@/ui/sidebar';
import { Layout, Text} from '@vercel/examples-ui'
import { Chat } from '../components/Chat'

export default function Page() {
  return (
    <Boundary>
      <div className="flex flex-col gap-3 mx-4">
        <Text variant="h2">AI Chat Bot:</Text>
        <div className="w-full">
          <Chat />
        </div>
      </div>
    </Boundary>
  );
}