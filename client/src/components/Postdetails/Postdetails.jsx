import moment from "moment";
import React, { useEffect, useState } from "react";
import {
  useParams,
  useNavigate,
  
  useLocation,
} from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getsinglepost, getpostsbysearch } from "../../actions/posts";
import Loader from "../Loader";

// import CommentSection from "./CommentSection";
import Post from "../Posts/Post/Post";
import { create_download } from "../../api";
import toast from "react-hot-toast";

function Postdetails() {

  const dispatch = useDispatch();
 
  let { id } = useParams();

  const { posts, post, isLoading } = useSelector(
    (state) => state.posts_reducer
  );
  const addToDownload=async (id)=>{
    try{
   const {data}= await create_download(id);
   console.log(data,"KLKLKL")
     console.log(data,"download data")
     toast.success("Added to Downloads Section")
 }catch(err){
          console.log("addTodownload ---err",err)
    }
}
  useEffect(() => {
    if (id) {
      dispatch(getsinglepost(id));
    }
    console.log("dispatach use efftect");
  }, [id]);
  useEffect(() => {
    if (post) {
      dispatch(getpostsbysearch({ Searchcategory: post.category.join("-") }));
    }
  }, [post]);

  const recommended_post = posts?.filter((itm) => itm._id !== post?._id);
  return (
    <>
      {isLoading ? (
        <div className="flex justify-center items-center">
          <Loader />
        </div>
      ) : (
        <div>
          <div className=" border   shadow-md rounded-[10px] w-[40%]  m-auto mt-5 flex flex-col">
          <div className=" bg-[#ffb8b8] w-[100%] max-[1189px]:w-[100%] flex rounded-t-md justify-center">
              <img
                className=" w-[70%] max-[1189px]:w-[100%] rounded-tr-[10px] rounded-br-[10px] self-end max-[1189px]:rounded-tl-[10px] max-[1189px]:rounded-tr-[10px] max-[1189px]:rounded-br-[0px]"
                src={`${import.meta.env.VITE_backendUrl+post?.file}`}
              />
            </div>
            <div className="  flex flex-col gap-4 w-[100%] py-3 rounded-b-md">
              <div className="flex flex-col  px-5 rounded-t-[10px] ">
                {/* <div className="p-2 flex items-center justify-between">
                 
                  <div className="flex gap-2">
                    <div className="bg-blue-400 rounded-[50px] h-[35px] w-[35px] max-[800px]:h-[30px] max-[800px]:w-[30px] bg-no-repeat bg-center bg-clip bg-cover" style={{backgroundImage:`url(${import.meta.env.VITE_backendUrl+post?.creator_img})`}}></div>
                    <div className="flex flex-col ">
                      <span className="text-[13px] text-white max-[800px]:text-[12px]">
                        {post?.name}
                      </span>
                      <span className="text-[11px] text-white max-[800px]:text-[8px]">
                        {moment(post?.createdAt).fromNow()}
                      </span>
                    </div>
                  </div>
                </div> */}
              <div className="flex  w-full h-full   justify-between items-center ">
                <div className="text-[35px] text-black font-bold ">
                  {post?.title}
                </div>
              
               <button className=" border rounded-md p-2"  onClick={(e) => { e.stopPropagation(); addToDownload(post?._id); }}>Download</button>

               </div>

                
                  <div className="text-[13px] w-full flex gap-2 flex-wrap">
                    {post?.category.map((itm,i) => {
                      return <span className="bg-[#393939] text-[16px] p-1 rounded-md text-[white]" key={i}>{itm}</span>;
                    })}
                  </div>
                  <div className="text-[#000000] text-[20px] w-full break-words">
                    {post?.text}  </div>
                
              </div>
           
            </div>
           
          </div>
          {/* <div className="bg-[#b38585] w-[80%] h-[260px] m-auto mt-4 rounded-[10px] p-3">
            <CommentSection post={post} />
          </div> */}
          <br />
          <br />
          <div className="text-[35px] w-[80%] m-auto text-slate-500">
            Similar Images
          </div>
          <div className="grid  sm:grid-cols-2 md:grid-cols-3  gap-2.5   m-auto w-[80%]  p-4">
          {recommended_post.length ? (
            recommended_post?.map((itm) => {
              return (
                 <div key={itm._id}><Post   post={itm}   dispatch={dispatch}/> </div>
              );
            })
          ) : (
            <div className="w-full text-[30px] text-slate-300 mt-10">
              No post Found
            </div>
          )}

        </div>
        </div>
      )}
    </>
  );
}

export default Postdetails;
