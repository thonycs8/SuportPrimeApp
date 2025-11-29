import React from 'react';
import { ViewMode } from '../types';
import { LayoutDashboard, Calendar, List, Settings, LogOut } from 'lucide-react';

interface SidebarProps {
  currentView: ViewMode;
  onChangeView: (view: ViewMode) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onChangeView }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'calendar', label: 'Calendário', icon: Calendar },
    { id: 'list', label: 'Agenda', icon: List },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 bg-slate-900 text-white h-screen fixed left-0 top-0 overflow-y-auto z-50">
      <div className="p-6">
        <h1 className="text-2xl font-bold tracking-tight text-blue-400">Suporte Prime</h1>
        <p className="text-xs text-slate-400 mt-1">Gestão de Serviços Técnicos</p>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-2">
        {menuItems.map(item => (
          <button
            key={item.id}
            onClick={() => onChangeView(item.id as ViewMode)}
            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
              currentView === item.id || (currentView === 'edit' && item.id === 'list')
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <item.icon size={20} />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 w-full transition-colors">
          <Settings size={20} />
          Definições
        </button>
        <button className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-400 hover:text-red-300 rounded-lg hover:bg-slate-800 w-full transition-colors mt-1">
          <LogOut size={20} />
          Sair
        </button>
      </div>
    </aside>
  );
};
