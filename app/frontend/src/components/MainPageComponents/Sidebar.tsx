// components/MainPageComponents/Sidebar.jsx
"use client";

/**
 * Sidebar Component
 *
 * A responsive sidebar navigation component that adapts between desktop and mobile views.
 * Implements Next.js Link component for optimized client-side navigation without full page reloads.
 *
 * Features:
 * - Responsive design with mobile drawer functionality
 * - Client-side navigation using Next.js Link
 * - Dynamic route highlighting
 * - Smooth transitions and animations
 * - Integrated logout functionality
 */

import Link from "next/link";
import React, { memo } from "react";
import { usePathname } from "next/navigation";
import classNames from "classnames";
import { useAuth } from "@/context/AuthContext";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isMobile: boolean;
}

// Simple SVG Icons
const HomeIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

const PackageIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
  </svg>
);

const UsersIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
  </svg>
);

const ShoppingCartIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
  </svg>
);

const BarChartIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const LogoutIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
);

const BuildingIcon = () => (
  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

const navItems = [
  { label: "Dashboard", path: "/dashboard", icon: HomeIcon },
  { label: "Inventory", path: "/inventory", icon: PackageIcon },
  { label: "Suppliers", path: "/suppliers", icon: UsersIcon },
  { label: "Orders", path: "/orders", icon: ShoppingCartIcon },
  { label: "Reports", path: "/reports", icon: BarChartIcon },
];

const Sidebar: React.FC<SidebarProps> = memo(({ isOpen, onClose, isMobile }) => {
  const { toggleLogoutModal } = useAuth();
  const pathname = usePathname();

  const mainSidebarContent = (
    <>
      {isMobile && (
        <div className="flex items-center h-20 px-6 border-b">
          <BuildingIcon />
          <span className="text-xl font-semibold text-blue-600">
            InvenTrack
          </span>
        </div>
      )}

      {/* Navigation items using Next.js Link for client-side navigation */}
      <nav className="flex-grow py-6 overflow-y-auto">
        {navItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <Link
              key={item.path}
              href={item.path}
              className={classNames(
                "flex items-center px-8 py-4 text-gray-700 hover:bg-gray-100 transition-colors",
                { "bg-gray-100": pathname === item.path }
              )}
              onClick={isMobile ? onClose : undefined}
            >
              <IconComponent />
              <span className="font-medium text-m ml-3">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );

  const logoutButton = (
    <button
      onClick={() => {
        toggleLogoutModal();
        if (isMobile) onClose();
      }}
      className="flex items-center w-full px-8 py-4 font-medium text-gray-700 transition-colors text-m hover:bg-gray-100"
    >
      <LogoutIcon />
      <span className="ml-3">Logout</span>
    </button>
  );

  return (
    <>
      {!isMobile && (
        <aside className="flex flex-col w-64 bg-white shadow-md">
          {mainSidebarContent}
          {logoutButton}
        </aside>
      )}

      {isMobile && (
        <div
          className={`fixed inset-0 bg-gray-600 bg-opacity-75 z-40 transition-opacity duration-300 ${
            isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          onClick={onClose}
        >
          <aside
            className={`fixed top-0 left-0 w-64 h-full bg-white shadow-md transform transition-transform duration-300 ease-in-out flex flex-col ${
              isOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <div className="flex-grow overflow-y-auto">
              {mainSidebarContent}
            </div>
            {logoutButton}
          </aside>
        </div>
      )}
    </>
  );
});

Sidebar.displayName = "Sidebar";

export default Sidebar;
