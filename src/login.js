
var crypto = require('crypto');
var moment = require('moment');
var tbls = require('./tables').tbls;
var random = require("node-random");
var accounts = tbls['memberx'];



  /* login validation methods */

  exports.autoLogin = function(user, pass, callback)
  {
    console.log('autoLogin: ' + user);
  	accounts.find({phone:user, typeID:1}, function(e, o) {
  		if (o){
  			if ((o[0].pass == pass) && (o[0].status > -1)) {
          let sql0 = `SELECT a.*, b.subdir, b.name AS 'groupName' FROM memberx a, groupx b WHERE (a.memberID = '${o[0].memberID}') AND (a.groupID = b.groupID) AND (a.status = 1) AND (typeID=1)`;
          //console.log("sql0: " + sql0)
          accounts.execSQL(sql0, function(e, data) {
            if (data.length == 0) {
              callback(203); //User not found
            } else {
              callback(null, data[0])
            }     			
          })
        } else {
          callback(206);
        }
  		}	else {
  			accounts.findOne({email:user}, function(e, o) {
          if (o){
            let sql0 = `SELECT a.*, b.subdir FROM memberx a, groupx b WHERE (a.memberID = '${o.memberID}') AND (a.groupID = b.groupID) AND (a.status = 1) AND (typeID=1)`;
            console.log("sql0: " + sql0)
            accounts.execSQL(sql0, function(e, data) {
              if (data.length == 0) {
                callback(203); //User not found
              } else {
                callback(null, data)
              }     			
            })
          }	else {
            callback(206);
          }
        })
  		}
  	});
  }

  exports.manualLogin = function(user, pass, callback)
  {
    function validate(pass, o, callback) {
      //console.log(o);
      //console.log(pass)
      validatePassword(pass, o.pass, function(err, res) {
        if (res){
          if (o.status == -1) {
            callback(204); //User is temporary locked
          } else {
            callback(null, o);
          }
        }	else{
          callback(205); //Invalid password
        }
      });
    }
    let sql0 = `SELECT a.*, b.subdir, b.name AS 'groupName' FROM memberx a, groupx b WHERE (a.phone = '${user}') AND (a.groupID = b.groupID) AND (a.status = 1) AND (typeID=1)`;
    console.log("sql0: " + sql0)
    accounts.execSQL(sql0, function(e, o) {
  		if (o[0] == null) {
        callback(203); //User not found
      } else {
        validate(pass, o[0], callback);
      }     			
  	});

  }

  /* record insertion, update & deletion methods */

  exports.addNewAccount = function(newData, callback)
  {
  	accounts.findOne({phone:newData.phone}, function(e, o) {
  		if (o){
  			callback(203); //phonenumber is already taken
  		}	else{
  			accounts.findOne({email:newData.email}, function(e, o) {
          newData.otp = getRandomInt(10000,100000);
          accounts.insert(newData, function (e, o) {
            if (e) throw e;
            callback(null, newData)
            
          });
        })
  		}
  	});
    function getRandomInt(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
    }
  }

  exports.updateAccount = function(newData, callback) {
    accounts.findOne({email:newData.email}, function(e, o){
      if (e){
        if ( e == 203) { //No record found
          accounts.findOne({memberID:newData.memberID}, function(e, ox){
            accounts.save(newData, function (e, oo) {
              if (e) throw e;
              callback(203, ox)
            });
          })
        }
  		}	else {
        if (o.memberID == newData.memberID) {
    			accounts.save(newData, function (e, oo) {
            if (e) throw e;
            callback(null, oo)
          });
        } else {
          callback(202); //email is already taken
        }
      }
    });
  }

  exports.updatePassword = function(user, callback) {
  	accounts.findOne({memberID:user.memberID}, function(e, o){
  		if (e) {
  			callback(e, null);
  		}	else {
  			saltAndHash(user.pass, function(hash){
          let mem = {};
          mem.memberID = user.memberID;
	        mem.pass = hash;
          mem.lastChanged = moment().format("YYYY-MM-DD HH:mm:ss");
          mem.user = user.user;
	        accounts.save(mem, function(e, o) {
  					if (e) callback(e);
  					else { callback(null, o); }
  				});
  			});
  		}
  	});
  }
  exports.resetPassword = function(email, callback) {
    let obj = {};
    const regexExp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/gi;
    if (regexExp.test(email) ) obj.email = email
    else obj.phone = email
  	accounts.findOne( obj, function(e, o){
  		if (e) {
  			callback(e, null);
  		}	else {
        if (o.email !== "") {
          random.strings({
            "length": 8,
            "number": 1
          }, function(error, newPass) {
            saltAndHash(newPass, function(hash){
              let mem = {};
              mem.memberID = o.memberID;
              mem.pass = hash;
              mem.lastChanged = moment().format("YYYY-MM-DD HH:mm:ss");
              accounts.save(mem, function(e) {
                if (e) callback(e);
                else { o.passx = newPass; callback(null, o); }
              });
            });
          })
        } else {;
          callback(203)
        }
        
  		}
  	});
  }

  exports.genOTP = function(phone, callback) {
  	accounts.findOne( {phone:phone}, function(e, o){
  		if (e) {
  			callback(e, null);
  		}	else {
        let newPass = getRandomInt(10000,100000);
        let mem = {};
        mem.memberID = o.memberID;
        mem.otp = newPass;
        mem.lastChanged = moment().format("YYYY-MM-DD HH:mm:ss");
        accounts.save(mem, function(e, o) {
          if (e) callback(e);
          else { callback(null, o); }
        });
  		}
  	});
    function getRandomInt(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
    }
  }
  exports.checkOTP = function(otp, callback) {
  	accounts.findOne( {otp:otp}, function(e, o){
  		if (e) {
  			callback(e, null);
  		}	else {
          let mem = {};
          mem.memberID = o.memberID;
          mem.otp = getRandomInt(10000,100000);
          mem.lastChanged = moment().format("YYYY-MM-DD HH:mm:ss");
          accounts.save(mem, function(e, o) {
            if (e) callback(e);
            else {callback(null, o); }
          });
  		}
  	});
    function getRandomInt(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
    }
  }

  exports.checkOTPChangePasswd = function(otpx, pass1, callback) {
  	accounts.findOne( {otp:otpx}, function(e, o){
      console.log(o)
  		if (e) {
  			callback(e, null);
  		}	else {
        saltAndHash(pass1, function(hash){
          let mem = {};
          mem.memberID = o.memberID;
          mem.otp = '';
          mem.pass = hash;
          mem.status = 1;
          mem.lastChanged = moment().format("YYYY-MM-DD HH:mm:ss");
          console.log(mem)
          accounts.save(mem, function(e, o) {
            if (e) callback(e);
            else {callback(null, o); }
          });
        })
  		}
  	});
  }

  exports.checkMemberChangePasswd = function(memberIDx, pass1, callback) {
    console.log("pass1: " + pass1);
  	accounts.findOne( {memberID:memberIDx}, function(e, o){
  		if (e) {
  			callback(e, null);
  		}	else {
        saltAndHash(pass1, function(hash){
          o.pass = hash;
          o.lastChanged = moment().format("YYYY-MM-DD HH:mm:ss");
          accounts.save(o, function(e, datx) {
            if (e) callback(e);
            else {callback(null, datx); }
          });
        })
  		}
  	});
  }

  exports.checkPhone = function(phone, idx, gid, rolex, callback) {
  	accounts.find( {phone:phone}, function(err, dat){
      if (err) throw err;
  		if (dat.length > 0) { //phone has been registered
        if (dat.filter(m=>m.status==1).length > 0) { //Found active record
          callback(null, dat.filter(m=>m.status==1)[0]);
        } else { //No active record is found...
          if (dat.filter(m=>m.status==0).length > 0) { //but there is record is waiting to OTP verify
            let newPass = getRandomInt(10000,100000);
            let mem = dat.filter(m=>m.status==0)[0];
            mem.otp = newPass;
            accounts.save(mem, function(err, o) {
              if (err) throw err;
              else { callback(204, o); }
            })
          } else { //this is comming back member ie status = -1, create a new record ..
            let newPass = getRandomInt(10000,100000);
            let mem = {};
            mem.phone = phone;
            mem.otp = newPass;
            mem.roleID = 3; //Khach hang
            mem.groupID = gid; 
            accounts.insert(mem, function(err, o) {
              if (err) throw err;
              else { callback(205, o); }
            })
          } 
        }
      } else {
        // phone not yet register
        let newPass = getRandomInt(10000,100000);
        let mem = {};
        mem.phone = phone;
        mem.otp = newPass;
        mem.roleID = rolex;
        if (mem.roleID==6) {
          mem.name = `Đại lý độc lập`;
          mem.company = `Chưa khai báo`;
        }
        mem.parentID = idx; 
        mem.groupID = gid; 
        accounts.insert(mem, function(err, o) {
          if (err) throw err;
          else { 
            if (mem.roleID==6) {
              mem.parentID = o.memberID;
              mem.name = `NV Đại lý độc lập`;
              mem.roleID = 7;
              mem.typeID = 2;
              mem.otp = "";
              accounts.insert(mem, function(err, x) { //Create NV Daily Ao
                if (err) throw err;
                else { 
                  callback(203, o);
                }
              })
            } else {
              callback(203, o);
            }
            
          }
        })
      }
  	});

    function getRandomInt(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
    }
  }


  exports.setPassword = function(email, newPass, callback) {
    let obj = {};
    const regexExp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/gi;
    if (regexExp.test(email) ) obj.email = email
    else obj.phone = email;
    
  	accounts.findOne( obj, function(e, o){
      console.log("o: " + JSON.stringify(o, false, 4));
  		if (e) {
  			callback(e, null);
  		}	else {
        if (o.email !== "") {
          saltAndHash(newPass, function(hash){
            let mem = {};
            mem.memberID = o.memberID;
            mem.pass = hash;
            mem.lastChanged = moment().format("YYYY-MM-DD HH:mm:ss");
            accounts.save(mem, function(e) {
              if (e) callback(e);
              else { o.passx = newPass; callback(null, o); }
            });
          });
        } else {;
          callback(203)
        }
        
  		}
  	});
  }

  /* account lookup methods */

  exports.deleteAccount = function(id, callback)
  {
  	accounts.remove({_id: getObjectId(id)}, callback);
  }

  exports.getAccountByEmail = function(email, callback)
  {
  	accounts.findOne({email:email}, function(e, o){ callback(null, o); });
  }
  exports.getAccountByID = function(ID, callback)
  {
  	accounts.findOne({memberID:ID}, function(e, o){ callback(null, o); });
  }

  exports.validateResetLink = function(email, passHash, callback)
  {
  	accounts.find({ $and: [{email:email, pass:passHash}] }, function(e, o){
  		callback(o ? 'ok' : null);
  	});
  }

  exports.getAllRecords = function(callback)
  {
  	accounts.find().toArray(
  		function(e, res) {
  		if (e) callback(e)
  		else callback(null, res)
  	});
  }

  exports.delAllRecords = function(callback)
  {
  	accounts.remove({}, callback); // reset accounts collection for testing //
  }

  /* private encryption & validation methods */

  var generateSalt = function()
  {
  	var set = '0123456789abcdefghijklmnopqurstuvwxyzABCDEFGHIJKLMNOPQURSTUVWXYZ';
  	var salt = '';
  	for (var i = 0; i < 10; i++) {
  		var p = Math.floor(Math.random() * set.length);
  		salt += set[p];
  	}
  	return salt;
  }

  var md5 = function(str) {
  	return crypto.createHash('md5').update(str).digest('hex');
  }

  var saltAndHash = function(pass, callback)
  {
  	var salt = generateSalt();
  	callback(salt + md5(pass + salt));
  }

  var validatePassword = function(plainPass, hashedPass, callback)
  {
  	var salt = hashedPass.substr(0, 10);
  	var validHash = salt + md5(plainPass + salt);
  	callback(null, hashedPass === validHash);
  }

  var getObjectId = function(id)
  {
  	return new require('mongodb').ObjectID(id);
  }

  var findById = function(id, callback)
  {
  	accounts.findOne({_id: getObjectId(id)},
  		function(e, res) {
  		if (e) callback(e)
  		else callback(null, res)
  	});
  }

  var findByMultipleFields = function(a, callback)
  {
  // this takes an array of name/val pairs to search against {fieldName : 'value'} //
  	accounts.find( { $or : a } ).toArray(
  		function(e, results) {
  		if (e) callback(e)
  		else callback(null, results)
  	});
  }
