import React from 'react';
import { Check } from 'lucide-react';

export const Solution: React.FC = () => {
  return (
    <section className="py-20 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider mb-6">
              Solução Completa
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 leading-tight">
              Do agendamento à faturação, <br />
              <span className="text-blue-600">num único fluxo.</span>
            </h2>
            <p className="text-lg text-slate-500 mb-8 leading-relaxed">
              Esqueça o Excel e o WhatsApp. Centralize toda a operação numa plataforma que conecta o escritório aos técnicos no terreno.
            </p>

            <ul className="space-y-4">
              {[
                "Receba pedidos de clientes via Portal",
                "Atribua ao técnico mais próximo",
                "Técnico preenche relatório no telemóvel",
                "Cliente assina digitalmente",
                "Fatura emitida automaticamente"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600 shrink-0">
                    <Check size={14} strokeWidth={3} />
                  </div>
                  <span className="text-slate-700 font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex-1 relative">
            {/* Abstract Background Shapes */}
            <div className="absolute -top-10 -right-10 w-72 h-72 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
            <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>

            {/* Mockup Card */}
            <div className="relative bg-white p-6 rounded-2xl shadow-2xl border border-slate-100 transform rotate-2 hover:rotate-0 transition-transform duration-500">
              <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-200"></div>
                  <div>
                    <div className="w-24 h-3 bg-slate-200 rounded mb-1"></div>
                    <div className="w-16 h-2 bg-slate-100 rounded"></div>
                  </div>
                </div>
                <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">Concluído</div>
              </div>
              <div className="space-y-3 mb-6">
                <div className="w-full h-2 bg-slate-100 rounded"></div>
                <div className="w-full h-2 bg-slate-100 rounded"></div>
                <div className="w-3/4 h-2 bg-slate-100 rounded"></div>
              </div>
              <div className="flex gap-2">
                <div className="w-1/2 h-24 bg-slate-100 rounded-lg"></div>
                <div className="w-1/2 h-24 bg-slate-100 rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
