import React, { useState } from 'react';
import { Zap, Menu, X } from 'lucide-react';

interface NavbarProps {
  onLoginClick: () => void;
  onRegisterClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onLoginClick, onRegisterClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed w-full bg-white/95 backdrop-blur-md z-50 border-b border-slate-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 md:h-20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-1.5 md:p-2 rounded-lg shadow-lg shadow-blue-900/20">
            <Zap size={20} className="text-white" fill="currentColor"/>
          </div>
          <span className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">SuportPrime<span className="text-blue-600">App</span></span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Funcionalidades</a>
            <a href="#how-it-works" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Como Funciona</a>
            <a href="#pricing" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Preços</a>
            <a href="#testimonials" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Clientes</a>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <button 
            onClick={onLoginClick}
            className="text-sm font-bold text-slate-800 hover:text-blue-600 transition-colors px-2"
          >
            Entrar
          </button>
          <button 
            onClick={onRegisterClick}
            className="bg-blue-600 text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40 transform hover:-translate-y-0.5"
          >
            Começar Grátis
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button 
            className="md:hidden p-2 text-slate-600"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 absolute w-full left-0 shadow-xl">
            <div className="flex flex-col p-4 space-y-4">
                <a href="#features" className="text-base font-medium text-slate-600" onClick={() => setIsMenuOpen(false)}>Funcionalidades</a>
                <a href="#how-it-works" className="text-base font-medium text-slate-600" onClick={() => setIsMenuOpen(false)}>Como Funciona</a>
                <a href="#pricing" className="text-base font-medium text-slate-600" onClick={() => setIsMenuOpen(false)}>Preços</a>
                <button 
                    onClick={() => { onLoginClick(); setIsMenuOpen(false); }}
                    className="text-left text-base font-bold text-slate-800"
                >
                    Entrar
                </button>
                <button 
                    onClick={() => { onRegisterClick(); setIsMenuOpen(false); }}
                    className="bg-blue-600 text-white px-4 py-3 rounded-xl text-center font-bold shadow-lg"
                >
                    Começar Grátis
                </button>
            </div>
        </div>
      )}
    </nav>
  );
};
