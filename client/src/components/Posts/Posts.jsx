import React from 'react'
import Post from './Post/Post'
import Loader from '../Loader'
import { useSelector } from 'react-redux'


function Posts() {
  const data=useSelector((state)=>{return state.posts_reducer})
   const {posts,isLoading}=data;
  // console.log("-----posts",posts)
  // const {all_post}=posts

  // console.log("---->>>",all_post)
if(!posts.length && !isLoading){
   return 'No POST'
}
  return (
    <>
      {
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-5 w-[100%]'>
       
       {

     isLoading?  <Loader/>:
       posts?.map((itm)=>{
            
           return <div key={itm._id}><Post   post={itm}   /> 
           </div>
          
        })
       }
       </div>
      }
   
       
        </>
  )
}

export default Posts