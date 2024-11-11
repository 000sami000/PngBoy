// components/Dashboard.js
import React, { useState } from "react";
import Sidebar from "./Sidebar";
import MainContent from "./MainContent";
import { FiMenu } from "react-icons/fi"; // Burger icon

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState("Overview");

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
 

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:relative md:translate-x-0 transition-transform duration-300 ease-in-out z-50`}
      >
        <Sidebar
          selectedItem={selectedItem}
          setSelectedItem={setSelectedItem}
          toggleSidebar={toggleSidebar} // Pass the toggle function
        />
      </div>

  

      {/* Main content area */}
      <div className="flex-1 flex flex-col w-full md:ml-1/4 bg-gray-100 p-4 overflow-auto">
        {/* Toggle button for mobile (Burger Icon) */}
        {!isSidebarOpen && (
          <button
            onClick={toggleSidebar}
            className="md:hidden mb-4 p-2 text-2xl text-blue-500"
          >
            <FiMenu /> {/* Burger icon */}
          </button>
        )}
        
        {/* Render MainContent with the selected item */}
        <MainContent selectedItem={selectedItem}  />
      </div>
    </div>
  );
};

export default Dashboard;
