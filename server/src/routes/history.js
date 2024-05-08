const mongoose = require('mongoose')
const express = require('express')
const Book = require('../models/Book')
const History = require('../models/History')
const expressAsyncHandler = require('express-async-handler')
const { isAuth } = require('../../auth')
const router = express.Router()



/* ********** 도서대출 API ********* */
// 도서 대출 - 대출 전 ISBN으로 중복 체크(뭐랑? 히스토리랑?), 대출 만료 기한 2주
router.post('/checkout', isAuth, expressAsyncHandler(async(req,res,next)=>{
    const bookQuery = await Book.findOne({title: req.params.book})
    const bookHistory = await History.findOne({userId: req.user._id , title:req.params.book})

    if(bookHistory === bookQuery){
        res.send('이미 대여한 도서입니다.')
    }else{
        let today = Date.now()
        const history = new History({
            bookId: bookQuery.bookId,
            ISBN : bookQuery.ISBN,
            userID: req.user._id,
            checkoutAt: today,
            dueDate: today.setDate(Date.now()+14)
        })
        const newHistory = await history.save()
        res.status(201).json({code: 201, message: "대출을 완료했습니다.", newHistory})
    }
}))
// 도서 반납
router.put('/:book', isAuth, expressAsyncHandler(async(req,res,next)=>{

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
        res.status(201).json({code:201, })
    }
}))

/* ***********히스토리************* */
// 대출내역 조회

// 대출내역 생성(추가)
router.post('/:book', isAuth, expressAsyncHandler(async(req,res,body)=>{
    const book = await Book.findOne({title: req.params.book})
    const history = new History({
        title: book.title,
        ISBN: book.ISBN,
        author: book.author,
        summary: book.summary,
        release: book.date,
        checkoutAt: Date.now(),
        dueDate: 

    })

}))
// 대출내역 업데이트(대출 상태, 반납시각)

// 대출 도서 연장( 1회 연장시 1주 연장 )

// 대출내역 조회시 대출만료일, 현재날짜 비교후 연체상태 체크