const express = require('express')
const expressWs = require('express-ws')
const router = express.Router()
expressWs(router)
const expressJoi = require(`@escook/express-joi`)
const router_handler = require('../router_handler/my')
const { change_schema } = require('../schema/my')
const multer = require("multer");

//读取用户信息


router.post('/getinformation', router_handler.getinformation)
router.post('/receptinformation', router_handler.receptinformation)
// router.post('/receptimage', uploadFile, router_handler.receptimage)
router.post("/receptimage", uploadFile, router_handler.receptimage)
//这里的req.body是经过uploadFile中间件进行处理后的,包含了表单中所有的提交内容)

router.post("/receptpassword", expressJoi(change_schema), router_handler.receptpassword)
// router.post("/submit_meeting", router_handler.submit_meeting)
router.post("/submit_meeting_file", uploadFile, router_handler.submit_meeting)
// router.post("/submit_meeting_txt", uploadFile_text, router_handler.submit_meeting_txt)
router.get("/get_all_0_meeting", router_handler.get_all_0_meeting)
router.get("/get_all_1_meeting", router_handler.get_all_1_meeting)
router.post("/get_all_my_meeting", router_handler.get_all_my_meeting)

//通过某会议纪要
router.post("/agree_meeting", router_handler.agree_meeting)
router.post("/reject_meeting", router_handler.reject_meeting)

//发生问题
router.post("/send_question", router_handler.send_question)

//历史疑问
router.post("/pass_question", router_handler.pass_question)
router.get("/manager_get_question", router_handler.manager_get_question)

router.post("/send_answer", router_handler.send_answer)
//管理员修改纪要
router.post("/update_meeting_file", uploadFile, router_handler.update_meeting_file)







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
            req.body.text = req.files.text[0];
            req.body.photo = req.files.photo[0].filename;
            console.log(req.body.text)
            next();
        }
    })
}





module.exports = router