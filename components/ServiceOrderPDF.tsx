
import React from 'react';
import { ServiceOrder, ServiceStatus } from '../types';
import { Printer, Download, ArrowLeft } from 'lucide-react';

interface ServiceOrderPDFProps {
  order: ServiceOrder;
  onBack: () => void;
}

export const ServiceOrderPDF: React.FC<ServiceOrderPDFProps> = ({ order, onBack }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-slate-100 min-h-screen p-4 md:p-8">
      {/* Action Bar (Hidden when printing) */}
      <div className="max-w-[210mm] mx-auto mb-6 flex justify-between items-center print:hidden">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-medium">
            <ArrowLeft size={18} /> Voltar
        </button>
        <button 
            onClick={handlePrint}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 shadow-md transition-all font-medium"
        >
            <Printer size={18} /> Imprimir / PDF
        </button>
      </div>

      {/* A4 Paper Container */}
      <div className="bg-white max-w-[210mm] min-h-[297mm] mx-auto p-8 md:p-12 shadow-2xl print:shadow-none print:w-full print:max-w-none print:p-0">
        
        {/* Header */}
        <div className="flex justify-between items-start border-b-2 border-slate-900 pb-6 mb-8">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 uppercase tracking-tighter">Relatório de Serviço</h1>
                <p className="text-slate-500 font-medium mt-1">Ordem de Serviço Nº {order.processNumber}</p>
            </div>
            <div className="text-right">
                <h2 className="text-xl font-bold text-blue-600">SuportePrime</h2>
                <p className="text-xs text-slate-400">Serviços Técnicos Profissionais</p>
                <p className="text-xs text-slate-400 mt-1">{new Date().toLocaleDateString('pt-PT')}</p>
            </div>
        </div>

        {/* Status Badge */}
        <div className="mb-8 flex justify-end">
             <span className="px-4 py-1 rounded border border-slate-900 text-slate-900 font-bold uppercase text-sm tracking-widest">
                {order.status}
             </span>
        </div>

        {/* 2-Column Grid for Info */}
        <div className="grid grid-cols-2 gap-12 mb-8">
            <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 border-b border-slate-100 pb-1">Dados do Cliente</h3>
                <div className="space-y-1 text-sm text-slate-800">
                    <p className="font-bold text-lg">{order.customer.name}</p>
                    <p>NIF: {order.customer.nif}</p>
                    <p>{order.customer.address}</p>
                    <p>{order.customer.postalCode} {order.customer.city}</p>
                    <p className="mt-2 text-slate-500">Contactos: {order.customer.contacts}</p>
                </div>
            </div>
            <div>
                 <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 border-b border-slate-100 pb-1">Detalhes Operacionais</h3>
                 <div className="space-y-2 text-sm text-slate-700">
                    <div className="flex justify-between">
                        <span className="text-slate-500">Prioridade:</span>
                        <span className="font-medium">{order.priority}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-slate-500">Início:</span>
                        <span className="font-medium">{new Date(order.startDate).toLocaleString('pt-PT')}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-slate-500">Fim:</span>
                        <span className="font-medium">{new Date(order.endDate).toLocaleString('pt-PT')}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-slate-500">Viatura:</span>
                        <span className="font-medium">{order.vehicle}</span>
                    </div>
                    <div className="mt-4 pt-4 border-t border-slate-100">
                        <p className="text-xs text-slate-400 uppercase">Equipa Técnica</p>
                        <p className="font-bold">{order.technicianName}</p>
                        {order.assistantTechnicianName && <p className="text-slate-600">+ {order.assistantTechnicianName}</p>}
                    </div>
                 </div>
            </div>
        </div>

        {/* Sections */}
        <div className="space-y-8 mb-8">
            <div className="bg-slate-50 p-4 rounded border border-slate-100 print:bg-transparent print:border-slate-300">
                <h3 className="text-sm font-bold text-slate-900 uppercase mb-2">Âmbito do Serviço</h3>
                <p className="text-sm text-slate-700 text-justify leading-relaxed">{order.scope}</p>
            </div>

            <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase mb-2 border-b border-slate-200 pb-2">Relatório Técnico</h3>
                <p className="text-sm text-slate-700 text-justify leading-relaxed whitespace-pre-wrap">{order.report || "Nenhum relatório preenchido."}</p>
            </div>
            
            {order.observations && (
                <div>
                    <h3 className="text-sm font-bold text-slate-900 uppercase mb-2 border-b border-slate-200 pb-2">Observações / Pendências</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">{order.observations}</p>
                </div>
            )}
        </div>

        {/* Signatures */}
        <div className="mt-16 pt-8 border-t-2 border-slate-200 break-inside-avoid">
             <div className="grid grid-cols-2 gap-12">
                <div className="text-center">
                    <div className="h-24 flex items-end justify-center mb-2">
                        {order.technicianSignature ? (
                            <img src={order.technicianSignature} className="max-h-20 max-w-full" alt="Assinatura Técnico"/>
                        ) : <span className="text-slate-300 italic">Não assinado</span>}
                    </div>
                    <div className="border-t border-slate-300 pt-2">
                        <p className="text-xs font-bold uppercase text-slate-600">O Técnico Responsável</p>
                        <p className="text-xs text-slate-400">{order.technicianName}</p>
                    </div>
                </div>
                <div className="text-center">
                    <div className="h-24 flex items-end justify-center mb-2">
                         {order.customerSignature ? (
                            <img src={order.customerSignature} className="max-h-20 max-w-full" alt="Assinatura Cliente"/>
                        ) : <span className="text-slate-300 italic">Não assinado</span>}
                    </div>
                    <div className="border-t border-slate-300 pt-2">
                         <p className="text-xs font-bold uppercase text-slate-600">O Cliente</p>
                         <p className="text-xs text-slate-400">{order.customer.name}</p>
                    </div>
                </div>
             </div>
        </div>
        
        {/* Footer */}
        <div className="mt-12 text-center text-[10px] text-slate-400 print:fixed print:bottom-4 print:left-0 print:w-full">
            <p>Documento gerado digitalmente por SuportePrime em {new Date().toLocaleString('pt-PT')}</p>
        </div>

      </div>
    </div>
  );
};
