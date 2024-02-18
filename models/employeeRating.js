const mongoose = require('mongoose')

const Schema = mongoose.Schema

const employeeRatingSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    employee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee"
    },
    rating: {
        type: Number,
        required: true,
    },
}, {
    timestamps: true
})

module.exports = mongoose.model('EmployeeRating', employeeRatingSchema)
