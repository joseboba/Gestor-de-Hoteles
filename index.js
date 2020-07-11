'use strict';

var mongoose = require('mongoose');
var port = 3800;
var app = require('./app');
mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost:27017/hotels', {useNewUrlParser: true, useUnifiedTopology:true, useFindAndModify:false})
    .then( ()=>{
        console.log('Succes');
        app.listen(port, ()=>{
            console.log('El servidor esta corriendo en el pueto', port);
        });
    }).catch((err)=>{
        console.log(err);
    });
    
    