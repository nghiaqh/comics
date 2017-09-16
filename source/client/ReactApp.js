import React from 'react'
import { Switch, Route } from 'react-router-dom'

import style from './components/style/index.styl'

import { Header } from './components/header'
import { Footer } from './components/footer'
import { Author } from './components/author'
import { Book } from './components/book'

class ReactApp extends React.Component{
  constructor (props) {
    super(props)
  }

  render () {
    return (
      <div>
        <Header />
        <hr/>
        <Switch>
          <Route exact path="/" component={Home}/>
          <Route path="/books" component={Books}/>
          <Route path="/authors" component={Authors}/>
          <Route component={NotFound}/>
        </Switch>
        <hr/>
        <Footer />
      </div>
    )
  }
}

export default ReactApp

const Home = () => (
  <div className="home">
    Home
  </div>
)

const Authors = () => (
  <div className="authors">
    <Author id="1" name="Author X" bio="Japanese mangaka" photo=""/>
  </div>
)

const Books = () => (
  <div className="books">
    <Book id="1" title="Book 1" description="A short story" coverPicture="" authors="Author X"/>
  </div>
)

const NotFound = () => (
  <Status code={404}>
    <div>
      <h1>Sorry, can’t find that.</h1>
    </div>
  </Status>
)
