
import React, { useState } from 'react';
import { ServiceOrder, ServiceStatus, Priority, ServiceImage } from '../types';
import { SignaturePad } from './SignaturePad';
import { Save, X, Plus, Trash2, Camera, FileText, User, MapPin, Zap, Calendar as CalIcon, Users, PenTool, Printer, ChevronLeft } from 'lucide-react';

interface ServiceOrderFormProps {
  order: ServiceOrder;
  onSave: (order: ServiceOrder) => void;
  onCancel: () => void;
  onPrint?: () => void;
}

export const ServiceOrderForm: React.FC<ServiceOrderFormProps> = ({ order: initialOrder, onSave, onCancel, onPrint }) => {
  const [order, setOrder] = useState<ServiceOrder>(initialOrder);
  const [activeTab, setActiveTab] = useState<'info' | 'execution' | 'photos' | 'signatures'>('info');

  const handleChange = (field: keyof ServiceOrder, value: any) => {
    setOrder(prev => ({ ...prev, [field]: value }));
  };

  const handleCustomerChange = (field: keyof typeof order.customer, value: string) => {
    setOrder(prev => ({
      ...prev,
      customer: { ...prev.customer, [field]: value }
    }));
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

  const tabs = [
    { id: 'info', label: 'Dados', icon: Zap },
    { id: 'execution', label: 'Relatório', icon: FileText },
    { id: 'photos', label: 'Fotos', icon: Camera },
    { id: 'signatures', label: 'Assinar', icon: PenTool },
  ];

  // Mobile First Input Style: White background, Dark Text, Larger touch target
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
                  order.priority === Priority.CRITICAL ? 'bg-red-500 text-white' :
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

      {/* Scrollable Tabs */}
      <div className="sticky top-[120px] md:top-0 z-20 bg-slate-50 border-b border-slate-200 overflow-x-auto hide-scrollbar">
        <div className="flex md:grid md:grid-cols-4 w-full min-w-max md:min-w-0">
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
            {/* Equipa Técnica Section */}
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
                  <label className={labelClass}>Data Início</label>
                  <input
                    type="datetime-local"
                    value={order.startDate.slice(0, 16)}
                    onChange={(e) => handleChange('startDate', new Date(e.target.value).toISOString())}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Data Fim</label>
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
                        onChange={(e) => handleChange('status', e.target.value)}
                        className={inputClass}
                    >
                        {Object.values(ServiceStatus).map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            </section>

            {/* Cliente Section */}
            <section className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2 pb-2 border-b border-slate-100">
                <User size={14} /> Dados do Cliente
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
      </div>
    </div>
  );
};
