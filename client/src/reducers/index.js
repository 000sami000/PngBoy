import { combineReducers } from "redux";
import posts_reducer from './post'
import auth_reducer from "./auth";
import user_reducer from "./user";
export default combineReducers({
    posts_reducer:posts_reducer,
    auth_reducer:auth_reducer,
    user_reducer
})