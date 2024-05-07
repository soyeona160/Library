const express= require('express')
const User = require('../models/User')
const expressAsyncHandler = require('express-async-handler')
const {generateToken , isAuth} = require('../../auth')
const router = express.Router()

// 회원가입
router.post('/register', expressAsyncHandler( async (req, res, next)=>{
    console.log(req.body)
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        userId: req.body.userId,
        password: req.body.password
    })
    const newUser = await user.save()
    if(!newUser){
        res.status(400).json({code: 400, message: 'Invalid User Data'})
      }else{
        const {name, email, userId, isAdmin, createdAt } = newUser
        res.json({
          code: 200, token: generateToken(newUser), // 사용자 식별, 권한검사 용도
          name, email, userId, isAdmin, createdAt // 사용자에게 보여주기 위한 용도
        })
      }
}))

// 로그인
router.post('/login', expressAsyncHandler( async (req, res, next)=>{
    const loginUser= await User.findOne({
        email: req.body.email,
        password: req.body.password
    })
    if(!loginUser){
        res.status(401).json({code: 401, message: 'Invalid Email or password'})
      }else{
        const { name, email, userId, isAdmin, createdAt } = loginUser
        res.json({
          code: 200,
          token: generateToken(loginUser),
          name, email, userId, isAdmin, createdAt
        })
      }
}))

router.put('/', isAuth, expressAsyncHandler( async(req, res, next) => {
    // res.json("사용자정보 변경") 권한검사 필요
    const user = await User.findById(req.user._id) // 회원인지 검사
    if(!user){
      res.status(404).json({code: 400, message: "User Not Found"})
    }else{
      user.name = req.body.name || user.name
      user.email = req.body.email || user.email
      user.password = req.body.password || user.password
      user.lastModifiedAt = Date.now()
  
      const updatedUser = await user.save() //DB에 반영
      const {name, email, userId, isAdmin, createdAt,lastModifiedAt} = updatedUser
      res.json({
        code: 200,
        token : generateToken(updatedUser),
        name, email, userId, isAdmin, createdAt, lastModifiedAt
      })
    }
}))

router.delete('/', isAuth, expressAsyncHandler( async(req, res, next) => {
    // res.json("사용자정보 삭제")
  
    const user = await User.findByIdAndDelete(req.user._id) // user.id로 바꾸게됨
    // 찾고 지우기
    if(!user){
      res.status(404).json({code: 404, message:" User not Found "})
    }else{
      res.statusMessage(204).json({code: 204, message: 'User deleted successfully'}) // 204: 전달할 데이터 없음
    }
  }))
  
  module.exports = router