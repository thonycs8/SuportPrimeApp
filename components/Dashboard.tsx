
import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { ServiceOrder, ServiceStatus, Priority, PlanType } from '../types';
import { CheckCircle, Clock, AlertTriangle, Activity, Lock } from 'lucide-react';

interface DashboardProps {
  orders: ServiceOrder[];
  plan: PlanType;
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];
const PRIORITY_COLORS: Record<Priority, string> = {
  [Priority.LOW]: '#10B981',
  [Priority.NORMAL]: '#3B82F6',
  [Priority.HIGH]: '#F59E0B',
  [Priority.CRITICAL]: '#EF4444',
};

export const Dashboard: React.FC<DashboardProps> = ({ orders, plan }) => {
  const stats = {
    total: orders.length,
    done: orders.filter(o => o.status === ServiceStatus.DONE).length,
    pending: orders.filter(o => o.status === ServiceStatus.PENDING || o.status === ServiceStatus.IN_PROGRESS).length,
    urgent: orders.filter(o => o.priority === Priority.CRITICAL || o.priority === Priority.HIGH).length,
  };

  const statusData = Object.values(ServiceStatus).map(status => ({
    name: status,
    count: orders.filter(o => o.status === status).length
  }));

  const priorityData = Object.values(Priority).map(p => ({
    name: p,
    value: orders.filter(o => o.priority === p).length
  }));

  // Limit content for Free Plan
  const isFree = plan === PlanType.FREE;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Visão Geral Operacional</h2>
          <div className="text-sm text-slate-500 bg-white px-3 py-1 rounded border border-slate-200">
             Última atualização: {new Date().toLocaleTimeString()}
          </div>
      </div>
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Ordens</p>
            <p className="text-3xl font-extrabold text-slate-800 mt-1">{stats.total}</p>
          </div>
          <div className="p-3 bg-blue-50 rounded-xl text-blue-600 border border-blue-100">
            <Activity size={24} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Concluídas</p>
            <p className="text-3xl font-extrabold text-emerald-600 mt-1">{stats.done}</p>
          </div>
          <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600 border border-emerald-100">
            <CheckCircle size={24} />
          </div>
        </div>
        {/* Hiding details for Free Plan */}
        {isFree ? (
             <div className="bg-slate-50 p-6 rounded-xl shadow-inner border border-slate-200 flex items-center justify-center col-span-2 relative overflow-hidden group">
                <div className="text-center z-10">
                    <Lock className="mx-auto text-slate-400 mb-2" size={24}/>
                    <p className="text-sm font-bold text-slate-500">Analytics Avançado</p>
                    <p className="text-xs text-slate-400">Disponível no plano PRO</p>
                </div>
             </div>
        ) : (
            <>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
                <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pendentes</p>
                    <p className="text-3xl font-extrabold text-amber-600 mt-1">{stats.pending}</p>
                </div>
                <div className="p-3 bg-amber-50 rounded-xl text-amber-600 border border-amber-100">
                    <Clock size={24} />
                </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
                <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Críticas</p>
                    <p className="text-3xl font-extrabold text-red-600 mt-1">{stats.urgent}</p>
                </div>
                <div className="p-3 bg-red-50 rounded-xl text-red-600 border border-red-100">
                    <AlertTriangle size={24} />
                </div>
                </div>
            </>
        )}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-96">
          <h3 className="text-lg font-bold mb-6 text-slate-800 flex items-center gap-2">
            <span className="w-1 h-6 bg-blue-600 rounded-full"></span>
            Estado das Ordens
          </h3>
          <ResponsiveContainer width="100%" height="85%">
            <BarChart data={statusData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis dataKey="name" tick={{fontSize: 11, fill: '#64748B'}} interval={0} axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748B'}} />
              <Tooltip 
                cursor={{fill: '#F1F5F9'}}
                contentStyle={{ borderRadius: '8px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} 
              />
              <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        {isFree ? (
            <div className="bg-slate-50 p-6 rounded-xl shadow-inner border border-slate-200 h-96 flex flex-col items-center justify-center relative overflow-hidden">
                <Lock className="text-slate-300 mb-4" size={48}/>
                <h3 className="text-lg font-bold text-slate-500 mb-2">Relatório de Prioridades</h3>
                <p className="text-sm text-slate-400 text-center max-w-xs">
                    Faça upgrade para o plano PRO para visualizar a distribuição de prioridades e tempos de resposta.
                </p>
            </div>
        ) : (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-96">
            <h3 className="text-lg font-bold mb-6 text-slate-800 flex items-center gap-2">
                <span className="w-1 h-6 bg-purple-600 rounded-full"></span>
                Distribuição por Prioridade
            </h3>
            <ResponsiveContainer width="100%" height="85%">
                <PieChart>
                <Pie
                    data={priorityData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                >
                    {priorityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PRIORITY_COLORS[entry.name as Priority]} strokeWidth={0} />
                    ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #E2E8F0' }} />
                <Legend 
                    verticalAlign="bottom" 
                    height={36} 
                    iconType="circle"
                    wrapperStyle={{ fontSize: '12px', fontWeight: 500 }}
                />
                </PieChart>
            </ResponsiveContainer>
            </div>
        )}
      </div>
    </div>
  );
};
