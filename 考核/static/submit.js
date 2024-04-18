
const xhr = new XMLHttpRequest()
let image_save
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
    if (response.date.group == '前端')
        document.querySelector('.front_group').selected = true
    if (response.date.group == '后台')
        document.querySelector('.backstage_group').selected = true
    if (response.date.group == '嵌入式')
        document.querySelector('.embedded_group').selected = true
    if (response.date.group == '移动')
        document.querySelector('.move_group').selected = true
    if (response.date.group == '人工智能')
        document.querySelector('.AI_group').selected = true
    if (response.date.group == '图形')
        document.querySelector('.graph_group').selected = true
    if (response.date.group == '设计')
        document.querySelector('.design_group').selected = true
    document.querySelector('.age').value = response.date.age
    console.log(response.date.image)

})
xhr.setRequestHeader('Authorization', `${localStorage.getItem('token')}`)
xhr.setRequestHeader('Content-Type', 'application/json')
const user = { username: `${localStorage.getItem('user_name')}` }
const userStr = JSON.stringify(user)
xhr.send(userStr);





//信息修改和会议上传页面的切换
document.querySelector('.user_information_change_title_left_header').addEventListener('click', (e) => {
    console.log(1)
    document.querySelector(`.user_information_change_title_left_header_choose`).classList.remove('user_information_change_title_left_header_choose')
    document.querySelector('.user_information_change_title_left_header').classList.add('user_information_change_title_left_header_choose')
    document.querySelector(`.show`).classList.remove('show')
    document.querySelector(`.change_user_information`).classList.add('show')
})
document.querySelector('.meeting_submit_title_left_header').addEventListener('click', (e) => {
    console.log(2)
    document.querySelector(`.user_information_change_title_left_header_choose`).classList.remove('user_information_change_title_left_header_choose')
    document.querySelector('.meeting_submit_title_left_header').classList.add('user_information_change_title_left_header_choose')
    document.querySelector(`.show`).classList.remove('show')
    document.querySelector(`.submit_meeting_information`).classList.add('show')
})
//图片更改事件
document.querySelector(`.change_user_information_img_file`).addEventListener('change', (e) => {
    console.log(document.querySelector('.user_image').src)
    const file = e.target.files[0]
    document.querySelector('.user_image').src = URL.createObjectURL(file)
    console.log(document.querySelector('.user_image').src)
    image_save = file
})
document.querySelector(`.submit_meeting_information_img_file`).addEventListener('change', (e) => {
    const file = e.target.files[0]
    document.querySelector('.meeting_image').src = URL.createObjectURL(file)
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
                console.log(limit.style)
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
    const xhr = new XMLHttpRequest()
    xhr.open('POST', 'http://127.0.0.1:1080/my/receptinformation')
    xhr.addEventListener('loadend', () => {
        const response = JSON.parse(xhr.response)
        console.log(response)
    })
    xhr.setRequestHeader('Authorization', `${localStorage.getItem('token')}`)
    xhr.setRequestHeader('Content-Type', 'application/json')

    date = {
        username: localStorage.getItem('user_name'),
        oldpassword: document.querySelector('.oldpassword').value,
        newpassword: document.querySelector('.newpassword').value,
        gender: document.querySelector('.gender').value,
        age: document.querySelector('.age').value,
        group: document.querySelector('.group').value
    }
    const dateStr = JSON.stringify(date)
    xhr.send(dateStr);


    // const xhr1 = new XMLHttpRequest()
    // xhr1.open('POST', 'http://127.0.0.1:1080/my/receptimage')
    // xhr1.addEventListener('loadend', () => {
    //     // const response = JSON.parse(xhr.response)
    //     console.log('!!!')
    //     console.log(xhr1.response)
    // })
    // xhr1.setRequestHeader('Authorization', `${localStorage.getItem('token')}`)
    // xhr1.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    // const fd = new FormData()
    // fd.append('image', image_save)
    // date0 = {
    //     fd
    // }
    // date1 = JSON.stringify(date0)
    // xhr1.send(fd)
    const fd = new FormData()
    fd.append('image', image_save)
    const res = axios({
        headers: {
            Authorization: localStorage.getItem('token'),
            'Content-Type': 'multipart/form-data'
        },
        url: 'http://127.0.0.1:1080/my/receptimage',
        method: 'POST',
        data: fd
    }).then(result => {
        alert(`wait`)
    })
    console.log(res)
})