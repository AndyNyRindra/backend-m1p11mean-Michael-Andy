const express = require('express')
const router = express.Router()
const asyncHandler = require('express-async-handler')
const Client = require('../model/client')

//GET Upload Route
router.get('/', asyncHandler(async (req, res) => {
  try {
    let clients = await Client.find();
    res.json(clients)
  } catch (err) {
    console.log(err)
    throw new Error('Clients Cannot Be Found')
  }
}))

module.exports = router