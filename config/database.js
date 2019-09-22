if(process.env.NODE_ENV === 'development'){
    module.exports = {mongoURI:
        "mongodb+srv://Jaren:6428jf@taskjot-o4a8p.mongodb.net/test?retryWrites=true&w=majority"
     }
}
else{
    module.exports = {mongoURI:
       "mongodb://localhost/myapp"
    }
}