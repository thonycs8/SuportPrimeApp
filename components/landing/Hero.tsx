import React from 'react';
import { ArrowRight, PlayCircle, Star } from 'lucide-react';

interface HeroProps {
  onRegisterClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onRegisterClick }) => {
  return (
    <section className="pt-16 pb-20 md:pt-24 md:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center overflow-hidden">
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider mb-8 border border-blue-100 animate-fade-in-up">
        <Star size={14} fill="currentColor" /> Nova versão 2.0 com IA
      </div>

      <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-8 leading-[1.1]">
        A sua equipa técnica <br className="hidden md:block" />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">em piloto automático</span>
      </h1>

      <p className="text-xl text-slate-500 mb-10 max-w-3xl mx-auto leading-relaxed">
        Elimine a papelada, organize os pedidos de suporte e impressione os seus clientes com relatórios digitais profissionais. Tudo numa única app.
      </p>

      <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
        <button
          onClick={onRegisterClick}
          className="px-8 py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/30 hover:shadow-blue-600/50 transform hover:-translate-y-1 flex items-center justify-center gap-2"
        >
          Começar Trial Grátis <ArrowRight size={20} />
        </button>
        <button className="px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-xl font-bold text-lg hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center justify-center gap-2">
          <PlayCircle size={20} /> Ver Demo em Vídeo
        </button>
      </div>

      {/* Dashboard Preview with 3D effect */}
      <div className="relative mx-auto max-w-5xl group perspective-1000">
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
        <div className="relative rounded-2xl border border-slate-200 shadow-2xl overflow-hidden bg-slate-900 transform transition-transform duration-500 hover:scale-[1.01]">
          <img
            src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop"
            alt="Dashboard Preview"
            className="w-full h-auto object-cover opacity-90"
          />
          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent pointer-events-none"></div>
        </div>
      </div>
    </section>
  );
};
