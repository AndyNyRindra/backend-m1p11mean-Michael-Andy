const mongoose = require('mongoose')

const Schema = mongoose.Schema

const specialServiceSchema = new Schema({
    services: {
        type: [mongoose.Schema.Types.ObjectId],
        ref : "Service",
        required: true,
    },
    promotion: {
        type: Number,
        required: true,
    },
    start: {
        type: Date,
        required: true,
    },
    end: {
        type: Date,
        required: true,
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('specialService', specialServiceSchema)