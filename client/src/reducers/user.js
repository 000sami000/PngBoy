const user_reducer=(state={isLoading:true,user:{}},action)=>{
   
  switch(action.type){
       case "START_LOADING":
        return {...state,isLoading:true}
        case "END_LOADING":
        return {...state,isLoading:false}
      case "GET_USER":
          return  {...state,user:action.payload}
          case "UPDATE_USER":
            return  {...state,user:action.payload}
     default :
          return state
  }

}


export default user_reducer;