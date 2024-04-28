
let change_other = 0
const xhr = new XMLHttpRequest()
let image_save
let meeting_image_save
let meeting_txt_save
let Now_meetingStr, page_control, meetingStr, txtStr
let Now_meetingStr1, page_control1, meetingStr1, txtStr1, userinformation
localStorage.setItem('location', location.href)
xhr.open('POST', 'http://127.0.0.1:1080/my/getinformation')
xhr.addEventListener('loadend', () => {
    const response = JSON.parse(xhr.response)
    if (response.status == 1) {
        alert('当前未登录或登录已过期')
        location.href = `../templates/login.html`
    }
    console.log(response)
    document.querySelector('.name').value = response.date.username
    if (response.date.gender == '男')
        document.querySelector('.man').selected = true
    if (response.date.gender == '女')
        document.querySelector('.woman').selected = true
    if (response.date.group == '暂无')
        document.querySelector('.none_group').selected = true
    if (response.date.group == '前端组')
        document.querySelector('.front_group').selected = true
    if (response.date.group == '后台组')
        document.querySelector('.backstage_group').selected = true
    if (response.date.group == '嵌入式组')
        document.querySelector('.embedded_group').selected = true
    if (response.date.group == '移动组')
        document.querySelector('.move_group').selected = true
    if (response.date.group == '人工智能组')
        document.querySelector('.AI_group').selected = true
    if (response.date.group == '图形组')
        document.querySelector('.graph_group').selected = true
    if (response.date.group == '设计组')
        document.querySelector('.design_group').selected = true
    document.querySelector('.age').value = response.date.age
    if (response.date.image != null)
        document.querySelector('.user_image').src = `../api_server/attachment/${response.date.image}`
    console.log(response.date.image)
    console.log(document.querySelector('.user_image').src)
    localStorage.setItem('age', response.date.age)
    localStorage.setItem('gender', response.date.gender)
    localStorage.setItem('group', response.date.group)
    localStorage.setItem('image', response.date.image)
    localStorage.setItem('user_name', response.date.username)
    if (localStorage.getItem(`${localStorage.getItem('user_name')}`)) {
        let load_data = JSON.parse(localStorage.getItem(`${localStorage.getItem('user_name')}`))
        console.log(load_data)
        if (load_data.title)
            document.querySelector('.meeting_title').value = load_data.title
        if (load_data.content)
            document.querySelector('.meeting_content_textarea').value = load_data.content
        if (load_data.type == 11)
            document.querySelector('.meeting_type_work').classList.add('meeting_type_choose')
        if (load_data.type == 12)
            document.querySelector('.meeting_type_relax').classList.add('meeting_type_choose')
        for (let i = 0; i < 3; i++) {
            if (load_data.tag[i] == 1)
                document.querySelector('.hurry').classList.add('meeting_tag_choose')
            if (load_data.tag[i] == 2)
                document.querySelector('.competition').classList.add('meeting_tag_choose')
            if (load_data.tag[i] == 3)
                document.querySelector('.outsourcing').classList.add('meeting_tag_choose')
            if (load_data.tag[i] == 4)
                document.querySelector('.organize').classList.add('meeting_tag_choose')
            if (load_data.tag[i] == 5)
                document.querySelector('.general_meeting').classList.add('meeting_tag_choose')
        }
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
    save_writing()
})
xhr.setRequestHeader('Authorization', `${localStorage.getItem('token')}`)
xhr.setRequestHeader('Content-Type', 'application/json')
const user = { username: `${localStorage.getItem('user_name')}` }
const userStr = JSON.stringify(user)
xhr.send(userStr);

//管理员判断
const manager = localStorage.getItem('manager')
if (manager != `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9`) {
    document.querySelector('.accept_meeting').classList.add('hidden')
    document.querySelector('.manager_answer_left').classList.add('hidden')
}
else {
    document.querySelector('.question_answer_left').classList.add('hidden')
}


document.querySelector('.group').addEventListener('click', (e) => {
    if (change_other == 0)
        change_other = 1
})
document.querySelector('.age').addEventListener('click', (e) => {
    if (change_other == 0)
        change_other = 1
})
document.querySelector('.gender').addEventListener('click', (e) => {
    if (change_other == 0)
        change_other = 1
})
//信息修改和会议上传页面的切换
document.querySelector('.user_information_change_title_left_header').addEventListener('click', (e) => {
    document.querySelector(`.user_information_change_title_left_header_choose`).classList.remove('user_information_change_title_left_header_choose')
    document.querySelector('.user_information_change_title_left_header').classList.add('user_information_change_title_left_header_choose')
    document.querySelector(`.show`).classList.remove('show')
    document.querySelector(`.change_user_information`).classList.add('show')
    save_writing()
})
document.querySelector('.submit_meeting').addEventListener('click', (e) => {
    document.querySelector(`.user_information_change_title_left_header_choose`).classList.remove('user_information_change_title_left_header_choose')
    document.querySelector('.submit_meeting').classList.add('user_information_change_title_left_header_choose')
    document.querySelector(`.show`).classList.remove('show')
    document.querySelector(`.submit_meeting_information`).classList.add('show')
    save_writing()
})





//会议审核
document.querySelector('.accept_meeting').addEventListener('click', (e) => {
    let a = e.target.className

    if (!a.includes('user_information_change_title_left_header_choose')) {
        document.querySelector(`.user_information_change_title_left_header_choose`).classList.remove('user_information_change_title_left_header_choose')
        document.querySelector('.accept_meeting').classList.add('user_information_change_title_left_header_choose')
        document.querySelector(`.show`).classList.remove('show')
        document.querySelector(`.accept_meeting_right`).classList.add('show')
        const xhr = new XMLHttpRequest()
        xhr.open('GET', 'http://127.0.0.1:1080/my/get_all_0_meeting')
        xhr.addEventListener('loadend', () => {
            if (JSON.parse(xhr.response).status == 0) {
                const meeting = JSON.parse(xhr.response).date
                console.log(meeting)
                let typeStr, tagStr1 = '', tagStr2 = '', tagStr3 = '';
                meetingStr = meeting.map((index) => {
                    if (index.type == 11)
                        typeStr = `<div class="meeting_type_work_manager" id="11">办公</div>`
                    if (index.type == 12)
                        typeStr = `<div class="meeting_type_relax_manager" id="12">康乐</div>`
                    if (index.tag1 == 0)
                        tagStr1 = ''
                    if (index.tag1 == 1)
                        tagStr1 = ' <div class="meeting_sort_manager hurry_manager" id="1">加急</div>'
                    if (index.tag1 == 2)
                        tagStr1 = '<div class="meeting_sort_manager competition_manager" id="2">比赛</div>'
                    if (index.tag1 == 3)
                        tagStr1 = '<div class="meeting_sort_manager outsourcing_manager" id="3">外包</div>'
                    if (index.tag1 == 4)
                        tagStr1 = '<div class="meeting_sort_manager organize_manager" id="4">组会</div>'
                    if (index.tag1 == 5)
                        tagStr1 = '<div class="meeting_sort_manager general_meeting_manager" id="5">全会</div>'
                    if (index.tag2 == 0)
                        tagStr2 = ''
                    if (index.tag2 == 1)
                        tagStr2 = ' <div class="meeting_sort_manager hurry_manager" id="1">加急</div>'
                    if (index.tag2 == 2)
                        tagStr2 = '<div class="meeting_sort_manager competition_manager" id="2">比赛</div>'
                    if (index.tag2 == 3)
                        tagStr2 = '<div class="meeting_sort_manager outsourcing_manager" id="3">外包</div>'
                    if (index.tag2 == 4)
                        tagStr2 = '<div class="meeting_sort_manager organize_manager" id="4">组会</div>'
                    if (index.tag2 == 5)
                        tagStr2 = '<div class="meeting_sort_manager general_meeting_manager" id="5">全会</div>'
                    if (index.tag3 == 0)
                        tagStr3 = ''
                    if (index.tag3 == 1)
                        tagStr3 = ' <div class="meeting_sort_manager hurry_manager" id="1">加急</div>'
                    if (index.tag3 == 2)
                        tagStr3 = '<div class="meeting_sort_manager competition_manager" id="2">比赛</div>'
                    if (index.tag3 == 3)
                        tagStr3 = '<div class="meeting_sort_manager outsourcing_manager" id="3">外包</div>'
                    if (index.tag3 == 4)
                        tagStr3 = '<div class="meeting_sort_manager organize_manager" id="4">组会</div>'
                    if (index.tag3 == 5)
                        tagStr3 = '<div class="meeting_sort_manager general_meeting_manager" id="5">全会</div>'

                    return `<li id=${index.id} class='meeting_li'>
        <div class="All_meeting_content id=${index.id}">
            <div class="All_meeting_img" id=${index.id}><img src="../api_server/attachment/${index.photo}"></div>
                <div class="All_meeting_introduce" title="${index.title} (by:${index.user_name})">${index.title} (by:${index.user_name})
                            </div>
            </div>
            <div class="meeting_time id=${index.id}">${index.time}</div>
        <div class="meeting_tag_manager id=${index.id}">
            ${typeStr}
         ${tagStr1}
         ${tagStr2}
         ${tagStr3}
        </div>
        <div class="audit">
            <div class="agree">
                <span class="agree1 iconfont" id=${index.id}>&#xe77d;
                                </span>
            </div>
            <div class="reject">
                <span class="reject0 iconfont"  id=${index.id}>&#xe783;
                                </span>
            </div>
        </div>
    </li>`
                })
                page_control = {
                    current: 1,
                    pages: Math.ceil(meetingStr.length / 6),
                }
                document.querySelector('.page').innerHTML = `第${page_control.current}页/共${page_control.pages}页`
                if (page_control.pages == 1)
                    document.querySelector('.All_meeting_middle').innerHTML = meetingStr.join('')
                else {
                    Now_meetingStr = meetingStr[0] + meetingStr[1] + meetingStr[2] + meetingStr[3] + meetingStr[4] + meetingStr[5]
                    console.log(Now_meetingStr)
                    document.querySelector('.All_meeting_middle').innerHTML = Now_meetingStr
                }
            }
        })
        xhr.setRequestHeader('Authorization', `${localStorage.getItem('token')}`)
        xhr.send()
        save_writing()
    }
})
//会议审核

// 左按钮
document.querySelector('.page_control_left').addEventListener('click', (e) => {
    if (page_control && page_control.current >= 2) {
        page_control.current = page_control.current - 1
        Now_meetingStr = meetingStr[6 * (page_control.current - 1)] + meetingStr[6 * (page_control.current - 1) + 1] + meetingStr[6 * (page_control.current - 1) + 2] + meetingStr[6 * (page_control.current - 1) + 3] + meetingStr[6 * (page_control.current - 1) + 4] + meetingStr[6 * (page_control.current - 1) + 5]
        document.querySelector('.All_meeting_middle').innerHTML = Now_meetingStr
        document.querySelector('.page').innerHTML = `第${page_control.current}页/共${page_control.pages}页`
    }
})
// 左按钮

// 右按钮
document.querySelector('.page_control_right').addEventListener('click', (e) => {
    if (page_control && page_control.current == page_control.pages - 1) {
        page_control.current = page_control.current + 1
        let currentStr = ''
        for (let i = 0; i < meetingStr.length - 6 * (page_control.current - 1); i++) {

            currentStr += meetingStr[(page_control.current - 1) * 6 + i]
        }
        Now_meetingStr = currentStr
        document.querySelector('.All_meeting_middle').innerHTML = Now_meetingStr
        document.querySelector('.page').innerHTML = `第${page_control.current}页/共${page_control.pages}页`
    }
    if (page_control && page_control.current < page_control.pages - 1) {
        page_control.current = page_control.current + 1
        Now_meetingStr = meetingStr[6 * (page_control.current - 1)] + meetingStr[6 * (page_control.current - 1) + 1] + meetingStr[6 * (page_control.current - 1) + 2] + meetingStr[6 * (page_control.current - 1) + 3] + meetingStr[6 * (page_control.current - 1) + 4] + meetingStr[6 * (page_control.current - 1) + 5]
        document.querySelector('.All_meeting_middle').innerHTML = Now_meetingStr
        document.querySelector('.page').innerHTML = `第${page_control.current}页/共${page_control.pages}页`
    }
})
// 右按钮




//图片更改事件
document.querySelector(`.change_user_information_img_file`).addEventListener('change', (e) => {

    const file = e.target.files[0]
    if (file)
        document.querySelector('.user_image').src = URL.createObjectURL(file)
    console.log(document.querySelector('.user_image').src)
    image_save = file
})
document.querySelector(`.submit_meeting_information_img_file`).addEventListener('change', (e) => {
    if (document.querySelector('.hidden'))
        document.querySelector('.meeting_image').classList.remove('hidden')
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




//选择标签
document.querySelector('.meeting_type_work').addEventListener('click', (e) => {
    if (document.querySelector('.meeting_type_choose')) {
        document.querySelector('.meeting_type_choose').classList.remove(`meeting_type_choose`)
    }

    document.querySelector('.meeting_type_work').classList.add('meeting_type_choose')

})
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


//点击修改按钮
document.querySelector('.change_information_button').addEventListener('click', async (e) => {
    e.preventDefault()
    //修改组别，年纪，性别
    const change_password = 0
    const oldpassword = document.querySelector('.oldpassword').value
    const newpassword = document.querySelector('.newpassword').value
    if (change_other == 1) {
        const xhr = new XMLHttpRequest()
        xhr.open('POST', 'http://127.0.0.1:1080/my/receptinformation')
        xhr.addEventListener('loadend', () => {
            const response = JSON.parse(xhr.response)
            console.log(response)
            alert(response.message)
            location.reload()
        })
        xhr.setRequestHeader('Authorization', `${localStorage.getItem('token')}`)
        xhr.setRequestHeader('Content-Type', 'application/json')

        data = {
            username: localStorage.getItem('user_name'),
            gender: document.querySelector('.gender').value,
            age: document.querySelector('.age').value,
            group: document.querySelector('.group').value
        }
        const dataStr = JSON.stringify(data)
        xhr.send(dataStr);
    }


    //修改图片
    if (image_save) {
        const xhr1 = new XMLHttpRequest()
        xhr1.open('POST', 'http://127.0.0.1:1080/my/receptimage')
        xhr1.addEventListener('loadend', () => {
            // const response = JSON.parse(xhr.response)
            alert(JSON.parse(xhr1.response).message)
        })
        xhr1.setRequestHeader('Authorization', `${localStorage.getItem('token')}`)
        // xhr1.setRequestHeader("Content-Type", "application/multipart/form-data");
        const fd = new FormData()
        fd.append('photo', image_save)
        fd.append('username', localStorage.getItem('user_name'))
        xhr1.send(fd)
    }
    //修改密码
    if (oldpassword != '' || newpassword != '') {
        const xhr2 = new XMLHttpRequest()
        xhr2.open('POST', 'http://127.0.0.1:1080/my/receptpassword')
        xhr2.addEventListener('loadend', () => {
            console.log(JSON.parse(xhr2.response))
            RE = JSON.parse(xhr2.response)
            if (RE.status == 0)
                alert('修改成功')
            else
                alert(RE.message)
        })
        const password_data = {
            username: localStorage.getItem('user_name'),
            oldpassword,
            newpassword
        }
        const password_data_str = JSON.stringify(password_data)
        xhr2.setRequestHeader('Authorization', `${localStorage.getItem('token')}`)
        xhr2.setRequestHeader('Content-Type', 'application/json')
        xhr2.send(password_data_str)
    }
    if (!(oldpassword != '' || newpassword != '') && image_save == 0 && change_other == 0)
        alert('没有修改数据!')
})

//提交会议信息
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
    if (!meeting_image_save.name.includes('.png') && !meeting_image_save.name.includes('.jpg') && !meeting_image_save.name.includes('.bmp') && !meeting_image_save.name.includes('.jpeg') && !meeting_image_save.name.includes('.psd')) {
        alert('会议封面错误!请重新选择会议封面')
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
    if (!meeting_txt_save.name.includes('.txt')) {
        alert('不是txt文件!请重新选择')
        return
    }
    // const xhr = new XMLHttpRequest()
    // xhr.open('POST', 'http://127.0.0.1:1080/my/submit_meeting')
    // xhr.addEventListener('loadend', () => {
    //     console.log(JSON.parse(xhr.response))
    // })
    // xhr.setRequestHeader('Authorization', `${localStorage.getItem('token')}`)
    // xhr.setRequestHeader('Content-Type', 'application/json')

    data = {
        user_name: localStorage.getItem('user_name'),
        group: localStorage.getItem('group'),
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
    xhr1.open('POST', 'http://127.0.0.1:1080/my/submit_meeting_file')
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
    xhr1.send(fd)
    localStorage.removeItem(`${localStorage.getItem(`user_name`)}`)
})

//同意或拒绝按钮
document.querySelector('.All_meeting_middle').addEventListener('click', (e) => {
    //同意
    if (e.target.classList == 'agree1 iconfont') {

        const xhr = new XMLHttpRequest()
        xhr.open('POST', 'http://127.0.0.1:1080/my/agree_meeting')
        xhr.addEventListener('loadend', () => {
            const meeting = JSON.parse(xhr.response).date
            console.log(meeting)
            if (!meeting) {
                document.querySelector('.All_meeting_middle').innerHTML = `<li class="no_meeting">暂无待审核会议</li>`
                return
            }
            let typeStr, tagStr1 = '', tagStr2 = '', tagStr3 = '';
            meetingStr = meeting.map((index) => {
                if (index.type == 11)
                    typeStr = `<div class="meeting_type_work_manager" id="11">办公</div>`
                if (index.type == 12)
                    typeStr = `<div class="meeting_type_relax_manager" id="12">康乐</div>`
                if (index.tag1 == 0)
                    tagStr1 = ''
                if (index.tag1 == 1)
                    tagStr1 = ' <div class="meeting_sort_manager hurry_manager" id="1">加急</div>'
                if (index.tag1 == 2)
                    tagStr1 = '<div class="meeting_sort_manager competition_manager" id="2">比赛</div>'
                if (index.tag1 == 3)
                    tagStr1 = '<div class="meeting_sort_manager outsourcing_manager" id="3">外包</div>'
                if (index.tag1 == 4)
                    tagStr1 = '<div class="meeting_sort_manager organize_manager" id="4">组会</div>'
                if (index.tag1 == 5)
                    tagStr1 = '<div class="meeting_sort_manager general_meeting_manager" id="5">全会</div>'
                if (index.tag2 == 0)
                    tagStr2 = ''
                if (index.tag2 == 1)
                    tagStr2 = ' <div class="meeting_sort_manager hurry_manager" id="1">加急</div>'
                if (index.tag2 == 2)
                    tagStr2 = '<div class="meeting_sort_manager competition_manager" id="2">比赛</div>'
                if (index.tag2 == 3)
                    tagStr2 = '<div class="meeting_sort_manager outsourcing_manager" id="3">外包</div>'
                if (index.tag2 == 4)
                    tagStr2 = '<div class="meeting_sort_manager organize_manager" id="4">组会</div>'
                if (index.tag2 == 5)
                    tagStr2 = '<div class="meeting_sort_manager general_meeting_manager" id="5">全会</div>'
                if (index.tag3 == 0)
                    tagStr3 = ''
                if (index.tag3 == 1)
                    tagStr3 = ' <div class="meeting_sort_manager hurry_manager" id="1">加急</div>'
                if (index.tag3 == 2)
                    tagStr3 = '<div class="meeting_sort_manager competition_manager" id="2">比赛</div>'
                if (index.tag3 == 3)
                    tagStr3 = '<div class="meeting_sort_manager outsourcing_manager" id="3">外包</div>'
                if (index.tag3 == 4)
                    tagStr3 = '<div class="meeting_sort_manager organize_manager" id="4">组会</div>'
                if (index.tag3 == 5)
                    tagStr3 = '<div class="meeting_sort_manager general_meeting_manager" id="5">全会</div>'

                return `<li id=${index.id} class='meeting_li'>
        <div class="All_meeting_content id=${index.id}">
            <div class="All_meeting_img" id=${index.id}><img src="../api_server/attachment/${index.photo}"></div>
                <div class="All_meeting_introduce" title="${index.title} (by:${index.user_name})">${index.title} (by:${index.user_name})
                            </div>
            </div>
            <div class="meeting_time" id=${index.id}>${index.time}</div>
        <div class="meeting_tag_manager" id=${index.id}>
            ${typeStr}
         ${tagStr1}
         ${tagStr2}
         ${tagStr3}
        </div>
        <div class="audit">
            <div class="agree">
                <span class="agree1 iconfont" id=${index.id}>&#xe77d;
                                </span>
            </div>
            <div class="reject">
                <span class="reject0 iconfont"  id=${index.id}>&#xe783;
                                </span>
            </div>
        </div>
    </li>`
            })
            page_control = {
                current: page_control.current,
                pages: Math.ceil(meetingStr.length / 6),
            }
            if (page_control.current > page_control.pages)
                page_control.current = page_control.pages
            document.querySelector('.page').innerHTML = `第${page_control.current}页/共${page_control.pages}页`
            if (page_control.pages == 1) {
                document.querySelector('.All_meeting_middle').innerHTML = meetingStr.join('')

            }
            if (page_control.current != page_control.pages) {
                Now_meetingStr = meetingStr[6 * (page_control.current - 1)] + meetingStr[6 * (page_control.current - 1) + 1] + meetingStr[6 * (page_control.current - 1) + 2] + meetingStr[6 * (page_control.current - 1) + 3] + meetingStr[6 * (page_control.current - 1) + 4] + meetingStr[6 * (page_control.current - 1) + 5]
                document.querySelector('.All_meeting_middle').innerHTML = Now_meetingStr
            }
            if (page_control.current == page_control.pages && page_control.pages != 1) {
                let currentStr = ''
                for (let i = 0; i < meetingStr.length - 6 * (page_control.current - 1); i++) {
                    currentStr += meetingStr[(page_control.current - 1) * 6 + i]
                }
                Now_meetingStr = currentStr
                document.querySelector('.All_meeting_middle').innerHTML = Now_meetingStr
            }
        })
        xhr.setRequestHeader('Authorization', `${localStorage.getItem('token')}`)
        xhr.setRequestHeader('Content-Type', 'application/json')
        const data = {
            id: e.target.id
        }
        const dataStr = JSON.stringify(data)
        xhr.send(dataStr)
    }
    //拒绝
    if (e.target.className == 'reject0 iconfont') {
        const response = prompt("请声明理由:")
        console.log(response)
        if (response && response != '') {
            const xhr = new XMLHttpRequest()
            xhr.open('POST', 'http://127.0.0.1:1080/my/reject_meeting')
            xhr.addEventListener('loadend', () => {
                const meeting = JSON.parse(xhr.response).date
                console.log(meeting)
                if (!meeting) {
                    document.querySelector('.All_meeting_middle').innerHTML = `<li class="no_meeting">暂无待审核会议</li>`
                    return
                }
                let typeStr, tagStr1 = '', tagStr2 = '', tagStr3 = '';
                meetingStr = meeting.map((index) => {
                    if (index.type == 11)
                        typeStr = `<div class="meeting_type_work_manager" id="11">办公</div>`
                    if (index.type == 12)
                        typeStr = `<div class="meeting_type_relax_manager" id="12">康乐</div>`
                    if (index.tag1 == 0)
                        tagStr1 = ''
                    if (index.tag1 == 1)
                        tagStr1 = ' <div class="meeting_sort_manager hurry_manager" id="1">加急</div>'
                    if (index.tag1 == 2)
                        tagStr1 = '<div class="meeting_sort_manager competition_manager" id="2">比赛</div>'
                    if (index.tag1 == 3)
                        tagStr1 = '<div class="meeting_sort_manager outsourcing_manager" id="3">外包</div>'
                    if (index.tag1 == 4)
                        tagStr1 = '<div class="meeting_sort_manager organize_manager" id="4">组会</div>'
                    if (index.tag1 == 5)
                        tagStr1 = '<div class="meeting_sort_manager general_meeting_manager" id="5">全会</div>'
                    if (index.tag2 == 0)
                        tagStr2 = ''
                    if (index.tag2 == 1)
                        tagStr2 = ' <div class="meeting_sort_manager hurry_manager" id="1">加急</div>'
                    if (index.tag2 == 2)
                        tagStr2 = '<div class="meeting_sort_manager competition_manager" id="2">比赛</div>'
                    if (index.tag2 == 3)
                        tagStr2 = '<div class="meeting_sort_manager outsourcing_manager" id="3">外包</div>'
                    if (index.tag2 == 4)
                        tagStr2 = '<div class="meeting_sort_manager organize_manager" id="4">组会</div>'
                    if (index.tag2 == 5)
                        tagStr2 = '<div class="meeting_sort_manager general_meeting_manager" id="5">全会</div>'
                    if (index.tag3 == 0)
                        tagStr3 = ''
                    if (index.tag3 == 1)
                        tagStr3 = ' <div class="meeting_sort_manager hurry_manager" id="1">加急</div>'
                    if (index.tag3 == 2)
                        tagStr3 = '<div class="meeting_sort_manager competition_manager" id="2">比赛</div>'
                    if (index.tag3 == 3)
                        tagStr3 = '<div class="meeting_sort_manager outsourcing_manager" id="3">外包</div>'
                    if (index.tag3 == 4)
                        tagStr3 = '<div class="meeting_sort_manager organize_manager" id="4">组会</div>'
                    if (index.tag3 == 5)
                        tagStr3 = '<div class="meeting_sort_manager general_meeting_manager" id="5">全会</div>'

                    return `<li id=${index.id} class='meeting_li'>
        <div class="All_meeting_content" id=${index.id}>
            <div class="All_meeting_img" id=${index.id}><img src="../api_server/attachment/${index.photo}"></div>
                <div class="All_meeting_introduce" title="${index.title} (by:${index.user_name})">${index.content} (by:${index.user_name})
                            </div>
            </div>
            <div class="meeting_time" id=${index.id}>${index.time}</div>
        <div class="meeting_tag_manager" id=${index.id}>
            ${typeStr}
         ${tagStr1}
         ${tagStr2}
         ${tagStr3}
        </div>
        <div class="audit">
            <div class="agree">
                <span class="agree1 iconfont" id=${index.id}>&#xe77d;
                                </span>
            </div>
            <div class="reject">
                <span class="reject0 iconfont"  id=${index.id}>&#xe783;
                                </span>
            </div>
        </div>
    </li>`
                })
                page_control = {
                    current: page_control.current,
                    pages: Math.ceil(meetingStr.length / 6),
                }
                if (page_control.current > page_control.pages)
                    page_control.current = page_control.pages
                document.querySelector('.page').innerHTML = `第${page_control.current}页/共${page_control.pages}页`
                if (page_control.pages == 1) {
                    document.querySelector('.All_meeting_middle').innerHTML = meetingStr.join('')

                }
                if (page_control.current != page_control.pages) {
                    Now_meetingStr = meetingStr[6 * (page_control.current - 1)] + meetingStr[6 * (page_control.current - 1) + 1] + meetingStr[6 * (page_control.current - 1) + 2] + meetingStr[6 * (page_control.current - 1) + 3] + meetingStr[6 * (page_control.current - 1) + 4] + meetingStr[6 * (page_control.current - 1) + 5]
                    document.querySelector('.All_meeting_middle').innerHTML = Now_meetingStr
                }
                if (page_control.current == page_control.pages && page_control.pages != 1) {
                    let currentStr = ''
                    for (let i = 0; i < meetingStr.length - 6 * (page_control.current - 1); i++) {
                        currentStr += meetingStr[(page_control.current - 1) * 6 + i]
                    }
                    Now_meetingStr = currentStr
                    document.querySelector('.All_meeting_middle').innerHTML = Now_meetingStr
                }
            })
            xhr.setRequestHeader('Authorization', `${localStorage.getItem('token')}`)
            xhr.setRequestHeader('Content-Type', 'application/json')
            const data = {
                id: e.target.id,
                response
            }
            const dataStr = JSON.stringify(data)
            xhr.send(dataStr)
        }
        else
            alert("理由不能为空")
    }
})

document.querySelector('.return').addEventListener('click', (e) => {
    location.href = '../templates/index.html'
})

//我的纪要读取
document.querySelector('.my_meeting').addEventListener('click', (e) => {
    let a = e.target.className
    save_writing()
    if (!a.includes('user_information_change_title_left_header_choose')) {
        document.querySelector(`.user_information_change_title_left_header_choose`).classList.remove('user_information_change_title_left_header_choose')
        document.querySelector('.my_meeting').classList.add('user_information_change_title_left_header_choose')
        document.querySelector(`.show`).classList.remove('show')
        document.querySelector(`.my_meeting_right`).classList.add('show')
        const xhr = new XMLHttpRequest()
        xhr.open('POST', 'http://127.0.0.1:1080/my/get_all_my_meeting')
        xhr.addEventListener('loadend', () => {
            if (JSON.parse(xhr.response).status == 0) {
                const meeting = JSON.parse(xhr.response).date
                console.log(meeting)
                let typeStr, tagStr1 = '', tagStr2 = '', tagStr3 = '', auditStr = ''
                meetingStr1 = meeting.map((index) => {
                    if (index.type == 11)
                        typeStr = `<div class="meeting_type_work_manager" id="11">办公</div>`
                    if (index.type == 12)
                        typeStr = `<div class="meeting_type_relax_manager" id="12">康乐</div>`
                    if (index.tag1 == 0)
                        tagStr1 = ''
                    if (index.tag1 == 1)
                        tagStr1 = ' <div class="meeting_sort_manager hurry_manager" id="1">加急</div>'
                    if (index.tag1 == 2)
                        tagStr1 = '<div class="meeting_sort_manager competition_manager" id="2">比赛</div>'
                    if (index.tag1 == 3)
                        tagStr1 = '<div class="meeting_sort_manager outsourcing_manager" id="3">外包</div>'
                    if (index.tag1 == 4)
                        tagStr1 = '<div class="meeting_sort_manager organize_manager" id="4">组会</div>'
                    if (index.tag1 == 5)
                        tagStr1 = '<div class="meeting_sort_manager general_meeting_manager" id="5">全会</div>'
                    if (index.tag2 == 0)
                        tagStr2 = ''
                    if (index.tag2 == 1)
                        tagStr2 = ' <div class="meeting_sort_manager hurry_manager" id="1">加急</div>'
                    if (index.tag2 == 2)
                        tagStr2 = '<div class="meeting_sort_manager competition_manager" id="2">比赛</div>'
                    if (index.tag2 == 3)
                        tagStr2 = '<div class="meeting_sort_manager outsourcing_manager" id="3">外包</div>'
                    if (index.tag2 == 4)
                        tagStr2 = '<div class="meeting_sort_manager organize_manager" id="4">组会</div>'
                    if (index.tag2 == 5)
                        tagStr2 = '<div class="meeting_sort_manager general_meeting_manager" id="5">全会</div>'
                    if (index.tag3 == 0)
                        tagStr3 = ''
                    if (index.tag3 == 1)
                        tagStr3 = ' <div class="meeting_sort_manager hurry_manager" id="1">加急</div>'
                    if (index.tag3 == 2)
                        tagStr3 = '<div class="meeting_sort_manager competition_manager" id="2">比赛</div>'
                    if (index.tag3 == 3)
                        tagStr3 = '<div class="meeting_sort_manager outsourcing_manager" id="3">外包</div>'
                    if (index.tag3 == 4)
                        tagStr3 = '<div class="meeting_sort_manager organize_manager" id="4">组会</div>'
                    if (index.tag3 == 5)
                        tagStr3 = '<div class="meeting_sort_manager general_meeting_manager" id="5">全会</div>'
                    if (index.status == 1)
                        auditStr = `<div class="agree">
                        <span class="agree1 iconfont" id=${index.id}>&#xe784;
                                </span>
                    </div>`
                    if (index.status == -1)
                        auditStr = `<div class="reject" >
                        <span class="reject0 iconfont" id=${index.id}>&#xe780;

                                </span>
                    </div>`
                    if (index.status == 0)
                        auditStr = `<div class="wait">
                       <a href='#'><span class="wait2 iconfont" id=${index.id}>&#xe783;
                                </span></a>
                    </div>`

                    if (index.status != -1)
                        return `<li class="status${index.status} meeting_li" id=${index.id}>
            <div class="All_meeting_content" id=${index.id}">
                <div class="All_meeting_img" id=${index.id}><img src="../api_server/attachment/${index.photo}"></div>
                    <div class="All_meeting_introduce" title="${index.title} (by:${index.user_name})">${index.title} (by:${index.user_name})
                                </div>
                </div>
                <div class="meeting_time id=${index.id}">${index.time}</div>
            <div class="meeting_tag_manager id=${index.id}">
                ${typeStr}
             ${tagStr1}
             ${tagStr2}
             ${tagStr3}
            </div>
            <div class="audit audit_my">
               ${auditStr}
            </div>
        </li>`
                    else
                        return `<li class="status${index.status} meeting_li" id=${index.id} title="理由:${index.response}">
            <div class="All_meeting_content" id=${index.id}">
                <div class="All_meeting_img" id=${index.id}><img src="../api_server/attachment/${index.photo}"></div>
                    <div class="All_meeting_introduce" title="${index.title} (by:${index.user_name})">${index.title} (by:${index.user_name})
                                </div>
                </div>
                <div class="meeting_time id=${index.id}">${index.time}</div>
            <div class="meeting_tag_manager id=${index.id}">
                ${typeStr}
             ${tagStr1}
             ${tagStr2}
             ${tagStr3}
            </div>
            <div class="audit audit_my">
               ${auditStr}
            </div>
        </li>`
                })
                page_control1 = {
                    current: 1,
                    pages: Math.ceil(meetingStr1.length / 6),
                }
                document.querySelector('.page_my').innerHTML = `第${page_control1.current}页/共${page_control1.pages}页`
                if (page_control1.pages == 1)
                    document.querySelector('.All_meeting_middle_my').innerHTML = meetingStr1.join('')
                else {
                    Now_meetingStr1 = meetingStr1[0] + meetingStr1[1] + meetingStr1[2] + meetingStr1[3] + meetingStr1[4] + meetingStr1[5]
                    document.querySelector('.All_meeting_middle_my').innerHTML = Now_meetingStr1
                }
            }
        })
        xhr.setRequestHeader('Authorization', `${localStorage.getItem('token')}`)
        xhr.setRequestHeader('Content-Type', 'application/json')
        const data = ({
            user_name: localStorage.getItem('user_name')
        })
        const dataStr = JSON.stringify(data)
        xhr.send(dataStr)
    }
})

//左按钮
document.querySelector('.page_control_left_my').addEventListener('click', (e) => {
    if (page_control1.current >= 2) {
        page_control1.current = page_control1.current - 1
        Now_meetingStr1 = meetingStr1[6 * (page_control1.current - 1)] + meetingStr1[6 * (page_control1.current - 1) + 1] + meetingStr1[6 * (page_control1.current - 1) + 2] + meetingStr1[6 * (page_control1.current - 1) + 3] + meetingStr1[6 * (page_control1.current - 1) + 4] + meetingStr1[6 * (page_control1.current - 1) + 5]
        document.querySelector('.All_meeting_middle_my').innerHTML = Now_meetingStr1
        document.querySelector('.page_my').innerHTML = `第${page_control1.current}页/共${page_control1.pages}页`
    }
})
// 左按钮

// 右按钮
document.querySelector('.page_control_right_my').addEventListener('click', (e) => {
    if (page_control1.current == page_control1.pages - 1) {
        page_control1.current = page_control1.current + 1
        let currentStr = ''
        for (let i = 0; i < meetingStr1.length - 6 * (page_control1.current - 1); i++) {

            currentStr += meetingStr1[(page_control1.current - 1) * 6 + i]
        }
        Now_meetingStr1 = currentStr
        document.querySelector('.All_meeting_middle_my').innerHTML = Now_meetingStr1
        document.querySelector('.page_my').innerHTML = `第${page_control1.current}页/共${page_control1.pages}页`
    }
    if (page_control1.current < page_control1.pages - 1) {
        page_control1.current = page_control1.current + 1
        Now_meetingStr1 = meetingStr1[6 * (page_control1.current - 1)] + meetingStr1[6 * (page_control1.current - 1) + 1] + meetingStr1[6 * (page_control1.current - 1) + 2] + meetingStr1[6 * (page_control1.current - 1) + 3] + meetingStr1[6 * (page_control1.current - 1) + 4] + meetingStr1[6 * (page_control1.current - 1) + 5]
        document.querySelector('.All_meeting_middle_my').innerHTML = Now_meetingStr1
        document.querySelector('.page_my').innerHTML = `第${page_control1.current}页/共${page_control1.pages}页`
    }
})
// 右按钮

//点击会议
document.querySelector('.All_meeting_middle').addEventListener('click', (e) => {
    let target = e.target
    console.log(e.target)
    if (e.target.classList != 'audit' && e.target.classList != 'agree' && e.target.classList != 'reject' && e.target.classList != 'agree1 iconfont' && e.target.classList != 'reject0 iconfont') {
        while (target.tagName != 'LI' && target.parentNode) {
            target = target.parentNode
        }
        console.log(target)
        console.log(target.id)
        localStorage.setItem('meeting_id', target.id)
        if (target.id) {
            console.log(location.href)
            localStorage.setItem('location', location.href)
            window.open('http://127.0.0.1:5500/templates/meeting.html')
        }
    }
})

document.querySelector('.All_meeting_middle_my').addEventListener('click', (e) => {
    let target = e.target
    console.log(e.target)
    if (e.target.classList != 'audit' && e.target.classList != 'agree' && e.target.classList != 'reject' && e.target.classList != 'agree1 iconfont' && e.target.classList != 'reject0 iconfont') {
        while (target.tagName != 'LI' && target.parentNode) {
            target = target.parentNode
        }
        console.log(target)
        console.log(target.id)
        localStorage.setItem('meeting_id', target.id)
        if (target.id) {
            console.log(location.href)
            localStorage.setItem('location', location.href)
            window.open('http://127.0.0.1:5500/templates/meeting.html')
        }
    }
})
//点击会议
let input_question = ''

//检查字数
document.querySelector('.input_textarea').addEventListener('input', (e) => {
    textarea = document.querySelector('.input_textarea')
    input_question = textarea.value.replace(/[\r\n]/g, "");
    console.log(input_question)
    document.querySelector('.count_word').innerHTML = `${input_question.length}/600字`
    if (input_question.length >= 600)
        document.querySelector('.count_word').style.color = `red`
    else
        document.querySelector('.count_word').style.color = `black`
})

document.querySelector('.sendQuestion').addEventListener('click', (e) => {
    if (input_question.length <= 5) {
        alert('字数太少!请继续输入!')
        return
    }
    if (input_question.length > 600)
        alert('字数太多!请减少字数!')
    else {
        const xhr4 = new XMLHttpRequest()
        xhr4.open('POST', 'http://127.0.0.1:1080/my/send_question')
        xhr4.addEventListener('loadend', () => {
            console.log(xhr4.response)
            alert(JSON.parse(xhr4.response).message)
            location.reload()
        })
        xhr4.setRequestHeader('Authorization', `${localStorage.getItem('token')}`)
        xhr4.setRequestHeader('Content-Type', 'application/json')
        const send = {
            username: localStorage.getItem('user_name'),
            question: input_question
        }
        const sendStr = JSON.stringify(send)
        xhr4.send(sendStr)
    }
})

//渲染历史疑问
let pass_questionStr0, page_control_pass
document.querySelector('.question_answer_left').addEventListener('click', (e) => {
    let a = e.target.className

    if (!a.includes('user_information_change_title_left_header_choose')) {
        let xhr_pass_question = new XMLHttpRequest()
        xhr_pass_question.open('POST', 'http://127.0.0.1:1080/my/pass_question')
        xhr_pass_question.addEventListener('loadend', () => {
            let xhr_pass_question_response = (JSON.parse(xhr_pass_question.response)).data
            console.log(xhr_pass_question_response)
            if (xhr_pass_question_response) {
                pass_questionStr0 = xhr_pass_question_response.map((index) => {
                    if (index.status)
                        return ` <li>
                        <div class="question">Q:${index.question}</div>
                        <div class="answer">A(${index.managername})：${index.answer}</div>
                    </li>`
                    else
                        return ` <li>
                        <div class="question">Q:${index.question}</div>
                        <div class="answer">A：等待回答中...</div>
                    </li>`
                })
                page_control_pass = {
                    current: 1,
                    pages: Math.ceil(pass_questionStr0.length / 2),
                }
                console.log(page_control_pass)
                if (pass_questionStr0)
                    page_control_pass = {
                        current: 1,
                        pages: Math.ceil(pass_questionStr0.length / 2),
                    }
                if (pass_questionStr0) {
                    if (pass_questionStr0.length <= 2) {
                        document.querySelector('.pass_QS_ul').innerHTML = pass_questionStr0.join('')
                        document.querySelector('.page_my_past').innerHTML = `第${page_control_pass.current}页/共${page_control_pass.pages}页`
                    }
                    else {
                        document.querySelector('.pass_QS_ul').innerHTML = pass_questionStr0[0] + pass_questionStr0[1]
                        document.querySelector('.page_my_past').innerHTML = `第${page_control_pass.current}页/共${page_control_pass.pages}页`
                    }
                }
                else {
                    document.querySelector('.pass_QS').innerHTML = '暂无历史疑问'
                }
            }
        })
        xhr_pass_question.setRequestHeader('Authorization', `${localStorage.getItem('token')}`)
        xhr_pass_question.setRequestHeader('Content-Type', 'application/json')
        let send_pass_question = ({
            username: localStorage.getItem('user_name')
        })
        let send_pass_questionStr = JSON.stringify(send_pass_question)
        xhr_pass_question.send(send_pass_questionStr)

        document.querySelector(`.user_information_change_title_left_header_choose`).classList.remove('user_information_change_title_left_header_choose')
        document.querySelector('.question_answer_left').classList.add('user_information_change_title_left_header_choose')
        document.querySelector(`.show`).classList.remove('show')
        document.querySelector(`.question_right`).classList.add('show')
        save_writing()
    }
})


//左按钮
document.querySelector('.page_control_left_my_pass').addEventListener('click', (e) => {
    if (page_control_pass.current >= 2) {
        page_control_pass.current = page_control_pass.current - 1
        let Now_meetingStr_pass = pass_questionStr0[2 * (page_control_pass.current - 1)] + pass_questionStr0[2 * (page_control_pass.current - 1) + 1]
        document.querySelector('.pass_QS_ul').innerHTML = Now_meetingStr_pass
        document.querySelector('.page_my_past').innerHTML = `第${page_control_pass.current}页/共${page_control_pass.pages}页`
    }
})
// 左按钮

// 右按钮
document.querySelector('.page_control_right_my_past').addEventListener('click', (e) => {
    if (page_control_pass.current == page_control_pass.pages - 1) {
        page_control_pass.current = page_control_pass.current + 1
        let currentStr = ''
        for (let i = 0; i < pass_questionStr0.length - 2 * (page_control_pass.current - 1); i++) {
            currentStr += pass_questionStr0[(page_control_pass.current - 1) * 2 + i]
        }
        let Now_meetingStr_pass = currentStr
        document.querySelector('.pass_QS_ul').innerHTML = Now_meetingStr_pass
        document.querySelector('.page_my_past').innerHTML = `第${page_control_pass.current}页/共${page_control_pass.pages}页`
    }
    if (page_control_pass.current < page_control_pass.pages - 1) {
        page_control_pass.current = page_control_pass.current + 1
        let Now_meetingStr_pass = pass_questionStr0[2 * (page_control_pass.current - 1)] + pass_questionStr0[2 * (page_control_pass.current - 1) + 1]
        document.querySelector('.pass_QS_ul').innerHTML = Now_meetingStr_pass
        document.querySelector('.page_my_past').innerHTML = `第${page_control_pass.current}页/共${page_control_pass.pages}页`
    }
})




let pass_questionStr_answer, page_control_pass_answer
function a1() {
    let xhr_pass_question = new XMLHttpRequest()
    xhr_pass_question.open('GET', 'http://127.0.0.1:1080/my/manager_get_question')
    xhr_pass_question.addEventListener('loadend', () => {
        let xhr_pass_question_response = (JSON.parse(xhr_pass_question.response)).data
        console.log(xhr_pass_question_response)
        if (xhr_pass_question_response) {
            pass_questionStr_answer = xhr_pass_question_response.map((index) => {
                return ` <li>
                        <div class="question_manager">
                            <span class="question_manager_text">
                                Q(${index.username}):${index.question}</span>
                        </div>
                        <div class="answer_manager" id="${index.id}"><span class="answer_manager_text">A：等待回答中...</span>
                            <button class="send_answer" id="${index.id}">回复</button>
                        </div>
                    </li>`
            })
            page_control_pass_answer = {
                current: 1,
                pages: Math.ceil(pass_questionStr_answer.length / 4),
            }
            console.log(page_control_pass_answer)
            console.log(`!!!` + pass_questionStr_answer)
        }
    })
    xhr_pass_question.setRequestHeader('Authorization', `${localStorage.getItem('token')}`)
    xhr_pass_question.send()
}
a1()
// 发送回复
document.querySelector('.Answer_now').addEventListener('click', (e) => {
    if (e.target.classList == 'send_answer') {
        console.log(e.target.id)
        let answer = ''
        answer = prompt("请输入回复内容")
        if (answer != '' && answer != null) {
            const xhr5 = new XMLHttpRequest()
            xhr5.open('POST', "http://127.0.0.1:1080/my/send_answer")
            xhr5.addEventListener('loadend', () => {
                console.log(xhr5.response)
                alert(JSON.parse(xhr5.response).message)
                let xhr_pass_question = new XMLHttpRequest()
                xhr_pass_question.open('GET', 'http://127.0.0.1:1080/my/manager_get_question')
                xhr_pass_question.addEventListener('loadend', () => {
                    let xhr_pass_question_response = (JSON.parse(xhr_pass_question.response)).data
                    console.log(xhr_pass_question_response)
                    if (xhr_pass_question_response.length != 0) {
                        pass_questionStr_answer = xhr_pass_question_response.map((index) => {
                            return ` <li>
                        <div class="question_manager">
                            <span class="question_manager_text">
                                Q(${index.username}):${index.question}</span>
                        </div>
                        <div class="answer_manager" id="${index.id}"><span class="answer_manager_text">A：等待回答中...</span>
                            <button class="send_answer" id="${index.id}">回复</button>
                        </div>
                    </li>`
                        })
                        page_control_pass_answer = {
                            current: 1,
                            pages: Math.ceil(pass_questionStr_answer.length / 4),
                        }
                        console.log(page_control_pass_answer)
                        if (pass_questionStr_answer.length != 0) {
                            if (pass_questionStr_answer.length <= 4) {
                                document.querySelector('.Answer_now').innerHTML = pass_questionStr_answer.join('')
                                document.querySelector('.page_my_past_answer').innerHTML = `第${page_control_pass_answer.current}页/共${page_control_pass_answer.pages}页`
                            }
                            else {
                                document.querySelector('.Answer_now').innerHTML = pass_questionStr_answer[0] + pass_questionStr_answer[1] + pass_questionStr_answer[2] + pass_questionStr_answer[3]
                                document.querySelector('.page_my_past_answer').innerHTML = `第${page_control_pass_answer.current}页/共${page_control_pass_answer.pages}页`
                            }
                        }
                    }
                    else {
                        pass_questionStr_answer = []
                        document.querySelector('.Answer_now').innerHTML = '暂无疑问'

                    }
                })
                xhr_pass_question.setRequestHeader('Authorization', `${localStorage.getItem('token')}`)
                xhr_pass_question.send()
                console.log(pass_questionStr_answer)
                console.log(page_control_pass_answer)
            })
            xhr5.setRequestHeader('Authorization', `${localStorage.getItem('token')}`)
            xhr5.setRequestHeader('Content-Type', 'application/json')
            const send = {
                id: e.target.id,
                managername: localStorage.getItem('user_name'),
                answer: answer
            }
            const sendStr = JSON.stringify(send)
            xhr5.send(sendStr)
        }
        else {
            if (answer == '')
                alert("回复不能为空")
        }
    }
})
document.querySelector('.manager_answer_left').addEventListener('click', (e) => {
    let a = e.target.className
    if (!a.includes('user_information_change_title_left_header_choose')) {
        if (pass_questionStr_answer) {
            page_control_pass_answer = {
                current: 1,
                pages: Math.ceil(pass_questionStr_answer.length / 4),
            }
            if (pass_questionStr_answer.length != 0) {
                if (pass_questionStr_answer.length <= 4) {
                    document.querySelector('.Answer_now').innerHTML = pass_questionStr_answer.join('')
                    document.querySelector('.page_my_past_answer').innerHTML = `第${page_control_pass_answer.current}页/共${page_control_pass_answer.pages}页`
                }
                else {
                    document.querySelector('.Answer_now').innerHTML = pass_questionStr_answer[0] + pass_questionStr_answer[1] + pass_questionStr_answer[2] + pass_questionStr_answer[3]
                    document.querySelector('.page_my_past_answer').innerHTML = `第${page_control_pass_answer.current}页/共${page_control_pass_answer.pages}页`
                }
            }
        }
        else {
            document.querySelector('.Answer_now').innerHTML = '暂无疑问'
        }
    }
    document.querySelector(`.user_information_change_title_left_header_choose`).classList.remove('user_information_change_title_left_header_choose')
    document.querySelector('.manager_answer_left').classList.add('user_information_change_title_left_header_choose')
    document.querySelector(`.show`).classList.remove('show')
    document.querySelector(`.Answer_right`).classList.add('show')
    save_writing()
})
//左按钮
document.querySelector('.page_control_left_my_pass_answer').addEventListener('click', (e) => {
    if (page_control_pass_answer.current >= 2) {
        page_control_pass_answer.current = page_control_pass_answer.current - 1
        let Now_meetingStr_pass = pass_questionStr_answer[4 * (page_control_pass_answer.current - 1)] + pass_questionStr_answer[4 * (page_control_pass_answer.current - 1) + 1] + pass_questionStr_answer[4 * (page_control_pass_answer.current - 1) + 2] + pass_questionStr_answer[4 * (page_control_pass_answer.current - 1) + 3]
        document.querySelector('.Answer_now').innerHTML = Now_meetingStr_pass
        document.querySelector('.page_my_past_answer').innerHTML = `第${page_control_pass_answer.current}页/共${page_control_pass_answer.pages}页`
    }
})
// 左按钮

// 右按钮
document.querySelector('.page_control_right_my_past_answer').addEventListener('click', (e) => {
    if (page_control_pass_answer.current == page_control_pass_answer.pages - 1) {
        page_control_pass_answer.current = page_control_pass_answer.current + 1
        let currentStr = ''
        for (let i = 0; i < pass_questionStr_answer.length - 4 * (page_control_pass_answer.current - 1); i++) {
            currentStr += pass_questionStr_answer[(page_control_pass_answer.current - 1) * 4 + i]
        }
        let Now_meetingStr_pass = currentStr
        document.querySelector('.Answer_now').innerHTML = Now_meetingStr_pass
        document.querySelector('.page_my_past_answer').innerHTML = `第${page_control_pass_answer.current}页/共${page_control_pass_answer.pages}页`
    }
    if (page_control_pass_answer.current < page_control_pass_answer.pages - 1) {
        page_control_pass_answer.current = page_control_pass_answer.current + 1
        let Now_meetingStr_pass = pass_questionStr_answer[4 * (page_control_pass_answer.current - 1)] + pass_questionStr_answer[4 * (page_control_pass_answer.current - 1) + 1] + pass_questionStr_answer[4 * (page_control_pass_answer.current - 1) + 2] + pass_questionStr_answer[4 * (page_control_pass_answer.current - 1) + 3]
        document.querySelector('.Answer_now').innerHTML = Now_meetingStr_pass
        document.querySelector('.page_my_past_answer').innerHTML = `第${page_control_pass_answer.current}页/共${page_control_pass_answer.pages}页`
    }
})

let time, save_data = {
    title: '',
    content: '',
    type: 0,
    tag: []
}
save_data.tag[0] = 0, save_data.tag[1] = 0, save_data.tag[2] = 0
function save_writing() {
    a = document.querySelector('.user_information_change_title_left_header_choose').className
    if (a.includes('submit_meeting')) {
        time = setInterval(() => {
            a = document.querySelector('.user_information_change_title_left_header_choose').className
            save_data.title = document.querySelector('.meeting_title').value
            save_data.content = document.querySelector('.meeting_content_textarea').value
            if (document.querySelector('.meeting_type_choose'))
                save_data.type = document.querySelector('.meeting_type_choose').id
            if (document.querySelectorAll('.meeting_tag_choose')) {

                let i = 1, meeting_tag_chooseAll = document.querySelectorAll('.meeting_tag_choose')
                for (i = 1; i <= 3; i++)
                    save_data.tag[i - 1] = 0
                for (i = 1; i <= meeting_tag_chooseAll.length; i++)
                    save_data.tag[i - 1] = meeting_tag_chooseAll[i - 1].id
            }
            else {
                for (i; i <= 3; i++)
                    save_data.tag[i - 1] = 0
            }
            console.log(`yes`)
            save_data.saverName = localStorage.getItem('user_name')
            let dataStr = JSON.stringify(save_data)
            localStorage.setItem(`${localStorage.getItem('user_name')}`, dataStr)
        }, 4000)
    }
    else {
        clearInterval(time)
        console.log(`no`)
    }
}

