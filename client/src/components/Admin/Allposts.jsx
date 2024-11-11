import React, { useContext, useEffect, useState } from "react";
import Post from "../Posts/Post/Post";
import Loader from "../Loader";

import { fetchPostbysearch, fetchPosts } from "../../api";
import ReactPaginate from "react-paginate";
import {
  BsArrowRightSquareFill,
  BsFillArrowLeftSquareFill,
} from "react-icons/bs";
import RightSidebar from "../RightSidebar";
import { RightSidebarContext } from "../../RightSidebarProvider";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
function Allposts({ setCurrent_id, dispatch, sortOrder, searchtext ,published}) {
  const { setCurrentid, Currentid,toggleSidebarRight,isSidebarOpenRight } = useContext(RightSidebarContext);

  const [posts, setposts] = useState(null);
  const [isLoading, setisLoading] = useState(false);
  const [Searchdata, setSearchdata] = useState(null);
  // const [isLoading,setisLoading]=useState(false);
  const [selected, setselected] = useState(1);
  async function searchPost() {
    try {
      setisLoading(true);
      const { data } = await fetchPostbysearch({ Searchterm: searchtext },published);
      console.log(data, "lkjlklkj");
      setSearchdata(data)
    } catch (err) {
      console.log("searchPost err ----", err);
    } finally {
      setisLoading(false);
    }
  }
  async function fetchpost(selected) {
    try {
      setisLoading(true);
      const { data } = await fetchPosts(selected, null, sortOrder,published);
      //  console.log(data,"lllll")
      setposts(data);
    } catch (err) {
      console.log("Posts fetching err ---", err);
    } finally {
      setisLoading(false);
    }
  }
  useEffect(() => {
    fetchpost(selected);
  }, [selected, sortOrder]);

  const handlePageClick = (e) => {
    setselected(e.selected + 1);
  };
  useEffect(() => {
    if(searchtext!=''){

      searchPost();
    }else{
      setSearchdata(null)
      fetchpost(selected);
    }
  }, [searchtext]);

  if (!posts && !posts?.data?.length && !isLoading) {
    return "No POST";
  }
  return (
    <>
      {
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4  gap-5 w-[100%]">
          {isLoading ? (
            <Loader />
          ) : (
          Searchdata==null?
            posts.data?.map((itm) => {
              return (
                <div key={itm._id}>
                  <Post
                    post={itm}
                    setCurrent_id={setCurrent_id}
                    dispatch={dispatch}
                  />
                </div>
              );
            }):   Searchdata.length>0&& Searchdata?.map((itm) => {
              return (
                <div key={itm._id}>
                  <Post
                    post={itm}
                    setCurrent_id={setCurrent_id}
                    dispatch={dispatch}
                  />
                </div>
              );
            })
          )
          
          }
          {
            Searchdata?.length===0&&Searchdata!==null &&<div>
              No post Found
            </div>
          }
        </div>
      }
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
            activeClassName="text-[black] text-[30px]"
            nextClassName=""
            previousClassName=""
          />
        )}
      </div>
      <RightSidebar isSidebarOpenRight={isSidebarOpenRight} toggleSidebarRight={toggleSidebarRight} />
    </>
  );
}

export default Allposts;
