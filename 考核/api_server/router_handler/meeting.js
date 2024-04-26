const expressJoi = require("@escook/express-joi")
const { json } = require("body-parser")
const db = require(`../db/index`)
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

exports.getMeeting = (req, res) => {
    console.log(req.body)
    const sql = `select * from submit_meeting where id=?`
    db.query(sql, req.body.id, (err, results) => {
        if (err)
            return res.cc(err)
        if (results.length != 1)
            return res.cc('获取用户信息失败!')
        res.send({
            status: 0,
            message: '有效',
            date: results[0]
        })
    })
}

exports.send_commit = (req, res) => {
    console.log(req.body)
    const sql = `update submit_meeting set commite=? where id=?`
    db.query(sql, [req.body.commite, req.body.id], (err, results) => {
        if (err)
            return res.cc(err)
        if (results.affectedRows != 1)
            return res.cc('评论失败!')
        res.send({
            status: 0,
            message: '评论成功',
        })
    })
}