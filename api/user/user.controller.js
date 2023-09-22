const userService = require('./user.service')

module.exports = {
  getUser,
  getUsers,
  updateUser,
}

async function getUser(req, res) {
  try {
    const user = await userService.getById(req.params.id)
    res.send(user)
  } catch (err) {
    res.status(500).send({ err: 'Failed to get user' })
  }
}

async function getUsers(req, res) {
  try {
    const users = await userService.query()
    res.send(users)
  } catch (err) {
    res.status(500).send({ err: 'Failed to get users' })
  }
}

async function updateUser(req, res) {
  try {
    const user = req.body
    const savedUser = await userService.update(user)
    res.send(user)
  } catch (err) {
    res.status(500).send({ err: 'Failed to update user' })
  }
}
