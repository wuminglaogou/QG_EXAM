// const { login } = require("../api_server/router_handler/user")

const container = document.querySelector('.container')
const registration = document.querySelector('.registration')

document.querySelector('.container .submit').addEventListener('click', e => {
    e.preventDefault()
    const username = document.querySelector('.container .text').value
    const password = document.querySelector('.container .password').value
    if (username != '' && password != '') {
        const xhr = new XMLHttpRequest()
        xhr.open('POST', 'http://127.0.0.1:1080/api/login')
        xhr.addEventListener('loadend', () => {
            console.log(JSON.parse(xhr.response))
            const response = JSON.parse(xhr.response)
            if (!(JSON.parse(xhr.response).status)) {
                localStorage.setItem('token', JSON.parse(xhr.response).token)
                localStorage.setItem('user_name', username)
                setTimeout(() => {
                    location.href = '../templates/index.html'
                }, 1500);
            }
            alertFn(!(JSON.parse(xhr.response).status), 2000, 0, response)
        })
        xhr.setRequestHeader('Content-Type', 'application/json')
        const user = { "username": `${username}`, "password": `${password}` }
        const userStr = JSON.stringify(user)
        xhr.send(userStr);
        document.querySelector('.container form').reset()
    }

})


document.querySelector('.sign_up').addEventListener('click', e => {
    container.classList.add('hidden')
    registration.classList.remove('hidden')
})
document.querySelector('.return').addEventListener('click', e => {

    container.classList.remove('hidden')
    registration.classList.add('hidden')
})
document.querySelector('.registration_submit').addEventListener('click', e => {
    e.preventDefault()
    const username = document.querySelector('.registration .text').value
    const password = document.querySelector('.registration .password').value
    if (username != '' && password != '') {
        const xhr = new XMLHttpRequest()
        xhr.open('POST', 'http://127.0.0.1:1080/api/reguser')
        xhr.addEventListener('loadend', () => {
            console.log(JSON.parse(xhr.response))
            console.log(!(JSON.parse(xhr.response).status))
            const response = JSON.parse(xhr.response)
            if (!(JSON.parse(xhr.response).status)) {
                localStorage.setItem('token', JSON.parse(xhr.response).token)
                localStorage.setItem('user_name', username)
                setTimeout(() => {
                    location.href = '../templates/index.html'
                }, 1500);
            }
            alertFn(!(JSON.parse(xhr.response).status), 2000, 1, JSON.parse(xhr.response))

        })
        xhr.setRequestHeader('Content-Type', 'application/json')
        const user = { "username": `${username}`, "password": `${password}` }
        const userStr = JSON.stringify(user)
        xhr.send(userStr);
        document.querySelector('.registration form').reset()
    }
})
let timer = 0
function alertFn(isSuccess, t, sign_in_success, response) {
    console.log(isSuccess)
    if (!sign_in_success) {
        if (isSuccess) {
            document.querySelector(`.success`).classList.add('show')
        }
        else {
            document.querySelector(`.loss`).classList.add('show')
            document.querySelector(`.loss`).innerHTML = '登录失败!!!' + response.message + '!!'
        }
        if (timer != 0) {
            clearTimeout(timer)
            timer = 0
        }
    }
    else {
        if (isSuccess)
            document.querySelector(`.sign_insuccess`).classList.add('show')
        else {
            document.querySelector(`.sign_inloss`).innerHTML = '注册失败!!!' + response.message + '!!'
            document.querySelector(`.sign_inloss`).classList.add('show')
        }
        if (timer != 0) {
            clearTimeout(timer)
            timer = 0
        }
    }
    timer = setTimeout(() => {
        if (!sign_in_success) {
            if (isSuccess) {
                document.querySelector('.success').classList.remove('show')
            }
            else {
                document.querySelector('.loss').classList.remove('show')
            }
        }
        else {
            if (isSuccess)
                document.querySelector(`.sign_insuccess`).classList.remove('show')
            else
                document.querySelector(`.sign_inloss`).classList.remove('show')
        }
    }, 2000);
}

