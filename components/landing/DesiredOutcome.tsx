import React from 'react';
import { ShieldCheck, Clock, TrendingUp } from 'lucide-react';

export const DesiredOutcome: React.FC = () => {
  return (
    <section className="pt-24 pb-8 bg-slate-50 border-b border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left divide-y md:divide-y-0 md:divide-x divide-slate-200">
          <div className="flex items-center gap-4 p-4">
            <div className="bg-emerald-100 p-3 rounded-full text-emerald-600 shrink-0">
              <ShieldCheck size={24} />
            </div>
            <div>
              <p className="font-bold text-slate-900">Sem fidelização</p>
              <p className="text-sm text-slate-500">Cancele quando quiser, sem multas.</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4">
            <div className="bg-blue-100 p-3 rounded-full text-blue-600 shrink-0">
              <Clock size={24} />
            </div>
            <div>
              <p className="font-bold text-slate-900">Configuração em 2 min</p>
              <p className="text-sm text-slate-500">Não precisa de conhecimentos técnicos.</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4">
            <div className="bg-purple-100 p-3 rounded-full text-purple-600 shrink-0">
              <TrendingUp size={24} />
            </div>
            <div>
              <p className="font-bold text-slate-900">Aumento de 30% na produtividade</p>
              <p className="text-sm text-slate-500">Comprovado pelos nossos clientes.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
