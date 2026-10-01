import { FormEvent, useState } from "react"
import { ArrowUpRight } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { leadService, LeadPayload } from "@/services/leadService"
import { Program } from "@/services/programService"

const EMPTY: LeadPayload = {
  first_name: '',
  last_name: '',
  email: '',
  mobile_phone: '',
  interestProgram: '',
}

type Errors = Partial<Record<keyof LeadPayload, string>>

const validate = (form: LeadPayload): Errors => {
  const errors: Errors = {}
  if (form.first_name.trim().length < 2) errors.first_name = 'Ingresa el nombre'
  if (form.last_name.trim().length < 2) errors.last_name = 'Ingresa el apellido'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) errors.email = 'Correo inválido'
  if (!/^\d{10}$/.test(form.mobile_phone)) errors.mobile_phone = 'Debe tener 10 dígitos'
  if (!form.interestProgram) errors.interestProgram = 'Selecciona un programa'
  return errors
}

const inputClass = 'h-10 rounded-none border-0 border-b border-neutral-400 bg-transparent px-0 shadow-none focus-visible:ring-0 focus-visible:border-neutral-900'
const labelClass = 'font-normal text-neutral-700'

interface LeadFormProps {
  programs: Program[]
  onCreated: () => void
}

export function LeadForm({ programs, onCreated }: LeadFormProps) {
  const [form, setForm] = useState<LeadPayload>(EMPTY)
  const [errors, setErrors] = useState<Errors>({})
  const [loading, setLoading] = useState(false)

  const setField = (field: keyof LeadPayload, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
    setErrors(prev => ({ ...prev, [field]: undefined }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const found = validate(form)
    if (Object.keys(found).length) return setErrors(found)

    setLoading(true)
    let response
    try {
      response = await leadService.create(form)
    } finally {
      setLoading(false)
    }

    if (response?.code === 201) {
      toast({ title: 'Lead registrado', description: `${form.first_name} ${form.last_name} quedó en el CRM.`, className: 'border-emerald-400' })
      setForm(EMPTY)
      onCreated()
    } else if (response?.code === 409) {
      toast({ variant: 'destructive', title: 'Lead duplicado', description: 'Ya existe un lead con ese correo o celular.' })
    } else if (response?.code === 400) {
      setErrors(response.errors ?? {})
    } else {
      toast({ variant: 'destructive', title: 'Error', description: 'No se pudo registrar el lead.' })
    }
  }

  const fieldError = (field: keyof LeadPayload) =>
    errors[field] && <p className="text-xs text-red-600">{errors[field]}</p>

  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 gap-10 rounded-3xl bg-white p-6 md:p-10 shadow-sm">

      <div className="flex flex-col justify-between gap-8">
        <div className="space-y-4">
          <h2 className="text-4xl md:text-5xl font-medium tracking-tight leading-tight text-neutral-900">
            Convirtamos el interés en matrícula.
          </h2>
          <p className="text-sm text-neutral-600 max-w-sm">
            Registra a cada persona interesada en nuestros programas académicos y dale seguimiento desde el CRM.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-4 border-t border-neutral-200 pt-6">
          <div>
            <p className="text-xs text-neutral-500">Paso 1</p>
            <p className="text-sm font-medium text-neutral-900">Registra</p>
          </div>
          <div>
            <p className="text-xs text-neutral-500">Paso 2</p>
            <p className="text-sm font-medium text-neutral-900">Asigna programa</p>
          </div>
          <div>
            <p className="text-xs text-neutral-500">Paso 3</p>
            <p className="text-sm font-medium text-neutral-900">Da seguimiento</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} noValidate className="rounded-2xl bg-neutral-100 p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">

        <div className="space-y-1">
          <Label htmlFor="first_name" className={labelClass}>Nombre*</Label>
          <Input id="first_name" className={inputClass} value={form.first_name}
            onChange={e => setField('first_name', e.target.value)} />
          {fieldError('first_name')}
        </div>

        <div className="space-y-1">
          <Label htmlFor="last_name" className={labelClass}>Apellido*</Label>
          <Input id="last_name" className={inputClass} value={form.last_name}
            onChange={e => setField('last_name', e.target.value)} />
          {fieldError('last_name')}
        </div>

        <div className="space-y-1">
          <Label htmlFor="email" className={labelClass}>Correo*</Label>
          <Input id="email" type="email" className={inputClass} value={form.email}
            onChange={e => setField('email', e.target.value)} />
          {fieldError('email')}
        </div>

        <div className="space-y-1">
          <Label htmlFor="mobile_phone" className={labelClass}>Celular*</Label>
          <Input id="mobile_phone" type="tel" inputMode="numeric" maxLength={10} className={inputClass}
            value={form.mobile_phone}
            onChange={e => setField('mobile_phone', e.target.value.replace(/\D/g, ''))} />
          {fieldError('mobile_phone')}
        </div>

        <div className="space-y-1 md:col-span-2">
          <Label className={labelClass}>Programa de interés*</Label>
          <Select value={form.interestProgram} onValueChange={value => setField('interestProgram', value)}>
            <SelectTrigger className={`${inputClass} data-[placeholder]:text-neutral-400`}>
              <SelectValue placeholder={programs.length ? 'Selecciona un programa' : 'No hay programas (corre el seeder)'} />
            </SelectTrigger>
            <SelectContent className="max-h-64">
              {programs.map(program => (
                <SelectItem key={program._id} value={program._id}>{program.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {fieldError('interestProgram')}
        </div>

        <div className="md:col-span-2 flex items-center gap-4 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-md bg-purple-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-purple-600 disabled:opacity-60"
          >
            {loading ? 'Guardando…' : 'Registrar lead'}
            <ArrowUpRight className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => { setForm(EMPTY); setErrors({}) }}
            className="text-sm text-neutral-500 underline-offset-4 hover:underline"
          >
            Limpiar
          </button>
        </div>
      </form>
    </section>
  )
}