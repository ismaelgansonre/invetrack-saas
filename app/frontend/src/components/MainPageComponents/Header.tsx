"use client";

import React, { useState } from "react";
import { IconButton, Badge } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountMenu from "@/components/AccountSettings/AccountMenu";
import { useProfile } from "@/hooks/useProfile";
import { Building2 } from "lucide-react";

/**
 * Header Component
 *
 * The Header component serves as the top navigation bar for the application.
 * It includes the application logo, search bar, notification icons, and user account settings.
 */

interface HeaderProps {
  toggleSidebar: () => void;
  isMobile: boolean;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar, isMobile }) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showSearch, setShowSearch] = useState<boolean>(false);
  const { profile } = useProfile();
  const storeName = profile?.full_name || "My Store";

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Searching for:", searchTerm);
    setShowSearch(false);
  };

  const renderLogo = () => (
    <div className="flex items-center ">
      <Building2 className={`${isMobile ? 'w-12 h-12' : 'w-8 h-8'} mr-2 text-blue-600`} />
      {!isMobile && (
        <span className="text-xl font-semibold text-blue-600">InvenTrack</span>
      )}
    </div>
  );

  const renderSearchBar = () => (
    <div className="relative flex-grow max-w-xl mr-2">
      <input
        type="text"
        placeholder="Search"
        value={searchTerm}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
        className="w-full px-3 py-1 text-sm bg-gray-100 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        onClick={handleSearch}
        className="absolute top-0 right-0 mt-1 mr-2"
      >
        <SearchIcon className="w-5 h-5 text-gray-400" />
      </button>
    </div>
  );

  const renderMobileSearch = () => (
    <>
      <IconButton color="inherit" onClick={() => setShowSearch(!showSearch)}>
        <SearchIcon />
      </IconButton>
      {showSearch && (
        <div className="absolute left-0 right-0 p-2 bg-white top-full">
          <form onSubmit={handleSearch} className="flex">
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
              className="flex-grow px-3 py-1 text-sm bg-gray-100 border border-gray-300 rounded-l-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="px-3 py-1 text-white bg-blue-500 rounded-r-full"
            >
              <SearchIcon className="w-5 h-5" />
            </button>
          </form>
        </div>
      )}
    </>
  );

  const renderRightSection = () => (
    <div className="flex items-center">
      <IconButton color="inherit" className="mr-4">
        <Badge badgeContent={3} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>
      <div
        className={`font-semibold text-gray-900 whitespace-nowrap ${
          isMobile ? "text-sm" : "text-base"
        }`}
      >
        {storeName}
      </div>
      <AccountMenu />
    </div>
  );

  return (
    <header className="sticky top-0 z-40 h-20 bg-white border-b shadow-sm">
      <div className="flex items-center justify-between h-full px-4">
        {isMobile && (
          <button
            onClick={toggleSidebar}
            className="mr-2 text-gray-500 hover:text-gray-800"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              ></path>
            </svg>
          </button>
        )}

        {renderLogo()}
        {!isMobile && renderSearchBar()}
        {isMobile && renderMobileSearch()}
        {renderRightSection()}
      </div>
    </header>
  );
};

Header.displayName = "Header";

export default Header; 