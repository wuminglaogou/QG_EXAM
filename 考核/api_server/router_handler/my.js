const expressJoi = require("@escook/express-joi")
const db = require(`../db/index`)

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
exports.receptinformation = (req, res) => {
    // console.log(req.body)
    const date0 = req.body
    const date = {
        password: date0.newpassword,
        group: date0.group,
        image: date0.image,
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
        res.send({
            status: 0,
            date,
            message: '更新数据成功'
        })
    })
}
exports.receptimage = (req, res) => {
    console.log(req.body)
    res.send({
        status: 0,
        message: '更新头像成功'
    })
}