import * as api from "../api/index.js";
export  const Getuser= () => {
    return  async (dispatch) => {
   
       try{
           dispatch({type:"START_LOADING"})
           const {data}=await api.getuser() ;
           // console.log("data::",data)
           let action ={type:"GET_USER",payload:data};
           dispatch(action);
           dispatch({type:"END_LOADING"})
       }catch(err){
       console.log("action-->getposts err:",err)
       }
     };
   };

   export  const Updateuser= (Data) => {
    return  async (dispatch) => {
   
       try{
           dispatch({type:"START_LOADING"})
           const {data}=await api.updateuser(Data) ;
           console.log("data::",data)
           let action ={type:"UPDATE_USER",payload:data};
           dispatch(action);
           dispatch({type:"END_LOADING"})
           return true;
       }catch(err){
       console.log("action-->getposts err:",err)
        return false;
      }
     };
   };