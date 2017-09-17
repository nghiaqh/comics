import React from 'react'
import { Switch, Route } from 'react-router-dom'

import style from 'client/components/style/index.styl'

import { Header } from 'client/components/header'
import { Footer } from 'client/components/footer'
import { AuthorGrid } from 'client/components/author'
import { BookGrid } from 'client/components/book'

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
    <AuthorGrid />
  </div>
)

const Books = () => (
  <div className="books">
    <BookGrid />
  </div>
)

const NotFound = () => (
  <Status code={404}>
    <div>
      <h1>Sorry, can’t find that.</h1>
    </div>
  </Status>
)
