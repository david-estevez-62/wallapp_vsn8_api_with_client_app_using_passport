var express = require('express'),
    bodyParser = require('body-parser'),
    flash = require('connect-flash'),
    mongoose = require('mongoose'),
    session = require('express-session'),
    MongoStore = require('connect-mongo')(session);



var passport = require('passport'),
    passportConfig = require('./config/passport');


mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGOLAB_URI || require('./config/database').url );
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));



var app = express();
app.set('view engine', 'jade');
app.set('views', __dirname + '/views');



app.use(
  express.static(__dirname + '/public'),
  bodyParser.urlencoded({extended: false}),
  require('express-session')({
    secret: 'text to encrypt by',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection, ttl: 8 * 60 * 60 })
  }),
  flash(),
  passport.initialize(),
  passport.session()
)






// webpage pages and routes to authenticate 
require('./controllers/admin')(app, passport);
// main app pages
require('./controllers/index')(app);

//////////////////////////////////////////////////////////////////////////////////////

app.use(function(req, res){
    res.redirect('/wall');
});








var server = app.listen(8888, function() {
	console.log('Express server listening on port ' + server.address().port);
});
