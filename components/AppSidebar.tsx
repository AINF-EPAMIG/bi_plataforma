'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import HomeIcon from '@mui/icons-material/Home';
import { menuItems } from './sidebar-menu';

interface AppSidebarProps {
  widthClasses?: string; // permite ajustar largura externa
}

export default function AppSidebar({ widthClasses = 'w-16 md:w-64' }: AppSidebarProps) {
  const [openMenu, setOpenMenu] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenMenu(-1);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <aside className={`bg-white border-r-4 md:border-r-8 border-[#025C3E] ${widthClasses} h-screen flex flex-col items-center py-2 md:py-4 fixed left-0 top-0 z-40 shadow-lg overflow-y-auto`}>
      <div className="flex flex-col items-center w-full px-2">
        <Image src="/epamig.svg" alt="Logo EPAMIG" width={112} height={112} className="w-10 h-10 md:w-24 md:h-24 mb-1 md:mb-2" priority />
        <Link
          href="/inicio"
          className="flex items-center justify-center gap-1.5 bg-[#025C3E] text-white px-2 md:px-4 py-1.5 md:py-2 rounded-2xl shadow hover:bg-[#038451] transition mb-3 md:mb-6 mt-1 w-full md:w-auto text-sm"
        >
          <HomeIcon fontSize="small" />
          <span className="font-bold hidden md:inline">Início</span>
        </Link>
      </div>
      <nav className="flex-1 w-full px-2" ref={dropdownRef} aria-label="Navegação principal">
        <ul className="space-y-1.5">
          {menuItems.map((item, idx) => (
            <li key={item.label} className="relative">
              <button
                className={`w-full flex items-center justify-between px-2 py-2 rounded-xl border border-transparent transition-all shadow hover:border-[#025C3E] hover:bg-[#E3F7EF] focus:bg-[#E3F7EF] group ${openMenu === idx ? 'bg-[#E3F7EF] border-[#025C3E]' : ''}`}
                onClick={() => setOpenMenu(openMenu === idx ? -1 : idx)}
                aria-expanded={openMenu === idx}
                aria-controls={`submenu-${idx}`}
              >
                <div className="flex items-center gap-1.5">
                  {item.icon}
                  <span className="text-[#025C3E] text-sm md:text-base font-semibold hidden md:inline">{item.label}</span>
                </div>
                <span className={`text-[#025C3E] transform transition-transform duration-300 hidden md:inline ${openMenu === idx ? 'rotate-180' : 'rotate-0'}`}>
                  <svg width={16} height={16}><path d="M7 10l5 0" stroke="#025C3E" strokeWidth={3} strokeLinecap="round" /></svg>
                </span>
              </button>
              {openMenu === idx && (
                <div
                  id={`submenu-${idx}`}
                  className="absolute left-full top-0 md:static md:left-0 md:top-auto z-20 w-48 md:w-auto shadow-lg rounded-xl bg-white mt-2 animate-fadein border border-[#E3F7EF]"
                  role="group"
                  aria-label={`Submenu de ${item.label}`}
                >
                  <ul className="p-2">
                    {item.sub.map(sub => (
                      <li key={sub.href}>
                        <Link
                          href={sub.href}
                          className="block py-1.5 px-3 text-xs md:text-sm text-[#025C3E] rounded hover:bg-[#DFF6EC] font-medium transition"
                        >
                          {sub.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
          ))}
        </ul>
      </nav>
      <div className="mt-auto pt-4 text-xs text-gray-400">EPAMIG © {new Date().getFullYear()}</div>
    </aside>
  );
}

export const __appSidebarMarker = true;
