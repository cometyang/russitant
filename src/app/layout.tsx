import '@/styles/globals.css';
import { AddressBar } from '@/ui/address-bar';
//import './globals.css'
import Byline from '@/ui/byline';
import { GlobalNav } from '@/ui/global-nav'
import Sidebar from '@/ui/sidebar';
import SidebarProvider from '@/context/sidebar-context';
import { Inter } from 'next/font/google'
import Main from "@/app/layout/Main";

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Russitant',
  description: 'AI Assistant',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="[color-scheme:dark]">
      <body className="bg-gray-1100 bg-[url('/grid.svg')]">
        <Main>
          <div className="flex w-full h-full">
            <SidebarProvider>
              <Sidebar />
            </SidebarProvider>
            <div className="w-full h-full overflow-y-auto">
              { children }
            </div>
          </div>
        </Main>
      </body>
    </html>
  )
}
