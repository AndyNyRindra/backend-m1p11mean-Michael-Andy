const mongoose = require('mongoose')

const Schema = mongoose.Schema

const serviceSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    photos: {
        type: [String],
        default: [],
    },
    price: {
        type: Number,
        required: true,
    },
    duration: {
        type: Number,
        required: true,
    },
    commission: {
        type: Number,
        required: true,
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Service', serviceSchema)