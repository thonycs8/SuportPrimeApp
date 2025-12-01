import React, { useState } from 'react';
import { CheckCircle } from 'lucide-react';

interface CTAProps {
  onRegister: (data: { name: string; email: string; companyName: string; phone: string; nif: string }) => void;
}

export const CTA: React.FC<CTAProps> = ({ onRegister }) => {
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

  const inputClass = "w-full p-3.5 border border-slate-600 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-slate-800 text-white placeholder-slate-400 text-base shadow-sm transition-all";

  return (
    <section id="register-form" className="py-20 bg-slate-900 text-white relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          <div className="flex-1 text-center lg:text-left">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
              Pronto para transformar <br /> a sua gestão técnica?
            </h2>
            <p className="text-slate-400 mb-8 text-lg max-w-xl mx-auto lg:mx-0">
              Comece agora o seu período de teste gratuito de 15 dias. Sem compromisso.
            </p>

            <div className="space-y-4 max-w-md mx-auto lg:mx-0">
              <div className="flex items-center gap-3">
                <CheckCircle className="text-emerald-400" />
                <span className="text-slate-300">Acesso total a todas as funcionalidades</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="text-emerald-400" />
                <span className="text-slate-300">Suporte prioritário incluído</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="text-emerald-400" />
                <span className="text-slate-300">Configuração guiada passo-a-passo</span>
              </div>
            </div>
          </div>

          <div className="flex-1 w-full max-w-lg bg-slate-800/50 backdrop-blur-sm p-8 rounded-2xl border border-slate-700 shadow-2xl">
            <h3 className="text-xl font-bold mb-6 text-center">Criar Conta Gratuita</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="text" required
                  className={inputClass}
                  placeholder="Seu Nome"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <input
                  type="email" required
                  className={inputClass}
                  placeholder="Seu Email Profissional"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div>
                <input
                  type="text" required
                  className={inputClass}
                  placeholder="Nome da Empresa"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <input
                    type="tel" required
                    className={inputClass}
                    placeholder="Telemóvel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div>
                  <input
                    type="text" required
                    className={inputClass}
                    placeholder="NIF"
                    value={formData.nif}
                    onChange={(e) => setFormData({ ...formData, nif: e.target.value })}
                  />
                </div>
              </div>

              <button type="submit" className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-500 transition-all shadow-lg shadow-blue-900/50 mt-4 transform hover:-translate-y-1">
                Começar Trial de 15 Dias
              </button>
              <p className="text-center text-xs text-slate-500 mt-4">
                Ao clicar em "Começar", concorda com os nossos Termos de Serviço.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
