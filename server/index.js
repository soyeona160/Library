const express = require('express')
const app = express()
const port = 4000
const cors = require('cors')
const logger = require('morgan')
const config = require('./config')
const mongoose = require('mongoose')
const axios = require('axios')
const usersRouter = require('./src/routes/users')
const booksRouter = require('./src/routes/books')


const corsOptions = {
    origin: 'http://localhost:5500',
    credentials: true
}

mongoose.connect(config.MONGODB_URL)
.then(()=>{console.log('mongodb CONNECTED. . . ')})
.catch(e=> console.log(`failed to connect mongoDB : ${e}`))


/* **************공통 미들웨어****************** */
app.use(cors(corsOptions))
// 미들웨어 설정 : 요청본문 request body 파싱(해석)을 위한 미들웨어
app.use(express.json()) // request body 파싱
app.use(logger('tiny'))// Logger 설정
/* ************************************************************ */

app.use('/api/users', usersRouter)
app.use('/api/books', booksRouter)
app.get('/async-function', wrap(asyncFunction))

app.get('/', (req, res)=>{
    res.send('hello world!')
})

app.use((req, res, next)=>{
    res.status(404).send('404 not found')
})

app.use( (err, req, res, next) => { // 서버 내부 오류 처리
    console.error(err.stack)
    res.status(500).send("something is broken on server !")
})

app.listen(port, ()=>{
    console.log(`server is running on port ${port}`)
})