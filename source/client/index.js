import React from 'react'
import { render } from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import { AppContainer } from 'react-hot-loader'
import ReactApp from './ReactApp'

render(
  <BrowserRouter>
    <ReactApp />
  </BrowserRouter>,
  document.getElementById('app')
)

if (module.hot) {
  module.hot.accept('./ReactApp', () => {
    render(
      <BrowserRouter>
        <ReactApp />
      </BrowserRouter>,
      document.getElementById('app')
    )
  })
}
