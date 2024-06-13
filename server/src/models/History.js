const mongoose = require('mongoose')
const { Schema } = mongoose
const moment = require('moment')


const historySchema = new Schema({
    bookId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Book'
    },
    ISBN: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: 'Book'
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    checkoutAt: {
        type: Date,
        default: moment(), // 대출한 날짜
        required: true
    },
    dueDate: {
        type: Date,
        required: true,
        default: moment().add(14,"days") // 기본 2주
    },
    returnedAt:{
        type: Date
    },
    status:{
        type: String,
        default: "대출"
    }
})
const History = mongoose.model('History', historySchema)
module.exports = History


historySchema.virtual('readOnlyData').get(()=>{
	return {
        bookId: this.bookId,
		ISBN: this.ISBN, // this는 하나의 객체를 의미. 
		checkoutAt: this.checkoutAt,
        dueDate: this.dueDate,
        returnedAt:this.returnedAt,
        status : this.status
	}
})