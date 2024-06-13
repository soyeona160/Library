const mongoose = require('mongoose')
const { Schema } = mongoose

const userSchema = new Schema({
    name :{
        type: String,
        required: true
    },
    email : {
        type: String,
        required: true,
        unique: true // 이메일 중복 방지 unique: 색인(primary key)
    },
    userId: {
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    lastModifiedAt:{
        type: Date,
        default: Date.now
    },
    history : [{
        type: mongoose.Types.ObjectId,
        ref: "History"
    }]
})

const User = mongoose.model('User', userSchema)
module.exports = User

userSchema.virtual('readOnlyData').get(()=>{
	return {
		id: this.userId, // this는 하나의 객체를 의미. 
		email: this.email,
		name: this.name,
	}
})