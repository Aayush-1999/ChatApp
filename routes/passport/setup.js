const passport              = require("passport"),
      local                 = require("./localStrategy");
      User                  = require("../../models/user"),
      expressSession        = require("express-session"),
      mongoose              = require("mongoose");

module.exports = app =>{
  app.use(expressSession({
      secret: "iHaveMessedUp",
      resave: false,
      saveUninitialized: false
  }));
  app.use(passport.initialize());
  app.use(passport.session());

  local(passport);
}