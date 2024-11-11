import "./App.css";
import Auth from "./components/Auth/Auth";
import Home from "./components/Home/Home";
import Navbar from "./components/Navbar/Navbar";

import { BrowserRouter, Route, Routes,Navigate} from "react-router-dom";
import Postdetails from "./components/Postdetails/Postdetails";
import { useDispatch, useSelector} from "react-redux";
import Profile from "./components/User_profile/Profile";
import { useEffect, useState } from "react";
import { Getuser } from "./actions/users";
import  { Toaster } from 'react-hot-toast';
import Gallery from "./components/UserGallery/Gallery";
import BulkDownloadsSection from "./components/Bulkdownloads/BulkDownloadsSection";
import Admin_main from "./components/Admin/Admin_main";
import { RightSidebarProvider } from "./RightSidebarProvider";


function App() {
  // let userlocalstorage =JSON.parse(localStorage.getItem('token_'))
   const dispatch=useDispatch();
    useEffect(()=>{
    dispatch(Getuser())     
    },[])
      const user=useSelector((state)=>state.user_reducer.user);

      
  return (
      <BrowserRouter>
        <Navbar />
        <RightSidebarProvider>
        <Routes>
        <Route path='/'  exact Component={()=> <Navigate to="/posts"/> }/>
          <Route path="/posts" exact Component={()=><Home />}/>
          <Route path="/user/:userId" exact Component={Profile}/>
          <Route path="/user/admin/:userId" exact Component={()=>!user._id?<Auth/>:user.isadmin?<Admin_main  />:<Navigate to={'/posts'}/>}/>
          <Route path="/posts/search" exact Component={()=><Home/>}/>
          <Route path="/post/:id" exact Component={Postdetails}/>
          <Route path="/auth" exact Component={()=>{return !user._id?<Auth/>:<Navigate to={'/posts'}/>}} />
          <Route path="/likedimages/:id" exact Component={()=>{return !user._id?<Auth/>:<Gallery/>}} />
          <Route path="/downloads/:id" exact Component={()=>{return !user._id?<Auth/>:<BulkDownloadsSection/>}} />
        </Routes>
          </RightSidebarProvider>
  <Toaster/>
       
      </BrowserRouter>
    
  );
}

export default App;
