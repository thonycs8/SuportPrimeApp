import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { ServiceOrder, ServiceStatus, Priority } from '../types';
import { CheckCircle, Clock, AlertTriangle, Activity } from 'lucide-react';

interface DashboardProps {
  orders: ServiceOrder[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
const PRIORITY_COLORS: Record<Priority, string> = {
  [Priority.LOW]: '#10B981',
  [Priority.NORMAL]: '#3B82F6',
  [Priority.HIGH]: '#F59E0B',
  [Priority.CRITICAL]: '#EF4444',
};

export const Dashboard: React.FC<DashboardProps> = ({ orders }) => {
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

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">Dashboard Geral</h2>
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Total Ordens</p>
            <p className="text-3xl font-bold text-slate-800">{stats.total}</p>
          </div>
          <div className="p-3 bg-blue-50 rounded-full text-blue-600">
            <Activity size={24} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Realizados</p>
            <p className="text-3xl font-bold text-emerald-600">{stats.done}</p>
          </div>
          <div className="p-3 bg-emerald-50 rounded-full text-emerald-600">
            <CheckCircle size={24} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Pendentes</p>
            <p className="text-3xl font-bold text-amber-600">{stats.pending}</p>
          </div>
          <div className="p-3 bg-amber-50 rounded-full text-amber-600">
            <Clock size={24} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Prioridade Alta/Crítica</p>
            <p className="text-3xl font-bold text-red-600">{stats.urgent}</p>
          </div>
          <div className="p-3 bg-red-50 rounded-full text-red-600">
            <AlertTriangle size={24} />
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 h-96">
          <h3 className="text-lg font-semibold mb-4 text-slate-700">Estado das Ordens</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={statusData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tick={{fontSize: 12}} interval={0} />
              <YAxis />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} 
              />
              <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 h-96">
          <h3 className="text-lg font-semibold mb-4 text-slate-700">Distribuição por Prioridade</h3>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={priorityData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => percent > 0 ? `${name} ${(percent * 100).toFixed(0)}%` : ''}
              >
                {priorityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={PRIORITY_COLORS[entry.name as Priority]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={36}/>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
