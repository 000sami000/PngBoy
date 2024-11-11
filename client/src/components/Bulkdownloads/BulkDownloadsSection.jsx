
import { useSelector } from 'react-redux'
import { delete_download, downloadsinglefile, get_download, get_downloadbulk } from '../../api';
import { useEffect, useState } from 'react';
import { IoCloseCircle } from "react-icons/io5";
import { MdDownloadForOffline } from "react-icons/md";
function BulkDownloadsSection() {

    const user=useSelector((state)=>state.user_reducer.user);
    const [Downloads,setDownload]=useState(null);
    const [Loading,setLoading]=useState(null);
   
    const fetch_downloads=async ()=>{
       try{
        setLoading(true);
        const {data}=await get_download()
        console.log(data,"LKLLKLK<")
        setDownload(data)
    }catch(err){
        console.log("fetch downloads ----err",err)
    } finally{

        setLoading(false);
    }
    
    }
    const remove_downloads=async (id)=>{
       try{
        setLoading(true);
        const {data}=await delete_download(id)
        console.log(data,"LKLLKLK<")
        setDownload(data)
    }catch(err){
        console.log("fetch downloads ----err",err)
    } finally{

        setLoading(false);
    }
    
    }
     


const handleBulkDownload = async () => {
    try {
        // Send GET request to the server to initiate the bulk download
        const response = await get_downloadbulk();

        // Create a URL for the blob data
        const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/zip' }));

        // Create an anchor element and trigger a download
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'downloaded_posts.zip'); // Filename for download
        document.body.appendChild(link);
        link.click();

        // Clean up
        link.remove();
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error("Error during bulk download:", error);
        alert("Failed to download files. Please try again.");
    }
};
async function downloadFile(fileName,id) {
       try{

        
       const {data}= await downloadsinglefile(fileName,id)
        // Create a new Blob object using the response data from axios
        const url = window.URL.createObjectURL(new Blob([data]));
        const link = document.createElement('a');
        link.href = url;

        // Set the file name for download
        link.setAttribute('download', fileName);
        
        // Append the link to the body temporarily
        document.body.appendChild(link);
        
        // Programmatically click the link to trigger download
        link.click();
        
        // Clean up and remove the link
        link.parentNode.removeChild(link);
    }catch(err){
     console.log("single download error ----",err)   
    }
    
}
useEffect(()=>{
     fetch_downloads();
  
    },[])

    console.log(user)
  return (
    <div className='bg-[#ffffff] w-[50%] mt-5 m-auto py-2 rounded-md'>

      {
        Downloads?.length>0?
      <div  className='flex justify-end  p-2'>
     <button className='bg-[gray] rounded-md p-1 shadow-sm text-white' onClick={()=>handleBulkDownload()}>Download all</button>
     </div>
      : (<div className='text-center '> No Post Found in  Downloads List</div>)
      }
    {
        Downloads?.map((itm)=>{

            return(
                 <div key={itm._id} className='border-[1px] w-[100%] hover:shadow-md m-2 pr-2 rounded-md'>
                <div className='flex  justify-between '>
                <div className='flex '>
               
                <img
        className=" w-[100px] object-cover rounded-md border"
        src={`${import.meta.env.VITE_backendUrl + itm?.file}`}
        alt="Post image"
      />
                
                     <div  className=' flex flex-col '>
                      <div className='px-2 text-[20px] font-bold'> {itm.title}</div>
                      <div className='px-2 text-[18px]'> {itm.text}</div>
                        
                        </div>
                        </div>
                        <div className='self-center flex '>

                    <IoCloseCircle className='text-[30px] self-center text-[gray] cursor-pointer hover:text-[#cf4444]'  onClick={()=>remove_downloads(itm._id)}/>
                    <MdDownloadForOffline className='text-[30px] self-center text-[gray] cursor-pointer hover:text-[#465bff]'  onClick={()=>{downloadFile(itm.file,itm._id)}} />

                        </div>
                    </div>

               </div>
               ) 
        })
    }
    
   
    
    
    
    </div>
  )
}

export default BulkDownloadsSection