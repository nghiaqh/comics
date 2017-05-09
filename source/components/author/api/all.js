function getAll (req, res) {
  const authors = [{
    id: 1,
    name: 'Janusz Leon Wisniewski',
    bio: 'Polish',
    photo: ''
  }]

  res.status(200).json({ authors })
}

export { getAll }
