import React from 'react';
import { User, Organization, PlanType } from '../types';
import { Bell, User as UserIcon, Settings, LogOut, Shield } from 'lucide-react';

interface TopNavbarProps {
  user: User;
  organization: Organization;
  onLogout: () => void;
  onOpenSettings: () => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({ user, organization, onLogout, onOpenSettings }) => {
  return (
    <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-4 md:px-8 shrink-0 shadow-sm z-20 relative">
      <div className="flex items-center gap-4">
        {/* Logo or Brand for Mobile if needed, but usually strictly Organization Name */}
        <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700 tracking-tight text-lg">{organization.name}</span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                organization.plan === PlanType.FREE ? 'bg-slate-100 text-slate-500' :
                organization.plan === PlanType.PRO ? 'bg-blue-100 text-blue-700' :
                'bg-purple-100 text-purple-700'
            }`}>
                {organization.plan}
            </span>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-4 border-r border-slate-200 pr-6">
             <button className="relative text-slate-400 hover:text-blue-600 transition-colors">
                <Bell size={20} />
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
             </button>
        </div>

        <div className="flex items-center gap-3 group relative cursor-pointer">
            <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-800">{user.name}</p>
                <p className="text-xs text-slate-500 flex items-center justify-end gap-1">
                    {user.role}
                    {user.role === 'Gestor' && <Shield size={10} className="text-blue-500"/>}
                </p>
            </div>
            <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center text-white font-bold text-sm shadow-lg border border-slate-200">
              {user.name.charAt(0)}
            </div>

            {/* Dropdown Menu */}
            <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-slate-100 py-2 hidden group-hover:block z-50">
                <button 
                    onClick={onOpenSettings}
                    className="w-full text-left px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-blue-600 flex items-center gap-2"
                >
                    <Settings size={16} /> Configurações
                </button>
                <div className="border-t border-slate-100 my-1"></div>
                <button 
                    onClick={onLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                >
                    <LogOut size={16} /> Sair
                </button>
            </div>
        </div>
      </div>
    </header>
  );
};