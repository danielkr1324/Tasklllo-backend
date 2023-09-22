const dbService = require('../../services/db.service')
const { ObjectId } = require('mongodb')

async function query(filterBy = {}) {
  try {
    const criteria = {
      'members._id': filterBy.loggedinUserId,
    }

    const collection = await dbService.getCollection('board')
    var boards = await collection.find(criteria).toArray()
    return boards
  } catch (err) {
    console.log('cannot find boards', err)
    throw err
  }
}

async function getById(boardId) {
  try {
    const collection = await dbService.getCollection('board')
    const board = collection.findOne({ _id: new ObjectId(boardId) })
    return board
  } catch (err) {
    console.log(`while finding board ${boardId}`, err)
    throw err
  }
}

async function remove(boardId) {
  try {
    const collection = await dbService.getCollection('board')
    await collection.deleteOne({ _id: new ObjectId(boardId) })
    return boardId
  } catch (err) {
    console.log(`cannot remove board ${boardId}`, err)
    throw err
  }
}

async function add(board) {
  try {
    const collection = await dbService.getCollection('board')
    await collection.insertOne(board)
    return board
  } catch (err) {
    console.log('cannot insert board', err)
    throw err
  }
}

async function update(board) {
  try {
    const boardToSave = {
      title: board.title,
      isStarred: board.isStarred,
      archivedAt: board.archivedAt,
      createdBy: board.createdBy,
      style: board.style,
      labels: board.labels,
      members: board.members,
      groups: board.groups,
    }
    const collection = await dbService.getCollection('board')
    await collection.updateOne(
      { _id: new ObjectId(board._id) },
      { $set: boardToSave }
    )
    return board
  } catch (err) {
    console.log(`cannot update board ${board._id}`, err)
    throw err
  }
}

module.exports = {
  remove,
  query,
  getById,
  add,
  update,
}
