const express = require('express')
const router = express.Router()
const expressJoi = require(`@escook/express-joi`)
const router_handler = require('../router_handler/my')
const { change_schema } = require('../schema/my')
const multer = require("multer");
//读取用户信息

router.post('/getinformation', router_handler.getinformation)
router.post('/receptinformation', expressJoi(change_schema), router_handler.receptinformation)
router.post('/receptimage', uploadFile, router_handler.receptimage)

module.exports = router


function uploadFile(req, res, next) {
    //dest 值为文件存储的路径;single方法,表示上传单个文件,参数为表单数据对应的key
    let upload = multer({ dest: `./images` });
    console.log('!!!')
    upload(req, res, (err) => {
        //打印结果看下面的截图
        console.log(req.file);
        console.log('!');
        if (err) {

            res.cc({
                message: "err:" + err,
                status: 0
            });
        } else {
            //将文件信息赋值到req.body中，继续执行下一步
            req.body.photo = req.file.filename;
            next();
        }
    })
}
