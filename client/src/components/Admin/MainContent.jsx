
import React, { useContext, useRef, useState } from "react";
import Overview from "./Overview";
import Allposts from "./Allposts";
import { fetchPostbysearch } from "../../api";
import RightSidebar from "../RightSidebar";
import { RightSidebarContext } from "../../RightSidebarProvider";

const MainContent = ({ selectedItem }) => {
  const { setCurrentid,toggleSidebarRight } = useContext(RightSidebarContext);

  // let searchtext=useRef();
   const [searchtext,setsearchtext]=useState('')
  const [order,setorder]=useState(-1)
  const [timespan,settimespan]=useState('weekly')
  

 

  // function handle_key_search(e){
  //   if(e.key==='Enter'&&searchtext.current.value!=''){
  //     //search
  //     // searchPost(searchtext.current.value)
  //   }
  // }
  return (
    <div className="w-full">
      {/* Top section with search and sort options */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-4 gap-2">
        <div className="flex gap-2">
          
          {
            (selectedItem === "Overview")&&(<>
          <button className={`px-4 py-2 rounded ${timespan=='weekly'?'bg-blue-500':'bg-gray-300'} text-white`} onClick={()=>{settimespan('weekly')}} disabled={timespan=='weekly'}>Past 7 days</button>
          <button className={`px-4 py-2 rounded ${timespan=='monthly'?'bg-blue-500':'bg-gray-300'} text-white`} onClick={()=>{settimespan('monthly')}} disabled={timespan=='monthly'}>Past 30 days</button></>
          )}
          {
          (selectedItem === "All Uploads"||selectedItem === "Published") &&(<>
          <button className={`px-4 py-2 rounded ${order==-1?'bg-blue-500':'bg-gray-300'}  text-white`} onClick={()=>{setorder(-1)}} disabled={order==-1}>Sort by New</button>
          <button className={`px-4 py-2 rounded ${order==1?'bg-blue-500':'bg-gray-300'} text-white`} onClick={()=>{setorder(1)}} disabled={order==1}>Sort by Old</button>
        <button
          onClick={()=>{toggleSidebarRight(true); setCurrentid('')}}
          className="bg-[#2b2b2b] hover:bg-[#363535] text-white px-4 py-2 rounded"
        >
          Create Post
        </button>
        </>
          )}
        </div>
        {
          (selectedItem === "All Uploads"|| selectedItem === "Published")&&
        <input
        // ref={searchtext}
          type="text"
          placeholder="Search..."
          className="p-2 border border-gray-300 rounded w-[100%] md:w-1/2 mb-2 md:mb-0"
          onChange={(e)=>{setsearchtext(e.target.value)}}
        />
        }
        </div>
           
        <hr/>

      {/* Conditional rendering based on selected item */}
      <div>
        <h2 className="text-lg font-bold mt-4">{selectedItem}</h2>
        <hr/>
        {selectedItem === "Overview" && <Overview timespan={timespan}/>}
        {selectedItem === "All Uploads" &&<Allposts sortOrder={order} searchtext={searchtext} published={false}/>}
        {selectedItem === "Published" && <Allposts sortOrder={order} searchtext={searchtext} published={true}/>}
        {selectedItem === "Settings" && <p className="text-gray-700">Adjust your settings here.</p>}
      </div>
      
    </div>
  );
};

export default MainContent;
