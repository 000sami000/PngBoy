// components/Sidebar.js
import React from "react";
import { AiOutlineClose } from "react-icons/ai"; // Close icon

const Sidebar = ({ selectedItem, setSelectedItem, toggleSidebar }) => {
  const menuItems = ["Overview", "All Uploads", "Published", "Stats"];

  return (
    <div className="w-64 bg-[#131313] text-white h-full p-4 relative">
      {/* Close icon for mobile */}
      <div className="flex justify-end md:hidden p-2">
        <button onClick={toggleSidebar}>
          <AiOutlineClose className="text-white text-2xl" /> {/* Close icon */}
        </button>
      </div>

      <h2 className="text-xl font-bold mb-4">Admin Dashboard</h2>
      <ul>
        {menuItems.map((item) => (
          <li
            key={item}
            onClick={() => setSelectedItem(item)}
            className={`py-2 px-4 cursor-pointer rounded ${
              selectedItem === item ? "bg-[#515151]" : "hover:bg-gray-700"
            }`}
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
