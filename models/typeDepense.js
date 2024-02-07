const mongoose = require('mongoose')

const Schema = mongoose.Schema

const typeDepenseSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
}, {
    timestamps: true
})

module.exports = mongoose.model('TypeDepense', typeDepenseSchema)
