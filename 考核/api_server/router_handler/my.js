const expressJoi = require("@escook/express-joi")
const { json } = require("body-parser")
const db = require(`../db/index`)
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


exports.getinformation = (req, res) => {
    const sql = `select * from user00 where username=?`
    db.query(sql, req.body.username, (err, results) => {
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
exports.get_all_0_meeting = (req, res) => {
    const sql = `select * from submit_meeting where status=0 order by id desc`
    db.query(sql, (err, results) => {
        if (err)
            return res.cc(err)
        if (results.length == 0)
            return res.send({
                status: -1,
                message: '暂无待审查会议'
            })
        res.send({
            status: 0,
            message: '有待审查会议',
            date: results,
            long: results.length

        })

    })
}
exports.get_all_my_meeting = (req, res) => {
    const sql = `select * from submit_meeting where user_name=? order by id desc`
    db.query(sql, req.body.user_name, (err, results) => {
        if (err)
            return res.cc(err)
        if (results.length == 0)
            return res.send({
                status: -1,
                message: '暂无待审查会议'
            })
        res.send({
            status: 0,
            message: '有待审查会议',
            date: results,
            long: results.length
        })
    })
}
exports.get_all_1_meeting = (req, res) => {
    const sql = `select * from submit_meeting where status=1 order by id desc`
    db.query(sql, (err, results) => {
        if (err)
            return res.cc(err)
        if (results.length == 0)
            return res.send({
                status: -1,
                message: '暂无会议'
            })
        res.send({
            status: 0,
            message: '有会议',
            date: results,
            long: results.length

        })

    })
}
exports.receptinformation = (req, res) => {
    console.log(req.body)
    const date0 = req.body
    const date = {
        // password: date0.newpassword,
        group: date0.group,
        gender: date0.gender,
        age: date0.age
    }
    if (date.gender == 'man')
        date.gender = '男'
    if (date.gender == 'woman')
        date.gender = '女'
    if (date.group == 'none_group')
        date.group = '暂无'
    if (date.group == 'front_group')
        date.group = '前端'
    if (date.group == 'backstage_group')
        date.group = '后台'
    if (date.group == 'noembedded_groupne_group')
        date.group = '嵌入式'
    if (date.group == 'move_group')
        date.group = '移动'
    if (date.group == 'AI_group')
        date.group = '人工智能'
    if (date.group == 'graph_group')
        date.group = '图形'
    if (date.group == 'design_group')
        date.group = '设计'
    const sql = `update user00 set ? where username=?`
    db.query(sql, [date, date0.username], (err, results) => {
        if (err)
            return res.cc(err)
        if (results.affectedRows != 1) {
            console.log(results.length)
            return res.cc('更新用户信息失败!')
        }
        date.password = ''
        console.log('更新其它数据成功!')
        res.send({
            status: 0,
            date,
            message: '更新其它数据成功'
        })
    })
}
exports.receptimage = (req, res) => {
    const sql = `update user00 set image=? where username=?`
    db.query(sql, [req.body.photo, req.body.username], (err, results) => {
        if (err)
            return res.cc(err)
        if (results.affectedRows != 1)
            return res.cc('更新用户信息失败')
        console.log(`sss5555`)
        console.log(results.affectedRows)
        console.log('更新头像成功!')
        res.send({
            status: 0,
            message: '更新头像成功'
        })
    })
}
exports.receptpassword = (req, res) => {
    const sql = `select * from user00 where username=?`
    const userinfo = req.body
    db.query(sql, req.body.username, (err, results) => {
        if (err)
            return res.cc(err)
        if (results.length != 1)
            return res.cc('修改密码失败!')
        const compareResult = bcrypt.compareSync(userinfo.oldpassword, results[0].password)
        if (!compareResult)
            return res.cc('密码错误!')
        newpassword = bcrypt.hashSync(userinfo.newpassword, 10)
        const sql0 = `update user00 set password=? where username=?`
        db.query(sql0, [newpassword, userinfo.username], (err0, result) => {
            if (err0)
                return res.send(err0)
            if (result.affectedRows != 1)
                return res.cc('修改密码失败!')
            console.log('更改密码成功!')
            res.send({
                status: 0,
                message: '更改密码成功!'
            })
        })
    })
}
exports.submit_meeting = (req, res) => {

    const sql = `insert into submit_meeting set ?`
    db.query(sql, req.body, (err, results) => {
        if (err)
            return res.cc(err)
        if (results.affectedRows != 1)
            return res.cc('提交失败!')
        console.log('提交成功')
    })
    res.send({
        status: 0,
        message: '提交会议纪要成功!'

    })
}

exports.agree_meeting = (req, res) => {
    const sql = `update submit_meeting set status=1 where id=?`
    db.query(sql, req.body.id, (err, results) => {
        if (err)
            return res.cc(err)
        if (results.affectedRows != 1)
            return res.cc('同意失败!')
        console.log('同意成功')
        const sqlstr = `select * from submit_meeting where status=0 order by id desc`
        db.query(sqlstr, (err, results) => {
            if (err)
                return res.cc(err)
            if (results.length == 0)
                return res.send({
                    status: -1,
                    message: '暂无待审查会议'
                })
            res.send({
                status: 0,
                message: '有待审查会议',
                date: results,
                long: results.length
            })
        })
    })
}
exports.reject_meeting = (req, res) => {
    const sql = `update submit_meeting set status=-1,response=? where id=?`
    db.query(sql, [req.body.response, req.body.id], (err, results) => {
        if (err)
            return res.cc(err)
        if (results.affectedRows != 1)
            return res.cc('拒绝申请失败!')
        console.log('拒绝申请成功')
        const sqlstr = `select * from submit_meeting where status=0 order by id desc`
        db.query(sqlstr, (err, results) => {
            if (err)
                return res.cc(err)
            if (results.length == 0)
                return res.send({
                    status: -1,
                    message: '暂无待审查会议'
                })
            res.send({
                status: 0,
                message: '有待审查会议',
                date: results,
                long: results.length
            })
        })
    })
}
exports.send_question = (req, res) => {
    const sql = `insert into qa set? `
    db.query(sql, req.body, (err, results) => {
        if (err)
            return res.cc(err)
        if (results.affectedRows != 1)
            return res.cc('提交失败!')
        res.send({
            status: 0,
            message: '提交成功!请等待管理员回复!'
        })
    })
}
exports.pass_question = (req, res) => {
    const sqlstr = `select * from qa where username=? order by id desc`
    db.query(sqlstr, req.body.username, (err, results) => {
        if (err)
            return res.cc(err)
        res.send({
            status: 0,
            message: '获得历史疑问成功',
            data: results
        })
    })
}
exports.manager_get_question = (req, res) => {
    const sqlstr = `select * from qa where status=0 order by id desc`
    db.query(sqlstr, (err, results) => {
        if (err)
            return res.cc(err)
        res.send({
            status: 0,
            message: '获得疑问成功',
            data: results
        })
    })
}
exports.send_answer = (req, res) => {
    const sql = `update qa set status=1,answer=?,managername=? where id=?`
    db.query(sql, [req.body.answer, req.body.managername, req.body.id], (err, results) => {
        if (err)
            return res.cc(err)
        if (results.affectedRows != 1)
            return res.cc('回复失败!')
        res.send({
            status: 0,
            message: '回复成功',
        })
    })
}

exports.update_meeting_file = (req, res) => {
    console.log(req.body)
    req.body.status = 0
    const sql = `update submit_meeting set ? where id=?`
    db.query(sql, [req.body, req.body.id], (err, results) => {
        if (err)
            return res.cc(err)
        if (results.affectedRows != 1)
            return res.cc('回复失败!')
        res.send({
            status: 0,
            message: '修改成功',
            results
        })
    })
}

