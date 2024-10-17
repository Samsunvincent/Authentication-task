const express = require('express');
const authrouter = express.Router();
const authController = require('../user-Controller/auth-Controller');


authrouter.post('/login',authController.login)

module.exports = authrouter