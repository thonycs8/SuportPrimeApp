import React from 'react';
import { Zap, Smile, DollarSign } from 'lucide-react';

export const Benefits: React.FC = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Porquê a SuportPrime?</h2>
          <p className="text-lg text-slate-500">Não vendemos software, vendemos tempo e organização.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="text-center px-4">
            <div className="w-16 h-16 mx-auto bg-amber-100 rounded-full flex items-center justify-center text-amber-600 mb-6 shadow-lg shadow-amber-100">
              <Zap size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Rapidez no Atendimento</h3>
            <p className="text-slate-500">
              Reduza o tempo de resposta aos seus clientes em 50%. Atribua tarefas instantaneamente.
            </p>
          </div>
          <div className="text-center px-4">
            <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-6 shadow-lg shadow-blue-100">
              <Smile size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Clientes Mais Felizes</h3>
            <p className="text-slate-500">
              Mantenha os clientes informados com tracking em tempo real e relatórios profissionais.
            </p>
          </div>
          <div className="text-center px-4">
            <div className="w-16 h-16 mx-auto bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mb-6 shadow-lg shadow-emerald-100">
              <DollarSign size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Fature Mais Rápido</h3>
            <p className="text-slate-500">
              Não perca folhas de obra. Converta ordens de serviço em faturas no momento da conclusão.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
