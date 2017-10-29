var express = require("express"),
    path = require("path"),
    bodyParser = require("body-parser"),
    cookieParser = require("cookie-parser"),
    flash = require("connect-flash"),
    mongoose = require("mongoose"),
    session = require("express-session"),
    MongoStore = require("connect-mongo")(session);



var passport = require("passport"),
    passportConfig = require("./config/passport");


mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGOLAB_URI || require("./config/database").url );
var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));



var app = express();



app.use(
  express.static(__dirname + "/public"),
  bodyParser.urlencoded({extended: false}),
  cookieParser(),
  require("express-session")({
    secret: "text to encrypt by",
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection, ttl: 8 * 60 * 60 })
  }),
  flash(),
  passport.initialize(),
  passport.session()
)




app.use(function(req, res, next){
  res.header("Access-Control-Allow-Origin", req.headers.origin);
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, practCookie, Accept");
  res.header("Access-Control-Allow-Credentials", true);
  
  next();

});






// authenticate routes
require("./controllers/admin")(app, passport);
// api (main) routes
require("./controllers/api")(app);

//////////////////////////////////////////////////////////////////////////////////////


app.use(function(req, res){
    res.send("404 Not found")
});








var server = app.listen(process.env.PORT || 3000, function() {
	console.log("Express server listening on port " + server.address().port);
});
