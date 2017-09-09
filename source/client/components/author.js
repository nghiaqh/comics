import React from 'react'

class Author extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      name: '',
      bio: '',
      photo: 'http://via.placeholder.com/150x150'
    }
  }

  componentDidMount () {
  }

  componentWillUnmount () {
  }

  render () {
    return (
      <div className="author">
        <img className="author-avatar" src={this.props.photo} alt={this.props.name}/>
        <h3>{this.props.name}</h3>
        <p>{this.props.bio}</p>
      </div>
    )
  }
}

export default Author
