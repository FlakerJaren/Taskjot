const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
var bodyParser = require('body-parser');
var { ensureAuthenticated } = require("../helper/auth");
//Body Parser Middleware 
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

//Create task model
require("../models/Task");
var Task = mongoose.model('Task');

router.get('/add', ensureAuthenticated, (req, res) => {
    res.render("tasks/add");
});

router.get('/', ensureAuthenticated, (req, res) => {
    Task.find({ user: req.user._id })
        .sort({ date: 'desc' })
        .then(tasks => {
            res.render('tasks/index', {
                tasks: tasks
            });
        });
});

router.get('/edit/:id', ensureAuthenticated, (req, res) => {
    Task.findOne({
        _id: req.params.id
    })
        .then(task => {
            if (task.id != req.user.id) {
                req.flash("error_msg", "Not Authorized");
                req.redirect("/tasks");
            }
            else {
                res.render("tasks/edit", {
                    task: task
                });
            }
        });
});

//edit task
router.put('/:id', ensureAuthenticated, (req, res) => {
    Task.findOne({ _id: req.params.id }).then(task => {
        task.title = req.body.title;
        task.details = req.body.details;
        task.save().then(task => {
            req.flash('success_msg', "Task Updated");
            res.redirect('/tasks');
        });
    });
});

router.delete('/:id', ensureAuthenticated, (req, res) => {
    Task.deleteOne({ _id: req.params.id }).then(() => {
        req.flash("success_msg", "Task Removed");
        res.redirect('/tasks');
    });
});

//Process Form
router.post('/', ensureAuthenticated, (req, res) => {
    let errors = [];
    if (!req.body.title) {
        errors.push({ text: "Please Enter Title" });
    }
    if (!req.body.details) {
        errors.push({ text: "Please Enter Details" });
    }
    if (errors.length > 0) {
        res.render("tasks/add", {
            errors: errors,
            title: req.body.title,
            details: req.body.details
        });
    } else {
        var newTask = {
            title: req.body.title,
            details: req.body.details,
            user: req.user._id
        };
        new Task(newTask)
            .save()
            .then(tasks => {
                req.flash("success_msg", "Task Added");
                res.redirect("/tasks");
            })
            .catch(err => console.log(err))
    }
});

module.exports = router;
