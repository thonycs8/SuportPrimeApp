import React, { useState, useCallback } from 'react';
import { ServiceOrder, ServiceStatus, Priority, ServiceImage } from '../types';
import { SignaturePad } from './SignaturePad';
import { Save, X, Plus, Trash2, Camera, FileText, User, MapPin, Truck, Calendar as CalIcon } from 'lucide-react';

interface ServiceOrderFormProps {
  order: ServiceOrder;
  onSave: (order: ServiceOrder) => void;
  onCancel: () => void;
}

export const ServiceOrderForm: React.FC<ServiceOrderFormProps> = ({ order: initialOrder, onSave, onCancel }) => {
  const [order, setOrder] = useState<ServiceOrder>(initialOrder);
  const [activeTab, setActiveTab] = useState<'info' | 'customer' | 'execution' | 'photos' | 'signatures'>('info');

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
    { id: 'info', label: 'Informações', icon: Truck },
    { id: 'customer', label: 'Cliente', icon: User },
    { id: 'execution', label: 'Execução', icon: FileText },
    { id: 'photos', label: 'Fotos', icon: Camera },
    { id: 'signatures', label: 'Assinaturas', icon: FileText }, // Reusing icon for simplicity
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden flex flex-col h-full max-h-[85vh] md:max-h-full">
      {/* Header */}
      <div className="p-6 border-b border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-50">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            Processo: {order.processNumber}
            <span className={`text-xs px-2 py-1 rounded-full border ${
              order.priority === Priority.CRITICAL ? 'bg-red-100 text-red-700 border-red-200' :
              order.priority === Priority.HIGH ? 'bg-orange-100 text-orange-700 border-orange-200' :
              'bg-blue-100 text-blue-700 border-blue-200'
            }`}>
              {order.priority}
            </span>
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            <span className="font-medium text-slate-700">Técnico:</span> {order.technicianName}
          </p>
        </div>
        <div className="flex gap-2">
           <button
            onClick={onCancel}
            className="px-4 py-2 text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2"
          >
            <X size={18} /> Cancelar
          </button>
          <button
            onClick={() => onSave(order)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2"
          >
            <Save size={18} /> Guardar
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-6 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? 'border-b-2 border-blue-600 text-blue-600 bg-blue-50/50'
                : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50'
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-6 overflow-y-auto flex-1">
        {activeTab === 'info' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Estado</label>
                <select
                  value={order.status}
                  onChange={(e) => handleChange('status', e.target.value)}
                  className="w-full rounded-lg border-slate-300 border p-2 text-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {Object.values(ServiceStatus).map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Prioridade</label>
                <select
                  value={order.priority}
                  onChange={(e) => handleChange('priority', e.target.value)}
                  className="w-full rounded-lg border-slate-300 border p-2 text-slate-800"
                >
                  {Object.values(Priority).map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Canal de Entrada</label>
                <input
                  type="text"
                  value={order.channel}
                  onChange={(e) => handleChange('channel', e.target.value)}
                  className="w-full rounded-lg border-slate-300 border p-2"
                />
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Início do Trabalho</label>
                <input
                  type="datetime-local"
                  value={order.startDate.slice(0, 16)}
                  onChange={(e) => handleChange('startDate', new Date(e.target.value).toISOString())}
                  className="w-full rounded-lg border-slate-300 border p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Fim do Trabalho</label>
                <input
                  type="datetime-local"
                  value={order.endDate.slice(0, 16)}
                  onChange={(e) => handleChange('endDate', new Date(e.target.value).toISOString())}
                  className="w-full rounded-lg border-slate-300 border p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Viatura</label>
                <input
                  type="text"
                  value={order.vehicle}
                  onChange={(e) => handleChange('vehicle', e.target.value)}
                  className="w-full rounded-lg border-slate-300 border p-2"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'customer' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-full">
               <h3 className="text-lg font-semibold text-slate-800 mb-4 border-b pb-2">Dados do Cliente</h3>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nome</label>
              <input
                type="text"
                value={order.customer.name}
                onChange={(e) => handleCustomerChange('name', e.target.value)}
                className="w-full rounded-lg border-slate-300 border p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">NIF</label>
              <input
                type="text"
                value={order.customer.nif}
                onChange={(e) => handleCustomerChange('nif', e.target.value)}
                className="w-full rounded-lg border-slate-300 border p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Contactos</label>
              <input
                type="text"
                value={order.customer.contacts}
                onChange={(e) => handleCustomerChange('contacts', e.target.value)}
                className="w-full rounded-lg border-slate-300 border p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Local do Serviço</label>
              <div className="relative">
                <MapPin size={16} className="absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  value={order.customer.city}
                  onChange={(e) => handleCustomerChange('city', e.target.value)}
                  className="w-full rounded-lg border-slate-300 border p-2 pl-9"
                />
              </div>
            </div>
            <div className="col-span-full md:col-span-1">
              <label className="block text-sm font-medium text-slate-700 mb-1">Morada</label>
              <textarea
                value={order.customer.address}
                onChange={(e) => handleCustomerChange('address', e.target.value)}
                className="w-full rounded-lg border-slate-300 border p-2 h-24 resize-none"
              />
            </div>
             <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Código Postal</label>
              <input
                type="text"
                value={order.customer.postalCode}
                onChange={(e) => handleCustomerChange('postalCode', e.target.value)}
                className="w-full rounded-lg border-slate-300 border p-2"
              />
            </div>
          </div>
        )}

        {activeTab === 'execution' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Âmbito (Trabalho a executar)</label>
              <textarea
                value={order.scope}
                onChange={(e) => handleChange('scope', e.target.value)}
                className="w-full rounded-lg border-slate-300 border p-3 h-24 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Descreva o que deve ser feito..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Relatório (Trabalho realizado)</label>
              <textarea
                value={order.report}
                onChange={(e) => handleChange('report', e.target.value)}
                className="w-full rounded-lg border-slate-300 border p-3 h-40 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-slate-50"
                placeholder="Descreva detalhadamente o serviço efetuado..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Observações</label>
              <textarea
                value={order.observations}
                onChange={(e) => handleChange('observations', e.target.value)}
                className="w-full rounded-lg border-slate-300 border p-3 h-24"
                placeholder="Notas adicionais ou pendências..."
              />
            </div>
          </div>
        )}

        {activeTab === 'photos' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-800">Galeria de Serviço</h3>
              <label className="cursor-pointer px-4 py-2 bg-blue-50 text-blue-700 rounded-lg border border-blue-200 hover:bg-blue-100 transition flex items-center gap-2">
                <Plus size={18} />
                Adicionar Fotos
                <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} />
              </label>
            </div>
            
            {order.images.length === 0 ? (
              <div className="text-center py-12 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
                <Camera size={48} className="mx-auto text-slate-300 mb-2" />
                <p className="text-slate-500">Nenhuma imagem adicionada ainda.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {order.images.map((img) => (
                  <div key={img.id} className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden group">
                    <div className="aspect-video relative bg-slate-100">
                      <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
                      <button 
                        onClick={() => removeImage(img.id)}
                        className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Remover foto"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <div className="p-3">
                      <input
                        type="text"
                        value={img.description}
                        onChange={(e) => updateImageDescription(img.id, e.target.value)}
                        placeholder="Adicionar descrição..."
                        className="w-full text-sm border-b border-transparent focus:border-blue-500 focus:outline-none pb-1"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'signatures' && (
          <div className="space-y-8">
            <div className="p-4 bg-yellow-50 text-yellow-800 rounded-lg text-sm border border-yellow-200">
              <p>Ao assinar, confirma a veracidade das informações prestadas e a execução do serviço descrito no relatório.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <SignaturePad 
                label="Assinatura do Técnico" 
                onSave={(data) => handleChange('technicianSignature', data)}
                existingSignature={order.technicianSignature}
              />
              <SignaturePad 
                label="Assinatura do Cliente" 
                onSave={(data) => handleChange('customerSignature', data)}
                existingSignature={order.customerSignature}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};