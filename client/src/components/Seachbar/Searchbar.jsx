import  { useEffect, useState } from "react";
import { TiDelete } from "react-icons/ti";
import { getposts, getpostsbysearch } from "../../actions/posts";
import { FiSearch } from "react-icons/fi";
function Searchbar({dispatch, Searchterm, setSearchterm ,navigate}) {
 

  function searchPost(){
   if(Searchterm.trim()){

    dispatch(getpostsbysearch({Searchterm},true))
    navigate(`/posts/search?searchQuery=${Searchterm || 'none'}`)
  }

  }
 useEffect(()=>{
  if(!Searchterm){
    dispatch(getposts(1))
  }
 },[Searchterm] )
  function handle_key_search(e){
    if(e.key==='Enter'){
      //search
      searchPost()
    }
  }
  return (
    <div className="p-2 rounded-[5px] flex  gap-2  w-[50%]">
      <input
        className="px-2 py-1 outline-none rounded-md  bg-[#202020] text-[white] w-[100%]"
        placeholder="Enter title for searching"
        onChange={(e)=>{ setSearchterm(e.target.value);}}
        value={Searchterm}
        onKeyDown={handle_key_search}
      />
      {/* {
        <div className="bg-slate-100 w-full rounded-[5px] flex flex-wrap">
           {   
            Searchtags?.map((itm ,index) => (
            <span
              key={itm+index}
              className="p-1 rounded-[5px]    bg-gray-500 text-stone-100 mx-1 my-1 flex items-center"
            >
              {itm}
              <div className="ml-1" onClick={()=>{remove(itm)}} >
              <TiDelete  className="text-slice-400" />
              </div>
            </span>
          ))}
          <input
            className="px-2  outline-none   rounded-tl-[3px] rounded-bl-[3px]  bg-slate-100 "
            id="targetinput"
            onKeyDown={handleKeyDown}
            onChange={handler}
            style={inputStyle}
            
          />
        </div>
      } */}

       <button  onClick={()=>{searchPost()}} className=" bg-[#202020]  px-1 p-[2px] text-[0.8em] rounded-md">
       <FiSearch className="text-[25px] " />
      </button> 
      
    </div>
  );
}

export default Searchbar;
