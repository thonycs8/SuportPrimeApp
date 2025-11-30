
import React from 'react';
import { ViewMode, PlanType, Organization, UserRole } from '../types';
import { LayoutDashboard, Calendar, List, Zap, ShieldAlert } from 'lucide-react';

interface SidebarProps {
  currentView: ViewMode;
  onChangeView: (view: ViewMode) => void;
  organization: Organization;
  userRole?: UserRole;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onChangeView, organization, userRole }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'list', label: 'Agenda de Serviço', icon: List },
    // Only show Calendar if Plan is NOT Free
    ...(organization.plan !== PlanType.FREE ? [{ id: 'calendar', label: 'Calendário', icon: Calendar }] : []),
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
        
        {/* Admin Link */}
        {userRole === UserRole.SUPER_ADMIN && (
            <button
            onClick={() => onChangeView('admin-panel')}
            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-lg transition-all duration-200 mb-4 ${
              currentView === 'admin-panel'
                ? 'bg-red-900/50 text-red-200 border border-red-800/50'
                : 'text-red-400 hover:bg-slate-800'
            }`}
          >
            <ShieldAlert size={18} />
            Super Admin
          </button>
        )}

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
             {item.id === 'calendar' && organization.plan === PlanType.FREE && (
                <span className="ml-auto text-[10px] bg-slate-700 px-1.5 py-0.5 rounded text-slate-300">PRO</span>
             )}
          </button>
        ))}
      </nav>

      {organization.plan === PlanType.FREE && (
          <div className="p-4 mx-4 mb-4 bg-slate-800 rounded-xl border border-slate-700">
            <p className="text-xs text-slate-300 mb-2">Você está no plano <span className="text-white font-bold">Free</span></p>
            <div className="w-full bg-slate-700 h-1.5 rounded-full mb-1">
                <div className="bg-amber-500 h-1.5 rounded-full w-full"></div>
            </div>
            <p className="text-[10px] text-slate-500">1/1 utilizadores</p>
          </div>
      )}
    </aside>
  );
};
