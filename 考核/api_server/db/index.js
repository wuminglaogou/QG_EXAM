const mysqp = require('mysql')
const db = mysqp.createPool({
    host: `127.0.0.1`,
    user: `root`,
    password: `SV46.9731`,
    database: `my_db_02`
})
module.exports = db