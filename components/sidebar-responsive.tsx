'use client';

import { useState } from 'react';
import { Separator } from "./ui/separator";
import { Globe, Mail, Menu, X } from "lucide-react";
import Image from 'next/image';

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Botão mobile para abrir menu */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-[#025C3E] text-white rounded-lg shadow-lg"
        aria-label="Toggle menu"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay para mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed left-0 top-0 h-screen w-[280px] sm:w-[300px] lg:w-[250px] 
          bg-[#025C3E] border-r-[6px] lg:border-r-[10px] border-r-[#157A5B] 
          flex flex-col justify-between shadow-2xl z-50 transition-transform duration-300
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="p-4 lg:p-6 overflow-y-auto">
          {/* Título */}
          <h1 className="text-2xl lg:text-[32px] font-bold text-[#F9F9F9] leading-tight mb-4 mt-12 lg:mt-0 text-center">
            Plataforma<br />Interativa
          </h1>
          
          <Separator className="bg-[#157A5B] h-[1px] my-4" />
          
          {/* Logo */}
          <div className="flex items-center justify-center mb-6">
            <Image 
              src="/epamig_branca.png" 
              alt="Logo Epamig" 
              width={140}
              height={40}
              className="w-full max-w-[140px] h-auto" 
            />
          </div>
          
          {/* Links externos */}
          <div className="flex justify-between mb-8 px-2">
            <a 
              href="https://www.epamig.br/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex flex-col items-center group hover:scale-105 transition-transform"
            >
              <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center mb-1 group-hover:bg-white/20 transition-colors">
                <Globe size={20} color="#F9F9F9" />
              </div>
              <span className="text-[10px] text-[#F9F9F9] text-center">Site</span>
            </a>
            
            <a 
              href="https://empresade125369.rm.cloudtotvs.com.br/Corpore.Net/Login.aspx" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex flex-col items-center group hover:scale-105 transition-transform"
            >
              <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center mb-1 group-hover:bg-white/20 transition-colors">
                <img 
                  src="/icon_totvs.svg" 
                  alt="Portal ADM" 
                  className="w-5 h-5" 
                  style={{ filter: 'brightness(0) invert(1)' }} 
                />
              </div>
              <span className="text-[10px] text-[#F9F9F9] text-center">Portal ADM</span>
            </a>
            
            <a 
              href="https://mail.google.com/mail/u/0/#inbox" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex flex-col items-center group hover:scale-105 transition-transform"
            >
              <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center mb-1 group-hover:bg-white/20 transition-colors">
                <Mail size={20} color="#F9F9F9" />
              </div>
              <span className="text-[10px] text-[#F9F9F9] text-center">E-mail</span>
            </a>
          </div>
          
          {/* Navegação principal */}
          <nav className="flex flex-col gap-2">
            <a 
              href="/" 
              onClick={() => setIsOpen(false)}
              className="text-[16px] text-[#F9F9F9] py-3 px-4 rounded-lg hover:bg-[#044d33] transition-all duration-200 font-medium border-l-4 border-transparent hover:border-white/30"
            >
              Início
            </a>
            <a 
              href="/projetos" 
              onClick={() => setIsOpen(false)}
              className="text-[16px] text-[#F9F9F9] py-3 px-4 rounded-lg hover:bg-[#044d33] transition-all duration-200 font-medium border-l-4 border-transparent hover:border-white/30"
            >
              Projetos
            </a>
            <a 
              href="/publicacoes" 
              onClick={() => setIsOpen(false)}
              className="text-[16px] text-[#F9F9F9] py-3 px-4 rounded-lg hover:bg-[#044d33] transition-all duration-200 font-medium border-l-4 border-transparent hover:border-white/30"
            >
              Publicações
            </a>
            <a 
              href="/tecnologias" 
              onClick={() => setIsOpen(false)}
              className="text-[16px] text-[#F9F9F9] py-3 px-4 rounded-lg hover:bg-[#044d33] transition-all duration-200 font-medium border-l-4 border-transparent hover:border-white/30"
            >
              Tecnologias
            </a>
            <a 
              href="/eventos" 
              onClick={() => setIsOpen(false)}
              className="text-[16px] text-[#F9F9F9] py-3 px-4 rounded-lg hover:bg-[#044d33] transition-all duration-200 font-medium border-l-4 border-transparent hover:border-white/30"
            >
              Eventos
            </a>
          </nav>
        </div>
        
        {/* Footer */}
        <div className="p-4 text-center text-[10px] text-[#F9F9F9] opacity-70 border-t border-white/10">
          &copy; {new Date().getFullYear()} BI Plataforma
        </div>
      </aside>
    </>
  );
}