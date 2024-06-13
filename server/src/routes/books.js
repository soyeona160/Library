const mongoose = require('mongoose')
const express = require('express')
const Book = require('../models/Book')
const History = require('../models/History')
const expressAsyncHandler = require('express-async-handler')
const { isAuth, isAdmin } = require('../../auth')
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

// 특정 카테고리별 도서 집계

// 특정 도서 정보 조회
router.get('/:category', expressAsyncHandler( async(req, res, next)=>{
    const books = await Book.find({title: req.params.category})

    if(books.length === 0){
        return res.status(404).json({code:404, message: "book not found"})
    }else{
        res.json({code:200, books})
    }
}))


//관리자 전용 책 CRUD
// 신간도서 추가( ISBN 중복검사 )
router.post('/', isAdmin , expressAsyncHandler(async(req,res,next)=>{
    const books = await Book.find({title: req.body.title})

    if(books.params === req.body.ISBN){
        res.json({message: "이미 등록된 도서입니다."})
    }else{
        const book = new Book({
            title: req.body.title,
            ISBN: req.body.ISBN,
            author: req.body.author,
            summary: req.body.summary,
            release: req.body.release
        })
        const newBook = await book.save()
        res.status(200).json({code: 200, message: '도서를 추가했습니다.', newBook})
    }
}))

// 기존도서 삭제
router.delete('/', isAdmin, expressAsyncHandler(async(req, res, next)=>{
    const book = await Book.findByIdAndDelete(req.body._id)

    if(!book){
        res.status(404).json({code:404, message: "Book not found"})
    }else{
        res.status(204).json({code:204, message: 'success'})
    }
}))

// 기존도서 정보 변경
router.put('/:book', isAdmin, expressAsyncHandler(async(req, res, next)=>{
    const book = await Book.find({_id: req.params.book})

    book.title = req.body.title || book.title
    book.ISBN = req.body.ISBN || book.ISBN
    book.author = req.body.author || book.author
    book.summary = req.body.summary || book.summary
    book.release = req.body.release || book.release
    const updateBook = await book.save()
    res.json({code: 200, message:"수정 완료", updateBook
    })
}))


module.exports = router