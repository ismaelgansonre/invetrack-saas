"use client";

import React, { useState, useEffect } from "react";
import Header from "@/components/MainPageComponents/Header";
import Sidebar from "@/components/MainPageComponents/Sidebar";
import Footer from "@/components/MainPageComponents/Footer";
import LogoutModal from "@/components/Modals/LogoutModal";

/**
 * PageLayout Component
 *
 * A layout wrapper that provides consistent structure for application pages.
 * Includes responsive header, sidebar navigation, and footer.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - The content to be rendered inside the layout
 */
const PageLayout = ({ children }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setSidebarOpen(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={closeSidebar}
        isMobile={isMobile}
      />

      {/* Main content area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <Header toggleSidebar={toggleSidebar} isMobile={isMobile} />

        {/* Main content */}
        <main className="flex-1 overflow-auto p-4">
          {children}
        </main>

        {/* Footer */}
        <Footer />
      </div>

      {/* Logout Modal */}
      <LogoutModal />
    </div>
  );
};

export default PageLayout; 