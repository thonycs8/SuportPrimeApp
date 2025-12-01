import React from 'react';

export const SocialProof: React.FC = () => {
  return (
    <section className="py-10 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-8">
          Mais de 500 empresas confiam na SuportPrime
        </p>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
          {/* Placeholder Logos */}
          <h3 className="text-xl font-bold text-slate-600">TechFix</h3>
          <h3 className="text-xl font-bold text-slate-600">GlobalServices</h3>
          <h3 className="text-xl font-bold text-slate-600">InovaSystems</h3>
          <h3 className="text-xl font-bold text-slate-600">AutoRepair</h3>
          <h3 className="text-xl font-bold text-slate-600">ClimaControl</h3>
        </div>
      </div>
    </section>
  );
};
