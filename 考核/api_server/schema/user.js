const joi = require('joi')
username = joi.string().min(1).max(10).required()
password = joi.string().pattern(/^[\w]{6,12}$/).required()
exports.reguser_schema = {
    body: {
        username,
        password
    }
}