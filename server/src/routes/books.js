const mongoose = require('mongoose')
const express = require('express')
const Book = require('../models/Book')
const History = require('../models/History')
const expressAsyncHandler = require('express-async-handler')
const { isAuth } = require('../../auth')
const router = express.Router()


/* *******관리자/회원/비회원 공통 API******* */
// 전체 도서 목록 조회
router.get('/', expressAsyncHandler( async(req, res, next)=>{
    const books = await Book.find()
    res.json({code:200, books})
}))


// 특정 도서 정보 조회
router.get('/:book', expressAsyncHandler( async(req, res, next)=>{
    const books = await Book.find({title: req.params.book})

    if(books.length === 0){
        return res.status(404).json({code:404, message: "book not found"})
    }else{
        res.json({code:200, books})
    }
}))

//관리자 전용 책 CRUD


