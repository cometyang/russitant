"use client";

import { MdOutlineRoundaboutRight, MdKeyboardArrowRight, MdKeyboardArrowLeft } from "react-icons/md";
import { RiQuestionAnswerLine, RiChatSmileLine, RiSettings4Line } from "react-icons/ri";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import logoPic from "../../../public/logo.jpg";

const sidebarItems = [
  {
    name: "Q&A",
    href: "/",
    icon: RiQuestionAnswerLine,
  },
  {
    name: "Chat",
    href: "/chat",
    icon: RiChatSmileLine,
  },
  {
    name: "Dream",
    href: "/dream",
    icon: RiChatSmileLine,
  },
  {
    name: "Flow",
    href: "/flow",
    icon: RiSettings4Line,
  },
  {
    name: "Settings",
    href: "/settings",
    icon: RiSettings4Line,
  },
  {
    name: "About",
    href: "/about",
    icon: MdOutlineRoundaboutRight,
  },
];

const Sidebar = () => {
  const [isCollapsed, setCollapsed] = useState<boolean>(false);

  return (
    <div className="sidebar__wrapper">
      <aside className="sidebar" data-collapse={isCollapsed}>
        <button className="btn" onClick={ () => setCollapsed((collapsed) => !collapsed) }>
          {isCollapsed ? <MdKeyboardArrowRight /> : <MdKeyboardArrowLeft />}
        </button>
        <div className="sidebar__top">
          <Image src={logoPic} width={80} height={80} className="sidebar__logo" alt="logo" />
          <p className="text-black sidebar__logo-name">Russitant</p>
        </div>
        <ul className="sidebar__list">
          {
            sidebarItems.map((item) => (
              <li className="sidebar__item" key={item.name}>
                <Link href={item.href} className="sidebar__link">
                  <span className="sidebar_icon">
                    <item.icon />{" "}
                  </span>
                  <span className="sidebar__name"> {item.name} </span>
                </Link>
              </li>
            ))
          }
        </ul>
      </aside>
    </div>
  );
};

export default Sidebar;
