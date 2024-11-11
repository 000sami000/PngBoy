import  { useEffect,useState ,useRef} from "react";
import { useDispatch, useSelector } from "react-redux";
import { RiEditCircleFill } from "react-icons/ri";      
import { useParams } from "react-router-dom";
import { Getuser, Updateuser } from "../../actions/users";
import { MdDone } from "react-icons/md";

import Loader from "../Loader";
import Auth_input from "../Auth/Auth_input";



function Profile() {



  const dispatch = useDispatch();

  
  const [imageUrl,setimageUrl]=useState(null)
  const [File,setFile]=useState(null)

  let InputRef = useRef(null);
  const { user, isLoading } = useSelector((state) => state.user_reducer);
   console.log("user-----",user) 
  //  const Dataobj= {FirstName:user?.name?.split(' ')[0]||'',email:user?.email||'',SecondName:user?.name?.split(' ')[1]||'',profile_img_:user?.profile_img_||''};
  const [Data,setData]= useState(null);

  const [isupdated,setisupdated]=useState(false);
  const [Error,setError]=useState("");
  function editHandler(e,name){
   
    
    setData({...Data,[name]:e.target.value})
   
    }
    useEffect(()=>{
       

        //  dispatch(Getuser(userId))
       setData({FirstName:user?.name?.split(' ')[0]||'',email:user?.email||'',SecondName:user?.name?.split(' ')[1]||'',file:user?.profile_img_||''})
    },[])
  //   function chk_edit (){
  //     if(!Snameedit||!Fnameedit||!Emailedit){
  //       console.log("disabledddd")
  //        setError("Please edit completely")
  //        return true;  
  //     }else{
  //      setError("")
  //    return false;
  //    }
  // }


  const  handleFileChange = (e) => {
 
    setFile(e.target.files[0])
    setimageUrl(URL.createObjectURL(e.target.files[0]))
    setData({...Data,file:e.target.files[0]})
  }; 
  const handleFileClick = () => {
     
    
    if (InputRef.current) {
      InputRef.current.click();
    }
 
};
  function submithandler(){
    console.log("dispatch")
    
    if(Data.FirstName&&Data.SecondName&&Data.email){
      setError("")
      setisupdated(dispatch(Updateuser(Data))) 

    }
    else{
      setError("Some infos are empty")
    }
  }
  const [Fnameedit,setFnameedit]=useState(false)
  const [Snameedit,setSnameedit]=useState(false)
  const [Emailedit,setEmailedit]=useState(false)

  return (
    <>
      {isLoading  ? (
        <div className="m-auto flex justify-center items-center w-full h-[100px]">
          <Loader />
        </div>
      ) : (
        <div className="w-[80%]  bg-[#ffffff58]  bg-opacity-9 backdrop-blur-lg  border border-white/20 shadow-lg p-6 m-auto mt-[5%] rounded-md">
          <div className="text-center text-[2rem] w-full">Profile</div>
 
          <div className=" p-3 flex flex-col gap-2 items-center">
            <div className="relative"> 
          <input type='file' style={{ display: 'none' }}  onChange={handleFileChange} ref={InputRef}/>
          <div onClick={handleFileClick} className='w-[150px] rounded-[50%] h-[150px]  bg-[#b0b0b0]   items-center flex justify-center   cursor-pointer bg-no-repeat bg-center bg-clip bg-cover'  style={{ backgroundImage: `url(${!imageUrl?!Data?.file ? "/profile.jpg" : `${import.meta.env.VITE_backendUrl+Data.file}`:imageUrl})` }}>
  
          {
            !imageUrl&& <span className="bg-slate-500 text-[#ededed] w-[150px] rounded-[50%] h-[150px] flex justify-center items-center  opacity-0 hover:opacity-50">upload image</span>
          }  
         </div>
          
            </div>
            <div className="text-[27px] text-white">{user.name}</div>
          </div>
 <div className=" w-[100%] flex justify-center ">        
   <div className="flex flex-col">
               {
                !Error==""?<div className="text-[red] text-[20px] text-center">{Error}</div>:<div></div>
               }
              {
             Data&& <div className="flex justify-center flex-col text-[#494949]">

               <div className="flex items-center gap-2 " >
                   <Auth_input name={'email'} type={'email'} placeholder={'Your Email'} label={'Email'} value={Data?.email||''} handlechange={(e)=>editHandler(e,'email')} disabled={!Emailedit}/>
                   {
                    !Emailedit?<RiEditCircleFill className="text-[white] text-[20px]  cursor-pointer " onClick={()=>{setEmailedit((prev)=>!prev)}}/>:
                    <MdDone className="text-[white] text-[20px] cursor-pointer "  onClick={()=>{setEmailedit((prev)=>!prev)}} />
                   }
               </div>
               <div className="flex items-center gap-2 " >
                   <Auth_input name={'FirstName'} type={'text'} placeholder={'First Name'} label={'First Name'} value={Data?.FirstName} handlechange={(e)=>editHandler(e,'FirstName')} disabled={!Fnameedit}/>
                 { !Fnameedit? <RiEditCircleFill className="text-[white] text-[20px]  cursor-pointer"  onClick={()=>{setFnameedit((prev)=>!prev)}}/>:
                   <MdDone className="text-[white] text-[20px] cursor-pointer"  onClick={()=>{setFnameedit((prev)=>!prev)}} />}
               </div>
               <div className="flex items-center gap-2" >
                    <Auth_input name={'SecondName'} type={'text'} placeholder={'Second Name'} label={'Second Name'} value={Data?.SecondName} handlechange={(e)=>editHandler(e,'SecondName')} disabled={!Snameedit}/>
                  {
                    !Snameedit?<RiEditCircleFill className="text-[white] text-[20px]  cursor-pointer"  onClick={()=>{setSnameedit((prev)=>!prev)}} />:
                    <MdDone className="text-[white] text-[20px] cursor-pointer"  onClick={()=>{setSnameedit((prev)=>!prev)}} />
                  }  
               </div>
               </div>
              }
           <div className="p-5">
 
               <button className="bg-[#9191915f] hover:bg-[#7d7d7d9f] border  p-1 rounded-md text-[white]"  onClick={submithandler} >Save Changes</button> {
                isLoading?<Loader />:<span>{isupdated&&"Updation process completed"}</span>
               }
           </div>
           </div>
           </div>

        </div>
      )}
    </>
  );
}

export default Profile;
