
const user = require('../db/model/user');
const { success_function, error_function } = require('../utils/response-Handler');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendemail = require('../utils/send-email').sendEmail;
const resetpassword = require('../utils/email-template/set-otp').resetPassword;
// const fileUpload = require('../util/uploads').fileUpload;
const dotenv = require('dotenv');
dotenv.config();

exports.signup = async function (req, res) {

    try {
        let body = req.body;

        let password = req.body.password;
        let email = req.body.email;
        
        
        let salt = bcrypt.genSaltSync(10);
        // console.log("salt",salt);

        let hashed_password = bcrypt.hashSync(password,salt);
        console.log("hashed password",hashed_password);

        req.body.password = hashed_password;


        const otp = Math.floor(100000 + Math.random() * 900000); // Generate 6-digit OTP
        req.body.otp = otp;
        console.log("req.body.otp",req.body.otp)
   
        

        let new_user = await user.create(body);
        console.log("newuser", new_user);

        // let email_template = await resetpassword(email,otp);
        // sendemail(email, "OTP verifictaion", email_template);

        let response = success_function({
            success : true,
            statusCode : 200,
            message : "user creation success",
            data : new_user
        });
        res.status(response.statusCode).send(response);
        return;
    } catch (error) {
        console.log("error",error);

        let response = error_function({
            success : false,
            statusCode : 400,
            message : "user creation failed",

        });
        res.status(response.statusCode).send(response);
        return;
    }

}

exports.verify_otp = async function(req,res){
  try {
    let body = req.body;

    let email = req.body.email;
    let otp = req.body.otp;

    let check_user = await user.findOne({email : email});
    console.log("check user",check_user);

    if(!check_user){
        let response = error_function({
            success : false,
            statusCode : 400,
            message : "user not found"
        });
        res.status(response.statusCode).send(response);
        return;
    }
    else{
        if(otp === check_user.otp){

            check_user.otp = null;
            await check_user.save();

            let response = success_function({
                success : true,
                statusCode : 200,
                message : "OTP verified successfully",
                data : check_user
            });
            res.status(response.statusCode).send(response);
            return;
        }
        else{
            let response = error_function({
                success : false,
                statusCode : 400,
                message : "Invalid OTP",
            });
            res.status(response.statusCode).send(response);
            return;
        }
    }
  } catch (error) {
    console.log("error",error);
    let response = error_function({
        success : false,
        statusCode : 400,
        message : 'OTP verification failed'
    });
    res.status(response.statusCode).send(response);
    return;
  }
}


exports.singleUser = async function(req,res){

    try {
        let id = req.params.id;

        let check_user = await user.findOne({_id : id});
        console.log("check_user",check_user);

        let response = success_function({
            success : true,
            statusCode : 200,
            message : "fetching successfull",
            data : check_user
        });
        res.status(response.statusCode).send(response);
        return;
    } catch (error) {
        console.log('error',error);

        let response = error_function({
            success : false,
            statusCode : 400,
            message : "fetching failed",
            
        });
        res.status(response.statusCode).send(response);
        return;
    }

    
}
