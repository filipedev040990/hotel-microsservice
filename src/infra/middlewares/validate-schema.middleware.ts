import { Request, Response, NextFunction } from 'express'
import { join } from 'path'
import { readdirSync } from 'fs'
import { z } from 'zod'

const schemaDirectory = join(__dirname, '../schemas')

const loadSchemas = (): Record<string, z.ZodType<any, any, any>> => {
  const schemas: Record<string, z.ZodType<any, any, any>> = {}
  const files = readdirSync(schemaDirectory)

  for (const file of files) {
    if (file.endsWith('.schema.js')) {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const schemaModule = require(join(schemaDirectory, file))
      const defaultExportName = Object.keys(schemaModule).find(key => key.endsWith('Schema'))
      if (defaultExportName && schemaModule[defaultExportName]) {
        schemas[defaultExportName] = schemaModule[defaultExportName]
      }
    }
  }

  return schemas
}

const schemaMap = loadSchemas()

export const validateSchema = (schemaName: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const schema = schemaMap[schemaName]

      if (!schema) {
        return res.status(400).json({
          error: 'Validation Error',
          message: `Schema '${schemaName}' not found`
        })
      }

      schema.parse(req.body)

      next()
    } catch (error: any) {
      return res.status(400).json({
        error: 'Validation Error',
        message: error.errors || 'Invalid input data'
      })
    }
  }
}
