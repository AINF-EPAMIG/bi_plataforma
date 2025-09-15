"use client"

import Image from "next/image"
import Link from "next/link"
import { Globe, User, ChevronDown, Menu, X } from "lucide-react"
import { useState } from "react"
import { signIn, signOut, useSession } from "next-auth/react"

export default function Header() {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { data: session } = useSession()

  const handleMouseEnter = (menuId: string) => {
    setActiveDropdown(menuId)
  }

  const handleMouseLeave = () => {
    setActiveDropdown(null)
  }

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  return (
    <header className="w-full">
      {/* Topo do header com logo e título */}
      <div className="container mx-auto px-4 py-3 flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center gap-2 md:gap-4">
          <div className="relative h-20 w-52 md:h-16 md:w-48">
            <Image
              src="/epamig_logo.svg"
              alt="EPAMIG Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <div className="hidden md:flex md:flex-col">
            <h1 className="text-green-700 text-lg md:text-2xl font-semibold leading-tight">
              Empresa de Pesquisa Agropecuária de Minas Gerais
            </h1>
            <p className="text-xs md:text-base text-gray-800 font-bold">
              Secretaria de Estado de Agricultura, Pecuária e Abastecimento de Minas Gerais
            </p>
          </div>
        </div>

        {/* Links do topo direito */}
        <div className="flex gap-4 mt-3 md:mt-0">
          <Link href="https://epamig.br" className="flex items-center gap-1 text-sm text-green-700 hover:underline" target="_blank" rel="noopener noreferrer">
            <Globe size={16} />
            <span>Site</span>
          </Link>
          {session ? (
            <button
              onClick={() => signOut()}
              className="flex items-center gap-1 text-sm text-green-700 hover:underline"
            >
              <User size={16} />
              <span>Sair</span>
            </button>
          ) : (
            <button
              onClick={() => signIn('google')}
              className="flex items-center gap-1 text-sm text-green-700 hover:underline"
            >
              <User size={16} />
              <span>Login Google</span>
            </button>
          )}
        </div>
      </div>

      {/* Botão de menu mobile */}
      <div className="bg-green-700 py-2 md:hidden">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <span className="text-white font-medium">Menu</span>
          <button 
            onClick={toggleMobileMenu}
            className="text-white p-2 focus:outline-none"
            aria-label={mobileMenuOpen ? "Fechar menu" : "Abrir menu"}
          >
            {mobileMenuOpen ? (
              <X size={24} />
            ) : (
              <Menu size={24} />
            )}
          </button>
        </div>
      </div>

      {/* Primeiro menu de navegação */}
      <nav className={`bg-green-700 text-white relative ${mobileMenuOpen ? 'block' : 'hidden md:block'}`}>
        <div className="container mx-auto">
          <ul className="flex flex-col md:flex-row md:flex-wrap text-sm">
            <li className="px-4 py-2 bg-gray-100 text-green-700 hover:bg-gray-200">
              <Link href="#" className="text-xs md:text-sm block">Início</Link>
            </li>
            <li className="px-4 py-2 hover:bg-green-600">
              <Link href="/login" className="text-xs md:text-sm flex items-center gap-1">
                <span>exemplo login mysql</span>
              </Link>
            </li>
            <li
              className="px-4 py-2 hover:bg-green-600 relative"
              onMouseEnter={() => handleMouseEnter("consulta")}
              onMouseLeave={handleMouseLeave}
            >
              <div className="flex items-center justify-between">
                <Link href="#" className="flex items-center text-xs md:text-sm">
                  Exemplo 2
                </Link>
                <button 
                  className="md:hidden ml-2"
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveDropdown(activeDropdown === "consulta" ? null : "consulta");
                  }}
                >
                  <ChevronDown className="h-4 w-4" />
                </button>
                <span className="hidden md:inline-block ml-1">
                  <ChevronDown className="h-2 w-2 md:h-3 md:w-3" />
                </span>
              </div>
              {activeDropdown === "consulta" && (
                <div className="md:absolute md:left-0 md:top-full md:mt-0 w-full md:w-48 bg-white text-gray-800 shadow-lg z-10">
                  <Link href="#" className="block px-4 py-2 hover:bg-gray-100 text-xs">
                    Opção 1
                  </Link>
                  <Link href="#" className="block px-4 py-2 hover:bg-gray-100 text-xs">
                    Opção 2
                  </Link>
                  <Link href="#" className="block px-4 py-2 hover:bg-gray-100 text-xs">
                    Opção 3
                  </Link>
                </div>
              )}
            </li>
            <li
              className="px-4 py-2 hover:bg-green-600 relative"
              onMouseEnter={() => handleMouseEnter("usuario")}
              onMouseLeave={handleMouseLeave}
            >
              <div className="flex items-center justify-between">
                <Link href="#" className="flex items-center text-xs md:text-sm">
                  Exemplo 3
                </Link>
                <button 
                  className="md:hidden ml-2"
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveDropdown(activeDropdown === "usuario" ? null : "usuario");
                  }}
                >
                  <ChevronDown className="h-4 w-4" />
                </button>
                <span className="hidden md:inline-block ml-1">
                  <ChevronDown className="h-3 w-3" />
                </span>
              </div>
              {activeDropdown === "usuario" && (
                <div className="md:absolute md:left-0 md:top-full md:mt-0 w-full md:w-48 bg-white text-gray-800 shadow-lg z-10">
                  <Link href="#" className="block px-4 py-2 hover:bg-gray-100">
                    Perfil
                  </Link>
                  <Link href="#" className="block px-4 py-2 hover:bg-gray-100">
                    Configurações
                  </Link>
                  <Link href="#" className="block px-4 py-2 hover:bg-gray-100">
                    Sair
                  </Link>
                </div>
              )}
            </li>
            <li
              className="px-4 py-2 hover:bg-green-600 relative"
              onMouseEnter={() => handleMouseEnter("administracao")}
              onMouseLeave={handleMouseLeave}
            >
              <div className="flex items-center justify-between">
                <Link href="#" className="flex items-center text-xs md:text-sm">
                  Exemplo 4
                </Link>
                <button 
                  className="md:hidden ml-2"
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveDropdown(activeDropdown === "administracao" ? null : "administracao");
                  }}
                >
                  <ChevronDown className="h-4 w-4" />
                </button>
                <span className="hidden md:inline-block ml-1">
                  <ChevronDown className="h-3 w-3" />
                </span>
              </div>
              {activeDropdown === "administracao" && (
                <div className="md:absolute md:left-0 md:top-full md:mt-0 w-full md:w-48 bg-white text-gray-800 shadow-lg z-10">
                  <Link href="#" className="block px-4 py-2 hover:bg-gray-100">
                    Usuários
                  </Link>
                  <Link href="#" className="block px-4 py-2 hover:bg-gray-100">
                    Permissões
                  </Link>
                  <Link href="#" className="block px-4 py-2 hover:bg-gray-100">
                    Configurações
                  </Link>
                </div>
              )}
            </li>
            <li
              className="px-4 py-2 hover:bg-green-600 relative"
              onMouseEnter={() => handleMouseEnter("formacao")}
              onMouseLeave={handleMouseLeave}
            >
              <div className="flex items-center justify-between">
                <Link href="#" className="flex items-center text-xs md:text-sm">
                  Exemplo 5
                </Link>
                <button 
                  className="md:hidden ml-2"
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveDropdown(activeDropdown === "formacao" ? null : "formacao");
                  }}
                >
                  <ChevronDown className="h-4 w-4" />
                </button>
                <span className="hidden md:inline-block ml-1">
                  <ChevronDown className="h-3 w-3" />
                </span>
              </div>
              {activeDropdown === "formacao" && (
                <div className="md:absolute md:left-0 md:top-full md:mt-0 w-full md:w-48 bg-white text-gray-800 shadow-lg z-10">
                  <Link href="#" className="block px-4 py-2 hover:bg-gray-100">
                    Cursos
                  </Link>
                  <Link href="#" className="block px-4 py-2 hover:bg-gray-100">
                    Treinamentos
                  </Link>
                  <Link href="#" className="block px-4 py-2 hover:bg-gray-100">
                    Certificados
                  </Link>
                </div>
              )}
            </li>
            <li
              className="px-4 py-2 hover:bg-green-600 relative"
              onMouseEnter={() => handleMouseEnter("publicacao")}
              onMouseLeave={handleMouseLeave}
            >
              <div className="flex items-center justify-between">
                <Link href="#" className="flex items-center text-xs md:text-sm">
                  Exemplo 6
                </Link>
                <button 
                  className="md:hidden ml-2"
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveDropdown(activeDropdown === "publicacao" ? null : "publicacao");
                  }}
                >
                  <ChevronDown className="h-4 w-4" />
                </button>
                <span className="hidden md:inline-block ml-1">
                  <ChevronDown className="h-3 w-3" />
                </span>
              </div>
              {activeDropdown === "publicacao" && (
                <div className="md:absolute md:left-0 md:top-full md:mt-0 w-full md:w-48 bg-white text-gray-800 shadow-lg z-10">
                  <Link href="#" className="block px-4 py-2 hover:bg-gray-100">
                    Artigos
                  </Link>
                  <Link href="#" className="block px-4 py-2 hover:bg-gray-100">
                    Pesquisas
                  </Link>
                  <Link href="#" className="block px-4 py-2 hover:bg-gray-100">
                    Relatórios
                  </Link>
                </div>
              )}
            </li>
            <li
              className="px-4 py-2 hover:bg-green-600 relative"
              onMouseEnter={() => handleMouseEnter("tecnologias")}
              onMouseLeave={handleMouseLeave}
            >
              <div className="flex items-center justify-between">
                <Link href="#" className="flex items-center text-xs md:text-sm">
                  Exemplo 7
                </Link>
                <button 
                  className="md:hidden ml-2"
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveDropdown(activeDropdown === "tecnologias" ? null : "tecnologias");
                  }}
                >
                  <ChevronDown className="h-4 w-4" />
                </button>
                <span className="hidden md:inline-block ml-1">
                  <ChevronDown className="h-3 w-3" />
                </span>
              </div>
              {activeDropdown === "tecnologias" && (
                <div className="md:absolute md:left-0 md:top-full md:mt-0 w-full md:w-48 bg-white text-gray-800 shadow-lg z-10">
                  <Link href="#" className="block px-4 py-2 hover:bg-gray-100">
                    Inovações
                  </Link>
                  <Link href="#" className="block px-4 py-2 hover:bg-gray-100">
                    Ferramentas
                  </Link>
                  <Link href="#" className="block px-4 py-2 hover:bg-gray-100">
                    Sistemas
                  </Link>
                </div>
              )}
            </li>
            <li
              className="px-4 py-2 hover:bg-green-600 relative"
              onMouseEnter={() => handleMouseEnter("eventos")}
              onMouseLeave={handleMouseLeave}
            >
              <div className="flex items-center justify-between">
                <Link href="#" className="flex items-center text-xs md:text-sm">
                  Exemplo 8
                </Link>
                <button 
                  className="md:hidden ml-2"
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveDropdown(activeDropdown === "eventos" ? null : "eventos");
                  }}
                >
                  <ChevronDown className="h-4 w-4" />
                </button>
                <span className="hidden md:inline-block ml-1">
                  <ChevronDown className="h-3 w-3" />
                </span>
              </div>
              {activeDropdown === "eventos" && (
                <div className="md:absolute md:left-0 md:top-full md:mt-0 w-full md:w-48 bg-white text-gray-800 shadow-lg z-10">
                  <Link href="#" className="block px-4 py-2 hover:bg-gray-100">
                    Calendário
                  </Link>
                  <Link href="#" className="block px-4 py-2 hover:bg-gray-100">
                    Inscrições
                  </Link>
                  <Link href="#" className="block px-4 py-2 hover:bg-gray-100">
                    Histórico
                  </Link>
                </div>
              )}
            </li>
            <li
              className="px-4 py-2 hover:bg-green-600 relative"
              onMouseEnter={() => handleMouseEnter("preProjeto")}
              onMouseLeave={handleMouseLeave}
            >
              <div className="flex items-center justify-between">
                <Link href="#" className="flex items-center text-xs md:text-sm">
                  Exemplo 9
                </Link>
                <button 
                  className="md:hidden ml-2"
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveDropdown(activeDropdown === "preProjeto" ? null : "preProjeto");
                  }}
                >
                  <ChevronDown className="h-4 w-4" />
                </button>
                <span className="hidden md:inline-block ml-1">
                  <ChevronDown className="h-3 w-3" />
                </span>
              </div>
              {activeDropdown === "preProjeto" && (
                <div className="md:absolute md:left-0 md:top-full md:mt-0 w-full md:w-48 bg-white text-gray-800 shadow-lg z-10">
                  <Link href="#" className="block px-4 py-2 hover:bg-gray-100">
                    Novo
                  </Link>
                  <Link href="#" className="block px-4 py-2 hover:bg-gray-100">
                    Em andamento
                  </Link>
                  <Link href="#" className="block px-4 py-2 hover:bg-gray-100">
                    Concluídos
                  </Link>
                </div>
              )}
            </li>
            <li
              className="px-4 py-2 hover:bg-green-600 relative"
              onMouseEnter={() => handleMouseEnter("projetos")}
              onMouseLeave={handleMouseLeave}
            >
              <div className="flex items-center justify-between">
                <Link href="#" className="flex items-center text-xs md:text-sm">
                  Exemplo 10
                </Link>
                <button 
                  className="md:hidden ml-2"
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveDropdown(activeDropdown === "projetos" ? null : "projetos");
                  }}
                >
                  <ChevronDown className="h-4 w-4" />
                </button>
                <span className="hidden md:inline-block ml-1">
                  <ChevronDown className="h-3 w-3" />
                </span>
              </div>
              {activeDropdown === "projetos" && (
                <div className="md:absolute md:left-0 md:top-full md:mt-0 w-full md:w-48 bg-white text-gray-800 shadow-lg z-10">
                  <Link href="#" className="block px-4 py-2 hover:bg-gray-100">
                    Ativos
                  </Link>
                  <Link href="#" className="block px-4 py-2 hover:bg-gray-100">
                    Concluídos
                  </Link>
                  <Link href="#" className="block px-4 py-2 hover:bg-gray-100">
                    Relatórios
                  </Link>
                </div>
              )}
            </li>
          </ul>
        </div>
      </nav>

      {/* Segundo menu de navegação */}
      <nav className={`bg-green-700 text-white relative ${mobileMenuOpen ? 'block' : 'hidden md:block'}`}>
        <div className="container mx-auto">
          <ul className="flex flex-col md:flex-row md:flex-wrap text-sm">
            <li
              className="px-4 py-2 hover:bg-green-600 relative"
              onMouseEnter={() => handleMouseEnter("bancoDados")}
              onMouseLeave={handleMouseLeave}
            >
              <div className="flex items-center justify-between">
                <Link href="#" className="flex items-center text-xs md:text-sm">
                  Exemplo 11
                </Link>
                <button 
                  className="md:hidden ml-2"
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveDropdown(activeDropdown === "bancoDados" ? null : "bancoDados");
                  }}
                >
                  <ChevronDown className="h-4 w-4" />
                </button>
                <span className="hidden md:inline-block ml-1">
                  <ChevronDown className="h-2 w-2 md:h-3 md:w-3" />
                </span>
              </div>
              {activeDropdown === "bancoDados" && (
                <div className="md:absolute md:left-0 md:top-full md:mt-0 w-full md:w-48 bg-white text-gray-800 shadow-lg z-10">
                  <Link href="#" className="block px-4 py-2 hover:bg-gray-100 text-xs">
                    Consultas
                  </Link>
                  <Link href="#" className="block px-4 py-2 hover:bg-gray-100 text-xs">
                    Relatórios
                  </Link>
                  <Link href="#" className="block px-4 py-2 hover:bg-gray-100 text-xs">
                    Exportar
                  </Link>
                </div>
              )}
            </li>
            <li
              className="px-4 py-2 hover:bg-green-600 relative"
              onMouseEnter={() => handleMouseEnter("relatorios")}
              onMouseLeave={handleMouseLeave}
            >
              <div className="flex items-center justify-between">
                <Link href="#" className="flex items-center text-xs md:text-sm">
                  Exemplo 12
                </Link>
                <button 
                  className="md:hidden ml-2"
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveDropdown(activeDropdown === "relatorios" ? null : "relatorios");
                  }}
                >
                  <ChevronDown className="h-4 w-4" />
                </button>
                <span className="hidden md:inline-block ml-1">
                  <ChevronDown className="h-3 w-3" />
                </span>
              </div>
              {activeDropdown === "relatorios" && (
                <div className="md:absolute md:left-0 md:top-full md:mt-0 w-full md:w-48 bg-white text-gray-800 shadow-lg z-10">
                  <Link href="#" className="block px-4 py-2 hover:bg-gray-100">
                    Mensais
                  </Link>
                  <Link href="#" className="block px-4 py-2 hover:bg-gray-100">
                    Trimestrais
                  </Link>
                  <Link href="#" className="block px-4 py-2 hover:bg-gray-100">
                    Anuais
                  </Link>
                </div>
              )}
            </li>
            <li
              className="px-4 py-2 hover:bg-green-600 relative"
              onMouseEnter={() => handleMouseEnter("monitoramento")}
              onMouseLeave={handleMouseLeave}
            >
              <div className="flex items-center justify-between">
                <Link href="#" className="flex items-center text-xs md:text-sm">
                  Exemplo 13
                </Link>
                <button 
                  className="md:hidden ml-2"
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveDropdown(activeDropdown === "monitoramento" ? null : "monitoramento");
                  }}
                >
                  <ChevronDown className="h-4 w-4" />
                </button>
                <span className="hidden md:inline-block ml-1">
                  <ChevronDown className="h-3 w-3" />
                </span>
              </div>
              {activeDropdown === "monitoramento" && (
                <div className="md:absolute md:left-0 md:top-full md:mt-0 w-full md:w-48 bg-white text-gray-800 shadow-lg z-10">
                  <Link href="#" className="block px-4 py-2 hover:bg-gray-100">
                    Tempo Real
                  </Link>
                  <Link href="#" className="block px-4 py-2 hover:bg-gray-100">
                    Histórico
                  </Link>
                  <Link href="#" className="block px-4 py-2 hover:bg-gray-100">
                    Alertas
                  </Link>
                </div>
              )}
            </li>
            <li
              className="px-4 py-2 hover:bg-green-600 relative"
              onMouseEnter={() => handleMouseEnter("relatoriosGov")}
              onMouseLeave={handleMouseLeave}
            >
              <div className="flex items-center justify-between">
                <Link href="#" className="flex items-center text-xs md:text-sm">
                  Exemplo 14
                </Link>
                <button 
                  className="md:hidden ml-2"
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveDropdown(activeDropdown === "relatoriosGov" ? null : "relatoriosGov");
                  }}
                >
                  <ChevronDown className="h-4 w-4" />
                </button>
                <span className="hidden md:inline-block ml-1">
                  <ChevronDown className="h-3 w-3" />
                </span>
              </div>
              {activeDropdown === "relatoriosGov" && (
                <div className="md:absolute md:left-0 md:top-full md:mt-0 w-full md:w-48 bg-white text-gray-800 shadow-lg z-10">
                  <Link href="#" className="block px-4 py-2 hover:bg-gray-100">
                    Compliance
                  </Link>
                  <Link href="#" className="block px-4 py-2 hover:bg-gray-100">
                    Auditoria
                  </Link>
                  <Link href="#" className="block px-4 py-2 hover:bg-gray-100">
                    Indicadores
                  </Link>
                </div>
              )}
            </li>
            <li
              className="px-4 py-2 hover:bg-green-600 relative"
              onMouseEnter={() => handleMouseEnter("solicitacoes")}
              onMouseLeave={handleMouseLeave}
            >
              <div className="flex items-center justify-between">
                <Link href="#" className="flex items-center text-xs md:text-sm">
                  Exemplo 15
                </Link>
                <button 
                  className="md:hidden ml-2"
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveDropdown(activeDropdown === "solicitacoes" ? null : "solicitacoes");
                  }}
                >
                  <ChevronDown className="h-4 w-4" />
                </button>
                <span className="hidden md:inline-block ml-1">
                  <ChevronDown className="h-3 w-3" />
                </span>
              </div>
              {activeDropdown === "solicitacoes" && (
                <div className="md:absolute md:left-0 md:top-full md:mt-0 w-full md:w-48 bg-white text-gray-800 shadow-lg z-10">
                  <Link href="#" className="block px-4 py-2 hover:bg-gray-100">
                    Novas
                  </Link>
                  <Link href="#" className="block px-4 py-2 hover:bg-gray-100">
                    Em andamento
                  </Link>
                  <Link href="#" className="block px-4 py-2 hover:bg-gray-100">
                    Concluídas
                  </Link>
                </div>
              )}
            </li>
            <li
              className="px-4 py-2 hover:bg-green-600 relative"
              onMouseEnter={() => handleMouseEnter("ola")}
              onMouseLeave={handleMouseLeave}
            >
              <div className="flex items-center justify-between">
                <Link href="#" className="flex items-center text-xs md:text-sm">
                  Exemplo 16
                </Link>
                <button 
                  className="md:hidden ml-2"
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveDropdown(activeDropdown === "ola" ? null : "ola");
                  }}
                >
                  <ChevronDown className="h-4 w-4" />
                </button>
                <span className="hidden md:inline-block ml-1">
                  <ChevronDown className="h-3 w-3" />
                </span>
              </div>
              {activeDropdown === "ola" && (
                <div className="md:absolute md:left-0 md:top-full md:mt-0 w-full md:w-48 bg-white text-gray-800 shadow-lg z-10">
                  <Link href="#" className="block px-4 py-2 hover:bg-gray-100">
                    Meu Perfil
                  </Link>
                  <Link href="#" className="block px-4 py-2 hover:bg-gray-100">
                    Configurações
                  </Link>
                  <Link href="#" className="block px-4 py-2 hover:bg-gray-100">
                    Sair
                  </Link>
                </div>
              )}
            </li>
          </ul>
        </div>
      </nav>
    </header>
  )
}
