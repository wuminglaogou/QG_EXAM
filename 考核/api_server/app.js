const express = require('express')
const expressWs = require('express-ws')
const joi = require('joi')
const app = express()
const cors = require('cors')
const config = require('./config')
const expressJWT = require('express-jwt')
const bodyParser = require('body-parser');
const multer = require('multer')
expressWs(app)

app.use(cors())
app.use(express.urlencoded({ extended: false }))
app.use(express.json());
app.use(bodyParser.json());
app.use(function (req, res, next) {
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
const router_meeting = require('./router/meeting')
const router = require('./router/meeting');
const { ws } = require('./router/user');
app.use('/api', router_user)
app.use('/my', router_my)
app.use('/meeting', router_meeting)



app.listen(1080, () => {
    console.log('api server at http://127.0.0.1:1080')
})
app.use((err, req, res, next) => {
    if (err instanceof joi.ValidationError)
        return res.cc('账号或密码不符合要求!')
    if (err.name == 'UnauthorizedError')
        return res.cc('身份认证失败')
    res.cc(err)
})