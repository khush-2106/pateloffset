import React from 'react';
import { LayoutDashboard, Users, FileText, Settings, PieChart } from 'lucide-react';

interface SidebarProps {
  currentView: string;
  setView: (view: string) => void;
}

export default function Sidebar({ currentView, setView }: SidebarProps) {
  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard },
    { name: 'Orders', icon: FileText },
    { name: 'Clients', icon: Users },
    { name: 'Analytics', icon: PieChart },
    { name: 'Settings', icon: Settings },
  ];

  return (
    <div className="w-64 bg-white h-screen shadow-lg">
      <div className="p-4">
        <h1 className="text-2xl font-bold text-gray-800">PrintTrack</h1>
      </div>
      <nav className="mt-8">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.name}
              onClick={() => setView(item.name.toLowerCase())}
              className={`w-full flex items-center px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors ${
                currentView === item.name.toLowerCase()
                  ? 'bg-blue-50 text-blue-600'
                  : ''
              }`}
            >
              <Icon className="w-5 h-5 mr-3" />
              <span className="font-medium">{item.name}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}