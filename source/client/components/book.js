import React from 'react'

class Book extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      id: this.props.id,
      title: this.props.title,
      description: this.props.description,
      coverPicture: this.props.coverPicture !== "" ? this.props.coverPicture :
        'http://via.placeholder.com/200x200',
      numberOfchapters: this.props.numberOfchapters,
      authors: this.props.authors
    }
  }

  componentDidMount () {
  }

  componentWillUnmount () {
  }

  render () {
    return (
      <div className="book" data-id={this.state.id}>
        <img className="book-cover" src={this.state.coverPicture} alt={this.state.title}/>
        <h3>{this.state.title}</h3>
        <p>Authors: {this.props.authors}</p>
        <p>{this.state.description}</p>
      </div>
    )
  }
}

export default Book
