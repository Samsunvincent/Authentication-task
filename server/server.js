const express = require('express')
const app = express();
const dotenv = require('dotenv')
dotenv.config();
const userrouter = require('../server/Router/user-Router')
const authrouter = require('../server/Router/auth-Router')
const mongoConnect = require('../server/db/connect');
mongoConnect();

app.use(express.static("../client"));
app.use(express.json({limit : "500mb"}));
app.use(express.urlencoded({extended : true}));
app.use(userrouter)
app.use(authrouter)

app.listen(process.env.PORT,()=>{
    console.log(`server is running at http://localhost:${process.env.PORT}`)
})