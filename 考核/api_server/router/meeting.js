const express = require('express')
const router = express.Router()
const expressJoi = require(`@escook/express-joi`)
const router_handler = require('../router_handler/meeting')
const { change_schema } = require('../schema/my')
const multer = require("multer");
//读取用户信息


router.post(`/getOneMeeting`, router_handler.getMeeting)

//上传评论
router.post("/send_commit", router_handler.send_commit)



function uploadFile(req, res, next) {
    // console.log(req)
    // console.log(req.photo)
    //dest 值为文件存储的路径;single方法,表示上传单个文件,参数为表单数据对应的key
    let upload = multer({ dest: "attachment/" }).single("photo");
    upload(req, res, (err) => {
        //打印结果看下面的截图
        if (err) {
            res.send("err:" + err);
        } else {
            //将文件信息赋值到req.body中，继续执行下一步
            req.body.photo = req.file.filename;
            next();
        }
    })
}

function uploadFile_text(req, res, next) {
    // console.log(req)
    // console.log(req.photo)
    //dest 值为文件存储的路径;single方法,表示上传单个文件,参数为表单数据对应的key
    let fieldsList = [
        { name: "photo" },
        { name: "text" }
    ]
    let upload = multer({ dest: "attachment/" }).fields(fieldsList);
    upload(req, res, (err) => {
        //打印结果看下面的截图
        if (err) {
            res.send("err:" + err);
        } else {
            //将文件信息赋值到req.body中，继续执行下一步
            req.body.text = req.files.text[0].filename;
            req.body.photo = req.files.photo[0].filename;
            next();
        }
    })
}





module.exports = router