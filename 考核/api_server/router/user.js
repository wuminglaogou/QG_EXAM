const express = require('express')
const expressWs = require('express-ws')
const router = express.Router()
expressWs(router)
const router_handler = require('../router_handler/user')
const expressJoi = require(`@escook/express-joi`)
const { reguser_schema } = require('../schema/user')
//注册
router.post('/reguser', expressJoi(reguser_schema), router_handler.reguser)

//登录
router.post('/login', expressJoi(reguser_schema), router_handler.login)

router.ws("/basic", router_handler.get_how_much)





module.exports = router