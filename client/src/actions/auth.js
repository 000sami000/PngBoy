import * as api from "../api/index";

export  const signup = (formdata,navigate) => {
    return  async (dispatch) => {
   
       try{
  //  console.log("signup action///")
   
           // console.log("data::",data)
           let {data}=await api.signup(formdata)
          let action ={type:"SIGNUP",payload:data};
          dispatch(action);
          navigate('/');
       }catch(err){
       console.log("action-->signup err:",err)
       }
     };
   };
   export  const signin =(formdata,navigate) => {
    return  async (dispatch) => {
   
       try{
        let {data}=await api.signin(formdata)
           console.log("data::",data)
          let action ={type:"SIGNIN",payload:data};
          dispatch(action);
          navigate('/');
       }catch(err){
       console.log("action-->signin err:",err)
       }
     };
   };