'use strict'

import React from 'react'
import { Router, Route, IndexRoute, hashHistory } from 'react-router'

import style from './components/style/index.styl'

import Author from './components/author'
import Book from './components/book'
import Page from './components/page'

const App = () => (
  <div className="app">
    <h1>Comics App</h1>
    {/*
    <Author id="1" name="Author X" bio="Japanese mangaka" photo=""/>
    <Book id="1" title="Book 1" description="A short story" coverPicture="" authors="Author X"/>
    <Page id="1" number="1" bookId="1" chapter="1" src=""/>
    */}

  </div>
)

export default App
