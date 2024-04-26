const joi = require('joi')
username = joi.string().min(1).max(10).required()
oldpassword = joi.string().pattern(/^[\w]{6,12}$/).required()
newpassword = joi.string().pattern(/^[\w]{6,12}$/).required()
old_name = joi.string()
image = joi.string()
gender = joi.string()
age = joi.string()
group = joi.string()
exports.change_schema = {
    body: {
        oldpassword,
        newpassword,
        username
    }
}