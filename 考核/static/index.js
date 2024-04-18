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
const xhr = new XMLHttpRequest()
xhr.open('POST', 'http://127.0.0.1:1080/my/getinformation')
xhr.addEventListener('loadend', () => {
    const response = JSON.parse(xhr.response)
    if (response.status == 1) {
        alert('当前未登录或登录已过期')
        location.href = `../templates/login.html`
    }
    console.log(response)
    document.querySelector('.li_username').innerHTML = `姓名:${response.date.username}`
    document.querySelector('.li_group').innerHTML = `组别:${response.date.group}`
    document.querySelector('.li_age').innerHTML = `年纪:${response.date.age}`
    document.querySelector('.li_gender').innerHTML = `性别:${response.date.gender}`
})
xhr.setRequestHeader('Authorization', `${localStorage.getItem('token')}`)
xhr.setRequestHeader('Content-Type', 'application/json')
const user = { username: `${localStorage.getItem('user_name')}` }
const userStr = JSON.stringify(user)
xhr.send(userStr);



document.querySelector('.submit_meeting').addEventListener('click', (e) => {
    location.href = `../templates/submit.html`
})