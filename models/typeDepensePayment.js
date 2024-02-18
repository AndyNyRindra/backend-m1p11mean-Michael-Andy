const mongoose = require('mongoose')

const Schema = mongoose.Schema

const typeDepensePaymentSchema = new Schema({
    typeDepense: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "TypeDepense"
    },
    month: {
        type : Number,
        required: true,
    },
    year: {
        type : Number,
        required: true,
    },
    value: {
        type: Number,
        required: true,
    },
}, {
    timestamps: true
})

module.exports = mongoose.model('TypeDepensePayment', typeDepensePaymentSchema)
