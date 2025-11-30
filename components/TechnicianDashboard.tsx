
import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { ServiceOrder, ServiceStatus, User } from '../types';
import { CheckCircle, Clock, Star, TrendingUp, Calendar } from 'lucide-react';

interface TechnicianDashboardProps {
  orders: ServiceOrder[];
  currentUser: User;
}

export const TechnicianDashboard: React.FC<TechnicianDashboardProps> = ({ orders, currentUser }) => {
  // Filter orders for this technician
  const myOrders = orders.filter(o => 
      o.technicianName.includes(currentUser.name) || 
      (o.assistantTechnicianName && o.assistantTechnicianName.includes(currentUser.name))
  );

  // Stats Logic
  const completedOrders = myOrders.filter(o => o.status === ServiceStatus.DONE);
  
  // Calculate Avg Duration in Hours
  const totalDurationMs = completedOrders.reduce((acc, curr) => {
      if (curr.actualStartTime && curr.actualEndTime) {
          return acc + (new Date(curr.actualEndTime).getTime() - new Date(curr.actualStartTime).getTime());
      }
      return acc;
  }, 0);
  const avgDurationHrs = completedOrders.length > 0 ? (totalDurationMs / completedOrders.length / (1000 * 60 * 60)).toFixed(1) : '0';

  // Calculate Avg NPS
  const ratedOrders = completedOrders.filter(o => o.npsScore !== undefined);
  const avgNps = ratedOrders.length > 0 
      ? (ratedOrders.reduce((acc, curr) => acc + (curr.npsScore || 0), 0) / ratedOrders.length).toFixed(1) 
      : 'N/A';

  // Weekly Activity Chart Data
  const last7Days = Array.from({length: 7}, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return d;
  });

  const chartData = last7Days.map(date => {
      const dateStr = date.toISOString().split('T')[0];
      const count = completedOrders.filter(o => o.actualEndTime && o.actualEndTime.startsWith(dateStr)).length;
      return {
          name: date.toLocaleDateString('pt-PT', { weekday: 'short' }),
          servicos: count
      };
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Minha Performance</h2>
            <p className="text-slate-500">Bem-vindo, {currentUser.name.split(' ')[0]}. Aqui está o resumo da sua semana.</p>
          </div>
          <div className="text-sm font-bold text-blue-600 bg-blue-50 px-4 py-2 rounded-lg border border-blue-100 flex items-center gap-2">
             <Calendar size={16} /> Semana Atual
          </div>
      </div>
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Serviços Realizados</p>
            <p className="text-4xl font-extrabold text-slate-800 mt-2">{completedOrders.length}</p>
          </div>
          <div className="p-4 bg-emerald-50 rounded-2xl text-emerald-600 border border-emerald-100">
            <CheckCircle size={32} />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tempo Médio / Obra</p>
            <p className="text-4xl font-extrabold text-blue-600 mt-2">{avgDurationHrs}<span className="text-lg font-bold text-slate-400">h</span></p>
          </div>
          <div className="p-4 bg-blue-50 rounded-2xl text-blue-600 border border-blue-100">
            <Clock size={32} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">NPS Médio</p>
            <p className="text-4xl font-extrabold text-amber-500 mt-2">{avgNps}<span className="text-lg font-bold text-slate-400">/10</span></p>
          </div>
          <div className="p-4 bg-amber-50 rounded-2xl text-amber-500 border border-amber-100">
            <Star size={32} fill="currentColor" />
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-96">
          <h3 className="text-lg font-bold mb-6 text-slate-800 flex items-center gap-2">
            <TrendingUp className="text-blue-600" size={20} />
            Atividade Semanal
          </h3>
          <ResponsiveContainer width="100%" height="85%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis dataKey="name" tick={{fontSize: 12, fill: '#64748B'}} axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748B'}} allowDecimals={false} />
              <Tooltip 
                cursor={{fill: '#F1F5F9'}}
                contentStyle={{ borderRadius: '8px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} 
              />
              <Bar dataKey="servicos" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
      </div>

      {/* Recent Feedback */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold mb-4 text-slate-800">Últimas Avaliações</h3>
          <div className="space-y-4">
              {ratedOrders.slice(0, 3).map(order => (
                  <div key={order.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100">
                      <div>
                          <p className="font-bold text-slate-800">{order.customer.name}</p>
                          <p className="text-xs text-slate-500">{new Date(order.actualEndTime || '').toLocaleDateString('pt-PT')}</p>
                      </div>
                      <div className="flex items-center gap-1 font-bold text-amber-500 bg-white px-3 py-1 rounded-full shadow-sm">
                          {order.npsScore} <Star size={12} fill="currentColor"/>
                      </div>
                  </div>
              ))}
              {ratedOrders.length === 0 && <p className="text-slate-400 italic text-sm">Sem avaliações ainda.</p>}
          </div>
      </div>
    </div>
  );
};
