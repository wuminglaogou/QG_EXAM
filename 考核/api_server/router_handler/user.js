// const { json } = require("express")
const db = require(`../db/index`)
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

exports.reguser = (req, res) => {
    const userinfo = req.body
    console.log(userinfo)
    const sql = `select * from user00 where username=?`
    db.query(sql, userinfo.username, (err, result) => {
        if (err)
            return res.cc(err)
        if (result.length > 0)
            return res.cc('用户名已被占用，请更换其他用户名!')
        userinfo.password = bcrypt.hashSync(userinfo.password, 10)
        const sqlstr = `insert into user00 set ? `
        db.query(sqlstr, { username: userinfo.username, password: userinfo.password }, (err, results) => {
            if (err) {
                console.log(1)
                return res.cc(err)
            }
            if (results.affectedRows != 1) {
                console.log(2)
                return res.cc(`请稍后再尝试`)
            }
            const user = { username: userinfo.username, password: '' }
            const config = require('../config')
            const tokenStr = jwt.sign(user, config.jwtSecretKey, { expiresIn: '10h' })
            res.send({
                status: 0,
                message: '注册成功!!!',
                token: 'Bearer ' + tokenStr
            })
        })
    })
}
exports.login = (req, res) => {
    const userinfo = req.body
    console.log(userinfo)
    const sql = `select * from user00 where username=?`
    db.query(sql, userinfo.username, (err, result) => {
        if (err)
            return res.cc(err)
        if (result.length != 1)
            return res.cc('可能没有该账户!')
        const compareResult = bcrypt.compareSync(userinfo.password, result[0].password)
        if (!compareResult)
            return res.cc('密码错误!')
        const user = { ...result[0], password: '' }
        const config = require('../config')
        const tokenStr = jwt.sign(user, config.jwtSecretKey, { expiresIn: '10h' })
        //获得的token有效期为10h
        res.send({
            status: 0,
            message: '登录成功!!!',
            token: 'Bearer ' + tokenStr
        })
    })
}

exports.get_how_much = (ws, req) => {
    // console.log('connect success')
    // 使用 ws 的 send 方法向连接另一端的客户端发送数据
    ws.send('连接成功')
    // 使用 on 方法监听事件
    //   message 事件表示从另一段（服务端）传入的数据
    ws.on('message', function (msg) {
        console.log(`receive message ${msg}`)
        ws.send('收到消息')
    })
    // 设置定时发送消息
    let timer = setInterval(() => {
        const sql = `select * from submit_meeting where status=0`
        let much
        db.query(sql, (err, results) => {
            console.log(results.length)
            if (results.length)
                ws.send(results.length)
            else
                ws.send(0)
        })
    }, 2000)

    // close 事件表示客户端断开连接时执行的回调函数
    ws.on('close', function (e) {
        console.log('close connection')
        clearInterval(timer)
        timer = undefined
    })
}
