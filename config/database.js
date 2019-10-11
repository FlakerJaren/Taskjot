if(process.env.NODE_ENV === 'production'){
    module.exports = {mongoURI:
        "mongodb+srv://jaren:jaren@cluster0-o4a8p.mongodb.net/test?retryWrites=true&w=majority"
     }
}
else{
    module.exports = {mongoURI:
       "mongodb://localhost/myapp"
    }
}