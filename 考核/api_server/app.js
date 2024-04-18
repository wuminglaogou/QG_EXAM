const express = require('express')
const joi = require('joi')
const app = express()
const cors = require('cors')
const config = require('./config')
const expressJWT = require('express-jwt')
const bodyParser = require('body-parser');
const multer = require('multer')
app.use(cors())
app.use(express.urlencoded({ extended: false }))
app.use(express.json());
app.use(bodyParser.json());
let objMulter = multer({ dest: "./images" })
app.use(objMulter.any())//any表示任意类型的文件
// app.use(objMulter.image())//仅允许上传图片类型




app.use((req, res, next) => {
    res.cc = function (err, status = 1) {
        res.send({
            status,
            message: err instanceof Error ? err.message : err
        })
    }
    next()
})

app.use(expressJWT({ secret: config.jwtSecretKey }).unless({ path: [/^\/api\//] }))
const router_user = require('./router/user')//这个作为登录注册的路由(无需判断有无token)
const router_my = require('./router/my')
app.use('/api', router_user)
app.use('/my', router_my)

app.use((err, req, res, next) => {
    if (err instanceof joi.ValidationError)
        return res.cc('账号或密码不符合要求!')
    if (err.name == 'UnauthorizedError')
        return res.cc('身份认证失败')
    res.cc(err)
})

app.listen(1080, () => {
    console.log('api server at http://127.0.0.1:1080')
})