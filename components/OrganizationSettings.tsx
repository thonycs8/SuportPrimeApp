
import React, { useState } from 'react';
import { Organization, User, PlanType, UserRole } from '../types';
import { Check, Shield, Users, CreditCard, Star, Plus } from 'lucide-react';

interface OrganizationSettingsProps {
  organization: Organization;
  users: User[]; // Mock users belonging to this org
  onUpdatePlan: (plan: PlanType) => void;
  onAddUser: (role: UserRole) => void;
  onBack: () => void;
}

export const OrganizationSettings: React.FC<OrganizationSettingsProps> = ({ 
  organization, 
  users: initialUsers, 
  onUpdatePlan,
  onAddUser,
  onBack 
}) => {
  const [users, setUsers] = useState(initialUsers);

  // Pricing Logic
  const USER_PRICE = 20; // 20 Euros per user
  const monthlyTotal = users.length * USER_PRICE;

  const handleAddUserMock = () => {
    // In a real app, this would open a modal form
    alert("Simulação: Novo utilizador (Técnico) adicionado. Custo +20€");
    onAddUser(UserRole.TECHNICIAN);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Gestão da Organização</h2>
            <p className="text-slate-500">Administre sua equipa, plano e faturação.</p>
          </div>
          <button onClick={onBack} className="text-sm text-slate-500 hover:text-slate-800 underline">
            Voltar ao Dashboard
          </button>
      </div>

      {/* Plan Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <CreditCard size={20} className="text-blue-600"/> 
                Subscrição Atual
            </h3>
            
            <div className="flex items-start justify-between bg-slate-50 p-4 rounded-lg border border-slate-200">
                <div>
                    <p className="text-sm font-semibold text-slate-500 uppercase">Plano Ativo</p>
                    <p className="text-2xl font-bold text-slate-900">{organization.plan}</p>
                    {organization.plan === PlanType.FREE && (
                        <p className="text-sm text-amber-600 mt-1 font-medium">Upgrade para desbloquear Calendário e Relatórios.</p>
                    )}
                </div>
                <div className="text-right">
                    <p className="text-sm font-semibold text-slate-500 uppercase">Faturação Mensal Estimada</p>
                    <p className="text-3xl font-bold text-blue-600">{monthlyTotal}€ <span className="text-sm font-normal text-slate-500">/mês</span></p>
                    <p className="text-xs text-slate-400 mt-1">{users.length} utilizadores x {USER_PRICE}€</p>
                </div>
            </div>

            <div className="mt-6 flex gap-4">
                {organization.plan === PlanType.FREE ? (
                    <button 
                        onClick={() => onUpdatePlan(PlanType.PRO)}
                        className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium shadow-lg hover:shadow-blue-500/30 transition-all flex items-center gap-2"
                    >
                        <Star size={16} fill="currentColor" /> Fazer Upgrade para PRO
                    </button>
                ) : (
                    <button className="px-4 py-2 border border-slate-300 text-slate-600 rounded-lg hover:bg-slate-50 font-medium">
                        Gerir Faturação
                    </button>
                )}
            </div>
        </div>

        {/* Limits Card */}
        <div className="bg-slate-900 text-white rounded-xl shadow-lg p-6 relative overflow-hidden">
            <div className="relative z-10">
                <h3 className="text-lg font-bold mb-2">Utilização</h3>
                <div className="space-y-4">
                    <div>
                        <div className="flex justify-between text-sm mb-1">
                            <span className="text-slate-300">Utilizadores</span>
                            <span className="font-bold">{users.length} / {organization.plan === PlanType.FREE ? '1' : 'Ilimitado'}</span>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-2">
                            <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${(users.length / (organization.plan === PlanType.FREE ? 1 : 10)) * 100}%` }}></div>
                        </div>
                    </div>
                </div>
                <div className="mt-8 p-3 bg-white/10 rounded-lg backdrop-blur-sm border border-white/10 text-xs text-slate-300">
                    <p>Adicione mais utilizadores para aumentar a capacidade da sua equipa.</p>
                </div>
            </div>
            <Users size={120} className="absolute -bottom-6 -right-6 text-white/5" />
        </div>
      </div>

      {/* Team Management */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex justify-between items-center">
             <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Users size={20} className="text-slate-500"/> 
                Membros da Equipa
            </h3>
            <button 
                onClick={handleAddUserMock}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2"
            >
                <Plus size={16} /> Adicionar Membro (+20€)
            </button>
        </div>
        
        <table className="w-full text-left">
            <thead className="bg-slate-50 text-xs font-bold text-slate-500 uppercase">
                <tr>
                    <th className="px-6 py-4">Nome</th>
                    <th className="px-6 py-4">Função</th>
                    <th className="px-6 py-4">Email</th>
                    <th className="px-6 py-4 text-right">Ações</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
                {users.map(u => (
                    <tr key={u.id} className="hover:bg-slate-50/50">
                        <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded bg-slate-200 flex items-center justify-center text-slate-600 font-bold text-xs">
                                    {u.name.charAt(0)}
                                </div>
                                <span className="font-medium text-slate-900">{u.name}</span>
                            </div>
                        </td>
                        <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-medium border ${
                                u.role === UserRole.MANAGER || u.role === UserRole.DIRECTOR ? 'bg-purple-50 text-purple-700 border-purple-100' :
                                u.role === UserRole.TECHNICIAN ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                'bg-slate-50 text-slate-600 border-slate-200'
                            }`}>
                                {u.role === UserRole.MANAGER && <Shield size={10} />}
                                {u.role}
                            </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-500">{u.email}</td>
                        <td className="px-6 py-4 text-right">
                             <button className="text-slate-400 hover:text-blue-600 text-sm font-medium">Editar</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
      </div>
    </div>
  );
};
