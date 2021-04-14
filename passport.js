// passport.init.js
const Admin = require("./src/models/admin");
const passport = require("passport"),
  LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
passport.serializeUser((admin, done) => done(null, admin.id));
passport.deserializeUser((id, done) => {
  Admin.findById(id)
    .select(
      "-password -email.pin -email.update -reset_password_token -reset_password_expires"
    )
    .then((admin) => done(null, admin))
    .catch(() => done(new Error("Failed to deserialize an admin")));
});
passport.use(
  new LocalStrategy({ usernameField: "email" }, (username, password, done) => {
    var message = { message: "Email эсвэл нууц үг буруу байна." };
    Admin.findOne({
      "email.value": username.toLowerCase(),
      "invite.token": null,
    }).then((admin) => {
      if (!admin) {
        return done(null, false, message);
      } else if (!bcrypt.compareSync(password, admin.password))
        return done(null, false, message);
      else {
        admin.email.update = null;
        admin.email.pin = null;
        admin.reset_password_token = null;
        admin.reset_password_expires = null;
        admin.save();
        return done(null, admin);
      }
    });
  })
);
