const mongoose = require('mongoose')

const Schema = mongoose.Schema

const clientSchema = new Schema({
    name: {
      type: String,
      required: true,
    }
  }, {
    timestamps: true
  })
  
  module.exports = mongoose.model('Client', clientSchema)