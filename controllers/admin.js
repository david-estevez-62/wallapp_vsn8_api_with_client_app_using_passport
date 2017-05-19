

var User = require('../models/users');

var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'Aol',
  auth: {
      user: 'canvastestprogram@aol.com',
      pass: 'secret27-'
  }
});




var mailOptions = {
  from: 'Canvas App Support <canvastestprogram@aol.com>',
  subject: 'Canvas App - Email verification',
}



var performLogin = function (req, res, next, user) {
  // Passport injects functionality into the express ecosystem,
  // so we are able to call req.login and pass the user we want
  // logged in.
  
  req.login(user, function (err) {

    if (err) return next(err);

    // Just end the response here we are going to refresh the page on client
    // at which point it will get the cookie that authorizes the session
    return res.end();
  });
};




module.exports = function(app, passport){



  app.post("/signin", function (req, res, next) {
      // Passport's "authenticate" method returns a method, so we store it
      // in a variable and call it with the proper arguments afterwards.
      // We are using the "local" strategy defined (and used) in the
      // config/passport.js file

      var authFunction = passport.authenticate('localSignIn', function(err, user, info){


        if(err) return next(err);

        // Just end the response here we are going to refresh the page on client
        // at which point it will get the cookie that authorizes the session
        if(!user) {
          return res.end();
        }

        // If we make it this far, the user has correctly authenticated with passport
        // so now, we'll just log the user in to the system.
        performLogin(req, res, next, user);
      });


      // Now that we have the authentication method created, we'll call it here.
      authFunction(req, res, next);

  });



  app.post("/signup", function(req, res, next){


      User.find({email: req.body.username}, function(err, user){

        if(err) return next(err);

        // Any value for user.length that is not 0 (is a truthy value) and means a user 
        // came back from the database
        if(user.length) {
            req.flash('info', "That email is already in the system.");
            return res.send();
        } else {

          
          var user = new User({
            email: req.body.username,
            password: req.body.password
          });

          user.save(
              function(err, user){


                  if(err) {
                    var errMsg = 'An error occured, please try again.';

                    req.flash('info', errMsg);


                    return res.end();
                  }

                  mailOptions.to = req.body.username;
                  mailOptions.text = 'Verify your Canvas account by going to this link http://localhost:8888/code/'+user._id;



                  transporter.sendMail(mailOptions, function(err, specs) {
                      if(!err){ console.log("Email sent") }

                      req.flash("info", "An email verification has been sent.")
                      return res.send();

                  });
              })


        }
      })

  
  }),


  app.get("/signout", function(req, res){
      req.logout();

      res.redirect('/wall');
  });
  

};
