import { createContext, useState } from "react";

export const RightSidebarContext = createContext();

export function RightSidebarProvider({ children }) {
    const [isSidebarOpenRight, setIsSidebarOpenRight] = useState(false);
    const [Currentid, setCurrentid] = useState("");

    const toggleSidebarRight = (isSidebarOpenRIght) => {
      setIsSidebarOpenRight(isSidebarOpenRIght);
    };
 

    return (
        <RightSidebarContext.Provider value={{ isSidebarOpenRight, toggleSidebarRight,Currentid,setCurrentid }}>
          {children}
        </RightSidebarContext.Provider>
      );
    }
