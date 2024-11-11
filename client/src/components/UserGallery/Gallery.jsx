import React, { useContext } from 'react'
import { useEffect, useState } from "react"
import { useDispatch ,useSelector} from "react-redux";

import { useNavigate,useLocation, useParams } from 'react-router-dom';
import Posts from "../Posts/Posts";


import RightSidebar from '../RightSidebar';
import { RightSidebarContext } from '../../RightSidebarProvider';
import ReactPaginate from 'react-paginate';
import { BsArrowRightSquareFill, BsFillArrowLeftSquareFill } from 'react-icons/bs';
import { fetchPosts } from '../../api';
import Loader from '../Loader';
import Post from '../Posts/Post/Post';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';


function Gallery() {
  const { setCurrentid, Currentid,toggleSidebarRight,isSidebarOpenRight } = useContext(RightSidebarContext);
   const {id}=useParams()
    const dispatch = useDispatch();
    const user=useSelector((state)=>state.user_reducer.user);
    const [posts, setposts] = useState(null);
    const [isLoading, setisLoading] = useState(false);
    const [selected, setselected] = useState(1);
    // const [Searchterm,setSearchterm]=useState(query.get('searchQuery')||'');
    async function fetchpost(selected) {
      try {
        setisLoading(true);
        const { data } = await fetchPosts(selected, id,-1,true );
            console.log(data,">>>>.")
        setposts(data);
      } catch (err) {
        console.log("Posts fetching err ---", err);
      } finally {
        setisLoading(false);
      }
    }
    const handlePageClick = (e) => {
      setselected(e.selected + 1);
    };
    useEffect(() => {
      fetchpost(selected,id);
    }, [selected]);
if(!user){
    return (
        <>
            Unauthorized access
        </>
    )
}
  return (
    <>
    <div className=" m-auto mt-5 text-center text-[1.6rem]">
           Liked Post
    </div>
    <br/>
    <div className=' m-auto w-[95%]  grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4  gap-5  '>
    {isLoading?  <Loader/>:
       posts?.data?.map((itm)=>{
            
           return <div key={itm._id}><Post   post={itm}   /> 
           </div>
          
        })
       }
 
    </div>
    
    <div className="w-full flex items-center justify-center text-[25px] text-[#787878] my-8 ">
        {posts?.numberofPages &&(
          <ReactPaginate
            breakLabel="..."
            nextLabel={
              <FaChevronRight className="text-[25px]"/>
                 }
            onPageChange={handlePageClick}
            pageRangeDisplayed={5}
            pageCount={posts?.numberofPages}
            previousLabel={
               
              <FaChevronLeft  className="text-[25px]"/> }
            className="flex gap-4  mx-5 items-center px-1 py-0 "
            pageClassName="bg-[white] px-4 py-0 rounded-md"
            activeClassName="text-[black] bg-[red] text-[30px]"
            nextClassName=""
            previousClassName=""
          />
        )}
      </div>
    <RightSidebar isSidebarOpenRight={isSidebarOpenRight} toggleSidebarRight={toggleSidebarRight} />

    </>
  )
}

export default Gallery