const mongoose = require('mongoose');

let signup_schema = new mongoose.Schema({
    name : {
        type : String
    },
    email : {
        type  : String
    },
    password : {
        type : String
    },
    image :{
        type : String
    },
    otp : {
        type : String
    }
})
let signup = mongoose.model('users',signup_schema);
module.exports = signup;
