import React, { useEffect, useState } from "react";
import { FaChevronLeft } from "react-icons/fa";
import { FaChevronRight } from "react-icons/fa";
import { Parser } from "html-to-react";
import { useNavigate,Link } from "react-router-dom";
import { getposts } from "../../actions/posts";
import { useSelector } from "react-redux";
function Pagination({dispatch,pagenum,id,published }) {
 const {numberofPages,currentPage,startIndex}=useSelector((state)=>state.posts_reducer)
//  console.log("number of pages check ",numberofPages)
 const [Pages, setPages] = useState(null)
//  if(numberofPages){  

//    setPages(Array.from({ length:numberofPages<5?numberofPages:5}, (_, index) => index + 1))
//  }

//  currentPage:1
// numberofPages:1
 let navigate=useNavigate();
   const handlePageChange = (page,move) => {
     
     // setCurrentPage(page);
     
     if(move==='next'&&currentPage<numberofPages){
      // console.log("numberof pages",numberofPages)
       if(Pages[Pages.length-1]<Number(numberofPages)){
       
         setPages(Pages.map((itm)=>itm+1))

       }
    }
    else if(move==='prev'&&currentPage>1){
      if(Pages[0]>1){
        console.log("prevyy")

        setPages(Pages.map((itm)=>itm-1))
      }
    }
    dispatch(getposts(page,id,-1,published))
  };

  useEffect(() => {
    // console.log("useeffect")
  if(pagenum)
    
    // console.log('/////',numberofPages)
    // console.log('/////',pagenum)
     if(!Pages && numberofPages)
    setPages(Array.from({ length:numberofPages<5?numberofPages:5}, (_, index) => index + 1))
      console.log(id,">>>>>>><<<<<")
      console.log(published,">>>>>>><<<<<")
     dispatch(getposts(pagenum,id,-1,published));
  }, [dispatch,pagenum,numberofPages]);






  return  !Pages||numberofPages==1 ? "":(
    
    <div className="w-[100%] flex gap-1 ">
    <div>
    <Link className={`${currentPage===1? 'text-[#939393] ':"text-[#2d2d2d]"} flex p-2 rounded-md`} to={!id?`/posts?page=${currentPage>1?currentPage-1:currentPage}`:`/usergallery/${id}?page=${currentPage>1?currentPage-1:currentPage}`}>
    <button
    
      onClick={() => handlePageChange(currentPage - 1,'prev')}
      disabled={currentPage === 1}
    >
      <FaChevronLeft  className="text-[25px]"/>
    </button>
    </Link>
    </div>
    {Pages.map((page) => (

      <Link key={page} to={!id?`/posts?page=${page}`:`/usergallery/${id}?page=${page}`}><button 
      className={` px-2 ${currentPage === page?'bg-[#2d2d2d]':'bg-[#cccccc]'}   text-blue-50 rounded-sm text-[28px]`}
        key={page}
        onClick={() => handlePageChange(page)}
        disabled={currentPage === page}
      >
        {page}
      </button></Link>
    ))
    }
    <div>
    <Link   className={`${currentPage===numberofPages? 'text-[#939393] ':"text-[#2d2d2d]"} text-blue-50 flex p-2 rounded-md`}  to={!id?`/posts?page=${currentPage<numberofPages?currentPage+1:currentPage}`:`/usergallery/${id}?page=${currentPage<numberofPages?currentPage+1:currentPage}`} >
    <button
 
      onClick={() => handlePageChange(currentPage + 1,'next')}
      disabled={currentPage === numberofPages}
    >
     <FaChevronRight className="text-[25px]"/>
    </button>
    </Link>
    </div>
  </div>
  );
}

export default Pagination;
