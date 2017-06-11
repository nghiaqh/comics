import { importDirectory, importSubDirectory } from './dir-import'

const importAPI = require('express').Router()

importAPI.post('/', runImporting)

function runImporting (req, res, next) {
  const folderPath = req.body.folder
  const importSubDir = req.body.importSubDir
  if (folderPath && importSubDir === true) {
    importSubDirectory(folderPath).then(results => {
      res.status(200).json(results)
    }).catch(err => {
      res.status(500).json(err)
    })
  } else if (folderPath) {
    importDirectory(folderPath).then(results => {
      res.status(200).json(results)
    }).catch(err => {
      res.status(500).json(err)
    })
  } else {
    res.status(402).json('Invalid request')
  }
}

export { importAPI }
