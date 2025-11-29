import React from 'react';
import { ViewMode } from '../types';
import { LayoutDashboard, Calendar, List, Settings, LogOut, Zap } from 'lucide-react';

interface SidebarProps {
  currentView: ViewMode;
  onChangeView: (view: ViewMode) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onChangeView }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'list', label: 'Agenda de Serviço', icon: List },
    { id: 'calendar', label: 'Calendário', icon: Calendar },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 bg-slate-900 text-white h-screen fixed left-0 top-0 overflow-y-auto z-50 border-r border-slate-800">
      <div className="p-6 flex items-center gap-3">
        <div className="bg-blue-600 p-2 rounded-lg shadow-lg shadow-blue-900/50">
             <Zap size={20} className="text-white" fill="currentColor"/>
        </div>
        <div>
            <h1 className="text-lg font-bold tracking-tight text-white leading-tight">Suporte<span className="text-blue-500">Prime</span></h1>
            <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Gestão Técnica</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-6 space-y-1">
        <p className="px-4 text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Menu Principal</p>
        {menuItems.map(item => (
          <button
            key={item.id}
            onClick={() => onChangeView(item.id as ViewMode)}
            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 group ${
              currentView === item.id || (currentView === 'edit' && item.id === 'list')
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <item.icon size={18} className={`transition-colors ${currentView === item.id || (currentView === 'edit' && item.id === 'list') ? 'text-white' : 'text-slate-500 group-hover:text-white'}`} />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 w-full transition-colors mb-1">
          <Settings size={18} />
          Configurações
        </button>
        <button className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-400 hover:text-red-300 rounded-lg hover:bg-slate-800 w-full transition-colors">
          <LogOut size={18} />
          Terminar Sessão
        </button>
      </div>
    </aside>
  );
};