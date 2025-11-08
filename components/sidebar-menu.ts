import React from 'react';

/* eslint-disable @typescript-eslint/no-unused-vars */

// Menu unificado para o sidebar da plataforma
import AssignmentIcon from '@mui/icons-material/Assignment';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import ScienceIcon from '@mui/icons-material/Science';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

export interface SubItem {
  label: string;
  href: string;
}
export interface MenuItem {
  label: string;
  icon: React.ReactNode;
  sub: SubItem[];
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
export const menuItems: MenuItem[] = [
  {
    label: 'Projetos',
    icon: React.createElement(AssignmentIcon, { fontSize: 'small', className: 'text-[#025C3E]' }),
    sub: [
      { label: 'Visão Geral', href: '/projetos/financeiro' },
      { label: 'R$ Projeção', href: '/projetos/projecao' },
      { label: 'Fonte Financiadora', href: '/projetos/fonte' },
      { label: 'Captação de Recursos', href: '/projetos/captacao' },
    ],
  },
  {
    label: 'Publicações',
    icon: React.createElement(MenuBookIcon, { fontSize: 'small', className: 'text-[#025C3E]' }),
    sub: [
      { label: 'Artigos', href: '/publicacoes/artigos' },
      { label: 'Livros', href: '/publicacoes/livros' },
    ],
  },
  {
    label: 'Tecnologias',
    icon: React.createElement(ScienceIcon, { fontSize: 'small', className: 'text-[#303836]' }),
    sub: [
      { label: 'Patentes', href: '/tecnologias/patentes' },
      { label: 'Mercado', href: '/tecnologias/mercado' },
    ],
  },
  {
    label: 'Eventos',
    icon: React.createElement(CalendarMonthIcon, { fontSize: 'small', className: 'text-[#025C3E]' }),
    sub: [
      { label: 'Próximos', href: '/eventos/proximos' },
      { label: 'Passados', href: '/eventos/passados' },
    ],
  },
];
