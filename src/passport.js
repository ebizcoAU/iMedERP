const passport = require('passport');
var $CVar = require('./constants');
var cmfunc = require('./cmfunc');
var login = require('./login');
var LocalStrategy   = require('passport-local').Strategy;
var randomstring = require("randomstring");
var tbls = require('./tables').tbls;
const crypto = require ("crypto");
const secKey = $CVar.secKey;
const initVector = $CVar.initVector

//Encrypting text
function encrypt(text) {
   let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(secKey,'hex'), Buffer.from(initVector,'hex'));
   let encrypted = cipher.update(text);
   encrypted = Buffer.concat([encrypted, cipher.final()]);
   return encrypted.toString('hex');
}

// Decrypting text
function decrypt(text) {
   let encryptedText = Buffer.from(text.encryptedData, 'hex');
   let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(secKey,'hex'), Buffer.from(initVector,'hex'));
   let decrypted = decipher.update(encryptedText);
   decrypted = Buffer.concat([decrypted, decipher.final()]);
   return decrypted.toString();
}

passport.serializeUser(function(user, done) {
  //console.log("userxx: " + JSON.stringify(user, false, 4))
  done(null, user.memberID);
});

// used to deserialize the user
passport.deserializeUser(function(id, done) {
  //console.log("deserializeUser id: " + id)
  login.getAccountByID(id, function (err, row) {
      done(err, row);
  })
});


// =========================================================================
// LOCAL LOGIN =============================================================
// =========================================================================
// we are using named strategies since we have one for login and one for signup
// by default, if there was no name, it would just be called 'local'

passport.use('localLogin2', new LocalStrategy({
    // by default, local strategy uses username and password, we will override with email
    usernameField : 'username2',
    passwordField : 'password2',
    passReqToCallback : true // allows us to pass back the entire request to the callback
},
function(req, email, password, done) {
  console.log("email:" + email + ", password:" + password );
  console.log(cmfunc.getTimeStamp() + "/localLogin2..");
  login.manualLogin(email, password, function(error, data) {
    if (error) {
      console.log("LOGIN FAILED: " + error);
      if (error == 203) { return done(null, false, req.flash('errmsg', 'Tài khoãn không tồn tại..')); }
      if (error == 204) { return done(null, false, req.flash('errmsg', 'Tài khoãn bị khoá, xin liên lạc Admin..')); }
      if (error == 205) { return done(null, false, req.flash('errmsg', 'Mật mã không đúng..')); }
    } else {
      //console.log("LOGIN SUCCESS2: " + JSON.stringify(data,false,4));
      req.session.user = data.memberID;
      req.session.memberID = data.memberID;
      req.session.roleID = data.roleID;
      if (data.roleID == 0) { req.session.position = 'SuperAdmin'
      } else if (data.roleID == 1) {req.session.position = 'Admin'
      } else if (data.roleID == 2) {req.session.position = 'NV chuổi'
      } else if (data.roleID == 3) { req.session.position = 'Khách hàng'
      } else if (data.roleID == 4) { req.session.position = 'Nhà phân phối'
      } else if (data.roleID == 5) { req.session.position = 'NV phân phối'
      } else if (data.roleID == 6) { req.session.position = 'Đại lý'
      } else if (data.roleID == 7) { req.session.position = 'NV tiếp thị'
      } else { req.session.position = 'UNKNOWN'
      }
      
      req.session.divisionID = data.divisionID;
      req.session.name = data.name;
      req.session.parentID = data.parentID;
      req.session.company = data.company;
      req.session.groupID = data.groupID;
      req.session.groupName = data.groupName;
      req.session.subdir = data.subdir;
      req.session.imgLink = data.imgLink;
      req.session.typeID = data.typeID;
      req.session.phone = data.phone;
      req.session.themeID = data.themeID;
      req.session.cryptoid = encrypt(`${data.subdir}${data.memberID.toString().padStart(6, '0')}`)

      
      return done(null, data);
    }
  })

}))

passport.use('localAutolog', new LocalStrategy({
  // by default, local strategy uses username and password, we will override with email
  usernameField : 'username2',
  passwordField : 'password2',
  passReqToCallback : true // allows us to pass back the entire request to the callback
},
function(req, email, password, done) {
  console.log("username2:" + email + ", password2:" + password );
  console.log(cmfunc.getTimeStamp() + "/localAutolog..");
  login.autoLogin(email, password, function(error, data) {
    if (error) {
      console.log("AUTOLOGIN FAILED: " + error);
      if (error == 203) { return done(null, false, req.flash('errmsg', 'Tài khoãn không tồn tại..')); }
      else if (error == 204) { return done(null, false, req.flash('errmsg', 'Tài khoãn bị khoá, xin liên lạc Admin..')); }
      else if (error == 205) { return done(null, false, req.flash('errmsg', 'Mật mã không đúng..')); }
      else if (error == 206) { return done(null, false, req.flash('errmsg', 'Tài khoãn bị khoá, xin liên lạc Admin..')); }
    } else {
      console.log("AUTOLOGIN SUCCESS2: " + JSON.stringify(data,false,4));
      req.session.user = data.memberID;
      req.session.memberID = data.memberID;
      req.session.roleID = data.roleID;
      if (data.roleID == 0) { req.session.position = 'SuperAdmin'
      } else if (data.roleID == 1) {req.session.position = 'Admin'
      } else if (data.roleID == 2) {req.session.position = 'NV chuổi'
      } else if (data.roleID == 3) { req.session.position = 'Khách hàng'
      } else if (data.roleID == 4) { req.session.position = 'Nhà phân phối'
      } else if (data.roleID == 5) { req.session.position = 'NV phân phối'
      } else if (data.roleID == 6) { req.session.position = 'Đại lý'
      } else if (data.roleID == 7) { req.session.position = 'NV tiếp thị'
      } else { req.session.position = 'UNKNOWN'
      }
      
      req.session.divisionID = data.divisionID;
      req.session.name = data.name;
      req.session.parentID = data.parentID;
      req.session.company = data.company;
      req.session.groupID = data.groupID;
      req.session.groupName = data.groupName;
      req.session.subdir = data.subdir;
      req.session.imgLink = data.imgLink;
      req.session.typeID = data.typeID;
      req.session.phone = data.phone;
      req.session.themeID = data.themeID;
      req.session.cryptoid = encrypt(`${data.subdir}${data.memberID.toString().padStart(6, '0')}`)
      
      return done(null, data);
    }
  })

}))

//*************** customer login ***********************************
passport.use('customerLogin', new LocalStrategy({
    // by default, local strategy uses username and password, we will override with email
    usernameField : 'email',
    passwordField : 'phone',
    passReqToCallback : true // allows us to pass back the entire request to the callback
},
function(req, email, phone, done) {
  console.log("email:" + email + ", phone:" + phone );
  console.log(cmfunc.getTimeStamp() + "/customerLogin..");
  return done(null, {"email": email, "phone":phone });


}))

// expose this function to our app using module.exports
module.exports = passport;  //End of module.export
