"use client";

import { useCallback, useMemo, useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { EpamigTabs } from "@/components/epamig-tabs";

export default function HomeTabs() {
  const router = useRouter();
  const pathname = usePathname();

  // Deriva a aba ativa a partir do caminho atual
  const derivedActive = useMemo(() => {
    if (!pathname || pathname === "/") return "/";
    const p = pathname.startsWith("/") ? pathname.slice(1) : pathname;
    return p; // 'projetos', 'publicacoes', etc.
  }, [pathname]);

  const [activeTab, setActiveTab] = useState<string>(derivedActive);

  // Mantém o estado sincronizado quando o usuário navega por outros meios
  useEffect(() => {
    setActiveTab(derivedActive);
  }, [derivedActive]);

  const handleTabChange = useCallback((tab: string) => {
    setActiveTab(tab);
    const target = tab === "/" ? "/" : `/${tab}`;
    router.push(target);
  }, [router]);

  return (
    <div className="hidden sm:block mb-0">
      <div className="relative z-10 -mb-px">
        <EpamigTabs activeTab={activeTab} onTabChange={handleTabChange} />
      </div>
    </div>
  );
}
