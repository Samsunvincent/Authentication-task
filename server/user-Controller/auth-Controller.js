const user = require('../db/model/user');
const { success_function, error_function } = require('../utils/response-Handler');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendemail = require('../utils/send-email').sendEmail;
const resetpassword = require('../utils/email-template/set-otp').resetPassword;
// const fileUpload = require('../util/uploads').fileUpload;
const dotenv = require('dotenv');
dotenv.config();

exports.login = async function(req,res){
  try {
    let body = req.body

    let email = req.body.email;
    if(email){
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
            let password = req.body.password
            let db_password = check_user.password

            let password_match = bcrypt.compareSync(password,db_password);
            console.log("password match",password_match);

            if(password_match){
                let token = jwt.sign({user_id : check_user._id},process.env.PRIVATE_KEY,{ expiresIn : "10d"});
                console.log("token : ",token);
                
                let token_data = { 
                    token,
                    _id : check_user._id,

                }

                let response = success_function({
                    success : true,
                    statusCode : 200,
                    message : "token",
                    data : token_data
                });
                res.status(response.statusCode).send(response);
                return;

            }
            else{
                let response = error_function({
                    success: false,
                    statusCode: 400,
                    message: "user not found",
    
                });
                res.status(response.statusCode).send(response);
                return;
            }
        }
      
    }
    else{
        let response = error_function({
            success : false,
            statusCode : 400,
            message : "Enter the email"
        })
        res.status(response.statusCode).send(response);
        return;
    }
   
  } catch (error) {
    console.log("error",error);

    let response = error_function({
        success : false,
        statusCode : 400,
        message : "Enter the email"
    })
    res.status(response.statusCode).send(response);
    return;
  }
    


}