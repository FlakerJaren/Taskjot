var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var taskSchema = new Schema({
    title:{
        type: String,
        required: true
    },
    details:{
        type: String,
        required: true        
    },
    date:{
        type: Date,
        default: Date.now        
    },
    user: {
        type:String,
        required: true
    }
});

mongoose.model('Task', taskSchema);


