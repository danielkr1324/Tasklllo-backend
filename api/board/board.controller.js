const boardService = require("./board.service.js")

async function getBoards(req, res) {
  try {
    console.log("Getting Boards")
    const filterBy = {
      loggedinUserId: req.query.loggedinUserId,
    }

    const boards = await boardService.query(filterBy)
    res.json(boards)
  } catch (err) {
    console.log("Failed to get boards", err)
    res.status(500).send({ err: "Failed to get boards" })
  }
}

async function getBoardById(req, res) {
  try {
    const boardId = req.params.id
    const board = await boardService.getById(boardId)
    res.json(board)
  } catch (err) {
    console.log("Failed to get board", err)
    res.status(500).send({ err: "Failed to get board" })
  }
}

async function addBoard(req, res) {
  console.log("user", req)

  console.log("req: ", req)

  try {
    const board = req.body
    const addedBoard = await boardService.add(board)
    console.log("addedBoard: ", addedBoard)
    res.json(addedBoard)
  } catch (err) {
    console.log("Failed to add board", err)
    res.status(500).send({ err: "Failed to add board" })
  }
}

async function updateBoard(req, res) {
  try {
    const board = req.body
    console.log("board:", board)

    const updatedBoard = await boardService.update(board)

    res.json(updatedBoard)
  } catch (err) {
    console.log("Failed to update board", err)
    res.status(500).send({ err: "Failed to update board" })
  }
}

async function removeBoard(req, res) {
  try {
    const boardId = req.params.id
    const removedId = await boardService.remove(boardId)
    res.send(removedId)
  } catch (err) {
    console.log("Failed to remove board", err)
    res.status(500).send({ err: "Failed to remove board" })
  }
}

async function addBoardMsg(req, res) {
  const { loggedInUser } = req
  try {
    const boardId = req.params.id
    const msg = {
      txt: req.body.txt,
      by: loggedInUser,
    }
    const savedMsg = await boardService.addBoardMsg(boardId, msg)
    res.json(savedMsg)
  } catch (err) {
    console.log("Failed to update board", err)
    res.status(500).send({ err: "Failed to update board" })
  }
}

async function removeBoardMsg(req, res) {
  const { loggedInUser } = req
  try {
    const boardId = req.params.id
    const { msgId } = req.params

    const removedId = await boardService.removeBoardMsg(boardId, msgId)
    res.send(removedId)
  } catch (err) {
    console.log("Failed to remove board msg", err)
    res.status(500).send({ err: "Failed to remove board msg" })
  }
}

module.exports = {
  getBoards,
  getBoardById,
  addBoard,
  updateBoard,
  removeBoard,
  addBoardMsg,
  removeBoardMsg,
}
