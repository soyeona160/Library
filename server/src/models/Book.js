const mongoose = require('mongoose')
const { Schema } = mongoose

const { Types: {ObjectId} } = Schema
//ObjectId : MongoDB ID값의 자료형(data type)
//mongoose.Schema.ObjectId //24자리 고유 아이디값 자동 생성을 나타내는 데이터타입

const bookSchema = new Schema({
    title:{
        type: String,
        required: true,
        trim: true// 문자열 양쪽 공백 제거
    },
    author: {
        type: ObjectId,
        required: true, // 필수. 없으면 에러 띄운다.
        ref: 'User' // 데이터 모델
    },
    summary: {
        type: String,
        required: true,
        trim: true
    },
    release: {
        type: Date,
        default: Date.now
    }
})

const Book = mongoose.model('Todo', bookSchema)
module.exports = Book