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
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    // position:
    //     {
    //         type: mongoose.Schema.Types.ObjectId,
    //         ref: "Position"
    //     }
    //
}, {
    timestamps: true
})

module.exports = mongoose.model('Employee', employeeSchema)
