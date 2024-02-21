const mongoose = require('mongoose')

const Schema = mongoose.Schema

const taskSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    services: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Service",
        required: true,
    },
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
        //3 paye
        //-1 annule
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Task', taskSchema)
