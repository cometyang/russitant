import Main from "@/ui/layout/Main";
import Sidebar from '@/ui/component/Sidebar';
import clsx from "clsx";
import { Inter } from 'next/font/google'
import { ReactNode } from "react";
import '@/app/globals.css';

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Russitant',
  description: 'AI Assistant',
}

type RootLayoutProps = {
  children: ReactNode;
};

const RootLayout = (props: RootLayoutProps) => (
  <html lang="en" className="[color-scheme:dark]">
    <body className={ clsx("bg-gray-1100 bg-[url('/grid.svg')]", inter.className) }>
      <Main className="flex">
        <Sidebar />
        <div className="w-full h-full overflow-y-auto">{ props.children }</div>
      </Main>
    </body>
  </html>
);

export default RootLayout;