import moment from "moment"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Lead } from "@/services/leadService"

interface LeadTableProps {
  leads: Lead[]
  loading: boolean
}

const headClass = 'font-normal text-neutral-600'

export function LeadTable({ leads, loading }: LeadTableProps) {
  return (
    <section className="rounded-3xl bg-white p-6 md:p-10 shadow-sm space-y-6">
      <div className="flex items-end justify-between border-b border-neutral-200 pb-4">
        <h2 className="text-2xl md:text-3xl font-medium tracking-tight text-neutral-900">Leads recientes</h2>
        <span className="rounded-md border border-neutral-300 px-3 py-1 text-xs text-neutral-600">
          {leads.length} registrados
        </span>
      </div>

      {loading ? (
        <p className="text-sm text-neutral-500">Cargando…</p>
      ) : leads.length === 0 ? (
        <p className="text-sm text-neutral-500">Aún no hay leads registrados.</p>
      ) : (
        <div className="rounded-2xl bg-neutral-100 p-2 md:p-4 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-neutral-300 hover:bg-transparent">
                <TableHead className={headClass}>Nombre</TableHead>
                <TableHead className={headClass}>Correo</TableHead>
                <TableHead className={headClass}>Celular</TableHead>
                <TableHead className={headClass}>Programa</TableHead>
                <TableHead className={headClass}>Registro</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leads.map(lead => (
                <TableRow key={lead._id} className="border-neutral-200 hover:bg-white/70">
                  <TableCell className="font-medium text-neutral-900">{lead.full_name}</TableCell>
                  <TableCell className="text-neutral-600">{lead.email}</TableCell>
                  <TableCell className="text-neutral-600">{lead.mobile_phone}</TableCell>
                  <TableCell>
                    {lead.interestProgram?.name ? (
                      <span className="rounded-md border border-purple-500 bg-purple-50 px-2 py-1 text-xs text-purple-700">
                        {lead.interestProgram.name}
                      </span>
                    ) : '—'}
                  </TableCell>
                  <TableCell className="text-neutral-500">{moment(lead.created_at).format('DD/MM/YYYY HH:mm')}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </section>
  )
}