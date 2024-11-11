import React, { useContext } from 'react'
import { useEffect, useState } from "react"
import { useDispatch } from "react-redux";

import { useNavigate,useLocation } from 'react-router-dom';
import Posts from "../Posts/Posts";

import Pagination from '../Pagination/Pagination';
import RightSidebar from '../RightSidebar';
import { RightSidebarContext } from '../../RightSidebarProvider';


function useQuery(){//custom hook
  return new URLSearchParams(useLocation().search)
}
function Home() {
    // const [Current_id,setCurrent_id]=useState(null);
    const dispatch = useDispatch();

    const query=useQuery();

    const pagenum=query.get('page')||1;
    // const searchQuery =query.get('searchQuery')
    // const tags=query.get('tags');
    const [Searchterm,setSearchterm]=useState(query.get('searchQuery')||'');
    // const [Searchtags,setSearchtags]=useState(query.get('tags')?.split('-')||[]);


  return (
    <>
    <div className="w-[80%] mt-[6%] px-[3%] m-auto">
 
      <Posts   dispatch={dispatch} />
    

    </div>
    
    <div className='w-[100%]  flex justify-center mt-5'>
      
      <div>{
         (!Searchterm)&&( 

      <Pagination dispatch={dispatch} pagenum={pagenum} published={true}/>
        ) 
      }
      
    </div>
    </div>
   
    </>
  )
}

export default Home