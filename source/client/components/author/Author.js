import React from 'react'

class Author extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      id: this.props.id,
      name: this.props.name,
      bio: this.props.bio,
      photo: this.props.photo !== "" ? this.props.photo :
        'http://via.placeholder.com/150x150'
    }
  }

  componentDidMount () {
  }

  componentWillUnmount () {
  }

  render () {
    return (
      <div className="author" data-id={this.state.id}>
        <img className="author-avatar" src={this.state.photo} alt={this.state.name}/>
        <h3>{this.state.name}</h3>
        <p>{this.state.bio}</p>
      </div>
    )
  }
}

export { Author }
