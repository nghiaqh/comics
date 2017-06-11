import { Author } from '../author'
import { Book } from '../book'
const fs = require('fs')
const path = require('path')
const _ = require('lodash')

function importSubDirectory (folderPath) {
  return new Promise((resolve, reject) => {
    // Get all sub directories except special/hidden system directories
    fs.readdir(folderPath, (err, items) => {
      if (err) {
        reject(err)
      } else {
        let files = []
        items.forEach(item => {
          let p = path.join(folderPath, item)
          if (fs.statSync(p).isDirectory() && !isUnixHiddenPathOrSystemFolder(item)) {
            files.push(p)
          }
        })

        Promise.all(_.map(files, importDirectory))
          .then(results => {
            resolve(results)
          }).catch(err => {
            reject(err)
          })
      }
    })
  })
}

/**
 * Scan a folder to create author, book and related picture items.
 * @param {string} path folder path
 *
 * filename: contain full path to the file
 */
function importDirectory (folderPath) {
  const dirName = path.parse(folderPath).base.split('/').pop()
  const authorName = dirName.split(',')[0]
  const bookName = dirName.split(authorName + ',')[1]
  const promise = new Promise((resolve, reject) => {
    if (typeof authorName !== 'undefined' && authorName.trim() && typeof bookName !== 'undefined' && bookName.trim()) {
      let author
      let book

      Author.createAuthor(authorName).then(result => {
        if (result instanceof Author) {
          author = result
          Book.createBook(bookName, author).then(result => {
            if (result instanceof Book) {
              book = result
              resolve({ author: author, book: book })

              // const imgRe = /.*\.(jpg|jpeg|png|gif)$/
              // let images = []

              // fs.readdir(folderPath, (err, items) => {
              //   items.forEach(item => {
              //     let p = path.join(folderPath, item)
              //     if (fs.statSync(p).isFile() && imgRe.exec(item)) {
              //       images.push(p)
              //     }
              //   })
              // })
            } else {
              reject('Cannot create book record: \n' + result)
            }
          }).catch(err => {
            reject(err)
          })
        } else {
          reject('Cannot create author record: \n' + result)
        }
      }).catch(err => {
        reject(err)
      })
    } else {
      resolve('Folder name does not meet naming convention [author, book name]: ' + folderPath)
    }
  })

  return promise
}

function isUnixHiddenPathOrSystemFolder (path) {
  return (/(^|\/)\.[^\/\.]/g).test(path) || path === 'lost+found';
};

export { importSubDirectory, importDirectory }
