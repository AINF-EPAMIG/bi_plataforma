"use client"

import { useState } from "react"
import { ArrowUpDown, Calendar, Download, Eye, Filter, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

// Dados de exemplo
const managementActs = [
  {
    id: 1,
    type: "Portarias",
    number: "12345678",
    description: "TESTE",
    date: new Date("2025-01-10"),
    status: "Vigente",
  },
  {
    id: 2,
    type: "Portarias",
    number: "8245",
    description:
      "Designar BRUNO HENRIQUE GREGÓRIO DE JESUS, Tecnólogo em Análise e Desenvolvimento de Sistemas, para exercer o cargo em comissão de Assessor Técnico I, estabelecendo sua lotação na Assessoria de Informática - AINF.",
    date: new Date("2025-01-08"),
    status: "Vigente",
  },
  {
    id: 3,
    type: "Portarias",
    number: "8244",
    description:
      "Designar ANDREA PEREIRA DIAS, Tecnóloga em Gestão de Recursos Humanos, para exercer o cargo em comissão de Assessor Técnico I, estabelecendo sua lotação na Divisão de Administração de Pessoal - DVAP do Departamento de Gestão de Pessoas - DPGP.",
    date: new Date("2025-01-07"),
    status: "Vigente",
  },
  {
    id: 4,
    type: "Portarias",
    number: "8243",
    description:
      "Retificar o texto da Portaria nº 8197, a qual designou o empregado ÂNGELO HERBERT ARCANJO, para exercer o cargo em comissão de Assessor Técnico II.",
    date: new Date("2025-01-02"),
    status: "Vigente",
  },
  {
    id: 5,
    type: "Portarias",
    number: "8242",
    description:
      "Designar os seguintes empregados para compor as comissões previstas para a EPAMIG no 8º HortPANC, evento a ser realizado nos dias 1 e 2 de julho de 2025 em Sete Lagoas - MG e dia 3 de julho de 2025 em Prudente de Morais - MG, na modalidade presencial.",
    date: new Date("2025-01-02"),
    status: "Vigente",
  },
  {
    id: 6,
    type: "Portarias",
    number: "8241",
    description:
      "Designar NARA LEITE SOUZA ENOQUE, Auxiliar Administrativo, para, no período de 03/02/2025 a 16/02/2025 responder pelo cargo em comissão de Assessor Técnico I.",
    date: new Date("2025-01-02"),
    status: "Vigente",
  },
]

export function ManagementActsTable() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)

  return (
    <Card>
      <CardContent className="p-6">
        <div className="mb-4 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="h-8 gap-1">
                <Filter className="h-3.5 w-3.5" />
                <span>Colunas</span>
              </Button>
              <Button variant="outline" size="sm" className="h-8 gap-1">
                <Download className="h-3.5 w-3.5" />
                <span>Exportar</span>
              </Button>
              <Button variant="secondary" size="sm" className="h-8 gap-1">
                <X className="h-3.5 w-3.5" />
                <span>Limpar Filtros</span>
              </Button>
            </div>
            <div className="text-sm text-muted-foreground">Exibindo 1-20 de 8.382 items.</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Tipos</label>
              <Select defaultValue="portarias">
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="portarias">Portarias</SelectItem>
                  <SelectItem value="resolucoes">Resoluções</SelectItem>
                  <SelectItem value="decretos">Decretos</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Número</label>
              <Input placeholder="Digite o número" />
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Descrição</label>
              <Input placeholder="Digite a descrição" />
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Data do Documento</label>
              <div className="flex gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      {selectedDate ? (
                        format(selectedDate, "dd/MM/yyyy", { locale: ptBR })
                      ) : (
                        <span>Selecione a data</span>
                      )}
                      <Calendar className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent mode="single" selected={selectedDate} onSelect={setSelectedDate} locale={ptBR} />
                  </PopoverContent>
                </Popover>
                <Button variant="outline" size="icon" className="shrink-0">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Status</label>
              <Select defaultValue="vigente">
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Vigente</SelectItem>
                  <SelectItem value="revogado">Revogado</SelectItem>
                  <SelectItem value="expirado">Expirado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[120px]">Tipos</TableHead>
              <TableHead>
                <div className="flex items-center gap-1">
                  Número
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Data do Documento</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-center">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {managementActs.map((act) => (
              <TableRow key={act.id}>
                <TableCell>{act.type}</TableCell>
                <TableCell>{act.number}</TableCell>
                <TableCell className="max-w-md truncate" title={act.description}>
                  {act.description}
                </TableCell>
                <TableCell>{format(act.date, "dd/MM/yyyy")}</TableCell>
                <TableCell>{act.status}</TableCell>
                <TableCell className="text-center">
                  <Button variant="default" size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                    <Eye className="h-4 w-4 mr-1" />
                    Visualizar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
