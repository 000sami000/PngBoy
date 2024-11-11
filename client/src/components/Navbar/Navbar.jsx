import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";
import Searchbar from "../Seachbar/Searchbar";
function useQuery(){//custom hook
  return new URLSearchParams(useLocation().search)
}
function Navbar() {
 
  const navigate = useNavigate();
  const { user, isLoading } = useSelector((state) => state.user_reducer);
  
  const [User, setUser] = useState(JSON.parse(localStorage.getItem("token_")));
  const query=useQuery();
  const [Searchterm,setSearchterm]=useState(query.get('searchQuery')||'');
  
  const dispatch = useDispatch();
  const logout = () => {
    dispatch({ type: "LOGOUT" });
    setUser(null);
    navigate("/");
  };
  useEffect(() => {
    const token = User;
    if (token) {
      let decodedtoken = jwtDecode(token);
      if (decodedtoken.exp * 1000 < new Date().getTime()) {
        logout();
      }
    }
    setUser(JSON.parse(localStorage.getItem("token_")));
  }, [location]);
  // console.log(User?.profile_img_)
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Function to handle mouse enter event
  const handleMouseEnter = () => {
    setIsMenuOpen(true);
  };

  // Function to handle mouse leave event
  const handleMouseLeave = () => {
    setIsMenuOpen(false);
  };
  return (
    <>
      <div className="flex pl-[5%] pr-[5%] py-[15px] gap-8 items-center justify-between  w-full  text-[20px]  bg-[#71717183] text-slate-200">
        <div className="flex items-center gap-5">
          <Link className=" flex gap-5" to="/">
            {/* <img src="/logo.jpg" width={"40px"} className="rounded-[70%]"/> */}
            <div>PngBoy</div>
          </Link>
        </div>
{
       (location.pathname=='/posts'||location.pathname==`/posts/search`)&&    
        <Searchbar dispatch={dispatch} navigate={navigate} Searchterm={Searchterm} setSearchterm={setSearchterm} />
}
        <div>
          {user._id ? (
            <div className="flex gap-8" onMouseLeave={handleMouseLeave} onMouseEnter={handleMouseEnter}>
              {
                location.pathname!=`/user/${user._id}`&&
                <div>
                  <div className="flex gap-2">
                  <div
  style={{
    backgroundImage: `url(${
      user.profile_img_
        ? `${import.meta.env.VITE_backendUrl}${user.profile_img_}`
        : '/profile.jpg'
    })`,
  }}
  className="rounded-[100px] bg-no-repeat bg-center bg-clip bg-cover w-[40px] h-[40px] text-center"
>
</div>
              
                  </div>
                </div>
              }
               
              {
            isMenuOpen&& user&&
          <div className="bg-[#454444cb] py-2 rounded-[10px] shadow-md absolute top-[55px] left-[90%] w-[9%] z-10" >
        
         
           <Link to={`/user/${user._id}`} className="text-[15px] block text-[white] w-full hover:bg-[#ffffff7e] p-1 cursor-pointer  ">Profile</Link>
           {
                 user.isadmin&&
           <Link to={`/user/admin/${user._id}`} className="text-[15px] block text-[white] w-full hover:bg-[#ffffff7e] p-1 cursor-pointer  ">Admin</Link>
           }
              <Link to={`/likedimages/${user._id}`} className="text-[15px] hover:bg-[#ffffff7e] block p-1 cursor-pointer">Liked Images</Link>
              <Link to={`/downloads/${user._id}`} className="text-[15px] hover:bg-[#ffffff7e] block p-1 cursor-pointer">Downloads</Link>
           <div
                className="p-1 w-full text-[15px] hover:bg-[#ffffff7e]  cursor-pointer text-[red] "
                onClick={logout}
              >
                Sign out
              </div>
        </div> 
          }
            </div>
          ) : location.pathname !== "/auth" ? (
            <div>
              <Link to="/auth">
                <button className="bg-[#9191919b] hover:bg-[#7d7d7d9f] rounded-[8px] p-1 text-sm">
                  Sign in
                </button>
              </Link>
            </div>
          ) : (
            <div></div>
          )}
        
        </div>
      </div>
    </>
  );
}

export default Navbar;
