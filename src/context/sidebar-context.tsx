'use client';

import {ReactNode, createContext, useState} from "react"

const initialValue = { 
    isCollapsed: false, 
    toggleSidebarcollapseHandler:()=> {},
};
export const SidebarContext = createContext(initialValue);

interface Props {
    children: ReactNode | ReactNode[];
}



const SidebarProvider = ({children}: Props) => {
    const [ isCollapsed, setCollapse ] = useState<boolean>(false);

    const toggleSidebarcollapseHandler = () => {
        setCollapse((prevState) => !prevState);
    };

    return <SidebarContext.Provider value={{isCollapsed, toggleSidebarcollapseHandler}}>
        {children}
    </SidebarContext.Provider>
}

export default SidebarProvider;