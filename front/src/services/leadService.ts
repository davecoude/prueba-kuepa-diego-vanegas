import { createAvatarScope } from "@radix-ui/react-avatar"
import { get, post } from "../util/http"

const api = '/lead'

export interface LeadPayload {
  first_name: string
  last_name: string
  email: string
  mobile_phone: string
  interestProgram: string
}

export interface Lead extends Omit<LeadPayload, 'interestProgram'> {
  _id: string
  full_name: string
  status: 'active' | 'inactive'
  created_at: string
  interestProgram: { _id: string, name: string } | null
}

export const leadService = {
  api,
  get: async({_id}:{_id:string}) =>{
    return await get({api: `${api}/get/${_id}`})
  },
  list: async (): Promise<Lead[]> => {
    const response = await get({ api: `${api}/`})
    return response?.list ?? []
  },
  create: async (data: LeadPayload) => {
    return await post({ api: `${api}/create`, options: { data } })
  }
}

