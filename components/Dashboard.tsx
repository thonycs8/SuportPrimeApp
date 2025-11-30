
import React, { useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, AreaChart, Area
} from 'recharts';
import { ServiceOrder, ServiceStatus, Priority, PlanType, SLALevel } from '../types';
import { CheckCircle, Clock, AlertTriangle, Activity, Lock, Plus, Users, ClipboardList, TrendingUp, DollarSign, Award } from 'lucide-react';

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
  // --- EMPTY STATE / ONBOARDING ---
  if (orders.length === 0) {
      return (
          <div className="max-w-5xl mx-auto space-y-8 py-8">
              <div className="text-center space-y-4">
                  <h2 className="text-3xl font-bold text-slate-800">Bem-vindo ao SuportPrime! 🚀</h2>
                  <p className="text-slate-500 max-w-2xl mx-auto">
                      O seu ambiente está pronto. Configure a sua equipa e comece a registar ordens de serviço para ver os seus indicadores aqui.
                  </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all group cursor-pointer">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-4 group-hover:scale-110 transition-transform">
                          <Users size={24} />
                      </div>
                      <h3 className="font-bold text-lg text-slate-800 mb-2">1. Adicionar Equipa</h3>
                      <p className="text-sm text-slate-500 mb-4">Registe os seus técnicos e assistentes para atribuir serviços.</p>
                      <button className="text-blue-600 font-bold text-sm flex items-center gap-1">Configurar <Plus size={14}/></button>
                  </div>

                   <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all group cursor-pointer">
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 mb-4 group-hover:scale-110 transition-transform">
                          <ClipboardList size={24} />
                      </div>
                      <h3 className="font-bold text-lg text-slate-800 mb-2">2. Criar Ordem de Serviço</h3>
                      <p className="text-sm text-slate-500 mb-4">Crie o seu primeiro atendimento e agende uma intervenção.</p>
                      <button className="text-purple-600 font-bold text-sm flex items-center gap-1">Criar Nova <Plus size={14}/></button>
                  </div>

                   <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all group cursor-pointer">
                      <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mb-4 group-hover:scale-110 transition-transform">
                          <CheckCircle size={24} />
                      </div>
                      <h3 className="font-bold text-lg text-slate-800 mb-2">3. Executar & Finalizar</h3>
                      <p className="text-sm text-slate-500 mb-4">Utilize a app para recolher assinaturas e fechar a obra.</p>
                      <button className="text-emerald-600 font-bold text-sm flex items-center gap-1">Ver Tutorial <Plus size={14}/></button>
                  </div>
              </div>
          </div>
      );
  }

  // --- PREMIUM METRICS ---
  const stats = useMemo(() => {
      const completed = orders.filter(o => o.status === ServiceStatus.DONE);
      const pending = orders.filter(o => o.status !== ServiceStatus.DONE && o.status !== ServiceStatus.CANCELED);
      
      // Revenue Simulation (Avg Order Value = 150€)
      const revenue = completed.length * 150; 
      
      // SLA Compliance (Simulated logic: Priority Critical must be done in 4h)
      const criticalOrders = completed.filter(o => o.priority === Priority.CRITICAL);
      const slaBreach = criticalOrders.filter(o => {
          const start = new Date(o.startDate).getTime();
          const end = new Date(o.actualEndTime || o.endDate).getTime();
          return (end - start) > (4 * 60 * 60 * 1000);
      }).length;
      const slaCompliance = criticalOrders.length > 0 ? ((criticalOrders.length - slaBreach) / criticalOrders.length * 100) : 100;

      return {
        total: orders.length,
        done: completed.length,
        pending: pending.length,
        urgent: orders.filter(o => o.priority === Priority.CRITICAL || o.priority === Priority.HIGH).length,
        revenue,
        slaCompliance: slaCompliance.toFixed(0)
      };
  }, [orders]);

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Painel Executivo</h2>
            <p className="text-slate-500">Visão 360º da operação técnica.</p>
          </div>
          <div className="flex items-center gap-2">
             <div className="text-xs font-bold bg-blue-50 text-blue-700 px-3 py-1 rounded-lg border border-blue-100 flex items-center gap-2">
                 <Clock size={14}/> Última atualização: {new Date().toLocaleTimeString()}
             </div>
          </div>
      </div>
      
      {/* Executive KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Revenue (Premium) */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col justify-between h-32 relative overflow-hidden group">
          <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <DollarSign size={64} className="text-emerald-600"/>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Receita Estimada (Mês)</p>
            {isFree ? <p className="text-sm text-slate-300 mt-1">Disponível no Pro</p> : 
                <p className="text-3xl font-extrabold text-emerald-600 mt-1">{stats.revenue}€</p>
            }
          </div>
          {!isFree && <div className="text-xs text-emerald-600 font-bold flex items-center gap-1"><TrendingUp size={12}/> +12% vs mês anterior</div>}
        </div>

        {/* Card 2: SLA (Premium) */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col justify-between h-32 relative overflow-hidden group">
           <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Award size={64} className="text-purple-600"/>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Cumprimento de SLA</p>
            <p className="text-3xl font-extrabold text-purple-600 mt-1">{stats.slaCompliance}%</p>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2">
              <div className="bg-purple-600 h-1.5 rounded-full" style={{width: `${stats.slaCompliance}%`}}></div>
          </div>
        </div>

        {/* Card 3: Pending */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col justify-between h-32">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">OS Pendentes</p>
            <p className="text-3xl font-extrabold text-amber-500 mt-1">{stats.pending}</p>
          </div>
          <div className="text-xs text-slate-500">
              {stats.urgent} com prioridade Crítica/Alta
          </div>
        </div>

        {/* Card 4: Efficiency */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col justify-between h-32">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Taxa de Conclusão</p>
            <p className="text-3xl font-extrabold text-blue-600 mt-1">{Math.round((stats.done / (stats.total || 1)) * 100)}%</p>
          </div>
          <div className="text-xs text-slate-500">
              {stats.done} serviços finalizados hoje
          </div>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-96">
          <h3 className="text-lg font-bold mb-6 text-slate-800 flex items-center gap-2">
            <span className="w-1 h-6 bg-blue-600 rounded-full"></span>
            Volume de Serviços (7 Dias)
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
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-96">
            <h3 className="text-lg font-bold mb-6 text-slate-800 flex items-center gap-2">
                <span className="w-1 h-6 bg-purple-600 rounded-full"></span>
                Urgência
            </h3>
            {isFree ? (
                 <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
                     <Lock size={32} className="mb-2"/>
                     <p className="text-sm font-bold">Disponível no Pro</p>
                 </div>
            ) : (
                <ResponsiveContainer width="100%" height="85%">
                    <PieChart>
                    <Pie
                        data={priorityData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
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
            )}
        </div>
      </div>
    </div>
  );
};
