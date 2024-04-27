// const { result } = require("lodash")
// const express = require('express')
// axios({
//     url: `http://127.0.0.1:1080/my/check`,
//     method: 'POST',
//     headers: {
//         Authorization: `${localStorage.getItem('token')}`,
//         'Content-Type': 'application/x-www-form-urlencoded'
//     },
//     userStr00
// }).then((result) => {
//     console.log(result)
// if (result.data.status == 1) {
//     alert('当前未登录或登录已过期')
//     location.href = `../templates/login.html`
//     }
// })
let Now_meetingStr, page_control, meetingStr, meeting, originMeeting
const xhr = new XMLHttpRequest()
localStorage.setItem('location', location.href)
//获得用户信息
xhr.open('POST', 'http://127.0.0.1:1080/my/getinformation')
xhr.addEventListener('loadend', () => {
    const response = JSON.parse(xhr.response)
    if (response && response.status == 1) {
        alert('当前未登录或登录已过期')
        location.href = `../templates/login.html`
    }
    console.log(response)
    document.querySelector('.li_username').innerHTML = `姓名:${response.date.username}`
    document.querySelector('.li_group').innerHTML = `组别:${response.date.group}`
    document.querySelector('.li_age').innerHTML = `年纪:${response.date.age}`
    localStorage.setItem('manager', response.date.manager)
    if (response.date.gender == 'man')
        document.querySelector('.li_gender').innerHTML = `性别:男`
    else
        document.querySelector('.li_gender').innerHTML = `性别:女`
    if (response.date.image != null) {
        document.querySelector('.user_image').setAttribute("data-src", `../api_server/attachment/${response.date.image}`)
        document.querySelector('.user_image').src = `../api_server/attachment/${response.date.image}`
    }
})
xhr.setRequestHeader('Authorization', `${localStorage.getItem('token')}`)
xhr.setRequestHeader('Content-Type', 'application/json')
const user = { username: `${localStorage.getItem('user_name')}` }
const userStr = JSON.stringify(user)
xhr.send(userStr);




const xhr1 = new XMLHttpRequest()
xhr1.open('GET', 'http://127.0.0.1:1080/my/get_all_1_meeting')
xhr1.addEventListener('loadend', () => {
    if (JSON.parse(xhr1.response).status == 0) {
        meeting = JSON.parse(xhr1.response).date
        originMeeting = meeting
        console.log(meeting)
        search_get()
        carousel_right_img = document.querySelectorAll('.carousel_right_img')
        for (let x = 0; x < 6; x++) {
            if (x >= meeting.length)
                break

            carousel_right_img[x].setAttribute('data-src', `../api_server/attachment/${originMeeting[x].photo}`)
            carousel_right_img[x].src = `../api_server/attachment/${originMeeting[x].photo}`
        }



    }
})




xhr1.setRequestHeader('Authorization', `${localStorage.getItem('token')}`)
xhr1.send()

document.querySelector('.submit_meeting').addEventListener('click', (e) => {
    location.href = `../templates/submit.html`
})


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


//点击会议
document.querySelector('.All_meeting_middle').addEventListener('click', (e) => {
    let a = e.target.className
    if (!a.includes('will_download')) {
        if (e.target.classList != 'like iconfont' && e.target.classList != 'commit iconfont' && e.target.classList != 'like_num' && e.target.classList != 'commit_num') {
            let target = e.target
            while (target.tagName != 'LI' && target.parentNode) {
                console.log(1)
                target = target.parentNode
            }
            console.log(target)
            localStorage.setItem('meeting_id', target.id)
            if (target.id)
                location.href = 'http://127.0.0.1:5500/templates/meeting.html'
        }
    }
    else {
        e.target.classList.toggle('will_download_select')

    }
})
//点击会议



//轮播图
let rotateTimes = 0, time = null, count = 0, time0 = null
const carousel = document.querySelector('.carousel')
//点击选择
document.querySelector('.change_image_left').addEventListener('click', (e) => {
    click_router(0.02)
})
document.querySelector('.change_image_right').addEventListener('click', (e) => {
    click_router(-0.02)
})
//非点击旋转
no_click_router(3000)


document.querySelector('.change_image_left').addEventListener('mouseenter', (e) => {
    clearInterval(time0)
    time0 = null
})
document.querySelector('.change_image_left').addEventListener('mouseleave', (e) => {
    no_click_router(3000)

})
document.querySelector('.change_image_right').addEventListener('mouseenter', (e) => {
    clearInterval(time0)
    time0 = null
})
document.querySelector('.change_image_right').addEventListener('mouseleave', (e) => {
    no_click_router(3000)
})


function click_router(x) {
    if (!time) {
        time = setInterval(() => {
            carousel.style.transform = 'rotateY(' + 60 * rotateTimes + 'deg)'
            rotateTimes += x
            count += 2
            if (count >= 100) {
                clearInterval(time)
                time = null
                count = 0
            }
        }, 10);
    }
}
function no_click_router(t) {
    time0 = setInterval(() => {
        if (!time) {
            time = setInterval(() => {
                carousel.style.transform = 'rotateY(' + 60 * rotateTimes + 'deg)'
                rotateTimes -= 0.01
                count += 1
                if (count >= 100) {
                    clearInterval(time)
                    time = null
                    count = 0
                }
            }, 10);
        }
    }, t);
}


document.querySelector('.search_tag').addEventListener('click', (e) => {
    if (originMeeting) {
        let a = e.target.className
        if (e.target.tagName == 'DIV' && !a.includes('down_load')) {
            if (e.target != document.querySelector('.search_tag_div_choose')) {
                if (e.target.className != 'search_tag') {
                    if (document.querySelector('.search_tag_div_choose'))
                        document.querySelector('.search_tag_div_choose').classList.remove('search_tag_div_choose')

                    e.target.classList.add('search_tag_div_choose')
                    meeting = originMeeting
                    meeting = meeting.filter((index) => {
                        if (index.type == e.target.id || index.tag1 == e.target.id || index.tag2 == e.target.id || index.tag3 == e.target.id)
                            return index
                    })
                    search_get()
                }
            }
            else {
                document.querySelector('.search_tag_div_choose').classList.remove('search_tag_div_choose')
                meeting = originMeeting
                search_get()
            }
        }
        if (a.includes('down_load')) {
            if (e.target != document.querySelector('.search_tag_div_choose')) {
                if (document.querySelector('.search_tag_div_choose'))
                    document.querySelector('.search_tag_div_choose').classList.remove('search_tag_div_choose')
                if (e.target.className != 'search_tag')
                    e.target.classList.add('search_tag_div_choose')
                meeting = originMeeting
                search_get0()
                All_down_load_tag = document.querySelectorAll('.will_download')
                All_down_load_tag.forEach(element => {
                    element.classList.add('will_download_show')
                });
                document.querySelector('.ultag').classList.add('hidden')
                document.querySelector('.input_search_text_send').classList.add('hidden')
                document.querySelector('.click_here').style.display = 'block'

            }
            else {
                if (a.includes('down_load')) {

                    document.querySelector('.search_tag_div_choose').classList.remove('search_tag_div_choose')
                    document.querySelector('.ultag').classList.remove('hidden')
                    document.querySelector('.input_search_text_send').classList.remove('hidden')
                    All_down_load_tag = document.querySelectorAll('.will_download')
                    All_down_load_tag.forEach(element => {
                        element.classList.remove('will_download_show')
                    });
                    document.querySelector('.click_here').style.display = 'none'
                    search_get()
                }
            }


        }
    }
})
//搜索功能
document.querySelector(".input_search_text_send").addEventListener('click', (e) => {
    if (originMeeting) {
        let text = document.querySelector(".input_search_text").value
        meeting = originMeeting
        meeting = meeting.filter((index) => {
            if (index.user_name.includes(text) || index.title.includes(text))
                return index
        })
        search_get()
        if (meeting.length != originMeeting.length)
            document.querySelector('.cancel_search').classList.add('show')
    }
})
function search_get() {
    let typeStr, tagStr1 = '', tagStr2 = '', tagStr3 = '';
    if (meeting && meeting.length != 0) {
        let id = 100
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
           <div id=${index.id}>
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
           <div class="like_div">
                <span class="like iconfont">&#xe7df;</br>
               <span class="like_num">0</span>
                       </span>
                   </div>
            <div class="commit_div">
               <span class="commit iconfont">&#xe7ae;</br><span class="commit_num">0</span>
                      </span>
                   </div>
       </div>
       </div>
       <div class="will_download iconfont" id=${index.id}>&#xe77d;</div>
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
            document.querySelector('.All_meeting_middle').innerHTML = Now_meetingStr
        }
    }
    else {
        document.querySelector('.All_meeting_middle').innerHTML = '<li class="no_meeting">暂无会议纪要</li>'
        document.querySelector('.page').innerHTML = `第1页/共1页`
    }

}

document.querySelector('.cancel_search').addEventListener('click', (e) => {
    meeting = originMeeting
    search_get()
    document.querySelector('.cancel_search').classList.remove('show')
    document.querySelector('.input_search_text').value = ''
})


const socket = new WebSocket("ws://127.0.0.1:1080/api/basic")
console.log(socket)
socket.onopen = function (e) {
    console.log('连接已打开')
    console.log(socket.readyState)
    socket.send("hello word")
}
socket.onmessage = function (e) {
    console.log(`收到回复:` + e.data)
    if (e.data != 0) {
        document.querySelector('.how_much_wait').style.opacity = 1
        if (e.data <= 99)
            document.querySelector('.how_much_wait').innerHTML = e.data
        if (e.data > 99)
            document.querySelector('.how_much_wait').innerHTML = `99+`
    }
    else
        document.querySelector('.how_much_wait').style.opacity = 0
}
socket.onclose = function (e) {
    console.log(`连接已关闭`)
}

if (localStorage.getItem('manager') != 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9')
    document.querySelector('.how_much_wait').style.display = 'none'




const tableToExcel = () => {
    let data = [], x = 0
    let All = document.querySelectorAll('.will_download_select')
    for (let j = 0; j < All.length; j++) {
        for (let i = 0; i < originMeeting.length; i++) {
            if (All[j].id == originMeeting[i].id) {
                data[x++] = originMeeting[i]
                break;
            }
        }
    }
    console.log(data)
    let jsonData = [{}]
    for (let i = 0; i < data.length; i++) {
        jsonData[i] = {
            id: data[i].id,
            writername: data[i].user_name,
            title: data[i].title,
            content: data[i].content,
            text: data[i].text.replace(/[\t\r\f\n\s\,]*/g, ''),
            time: data[i].time,
        }
    }
    console.log(jsonData.text)
    let str = `号码,作者,标题,会议内容,个人纪要,时间\n`
    for (let i = 0; i < jsonData.length; i++) {
        for (const key in jsonData[i]) {
            str += `${jsonData[i][key] + '\t'},`;
        }
        str += '\n';
    }
    const uri = 'data:text/csv;charset=utf-8,\ufeff' + encodeURIComponent(str);
    const link = document.createElement("a");
    link.href = uri;
    link.download = "QG会议纪要数据表.csv";
    link.click()
}

function search_get0() {
    let typeStr, tagStr1 = '', tagStr2 = '', tagStr3 = '';
    if (meeting && meeting.length != 0) {
        let id = 100
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
           <div id=${index.id}>
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
           <div class="like_div">
                <span class="like iconfont">&#xe7df;</br>
               <span class="like_num">0</span>
                       </span>
                   </div>
            <div class="commit_div">
               <span class="commit iconfont">&#xe7ae;</br><span class="commit_num">0</span>
                      </span>
                   </div>
       </div>
       </div>
       <div class="will_download iconfont" id=${index.id}>&#xe77d;</div>
   </li>`
        })
        page_control = {
            current: 1,
            pages: 1
        }
        document.querySelector('.page').innerHTML = `第${page_control.current}页/共${page_control.pages}页`
        if (page_control.pages == 1)
            document.querySelector('.All_meeting_middle').innerHTML = meetingStr.join('')
    }
    else {
        document.querySelector('.All_meeting_middle').innerHTML = '<li class="no_meeting">暂无会议纪要</li>'
        document.querySelector('.page').innerHTML = `第1页/共1页`
    }
}

document.querySelector('.cancel_search').addEventListener('click', (e) => {
    meeting = originMeeting
    search_get()
    document.querySelector('.cancel_search').classList.remove('show')
    document.querySelector('.input_search_text').value = ''
})

//图片懒加载
const observer = new IntersectionObserver(callback);
function callback(entries) {
    for (let i of entries) {
        if (i.isIntersecting) {
            let img = i.target;
            let trueSrc = img.getAttribute("data-src");
            img.setAttribute("src", trueSrc);
            observer.unobserve(img);
        }
    }
}
let images = document.getElementsByTagName("img");
for (let i of images) {
    observer.observe(i);
}



document.querySelector('.leave').addEventListener('click', (e) => {
    location.href = 'http://127.0.0.1:5500/templates/login.html'
})