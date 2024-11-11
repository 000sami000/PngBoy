import React, { useState,useRef } from "react";
import { post_comments } from "../../actions/posts";
import { useDispatch } from "react-redux";
function CommentSection({ post }) {
  const dispatch=useDispatch();
  const [Comments, setComments] = useState(post?.comment);
  const [Commentstr,setCommentstr]=useState('');

  const commentRef=useRef();
  let user =JSON.parse(localStorage.getItem('profile_'))
  const submit_handler =async()=>{
    if(Commentstr===''){
      return;
    }
    if(user){
      console.log(user);
      let comment=`${user.user_.name} : ${Commentstr}`;
      let new_comment=await dispatch(post_comments(comment,post._id))
      setComments(new_comment);
      setCommentstr('');
      // commentRef.current.scrollIntoView({behavior:'smooth'})
    }
    else{
      alert("Login to Comment")
    }
  }
  return (
    <div className="w-full ">
      <div className="text-center rounded-md bg-slate-600">Comment Section</div>
      <br></br>
      <div className="flex w-full justify-between gap-2 ">
        <div className="w-[50%] h-[180px] overflow-y-scroll  rounded-md  bg-zinc-700"><div className="text-center ">{Comments?.length?"Comments ("+Comments?.length+")":""}</div>
         <div className="p-2 flex flex-col gap-1 ">
            {
              Comments?.length?  Comments.map((itm,i)=><div key={i} className="bg-[#2058dc] p-1 text-[13px] text-white rounded-[10px]  w-full break-words shadow-md"><strong>{itm.split(' : ')[0]} : </strong><span>{itm.split(' : ')[1]}</span></div>):<div className="text-center">No Comments</div>
            }
         </div>
            {/* <div ref={commentRef}>ccc</div> */}
        </div>
        <div className="w-[50%] flex flex-col gap-2 justify-between">
          <textarea
            className="rounded-md resize-none p-2"
            placeholder="write a Comment"
            onChange={(e)=>{setCommentstr(e.target.value)}}
            rows={5}
            
          ></textarea>
          <button className="bg-[#2e45d9] text-[white] rounded-md" onClick={submit_handler}>Comment</button>
        </div>
      </div>
    </div>
  );
}

export default CommentSection;
