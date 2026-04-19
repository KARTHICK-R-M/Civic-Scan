import React from "react";
import { NavLink } from "react-router-dom";
import {
  HomeIcon,
  CameraIcon,
  UserIcon,
  StarIcon,
  ChartBarIcon,
} from "@heroicons/react/outline";

// Icon can be changed to your own logo if you have one
const SidebarLogo = () => (
  <div className="w-11 h-11 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-8 mx-auto mt-6">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="#aec0da" strokeWidth="2" fill="#f8fafc" />
      <circle cx="12" cy="12" r="6" stroke="#417ffa" strokeWidth="2" fill="#f7faff" />
    </svg>
  </div>
);

const links = [
  { to: "/", label: "Dashboard", icon: <HomeIcon className="h-5 w-5" /> },
  { to: "/report", label: "Report Billboard", icon: <CameraIcon className="h-5 w-5" /> },
  { to: "/civic", label: "Civic Score", icon: <ChartBarIcon className="h-5 w-5" /> },
  { to: "/profile", label: "Profile", icon: <UserIcon className="h-5 w-5" /> },
  { to: "/premium", label: "Premium", icon: <StarIcon className="h-5 w-5" /> },
];

export default function Sidebar() {
  return (
    <aside
      className="bg-[#f7f8fa] min-h-screen w-64 flex flex-col border-r border-[#e7eaf0] shadow-none"
      style={{
        boxShadow: "0 0 24px 0 #e1e4ee4d",
      }}
    >
      <SidebarLogo />
      <div className="mb-6 text-lg font-semibold text-gray-500 text-center select-none tracking-wide">
        CivicScan
      </div>
      <nav className="flex flex-col gap-1 mt-4 px-4">
        {links.map(link => (
          <NavLink
            to={link.to}
            key={link.label}
            className={({ isActive }) =>
              "flex items-center gap-3 px-5 py-2.5 rounded-xl transition group " +
              (isActive
                ? "bg-white shadow-sm text-primary font-bold"
                : "text-gray-500 hover:bg-[#ecf1fc] hover:text-primary")
            }
            style={({ isActive }) =>
              isActive
                ? {
                    color: "#417ffa",
                    boxShadow:
                      "0px 4px 20px 0px rgba(119,142,227,0.06)",
                  }
                : undefined
            }
            end={link.to === "/"}
          >
            <span
              className={
                "transition " +
                (window.location.pathname === link.to
                  ? "text-[#417ffa]"
                  : "text-gray-400 group-hover:text-[#417ffa]")
              }
            >
              {link.icon}
            </span>
            <span className="text-base tracking-wide">{link.label}</span>
          </NavLink>
        ))}
      </nav>
      {/* Optional: Add footer links/components here */}
    </aside>
  );
}
