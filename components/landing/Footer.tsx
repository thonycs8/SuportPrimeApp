import React from 'react';
import { Zap, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 text-slate-400 py-12 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="bg-blue-600 p-1.5 rounded-lg">
                <Zap size={16} className="text-white" fill="currentColor" />
              </div>
              <span className="text-xl font-bold text-white">SuportPrime<span className="text-blue-600">App</span></span>
            </div>
            <p className="text-sm leading-relaxed mb-6">
              A plataforma completa para gestão de equipas técnicas e ordens de serviço. Simplifique o seu negócio hoje.
            </p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-white transition-colors"><Facebook size={20} /></a>
              <a href="#" className="hover:text-white transition-colors"><Twitter size={20} /></a>
              <a href="#" className="hover:text-white transition-colors"><Instagram size={20} /></a>
              <a href="#" className="hover:text-white transition-colors"><Linkedin size={20} /></a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Produto</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#features" className="hover:text-blue-500 transition-colors">Funcionalidades</a></li>
              <li><a href="#pricing" className="hover:text-blue-500 transition-colors">Preços</a></li>
              <li><a href="#" className="hover:text-blue-500 transition-colors">Atualizações</a></li>
              <li><a href="#" className="hover:text-blue-500 transition-colors">Roadmap</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Empresa</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-blue-500 transition-colors">Sobre Nós</a></li>
              <li><a href="#" className="hover:text-blue-500 transition-colors">Carreiras</a></li>
              <li><a href="#" className="hover:text-blue-500 transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-blue-500 transition-colors">Contactos</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Legal</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-blue-500 transition-colors">Termos de Serviço</a></li>
              <li><a href="#" className="hover:text-blue-500 transition-colors">Política de Privacidade</a></li>
              <li><a href="#" className="hover:text-blue-500 transition-colors">RGPD</a></li>
              <li><a href="#" className="hover:text-blue-500 transition-colors">Livro de Reclamações</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-900 pt-8 text-center text-xs">
          <p>© 2024 SuportePrime System. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};
