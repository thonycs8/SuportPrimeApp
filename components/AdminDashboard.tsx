import React, { useState, useMemo, useEffect } from 'react';
import { Organization, User, PlanType, UserRole, OrganizationStatus, SuspensionReason, Lead, LeadStatus, SupportTicket, TicketStatus, Priority } from '../types';
import { 
  Shield, Building, Users, Search, AlertTriangle, UserPlus, 
  CheckCircle, TrendingUp, MessageSquare, Ban, Lock, PenSquare, 
  Clock, Plus, LayoutGrid, User as UserIcon, Trash2, Eye, Upload,
  DollarSign, Briefcase, ChevronDown, Package
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area
} from 'recharts';
import { DataImport } from './DataImport';

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
  onExtendTrial: (orgId: string, days: number) => void;
  onImpersonate: (orgId: string) => void;
  onImportData: (type: 'leads' | 'orders', data: any[]) => void;
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
  onAddUser,
  onExtendTrial,
  onImpersonate,
  onImportData
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'crm' | 'orgs' | 'support' | 'users'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [showImportModal, setShowImportModal] = useState(false);
  
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

  // --- PRICING LOGIC ---
  const calculatePackagePrice = (users: number, plan: PlanType) => {
      let basePrice = 0;
      if (plan === PlanType.PRO) basePrice = 20; // per user
      if (plan === PlanType.ENTERPRISE) basePrice = 35; // per user

      // Bulk Discounts simulation
      if (users >= 50) basePrice *= 0.7; // 30% off
      else if (users >= 25) basePrice *= 0.8; // 20% off
      else if (users >= 10) basePrice *= 0.9; // 10% off
      
      return Math.round(basePrice * users);
  };

  // --- CALCULATED STATS ---
  const stats = useMemo(() => {
      let revenue = 0;
      allOrgs.forEach(org => {
          // Rough estimate based on maxUsers as 'active plan' capacity
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

  // Auto-calculate value when plan/users change
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
          
          // 1. Create Organization
          const newOrg: Organization = {
              id: `org-${Math.random().toString(36).substr(2, 5)}`,
              name: lead.companyName,
              nif: lead.nif,
              plan: plan,
              maxUsers: users,
              activeUsers: 1, // The manager
              status: OrganizationStatus.ACTIVE,
              joinedAt: new Date().toISOString(),
              trialEndsAt: new Date(Date.now() + (15 * 86400000)).toISOString() // Give Trial
          };
          onAddOrg(newOrg);

          // 2. Create User (Manager)
          const newUser: User = {
              id: `u-${Math.random().toString(36).substr(2, 5)}`,
              name: lead.name,
              email: lead.email,
              role: UserRole.MANAGER,
              organizationId: newOrg.id
          };
          onAddUser(newUser);

          // 3. Update Lead Status
          onUpdateLead({ ...lead, status: LeadStatus.CONVERTED, probability: 100 });
          alert('Cliente ativado com sucesso! Dados migrados para Empresas e Utilizadores.');
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

  // ... (Other handlers like Org/User Modals) ...
  const openOrgModal = (org?: Organization) => {
      setEditingOrg(org || null);
      if (org) { setOrgForm({ ...org }); } 
      else { setOrgForm({ name: '', plan: PlanType.FREE, status: OrganizationStatus.ACTIVE, maxUsers: 1 }); }
      setShowOrgModal(true);
  };
  const handleSaveOrg = () => {
      if (editingOrg) onUpdateOrg({...editingOrg, ...orgForm} as Organization);
      else onAddOrg({...orgForm, id: `org-${Math.random()}`, status: OrganizationStatus.ACTIVE} as Organization);
      setShowOrgModal(false);
  };
  const openUserModal = (user?: User) => {
      setEditingUser(user || null);
      if (user) { setUserForm({ ...user }); } 
      else { setUserForm({ name: '', email: '', role: UserRole.MANAGER, organizationId: allOrgs[1]?.id || '' }); }
      setShowUserModal(true);
  };
  const handleSaveUser = () => {
      if (editingUser) onUpdateUser({...editingUser, ...userForm} as User);
      else onAddUser({...userForm, id: `u-${Math.random()}`} as User);
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
                    <button onClick={() => setShowImportModal(true)} className="flex-1 sm:flex-none flex items-center justify-center gap-2 text-sm font-bold text-slate-600 bg-white border border-slate-200 px-4 py-2 rounded-lg hover:bg-slate-50">
                        <Upload size={16} /> Importar
                    </button>
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
      
      {/* Orgs, Users, Support Tabs reused from standard blocks if needed, here we focus on CRM */}
      {/* ... Existing Orgs/Users/Support render logic ... */}
      
      {showImportModal && <DataImport onClose={() => setShowImportModal(false)} onImport={onImportData} />}
    </div>
  );
};