const authService = require('../api/auth/auth.service')

async function requireAuth(req, res, next) {
  if (!req?.cookies?.loginToken)
    return res.status(401).send('Not Authenticated')
  const loggedInUser = authService.validateToken(req.cookies.loginToken)
  if (!loggedInUser) return res.status(401).send('Not Authenticated')

  req.loggedInUser = loggedInUser
  next()
}

async function requireAdmin(req, res, next) {
  if (!req?.cookies?.loginToken)
    return res.status(401).send('Not Authenticated')
  const loggedInUser = authService.validateToken(req.cookies.loginToken)
  if (!loggedInUser.isAdmin) {
    res.status(403).end('Not Authorized')
    return
  }
  next()
}

module.exports = {
  requireAuth,
  requireAdmin,
}
