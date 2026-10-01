import { app } from "@/atoms/kuepa"
import { useEffect, useCallback, useState } from "react"
import { programService, Program } from "@/services/programService"
import { leadService, Lead } from "@/services/leadService"
import { LeadForm } from "./components/lead-form"
import { LeadTable } from "./components/lead-table"
import { useTranslation } from "react-i18next"
import { useSafeMantineTheme } from "@mantine/core"

export interface LeadsProps {
}



export default function Leads (props?: LeadsProps) {

  const [programs, setPrograms] = useState<Program[]>([])
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)

  const loadLeads = useCallback(async () => {
    setLoading(true)
    setLeads(await leadService.list())
    setLoading(false)
  }, [])

  useEffect(() => {
    app.set({
      ...(app.get() || {}),
      app: 'kuepa',
      module: 'leads',
      window: 'crm',
      back: null,
      accent: 'purple',
      breadcrumb:[
        {
          title: 'Leads',
          url: '/leads'
        }
      ]
    })

    programService.list().then(setPrograms)
    loadLeads()
  }, [loadLeads])
  return (
    <div className="flex flex-col gap-6">
      <LeadForm programs={programs} onCreated={loadLeads}/>
      <LeadTable leads={leads} loading={loading}/>
    </div>
  )
}