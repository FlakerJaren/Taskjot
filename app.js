const express = require('express');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override')
const mongoose = require('mongoose');
const bodyParser  = require('body-parser');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const path = require('path');
const db = require("./config/database")

const app = express();

const taskRoutes = require('./routes/tasks');
const userRoutes = require('./routes/user');

require("./config/passport")(passport)

//Start Server
var port = process.env.PORT ||5000;
app.listen(port);

tempURI = "mongodb+srv://Jaren:6428Jaren@taskjot-o4a8p.mongodb.net/test?retryWrites=true&w=majority"

//connect to database
mongoose.connect(tempURI, {useUnifiedTopology:true, useNewUrlParser:true})
    .then(()=>console.log("Mongo DB Connected.."))
    .catch(err=> console.log(err));


//Handlebars middleware 
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

//Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//Method Override Middleware
app.use(methodOverride('_method'));

//Connect Flash Middleware
app.use(flash());

//Express Session Middleware
app.use(session({
    secret:'secret',
    resave: true,
    saveUninitialized:true,
}));
app.use(passport.initialize());
app.use(passport.session());

//Global variables 
app.use(function(req,res,next){
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error= req.flash('error');
    res.locals.user=req.user||null;
    next();
})


//Routes
app.get('/', (req,res)=>{
    var somedata = "Hello World";
    res.render("index",{somedata: "somedata"});
});

app.get('/about', (req,res)=>{
    res.render("about",{
        details: "This is a dumb about page",
        version: "1.0.0"
    });
});

//Use Routes
app.use('/tasks',taskRoutes);
app.use('/user',userRoutes);

//Use static public folder
app.use(express.static(path.join(__dirname,'public')));