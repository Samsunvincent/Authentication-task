const express = require('express');
const router = express.Router();
const controller = require('../user-Controller/user-Controller');

router.post('/adduser',controller.signup)
router.post('/verify_otp',controller.verify_otp)
router.get('/getuser/:id',controller.singleUser)

module.exports = router