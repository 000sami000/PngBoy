import axios from "axios";

const API=axios.create({baseURL:"http://localhost:5000"})

API.interceptors.request.use((req)=>{
    if(localStorage.getItem('token_')){
        req.headers.Authorization=`Bearer ${JSON.parse(localStorage.getItem('token_'))}`
    }
    return req;
})
export const fetchPosts=(pagenum,id,sortby=-1,published)=>{
  console.log(published,"LLLKKKJHGrtYUI")
    if(id){
        
        return API.get(`/posts?page=${pagenum}&user_id=${id}&sort=${sortby}`);
    }
    if(published){

      return API.get(`/posts?page=${pagenum}&sort=${sortby}&published=${published}`);
    }
    return API.get(`/posts?page=${pagenum}&sort=${sortby}`);
}
export const createPosts=(post_obj)=>{
    return API.post('/posts',post_obj,{headers: {
        'Content-Type': 'multipart/form-data'
      }});
}
export const bulkUpload=(post_obj)=>{
    return API.post('/posts/bulkupload',post_obj,{headers: {
        'Content-Type': 'multipart/form-data'
      }});
}
export const csvUpload=(csvobj)=>{
    return API.post('/posts/csvupload',csvobj,{headers: {
        'Content-Type': 'multipart/form-data'
      }});
}
export const updatePosts=(post_obj,id)=>{
    return API.patch(`/posts/${id}`,post_obj,{headers: {
        'Content-Type': 'multipart/form-data'
      }});
}
export const deletePosts=(id)=>{
    return API.delete(`/posts/${id}`);
}
export const likePosts=(id)=>{
    return API.patch(`/posts/${id}/likepost`)
}
export const signin=(formdata)=>{
   return API.post('/users/signin',formdata)
}
export const signup=(formdata)=>{
    return API.post('/users/signup',formdata)
 }
 export const fetchPostbysearch=(searchQuery,published)=>{
  console.log(searchQuery)
  if(published){
    
    return API.get(`/posts/search?searchQuery=${searchQuery.Searchterm || 'none'}&category=${searchQuery.Searchcategory|| null}&published=${published}`)
  }
  return API.get(`/posts/search?searchQuery=${searchQuery.Searchterm || 'none'}&category=${searchQuery.Searchcategory|| null}`)
 }
 export const  fetchsinglepost=(id)=>{
    return API.get(`/posts/${id}`)
 }
 export const create_comment=(comment,post_id)=>{
    // console.log(post_id,"++++",comment)
    return API.post(`/posts/${post_id}/comment`,{comment})
 }

 export const getuser=()=>{
   return API.get(`/users`)
}
 export const getusergallery=()=>{
   return API.get(`/users/usergallery`)
}
 export const create_download=(post_id)=>{
   return API.post(`/users/adddownload`,{id:post_id})
 }
 export const get_download=()=>{
   return API.get(`/users/download`)
 }
 export const get_downloadbulk=()=>{
   return API.get(`/users/downloadbulk`, {
     responseType: 'blob', })
    }
export const delete_download=(post_id)=>{
  return API.delete(`/users/download${post_id}`)
  }
    
export const updateuser=(Data)=>{
      
  return API.patch(`/users`,Data,{headers: {
  'Content-Type': 'multipart/form-data'
  }})}
      
export const downloadsinglefile=(filepath,id)=>{
   return API.get(`${'/users/singledownload?q='+`${filepath.split('/')[2]}`+'&'+`p_id=${id}` }`, {
   responseType: 'blob',  
    })}
        

 //admin api endpoints   
export const getTopPostsSevenDays=()=>{
   return API.get(`/users/getTopPostsSevenDays`) }

export const getTopPostsThirtyDays=()=>{
   return API.get(`/users/getTopPostsThirtyDays`) }