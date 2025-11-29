import React, { useState, useEffect } from 'react';
import { ViewMode, ServiceOrder, ServiceStatus, Priority } from './types';
import { generateMockData } from './services/mockData';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { CalendarView } from './components/CalendarView';
import { ServiceOrderForm } from './components/ServiceOrderForm';
import { Search, Filter, Menu, Plus, Users, MapPin, Calendar, Clock, ChevronRight } from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<ViewMode>('dashboard');
  const [orders, setOrders] = useState<ServiceOrder[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<ServiceOrder | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Initial Data Load
  useEffect(() => {
    const data = generateMockData();
    setOrders(data);
  }, []);

  const handleEditOrder = (order: ServiceOrder) => {
    setSelectedOrder(order);
    setView('edit');
  };

  const handleSaveOrder = (updatedOrder: ServiceOrder) => {
    setOrders(prev => prev.map(o => o.id === updatedOrder.id ? updatedOrder : o));
    setSelectedOrder(null);
    setView('list'); // Return to list view usually better than dashboard
  };

  const createNewOrder = () => {
      // Create a blank order template
      const newOrder: ServiceOrder = {
          id: Math.random().toString(36).substr(2, 9),
          processNumber: `NOVO-${new Date().getFullYear()}`,
          priority: 'Normal' as any,
          technicianName: 'Por Atribuir',
          assistantTechnicianName: '',
          status: ServiceStatus.PENDING,
          channel: 'Telefone',
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
          images: [],
      };
      handleEditOrder(newOrder);
  };

  const filteredOrders = orders.filter(o => 
    o.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.processNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.technicianName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (o.assistantTechnicianName && o.assistantTechnicianName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-slate-100 flex font-sans text-slate-900">
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 transform transition-transform duration-300 cubic-bezier(0.4, 0, 0.2, 1) md:translate-x-0 md:static ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      } border-r border-slate-800 shadow-xl`}>
        <Sidebar currentView={view} onChangeView={(v) => { setView(v); setIsMobileMenuOpen(false); }} />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Top Header */}
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-4 md:px-8 shrink-0 shadow-sm z-20">
          <div className="flex items-center gap-4">
            <button 
              className="p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-lg md:hidden transition-colors"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu size={24} />
            </button>
            <h1 className="text-xl font-bold text-slate-800 hidden sm:block tracking-tight">
              {view === 'dashboard' ? 'Painel de Controlo' : 
               view === 'calendar' ? 'Planeamento' : 
               view === 'list' ? 'Ordens de Serviço' : 'Ficha Técnica'}
            </h1>
          </div>

          <div className="flex items-center gap-4">
             {view === 'list' && (
                <div className="relative hidden md:block group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                    <input 
                        type="text"
                        placeholder="Pesquisar..."
                        className="pl-10 pr-4 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white w-64 transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
             )}
            <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
                <div className="text-right hidden sm:block">
                    <p className="text-sm font-semibold text-slate-800">Admin</p>
                    <p className="text-xs text-slate-500">Gestor de Frota</p>
                </div>
                <div className="h-9 w-9 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-blue-500/30">
                  SP
                </div>
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 custom-scrollbar">
          
          {view === 'dashboard' && <Dashboard orders={orders} />}

          {view === 'calendar' && <CalendarView orders={orders} onSelectOrder={handleEditOrder} />}

          {view === 'list' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                 <div className="flex gap-2">
                    <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 flex items-center gap-2 hover:bg-slate-50 transition-colors shadow-sm">
                        <Filter size={16} /> Filtros Avançados
                    </button>
                    <div className="text-sm text-slate-500 py-2 px-2">
                        {filteredOrders.length} registos encontrados
                    </div>
                 </div>
                 <button 
                    onClick={createNewOrder}
                    className="px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-semibold flex items-center gap-2 hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all"
                 >
                    <Plus size={18} /> Criar Ordem
                 </button>
              </div>

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
                             {/* Team Section */}
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

                             {/* Date Section */}
                             <div className="flex items-center gap-2 mt-1">
                                <Calendar size={14} className="text-slate-400"/>
                                <span className="text-sm font-medium text-slate-700">
                                    {new Date(order.startDate).toLocaleDateString('pt-PT')}
                                </span>
                                <Clock size={14} className="text-slate-400 ml-2"/>
                                <span className="text-sm font-medium text-slate-700">
                                    {new Date(order.startDate).toLocaleTimeString('pt-PT', {hour: '2-digit', minute:'2-digit'})}
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
            </div>
          )}

          {view === 'edit' && selectedOrder && (
            <ServiceOrderForm 
              order={selectedOrder}
              onSave={handleSaveOrder}
              onCancel={() => { setSelectedOrder(null); setView('list'); }}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default App;