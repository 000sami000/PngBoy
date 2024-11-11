import React, { useState } from "react";


function Auth_input({ name, type, placeholder, autoFocus, label,handlechange ,value ,disabled=false}) {




  return (
    <>
    <div className="inline-block ">
    <label>{label}</label>
    <span className="  w-[100%] flex gap-1 items-center  p-1  bg-[#ffffff] border-red-700 rounded-[7px]">
      <input
        className="  w-[100%] white outline-none p-[2px] pl-2 pr-2 bg-[#ffffff] rounded-[20px] "
        name={name}
        onChange={handlechange}
        required
        autoFocus={autoFocus}
        // type={type!=='password'?type:(ShowPass?'text':'password')}
        type={type}
       value={value}
        placeholder={placeholder}
        disabled={disabled? disabled:false}
      />

   
     
    </span>
    </div>
     </>
  );
}

export default Auth_input;
