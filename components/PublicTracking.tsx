
import React, { useState } from 'react';
import { Search, CheckCircle, Truck } from 'lucide-react';
import { ServiceOrder, ServiceStatus } from '../types';

interface PublicTrackingProps {
  onSearch: (processNumber: string) => ServiceOrder | undefined;
  onBack: () => void;
}

export const PublicTracking: React.FC<PublicTrackingProps> = ({ onSearch, onBack }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [result, setResult] = useState<ServiceOrder | null | 'not-found'>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const found = onSearch(searchTerm);
    setResult(found || 'not-found');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center pt-16 md:pt-20 px-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8 md:mb-10">
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight mb-2">Suporte<span className="text-blue-600">Prime</span></h1>
            <p className="text-slate-500 text-sm md:text-base">Acompanhe o estado do seu serviço.</p>
        </div>

        <form onSubmit={handleSearch} className="bg-white p-2 rounded-xl shadow-lg border border-slate-200 flex gap-2 mb-8">
            <input 
                type="text" 
                placeholder="Nº Processo (ex: PROC-2024...)" 
                className="flex-1 px-4 py-3 outline-none text-slate-800 placeholder:text-slate-400 bg-white text-base rounded-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 md:px-6 rounded-lg font-bold transition-colors shadow-sm">
                <Search size={20} />
            </button>
        </form>

        {result === 'not-found' && (
             <div className="bg-red-50 text-red-600 p-4 rounded-lg text-center border border-red-100 text-sm font-medium">
                Ordem de serviço não encontrada.
            </div>
        )}

        {result && result !== 'not-found' && (
            <div className="bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-slate-900 text-white p-5 md:p-6">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Processo</p>
                            <h2 className="text-xl md:text-2xl font-bold mt-1">{result.processNumber}</h2>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                            result.status === ServiceStatus.DONE ? 'bg-emerald-500 text-emerald-50' :
                            result.status === ServiceStatus.PENDING ? 'bg-amber-500 text-amber-50' :
                            'bg-blue-500 text-blue-50'
                        }`}>
                            {result.status}
                        </div>
                    </div>
                </div>
                
                <div className="p-5 md:p-6 space-y-6">
                    {/* Timeline */}
                    <div className="relative pl-4 border-l-2 border-slate-200 space-y-6">
                        <div className="relative">
                            <div className="absolute -left-[21px] bg-blue-600 w-3 h-3 rounded-full ring-4 ring-white"></div>
                            <p className="text-sm font-bold text-slate-800">Serviço Agendado</p>
                            <p className="text-xs text-slate-500">{new Date(result.startDate).toLocaleDateString('pt-PT')}</p>
                        </div>
                        {result.status !== ServiceStatus.PENDING && (
                             <div className="relative">
                                <div className="absolute -left-[21px] bg-blue-600 w-3 h-3 rounded-full ring-4 ring-white"></div>
                                <p className="text-sm font-bold text-slate-800">Técnico Atribuído</p>
                                <p className="text-xs text-slate-500 flex items-center gap-1"><Truck size={12}/> {result.technicianName.split(' ')[0]}</p>
                            </div>
                        )}
                        {result.status === ServiceStatus.DONE && (
                            <div className="relative">
                                <div className="absolute -left-[21px] bg-emerald-500 w-3 h-3 rounded-full ring-4 ring-white"></div>
                                <p className="text-sm font-bold text-slate-800">Concluído</p>
                                <p className="text-xs text-slate-500">{new Date(result.endDate).toLocaleDateString('pt-PT')}</p>
                            </div>
                        )}
                    </div>
                    
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                        <p className="text-xs font-bold text-slate-400 uppercase mb-1">Âmbito</p>
                        <p className="text-sm text-slate-700">{result.scope}</p>
                    </div>
                </div>
            </div>
        )}

        <button onClick={onBack} className="w-full text-center mt-8 text-sm text-slate-400 hover:text-slate-600">
            &larr; Voltar
        </button>
      </div>
    </div>
  );
};
