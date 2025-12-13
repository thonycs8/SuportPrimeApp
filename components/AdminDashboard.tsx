
import React, { useState, useMemo, useEffect } from 'react';
import { Organization, User, PlanType, UserRole, OrganizationStatus, SuspensionReason, Lead, LeadStatus, SupportTicket, TicketStatus, Priority, Webhook, WebhookEvent } from '../types';
import { 
  Shield, Building, Users, Search, AlertTriangle, 
  CheckCircle, TrendingUp, MessageSquare, Ban, Lock, PenSquare, 
  Clock, Plus, LayoutGrid, User as UserIcon, Trash2, Eye, Upload,
  DollarSign, ChevronDown, Package, Database, Key, Globe, Copy, MessageCircle, Calendar as CalendarIcon, Hash, Zap
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { DataImport } from './DataImport';

interface AdminDashboardProps {
  allOrgs: Organization[];
  allUsers: User[];
  leads: Lead[];
  tickets: SupportTicket[];
  webhooks: Webhook[];
  onUpdateOrg: (org: Organization) => void;
  onUpdateUser: (user: User) => void;
  onDeleteUser: (userId: string) => void;
  onUpdateLead: (lead: Lead) => void;
  onAddLead: (lead: Lead) => void;
  onUpdateTicket: (ticket: SupportTicket) => void;
  onAddTicket: (ticket: SupportTicket) => void;
  onAddOrg: (org: Organization) => void;
  onAddUser: (user: User) => void;
  onExtendTrial: (orgId: string, days: number) => void;
  onImpersonate: (orgId: string) => void;
  onImportData: (type: 'leads' | 'orders', data: any[]) => void;
  onAddWebhook: (webhook: Webhook) => void;
  onDeleteWebhook: (id: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  allOrgs,
  allUsers,
  leads,
  tickets,
  webhooks,
  onUpdateOrg,
  onUpdateUser,
  onDeleteUser,
  onUpdateLead,
  onAddLead,
  onUpdateTicket,
  onAddTicket,
  onAddOrg,
  onAddUser,
  onExtendTrial,
  onImpersonate,
  onImportData,
  onAddWebhook,
  onDeleteWebhook
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'crm' | 'orgs' | 'support' | 'users' | 'integrations'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [showImportModal, setShowImportModal] = useState(false);
  const [apiKey, setApiKey] = useState('sk_live_51Mz...');
  const [showKey, setShowKey] = useState(false);
  
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

  const [ticketReplies, setTicketReplies] = useState<Record<string, string>>({});

  // Webhook State
  const [showWebhookModal, setShowWebhookModal] = useState(false);
  const [webhookForm, setWebhookForm] = useState<{url: string, events: WebhookEvent[]}>({ url: '', events: [] });
  const [channels, setChannels] = useState([
      { id: 'whatsapp', name: 'WhatsApp Business', status: 'active', icon: MessageCircle, color: 'text-green-600', bg: 'bg-green-50' },
      { id: 'google', name: 'Google Calendar', status: 'inactive', icon: CalendarIcon, color: 'text-blue-600', bg: 'bg-blue-50' },
      { id: 'slack', name: 'Slack Notifications', status: 'inactive', icon: Hash, color: 'text-purple-600', bg: 'bg-purple-50' },
      { id: 'zapier', name: 'Zapier', status: 'active', icon: Zap, color: 'text-orange-600', bg: 'bg-orange-50' },
  ]);

  // --- PRICING LOGIC ---
  const calculatePackagePrice = (users: number, plan: PlanType) => {
      let basePrice = 0;
      if (plan === PlanType.PRO) basePrice = 20; 
      if (plan === PlanType.ENTERPRISE) basePrice = 35; 

      if (users >= 50) basePrice *= 0.7; 
      else if (users >= 25) basePrice *= 0.8; 
      else if (users >= 10) basePrice *= 0.9; 
      
      return Math.round(basePrice * users);
  };

  // --- CALCULATED STATS ---
  const stats = useMemo(() => {
      let revenue = 0;
      allOrgs.forEach(org => {
          const price = calculatePackagePrice(org.maxUsers, org.plan);
          revenue += price;
      });

      const pipelineValue = leads.reduce((acc, lead) => acc + (lead.potentialValue || 0), 0);

      return {
          revenue,
          totalOrgs: allOrgs.length,
          activeOrgs: allOrgs.filter(o => o.status === OrganizationStatus.ACTIVE).length,
          totalUsers: allUsers.length,
          openTickets: tickets.filter(t => t.status === TicketStatus.OPEN).length,
          newLeads: leads.filter(l => l.status === LeadStatus.NEW).length,
          pipelineValue
      };
  }, [allOrgs, allUsers, tickets, leads]);

  // --- FILTERING ---
  const filteredOrgs = allOrgs.filter(o => o.name.toLowerCase().includes(searchTerm.toLowerCase()));
  const filteredUsers = allUsers.filter(u => u.name.toLowerCase().includes(searchTerm.toLowerCase()));
  const filteredLeads = leads.filter(l => l.companyName.toLowerCase().includes(searchTerm.toLowerCase()) || l.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const leadStatusColors: Record<LeadStatus, string> = {
      [LeadStatus.NEW]: 'bg-blue-100 text-blue-700 border-blue-200',
      [LeadStatus.CONTACTED]: 'bg-amber-100 text-amber-700 border-amber-200',
      [LeadStatus.QUALIFIED]: 'bg-purple-100 text-purple-700 border-purple-200',
      [LeadStatus.CONVERTED]: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      [LeadStatus.LOST]: 'bg-slate-100 text-slate-600 border-slate-200',
  };

  // --- HANDLERS ---
  const openLeadModal = (lead?: Lead) => {
      setEditingLead(lead || null);
      if (lead) { 
          setLeadForm({ ...lead }); 
      } else { 
          setLeadForm({ 
              name: '', companyName: '', email: '', phone: '', nif: '',
              status: LeadStatus.NEW, notes: '', 
              potentialValue: 100, probability: 10,
              proposedPlan: PlanType.PRO, userCount: 5 
          }); 
      }
      setShowLeadModal(true);
  };

  useEffect(() => {
      if (showLeadModal && leadForm.userCount && leadForm.proposedPlan) {
          const val = calculatePackagePrice(leadForm.userCount, leadForm.proposedPlan);
          setLeadForm(prev => ({ ...prev, potentialValue: val }));
      }
  }, [leadForm.userCount, leadForm.proposedPlan, showLeadModal]);

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
              nif: leadForm.nif,
              status: leadForm.status || LeadStatus.NEW,
              notes: leadForm.notes || '',
              potentialValue: leadForm.potentialValue,
              probability: leadForm.probability,
              proposedPlan: leadForm.proposedPlan || PlanType.PRO,
              userCount: leadForm.userCount || 5
          });
      }
      setShowLeadModal(false);
  };

  const handleConvertLead = (lead: Lead) => {
      const plan = lead.proposedPlan || PlanType.PRO;
      const users = lead.userCount || 5;
      const price = calculatePackagePrice(users, plan);

      if (window.confirm(`Converter "${lead.companyName}" em Cliente Ativo?\n\nPlano: ${plan}\nUtilizadores: ${users}\nValor Mensal: ${price}€`)) {
          
          const newOrgId = `org-${Math.random().toString(36).substr(2, 6)}`;

          // 1. Create Organization
          const newOrg: Organization = {
              id: newOrgId,
              name: lead.companyName,
              nif: lead.nif,
              plan: plan,
              maxUsers: users,
              activeUsers: 1, // Start with 1 user
              status: OrganizationStatus.ACTIVE,
              joinedAt: new Date().toISOString(),
              trialEndsAt: new Date(Date.now() + (15 * 86400000)).toISOString()
          };
          
          // 2. Create User (Manager)
          const newUser: User = {
              id: `u-${Math.random().toString(36).substr(2, 6)}`,
              name: lead.name,
              email: lead.email,
              role: UserRole.MANAGER,
              organizationId: newOrgId,
              avatar: ''
          };

          // 3. Execute Actions
          onAddOrg(newOrg);
          onAddUser(newUser);
          onUpdateLead({ ...lead, status: LeadStatus.CONVERTED, probability: 100 });
          
          alert(`Sucesso! Empresa "${newOrg.name}" criada e utilizador "${newUser.name}" ativado.`);
          setActiveTab('orgs'); // Redirect to Orgs tab
      }
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

  const handleHeaderImpersonate = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const orgId = e.target.value;
      if (orgId && orgId !== 'default') {
          onImpersonate(orgId);
      }
  };

  const openOrgModal = (org?: Organization) => {
      setEditingOrg(org || null);
      if (org) { setOrgForm({ ...org }); } 
      else { setOrgForm({ name: '', plan: PlanType.FREE, status: OrganizationStatus.ACTIVE, maxUsers: 1 }); }
      setShowOrgModal(true);
  };

  const handleSaveOrg = () => {
      if (editingOrg) {
          onUpdateOrg({ ...editingOrg, ...orgForm } as Organization);
      } else {
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

  const openUserModal = (user?: User) => {
      setEditingUser(user || null);
      if (user) { setUserForm({ ...user }); } 
      else { setUserForm({ name: '', email: '', role: UserRole.MANAGER, organizationId: allOrgs.length > 0 ? allOrgs[0].id : '' }); }
      setShowUserModal(true);
  };

  const handleSaveUser = () => {
      if (editingUser) {
          onUpdateUser({ ...editingUser, ...userForm } as User);
      } else {
          onAddUser({
              id: `u-${Math.random().toString(36).substr(2, 5)}`,
              name: userForm.name || 'Novo Utilizador',
              email: userForm.email || '',
              role: userForm.role || UserRole.TECHNICIAN,
              organizationId: userForm.organizationId || (allOrgs.length > 0 ? allOrgs[0].id : '')
          } as User);
      }
      setShowUserModal(false);
  };

  const handleDeleteUser = (id: string) => {
      if(window.confirm('Tem a certeza?')) onDeleteUser(id);
  }

  const handleSuspendOrg = () => {
      if (showSuspendModal) {
          const org = allOrgs.find(o => o.id === showSuspendModal);
          if (org) onUpdateOrg({ ...org, status: OrganizationStatus.SUSPENDED, suspensionReason });
          setShowSuspendModal(null);
      }
  };
  
  const handleRegenerateKey = () => {
      setApiKey(`sk_live_${Math.random().toString(36).substring(2)}_${Date.now()}`);
  }

  // Webhook Functions
  const handleSaveWebhook = () => {
      if(!webhookForm.url) return alert('URL obrigatória');
      
      const newWebhook: Webhook = {
          id: `wh_${Math.random().toString(36).substr(2, 9)}`,
          url: webhookForm.url,
          events: webhookForm.events.length ? webhookForm.events : [WebhookEvent.ORDER_COMPLETED],
          isActive: true,
          secret: `whsec_${Math.random().toString(36).substr(2)}`,
          failureCount: 0
      };
      onAddWebhook(newWebhook);
      setShowWebhookModal(false);
      setWebhookForm({ url: '', events: [] });
  };
  
  const toggleChannel = (id: string) => {
      setChannels(prev => prev.map(c => c.id === id ? {...c, status: c.status === 'active' ? 'inactive' : 'active'} : c));
  };
  
  const testWebhook = (id: string) => {
      alert(`Simulando envio de payload para webhook ${id}...\n\nStatus: 200 OK\nPayload: { "event": "order.created", "data": { ... } }`);
  };

  const getDaysLeft = (org: Organization) => {
      if (!org.trialEndsAt) return 0;
      const end = new Date(org.trialEndsAt);
      const now = new Date();
      const diff = Math.ceil((end.getTime() - now.getTime()) / (1000 * 3600 * 24));
      return diff > 0 ? diff : 0;
  };
  const isTrial = (org: Organization) => org.trialEndsAt ? new Date(org.trialEndsAt) > new Date() : false;

  const inputClass = "w-full p-3 bg-white border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 text-base shadow-sm placeholder:text-slate-400";
  const labelClass = "block text-xs font-bold text-slate-500 uppercase mb-1.5 tracking-wide";

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-24 md:pb-12 px-2 md:px-0">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Shield className="text-red-600" fill="currentColor" size={24}/> 
            Super Admin Owner
          </h2>
          <p className="text-slate-500 text-sm">Painel Principal de Gestão SaaS</p>
        </div>
        
        <div className="flex items-center gap-3">
            <div className="relative">
                <Eye className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                <select 
                    className="pl-10 pr-8 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 focus:ring-2 focus:ring-blue-500 outline-none w-full lg:w-64"
                    onChange={handleHeaderImpersonate}
                    value="default"
                >
                    <option value="default" disabled>Aceder a Ambiente de Cliente...</option>
                    {allOrgs.filter(o => o.status === OrganizationStatus.ACTIVE).map(org => (
                        <option key={org.id} value={org.id}>{org.name}</option>
                    ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
            </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-white rounded-xl shadow-sm border border-slate-200 p-1 overflow-x-auto hide-scrollbar">
          {[
            { id: 'overview', label: 'Visão Geral', icon: LayoutGrid },
            { id: 'crm', label: 'CRM / Pipeline', icon: TrendingUp },
            { id: 'orgs', label: 'Empresas', icon: Building },
            { id: 'users', label: 'Utilizadores', icon: Users },
            { id: 'support', label: 'Suporte', icon: MessageSquare },
            { id: 'integrations', label: 'Integrações & API', icon: Database },
          ].map(tab => (
            <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold transition-all whitespace-nowrap flex-1 justify-center ${
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

      {/* OVERVIEW TAB */}
      {activeTab === 'overview' && (
          <div className="space-y-6 animate-in fade-in duration-500">
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase">Receita Mensal</p>
                        <p className="text-2xl font-bold text-slate-800 mt-1">{stats.revenue}€</p>
                    </div>
                    <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl"><DollarSign size={24}/></div>
                </div>
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase">Pipeline CRM</p>
                        <p className="text-2xl font-bold text-slate-800 mt-1">{stats.pipelineValue}€</p>
                    </div>
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><TrendingUp size={24}/></div>
                </div>
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase">Total Empresas</p>
                        <p className="text-2xl font-bold text-slate-800 mt-1">{stats.totalOrgs}</p>
                    </div>
                    <div className="p-3 bg-purple-50 text-purple-600 rounded-xl"><Building size={24}/></div>
                </div>
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase">Tickets Abertos</p>
                        <p className="text-2xl font-bold text-slate-800 mt-1">{stats.openTickets}</p>
                    </div>
                    <div className="p-3 bg-amber-50 text-amber-600 rounded-xl"><MessageSquare size={24}/></div>
                </div>
             </div>
          </div>
      )}

      {/* CRM TAB - LIST VIEW */}
      {activeTab === 'crm' && (
          <div className="space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
                  <div className="relative w-full sm:w-auto sm:min-w-[300px]">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <input 
                          type="text"
                          placeholder="Pesquisar leads..."
                          className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                      />
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <button onClick={() => openLeadModal()} className="flex-1 sm:flex-none bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 flex items-center justify-center gap-2 shadow-sm">
                        <Plus size={16} /> Novo Lead
                    </button>
                  </div>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                          <thead>
                              <tr className="bg-slate-50 text-xs font-bold text-slate-500 uppercase border-b border-slate-200">
                                  <th className="px-6 py-4">Empresa / Contacto</th>
                                  <th className="px-6 py-4">Estado</th>
                                  <th className="px-6 py-4">Plano Proposto</th>
                                  <th className="px-6 py-4">Valor Mensal</th>
                                  <th className="px-6 py-4">Probabilidade</th>
                                  <th className="px-6 py-4 text-right">Ações</th>
                              </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 text-sm">
                              {filteredLeads.map(lead => (
                                  <tr key={lead.id} className="hover:bg-slate-50/80 transition-colors group">
                                      <td className="px-6 py-3">
                                          <div className="font-bold text-slate-800">{lead.companyName}</div>
                                          <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                                              <UserIcon size={10} /> {lead.name} • {lead.phone}
                                          </div>
                                      </td>
                                      <td className="px-6 py-3">
                                          <span className={`text-xs font-bold px-2 py-1 rounded-full border ${leadStatusColors[lead.status]}`}>
                                              {lead.status}
                                          </span>
                                      </td>
                                      <td className="px-6 py-3">
                                          <div className="flex items-center gap-2">
                                              <span className="text-xs font-bold bg-slate-100 px-2 py-0.5 rounded uppercase">{lead.proposedPlan || 'N/A'}</span>
                                              <span className="text-xs text-slate-500">{lead.userCount || 5} users</span>
                                          </div>
                                      </td>
                                      <td className="px-6 py-3 font-mono font-medium text-slate-700">
                                          {lead.potentialValue ? `${lead.potentialValue}€` : '-'}
                                      </td>
                                      <td className="px-6 py-3">
                                          <div className="flex items-center gap-2">
                                              <div className="w-24 bg-slate-200 h-2 rounded-full overflow-hidden">
                                                  <div 
                                                      className={`h-full rounded-full ${
                                                          (lead.probability || 0) > 75 ? 'bg-emerald-500' : 
                                                          (lead.probability || 0) > 40 ? 'bg-amber-500' : 'bg-slate-400'
                                                      }`} 
                                                      style={{ width: `${lead.probability || 0}%` }}
                                                  ></div>
                                              </div>
                                              <span className="text-xs text-slate-500 font-medium">{lead.probability}%</span>
                                          </div>
                                      </td>
                                      <td className="px-6 py-3 text-right">
                                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                              <button onClick={() => openLeadModal(lead)} className="p-1.5 hover:bg-blue-50 text-slate-400 hover:text-blue-600 rounded">
                                                  <PenSquare size={16} />
                                              </button>
                                              {lead.status !== LeadStatus.CONVERTED && (
                                                  <button onClick={() => handleConvertLead(lead)} className="p-1.5 hover:bg-emerald-50 text-slate-400 hover:text-emerald-600 rounded" title="Converter e Ativar">
                                                      <CheckCircle size={16} />
                                                  </button>
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
                    <th className="px-6 py-4">Plano / Trial</th>
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
                                <button 
                                    onClick={() => onExtendTrial(org.id, 15)}
                                    className="text-[10px] text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded border border-blue-100 hover:bg-blue-100"
                                >
                                    Estender Trial (+15d)
                                </button>
                            )}
                        </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">
                        {allUsers.filter(u => u.organizationId === org.id).length} / {org.plan === PlanType.FREE ? org.maxUsers : '∞'}
                        </td>
                        <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                             {org.status === OrganizationStatus.ACTIVE && (
                                <button 
                                    onClick={() => onImpersonate(org.id)}
                                    className="bg-slate-800 text-white px-3 py-1 rounded text-xs font-bold hover:bg-slate-900 flex items-center gap-1 shadow-sm mr-2"
                                    title="Aceder ao Painel (Supervisão)"
                                >
                                    <Eye size={14} /> Aceder
                                </button>
                             )}
                             
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
      
      {activeTab === 'users' && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                  <h3 className="font-bold text-slate-700">Utilizadores do Sistema</h3>
                  <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                      <input 
                          type="text"
                          placeholder="Buscar utilizador..."
                          className="pl-9 pr-4 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                          onChange={(e) => setSearchTerm(e.target.value)}
                      />
                  </div>
              </div>
              <table className="w-full text-left">
                  <thead className="bg-white text-xs font-bold text-slate-500 uppercase border-b border-slate-200">
                      <tr>
                          <th className="px-6 py-3">Nome</th>
                          <th className="px-6 py-3">Email</th>
                          <th className="px-6 py-3">Função</th>
                          <th className="px-6 py-3">Empresa</th>
                          <th className="px-6 py-3 text-right">Ações</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                      {filteredUsers.map(user => {
                          const userOrg = allOrgs.find(o => o.id === user.organizationId);
                          return (
                              <tr key={user.id} className="hover:bg-slate-50">
                                  <td className="px-6 py-3 font-medium text-slate-800">{user.name}</td>
                                  <td className="px-6 py-3 text-sm text-slate-500">{user.email}</td>
                                  <td className="px-6 py-3 text-xs"><span className="bg-slate-100 px-2 py-1 rounded border border-slate-200">{user.role}</span></td>
                                  <td className="px-6 py-3 text-sm text-blue-600 font-medium">{userOrg?.name || 'N/A'}</td>
                                  <td className="px-6 py-3 text-right">
                                      <button onClick={() => openUserModal(user)} className="text-slate-400 hover:text-blue-600 mr-2"><PenSquare size={16}/></button>
                                      <button onClick={() => onDeleteUser(user.id)} className="text-slate-400 hover:text-red-600"><Trash2 size={16}/></button>
                                  </td>
                              </tr>
                          );
                      })}
                  </tbody>
              </table>
          </div>
      )}

      {/* INTEGRATIONS TAB */}
      {activeTab === 'integrations' && (
          <div className="space-y-6">
              <div className="bg-slate-900 text-white p-6 rounded-xl shadow-lg relative overflow-hidden">
                  <div className="relative z-10">
                      <h3 className="text-xl font-bold flex items-center gap-2 mb-2"><Key size={20} className="text-blue-400"/> Credenciais de API</h3>
                      <p className="text-slate-300 text-sm mb-6 max-w-xl">
                          Utilize esta chave para integrar sistemas externos (ERP, CRM) ou para importar dados de forma programática. Mantenha esta chave segura.
                      </p>
                      
                      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                          <div className="bg-slate-800 p-3 rounded-lg border border-slate-700 font-mono text-sm flex items-center gap-3 w-full sm:w-auto min-w-[300px] justify-between">
                              <span className="text-emerald-400">{showKey ? apiKey : 'sk_live_************************'}</span>
                              <div className="flex gap-2">
                                  <button onClick={() => setShowKey(!showKey)} className="text-slate-400 hover:text-white p-1">
                                      {showKey ? <Eye size={16}/> : <Eye size={16} />}
                                  </button>
                                  <button onClick={() => navigator.clipboard.writeText(apiKey)} className="text-slate-400 hover:text-white p-1">
                                      <Copy size={16}/>
                                  </button>
                              </div>
                          </div>
                          <button onClick={handleRegenerateKey} className="px-4 py-2.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm font-bold border border-slate-600 transition-colors">
                              Gerar Nova Chave
                          </button>
                      </div>
                  </div>
                  <Database size={150} className="absolute -right-6 -bottom-6 text-slate-800 opacity-50" />
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Channels Column */}
                  <div className="lg:col-span-2 space-y-6">
                      <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                          <Globe size={20}/> Canais de Integração
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {channels.map(channel => (
                             <div key={channel.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                                  <div className="flex justify-between items-start mb-4">
                                      <div className={`p-3 rounded-xl ${channel.bg} ${channel.color}`}>
                                          <channel.icon size={24} />
                                      </div>
                                      <button 
                                        onClick={() => toggleChannel(channel.id)}
                                        className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                                            channel.status === 'active' 
                                            ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' 
                                            : 'bg-slate-100 text-slate-500 border border-slate-200'
                                        }`}
                                      >
                                          {channel.status === 'active' ? 'Conectado' : 'Desconectado'}
                                      </button>
                                  </div>
                                  <h4 className="font-bold text-slate-800">{channel.name}</h4>
                                  <p className="text-xs text-slate-500 mt-1">Sincronização bidirecional automática.</p>
                             </div>
                          ))}
                      </div>
                      
                      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                          <div className="flex items-center gap-4 mb-4">
                              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                                  <Upload size={24} />
                              </div>
                              <div>
                                  <h3 className="text-lg font-bold text-slate-800">Importação Manual</h3>
                                  <p className="text-sm text-slate-500">Carregue dados em massa de ficheiros JSON.</p>
                              </div>
                          </div>
                          <button 
                            onClick={() => setShowImportModal(true)}
                            className="w-full py-2.5 border border-blue-600 text-blue-600 font-bold rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
                          >
                              <Upload size={16} /> Abrir Importador
                          </button>
                      </div>
                  </div>

                  {/* Webhooks Column */}
                  <div className="space-y-4">
                      <div className="flex items-center justify-between">
                          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                              <Globe size={20}/> Webhooks
                          </h3>
                          <button 
                              onClick={() => setShowWebhookModal(true)}
                              className="text-xs font-bold bg-slate-800 text-white px-3 py-1.5 rounded-lg hover:bg-slate-700"
                          >
                              + Novo
                          </button>
                      </div>

                      <div className="space-y-3">
                          {webhooks.length === 0 ? (
                              <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 border-dashed text-center text-slate-400 text-sm">
                                  Nenhum webhook configurado.
                              </div>
                          ) : (
                              webhooks.map(wh => (
                                  <div key={wh.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm group">
                                      <div className="flex justify-between items-start mb-2">
                                          <span className="text-[10px] font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-500 truncate max-w-[150px]">{wh.id}</span>
                                          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                              <button onClick={() => testWebhook(wh.id)} className="text-blue-600 hover:bg-blue-50 p-1 rounded" title="Testar Payload">
                                                  <Zap size={14}/>
                                              </button>
                                              <button onClick={() => onDeleteWebhook(wh.id)} className="text-red-600 hover:bg-red-50 p-1 rounded" title="Remover">
                                                  <Trash2 size={14}/>
                                              </button>
                                          </div>
                                      </div>
                                      <p className="font-bold text-slate-800 text-xs truncate mb-2" title={wh.url}>{wh.url}</p>
                                      <div className="flex flex-wrap gap-1">
                                          {wh.events.map(ev => (
                                              <span key={ev} className="text-[9px] bg-purple-50 text-purple-700 px-1.5 py-0.5 rounded border border-purple-100 uppercase font-bold">
                                                  {ev.split('.')[1]}
                                              </span>
                                          ))}
                                      </div>
                                  </div>
                              ))
                          )}
                      </div>
                  </div>
              </div>
          </div>
      )}

      {/* LEAD MODAL */}
      {showLeadModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md animate-in zoom-in-95 duration-200">
                  <h3 className="text-lg font-bold text-slate-800 mb-4">{editingLead ? 'Editar Lead' : 'Novo Lead'}</h3>
                  <div className="space-y-4 mb-6 max-h-[70vh] overflow-y-auto custom-scrollbar pr-1">
                      <div><label className={labelClass}>Empresa</label><input type="text" className={inputClass} value={leadForm.companyName} onChange={(e) => setLeadForm({...leadForm, companyName: e.target.value})}/></div>
                      <div><label className={labelClass}>Contacto Responsável</label><input type="text" className={inputClass} value={leadForm.name} onChange={(e) => setLeadForm({...leadForm, name: e.target.value})}/></div>
                      <div className="grid grid-cols-2 gap-4">
                          <div><label className={labelClass}>Email</label><input type="email" className={inputClass} value={leadForm.email} onChange={(e) => setLeadForm({...leadForm, email: e.target.value})}/></div>
                          <div><label className={labelClass}>Telefone</label><input type="text" className={inputClass} value={leadForm.phone} onChange={(e) => setLeadForm({...leadForm, phone: e.target.value})}/></div>
                      </div>
                      <div><label className={labelClass}>NIF (Opcional)</label><input type="text" className={inputClass} value={leadForm.nif || ''} onChange={(e) => setLeadForm({...leadForm, nif: e.target.value})}/></div>
                      
                      <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 mt-2">
                          <h4 className="text-xs font-bold text-blue-600 uppercase mb-3 flex items-center gap-2"><Package size={14}/> Proposta Comercial</h4>
                          <div className="grid grid-cols-2 gap-4 mb-3">
                              <div>
                                  <label className={labelClass}>Plano</label>
                                  <select className={inputClass} value={leadForm.proposedPlan} onChange={(e) => setLeadForm({...leadForm, proposedPlan: e.target.value as PlanType})}>
                                      <option value={PlanType.PRO}>Pro</option>
                                      <option value={PlanType.ENTERPRISE}>Enterprise</option>
                                  </select>
                              </div>
                              <div>
                                  <label className={labelClass}>Utilizadores</label>
                                  <select className={inputClass} value={leadForm.userCount} onChange={(e) => setLeadForm({...leadForm, userCount: Number(e.target.value)})}>
                                      <option value={5}>5 Users</option>
                                      <option value={10}>10 Users</option>
                                      <option value={25}>25 Users</option>
                                      <option value={50}>50 Users</option>
                                  </select>
                              </div>
                          </div>
                          <div className="flex justify-between items-center text-sm">
                              <span className="text-slate-500 font-medium">Valor Mensal Estimado:</span>
                              <span className="font-bold text-slate-900 text-lg">{leadForm.potentialValue}€</span>
                          </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                          <div><label className={labelClass}>Estado</label><select className={inputClass} value={leadForm.status} onChange={(e) => setLeadForm({...leadForm, status: e.target.value as LeadStatus})}>{Object.values(LeadStatus).map(s => <option key={s} value={s}>{s}</option>)}</select></div>
                          <div><label className={labelClass}>Probabilidade (%)</label><input type="number" className={inputClass} value={leadForm.probability} onChange={(e) => setLeadForm({...leadForm, probability: Number(e.target.value)})}/></div>
                      </div>
                      <div><label className={labelClass}>Notas</label><textarea className={inputClass} value={leadForm.notes} onChange={(e) => setLeadForm({...leadForm, notes: e.target.value})}></textarea></div>
                  </div>
                  <div className="flex justify-end gap-3">
                      <button onClick={() => setShowLeadModal(false)} className="px-4 py-3 rounded-lg text-slate-500 font-bold hover:bg-slate-50">Cancelar</button>
                      <button onClick={handleSaveLead} className="px-6 py-3 bg-blue-600 text-white rounded-lg font-bold shadow-lg">Guardar Lead</button>
                  </div>
              </div>
          </div>
      )}
      
      {showImportModal && <DataImport onClose={() => setShowImportModal(false)} onImport={onImportData} />}
      {showWebhookModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm animate-in zoom-in-95 duration-200">
                  <h3 className="text-lg font-bold text-slate-800 mb-4">Novo Webhook</h3>
                  <div className="space-y-4 mb-6">
                      <div>
                          <label className={labelClass}>Endpoint URL</label>
                          <input 
                              type="url" 
                              placeholder="https://api.seusistema.com/hooks" 
                              className={inputClass} 
                              value={webhookForm.url} 
                              onChange={(e) => setWebhookForm({...webhookForm, url: e.target.value})}
                          />
                      </div>
                      <div>
                          <label className={labelClass}>Eventos</label>
                          <div className="space-y-2">
                              {Object.values(WebhookEvent).map(ev => (
                                  <label key={ev} className="flex items-center p-3 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
                                      <input 
                                          type="checkbox" 
                                          checked={webhookForm.events.includes(ev)}
                                          onChange={(e) => {
                                              if (e.target.checked) setWebhookForm(prev => ({...prev, events: [...prev.events, ev]}));
                                              else setWebhookForm(prev => ({...prev, events: prev.events.filter(x => x !== ev)}));
                                          }}
                                          className="rounded text-blue-600 focus:ring-blue-500"
                                      />
                                      <span className="ml-2 text-sm text-slate-700 font-medium">{ev}</span>
                                  </label>
                              ))}
                          </div>
                      </div>
                  </div>
                  <div className="flex justify-end gap-3">
                      <button onClick={() => setShowWebhookModal(false)} className="px-4 py-2 text-slate-500 font-bold rounded-lg hover:bg-slate-50">Cancelar</button>
                      <button onClick={handleSaveWebhook} className="px-4 py-2 bg-slate-800 text-white font-bold rounded-lg hover:bg-slate-900">Criar</button>
                  </div>
              </div>
          </div>
      )}
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
