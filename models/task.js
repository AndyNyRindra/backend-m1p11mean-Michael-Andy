const mongoose = require('mongoose')

const Schema = mongoose.Schema

const taskSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    services: [{
        service: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Service",
            required: true,
        },
        promotion: {
            type: Number,
            default: 0
        }
    }],
    employee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee",
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    status: {
        type: Number,
        default: 0
        //0 cree
        //1 en cours
        //2 finis
        //-1 annule
    },
    paid: {
        type: Boolean,
        default: false
    },
}, {
    timestamps: true
})

module.exports = mongoose.model('Task', taskSchema)
