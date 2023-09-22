const dbService = require('../../services/db.service')
const ObjectId = require('mongodb').ObjectId

module.exports = {
  query,
  getById,
  update,
  add,
  getByUsername,
}

async function query(filterBy = {}) {
  const criteria = _buildCriteria(filterBy)
  try {
    const collection = await dbService.getCollection('user')
    var users = await collection.find(criteria).sort({ username: -1 }).toArray()
    users = users.map(user => {
      delete user.password
      return user
    })
    return users
  } catch (err) {
    console.log('in query ', err)
    throw err
  }
}

async function getById(userId) {
  try {
    const collection = await dbService.getCollection('user')
    const user = await collection.findOne({ _id: new ObjectId(userId) })

    delete user.password
    return user
  } catch (err) {
    console.log('in getById ', err)
    throw err
  }
}

async function getByUsername(username) {
  try {
    const collection = await dbService.getCollection('user')
    const user = await collection.findOne({ username })
    return user
  } catch (err) {
    console.log('from getByUsername ', err)
    throw err
  }
}

async function update(user) {
  try {
    const userToSave = {
      _id: new ObjectId(user._id),
      username: user.username,
      fullname: user.fullname,
      imgUrl: user.imgUrl,
    }

    const collection = await dbService.getCollection('user')
    await collection.updateOne({ _id: userToSave._id }, { $set: userToSave })
    return userToSave
  } catch (err) {
    console.log('from update ', err)
    throw err
  }
}

async function add(user) {
  try {
    const userToAdd = {
      username: user.username,
      fullname: user.fullname,
      password: user.password,
      imgUrl:
        user.imgUrl ||
        'https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png',
    }

    const collection = await dbService.getCollection('user')
    await collection.insertOne(userToAdd)
    return userToAdd
  } catch (err) {
    console.log('from add ', err)
    throw err
  }
}

function _buildCriteria(filterBy) {
  const criteria = {}
  if (filterBy.txt) {
    const txtCriteria = { $regex: filterBy.txt, options: 'i' }
    criteria.$or = [
      {
        username: txtCriteria,
      },
      {
        fullname: txtCriteria,
      },
    ]
  }
  return criteria
}
