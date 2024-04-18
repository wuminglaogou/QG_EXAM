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
