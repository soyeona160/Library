const mongoose = require('mongoose')
const express = require('express')
const Book = require('../models/Book')
const History = require('../models/History')
const expressAsyncHandler = require('express-async-handler')
const { isAuth } = require('../../auth')
const router = express.Router()
const moment = require('moment')
const {limitUsage} = require('../../limiter')



/* ********** 도서대출 API ********* */
// 도서 대출 - 대출 전 ISBN으로 중복 체크(뭐랑? 히스토리랑?), 대출 만료 기한 2주
router.post('/:isbn/checkout', limitUsage, isAuth, expressAsyncHandler(async(req,res,next)=>{
    const bookQuery = await Book.findOne({title: req.params.book})
    const bookHistory = await History.findOne({userId: req.user._id , title:req.params.isbn})

    if(bookHistory === bookQuery){
        res.send('이미 대여한 도서입니다.')
    }else{
        const history = new History({
            bookId: bookQuery.bookId,
            ISBN : bookQuery.ISBN,
            userID: req.user._id,
        })
        const newHistory = await history.save()
        res.status(201).json({code: 201, message: "대출을 완료했습니다.", newHistory})
    }
}))
// 도서 반납
router.put('/:book/return', isAuth, expressAsyncHandler(async(req,res,next)=>{
    const bookHistory = await(History.findOne({userId: req.user._id , title:req.params.book}))

    if(!bookHistory){
        res.status(404).json({code:404, message:'목록에서 도서를 찾을 수 없습니다.'})
    }else{
        let today = moment()
        bookHistory.returnedAt = today || bookHistory.returnedAt,
        bookHistory.status = '반납' || bookHistory.status

        const updatehistory = await bookHistory.save()
        res.json({
            code: 200, message: '반납을 완료했습니다.', updatehistory
        })
    }
}))

// 대출 도서 목록
router.get('/', isAuth, expressAsyncHandler(async(req,res,next)=>{
    const history = await History.find({userId: req.user._id})
    if(history){
        res.status(201).json({code:201,history})
    }else{
        res.status(404).json({code: 404, message: '대출 내역이 없습니다.'})
    }
}))
// 대출 도서 정보
router.get('/:book', isAuth, expressAsyncHandler(async(req,res,next)=>{
    const book = await History.find({userId: req.user._id, title: req.params.book})
    if(book){
        res.status(201).json({code:201, book})
    }
}))

/* ***********히스토리************* */
// 대출내역 조회
// router.get('/', isAuth, expressAsyncHandler(async(req, res, next)=>{
//     const history = await History.find({userId: req.user._id})

// }))

// 대출내역 생성(추가)
router.post('/create/:book', isAuth, expressAsyncHandler(async(req,res,body)=>{
    const book = await Book.findOne({title: req.params.book})
    const history = new History({
        title: book.title,
        ISBN: book.ISBN,
        userId: req.user._id,
        author: book.author,
        summary: book.summary,
        release: book.release,
        checkoutAt: book.checkoutAt
    })

    const newHistory = await history.save() // DB에 User 생성
    if(!newHistory){
        res.status(401).json({ code: 401, message: '생성에 실패했습니다.'})
    }else{
        res.json({
            code: 200,
            newHistory
        })}

}))
// 대출내역 업데이트(대출 상태, 반납시각)
router.put('/update/:book', isAuth, expressAsyncHandler(async(req,res,body)=>{
    const book = await Book.findOne({title: req.params.book})
    if(!book){
        res.status(401).json({ code: 401, message: '정보를 찾을 수 없습니다.'})
    }else{
        book.status = "반납"
        book.returnedAt = moment()

        const returned = await book.save()
        res.json({
            code: 200, message: "반납이 완료되었습니다"
        })
    }

}))
// 대출 도서 연장( 1회 연장시 1주 연장 )
router.put('/extend/:book', isAuth, expressAsyncHandler(async(req,res,body)=>{
    const book = await Book.findOne({title: req.params.book})
    if(!book){
        res.status(401).json({ code: 401, message: '정보를 찾을 수 없습니다.'})
    }else{
        const dueDate = moment(book.dueDate).add(7, "days")
        book.dueDate = dueDate

        const newdueDate = await book.save()
        res.json({
            code: 200, message: "연장이 완료되었습니다.", newdueDate
        })
    }

}))
// 대출내역 조회시 대출만료일, 현재날짜 비교후 연체상태 체크


module.exports = router