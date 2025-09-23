"use client"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Home, ClipboardList, BookOpen, FlaskConical, CalendarDays } from "lucide-react"

interface EpamigTabsProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export function EpamigTabs({ activeTab, onTabChange }: EpamigTabsProps) {
  const tabs = [
    { 
      icon: Home, 
      label: "Inicio", 
      value: "/"
    },
    { 
      icon: ClipboardList, 
      label: "Projetos", 
      value: "projetos"
    },
    { 
      icon: BookOpen, 
      label: "Publicações", 
      value: "publicacoes"
    },
    { 
      icon: FlaskConical, 
      label: "Tecnologias", 
      value: "tecnologias"
    },
    { 
      icon: CalendarDays, 
      label: "Eventos", 
      value: "eventos"
    }
  ]

  return (
    <div className="px-2 sm:px-0 lg:px-0 pb-1">
      <div className="max-w-7xl mx-auto">
  <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
          <div className="overflow-x-auto">
            {/* Tabs para mobile (vertical) */}
            <TabsList className="sm:hidden inline-flex h-14 bg-gray-50 border border-gray-200 rounded-lg p-1 min-w-max w-full justify-between">
              {tabs.map((tab) => (
                <TabsTrigger 
                  key={tab.value} 
                  value={tab.value}
                  className="flex flex-col items-center justify-center space-y-1 px-2 py-2 text-xs font-medium rounded-md data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm text-gray-500 hover:text-gray-700 transition-colors flex-1 min-w-0 touch-manipulation"
                >
                  <tab.icon className="h-5 w-5 flex-shrink-0" />
                  <span className="text-xs truncate">{tab.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>
            
            {/* Abas estilo Power BI para desktop */}
            <div className="hidden sm:block">
              <div className="flex bg-white justify-end shadow-lg rounded-t-xl border-b-2 border-gray-200">
                {tabs.map((tab, index) => (
                  <div key={tab.value} className="flex items-center">
                    <button
                      onClick={() => onTabChange(tab.value)}
                      aria-current={activeTab === tab.value ? "page" : undefined}
                      className={`
                        flex items-center space-x-3 px-8 py-4 text-base font-medium border-b-3 transition-all duration-200 relative justify-center
                        ${activeTab === tab.value 
                          ? 'border-epamig-primary text-epamig-primary bg-blue-50' 
                          : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300 hover:bg-gray-50'
                        }
                      `}
                    >
                      <tab.icon className={`h-5 w-5 ${activeTab === tab.value ? 'text-epamig-primary' : 'text-gray-500'}`} />
                      <span className="text-base font-medium">{tab.label}</span>
                      {activeTab === tab.value && (
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-epamig-primary"></div>
                      )}
                    </button>
                    {index < tabs.length - 1 && (
                      <Separator orientation="vertical" className="h-8 bg-gray-300" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Tabs>
      </div>
    </div>
  )
}
