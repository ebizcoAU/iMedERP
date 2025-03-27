module.exports = function(app){
  var http = require("http");
  var path = require('path');
  var $CVar = require('./constants');
  var fetch = require('node-fetch');
  var merge = require('merge'), original, cloned;
  var nodemailer = require('nodemailer');
  var moment = require('moment');
  var path = require('path');
  var cmfunc = require('./cmfunc');
  var tbls = require('./tables').tbls;
  var multer = require('multer');
  //overwrite the storage variable
  var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, `${$CVar.localStorage}/`);
    },
    filename: (req, file, cb) => {
        //call the callback, passing it the original file name
        cb(null, file.originalname);
    }
  });
  var upload = multer({storage});

  var fs = require("fs"); //Load the filesystem module

//************************************************** */
app.get('/memberx/:mid', function(req, res, next){
  if (cmfunc.isEmpty(req.session.user)) { res.redirect('/'); }// if user is not logged-in redirect back to login page //
  else {
    try {
      console.log(cmfunc.getTimeStamp() + `GET request to /memberx/${req.params.mid}`);
      let sql0 = `SELECT a.*, b.subdir `;
      sql0 += ` FROM memberx a, groupx b WHERE  (a.memberID = ${req.params.mid}) AND (a.groupID = b.groupID)`; 
      tbls['memberx'].execSQL(sql0, function(error, result) {
        if (error) throw error;
        res.send(result);
      })
  
    } catch (error) {
      res.send({ error: -1, message: 'Unknown exception' });
      console.log('API-Exception', error);
    }
  }
});

app.post('/grouplist', function(req, res, next){
  if (cmfunc.isEmpty(req.session.user)) { res.redirect('/'); }// if user is not logged-in redirect back to login page //
  else {
    try {
      console.log(cmfunc.getTimeStamp() + `POST request to /grouplist`);
      let sql0 = `SELECT a.* FROM groupx a WHERE (a.groupID > 1)`;
      tbls['groupx'].execSSQL(sql0, req.body, function(error, result) {
        if (error) throw error;
        res.send(result);
      })
  
    } catch (error) {
      res.send({ error: -1, message: 'Unknown exception' });
      console.log('API-Exception', error);
    }
  }
});

app.post('/manufacturerlist', function(req, res, next){
  if (cmfunc.isEmpty(req.session.user)) { res.redirect('/'); }// if user is not logged-in redirect back to login page //
  else {
    try {
      console.log(cmfunc.getTimeStamp() + `POST request to /manufacturerlist`);
      let sql0 = `SELECT a.*, b.subdir, b.weburl `;
      sql0 += ` FROM memberx a, groupx b WHERE  (a.groupID = b.groupID) AND (a.groupID > 1)`;
      sql0 += ` AND (a.roleID=1)`; // roleID = 1 is directorboard
      tbls['memberx'].execSSQL(sql0, req.body, function(error, result) {
        if (error) throw error;
        res.send(result);
      })
  
    } catch (error) {
      res.send({ error: -1, message: 'Unknown exception' });
      console.log('API-Exception', error);
    }
  }
});

app.get('/distributor/:gid', function(req, res, next){
  if (cmfunc.isEmpty(req.session.user)) { res.redirect('/'); }// if user is not logged-in redirect back to login page //
  else {
    try {
      console.log(cmfunc.getTimeStamp() + `GET request to /distributor/${req.params.gid}`);
      if ((req.session.roleID < 3) && (req.params.gid > 1) ) {
        let sql0 = `SELECT a.*, b.subdir `;
        sql0 += ` FROM memberx a, groupx b WHERE  (a.groupID = b.groupID) AND (a.roleID = 4)`;
        sql0 += ` AND ((a.parentID = ${req.params.gid}) OR (a.memberID = 1)) `; 
        console.log("sql0: " + sql0);
        tbls['memberx'].execSQL(sql0, function(error, result) {
          if (error) throw error;
          result.push({'memberID': 0, 'company': '  ---- '});
          res.send(result);
        })
      } else {
        result.push({'memberID': 0, 'company': '  ---- '});
        res.send(result);
      }
    } catch (error) {
      res.send({ error: -1, message: 'Unknown exception' });
      console.log('API-Exception', error);
    }
  }
});

app.post('/distributor/:mid', function(req, res, next){
  if (cmfunc.isEmpty(req.session.user)) { res.redirect('/'); }// if user is not logged-in redirect back to login page //
  else {
    try {
      console.log(cmfunc.getTimeStamp() + `POST request to /distributor/${req.params.mid}`);
      let sql0 = `SELECT a.*, b.subdir, b.weburl `;
      sql0 += ` FROM memberx a, groupx b WHERE  (a.groupID = b.groupID)`;
      sql0 += ` AND (a.roleID=4)`; // roleID = 4 is distributor
      if (req.params.mid > 1) {
        sql0 += ` AND (a.parentID = ${req.params.mid}) `; 
      } else {
        if (req.session.groupID > 1) {
          if (req.session.roleID==1) {
            sql0 += ` AND (a.groupID = ${req.session.groupID}) `;
          } else {
            sql0 = `SELECT a.*, c.subdir `;
            sql0 += ` FROM memberx a, memberx b, groupx c WHERE  (b.groupID = c.groupID)`;
            sql0 += ` AND (a.roleID=4) AND (a.parentID = b.memberID) AND (b.parentID = ${req.session.memberID})`; // roleID = 6 is agent
          }
        }   
      } 
      //console.log("sql0: " + sql0);
      tbls['memberx'].execSSQL(sql0, req.body, function(error, result) {
        if (error) throw error;
        res.send(result);
      })
    } catch (error) {
      res.send({ error: -1, message: 'Unknown exception' });
      console.log('API-Exception', error);
    }
  }
});

app.post('/diststaff/:did', function(req, res, next){
  if (cmfunc.isEmpty(req.session.user)) { res.redirect('/'); }// if user is not logged-in redirect back to login page //
  else {
    try {
      console.log(cmfunc.getTimeStamp() + `POST request to /diststaff/${req.params.did}`);
      let sql0 = `SELECT a.*, b.subdir, b.weburl `;
      sql0 += ` FROM memberx a, groupx b WHERE  (a.groupID = b.groupID)`;
      sql0 += ` AND (a.roleID=5)`; // roleID = 5 is distributor staff
      if (req.params.did > 1) {
        sql0 += ` AND (a.parentID = ${req.params.did}) `; 
      } else {
        if (req.session.groupID > 1) {
          if (req.session.roleID==1) {
            sql0 += ` AND (a.groupID = ${req.session.groupID}) `;
          } else {
            sql0 = `SELECT a.*, c.subdir `;
            sql0 += ` FROM memberx a, memberx b, groupx c WHERE  (b.groupID = c.groupID)`;
            sql0 += ` AND (a.roleID=5) AND (a.parentID = b.memberID) AND (b.parentID = ${req.session.memberID})`; // roleID = 5 is distributor staff
          }
        }   
      }
      //console.log("sql0: " + sql0);
      tbls['memberx'].execSSQL(sql0, req.body, function(error, result) {
        if (error) throw error;
        res.send(result);
      })
    } catch (error) {
      res.send({ error: -1, message: 'Unknown exception' });
      console.log('API-Exception', error);
    }
  }
});

app.get('/diststaff/:did', function(req, res, next){
  if (cmfunc.isEmpty(req.session.user)) { res.redirect('/'); }// if user is not logged-in redirect back to login page //
  else {
    try {
      console.log(cmfunc.getTimeStamp() + `GET request to /diststaff/${req.params.did}`);
      let sql0 = `SELECT a.memberID, a.name`;
      sql0 += ` FROM memberx a, groupx b WHERE  (a.groupID = b.groupID) AND (a.status = 1)`;
      sql0 += ` AND (a.roleID=5)`; // roleID = 5 is distributor staff
      if (req.params.did > 1) {
        sql0 += ` AND (a.parentID = ${req.params.did}) `; 
      } else {
        if (req.session.groupID > 1) {
          if (req.session.roleID==1) {
            sql0 += ` AND (a.groupID = ${req.session.groupID}) `;
          } else {
            sql0 = `SELECT a.*, c.subdir `;
            sql0 += ` FROM memberx a, memberx b, groupx c WHERE  (b.groupID = c.groupID)`;
            sql0 += ` AND (a.roleID=5) AND (a.parentID = b.memberID) AND (b.parentID = ${req.session.memberID})`; // roleID = 5 is distributor staff
          }
        }   
      }
      console.log("sql0: " + sql0);
      tbls['memberx'].execSQL(sql0, function(error, result) {
        if (error) throw error;
        res.send(result);
      })
    } catch (error) {
      res.send({ error: -1, message: 'Unknown exception' });
      console.log('API-Exception', error);
    }
  }
});

app.get('/agent/:gid', function(req, res, next){
  if (cmfunc.isEmpty(req.session.user)) { res.redirect('/'); }// if user is not logged-in redirect back to login page //
  else {
    try {
      console.log(cmfunc.getTimeStamp() + `GET request to /agent/${req.params.gid}`);
      if ((req.session.roleID < 3) && (req.params.gid > 1) ) {
        let sql0 = `SELECT a.memberID, a.company, a.name, b.subdir, CONCAT(a.company,"/",a.name) AS "compname"  `;
        sql0 += ` FROM memberx a, groupx b WHERE  (a.groupID = b.groupID) AND (a.roleID = 6)`;
        sql0 += ` AND (a.groupID = ${req.params.gid}) `; 
        console.log("sql0: " + sql0);
        tbls['memberx'].execSQL(sql0, function(error, result) {
          if (error) throw error;
          result.push({'memberID': 0, 'company': '  ---- ', 'compname': '  ---- '});
          //console.log(result)
          res.send(result);
        })
      } else {
        res.send([]);
      }
    } catch (error) {
      res.send({ error: -1, message: 'Unknown exception' });
      console.log('API-Exception', error);
    }
  }
});
app.post('/agent/:dsid', function(req, res, next){
  if (cmfunc.isEmpty(req.session.user)) { res.redirect('/'); }// if user is not logged-in redirect back to login page //
  else {
    try {
      console.log(cmfunc.getTimeStamp() + `POST request to /agent/${req.params.dsid}`);
      let sql0 = `SELECT a.*, b.subdir, b.weburl `;
      sql0 += ` FROM memberx a, groupx b WHERE  (a.groupID = b.groupID)`;
      sql0 += ` AND (a.roleID=6)`; // roleID = 6 is agent
      if (req.params.dsid > 1) {
        sql0 += ` AND (a.parentID = ${req.params.dsid}) `; 
      } else {
        if (req.session.groupID > 1) {
          if (req.session.roleID==1) {
            sql0 += ` AND (a.groupID = ${req.session.groupID}) `;
          } else {
            sql0 = `SELECT a.*, c.subdir `;
            sql0 += ` FROM memberx a, memberx b, groupx c WHERE  (b.groupID = c.groupID)`;
            sql0 += ` AND (a.roleID=6) AND (a.parentID = b.memberID) AND (b.parentID = ${req.session.memberID})`; // roleID = 6 is agent
          }
        }   
      }
      //console.log("sql0: " + sql0);
      tbls['memberx'].execSQL(sql0, function(error, result) {
        if (error) throw error;
        res.send(result);
      })
  
    } catch (error) {
      res.send({ error: -1, message: 'Unknown exception' });
      console.log('API-Exception', error);
    }
  }
});

app.post('/agestaff', function(req, res, next){
  var fn = function findABG(dat){
    return new Promise(function(resolve, reject) {
        var sql = `SELECT AVG(star) AS "avgvalue" FROM sale WHERE (agentStaffID = ${dat.memberID}) `;
        console.log("sql: " + sql);
        tbls['sale'].execSQL(sql, function(error, data) {
            if (error) {  reject(error);
            } else {
              dat.avgrating = data[0].avgvalue;
              resolve(dat)
            }
        })
    })
  }
  if (cmfunc.isEmpty(req.session.user)) { res.redirect('/'); }// if user is not logged-in redirect back to login page //
  else {
    try {
      console.log(cmfunc.getTimeStamp() + `POST request to /agestaff`);
      let sql0 = `SELECT a.*, b.subdir, b.weburl `;
      sql0 += ` FROM memberx a, groupx b WHERE  (a.groupID = b.groupID)`;
      sql0 += ` AND( (a.roleID=7) OR (a.roleID=6))`; // roleID = 7, 6 is agent staff and agent respectively
      sql0 += ` AND (a.groupID = ${req.session.groupID}) `; 
      console.log("sql0: " + sql0);
      tbls['memberx'].execSQL(sql0, function(error, result) {
        if (error) throw error;
        var actions = result.map(fn);
        var results = Promise.all(actions).then( function (da1) {
            result.data = da1;
            res.send(result);
        })
        
      })
  
    } catch (error) {
      res.send({ error: -1, message: 'Unknown exception' });
      console.log('API-Exception', error);
    }
  }
});

app.post('/customer', function(req, res, next){
  if (cmfunc.isEmpty(req.session.user)) { res.redirect('/'); }// if user is not logged-in redirect back to login page //
  else {
    try {
      console.log(cmfunc.getTimeStamp() + `POST request to /customer`);
      //console.log("req.body: " + JSON.stringify(req.body, false,4))
      var found = false;
      var sql0 = '';
      if (req.session.groupID >  1) {
        sql0 += `SELECT a.*, d.subdir `;
        sql0 += ` FROM  memberx a, groupx d WHERE  (a.groupID = d.groupID)`;
        sql0 += ` AND (d.groupID = ${req.session.groupID}) AND (a.roleID=3)`; 
        var found = true;  
      } else {
        sql0 += `SELECT a.*, d.subdir `;
        sql0 += ` FROM  memberx a, groupx d WHERE  (a.groupID = d.groupID)`;
        sql0 += ` AND  (a.roleID=3)`; 
        var found = true;  
      } 
      if (found) {
        console.log("sql0: " + sql0);
        tbls['memberx'].execSQL(sql0, function(error, result) {
          if (error) throw error;
          res.send(result)
        })
      } else {
        res.send([])
      }
      
  
    } catch (error) {
      res.send({ error: -1, message: 'Unknown exception' });
      console.log('API-Exception', error);
    }
  }
});

app.post('/supplier', function(req, res, next){
  if (cmfunc.isEmpty(req.session.user)) { res.redirect('/'); }// if user is not logged-in redirect back to login page //
  else {
    try {
      console.log(cmfunc.getTimeStamp() + `POST request to /supplier`);
      //console.log("req.body: " + JSON.stringify(req.body, false,4))
      var sql0 = '';
      sql0 += `SELECT a.*, d.subdir `;
      sql0 += ` FROM memberx a, groupx d WHERE  (a.groupID = d.groupID)`;
      sql0 += ` AND (d.groupID = ${req.session.groupID}) AND (a.roleID=8) `; 
      console.log("sql0: " + sql0);
      tbls['memberx'].execSSQL(sql0, req.body, function(error, result) {
        if (error) throw error;
        res.send(result)
      })
  
    } catch (error) {
      res.send({ error: -1, message: 'Unknown exception' });
      console.log('API-Exception', error);
    }
  }
});

app.post('/manstaff', function(req, res, next){
  if (cmfunc.isEmpty(req.session.user)) { res.redirect('/'); }// if user is not logged-in redirect back to login page //
  else {
    try {
      console.log(cmfunc.getTimeStamp() + `POST request to /manstaff`);
      let sql0 = `SELECT a.*, b.subdir, b.weburl `;
      sql0 += ` FROM memberx a, groupx b WHERE  (a.groupID = b.groupID)`;
      sql0 += ` AND (a.roleID=2)`; // roleID = 2 is directorboard staff
      sql0 += ` AND (a.groupID = ${req.session.groupID}) `;  
      //console.log("sql0: " + sql0);
      if (Object.keys(req.body).length === 0 && req.body.constructor === Object) {
        tbls['memberx'].execSQL(sql0, function(error, result) {
          if (error) throw error;
          res.send(result);
        })
      } else {
        tbls['memberx'].execSSQL(sql0, req.body, function(error, result) {
          if (error) throw error;
          res.send(result);
        })
      }
    } catch (error) {
      res.send({ error: -1, message: 'Unknown exception' });
      console.log('API-Exception', error);
    }
  }
});
app.post('/rating/:asid', function(req, res, next){
  if (cmfunc.isEmpty(req.session.user)) { res.redirect('/'); }// if user is not logged-in redirect back to login page //
  else {
    try {
      console.log(cmfunc.getTimeStamp() + `POST request to /rating/${req.params.asid}`);
      let sql0 = `SELECT a.*, b.name AS "customerName", b.phone `;
      sql0 += ` FROM sale a, memberx b WHERE  (a.customerID = b.memberID) AND (a.agentstaffID= ${req.params.asid}) AND  (a.status = 1) AND (a.star > 0)`;
      console.log("sql0: " + sql0);
      tbls['sale'].execSQL(sql0, function(error, result) {
        if (error) throw error;
        console.table(result.data)
        res.send(result);
      })
  
    } catch (error) {
      res.send({ error: -1, message: 'Unknown exception' });
      console.log('API-Exception', error);
    }
  }
});


//**************************************************************** */
app.get('/brand/:gid', function(req, res, next){
  if (cmfunc.isEmpty(req.session.user)) { res.redirect('/'); }// if user is not logged-in redirect back to login page //
  else {
    try {
      console.log(cmfunc.getTimeStamp() + `GET request to /brand/${req.params.gid}`);
      let sql0 = `SELECT a.*, b.subdir, c.name AS 'lastpersonName' `;
      sql0 += ` FROM brand a, groupx b, memberx c WHERE  (a.groupID = b.groupID) AND (a.lastPerson = c.memberID)`;
      if (req.params.gid > 1) {
        sql0 += ` AND (a.groupID=${req.params.gid})  AND (a.status > 0)  `; 
      } else {
        if (req.session.groupID > 1) {
          if (req.session.roleID == 1) {
            sql0 += ` AND (a.groupID=${req.session.groupID})`;
          }
        }  
      } 
      //console.log("sql0: " + sql0);
      tbls['brand'].execSQL(sql0, function(error, result) {
        if (error) throw error;
        res.send(result);
      })
      
    } catch (error) {
      res.send({ error: -1, message: 'Unknown exception' });
      console.log('API-Exception', error);
    }
  }
});

app.get('/category/:gid', function(req, res, next){
  if (cmfunc.isEmpty(req.session.user)) { res.redirect('/'); }// if user is not logged-in redirect back to login page //
  else {
    try {
      console.log(cmfunc.getTimeStamp() + `GET request to /category/${req.params.gid}`);
      let sql0 = `SELECT a.*, b.subdir, c.name AS 'lastpersonName' `;
      sql0 += ` FROM category a, groupx b, memberx c WHERE  (a.groupID = b.groupID) AND (a.lastPerson = c.memberID)`;
      if (req.params.gid > 1) {
        sql0 += ` AND (a.groupID=${req.params.gid}) `; 
      } else {
        if (req.session.groupID > 1) {
          if (req.session.roleID == 1) {
            sql0 += ` AND (a.groupID=${req.session.groupID})`;
          }
        }  
      } 
      console.log("sql0: " + sql0);
      tbls['category'].execSQL(sql0, function(error, result) {
        if (error) throw error;
        res.send(result);
      })
      
    } catch (error) {
      res.send({ error: -1, message: 'Unknown exception' });
      console.log('API-Exception', error);
    }
  }
});

app.get('/illness/:gid', function(req, res, next){
  if (cmfunc.isEmpty(req.session.user)) { res.redirect('/'); }// if user is not logged-in redirect back to login page //
  else {
    try {
      console.log(cmfunc.getTimeStamp() + `GET request to /illness/${req.params.gid}`);
      let sql0 = `SELECT a.*, b.subdir, c.name AS 'lastpersonName' `;
      sql0 += ` FROM illness a, groupx b, memberx c WHERE  (a.groupID = b.groupID) AND  (a.lastPerson = c.memberID)`;
      console.log("sql0: " + sql0);
      tbls['illness'].execSQL(sql0, function(error, result) {
        if (error) throw error;
        res.send(result);
      })
      
    } catch (error) {
      res.send({ error: -1, message: 'Unknown exception' });
      console.log('API-Exception', error);
    }
  }
});



app.get('/symptom/:gid', function(req, res, next){
  if (cmfunc.isEmpty(req.session.user)) { res.redirect('/'); }// if user is not logged-in redirect back to login page //
  else {
    try {
      console.log(cmfunc.getTimeStamp() + `GET request to /symptom/${req.params.gid}`);
      let sql0 = `SELECT a.*, c.name AS 'lastpersonName' `;
      sql0 += ` FROM symptom a,  memberx c WHERE (a.lastPerson = c.memberID)`;
      console.log("sql0: " + sql0);
      tbls['symptom'].execSQL(sql0, function(error, result) {
        if (error) throw error;
        res.send(result);
      })
      
    } catch (error) {
      res.send({ error: -1, message: 'Unknown exception' });
      console.log('API-Exception', error);
    }
  }
});

app.get('/illnessSymptom/:iid', function(req, res, next){
  if (cmfunc.isEmpty(req.session.user)) { res.redirect('/'); }// if user is not logged-in redirect back to login page //
  else {
    try {
      console.log(cmfunc.getTimeStamp() + `GET request to /illsymptomness/${req.params.iid}`);
      let sql0 = `SELECT a.*, b.symptomName `;
      sql0 += ` FROM illnessSymptom a, symptom b WHERE (a.symptomID = b.symptomID) AND (a.illnessID = ${req.params.iid})`;
      console.log("sql0: " + sql0);
      tbls['illnessSymptom'].execSQL(sql0, function(error, result) {
        if (error) throw error;
        res.send(result);
      })
      
    } catch (error) {
      res.send({ error: -1, message: 'Unknown exception' });
      console.log('API-Exception', error);
    }
  }
});

app.get('/toa/:gid/:iid', function(req, res, next){
  if (cmfunc.isEmpty(req.session.user)) { res.redirect('/'); }// if user is not logged-in redirect back to login page //
  else {
    try {
      console.log(cmfunc.getTimeStamp() + `GET request to /toa/${req.params.gid}/${req.params.iid}`);
      let sql0 = `SELECT a.*, b.subdir, c.name AS 'lastpersonName', `;
      sql0 += ` d.illness_vi, d.illness_en, d.illness_cn, d.illness_ru, d.illness_kr `
      sql0 += ` FROM toa a, groupx b, memberx c, illness d WHERE  (a.groupID = b.groupID) AND  (a.lastPerson = c.memberID)`;
      sql0 += ` AND (a.illnessID = d.illnessID) AND (a.groupID=${req.params.gid})`;
      if (req.params.iid > 0) {
        sql0 += ` AND (a.illnessID = ${req.params.iid})`;
        console.log("sql0: " + sql0);
        tbls['toa'].execSQL(sql0, function(error, result) {
          if (error) throw error;
          res.send(result);
        })
      } else {
        res.send([]);
      }
    } catch (error) {
      res.send({ error: -1, message: 'Unknown exception' });
      console.log('API-Exception', error);
    }
  }
});


app.post('/toa/:gid/:iid', function(req, res, next){
  if (cmfunc.isEmpty(req.session.user)) { res.redirect('/'); }// if user is not logged-in redirect back to login page //
  else {
    try {
      console.log(cmfunc.getTimeStamp() + `POST request to /toa/${req.params.gid}/${req.params.iid}`);
      console.log(req.body)
      let sql0 = `SELECT a.toaproductID, a.toaID, a.productID, a.qty, b.comment, b.priceoption, b.toaprice, b.toacost,`;
      sql0 += ` d.categoryName, c.taxrate, c.qtyperBox, c.typeID, c.barcode, c.costperitem, `
      sql0 += ` c.productName, c.unitPrice2, c.unitMeasure, c.unitMeasure2, c.unitPrice2 `
      sql0 += ` FROM toaproduct a, toa b, product c, category d WHERE  (a.toaID = b.toaID) AND  (b.groupID = ${req.params.gid})`;
      sql0 += ` AND (a.productID = c.productID) AND (b.illnessID = ${req.params.iid}) AND (c.categoryID = d.categoryID)`;
      sql0 += ` AND (b.agegroup = ${req.body.agevalue}) `;
      sql0 += ` AND (b.weight = ${req.body.weightvalue}) `;
      sql0 += ` AND (b.cough = ${req.body.coughvalue}) `;
      sql0 += ` AND (b.headacefever = ${req.body.headacefevervalue}) `;
      sql0 += ` AND (b.stomach = ${req.body.stomachvalue}) `;
      sql0 += ` AND (b.sleepy = ${req.body.sleepvalue}) `;
      sql0 += ` AND (b.diabetic = ${req.body.diabeticvalue}) `;
      sql0 += ` AND (b.bloodpressure = ${req.body.bloodpressurevalue}) `;
      sql0 += ` AND (b.allergy = ${req.body.allergyvalue}) `;
      console.log("sql0: " + sql0);
      tbls['toaproduct'].execSQL(sql0, function(error, result) {
        if (error) throw error;
        res.send(result);
      })
    } catch (error) {
      res.send({ error: -1, message: 'Unknown exception' });
      console.log('API-Exception', error);
    }
  }
});

app.get('/promotion/:gid', function(req, res, next){
  if (cmfunc.isEmpty(req.session.user)) { res.redirect('/'); }// if user is not logged-in redirect back to login page //
  else {
    try {
      console.log(cmfunc.getTimeStamp() + `GET request to /promotion/${req.params.gid}`);
      let sql0 = `SELECT a.*, b.subdir, c.name AS 'lastpersonName' `;
      sql0 += ` FROM promotion a, groupx b, memberx c WHERE  (a.groupID = b.groupID) AND (a.lastPerson = c.memberID)`;
      if (req.params.gid > 1) {
        sql0 += ` AND (a.groupID=${req.params.gid})  AND (a.status > 0) `; 
      } else {
        if (req.session.groupID > 1) {
          if (req.session.roleID == 1) {
            sql0 += ` AND (a.groupID=${req.session.groupID})`;
          }
        }  
      } 
      //console.log("sql0: " + sql0);
      tbls['category'].execSQL(sql0, function(error, result) {
        if (error) throw error;
        res.send(result);
      })
      
    } catch (error) {
      res.send({ error: -1, message: 'Unknown exception' });
      console.log('API-Exception', error);
    }
  }
});

app.get('/vendor/:gid', function(req, res, next){
  if (cmfunc.isEmpty(req.session.user)) { res.redirect('/'); }// if user is not logged-in redirect back to login page //
  else {
    try {
      console.log(cmfunc.getTimeStamp() + `GET request to /vendor/${req.params.gid}`);
      let sql0 = `SELECT a.*, b.subdir, c.name AS 'lastpersonName' `;
      sql0 += ` FROM vendor a, groupx b, memberx c WHERE  (a.groupID = b.groupID) AND (a.lastPerson = c.memberID)`;
      if (req.params.gid > 1) {
        sql0 += ` AND (a.groupID=${req.params.gid}) AND (a.status > 0)  `; 
      } 
      console.log("sql0: " + sql0);
      tbls['vendor'].execSQL(sql0, function(error, result) {
        if (error) throw error;
        res.send(result);
      })
      
    } catch (error) {
      res.send({ error: -1, message: 'Unknown exception' });
      console.log('API-Exception', error);
    }
  }
});

app.post('/product/:gid/:cidx', function(req, res, next){
  if (cmfunc.isEmpty(req.session.user)) { res.redirect('/'); }// if user is not logged-in redirect back to login page //
  else {
    try {
      console.log(cmfunc.getTimeStamp() + `POST request to /product/${req.params.gid}/${req.params.cidx}`);
      var cid = req.params.cidx.split("&")[0];
      var scid = req.params.cidx.split("&")[1];
      let sql0 = `SELECT a.*, e.subdir, d.name AS 'lastpersonName',  e.name `;
      sql0 += ` FROM product a, memberx d, groupx e WHERE (a.lastPerson = d.memberID)`;
      sql0 += ` AND  (a.groupID = e.groupID)`;
      if (cid > 0) {
        sql0 += ` AND (a.categoryID=${cid})`; 
        if (scid >= 0) {
          sql0 += ` AND (a.subcatID=${scid})`; 
        }
      } else if (req.params.gid > 1) {
        sql0 += ` AND (e.groupID = ${req.params.gid})`; 
      } 
      console.log("sql0: " + sql0);
      //console.log("req.body: " + JSON.stringify(req.body,false,4));
      tbls['product'].execSSQL(sql0, req.body, function(error, result) {
        if (error) throw error;
        res.send(result);
      })
      
    } catch (error) {
      res.send({ error: -1, message: 'Unknown exception' });
      console.log('API-Exception', error);
    }
  }
});

app.post('/product/:gid', function(req, res, next){
  if (cmfunc.isEmpty(req.session.user)) { res.redirect('/'); }// if user is not logged-in redirect back to login page //
  else {
    try {
      console.log(cmfunc.getTimeStamp() + `POST request to /product/${req.params.gid}`);
      let sql0 = `SELECT a.*, e.subdir, d.name AS 'lastpersonName',  e.name `;
      sql0 += ` FROM product a,  memberx d, groupx e WHERE (a.lastPerson = d.memberID)`;
      sql0 += ` AND (a.groupID = e.groupID)`;
      if (req.params.gid > 1) {
        sql0 += ` AND (e.groupID = ${req.params.gid})`; 
      } 
      console.log("sql0: " + sql0);
      //console.log("req.body: " + JSON.stringify(req.body,false,4));
      tbls['product'].execSQL(sql0,  function(error, result) {
        if (error) throw error;
        res.send(result);
      })
      
    } catch (error) {
      res.send({ error: -1, message: 'Unknown exception' });
      console.log('API-Exception', error);
    }
  }
});

app.post('/product2/:gid', function(req, res, next){
  if (cmfunc.isEmpty(req.session.user)) { res.redirect('/'); }// if user is not logged-in redirect back to login page //
  else {
    try {
      console.log(cmfunc.getTimeStamp() + `POST request to /product2/${req.params.gid}`);
      let sql0 = `SELECT a.productID, a.productName, a.unitMeasure, a.unitMeasure2, a.costperitem, a.barcode, b.categoryName, `;
      sql0 += ` a.unitPrice, a.unitPrice2, a.categoryID, a.typeID, a.stockqty, a.countqty, a.qtyperBox, a.lastChanged, a.lastexpiryDate `;
      sql0 += ` FROM product a, category b WHERE (a.groupID = ${req.params.gid}) AND (a.categoryID=b.categoryID)`;
      console.log("sql0: " + sql0);
      //console.log("req.body: " + JSON.stringify(req.body,false,4));
      tbls['product'].execSSQL(sql0, req.body, function(error, result) {
        if (error) throw error;
        res.send(result);
      })
      
    } catch (error) {
      res.send({ error: -1, message: 'Unknown exception' });
      console.log('API-Exception', error);
    }
  }
});

app.post('/product/:prodid', function(req, res, next){
  if (cmfunc.isEmpty(req.session.user)) { res.redirect('/'); }// if user is not logged-in redirect back to login page //
  else {
    try {
      console.log(cmfunc.getTimeStamp() + `POST request to /product/${req.params.prodid}`);
      let sql0 = `SELECT a.*, e.subdir, d.name AS 'lastpersonName', b.brandName, c.categoryName, e.name `;
      sql0 += ` FROM product a, brand b, category c, memberx d, groupx e WHERE (a.lastPerson = d.memberID)`;
      sql0 += ` AND (a.brandID = b.brandID) AND (a.categoryID = c.categoryID) AND (a.groupID = e.groupID) AND (a.productID > 2)`;
      sql0 += ` AND (a.productID = ${req.params.prodid})`; 
      console.log("sql0: " + sql0);
      //console.log("req.body: " + JSON.stringify(req.body,false,4));
      tbls['product'].execSSQL(sql0, req.body, function(error, result) {
        if (error) throw error;
        res.send(result);
      })
      
    } catch (error) {
      res.send({ error: -1, message: 'Unknown exception' });
      console.log('API-Exception', error);
    }
  }
});

app.post('/toaproduct/:tid', function(req, res, next){
  if (cmfunc.isEmpty(req.session.user)) { res.redirect('/'); }// if user is not logged-in redirect back to login page //
  else {
    try {
      console.log(cmfunc.getTimeStamp() + `POST request to /toaproduct/${req.params.tid}`);
      let sql0 = `SELECT a.toaproductID, a.toaID, a.qty, b.* `;
      sql0 += ` FROM toaproduct a, product b  WHERE (a.productID = b.productID)`;
      sql0 += ` AND (a.toaID = ${req.params.tid})`; 
      sql0 += ` ORDER BY b.productName `;
      console.log("sql0: " + sql0);
      //console.log("req.body: " + JSON.stringify(req.body,false,4));
      tbls['product'].execSQL(sql0,  function(error, result) {
        if (error) throw error;
        res.send(result);
      })
      
    } catch (error) {
      res.send({ error: -1, message: 'Unknown exception' });
      console.log('API-Exception', error);
    }
  }
});

app.post('/copyprescription/:tid', function(req, res, next){
  if (cmfunc.isEmpty(req.session.user)) { res.redirect('/'); }// if user is not logged-in redirect back to login page //
  else {
    try {
      console.log(cmfunc.getTimeStamp() + `POST request to /copyprescription/${req.params.tid}`);
      let sql0 = `INSERT INTO toa (groupID, illnessID, sex, agegroup, weight, cough, headacefever, stomach, sleepy, diabetic, bloodpressure, allergy, status, comment, priceoption, lastPerson )`;
      sql0 += ` SELECT groupID, illnessID, sex, agegroup, weight, cough, headacefever, 0, 0, diabetic, bloodpressure, allergy, status, comment, priceoption, ${req.session.memberID}`; 
      sql0 += ` FROM toa WHERE (toaID = ${req.params.tid})`; 
      console.log("sql0: " + sql0);
      //console.log("req.body: " + JSON.stringify(req.body,false,4));
      tbls['toa'].execSQL(sql0,  function(error, result) {
        if (error) throw error;
        sql0 = `INSERT INTO toaproduct (toaID, productID, qty)`;
        sql0 += ` SELECT ${result.insertId}, productID, qty FROM toaproduct WHERE (toaID = ${req.params.tid})`;
        tbls['toaproduct'].execSQL(sql0,  function(errorx, resultx) {
          if (errorx) res.send(JSON.stringify({status: 0}))
          res.send(JSON.stringify({status: 1}))
        })
      })
      
    } catch (error) {
      res.send({ error: -1, message: 'Unknown exception' });
      console.log('API-Exception', error);
    }
  }
});

app.post('/copyprescription/:tid/:agegroupid', function(req, res, next){
  if (cmfunc.isEmpty(req.session.user)) { res.redirect('/'); }// if user is not logged-in redirect back to login page //
  else {
    try {
      console.log(cmfunc.getTimeStamp() + `POST request to /copyprescription/${req.params.tid}/${req.params.agegroupid}`);
      const sqlT1 = `INSERT INTO toa (groupID, illnessID, agegroup, weight, cough, headacefever, stomach, sleepy, priceoption, diabetic, bloodpressure, allergy, status, comment, lastPerson )`;
      let sql0 = ` SELECT groupID, illnessID, agegroup, weight, cough, headacefever, stomach, sleepy, priceoption, diabetic, bloodpressure, allergy,  status, comment, ${req.session.memberID}`; 
      sql0 += ` FROM toa WHERE (toaID = ${req.params.tid})`; 
      console.log("sql0A: " + sql0);
      tbls['toa'].execSQL(sql0,  function(errora, resulta) {
        if (errora) throw errora;
        var seltid = Object.values(JSON.parse(JSON.stringify(resulta)))[0];
        //console.log(seltid);
        sql0 = sqlT1;
        sql0 += `VALUES `;
        //sql0 += `(${seltid.groupID}, ${seltid.illnessID},  ${seltid.agegroup}, ${seltid.weight}, ${seltid.cough}, ${seltid.headacefever}, 0, 0, 0, 0, 0, 0, 1, '${seltid.comment}',  ${req.session.memberID}),`;
        sql0 += `(${seltid.groupID}, ${seltid.illnessID}, ${seltid.agegroup}, ${seltid.weight}, ${seltid.cough}, ${seltid.headacefever}, 0, 1, 0, '${seltid.diabetic}', '${seltid.bloodpressure}', '${seltid.allergy}', 1,'${seltid.comment}',  ${req.session.memberID}),`;
        sql0 += `(${seltid.groupID}, ${seltid.illnessID}, ${seltid.agegroup}, ${seltid.weight}, ${seltid.cough}, ${seltid.headacefever}, 1, 0, 0, '${seltid.diabetic}', '${seltid.bloodpressure}', '${seltid.allergy}', 1,'${seltid.comment}',  ${req.session.memberID}),`;
        sql0 += `(${seltid.groupID}, ${seltid.illnessID}, ${seltid.agegroup}, ${seltid.weight}, ${seltid.cough}, ${seltid.headacefever}, 1, 1, 0, '${seltid.diabetic}', '${seltid.bloodpressure}', '${seltid.allergy}', 1,'${seltid.comment}',  ${req.session.memberID}),`;
        sql0 += `(${seltid.groupID}, ${seltid.illnessID}, ${seltid.agegroup}, ${seltid.weight}, ${seltid.cough}, ${seltid.headacefever}, 0, 0, 1, '${seltid.diabetic}', '${seltid.bloodpressure}', '${seltid.allergy}', 1,'${seltid.comment}',  ${req.session.memberID}),`;
        sql0 += `(${seltid.groupID}, ${seltid.illnessID}, ${seltid.agegroup}, ${seltid.weight}, ${seltid.cough}, ${seltid.headacefever}, 0, 1, 1, '${seltid.diabetic}', '${seltid.bloodpressure}', '${seltid.allergy}', 1,'${seltid.comment}',  ${req.session.memberID}),`;
        sql0 += `(${seltid.groupID}, ${seltid.illnessID}, ${seltid.agegroup}, ${seltid.weight}, ${seltid.cough}, ${seltid.headacefever}, 1, 0, 1, '${seltid.diabetic}', '${seltid.bloodpressure}', '${seltid.allergy}', 1,'${seltid.comment}',  ${req.session.memberID}),`;
        sql0 += `(${seltid.groupID}, ${seltid.illnessID}, ${seltid.agegroup}, ${seltid.weight}, ${seltid.cough}, ${seltid.headacefever}, 1, 1, 1, '${seltid.diabetic}', '${seltid.bloodpressure}', '${seltid.allergy}', 1,'${seltid.comment}',  ${req.session.memberID}),`;
        sql0 += `(${seltid.groupID}, ${seltid.illnessID}, ${seltid.agegroup}, ${seltid.weight}, ${seltid.cough}, ${seltid.headacefever}, 0, 0, 2, '${seltid.diabetic}', '${seltid.bloodpressure}', '${seltid.allergy}', 1,'${seltid.comment}',  ${req.session.memberID}),`;
        sql0 += `(${seltid.groupID}, ${seltid.illnessID}, ${seltid.agegroup}, ${seltid.weight}, ${seltid.cough}, ${seltid.headacefever}, 0, 1, 2, '${seltid.diabetic}', '${seltid.bloodpressure}', '${seltid.allergy}', 1,'${seltid.comment}',  ${req.session.memberID}),`;
        sql0 += `(${seltid.groupID}, ${seltid.illnessID}, ${seltid.agegroup}, ${seltid.weight}, ${seltid.cough}, ${seltid.headacefever}, 1, 0, 2, '${seltid.diabetic}', '${seltid.bloodpressure}', '${seltid.allergy}', 1,'${seltid.comment}',  ${req.session.memberID}),`;
        sql0 += `(${seltid.groupID}, ${seltid.illnessID}, ${seltid.agegroup}, ${seltid.weight}, ${seltid.cough}, ${seltid.headacefever}, 1, 1, 2, '${seltid.diabetic}', '${seltid.bloodpressure}', '${seltid.allergy}', 1,'${seltid.comment}',  ${req.session.memberID});`;
        console.log("sql0B: " + sql0);
        //console.log("req.body: " + JSON.stringify(req.body,false,4));
        tbls['toa'].execSQL(sql0,  function(errorb, resultb) {
          if (errorb) throw errorb;
          sql0 = ``;
          for (var i=0; i < 11; i++) {
            sql0 += `INSERT INTO toaproduct (toaID, productID, qty)`;
            sql0 += ` SELECT ${resultb.insertId + i}, productID, qty FROM toaproduct WHERE (toaID = ${req.params.tid});`;
          }
          console.log("sql0C: " + sql0);
          tbls['toaproduct'].execSQL(sql0, function(errorx, resultx) {
            if (errorx) res.send(JSON.stringify({status: 0}))
            res.send(JSON.stringify({status: 1}))
          })
        })
      })
      
      
    } catch (error) {
      res.send({ error: -1, message: 'Unknown exception' });
      console.log('API-Exception', error);
    }
  }
});

app.post('/prodcount', function(req, res, next){
  if (cmfunc.isEmpty(req.session.user)) { res.redirect('/'); }// if user is not logged-in redirect back to login page //
  else {
    try {
      console.log(cmfunc.getTimeStamp() + `POST request to /prodcount`);
      console.log(req.body)
      var data= req.body;
      let sql0 = `SELECT  a.prodcountID, b.productName, b.unitMeasure, b.unitMeasure2, b.costperitem, b.qtyperBox, `;
      sql0 += ` b.unitPrice, b.unitPrice2, a.productID,  a.countqty, a.stockqty, a.countedDate `;
      sql0 += ` FROM prodcount a, product b WHERE (b.groupID = ${req.session.groupID}) AND (a.productID = b.productID) `;
      sql0 += ` AND  ( TO_DAYS(a.countedDate) >= TO_DAYS('${data.fromdate}')) AND ( TO_DAYS(a.countedDate) <= TO_DAYS('${data.todate}'))`;
      console.log("sql0: " + sql0);
      //console.log("req.body: " + JSON.stringify(req.body,false,4));
      tbls['prodcount'].execSQL(sql0, function(error, result) {
        if (error) throw error;
        res.send(result);
      })
      
    } catch (error) {
      res.send({ error: -1, message: 'Unknown exception' });
      console.log('API-Exception', error);
    }
  }
});

app.post('/rawstock/:gid', function(req, res, next){
  if (cmfunc.isEmpty(req.session.user)) { res.redirect('/'); }// if user is not logged-in redirect back to login page //
  else {
    try {
      console.log(cmfunc.getTimeStamp() + `POST request to /rawstock/${req.params.gid}`);
      let sql0 = `SELECT a.*, e.subdir, d.name AS 'lastpersonName', e.name `;
      sql0 += ` FROM rawstock a, memberx d, groupx e WHERE (a.lastPerson = d.memberID)`;
      sql0 += ` AND (a.groupID = e.groupID)`;
      if (req.params.gid > 1) {
        sql0 += ` AND (e.groupID = ${req.params.gid})`; 
      } 
      console.log("sql0: " + sql0);
      //console.log("req.body: " + JSON.stringify(req.body,false,4));
      tbls['rawstock'].execSSQL(sql0, req.body, function(error, result) {
        if (error) throw error;
        res.send(result);
      })
      
    } catch (error) {
      res.send({ error: -1, message: 'Unknown exception' });
      console.log('API-Exception', error);
    }
  }
});

app.post('/rawstockXfer/:rid', function(req, res, next){
  if (cmfunc.isEmpty(req.session.user)) { res.redirect('/'); }// if user is not logged-in redirect back to login page //
  else {
    try {
      console.log(cmfunc.getTimeStamp() + `POST request to /rawstockXfer/${req.params.rid}`);
      let sql0 = `SELECT a.*, b.rawstockName,  b.qrcodeID, b.costperitem, b.unitMeasure,  b.taxrate, d.name AS 'lastpersonName', e.subdir, `;
      sql0 += ` c.company AS 'scompany', c.phone AS 'sphone', c.name AS 'sname', c.address AS 'saddress', `;
      sql0 +=  `e.name AS 'sxname', e.address AS 'sxaddress', e.abn, e.phone AS 'hotline', e.email AS 'sxemail', e.imgLink AS 'logox' `;
      sql0 += ` FROM rawstockXfer a, rawstock b, memberx c, memberx d, groupx e WHERE (a.lastPerson = d.memberID) `;
      sql0 += ` AND (b.groupID = e.groupID) AND (a.rawstockID = b.rawstockID)  AND (a.vendorID=c.memberID)`;
      if (req.params.rid > 0) {
        sql0 += ` AND (b.rawstockID = ${req.params.rid})`; 
      }  
      console.log("sql0: " + sql0);
      //console.log("req.body: " + JSON.stringify(req.body,false,4)); 
      tbls['rawstockXfer'].execSQL(sql0, function(error, result) {
        //console.log(result)
        if (error) throw error;
        res.send(result);
      })
    } catch (error) {
      res.send({ error: -1, message: 'Unknown exception' });
      console.log('API-Exception', error);
    }
  }
});

app.post('/prodXfer', function(req, res, next){
  if (cmfunc.isEmpty(req.session.user)) { res.redirect('/'); }// if user is not logged-in redirect back to login page //
  else {
    try {
      data = req.body;
      console.log(cmfunc.getTimeStamp() + `POST request to /prodXfer`);
      let sql0 = `SELECT a.*, b.taxrate, b.productName,  b.itemreorderqty, b.daysperreorder, b.qtyperBox, b.barcode, d.name AS 'lastpersonName', e.subdir, `;
      sql0 += ` c.company AS 'scompany', c.phone AS 'sphone', c.name AS 'sname', c.address AS 'saddress', b.costperitem, b.stockqty, b.unitPrice, b.unitPrice2,`;
      sql0 +=  `e.name AS 'sxname', e.address AS 'sxaddress', e.abn, e.phone AS 'hotline', e.email AS 'sxemail', e.imgLink AS 'logox' `;
      sql0 += ` FROM prodXfer a, product b, memberx c, memberx d, groupx e WHERE (a.lastPerson = d.memberID) `;
      sql0 += ` AND (b.groupID = e.groupID) AND (a.productID = b.productID) AND (a.vendorID=c.memberID) AND (b.groupID=${req.session.groupID})`;
      sql0 += ` AND  ( TO_DAYS(a.dateAdded) >= TO_DAYS('${data.fromdate}')) AND ( TO_DAYS(a.dateAdded) <= TO_DAYS('${data.todate}'))`;
      if (data.pid > 0) {
        sql0 += ` AND (b.productID = ${data.pid})`; 
      }  
      console.log("sql0: " + sql0);
      //console.log("req.body: " + JSON.stringify(req.body,false,4)); 
      tbls['prodXfer'].execSQL(sql0, function(error, result) {
        //console.log(result)
        if (error) throw error;
        res.send(result);
      })
    } catch (error) {
      res.send({ error: -1, message: 'Unknown exception' });
      console.log('API-Exception', error);
    }
  }
});

app.post('/prodformulalist/:pid', function(req, res, next){
  if (cmfunc.isEmpty(req.session.user)) { res.redirect('/'); }// if user is not logged-in redirect back to login page //
  else {
    try {
      console.log(cmfunc.getTimeStamp() + `POST request to /prodformulalist`);
      let found = false;
      let sql0 = `SET @row_number = 0; `;
      sql0 += ` SELECT  a.*, (@row_number:=@row_number + 1) AS 'idx', `;
      sql0 += ` d.name AS 'lastpersonName', c.rawstockName, c.unitMeasure `;
      sql0 += ` FROM prodformula a, rawstock c, memberx d WHERE  (a.productID = ${req.params.pid}) `; 
      sql0 += ` AND (a.lastPerson = d.memberID) AND (a.rawstockID = c.rawstockID)`;
      if ((req.session.groupID > 1) && (req.session.roleID==1) ) {
        sql0 +=  ` AND (c.groupID = ${req.session.groupID}) `;
        found = true;
      } else if (req.session.groupID == 1) {
        found = true;
      }
      console.log("sql0: " + sql0);
      if (found) {
        tbls['prodformula'].execSQL(sql0, function(error, result) {
          if (error) throw error;
          res.send(result[1]);
        })
      } else {
        res.send([])
      }
      
    } catch (error) {
      res.send({ error: -1, message: 'Unknown exception' });
      console.log('API-Exception', error);
    }
  }
});

app.post('/prodformulalist/:pid/:pqty', function(req, res, next){
  if (cmfunc.isEmpty(req.session.user)) { res.redirect('/'); }// if user is not logged-in redirect back to login page //
  else {
    try {
      console.log(cmfunc.getTimeStamp() + `POST request to /prodformulalist/${req.params.pid}/${req.params.pqty}`);
      var ratiox = req.params.pqty / 1000;
      let sql0 = `SET @row_number = 0; `;
      sql0 += ` SELECT a.*, (@row_number:=@row_number + 1) AS 'idx', e.qtyperBox, `;
      sql0 += ` CASE WHEN (c.unitMeasure < 2) THEN (a.qty * ${ratiox}) `;
      sql0 += ` WHEN (c.unitMeasure = 2) THEN (${req.params.pqty} * 1) `;
      sql0 += ` ELSE FLOOR(${req.params.pqty}/e.qtyperBox) END AS 'stkreq', `;
      sql0 += ` d.name AS 'lastpersonName', c.rawstockName, c.unitMeasure, c.costperitem `;
      sql0 += ` FROM prodformula a, rawstock c, memberx d, product e  WHERE `;
      sql0 += ` (a.productID = ${req.params.pid}) AND (a.productID = e.productID)`;
      sql0 += ` AND (a.lastPerson = d.memberID) AND (a.rawstockID = c.rawstockID) `;
      console.log("sql0: " + sql0);
      tbls['prodformula'].execSQL(sql0, function(error, result) {
        if (error) throw error;
        res.send(result[1]);
      })
    } catch (error) {
      res.send({ error: -1, message: 'Unknown exception' });
      console.log('API-Exception', error);
    }
  }
});

app.post('/prodformulalist/:pid', function(req, res, next){
  if (cmfunc.isEmpty(req.session.user)) { res.redirect('/'); }// if user is not logged-in redirect back to login page //
  else {
    try {
      console.log(cmfunc.getTimeStamp() + `POST request to /prodformulalist/${req.params.pid}`);
      let sql0 = `SET @row_number = 0; `;
      sql0 += ` SELECT  a.*, (@row_number:=@row_number + 1) AS 'idx', `;
      sql0 += ` d.name AS 'lastpersonName', c.rawstockName, c.unitMeasure `;
      sql0 += ` FROM prodformula a, rawstock c, memberx d WHERE  (a.productID = ${req.params.pid}) `; 
      sql0 += ` AND (a.lastPerson = d.memberID) AND (a.rawstockID = c.rawstockID)`;
      console.log("sql0: " + sql0);
      tbls['prodformula'].execSQL(sql0, function(error, result) {
        if (error) throw error;
        res.send(result[1]);
      })
      
    } catch (error) {
      res.send({ error: -1, message: 'Unknown exception' });
      console.log('API-Exception', error);
    }
  }
});

//************************************************** */
app.post('/promotionlist', function(req, res, next){
  if (cmfunc.isEmpty(req.session.user)) { res.redirect('/'); }// if user is not logged-in redirect back to login page //
  else {
    try {
      console.log(cmfunc.getTimeStamp() + `POST request to /promotionlist`);
      let sql0 = `SELECT a.*, b.name AS 'manufacturerName', b.subdir, c.name AS 'lastpersonName' `;
      sql0 += ` FROM promotion a, groupx b, memberx c WHERE  (a.groupID = b.groupID) AND (a.lastPerson = c.memberID)`;
      if (req.session.roleID == 1) {
        if (req.session.groupID > 1) {
          sql0 += ` AND (a.groupID=${req.session.groupID}) AND (a.promotionID > 1)`; 
        }
        tbls['promotion'].execSSQL(sql0, req.body, function(error, result) {
          if (error) throw error;
          res.send(result);
        })
      } else {
        res.send([]);
      }
    } catch (error) {
      res.send({ error: -1, message: 'Unknown exception' });
      console.log('API-Exception', error);
    }
  }
});

app.post('/campaignlist', function(req, res, next){
  if (cmfunc.isEmpty(req.session.user)) { res.redirect('/'); }// if user is not logged-in redirect back to login page //
  else {
    try {
      console.log(cmfunc.getTimeStamp() + `POST request to /campaignlist`);
      let sql0 = `SELECT a.*, b.name AS 'manufacturerName', b.subdir, c.name AS 'lastpersonName', `;
      sql0 += ` e.customerBonus, e.agentstaffBonus, e.agentBonus, e.diststaffBonus, e.startDate, e.endDate `;
      sql0 += ` FROM product a, groupx b, memberx c,  promotion e WHERE  (a.groupID = b.groupID) AND (a.lastPerson = c.memberID)`;
      sql0 += ` AND (a.promotionID = e.promotionID) `;
      if (req.session.roleID == 1) {
        if (req.session.groupID > 1) {
          sql0 += ` AND (a.groupID=${req.session.groupID})`; 
        }
        //console.log("sql0: " + sql0);
        tbls['product'].execSSQL(sql0, req.body, function(error, result) {
          if (error) throw error;
          res.send(result);
        })
      } else {
        res.send([]);
      }
    } catch (error) {
      res.send({ error: -1, message: 'Unknown exception' });
      console.log('API-Exception', error);
    }
  }
});


app.post('/promotypelist', function(req, res, next){
  if (cmfunc.isEmpty(req.session.user)) { res.redirect('/'); }// if user is not logged-in redirect back to login page //
  else {
    try {
      console.log(cmfunc.getTimeStamp() + `POST request to /promotypelist`);
      let sql0 = `SELECT a.*`;
      sql0 += ` FROM groupx a WHERE (a.groupID=${req.session.groupID})`;
      tbls['groupx'].execSQL(sql0, function(error, result) {
        if (error) throw error;
        console.log(result)
        res.send(result);
      })
    } catch (error) {
      res.send({ error: -1, message: 'Unknown exception' });
      console.log('API-Exception', error);
    }
  }
});
//***************** Dropdown list ***************** */
app.get('/promotion/:mid', function(req, res, next){
  if (cmfunc.isEmpty(req.session.user)) { res.redirect('/'); }// if user is not logged-in redirect back to login page //
  else {
    try {
      console.log(cmfunc.getTimeStamp() + `GET request to /promotion/${req.params.mid}`);
      let sql0 = `SELECT a.*`;
      sql0 += ` FROM promotion a, groupx b WHERE (a.groupID = b.groupID)`; 
      if (req.session.roleID == 1) {
        if (req.session.groupID > 1) {
          sql0 += ` AND (a.groupID = ${req.params.mid})  AND (a.status > 0) `
        }
        tbls['promotion'].execSQL(sql0, function(error, result) {
          if (error) throw error;
          res.send(result);
        })
      } else {
        res.send([]);
      }
    } catch (error) {
      res.send({ error: -1, message: 'Unknown exception' });
      console.log('API-Exception', error);
    }
  }
});

app.get('/product/:mid', function(req, res, next){
  if (cmfunc.isEmpty(req.session.user)) { res.redirect('/'); }// if user is not logged-in redirect back to login page //
  else {
    try {
      console.log(cmfunc.getTimeStamp() + `GET request to /product/${req.params.mid}`);
      let sql0 = `SELECT a.*`;
      sql0 += ` FROM product a,  groupx b WHERE (a.groupID = b.groupID) AND (a.status = 1) `; 
      if ((req.session.roleID < 3) || (req.session.roleID > 3) ) {
        if (req.session.groupID > 1) {
          sql0 += ` AND ((a.groupID = ${req.params.mid}) AND (a.productID > 2))`
        } 
        tbls['product'].execSQL(sql0, function(error, result) {
          if (error) throw error;
          result.push({'productID': 0, 'productName': '  ---- '});
          res.send(result);
        })
      } else {
        res.send([]);
      }
    } catch (error) {
      res.send({ error: -1, message: 'Unknown exception' });
      console.log('API-Exception', error);
    }
  }
});

app.get('/productref', function(req, res, next){
  if (cmfunc.isEmpty(req.session.user)) { res.redirect('/'); }// if user is not logged-in redirect back to login page //
  else {
    try {
      console.log(cmfunc.getTimeStamp() + `GET request to /productref`);
      let sql0 = `SELECT a.*`;
      sql0 += ` FROM product a, groupx b WHERE (a.groupID = b.groupID) `; 
      if ((req.session.roleID < 3) || (req.session.roleID > 3) ) {
        if (req.session.groupID > 1) {
          sql0 += ` AND ((a.groupID = ${req.session.groupID}) AND (a.productID > 2))`
        } 
        tbls['product'].execSQL(sql0, function(error, result) {
          if (error) throw error;
          res.send(result);
        })
      } else {
        res.send([]);
      }
    } catch (error) {
      res.send({ error: -1, message: 'Unknown exception' });
      console.log('API-Exception', error);
    }
  }
});

app.get('/productlist', function(req, res, next){
  if (cmfunc.isEmpty(req.session.user)) { res.redirect('/'); }// if user is not logged-in redirect back to login page //
  else {
    try {
      console.log(cmfunc.getTimeStamp() + `GET request to /productlist`);
      let sql0 = `SELECT a.*, c.categoryName `;
      sql0 += ` FROM product a, category c WHERE (a.groupID = ${req.session.groupID}) AND (a.status <> 0) AND (a.categoryID = c.categoryID)`; 
      tbls['product'].execSQL(sql0, function(error, result) {
        if (error) throw error;
        result.push({'productID': 0, 'productName': '  ---- '});
        res.send(result);
      })
    } catch (error) {
      res.send({ error: -1, message: 'Unknown exception' });
      console.log('API-Exception', error);
    }
  }
});

app.get('/customerlist', function(req, res, next){
  if (cmfunc.isEmpty(req.session.user)) { res.redirect('/'); }// if user is not logged-in redirect back to login page //
  else {
    try {
      console.log(cmfunc.getTimeStamp() + `GET request to /customerlist`);
      let sql0 = `SELECT  a.memberID, a.name, a.phone, a.dob, CONCAT(a.phone,' - ',a.name) AS 'namephone' `;
      sql0 += ` FROM memberx a WHERE (a.groupID = ${req.session.groupID}) AND (a.roleID=3) AND (a.status > 0) `; 
      console.log("sql0: " + sql0);
      tbls['memberx'].execSQL(sql0, function(error, result) {
        if (error) throw error;
        result.push({'memberID': 0, 'namephone': '----'});
        res.send(result);
      })
    } catch (error) {
      res.send({ error: -1, message: 'Unknown exception' });
      console.log('API-Exception', error);
    }
  }
});


app.get('/warehouse/:mid', function(req, res, next){
  if (cmfunc.isEmpty(req.session.user)) { res.redirect('/'); }// if user is not logged-in redirect back to login page //
  else {
    try {
      console.log(cmfunc.getTimeStamp() + `GET request to /warehouse/${req.params.mid}`);
      let sql0 = `SELECT a.*`;
      sql0 += ` FROM warehouse a, groupx b WHERE (a.groupID = b.groupID)`; 
      if (req.session.roleID < 3) {
        if (req.session.groupID > 1) {
          sql0 += ` AND (a.groupID = ${req.params.mid})  AND (a.status > 0) `
        }
        tbls['warehouse'].execSQL(sql0, function(error, result) {
          if (error) throw error;
          res.send(result);
        })
      } else {
        res.send([]);
      }
    } catch (error) {
      res.send({ error: -1, message: 'Unknown exception' });
      console.log('API-Exception', error);
    }
  }
});

app.get('/distlist', function(req, res, next){
  if (cmfunc.isEmpty(req.session.user)) { res.redirect('/'); }// if user is not logged-in redirect back to login page //
  else {
    try {
      console.log(cmfunc.getTimeStamp() + `GET request to /distlist`);
      let sql0 = `SELECT a.*, b.subdir `;
      sql0 += ` FROM memberx a, groupx b WHERE  (a.groupID = b.groupID)`;
      sql0 += ` AND (a.roleID=4)`; // roleID = 4 is distributor
      if (req.session.groupID > 1) {
        sql0 += ` AND (a.parentID = ${req.session.groupID}) `; 
      } 
      console.log("sql0: " + sql0);
      tbls['memberx'].execSQL(sql0, function(error, result) {
        if (error) throw error;
        //console.log(result)
        res.send(result);
      })
    } catch (error) {
      res.send({ error: -1, message: 'Unknown exception' });
      console.log('API-Exception', error);
    }
  }
});
app.get('/agentStafflist', function(req, res, next){
  if (cmfunc.isEmpty(req.session.user)) { res.redirect('/'); }// if user is not logged-in redirect back to login page //
  else {
    try {
      console.log(cmfunc.getTimeStamp() + `GET request to /agentStafflist`);
      let sql0 = `SELECT a.*, b.subdir `;
      sql0 += ` FROM memberx a, groupx b WHERE  (a.groupID = b.groupID)`;
      sql0 += ` AND (a.roleID > 5) AND (a.roleID < 8)`; // roleID = 6,7 Agent + AgentStaff
      if (req.session.groupID > 1) {
        sql0 += ` AND (a.groupID = ${req.session.groupID})`; 
      } 
      console.log("sql0: " + sql0);
      tbls['memberx'].execSQL(sql0, function(error, result) {
        if (error) throw error;
        res.send(result);
      })
    } catch (error) {
      res.send({ error: -1, message: 'Unknown exception' });
      console.log('API-Exception', error);
    }
  }
});

app.get('/manxlist', function(req, res, next){
  if (cmfunc.isEmpty(req.session.user)) { res.redirect('/'); }// if user is not logged-in redirect back to login page //
  else {
    try {
      console.log(cmfunc.getTimeStamp() + `GET request to /manxlist`);
      let sql0 = `SELECT a.*, b.subdir `;
      sql0 += ` FROM memberx a, groupx b WHERE  (a.groupID = b.groupID)`;
      sql0 += ` AND (a.roleID < 3)`; // roleID = 2 is man staff
      if (req.session.groupID > 1) {
        sql0 += ` AND (a.groupID = ${req.session.groupID})`; 
      } 
      console.log("sql0: " + sql0);
      tbls['memberx'].execSQL(sql0, function(error, result) {
        if (error) throw error;
        res.send(result);
      })
    } catch (error) {
      res.send({ error: -1, message: 'Unknown exception' });
      console.log('API-Exception', error);
    }
  }
});

app.post('/boxdetail/:uuID', function(req, res, next){
  if (cmfunc.isEmpty(req.session.user)) { res.redirect('/'); }// if user is not logged-in redirect back to login page //
  else {
    try {
      console.log(cmfunc.getTimeStamp() + `POST request to /boxdetail/${req.params.uuID}`);
      let sql0 = `SELECT a.*, b.productName, b.imgLink, c.subdir, d.stockBonus `;
      sql0 += ` FROM box a, product b, groupx c, promotion d WHERE  (a.productID = b.productID) AND (b.groupID = c.groupID) `; 
      sql0 +=  ` AND (a.uuID='${req.params.uuID}') AND (b.promotionID = d.promotionID) `;
      console.log("sql0: " + sql0);
      tbls['box'].execSQL(sql0, function(error, result) {
        if (error) throw error;
        res.send(result);
      })
    } catch (error) {
      res.send({ error: -1, message: 'Unknown exception' });
      console.log('API-Exception', error);
    }
  }
});
app.post('/palletdetail/:uuID', function(req, res, next){
  if (cmfunc.isEmpty(req.session.user)) { res.redirect('/'); }// if user is not logged-in redirect back to login page //
  else {
    try {
      console.log(cmfunc.getTimeStamp() + `POST request to /palletdetail/${req.params.uuID}`);
      let sql0 = `SELECT a.*, b.productName, b.imgLink, c.subdir `;
      sql0 += ` FROM pallet a, product b, groupx c WHERE  (a.productID = b.productID) AND (b.groupID = c.groupID) AND (a.uuID='${req.params.uuID}')`;
      console.log("sql0: " + sql0);
      tbls['pallet'].execSQL(sql0, function(error, result) {
        if (error) throw error;
        res.send(result);
      })
    } catch (error) {
      res.send({ error: -1, message: 'Unknown exception' });
      console.log('API-Exception', error);
    }
  }
});

//********************** Manufacturing *********************************** */

app.get('/prodmanlist', function(req, res, next){
  if (cmfunc.isEmpty(req.session.user)) { res.redirect('/'); }// if user is not logged-in redirect back to login page //
  else {
    try {
      console.log(cmfunc.getTimeStamp() + `GET request to /prodmanlist`);
      let sql0 = `SELECT a.prodmanID, a.productID, CONCAT(c.subdir,a.prodmanID) AS 'text', a.manDate AS 'startDate', a.manEnd AS 'endDate' `;
      sql0 += ` FROM prodman a, product b, groupx c WHERE (a.status = 3) AND (a.productID = b.productID) AND (a.groupID = c.groupID)`;
      if (req.session.groupID > 1) {
        sql0 += ` AND (a.groupID=${req.session.groupID})`; 
      }
      console.log("sql0: " + sql0);
      tbls['prodman'].execSQL(sql0, function(error, result) {
        if (error) throw error;
        res.send(result);
      })
    } catch (error) {
      res.send({ error: -1, message: 'Unknown exception' });
      console.log('API-Exception', error);
    }
  }
});


app.post('/prodmanlist', function(req, res, next){
  if (cmfunc.isEmpty(req.session.user)) { res.redirect('/'); }// if user is not logged-in redirect back to login page //
  else {
    try {
      console.log(cmfunc.getTimeStamp() + `POST request to /prodmanlist`);
      let sql0 = `SELECT a.*, b.name AS 'manufacturerName', b.subdir, c.name AS 'lastpersonName', `;
      sql0 += ` e.qtyperBox, e.unitMeasure, e.imgLink, e.stockqty, e.costperitem `;
      sql0 += ` FROM prodman a, groupx b, memberx c, product e WHERE  (a.groupID = b.groupID) AND (a.lastPerson = c.memberID)`;
      sql0 += ` AND (a.productID = e.productID) `
      if (req.session.groupID > 1) {
        sql0 += ` AND (a.groupID=${req.session.groupID})`; 
      }
      if (req.body.tdate) {

      }
      tbls['prodman'].execSSQL(sql0, req.body, function(error, result) {
        if (error) throw error;
        res.send(result);
      })
    } catch (error) {
      res.send({ error: -1, message: 'Unknown exception' });
      console.log('API-Exception', error);
    }
  }
});

app.post('/warehouselist', function(req, res, next){
  if (cmfunc.isEmpty(req.session.user)) { res.redirect('/'); }// if user is not logged-in redirect back to login page //
  else {
    try {
      console.log(cmfunc.getTimeStamp() + `POST request to /warehouselist`);
      let sql0 = `SELECT a.*, b.name AS 'manufacturerName', b.subdir, c.name AS 'lastpersonName' `;
      sql0 += ` FROM warehouse a, groupx b, memberx c WHERE  (a.groupID = b.groupID) AND (a.lastPerson = c.memberID)`;
      if (req.session.roleID == 1) {
        if (req.session.groupID > 1) {
          sql0 += ` AND (a.groupID=${req.session.groupID})`; 
        }
        tbls['warehouse'].execSSQL(sql0, req.body, function(error, result) {
          if (error) throw error;
          res.send(result);
        })
      } else {
        res.send([]);
      }
    } catch (error) {
      res.send({ error: -1, message: 'Unknown exception' });
      console.log('API-Exception', error);
    }
  }
});


app.post('/boxlist/:pmid', function(req, res, next){
  if (cmfunc.isEmpty(req.session.user)) { res.redirect('/'); }// if user is not logged-in redirect back to login page //
  else {
    try {
      console.log(cmfunc.getTimeStamp() + `POST request to /boxlist/${req.params.pmid}`);
      let sql0 = `SELECT a.*, b.name AS 'lastpersonName' `;
      sql0 += ` FROM box a, memberx b, prodman c WHERE  (a.prodmanID = ${req.params.pmid}) `;
      sql0 += ` AND (a.lastPerson = b.memberID) AND (a.prodmanID = c.prodmanID)`;
      if ((req.session.groupID > 1) && (req.session.roleID==1) ) {
        sql0 +=  ` AND (c.groupID = ${req.session.groupID}) `;
      }
      console.log("sql0: " + sql0);
      tbls['box'].execSSQL(sql0, req.body, function(error, result) {
        if (error) throw error;
        res.send(result);
      })
    } catch (error) {
      res.send({ error: -1, message: 'Unknown exception' });
      console.log('API-Exception', error);
    }
  }
});

app.post('/palletlist/:pmid', function(req, res, next){
  if (cmfunc.isEmpty(req.session.user)) { res.redirect('/'); }// if user is not logged-in redirect back to login page //
  else {
    try {
      console.log(cmfunc.getTimeStamp() + `POST request to /palletlist/${req.params.pmid}`);
      let sql0 = `SELECT a.*, b.name AS 'lastpersonName' `;
      sql0 += ` FROM pallet a, memberx b, prodman c WHERE  (a.prodmanID = ${req.params.pmid}) `;
      sql0 += ` AND (a.lastPerson = b.memberID) AND (a.prodmanID = c.prodmanID)`;
      if ((req.session.groupID > 1) && (req.session.roleID==1) ) {
        sql0 +=  ` AND (c.groupID = ${req.session.groupID}) `;
      }
      //console.log("sql0: " + sql0);
      tbls['pallet'].execSSQL(sql0, req.body, function(error, result) {
        if (error) throw error;
        res.send(result);
      })
    } catch (error) {
      res.send({ error: -1, message: 'Unknown exception' });
      console.log('API-Exception', error);
    }
  }
});

app.post('/prodxlist/:pmid', function(req, res, next){
  if (cmfunc.isEmpty(req.session.user)) { res.redirect('/'); }// if user is not logged-in redirect back to login page //
  else {
    try {
      console.log(cmfunc.getTimeStamp() + `POST request to /prodxlist/${req.params.pmid}`);
      let sql0 = `SELECT a.*, b.name AS 'lastpersonName', ROW_NUMBER() OVER () AS 'indexNum' `;
      sql0 += ` FROM proditem a, memberx b, prodman c WHERE  (a.prodmanID = ${req.params.pmid}) `;
      sql0 += ` AND (a.lastPerson = b.memberID) AND (a.prodmanID = c.prodmanID)`;
      if ((req.session.groupID > 1) && (req.session.roleID==1) ) {
        sql0 +=  ` AND (c.groupID = ${req.session.groupID}) `;
      }
      console.log("sql0: " + sql0);
      tbls['proditem'].execSSQL(sql0, req.body, function(error, result) {
        if (error) throw error;
        res.send(result);
      })
    } catch (error) {
      res.send({ error: -1, message: 'Unknown exception' });
      console.log('API-Exception', error);
    }
  }
});

app.post('/prodsearchlist/:bid', function(req, res, next){
  if (cmfunc.isEmpty(req.session.user)) { res.redirect('/'); }// if user is not logged-in redirect back to login page //
  else {
    try {
      console.log(cmfunc.getTimeStamp() + `POST request to /prodsearchlist/${req.params.bid}`);
      let sql0 = `SELECT a.*, b.name AS 'lastpersonName', c.productID, d.productName `;
      sql0 += ` FROM proditem a, memberx b, prodman c, product d WHERE  `;
      sql0 += ` (a.lastPerson = b.memberID) AND (a.prodmanID = c.prodmanID) AND (c.productID = d.productID)`;
      if (req.params.bid > 0) {
        if ((req.session.groupID > 1) && (req.session.roleID < 3) ) {
          sql0 +=  ` AND (c.groupID = ${req.session.groupID}) `;
          sql0 +=  ` AND (a.boxID = ${req.params.bid})`;
        } else if (req.session.groupID == 1) {
          sql0 +=  ` AND (a.boxID = ${req.params.bid})`;
        }
      } else {
        if ((req.session.groupID > 1) && (req.session.roleID < 3) ) {
          sql0 +=  ` AND (c.groupID = ${req.session.groupID}) `;
        }
      }
      console.log("sql0: " + sql0);
      tbls['proditem'].execSSQL(sql0, req.body, function(error, result) {
        if (error) throw error;
        //console.table(result)
        res.send(result);
      })
    } catch (error) {
      res.send({ error: -1, message: 'Unknown exception' });
      console.log('API-Exception', error);
    }
  }
});

app.post('/boxsearchlist/:pid', function(req, res, next){
  if (cmfunc.isEmpty(req.session.user)) { res.redirect('/'); }// if user is not logged-in redirect back to login page //
  else {
    try {
      console.log(cmfunc.getTimeStamp() + `POST request to /boxsearchlist/${req.params.pid}`);
      let sql0 = `SELECT a.*, b.name AS 'lastpersonName' `;
      sql0 += ` FROM box a, memberx b, prodman c WHERE  `;
      sql0 += ` (a.lastPerson = b.memberID) AND (a.prodmanID = c.prodmanID)`;
      if (req.params.pid > 0) {
        if ((req.session.groupID > 1) && (req.session.roleID < 3) ) {
          sql0 +=  ` AND (c.groupID = ${req.session.groupID}) `;
          sql0 +=  ` AND (a.palletID = ${req.params.pid})`
        } else if (req.session.groupID == 1) {
          sql0 +=  ` AND (a.palletID = ${req.params.pid})`
        }
      } else {
        if ((req.session.groupID > 1) && (req.session.roleID < 3) ) {
          sql0 +=  ` AND (c.groupID = ${req.session.groupID}) `;
        } else if (req.session.groupID == 1) {
        }
      }
      console.log("sql0: " + sql0);
      console.log("req.body: " + JSON.stringify(req.body,false,4));
      tbls['box'].execSSQL(sql0, req.body, function(error, result) {
        if (error) throw error;
        res.send(result);
      })
    } catch (error) {
      res.send({ error: -1, message: 'Unknown exception' });
      console.log('API-Exception', error);
    }
  }
});

app.post('/palletsearchlist', function(req, res, next){
  if (cmfunc.isEmpty(req.session.user)) { res.redirect('/'); }// if user is not logged-in redirect back to login page //
  else {
    try {
      console.log(cmfunc.getTimeStamp() + `POST request to /palletsearchlist`);
      let sql0 = `SELECT a.*, b.name AS 'lastpersonName' `;
      sql0 += ` FROM pallet a, memberx b, prodman c WHERE  `;
      sql0 += ` (a.lastPerson = b.memberID) AND (a.prodmanID = c.prodmanID)`;
      if ((req.session.groupID > 1) && (req.session.roleID < 3) ) {
        sql0 +=  ` AND (c.groupID = ${req.session.groupID}) `;
      }
      console.log("sql0: " + sql0);
      tbls['pallet'].execSSQL(sql0, req.body, function(error, result) {
        if (error) throw error;
        res.send(result);
      })
    } catch (error) {
      res.send({ error: -1, message: 'Unknown exception' });
      console.log('API-Exception', error);
    }
  }
});

app.post('/insertsalex', function(req, res, next){
  var fny = function updateInventory(dat){
    console.log(dat);
    return new Promise(function(resolve, reject) {
      let sql0 = `UPDATE product SET stockqty = ROUND((((stockqty * qtyperBox) - ${dat.qty})/qtyperBox),3) WHERE (productID = ${dat.productID});`;
      tbls['product'].execSQL(sql0, function(error, dat) {
          if (error) {  reject(error);
          } else {
            resolve(dat)
          }
      })
    })
  }
  var fnx = function insertOrderItems(dat){
    return new Promise(function(resolve, reject) {
        tbls['saleitems'].insert(dat, function(error, dat) {
            if (error) {  reject(error);
            } else {
              resolve(dat)
            }
        })
    })
  }
  if (cmfunc.isEmpty(req.session.user)) { res.redirect('/'); }// if user is not logged-in redirect back to login page //
  else {
    try {
      console.log(cmfunc.getTimeStamp() + `POST request to /insertsalex`);
      var data = req.body;
      var orderitems = data.orderitems;
      delete data.orderitems;
      console.log(data);
      console.log(orderitems);

      tbls['sale'].insert(data, function(error, result) {
        if (error) res.send({'status': -1});
        data.saleID = result.saleID;
        data.saleno = `${req.session.subdir}${pad(result.saleID,5)}`;
        tbls['sale'].save(data, function(errora, resulta) {
          if (errora) res.send({'status': -1});
          var items  = orderitems.map(obj => ({ ...obj, saleID: result.saleID }))
          var actions = items.map(fnx);
          Promise.all(actions).then( function (da1) {
            var actions2 = items.map(fny);
            Promise.all(actions2).then( function (da2) {
                res.send({'status': 0});  //OK to place order
            })
          })
        })
        
      })
      
    } catch (error) {
      res.send({ error: -1, message: 'Unknown exception' });
      console.log('API-Exception', error);
    }
  }
});

app.post('/insertorderx', function(req, res, next){
  var fnx = function insertOrderItems(dat){
    return new Promise(function(resolve, reject) {
        tbls['orderxitem'].insert(dat, function(error, data) {
            if (error) {  reject(error);
            } else {
              resolve(dat)
            }
        })
    })
  }
  if (cmfunc.isEmpty(req.session.user)) { res.redirect('/'); }// if user is not logged-in redirect back to login page //
  else {
    try {
      console.log(cmfunc.getTimeStamp() + `POST request to /insertorderx`);
      var data = req.body;
      var orderitems = data.orderitems;
      delete data.orderitems;
      console.log(data);
      console.log(orderitems);

      tbls['orderx'].insert(data, function(error, result) {
        if (error) res.send({'status': -1});
        data.orderxID = result.orderxID;
        data.orderNumber = `${req.session.subdir}${pad(result.orderxID,5)}`;
        tbls['orderx'].save(data, function(errora, resulta) {
          if (errora) res.send({'status': -1});
          var items  = orderitems.map(obj => ({ ...obj, orderxID: result.orderxID }))
          var actions = items.map(fnx);
          Promise.all(actions).then( function (da1) {
              res.send({'status': 0});  //OK to place order
          })
        })
        
      })
      
    } catch (error) {
      res.send({ error: -1, message: 'Unknown exception' });
      console.log('API-Exception', error);
    }
  }
});

app.post('/salelist', function(req, res, next){
  if (cmfunc.isEmpty(req.session.user)) { res.redirect('/'); }// if user is not logged-in redirect back to login page //
  else {
    try {
      console.log(cmfunc.getTimeStamp() + `POST request to /salelist`);
      var data = req.body;
      //console.log(data)
      let sql0 = `SELECT a.*, b.name AS 'lastpersonName', CAST(a.dateAdded AS DATE) AS 'dateAdded2', `;
      sql0 += `c.name AS 'salestaff', d.name AS 'customerName', d.phone AS 'customerPhone' `;
      sql0 += ` FROM sale a,  memberx b, memberx c, memberx d WHERE  `; 
      sql0 += ` (a.lastPerson = b.memberID) AND (a.agentStaffID = c.memberID) AND (a.customerID = d.memberID)`;
      if (req.session.groupID > 1 ) {
        sql0 +=  ` AND (a.groupID = ${req.session.groupID}) `;
      }
      if (data.fromdate && data.todate) {
        sql0 += ` AND ((TO_DAYS(a.dateAdded) >= TO_DAYS('${data.fromdate}')) AND (TO_DAYS(a.dateAdded) < TO_DAYS('${data.todate}')))`;
      }
      sql0 += ` ORDER BY a.dateAdded DESC`
      console.log(sql0);

      tbls['orderx'].execSQL(sql0, function(error, result) {
        if (error) throw error;
        res.send(result);
      })
    } catch (error) {
      res.send({ error: -1, message: 'Unknown exception' });
      console.log('API-Exception', error);
    }
  }
});

app.post('/saleitemslist/:saleid', function(req, res, next){
  if (cmfunc.isEmpty(req.session.user)) { res.redirect('/'); }// if user is not logged-in redirect back to login page //
  else {
    try {
      console.log(cmfunc.getTimeStamp() + `POST request to /saleitemslist/${req.params.saleid}`);
      let sql0 = ` SELECT  a.*, b.taxrate, b.unitMeasure, b.categoryID, d.categoryName,`;
      sql0 += ` b.productName, b.typeID `;
      sql0 += ` FROM saleitems a, product b, category d WHERE `; 
      sql0 += ` (a.productID = b.productID) AND (b.categoryID = d.categoryID)`;
      sql0 += ` AND (a.saleID = ${req.params.saleid})`;
      console.log("sql0: " + sql0);
      tbls['saleitems'].execSQL(sql0, function(error, result) {
        if (error) throw error;
        res.send(result);
      })
     
    } catch (error) {
      res.send({ error: -1, message: 'Unknown exception' });
      console.log('API-Exception', error);
    }
  }
});

app.post('/saleitemslist', function(req, res, next){
  if (cmfunc.isEmpty(req.session.user)) { res.redirect('/'); }// if user is not logged-in redirect back to login page //
  else {
    try {
      console.log(cmfunc.getTimeStamp() + `POST request to /saleitemslist`);
      var data = req.body;
      console.log(data)
      let sql0 = ` SELECT  a.*, b.taxrate, b.unitMeasure, b.categoryID, d.categoryName,`;
      sql0 += ` b.productName, b.typeID, e.saleno, e.dateAdded `;
      sql0 += ` FROM saleitems a, product b, category d, sale e WHERE (e.groupID = ${req.session.groupID}) `; 
      sql0 += ` AND (a.productID = b.productID) AND (a.saleID = e.saleID) AND (b.categoryID = d.categoryID)`;
      if (data.fromdate && data.todate) {
        sql0 += ` AND ((TO_DAYS(e.dateAdded) >= TO_DAYS('${data.fromdate}')) AND (TO_DAYS(e.dateAdded) < TO_DAYS('${data.todate}')))`;
      }
      sql0 += ` AND (e.agentStaffID = ${data.agentStaffID})`;
      console.log("sql0: " + sql0);
      tbls['saleitems'].execSQL(sql0, function(error, result) {
        if (error) throw error;
        res.send(result);
      })
     
    } catch (error) {
      res.send({ error: -1, message: 'Unknown exception' });
      console.log('API-Exception', error);
    }
  }
});

app.post('/orderxlist/:mode', function(req, res, next){
  if (cmfunc.isEmpty(req.session.user)) { res.redirect('/'); }// if user is not logged-in redirect back to login page //
  else {
    try {
      console.log(cmfunc.getTimeStamp() + `POST request to /orderxlist/${req.params.mode}`);
      var data = req.body;
      let sql0 = `SELECT a.*, b.name AS 'lastpersonName', c.name AS 'salestaff', d.name AS 'distributorName' `;
      sql0 += ` FROM orderx a, memberx b, memberx c, memberx d WHERE  `; 
      if (req.params.mode == 0) {
        sql0 += ` (a.lastPerson = b.memberID) AND (a.salestaffID = c.memberID) AND (a.distributorID = d.memberID) AND (a.status < 4)`;
      } else {
        sql0 += ` (a.lastPerson = b.memberID) AND (a.salestaffID = c.memberID) AND (a.distributorID = d.memberID) AND (a.status > 2)`;
      }
      
      if (req.session.groupID > 1 ) {
        sql0 +=  ` AND (a.groupID = ${req.session.groupID}) `;
      }
      if (data.fromdate && data.todate) {
        sql0 += ` AND ((TO_DAYS(a.dateAdded) >= TO_DAYS('${data.fromdate}')) AND (TO_DAYS(a.dateAdded) <= TO_DAYS('${data.todate}')))`;
      }
      console.log(data)
      if (data.mode) {
        sql0 += ` AND ( `;
        sqlx = [];
        data.mode.forEach((m, index) => {
          sqlx.push(` (a.status = ${m}) `);
        })
        sql0 += sqlx.join(" || ");
        sql0 += `)`
      }
      console.log(sql0);

      tbls['orderx'].execSSQL(sql0, req.body, function(error, result) {
        if (error) throw error;
        res.send(result);
      })
    } catch (error) {
      res.send({ error: -1, message: 'Unknown exception' });
      console.log('API-Exception', error);
    }
  }
});

app.post('/dispatchlist', function(req, res, next){
  if (cmfunc.isEmpty(req.session.user)) { res.redirect('/'); }// if user is not logged-in redirect back to login page //
  else {
    try {
      console.log(cmfunc.getTimeStamp() + `POST request to /dispatchlist`);
      var data = req.body;
      let sql0 = `SELECT a.*, d.name AS 'distributorName' `;
      sql0 += ` FROM orderx a, memberx d  WHERE `; 
      sql0 += ` (a.distributorID = d.memberID) AND (a.groupID = ${req.session.groupID})`;
      if (data.fromdate && data.todate) {
        sql0 += ` AND ((TO_DAYS(a.dateDispatched) >= TO_DAYS('${data.fromdate}')) AND (TO_DAYS(a.dateDispatched) <= TO_DAYS('${data.todate}')))`;
      }
      if ((data.roleID == 1) || (data.roleID == 2)) {
        sql0 += ` AND (a.salestaffID = ${data.memberID})`;
      } else if (data.roleID == 4) {
        sql0 += ` AND (a.distributorID = ${data.memberID})`;
      }
      if (data.mode) {
        sql0 += ` AND ( `;
        sqlx = [];
        data.mode.forEach((m, index) => {
          sqlx.push(` (a.status = ${m}) `);
        })
        sql0 += sqlx.join(" || ");
        sql0 += `)`
      }
      sql0 += ` ORDER BY a.dateAdded DESC`
      tbls['orderx'].execSQL(sql0, function(error, result) {
        if (error) throw error;
        res.send(result);
      })
    } catch (error) {
      res.send({ error: -1, message: 'Unknown exception' });
      console.log('API-Exception', error);
    }
  }
});

app.post('/orderlist', function(req, res, next){
  if (cmfunc.isEmpty(req.session.user)) { res.redirect('/'); }// if user is not logged-in redirect back to login page //
  else {
    try {
      console.log(cmfunc.getTimeStamp() + `POST request to /orderlist`);
      var data = req.body;
      let sql0 = `SELECT a.*, d.name AS 'distributorName' `;
      sql0 += ` FROM orderx a, memberx d  WHERE `; 
      sql0 += ` (a.distributorID = d.memberID) AND (a.groupID = ${req.session.groupID})`;
      if (data.fromdate && data.todate) {
        sql0 += ` AND ((TO_DAYS(a.dateAdded) >= TO_DAYS('${data.fromdate}')) AND (TO_DAYS(a.dateAdded) <= TO_DAYS('${data.todate}')))`;
      }
      if ((data.roleID == 1) || (data.roleID == 2)) {
        sql0 += ` AND (a.salestaffID = ${data.memberID})`;
      } else if (data.roleID == 4) {
        sql0 += ` AND (a.distributorID = ${data.memberID})`;
      }
      console.log(data)
      if (data.mode) {
        sql0 += ` AND ( `;
        sqlx = [];
        data.mode.forEach((m, index) => {
          sqlx.push(` (a.status = ${m}) `);
        })
        sql0 += sqlx.join(" || ");
        sql0 += `)`
      }
      sql0 += ` ORDER BY a.dateAdded DESC`
      console.log("sql0: " + sql0);
      tbls['orderx'].execSQL(sql0, function(error, result) {
        if (error) throw error;
        res.send(result);
      })
    } catch (error) {
      res.send({ error: -1, message: 'Unknown exception' });
      console.log('API-Exception', error);
    }
  }
});

app.post('/salediarybystaff/:sid', function(req, res, next){
  if (cmfunc.isEmpty(req.session.user)) { res.redirect('/'); }// if user is not logged-in redirect back to login page //
  else {
    try {
      let roleID = req.session.roleID;
      let divisionID = req.session.divisionID;
      let groupID = req.session.groupID;
      let memberID = req.session.memberID;

      console.log(cmfunc.getTimeStamp() + `POST request to /salediarybystaff/${req.params.sid}`);
      let sql0 = ` SELECT  a.*`;
      if (req.params.sid > 0) {
        sql0 += ` FROM diary a WHERE  ( a.staffID = ${req.params.sid} ) `; 
        console.log("sql0: " + sql0);
        tbls['diary'].execSSQL(sql0, req.body, function(error, result) {
          if (error) throw error;
          //console.log(result)
          res.send(result);
        })
      } else {
        if ((roleID==1) && (groupID >1)) {
          sql0 += `, b.name, b.divisionID, b.imgLink, b.roleID `
          sql0 += ` FROM diary a, memberx b, memberx c WHERE `;
          sql0 += ` (a.staffID = b.memberID) AND (`;
          sql0 += ` ((b.parentID = c.memberID) AND (c.parentID=${memberID})) OR `; 
          sql0 += ` ((b.parentID = c.memberID) AND (c.groupID=1)) OR`;
          sql0 += ` ((b.parentID = ${memberID}) AND (b.parentID=c.memberID))`;
          sql0 += ` ) `;
          sql0 += ` AND (a.status<3)  `
        } else if ((roleID==2) && (divisionID==3)) {
          sql0 += `, b.name, b.divisionID, b.imgLink, b.roleID `
          sql0 += ` FROM diary a, memberx b WHERE  `;
          sql0 += ` (a.staffID = b.memberID) AND ( `;
          sql0 += ` (b.parentID= ${memberID}) OR `;
          sql0 += ` ((a.staffID= ${memberID}) AND (a.staffID=b.memberID)) `; 
          sql0 += ` ) `;
          sql0 += ` AND (a.status<3)  `
        }
        sql0 += ` ORDER BY a.dateAdded DESC`
        console.log("sql0: " + sql0);
        tbls['diary'].execSQL(sql0, function(error, result) {
          if (error) throw error;
          //console.log(result)
          res.send(result);
        })
      }
      
    } catch (error) {
      res.send({ error: -1, message: 'Unknown exception' });
      console.log('API-Exception', error);
    }
  }
});

app.post('/salediarybycustomer/:cid', function(req, res, next){
  if (cmfunc.isEmpty(req.session.user)) { res.redirect('/'); }// if user is not logged-in redirect back to login page //
  else {
    try {
      console.log(cmfunc.getTimeStamp() + `POST request to /salediarybycustomer/${req.params.cid}`);
      let sql0 = ` SELECT  a.*`;
      sql0 += ` FROM diary a WHERE  ( a.customerID = ${req.params.cid} ) `; 
      console.log("sql0: " + sql0);
      tbls['diary'].execSSQL(sql0, req.body, function(error, result) {
        if (error) throw error;
        res.send(result);
      })
      
    } catch (error) {
      res.send({ error: -1, message: 'Unknown exception' });
      console.log('API-Exception', error);
    }
  }
});

app.post('/orderxitemlist', function(req, res, next){
  if (cmfunc.isEmpty(req.session.user)) { res.redirect('/'); }// if user is not logged-in redirect back to login page //
  else {
    try {
      console.log(cmfunc.getTimeStamp() + `POST request to /orderxitemlist`);
      var data = req.body;
      let sql0 = ` SELECT  a.*, b.taxrate, b.unitMeasure, b.categoryID, b.subcatID, d.categoryName,`;
      sql0 += ` b.productName, b.unitPrice AS 'recomPrice', b.qtyperBox, b.imgLink, b.costperitem `;
      sql0 += ` FROM orderxitem a, product b, category d, orderx e WHERE (e.groupID = ${req.session.groupID}) `; 
      sql0 += ` AND (a.productID = b.productID) AND (a.orderxID = e.orderxID) AND (b.categoryID = d.categoryID)`;
      if (data.fromdate && data.todate) {
        sql0 += ` AND ((TO_DAYS(e.dateAdded) >= TO_DAYS('${data.fromdate}')) AND (TO_DAYS(e.dateAdded) <= TO_DAYS('${data.todate}')))`;
      }
      if ((data.roleID == 1) || (data.roleID == 2)) {
        sql0 += ` AND (e.salestaffID = ${data.memberID})`;
      } else if (data.roleID == 4) {
        sql0 += ` AND (e.distributorID = ${data.memberID})`;
      }
      console.log("sql0: " + sql0);
      tbls['orderxitem'].execSQL(sql0, function(error, result) {
        if (error) throw error;
        res.send(result);
      })
     
    } catch (error) {
      res.send({ error: -1, message: 'Unknown exception' });
      console.log('API-Exception', error);
    }
  }
});

app.post('/orderxitemlist/:oid', function(req, res, next){
  if (cmfunc.isEmpty(req.session.user)) { res.redirect('/'); }// if user is not logged-in redirect back to login page //
  else {
    try {
      console.log(cmfunc.getTimeStamp() + `POST request to /orderxitemlist/${req.params.oid}`);
      let found = false;
      let sql0 = `SET @row_number = 0; `;
      sql0 += ` SELECT  a.*, (@row_number:=@row_number + 1) AS 'idx', b.taxrate, d.categoryName, b.categoryID, b.subcatID,`;
      sql0 += ` b.productName, b.unitPrice AS 'recomPrice', b.qtyperBox, b.imgLink, c.subdir, b.costperitem, b.unitMeasure `;
      sql0 += ` FROM orderxitem a, product b, groupx c, category d WHERE  `; 
      sql0 += ` (a.productID = b.productID) AND (a.orderxID = ${req.params.oid}) AND (b.groupID = c.groupID) AND (b.categoryID = d.categoryID)`;
      if ((req.session.groupID > 1) && (req.session.roleID==1) ) {
        sql0 +=  ` AND (b.groupID = ${req.session.groupID}) `;
        found = true;
      } else if (req.session.groupID == 1) {
        found = true;
      }
      console.log("sql0: " + sql0);
      if (found) {
        tbls['orderxitem'].execSQL(sql0, function(error, result) {
          if (error) throw error;
          res.send(result[1]);
        })
      } else {
        res.send([]);
      }
    } catch (error) {
      res.send({ error: -1, message: 'Unknown exception' });
      console.log('API-Exception', error);
    }
  }
});

app.post('/orderxitemstock/:oxid', function(req, res, next){
  if (cmfunc.isEmpty(req.session.user)) { res.redirect('/'); }// if user is not logged-in redirect back to login page //
  else {
    try {
      console.log(cmfunc.getTimeStamp() + `POST request to /orderxitemstock/${req.params.oxid}`);
      let sql0 = ``;
      sql0 += ` SELECT b.palletID, b.refID, b.boxQty `;
      sql0 += ` FROM palletitems a, pallet b WHERE  `; 
      sql0 += ` (a.palletID = b.palletID) AND (a.orderxitemID = ${req.params.oxid})`;
      tbls['palletitems'].execSQL(sql0, function(error, result) {
        if (error) throw error;
        res.send(result);
      })
    } catch (error) {
      res.send({ error: -1, message: 'Unknown exception' });
      console.log('API-Exception', error);
    }
  }
});



app.post('/transferbiz', function(req, res, next){
  if (cmfunc.isEmpty(req.session.user)) { res.redirect('/'); }// if user is not logged-in redirect back to login page //
  else {
    try {
      console.log(cmfunc.getTimeStamp() + `POST request to /transferbiz`);
      console.log("req.body: " + JSON.stringify(req.body, false, 4));
      var data = req.body;
      var sql0 = ` UPDATE memberx SET parentID = ${data.newstaff} WHERE (roleID = ${data.roleID}) AND (parentID = ${data.oldstaff}) `;
      console.log("sql0: " + sql0);
      tbls['memberx'].execSQL(sql0, function(error, data) {
        if (error) throw error;
        console.log("transferbiz is successfully updated...");
        res.send({'status': 0});
      })
    } catch (error) {
      res.send({ error: -1, message: 'Unknown exception' });
      console.log('API-Exception', error);
    }
  }
});


app.get('/stocklist/:pid', function(req, res, next){
  if (cmfunc.isEmpty(req.session.user)) { res.redirect('/'); }// if user is not logged-in redirect back to login page //
  else {
    try {
      console.log(cmfunc.getTimeStamp() + `GET request to /stocklist/${req.params.pid}`);
      let found = false;
      let sql0 = `SELECT SUM(a.qtyIn) - SUM(a.qtyOut) AS 'balance' `;
      sql0 += ` FROM product WHERE `; 
      sql0 += ` (a.productID = b.productID) AND (a.productID = ${req.params.pid})`;
      if ((req.session.groupID > 1) && (req.session.roleID < 3) ) {
        sql0 +=  ` AND (b.groupID = ${req.session.groupID}) `;
        found = true;
      } else if (req.session.groupID == 1) {
        found = true;
      }
      console.log("sql0: " + sql0);
      if (found) {
        tbls['product'].execSQL(sql0, function(error, result) {
          if (error) throw error;
          res.send(result);
        })
      } else {
        res.send([]);
      }
    } catch (error) {
      res.send({ error: -1, message: 'Unknown exception' });
      console.log('API-Exception', error);
    }
  }
});


app.get('/stockcheck/:oid', function(req, res, next){
  var fnx = function updateOrderAvailability(dat){
    return new Promise(function(resolve, reject) {
        var sql = `UPDATE orderxitem SET  status = ${dat.stkremain>=0?0:1}  WHERE (orderxitemID = ${dat.orderxitemID})`;
        tbls['orderxitem'].execSQL(sql, function(error, data) {
            if (error) {  reject(error);
            } else {
              resolve(dat)
            }
        })
    })
  }
  if (cmfunc.isEmpty(req.session.user)) { res.redirect('/'); }// if user is not logged-in redirect back to login page //
  else {
    try {
      console.log(cmfunc.getTimeStamp() + `POST request to /stockcheck/${req.params.oid}`);
      sql0 = ` SELECT  a.*, b.taxrate, b.stockqty, `;
      sql0 += ` b.productName, b.unitPrice AS 'recomPrice', b.qtyperBox, b.imgLink, c.subdir, b.costperitem, `;
      sql0 += `(b.stockqty - a.qty) AS 'stkremain' `;
      sql0 += ` FROM orderxitem a, product b, groupx c WHERE  `; 
      sql0 += ` (a.productID = b.productID) AND (a.orderxID = ${req.params.oid}) AND (b.groupID = c.groupID) `;
      console.log("sql0: " + sql0);
      tbls['orderxitem'].execSQL(sql0, function(error, result) {
        if (error) throw error;
        var b = JSON.parse(JSON.stringify(result));
        console.log(b)
        if (b.length > 0) {
          var noprodavail = b.filter(f => f.stkremain < 0);
          var actions = b.map(fnx);
          Promise.all(actions).then( function (da1) {
            if (noprodavail.length > 0) {
              res.send({'status': -2}); //some product items not available
            } else {
              res.send({'status': 0});  //OK to place order
            }
          })
          
        } else {
          res.send({'status': -1}); //shopping cart is empty
        }
      })
    } catch (error) {
      res.send({ error: -1, message: 'Unknown exception' });
      console.log('API-Exception', error);
    }
  }
});

app.post('/stockChkOut', function(req, res, next){
  var fnx = function updateOrderAvailability(dat){
    return new Promise(function(resolve, reject) {
        var sql = `UPDATE orderxitem SET  status = ${dat.stkremain>=0?0:1}  WHERE (orderxitemID = ${dat.orderxitemID})`;
        tbls['orderxitem'].execSQL(sql, function(error, data) {
            if (error) {  reject(error);
            } else {
              resolve(dat)
            }
        })
    })
  }
  var fnx1 = function updateProductInventory(dat){
    return new Promise(function(resolve, reject) {
        var sql = `UPDATE product SET  stockqty = ${dat.stockqty - dat.qty}  WHERE (productID = ${dat.productID})`;
        tbls['product'].execSQL(sql, function(error, data) {
            if (error) {  reject(error);
            } else {
              resolve(dat)
            }
        })
    })
  }
  if (cmfunc.isEmpty(req.session.user)) { res.redirect('/'); }// if user is not logged-in redirect back to login page //
  else {
    try {
      console.log(cmfunc.getTimeStamp() + `POST request to /stockChkOut/${req.body.orderxID}`);
      sql0 = ` SELECT  a.*, b.taxrate, b.stockqty,`;
      sql0 += ` b.productName, b.unitPrice AS 'recomPrice', b.qtyperBox, b.imgLink, c.subdir, b.costperitem, `;
      sql0 += `(b.stockqty - a.qty) AS 'stkremain' `;
      sql0 += ` FROM orderxitem a, product b, groupx c WHERE  `; 
      sql0 += ` (a.productID = b.productID) AND (a.orderxID = ${req.body.orderxID}) AND (b.groupID = c.groupID) `;
      console.log("sql0: " + sql0);
      tbls['orderxitem'].execSQL(sql0, function(error, result) {
        if (error) throw error;
        var b = JSON.parse(JSON.stringify(result));
        console.log(b)
        if (b.length > 0) {
          var noprodavail = b.filter(f => f.stkremain < 0);
          if (noprodavail.length > 0) {
            var actions = b.map(fnx);
            Promise.all(actions).then( function (da1) {
              res.send({'status': -2}); //some product items not available
            })
          } else {
            var actions = b.map(fnx1);
            Promise.all(actions).then( function (da1) {
              res.send({'status': 0}); //deduct inventory..
            })
          }
        } else {
          res.send({'status': -1}); //shopping cart is empty
        }
      })
    } catch (error) {
      res.send({ error: -1, message: 'Unknown exception' });
      console.log('API-Exception', error);
    }
  }
});


app.post('/stockChkIn', function(req, res, next){
  if (cmfunc.isEmpty(req.session.user)) { res.redirect('/'); }// if user is not logged-in redirect back to login page //
  else {
    try {
      console.log(cmfunc.getTimeStamp() + `POST request to /stockChkIn`);
      var sql0 = ` SELECT COUNT(*) AS "boxqty" FROM box a  WHERE `;
      sql0 += ` (a.productID = ${req.body.productID}) AND (a.status=1)`;
      console.log("sql0: " + sql0);
      tbls['box'].execSQL(sql0, function(errorx, datx) {
        if (errorx) {
          res.send({'status': 1});
        } else {
          console.log(datx)
          sql0 = ` DELETE FROM proditem WHERE (prodmanID=${req.body.prodmanID}) AND (status=0); `; //Removed all unused product's QRCODE 
          sql0 += `UPDATE prodXfer SET `;
          sql0 += `refID="${req.body.subdir}${req.body.prodmanID}", itemcost = ${req.body.unitCost},  qty=${datx[0].boxqty}, status=2 `;
          sql0 += ` WHERE ( productID = ${req.body.productID});`;
          sql0 += `UPDATE product SET `;
          sql0 += `stockqty=${req.body.stockqty} + ${datx[0].boxqty}, status = 1, `;
          sql0 += `costperitem = ((${req.body.costperitem} * ${req.body.stockqty}) + (${req.body.unitCost} * ${datx[0].boxqty}) )/ (${datx[0].boxqty} + ${req.body.stockqty}) `;
          sql0 += ` WHERE ( productID = ${req.body.productID});`;
          console.log("sqlXX: " + sql0);
          tbls['product'].execSQL(sql0, function(errory, datax) {
              if (errory) {  
                res.send({'status': 1});
              } else {
                tbls['proditem'].execSQL(`SELECT COUNT(*) AS 'total' FROM proditem WHERE (prodmanID=${req.body.prodmanID}) AND (status=1); `, function(errora, dataa) {
                  if (errora) {  
                    res.send({'status': 1});
                  } else {
                    if (dataa.length > 0) {
                      tbls['prodman'].execSQL(`UPDATE prodman SET qty=${dataa[0].total} WHERE (prodmanID=${req.body.prodmanID})`, function(errorb, datab) {
                        if (errorb) {  
                          res.send({'status': 1});
                        } else {
                          res.send({'status': 0});
                        }
                      })
                    } else {
                      res.send({'status': 1});
                    }
                  }
                })
              }
          })
        }
      })
    } catch (error) {
      res.send({ error: -1, message: 'Unknown exception' });
      console.log('API-Exception', error);
    }
  }
});


app.post('/rawStockTake', function(req, res, next){
  var fnx = function updateRawInventory(dat){
    return new Promise(function(resolve, reject) {
        var sql = `UPDATE rawstock SET  stockqty = ${dat.stkremain}, status = 1 WHERE (rawstockID = ${dat.rawstockID})`;
        console.log("sql: " + sql);
        tbls['rawstock'].execSQL(sql, function(error, data) {
            if (error) {  reject(error);
            } else {
              resolve(dat)
            }
        })
    })
  }
  if (cmfunc.isEmpty(req.session.user)) { res.redirect('/'); }// if user is not logged-in redirect back to login page //
  else {
    try {
      console.log(cmfunc.getTimeStamp() + `POST request to /rawStockTake`);
      var ratiox = req.body.qty / 1000;
      
      var sql0 = ` SELECT a.*, b.stockqty, c.qtyperBox, b.rawstockName, `;
      sql0 += ` CASE WHEN (b.unitMeasure < 2) THEN (a.qty * ${ratiox}) WHEN (b.unitMeasure = 2) THEN ${req.body.qty} ELSE (${req.body.qty} /c.qtyperBox) END AS 'stkreq', `;
      sql0 += ` CASE WHEN (b.unitMeasure < 2) THEN ROUND((b.stockqty - (a.qty * ${ratiox})),2) WHEN (b.unitMeasure = 2) THEN (b.stockqty - ${req.body.qty}) ELSE  CEIL((b.stockqty - (${req.body.qty} / c.qtyperBox))) END AS 'stkremain' `;
      sql0 += ` FROM prodformula a, rawstock b, product c  WHERE `;
      sql0 += ` (a.productID = ${req.body.productID}) AND (a.rawstockID = b.rawstockID) AND (a.productID = c.productID) AND (a.status=1) `;
      
      tbls['prodformula'].execSQL(sql0, function(errorx, datx) {
        if (errorx) {
          res.send({'status': -1});
        } else {
          if (datx.length == 0) {
            res.send({'status': -1});
          } else {
            var b = JSON.parse(JSON.stringify(datx));
            console.log(b);
            var norawstock = b.filter(f => f.stkremain < 0);
            console.log(norawstock);
            if (norawstock.length > 0) {
              res.send({'status': -1, data: norawstock.map((d) => d.rawstockName).join(",")});
            } else {
              var actions = b.map(fnx);
              Promise.all(actions).then( function (da1) {
                  res.send({'status': 0});
              })
            }
          }
        }
      })
      
    } catch (error) {
      res.send({ error: -1, message: 'Unknown exception' });
      console.log('API-Exception', error);
    }
  }
});

app.post('/salexchg/:typeid', function(req, res, next){
  if (cmfunc.isEmpty(req.session.user)) { res.redirect('/'); }// if user is not logged-in redirect back to login page //
  else {
    try {
      console.log(cmfunc.getTimeStamp() + `POST request to /salexchg/${req.params.typeid}`);
      let found = false;
      let sql0 = ``;
      let data = req.body;
      if (data.mid > 0) {
        sql0 = `SELECT a.*, b.saleID, b.dateAdded, d.productName, d.categoryID, d.typeID, c.name AS 'custName', f.name AS 'staffName'  `;
        sql0 += ` FROM saleitems a, sale b, memberx c, product d, category e, memberx f WHERE (a.saleID = b.saleID) `; 
        sql0 += ` AND (a.productID = d.productID) AND (d.categoryID=e.categoryID) AND (b.customerID=c.memberID) AND (b.agentStaffID=f.memberID)`;
        sql0 += ` AND  ( TO_DAYS(b.dateAdded) >= TO_DAYS('${data.fromdate}')) AND ( TO_DAYS(b.dateAdded) <= TO_DAYS('${data.todate}'))`;
        if (req.params.typeid == 0) sql0 += ` AND (b.customerID = ${data.mid}) `;
        else if (req.params.typeid == 1) sql0 += ` AND (a.productID = ${data.mid}) `;
        else if (req.params.typeid == 2) sql0 += ` AND (b.agentStaffID = ${data.mid}) `;
        found = true; 
      }
      console.log("sql0: " + sql0);
      if (found) {
        tbls['wallet'].execSQL(sql0, function(error, result) {
          if (error) throw error;
          //console.log(result)
          res.send(result);
        })
      } else {
        res.send([]);
      }
    } catch (error) {
      res.send({ error: -1, message: 'Unknown exception' });
      console.log('API-Exception', error);
    }
  }
});

app.post('/walletlist/:mid', function(req, res, next){
  if (cmfunc.isEmpty(req.session.user)) { res.redirect('/'); }// if user is not logged-in redirect back to login page //
  else {
    try {
      console.log(cmfunc.getTimeStamp() + `POST request to /walletlist/${req.params.mid}`);
      let found = false;
      let sql0 = ``;
      if (req.params.mid > 0) {
        sql0 = `SELECT a.*, b.email AS 'memberEmail', b.phone AS 'memberPhone', b.name AS 'memberName', b.roleID AS 'roleIDx' `;
        sql0 += ` FROM wallet a, memberx b WHERE  `; 
        sql0 += ` (a.memberID = b.memberID) `;
        sql0 += ` AND (a.memberID = ${req.params.mid}) `;
        found = true; 
      }
      console.log("sql0: " + sql0);
      if (found) {
        tbls['wallet'].execSSQL(sql0, req.body, function(error, result) {
          if (error) throw error;
          //console.log(result)
          res.send(result);
        })
      } else {
        res.send([]);
      }
    } catch (error) {
      res.send({ error: -1, message: 'Unknown exception' });
      console.log('API-Exception', error);
    }
  }
});

app.post('/walletlist', function(req, res, next){
  if (cmfunc.isEmpty(req.session.user)) { res.redirect('/'); }// if user is not logged-in redirect back to login page //
  else {
    try {
      console.log(cmfunc.getTimeStamp() + `POST request to /walletlist`);
      let found = false;
      let datex = moment().subtract(90, 'days').format("YYYY-MM-DD");
      let sql0 = ``;
      if ((req.session.groupID > 1) && ((req.session.roleID == 3)||(req.session.roleID == 7))) {
          sql0 += ` SELECT walletID, saleID, status, `;
          sql0 += ` CASE WHEN credit > 0 THEN CONCAT(dateAdded,'#', saleID)`;
          sql0 += ` WHEN ((debit > 0) AND (paytype=1)) THEN CONCAT(a.dateAdded,', TopUp') `;
          sql0 += ` WHEN ((debit > 0) AND (paytype=2)) THEN CONCAT(a.dateAdded,', Momo') `;
          sql0 += ` ELSE CONCAT(dateAdded,'#', saleID) `;
          sql0 += ` END AS 'wallettype', `;
          sql0 += ` CASE WHEN credit > 0 THEN CONCAT('+', FORMAT(credit,0,'vi_VN'),'đ') `;
          sql0 += ` WHEN debit > 0 THEN CONCAT('-', FORMAT(debit,0,'vi_VN'),'đ')`;
          sql0 += ` ELSE '0đ' `;
          sql0 += ` END AS 'walletpay', `;
          sql0 += ` CONCAT(FORMAT(COALESCE(((SELECT SUM(credit) FROM wallet b WHERE (b.walletID <= a.walletID) AND (b.memberID = ${req.session.memberID})) - (SELECT SUM(debit) FROM wallet b WHERE (b.walletID <= a.walletID) AND (b.memberID = ${req.session.memberID}) )), 0),0,'vi_VN'),'đ') as 'balance' `;
          sql0 += ` FROM wallet a WHERE  `; 
          sql0 +=  ` (memberID = ${req.session.memberID}) ORDER BY a.walletID DESC LIMIT 0, 120`;
          found = true; 
      } else if ((req.session.groupID > 1) && ((req.session.roleID == 5)||(req.session.roleID == 6))) {
          sql0 += ` SELECT a.dateAdded, CONCAT(FORMAT((SUM(credit)-SUM(debit)),0,'vi_VN'),'đ') AS 'walletpay',  `;
          sql0 += ` CONCAT(FORMAT(COALESCE(((SELECT SUM(credit) FROM wallet b WHERE (TO_DAYS(b.dateAdded) <= TO_DAYS(a.dateAdded)) AND (b.memberID = ${req.session.memberID})) - (SELECT SUM(debit) FROM wallet b WHERE (TO_DAYS(b.dateAdded) <= TO_DAYS(a.dateAdded)) AND (b.memberID = ${req.session.memberID}) )), 0),0,'vi_VN'),'đ') as 'balance' `;
          sql0 += ` FROM wallet a WHERE   `; 
          sql0 +=  ` (a.status > 1) AND `;
          sql0 +=  ` (a.memberID = ${req.session.memberID}) GROUP BY a.dateAdded ORDER BY a.dateAdded DESC LIMIT 0, 30`;
          found = true; 
      } else {
        /* FOR TESTING
          sql0 += ` SELECT a.dateAdded, `;
          sql0 += ` CONCAT(FORMAT(SUM(credit),0,'vi_VN'),'đ') AS 'rewards', CONCAT( FORMAT(SUM(debit),0,'vi_VN'),'đ') AS 'withdraw', `;
          sql0 += ` CONCAT(FORMAT(COALESCE(((SELECT SUM(credit) FROM wallet b WHERE (TO_DAYS(b.dateAdded) <= TO_DAYS(a.dateAdded)) AND (b.memberID = 9)) - (SELECT SUM(debit) FROM wallet b WHERE (TO_DAYS(b.dateAdded) <= TO_DAYS(a.dateAdded)) AND (b.memberID = 9) )), 0),0,'vi_VN'),'đ') as 'balance' `;
          sql0 += ` FROM wallet a WHERE   `; 
          //sql0 +=  ` (status > 1) AND `;
          sql0 +=  ` (a.memberID = 9) GROUP BY DATE(a.dateAdded ) ORDER BY DATE(a.dateAdded) DESC `;
          found = true; 
        */
          found = false; 
      }
      if (found) {
        console.log("sql0: " + sql0);
        tbls['wallet'].execSQL(sql0, function(error, result) {
          if (error) throw error;
          console.table(result)
          res.send(result);
        })
      } else {
        res.send([]);
      }
    } catch (error) {
      res.send({ error: -1, message: 'Unknown exception' });
      console.log('API-Exception', error);
    }
  }
});

app.post('/walletdetails/:wid/:saleid/:dateadded', function(req, res, next){
  if (cmfunc.isEmpty(req.session.user)) { res.redirect('/'); }// if user is not logged-in redirect back to login page //
  else {
    try {
      console.log(cmfunc.getTimeStamp() + `POST request to /walletdetails/${req.params.wid}/${req.params.saleid}/${req.params.dateadded}`);
      let found = false;
      let sql0 = ``;
      if (req.params.wid && (req.params.wid > 0) && (req.params.saleid > 0) && ((req.session.roleID==3) || (req.session.roleID==7))) {
          sql0 += ` SELECT a.walletID, a.dateAdded, b.saleID, b.star, b.dateAdded AS "xchangeDT", e.productName, f.memberID AS "customerID", g.name AS "agestaffName",  g.memberID AS "agestaffID", `;
          sql0 += ` h.customerBonus, h.agentstaffBonus, j.company AS "companyName", j.address, j.wardsID, j.provincesID  `;
          sql0 += ` FROM wallet a, sale b, proditem c, prodman d, product e, memberx f, memberx g, memberx j, promotion h WHERE  `; 
          sql0 += ` (a.walletID = ${req.params.wid}) AND (a.saleID = b.saleID) AND (a.saleID = c.saleID)`;
          sql0 += ` AND (c.prodmanID = d.prodmanID) AND (d.productID = e.productID) AND (b.customerID = f.memberID)`;
          sql0 += ` AND (b.agentStaffID = g.memberID) AND (c.promotionID = h.promotionID) AND (g.parentID = j.memberID )`;
          found = true; 
      } else if (req.params.wid && (req.params.wid > 0) && (req.params.saleid == 0) && ((req.session.roleID==3) || (req.session.roleID==7))) {
          sql0 += ` SELECT a.walletID, a.dateAdded, a.lastChanged AS "xchangeDT", a.comment, a.debit, f.memberID AS "personID", f.name AS "personName", `;
          sql0 += ` f.address, f.wardsID, f.provincesID  `;
          sql0 += ` FROM wallet a, memberx f WHERE  `; 
          sql0 += ` (a.walletID = ${req.params.wid}) AND (a.memberID= f.memberID)`;
          found = true; 
      } else {
          sql0 += ` SELECT a.walletID, a.saleID, a.comment, a.debit, a.credit, f.memberID AS "personID", f.name AS "personName", `;
          sql0 += ` f.address, f.wardsID, f.provincesID,  `;
          sql0 += ` CASE WHEN a.credit > 0 THEN CONCAT(a.dateAdded,', #', a.saleID)`;
          sql0 += ` WHEN ((debit > 0) AND (paytype=1)) THEN CONCAT(a.dateAdded,', TopUp ', refID) `;
          sql0 += ` WHEN ((debit > 0) AND (paytype=2)) THEN CONCAT(a.dateAdded,', Momo ', refID) `;
          sql0 += ` ELSE CONCAT(a.dateAdded,'#', saleID) `;
          sql0 += ` END AS 'wallettype', `;
          sql0 += ` CASE WHEN a.credit > 0 THEN CONCAT('+', FORMAT(a.credit,0,'vi_VN'),'đ') `;
          sql0 += ` WHEN a.debit > 0 THEN CONCAT('-', FORMAT(a.debit,0,'vi_VN'),'đ')`;
          sql0 += ` ELSE '0đ' `;
          sql0 += ` END AS 'walletpay' `;
          sql0 += ` FROM wallet a, memberx f WHERE  (a.memberID = f.memberID) AND (a.status = 2)`; 
          sql0 += ` AND (TO_DAYS(a.dateAdded) = TO_DAYS("${req.params.dateadded}")) AND (a.memberID= ${req.session.memberID})`;
          found = true; 
      }
      if (found) {
        console.log("sql0: " + sql0);
        tbls['wallet'].execSQL(sql0, function(error, result) {
          if (error) throw error;
          console.table(result)
          res.send(result);
        })
      } else {
        res.send([]);
      }
    } catch (error) {
      res.send({ error: -1, message: 'Unknown exception' });
      console.log('API-Exception', error);
    }
  }
});

app.post('/walletapproval/:mode', function(req, res, next){
  if (cmfunc.isEmpty(req.session.user)) { res.redirect('/'); }// if user is not logged-in redirect back to login page //
  else {
    try {
      console.log(cmfunc.getTimeStamp() + `POST request to /walletapproval/${req.params.mode}`);
      let found = false;
      let sql0 = ``;
      if (req.params.mode==0) {
        if (req.session.groupID > 1) {
          if (req.session.roleID == 6) {
            sql0 = `SELECT b.name AS "memberName", a.dateAdded, COUNT(DISTINCT a.saleID) AS "Qty", SUM(a.credit) AS "creditx" `;
              sql0 += ` FROM wallet a, sale y,  memberx b  WHERE  `; 
              sql0 += ` (a.saleID = y.saleID) AND (a.dateAdded >  (CURRENT_DATE() - INTERVAL 2 MONTH))  `;
              //sql0 += ` (a.saleID = y.saleID)  `;
              sql0 += ` AND (y.agentStaffID = b.memberID) AND (b.parentID =  ${req.session.memberID}) `;
              sql0 += ` AND (a.groupID = ${req.session.groupID}) AND (a.status = 1) `;
              sql0 += ` GROUP BY b.memberID, a.dateAdded `
              found = true; 
          } 
        }
      } else {
        if (req.session.groupID > 1) {
          if (req.session.roleID == 6) {
            sql0 = `SELECT e.productName, a.dateAdded, COUNT(c.proditemID) AS "Qty" `;
              sql0 += ` FROM wallet a, sale y,  memberx b, proditem c, prodman d, product e  WHERE  `; 
              sql0 += ` (a.saleID = y.saleID) AND (a.dateAdded >  (CURRENT_DATE() - INTERVAL 2 MONTH))  `;
              //sql0 += ` (a.saleID = y.saleID)  `;
              sql0 += ` AND (y.saleID = c.saleID) AND (y.agentStaffID = b.memberID) AND (b.parentID =  ${req.session.memberID}) `;
              sql0 += ` AND (c.prodmanID = d.prodmanID) AND (d.productID = e.productID) `;
              sql0 += ` AND (a.groupID = ${req.session.groupID}) AND (a.status = 1) `;
              sql0 += ` GROUP BY d.productID, a.dateAdded `;
              found = true; 
          } 
        }
      }
      console.log("sql0: " + sql0);
      if (found) {
        tbls['wallet'].execSQL(sql0, function(error, result) {
          if (error) throw error;
          console.table(result)
          res.send(result);
        })
      } else {
        res.send([]);
      }
    } catch (error) {
      res.send({ error: -1, message: 'Unknown exception' });
      console.log('API-Exception', error);
    }
  }
});

app.post('/walletoutstandingByDate/:mode/:datex', function(req, res, next){
  if (cmfunc.isEmpty(req.session.user)) { res.redirect('/'); }// if user is not logged-in redirect back to login page //
  else {
    try {
      console.log(cmfunc.getTimeStamp() + `POST request to /walletoutstandingByDate/${req.params.mode}/${req.params.datex}`);
      let found = false;
      let sql0 = ``;
      if (req.params.mode==0) {
        if (req.session.groupID > 1) {
          if (req.session.roleID == 6) {
            sql0 = `SELECT a.dateAdded, COUNT(DISTINCT a.saleID) AS "Qty", SUM(a.credit) AS "tCredit" `;
            sql0 += ` FROM wallet a, sale y,  memberx b  WHERE  `; 
            sql0 += ` (a.saleID = y.saleID)  `;
            //sql0 += ` (a.saleID = y.saleID) AND (a.dateAdded >  (CURRENT_DATE() - INTERVAL 3 MONTH))  `;
            sql0 += ` AND (y.agentStaffID = b.memberID) AND (b.parentID =  ${req.session.memberID}) `;
            sql0 += ` AND (a.groupID = ${req.session.groupID}) AND (a.status = 1) `;
            sql0 += ` GROUP BY a.dateAdded ORDER BY a.dateAdded desc `
            found = true; 
          } 
        }
      } else if (req.params.mode==1) {  
        if (req.session.groupID > 1) {
          if (req.session.roleID == 6) {
            sql0 = `SELECT b.memberID, b.name AS "memberName", `;
            sql0 += ` COUNT(DISTINCT a.saleID) AS "Qty", SUM(a.credit) AS "tCredit" `;
            sql0 += ` FROM wallet a, sale y, memberx b  WHERE  `; 
            sql0 += ` (a.saleID = y.saleID) AND (a.dateAdded =  "${req.params.datex}")  `;
            sql0 += ` AND (y.agentStaffID = b.memberID) AND (b.parentID =  ${req.session.memberID}) `;
            sql0 += ` AND (a.groupID = ${req.session.groupID}) AND (a.status = 1) `;
            sql0 += ` GROUP BY b.memberID ORDER BY Qty `
            found = true; 
          } 
        }
      } else if (req.params.mode==2) {
          sql0 = `SELECT SUBSTRING_INDEX(e.productName,'-',1) AS 'name', COUNT(c.proditemID) AS "Qty" `;
          sql0 += ` FROM wallet a, proditem c, prodman d, product e   WHERE  `; 
          sql0 += ` (a.saleID = c.saleID) AND (a.dateAdded =  "${req.params.datex}")  `;
          sql0 += ` AND (c.prodmanID = d.prodmanID) AND (d.productID = e.productID) `;
          sql0 += ` AND (a.status = 1) `;
          sql0 += ` GROUP BY e.productID ORDER BY Qty desc, e.productName `
          found = true; 
      }
      console.log("sql0: " + sql0);
      if (found) {
        tbls['wallet'].execSQL(sql0, function(error, result) {
          if (error) throw error;
          console.table(result)
          res.send(result);
        })
      } else {
        res.send([]);
      }
    } catch (error) {
      res.send({ error: -1, message: 'Unknown exception' });
      console.log('API-Exception', error);
    }
  }
});

app.post('/approvedwallet', function(req, res, next){
  if (cmfunc.isEmpty(req.session.user)) { res.redirect('/'); }// if user is not logged-in redirect back to login page //
  else {
    try {
      console.log(cmfunc.getTimeStamp() + `POST request to /approvedwallet`);
      let sql0 = ``;
      sql0 = ` UPDATE wallet a, memberx b, sale d SET a.status = 2 WHERE `;
      sql0 += ` (a.saleID = d.saleID) AND (d.agentStaffID = b.memberID) AND (b.parentID =  ${req.session.memberID})`;
      sql0 += ` AND (a.groupID = ${req.session.groupID}) AND (a.status = 1) `;
      console.log("sql0: " + sql0);
      tbls['wallet'].execSQL(sql0, function(error, data) {
        if (error) throw error;
        console.log("Wallet is successfully updated...");
        res.send({'status': 0});
      })
    } catch (error) {
      res.send({ status: -1, message: 'Unknown exception' });
      console.log('API-Exception', error);
    }
  }
});

app.post('/saleitemlist/:sid', function(req, res, next){
  if (cmfunc.isEmpty(req.session.user)) { res.redirect('/'); }// if user is not logged-in redirect back to login page //
  else {
    try {
      console.log(cmfunc.getTimeStamp() + `POST request to /saleitemlist/${req.params.sid}`);
      let found = false;
      let sql0 = `SET @row_number = 0; `;
      sql0 += ` SELECT  a.*, (@row_number:=@row_number + 1) AS 'idx', `;
      sql0 += ` c.productID, c.imgLink, d.subdir, e.customerBonus, e.agentstaffBonus, e.agentBonus, e.diststaffBonus `;
      sql0 += ` FROM proditem a, prodman b, product c, groupx d, promotion e WHERE  `; 
      sql0 += ` (a.prodmanID = b.prodmanID) AND (a.saleID = ${req.params.sid}) AND (b.groupID = d.groupID) AND (b.productID = c.productID)`;
      sql0 += ` AND (c.promotionID = e.promotionID) `;
      if ((req.session.groupID > 1) && ((req.session.roleID < 3) || (req.session.roleID > 4) ) ) {
        sql0 +=  ` AND (b.groupID = ${req.session.groupID}) `;
        found = true;
      } else if (req.session.groupID == 1) {
        found = true;
      }
      console.log("sql0: " + sql0);
      if (found) {
        tbls['proditem'].execSQL(sql0, function(error, result) {
          if (error) throw error;
          //console.log(result);
          res.send(result[1]);
        })
      } else {
        res.send([]);
      }
    } catch (error) {
      res.send({ error: -1, message: 'Unknown exception' });
      console.log('API-Exception', error);
    }
  }
});


app.post('/esmslist', function(req, res, next){
  if (cmfunc.isEmpty(req.session.user)) { res.redirect('/'); }// if user is not logged-in redirect back to login page //
  else {
    try {
      console.log(cmfunc.getTimeStamp() + `POST request to /esmslist`);
      let found = false;
      let sql0 = ``;
      if (req.session.roleID == 1) { 
        sql0 = `SELECT a.* `;
        sql0 += ` FROM esms a `;
        found = true; 
      }
      if (found) {
        tbls['esms'].execSSQL(sql0, req.body, function(error, result) {
          if (error) throw error;
          res.send(result);
        })
      } else {
        res.send([]);
      }
    } catch (error) {
      res.send({ error: -1, message: 'Unknown exception' });
      console.log('API-Exception', error);
    }
  }
});

app.post('/etopuplist', function(req, res, next){
  if (cmfunc.isEmpty(req.session.user)) { res.redirect('/'); }// if user is not logged-in redirect back to login page //
  else {
    try {
      console.log(cmfunc.getTimeStamp() + `POST request to /etopuplist`);
      let found = false;
      let sql0 = ``;
      if (req.session.roleID == 1) { 
        sql0 = `SELECT a.* `;
        sql0 += ` FROM etopup a `;
        found = true; 
      }
      if (found) {
        tbls['etopup'].execSSQL(sql0, req.body, function(error, result) {
          if (error) throw error;
          res.send(result);
        })
      } else {
        res.send([]);
      }
    } catch (error) {
      res.send({ error: -1, message: 'Unknown exception' });
      console.log('API-Exception', error);
    }
  }
});
//***********************  CHARTS   ************************************** */
app.get('/top10category', function(req, res, next){
  if (cmfunc.isEmpty(req.session.user)) { res.redirect('/'); }// if user is not logged-in redirect back to login page //
  else {
    try {
      console.log(cmfunc.getTimeStamp() + `GET request to /top10category`);
      let found = false;
      let sql0 = `SET @row_number = 0; `;
      sql0 += ` SELECT  COUNT(a.proditemID) AS 'subtotal', (@row_number:=@row_number + 1) AS 'idx', `;
      sql0 += ` f.name, f.imgLink, f.memberID, g.subdir, h.company   `;
      sql0 += ` FROM proditem a, prodman b, sale c, memberx d, memberx e, memberx f, memberx h, groupx g WHERE  `; 
      sql0 += ` (a.prodmanID = b.prodmanID) AND (a.saleID = c.saleID) AND (c.agentStaffID = d.memberID) AND (b.groupID = g.groupID) `;
      sql0 += ` AND (d.parentID = e.memberID) AND (e.parentID = f.memberID) AND (f.parentID = h.memberID) `;
      if (req.session.groupID > 1) {
        sql0 +=  ` AND (b.groupID = ${req.session.groupID}) `;
        found = true;
      } else if (req.session.groupID == 1) {
        found = true;
      }
      sql0 += ` GROUP BY f.memberID ORDER BY subtotal DESC LIMIT 0, 10`;
      console.log("sql0: " + sql0);
      if (found) {
        tbls['proditem'].execSQL(sql0, function(error, result) {
          if (error) throw error;
          //console.log(result);
          res.send(result[1]);
        })
      } else {
        res.send([]);
      }
    } catch (error) {
      res.send({ error: -1, message: 'Unknown exception' });
      console.log('API-Exception', error);
    }
  }
});
app.get('/top10agent', function(req, res, next){
  if (cmfunc.isEmpty(req.session.user)) { res.redirect('/'); }// if user is not logged-in redirect back to login page //
  else {
    try {
      console.log(cmfunc.getTimeStamp() + `GET request to /top10agent`);
      let found = false;
      let sql0 = `SET @row_number = 0; `;
      sql0 += ` SELECT  COUNT(a.proditemID) AS 'subtotal', (@row_number:=@row_number + 1) AS 'idx', `;
      sql0 += ` e.name, e.imgLink, e.memberID, g.subdir, h.company `;
      sql0 += ` FROM proditem a, prodman b, sale c, memberx d, memberx e, memberx f, memberx h,  groupx g WHERE  `; 
      sql0 += ` (a.prodmanID = b.prodmanID) AND (a.saleID = c.saleID) AND (c.agentStaffID = d.memberID) AND (b.groupID = g.groupID) `;
      sql0 += ` AND (d.parentID = e.memberID) AND (e.parentID = f.memberID) AND (f.parentID = h.memberID) `;
      if (req.session.groupID > 1) {
        sql0 +=  ` AND (b.groupID = ${req.session.groupID}) `;
        found = true;
      } else if (req.session.groupID == 1) {
        found = true;
      }
      sql0 += ` GROUP BY e.memberID ORDER BY subtotal DESC LIMIT 0, 10 `;
      console.log("sql0: " + sql0);
      if (found) {
        tbls['proditem'].execSQL(sql0, function(error, result) {
          if (error) throw error;
          res.send(result[1]);
        })
      } else {
        res.send([]);
      }
    } catch (error) {
      res.send({ error: -1, message: 'Unknown exception' });
      console.log('API-Exception', error);
    }
  }
});
app.get('/top10agentstaff', function(req, res, next){
  if (cmfunc.isEmpty(req.session.user)) { res.redirect('/'); }// if user is not logged-in redirect back to login page //
  else {
    try {
      console.log(cmfunc.getTimeStamp() + `GET request to /top10agentstaff`);
      let found = false;
      let sql0 = ``;
      sql0 += ` SELECT  COUNT(a.proditemID) AS 'subtotal', `;
      sql0 += ` d.name, d.imgLink, d.memberID,  g.subdir, e.company  `;
      sql0 += ` FROM proditem a, prodman b, sale c, memberx d, memberx e, memberx f, groupx g WHERE  `; 
      sql0 += ` (a.prodmanID = b.prodmanID) AND (a.saleID = c.saleID) AND (c.agentStaffID = d.memberID) AND (b.groupID = g.groupID) `;
      sql0 += ` AND (d.parentID = e.memberID) AND (e.parentID = f.memberID) `;
      if (req.session.groupID > 1) {
        sql0 +=  ` AND (b.groupID = ${req.session.groupID}) `;
        found = true;
      } else if (req.session.groupID == 1) {
        found = true;
      }
      sql0 += ` GROUP BY d.memberID ORDER BY subtotal DESC  LIMIT 0, 10`;
      console.log("sql0: " + sql0);
      if (found) {
        tbls['proditem'].execSQL(sql0, function(error, result) {
          if (error) throw error;
          //console.log(result);
          let i = 1;
          const resultx = result.map((p) => ({
                ...p,
                idx: i++
          }))
          //console.log(resultx)
          res.send(resultx);
        })
      } else {
        res.send([]);
      }
    } catch (error) {
      res.send({ error: -1, message: 'Unknown exception' });
      console.log('API-Exception', error);
    }
  }
});
app.get('/top10products', function(req, res, next){
  if (cmfunc.isEmpty(req.session.user)) { res.redirect('/'); }// if user is not logged-in redirect back to login page //
  else {
    try {
      console.log(cmfunc.getTimeStamp() + `GET request to /top10products`);
      let found = false;
      let sql0 = ``;
      sql0 += ` SELECT  COUNT(a.proditemID) AS 'subtotal', `;
      sql0 += ` c.productName, c.imgLink, c.productID,  d.subdir  `;
      sql0 += ` FROM proditem a, prodman b, product c, groupx d WHERE  `; 
      sql0 += ` (a.prodmanID = b.prodmanID) AND (b.productID = c.productID) AND (b.groupID = d.groupID) AND (a.status = 2)`;
      if (req.session.groupID > 1) {
        sql0 +=  ` AND (b.groupID = ${req.session.groupID}) `;
        found = true;
      } else if (req.session.groupID == 1) {
        found = true;
      }
      sql0 += ` GROUP BY c.productID ORDER BY subtotal DESC  LIMIT 0, 10`;
      console.log("sql0: " + sql0);
      if (found) {
        tbls['product'].execSQL(sql0, function(error, result) {
          if (error) throw error;
          //console.log(result);
          let i = 1;
          const resultx = result.map((p) => ({
                ...p,
                idx: i++
          }))
          //console.log(resultx)
          res.send(resultx);
        })
      } else {
        res.send([]);
      }
    } catch (error) {
      res.send({ error: -1, message: 'Unknown exception' });
      console.log('API-Exception', error);
    }
  }
});
app.get('/chartdata', function(req, res, next){
  if (cmfunc.isEmpty(req.session.user)) { res.redirect('/'); }// if user is not logged-in redirect back to login page //
  else {
    try {
      console.log(cmfunc.getTimeStamp() + `GET request to /chartdata`);
      let found = false;
      let sql0 = ` `;
      if (req.session.roleID == 1) {
        sql0 += ` SELECT  COUNT(a.proditemID) AS 'subtotal',  DATE(c.dateAdded) AS 'date', `;
        sql0 += ` g.name AS 'distName', f.name AS 'diststaffName', e.name AS 'agentName', d.name AS 'agentstaffName'  `;
        sql0 += ` FROM proditem a, prodman b, sale c, memberx d, memberx e, memberx f, memberx g  WHERE  `; 
        sql0 += ` (a.prodmanID = b.prodmanID) AND (a.saleID = c.saleID) AND (c.agentStaffID = d.memberID) `;
        sql0 += ` AND (d.parentID = e.memberID) AND (e.parentID = f.memberID) AND (f.parentID = g.memberID)`;
        sql0 += ` AND (TO_DAYS(c.dateAdded) > TO_DAYS('${moment().subtract(24, 'months').format("YYYY-MM-DD")}'))`;
      } else if (req.session.roleID == 4) {
        sql0 += ` SELECT  COUNT(a.proditemID) AS 'subtotal',  DATE(c.dateAdded) AS 'date', `;
        sql0 += ` f.name AS 'diststaffName', e.name AS 'agentName', d.name AS 'agentstaffName'  `;
        sql0 += ` FROM proditem a, prodman b, sale c, memberx d, memberx e, memberx f  WHERE  `; 
        sql0 += ` (a.prodmanID = b.prodmanID) AND (a.saleID = c.saleID) AND (c.agentStaffID = d.memberID) `;
        sql0 += ` AND (d.parentID = e.memberID) AND (e.parentID = f.memberID) AND (f.parentID = ${req.session.memberID}) `;
        sql0 += ` AND (TO_DAYS(c.dateAdded) > TO_DAYS('${moment().subtract(24, 'months').format("YYYY-MM-DD")}'))`;
      } else if (req.session.roleID == 5) {
        sql0 += ` SELECT  COUNT(a.proditemID) AS 'subtotal',  DATE(c.dateAdded) AS 'date', `;
        sql0 += ` e.name AS 'agentName', d.name AS 'agentstaffName'  `;
        sql0 += ` FROM proditem a, prodman b, sale c, memberx d, memberx e  WHERE  `; 
        sql0 += ` (a.prodmanID = b.prodmanID) AND (a.saleID = c.saleID) AND (c.agentStaffID = d.memberID) `;
        sql0 += ` AND (d.parentID = e.memberID)  AND (e.parentID = ${req.session.memberID}) `;
        sql0 += ` AND (TO_DAYS(c.dateAdded) > TO_DAYS('${moment().subtract(24, 'months').format("YYYY-MM-DD")}'))`;
      } else if (req.session.roleID == 6) {
        sql0 += ` SELECT  COUNT(a.proditemID) AS 'subtotal',  DATE(c.dateAdded) AS 'date', `;
        sql0 += ` d.name AS 'agentstaffName'  `;
        sql0 += ` FROM proditem a, prodman b, sale c, memberx d  WHERE  `; 
        sql0 += ` (a.prodmanID = b.prodmanID) AND (a.saleID = c.saleID) AND (c.agentStaffID = d.memberID) `;
        sql0 += ` AND (d.parentID = ${req.session.memberID}) `;
        sql0 += ` AND (TO_DAYS(c.dateAdded) > TO_DAYS('${moment().subtract(24, 'months').format("YYYY-MM-DD")}'))`;
      }
      if (req.session.groupID > 1) {
        sql0 +=  ` AND (b.groupID = ${req.session.groupID}) `;
        found = true;
      } else if (req.session.groupID == 1) {
        found = true;
      }
      sql0 += ` GROUP BY c.agentStaffID, DATE(c.dateAdded)  `;
      sql0 += ` ORDER BY DATE(c.dateAdded)  `;
      console.log("sql0: " + sql0);
      if (found) {
        tbls['proditem'].execSQL(sql0, function(error, result) {
          if (error) throw error;
          if (result.length > 0 ) {
            console.table(result)
            var resultx = {};
            if (req.session.roleID == 1) {
              resultx.distName = result[0].distName;
              resultx.diststaffName = result[0].diststaffName;
              resultx.agentName = result[0].agentName;
            } else if (req.session.roleID == 4) {  
              resultx.diststaffName = result[0].diststaffName;
              resultx.agentName = result[0].agentName;
            } else if (req.session.roleID == 5) {  
              resultx.agentName = result[0].agentName;  
            }
            resultx.result = result;
            res.send(resultx);
          } else {
            res.send([]);
          }
        
        })
      } else {
        res.send([]);
      }
    } catch (error) {
      res.send({ error: -1, message: 'Unknown exception' });
      console.log('API-Exception', error);
    }
  }
});

app.get('/saledata', function(req, res, next){
  if (cmfunc.isEmpty(req.session.user)) { res.redirect('/'); }// if user is not logged-in redirect back to login page //
  else {
    try {
      console.log(cmfunc.getTimeStamp() + `GET request to /saledata`);
      let found = false;
      let sql0 = ` `;
      if (req.session.roleID == 1) {
        sql0 += ` SELECT b.productID,  COUNT(a.proditemID) AS 'subtotal',  DATE(c.dateAdded) AS 'date', h.productName, i.categoryName, j.brandName, `;
        sql0 += ` g.name AS 'distName', f.name AS 'diststaffName', e.name AS 'agentName', d.name AS 'agentstaffName'  `;
        sql0 += ` FROM proditem a, prodman b, product h, category i, brand j, sale c, memberx d, memberx e, memberx f, memberx g  WHERE  `; 
        sql0 += ` (a.prodmanID = b.prodmanID) AND (a.saleID = c.saleID) AND (c.agentStaffID = d.memberID) AND (b.productID = h.productID) AND (h.categoryID = i.categoryID) AND (h.brandID = j.brandID) `;
        sql0 += ` AND (d.parentID = e.memberID) AND (e.parentID = f.memberID) AND (f.parentID = g.memberID) `;
        sql0 += ` AND (TO_DAYS(c.dateAdded) > TO_DAYS('${moment().subtract(24, 'months').format("YYYY-MM-DD")}'))`;
      } else if (req.session.roleID == 4) {
        sql0 += ` SELECT b.productID,  COUNT(a.proditemID) AS 'subtotal',  DATE(c.dateAdded) AS 'date', h.productName, i.categoryName, `;
        sql0 += ` f.name AS 'diststaffName', e.name AS 'agentName', d.name AS 'agentstaffName'  `;
        sql0 += ` FROM proditem a, prodman b, product h, category i, sale c, memberx d, memberx e, memberx f  WHERE  `; 
        sql0 += ` (a.prodmanID = b.prodmanID) AND (a.saleID = c.saleID) AND (c.agentStaffID = d.memberID) AND (b.productID = h.productID) AND (h.categoryID = i.categoryID) `;
        sql0 += ` AND (d.parentID = e.memberID) AND (e.parentID = f.memberID) AND (f.parentID = ${req.session.memberID}) `;
        sql0 += ` AND (TO_DAYS(c.dateAdded) > TO_DAYS('${moment().subtract(24, 'months').format("YYYY-MM-DD")}'))`;
      } else if (req.session.roleID == 5) {
        sql0 += ` SELECT b.productID,  COUNT(a.proditemID) AS 'subtotal',  DATE(c.dateAdded) AS 'date', h.productName, i.categoryName, `;
        sql0 += ` e.name AS 'agentName', d.name AS 'agentstaffName'  `;
        sql0 += ` FROM proditem a, prodman b, product h, category i, sale c, memberx d, memberx e  WHERE  `; 
        sql0 += ` (a.prodmanID = b.prodmanID) AND (a.saleID = c.saleID) AND (c.agentStaffID = d.memberID) AND (b.productID = h.productID) AND (h.categoryID = i.categoryID) `;
        sql0 += ` AND (d.parentID = e.memberID)  AND (e.parentID = ${req.session.memberID}) `;
        sql0 += ` AND (TO_DAYS(c.dateAdded) > TO_DAYS('${moment().subtract(24, 'months').format("YYYY-MM-DD")}'))`;
      } else if (req.session.roleID == 6) {
        sql0 += ` SELECT b.productID,  COUNT(a.proditemID) AS 'subtotal',  DATE(c.dateAdded) AS 'date', h.productName, i.categoryName, `;
        sql0 += ` d.name AS 'agentstaffName'  `;
        sql0 += ` FROM proditem a, prodman b, product h, category i, sale c, memberx d  WHERE  `; 
        sql0 += ` (a.prodmanID = b.prodmanID) AND (a.saleID = c.saleID) AND (c.agentStaffID = d.memberID) AND (b.productID = h.productID) AND (h.categoryID = i.categoryID) `;
        sql0 += ` AND (d.parentID = ${req.session.memberID}) `;
        sql0 += ` AND (TO_DAYS(c.dateAdded) > TO_DAYS('${moment().subtract(24, 'months').format("YYYY-MM-DD")}'))`;
      }
      if (req.session.groupID > 1) {
        sql0 +=  ` AND (b.groupID = ${req.session.groupID}) `;
        found = true;
      } else if (req.session.groupID == 1) {
        found = true;
      }
      sql0 += ` GROUP BY b.productID, DATE(c.dateAdded)  `;
      sql0 += ` ORDER BY b.productID `;
      console.log("sql0: " + sql0);
      if (found) {
        tbls['proditem'].execSQL(`SELECT COUNT(*) AS "total" FROM sale`, function(errora, resulta) {
          if (errora) throw errora;
          console.log(resulta)
          if (resulta.total > 0 ) {
            tbls['proditem'].execSQL(sql0, function(error, result) {
              if (error) throw error;
              if (result.length > 0 ) {
                //console.table(result)
                var resultx = {};
                resultx.brandName = result[0].brandName;
                resultx.catName = result[0].categoryName;
                console.log(result[0].categoryName)
                resultx.result = result;
                res.send(resultx);
              } else {
                res.send({result:[]});
              }
            })
          } else {
            res.send({result:[]});
          }
        })
      } else {
        res.send({result:[]});
      }
    } catch (error) {
      res.send({ error: -1, message: 'Unknown exception' });
      console.log('API-Exception', error);
    }
  }
});

app.get('/prodmandata', function(req, res, next){
  if (cmfunc.isEmpty(req.session.user)) { res.redirect('/'); }// if user is not logged-in redirect back to login page //
  else {
    try {
      console.log(cmfunc.getTimeStamp() + `GET request to /prodmandata`);
      let found = false;
      let sql0 = ` `;
      sql0 += ` SELECT  a.qty AS 'subtotal',  DATE(a.manDate) AS 'date', `;
      sql0 += ` b.productName, c.categoryName , d.brandName `;
      sql0 += ` FROM prodman a, product b, category c, brand d  WHERE  `; 
      sql0 += ` (a.productID = b.productID) AND (b.categoryID = c.categoryID) AND (b.brandID = d.brandID) AND (b.productID > 2) `;
      sql0 += ` AND (TO_DAYS(a.manDate) > TO_DAYS('${moment().subtract(24, 'months').format("YYYY-MM-DD")}'))`;
      if (req.session.groupID > 1) {
        sql0 +=  ` AND (a.groupID = ${req.session.groupID}) `;
        found = true;
      } else if (req.session.groupID == 1) {
        found = true;
      }
      console.log("sql0: " + sql0);
      if (found) {
        tbls['prodman'].execSQL(sql0, function(error, result) {
          if (error) throw error;
          if (result.length > 0 ) {
            var resultx = {};
            resultx.categoryName = result[0].categoryName;
            resultx.brandName = result[0].brandName;
            resultx.result = result;
            res.send(resultx);
          } else {
            res.send([]);
          }
        
        })
      } else {
        res.send([]);
      }
    } catch (error) {
      res.send({ error: -1, message: 'Unknown exception' });
      console.log('API-Exception', error);
    }
  }
});


app.post('/getdiarynv', function (req, res) {
  if (cmfunc.isEmpty(req.session.user)) { res.redirect('/'); }// if user is not logged-in redirect back to login page //
  else {
    console.log(cmfunc.getTimeStamp() + "/getdiarynv");
    console.log(req.body)
    var  sql0 = `SELECT a.*, b.name, b.company FROM diary a, memberx b WHERE (a.diaryID=${req.body.diaryID}) AND (a.customerID = b.memberID)`;
    console.log(sql0);
    tbls['memberx'].execSQL(sql0, function (error, data) {
      if (error) {
        throw error
      } else {
        res.send(data)
      }
    })
  }
})



app.post('/getdiarymsg', function (req, res) {
  if (cmfunc.isEmpty(req.session.user)) { res.redirect('/'); }// if user is not logged-in redirect back to login page //
  else {
    console.log(cmfunc.getTimeStamp() + "/getdiarymsg");
    console.log(req.body)
    var  sql0 = `SELECT a.*, b.staffID, c.name AS 'staffname', d.name AS 'teammember' FROM diarymsg a, diary b, memberx c, memberx d `;
    sql0 += ` WHERE (a.diaryID=${req.body.diaryID})  AND (a.diaryID = b.diaryID) AND (b.staffID = c.memberID) AND (a.teammemberID=d.memberID)`;
    console.log(sql0);
    tbls['diarymsg'].execSQL(sql0, function (error, data) {
      if (error) {
        throw error
      } else {
        res.send(data)
      }
    })
  }
})

//************************************************************************ */
app.post('/uploadimages/:tbl/:searchkey/:id/:field', upload.any(), function (req, res) {
  if (cmfunc.isEmpty(req.session.user)) { res.redirect('/'); }// if user is not logged-in redirect back to login page //
  else {
    console.log(cmfunc.getTimeStamp() + "/uploadimages/"+ req.params.tbl + "/" + req.params.searchkey+ "/" + req.params.id+ "/" + req.params.field);
    let tbl = req.params.tbl;
    let filename, fname;
    let destination;
    console.log(req.files);
    let vfiles = req.files;
    let searchObj = {};
    searchObj[req.params.searchkey]= req.params.id;
    tbls[tbl].findOne(searchObj, function (error, data) {
      if (error) { res.send(JSON.stringify({ error: la.deletefailed }));
      } else {
        
        if (req.params.field !== 'logoblank.png') {
          fname = `${$CVar.localStorage}/${data.subdir}/${req.params.field}`;
          console.log('delete fname: '+fname);
          if (fs.existsSync(fname)) {
            fs.unlinkSync(fname);
          }
        }
        vfiles.forEach(function (vfile) {
          filename = vfile.originalname;
          fname = vfile.path;
          destination = `${$CVar.localStorage}/${data.subdir}`;
          if (filename == 'image.jpg') {
            let timestamp = moment().valueOf();
            filename = `${timestamp}.jpg`;
            destination += `/${filename}`;
            console.log('rename '+fname+ ' to '+ destination);
            cmfunc.renameFile(fname, destination, function (e){
              if (e) throw e;
            })
          } else {
            console.log('move '+fname+ ' to '+ destination);
            cmfunc.moveFile(fname, destination, function (e){
              if (e) throw e;
            })
          }
        })
        res.send(`${data.subdir}/${filename}`);
      }
    })
  }
})

app.post('/deleteimages/:tbl/:searchkey/:id/:field', upload.any(), function (req, res) {
  if (cmfunc.isEmpty(req.session.user)) { res.redirect('/'); }// if user is not logged-in redirect back to login page //
  else {
    console.log(cmfunc.getTimeStamp() + "/deleteimages/"+ req.params.tbl + "/" + req.params.searchkey+ "/" + req.params.id+ "/" + req.params.field);
    let tbl = req.params.tbl;
    let filename, fname;
    let destination;
    let searchObj = {};
    searchObj[req.params.searchkey]= req.params.id;
    tbls[tbl].findOne(searchObj, function (error, data) {
      if (error) { res.send(JSON.stringify({ error: la.deletefailed }));
      } else {
        if (req.params.field !== 'logoblank.png') {
          fname = `${$CVar.localStorage}/${data.subdir}/${req.params.field}`;
          console.log('delete fname: '+fname);
          if (fs.existsSync(fname)) {
            fs.unlinkSync(fname);
          }
        }
        res.send(`${data.subdir}/`);
      }
    })
  }
})



//************************************************** */
  function pad(num, size) {
    num = num.toString();
    while (num.length < size) num = "0" + num;
    return num;
  }

  Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
  }
  
  function diffDays(d1, d2) {  //d1 & d2 is Date object
    // To calculate the time difference of two dates
    var Difference_In_Time = d1.getTime() - d2.getTime();
    // To calculate the no. of days between two dates
    var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
    return Difference_In_Days;
  }

} //End of Module
