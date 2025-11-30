
import React, { useState, useRef, useEffect } from 'react';
import { 
  LayoutDashboard, List, Calendar, Plus, ChevronDown, 
  UserPlus, Building, FilePlus, ShieldAlert, Menu, Settings, BarChart, LifeBuoy
} from 'lucide-react';
import { ViewMode, User, UserRole, PlanType, Organization } from '../types';

interface OperationalNavProps {
  view: ViewMode;
  setView: (view: ViewMode) => void;
  currentUser: User;
  currentOrg: Organization;
  onMobileMenuToggle: () => void;
  onCreateOrder: () => void;
  onCreateUser: () => void;
  onCreateOrg: () => void;
}

export const OperationalNav: React.FC<OperationalNavProps> = ({ 
  view, setView, currentUser, currentOrg, onMobileMenuToggle,
  onCreateOrder, onCreateUser, onCreateOrg
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const isTechnician = currentUser.role === UserRole.TECHNICIAN || currentUser.role === UserRole.ASSISTANT;

  const navItems = [
    // Conditional Dashboard Link
    ...(isTechnician 
        ? [{ id: 'tech-dashboard', label: 'Minha Performance', icon: BarChart }] 
        : [{ id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard }]
    ),
    { id: 'list', label: 'Agenda', icon: List },
    ...(currentOrg.plan !== PlanType.FREE ? [{ id: 'calendar', label: 'Calendário', icon: Calendar }] : []),
    ...(currentUser.role === UserRole.SUPER_ADMIN ? [{ id: 'admin-panel', label: 'Painel Admin', icon: ShieldAlert }] : []),
    // Add Support Link
    { id: 'support', label: 'Suporte', icon: LifeBuoy }
  ];

  const getPageTitle = () => {
    switch(view) {
        case 'dashboard': return 'Dashboard Geral';
        case 'tech-dashboard': return 'Performance Técnica';
        case 'list': return 'Agenda de Serviços';
        case 'calendar': return 'Calendário';
        case 'admin-panel': return 'Administração';
        case 'settings': return 'Configurações';
        case 'edit': return 'Editar Ordem';
        case 'read-pdf': return 'Relatório PDF';
        case 'support': return 'Suporte Técnico';
        default: return 'SuportPrimeApp';
    }
  };

  return (
    <div className="bg-white border-b border-slate-200 sticky top-0 md:top-16 z-30 shadow-sm w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          
          {/* Mobile Menu Button & Title */}
          <div className="flex items-center gap-3 md:hidden">
            <button 
                onClick={onMobileMenuToggle}
                className="p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-lg active:scale-95 transition-transform"
            >
                <Menu size={24} />
            </button>
            <span className="font-bold text-slate-800 text-lg truncate tracking-tight">{getPageTitle()}</span>
          </div>

          {/* Desktop Navigation Tabs */}
          <div className="hidden md:flex items-center space-x-2">
             {navItems.map(item => (
                <button
                    key={item.id}
                    onClick={() => setView(item.id as ViewMode)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        view === item.id 
                        ? 'bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-100' 
                        : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                    }`}
                >
                    <item.icon size={18} />
                    {item.label}
                </button>
             ))}
          </div>

          {/* Actions Dropdown */}
          <div className="flex items-center gap-2" ref={dropdownRef}>
             <div className="relative">
                <button 
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-2 bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 shadow-md shadow-blue-600/20 transition-all active:scale-95"
                >
                    <Plus size={18} />
                    <span className="hidden sm:inline">Criar Novo</span>
                    <ChevronDown size={14} className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}/>
                </button>

                {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-100 py-2 animate-in fade-in slide-in-from-top-2 z-50">
                        <div className="px-4 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-50 mb-1">
                            Ações Rápidas
                        </div>
                        
                        <button 
                            onClick={() => { onCreateOrder(); setIsDropdownOpen(false); }}
                            className="w-full text-left px-4 py-3 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-700 flex items-center gap-3 transition-colors group"
                        >
                            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg group-hover:bg-blue-200 transition-colors"><FilePlus size={18}/></div>
                            <div>
                                <span className="block font-semibold">Ordem de Serviço</span>
                                <span className="text-xs text-slate-400">Novo atendimento</span>
                            </div>
                        </button>

                        {(currentUser.role === UserRole.MANAGER || currentUser.role === UserRole.ADMIN || currentUser.role === UserRole.SUPER_ADMIN) && (
                            <button 
                                onClick={() => { onCreateUser(); setIsDropdownOpen(false); }}
                                className="w-full text-left px-4 py-3 text-sm text-slate-700 hover:bg-purple-50 hover:text-purple-700 flex items-center gap-3 transition-colors group"
                            >
                                <div className="p-2 bg-purple-100 text-purple-600 rounded-lg group-hover:bg-purple-200 transition-colors"><UserPlus size={18}/></div>
                                <div>
                                    <span className="block font-semibold">Utilizador</span>
                                    <span className="text-xs text-slate-400">Adicionar à equipa</span>
                                </div>
                            </button>
                        )}

                        {currentUser.role === UserRole.SUPER_ADMIN && (
                             <button 
                                onClick={() => { onCreateOrg(); setIsDropdownOpen(false); }}
                                className="w-full text-left px-4 py-3 text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 flex items-center gap-3 transition-colors group"
                            >
                                <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg group-hover:bg-emerald-200 transition-colors"><Building size={18}/></div>
                                <div>
                                    <span className="block font-semibold">Empresa</span>
                                    <span className="text-xs text-slate-400">Registar cliente</span>
                                </div>
                            </button>
                        )}
                        
                        <div className="border-t border-slate-100 my-1"></div>
                        <button 
                            onClick={() => { setView('settings'); setIsDropdownOpen(false); }}
                            className="w-full text-left px-4 py-2 text-sm text-slate-500 hover:bg-slate-50 hover:text-slate-800 flex items-center gap-3 transition-colors"
                        >
                            <Settings size={14} /> Configurações
                        </button>
                    </div>
                )}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
