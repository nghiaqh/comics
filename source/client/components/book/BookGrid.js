import React from 'react'
import { Book } from './Book'

class BookGrid extends React.Component {
  constructor (props) {
    super(props)
  }

  render () {
    return (
      <div className="book__grid">
        <Book id="1" title="Book 1" description="A short story" coverPicture="" authors="Author X"/>
        <Book id="2" title="Book 2" description="A short story" coverPicture="" authors="Author X"/>
        <Book id="3" title="Book 3" description="A short story" coverPicture="" authors="Author X"/>
      </div>
    )
  }
}

export { BookGrid }
