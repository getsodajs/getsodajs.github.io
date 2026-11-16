import { resolve } from 'node:path'

export const sodaRoot = resolve(process.env.SODA_DIR ?? 'soda')
