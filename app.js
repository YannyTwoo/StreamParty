const express = require('express');
const axios = require('axios');


const PORT = process.env.PORT || 2345;

app = express();


app.get('/',(req,res)=>{
    res.send('<h1>Home boi</h1>')
})


app.listen(PORT , ()=>{
    console.log(`running on ${PORT}`)
})