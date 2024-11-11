import Post_actiontype from "../constants/actiontypes"
const reducer =(state={isLoading:true,posts:[]},action)=>{
 console.log("post reducer -action---",action);
    // console.log(Post_actiontype.DELETE)
    switch(action.type){
        case Post_actiontype.START_LOADING:
            return {...state,isLoading:true}
            case Post_actiontype.END_LOADING:
            return {...state,isLoading:false}

        case Post_actiontype.DELETE:
            console.log('state--delete',state)
             return {...state,posts:state.posts.filter((itm)=>itm._id !== action.payload._id)} 

        case Post_actiontype.UPDATE:
            case Post_actiontype.LIKE:
            console.log('state--update/LIKE',state)
            // return state.posts.map((itm)=> (itm._id===action.payload._id?action.payload:itm));
            return {...state,posts:state.posts.map((itm)=> (itm._id===action.payload._id?action.payload:itm))};
            
        case Post_actiontype.FETCH_ALL:
            console.log("state--fetch",state)
            // console.log("action.payload00",action.payload)
            // return action.payload;
            return {
             ...state,
                posts:action.payload.data,
                currentPage:action.payload.currentPage,
                numberofPages:action.payload.numberofPages,
                startIndex:action.payload.startIndex
            }
    
        case "CREATE":
            console.log("state--create",...state.posts,"--",action.payload)
            return{ ...state,posts:[...action.payload,...state.posts]}
        case "SINGLE_POST":
             console.log("state--singlepost",...state.posts,"--",action.payload)
              return {...state,post:action.payload.post}
        case "SEARCH_RESULT":
                // console.log("state--search",state)
                // return action.payload; 
                 return {
                    ...state,
                    posts:action.payload
                 } 
        case "COMMENT":
             return {
                ...state,posts:state.posts.map((itm)=>{ 
                    if(itm._id===action.payload._id){
                        return action.payload
                    }
                        return itm
                    })
             }            
        default :
        return state
        // break;        
    }
}
export default reducer;