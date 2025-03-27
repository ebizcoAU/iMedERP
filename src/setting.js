module.exports = function(app, session){
  var http = require("http");
  var path = require('path');
  var merge = require('merge'), original, cloned;
  var nodemailer = require('nodemailer');
  var moment = require('moment');
  var path = require('path');
  var cmfunc = require('./cmfunc');
  var tbls = require('./tables').tbls;
  var login = require('./login');
  var crypto = require('crypto');
  var random = require("node-random");
  var $CVar = require('./constants');
  var util = require('util');
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
  //overwrite the upload variable
  var upload = multer({storage});

  var randomstring = require("randomstring");
  var fs = require("fs"); //Load the filesystem module
  var pdf = require('html-pdf');
  var templateHtml;

  const { customAlphabet } = require('nanoid');
  var nanoid = customAlphabet('1234567890ABCDEFGHIJKLMNOPQRSTVWXYZabcdefghijklmnopqrstvuwxyz', 8);

//********* Common Functions ******************
/* private encryption & validation methods */
var generateSalt = function() {
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
var saltAndHash = function(pass, callback) {
  var salt = generateSalt();
  callback(salt + md5(pass + salt));
}

function mkDirByPathSync(targetDir, { isRelativeToScript = false } = {}) {
  const sep = path.sep;
  const initDir = path.isAbsolute(targetDir) ? sep : '';
  const baseDir = isRelativeToScript ? __dirname : '.';

  return targetDir.split(sep).reduce((parentDir, childDir) => {
    const curDir = path.resolve(baseDir, parentDir, childDir);
    try {
      fs.mkdirSync(curDir);
    } catch (err) {
      if (err.code === 'EEXIST') { // curDir already exists!
        return curDir;
      }

      // To avoid `EISDIR` error on Mac and `EACCES`-->`ENOENT` and `EPERM` on Windows.
      if (err.code === 'ENOENT') { // Throw the original parentDir error on curDir `ENOENT` failure.
        throw new Error(`EACCES: permission denied, mkdir '${parentDir}'`);
      }

      const caughtErr = ['EACCES', 'EPERM', 'EISDIR'].indexOf(err.code) > -1;
      if (!caughtErr || caughtErr && curDir === path.resolve(targetDir)) {
        throw err; // Throw if it's just the last created dir.
      }
    }

    return curDir;
  }, initDir);
}

//************* LOOK UP TABLES *******************/

app.post('/getsysteminfo', function (req, res) {
  console.log(cmfunc.getTimeStamp() + `/getsysteminfo`);
  tbls['systeminfo'].findOne({systeminfoID:1}, function(error, data) {
    res.send(JSON.stringify(data))
  })
})
app.post('/get/:tbl/:field1/:oper1/:value1/:join/:field2/:oper2/:value2', function (req, res) {
  if (cmfunc.isEmpty(req.session.user)) { res.redirect('/'); }// if user is not logged-in redirect back to login page //
  else {
    var order = req.body;
    var orderStr = '';
    if (!cmfunc.isEmptyObj(order)) {
      orderStr = `ORDER BY ${Object.keys(order)} ${Object.values(order)}`;
    }
    var tbl = req.params.tbl;
    if (tbl==='member') { tbl = 'memberx'; } //Update to compliant with reserved keyword member
    var field1 = req.params.field1;
    var value1 = req.params.value1;
    var oper1  = req.params.oper1;
    var join  = req.params.join;
    var field2 = req.params.field2;
    var value2 = req.params.value2;
    var oper2  = req.params.oper2;
    if (isNaN(value1)) { value1 = `'${value1}'`; }
    if (isNaN(value2)) { value2 = `'${value2}'`;  }
  console.log(cmfunc.getTimeStamp() + `/get/${tbl}/${field1}/${oper1}/${value1}/${join}/${field2}/${oper2}/${value2}`);
    var operx1 = '=';
    switch (oper1) {
      case 'less': operx1 = '<'; break;
      case 'greater': operx1 = ' > '; break;
      case 'lessequal': operx1 = '<='; break;
      case 'greaterequal': operx1 = '>='; break;
      case 'notequal': operx1 = '<>'; break;
      case 'equal': operx1 = '='; value1=`${value1}`; break;
      case 'eq': operx1 = '='; value1=`${value1}`; break;
      case 'like': operx1 = 'LIKE'; value1=`%${value1}%`; break;
      case 'null': operx1 = ''; value1=''; break;
      default: operx1 = '='; break;
    }
    if (join == 'nonstatus') { //Straight SQL without (status=1) constraint
      var sql = `SELECT * FROM ${tbl} WHERE (${field1} ${operx1} ${value1}) ${orderStr}`;
    } else if (join !== 'null') {
      var operx2 = '=';
      switch (oper2) {
        case 'less': operx2 = '<'; break;
        case 'greater': operx2 = ' > '; break;
        case 'lessequal': operx2 = '<='; break;
        case 'greaterequal': operx2 = '>='; break;
        case 'notequal': operx2 = '<>'; break;
        case 'equal': operx2 = '='; value2=`${value2}`; break;
        case 'eq': operx2 = '='; value2=`${value2}`; break;
        case 'like': operx2 = 'LIKE'; value2=`%${value2}%`; break;
        case 'null': operx2 = ''; value2= '';  break;
        default: operx2 = '='; break;
      }
      var sql = `SELECT * FROM ${tbl} WHERE ((${field1} ${operx1} ${value1}) ${join} (${field2} ${operx2} ${value2})) ${orderStr}`;
    } else {
      var sql = `SELECT * FROM ${tbl} WHERE (${field1} ${operx1} ${value1}) ${orderStr}`;
    }
    console.log('sql: '+ sql);
    tbls[tbl].execSQL(sql, function(error, data) {
      //console.log(JSON.stringify(data))
      if (data) {
        res.send(data);
      }
    })
  }
});

app.post('/getrecord/:tbl/:pid', function (req, res) {
  if (cmfunc.isEmpty(req.session.user)) { res.redirect('/'); }// if user is not logged-in redirect back to login page //
  else {
    var tbl = req.params.tbl;
    var pid = req.params.pid;
    console.log(cmfunc.getTimeStamp() + "/getrecord/"+tbl+"/"+pid);
    var primekey = tbls[tbl].getPrimKey();
    var obj = {};
    obj[primekey] = pid;
    tbls[tbl].findOne(obj, function(error, data) {
      if (data) {
        res.send(data);
      }
    })
  }
});
app.post('/get/:tbl', function (req, res) {
  if (cmfunc.isEmpty(req.session.user)) { res.redirect('/'); }// if user is not logged-in redirect back to login page //
  else {
    var tbl = req.params.tbl;
    if (tbl==='member') { tbl = 'memberx'; } //Update to compliant with reserved keyword member
    console.log(cmfunc.getTimeStamp() + "/get/"+tbl);
    //console.log(JSON.stringify(req.body));
    tbls[tbl].getAllRecords(null, null, function(error, data) {
      if (data) {
        console.log(JSON.stringify(data, false, 4))
        res.send(JSON.stringify(data));
      }
    })
  }
});
app.post('/reorder/:tbl', function (req, res) {
  if (cmfunc.isEmpty(req.session.user)) { res.redirect('/'); }// if user is not logged-in redirect back to login page //
  else {
    var tbl = req.params.tbl;
    console.log(cmfunc.getTimeStamp() + "/reorder/"+tbl);
    console.log('req.body: '+ JSON.stringify(req.body));
    let data = JSON.parse(req.body.data);
    console.log('data: '+ JSON.stringify(data));
    
  }
});
app.post('/update/:tbl',function (req, res) {
  if (cmfunc.isEmpty(req.session.user)) { res.redirect('/'); }// if user is not logged-in redirect back to login page //
  else {
    var tbl = req.params.tbl;
    if (tbl==='member') { tbl = 'memberx'; } //Update to compliant with reserved keyword member
    console.log(cmfunc.getTimeStamp() + "/update/"+tbl);
    console.log('req.body: '+ JSON.stringify(req.body));
    var data = req.body;
    if ('data' in req.body) {
      data = JSON.parse(req.body.data);
    }
    console.log(data);
    let tm = tbls[tbl].tm;
    let collectx=[];
    if (Array.isArray(data)) {
      data.forEach( function (datax, index){
        let temp = {};
        for (let i=0; i < Object.keys(datax).length; i++) {
          //console.log('key:'+Object.keys(datax)[i] + ', values:'+ Object.values(datax)[i] + ', type:' + tm[Object.keys(datax)[i]]);
          if (tm[Object.keys(datax)[i]] == 'string') {
            if ( (Object.values(datax)[i] !== null) && (typeof Object.values(datax)[i] !== "undefined")) {
              temp[Object.keys(datax)[i] ] = `${Object.values(datax)[i]}`;
            }
          } else if (tm[Object.keys(datax)[i]] == 'integer'){
            if ( !isNaN(parseInt(Object.values(datax)[i]) )) {
              temp[Object.keys(datax)[i] ] = parseInt(Object.values(datax)[i]);
            }
          } else if (tm[Object.keys(datax)[i]] == 'boolean'){
            if (Object.values(datax)[i] == false)  {
              temp[Object.keys(datax)[i] ] = 0;
            } else {
              temp[Object.keys(datax)[i] ] = 1;
            } 
          }
        }
        
        //console.log('tm: ' + JSON.stringify(tbls[tbl].tm))
        if ('lastChanged' in tbls[tbl].tm) { temp['lastChanged' ] = moment().format('YYYY-MM-DD HH:mm:ss'); }
        if ('lastPerson' in tbls[tbl].tm) { temp['lastPerson' ] = req.session.memberID }
        //Adding exception for a few tables

        if (tbl == 'awardtype') {
          let allowance = temp['monthlyAllowance'].replace(/(\d+),(?=\d{3}(\D|$))/g, "$1");
          temp['monthlyAllowance'] = parseInt(allowance,10);
          let monthlywages = temp['monthlyWages'].replace(/(\d+),(?=\d{3}(\D|$))/g, "$1");
          let weekwages = temp['weeklyWages'].replace(/(\d+),(?=\d{3}(\D|$))/g, "$1");
          //console.log("weekwages: " + weekwages);
          //console.log("country: " + req.session.country);
          if (monthlywages == 0) {
            if (req.session.country == "AU") {
              temp['monthlyWages' ] = Number.parseFloat( temp['rateFull'] * temp['hourperWeek'] *52 / 12).toFixed(2);
            } else {
              temp['monthlyWages' ] = Number.parseFloat( parseInt( temp['rateFull'], 10) * temp['hourperWeek']*52 / 12).toFixed(0);
            }
          }
          if (weekwages == 0) {
            if (req.session.country == "AU") {
              temp['weeklyWages' ] = Number.parseFloat( temp['rateFull'] * temp['hourperWeek']).toFixed(2);
            } else {
              temp['weeklyWages' ] = Number.parseFloat( parseInt( temp['rateFull'], 10) * temp['hourperWeek']).toFixed(0);
            }

          }
        }
        //*********************************
        //console.log('tempMulti:' + JSON.stringify(temp, false, 4));
        console.log(index + JSON.stringify(temp));
        collectx.push(temp);
        console.log('collection: ' + JSON.stringify(collectx));
      })
      tbls[tbl].save(collectx, function(error, data) {
        if (error) { res.send(JSON.stringify({ status: 0, title: error }));
        } else {
          if (tbl == 'proditem') {
            res.redirect("/genprice");
          } else {
            res.send(JSON.stringify({ status: 1, title: res.locals.la.updatesuccess }))
          }
        }
      })
    } else { //Non group/array payment
      let temp = {};
      for (let i=0; i < Object.keys(data).length; i++) {
        console.log('key:'+Object.keys(data)[i] + ', values:'+ Object.values(data)[i] + ', type:' + tm[Object.keys(data)[i]]);
        if (tm[Object.keys(data)[i]] == 'string') {
          if ( (Object.values(data)[i] !== null) && (typeof Object.values(data)[i] !== "undefined")) {
            temp[Object.keys(data)[i] ] = `${Object.values(data)[i]}`;
          }
        } else if (tm[Object.keys(data)[i]] == 'integer'){
          if ( !isNaN(parseInt(Object.values(data)[i]) )) {
            //console.log("AAAA: " +parseInt(Object.values(data)[i]))
            temp[Object.keys(data)[i] ] = parseInt(Object.values(data)[i]);
          }
        } else if (tm[Object.keys(data)[i]] == 'boolean'){
          if (Object.values(data)[i] == false)  {
            temp[Object.keys(data)[i] ] = 0;
          } else {
            temp[Object.keys(data)[i] ] = 1;
          }   
        } else { //include some exception fields that not included in the table
          temp[Object.keys(data)[i] ] = parseInt(Object.values(data)[i]);
        }
        if ((Object.keys(data)[i] == 'ostatus')){ //Add params not listed in the table to be included here...
          temp[Object.keys(data)[i] ] = parseInt(Object.values(data)[i]);
        }
        if ((Object.keys(data)[i] == 'pDatex') ){ //Add params not listed in the table to be included here...
          temp[Object.keys(data)[i] ] = `${Object.values(data)[i]}`;
        }
      }
      //console.log('tm: ' + JSON.stringify(tbls[tbl].tm))
      console.log('tempx: ' + JSON.stringify(temp,false,4))
      if ('lastChanged' in tbls[tbl].tm) { temp['lastChanged'] = moment().format('YYYY-MM-DD HH:mm:ss'); }
      if ('lastPerson' in tbls[tbl].tm) { temp['lastPerson'] = req.session.memberID }
      //WHY? - if ('dateAdded' in tbls[tbl].tm) { delete temp.dateAdded }
      //WHY? - if ('approvedDate' in tbls[tbl].tm) { delete temp.approvedDate }
      //Adding exception for a few tables
      if ((tbl == 'memberx') && ('ostatus' in temp) && ('approvedDate' in tbls[tbl].tm) && (temp['ostatus'] <= 0) && (temp['status'] >= 0)) {
        temp['approvedDate'] = moment().format('YYYY-MM-DD HH:mm:ss');
      }
      
      
      //********* DEBUG **********************
      console.log('temp:' + JSON.stringify(temp,false,4));
      //process.exit()
      //*********************************
      tbls[tbl].save(temp, function(error, tbldat) {
        if (error) { res.send(JSON.stringify({ status: 0, title: error }));
        } else {
          if (tbl == 'memberx') {
            req.session.themeID = tbldat.themeID;
            res.send(JSON.stringify({ status: 1, title: res.locals.la.updatesuccess, data: tbldat }))
          } else if (tbl == 'expenses') {
            if (temp['refID'] && temp['refID'].includes('P_')) {
              let payrollID = temp['refID'].split('_')[1];
              tbls['payroll'].save({payrollID:payrollID, status:2}, function(errx, datx) {
                if (errx) throw errx
                else {
                  res.send(JSON.stringify({ status: 1, title: res.locals.la.updatesuccess, data: tbldat }))
                }
             })
            } else if (temp['refID'] && temp['refID'].includes('E_')) {
              //Do something here if to do with other expenses type
              res.send(JSON.stringify({ status: 1, title: res.locals.la.updatesuccess, data: tbldat }))
            } else {
              res.send(JSON.stringify({ status: 1, title: res.locals.la.updatesuccess, data: tbldat }))
            }
          } else {
            res.send(JSON.stringify({ status: 1, title: res.locals.la.updatesuccess, data: tbldat }))
          }
        }
      })
    }
  }
  
});
app.post('/new/:tbl', function (req, res) {
  if (cmfunc.isEmpty(req.session.user)) { res.redirect('/'); }// if user is not logged-in redirect back to login page //
  else {
    var tbl = req.params.tbl;
    if (tbl==='member') { tbl = 'memberx'; } //Update to compliant with reserved keyword member
    console.log(cmfunc.getTimeStamp() + "/new/"+tbl);
    console.log('req.body: '+ JSON.stringify(req.body.data));
    var data = req.body;
    if ('data' in req.body) {
      data = JSON.parse(req.body.data);
    }
    console.log(data);
    let temp = {};
    let tm = tbls[tbl].tm;
    let collection=[];
    if (Array.isArray(data)) {
      data.forEach( function (datax) {
        for (let i=0; i < Object.keys(datax).length; i++) {
          //console.log('key:'+Object.keys(datax)[i] + ', values:'+ Object.values(datax)[i] + ', type:' + tm[Object.keys(datax)[i]]);
          if (tm[Object.keys(datax)[i]] == 'string') {
            if ( (Object.values(datax)[i] !== null) && (typeof Object.values(datax)[i] !== "undefined")) {
              temp[Object.keys(datax)[i] ] = `${Object.values(datax)[i]}`;
            }
          } else if (tm[Object.keys(datax)[i]] == 'integer'){
            if ( !isNaN(parseInt(Object.values(datax)[i]) )) {
              temp[Object.keys(datax)[i] ] = parseInt(Object.values(datax)[i]);
            }
          } else if (tm[Object.keys(datax)[i]] == 'boolean'){
            if (Object.values(datax)[i] == false)  {
              temp[Object.keys(datax)[i] ] = 0;
            } else {
              temp[Object.keys(datax)[i] ] = 1;
            } 
          }
        }
        if ('lastPerson' in tbls[tbl].tm) { temp['lastPerson' ] = req.session.memberID }
        if ('lastChanged' in tbls[tbl].tm) { temp['lastChanged' ] = moment().format("YYYY-MM-DD HH:mm:ss") }
        //Adding exception for a few tables
        //console.log('temp:' + JSON.stringify(temp));
        collection.push(temp);
      })
      tbls[tbl].insert(collection, function(error, data) {
        if (error) { res.send(JSON.stringify({ status: 0, title: error }));
        } else {
          res.send(JSON.stringify({
            status: 1,
            title: res.locals.la.updatesuccess,
            newrecordid: data[0]
          }))
        }
      })
    } else { // dealing with single insert
      for (let i=0; i < Object.keys(data).length; i++) {
        console.log('key:'+Object.keys(data)[i] + ', values:'+ Object.values(data)[i] + ', type:' + tm[Object.keys(data)[i]]);
        if (tm[Object.keys(data)[i]] == 'string') {
          if ( (Object.values(data)[i] !== null) && (typeof Object.values(data)[i] !== "undefined")) {
            temp[Object.keys(data)[i] ] = `${Object.values(data)[i]}`;
          }
        } else if (tm[Object.keys(data)[i]] == 'integer'){
          if ( !isNaN(parseInt(Object.values(data)[i]) )) {
            //console.log("AAAA: " +parseInt(Object.values(data)[i]))
            temp[Object.keys(data)[i] ] = parseInt(Object.values(data)[i]);
          }
        } else if (tm[Object.keys(data)[i]] == 'boolean'){
          if (Object.values(data)[i] == false)  {
            temp[Object.keys(data)[i] ] = 0;
          } else {
            temp[Object.keys(data)[i] ] = 1;
          }     
        } else { //include some exception fields that not included in the table
          temp[Object.keys(data)[i] ] = parseInt(Object.values(data)[i]);
        }
      }
      if ('lastPerson' in tbls[tbl].tm) { temp['lastPerson'] = req.session.memberID }
      if ('lastChanged' in tbls[tbl].tm) { temp['lastChanged'] = moment().format("YYYY-MM-DD HH:mm:ss") }
      console.log('temp:' + JSON.stringify(temp,false, 4));
      //Adding exception for a few tables
      if (tbl == 'memberx') {
        if ('dob' in temp) {
        } else {
          temp['dob' ] = moment().format('YYYY-MM-DD');
        }
      }
      if (tbl == 'orderx') {
        temp.dateDispatched =  moment(temp.dateDispatched).utc().format('YYYY-MM-DD')
      }
      if (tbl == 'payroll') {
        temp.fromDT =  moment(temp.fromDT).format('YYYY-MM-DD');
        temp.toDT =  moment(temp.toDT).format('YYYY-MM-DD')
      }
      if (tbl == 'payrollitem') {
        temp.workDate =  moment(temp.workDate).format('YYYY-MM-DD');
      }
      if (tbl == 'groupx') {
        let newPass = temp.name.split(" ")[0].slice(0,5); //Grab the first 5 chars
        temp['subdir'] = newPass.toUpperCase();
        mkDirByPathSync(`${$CVar.localStorage}//${temp['subdir']}`, {isRelativeToScript: true});
      }
      if (tbl == 'product') {
        temp['barcode'] = req.session.subdir+nanoid();
      }
      if ( (tbl == 'memberx') && ('email' in temp) ) { //Checking duplicated email
        if (temp.status == 1) temp.approvedDate = moment().format("YYYY-MM-DD HH:mm:ss");
        tbls[tbl].findOne({email:temp['email']}, function(e, o) {
          if (o){
            res.send(JSON.stringify({ status: 0, title: res.locals.la.ur_alreadyregister })); //email is already taken
          }	else {
            let newPass = temp.name.split(" ")[0].slice(0,5); //Grab the first 5 chars
            saltAndHash(newPass, function(hash){
              temp['pass']= hash;
              temp['user' ] = temp['email'];
              temp['subdir'] = newPass.toUpperCase();
                tbls[tbl].insert(temp, function(error, data) {
                  if (error) { res.send(JSON.stringify({ status: 0, title: error.sqlMesssage }));
                  } else {
                    sendMail(temp, newPass, data.phone, res);
                  }
                })
              //}
            })
          }
        })
      } else {
        //console.log('temp:' + JSON.stringify(temp));
        tbls[tbl].insert(temp, function(error, datx) {
          if (error) { res.send(JSON.stringify({ status: 0, title: error }));
          } else {
            //console.log('data: '+ JSON.stringify(data));
            if (tbl == 'orderx') { 
              var orderxID = datx[Object.keys(datx)[0]];
              const budgetDate = 1;
              tbls[tbl].save({orderxID:orderxID, orderNumber:`${data.subdir}${orderxID.toString().padStart(5, '0')}`}, function(error, data) {
                  if (error) {
                      console.log("error: " + error) ;
                  } else {
                    res.send(datx);
                  }
              })
            } else {
              res.send({ status: 1, title: 'Update success', newid: datx[Object.keys(datx)[0]]})
            }
          }
        })
      }
    }
  }
  function savensendMail(temp, newPass, user, res){
    tbls[tbl].save(temp, function(error, data) {
      console.log('after saving...')
      if (error) { res.send(JSON.stringify({ status: 0, title: error.sqlMessage }));
      } else {
        let dir = `${$CVar.localStorage}/${newPass}`;
        cmfunc.mkdir(dir, function (e) {
          if (e) {
            sendMail(temp, newPass, user, res);
          } else {
            res.send(JSON.stringify({ status: 0, title: res.locals.la.unabletocreatedirectory }));
          }
        })
      }
    })
  }
  function sendMail(temp, newPass, user, res) {
    console.log('sending email..'+ temp['email']);
    let text = `${res.locals.la.loginwithtemporarypasswd} \r\n\r\n ${res.locals.la.username}: ${user} \r\n ${res.locals.la.password}: ${newPass}`;
    cmfunc.sendEmail(temp['email'], res.locals.la.welcomehome, text, function(e,o) {
      if (!e) {
        res.send(JSON.stringify({ status: 1, title: res.locals.la.updatesuccess }));
      } else {
        res.send(JSON.stringify({ status: 0, title: e }));
      }
    });
  }
});
function convertdollartofloat(value){
  return parseFloat(value.slice(1).replace(/,/g, ''))
}
function convertfloattodollar(value) {
  return '$'+value.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
}

app.post('/delete/:tbl', function (req, res) {
  if (cmfunc.isEmpty(req.session.user)) { res.redirect('/'); }// if user is not logged-in redirect back to login page //
  else {
    var tbl = req.params.tbl;
    if (tbl==='member') { tbl = 'memberx'; } //Update to compliant with reserved keyword member
    console.log(cmfunc.getTimeStamp() + "/delete/"+tbl);
    let temp = JSON.parse(req.body.data);
    console.log('temp:' + JSON.stringify(temp,false,4));
    if (tbl == 'memberx') { //if it is table is member make sure directory also removed
      tbls[tbl].findOne(temp, function(error, datax) {
        if (error) { res.send(JSON.stringify({ status: 0, title: error }));
        } else {
          let dir = `${$CVar.localStorage}/${datax.subdir}`;
          cmfunc.rmdir(dir);
          let delStr = `(${Object.keys(temp)} = '${Object.values(temp)}')`;
          tbls[tbl].remove(temp, function(error, data) {
            if (error) { res.send(JSON.stringify({ status: 0, title: error }));
            } else { res.send(JSON.stringify({ status: 1, title: res.locals.la.updatesuccess })) }
          })
        }
      })
    } else {
      tbls[tbl].remove(temp, function(error, data) {
        if (error) { res.send(JSON.stringify({ status: 0, title: error }));
        } else {
          if (tbl == 'promotion') {
            let sqlTxt = `UPDATE product SET promotionID = 1 WHERE (promotionID = ${temp['promotionID']})`;
            //console.log('sqlTxt:' + sqlTxt);
            tbls['product'].execSQL(sqlTxt, function(error, data) {
              if (error) {
                  console.log("error: " + error) ;
              } else {
                res.send({ status: 1,title: res.locals.la.updatesuccess});
              }
          })
          } else {
            res.send({ status: 1, title: res.locals.la.updatesuccess }) 
          }  
        }
      })
    }
  }
});
app.post('/deleteMasterSlave/:tblx', function (req, res) {
  if (cmfunc.isEmpty(req.session.user)) { res.redirect('/'); }// if user is not logged-in redirect back to login page //
  else {
    console.log(cmfunc.getTimeStamp() + "/deleteMasterSlave/"+req.params.tblx);
    var tblx = req.params.tblx.split('&');
    if (tblx.length > 1) {
      var temp = JSON.parse(req.body.data);
      console.log('temp:' + JSON.stringify(temp));
      var length = tblx.length;
      var i=0;
      tblx.forEach( (tbl, index) => {
        if (index > 0) {
          if (tbl == 'memberx') { //if it is table is member make sure directory also removed
            tbls[tbl].findOne(temp, function(error, datax) {
              if (error) { res.send(JSON.stringify({ status: 0, title: error }));
              } else {
                let dir = `${$CVar.localStorage}/${datax.subdir}`;
                cmfunc.rmdir(dir);
                let delStr = `(${Object.keys(temp)} = '${Object.values(temp)}')`;
                tbls['memberrego'].delete(delStr, function (error, data) {
                  if (error) { res.send(JSON.stringify({ status: 0, title: error }));
                  } else {
                    tbls[tbl].remove(temp, function(error, data) {
                      if (error) { res.send(JSON.stringify({ status: 0, title: error }));
                      } else {
                        res.send(JSON.stringify({ status: 1, title: res.locals.la.updatesuccess }))
                      }
                      i++;
                    })
                  }
                })
              }
            })
          } else if (tbl == 'saleitems') { //if it is table is member make sure directory also removed
            var fny = function updateInventory(dat){
              return new Promise(function(resolve, reject) {
                let sql0 = `UPDATE product SET stockqty = ROUND((((stockqty * qtyperBox) + ${dat.qty})/qtyperBox),3) WHERE (productID = ${dat.productID});`;
                console.log("sql0: " + sql0);
                tbls['product'].execSQL(sql0, function(error, dat) {
                    if (error) {  reject(error);
                    } else {
                      resolve(dat)
                    }
                })
              })
            }
            tbls[tbl].find(temp, function(errorx, datax) {
              if (errorx) { res.send(JSON.stringify({ status: 0, title: error }));
              } else {
                var actions2 = datax.map(fny);
                Promise.all(actions2).then( function (da2) {
                  tbls[tbl].remove(temp, function(error, data) {
                    if (error) { res.send(JSON.stringify({ status: 0, title: error }));
                    } else {
                      res.send(JSON.stringify({ status: 1, title: res.locals.la.updatesuccess }))
                    }
                  })
                })
              }
            })
          } else {
            tbls[tbl].remove(temp, function(error, data) {
              if (error) { res.send(JSON.stringify({ status: 0, title: error }));
              } else {
                res.send(JSON.stringify({ status: 1, title: res.locals.la.updatesuccess }))
              }
              i++;
            })
          }
        } else {
          tbls[tbl].remove(temp, function(error, data) {
            if (error) { 
              res.send(JSON.stringify({ status: 0, title: error }));
            }
          })
        }
      })
    } else {
      res.send(JSON.stringify({ status: 0, title: 'only table specified...' }));
    }
    
  }
});
app.post('/delcond/:tbl', function (req, res) {
  if (cmfunc.isEmpty(req.session.user)) { res.redirect('/'); }// if user is not logged-in redirect back to login page //
  else {
    var tbl = req.params.tbl;
    if (tbl==='member') { tbl = 'memberx'; } //Update to compliant with reserved keyword member
    console.log(cmfunc.getTimeStamp() + "/delcond/"+tbl);
    let temp = req.body.data;
    console.log('temp:' + temp);
    tbls[tbl].delete(temp, function(error, data) {
      if (error) { res.send(JSON.stringify({ status: 0, title: error }));
      } else { res.send(JSON.stringify({ status: 1, title: res.locals.la.updatesuccess })) }
    })
  }
});

//************** SETTINGS ***********************

app.post('/uploadfiles/:tbl/:searchkey/:id/:subdir', upload.any(), function (req, res) {
  if (cmfunc.isEmpty(req.session.user)) { res.redirect('/'); }// if user is not logged-in redirect back to login page //
  else {
    //console.log('body: '+ JSON.stringify(req.body));
    console.log(cmfunc.getTimeStamp() + "/uploadfiles/"+ req.params.tbl + "/" + req.params.searchkey+ "/" + req.params.id+ "/" + req.params.subdir);
    let tbl = req.params.tbl;
    let searchkey = req.params.searchkey;
    let id = req.params.id;
    let searchObj = {};
    searchObj[searchkey]= id;
    tbls[tbl].findOne(searchObj, function (error, data) {
      if (error) { res.send(JSON.stringify({ status: 0 }));
      } else {
        let filename, fname;
        let filesuploadcount = 0;
        let filescurrentcount = 0;
        let rego;
        let regolist = [];
        let destination;
        let fieldname = '';
        console.log(req.files);
        if ((req.files[0].fieldname == 'file_data') && (tbl=="diary")) {
          fieldname = "note";
        } else {
          fieldname = req.files[0].fieldname;
        }
        console.log('data: '+ JSON.stringify(data));
        let ofiles = data[fieldname];
        if (ofiles != null) {
          filescurrentcount = ofiles.split(",").length;
        }
        console.log('filescurrentcount: '+ filescurrentcount)
        
        let vfiles = req.files;
        filesuploadcount = vfiles.length;
        if ( (filesuploadcount + filescurrentcount ) > $CVar.maxRegoUpload) {
          res.send(JSON.stringify({ status: 0 }));
        } else {
          vfiles.forEach(function (vfile) {
            filename = vfile.originalname;
            fname = vfile.path;
            console.log('fname: '+fname);
            rego = {};
            rego[searchkey]= id;
            rego.name = filename;
            rego.size = vfile.size;
            regolist.push(rego);
            destination = `${$CVar.localStorage}/${req.params.subdir}`;
            cmfunc.moveFile(fname, destination, function (e){
              if (e) res.send(JSON.stringify({ error: e }));
            })
          })
          let flist = regolist.map(f=> f.name).join(",");
          console.log(ofiles);
          if ((tbl=="diary") && (data.dtype==3)) {
            if (ofiles && ofiles !== null) flist += ","+ofiles;
          }
          
          searchObj[fieldname] = flist;
          
          tbls[tbl].save(searchObj, function(errorb, datb){
            if (errorb) { res.send(JSON.stringify({ status: 0 }));
            } else {
              res.send(JSON.stringify({ status: 1}));
            }
          })
        }
      }
    })
  }
})

app.post('/insertfiles/:tbl/:cid/:dtype/:subdir', upload.any(), function (req, res) {
  if (cmfunc.isEmpty(req.session.user)) { res.redirect('/'); }// if user is not logged-in redirect back to login page //
  else {
    //console.log('body: '+ JSON.stringify(req.body));
    console.log(cmfunc.getTimeStamp() + "/insertfiles/"+ req.params.tbl + "/" + req.params.cid+  "/" + req.params.dtype + "/" + req.params.subdir);
    let tbl = req.params.tbl;
    let dtype = req.params.dtype;
    let fileObj = {};
    if (tbl == "diary") {
      fileObj['customerID']= req.params.cid;
      fileObj['staffID']= req.session.memberID;
      fileObj['dtype']= req.params.dtype;
    } else {

    }
    
    tbls[tbl].insert(fileObj, function (error, data) {
      if (error) { res.send(JSON.stringify({ status: 0 }));
      } else {
        let filename, fname;
        let filesuploadcount = 0;
        let rego;
        let regolist = [];
        let destination;
        let fieldname = '';
        console.log(req.files);
        if ((req.files[0].fieldname == 'file_data') && (tbl=="diary")) {
          fieldname = "note";
        } else {
          fieldname = req.files[0].fieldname;
        }
        console.log('fieldname: ',  fieldname);
        console.log('data: '+ JSON.stringify(data));
        
        let vfiles = req.files;
        filesuploadcount = vfiles.length;
        if ( filesuploadcount  > $CVar.maxRegoUpload) {
          res.send(JSON.stringify({ status: 0 }));
        } else {
          vfiles.forEach(function (vfile) {
            filename = vfile.originalname;
            fname = vfile.path;
            console.log('fname: '+fname);
            rego = {};
            rego.name = filename;
            rego.size = vfile.size;
            regolist.push(rego);
            destination = `${$CVar.localStorage}/${req.params.subdir}`;
            cmfunc.moveFile(fname, destination, function (e){
              if (e) res.send(JSON.stringify({ error: e }));
            })
          })
          let flist = regolist.map(f=> f.name).join(",");
          data[fieldname] = flist;
          tbls[tbl].save(data, function(errorb, datb){
            if (errorb) { res.send(JSON.stringify({ status: 0 }));
            } else {
              res.send(JSON.stringify({ status: 1}));
            }
          })
        }
      }
    })
  }
})

app.post('/deletefiles/:tbl/:searchkey/:id/:subdir/:fieldx', function (req, res) {
  if (cmfunc.isEmpty(req.session.user)) { res.redirect('/'); }// if user is not logged-in redirect back to login page //
  else {
    console.log(cmfunc.getTimeStamp() + "/deletefiles/"+ req.params.tbl + "/" + req.params.searchkey+ "/" + req.params.id+ "/" + req.params.subdir+ "/" + req.params.fieldx);
    let tbl = req.params.tbl;
    let fname;
    let searchkey = req.params.searchkey;
    let id = req.params.id;
    let searchObj = {};
    searchObj[searchkey]= id;
    console.log(searchObj)
    
    tbls[tbl].findOne(searchObj, function (error, data) {
      if (error) { res.send(JSON.stringify({ error: la.deletefailed }));
      } else {
        console.log(data)
        if (data.dtype < 4) {
          let flist = data[req.params.fieldx].split(",");
          console.log(flist)
          flist.forEach(f => {
            fname = `${$CVar.localStorage}/${req.params.subdir}/${f}`;
            console.log('delete: ' + fname)
            if (fs.existsSync(fname)) {
              fs.unlinkSync(fname);
            }
          })
        }
        tbls[tbl].remove(searchObj, function (error, data) {
          if (error) { res.send(JSON.stringify({ status: 0}))
          } else {
            res.send(JSON.stringify({ status: 1}));
          }
        })
      }
    })
  }
})

app.post('/deletefiles/:tbl/:searchkey/:id/:subdir/:fieldx/:imgx', function (req, res) {
  if (cmfunc.isEmpty(req.session.user)) { res.redirect('/'); }// if user is not logged-in redirect back to login page //
  else {
    console.log(cmfunc.getTimeStamp() + "/deletefiles/"+ req.params.tbl + "/" + req.params.searchkey+ "/" + req.params.id+ "/" + req.params.subdir+ "/" + req.params.fieldx+ "/" + req.params.imgx);
    let tbl = req.params.tbl;
    let fname;
    let searchkey = req.params.searchkey;
    let id = req.params.id;
    let searchObj = {};
    searchObj[searchkey]= id;
    console.log(searchObj)
    
    tbls[tbl].findOne(searchObj, function (error, data) {  
      if (error) { res.send(JSON.stringify({ error: la.deletefailed }));
      } else {
        fname = `${$CVar.localStorage}/${req.params.subdir}/${req.params.imgx}`;
        console.log('delete: ' + fname)
        if (fs.existsSync(fname)) {
          fs.unlinkSync(fname);
        }
        searchObj[req.params.fieldx]= data[req.params.fieldx].split(',').filter(f=> f != req.params.imgx).join(",");
        tbls[tbl].save(searchObj, function (error, data) {
          if (error) { res.send(JSON.stringify({ status: 0}))
          } else {
            res.send(JSON.stringify({ status: 1}));
          }
        })
      }
    })
  }
})




} //End of Module
