const mongoose = require('mongoose')

const Schema = mongoose.Schema

const employeeSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    photo: {
        type: String,
    },
    phone: {
        type: String,
        required: true,
    },
    role:
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Role"
        },
    lastCheckIn: {
        type: Date,
    },
    lastCheckOut: {
        type: Date,
    }

}, {
    timestamps: true
})

module.exports = mongoose.model('Employee', employeeSchema)
