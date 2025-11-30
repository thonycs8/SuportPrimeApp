
import React, { useState } from 'react';
import { Organization, User, PlanType, UserRole, OrganizationStatus, SuspensionReason, Lead, LeadStatus, SupportTicket, TicketStatus, Priority, TicketMessage } from '../types';
import { 
  Shield, Building, Users, Search, AlertTriangle, UserPlus, Phone, Mail, 
  CheckCircle, BarChart2, TrendingUp, MessageSquare, Ban, Lock, PenSquare, 
  Clock, Plus, LayoutGrid, User as UserIcon, Trash2
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line 
} from 'recharts';

interface AdminDashboardProps {
  allOrgs: Organization[];
  allUsers: User[];
  leads: Lead[];
  tickets: SupportTicket[];
  onUpdateOrg: (org: Organization) => void;
  onUpdateUser: (user: User) => void;
  onDeleteUser: (userId: string) => void;
  onUpdateLead: (lead: Lead) => void;
  onAddLead: (lead: Lead) => void;
  onUpdateTicket: (ticket: SupportTicket) => void;
  onAddTicket: (ticket: SupportTicket) => void;
  onAddOrg: (org: Organization) => void;
  onAddUser: (user: User) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  allOrgs,
  allUsers,
  leads,
  tickets,
  onUpdateOrg,
  onUpdateUser,
  onDeleteUser,
  onUpdateLead,
  onAddLead,
  onUpdateTicket,
  onAddTicket,
  onAddOrg,
  onAddUser
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'crm' | 'orgs' | 'support' | 'users'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  
  // --- STATE FOR MODALS ---
  const [showSuspendModal, setShowSuspendModal] = useState<string | null>(null);
  const [suspensionReason, setSuspensionReason] = useState<SuspensionReason>(SuspensionReason.NON_PAYMENT);
  
  const [showOrgModal, setShowOrgModal] = useState(false);
  const [editingOrg, setEditingOrg] = useState<Organization | null>(null);
  const [orgForm, setOrgForm] = useState<Partial<Organization>>({});

  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userForm, setUserForm] = useState<Partial<User>>({});

  const [showLeadModal, setShowLeadModal] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [leadForm, setLeadForm] = useState<Partial<Lead>>({});

  const [showTicketModal, setShowTicketModal] = useState(false);
  const [ticketForm, setTicketForm] = useState<{orgId: string, subject: string, priority: Priority, message: string}>({
      orgId: '', subject: '', priority: Priority.NORMAL, message: ''
  });

  const [ticketReplies, setTicketReplies] = useState<Record<string, string>>({});

  // --- FILTERING ---
  const filteredOrgs = allOrgs.filter(o => o.name.toLowerCase().includes(searchTerm.toLowerCase()));
  const filteredUsers = allUsers.filter(u => u.name.toLowerCase().includes(searchTerm.toLowerCase()));
  const filteredLeads = leads.filter(l => l.companyName.toLowerCase().includes(searchTerm.toLowerCase()));

  // --- STYLING CONSTANTS ---
  const inputClass = "w-full p-3 bg-white border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 text-base shadow-sm placeholder:text-slate-400";
  const labelClass = "block text-xs font-bold text-slate-500 uppercase mb-1.5 tracking-wide";

  // --- HANDLERS (Same logic as before, omitted for brevity where unchanged) ---
  const openOrgModal = (org?: Organization) => {
      setEditingOrg(org || null);
      if (org) { setOrgForm({ ...org }); } 
      else { setOrgForm({ name: '', plan: PlanType.FREE, status: OrganizationStatus.ACTIVE, maxUsers: 1 }); }
      setShowOrgModal(true);
  };

  const handleSaveOrg = () => {
      if (editingOrg) { onUpdateOrg({ ...editingOrg, ...orgForm } as Organization); } 
      else {
          onAddOrg({
              id: `org-${Math.random().toString(36).substr(2, 5)}`,
              activeUsers: 0,
              joinedAt: new Date().toISOString(),
              name: orgForm.name || 'Nova Empresa',
              plan: orgForm.plan || PlanType.FREE,
              status: orgForm.status || OrganizationStatus.ACTIVE,
              maxUsers: orgForm.maxUsers || 1
          } as Organization);
      }
      setShowOrgModal(false);
  };

  const handleSuspendOrg = () => {
    if (showSuspendModal) {
        const org = allOrgs.find(o => o.id === showSuspendModal);
        if (org) {
            onUpdateOrg({ ...org, status: OrganizationStatus.SUSPENDED, suspensionReason: suspensionReason });
        }
        setShowSuspendModal(null);
    }
  };

  const openUserModal = (user?: User) => {
      setEditingUser(user || null);
      if (user) { setUserForm({ ...user }); } 
      else { setUserForm({ name: '', email: '', role: UserRole.MANAGER, organizationId: allOrgs[1]?.id || '' }); }
      setShowUserModal(true);
  };

  const handleSaveUser = () => {
      if (editingUser) { onUpdateUser({ ...editingUser, ...userForm } as User); } 
      else {
           onAddUser({
              id: `u-${Math.random().toString(36).substr(2, 5)}`,
              name: userForm.name || 'Novo Utilizador',
              email: userForm.email || '',
              role: userForm.role || UserRole.TECHNICIAN,
              organizationId: userForm.organizationId || 'org-free'
           } as User);
      }
      setShowUserModal(false);
  };

  const openLeadModal = (lead?: Lead) => {
      setEditingLead(lead || null);
      if (lead) { setLeadForm({ ...lead }); } 
      else { setLeadForm({ name: '', companyName: '', email: '', phone: '', status: LeadStatus.NEW, notes: '' }); }
      setShowLeadModal(true);
  };

  const handleSaveLead = () => {
      if (editingLead) { onUpdateLead({ ...editingLead, ...leadForm } as Lead); } 
      else {
          onAddLead({
              id: `l-${Math.random().toString(36).substr(2, 5)}`,
              createdAt: new Date().toISOString(),
              name: leadForm.name || '',
              companyName: leadForm.companyName || '',
              email: leadForm.email || '',
              phone: leadForm.phone || '',
              status: leadForm.status || LeadStatus.NEW,
              notes: leadForm.notes || ''
          });
      }
      setShowLeadModal(false);
  };

  const convertLead = (lead: Lead) => {
      if (window.confirm(`Converter ${lead.companyName} em cliente ativo?`)) {
          const newOrg: Organization = {
              id: `org-${Math.random().toString(36).substr(2, 5)}`,
              name: lead.companyName,
              plan: PlanType.PRO,
              maxUsers: 5,
              activeUsers: 1,
              status: OrganizationStatus.ACTIVE,
              joinedAt: new Date().toISOString()
          };
          onAddOrg(newOrg);
          const newUser: User = {
              id: `u-${Math.random().toString(36).substr(2, 5)}`,
              name: lead.name,
              email: lead.email,
              role: UserRole.MANAGER,
              organizationId: newOrg.id
          };
          onAddUser(newUser);
          onUpdateLead({ ...lead, status: LeadStatus.CONVERTED });
          alert('Cliente criado com sucesso!');
      }
  };

  const handleSaveTicket = () => {
      const org = allOrgs.find(o => o.id === ticketForm.orgId);
      onAddTicket({
          id: `t-${Math.random().toString(36).substr(2, 5)}`,
          organizationId: ticketForm.orgId,
          organizationName: org ? org.name : 'Unknown',
          subject: ticketForm.subject,
          priority: ticketForm.priority,
          status: TicketStatus.OPEN,
          createdAt: new Date().toISOString(),
          messages: ticketForm.message ? [{
              id: `m-${Math.random()}`,
              sender: 'Super Admin',
              content: ticketForm.message,
              timestamp: new Date().toISOString(),
              isAdmin: true
          }] : []
      });
      setShowTicketModal(false);
      setTicketForm({ orgId: '', subject: '', priority: Priority.NORMAL, message: '' });
  };

  const handleReplyTicket = (ticketId: string) => {
      const reply = ticketReplies[ticketId];
      if (!reply) return;
      const ticket = tickets.find(t => t.id === ticketId);
      if (ticket) {
          onUpdateTicket({
              ...ticket,
              messages: [...ticket.messages, {
                  id: `m-${Math.random()}`,
                  sender: 'Super Admin',
                  content: reply,
                  timestamp: new Date().toISOString(),
                  isAdmin: true
              }],
              status: TicketStatus.IN_PROGRESS
          });
          setTicketReplies(prev => ({ ...prev, [ticketId]: '' }));
      }
  };

  const salesData = [
    { name: 'Jan', sales: 4000 },
    { name: 'Fev', sales: 3000 },
    { name: 'Mar', sales: 2000 },
    { name: 'Abr', sales: 2780 },
    { name: 'Mai', sales: 1890 },
    { name: 'Jun', sales: 2390 },
  ];

  const getDaysLeft = (org: Organization) => {
      if (!org.trialEndsAt) return 0;
      const end = new Date(org.trialEndsAt);
      const now = new Date();
      const diff = Math.ceil((end.getTime() - now.getTime()) / (1000 * 3600 * 24));
      return diff > 0 ? diff : 0;
  }
  const isTrial = (org: Organization) => {
    if (!org.trialEndsAt) return false;
    return new Date(org.trialEndsAt) > new Date();
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-24 md:pb-12 px-2 md:px-0">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Shield className="text-red-600" fill="currentColor" size={24}/> 
            Super Admin
          </h2>
        </div>
        
        <div className="flex bg-white rounded-xl shadow-sm border border-slate-200 p-1 overflow-x-auto hide-scrollbar">
          {[
            { id: 'overview', label: 'Visão Geral', icon: LayoutGrid },
            { id: 'crm', label: 'CRM', icon: TrendingUp },
            { id: 'orgs', label: 'Empresas', icon: Building },
            { id: 'users', label: 'Utilizadores', icon: Users },
            { id: 'support', label: 'Suporte', icon: MessageSquare },
          ].map(tab => (
            <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${
                    activeTab === tab.id 
                    ? 'bg-slate-800 text-white shadow-md' 
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                }`}
            >
                <tab.icon size={16} />
                {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* OVERVIEW TAB */}
      {activeTab === 'overview' && (
          <div className="space-y-6 animate-in fade-in duration-500">
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase">Receita</p>
                        <p className="text-2xl font-bold text-slate-800 mt-1">12,450€</p>
                    </div>
                    <div className="p-3 bg-green-50 text-green-600 rounded-xl"><BarChart2 size={24}/></div>
                </div>
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase">Empresas</p>
                        <p className="text-2xl font-bold text-slate-800 mt-1">{allOrgs.length}</p>
                    </div>
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><Building size={24}/></div>
                </div>
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase">Leads</p>
                        <p className="text-2xl font-bold text-slate-800 mt-1">{leads.filter(l => l.status === LeadStatus.NEW).length}</p>
                    </div>
                    <div className="p-3 bg-amber-50 text-amber-600 rounded-xl"><UserPlus size={24}/></div>
                </div>
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase">Tickets</p>
                        <p className="text-2xl font-bold text-slate-800 mt-1">{tickets.filter(t => t.status === TicketStatus.OPEN).length}</p>
                    </div>
                    <div className="p-3 bg-red-50 text-red-600 rounded-xl"><AlertTriangle size={24}/></div>
                </div>
             </div>

             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-80">
                    <h3 className="text-lg font-bold text-slate-800 mb-4">Vendas (6 meses)</h3>
                    <ResponsiveContainer width="100%" height="85%">
                        <LineChart data={salesData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} />
                            <YAxis axisLine={false} tickLine={false} />
                            <Tooltip />
                            <Line type="monotone" dataKey="sales" stroke="#2563EB" strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-80">
                    <h3 className="text-lg font-bold text-slate-800 mb-4">Novos Clientes</h3>
                    <ResponsiveContainer width="100%" height="85%">
                        <BarChart data={salesData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} />
                            <YAxis axisLine={false} tickLine={false} />
                            <Tooltip cursor={{fill: 'transparent'}} />
                            <Bar dataKey="sales" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
             </div>
          </div>
      )}

      {/* CRM TAB */}
      {activeTab === 'crm' && (
          <div className="space-y-6">
             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                 <h3 className="text-lg font-bold text-slate-800">Pipeline</h3>
                 <div className="flex w-full sm:w-auto items-center gap-3">
                     <div className="relative flex-1 sm:flex-none">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input 
                            type="text" 
                            placeholder="Pesquisar..."
                            className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white text-slate-800"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                     </div>
                     <button onClick={() => openLeadModal()} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm flex items-center gap-2 whitespace-nowrap">
                         <Plus size={16} /> <span className="hidden sm:inline">Lead</span>
                     </button>
                 </div>
             </div>
             
             <div className="space-y-4">
                {filteredLeads.map(lead => (
                    <div key={lead.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col gap-4">
                        <div className="flex justify-between items-start">
                             <div>
                                <h4 className="text-lg font-bold text-slate-800">{lead.companyName}</h4>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${
                                        lead.status === LeadStatus.NEW ? 'bg-blue-100 text-blue-700' :
                                        lead.status === LeadStatus.CONVERTED ? 'bg-green-100 text-green-700' :
                                        'bg-slate-100 text-slate-600'
                                    }`}>
                                        {lead.status}
                                    </span>
                                    <span className="text-xs text-slate-400">{new Date(lead.createdAt).toLocaleDateString('pt-PT')}</span>
                                </div>
                             </div>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row gap-3 text-sm text-slate-500">
                                <span className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg"><UserIcon size={14}/> {lead.name}</span>
                                <span className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg"><Mail size={14}/> {lead.email}</span>
                                <span className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg"><Phone size={14}/> {lead.phone}</span>
                        </div>
                        
                        {lead.notes && (
                            <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100 italic">
                                "{lead.notes}"
                            </p>
                        )}
                        
                        <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                            <button onClick={() => openLeadModal(lead)} className="text-slate-500 px-3 py-2 rounded-lg text-sm font-medium hover:bg-slate-100 flex items-center gap-2">
                                <PenSquare size={16}/> Editar
                            </button>
                            {lead.status !== LeadStatus.CONVERTED && (
                                <button onClick={() => convertLead(lead)} className="bg-emerald-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 flex items-center gap-2 shadow-sm">
                                    <CheckCircle size={16}/> Converter
                                </button>
                            )}
                        </div>
                    </div>
                ))}
             </div>
          </div>
      )}

      {/* SUPPORT TAB */}
      {activeTab === 'support' && (
          <div className="space-y-6">
              <div className="flex justify-between items-center">
                 <h3 className="text-lg font-bold text-slate-800">Tickets</h3>
                 <button onClick={() => setShowTicketModal(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm flex items-center gap-2">
                     <Plus size={16} /> Novo
                 </button>
             </div>

             <div className="space-y-4">
                 {tickets.map(ticket => (
                     <div key={ticket.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                         <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                             <div className="flex items-center gap-2">
                                 <span className={`w-2.5 h-2.5 rounded-full ${ticket.status === TicketStatus.OPEN ? 'bg-red-500' : 'bg-emerald-500'}`}></span>
                                 <span className="font-bold text-sm text-slate-700">{ticket.organizationName}</span>
                             </div>
                             <select
                                value={ticket.status}
                                onChange={(e) => onUpdateTicket({...ticket, status: e.target.value as TicketStatus})}
                                className="text-xs bg-white border border-slate-300 rounded px-2 py-1 outline-none text-slate-700"
                             >
                                 {Object.values(TicketStatus).map(s => <option key={s} value={s}>{s}</option>)}
                             </select>
                         </div>
                         <div className="p-4">
                             <div className="mb-4">
                                <div className="flex justify-between items-start">
                                    <h4 className="font-bold text-base text-slate-900">{ticket.subject}</h4>
                                    <span className={`text-[10px] px-2 py-0.5 rounded border uppercase font-bold ${
                                        ticket.priority === Priority.CRITICAL ? 'bg-red-50 text-red-600 border-red-200' :
                                        ticket.priority === Priority.HIGH ? 'bg-orange-50 text-orange-600 border-orange-200' :
                                        'bg-slate-50 text-slate-600 border-slate-200'
                                    }`}>{ticket.priority}</span>
                                </div>
                             </div>
                             
                             <div className="space-y-3 mb-4 bg-slate-50 p-3 rounded-xl border border-slate-100 max-h-60 overflow-y-auto">
                                 {ticket.messages.length === 0 && <p className="text-slate-400 text-sm italic">Sem mensagens.</p>}
                                 {ticket.messages.map(msg => (
                                     <div key={msg.id} className={`flex ${msg.isAdmin ? 'justify-end' : 'justify-start'}`}>
                                         <div className={`max-w-[85%] p-3 rounded-xl text-sm shadow-sm ${
                                             msg.isAdmin 
                                             ? 'bg-blue-600 text-white rounded-tr-none' 
                                             : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'
                                         }`}>
                                             <p className="font-bold text-[10px] opacity-75 mb-1 flex justify-between gap-4">
                                                 {msg.sender}
                                                 <span>{new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                             </p>
                                             <p>{msg.content}</p>
                                         </div>
                                     </div>
                                 ))}
                             </div>
                             <div className="flex gap-2">
                                 <input 
                                    type="text" 
                                    placeholder="Responder..." 
                                    className="flex-1 bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
                                    value={ticketReplies[ticket.id] || ''}
                                    onChange={(e) => setTicketReplies(prev => ({ ...prev, [ticket.id]: e.target.value }))}
                                    onKeyDown={(e) => e.key === 'Enter' && handleReplyTicket(ticket.id)}
                                 />
                                 <button 
                                    onClick={() => handleReplyTicket(ticket.id)}
                                    className="bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-700"
                                 >
                                     Enviar
                                 </button>
                             </div>
                         </div>
                     </div>
                 ))}
             </div>
          </div>
      )}

      {/* ORGANIZATIONS TAB */}
      {activeTab === 'orgs' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
             <div className="relative w-full sm:w-auto sm:flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                    type="text"
                    placeholder="Pesquisar..."
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-800 shadow-sm text-sm bg-white text-slate-800"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
             </div>
             <button onClick={() => openOrgModal()} className="w-full sm:w-auto bg-blue-600 text-white px-4 py-3 rounded-xl text-sm font-bold hover:bg-blue-700 shadow-sm flex justify-center items-center gap-2">
                 <Building size={16}/> Nova Empresa
             </button>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left min-w-[800px]">
                <thead className="bg-slate-50 text-xs font-bold text-slate-500 uppercase border-b border-slate-200">
                    <tr>
                    <th className="px-6 py-4">Empresa</th>
                    <th className="px-6 py-4">Estado</th>
                    <th className="px-6 py-4">Plano</th>
                    <th className="px-6 py-4">Users</th>
                    <th className="px-6 py-4 text-right">Ações</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {filteredOrgs.map(org => {
                    const daysLeft = getDaysLeft(org);
                    const isTrialActive = isTrial(org);
                    return (
                    <tr key={org.id} className={`hover:bg-slate-50 transition-colors ${org.status === OrganizationStatus.SUSPENDED ? 'bg-red-50/30' : ''}`}>
                        <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                            <p className="font-bold text-slate-800">{org.name}</p>
                            {org.status === OrganizationStatus.SUSPENDED && <Lock size={14} className="text-red-500"/>}
                        </div>
                        <p className="text-xs text-slate-400 font-mono">{org.id}</p>
                        </td>
                        <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${
                                org.status === OrganizationStatus.ACTIVE ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                org.status === OrganizationStatus.SUSPENDED ? 'bg-red-50 text-red-600 border-red-100' :
                                'bg-slate-100 text-slate-500 border-slate-200'
                            }`}>
                                {org.status}
                            </span>
                        </td>
                        <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-bold uppercase text-slate-700">{org.plan}</span>
                            {isTrialActive && (
                                <div className="flex items-center gap-1 bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full text-[10px] border border-amber-200 whitespace-nowrap">
                                    <Clock size={10} /> {daysLeft} dias
                                </div>
                            )}
                            {!isTrialActive && org.trialEndsAt && org.plan !== PlanType.ENTERPRISE && (
                                <span className="text-[10px] text-red-500 font-bold">Expirado</span>
                            )}
                        </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">
                        {allUsers.filter(u => u.organizationId === org.id).length} / {org.plan === PlanType.FREE ? org.maxUsers : '∞'}
                        </td>
                        <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                            {org.status === OrganizationStatus.ACTIVE ? (
                                <button onClick={() => setShowSuspendModal(org.id)} className="text-red-500 p-2 hover:bg-red-50 rounded" title="Suspender">
                                    <Ban size={16} />
                                </button>
                            ) : (
                                    <button onClick={() => onUpdateOrg({...org, status: OrganizationStatus.ACTIVE})} className="text-emerald-500 p-2 hover:bg-emerald-50 rounded" title="Reativar">
                                        <CheckCircle size={16} />
                                    </button>
                            )}
                            <button onClick={() => openOrgModal(org)} className="text-blue-600 p-2 hover:bg-blue-50 rounded" title="Editar">
                                <PenSquare size={16} />
                            </button>
                        </div>
                        </td>
                    </tr>
                    )})}
                </tbody>
                </table>
            </div>
          </div>
        </div>
      )}

      {/* USERS TAB */}
      {activeTab === 'users' && (
         <div className="space-y-4">
             <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
                 <div className="relative w-full sm:w-auto sm:flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                        type="text"
                        placeholder="Pesquisar..."
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-800 shadow-sm text-sm bg-white text-slate-800"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                 </div>
                 <button onClick={() => openUserModal()} className="w-full sm:w-auto bg-slate-800 text-white px-4 py-3 rounded-xl text-sm font-bold shadow-sm flex justify-center items-center gap-2">
                     <UserPlus size={16}/> Novo User
                 </button>
              </div>

             <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[700px]">
                        <thead className="bg-slate-50 text-xs font-bold text-slate-500 uppercase border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-4">Nome</th>
                            <th className="px-6 py-4">Org</th>
                            <th className="px-6 py-4">Cargo</th>
                            <th className="px-6 py-4 text-right">Ações</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                        {filteredUsers.map(user => (
                            <tr key={user.id} className="hover:bg-slate-50">
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded bg-slate-200 flex items-center justify-center text-slate-600 font-bold text-xs">
                                        {user.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-medium text-slate-900">{user.name}</p>
                                        <p className="text-xs text-slate-400">{user.email}</p>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-600">
                                {allOrgs.find(o => o.id === user.organizationId)?.name || 'N/A'}
                            </td>
                            <td className="px-6 py-4">
                                <span className="text-xs font-medium bg-slate-100 px-2 py-1 rounded">{user.role}</span>
                            </td>
                            <td className="px-6 py-4 text-right">
                                <div className="flex justify-end items-center gap-2">
                                    <button onClick={() => openUserModal(user)} className="text-slate-400 hover:text-blue-600 p-2"><PenSquare size={16} /></button>
                                    {user.role !== UserRole.SUPER_ADMIN && (
                                        <button onClick={() => onDeleteUser(user.id)} className="text-slate-400 hover:text-red-600 p-2"><Trash2 size={16} /></button>
                                    )}
                                </div>
                            </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
      )}

      {/* MODALS - Common Structure Updated with Mobile Styling */}
      {showOrgModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md animate-in zoom-in-95 duration-200">
                  <h3 className="text-lg font-bold text-slate-800 mb-4">{editingOrg ? 'Editar Empresa' : 'Nova Empresa'}</h3>
                  <div className="space-y-4 mb-6">
                      <div><label className={labelClass}>Nome</label><input type="text" className={inputClass} value={orgForm.name} onChange={(e) => setOrgForm({...orgForm, name: e.target.value})}/></div>
                      <div className="grid grid-cols-2 gap-4">
                          <div><label className={labelClass}>Plano</label><select className={inputClass} value={orgForm.plan} onChange={(e) => setOrgForm({...orgForm, plan: e.target.value as PlanType})}>{Object.values(PlanType).map(p => <option key={p} value={p}>{p}</option>)}</select></div>
                          <div><label className={labelClass}>Estado</label><select className={inputClass} value={orgForm.status} onChange={(e) => setOrgForm({...orgForm, status: e.target.value as OrganizationStatus})}>{Object.values(OrganizationStatus).map(s => <option key={s} value={s}>{s}</option>)}</select></div>
                      </div>
                  </div>
                  <div className="flex justify-end gap-3">
                      <button onClick={() => setShowOrgModal(false)} className="px-4 py-3 rounded-lg text-slate-500 font-bold hover:bg-slate-50">Cancelar</button>
                      <button onClick={handleSaveOrg} className="px-6 py-3 bg-blue-600 text-white rounded-lg font-bold shadow-lg">Guardar</button>
                  </div>
              </div>
          </div>
      )}
      
      {/* Similar structure for User, Lead, Ticket Modals - Just ensuring styles match */}
      {showUserModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md animate-in zoom-in-95 duration-200">
                  <h3 className="text-lg font-bold text-slate-800 mb-4">{editingUser ? 'Editar User' : 'Novo User'}</h3>
                  <div className="space-y-4 mb-6">
                      <div><label className={labelClass}>Nome</label><input type="text" className={inputClass} value={userForm.name} onChange={(e) => setUserForm({...userForm, name: e.target.value})}/></div>
                      <div><label className={labelClass}>Email</label><input type="email" className={inputClass} value={userForm.email} onChange={(e) => setUserForm({...userForm, email: e.target.value})}/></div>
                      <div><label className={labelClass}>Empresa</label><select className={inputClass} value={userForm.organizationId} onChange={(e) => setUserForm({...userForm, organizationId: e.target.value})} disabled={!!editingUser}>{allOrgs.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}</select></div>
                      <div><label className={labelClass}>Cargo</label><select className={inputClass} value={userForm.role} onChange={(e) => setUserForm({...userForm, role: e.target.value as UserRole})}>{Object.values(UserRole).map(r => <option key={r} value={r}>{r}</option>)}</select></div>
                  </div>
                  <div className="flex justify-end gap-3">
                      <button onClick={() => setShowUserModal(false)} className="px-4 py-3 rounded-lg text-slate-500 font-bold hover:bg-slate-50">Cancelar</button>
                      <button onClick={handleSaveUser} className="px-6 py-3 bg-blue-600 text-white rounded-lg font-bold shadow-lg">Guardar</button>
                  </div>
              </div>
          </div>
      )}

      {showLeadModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md animate-in zoom-in-95 duration-200">
                  <h3 className="text-lg font-bold text-slate-800 mb-4">{editingLead ? 'Editar Lead' : 'Nova Lead'}</h3>
                  <div className="space-y-4 mb-6 max-h-[60vh] overflow-y-auto">
                      <div><label className={labelClass}>Empresa</label><input type="text" className={inputClass} value={leadForm.companyName} onChange={(e) => setLeadForm({...leadForm, companyName: e.target.value})}/></div>
                      <div><label className={labelClass}>Contacto</label><input type="text" className={inputClass} value={leadForm.name} onChange={(e) => setLeadForm({...leadForm, name: e.target.value})}/></div>
                      <div className="grid grid-cols-2 gap-4">
                          <div><label className={labelClass}>Email</label><input type="email" className={inputClass} value={leadForm.email} onChange={(e) => setLeadForm({...leadForm, email: e.target.value})}/></div>
                          <div><label className={labelClass}>Telefone</label><input type="text" className={inputClass} value={leadForm.phone} onChange={(e) => setLeadForm({...leadForm, phone: e.target.value})}/></div>
                      </div>
                      <div><label className={labelClass}>Estado</label><select className={inputClass} value={leadForm.status} onChange={(e) => setLeadForm({...leadForm, status: e.target.value as LeadStatus})}>{Object.values(LeadStatus).map(s => <option key={s} value={s}>{s}</option>)}</select></div>
                      <div><label className={labelClass}>Notas</label><textarea className={inputClass} rows={3} value={leadForm.notes} onChange={(e) => setLeadForm({...leadForm, notes: e.target.value})}/></div>
                  </div>
                  <div className="flex justify-end gap-3">
                      <button onClick={() => setShowLeadModal(false)} className="px-4 py-3 rounded-lg text-slate-500 font-bold hover:bg-slate-50">Cancelar</button>
                      <button onClick={handleSaveLead} className="px-6 py-3 bg-blue-600 text-white rounded-lg font-bold shadow-lg">Guardar</button>
                  </div>
              </div>
          </div>
      )}

      {showTicketModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md animate-in zoom-in-95 duration-200">
                  <h3 className="text-lg font-bold text-slate-800 mb-4">Novo Ticket</h3>
                  <div className="space-y-4 mb-6">
                      <div><label className={labelClass}>Empresa</label><select className={inputClass} value={ticketForm.orgId} onChange={(e) => setTicketForm({...ticketForm, orgId: e.target.value})}><option value="">Selecione...</option>{allOrgs.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}</select></div>
                      <div><label className={labelClass}>Assunto</label><input type="text" className={inputClass} value={ticketForm.subject} onChange={(e) => setTicketForm({...ticketForm, subject: e.target.value})}/></div>
                      <div><label className={labelClass}>Prioridade</label><select className={inputClass} value={ticketForm.priority} onChange={(e) => setTicketForm({...ticketForm, priority: e.target.value as Priority})}>{Object.values(Priority).map(p => <option key={p} value={p}>{p}</option>)}</select></div>
                      <div><label className={labelClass}>Mensagem</label><textarea className={inputClass} rows={4} value={ticketForm.message} onChange={(e) => setTicketForm({...ticketForm, message: e.target.value})}/></div>
                  </div>
                  <div className="flex justify-end gap-3">
                      <button onClick={() => setShowTicketModal(false)} className="px-4 py-3 rounded-lg text-slate-500 font-bold hover:bg-slate-50">Cancelar</button>
                      <button onClick={handleSaveTicket} disabled={!ticketForm.orgId || !ticketForm.subject} className="px-6 py-3 bg-blue-600 text-white rounded-lg font-bold shadow-lg disabled:opacity-50">Criar</button>
                  </div>
              </div>
          </div>
      )}
      
      {showSuspendModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm animate-in zoom-in-95 duration-200">
                  <div className="flex items-center gap-3 text-red-600 mb-4">
                      <AlertTriangle size={24} />
                      <h3 className="text-lg font-bold">Suspender</h3>
                  </div>
                  <p className="text-slate-600 mb-4 text-sm">Tem certeza? O acesso será bloqueado.</p>
                  <label className={labelClass}>Motivo</label>
                  <select className={inputClass + " mb-6"} value={suspensionReason} onChange={(e) => setSuspensionReason(e.target.value as SuspensionReason)}>{Object.values(SuspensionReason).map(r => <option key={r} value={r}>{r}</option>)}</select>
                  <div className="flex justify-end gap-3">
                      <button onClick={() => setShowSuspendModal(null)} className="px-4 py-2 text-slate-500 font-bold rounded-lg">Cancelar</button>
                      <button onClick={handleSuspendOrg} className="px-4 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700">Confirmar</button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};
