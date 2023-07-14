'use client'

import Main from "@/layout/Main";
import Sidebar from '@/component/Sidebar';
import clsx from "clsx";
import { Inter } from 'next/font/google'
import { ReactNode } from "react";
import '@/app/globals.css';
import { GlobalProvider } from "@/providers/global";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({ subsets: ['latin'] })

// export const metadata = {
//   title: 'Russitant',
//   description: 'AI Assistant',
// }

type RootLayoutProps = {
  children: ReactNode;
};

const RootLayout = (props: RootLayoutProps) => (
  <html lang="en" className="[color-scheme:dark]">
    <body className={ clsx("bg-gray-1100 bg-[url('/grid.svg')]", inter.className) }>
      <GlobalProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <Main className="flex flex-col items-center justify-between">
        <div className="flex items-start justify-between w-full h-full overflow-hidden">
          <Sidebar className="h-full" />
          <div className="w-full h-full">{ props.children }</div>
        </div>
        <div className="w-full min-h-fit bg-foreground-mute border-t border-primary text-primary">Chat Bot Statistics | 69 wpm</div>
      </Main>
      </ThemeProvider>
      </GlobalProvider>
    </body>
  </html>
);

export default RootLayout;