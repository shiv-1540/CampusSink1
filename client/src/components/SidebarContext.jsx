import { createContext,useContext,useState } from "react";

const sidebarContext=createContext();

export const sidebarProvider=({children})=>{
    const [isOpen,setIsOpen]=useState(false);

    const toggleSidebar=()=>{
        setIsOpen(prev=>!prev);
    }
    const closeSidebar=()=> setIsOpen(false);

    return (
        <sidebarContext.Provider value={{isOpen,toggleSidebar,closeSidebar}}>
          {children}
        </sidebarContext.Provider>
    )
}
export const useSidebar=()=> useContext(sidebarContext);