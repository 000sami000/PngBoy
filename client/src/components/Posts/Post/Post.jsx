import React, { useContext, useEffect, useState } from "react";
import { AiFillLike ,AiOutlineLike} from "react-icons/ai";
import { MdDelete } from "react-icons/md";
import { RiEditCircleFill } from "react-icons/ri";
import moment from 'moment'
import {useDispatch, useSelector} from 'react-redux'
import { deletedpost,likepost } from "../../../actions/posts";
import { useNavigate } from "react-router-dom";
import { LiaDownloadSolid } from "react-icons/lia";
import { downloadFile } from "../../../../util/filesaver";
import { IoIosHeartEmpty } from "react-icons/io";
import { IoIosHeart } from "react-icons/io";
import { Link, useLocation } from "react-router-dom";
import { create_download, deletePosts } from "../../../api";
import { RightSidebarContext } from "../../../RightSidebarProvider";
import RightSidebar from "../../RightSidebar";
import toast from "react-hot-toast";
function Post({ post }) {
 
  const { setCurrentid, Currentid,toggleSidebarRight,isSidebarOpenRight } = useContext(RightSidebarContext);
  const { createdAt, title, file } =post;

    const user=useSelector((state)=>state.user_reducer.user)
   const navigate=useNavigate();
   const dispatch=useDispatch()
   function Like(){
       
        if(post.likes?.length>0){
          return (<span>{post?.likes.find((like)=>(like===user?._id))?(<span className="text-[20px] "><IoIosHeart/> </span>):(<span className="text-[20px]"><IoIosHeartEmpty/></span>)}</span> 
        )
        }
     
        return <><span><IoIosHeartEmpty/></span></>
   }
   const addToDownload=async (id)=>{
       try{
      const {data}= await create_download(id);
      console.log(data,"KLKLKL")
        console.log(data,"download data")
        toast.success("Added to Download List ")
      }catch(err){
        console.log("addTodownload ---err",err)
        toast.error("Error while Adding to Download List ")
       }
   }
  return (
<>
  {post && (
    <div
      onClick={() => { navigate(`/post/${post?._id}`); }}
      className="pt-1 transition-transform duration-300 bg-cover bg-[#fcd2d2] rounded-md hover:scale-105 shadow-md  w-[360px] h-[320px] relative"
    >
      {/* Image - Absolute positioned to fill the container */}
      <img
        className="absolute top-0 left-0 w-full h-full object-cover rounded-md"
        src={`${import.meta.env.VITE_backendUrl + post?.file}`}
        alt="Post image"
        loading="lazy"
      />

      {/* Content inside the container */}
      <div className="flex flex-col justify-between h-full relative z-10">
        <div className="flex justify-between px-2 rounded-t-md">
          <div className="flex gap-3 justify-center">
            {user?.isadmin && user?._id === post.creator && (
              <button onClick={(e) => { e.stopPropagation(); setCurrentid(post._id); toggleSidebarRight(true) }}>
                <div className="text-[23px] text-white">
                  <RiEditCircleFill />
                </div>
              </button>
            )}
            {user?.isadmin && user?._id === post.creator && (
              <button
                onClick={(e) => { e.stopPropagation(); dispatch(deletedpost(post._id)); }}
                disabled={!user}
                className="rounded-sm"
              >
                <div>
                  <MdDelete className="text-[22px] text-[#ffffff] cursor-pointer rounded-md hover:bg-[#ffffff81]" />
                </div>
              </button>
            )}
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); if (!user?._id) { alert("Login to Like"); } else { dispatch(likepost(post._id)); Like(); } }}
            disabled={location.pathname===`/user/admin/${user?._id}`}
          >
            <div className="flex items-center text-[20px] text-[#ffffff] hover:bg-[#ffffff51] rounded-sm px-1 py-0">
              <Like />&nbsp;{post?.likes?.length}
            </div>
          </button>
        </div>
        <div className="flex justify-between items-center pb-1">
          <div className="text-[20px] text-white font-bold px-2">{title}</div>
          <div
            className="hover:bg-[#ffffff6b] mr-1 rounded-md cursor-pointer"
            onClick={(e) => { e.stopPropagation(); addToDownload(post._id); }}
          >
            <LiaDownloadSolid className="text-[25px] text-[#ffffff]" />
          </div>
        </div>
      </div>
    </div>
  )}
 <RightSidebar isSidebarOpenRIght={isSidebarOpenRight} toggleSidebarRight={toggleSidebarRight} setCurrentid={setCurrentid}  Currentid={Currentid}/>
</>
  );
}

export default Post;
