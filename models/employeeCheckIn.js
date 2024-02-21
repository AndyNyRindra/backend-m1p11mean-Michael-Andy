const mongoose = require('mongoose')

const Schema = mongoose.Schema

const employeeCheckInSchema = new Schema({
    employee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee",
        required: true
    },
    in: {
        type: Date,
        required: true,
    },
    out: {
        type: Date,
    },
}, {
    timestamps: true
})

module.exports = mongoose.model('EmployeeCheckIn', employeeCheckInSchema)
