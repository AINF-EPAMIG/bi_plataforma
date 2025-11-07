"use client"

import Link from "next/link"
import LanguageIcon from '@mui/icons-material/Language';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import PeopleIcon from '@mui/icons-material/People';
import ScienceOutlinedIcon from '@mui/icons-material/ScienceOutlined';

export default function Header() {
  return (
    <header className="bg-white shadow-sm flex flex-col md:flex-row items-center justify-between px-2 md:px-4 lg:px-6 py-2 md:py-3 border-b-2 border-[#025C3E] sticky top-0 z-30 w-full gap-2 md:gap-3">
      <div className="text-center md:text-left">
        <h1 className="text-base md:text-lg lg:text-xl font-bold text-[#025C3E] leading-tight">Pesquisa360</h1>
      </div>
      <nav className="flex items-center divide-x divide-gray-300">
        <Link
          href="https://www.epamig.br"
          target="_blank"
          rel="noopener"
          className="flex items-center gap-1 md:gap-1.5 px-2 md:px-3 text-[#025C3E] hover:text-[#038451] font-semibold transition-colors duration-200 text-xs whitespace-nowrap"
        >
          <LanguageIcon fontSize="small" />
          <span className="hidden sm:inline">Conheça a EPAMIG</span>
          <span className="sm:hidden">EPAMIG</span>
        </Link>
        <Link
          href="https://www.livrariaepamig.com.br/"
          target="_blank"
          rel="noopener"
          className="flex items-center gap-1 md:gap-1.5 px-2 md:px-3 text-[#025C3E] hover:text-[#038451] font-semibold transition-colors duration-200 text-xs whitespace-nowrap"
        >
          <LibraryBooksIcon fontSize="small" />
          <span className="hidden sm:inline">Nossa Livraria</span>
          <span className="sm:hidden">Livraria</span>
        </Link>
        <Link
          href="https://www.epamig.br/pesquisa/lista_pesquisadores/"
          target="_blank"
          rel="noopener"
          className="flex items-center gap-1 md:gap-1.5 px-2 md:px-3 text-[#025C3E] hover:text-[#038451] font-semibold transition-colors duration-200 text-xs whitespace-nowrap"
        >
          <PeopleIcon fontSize="small" />
          <span className="hidden sm:inline">Pesquisadores</span>
          <span className="sm:hidden">Pesq.</span>
        </Link>
        <Link
          href="https://www.epamig.br/pesquisa/programas-estaduais-de-pesquisa/"
          target="_blank"
          rel="noopener"
          className="flex items-center gap-1 md:gap-1.5 px-2 md:px-3 text-[#025C3E] hover:text-[#038451] font-semibold transition-colors duration-200 text-xs whitespace-nowrap"
        >
          <ScienceOutlinedIcon fontSize="small" />
          <span className="hidden lg:inline">Programas (PEP)</span>
          <span className="sm:hidden">PEP</span>
        </Link>
      </nav>
    </header>
  )
}
