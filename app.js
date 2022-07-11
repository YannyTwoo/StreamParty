const express = require('express');
const mysql = require('mysql2')
const axios = require('axios');
const dotenv = require('dotenv');
//-----------------------------
const connection = require('./database/dbsql.js')
const loginrouter = require('./routes/loginroutes.js');

//-----------------------------
const PORT = process.env.PORT || 2345;

const dbname = process.env.DB_NAME;
const tablename = process.env.TABLE_NAME;

//-----------------------------
app = express();
dotenv.config();



//-----------------------------
app.use(express.static(path.resolve(__dirname, 'public')));
app.use(express.json());
app.use(cors())
app.use(express.urlencoded({
    extended: true
})
);

//-----------------------------
app.use('/userlogreg',loginrouter) // to involve all the routes in the loginroutes.js file

//-----------------------------

app.get('/',(req,res)=>{
    res.send('<h1>Home boi</h1>')
})


//-----------------------------
app.listen(PORT , ()=>{
    console.log(`running on ${PORT}`)
})
//-----------------------------