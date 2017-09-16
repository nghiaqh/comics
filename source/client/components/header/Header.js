import React from 'react'
import { Link } from 'react-router-dom'

class Header extends React.Component {
  constructor (props) {
    super(props)
  }

  render () {
    return (
      <header>
        <h1 className="app__title">Comics App</h1>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/books">Books</Link></li>
          <li><Link to="/authors">Authors</Link></li>
        </ul>
      </header>
    )
  }
}

export { Header }
