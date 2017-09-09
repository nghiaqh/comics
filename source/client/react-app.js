'use strict'

import React from 'react'
import { Router, Route, IndexRoute, hashHistory } from 'react-router'
import Author from './components/author'

const App = () => (
  <div className='app'>
    <h1>Comics App</h1>
    <Author name="Author X" bio="Japanese mangaka" photo=""/>
  </div>
)

export default App
