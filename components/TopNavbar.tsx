
import React, { useState, useRef, useEffect } from 'react';
import { User, Organization, PlanType, UserRole } from '../types';
import { Bell, User as UserIcon, Settings, LogOut, Shield, EyeOff, Grid, LayoutDashboard, Calendar, List, MessageSquare } from 'lucide-react';

interface TopNavbarProps {
  user: User;
  organization: Organization;
  onLogout: () => void;
  onOpenSettings: () => void;
  isImpersonating?: boolean;
  onExitImpersonation?: () => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({ 
  user, organization, onLogout, onOpenSettings, isImpersonating, onExitImpersonation 
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative">
      {/* Impersonation Banner */}
      {isImpersonating && (
          <div className="bg-amber-500 text-white text-xs font-bold text-center py-1 flex items-center justify-center gap-2">
              <EyeOff size={14} /> MODO DE SUPERVISÃO ATIVO: Você está a visualizar o ambiente de {organization.name}.
              <button onClick={onExitImpersonation} className="ml-2 bg-white text-amber-600 px-2 py-0.5 rounded uppercase hover:bg-amber-50">Sair</button>
          </div>
      )}

      <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-4 md:px-8 shrink-0 shadow-sm z-20 relative">
        <div className="flex items-center gap-4">
          
          {/* Main Logo & Menu */}
          <div className="flex items-center gap-3">
              <div className="relative" ref={menuRef}>
                  <button 
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-blue-600 transition-colors"
                  >
                      <Grid size={20} />
                  </button>
                  
                  {isMenuOpen && (
                      <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-100 p-2 z-50 grid grid-cols-2 gap-2 animate-in fade-in slide-in-from-top-2">
                          <button className="p-3 hover:bg-blue-50 rounded-lg flex flex-col items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors">
                              <LayoutDashboard size={24}/> <span className="text-xs font-bold">Dashboard</span>
                          </button>
                          <button className="p-3 hover:bg-blue-50 rounded-lg flex flex-col items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors">
                              <List size={24}/> <span className="text-xs font-bold">Agenda</span>
                          </button>
                          <button className="p-3 hover:bg-blue-50 rounded-lg flex flex-col items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors">
                              <Calendar size={24}/> <span className="text-xs font-bold">Calendário</span>
                          </button>
                          <button className="p-3 hover:bg-blue-50 rounded-lg flex flex-col items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors">
                              <MessageSquare size={24}/> <span className="text-xs font-bold">Suporte</span>
                          </button>
                          <div className="col-span-2 border-t border-slate-100 pt-2 mt-1">
                              <button onClick={onOpenSettings} className="w-full py-2 text-xs font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded">
                                  Configurações Gerais
                              </button>
                          </div>
                      </div>
                  )}
              </div>

              <div className="h-6 w-px bg-slate-200 mx-1"></div>

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

              {/* Dropdown Menu (Profile) */}
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
    </div>
  );
};
