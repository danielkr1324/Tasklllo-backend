const Cryptr = require('cryptr')

const bcrypt = require('bcrypt')
const userService = require('../user/user.service')

const cryptr = new Cryptr(process.env.SECRET1 || 'Secret-Puk-1234')

async function login(username, password) {
  console.log(`auth.service - login with username: ${username}`)

  const user = await userService.getByUsername(username)
  if (!user) return Promise.reject('Invalid username or password')
  const match = await bcrypt.compare(password, user.password)
  if (!match) return Promise.reject('Invalid username or password')
  delete user.password
  return user
}

async function signup(username, password, fullname, imgUrl) {
  const saltRounds = 10

  console.log(
    `auth.service - signup with username: ${username}, fullname: ${fullname}`
  )
  if (!username || !password || !fullname)
    return Promise.reject('fullname, username and password are required!')

  const hash = await bcrypt.hash(password, saltRounds)
  return userService.add({ username, password: hash, fullname, imgUrl })
}

function getLoginToken(user) {
  const userInfo = { _id: user._id, fullname: user.fullname }
  return cryptr.encrypt(JSON.stringify(userInfo))
}

function validateToken(loginToken) {
  try {
    const json = cryptr.decrypt(loginToken)
    const loggedInUser = JSON.parse(json)
    return loggedInUser
  } catch (err) {
    console.log('Invalid Login Token')
  }
  return null
}

module.exports = {
  signup,
  login,
  getLoginToken,
  validateToken,
}
