const authService = require('./auth.service')

async function login(req, res) {
  const { username, password } = req.body
  try {
    const user = await authService.login(username, password)
    const loginToken = authService.getLoginToken(user)
    res.cookie('loginToken', loginToken)

    res.json(user)
  } catch (err) {
    console.log('Failed to Login ' + err)
    res.status(401).send({ err: 'Failed to Login' })
  }
}

async function signup(req, res) {
  try {
    const { username, password, fullname, imgUrl } = req.body
    const account = await authService.signup(
      username,
      password,
      fullname,
      imgUrl
    )
    const user = await authService.login(username, password)
    const loginToken = authService.getLoginToken(user)
    res.cookie('loginToken', loginToken)

    res.json(user)
  } catch (err) {
    console.log('Failed to signup ' + err)
    res.status(500).send({ err: 'Failed to signup' })
  }
}

async function logout(req, res) {
  try {
    res.clearCookie('loginToken')
    res.send({ msg: 'Logged out successfully' })
  } catch (err) {
    res.status(500).send({ err: 'Failed to logout' })
  }
}

module.exports = {
  login,
  signup,
  logout,
}
