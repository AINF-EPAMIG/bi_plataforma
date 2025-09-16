import { Separator } from "../components/ui/separator";
import { Globe, Mail } from "lucide-react";
import Image from "next/image";

export default function Sidebar() {
  return (
    <aside
      className="fixed left-0 top-0 h-screen w-[250px] bg-[#025C3E] border-r-[10px] border-r-[#157A5B] flex flex-col justify-between shadow-lg"
    >
      <div className="p-6">
        <div className="flex items-center px-6 py-4">
          <Image
            src="/logo-embrapa.png"
            alt="Logo Embrapa"
            width={32}
            height={32}
            className="h-8 w-8 mr-3"
          />
          <span className="text-xl font-semibold text-green-800">BI Plataforma</span>
        </div>
        <h1 className="text-[32px] font-bold text-[#F9F9F9] leading-tight mb-2">
          Plataforma
          <br /> Interativa
        </h1>
        <Separator className="bg-[#FF1212] h-[1px] my-4" />
        <div className="flex items-center gap-4 mb-4">
          <Image
            src="/epamig_branca.png"
            alt="Logo"
            className="w-full max-w-[120px] mx-auto h-auto mb-2"
            width={120}
            height={40}
          />
        </div>
        <div className="flex justify-between mb-6">
          <a
            href="https://www.epamig.br/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center"
          >
            <Globe size={20} color="#F9F9F9" />
            <span className="text-[10px] text-[#F9F9F9]">Site</span>
          </a>
          <a
            href="https://empresade125369.rm.cloudtotvs.com.br/Corpore.Net/Login.aspx"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center"
          >
            <Image
              src="/icon_totvs.svg"
              alt="Portal ADM"
              width={20}
              height={20}
              className="w-5 h-5 mb-1"
              style={{ filter: "brightness(0) invert(1)" }}
            />
            <span className="text-[10px] text-[#F9F9F9]">Portal ADM</span>
          </a>
          <a
            href="https://mail.google.com/mail/u/0/#inbox"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center"
          >
            <Mail size={20} color="#F9F9F9" />
            <span className="text-[10px] text-[#F9F9F9]">E-mail</span>
          </a>
        </div>
        <nav className="flex flex-col gap-2">
          <a
            href="/"
            className="text-[16px] text-[#F9F9F9] py-2 px-3 rounded hover:bg-[#044d33]"
          >
            Início
          </a>
          <a
            href="/projetos"
            className="text-[16px] text-[#F9F9F9] py-2 px-3 rounded hover:bg-[#044d33]"
          >
            Projetos
          </a>
          <a
            href="/publicacoes"
            className="text-[16px] text-[#F9F9F9] py-2 px-3 rounded hover:bg-[#044d33]"
          >
            Publicações
          </a>
          <a
            href="/tecnologias"
            className="text-[16px] text-[#F9F9F9] py-2 px-3 rounded hover:bg-[#044d33]"
          >
            Tecnologias
          </a>
          <a
            href="/eventos"
            className="text-[16px] text-[#F9F9F9] py-2 px-3 rounded hover:bg-[#044d33]"
          >
            Eventos
          </a>
        </nav>
      </div>
      <div className="p-4 text-center text-[10px] text-[#F9F9F9] opacity-70">
        &copy; {new Date().getFullYear()} BI Plataforma
      </div>
    </aside>
  );
}
