const mongoose = require('mongoose')
const { Schema } = mongoose


const historySchema = new Schema({
    bookId: {
        type: String,
        required: true,
        ref: 'Book'
    },
    userId: {
        type: String,
        required: true,
        ref: 'User'
    },
    checkoutAt: {
        type: Date,
        default: Date.now,
        required: true
    },
    dueDate: {
        type: Date,
        required: true
    },
    returnedAt:{
        type: Date
    },
    status:{
        type: Boolean,
        default: false
    }
})
const History = mongoose.model('History', historySchema)
module.exports = History