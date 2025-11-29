import React, { useState } from 'react';
import { ServiceOrder, ServiceStatus, Priority, ServiceImage } from '../types';
import { SignaturePad } from './SignaturePad';
import { Save, X, Plus, Trash2, Camera, FileText, User, MapPin, Zap, Calendar as CalIcon, Users, PenTool } from 'lucide-react';

interface ServiceOrderFormProps {
  order: ServiceOrder;
  onSave: (order: ServiceOrder) => void;
  onCancel: () => void;
}

export const ServiceOrderForm: React.FC<ServiceOrderFormProps> = ({ order: initialOrder, onSave, onCancel }) => {
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
    { id: 'info', label: 'Dados da Obra', icon: Zap },
    { id: 'execution', label: 'Relatório Técnico', icon: FileText },
    { id: 'photos', label: 'Evidências', icon: Camera },
    { id: 'signatures', label: 'Validação', icon: PenTool },
  ];

  // Estilo comum para inputs cinza claro com texto escuro
  const inputClass = "w-full rounded bg-slate-50 border-slate-300 border p-2.5 text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 transition-colors font-medium placeholder:text-slate-400";
  const labelClass = "block text-xs font-bold text-slate-500 uppercase mb-1 tracking-wide";

  return (
    <div className="bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col h-full max-h-[90vh] md:max-h-full">
      {/* Technical Header */}
      <div className="bg-slate-900 text-white p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h2 className="text-xl font-bold tracking-tight">OS: {order.processNumber}</h2>
            <span className={`text-xs px-2 py-0.5 rounded uppercase font-bold tracking-wider ${
              order.priority === Priority.CRITICAL ? 'bg-red-500 text-white' :
              order.priority === Priority.HIGH ? 'bg-orange-500 text-white' :
              'bg-blue-500 text-white'
            }`}>
              {order.priority}
            </span>
          </div>
          <p className="text-slate-400 text-sm flex items-center gap-2">
            <Users size={14} /> 
            Resp: {order.technicianName}
          </p>
        </div>
        <div className="flex gap-3">
           <button
            onClick={onCancel}
            className="px-4 py-2 text-slate-300 hover:text-white border border-slate-600 hover:border-slate-400 rounded-lg transition-all flex items-center gap-2"
          >
            <X size={18} /> Cancelar
          </button>
          <button
            onClick={() => onSave(order)}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-900/50 transition-all font-medium flex items-center gap-2"
          >
            <Save size={18} /> Guardar
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 bg-slate-50 overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-6 py-4 text-sm font-semibold whitespace-nowrap transition-all border-b-2 ${
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

      {/* Content Area */}
      <div className="p-6 md:p-8 overflow-y-auto flex-1 bg-slate-50/50">
        {activeTab === 'info' && (
          <div className="space-y-8">
            {/* Equipa Técnica Section */}
            <section className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Users size={16} /> Equipa e Planeamento
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                  <select
                    value={order.status}
                    onChange={(e) => handleChange('status', e.target.value)}
                    className={inputClass}
                  >
                    {Object.values(ServiceStatus).map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
            </section>

            {/* Cliente Section */}
            <section className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <User size={16} /> Dados do Cliente
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  />
                </div>
                 <div className="md:col-span-2">
                  <label className={labelClass}>Local do Serviço</label>
                  <div className="relative">
                    <MapPin size={18} className="absolute left-3 top-2.5 text-slate-400" />
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
                    className={`${inputClass} h-24 resize-none`}
                  />
                </div>
                <div className="space-y-4">
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
                            type="text"
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
             <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
                <label className="block text-sm font-bold text-slate-700 mb-2">Âmbito do Serviço</label>
                <textarea
                  value={order.scope}
                  onChange={(e) => handleChange('scope', e.target.value)}
                  className="w-full rounded bg-slate-50 border-slate-300 border p-4 h-24 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-slate-900 focus:bg-white transition-colors"
                  placeholder="Instruções de trabalho..."
                />
            </div>

            <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
                <label className="block text-sm font-bold text-slate-800 mb-2">Relatório Técnico Detalhado</label>
                <textarea
                  value={order.report}
                  onChange={(e) => handleChange('report', e.target.value)}
                  className="w-full rounded bg-slate-50 border-slate-300 border p-4 h-64 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm leading-relaxed text-slate-900 focus:bg-white transition-colors"
                  placeholder="Descreva todas as intervenções, medições e peças substituídas..."
                />
            </div>

            <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
                <label className="block text-sm font-bold text-slate-700 mb-2">Observações / Pendências</label>
                <textarea
                  value={order.observations}
                  onChange={(e) => handleChange('observations', e.target.value)}
                  className="w-full rounded bg-slate-50 border-slate-300 border p-4 h-24 text-sm text-slate-900 focus:bg-white transition-colors"
                  placeholder="Notas importantes para o cliente ou reagendamento..."
                />
            </div>
          </div>
        )}

        {activeTab === 'photos' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                    <Camera size={24} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-800">Registo Fotográfico</h3>
                    <p className="text-xs text-slate-500">Documentação visual do antes e depois.</p>
                  </div>
              </div>
              <label className="cursor-pointer px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2 shadow-sm font-medium">
                <Plus size={18} />
                Adicionar Fotos
                <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} />
              </label>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {order.images.map((img) => (
                <div key={img.id} className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden group hover:shadow-lg transition-all">
                  <div className="aspect-video relative bg-slate-100">
                    <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
                    <button 
                      onClick={() => removeImage(img.id)}
                      className="absolute top-2 right-2 p-2 bg-red-600/90 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"
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
                      placeholder="Ex: Quadro elétrico aberto..."
                      className="w-full text-sm border-b border-slate-200 focus:border-blue-500 focus:outline-none py-1 text-slate-700 bg-transparent"
                    />
                  </div>
                </div>
              ))}
              {order.images.length === 0 && (
                  <div className="col-span-full py-16 text-center text-slate-400 border-2 border-dashed border-slate-300 rounded-xl bg-slate-50">
                      <Camera size={48} className="mx-auto mb-3 opacity-50" />
                      <p className="font-medium">Nenhuma evidência fotográfica carregada</p>
                  </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'signatures' && (
          <div className="space-y-6">
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg flex items-start gap-3">
                <div className="mt-1 text-blue-600"><FileText size={20}/></div>
                <div className="text-sm text-slate-600">
                    <p className="font-semibold text-slate-800">Termo de Responsabilidade</p>
                    <p>Ao assinar este documento digital, o cliente confirma a execução dos serviços descritos e a receção dos equipamentos em bom estado, salvo indicação em contrário nas observações.</p>
                </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                 <SignaturePad 
                    label="Técnico Responsável" 
                    onSave={(data) => handleChange('technicianSignature', data)}
                    existingSignature={order.technicianSignature}
                />
                <p className="mt-2 text-xs text-slate-400 text-center uppercase tracking-widest">{order.technicianName}</p>
              </div>
              
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                 <SignaturePad 
                    label="Cliente / Responsável" 
                    onSave={(data) => handleChange('customerSignature', data)}
                    existingSignature={order.customerSignature}
                />
                <p className="mt-2 text-xs text-slate-400 text-center uppercase tracking-widest">{order.customer.name}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};