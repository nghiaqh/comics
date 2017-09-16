import { importLocalDir } from './importLocalDir'

const ImportAPI = require('express').Router()

ImportAPI.post('/local-dir', importLocalDir)

export { ImportAPI }
