if(process.env.NODE_ENV === 'production'){
    module.exports = {mongoURI:
        "mongodb+srv://Jaren:Jaren@taskjot-o4a8p.mongodb.net/test?retryWrites=true&w=majority"
     }
}
else{
    module.exports = {mongoURI:
       "mongodb://localhost/myapp"
    }
}