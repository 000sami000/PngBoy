import Post_actiontype from "../constants/actiontypes.js";
import * as api from "../api/index.js";
import toast from "react-hot-toast";
// import { fetchPosts,createPosts } from "../api/index.js";
//Action creators
export  const getposts = (pagenum,id,sortby,published=false) => {
 return  async (dispatch) => {

    try{
        dispatch({type:Post_actiontype.START_LOADING})
        const {data}=await api.fetchPosts(pagenum,id,sortby,published) ;
        // console.log("data::",data)
        let action ={type:Post_actiontype.FETCH_ALL,payload:data};
        dispatch(action);
        dispatch({type:Post_actiontype.END_LOADING})
    }catch(err){
    console.log("action-->getposts err:",err)
    }
  };
};
export const getsinglepost=(id)=>{
return async (dispatch)=>{
  try{
    dispatch({type:Post_actiontype.START_LOADING})
    const {data}=await api.fetchsinglepost(id);
  let action ={type :'SINGLE_POST',payload:data};
  dispatch(action);
  dispatch({type:Post_actiontype.END_LOADING})
  }catch(err){
    console.log("action-->getsinglepost err:",err)
  }
}
}
export const getpostsbysearch=(searchQuery,published)=>{
  return async (dispatch)=>{

    try{
      dispatch({type:Post_actiontype.START_LOADING})
        const {data}=await api.fetchPostbysearch(searchQuery,published)
  
        let action={type:'SEARCH_RESULT',payload:data}
        // console.log("?????",data)
        dispatch(action);
        dispatch({type:Post_actiontype.END_LOADING})
    }catch(err){
      console.log("action-->getpostsbysearch err:",err)
    }
  }
}
export const createpost=(post)=>{
  return async (dispatch)=>{

    try{
      dispatch({type:Post_actiontype.START_LOADING})
    const {data}=await api.createPosts(post);
    console.log("DATA",data)
    let action={type:"CREATE",payload:data};
    dispatch(action)
    dispatch({type:Post_actiontype.END_LOADING})
    }catch(err){
      console.log("action-->create err:",err)
    }
  }

}
export const updatepost=(post,id)=>{
  return async (dispatch)=>{
    try{
      const {data}=await api.updatePosts(post,id);
      let action={type:"UPDATE",payload:data}
      dispatch(action)
      toast.success('Post Updated Successfully')
    }
    catch(err){
      toast.error('Error while updating post')
      console.log("action-->updata err:",err)
    }
  }
}
export const deletedpost=(id)=>{
  return async (dispatch)=>{
    try{
       console.log("kjkjskhjfsdf")
      const {data}=await api.deletePosts(id);
      let action={type:"DELETE",payload:data}
      dispatch(action) 
      toast.success('Post Deleted Successfully')
    }catch(err){
      toast.error('Error while deleting post')
      console.log("action-->delete err:",err)
    }
  }
}
export const likepost=(id)=>{
  return async (dispatch)=>{
    try{
      const {data}= await api.likePosts(id)
      let action={type:"LIKE",payload:data};
      dispatch(action);
     
    }catch(err){
      toast.error('Error while liking post')
      console.log("action-->likepost err:",err)
    }
  }
}
export const post_comments=(comment,post_id)=>{
   return async (dispatch)=>{
    try{
      const {data}= await api.create_comment(comment,post_id);
        dispatch({type:"COMMENT",payload:data});
      //  console.log(data)
      return data.comment;
    }catch(err){
      console.log("action-->post_comments err:",err)
    }
   }

}