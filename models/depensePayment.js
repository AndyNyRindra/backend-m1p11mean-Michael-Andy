const mongoose = require('mongoose')

const Schema = mongoose.Schema

const depensePaymentSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    date: {
        type : Date,
        required: true,
    },
    value: {
        type: Number,
        required: true,
    },
}, {
    timestamps: true
})

module.exports = mongoose.model('DepensePayment', depensePaymentSchema)
