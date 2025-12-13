
import React, { useState } from 'react';
import { ViewMode, PlanType, Organization, UserRole } from '../types';
import { 
  LayoutDashboard, Calendar, List, Zap, ShieldAlert, BarChart, 
  Truck, Wallet, Users, ChevronDown, ChevronRight, Briefcase, FileText, DollarSign
} from 'lucide-react';

interface SidebarProps {
  currentView: ViewMode;
  onChangeView: (view: ViewMode) => void;
  organization: Organization;
  userRole?: UserRole;
}

// Extracted MenuItem component
interface MenuItemProps {
    item: { id: string; label: string; icon: any };
    currentView: ViewMode;
    onChangeView: (view: ViewMode) => void;
}

const MenuItem: React.FC<MenuItemProps> = ({ item, currentView, onChangeView }) => (
    <button
        onClick={() => onChangeView(item.id as ViewMode)}
        className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 group ${
            currentView === item.id 
            ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
            : 'text-slate-400 hover:text-white hover:bg-slate-800'
        }`}
    >
        <item.icon size={18} className={`transition-colors ${currentView === item.id ? 'text-white' : 'text-slate-500 group-hover:text-white'}`} />
        {item.label}
    </button>
);

// Extracted SubMenu component
interface SubMenuProps {
    label: string;
    icon: any;
    items: any[];
    id: string;
    currentView: ViewMode;
    onChangeView: (view: ViewMode) => void;
    expandedMenu: string | null;
    toggleMenu: (menu: string) => void;
}

const SubMenu: React.FC<SubMenuProps> = ({ label, icon: Icon, items, id, currentView, onChangeView, expandedMenu, toggleMenu }) => {
    const isOpen = expandedMenu === id;
    const isActive = items.some(i => i.id === currentView);
    
    return (
        <div className="space-y-1">
            <button 
              onClick={() => toggleMenu(id)}
              className={`w-full flex items-center justify-between px-4 py-3 text-sm font-bold rounded-lg transition-all ${isActive ? 'text-white bg-slate-800' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
            >
                <div className="flex items-center gap-3">
                    <Icon size={18} /> {label}
                </div>
                {isOpen ? <ChevronDown size={14}/> : <ChevronRight size={14}/>}
            </button>
            
            {isOpen && (
                <div className="pl-4 space-y-1 border-l border-slate-700 ml-4 animate-in slide-in-from-left-2 duration-200">
                    {items.map(subItem => (
                        <button
                          key={subItem.id}
                          onClick={() => onChangeView(subItem.id as ViewMode)}
                          className={`w-full flex items-center gap-3 px-4 py-2 text-sm rounded-lg transition-all ${
                              currentView === subItem.id ? 'text-blue-400 font-bold' : 'text-slate-500 hover:text-slate-300'
                          }`}
                        >
                            {subItem.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onChangeView, organization, userRole }) => {
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);

  const toggleMenu = (menu: string) => {
    setExpandedMenu(expandedMenu === menu ? null : menu);
  };

  const isTechnician = userRole === UserRole.TECHNICIAN || userRole === UserRole.ASSISTANT;
  const isClient = userRole === UserRole.CLIENT;
  const isSuperAdmin = userRole === UserRole.SUPER_ADMIN;

  // --- MENU STRUCTURE ---
  
  // 1. Operational (Core)
  const operationalItems = [
    ...(isTechnician 
        ? [{ id: 'tech-dashboard', label: 'Minha Performance', icon: BarChart }] 
        : [{ id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard }]
    ),
    { id: 'list', label: 'Ordens de Serviço', icon: List },
    ...(organization.plan !== PlanType.FREE ? [{ id: 'calendar', label: 'Agenda / Calendário', icon: Calendar }] : []),
  ];

  // 2. Resources (Fleet, Assets) - ENTERPRISE only
  const resourceItems = [
      { id: 'fleet-list', label: 'Viaturas', icon: Truck },
      { id: 'assets-list', label: 'Equipamentos', icon: Briefcase },
  ];

  // 3. Financial (Invoices, Expenses) - ENTERPRISE only
  const financialItems = [
      { id: 'finance-invoices', label: 'Faturas', icon: FileText },
      { id: 'finance-expenses', label: 'Despesas', icon: Wallet },
  ];

  // 4. HR (Team) - ENTERPRISE only
  const hrItems = [
      { id: 'hr-employees', label: 'Colaboradores', icon: Users },
      { id: 'hr-payroll', label: 'Salários', icon: DollarSign },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 bg-slate-900 text-white h-screen fixed left-0 top-0 overflow-y-auto z-50 border-r border-slate-800 custom-scrollbar">
      <div className="p-6 flex items-center gap-3 sticky top-0 bg-slate-900 z-10">
        <div className="bg-blue-600 p-2 rounded-lg shadow-lg shadow-blue-900/50">
             <Zap size={20} className="text-white" fill="currentColor"/>
        </div>
        <div>
            <h1 className="text-lg font-bold tracking-tight text-white leading-tight">SuportPrime<span className="text-blue-500">App</span></h1>
            <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Gestão Técnica</p>
        </div>
      </div>

      <div className="flex-1 px-3 py-2 space-y-1">
        
        {/* SUPER ADMIN LINK - MOVED TO TOP */}
        {userRole === UserRole.SUPER_ADMIN && (
            <div className="mb-6">
                 <button
                    onClick={() => onChangeView('admin-panel')}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-lg transition-all duration-200 ${
                    currentView === 'admin-panel'
                        ? 'bg-red-900/50 text-red-200 border border-red-800/50'
                        : 'text-red-400 hover:bg-slate-800'
                    }`}
                >
                    <ShieldAlert size={18} />
                    Super Admin
                </button>
                <div className="border-t border-slate-800 my-4"></div>
            </div>
        )}

        <p className="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Operacional</p>
        {operationalItems.map(item => (
            <MenuItem 
                key={item.id} 
                item={item} 
                currentView={currentView}
                onChangeView={onChangeView}
            />
        ))}

        {/* Modules for ENTERPRISE only (or Super Admin impersonating) */}
        {!isClient && (organization.plan === PlanType.ENTERPRISE || isSuperAdmin) && (
            <>
                <p className="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 mt-6">Gestão Enterprise</p>
                <SubMenu 
                    id="resources" label="Recursos" icon={Truck} items={resourceItems} 
                    currentView={currentView} onChangeView={onChangeView} expandedMenu={expandedMenu} toggleMenu={toggleMenu}
                />
                <SubMenu 
                    id="finance" label="Financeiro" icon={Wallet} items={financialItems} 
                    currentView={currentView} onChangeView={onChangeView} expandedMenu={expandedMenu} toggleMenu={toggleMenu}
                />
                <SubMenu 
                    id="hr" label="RH & Equipa" icon={Users} items={hrItems} 
                    currentView={currentView} onChangeView={onChangeView} expandedMenu={expandedMenu} toggleMenu={toggleMenu}
                />
            </>
        )}
      </div>

      {organization.plan === PlanType.FREE && !isSuperAdmin && (
          <div className="p-4 mx-4 mb-4 bg-slate-800 rounded-xl border border-slate-700 mt-auto">
            <p className="text-xs text-slate-300 mb-2">Plano <span className="text-white font-bold">Free</span></p>
            <div className="w-full bg-slate-700 h-1.5 rounded-full mb-1">
                <div className="bg-amber-500 h-1.5 rounded-full w-full"></div>
            </div>
            <button className="w-full mt-3 py-1.5 bg-blue-600 text-white text-xs font-bold rounded hover:bg-blue-500">
                Fazer Upgrade
            </button>
          </div>
      )}
    </aside>
  );
};
