import { Program } from '@app/models'
import { IConsole } from '@client/client'

export const run = async (_params, console: IConsole) => {
  try {
    const programs = [
      { name: 'Bachillerato Virtual', description: 'Validación del bachillerato en modalidad virtual' },
      { name: 'Técnico en Sistemas', description: 'Programa técnico laboral en sistemas' },
      { name: 'Inglés Conversacional', description: 'Curso de inglés A1 a B2' },
      { name: 'Auxiliar Contable', description: 'Programa técnico en contabilidad' },
      { name: 'Marketing Digital', description: 'Curso corto de marketing digital' },
    ]
    for (const program of programs) {
      await Program.updateOne({ name: program.name }, { $set: program }, { upsert: true })
    }
  } catch (error) {
    console.log('error', error)
    return false
  }
  return true
}