import React from 'react'
import { render } from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import { AppContainer } from 'react-hot-loader'
import ReactApp from './ReactApp'

render(
  <AppContainer>
    <BrowserRouter>
      <ReactApp />
    </BrowserRouter>
  </AppContainer>,
  document.getElementById('app')
)

if (module.hot) {
  module.hot.accept('./ReactApp', () => {
    render(
      <AppContainer>
        <BrowserRouter>
          <ReactApp />
        </BrowserRouter>
      </AppContainer>,
      document.getElementById('app')
    )
  })
}
