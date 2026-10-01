// @import_dependencies

// @import_services

// @import_models
import { Program } from "@app/models"
import { ProgramModel } from "@app/models/programModel"

// @import_utilities
import { responseUtility } from "@core/utilities/responseUtility"

// @import_types


class ProgramService {
  
  
  constructor () {}
  
  
  
  public async list (_params) {
    try{
      const list = await Program.find({})
        .select('name description')
        .sort({ name: 1 })
        .lean()
      
      return responseUtility.success({ list })
    } catch (error) {
      console.log('error', error)
      return responseUtility.error('program.list', null, { code: 500 })
    }
  }
}

export const programService = new ProgramService()
export { ProgramService }