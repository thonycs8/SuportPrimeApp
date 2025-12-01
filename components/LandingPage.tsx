import React from 'react';
import { Navbar } from './landing/Navbar';
import { DesiredOutcome } from './landing/DesiredOutcome';
import { Hero } from './landing/Hero';
import { SocialProof } from './landing/SocialProof';
import { Features } from './landing/Features';
import { Solution } from './landing/Solution';
import { Stats } from './landing/Stats';
import { Benefits } from './landing/Benefits';
import { HowItWorks } from './landing/HowItWorks';
import { Integrations } from './landing/Integrations';
import { Testimonials } from './landing/Testimonials';
import { FAQ } from './landing/FAQ';
import { CTA } from './landing/CTA';
import { Footer } from './landing/Footer';

interface LandingPageProps {
  onLoginClick: () => void;
  onRegister: (data: { name: string; email: string; companyName: string; phone: string; nif: string }) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLoginClick, onRegister }) => {

  const scrollToRegister = () => {
    document.getElementById('register-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      <Navbar onLoginClick={onLoginClick} onRegisterClick={scrollToRegister} />
      <DesiredOutcome />
      <Hero onRegisterClick={scrollToRegister} />
      <SocialProof />
      <Features />
      <Solution />
      <Stats />
      <Benefits />
      <HowItWorks />
      <Integrations />
      <Testimonials />
      <FAQ />
      <CTA onRegister={onRegister} />
      <Footer />
    </div>
  );
};
