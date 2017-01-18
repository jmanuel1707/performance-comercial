var express = require('express');
var app = express();
var path = require('path');

var handlebars = require("express-handlebars").create({defaultLayout:"main"});
app.engine('handlebars', handlebars.engine);

app.use(require('body-parser').urlencoded({
    extended:true
}));


app.set('view engine', 'handlebars');

var controladorUsuarios = require('./controller/consultores');

app.use("/",controladorUsuarios);

app.use(express.static(path.join(__dirname,'public')));



//En caso de que se intente acceder a una ruta que no exista.
app.use(function(req, res, next){
  res.render('404');
});


app.listen(process.env.PORT ,function(){
    console.log("express started on " + process.env.PORT);
});



