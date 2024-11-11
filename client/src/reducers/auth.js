const auth_reducer=(state={auth_data:null},action)=>{

  console.log("auth reducer -action---",action);
  
  switch (action.type) {
    case "SIGNUP":
         localStorage.setItem('token_',JSON.stringify(action?.payload.token_))
         console.log('state--SIGNUP',state)
         return {...state,auth_data:action.payload.user_}
    case "SIGNIN":
        localStorage.setItem('token_',JSON.stringify(action?.payload.token_))
        console.log('state--SIGNIN',state)
        return {...state,auth_data:action.payload.user_}
    case "LOGOUT":
        localStorage.setItem('token_',null)
     console.log('state--LOGOUT',state)
     return {...state,auth_data:null}
    default:
        return state
        
  }

}
export default auth_reducer;