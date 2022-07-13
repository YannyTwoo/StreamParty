const express = require('express');
const mysql = require('mysql2')
const axios = require('axios');
const dotenv = require('dotenv');
const ejs = require('ejs');
const path = require('path')
const cors = require('cors');
//-----------------------------
const connection = require('./config/dbsql')
const loginRouter = require('./routes/loginroutes');
const passport = require('passport');

//-----------------------------
const PORT = process.env.PORT || 2345;


//-----------------------------
app = express();
dotenv.config();



//-----------------------------
app.use(cors())
app.use(express.json());
app.use(express.static(path.resolve(__dirname , 'public')))
app.use(express.urlencoded({extended: true}));
app.set('view engine', 'ejs');

app.use('/userlogreg',loginRouter); // to involve all the routes in the loginroutes.js file

//-----------------------------
require('./config/passport');
app.use(passport.initialize());
app.use(passport.session());
//-----------------------------

app.get('/',(req,res)=>{
    res.render('login');
})
app.get('/stream', (req,res)=>{
    res.render('stream');// make this route only be accessible if "isAuthenticated"
})

app.get('/stream', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login'
  })
)

//-----------------------------
app.listen(PORT , ()=>{
    console.log(`running on ${PORT}`)
})
//-----------------------------