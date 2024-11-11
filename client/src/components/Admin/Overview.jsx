import React, { useContext, useEffect, useState } from 'react'
import { getTopPostsSevenDays, getTopPostsThirtyDays } from '../../api'
import Loader from '../Loader';
import Post from '../Posts/Post/Post';
import RightSidebar from '../RightSidebar';
import { RightSidebarContext } from '../../RightSidebarProvider';

function Overview({timespan}) {
  const { setCurrentid, Currentid,toggleSidebarRight,isSidebarOpenRight } = useContext(RightSidebarContext);

 const [analytics,setanalytics]=useState(null);
 const [isLoading,setisLoading]=useState(false);

  async function Records(){
    try{
      setisLoading(true);
      if(timespan=='weekly'){

        const {data}=await getTopPostsSevenDays()
        console.log(data,"lljlkj")
        setanalytics(data);
      }else{
        const {data}=await getTopPostsThirtyDays()
        console.log(data,"lljlkj")
        setanalytics(data);
     
      } 

    }catch(err){
      console.log('prevSevenDaysRecords -- err',err)
    }finally{
      setisLoading(false);
    }
  }
  
  useEffect(()=>{
   Records()
  },[timespan])
  return (
    <>
    {
isLoading?<Loader/>:
     
    <div className='pl-2 pt-2'>
    
    <div className='flex  gap-[2%]  '>

     <div className='bg-[#1c1c1c] text-[white] p-2 rounded-md  min-w-[15%] flex justify-between'>
      <div><div>Total Downloads</div><div className='flex gap-2'><span>{timespan==='weekly'?'Last Week':'Last Month'} :  </span><span className=' text-center'> {timespan==='weekly'?analytics?.totaldownloadedPostsWeek?.length:analytics?.totaldownloadedPostsMonth?.length}</span></div></div>
      {/* <div><div className='text-white'>{Records?.mostDownloadedPostsWeek?.length}</div><div>878</div></div> */}
     </div>
     <div className='bg-[#1c1c1c] text-[white] p-2 rounded-md  min-w-[15%] flex justify-between'>
     <div><div>Total Liked </div><div className='flex gap-2'><span>{timespan==='weekly'?'Last Week':'Last Month'} :  </span><span className=' text-center'> {timespan==='weekly'?analytics?.totallikedPostsWeek?.length:analytics?.totallikedPostsMonth?.length}</span></div></div>

     </div>
     <div className='bg-[#1c1c1c] text-[white] p-2 rounded-md  min-w-[15%] flex justify-between'>
     <div><div>Total Uploads </div><div className='flex gap-2'><span>{timespan==='weekly'?'Last Week':'Last Month'} :  </span><span className=' text-center'>{timespan==='weekly'?analytics?.uploadedPostsWeek?.length:analytics?.uploadedPostsMonth?.length} </span></div></div>

     </div>
   
    </div>
    <br/>
    <div >
    <div>
    <h2 className='text-[1.7rem] m-1'>{timespan==='weekly'?"Top Downloaded Posts in last 7 days":"Top Downloaded Posts in last 30 days"}</h2>
    <div>
    {
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4  gap-5 w-[100%]'>
       
       {
        timespan==='weekly'?
        analytics?.mostDownloadedPostsWeek?.map((itm)=>{
            
           return <div key={itm._id}><Post   post={itm} /> 
           </div>
          
        }):analytics?.mostDownloadedPostsMonth?.map((itm)=>{
            
            return <div key={itm._id}><Post   post={itm} /> 
            </div>
           
         })
       }
       {
        timespan==='weekly'?
        analytics?.mostDownloadedPostsWeek?.length===0&&<div className='text-[15px] ml-1'>
          No Post Downloaded this week
        </div>:analytics?.mostDownloadedPostsMonth?.length===0&&<div className='text-[15px] ml-1'>
          No Post Downloaded this Month
        </div>
       }
       </div>
      }
    </div>
    </div>
    <div>
    <h2 className='text-[1.7rem] m-1'>{timespan==="weekly"?"Top Liked Posts in last 7 days":"Top Liked Posts this Month"}</h2>
    <div>
    {
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4  gap-5 w-[100%] ml-1'>
       
       {
        timespan==='weekly'?
        analytics?.mostLikedPostsWeek?.map((itm)=>{
            
           return <div key={itm._id}><Post   post={itm} /> 
           </div>
          
        }):  analytics?.mostLikedPostsMonth?.map((itm)=>{
            
            return <div key={itm._id}><Post   post={itm} /> 
            </div>
           
         })
       }
       {
        timespan==='weekly'?
        analytics?.mostLikedPostsWeek?.length===0&&<div className='text-[15px]'>
          No Post Liked this week
        </div>:analytics?.mostLikedPostsMonth?.length===0&&<div className='text-[15px]'>
          No Post Liked this Month
        </div>
       }
       </div>
      }
    </div>
    </div>
    </div>
    

    </div>
  }
  <RightSidebar isSidebarOpenRight={isSidebarOpenRight} toggleSidebarRight={toggleSidebarRight} />
    </>
  )
}

export default Overview