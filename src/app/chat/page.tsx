'use client'
import { Boundary } from '@/ui/boundary';
import Sidebar from '@/ui/sidebar';
import { Layout, Text} from '@vercel/examples-ui'
import { Chat } from '../components/Chat'
export default function Page(){

    return (


      <Boundary>
        <section className="flex flex-col gap-3">
            <Text variant="h2">AI Chat Bot:</Text>
            <div className="lg:w-2/3">
            <Chat />
            </div>
        </section>
        </Boundary>
    
     
);
}