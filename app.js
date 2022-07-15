const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
const ejs = require('ejs');
const path = require('path');
dotenv.config();

const mongoose = require('mongoose')
const session = require('express-session');
const passport = require('passport');
const flash = require('express-flash')
const passportLocalMongoose = require('passport-local-mongoose');

const http = require('http');
const socketio = require('socket.io');
//-----------------------------


//-----------------------------
// variables 
const PORT = process.env.PORT || 6969;
const user = [];
let streamlink='https://youtu.be/dOufWtK7Q5s';
//-----------------------------

// Declaring middleware functions to check if authenticated or not AND if admin or not
isAuth = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.redirect('/')
    }
}
isAdmin = (req, res, next) => {
    if (req.isAuthenticated() && req.user.admin) {
        next();
    } else {
        res.status(401).json({ msg: 'You are not authorized to view this resource as you are not an admin.' });
    }
}
//-----------------------------
app = express();



const server = http.createServer(app);
const io = socketio(server, {cors: {origin : "*"}});

//-----------------------------
app.use(express.static(path.resolve(__dirname , 'public')))
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.set('view engine', 'ejs');
//-----------------------------

app.use(session({
    secret: "seegret", // keep this in .env file
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24, // Equals 1 day (1 day * 24 hr/1 day * 60 min/1 hr * 60 sec/1 min * 1000 ms / 1 sec)
    }
}));

app.use(passport.initialize());
app.use(passport.session());




mongoose.connect("mongodb://localhost:27017/streampollchatMain", { useNewUrlParser: true });

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    admin: { type: Boolean, default: true }
});
userSchema.plugin(passportLocalMongoose); // this is to hash and salt our passwords

const User = new mongoose.model("User", userSchema);


passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser()); // creates cookie and stuffs information inside
passport.deserializeUser(User.deserializeUser()); // crumbles the cookie and discovers the message inside

app.use((req, res, next) => {// this middleware function to help with debugging
    console.log(req.session);
    console.log(req.user);
    next();
});
//-----------------------------
// have this work on authentication and only on stream route


io.on("connection", (socket)=>{ // this way we listen to events. This is the connection event.
    console.log(`the connected user is ${socket.id}`)
    users.push(socket.id)

    socket.on("send_message",(data)=>{
        payload = {
            text: data,
            user: socket.id
        }
        socket.broadcast.emit('receive_message',(payload))
        // socket.emit('receive_message', data);
        // socket.broadcast.emit("receive_message", data)
    })
    socket.on("disconnect", function() {
        console.log(`${socket.id} has left the chat`)
     })
})

//-----------------------------
app.post("/login", (req, res) => {
    const user = new User({
        username: req.body.username,
        password: req.body.password
    });
    req.login(user, function (err) {//method comes from passport
        if (err) {
            console.log(err)
            res.flash(err);
        } else {
            passport.authenticate("local")(req, res, function () {
                res.redirect('/stream')
            })
        }
    })
})
app.post("/register", (req, res) => {
    console.log(`${req.body.username} and ${req.body.password}`)
    User.register({ username: req.body.username }, req.body.password, (err, user) => {
        if (err) {
            console.log('there was an error' + err);
            res.redirect("/")
        } else {
            passport.authenticate("local")(req, res, function () {
                res.redirect("/stream")
            })
        }
    })
})




app.get('/',(req,res)=>{
    res.render("login");
})
app.get('/stream', isAuth, (req,res)=>{
        res.render("stream",{streamlink:streamlink});
})
app.get('/admin', isAdmin ,(req,res)=>{
    res.render('admin')
})
app.get("/thankyou", (req, res) => {
    if(req.isAuthenticated()){
        req.logout(function(err) {
            if (err) { return next(err); }
            res.render('thankyou.ejs');
          });
    }
    else{
        res.render('thankyou.ejs')
    }
})
app.get("/forgotpassword", (req, res) => {
    res.render('forgotpassword.ejs')
})
//-----------------------------






//-------------------------------

server.listen(PORT , ()=>{
    console.log(`running on ${PORT}`)
})
//-----------------------------