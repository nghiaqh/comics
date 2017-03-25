/* jslint node: true */
'use strict'

var express = require('express')
var router = express.Router()

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index.jade', { title: 'Home page' })
})

module.exports = router
