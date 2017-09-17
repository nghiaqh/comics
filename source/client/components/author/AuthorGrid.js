import React from 'react'
import { Author } from './Author'

class AuthorGrid extends React.Component {
  constructor (props) {
    super(props)
  }

  render () {
    return (
      <div className="book__grid">
        <Author id="1" name="Author X" bio="Japanese mangaka" photo=""/>
        <Author id="2" name="Author Y" bio="Japanese mangaka" photo=""/>
        <Author id="3" name="Author Z" bio="Japanese mangaka" photo=""/>
      </div>
    )
  }
}

export { AuthorGrid }
