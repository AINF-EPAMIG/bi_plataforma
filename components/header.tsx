"use client"

import Link from "next/link"
import LanguageIcon from '@mui/icons-material/Language';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import PeopleIcon from '@mui/icons-material/People';
import ScienceOutlinedIcon from '@mui/icons-material/ScienceOutlined';

export default function Header() {
  return (
    <header className="bg-white shadow-sm flex flex-col md:flex-row items-center justify-between px-4 md:px-8 py-4 md:py-5 border-b-2 border-[#025C3E] sticky top-0 z-30 w-full gap-3 md:gap-4">
      <div className="text-center md:text-left">
        <h1 className="text-lg md:text-xl lg:text-2xl font-bold text-[#025C3E] leading-tight">Pesquisa360</h1>
      </div>
      <nav className="flex items-center divide-x divide-gray-300">
        <Link
          href="https://www.epamig.br"
          target="_blank"
          rel="noopener"
          className="flex items-center gap-2 px-3 md:px-4 text-[#025C3E] hover:text-[#038451] font-semibold transition-colors duration-200 text-xs md:text-sm whitespace-nowrap"
        >
          <LanguageIcon fontSize="small" />
          <span className="hidden sm:inline">Conheça a EPAMIG</span>
          <span className="sm:hidden">EPAMIG</span>
        </Link>
        <Link
          href="https://www.livrariaepamig.com.br/"
          target="_blank"
          rel="noopener"
          className="flex items-center gap-2 px-3 md:px-4 text-[#025C3E] hover:text-[#038451] font-semibold transition-colors duration-200 text-xs md:text-sm whitespace-nowrap"
        >
          <LibraryBooksIcon fontSize="small" />
          <span className="hidden sm:inline">Nossa Livraria</span>
          <span className="sm:hidden">Livraria</span>
        </Link>
        <Link
          href="https://www.epamig.br/pesquisa/lista_pesquisadores/"
          target="_blank"
          rel="noopener"
          className="flex items-center gap-2 px-3 md:px-4 text-[#025C3E] hover:text-[#038451] font-semibold transition-colors duration-200 text-xs md:text-sm whitespace-nowrap"
        >
          <PeopleIcon fontSize="small" />
          <span className="hidden sm:inline">Pesquisadores e Assessores</span>
          <span className="sm:hidden">Pesq.</span>
        </Link>
        <Link
          href="https://www.epamig.br/pesquisa/programas-estaduais-de-pesquisa/"
          target="_blank"
          rel="noopener"
          className="flex items-center gap-2 px-3 md:px-4 text-[#025C3E] hover:text-[#038451] font-semibold transition-colors duration-200 text-xs md:text-sm whitespace-nowrap"
        >
          <ScienceOutlinedIcon fontSize="small" />
          <span className="hidden lg:inline">Programas Estaduais de Pesquisas (PEP)</span>
          <span className="hidden sm:inline lg:hidden">Programas (PEP)</span>
          <span className="sm:hidden">PEP</span>
        </Link>
      </nav>
    </header>
  )
}
