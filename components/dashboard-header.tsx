import Image from "next/image"
import { Globe, Mail } from "lucide-react"

export function DashboardHeader() {
  return (
    <header className="border-b bg-white">
      <div className="container mx-auto px-4 py-4 relative">
        {/* Layout com posicionamento absoluto para centralização perfeita */}
        <div className="flex items-center justify-between md:relative">
          {/* Logo */}
          <div className="relative h-18 w-46 md:h-14 md:w-40 flex-shrink-0">
            <Image src="/epamig_logo.svg" alt="EPAMIG Logo" fill className="object-contain" priority />
          </div>

          {/* Título e descrição - posicionamento absoluto para centro perfeito */}
          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center text-center whitespace-nowrap">
            <h1 className="text-green-700 text-base md:text-xl font-bold leading-tight">
              Empresa de Pesquisa Agropecuária de Minas Gerais
            </h1>
            <p className="text-xs md:text-sm text-gray-600 font-bold mt-1">
              Secretaria de Estado de Agricultura, Pecuária e Abastecimento de Minas Gerais
            </p>
          </div>

          {/* Links do topo direito - posicionados após a linha roxa */}
          <div className="absolute right-[-2rem] top-1/2 transform -translate-y-1/2 flex items-center gap-2 flex-shrink-0">
            <a
              href="https://www.epamig.br"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium bg-white border border-gray-300 rounded-md hover:bg-yellow-500 hover:border-yellow-300 hover:text-yellow-700 transition-colors duration-200 text-center"
              style={{ color: "#237293" }}
            >
              <Globe className="w-4 h-4" />
              <span className="hidden sm:inline">Site</span>
            </a>
            <a
              href="https://mail.google.com/mail/u/0/#inbox"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium bg-white border border-gray-200 rounded-md hover:bg-yellow-500 hover:border-yellow-300 hover:text-yellow-700 transition-colors duration-200 text-center"
              style={{ color: "#237293" }}
            >
              <Mail className="w-4 h-4" />
              <span className="hidden sm:inline">E-mail</span>
            </a>
            <a
              href="https://empresade125369.rm.cloudtotvs.com.br/Corpore.Net/Login.aspx"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium bg-white border border-gray-200 rounded-md hover:bg-yellow-500 hover:border-yellow-300 hover:text-yellow-700 transition-colors duration-200 text-center"
              style={{ color: "#237293" }}
            >
              <Image src="/icon_totvs.svg" alt="TOTVS" width={16} height={16} className="w-4 h-4" />
              <span className="hidden sm:inline">Portal ADM</span>
            </a>
          </div>
        </div>
      </div>

      {/* Linha de separação sutil */}
      <div className="h-px bg-gradient-to-r from-transparent via-green-200 to-transparent"></div>
    </header>
  )
}
