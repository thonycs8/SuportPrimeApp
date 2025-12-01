import React from 'react';

export const Stats: React.FC = () => {
  return (
    <section className="py-16 bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-slate-800">
          <div className="p-4">
            <p className="text-4xl md:text-5xl font-bold text-blue-500 mb-2">15k+</p>
            <p className="text-slate-400 text-sm uppercase tracking-wider">Ordens de Serviço</p>
          </div>
          <div className="p-4">
            <p className="text-4xl md:text-5xl font-bold text-emerald-500 mb-2">98%</p>
            <p className="text-slate-400 text-sm uppercase tracking-wider">Satisfação</p>
          </div>
          <div className="p-4">
            <p className="text-4xl md:text-5xl font-bold text-purple-500 mb-2">2.5h</p>
            <p className="text-slate-400 text-sm uppercase tracking-wider">Poupadas / dia</p>
          </div>
          <div className="p-4">
            <p className="text-4xl md:text-5xl font-bold text-amber-500 mb-2">500+</p>
            <p className="text-slate-400 text-sm uppercase tracking-wider">Empresas</p>
          </div>
        </div>
      </div>
    </section>
  );
};
