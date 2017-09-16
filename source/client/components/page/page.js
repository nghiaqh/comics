import React from 'react'

class Page extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      id: this.props.id,
      number: this.props.number,
      bookId: this.props.bookId,
      chapter: this.props.chapter,
      thumbnail: this.props.src !== "" ? this.props.src :
        'http://via.placeholder.com/200x200',
      src: this.props.src !== "" ? this.props.src :
        'http://via.placeholder.com/800x600'
    }
  }

  componentDidMount () {
  }

  componentWillUnmount () {
  }

  render () {
    return (
      <div className="page" data-id={this.state.id} data-bookId={this.state.bookId} data-chapter={this.state.chapter}>
        <img className="page-thumbnail" src={this.state.src} alt={this.state.number}/>
      </div>
    )
  }
}

export { Page }
