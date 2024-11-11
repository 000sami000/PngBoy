// components/PostCreationSidebar.js
import React from "react";
import { AiOutlineClose } from "react-icons/ai"; // Close icon
import Form from "./Form";

const RightSidebar = ({ isSidebarOpenRIght, toggleSidebarRight,Currentid,setCurrentid }) => {

  
  return (
    <div
      className={`fixed top-0 w-[27%] right-0 h-full  bg-white shadow-lg transform ${
        isSidebarOpenRIght ? "translate-x-0" : "translate-x-full"
      } transition-transform duration-300 ease-in-out z-50 overflow-y-auto`}
    >
      {/* Close Icon */}
      <div className="flex justify-end p-4">
        <button onClick={()=>{
          toggleSidebarRight(false);
           setCurrentid("")
          }}>
          <AiOutlineClose className="text-gray-600 text-2xl" />
        </button>
      </div>

      {/* Post Creation Form */}
      <div className="p-4">
   
     <Form Currentid={Currentid} setCurrentid={setCurrentid}/>
      </div>
    </div>
  );
};

export default RightSidebar;



