import React from 'react';

export const Integrations: React.FC = () => {
  return (
    <section className="py-20 bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl font-bold text-slate-900 mb-8">Integra-se com as suas ferramentas favoritas</h2>
        <div className="flex flex-wrap justify-center items-center gap-12 opacity-70">
          {/* Mockup Integration Logos */}
          <div className="flex items-center gap-2 font-bold text-xl text-slate-600">
            <div className="w-8 h-8 bg-blue-500 rounded"></div> Google Calendar
          </div>
          <div className="flex items-center gap-2 font-bold text-xl text-slate-600">
            <div className="w-8 h-8 bg-green-500 rounded"></div> WhatsApp
          </div>
          <div className="flex items-center gap-2 font-bold text-xl text-slate-600">
            <div className="w-8 h-8 bg-blue-400 rounded"></div> Moloni
          </div>
          <div className="flex items-center gap-2 font-bold text-xl text-slate-600">
            <div className="w-8 h-8 bg-indigo-500 rounded"></div> Stripe
          </div>
        </div>
      </div>
    </section>
  );
};
