const LocalStratagy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = mongoose.model('User');

module.exports = function (passport) {
    passport.use(new LocalStratagy({ usernameField: "email" }, (email, password, done) => {
        User.findOne({
            email: email
        })
            .then(user => {
                if (!user) {
                    return done(null, false, { message: "No user found" })
                }
                else {
                    bcrypt.compare(password, user.password, (err, isMatch) => {
                        if (isMatch) {
                            return done(null, user);
                        }
                        else {
                            return done(null, false, { message: "Password Incorect" });
                        }
                    })
                }
            })
    }));
    
    passport.serializeUser(function(user,done){
        done(null,user.id);
    });

    passport.deserializeUser(function(id,done){
        User.findById(id,function(err,user){
            done(err,user);
        });
    });
}
