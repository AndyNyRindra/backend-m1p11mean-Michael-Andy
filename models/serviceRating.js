const mongoose = require('mongoose')

const Schema = mongoose.Schema

const serviceRatingSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    service: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Service"
    },
    rating: {
        type: Number,
        required: true,
    },
}, {
    timestamps: true
})

module.exports = mongoose.model('ServiceRating', serviceRatingSchema)
