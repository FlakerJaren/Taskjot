const express = require('express');
const mongoose = require('mongoose')
const router = express.Router();
const bcrypt = require('bcrypt');
const passport = require('passport');


//create user model
require("../models/User");
var User = mongoose.model('User');

router.get('/login', (req, res) => {
    res.render('users/login');
});

router.post('/login',(req,res,next) => {
    passport.authenticate('local',{
        successRedirect: '/',
        failureRedirect: '/user/login',
        failureFlash:true
    })(req,res,next);
})

router.get('/register', (req, res) => {
    res.render('users/register');
});

router.get('/logout',(req,res)=>{
    req.logOut();
    req.flash('success_msg','Logged out');
    res.redirect('/user/login');
})

router.post('/register', (req, res) => {
    errors = [];
    if (req.body.password != req.body.password2) {
        errors.push({ text: "Passwords do not match" });
    }
    if (req.body.password.length < 4) {
        errors.push({ text: "Password must be at least 4 characters" });
    }
    if (errors.length > 0) {
        res.render("users/register", {
            errors: errors,
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            password2: req.body.password2
        });
    }
    else {
        //check if email has already been registerd 
        User.findOne({email: req.body.email})
            .then(user => {
                if (user) {
                    req.flash("error_msg", "Email already registerd");
                    res.redirect('/user/register');
                }
                else {

                    //Create new user
                    const newUser = new User({
                        name: req.body.name,
                        email: req.body.email,
                        password: req.body.password,
                    });

                    //Hash password
                    const saltRounds = 10;
                    bcrypt.genSalt(saltRounds, (err, salt) => {
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if (err) throw err;
                            newUser.password = hash;
                            //save to database
                            newUser.save()
                                .then(user => {
                                    req.flash("success_msg", "User Registerd");
                                    res.redirect("login");
                                })
                                .catch(err => { console.log(err); });
                        })
                    })


                }
            })
    }

});


module.exports = router;