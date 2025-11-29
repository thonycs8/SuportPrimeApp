import React, { useState, useEffect } from 'react';
import { ViewMode, ServiceOrder, ServiceStatus } from './types';
import { generateMockData } from './services/mockData';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { CalendarView } from './components/CalendarView';
import { ServiceOrderForm } from './components/ServiceOrderForm';
import { Search, Filter, Menu, Plus } from 'lucide-react';

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
    o.technicianName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 transform transition-transform duration-200 ease-in-out md:translate-x-0 md:static ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <Sidebar currentView={view} onChangeView={(v) => { setView(v); setIsMobileMenuOpen(false); }} />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header */}
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-4 md:px-8 shrink-0">
          <div className="flex items-center gap-4">
            <button 
              className="p-2 -ml-2 text-slate-600 md:hidden"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu size={24} />
            </button>
            <h1 className="text-xl font-bold text-slate-800 hidden sm:block">
              {view === 'dashboard' ? 'Visão Geral' : 
               view === 'calendar' ? 'Calendário de Serviço' : 
               view === 'list' ? 'Agenda de Ordens' : 'Editar Ordem'}
            </h1>
          </div>

          <div className="flex items-center gap-4">
             {view === 'list' && (
                <div className="relative hidden md:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                        type="text"
                        placeholder="Pesquisar cliente ou processo..."
                        className="pl-10 pr-4 py-2 rounded-full border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
             )}
            <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
              JS
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          
          {view === 'dashboard' && <Dashboard orders={orders} />}

          {view === 'calendar' && <CalendarView orders={orders} onSelectOrder={handleEditOrder} />}

          {view === 'list' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                 <div className="flex gap-2">
                    <button className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 flex items-center gap-2 hover:bg-slate-50">
                        <Filter size={16} /> Filtros
                    </button>
                 </div>
                 <button 
                    onClick={createNewOrder}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-blue-700 shadow-sm"
                 >
                    <Plus size={18} /> Nova Ordem
                 </button>
              </div>

              <div className="grid gap-4">
                {filteredOrders.map(order => (
                  <div 
                    key={order.id} 
                    onClick={() => handleEditOrder(order)}
                    className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all cursor-pointer flex flex-col md:flex-row justify-between gap-4"
                  >
                    <div className="flex-1">
                      <div className="flex items-center justify-between md:justify-start gap-3 mb-2">
                        <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded">{order.processNumber}</span>
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                          order.status === ServiceStatus.DONE ? 'bg-green-100 text-green-700' :
                          order.status === ServiceStatus.PENDING ? 'bg-amber-100 text-amber-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {order.status}
                        </span>
                        {order.priority === 'Alta' || order.priority === 'Crítica' ? (
                            <span className="text-xs font-bold text-red-600 border border-red-200 bg-red-50 px-2 py-1 rounded-full">Prioridade {order.priority}</span>
                        ) : null}
                      </div>
                      <h3 className="font-semibold text-slate-800">{order.customer.name}</h3>
                      <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
                        <span className="w-2 h-2 rounded-full bg-slate-300 inline-block"></span>
                        {order.scope.substring(0, 80)}...
                      </p>
                    </div>
                    
                    <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-2 text-sm text-slate-500 min-w-[150px]">
                      <div className="text-right">
                        <p className="font-medium text-slate-700">{new Date(order.startDate).toLocaleDateString('pt-PT')}</p>
                        <p className="text-xs">{new Date(order.startDate).toLocaleTimeString('pt-PT', {hour: '2-digit', minute:'2-digit'})}</p>
                      </div>
                      <div className="md:mt-2 px-3 py-1 bg-slate-50 rounded text-xs font-medium text-slate-600">
                        {order.technicianName}
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
