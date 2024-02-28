const mongoose = require('mongoose')

const Schema = mongoose.Schema

const taskPaymentSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    task: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Task",
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
}, {
    timestamps: true
})

module.exports = mongoose.model('TaskPayment', taskPaymentSchema)
