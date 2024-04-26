const xhr = new XMLHttpRequest()
let writername
let image_save
let meeting_image_save
let meeting_txt_save
xhr.open('POST', 'http://127.0.0.1:1080/my/getinformation')
//获得用户信息
let Orignalresponse, userinformation
xhr.addEventListener('loadend', () => {
    const response = JSON.parse(xhr.response)
    if (response.status == 1) {
        alert('当前未登录或登录已过期')
        location.href = `../templates/login.html`
    }
    else {
        userinformation = response.date
        console.log(userinformation)
        user_image = document.querySelectorAll('.user_image')
        user_image.forEach(index => {
            if (response.date.image)
                index.src = `../api_server/attachment/${response.date.image}`
            else
                index.src = `../api_server/attachment/1f00249563e6c7ce6d735878952e6fc1`
            document.querySelector('.user_commit_top_img').src = `../api_server/attachment/${response.date.image}`
            document.querySelector('.li_username').innerHTML = `姓名:${response.date.username}`
            document.querySelector('.li_group').innerHTML = `组别:${response.date.group}`
            document.querySelector('.li_age').innerHTML = `年纪:${response.date.age}`
            if (response.date.gender == 'man')
                document.querySelector('.li_gender').innerHTML = `性别:男`
            else
                document.querySelector('.li_gender').innerHTML = `性别:女`
        });
    }
})
xhr.setRequestHeader('Authorization', `${localStorage.getItem('token')}`)
xhr.setRequestHeader('Content-Type', 'application/json')
data = {
    username: localStorage.getItem('user_name'),
}
const dataStr = JSON.stringify(data)
xhr.send(dataStr);

let a = [], pages = {
    current: 1,
    pagesMax: 1
}

//获得会议信息
const xhr1 = new XMLHttpRequest()
xhr1.open('POST', 'http://127.0.0.1:1080/meeting/getOneMeeting')
xhr1.addEventListener('loadend', () => {
    const response = JSON.parse(xhr1.response)
    document.querySelector('.commit_under').innerHTML = response.date.commite
    input_image = document.querySelectorAll('.input_image')
    console.log(input_image.length)
    input_image.forEach((index) => {
        index.src = `../api_server/attachment/${userinformation.image}`
    })
    let b = response.date.content.replace(/\n/g, "<br/>")
    let c = response.date.text.replace(/\n/g, "<br/>")
    console.log(c.length)
    for (let i = 0; i <= c.length / 2000; i++) {
        a[i] = c.substr(i * 2000, 2000)
    }
    pages.pagesMax = a.length
    console.log(pages.pagesMax)
    if (pages.pagesMax == 1)
        document.querySelector('.page').style.display = 'none'
    document.querySelector('.meeting_title_h1').innerHTML = response.date.title
    document.querySelector('.meeting_content1').innerHTML = b
    if (localStorage.getItem(`${response.date.id}`)) {
        document.querySelector('.bookmark').classList.add('click_bookmark')
        pages.current = localStorage.getItem(`${response.date.id}`)
        document.querySelector('.meeting_content2').innerHTML = a[pages.current - 1]
        document.querySelector('.page_num').innerHTML = `第${pages.current}页/共${pages.pagesMax}页`
    }
    else {
        document.querySelector('.meeting_content2').innerHTML = a[0]
        document.querySelector('.page_num').innerHTML = `第1页/共${pages.pagesMax}页`
    }
    writername = response.date.user_name
    const xhr2 = new XMLHttpRequest()
    xhr2.open('POST', 'http://127.0.0.1:1080/my/getinformation')
    xhr2.addEventListener('loadend', () => {
        const response = JSON.parse(xhr2.response)
        document.querySelector('.writer_image').src = `../api_server/attachment/${response.date.image}`
        document.querySelector('.writer_name').innerHTML = response.date.username
        document.querySelector('.writer_group').innerHTML = response.date.group

    })
    xhr2.setRequestHeader('Authorization', `${localStorage.getItem('token')} `)
    xhr2.setRequestHeader('Content-Type', 'application/json')
    data2 = {
        username: writername,
    }
    const dataStr2 = JSON.stringify(data2)
    xhr2.send(dataStr2);
    Orignalresponse = response.date
    console.log(Orignalresponse)
    //身份和情况判断
    console.log(Orignalresponse)
    if (localStorage.getItem('manager') == `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9` || ((Orignalresponse.user_name == localStorage.getItem('user_name')) && (Orignalresponse.status == -1))) {
        console.log(`!!!!!`)
        document.querySelector('.manager_button').classList.add('show')
        if (Orignalresponse.status == -1) {
            document.querySelector('.delete').classList.add('hidden')
            console.log(`555555`)
        }
    }
})
xhr1.setRequestHeader('Authorization', `${localStorage.getItem('token')} `)
xhr1.setRequestHeader('Content-Type', 'application/json')
data1 = {
    id: localStorage.getItem('meeting_id')
}
const dataStr1 = JSON.stringify(data1)
xhr1.send(dataStr1);





//返回
document.querySelector('.return').addEventListener('click', (e) => {
    location.href = localStorage.getItem('location')
})
//上传会议
document.querySelector('.submit_meeting').addEventListener('click', (e) => {
    window.open('http://127.0.0.1:5500/templates/submit.html')
})

//图片更改事件
document.querySelector(`.submit_meeting_information_img_file`).addEventListener('change', (e) => {
    const file = e.target.files[0]
    document.querySelector('.meeting_image').src = URL.createObjectURL(file)
    console.log(document.querySelector('.meeting_image').src)
    meeting_image_save = file
})
//txt文件更改事件
document.querySelector('.txt_file').addEventListener('change', (e) => {
    const file = e.target.files[0]
    meeting_txt_save = file
    let reader = new FileReader()
    reader.onload = () => {
        txtStr = reader.result
    }
    reader.readAsText(file, "UTF-8")
})




//修改会议界面的渲染
document.querySelector('.change').addEventListener('click', (e) => {
    document.querySelector('.change_div').classList.add('show')
    document.querySelector('.meeting_title').value = document.querySelector('.meeting_title_h1').innerHTML
    document.querySelector('.meeting_content_textarea').value = document.querySelector('.meeting_content1').innerHTML

    if (Orignalresponse.type == 11)
        document.querySelector('.meeting_type_work').classList.add('meeting_type_choose')
    else
        document.querySelector('.meeting_type_relax').classList.add('meeting_type_choose')
    let tagId = [Orignalresponse.tag1, Orignalresponse.tag2, Orignalresponse.tag3]
    console.log(tagId)
    const tag = document.querySelectorAll('.meeting_tag')
    tagId.forEach((index) => {
        if (index != 0)
            tag[index - 1].classList.add('meeting_tag_choose')
    })
    if (document.querySelectorAll('.meeting_tag_choose')) {
        const tag_choosed = document.querySelectorAll('.meeting_tag_choose')
        const limit = document.querySelector('.limit')
        limit.innerHTML = `${tag_choosed.length} /3`
        if (tag_choosed.length > 3) {
            tag[e.target.id - 1].classList.remove('meeting_tag_choose')
            limit.innerHTML = `3/3`
            limit.style.color = `red`
        }
        else {
            limit.style.color = `black`
        }
    }
})
//点击修改界面的修改按钮
document.querySelector('.meeting_submit_button').addEventListener('click', (e) => {
    e.preventDefault()
    if (!(document.querySelector('.meeting_type_choose'))) {
        alert('请选择会议类型!')
        return
    }
    if (!meeting_image_save) {
        alert('请选择会议封面!')
        return
    }
    if (document.querySelector('.meeting_title').value == '') {
        alert('请输入会议标题!')
        return
    }
    if (document.querySelector('.meeting_content_textarea').value == '') {
        alert('请输入会议内容!')
        return
    }
    let tagid = [0, 0, 0], i = 0
    let date = new Date()
    date = date.toLocaleString()
    if (document.querySelectorAll('.meeting_tag_choose')) {
        const tag = document.querySelectorAll('.meeting_tag_choose')
        tag.forEach((item) => {
            tagid[i++] = item.id
        })
    }
    if (!meeting_txt_save) {
        alert('请上传txt文件!')
        return
    }
    data = {
        user_name: Orignalresponse.user_name,
        group: document.querySelector('.writer_group').innerHTML,
        time: date,
        title: document.querySelector('.meeting_title').value,
        content: document.querySelector('.meeting_content_textarea').value,
        type: document.querySelector('.meeting_type_choose').id,
        tag1: tagid[0],
        tag2: tagid[1],
        tag3: tagid[2]
    }
    console.log(data)
    // const dateStr = JSON.stringify(data)
    // xhr.send(dateStr)
    const xhr1 = new XMLHttpRequest()
    xhr1.open('POST', 'http://127.0.0.1:1080/my/update_meeting_file')
    xhr1.addEventListener('loadend', () => {
        console.log(xhr1.response)
        alert(JSON.parse(xhr1.response).message)
        location.reload()
    })
    xhr1.setRequestHeader('Authorization', `${localStorage.getItem('token')}`)
    const fd = new FormData()
    fd.append('photo', meeting_image_save)
    fd.append('user_name', data.user_name)
    fd.append('group', data.group)
    fd.append('time', data.time)
    fd.append('title', data.title)
    fd.append('content', data.content)
    fd.append('type', data.type)
    fd.append('tag1', data.tag1)
    fd.append('tag2', data.tag2)
    fd.append('tag3', data.tag3)
    fd.append('text', txtStr)
    fd.append('id', localStorage.getItem('meeting_id'))
    xhr1.send(fd)
})





//关闭修改
document.querySelector('.close').addEventListener('click', (e) => {
    document.querySelector('.change_div').classList.remove('show')
})

document.querySelector('.meeting_type_work').addEventListener('click', (e) => {
    if (document.querySelector('.meeting_type_choose')) {
        document.querySelector('.meeting_type_choose').classList.remove(`meeting_type_choose`)
    }

    document.querySelector('.meeting_type_work').classList.add('meeting_type_choose')

})


//选择标签
document.querySelector('.meeting_type_relax').addEventListener('click', (e) => {
    if (document.querySelector('.meeting_type_choose')) {

        document.querySelector('.meeting_type_choose').classList.remove(`meeting_type_choose`)
    }


    document.querySelector('.meeting_type_relax').classList.add('meeting_type_choose')
})
//选择tag
document.querySelector('.tag').addEventListener('click', (e) => {
    if (e.target.tagName == `SPAN`) {
        const tag = document.querySelectorAll('.meeting_tag')
        tag[e.target.id - 1].classList.toggle('meeting_tag_choose')
        if (document.querySelectorAll('.meeting_tag_choose')) {
            const tag_choosed = document.querySelectorAll('.meeting_tag_choose')
            const limit = document.querySelector('.limit')
            limit.innerHTML = `${tag_choosed.length}/3`


            if (tag_choosed.length > 3) {
                tag[e.target.id - 1].classList.remove('meeting_tag_choose')
                limit.innerHTML = `3/3`
                limit.style.color = `red`
            }
            else {
                limit.style.color = `black`
            }
        }
    }
})

//删除会议
document.querySelector('.delete').addEventListener('click', (e) => {
    const response = prompt("请声明理由:")
    console.log(response)
    if (response && response != '') {
        const xhr = new XMLHttpRequest()
        xhr.open('POST', 'http://127.0.0.1:1080/my/reject_meeting')
        xhr.addEventListener('loadend', () => {
            console.log(response)
            alert("删除成功")
            location.href = 'http://127.0.0.1:5500/templates/index.html'

        })
        xhr.setRequestHeader('Authorization', `${localStorage.getItem('token')}`)
        xhr.setRequestHeader('Content-Type', 'application/json')
        const data = {
            id: localStorage.getItem('meeting_id'),
            response
        }
        const dataStr = JSON.stringify(data)
        xhr.send(dataStr)
    }
    else
        alert("理由不能为空")
})


let UL_count = 0, UL = [({
    LI: '',
    li: ''
})]
//评论
document.querySelector('.user_commit_top_button').addEventListener('click', (e) => {

    if (!document.querySelector('.commit_list'))
        UL_count = 0
    if (document.querySelector('.commit_list'))
        UL_count = 1
    if (document.querySelectorAll('.commit_list'))
        UL_count = document.querySelectorAll('.commit_list').length
    UL[UL_count] = ({
        LI: '',
        li: ''
    })

    if (!document.querySelector('.commit_reply_div'))
        li_div_count = 0
    if (document.querySelector('.commit_reply_div'))
        li_div_count = 1
    if (document.querySelectorAll('.commit_reply_div'))
        li_div_count = document.querySelectorAll('.commit_reply_div').length




    let textarea = document.querySelector('.user_commit_top_textarea').value
    if (textarea != '') {
        textarea = textarea.replace(/[\r\n]/g, "");
        UL[UL_count].LI = `<li class="commit_first clearfix">
                    <img src="../api_server/attachment/${userinformation.image}" class="user_commit_under_img" id=${UL_count}>
                    <span class="user_commit_under_name" id=${UL_count}>${userinformation.username}</span>
                    <div class="user_commit_under_content" id=${UL_count}>
                       ${textarea}
                    </div>
                    <span class="commit_respond_big" id=${UL_count}>回复</span>
                    <div class="input_commit_big" id=${UL_count}>
                        <img src="../api_server/attachment/${userinformation.image}"
                            class="user_commit_under_img input_image" id=${UL_count}>
                        <textarea cols="120" rows="4" class="user_commit_under_textarea_big" id=${UL_count}></textarea>
                        <button class="user_commit_under_button_big" id=${UL_count}>发布</button>
                    </div>
                </li>`
        let ULStr = ` <ul class="commit_list">
               ${UL[UL_count].LI}
                ${UL[UL_count].li}
            </ul>
`
        document.querySelector('.commit_under').innerHTML = ULStr + document.querySelector('.commit_under').innerHTML
        let xhr_commit1 = new XMLHttpRequest()
        xhr_commit1.open('POST', 'http://127.0.0.1:1080/meeting/send_commit')
        xhr_commit1.addEventListener('loadend', () => {
            const response = JSON.parse(xhr_commit1.response)
        })
        xhr_commit1.setRequestHeader('Authorization', `${localStorage.getItem('token')}`)
        xhr_commit1.setRequestHeader('Content-Type', 'application/json')
        data1 = {
            id: localStorage.getItem('meeting_id'),
            commite: document.querySelector('.commit_under').innerHTML
        }
        let dataStr1 = JSON.stringify(data1)
        xhr_commit1.send(dataStr1);
    }
})

//上面的ID大，下面的ID小
let first, second
document.querySelector('.commit_under').addEventListener("click", (e) => {
    if (!document.querySelector('.commit_reply_div'))
        li_div_count = 0
    if (document.querySelector('.commit_reply_div'))
        li_div_count = 1
    if (document.querySelectorAll('.commit_reply_div'))
        li_div_count = document.querySelectorAll('.commit_reply_div').length
    if (e.target.classList == "commit_respond_big") {
        if (document.querySelector('.show0')) {
            first = document.querySelector('.show0').id
            document.querySelector('.show0').classList.remove('show0')
        }
        All_Input = document.querySelectorAll('.input_commit_big')
        All_Input[All_Input.length - 1 - e.target.id].classList.add('show0')
        console.log(first, document.querySelector('.show0').id)
        if (first == document.querySelector('.show0').id) {
            document.querySelector('.show0').classList.remove('show0')
            first = -100
        }
    }
    if (e.target.classList == "commit_respond_small") {

        if (document.querySelector('.show0')) {
            first = document.querySelector('.show0').id
            document.querySelector('.show0').classList.remove('show0')
        }
        All_Input = document.querySelectorAll('.input_commit_small')
        All_Input[e.target.id].classList.add('show0')
        console.log(first, document.querySelector('.show0').id)
        if (first == document.querySelector('.show0').id) {
            document.querySelector('.show0').classList.remove('show0')
            first = -100
        }
    }
    for (let i = 0; i < document.querySelectorAll('.commit_respond_small').length; i++) {
        let commit_respond_small = document.querySelectorAll('.commit_respond_small')
        let user_commit_under_content = document.querySelectorAll('.user_commit_under_content')
        let user_commit_under_textarea_small = document.querySelectorAll('.user_commit_under_textarea_small')
        let user_commit_under_button_small = document.querySelectorAll('.user_commit_under_button_small')
        commit_respond_small[i].id = i
        user_commit_under_content[i].id = i
        user_commit_under_textarea_small[i].id = i
        user_commit_under_button_small[i].id = i
    }
    if (document.querySelector('.commit_reply'))
        for (let i = 0; i < document.querySelectorAll('.commit_reply').length; i++) {
            let commit_reply = document.querySelectorAll('.commit_reply')
            commit_reply[i].id = i
        }

    if (e.target.classList == 'user_commit_under_button_big') {

        let textarea0 = document.querySelectorAll('.user_commit_under_textarea_big')
        textarea = textarea0[textarea0.length - 1 - e.target.id].value
        if (textarea != '') {
            textarea = textarea.replace(/[\r\n]/g, "");
            let ULStr = `<li class="commit_reply">
                    <div class="commit_reply_div" id=${li_div_count}>
                        <img src="../api_server/attachment/${userinformation.image}" id=${li_div_count}
                            class="user_commit_under_img">
                        <span class="user_commit_under_name" id=${li_div_count}>${userinformation.username}</span>
                        <div class="user_commit_under_content" id=${li_div_count}>${textarea}
                        </div>
                        <span class="commit_respond_small" id=${li_div_count} name=${userinformation.username}>回复</span>
                        <div class="input_commit_small" id=${li_div_count}>
                            <img src="../api_server/attachment/${userinformation.image}"
                                class="user_commit_under_img input_image" id=${li_div_count}>
                            <textarea cols="120" rows="4" class="user_commit_under_textarea_small" id=${li_div_count}></textarea>
                            <button class="user_commit_under_button_small" id=${li_div_count} name=${userinformation.username}>发布</button>
                        </div>
                    </div>
                </li>
`
            ALL_UL = document.querySelectorAll('.commit_list')
            console.log(`???`)
            ALL_UL[ALL_UL.length - 1 - e.target.id].innerHTML = ALL_UL[ALL_UL.length - 1 - e.target.id].innerHTML + ULStr
            document.querySelector('.show0').classList.remove('show0')
            let xhr_commit1 = new XMLHttpRequest()
            xhr_commit1.open('POST', 'http://127.0.0.1:1080/meeting/send_commit')
            xhr_commit1.addEventListener('loadend', () => {
                const response = JSON.parse(xhr_commit1.response)
            })
            xhr_commit1.setRequestHeader('Authorization', `${localStorage.getItem('token')}`)
            xhr_commit1.setRequestHeader('Content-Type', 'application/json')
            data1 = {
                id: localStorage.getItem('meeting_id'),
                commite: document.querySelector('.commit_under').innerHTML
            }
            let dataStr1 = JSON.stringify(data1)
            xhr_commit1.send(dataStr1);
        }
    }
    if (e.target.classList == 'user_commit_under_button_small') {

        let se = e.target.parentNode.parentNode.parentNode
        // while (e.target.tagName != 'LI' && e.target)
        //     e.target = e.target.parentNode
        let textarea0 = document.querySelectorAll('.user_commit_under_textarea_small')
        textarea = textarea0[e.target.id].value
        if (textarea != '') {
            textarea = textarea.replace(/[\r\n]/g, "");
            let ULStr = `<div class="commit_reply_div" id=${li_div_count}>
                        <img src="../api_server/attachment/${userinformation.image}" id=${li_div_count}
                            class="user_commit_under_img">
                        <span class="user_commit_under_name" id=${li_div_count}>${userinformation.username}</span>
                        <div class="user_commit_under_content" id=${li_div_count}>回复@${e.target.name}:${textarea}
                        </div>
                        <span class="commit_respond_small" id=${li_div_count}>回复</span>
                        <div class="input_commit_small" id=${li_div_count}>
                            <img src="../api_server/attachment/${userinformation.image}"
                                class="user_commit_under_img input_image" id=${li_div_count}>
                            <textarea cols="120" rows="4" class="user_commit_under_textarea_small" id=${li_div_count}></textarea>
                            <button class="user_commit_under_button_small" id=${li_div_count} name=${userinformation.username}>发布</button>
                        </div>
                    </div>
`
            ALL_Reply = document.querySelectorAll('.commit_reply')
            console.log(`???`)
            console.log(e.target)
            console.log(e.target.id)
            console.log(ALL_Reply.length)
            ALL_Reply[se.id].innerHTML = ALL_Reply[se.id].innerHTML + ULStr
            document.querySelector('.show0').classList.remove('show0')
            let xhr_commit1 = new XMLHttpRequest()
            xhr_commit1.open('POST', 'http://127.0.0.1:1080/meeting/send_commit')
            xhr_commit1.addEventListener('loadend', () => {
                const response = JSON.parse(xhr_commit1.response)
            })
            xhr_commit1.setRequestHeader('Authorization', `${localStorage.getItem('token')}`)
            xhr_commit1.setRequestHeader('Content-Type', 'application/json')
            data1 = {
                id: localStorage.getItem('meeting_id'),
                commite: document.querySelector('.commit_under').innerHTML
            }
            let dataStr1 = JSON.stringify(data1)
            xhr_commit1.send(dataStr1);
        }
    }
})


document.querySelector('.left_button').addEventListener('click', () => {
    if (pages.current > 1) {
        pages.current--
        document.querySelector('.page_num').innerHTML = `第${pages.current}页/共${pages.pagesMax}页`
        document.querySelector('.meeting_content2').innerHTML = a[pages.current - 1]
        if (localStorage.getItem(`${Orignalresponse.id}`) && pages.current != localStorage.getItem(`${Orignalresponse.id}`)) {
            if (document.querySelector('.click_bookmark'))
                document.querySelector('.click_bookmark').classList.remove('click_bookmark')
        }
        if (localStorage.getItem(`${Orignalresponse.id}`) && pages.current == localStorage.getItem(`${Orignalresponse.id}`))
            document.querySelector('.bookmark').classList.add('click_bookmark')
    }
})
document.querySelector('.right_button').addEventListener('click', () => {
    if (pages.current < pages.pagesMax) {
        pages.current++
        document.querySelector('.page_num').innerHTML = `第${pages.current}页/共${pages.pagesMax}页`
        document.querySelector('.meeting_content2').innerHTML = a[pages.current - 1]
        if (localStorage.getItem(`${Orignalresponse.id}`) && pages.current != localStorage.getItem(`${Orignalresponse.id}`)) {
            if (document.querySelector('.click_bookmark'))
                document.querySelector('.click_bookmark').classList.remove('click_bookmark')
        }
        if (localStorage.getItem(`${Orignalresponse.id}`) && pages.current == localStorage.getItem(`${Orignalresponse.id}`))
            document.querySelector('.bookmark').classList.add('click_bookmark')

    }
})


document.querySelector('.bookmark').addEventListener('click', (e) => {
    document.querySelector('.bookmark').classList.toggle('click_bookmark')
    let a = document.querySelector('.bookmark').className
    if (a.includes('click_bookmark')) {
        localStorage.setItem(`${Orignalresponse.id}`, pages.current)
    }
    else {
        localStorage.removeItem(`${Orignalresponse.id}`)
        console.log(`!!!`)

    }
})



