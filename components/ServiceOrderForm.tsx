
import React, { useState } from 'react';
import { ServiceOrder, ServiceStatus, Priority, ServiceImage, User, ChecklistItem } from '../types';
import { SignaturePad } from './SignaturePad';
import { Save, X, Plus, Trash2, Camera, FileText, User as UserIcon, MapPin, Zap, Users, PenTool, Printer, ChevronLeft, Play, Square, Clock, Star, History, ListChecks, ShieldCheck } from 'lucide-react';

interface ServiceOrderFormProps {
  order: ServiceOrder;
  onSave: (order: ServiceOrder) => void;
  onCancel: () => void;
  onPrint?: () => void;
  currentUser?: User | null;
}

export const ServiceOrderForm: React.FC<ServiceOrderFormProps> = ({ order: initialOrder, onSave, onCancel, onPrint, currentUser }) => {
  const [order, setOrder] = useState<ServiceOrder>(initialOrder);
  const [activeTab, setActiveTab] = useState<'info' | 'execution' | 'photos' | 'checklist' | 'signatures' | 'history'>('info');

  const handleChange = (field: keyof ServiceOrder, value: any) => {
    setOrder(prev => ({ ...prev, [field]: value }));
  };

  const handleCustomerChange = (field: keyof typeof order.customer, value: string) => {
    setOrder(prev => ({
      ...prev,
      customer: { ...prev.customer, [field]: value }
    }));
  };

  const handleStatusChange = (newStatus: ServiceStatus) => {
      if (newStatus !== order.status) {
          setOrder(prev => ({
              ...prev,
              status: newStatus,
              statusHistory: [
                  ...(prev.statusHistory || []),
                  {
                      status: newStatus,
                      timestamp: new Date().toISOString(),
                      updatedBy: currentUser?.name || 'Utilizador'
                  }
              ]
          }));
      }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages: ServiceImage[] = Array.from(e.target.files).map((file: File) => ({
        id: Math.random().toString(36).substr(2, 9),
        url: URL.createObjectURL(file),
        name: file.name,
        description: ''
      }));
      setOrder(prev => ({ ...prev, images: [...prev.images, ...newImages] }));
    }
  };

  const updateImageDescription = (id: string, description: string) => {
    setOrder(prev => ({
      ...prev,
      images: prev.images.map(img => img.id === id ? { ...img, description } : img)
    }));
  };

  const removeImage = (id: string) => {
    setOrder(prev => ({
      ...prev,
      images: prev.images.filter(img => img.id !== id)
    }));
  };

  const toggleChecklistItem = (itemId: string) => {
      if (!order.checklist) return;
      const updatedChecklist = order.checklist.map(item => 
          item.id === itemId ? { ...item, checked: !item.checked } : item
      );
      setOrder(prev => ({ ...prev, checklist: updatedChecklist }));
  };

  // --- Start/Stop Logic for Technicians ---
  const handleStartJob = () => {
      const newStatus = ServiceStatus.IN_PROGRESS;
      setOrder(prev => ({
          ...prev,
          status: newStatus,
          actualStartTime: new Date().toISOString(),
          statusHistory: [
              ...(prev.statusHistory || []),
              {
                  status: newStatus,
                  timestamp: new Date().toISOString(),
                  updatedBy: currentUser?.name || 'Técnico'
              }
          ]
      }));
  };

  const handleFinishJob = () => {
      if (!order.actualStartTime) {
          alert("Erro: O trabalho não foi iniciado corretamente.");
          return;
      }
      const newStatus = ServiceStatus.DONE;
      setOrder(prev => ({
          ...prev,
          status: newStatus,
          actualEndTime: new Date().toISOString(),
          statusHistory: [
              ...(prev.statusHistory || []),
              {
                  status: newStatus,
                  timestamp: new Date().toISOString(),
                  updatedBy: currentUser?.name || 'Técnico'
              }
          ]
      }));
      setActiveTab('signatures'); 
  };

  const tabs = [
    { id: 'info', label: 'Dados', icon: Zap },
    { id: 'execution', label: 'Relatório', icon: FileText },
    { id: 'checklist', label: 'Checklist', icon: ListChecks }, // New Tab
    { id: 'photos', label: 'Fotos', icon: Camera },
    { id: 'signatures', label: 'Validar', icon: PenTool },
    { id: 'history', label: 'Auditoria', icon: ShieldCheck }, // Renamed to Auditoria
  ];

  const inputClass = "w-full rounded-lg bg-white border border-slate-300 p-3 text-slate-800 shadow-sm focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all font-medium placeholder:text-slate-400 text-base appearance-none";
  const labelClass = "block text-xs font-bold text-slate-500 uppercase mb-1.5 tracking-wide";

  return (
    <div className="bg-white md:rounded-xl shadow-none md:shadow-2xl border-none md:border border-slate-200 overflow-hidden flex flex-col h-full md:h-auto min-h-screen md:min-h-0">
      
      {/* Mobile Sticky Header */}
      <div className="sticky top-0 z-30 bg-slate-900 text-white p-4 shadow-md">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
             <div className="flex items-center gap-3">
                <button onClick={onCancel} className="md:hidden p-1 -ml-1 text-slate-400 hover:text-white">
                    <ChevronLeft size={24} />
                </button>
                <div>
                    <h2 className="text-lg font-bold tracking-tight leading-none">OS: {order.processNumber}</h2>
                    <p className="text-slate-400 text-xs mt-1 flex items-center gap-1">
                        <Users size={12} /> {order.technicianName.split(' ')[0]}
                    </p>
                </div>
             </div>
             <div className="flex items-center gap-2">
                 <span className={`text-[10px] px-2 py-1 rounded-full uppercase font-bold tracking-wider ${
                  order.priority === Priority.CRITICAL ? 'bg-red-50 text-white' :
                  order.priority === Priority.HIGH ? 'bg-orange-500 text-white' :
                  'bg-blue-500 text-white'
                }`}>
                  {order.priority}
                </span>
             </div>
          </div>
          
          {/* Actions Row */}
          <div className="flex gap-2 justify-end">
            <button
                onClick={onCancel}
                className="hidden md:flex px-3 py-2 text-slate-300 hover:text-white border border-slate-600 hover:border-slate-400 rounded-lg transition-all items-center gap-2 text-sm"
            >
                <X size={16} /> Cancelar
            </button>
            {onPrint && (
                <button
                    onClick={onPrint}
                    className="flex-1 md:flex-none justify-center px-3 py-2 text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg transition-all flex items-center gap-2 text-sm font-medium"
                >
                    <Printer size={16} /> <span className="md:inline">PDF</span>
                </button>
            )}
            <button
                onClick={() => onSave(order)}
                className="flex-1 md:flex-none justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-900/50 transition-all font-bold text-sm flex items-center gap-2"
            >
                <Save size={18} /> Guardar
            </button>
          </div>
        </div>
      </div>

      {/* Execution Control Bar */}
      <div className="bg-blue-50 border-b border-blue-100 p-3 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-blue-800">
            <Clock size={18} />
            <span className="text-sm font-bold">Controlo de Tempo:</span>
            <span className="text-sm font-mono bg-white px-2 py-0.5 rounded border border-blue-200">
                {order.actualStartTime 
                    ? new Date(order.actualStartTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) 
                    : '--:--'} 
                {' > '}
                {order.actualEndTime 
                    ? new Date(order.actualEndTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) 
                    : '--:--'}
            </span>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
            {order.status === ServiceStatus.PENDING || order.status === ServiceStatus.RESCHEDULE ? (
                <button onClick={handleStartJob} className="flex-1 sm:flex-none bg-emerald-600 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-emerald-700 flex items-center justify-center gap-2 shadow-sm">
                    <Play size={16} fill="currentColor" /> Iniciar Trabalho
                </button>
            ) : order.status === ServiceStatus.IN_PROGRESS ? (
                <button onClick={handleFinishJob} className="flex-1 sm:flex-none bg-slate-800 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-slate-900 flex items-center justify-center gap-2 shadow-sm animate-pulse">
                    <Square size={16} fill="currentColor" /> Finalizar Trabalho
                </button>
            ) : (
                <span className="text-sm font-bold text-emerald-600 flex items-center gap-1 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div> Serviço Concluído
                </span>
            )}
        </div>
      </div>

      {/* Scrollable Tabs */}
      <div className="sticky top-[120px] md:top-0 z-20 bg-slate-50 border-b border-slate-200 overflow-x-auto hide-scrollbar">
        <div className="flex md:grid md:grid-cols-6 w-full min-w-max md:min-w-0">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 text-sm font-bold whitespace-nowrap transition-all border-b-2 ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-700 bg-white'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100'
              }`}
            >
              <tab.icon size={18} className={activeTab === tab.id ? 'text-blue-600' : 'text-slate-400'} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="p-4 md:p-8 overflow-y-auto flex-1 bg-slate-100">
        {activeTab === 'info' && (
          <div className="space-y-6">
            <section className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2 pb-2 border-b border-slate-100">
                <Users size={14} /> Equipa e Planeamento
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                 <div>
                  <label className={labelClass}>Técnico Responsável</label>
                  <input
                    type="text"
                    value={order.technicianName}
                    onChange={(e) => handleChange('technicianName', e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Técnico Ajudante</label>
                  <input
                    type="text"
                    value={order.assistantTechnicianName || ''}
                    onChange={(e) => handleChange('assistantTechnicianName', e.target.value)}
                    placeholder="Sem ajudante"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Viatura</label>
                  <input
                    type="text"
                    value={order.vehicle}
                    onChange={(e) => handleChange('vehicle', e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Agendado Início</label>
                  <input
                    type="datetime-local"
                    value={order.startDate.slice(0, 16)}
                    onChange={(e) => handleChange('startDate', new Date(e.target.value).toISOString())}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Agendado Fim</label>
                  <input
                    type="datetime-local"
                    value={order.endDate.slice(0, 16)}
                    onChange={(e) => handleChange('endDate', new Date(e.target.value).toISOString())}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Estado Atual</label>
                  <div className="relative">
                    <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(e.target.value as ServiceStatus)}
                        className={inputClass}
                    >
                        {Object.values(ServiceStatus).map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2 pb-2 border-b border-slate-100">
                <UserIcon size={14} /> Dados do Cliente (CRM)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className={labelClass}>Nome da Entidade</label>
                  <input
                    type="text"
                    value={order.customer.name}
                    onChange={(e) => handleCustomerChange('name', e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>NIF</label>
                  <input
                    type="text"
                    value={order.customer.nif}
                    onChange={(e) => handleCustomerChange('nif', e.target.value)}
                    className={inputClass}
                    inputMode="numeric"
                  />
                </div>
                 <div className="md:col-span-2">
                  <label className={labelClass}>Local do Serviço</label>
                  <div className="relative">
                    <MapPin size={18} className="absolute left-3 top-3.5 text-slate-400" />
                    <input
                      type="text"
                      value={order.customer.city}
                      onChange={(e) => handleCustomerChange('city', e.target.value)}
                      className={`${inputClass} pl-10`}
                    />
                  </div>
                </div>
                <div className="md:col-span-1">
                  <label className={labelClass}>Morada Completa</label>
                  <textarea
                    value={order.customer.address}
                    onChange={(e) => handleCustomerChange('address', e.target.value)}
                    className={`${inputClass} min-h-[100px] resize-y`}
                  />
                </div>
                <div className="space-y-5">
                    <div>
                        <label className={labelClass}>Código Postal</label>
                        <input
                            type="text"
                            value={order.customer.postalCode}
                            onChange={(e) => handleCustomerChange('postalCode', e.target.value)}
                            className={inputClass}
                        />
                    </div>
                    <div>
                        <label className={labelClass}>Contactos</label>
                        <input
                            type="tel"
                            value={order.customer.contacts}
                            onChange={(e) => handleCustomerChange('contacts', e.target.value)}
                            className={inputClass}
                        />
                    </div>
                </div>
                {order.customer.contractStatus && (
                    <div className="col-span-full mt-2 p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
                        <div>
                            <p className="text-xs text-slate-500 uppercase font-bold">Contrato</p>
                            <p className="font-bold text-slate-800">{order.customer.contractStatus}</p>
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 uppercase font-bold">SLA</p>
                            <p className="font-bold text-blue-600">{order.customer.slaLevel || 'N/A'}</p>
                        </div>
                    </div>
                )}
              </div>
            </section>
          </div>
        )}

        {activeTab === 'execution' && (
          <div className="space-y-6">
             <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                <label className="block text-sm font-bold text-slate-700 mb-2">Âmbito do Serviço</label>
                <textarea
                  value={order.scope}
                  onChange={(e) => handleChange('scope', e.target.value)}
                  className="w-full rounded-lg bg-white border-slate-300 border p-4 h-32 focus:ring-2 focus:ring-blue-500 shadow-sm text-base text-slate-800 transition-colors placeholder:text-slate-400"
                  placeholder="Descreva o que vai ser feito..."
                />
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                <label className="block text-sm font-bold text-slate-700 mb-2">Relatório Técnico Detalhado</label>
                <textarea
                  value={order.report}
                  onChange={(e) => handleChange('report', e.target.value)}
                  className="w-full rounded-lg bg-white border-slate-300 border p-4 h-64 focus:ring-2 focus:ring-blue-500 shadow-sm font-mono text-base leading-relaxed text-slate-800 transition-colors placeholder:text-slate-400"
                  placeholder="Registo de atividades, medições e materiais..."
                />
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                <label className="block text-sm font-bold text-slate-700 mb-2">Observações / Pendências</label>
                <textarea
                  value={order.observations}
                  onChange={(e) => handleChange('observations', e.target.value)}
                  className="w-full rounded-lg bg-white border-slate-300 border p-4 h-32 text-base text-slate-800 shadow-sm focus:ring-2 focus:ring-blue-500 transition-colors placeholder:text-slate-400"
                  placeholder="Notas finais..."
                />
            </div>
          </div>
        )}

        {/* CHECKLIST TAB - NEW */}
        {activeTab === 'checklist' && (
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <ListChecks size={20} className="text-blue-600"/> 
                    Protocolo de Execução
                </h3>
                {(!order.checklist || order.checklist.length === 0) ? (
                    <div className="text-center py-10 text-slate-400">Nenhuma checklist configurada.</div>
                ) : (
                    <div className="space-y-3">
                        {order.checklist.map(item => (
                            <label key={item.id} className={`flex items-center p-4 rounded-lg border transition-all cursor-pointer ${item.checked ? 'bg-emerald-50 border-emerald-200' : 'bg-white border-slate-200 hover:border-slate-300'}`}>
                                <input 
                                    type="checkbox" 
                                    checked={item.checked} 
                                    onChange={() => toggleChecklistItem(item.id)}
                                    className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500"
                                />
                                <span className={`ml-3 font-medium ${item.checked ? 'text-emerald-800' : 'text-slate-700'}`}>{item.label}</span>
                            </label>
                        ))}
                    </div>
                )}
            </div>
        )}

        {activeTab === 'photos' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white p-5 rounded-xl border border-slate-200 shadow-sm gap-4">
              <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
                    <Camera size={24} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-800">Registo Fotográfico</h3>
                    <p className="text-xs text-slate-500">Adicione fotos do antes e depois.</p>
                  </div>
              </div>
              <label className="cursor-pointer w-full sm:w-auto text-center px-5 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition flex items-center justify-center gap-2 shadow-sm font-bold active:scale-95">
                <Plus size={18} />
                Tirar Foto
                <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} />
              </label>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {order.images.map((img) => (
                <div key={img.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden group">
                  <div className="aspect-video relative bg-slate-100">
                    <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
                    <button 
                      onClick={() => removeImage(img.id)}
                      className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-lg shadow-sm hover:bg-red-700 transition-colors"
                      title="Remover foto"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="p-4">
                    <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Descrição</label>
                    <input
                      type="text"
                      value={img.description}
                      onChange={(e) => updateImageDescription(img.id, e.target.value)}
                      placeholder="Toque para descrever..."
                      className="w-full text-sm border-b border-slate-200 focus:border-blue-500 focus:outline-none py-2 text-slate-800 bg-transparent placeholder:text-slate-300"
                    />
                  </div>
                </div>
              ))}
              {order.images.length === 0 && (
                  <div className="col-span-full py-12 text-center text-slate-400 border-2 border-dashed border-slate-300 rounded-xl bg-slate-50">
                      <Camera size={32} className="mx-auto mb-3 opacity-50" />
                      <p className="font-medium text-sm">Sem fotos adicionadas</p>
                  </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'signatures' && (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-100 p-5 rounded-xl flex items-start gap-3">
                <div className="mt-1 text-blue-600"><FileText size={20}/></div>
                <div className="text-sm text-slate-700">
                    <p className="font-bold text-slate-900 mb-1">Validação do Serviço</p>
                    <p className="leading-relaxed text-xs sm:text-sm">Ao assinar, o cliente confirma a execução dos trabalhos e a receção dos equipamentos, salvo indicação nas observações.</p>
                </div>
            </div>
            
            {/* NPS SURVEY */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm text-center">
                 <h3 className="text-sm font-bold text-slate-800 mb-4">Avaliação do Cliente (NPS)</h3>
                 <p className="text-xs text-slate-500 mb-4">Qual a probabilidade de recomendar os nossos serviços? (0 a 10)</p>
                 <div className="flex flex-wrap justify-center gap-2">
                     {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(score => (
                         <button
                            key={score}
                            onClick={() => handleChange('npsScore', score)}
                            className={`w-8 h-8 md:w-10 md:h-10 rounded-lg text-sm md:text-base font-bold transition-all ${
                                order.npsScore === score 
                                ? 'bg-blue-600 text-white scale-110 shadow-lg' 
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                         >
                             {score}
                         </button>
                     ))}
                 </div>
                 {order.npsScore !== undefined && (
                     <div className="mt-3 text-sm font-medium text-blue-600">
                         Avaliação registada: {order.npsScore}
                     </div>
                 )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-10">
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                 <SignaturePad 
                    label="Técnico Responsável" 
                    onSave={(data) => handleChange('technicianSignature', data)}
                    existingSignature={order.technicianSignature}
                />
                <p className="mt-3 text-xs text-slate-400 text-center uppercase tracking-widest font-bold">{order.technicianName}</p>
              </div>
              
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                 <SignaturePad 
                    label="Cliente / Responsável" 
                    onSave={(data) => handleChange('customerSignature', data)}
                    existingSignature={order.customerSignature}
                />
                <p className="mt-3 text-xs text-slate-400 text-center uppercase tracking-widest font-bold">{order.customer.name}</p>
              </div>
            </div>
          </div>
        )}

        {/* AUDIT LOG / HISTORY - UPDATED */}
        {activeTab === 'history' && (
            <div className="space-y-6">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                        <History size={20} className="text-blue-600"/> 
                        Timeline de Estados
                    </h3>
                    
                    {(!order.statusHistory || order.statusHistory.length === 0) ? (
                        <div className="text-center py-10 text-slate-400 text-sm">Nenhum histórico registado.</div>
                    ) : (
                        <div className="space-y-8 pl-4 border-l-2 border-slate-100 ml-2">
                            {order.statusHistory.slice().reverse().map((entry, index) => (
                                <div key={index} className="relative">
                                    <div className={`absolute -left-[21px] w-4 h-4 rounded-full ring-4 ring-white ${
                                        entry.status === ServiceStatus.DONE ? 'bg-emerald-500' :
                                        entry.status === ServiceStatus.IN_PROGRESS ? 'bg-blue-500' :
                                        'bg-slate-300'
                                    }`}></div>
                                    <div>
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mb-1">
                                            <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase w-fit ${
                                                entry.status === ServiceStatus.DONE ? 'bg-emerald-100 text-emerald-700' :
                                                entry.status === ServiceStatus.IN_PROGRESS ? 'bg-blue-100 text-blue-700' :
                                                'bg-slate-100 text-slate-600'
                                            }`}>
                                                {entry.status}
                                            </span>
                                            <span className="text-xs text-slate-400">
                                                {new Date(entry.timestamp).toLocaleString('pt-PT')}
                                            </span>
                                        </div>
                                        <p className="text-sm text-slate-700">
                                            Alterado por <span className="font-bold">{entry.updatedBy}</span>
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                        <ShieldCheck size={20} className="text-purple-600"/> 
                        Audit Log (Sistema)
                    </h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-xs">
                                <tr>
                                    <th className="px-4 py-2">Data/Hora</th>
                                    <th className="px-4 py-2">Utilizador</th>
                                    <th className="px-4 py-2">Ação</th>
                                    <th className="px-4 py-2">Detalhes</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {order.auditLog?.map(log => (
                                    <tr key={log.id} className="hover:bg-slate-50">
                                        <td className="px-4 py-2 text-slate-500">{new Date(log.timestamp).toLocaleString()}</td>
                                        <td className="px-4 py-2 font-medium">{log.userName}</td>
                                        <td className="px-4 py-2"><span className="bg-slate-100 px-2 py-0.5 rounded text-xs font-bold">{log.action}</span></td>
                                        <td className="px-4 py-2 text-slate-600">{log.details}</td>
                                    </tr>
                                )) || <tr><td colSpan={4} className="px-4 py-4 text-center text-slate-400">Sem registos de auditoria.</td></tr>}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};
