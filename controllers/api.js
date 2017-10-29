
var User = require("../models/users.js");


var fs = require("fs"),
base64Img = require("base64-img");




module.exports = function(app) {


	// get static imgs and user
	app.get("/bootstrapclient", function(req, res){
	  	fs.readdir("public/img/uploads", function(err, pics){
	 
	  		var user = req.user || null;
	  		
			var imgs = [];

			if (err) {
		        throw err;
		    }

		    // do not use results return by readdir (in this case I call it pics) 
		    // because could have hidden .files such as DS Store
		    for (var i = 0; i < pics.length; i++) {
		    	if(pics[i].substr(-4) === ".png"){
		    		imgs.push("http://" + req.headers.host + "/img/uploads/" + pics[i]);
		    	}
		    }

		    res.send({ user: user , imgs: imgs });

		});
	});


	// get static imgs
	app.get("/staticpics", function(req, res) {

		fs.readdir("public/img/uploads", function(err, pics){

			var imgs = [];

			if (err) {
		        throw err;
		    }

		    // do not use results return by readdir (in this case I call it pics) 
		    // because could have hidden .files such as DS Store
		    for (var i = 0; i < pics.length; i++) {
		    	if(pics[i].substr(-4) === ".png"){
		    		imgs.push("http://" + req.headers.host + "/img/uploads/" + pics[i]);
		    	}
		    }

		    res.send(imgs);


		});

	});


	app.get("/code/:token", function(req, res) {

		User.findById(req.params.token, function(err, user) {

			var infoMsg;
			// If user has already been confirmed there is no point in saving again
			// if user associated with unique secret token clicks the link again 
			// after already doing so and being confirmed
			if(user && !user.confirmed){
				user.confirmed = true;
				user.save();

				infoMsg = "Congratulations. Your account was verified. You may sign in.";
			} else if(user){
				infoMsg = "That account has already been verified.";
			} else {
				infoMsg = "That link is not for a valid account.";
			}

		  	res.send(infoMsg);
		}); 

	});


	app.post("/url/action", function(req, res) {
		// if(req.isAuthenticated()){
			// Convert the base64 data Url to a png file and store in /public/img/uploads/ directory
		 	base64Img.img(req.body.dataUrl, "./public/img/uploads/", String(new Date().getTime()), function(err, filepath) {
				res.end();
			});
	 	// }
	});


};


