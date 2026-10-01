import { get } from "@/util/http"

const api = '/program'

export interface Program {
  _id: string
  name: string
  description?: string
}

export const programService = {
  list: async (): Promise<Program[]> => {
    const response = await get({ api: `${api}/`})
    return response?.list ?? []
  }
}