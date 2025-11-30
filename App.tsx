
import React, { useState, useEffect } from 'react';
import { ViewMode, ServiceOrder, ServiceStatus, Priority, User, Organization, UserRole, PlanType, OrganizationStatus, Lead, SupportTicket, LeadStatus, TicketStatus } from './types';
import { generateMockData } from './services/mockData';
import { getInitialData } from './services/mockAuth';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { TechnicianDashboard } from './components/TechnicianDashboard';
import { CalendarView } from './components/CalendarView';
import { ServiceOrderForm } from './components/ServiceOrderForm';
import { ServiceOrderPDF } from './components/ServiceOrderPDF';
import { OrganizationSettings } from './components/OrganizationSettings';
import { PublicTracking } from './components/PublicTracking';
import { AdminDashboard } from './components/AdminDashboard';
import { TopNavbar } from './components/TopNavbar';
import { LandingPage } from './components/LandingPage';
import { OperationalNav } from './components/OperationalNav';
import { SupportPanel } from './components/SupportPanel';
import { Search, Filter, Users, MapPin, Calendar, ChevronRight, ArrowRight } from 'lucide-react';

const App: React.FC = () => {
  // Global Database State (Lifted Up for Admin Access)
  const initialData = getInitialData();
  const [dbUsers, setDbUsers] = useState<User[]>(initialData.users);
  const [dbOrgs, setDbOrgs] = useState<Organization[]>(initialData.orgs);
  const [dbLeads, setDbLeads] = useState<Lead[]>(initialData.leads);
  const [dbTickets, setDbTickets] = useState<SupportTicket[]>(initialData.tickets);

  // Auth State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentOrg, setCurrentOrg] = useState<Organization | null>(null);
  // God Mode State
  const [superAdminSession, setSuperAdminSession] = useState<{user: User, org: Organization} | null>(null);

  // App State
  // Initial View is now Landing Page
  const [view, setView] = useState<ViewMode>('landing');
  const [orders, setOrders] = useState<ServiceOrder[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<ServiceOrder | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Initial Data Load
  useEffect(() => {
    // Generate mock data containing IDs for org-pro and org-free
    const data = generateMockData();
    setOrders(data);
  }, []);

  const handleLogin = (email: string) => {
    // Determine user from our "Live" DB
    const user = dbUsers.find(u => u.email.includes(email));
    if (user) {
        const org = dbOrgs.find(o => o.id === user.organizationId);
        if (org) {
            // Check for suspension
            if (org.status === OrganizationStatus.SUSPENDED && user.role !== UserRole.SUPER_ADMIN) {
                alert(`Acesso suspenso. Motivo: ${org.suspensionReason}. Contacte o suporte.`);
                return;
            }

            // Check for Trial Expiration
            if (org.trialEndsAt) {
              const trialEnd = new Date(org.trialEndsAt);
              const now = new Date();
              if (now > trialEnd && org.plan === PlanType.PRO) { // If Pro (Trial) expired and not yet upgraded/paid
                  // Super Admin bypasses trial block to manage account
                  if(user.role !== UserRole.SUPER_ADMIN) {
                    alert("O seu período de teste de 15 dias expirou. Por favor, contacte o administrador para subscrever o plano Pro.");
                    return;
                  }
              }
            }

            setCurrentUser(user);
            setCurrentOrg(org);
            setSuperAdminSession(null);
            
            // Redirect based on Role
            if (user.role === UserRole.SUPER_ADMIN) {
                setView('admin-panel');
            } else if (user.role === UserRole.TECHNICIAN || user.role === UserRole.ASSISTANT) {
                setView('tech-dashboard');
            } else if (user.role === UserRole.CLIENT) {
                setView('list'); // Clients go straight to list/agenda
            } else {
                setView('dashboard');
            }
            return;
        }
    }
    alert("Erro de autenticação simulado");
  };

  // God Mode Handlers
  const handleImpersonate = (orgId: string) => {
      const targetOrg = dbOrgs.find(o => o.id === orgId);
      if (!targetOrg || !currentUser || !currentOrg) return;
      
      // Save current super admin session
      setSuperAdminSession({ user: currentUser, org: currentOrg });
      
      // Switch context
      setCurrentOrg(targetOrg);
      // NOTE: We keep currentUser as Super Admin, but the UI will render targetOrg data
      // because we filter by currentOrg.id
      setView('dashboard');
  };

  const handleExitImpersonation = () => {
      if (superAdminSession) {
          setCurrentUser(superAdminSession.user);
          setCurrentOrg(superAdminSession.org);
          setSuperAdminSession(null);
          setView('admin-panel');
      }
  };

  const handleImportData = (type: 'leads' | 'orders', data: any[]) => {
      if (type === 'leads') {
          // Process Leads
          const newLeads: Lead[] = data.map((d: any) => ({
              id: `l-imp-${Math.random()}`,
              createdAt: new Date().toISOString(),
              name: d.name || 'Sem Nome',
              companyName: d.companyName || 'Empresa',
              email: d.email || '',
              phone: d.phone || '',
              status: LeadStatus.NEW,
              notes: d.notes || ''
          }));
          setDbLeads(prev => [...prev, ...newLeads]);
      } else {
          // Process Orders (Simple mock implementation)
          // In real app, we would need to map customer IDs or create customers on fly
          alert(`Simulação: ${data.length} ordens importadas para a base de dados.`);
      }
  };


  const handleRegister = (data: { name: string; email: string; companyName: string; phone: string; nif: string }) => {
    // 1. Create Organization with 15 Days Trial
    const trialEndDate = new Date();
    trialEndDate.setDate(trialEndDate.getDate() + 15);

    const newOrg: Organization = {
      id: `org-${Math.random().toString(36).substr(2, 6)}`,
      name: data.companyName,
      nif: data.nif,
      plan: PlanType.PRO, // Start with PRO features
      status: OrganizationStatus.ACTIVE,
      maxUsers: 5,
      activeUsers: 1,
      joinedAt: new Date().toISOString(),
      trialEndsAt: trialEndDate.toISOString(), // 15 Days trial
    };

    // 2. Create Manager User
    const newUser: User = {
      id: `u-${Math.random().toString(36).substr(2, 6)}`,
      name: data.name,
      email: data.email,
      role: UserRole.MANAGER,
      organizationId: newOrg.id
    };

    // 3. Update DB State
    setDbOrgs(prev => [...prev, newOrg]);
    setDbUsers(prev => [...prev, newUser]);

    // 4. Auto Login
    alert(`Conta criada com sucesso! Aproveite os seus 15 dias de teste até ${trialEndDate.toLocaleDateString('pt-PT')}.`);
    setCurrentUser(newUser);
    setCurrentOrg(newOrg);
    setView('dashboard');
  };

  const handleLogout = () => {
      setCurrentUser(null);
      setCurrentOrg(null);
      setSuperAdminSession(null);
      setView('landing'); // Redirect to Landing Page
  };

  const handleExtendTrial = (orgId: string, days: number) => {
      setDbOrgs(prev => prev.map(o => {
          if (o.id === orgId) {
             const currentEnd = o.trialEndsAt ? new Date(o.trialEndsAt) : new Date();
             currentEnd.setDate(currentEnd.getDate() + days);
             return { ...o, trialEndsAt: currentEnd.toISOString() };
          }
          return o;
      }));
      alert(`Trial estendido por ${days} dias.`);
  };

  const handleEditOrder = (order: ServiceOrder) => {
    setSelectedOrder(order);
    setView('edit');
  };

  const handleSaveOrder = (updatedOrder: ServiceOrder) => {
    setOrders(prev => prev.map(o => o.id === updatedOrder.id ? updatedOrder : o));
    setSelectedOrder(null);
    setView('list'); 
  };

  // Organization Updates (Admin or Manager)
  const handleUpdateOrg = (updatedOrg: Organization) => {
      setDbOrgs(prev => prev.map(o => o.id === updatedOrg.id ? updatedOrg : o));
      // If updating current logged in user's org, reflect immediately
      if (currentOrg?.id === updatedOrg.id) {
          setCurrentOrg(updatedOrg);
      }
  };

  const handleUpdateUser = (updatedUser: User) => {
      setDbUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
  };

  const handleDeleteUser = (userId: string) => {
      if(confirm('Tem a certeza que deseja eliminar este utilizador?')) {
          setDbUsers(prev => prev.filter(u => u.id !== userId));
      }
  };

  // --- CRM & Support Handlers ---
  const handleUpdateLead = (lead: Lead) => {
      setDbLeads(prev => prev.map(l => l.id === lead.id ? lead : l));
  };

  const handleAddLead = (lead: Lead) => {
      setDbLeads(prev => [lead, ...prev]);
  };

  const handleUpdateTicket = (ticket: SupportTicket) => {
      setDbTickets(prev => prev.map(t => t.id === ticket.id ? ticket : t));
  };

  const handleAddTicket = (ticket: SupportTicket) => {
      setDbTickets(prev => [ticket, ...prev]);
  };
  
  // Client creates ticket
  const handleCreateClientTicket = (subject: string, priority: Priority, message: string) => {
      if (!currentOrg) return;
      const newTicket: SupportTicket = {
          id: `t-${Math.random().toString(36).substr(2, 6)}`,
          organizationId: currentOrg.id,
          organizationName: currentOrg.name,
          subject,
          priority,
          status: TicketStatus.OPEN,
          createdAt: new Date().toISOString(),
          messages: [{
              id: `m-1`,
              sender: currentUser?.name || 'User',
              content: message,
              timestamp: new Date().toISOString(),
              isAdmin: false
          }]
      };
      setDbTickets(prev => [newTicket, ...prev]);
  };

  // Client replies to ticket
  const handleReplyClientTicket = (ticketId: string, message: string) => {
       setDbTickets(prev => prev.map(t => {
           if (t.id === ticketId) {
               return {
                   ...t,
                   messages: [...t.messages, {
                       id: `m-${Math.random()}`,
                       sender: currentUser?.name || 'User',
                       content: message,
                       timestamp: new Date().toISOString(),
                       isAdmin: false
                   }]
               };
           }
           return t;
       }));
  };

  const handleAddOrg = (org: Organization) => {
      setDbOrgs(prev => [...prev, org]);
  };

  const handleAddUser = (user: User) => {
      setDbUsers(prev => [...prev, user]);
  };

  const createNewOrder = () => {
      const newOrder: ServiceOrder = {
          id: Math.random().toString(36).substr(2, 9),
          organizationId: currentOrg?.id || '',
          processNumber: `NOVO-${new Date().getFullYear()}`,
          priority: 'Normal' as any,
          technicianName: currentUser?.role === UserRole.TECHNICIAN ? currentUser.name : 'Por Atribuir',
          assistantTechnicianName: '',
          status: ServiceStatus.PENDING,
          statusHistory: [{status: ServiceStatus.PENDING, timestamp: new Date().toISOString(), updatedBy: currentUser?.name || 'Sistema'}],
          auditLog: [{
              id: Math.random().toString(36),
              action: 'Criação',
              details: 'Nova ordem de serviço iniciada',
              timestamp: new Date().toISOString(),
              userId: currentUser?.id || 'sys',
              userName: currentUser?.name || 'Sistema'
          }],
          channel: 'Portal',
          startDate: new Date().toISOString(),
          endDate: new Date(Date.now() + 7200000).toISOString(),
          vehicle: '',
          customer: {
              name: '',
              nif: '',
              address: '',
              postalCode: '',
              city: '',
              contacts: ''
          },
          scope: '',
          report: '',
          observations: '',
          checklist: [],
          images: [],
      };
      // For new orgs with 0 orders, we add it to the list immediately so dashboard updates
      if (filteredOrders.length === 0) {
          setOrders(prev => [...prev, newOrder]);
      }
      handleEditOrder(newOrder);
  };

  // Logic to handle navigation for creation actions
  const handleNavigateToCreateUser = () => {
      if (currentUser?.role === UserRole.SUPER_ADMIN && !superAdminSession) {
          setView('admin-panel');
      } else {
          setView('settings');
      }
  };

  const handleNavigateToCreateOrg = () => {
      if (currentUser?.role === UserRole.SUPER_ADMIN && !superAdminSession) {
          setView('admin-panel');
      }
  };

  // --- Render Logic Routes ---

  // 1. Landing Page (Default)
  if (view === 'landing') {
    return (
      <LandingPage 
        onLoginClick={() => setView('login')} 
        onRegister={handleRegister}
      />
    );
  }

  // 2. Login View
  if (view === 'login') {
      return (
          <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1581092921461-eab62e97a783?q=80&w=2070&auto=format&fit=crop')] opacity-10 bg-cover bg-center" />
              
              <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 z-10">
                  <div className="text-center mb-8">
                      <h1 className="text-3xl font-bold text-slate-800">SuportPrime<span className="text-blue-600">App</span></h1>
                      <p className="text-slate-500">Gestão Técnica Inteligente</p>
                  </div>

                  <div className="space-y-3">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Simular Acesso como:</p>
                      {dbUsers.slice(0, 5).map(u => (
                          <button 
                            key={u.id}
                            onClick={() => handleLogin(u.email)}
                            className="w-full p-4 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50 transition-all flex items-center justify-between group text-left"
                          >
                              <div>
                                  <p className="font-bold text-slate-800 group-hover:text-blue-700">{u.name}</p>
                                  <p className="text-xs text-slate-500">{u.role} • {u.organizationId}</p>
                              </div>
                              <ArrowRight size={18} className="text-slate-300 group-hover:text-blue-500" />
                          </button>
                      ))}
                  </div>

                  <div className="mt-8 pt-6 border-t border-slate-100 space-y-3">
                      <button 
                        onClick={() => setView('public-tracking')}
                        className="w-full py-3 bg-slate-800 text-white rounded-xl font-medium hover:bg-slate-700 transition-colors flex items-center justify-center gap-2"
                      >
                          <Search size={18} /> Rastrear Encomenda / OS
                      </button>
                      <button 
                        onClick={() => setView('landing')}
                        className="w-full text-center text-sm text-slate-500 hover:text-blue-600 font-medium"
                      >
                        &larr; Voltar à Página Inicial
                      </button>
                  </div>
              </div>
              <p className="mt-8 text-slate-500 text-xs">© 2024 SuportePrime System</p>
          </div>
      );
  }

  // 3. Public Tracking View
  if (view === 'public-tracking') {
      return (
          <PublicTracking 
            onSearch={(pn) => orders.find(o => o.processNumber === pn)}
            onBack={() => setView('login')}
          />
      );
  }

  // 4. PDF Read View
  if (view === 'read-pdf' && selectedOrder) {
      return (
          <ServiceOrderPDF 
            order={selectedOrder} 
            onBack={() => setView('list')} 
          />
      );
  }

  // 5. Authenticated Views Wrapper
  if (!currentUser || !currentOrg) return null;

  // STRICT MULTI-TENANCY FILTER
  const filteredOrders = orders.filter(o => {
    // 1. Must match Organization ID (Data Isolation)
    if (o.organizationId !== currentOrg.id) return false;

    // 2. Search Term Filter
    return (
        o.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.processNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.technicianName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="min-h-screen bg-slate-100 flex font-sans text-slate-900 overflow-hidden">
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar Navigation (Desktop) */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 transform transition-transform duration-300 cubic-bezier(0.4, 0, 0.2, 1) md:translate-x-0 md:static ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      } border-r border-slate-800 shadow-xl shrink-0 hidden md:block`}>
        <Sidebar 
            currentView={view} 
            onChangeView={(v) => { setView(v); setIsMobileMenuOpen(false); }} 
            organization={currentOrg}
            userRole={currentUser.role}
        />
      </div>

       {/* Sidebar Navigation (Mobile Drawer) */}
       <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 transform transition-transform duration-300 cubic-bezier(0.4, 0, 0.2, 1) md:hidden ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      } border-r border-slate-800 shadow-xl shrink-0`}>
         <Sidebar 
            currentView={view} 
            onChangeView={(v) => { setView(v); setIsMobileMenuOpen(false); }} 
            organization={currentOrg}
            userRole={currentUser.role}
        />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative w-full">
        
        {/* Sticky Global Header Group */}
        <div className="sticky top-0 z-40 w-full bg-slate-100">
            {/* Top Navbar: User Profile & Global Alerts */}
            <TopNavbar 
                user={currentUser} 
                organization={currentOrg} 
                onLogout={handleLogout}
                onOpenSettings={() => setView('settings')}
                isImpersonating={!!superAdminSession}
                onExitImpersonation={handleExitImpersonation}
            />
            
            {/* Operational Nav: Contextual Navigation & Actions */}
            <OperationalNav 
                view={view}
                setView={setView}
                currentUser={currentUser}
                currentOrg={currentOrg}
                onMobileMenuToggle={() => setIsMobileMenuOpen(true)}
                onCreateOrder={createNewOrder}
                onCreateUser={handleNavigateToCreateUser}
                onCreateOrg={handleNavigateToCreateOrg}
            />
        </div>

        {/* Scrollable Content Container */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 custom-scrollbar bg-slate-100">
          
          {view === 'admin-panel' && currentUser.role === UserRole.SUPER_ADMIN && !superAdminSession && (
              <AdminDashboard 
                allOrgs={dbOrgs}
                allUsers={dbUsers}
                leads={dbLeads}
                tickets={dbTickets}
                onUpdateOrg={handleUpdateOrg}
                onUpdateUser={handleUpdateUser}
                onDeleteUser={handleDeleteUser}
                onUpdateLead={handleUpdateLead}
                onAddLead={handleAddLead}
                onUpdateTicket={handleUpdateTicket}
                onAddTicket={handleAddTicket}
                onAddOrg={handleAddOrg}
                onAddUser={handleAddUser}
                onExtendTrial={handleExtendTrial}
                onImpersonate={handleImpersonate}
                onImportData={handleImportData}
              />
          )}

          {view === 'dashboard' && <Dashboard orders={filteredOrders} plan={currentOrg.plan} />}

          {/* New Tech Dashboard */}
          {view === 'tech-dashboard' && <TechnicianDashboard orders={filteredOrders} currentUser={currentUser} />}
          
          {view === 'support' && (
              <SupportPanel 
                tickets={dbTickets.filter(t => t.organizationId === currentOrg.id)}
                currentUser={currentUser}
                onCreateTicket={handleCreateClientTicket}
                onReplyTicket={handleReplyClientTicket}
              />
          )}

          {view === 'calendar' && currentOrg.plan !== PlanType.FREE && (
             <CalendarView orders={filteredOrders} onSelectOrder={handleEditOrder} />
          )}

          {view === 'settings' && (
              <OrganizationSettings 
                organization={currentOrg}
                users={dbUsers.filter(u => u.organizationId === currentOrg.id)}
                onUpdatePlan={(plan) => handleUpdateOrg({...currentOrg, plan})}
                onAddUser={(role) => alert('Simulação: Utilize o botão "Novo" no menu superior.')}
                onBack={() => setView('dashboard')}
              />
          )}

          {view === 'list' && (
            <div className="space-y-6 max-w-7xl mx-auto pb-10">
              {/* Search and Filters */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                 <div className="relative flex-1 w-full sm:w-auto sm:max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                        type="text"
                        placeholder="Pesquisar por cliente, técnico ou processo..."
                        className="pl-10 pr-4 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white w-full transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                 </div>
                 <button className="w-full sm:w-auto px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors shadow-sm">
                    <Filter size={16} /> Filtros
                </button>
              </div>

              {filteredOrders.length === 0 ? (
                  <div className="text-center py-20 bg-white rounded-xl border border-slate-200 border-dashed">
                      <p className="text-slate-400 font-medium">Nenhuma ordem de serviço encontrada.</p>
                      <button onClick={createNewOrder} className="mt-4 text-blue-600 font-bold hover:underline">Criar a primeira OS</button>
                  </div>
              ) : (
                <div className="grid gap-4">
                    {filteredOrders.map(order => (
                    <div 
                        key={order.id} 
                        onClick={() => handleEditOrder(order)}
                        className="bg-white rounded-xl shadow-sm border border-slate-200 hover:border-blue-500 hover:shadow-md transition-all cursor-pointer group relative overflow-hidden"
                    >
                        {/* Status Strip on Left */}
                        <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${
                            order.status === ServiceStatus.DONE ? 'bg-emerald-500' :
                            order.status === ServiceStatus.PENDING ? 'bg-amber-500' :
                            order.status === ServiceStatus.IN_PROGRESS ? 'bg-blue-500' :
                            'bg-slate-300'
                        }`}></div>

                        <div className="p-5 pl-7 flex flex-col md:flex-row gap-6">
                            {/* Main Info */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-3 mb-2 flex-wrap">
                                    <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-1 rounded border border-blue-100">{order.processNumber}</span>
                                    {order.priority === Priority.CRITICAL || order.priority === Priority.HIGH ? (
                                        <span className="flex items-center gap-1 text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded border border-red-100">
                                            <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></div>
                                            {order.priority}
                                        </span>
                                    ) : (
                                        <span className="text-xs font-medium text-slate-500 border border-slate-200 px-2 py-1 rounded">{order.priority}</span>
                                    )}
                                    <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ml-auto md:ml-0 ${
                                        order.status === ServiceStatus.DONE ? 'bg-emerald-100 text-emerald-800' :
                                        order.status === ServiceStatus.PENDING ? 'bg-amber-100 text-amber-800' :
                                        order.status === ServiceStatus.IN_PROGRESS ? 'bg-blue-100 text-blue-800' :
                                        'bg-slate-100 text-slate-600'
                                    }`}>
                                    {order.status}
                                    </span>
                                </div>
                                
                                <h3 className="font-bold text-lg text-slate-800 truncate mb-1">{order.customer.name}</h3>
                                <div className="flex items-center gap-2 text-sm text-slate-500 mb-3">
                                    <MapPin size={14} />
                                    <span className="truncate">{order.customer.city}</span>
                                </div>
                                <p className="text-sm text-slate-600 line-clamp-2 bg-slate-50 p-2 rounded border border-slate-100 border-l-2 border-l-slate-300">
                                    {order.scope}
                                </p>
                            </div>

                            {/* Tech & Time Info */}
                            <div className="flex flex-col gap-3 justify-center min-w-[200px] border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center text-slate-600">
                                            <Users size={16} />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-700 uppercase tracking-wide">Equipa Técnica</p>
                                            <p className="text-sm font-medium text-slate-900">{order.technicianName}</p>
                                            {order.assistantTechnicianName && (
                                                <p className="text-xs text-slate-500">+ {order.assistantTechnicianName}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 mt-1">
                                    <Calendar size={14} className="text-slate-400"/>
                                    <span className="text-sm font-medium text-slate-700">
                                        {new Date(order.startDate).toLocaleDateString('pt-PT')}
                                    </span>
                                </div>
                            </div>

                            <div className="hidden md:flex items-center justify-center text-slate-300 group-hover:text-blue-500 transition-colors">
                                <ChevronRight size={24} />
                            </div>
                        </div>
                    </div>
                    ))}
                </div>
              )}
            </div>
          )}

          {view === 'edit' && selectedOrder && (
            <ServiceOrderForm 
              order={selectedOrder}
              onSave={handleSaveOrder}
              onCancel={() => { setSelectedOrder(null); setView('list'); }}
              onPrint={() => setView('read-pdf')}
              currentUser={currentUser}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
