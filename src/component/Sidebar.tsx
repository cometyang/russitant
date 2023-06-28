"use client";

import { MdKeyboardArrowRight, MdKeyboardArrowLeft } from "react-icons/md";
import { RiChatSmileLine, RiCloudLine, RiInformationLine, RiSettings4Line, RiWaterFlashLine } from "react-icons/ri";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import logoPic from "../../public/logo.jpg";

const sidebarItems = [
  {
    name: "Chat",
    href: "/chat",
    icon: RiChatSmileLine,
  },
  {
    name: "Dream",
    href: "/dream",
    icon: RiCloudLine,
  },
  {
    name: "Flow",
    href: "/flow",
    icon: RiWaterFlashLine,
  },
  {
    name: "Settings",
    href: "/settings",
    icon: RiSettings4Line,
  },
  {
    name: "About",
    href: "/about",
    icon: RiInformationLine,
  },
];

type SidebarProps = {
  initOpen?: boolean;
  className?: string;
};

const Sidebar = (props: SidebarProps) => {
  const [isCollapsed, setCollapsed] = useState<boolean>(!!props.initOpen);

  return (
    <div className={ props.className }>
      <aside className="sidebar bg-foreground-mute border-r border-r-primary" data-collapse={ isCollapsed }>
        <div className="sidebar__top">
          <Image src={logoPic} width={80} height={80} className="sidebar__logo" alt="logo" />
          <span className="w-full text-primary font-bold text-[24px] truncate px-2">Russitant</span>
        </div>

        <div className="flex items-center justify-between my-4">
          <button className="min-w-8 min-h-8 flex items-center justify-center bg-foreground-mute hover:bg-foreground active:bg-foreground-accent rounded-full border border-primary" onClick={ () => setCollapsed((collapsed) => !collapsed) }>
            { isCollapsed ? <MdKeyboardArrowRight size={ 24 } className="fill-primary" /> : <MdKeyboardArrowLeft size={ 24 } className="fill-primary" /> }
          </button>
          <hr className="w-full border-1 border-primary ml-2" />
        </div>

        <ul className="sidebar__list">
          {
            sidebarItems.map((item) => (
              <Link key={item.name} href={item.href}>
                <li className="flex items-center w-full h-12 px-[13px] my-4 rounded-xl bg-foreground-mute hover:bg-foreground active:bg-foreground-accent border border-primary">
                  <item.icon size={ 24 } className="fill-primary min-w-[24px]" />
                  { !isCollapsed && <span className="ml-3 font-semibold text-primary">{item.name}</span> }
                </li>
              </Link>
            ))
          }
        </ul>
      </aside>
    </div>
  );
};

export default Sidebar;
