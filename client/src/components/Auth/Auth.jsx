import  { useEffect, useState } from 'react'
import Auth_input from './Auth_input';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from "react-redux";
import { signin,signup } from '../../actions/auth';
function Auth() {
  let initialdata={
    FirstName:"",
    SecondName:"",
    email:"",
    password:"",
    confirmpassword:""
  }
  const navigate=useNavigate();
  const dispatch=useDispatch();
   const [IsSignup,setIsSignup]=useState(false);
    const [Formdata,setFormdata]=useState(initialdata)
   const handlechange=(e)=>{
    setFormdata({...Formdata,[e.target.name]:e.target.value})

   }
  

    useEffect(()=>{
        setFormdata({
          FirstName:"",
          SecondName:"",
          email:"",
          password:"",
          confirmpassword:""
        })
    },[IsSignup])
    const submit_handler=()=>{
        if(IsSignup){
          dispatch(signup(Formdata,navigate))
          
        }
        else{
          dispatch(signin(Formdata,navigate));
        
        }
    }
  return (
    <div className='flex justify-center items-center w-full h-[80vh]'>
    <div className='w-[32%] border bg-[#ffffff55] rounded-lg shadow-lg'>
      
      <div className='w-full h-full  p-4'>
      <div className='w-full  flex justify-center p-1'><img src='auth_img.png' width={'60px'}/></div>
         <div className='w-full flex  '>
        
           <div className=' w-full text-center text-[25px]'>{!IsSignup?"Sign In":"Sign Up"}</div>
         </div>
         <div className='flex flex-col w-full h-[80%]   p-3'>
         
             {
             IsSignup && (
             <div className='self-center flex gap-2 mb-4 '>
              <Auth_input handlechange={handlechange} type={'text'} name={'FirstName'} placeholder={'First Name'} autoFocus label={"First Name"}></Auth_input>
              <Auth_input handlechange={handlechange} type={'text'} name={'SecondName'} placeholder={'Second Name'} autoFocus label={"Second Name"}></Auth_input>
             </div>)
              }
              <div className='flex flex-col gap-2'>
              <Auth_input handlechange={handlechange} type={'email'} name={'email'} placeholder={'Enter your Email'} autoFocus label={"Email"}></Auth_input>
              <Auth_input handlechange={handlechange} type={'password'} name={'password'} placeholder={'Enter the Password'} autoFocus label={"Password"}></Auth_input>
              {IsSignup&&<Auth_input handlechange={handlechange} type={'password'} name={'confirmpassword'} placeholder={'Enter Password again'} autoFocus label={"Confirm Password"}></Auth_input>}
             </div>
              <div>
               {IsSignup?(
                  <span>Have an account ?<b onClick={()=>{setIsSignup(false)}} className='cursor-pointer'>Sign in</b></span> 
               ): <span>Don&apos;t have an account ?<b onClick={()=>{setIsSignup(true)}} className='cursor-pointer'>Sign up</b></span>
               }
              </div>
              <br/>
              <div className='flex justify-center'>

              <button onClick={()=>{ submit_handler();  }} className='bg-[#9191915f] hover:bg-[#7d7d7d9f] border rounded-md py-1 px-2'>{IsSignup?"Sign up":"Sign in"}</button>
              </div>
       
         </div>
      </div>
          
    </div>
    </div>
  )
}

export default Auth