const fs = require('fs')
const path = require('path')
fs.readFile(('index.html'), (err, data) => {
    if (err)
        console.log(err)
    else {
        const htmlStr = data.toString()
        const resultStr = htmlStr.replace(/[\r\n]/g, '')
        console.log(resultStr)
        fs.writeFile('index0.html', resultStr, err => {
            if (err)
                console.log(err)
            else
                console.log('写入成功')
        })
    }
}
)