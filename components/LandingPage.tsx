
import React, { useState } from 'react';
import { CheckCircle, Zap, Shield, Smartphone, FileText, Users, ArrowRight, PlayCircle, Star } from 'lucide-react';
import { PlanType } from '../types';

interface LandingPageProps {
  onLoginClick: () => void;
  onRegister: (data: { name: string; email: string; companyName: string; phone: string; nif: string }) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLoginClick, onRegister }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    companyName: '',
    phone: '',
    nif: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onRegister(formData);
  };

  const scrollToRegister = () => {
    document.getElementById('register-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  const inputClass = "w-full p-3.5 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-600 bg-white text-slate-800 text-base shadow-sm";

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      {/* Navbar */}
      <nav className="fixed w-full bg-white/95 backdrop-blur-md z-50 border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 md:h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-1.5 md:p-2 rounded-lg shadow-lg shadow-blue-900/20">
              <Zap size={20} className="text-white" fill="currentColor"/>
            </div>
            <span className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">Suporte<span className="text-blue-600">Prime</span></span>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex gap-8">
                <a href="#features" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Funcionalidades</a>
                <a href="#pricing" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Preços</a>
            </div>
            <button 
              onClick={onLoginClick}
              className="text-sm font-bold text-slate-800 hover:text-blue-600 transition-colors px-2"
            >
              Entrar
            </button>
            <button 
              onClick={scrollToRegister}
              className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20"
            >
              Começar
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-28 md:pt-32 pb-16 md:pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 text-[10px] md:text-xs font-bold uppercase tracking-wider mb-6 md:mb-8 border border-blue-100">
          <Star size={12} fill="currentColor" /> Nova versão 2.0 Mobile First
        </div>
        <h1 className="text-4xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-6 leading-tight">
          Gestão Técnica <br className="hidden md:block"/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">no seu bolso</span>
        </h1>
        <p className="text-lg md:text-xl text-slate-500 mb-8 md:mb-10 max-w-2xl mx-auto leading-relaxed px-2">
          Elimine o papel e organize a sua equipa com relatórios digitais profissionais. Teste grátis por 15 dias.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 px-4">
          <button 
            onClick={scrollToRegister}
            className="w-full sm:w-auto px-8 py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/30 flex items-center justify-center gap-2"
          >
            Criar Conta Grátis <ArrowRight size={20} />
          </button>
          <button className="w-full sm:w-auto px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-xl font-bold text-lg hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
            <PlayCircle size={20} /> Demo
          </button>
        </div>
        
        {/* Dashboard Preview */}
        <div className="mt-12 md:mt-16 rounded-2xl border border-slate-200 shadow-2xl overflow-hidden bg-slate-50 relative group mx-2 md:mx-0">
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/10 to-transparent pointer-events-none"></div>
          <img 
            src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop" 
            alt="Dashboard Preview" 
            className="w-full h-auto object-cover opacity-90 group-hover:scale-105 transition-transform duration-700"
          />
        </div>
      </section>

      {/* Benefits Section */}
      <section id="features" className="py-16 md:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">Tudo o que precisa</h2>
            <p className="text-slate-500 max-w-xl mx-auto">Deixe as folhas de papel no passado.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-12">
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-4">
                <Smartphone size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Mobilidade Total</h3>
              <p className="text-slate-500 leading-relaxed text-sm md:text-base">
                Os seus técnicos preenchem relatórios diretamente no telemóvel ou tablet.
              </p>
            </div>
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 mb-4">
                <FileText size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Relatórios PDF</h3>
              <p className="text-slate-500 leading-relaxed text-sm md:text-base">
                Gere PDFs automáticos com a sua marca, fotos e assinaturas.
              </p>
            </div>
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 mb-4">
                <Users size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Gestão de Equipa</h3>
              <p className="text-slate-500 leading-relaxed text-sm md:text-base">
                Controle agendas e saiba em tempo real o que cada técnico está a fazer.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">Planos Simples</h2>
            <p className="text-slate-500">Comece hoje mesmo.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto">
            {/* Free Plan */}
            <div className="p-6 md:p-8 rounded-2xl border border-slate-200 bg-slate-50 opacity-75 md:grayscale hover:grayscale-0 transition-all">
               <h3 className="font-bold text-lg text-slate-500 mb-2">Free</h3>
               <p className="text-3xl font-bold text-slate-900 mb-6">0€</p>
               <ul className="space-y-3 mb-8 text-sm text-slate-600">
                 <li className="flex gap-2"><CheckCircle size={16} /> 1 Utilizador</li>
                 <li className="flex gap-2"><CheckCircle size={16} /> Ordens Básicas</li>
               </ul>
               <button onClick={scrollToRegister} className="w-full py-3 rounded-lg border border-slate-300 font-bold text-slate-600 hover:bg-white transition-colors">
                 Criar Conta
               </button>
            </div>

            {/* Pro Plan */}
            <div className="p-6 md:p-8 rounded-2xl border-2 border-blue-600 bg-white shadow-xl relative transform md:-translate-y-4">
               <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wide whitespace-nowrap">
                 Mais Popular
               </div>
               <h3 className="font-bold text-lg text-blue-600 mb-2">Pro</h3>
               <p className="text-4xl font-bold text-slate-900 mb-6">20€ <span className="text-sm font-normal text-slate-500">/user</span></p>
               <ul className="space-y-3 mb-8 text-sm text-slate-700">
                 <li className="flex gap-2"><CheckCircle size={16} className="text-blue-600" /> Até 5 Utilizadores</li>
                 <li className="flex gap-2"><CheckCircle size={16} className="text-blue-600" /> Agenda</li>
                 <li className="flex gap-2"><CheckCircle size={16} className="text-blue-600" /> Relatórios PDF</li>
               </ul>
               <button 
                  onClick={scrollToRegister}
                  className="w-full py-3 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
               >
                 Trial 15 Dias
               </button>
            </div>

            {/* Enterprise Plan */}
            <div className="p-6 md:p-8 rounded-2xl border border-slate-200 bg-slate-50">
               <h3 className="font-bold text-lg text-slate-900 mb-2">Enterprise</h3>
               <p className="text-3xl font-bold text-slate-900 mb-6">Sob Consulta</p>
               <ul className="space-y-3 mb-8 text-sm text-slate-600">
                 <li className="flex gap-2"><CheckCircle size={16} className="text-slate-800" /> Utilizadores Ilimitados</li>
                 <li className="flex gap-2"><CheckCircle size={16} className="text-slate-800" /> API Dedicada</li>
               </ul>
               <button className="w-full py-3 rounded-lg bg-slate-800 text-white font-bold hover:bg-slate-900 transition-colors opacity-75">
                 Contactar
               </button>
            </div>
          </div>
        </div>
      </section>

      {/* Registration Section */}
      <section id="register-form" className="py-16 md:py-24 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row gap-8 md:gap-12 items-center">
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">Crie sua conta</h2>
            <p className="text-slate-400 mb-8 text-base md:text-lg">
              Junte-se a centenas de empresas. O cadastro leva menos de 2 minutos.
            </p>
            <div className="space-y-4 hidden md:block">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-blue-400 font-bold">1</div>
                <p className="text-sm">Dados da empresa</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-blue-400 font-bold">2</div>
                <p className="text-sm">Acesso imediato (15 dias)</p>
              </div>
            </div>
          </div>

          <div className="flex-1 w-full bg-white text-slate-900 p-6 md:p-8 rounded-2xl shadow-2xl">
            <h3 className="text-lg font-bold mb-6 text-center">Dados de Registo</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nome</label>
                <input 
                  type="text" required
                  className={inputClass}
                  placeholder="Seu nome"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Email</label>
                <input 
                  type="email" required
                  className={inputClass}
                  placeholder="seu@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Empresa</label>
                <input 
                  type="text" required
                  className={inputClass}
                  placeholder="Minha Empresa Lda"
                  value={formData.companyName}
                  onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Telefone</label>
                  <input 
                    type="tel" required
                    className={inputClass}
                    placeholder="910..."
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">NIF</label>
                  <input 
                    type="text" required
                    className={inputClass}
                    placeholder="500..."
                    value={formData.nif}
                    onChange={(e) => setFormData({...formData, nif: e.target.value})}
                  />
                </div>
              </div>

              <button type="submit" className="w-full py-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-lg mt-2">
                Começar Trial
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 py-8 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="font-bold text-white mb-2">SuportePrime</p>
          <p className="text-xs">© 2024 Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
};
