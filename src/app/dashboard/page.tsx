"use client"

import { createClient } from "@/utils/supabase/client";
import { useState } from "react";
import {
  HiPhotograph,
  HiKey,
  HiCog,
  HiChartBar,
  HiFolder,
  HiUser,
  HiLogout,
  HiBell,
} from "react-icons/hi";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("images");

  // Navigation items array
  const navigationItems = [
    { id: "images", name: "Images", icon: HiPhotograph },
    { id: "folders", name: "Folders", icon: HiFolder },
    { id: "analytics", name: "Analytics", icon: HiChartBar },
    { id: "api-keys", name: "API Keys", icon: HiKey },
    { id: "settings", name: "Settings", icon: HiCog },
    { id: "profile", name: "Profile", icon: HiUser },
  ];

  const logOutUser = async () => {
    const supabase = createClient()
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error(error)
    }
  }

  const renderContent = () => {
    switch (activeTab) {
      case "images":
        return (
          <div className="text-center py-20">
            <HiPhotograph className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Images Component
            </h3>
            <p className="text-gray-500">Your images will be displayed here</p>
          </div>
        );
      case "folders":
        return (
          <div className="text-center py-20">
            <HiFolder className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Folders Component
            </h3>
            <p className="text-gray-500">Your folders will be displayed here</p>
          </div>
        );
      case "analytics":
        return (
          <div className="text-center py-20">
            <HiChartBar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Analytics Component
            </h3>
            <p className="text-gray-500">
              Your usage analytics will be displayed here
            </p>
          </div>
        );
      case "api-keys":
        return (
          <div className="text-center py-20">
            <HiKey className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              API Keys Component
            </h3>
            <p className="text-gray-500">Your API keys will be managed here</p>
          </div>
        );
      case "settings":
        return (
          <div className="text-center py-20">
            <HiCog className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Settings Component
            </h3>
            <p className="text-gray-500">
              Your account settings will be displayed here
            </p>
          </div>
        );
      case "profile":
        return (
          <div className="text-center py-20">
            <HiUser className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Profile Component
            </h3>
            <p className="text-gray-500">
              Your profile information will be displayed here
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-sm border-r border-gray-200 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">ImageVault</h1>
          <p className="text-sm text-gray-500 mt-1">Dashboard</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6">
          <ul className="space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center px-3 py-2 rounded-lg text-left transition-colors ${
                      activeTab === item.id
                        ? "bg-blue-50 text-blue-700 border border-blue-200"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    {item.name}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">JD</span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">John Doe</p>
              <p className="text-xs text-gray-500">john@example.com</p>
            </div>
          </div>
          <button onClick={logOutUser} className="flex items-center text-gray-700 hover:text-gray-900 transition-colors cursor-pointer">
            <HiLogout className="w-4 h-4 mr-2" />
            <span className="text-sm">Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 capitalize">
                {navigationItems.find((item) => item.id === activeTab)?.name}
              </h2>
              <p className="text-gray-600 mt-1">
                Manage your{" "}
                {navigationItems
                  .find((item) => item.id === activeTab)
                  ?.name.toLowerCase()}{" "}
                and settings
              </p>
            </div>

            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <HiBell className="w-6 h-6" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* Upload Button */}
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Upload Image
              </button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 h-full">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}
