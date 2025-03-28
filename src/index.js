
//******************************************************************** */
var os = require("os");
var https = require("https");
var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var path = require('path');
var $CVar = require('./constants');
var passport = require('./passport');
var middleware = require('connect-ensure-login');
var flash = require('connect-flash');

var sessions = require('client-sessions');
var merge = require('merge'), original, cloned;
var moment = require('moment');
var path = require('path');
var cmfunc = require('./cmfunc');
var fs = require("fs"); //Load the filesystem module
var scheduleTimer;
var issueArray = [];
var converter = require('hex2dec');
var inproduction =  (os.hostname() === 'auzora01')?1:0;
const axios = require('axios').default;
const crypto = require ("crypto");
//const ApiKey = '5804D3E0B9FC5AF391C38C63927237';  //ApiKey for accessing eSMS
//const SecretKey = 'B0DE9A126A91FCB76B609E7643DE34'; //SecretKey for accessing eSMS
const eSMSBrandName = "MOTOCARE";
const ApiUserName = 'motocarevn';  //ApiKey for accessing eSMS
//const TokenKey = '6b8dbcee-ced1-4424-bad2-b129102501f0'; //SecretKey for accessing eSMS
const TokenKey = 'd1266577-222a-4c4d-bc27-14c63019b2c9';
if (inproduction) {
  var esmscallback = 'https://antifake.vn/smscallback';
  var etopupcallback = 'https://antifake.vn/topupcallback';
} else {
  var esmscallback = 'https://27.65.225.204:6022/smscallback';
  var etopupcallback = 'https://27.65.225.204:6022/topupcallback';
}

var useragent = require('express-useragent');


// set the view engine to ejs
app.set('view engine', 'ejs')
app.use(sessions({
  cookieName: 'session',
  secret: '%@#adsfdfdfsggf344154353',
  duration: 180 * 60 * 1000,
  activeDuration: 180 * 60 * 1000,
}));
app.set('views', path.join(__dirname, '/'));
app.use('/assets',express.static(path.join(__dirname, '/assets')));
app.use('/public',express.static(path.join(__dirname, '../public')));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(useragent.express());
const cors = require('cors');

app.use(cors());


//*******************************
var serverIP = require('ip').address();
//create app server
var httpsserver = https.createServer({
  key : (inproduction==0)?fs.readFileSync(path.join(__dirname, '/certs/localhost-key.pem')):fs.readFileSync(path.join(__dirname, $CVar.mqttPrivkey)),
  cert : (inproduction==0)?fs.readFileSync(path.join(__dirname, '/certs/localhost.pem')):fs.readFileSync(path.join(__dirname, $CVar.mqttCert)),
}, app);
httpsserver.listen($CVar.appPORT, function () {
  var port = httpsserver.address().port;
  console.log("App https listening on port %s %s", serverIP, port);
});

var httpserver = app.listen($CVar.appPORT2, function () {
  var port = httpserver.address().port;
  console.log("App http listening on port %s %s", serverIP, port);
});

//start body-parser configuration

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(function( req, res, next){
  //req.session.reset();
  //req.logout();
  //console.log("req.session: " + JSON.stringify(req.session, false, 4))
  if (!cmfunc.isEmpty(req.session.memberID)) {
    let hNew = 0;
    //console.log("issueArray: " + JSON.stringify(issueArray, false, 4))
    
    let issuex = [];
    issuex = issueArray.filter(f=> f.roleID===req.session.roleID);
    if (issuex.length) hNew = issuex.length
    //console.log("hNew: " + hNew)
    //console.log("issuex: " + JSON.stringify(issuex,false,4))
    res.locals.la = {
      lang: req.session.lang,
      name: `${req.session.name}`,
      phone: `${req.session.phone}`,
      company: `${req.session.company}`,
      memberID: `${req.session.memberID}`,
      parentID: `${req.session.parentID}`,
      roleID: `${req.session.roleID}`,
      position: `${req.session.position}`,
      groupID: `${req.session.groupID}`,
      groupName: `${req.session.groupName}`,
      typeID: `${req.session.typeID}`,
      divisionID: `${req.session.divisionID}`,
      subdir: `${req.session.subdir}`,
      imgLink: `${req.session.imgLink}`,
      cryptoid: `${req.session.cryptoid}`,
      themeID: `${req.session.themeID}`,
      hasNew: `${hNew}`,
      issuex: issuex,
      production: inproduction,
      smsWebUrl: $CVar.smsWebUrl,
      devcompanyurl: 'https://ebizco.com.au' 
    }
  } else {
    res.locals.la = {
      lang: "vi",
      themeID: '1',
      production: inproduction,
      devcompanyurl: 'https://ebizco.com.au' 
    }
    req.session.lang = 'vi';
  }
  res.locals.la = merge(require('./lang')("vi"), res.locals.la);
  next();
})

var member = require('./member')(app);
var setting = require('./setting')(app);
var customer = require('./customer')(app);
var account = require('./account')(app);


//Checking the crypto module
const algorithm = 'aes-256-cbc'; //Using AES encryption
//const secKey = crypto.randomBytes(32);
//const initVector = crypto.randomBytes(16);
const secKey = $CVar.secKey;
const initVector = $CVar.initVector

//Encrypting text
function encrypt(text) {
   let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(secKey,'hex'), Buffer.from(initVector,'hex'));
   let encrypted = cipher.update(text);
   encrypted = Buffer.concat([encrypted, cipher.final()]);
   return { initVector: initVector, encryptedData: encrypted.toString('hex') };
}

// Decrypting text
function decrypt(encryptedData) {
   let encryptedText = Buffer.from(encryptedData, 'hex');
   let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(secKey,'hex'), Buffer.from(initVector,'hex'));
   let decrypted = decipher.update(encryptedText);
   decrypted = Buffer.concat([decrypted, decipher.final()]);
   return decrypted.toString();
}

// Text send to encrypt function
var hw = encrypt("i=MOT000014&r=3")
console.log(hw)
console.log(decrypt(hw.encryptedData))


//import modules
var login = require('./login');
var tbls = require('./tables').tbls;
const schedMaxCounter = 24*60; //24hours counter
var schedcounter = 0; //1Min tick
var salenum = 200;

/******** MQTT ************/
/*
var mqtt = require('mqtt')
var clientID = $CVar.clientID;
var options = {
  clientId: clientID,
  key: fs.readFileSync(path.join(__dirname, $CVar.mqttPrivkey)),
  cert: fs.readFileSync(path.join(__dirname, $CVar.mqttCert)),
  ca:  fs.readFileSync(path.join(__dirname, $CVar.mqttChain)) ,
  username: $CVar.mqttuser,
  password: $CVar.mqttpasswd,
  timeout: 3,
  keepalive: 60,
  reconnectPeriod: 60,
  rejectUnauthorized: false,
  clean: false
}
//Publish .........
//Subscribe .......
var numberclient_topic = `$SYS/broker/cients/total`;
var connected_topic = `scis/+/connected`;
var playlog_topic = `scis/+/timesheet`;
//Initialize ......
var mqttClient  = mqtt.connect(`mqtt://${$CVar.mqtthost}`,options);
mqttClient.on('connect', function () {
  console.log(cmfunc.getTimeStamp() + ' - '+ 'MQTT is connected!');
  checkIssue();
  cmfunc.set_mqttClient(mqttClient);  
})
mqttClient.on('disconnect', function () {
  console.log(cmfunc.getTimeStamp() + ' - '+ 'MQTT IS DISCONNECTED!' );
})
mqttClient.on('error', function (err) {
  console.log(cmfunc.getTimeStamp() + ' - '+ 'MQTT ERROR!' +  err.message );
});
mqttClient.subscribe([numberclient_topic, connected_topic, playlog_topic], function (err) {
  if (!err) {
    mqttClient.on('message', function (topic, message) {
      if (topic.toString().indexOf('/connected') > -1) {

      } else if (topic.toString().indexOf('/booking') > -1) {

      }
    })
  }
})
*/
/******** END MQTT ************/
var globalInterval = setInterval(function(){
  if ((schedcounter%2)==0) { //Check outstanding schedule every 20 secs
    
  }
  if ((schedcounter%3)==0) { //Check outstanding schedule every 30 secs
    processSale();
  }
  if ((schedcounter%4)==0) { //Check outstanding schedule every 40 secs
  }
  if ((schedcounter%5)==0) { //Check outstanding schedule every 50 secs
  }
  if ((schedcounter%6)==0) { //Check outstanding schedule every 1 mins
    issueQRCodeProdBoxPallet();
  }
  if ((schedcounter%30)==0) { //Check outstanding schedule every 5 mins
    checkIssue();
  }
  if ((schedcounter%60)==0) { //Check outstanding schedule every 10 mins
  }
  if ((schedcounter%180)==0) { //Check outstanding schedule every 30 mins
  }
  if ((schedcounter%360)==0) { //Check outstanding schedule every 1 hr
    sortDiary();
  }
  if ((schedcounter%8640)==0) { //Check outstanding schedule  daily
  }
  if (schedcounter==schedMaxCounter) {
    schedcounter=0;
  }
  schedcounter++;
}, 10000);

//************** INITIALIZE TIMER  ***************
const sortDiary = () => {
  //const delSec = 60*60*24*2;
  const delHrs = 48;
  var fn = function updateDiary(dx){
    return new Promise(function(resolve, reject) {
        var sql;
        if (dx.status == 0) {
          sql = `UPDATE diary SET status = 4 WHERE (diaryID = ${dx.diaryID})`;
        } else {
          sql = `UPDATE diary SET status = 3 WHERE (diaryID = ${dx.diaryID})`;
        }
        //console.log(sql);
        tbls['diary'].execSQL(sql, function(error, data) {
            if (error) {  
                reject(error);
            } else {
              resolve(dx);
            }
        })
    })
  }
  console.log(cmfunc.getTimeStamp() + ' - '+ 'sortDiary!' );
  let sql = `SELECT a.*, ROUND(TIMESTAMPDIFF(SECOND, a.lastChanged, NOW()) /3600) AS 'timediff' FROM diary a `;
  sql += ` WHERE ((a.status=0) OR (a.status=1)) AND (a.lastChanged < NOW() - INTERVAL ${delHrs} HOUR )`;
  console.log(sql)
  tbls['diary'].execSQL(sql, function(err, data){
    if (err) throw err;
    var actions = data.map(fn);
    var results = Promise.all(actions).then( function (da1) {
      console.log(cmfunc.getTimeStamp() + ` - sortDiary: ${data.length} records !!`)
    })
  })
}

const checkIssue = () => {
  //console.log(cmfunc.getTimeStamp() + ' - '+ 'checkIssue!' );
  let sql = "SELECT a.*, b.name, TIMESTAMPDIFF(SECOND, a.dateAdded, NOW()) AS difference FROM issue a, issuetype b ";
  sql += " WHERE (a.status=0) AND (a.issuetypeID = b.issuetypeID)";
  sql += " ORDER BY a.dateAdded DESC LIMIT 5 ";
  tbls['issue'].execSQL(sql, function(err, data){
    if (err) throw err;
    issueArray = data.map(f=> {f.age = cmfunc.secondsToString(f.difference); return f});
    //console.log("issueArray: " + JSON.stringify(issueArray, false, 4))
  })
}

const issueQRCodeProdBoxPallet = () => { 
  //console.log(cmfunc.getTimeStamp() + ' - '+ 'issueQRCodeProdBoxPallet!' );
  let sql0 = `SELECT a.*, b.name AS 'manufacturerName', b.subdir, b.weburl, c.name AS 'lastperson', `;
  sql0 += ` e.qtyperBox, e.unitMeasure, e.imgLink `;
  sql0 += ` FROM prodman a, groupx b, memberx c, product e WHERE  (a.groupID = b.groupID) AND (a.lastPerson = c.memberID)`;
  sql0 += ` AND (a.productID = e.productID) AND (a.status = 1) `;
  try {
    tbls['prodman'].execSQL(sql0, function(err, data){
      if (err) throw err;
      //console.log("data: " + JSON.stringify(data, false, 4));
      if ( data.length > 0) {
        genProdQRCode(data[0], function(errx) {
          if (errx) throw 'ERROR IN CREATING QRCODE...'
          else {
            tbls['prodman'].save({prodmanID:data[0].prodmanID, status:2}, function(err, datx) {
              if (err) throw err;
              console.log(cmfunc.getTimeStamp() + ' - issueQRCodeProdBoxPallet: COMPLETED!!')
            })
          }
        })
      }
    })
  } catch (error) {
    console.log('API-Exception', error);
  }
}

const processSale = () => { 
  var fn = function updateSale(sale){
    return new Promise(function(resolve, reject) {
        var sql = `UPDATE sale SET status = 1 WHERE (saleID = ${sale.saleID})`;
        //console.log(sql);
        tbls['sale'].execSQL(sql, function(error, data) {
            if (error) {  
                reject(error);
            } else {
              resolve(sale);
            }
        })
    })
  }
  tbls['sale'].execSQL(`SELECT * FROM sale WHERE (status = 0) ORDER BY saleID LIMIT 0, ${salenum}`, function(errord, datd) {
    if (errord) {
        console.log("errord: " + errord) ;
    } else {
      //console.log("sale " + JSON.stringify(datd, false, 4));
      if (datd.length > 0) {
        genWallet(datd, function(errx) {
          if (errx) throw 'ERROR IN genWallet...'
          else {
            var actions = datd.map(fn);
            var results = Promise.all(actions).then( function (da1) {
              console.log(cmfunc.getTimeStamp() + ` - processSale: ${datd.length} records !!`)
            })
          }
        })
      } else{
        console.log(cmfunc.getTimeStamp() + ' - processSale: Nothing to be done!!')
      }
    }
  })
}

//************************************ AntiFake  *****************************************
app.get('/updateprofile', require('connect-ensure-login').ensureLoggedIn('/login'),
  (req, res) => {
    console.log(cmfunc.getTimeStamp() + 'goto updateprofile..');
  	res.render('updateprofile', res.locals.la);
});

app.get('/changepassword', require('connect-ensure-login').ensureLoggedIn('/login'),
  (req, res) => {
    console.log(cmfunc.getTimeStamp() + 'goto changepassword..');
  	res.render('changepassword', res.locals.la);
});

app.get('/promotion', require('connect-ensure-login').ensureLoggedIn('/login'),
  (req, res) => {
    console.log(cmfunc.getTimeStamp() + 'goto promotion..');
  	res.render('promotion', res.locals.la);
});

app.get('/campaign', require('connect-ensure-login').ensureLoggedIn('/login'),
  (req, res) => {
    console.log(cmfunc.getTimeStamp() + 'goto campaign..');
  	res.render('campaign', res.locals.la);
});

app.get('/promotype', require('connect-ensure-login').ensureLoggedIn('/login'),
  (req, res) => {
    console.log(cmfunc.getTimeStamp() + 'goto promotype..');
  	res.render('promotype', res.locals.la);
});

app.get('/mangroup', require('connect-ensure-login').ensureLoggedIn('/login'),
  (req, res) => {
    console.log(cmfunc.getTimeStamp() + 'goto mangroup..');
  	res.render('mangroup', res.locals.la);
});

app.get('/directorboard', require('connect-ensure-login').ensureLoggedIn('/login'),
  (req, res) => {
    console.log(cmfunc.getTimeStamp() + 'goto directorboard..');
  	res.render('directorboard', res.locals.la);
});

app.get('/manstaff*', require('connect-ensure-login').ensureLoggedIn('/login'),
  (req, res) => {
    console.log(cmfunc.getTimeStamp() + 'goto manstaff..');
  	var mid = req.originalUrl.split("_")[1];
    if (mid === undefined) { 
      mid = 0;
    }
    //console.log("directorboard req.session.mid: " + req.session.mid);
    let memObj = {};
    let found = false;
    if (mid > 0) {
      memObj.memberID = mid;
      found  = true;
    } else {
      if (req.session.roleID === 1) {
        memObj.memberID = req.session.memberID;
        found  = true;
      }
    }
    if (found) {
      tbls['memberx'].findOne(memObj, function(error, data) {
        if (error) {
          res.render('manstaff', merge({'manufacturerID':0, 'mangroupID':0, 'manufacturerName': "--- X ---"},res.locals.la) );
        } else {
          //console.log(JSON.stringify(data));
          res.render('manstaff', merge({'manufacturerID':data.memberID, 'mangroupID':data.groupID, 'manufacturerName': data.company},res.locals.la) );
        }
      })
    } else {
      res.render('manstaff', merge({'manufacturerID':0, 'mangroupID':0,'manufacturerName': "--- X ---"},res.locals.la) );
    }
    
});


app.get('/distributor*', require('connect-ensure-login').ensureLoggedIn('/login'),
  (req, res) => {
    console.log(cmfunc.getTimeStamp() + 'goto distributor..');
  	var mid = req.originalUrl.split("_")[1];
    if (mid === undefined) { 
      mid = 0;
    }
    console.log("directorboard mid: " + mid);
    let memObj = {};
    let found = false;
    if (mid > 0) {
      memObj.memberID = mid;
      found  = true;
    } else {
      if (req.session.roleID === 1) {
        memObj.memberID = req.session.memberID;
        found  = true;
      }
    }
    if (found) {
      if (req.session.groupID==1) memObj.typeID = 1;
      tbls['memberx'].find(memObj, function(error, data) {
        data = data[0];
        if (error) {
          res.render('distributor', merge({'manufacturerID':0, 'mangroupID':0, 'manufacturerName': "--- X ---"},res.locals.la) );
        } else {
          //console.log(JSON.stringify(data));
          res.render('distributor', merge({'manufacturerID':data.memberID, 'mangroupID':data.groupID, 'manufacturerName': data.company},res.locals.la) );
        }
      })
    } else {
      res.render('distributor', merge({'manufacturerID':0, 'mangroupID':0,'manufacturerName': "--- X ---"},res.locals.la) );
    }
    
});

app.get('/diststaff*', require('connect-ensure-login').ensureLoggedIn('/login'),
  (req, res) => {
    console.log(cmfunc.getTimeStamp() + 'goto diststaff..');
  	var did = req.originalUrl.split("_")[1];
    if (did === undefined) { 
     did = 0;
    }
    console.log("distributor did: " + did);
    let memObj = {};
    let found = false;
    if (did > 0) {
      memObj.memberID = did;
      found  = true;
    } else {
      if (req.session.roleID === 4) {
        memObj.memberID = req.session.memberID;
        found  = true;
      }
    }
    if (found) {
      if (req.session.groupID==1) memObj.typeID = 1;
      tbls['memberx'].find(memObj, function(error, data) {
        data = data[0];
        if (error) {
          res.render('diststaff', merge({'distributorID':0, 'distgroupID':0, 'distributorName': "--- X ---"},res.locals.la) );
        } else {
          //console.log(JSON.stringify(data));
          res.render('diststaff', merge({'distributorID':data.memberID, 'distgroupID':data.groupID, 'distributorName': data.company},res.locals.la) );
        }
      })
    } else {
      res.render('diststaff', merge({'distributorID':0, 'distgroupID':0, 'distributorName': "--- X ---"},res.locals.la) );
    }
});

app.get('/agent*', require('connect-ensure-login').ensureLoggedIn('/login'),
  (req, res) => {
    console.log(cmfunc.getTimeStamp() + 'goto agent..');
  	var dsid = req.originalUrl.split("_")[1];
    if (dsid === undefined) { 
      dsid  = 0;
    }
    console.log("diststaff dsid: " + dsid);
    let memObj = {};
    let found = false;
    if (dsid > 0) {
      memObj.memberID = dsid;
      found  = true;
    } else {
      if (req.session.roleID === 1) {
        memObj.memberID = req.session.memberID;
        found  = true;
      }
    }
    if (found) {
      tbls['memberx'].findOne(memObj, function(error, data) {
        if (error) {
          res.render('agent', merge({'diststaffID':0, 'diststaffgroupID':0, 'diststaffName': "--- X ---"},res.locals.la) );
        } else {
          //console.log(JSON.stringify(data));
          res.render('agent', merge({'diststaffID':data.memberID, 'diststaffgroupID':data.groupID, 'diststaffName': data.name},res.locals.la) );
        }
      })
    } else {
      res.render('agent', merge({'diststaffID':0, 'diststaffgroupID':0, 'diststaffName': "--- X ---"},res.locals.la) );
    }
});

app.get('/agestaff', require('connect-ensure-login').ensureLoggedIn('/login'),
  (req, res) => {
    console.log(cmfunc.getTimeStamp() + 'goto agestaff..');
    res.render('agestaff', res.locals.la);
});

app.get('/customer*', require('connect-ensure-login').ensureLoggedIn('/login'),
  (req, res) => {
    console.log(cmfunc.getTimeStamp() + 'goto customer..');
  	var asid = req.originalUrl.split("_")[1];
    if (asid === undefined) { 
      if (req.session.asid ) aid = req.session.asid;
      else req.session.asid  = 0;
    } else {
      req.session.asid = asid;
    }
    console.log("agentstaff req.session.asid: " + req.session.asid);
    let memObj = {};
    let found = false;
    if (req.session.asid > 0) {
      memObj.memberID = req.session.asid;
      found  = true;
    } else {
      if (req.session.roleID === 7) {
        memObj.memberID = req.session.memberID;
        found  = true;
      }
    }
    if (found) {
      tbls['memberx'].findOne(memObj, function(error, data) {
        if (error) {
          res.render('customer', merge({'agestaffID':0, 'agestaffgroupID':0, 'agestaffName': "--- X ---"},res.locals.la) );
        } else {
          //console.log(JSON.stringify(data));
          res.render('customer', merge({'agestaffID':data.memberID, 'agestaffgroupID':data.groupID, 'agestaffName': data.company},res.locals.la) );
        }
      })
    } else {
      res.render('customer', merge({'agestaffID':0, 'agestaffgroupID':0, 'agestaffName': "--- X ---"},res.locals.la) );
    }
});

app.get('/supplier', require('connect-ensure-login').ensureLoggedIn('/login'),
  (req, res) => {
    console.log(cmfunc.getTimeStamp() + 'goto supplier..');
    res.render('supplier', res.locals.la);
});

app.get('/scan', require('connect-ensure-login').ensureLoggedIn('/login'),
  (req, res) => {
    console.log(cmfunc.getTimeStamp() + 'goto scan..');
    res.render('scan', res.locals.la);
});

//************************************ Products **************************************
app.get('/brand*', require('connect-ensure-login').ensureLoggedIn('/login'),
  (req, res) => {
    console.log(cmfunc.getTimeStamp() + 'goto brand..');
  	var mid = req.originalUrl.split("_")[1];
    if (mid === undefined) { 
      if (req.session.mid ) mid = req.session.mid;
      else req.session.mid  = 0;
    } else {
      req.session.mid = mid;
    }
    //console.log("directorboard req.session.mid: " + req.session.mid);
    let memObj = {};
    let found = false;
    if (req.session.mid > 0) {
      memObj.memberID = req.session.mid;
      found  = true;
    } else {
      if ((req.session.roleID === 1) && (req.session.groupID > 1)) {
        memObj.memberID = req.session.memberID;
        found  = true;
      }
    }
    if (found) {
      tbls['memberx'].findOne(memObj, function(error, data) {
        if (error) {
          res.render('brand', merge({'manufacturerID':0, 'mangroupID':0, 'manufacturerName': "--- X ---"},res.locals.la) );
        } else {
          //console.log(JSON.stringify(data));
          res.render('brand', merge({'manufacturerID':data.memberID, 'mangroupID':data.groupID, 'manufacturerName': data.company},res.locals.la) );
        }
      })
    } else {
      res.render('brand', merge({'manufacturerID':0, 'mangroupID':0,'manufacturerName': "--- X ---"},res.locals.la) );
    }
});

app.get('/category', require('connect-ensure-login').ensureLoggedIn('/login'),
  (req, res) => {
    console.log(cmfunc.getTimeStamp() + 'goto category..');
  	res.render('category', res.locals.la );
});

app.get('/illness', require('connect-ensure-login').ensureLoggedIn('/login'),
  (req, res) => {
    console.log(cmfunc.getTimeStamp() + 'goto illness..');
  	res.render('illness', res.locals.la );
});
app.get('/symptom', require('connect-ensure-login').ensureLoggedIn('/login'),
  (req, res) => {
    console.log(cmfunc.getTimeStamp() + 'goto symptom..');
  	res.render('symptom', res.locals.la );
});
app.get('/diagnostic', require('connect-ensure-login').ensureLoggedIn('/login'),
  (req, res) => {
    console.log(cmfunc.getTimeStamp() + 'goto diagnostic..');
  	res.render('diagnostic', res.locals.la );
});
app.get('/prescription', require('connect-ensure-login').ensureLoggedIn('/login'),
  (req, res) => {
    console.log(cmfunc.getTimeStamp() + 'goto prescription..');
  	res.render('prescription', res.locals.la );
});

app.get('/product*', require('connect-ensure-login').ensureLoggedIn('/login'),
  (req, res) => {
    console.log(cmfunc.getTimeStamp() + 'goto product..' + req.originalUrl);
    var pcid = req.originalUrl.split("_")[1];
    if (pcid > 0) {
      res.render('product', merge({'catID':pcid, 'productgroupID':req.session.groupID},res.locals.la) );
    } else {
      res.render('product', merge({'catID':0, 'productgroupID':req.session.groupID},res.locals.la) );
    }
});
app.get('/prodqrcode*', require('connect-ensure-login').ensureLoggedIn('/login'),
  (req, res) => {
    console.log(cmfunc.getTimeStamp() + 'goto prodqrcode..' + req.originalUrl);
    var pmid = req.originalUrl.split("_")[1];
    var status = req.originalUrl.split("_")[2];
    let found = false;
    if (status > 3) {
      var sqlTxt =  `SELECT a.*, b.productName, c.name AS 'warehouseName', d.qtyIn FROM prodman a, product b, warehouse c, stock d `;
      sqlTxt +=  `WHERE (a.productID = b.productID) AND (a.warehouseID = c.warehouseID) AND (a.prodmanID = d.prodmanID)`; 
    } else {
      var sqlTxt =  `SELECT a.*, b.productName, c.name AS 'warehouseName' FROM prodman a, product b, warehouse c `;
      sqlTxt +=  `WHERE (a.productID = b.productID) AND (a.warehouseID = c.warehouseID)`; 
    }
    
    if (pmid !== undefined) { 
      if ((req.session.groupID > 1) && (req.session.roleID==1) ) {
        sqlTxt +=  ` AND (a.prodmanID = ${pmid}) `;
        sqlTxt +=  ` AND (a.groupID = ${req.session.groupID}) `;
        found = true;
      } else if (req.session.groupID == 1) {
        found = true;
      }
    }
    console.log("sqlTxt: " + sqlTxt);
    if (found) {
      tbls['prodman'].execSQL(sqlTxt, function(error, data) {
        if (error) {
          res.render('prodqrcode', merge({
            'prodmanID':0,
            'prodmandName': "--- X ---", 
            'qtyx':0, 
            'qtyBox':0, 
            'warehouseName': "--- X ---", 
            'productID':0,
            'batchNum':"--- X ---", 
            'unitcost':"--- X ---",
            'mandate':"--- X ---",
            'expirydate':"--- X ---",
          },res.locals.la) );
        } else {
          //console.log(JSON.stringify(data));
          res.render('prodqrcode', merge({
            'prodmanID':data[0].prodmanID, 
            'prodmandName': data[0].productName, 
            'qtyx': data[0].qty,
            'qtyBox': data[0].qtyIn,
            'warehouseName': data[0].warehouseName, 
            'productID': data[0].productID,
            'batchNum': data[0].batchNum,
            'unitCost': data[0].unitCost,
            'manDate': data[0].manDate,
            'expiryDate': data[0].expiryDate

          },res.locals.la) );
        }
      })
    } else {
      res.render('prodqrcode', merge({
        'prodmanID':0,
        'prodmandName': "--- X ---", 
        'qtyx':0, 
        'qtyBox':0, 
        'warehouseName': "--- X ---", 
        'productID':0,
        'batchNum':"--- X ---", 
        'unitcost':"--- X ---",
        'mandate':"--- X ---",
        'expirydate':"--- X ---",
      },res.locals.la) );
    }
});

app.get('/prodsearch*', require('connect-ensure-login').ensureLoggedIn('/login'),
  (req, res) => {
    console.log(cmfunc.getTimeStamp() + 'goto prodsearch..' + req.originalUrl);
    var bid = req.originalUrl.split("_")[1];
    let found = false;
    var sqlTxt =  `SELECT a.*, b.productName FROM box a, product b `;
    sqlTxt +=  `WHERE (a.productID = b.productID) `; 
    if (bid !== undefined) { 
      if ((req.session.groupID > 1) && (req.session.roleID < 3) ) { //Allowing directorboard and manstaff to check only
        sqlTxt +=  ` AND (a.boxID = ${bid}) `;
        sqlTxt +=  ` AND (b.groupID = ${req.session.groupID}) `;
        found = true;
      } else if (req.session.groupID == 1) {
        sqlTxt +=  ` AND (a.boxID = ${bid}) `;
        found = true;
      }
    }
    console.log("sqlTxt: " + sqlTxt);
    if (found) {
      tbls['prodman'].execSQL(sqlTxt, function(error, data) {
        if (error) {
          res.render('prodsearch', merge({'boxID':0, 'boxRefID': 0 ,'uuID': 0 ,'productName': "--- X ---", 'dateAdded':'---', 'statusx':'---', 'itemQty': 0},res.locals.la) );
        } else {
          console.log(JSON.stringify(data));
          if (data.length > 0) {
            res.render('prodsearch', merge({
              'boxID':data[0].boxID, 
              'productName': data[0].productName, 
              'boxRefID': data[0].refID,
              'uuID': data[0].uuID,
              'itemQty': data[0].itemQty,
              'dateAdded': data[0].dateAdded,
              'statusx': data[0].status,
            },res.locals.la) );
          } else {
            res.render('prodsearch', merge({'boxID':0, 'boxRefID': 0 ,'uuID': 0 ,'productName': "--- X ---", 'dateAdded':'---', 'statusx':'---', 'itemQty': 0},res.locals.la) );
          }
          
        }
      })
    } else {
      res.render('prodsearch', merge({'boxID':0, 'boxRefID': 0 ,'uuID': 0 ,'productName': "--- X ---", 'dateAdded':'---', 'statusx':'---', 'itemQty': 0},res.locals.la) );
    }
});

app.get('/boxsearch*', require('connect-ensure-login').ensureLoggedIn('/login'),
  (req, res) => {
    console.log(cmfunc.getTimeStamp() + `goto /boxsearch/${req.originalUrl}`);
    var pid = req.originalUrl.split("_")[1];
    let found = false;
    var sqlTxt =  `SELECT a.*, b.productName FROM pallet a, product b `;
    sqlTxt +=  `WHERE (a.productID = b.productID) `; 
    if (pid !== undefined) { 
      if ((req.session.groupID > 1) && (req.session.roleID < 3) ) { //Allowing directorboard and manstaff to check only
        sqlTxt +=  ` AND (a.palletID = ${pid}) `;
        sqlTxt +=  ` AND (b.groupID = ${req.session.groupID}) `;
        found = true;
      } else if (req.session.groupID == 1) {
        sqlTxt +=  ` AND (a.palletID = ${pid}) `;
        found = true;
      }
    }
    console.log("sqlTxt: " + sqlTxt);
    if (found) {
      tbls['prodman'].execSQL(sqlTxt, function(error, data) {
        if (error) {
          res.render('boxsearch', merge({'palletID':0, 'palletRefID': 0 ,'uuID': 0 ,'productName': "--- X ---", 'dateAdded':'---', 'statusx':'---', 'boxQty': 0},res.locals.la) );
        } else {
          console.log(JSON.stringify(data));
          if (data.length > 0) {
            res.render('boxsearch', merge({
              'palletID':data[0].palletID, 
              'productName': data[0].productName, 
              'palletRefID': data[0].refID,
              'uuID': data[0].uuID,
              'boxQty': data[0].boxQty,
              'dateAdded': data[0].dateAdded,
              'statusx': data[0].status,
            },res.locals.la) );
          } else {
            res.render('boxsearch', merge({'palletID':0, 'palletRefID': 0 ,'uuID': 0 ,'productName': "--- X ---", 'dateAdded':'---', 'statusx':'---', 'boxQty': 0},res.locals.la) );
          }
        }
      })
    } else {
      res.render('boxsearch', merge({'palletID':0, 'palletRefID': 0 ,'uuID': 0 ,'productName': "--- X ---", 'dateAdded':'---', 'statusx':'---', 'boxQty': 0},res.locals.la) );
    }
});

app.get('/palletsearch', require('connect-ensure-login').ensureLoggedIn('/login'),
  (req, res) => {
    console.log(cmfunc.getTimeStamp() + 'goto palletsearch..');
  	res.render('palletsearch', res.locals.la);
});
app.get('/rawstockused*', require('connect-ensure-login').ensureLoggedIn('/login'),
  (req, res) => {
    console.log(cmfunc.getTimeStamp() + 'goto rawstockused..' + req.originalUrl);
    var prodid = req.originalUrl.split("_")[1];
    let found = false;
    let sql0 = `SELECT a.*, b.productName, b.imgLink, d.name AS 'lastpersonName', e.subdir`;
    sql0 += ` FROM prodman a, product b, memberx d, groupx e WHERE  (a.prodmanID = ${prodid}) AND (a.productID = b.productID)`; 
    sql0 += ` AND (a.lastPerson = d.memberID) AND (a.groupID = e.groupID)`;
    if ((req.session.groupID > 1) && (req.session.roleID==1) ) {
      sql0 +=  ` AND (a.groupID = ${req.session.groupID}) `;
      found = true;
    } else if (req.session.groupID == 1) {
      found = true;
    }
    console.log("sql0: " + sql0);
    if (found) {
      tbls['product'].execSQL(sql0, function(error, data) {
        if (error) {
          res.render('rawstockused', merge({
            'prodmanID':0, 
            'productID':0, 
            'productName': '----X ---',
            'pimgLink': '----X ---',
            'subdir': '----X ---',
            'pbatchnum': '----X ---',
            'pqty': 0,
            'pmandate': '----X ---',
            'pexpirydate': '----X ---'
          },res.locals.la) );
        } else {
          console.log(JSON.stringify(data));
          res.render('rawstockused', merge({
            'prodmanID':data[0].prodmanID, 
            'productID':data[0].productID, 
            'productName': data[0].productName,
            'pimgLink': data[0].imgLink,
            'subdir': data[0].subdir,
            'pbatchnum': data[0].batchNum,
            'pqty': data[0].qty,
            'pmandate':  data[0].manDate,
            'pexpirydate': data[0].expiryDate,
          },res.locals.la) );
        }
      })
    } else {
      res.render('rawstockused', merge({
        'prodmanID':0, 
        'productID':0, 
        'productName': '----X ---',
        'pimgLink': '----X ---',
        'subdir': '----X ---',
        'pbatchnum': '----X ---',
        'pqty': 0,
        'pmandate': '----X ---',
        'pexpirydate': '----X ---'
      },res.locals.la) );
    }
});

app.get('/pformulae*', require('connect-ensure-login').ensureLoggedIn('/login'),
  (req, res) => {
    console.log(cmfunc.getTimeStamp() + 'goto pformulae..' + req.originalUrl);
    var pid = req.originalUrl.split("_")[1];
    let found = false;
    let sql0 = `SELECT a.*, d.name AS 'lastpersonName', e.subdir`;
    sql0 += ` FROM product a, memberx d, groupx e WHERE  (a.productID = ${pid}) `; 
    sql0 += ` AND (a.lastPerson = d.memberID) AND (a.groupID = e.groupID)`;
    if ((req.session.groupID > 1) && (req.session.roleID==1) ) {
      sql0 +=  ` AND (a.groupID = ${req.session.groupID}) `;
      found = true;
    } else if (req.session.groupID == 1) {
      found = true;
    }
    console.log("sql0: " + sql0);
    if (found) {
      tbls['product'].execSQL(sql0, function(error, data) {
        if (error) {
          res.render('pformulae', merge({
            'productID':0, 
            'productName': '----X ---',
            'pimgLink': '----X ---',
            'subdir': '----X ---',
            'manprocedure': '----X ---'
          },res.locals.la) );
        } else {
          console.log(JSON.stringify(data));
          res.render('pformulae', merge({
            'productID':data[0].productID, 
            'productName': data[0].productName,
            'pimgLink': data[0].imgLink,
            'subdir': data[0].address,
            'manprocedure': data[0].manprocedure
          },res.locals.la) );
        }
      })
    } else {
      res.render('pformulae', merge({
        'productID':0, 
        'productName': '----X ---',
        'pimgLink': '----X ---',
        'subdir': '----X ---',
        'manprocedure': '----X ---'
      },res.locals.la) );
    }
});

app.get('/shoppingcart*', require('connect-ensure-login').ensureLoggedIn('/login'),
  (req, res) => {
    console.log(cmfunc.getTimeStamp() + 'goto shoppingcart..' + req.originalUrl);
    var shid = req.originalUrl.split("?")[1];
    let found = false;
    var sqlTxt =  `SELECT a.*,  b.phone, b.name, b.dob, `;
    sqlTxt +=  ` c.name AS 'sxname', c.address AS 'sxaddress', c.abn, c.license, c.phone AS 'hotline', c.email AS 'sxemail', c.subdir, c.imgLink AS 'logox' `;
    sqlTxt +=  ` FROM sale a, memberx b, groupx c `;
    sqlTxt +=  `WHERE (a.customerID = b.memberID) AND (a.groupID = c.groupID) `; 
    if (shid !== undefined) { 
      if ((req.session.groupID > 1) && (req.session.roleID == 6) ) {
        sqlTxt +=  ` AND (a.saleID = ${shid}) `;
        sqlTxt +=  ` AND (a.groupID = ${req.session.groupID}) `;
        found = true;
      }
    }
    console.log("sqlTxt: " + sqlTxt);
    if (found) {
      tbls['sale'].execSQL(sqlTxt, function(error, data) {
        if (error) {
          res.render('shopcart', merge({
            'saleID':0,
            'saleno': "--- X ---",
            'customerName': "--- X ---",
            'phonex': "--- X ---",
            'dateaddedx': "--- X ---",
            'lastchangedx': "--- X ---",
            'amountx': "--- X ---",
            'taxx': "--- X ---",
            'sxname': "--- X ---",
            'sxaddress': "--- X ---",
            'hotline': "--- X ---",
            'sxemail': "--- X ---",
            'subdir': "--- X ---",
            'logox': "--- X ---",
            'abn': "--- X ---",
            'license': "--- X ---",
            'statusx': 0,
            'incltaxx': 0
          },res.locals.la) );
        } else {
          console.log(JSON.stringify(data));
          res.render('shopcart', merge({
            'saleID':data[0].saleID, 
            'saleno': data[0].saleno,
            'customerName': data[0].name,
            'phonex': data[0].phone,
            'dateaddedx':moment(data[0].dateAdded).locale('vi').format("Do MMM, YYYY"),
            'lastchangedx':moment(data[0].lastChanged).locale('vi').format("Do MMM, YYYY"), 
            'amountx':data[0].amount,
            'taxx':data[0].tax,
            'sxname':data[0].sxname,
            'sxaddress':data[0].sxaddress,
            'hotline':data[0].hotline,
            'sxemail':data[0].sxemail,
            'subdir':data[0].subdir,
            'logox':data[0].logox,
            'abn': data[0].abn,
            'license': data[0].license,
            'statusx': data[0].status,
            'incltaxx': data[0].incltax,
          },res.locals.la) );
        }
      })
    } else {
      res.render('shopcart', merge({
        'saleID':0,
        'saleno': "--- X ---",
        'customerName': "--- X ---",
        'phonex': "--- X ---",
        'dateaddedx': "--- X ---",
        'lastchangedx': "--- X ---",
        'amountx': "--- X ---",
        'taxx': "--- X ---",
        'sxname': "--- X ---",
        'sxaddress': "--- X ---",
        'hotline': "--- X ---",
        'sxemail': "--- X ---",
        'subdir': "--- X ---",
        'logox': "--- X ---",
        'abn': "--- X ---",
        'license': "--- X ---",
        'statusx': 0,
        'incltaxx': 0
      },res.locals.la) );
    }
});



app.get('/salecart*', require('connect-ensure-login').ensureLoggedIn('/login'),
  (req, res) => {
    console.log(cmfunc.getTimeStamp() + 'goto salecart..' + req.originalUrl);
    var sid = req.originalUrl.split("_")[1];
    let found = false;
    var sqlTxt =  `SELECT a.*, b.phone, b.name, b.email,  d.phone AS 'agentstaffPhone', d.name AS 'agentstaffName', d.email AS 'agentstaffEmail', `;
    sqlTxt +=  ` e.address AS 'agentAddress', e.company AS 'agentCompany' `;
    sqlTxt +=  ` FROM sale a, memberx b, memberx d, memberx e `;
    sqlTxt +=  ` WHERE (a.customerID = b.memberID) AND (a.agentStaffID = d.memberID) AND (d.parentID = e.memberID) `; 
    if (sid !== undefined) { 
      if ((req.session.groupID > 1) && ((req.session.roleID < 3) || (req.session.roleID > 4) )) {
        sqlTxt +=  ` AND (a.saleID = ${sid}) `;
        sqlTxt +=  ` AND (b.groupID = ${req.session.groupID}) `;
        found = true;
      } else if (req.session.groupID == 1) {
        found = true;
      }
    }
    console.log("sqlTxt: " + sqlTxt);
    if (found) {
      tbls['orderx'].execSQL(sqlTxt, function(error, data) {
        if (error) {
          res.render('sale', merge({
            'saleID':0,
            'customerID':0,
            'customerPhone': "--- X ---",
            'customerName': "--- X ---",
            'customerEmail': "--- X ---",
            'agentID':0,
            'agentPhone': "--- X ---",
            'agentName': "--- X ---",
            'agentEmail': "--- X ---",
            'dateAdded': "--- X ---",
            'agentCompany': "--- X ---",
            'agentAddress': "--- X ---"
          },res.locals.la) );
        } else {
          console.log(JSON.stringify(data));
          res.render('sale', merge({
            'saleID':data[0].saleID, 
            'customerID': data[0].customerID,
            'customerPhone': data[0].phone,
            'customerName': data[0].name,
            'customerEmail': data[0].email,
            'agentID': data[0].agentStaffID,
            'agentPhone': data[0].agentstaffPhone,
            'agentName': data[0].agentstaffName,
            'agentEmail': data[0].agentstaffEmail,
            'dateAdded':moment(data[0].dateAdded).locale('vi').format("Do MMM, YYYY"), 
            'agentCompany': data[0].agentCompany,
            'agentAddress': data[0].agentAddress,
          },res.locals.la) );
        }
      })
    } else {
      res.render('sale', merge({
        'saleID':0,
        'customerID':0,
        'customerPhone': "--- X ---",
        'customerName': "--- X ---",
        'customerEmail': "--- X ---",
        'agentID':0,
        'agentPhone': "--- X ---",
        'agentName': "--- X ---",
        'agentEmail': "--- X ---",
        'dateAdded': "--- X ---",
        'agentCompany': "--- X ---",
        'agentAddress': "--- X ---"
      },res.locals.la) );
    }
});
//************************** ISSUE PRODUCT QRCODE ************************************* */
app.get('/prodman', require('connect-ensure-login').ensureLoggedIn('/login'),
  (req, res) => {
    console.log(cmfunc.getTimeStamp() + 'goto prodman..');
  	res.render('prodman', res.locals.la);
});

app.get('/warehouse', require('connect-ensure-login').ensureLoggedIn('/login'),
  (req, res) => {
    console.log(cmfunc.getTimeStamp() + 'goto warehouse..');
  	res.render('warehouse', res.locals.la);
});

app.get('/prodstat', require('connect-ensure-login').ensureLoggedIn('/login'),
  (req, res) => {
    console.log(cmfunc.getTimeStamp() + 'goto prodstat..');
  	res.render('prodstat', res.locals.la);
});
app.get('/prodcount', require('connect-ensure-login').ensureLoggedIn('/login'),
  (req, res) => {
    console.log(cmfunc.getTimeStamp() + 'goto prodcount..');
  	res.render('prodcount', res.locals.la);
});
app.get('/rawstat', require('connect-ensure-login').ensureLoggedIn('/login'),
  (req, res) => {
    console.log(cmfunc.getTimeStamp() + 'goto rawstat..');
  	res.render('rawstat', res.locals.la);
});
app.get('/rawmon', require('connect-ensure-login').ensureLoggedIn('/login'),
  (req, res) => {
    console.log(cmfunc.getTimeStamp() + 'goto rawmon..');
  	res.render('rawmon', merge({'rawstockID':0}, res.locals.la));
});
app.get('/rawmonxfer*', require('connect-ensure-login').ensureLoggedIn('/login'),
  (req, res) => {
    console.log(cmfunc.getTimeStamp() + 'goto rawmonxfer..' + req.originalUrl);
    var rid = req.originalUrl.split("?")[1];
    res.render('rawmon', merge({'rawstockID': rid}, res.locals.la));
});
app.get('/prodmon', require('connect-ensure-login').ensureLoggedIn('/login'),
  (req, res) => {
    console.log(cmfunc.getTimeStamp() + 'goto rawmon..');
  	res.render('prodmon', merge({'productID':0}, res.locals.la));
});
app.get('/prodmonxfer*', require('connect-ensure-login').ensureLoggedIn('/login'),
  (req, res) => {
    console.log(cmfunc.getTimeStamp() + 'goto prodmonxfer..' + req.originalUrl);
    var pid = req.originalUrl.split("?")[1];
    res.render('prodmon', merge({'productID': pid}, res.locals.la));
});
app.get('/prodformula', require('connect-ensure-login').ensureLoggedIn('/login'),
  (req, res) => {
    console.log(cmfunc.getTimeStamp() + 'goto prodformula..');
  	res.render('prodformula', res.locals.la);
});
app.get('/assetman', require('connect-ensure-login').ensureLoggedIn('/login'),
  (req, res) => {
    console.log(cmfunc.getTimeStamp() + 'goto assetman..');
  	res.render('assetman', res.locals.la);
});

//************************** SALE ORDER MANAGEMENT ************************************* */
app.get('/ordersx', require('connect-ensure-login').ensureLoggedIn('/login'),
  (req, res) => {
    console.log(cmfunc.getTimeStamp() + 'goto ordersx..');
  	res.render('ordersx', res.locals.la);
});

app.get('/quickcheck', require('connect-ensure-login').ensureLoggedIn('/login'),
  (req, res) => {
    console.log(cmfunc.getTimeStamp() + 'goto quickcheck..' + req.originalUrl);
  	res.render('quickcheck', res.locals.la);
});

app.get('/salediary', require('connect-ensure-login').ensureLoggedIn('/login'),
  (req, res) => {
    console.log(cmfunc.getTimeStamp() + 'goto salediary..' + req.originalUrl);
  	res.render('salediary', res.locals.la);
});

app.get('/salediarycus', require('connect-ensure-login').ensureLoggedIn('/login'),
  (req, res) => {
    console.log(cmfunc.getTimeStamp() + 'goto salediarycus..' + req.originalUrl);
  	res.render('salediarycus', res.locals.la);
});

app.get('/walletstar*', require('connect-ensure-login').ensureLoggedIn('/login'),
  (req, res) => {
    console.log(cmfunc.getTimeStamp() + 'goto walletstar..' + req.originalUrl);
    var asid = req.originalUrl.split("_")[1];
    res.render('walletstar', merge({'agentstaffID':asid},res.locals.la) );
});

app.get('/walletxchange*', require('connect-ensure-login').ensureLoggedIn('/login'),
  (req, res) => {
    console.log(cmfunc.getTimeStamp() + 'goto walletxchange..' + req.originalUrl);
    var mid = req.originalUrl.split("_")[1];
    if (mid !== undefined) res.render('wallet', merge({'accountID':mid, 'pagetitle':'walletxchange'},res.locals.la) );
    else res.render('wallet', merge({'accountID': 0, 'pagetitle':'walletxchange'},res.locals.la) );
});

app.get('/salexchg*', require('connect-ensure-login').ensureLoggedIn('/login'),
  (req, res) => {
    console.log(cmfunc.getTimeStamp() + 'goto salexchg..' + req.originalUrl);
    var cid = req.originalUrl.split("_")[1];
    var prodid = req.originalUrl.split("_")[2];
    var sid = req.originalUrl.split("_")[3];
    if (cid > 0) {
      res.render('salexchg', merge({'selID':cid, 'pagetitle':'custxchg'},res.locals.la) );
    } else if (prodid > 0) {
      res.render('salexchg', merge({'selID':prodid, 'pagetitle':'prodxchg'},res.locals.la) );
    } else if (sid > 0) {
      res.render('salexchg', merge({'selID':sid, 'pagetitle':'staffxchg'},res.locals.la) );
    }
});

app.get('/esmsxchange', require('connect-ensure-login').ensureLoggedIn('/login'),
  (req, res) => {
    console.log(cmfunc.getTimeStamp() + 'goto esmsxchange..');
    res.render('esms', res.locals.la);
});

app.get('/topupservice', require('connect-ensure-login').ensureLoggedIn('/login'),
  (req, res) => {
    console.log(cmfunc.getTimeStamp() + 'goto topupservice..');
    res.render('etopup', res.locals.la);
});

app.get('/checkwallet', require('connect-ensure-login').ensureLoggedIn('/login'),
  (req, res) => {
    console.log(cmfunc.getTimeStamp() + 'goto checkwallet..');
    res.render('wallet', merge({'accountID': req.session.memberID, 'pagetitle':'checkwallet'},res.locals.la) );
});

app.get('/walletapproval', require('connect-ensure-login').ensureLoggedIn('/login'),
  (req, res) => {
    console.log(cmfunc.getTimeStamp() + 'goto walletapproval..');
    res.render('walletapproval', res.locals.la );
});
app.get('/prodqrchk*',  (req, res) => {
  console.log(cmfunc.getTimeStamp() + 'goto ' + req.originalUrl);
  if (req.originalUrl.split("?").length > 0) {
    req.session.buuidx = ''; //Clear box QRCODE
    var puuid = req.originalUrl.split("?")[1].split("&")[0];
    if (puuid !== undefined) {
      if (!cmfunc.isEmpty(req.session.memberID)) {
        req.session.puuid  = puuid;
        res.redirect("/mscanner");
      } else {
        var sqlTxt =  `SELECT a.status, a.refID, a.uuID, c.productName, c.imgLink,`;
        sqlTxt +=  ` d.subdir, d.weburl, e.status AS "bstatus" `;
        sqlTxt +=  ` FROM proditem a, prodman b, product c, groupx d, box e `;
        sqlTxt +=  ` WHERE (a.prodmanID = b.prodmanID) AND (b.productID = c.productID) AND (b.groupID = d.groupID) `;
        sqlTxt +=  ` AND (a.uuID='${puuid}') AND (a.boxID = e.boxID)`; 
        tbls['proditem'].execSQL(sqlTxt, function(error, data) {
          if (error) {
            res.render('qrcheck', merge({
              'statusx':0,
              'bstatusx':0,
              'productNamex': "--- X ---",
              'refIDx': "--- X ---",
              'uuIDx': "--- X ---",
              'imgLinkx': "--- X ---",
              'subdirx': "--- X ---",
              'weburlx':"--- X ---"
            },res.locals.la) );
          } else {
            console.log(JSON.stringify(data));
            if (data.length > 0) {
              res.render('qrcheck', merge({
                'statusx': data[0].status,
                'bstatusx': data[0].bstatus,
                'productNamex': data[0].productName,
                'refIDx': data[0].refID,
                'uuIDx': data[0].uuID,
                'imgLinkx': data[0].imgLink,
                'subdirx': data[0].subdir,
                'weburlx': data[0].weburl,
              },res.locals.la) );
            } else {
              res.render('qrcheck', merge({
                'statusx':0,
                'bstatusx':0,
                'productNamex': "--- X ---",
                'refIDx': "--- X ---",
                'uuIDx': "--- X ---",
                'imgLinkx': "--- X ---",
                'subdirx': "--- X ---",
                'weburlx':"--- X ---"
              },res.locals.la) );
            }
          }
        })
      }
    }
  } else {
    res.redirect("/merror")
  }
})


app.get('/boxchk*',  (req, res) => {
  console.log(cmfunc.getTimeStamp() + 'goto ' + req.originalUrl);
    if (req.originalUrl.split("?").length > 0) {
      var buuid = req.originalUrl.split("?")[1].split("&")[0];
      req.session.puuid = ""; //Clear Prod QRCODE
      if (buuid !== undefined) {
        req.session.buuidx = buuid;
        if (!cmfunc.isEmpty(req.session.memberID)) {
          res.redirect("/mstockreceive");
        } else {
          var sqlTxt =  `SELECT a.status, a.refID, a.uuID, c.productName, c.imgLink,`;
          sqlTxt +=  ` d.subdir, d.weburl `;
          sqlTxt +=  ` FROM box a, product c, groupx d `;
          sqlTxt +=  ` WHERE  (a.productID = c.productID) AND (c.groupID = d.groupID) `;
          sqlTxt +=  ` AND (a.uuID='${buuid}') `; 
          tbls['proditem'].execSQL(sqlTxt, function(error, data) {
            if (error) {
              res.render('qrboxchk', merge({
                'statusx':0,
                'productNamex': "--- X ---",
                'refIDx': "--- X ---",
                'uuIDx': "--- X ---",
                'imgLinkx': "--- X ---",
                'subdirx': "--- X ---",
                'weburlx':"--- X ---"
              },res.locals.la) );
            } else {
              console.log(JSON.stringify(data));
              if (data.length > 0) {
                res.render('qrboxchk', merge({
                  'statusx': data[0].status,
                  'productNamex': data[0].productName,
                  'refIDx': data[0].refID,
                  'uuIDx': data[0].uuID,
                  'imgLinkx': data[0].imgLink,
                  'subdirx': data[0].subdir,
                  'weburlx': data[0].weburl,
                },res.locals.la) );
              } else {
                res.render('qrboxchk', merge({
                  'statusx':0,
                  'productNamex': "--- X ---",
                  'refIDx': "--- X ---",
                  'uuIDx': "--- X ---",
                  'imgLinkx': "--- X ---",
                  'subdirx': "--- X ---",
                  'weburlx':"--- X ---"
                },res.locals.la) );
              }
            }
          })
        }
      }
    } else {
      res.redirect("/merror")
    }
})

app.get('/proddetails/:pid', (req, res) => {
  console.log(cmfunc.getTimeStamp() + `goto proddetails/${req.params.pid}`);
  var sql0 =  `SELECT a.proditemID, a.status, a.refID, a.uuID, c.productName, c.imgLink, c.productID, `;
  sql0 +=  ` d.subdir, e.customerBonus as "bonus", f.status as "bstatus" `;
  sql0 +=  ` FROM proditem a, prodman b, product c, groupx d, promotion e, box f `;
  sql0 +=  ` WHERE (a.prodmanID = b.prodmanID) AND (b.productID = c.productID) AND (b.groupID = d.groupID) AND (a.promotionID = e.promotionID)`;
  sql0 +=  ` AND (a.uuID='${req.params.pid}') AND (a.boxID = f.boxID)`; 
  console.log(sql0);
  tbls['proditem'].execSQL(sql0, function(error, data) {
    if (error) {
      res.send(JSON.stringify({
          status: 0,
          title: "Lỗi kết nối..",
        })
      );
    } else {
      if (data && data.length > 0) {
        res.send(JSON.stringify({
            status: 1,
            data: data[0]
          })
        );
      } else {
        res.send(JSON.stringify({
            status: 1,
            data: null
          })
        );
      }
      
    }
  })       
});

app.get('/prodboxdetails/:pid', (req, res) => {
  console.log(cmfunc.getTimeStamp() + `goto proddetails/${req.params.pid}`);
  var sql0 =  `SELECT a.proditemID, a.status, a.refID, a.uuID, c.productName, c.imgLink, c.productID, `;
  sql0 +=  ` d.subdir, e.customerBonus as "bonus" `;
  sql0 +=  ` FROM proditem a, prodman b, product c, groupx d, promotion e`;
  sql0 +=  ` WHERE (a.prodmanID = b.prodmanID) AND (b.productID = c.productID) AND (b.groupID = d.groupID) AND (a.promotionID = e.promotionID)`;
  sql0 +=  ` AND (a.uuID='${req.params.pid}')`; 
  console.log(sql0);
  tbls['proditem'].execSQL(sql0, function(error, data) {
    if (error) {
      res.send(JSON.stringify({
          status: 0,
          title: "Lỗi kết nối..",
        })
      );
    } else {
      if (data && data.length > 0) {
        res.send(JSON.stringify({
            status: 1,
            data: data[0]
          })
        );
      } else {
        res.send(JSON.stringify({
            status: 1,
            data: null
          })
        );
      }
      
    }
  })       
});

app.get('/boxdetails/:pid', (req, res) => {
  console.log(cmfunc.getTimeStamp() + `goto boxdetails/${req.params.pid}`);
  var sql0 =  `SELECT a.boxID, a.status, a.refID, a.uuID, c.productName, c.imgLink, c.productID, `;
  sql0 +=  ` d.subdir `;
  sql0 +=  ` FROM box a, product c, groupx d `;
  sql0 +=  ` WHERE (a.productID = c.productID) AND (c.groupID = d.groupID)`;
  sql0 +=  ` AND (a.uuID='${req.params.pid}') `; 
  //console.log(sql0);
  tbls['box'].execSQL(sql0, function(error, data) {
    if (error) {
      res.send(JSON.stringify({
          status: 0,
          title: "Lỗi kết nối..",
        })
      );
    } else {
      if (data && data.length > 0) {
        res.send(JSON.stringify({
            status: 1,
            data: data[0]
          })
        );
      } else {
        res.send(JSON.stringify({
            status: 1,
            data: null
          })
        );
      }
      
    }
  })       
  
});

app.get('/staffdetails/:sid', require('connect-ensure-login').ensureLoggedIn('/login'),
(req, res) => {
  console.log(cmfunc.getTimeStamp() + `goto staffdetails/${req.params.sid}`);
  var sid = parseInt(req.params.sid.match(/(\d+)/));
  var sql0 = '';
  sql0 =  `SELECT a.memberID, a.status, a.roleID, a.divisionID, a.name, a.imgLink, b.hourlyRate`;
  sql0 +=  ` FROM memberx a, awardtype b `;
  sql0 +=  ` WHERE (a.memberID = ${sid}) AND (a.awardtypeID=b.awardtypeID) AND (a.status=1)`;
  console.log(sql0);
  tbls['memberx'].execSQL(sql0, function(error, data) {
    if (error) {
      res.send(JSON.stringify({
          status: 0,
          title: "Lỗi kết nối..",
        })
      );
    } else {
      
      res.send(JSON.stringify({
          status: 1,
          data: data[0]
        })
      );
    }
  })       
  
});

app.post('/getmember', function (req, res) {
  if (cmfunc.isEmpty(req.session.user)) { res.redirect('/'); }// if user is not logged-in redirect back to login page //
  else {
    console.log(cmfunc.getTimeStamp() + "/getmember/"+ req.body.roleID + "/" + req.body.divisionID+ "/" + req.body.typex);
    console.log(req.body)
    let roleIDx = JSON.parse(req.body.roleID);
    let divisionIDx = JSON.parse(req.body.divisionID);
    var sqlrolex = [];
    var sqldivision = [];
    roleIDx.forEach((m,index) => {
      sqlrolex.push(`(roleID=${m})`)
    })
    divisionIDx.forEach((m,index) => {
      sqldivision.push(`(divisionID=${m})`)
    })
    var  sql0;
    sql0 = ` SELECT memberID, imgLink, parentID, name, company, roleID, divisionID FROM memberx `;
    if (req.session.roleID == 1) {
      sql0 += ` WHERE ((${sqlrolex.join(" OR ")}) AND (${sqldivision.join(" OR ")}) || ((roleID=1) AND (groupID>1)))`;
    } else {
      sql0 += ` WHERE (${sqlrolex.join(" OR ")}) AND (${sqldivision.join(" OR ")})`;
    }
    if (req.body.typex > 0) {
      sql0 += ` AND (typeID = ${req.body.typex})`
    }
    sql0 += ` ORDER BY name`;
    console.log(sql0)
    tbls['memberx'].execSQL(sql0, function (error, data) {
      if (error) {
        throw error
      } else {
        res.send(data)
      }
    })
  }
})

app.post('/getPayrollMember', function (req, res) {
  if (cmfunc.isEmpty(req.session.user)) { res.redirect('/'); }// if user is not logged-in redirect back to login page //
  else {
    console.log(cmfunc.getTimeStamp() + "/getPayrollMember");
    var  sql0;
    sql0 = ` SELECT a.memberID, a.imgLink, a.parentID, a.name, a.company, a.roleID, a.divisionID, b.*  `;
    sql0 += ` FROM memberx a, awardtype b `;
    if ((req.session.roleID == 6) && (req.session.divisionID == 1)) {
      sql0 += ` WHERE ((a.roleID=6) || (a.roleID=7)) AND (a.awardtypeID=b.awardtypeID)  AND (a.groupID = ${req.session.groupID})`;
    } else {
      sql0 += ` WHERE (a.memberID = ${req.session.memberID}) AND (a.groupID = ${req.session.groupID})`;
    }
    sql0 += ` ORDER BY a.name`;
    console.log(sql0);
    tbls['memberx'].execSQL(sql0, function (error, data) {
      if (error) {
        throw error
      } else {
        //console.log(data);
        res.send(data)
      }
    })
  }
})

app.post('/getsalemember', function (req, res) {
  if (cmfunc.isEmpty(req.session.user)) { res.redirect('/'); }// if user is not logged-in redirect back to login page //
  else {
    console.log(cmfunc.getTimeStamp() + "/getsalemember/");
    var roleID = req.session.roleID;
    var divisionID = req.session.divisionID;
    var memberID = req.session.memberID;
    var  sql0;
    if ((roleID == 1) && (req.session.groupID > 1)) {
      sql0 = ` SELECT memberID, imgLink, parentID, name, company, roleID, divisionID FROM memberx`;
      sql0 += ` WHERE (((roleID=${roleID}) AND (groupID>1)) OR ((roleID=2) AND ((divisionID=3) OR (divisionID=4))))`;
    } else if ((roleID == 2) && (divisionID==3)){
      sql0 = ` SELECT memberID, imgLink, parentID, name, company, roleID, divisionID FROM memberx`;
      sql0 += ` WHERE (memberID = ${memberID}) OR (parentID = ${memberID})
      `;
    }
    sql0 += ` ORDER BY name`;
    console.log(sql0)
    tbls['memberx'].execSQL(sql0, function (error, data) {
      if (error) {
        throw error
      } else {
        res.send(data)
      }
    })
  }
})

app.post('/getcustomermember', function (req, res) {
  if (cmfunc.isEmpty(req.session.user)) { res.redirect('/'); }// if user is not logged-in redirect back to login page //
  else {
    console.log(cmfunc.getTimeStamp() + "/getcustomermember/");
    var roleID = req.session.roleID;
    var divisionID = req.session.divisionID;
    var memberID = req.session.memberID;
    var  sql0;
    if ((roleID == 1) && (req.session.groupID > 1)) {
      sql0 = ` SELECT a.memberID, a.imgLink, a.parentID, a.name, a.company, a.roleID, a.divisionID FROM memberx a, memberx b, memberx c `;
      sql0 += ` WHERE 
                ((a.roleID=4) OR (a.roleID=6)) AND (a.consultantID=b.memberID) AND (b.parentID=c.memberID) AND (c.parentID=${memberID})
              `;
    } else if ((roleID == 2) && (divisionID==3)){
      sql0 = ` SELECT a.memberID, a.imgLink, a.parentID, a.name, a.company, a.roleID, a.divisionID FROM memberx a, memberx b, memberx c `;
      sql0 += ` WHERE 
                ((a.roleID=4) OR (a.roleID=6)) AND (a.consultantID=b.memberID) AND (b.parentID=c.memberID) AND (c.memberID=${memberID})
      `;
    } else if ((roleID == 2) && (divisionID==4)){
      sql0 = ` SELECT a.memberID, a.imgLink, a.parentID, a.name, a.company, a.roleID, a.divisionID FROM memberx a `;
      sql0 += ` WHERE 
                ((a.roleID=4) OR (a.roleID=6)) AND (a.consultantID=${memberID})
      `;  
    }
    sql0 += ` ORDER BY name`;
    console.log(sql0)
    tbls['memberx'].execSQL(sql0, function (error, data) {
      if (error) {
        throw error
      } else {
        res.send(data)
      }
    })
  }
})
//********************************* START ********************************************/
app.get('/', (req, res) => {
    console.log(cmfunc.getTimeStamp() + 'goto root..');
    console.log(req.session.roleID);
    var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    console.log("fullUrl: " + fullUrl);
    if (!cmfunc.isEmpty(req.session.memberID)) {
      if (req.useragent.isMobile) {
        if (req.session.roleID == 3) {
          res.redirect("/mscanner");
        } else if (req.session.roleID >= 6) {
          res.redirect("/mpackaging");
        } else {
          res.redirect("/mindex");
        }
      } else{
        res.redirect("/index");
      }
    } else {
      if (fullUrl.includes('admin')) {
        if (req.useragent.isMobile) {
          res.redirect("/mlogin");
        } else {
          res.redirect("/login");
        }
      } else {
        res.redirect("/dindex");
      }
    }
});

app.get('/home', require('connect-ensure-login').ensureLoggedIn('/login'),
(req, res) => {
    console.log(cmfunc.getTimeStamp() + 'goto home..' );
    res.send({ status: 1, roleID: req.session.roleID, divisionID: req.session.divisionID });
});

app.get('/dindex',
(req, res) => {
    console.log(cmfunc.getTimeStamp() + 'goto dindex..' );
    res.render('dindex', res.locals.la );
});

app.get('/index', require('connect-ensure-login').ensureLoggedIn('/login'),
(req, res) => {
    console.log(cmfunc.getTimeStamp() + 'goto index..' );
    Promise.all([
      getMemberInfo(req),
      getcontactstat(req),
      getproduct(req),
      getcategory(req),
      getWalletBalance(req)
    ]).then((data) => {
      if (req.useragent.isMobile) {
        res.redirect("/mindex");
      } else {
        //console.log(data)
        res.locals.la.name = data[0][0].name;
          res.render('index', merge({
            'constat':JSON.stringify(data[1]),
            'productstat':JSON.stringify(data[2]),  
            'categorystat':JSON.stringify(data[3]),  
            'walletbalance':JSON.stringify(data[4])    
        }, res.locals.la) ); 
        console.log("req.session.themeID: " + req.session.themeID)    
      }     
    })
});

app.get('/resetdb', require('connect-ensure-login').ensureLoggedIn('/login'),
(req, res) => {
    console.log(cmfunc.getTimeStamp() + 'goto resetdb..' );
      let sql0 = `DELETE FROM box;`;
      sql0 += ` DELETE FROM pallet;`; 
      sql0 += ` DELETE FROM proditem;`; 
      sql0 += ` DELETE FROM orderx;`; 
      sql0 += ` DELETE FROM orderxitem;`; 
      sql0 += ` DELETE FROM palletitems;`; 
      sql0 += ` DELETE FROM prodman;`; 
      sql0 += ` DELETE FROM sale;`; 
      sql0 += ` DELETE FROM stock;`; 
      sql0 += ` DELETE FROM wallet;`; 
      tbls['pallet'].execSQL(sql0, function(error, result) {
        if (error) throw error;
        //console.log(result)
        res.redirect("/index");
      })
    
});
//************************************ WEB APP ***************************************/
app.get('/apphome', (req, res) => {
  console.log(cmfunc.getTimeStamp() + 'goto apphome..');
  if (!cmfunc.isEmpty(req.session.memberID)) {
    res.redirect("/mindex");
  } else {
    res.redirect("/mlogin");
  }
});
app.get('/mlogin*', (req, res) => {
  console.log(cmfunc.getTimeStamp() + "/mlogin..  " );
  let errmsg = req.flash("errmsg");
  if (errmsg.length > 0 ) {
    console.log("errmsg: " + errmsg);
    if (fullUrl.includes('ikitchen')) {
      return res.status(401).json({ success: false, message: 'Mật mã không đúng!' });
    } else {
      res.send({ status: 0, message: errmsg });
    }
  } else {
    if (req.useragent.isMobile) {
      var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
      console.log("fullUrl: " + fullUrl);
      var domainy = fullUrl.split('/');
      var sql0 = '';
      console.log(fullUrl);
      if (fullUrl.includes('ikitchen')) {
        return res.status(200).json({ success: true });
      } else {
        if (inproduction==1) {
          var portID = domainy[2].split(":")[1];
          sql0 = `SELECT a.* FROM groupx a WHERE (a.portID = '${portID}')`;
        } else {
          var domainx = domainy[0] + '//' + domainy[2];
          sql0 = `SELECT a.* FROM groupx a WHERE (a.weburl = '${domainx}')`;
        }
        console.log("sql0: " + sql0);
        const idx = req.originalUrl.split("?").length>0?req.originalUrl.split("?")[1]:0;
        tbls['groupx'].execSQL(sql0, function(errx, datx){
          if (errx) throw errx;
          if (datx.length > 0) {
            var imgLinkx = "";
            if (datx[0].imgLink && (datx[0].imgLink.length>0)) {
              imgLinkx = `../public/${datx[0].subdir}/${datx[0].imgLink}`;
            } else {
              imgLinkx = ``;
            }
            req.session.tname = datx[0].name;
            req.session.tlogo = imgLinkx;
            res.render('mlogin', merge({idx:idx, tname:req.session.tname, tlogo:req.session.tlogo}, res.locals.la ));
          } else {
            res.render('mlogin', merge({idx:idx, tname:'** Cảnh báo **', tlogo: ""}, res.locals.la ));
          }
        })
      }
    } else {
      res.redirect("/login");
    }
    
  }
});

app.get('/mindex', require('connect-ensure-login').ensureLoggedIn('/mlogin'),
(req, res) => {
    console.log(cmfunc.getTimeStamp() + 'goto mindex..' );
    //console.log(res.locals.la)
    Promise.all([
      getMemberInfo(req),
      getWalletBalance(req)
    ]).then((data) => {
      res.locals.la.name = data[0][0].name;
      if (req.useragent.isMobile) {
        res.render('mindex', merge({
          'imgLink': data[0][0].imgLink,
          'weburl': data[0][0].weburl,
          'walletbalance':JSON.stringify(data[1])   
        }, res.locals.la) );
      } else {
        res.redirect("/index");
      }
    })
});

app.get('/mlanguage', require('connect-ensure-login').ensureLoggedIn('/mlogin'),
  (req, res) => {
    console.log(cmfunc.getTimeStamp() + 'goto mlanguage..');
  	res.render('mlanguage', res.locals.la );
});
app.get('/mstaff', require('connect-ensure-login').ensureLoggedIn('/mlogin'),
  (req, res) => {
    console.log(cmfunc.getTimeStamp() + 'goto mstaff..');
  	Promise.all([
      getMemberInfo(req)
    ]).then((data) => {
      res.locals.la.name = data[0][0].name;
      //console.log("DDDD: " + JSON.stringify(data[0][0],false, 4))
      res.render('mstaff', merge({
        'imgLink': data[0][0].imgLink,
        'weburl': data[0][0].weburl,
      }, res.locals.la) );
    })
});
app.get('/mforgotpasswd', (req, res) => {
    console.log(cmfunc.getTimeStamp() + 'goto mforgotpasswd..');
  	res.render('mforgotpasswd', merge({ 
      tname:req.session.tname, 
      tlogo:req.session.tlogo
    }, res.locals.la ));
});
app.get('/mregister', (req, res) => {
  console.log(cmfunc.getTimeStamp() + 'goto mforgotpasswd..');
  res.render('mregister', res.locals.la );
});
app.get('/mtermsandconditions', (req, res) => {
  console.log(cmfunc.getTimeStamp() + 'goto mtermsandconditions..');
  res.render('mtermsandconditions', res.locals.la );
});

app.get('/referral*', (req, res) => {
  console.log(cmfunc.getTimeStamp() + 'goto ' + req.originalUrl);
  const paramsArray = getParameters(req.originalUrl);
  console.log(paramsArray)
  const id = paramsArray.filter(f=>f.name==='id').length?paramsArray.filter(f=>f.name==='id')[0].value:0;
  //console.log("id: " + id);
  const mid = parseInt(decrypt(id).replace(/[^0-9]/g,""));
  //console.log("mid: " + mid);
  if ((mid !== undefined) && (mid>0)) {
    tbls['memberx'].findOne({memberID:mid}, function(error, data) {
      if (error) {
        res.render('invalidreferral', res.locals.la);
      } else {
        res.redirect(`/mlogin?${id}`);
      }
    })
  } else  {
    res.render('invalidreferral', res.locals.la);
  }
});
//**************************************** */

app.get('/mtop10products', require('connect-ensure-login').ensureLoggedIn('/mlogin'),
(req, res) => {
  console.log(cmfunc.getTimeStamp() + 'goto mtop10products..');
  res.render('mtop10', merge({top10id:0},res.locals.la) );
});

app.get('/mtop10agents', require('connect-ensure-login').ensureLoggedIn('/mlogin'),
(req, res) => {
  console.log(cmfunc.getTimeStamp() + 'goto mtop10agents..');
  res.render('mtop10', merge({top10id:1},res.locals.la) );
});

app.get('/mtop10agentstaffs', require('connect-ensure-login').ensureLoggedIn('/mlogin'),
(req, res) => {
  console.log(cmfunc.getTimeStamp() + 'goto mtop10agentstaff..');
  res.render('mtop10', merge({top10id:2},res.locals.la) );
});

app.get('/mtop10diststaffs', require('connect-ensure-login').ensureLoggedIn('/mlogin'),
(req, res) => {
  console.log(cmfunc.getTimeStamp() + 'goto mtop10diststaff..');
  res.render('mtop10', merge({top10id:3},res.locals.la) );
});

app.get('/mprofile', require('connect-ensure-login').ensureLoggedIn('/mlogin'),
(req, res) => {
  console.log(cmfunc.getTimeStamp() + 'goto mprofile..');
  //console.log(res.locals.la)
  Promise.all([
    getMemberInfo(req),
    getWalletBalance(req)
  ]).then((data) => {
    res.locals.la.name = data[0][0].name;
    res.render('mprofile', merge({
      'imgLink': data[0][0].imgLink,
      'weburl': data[0][0].weburl,
      'walletbalance':JSON.stringify(data[1])   
    }, res.locals.la) );
  })
});

app.get('/mpayroll', require('connect-ensure-login').ensureLoggedIn('/mlogin'),
(req, res) => {
  console.log(cmfunc.getTimeStamp() + 'goto mpayroll..');
  res.render('mpayroll', res.locals.la );
});

app.get('/mprofileedit', require('connect-ensure-login').ensureLoggedIn('/mlogin'),
(req, res) => {
  console.log(cmfunc.getTimeStamp() + 'goto mprofileedit..');
  tbls['memberx'].findOne({memberID: req.session.memberID}, function(err, data){
    if (err) throw err;
    res.render('mprofileedit', merge({
      namex: data.name,
      addressx: data.address,
      momoAccountx: data.momoAccount,
      emailx: data.email,
      provincesIDx: data.provincesID,
      wardsIDx: data.wardsID,
      phuongIDx: data.phuongID,
      cccdfrontx: data.cccdfront,
      cccdbackx: data.cccdback,
    }, res.locals.la) );
  })
});

app.get('/mcusprofile*', require('connect-ensure-login').ensureLoggedIn('/mlogin'),
(req, res) => {
  console.log(cmfunc.getTimeStamp() + `goto mcustprofile..`);
  var mid = req.originalUrl.split("?")[1]
  if (mid > 0) {
    tbls['memberx'].findOne({memberID: mid}, function(err, data){
      if (err) throw err;
      res.render('mcusprofile', merge({
        cidx: mid,
        namex: data.name,
        phonex: data.phone,
        abnx: data.abn,
        dobx: data.dob,
        imgLinkx: data.imgLink,
      }, res.locals.la) );
    })
  } else {
      res.render('mcusprofile', merge({
        cidx: 0,
        namex: "",
        phonex: "",
        abnx: "",
        dobx: "",
        dobx: "",
        imgLinkx: "",
        
      }, res.locals.la) );
  }
  
});

app.get('/mwallet', require('connect-ensure-login').ensureLoggedIn('/mlogin'),
(req, res) => {
  console.log(cmfunc.getTimeStamp() + 'goto mprofile..');
  res.render('mwallet', res.locals.la );
});
app.get('/mwalletdetails*', require('connect-ensure-login').ensureLoggedIn('/mlogin'),
(req, res) => {
  console.log(cmfunc.getTimeStamp() + 'goto mwalletdetails..');
  var widurl = req.originalUrl.split("?")[1]?req.originalUrl.split("?")[1]:'';
  var wid = 0;
  var saleID = 0;
  if (widurl) {
    wid = widurl.split("&")[0];
    saleID = widurl.split("&")[1];
  }
  res.render('mwalletdetails', merge({widx:wid, saleidx:saleID, dateaddedx:'0'},res.locals.la) );
});
app.get('/mwalletdetex*', require('connect-ensure-login').ensureLoggedIn('/mlogin'),
(req, res) => {
  console.log(cmfunc.getTimeStamp() + 'goto mwalletdetex..' +req.originalUrl );
  var dateadded = req.originalUrl.split("?")[1]?req.originalUrl.split("?")[1]:'0';
  dateadded = dateadded.split("%20")[0]?dateadded.split("%20")[0]:'0';
  if (dateadded !== '0') {
    res.render('mwalletdetails', merge({widx:0, saleidx:0, dateaddedx:dateadded},res.locals.la) );
  }
});
app.get('/mwalletapproval', require('connect-ensure-login').ensureLoggedIn('/mlogin'),
(req, res) => {
  console.log(cmfunc.getTimeStamp() + 'goto mwalletapproval..');
  res.render('mwalletapproval', res.locals.la );
});
app.get('/mwalletapprovaldaily*', require('connect-ensure-login').ensureLoggedIn('/mlogin'),
(req, res) => {
  console.log(cmfunc.getTimeStamp() + 'goto mwalletapprovaldaily..');
  var dateadded = req.originalUrl.split("?")[1];
  dateadded = dateadded.split("%20")[0]?dateadded.split("%20")[0]:'0';
  if (dateadded!=='0') {
    res.render('mwalletapprovaldaily', merge({dateaddedx:dateadded},res.locals.la) );
  }
});
app.get('/mwalletproductdaily*', require('connect-ensure-login').ensureLoggedIn('/mlogin'),
(req, res) => {
  console.log(cmfunc.getTimeStamp() + 'goto mwalletproductdaily..');
  var dateadded = req.originalUrl.split("?")[1];
  if (dateadded) res.render('mwalletproductdaily', merge({dateaddedx:dateadded},res.locals.la) );
});
                        

app.get('/mmanstaff', require('connect-ensure-login').ensureLoggedIn('/mlogin'),
(req, res) => {
  console.log(cmfunc.getTimeStamp() + 'goto mmanstaff..');
  res.render('mmanstaff', res.locals.la );
});
app.get('/mdistributor', require('connect-ensure-login').ensureLoggedIn('/mlogin'),
(req, res) => {
  console.log(cmfunc.getTimeStamp() + 'goto mdistributor..');
  res.render('mdistributor', res.locals.la );
});
app.get('/mdiststaff', require('connect-ensure-login').ensureLoggedIn('/mlogin'),
(req, res) => {
  console.log(cmfunc.getTimeStamp() + 'goto mdiststaff..');
  res.render('mdiststaff', res.locals.la );
});
app.get('/magent', require('connect-ensure-login').ensureLoggedIn('/mlogin'),
(req, res) => {
  console.log(cmfunc.getTimeStamp() + 'goto magent..');
  res.render('magent', res.locals.la );
});
app.get('/magestaff', require('connect-ensure-login').ensureLoggedIn('/mlogin'),
(req, res) => {
  console.log(cmfunc.getTimeStamp() + 'goto magestaff..');
  res.render('magestaff', res.locals.la );
});
app.get('/mcustomer', require('connect-ensure-login').ensureLoggedIn('/mlogin'),
(req, res) => {
  console.log(cmfunc.getTimeStamp() + 'goto mcustomer..');
  res.render('mcustomer', res.locals.la );
});
app.get('/mservicelog', require('connect-ensure-login').ensureLoggedIn('/mlogin'),
(req, res) => {
  console.log(cmfunc.getTimeStamp() + 'goto mservicelog..');
  res.render('mservicelog', res.locals.la );
});
app.get('/mbikesale', require('connect-ensure-login').ensureLoggedIn('/mlogin'),
(req, res) => {
  console.log(cmfunc.getTimeStamp() + 'goto mbikesale..');
  res.render('mbikesale', res.locals.la );
});

app.get('/mreferral', require('connect-ensure-login').ensureLoggedIn('/mlogin'),
(req, res) => {
  console.log(cmfunc.getTimeStamp() + 'goto mreferral..');
  tbls['groupx'].findOne({groupID: req.session.groupID}, function(err, data){
    if (err) throw err;
    res.render('mreferral', merge({
      weburl: data.weburl
    }, res.locals.la ) );
  })
});

app.get('/mwithdraw', require('connect-ensure-login').ensureLoggedIn('/mlogin'),
(req, res) => {
  console.log(cmfunc.getTimeStamp() + 'goto mwithdraw..');
  getWalletBalance(req).then((datx) => {
    tbls['memberx'].findOne({memberID: req.session.memberID}, function(err, data){
      if (err) throw err;
      res.render('mwithdraw', merge({
        namex: data.name,
        addressx: data.address,
        momoAccountx: data.momoAccount,
        emailx: data.email,
        phonex: data.phone,
        provincesIDx: data.provincesID,
        wardsIDx: data.wardsID,
        walletbalancex:datx
      }, res.locals.la) );
    })
  })
  
});

app.get('/mscanner', require('connect-ensure-login').ensureLoggedIn('/mlogin'), (req, res) => {
  console.log(cmfunc.getTimeStamp() + 'goto mscanner..');
  tbls['groupx'].findOne({groupID: req.session.groupID}, function(err, data){
    if (err) throw err;
    if (req.session.puuid && req.session.puuid.length > 0) {
      let puuidx = req.session.puuid;
      req.session.puuid = '';
      res.render('mscanner', merge({
        puuid: puuidx,
        weburl: data.weburl
      }, res.locals.la ) );
    } else {
      res.render('mscanner', merge({
        puuid: '',
        weburl: data.weburl
      }, res.locals.la ) );
    }
    
  })
});

app.get('/midscanner', require('connect-ensure-login').ensureLoggedIn('/mlogin'), (req, res) => {
  console.log(cmfunc.getTimeStamp() + 'goto midscanner..');
  tbls['groupx'].findOne({groupID: req.session.groupID}, function(err, data){
    if (err) throw err;
    res.render('midscanner', merge({
      weburl: data.weburl
    }, res.locals.la ) );
  })
});

app.get('/mtimekeeping', require('connect-ensure-login').ensureLoggedIn('/mlogin'), (req, res) => {
  console.log(cmfunc.getTimeStamp() + 'goto mtimekeeping..');
  tbls['groupx'].findOne({groupID: req.session.groupID}, function(err, data){
    if (err) throw err;
    res.render('mtimekeeping', merge({
      weburl: data.weburl
    }, res.locals.la ) );
  })
});


app.get('/mpackaging', require('connect-ensure-login').ensureLoggedIn('/mlogin'), (req, res) => {
  console.log(cmfunc.getTimeStamp() + 'goto mpackaging...');
  res.render('mpackaging', res.locals.la );
});

app.get('/mboxing', require('connect-ensure-login').ensureLoggedIn('/mlogin'), (req, res) => {
  console.log(cmfunc.getTimeStamp() + 'goto mboxing...');
  res.render('mboxing', res.locals.la );
});

app.get('/mpalleting', require('connect-ensure-login').ensureLoggedIn('/mlogin'), (req, res) => {
  console.log(cmfunc.getTimeStamp() + 'goto mpalleting...');
  res.render('mpalleting', res.locals.la );
});

app.get('/merror', (req, res) => {
  console.log(cmfunc.getTimeStamp() + 'goto merror..');
  res.render('merror', res.locals.la );
});

app.get('/mboxpacking*', require('connect-ensure-login').ensureLoggedIn('/mlogin'),
(req, res) => {
  console.log(cmfunc.getTimeStamp() + 'goto mboxpacking: ' + req.originalUrl);
  var productID = req.originalUrl.split("?")[1];
  if (productID) res.render('mboxpacking', merge({pidx:productID},res.locals.la) );
});

app.get('/mpalletpacking*', require('connect-ensure-login').ensureLoggedIn('/mlogin'),
(req, res) => {
  console.log(cmfunc.getTimeStamp() + 'goto mpalletpacking: ' + req.originalUrl);
  var productID = req.originalUrl.split("?")[1];
  if (productID) res.render('mpalletpacking', merge({pidx:productID},res.locals.la) );
});

app.get('/mboxchk', require('connect-ensure-login').ensureLoggedIn('/mlogin'), (req, res) => {
  console.log(cmfunc.getTimeStamp() + 'goto mboxchk...');
  res.render('mboxchk', res.locals.la );
});
app.get('/mpalletchk', require('connect-ensure-login').ensureLoggedIn('/mlogin'), (req, res) => {
  console.log(cmfunc.getTimeStamp() + 'goto mpalletchk...');
  res.render('mpalletchk', res.locals.la );
});
app.get('/mstockchk', require('connect-ensure-login').ensureLoggedIn('/mlogin'), (req, res) => {
  console.log(cmfunc.getTimeStamp() + 'goto mstockchk...');
  res.render('mstockchk', res.locals.la );
});
app.get('/mstockcount', require('connect-ensure-login').ensureLoggedIn('/mlogin'), (req, res) => {
  console.log(cmfunc.getTimeStamp() + 'goto mstockcount...');
  res.render('mstockcount', res.locals.la );
});
app.get('/mstockdispatch', require('connect-ensure-login').ensureLoggedIn('/mlogin'), (req, res) => {
  console.log(cmfunc.getTimeStamp() + 'goto mstockdispatch...');
  res.render('mstockdispatch', res.locals.la );
});
app.get('/mdiarylist*', require('connect-ensure-login').ensureLoggedIn('/mlogin'), (req, res) => {
  console.log(cmfunc.getTimeStamp() + 'goto  ' + req.originalUrl);
  var cid = req.originalUrl.split("?")[1];
  res.render('mdiary', merge({
    'cid': cid, 
  },res.locals.la) );
});
app.get('/mdiaryedit*', require('connect-ensure-login').ensureLoggedIn('/login'),
  (req, res) => {
    console.log(cmfunc.getTimeStamp() + 'goto ' + req.originalUrl);
    var did = req.originalUrl.split("?")[1];
    var cid = req.originalUrl.split("?")[2];
    res.render('mdiaryedit', merge({
        'cid': cid, 
        'diaryID': did, 
    },res.locals.la) );
      
    
});
app.get('/mshoppingcart*', require('connect-ensure-login').ensureLoggedIn('/login'),
  (req, res) => {
    console.log(cmfunc.getTimeStamp() + 'goto ' + req.originalUrl);
    var shid = req.originalUrl.split("?")[1];
    var sqlTxt =  `SELECT a.* `;
    sqlTxt +=  ` FROM orderx a WHERE (a.orderxID = ${shid}) `;
    console.log("sqlTxt: " + sqlTxt);
    tbls['orderx'].execSQL(sqlTxt, function(error, data) {
      if (error) {
        res.render('mshopcart', merge({
          'orderxID':0,
          'orderNumber': "--- X ---"
        },res.locals.la) );
      } else {
        res.render('mshopcart', merge({
          'orderxID': data[0].orderxID, 
          'orderNumber': data[0].orderNumber
        },res.locals.la) );
      }
    })
});
app.get('/mstockout*', require('connect-ensure-login').ensureLoggedIn('/login'),
  (req, res) => {
    console.log(cmfunc.getTimeStamp() + 'goto mstockout?' + req.originalUrl);
    var shid = req.originalUrl.split("?")[1];
    var sqlTxt =  `SELECT a.orderxID, a.orderxitemID, a.qty, a.productID, b.productName `;
    sqlTxt +=  ` FROM orderxitem a, product b WHERE (a.orderxitemID = ${shid}) AND (a.productID = b.productID) `;
    console.log("sqlTxt: " + sqlTxt);
    tbls['orderx'].execSQL(sqlTxt, function(error, data) {
      if (error) {
        res.render('mstockout', merge({
          'qtyx':0,
          'pidx':0,
          'orderxitemidx': 0,
          'prodnamex': "--- X ---"
        },res.locals.la) );
      } else {
        res.render('mstockout', merge({
          'qtyx': data[0].qty, 
          'pidx': data[0].productID, 
          'orderxitemidx': data[0].orderxitemID, 
          'prodnamex': data[0].productName
        },res.locals.la) );
      }
    })
});

app.get('/mstockreceive', require('connect-ensure-login').ensureLoggedIn('/mlogin'), (req, res) => {
  console.log(cmfunc.getTimeStamp() + 'goto mstockreceive...');
  tbls['groupx'].findOne({groupID: req.session.groupID}, function(err, data){
    if (err) throw err;
    if (req.session.buuidx && req.session.buuidx.length > 0) {
      let buuidx = req.session.buuidx;
      req.session.buuidx = ''; //Clear box QRCODE
      res.render('mstockreceive', merge({
        buuid: buuidx,
        weburl: data.weburl
      }, res.locals.la ) );
    } else {
      res.render('mstockreceive', merge({
        buuid: '',
        weburl: data.weburl
      }, res.locals.la ) );
    }
  })
});

//********* Mobile shopping cart  *****************************************/
app.get('/mprescription*', require('connect-ensure-login').ensureLoggedIn('/mlogin'),
(req, res) => {
  var illid = req.originalUrl.split("?")[1];
  console.log(cmfunc.getTimeStamp() + `goto mprescription?${illid}`);
  tbls['illness'].findOne({illnessID:illid}, function(err, data){
    if (err) {
      console.log("NOT FOUND .. " + illid)
      console.log(req.originalUrl)
    } else {
      res.render('mprescription',  merge({illid: illid, illname: data[`illness_${req.session.lang}`]}, res.locals.la ) );
    }
  })
});

app.get('/mprodcat*', require('connect-ensure-login').ensureLoggedIn('/mlogin'),
(req, res) => {
  var catid = req.originalUrl.split("?")[1].split("&")[0];
  var subcatid = req.originalUrl.split("?")[1].split("&")[1];
  if (subcatid === undefined) {
    subcatid = -1;
  }
  console.log(cmfunc.getTimeStamp() + `goto mprodcat?${catid}&${subcatid}`);
  
  res.render('mprodcat',  merge({catid: catid, subcatid: subcatid}, res.locals.la ) );
});

app.get('/mproddetail*', require('connect-ensure-login').ensureLoggedIn('/mlogin'),
(req, res) => {
  var prodid = req.originalUrl.split("?")[1];
  if (prodid === undefined) {
    prodid = -1;
  }
  console.log(cmfunc.getTimeStamp() + `goto mproddetail?${prodid}`);
  
  res.render('mproddetail',  merge({prodid: prodid}, res.locals.la ) );
});

app.get('/mshopcartlist', require('connect-ensure-login').ensureLoggedIn('/mlogin'), (req, res) => {
  console.log(cmfunc.getTimeStamp() + 'goto mshopcartlist...');
  res.render('mshopcartlist', res.locals.la) ;
});

app.get('/mcheckout', require('connect-ensure-login').ensureLoggedIn('/mlogin'), (req, res) => {
  console.log(cmfunc.getTimeStamp() + 'goto mcheckout...');
  res.render('mcheckout', res.locals.la) ;
});

app.get('/mcheckout2', require('connect-ensure-login').ensureLoggedIn('/mlogin'), (req, res) => {
  console.log(cmfunc.getTimeStamp() + 'goto mcheckout2...');
  res.render('mcheckout2', res.locals.la) ;
});

app.get('/mpaymentconfirm', require('connect-ensure-login').ensureLoggedIn('/mlogin'), (req, res) => {
  console.log(cmfunc.getTimeStamp() + 'goto mpaymentconfirm...');
  res.render('mpaymentconfirm', res.locals.la );
});

app.get('/mcontact', require('connect-ensure-login').ensureLoggedIn('/mlogin'), (req, res) => {
  console.log(cmfunc.getTimeStamp() + 'goto mcontact...');
  res.render('mcontact', res.locals.la );
});

app.get('/mordersman', require('connect-ensure-login').ensureLoggedIn('/mlogin'), (req, res) => {
  console.log(cmfunc.getTimeStamp() + 'goto mordersman...');
  var sqlTxt =  `SELECT b.phone, b.name, `;
  sqlTxt +=  ` c.name AS 'sxname', c.address AS 'sxaddress', c.abn, c.license, c.phone AS 'hotline', c.email AS 'sxemail', c.subdir, c.imgLink AS 'logox' `;
  sqlTxt +=  ` FROM memberx b, groupx c `;
  sqlTxt +=  `WHERE (${req.session.memberID} = b.memberID) AND (b.groupID = c.groupID) `; 
  console.log("sqlTxt: " + sqlTxt);
  tbls['memberx'].execSQL(sqlTxt, function(error, data) {
    if (error) {
      res.render('mordersman', merge({
        'staffName': "--- X ---",
        'phonex': "--- X ---",
        'sxname': "--- X ---",
        'sxaddress': "--- X ---",
        'hotline': "--- X ---",
        'sxemail': "--- X ---",
        'subdir': "--- X ---",
        'logox': "--- X ---",
        'abn': "--- X ---",
        'license': "--- X ---"
        
      },res.locals.la) );
    } else {
      console.log(JSON.stringify(data));
      res.render('mordersman', merge({
        'staffName': data[0].name,
        'phonex': data[0].phone,
        'sxname':data[0].sxname,
        'sxaddress':data[0].sxaddress,
        'hotline':data[0].hotline,
        'sxemail':data[0].sxemail,
        'subdir':data[0].subdir,
        'logox':data[0].logox,
        'abn': data[0].abn,
        'license': data[0].license,
      },res.locals.la) );
    }
  })
});


// ********  Mobile app authentication authentication *********************/

app.get('/mchangepasswd', require('connect-ensure-login').ensureLoggedIn('/mlogin'),
(req, res) => {
   console.log(cmfunc.getTimeStamp() + 'goto mchangepasswd..');
  tbls['memberx'].findOne({memberID: req.session.memberID}, function(err, data){
    if (err) throw err;
    res.render('mchangepasswd',res.locals.la );
  })
  
});

app.post('/forgotpwd', function (req, res) {
  console.log(cmfunc.getTimeStamp() + "/forgotpwd.." + JSON.stringify(req.body, false, 4));
  findPhone(req.body.phonenumber, req, res);
})

app.get('/motpconfirm', function (req, res) {
  console.log(cmfunc.getTimeStamp() + "/motpconfirm..");
  res.render('motpconfirm', merge({
    'tname':req.session.tname, 
    'tlogo':req.session.tlogo
  },res.locals.la ));
})
app.get('/mpassword*', function (req, res) {
  console.log(cmfunc.getTimeStamp() + "/mpassword..");
  var phonenumber = req.originalUrl.split("?")[1];
  res.render('mpassword', merge({
    'phonenumber': phonenumber,
    'tname':req.session.tname, 
    'tlogo':req.session.tlogo
  },res.locals.la ));
})
app.get('/mresetpasswd*', function (req, res) {
  console.log(cmfunc.getTimeStamp() + "/mresetpasswd..");
  var otp = req.originalUrl.split("?")[1];
  res.render('mresetpasswd', merge({
    'otpx': otp,
    'tname':req.session.tname, 
    'tlogo':req.session.tlogo
  },res.locals.la ));
})
app.post('/checkotp', function (req, res) {
  console.log(cmfunc.getTimeStamp() + "/checkotp.." + JSON.stringify(req.body, false, 4));
  let otpnumber = `${req.body.digit2}${req.body.digit3}${req.body.digit4}${req.body.digit5}${req.body.digit6}`;
  console.log(otpnumber);
  checkOTP(otpnumber, req, res);
})

app.post('/checkphone', (req, res) => {
  function chkPhonex (phonenumber, mid, gip, rolex, req, res) {
    login.checkPhone(phonenumber, mid, gip, rolex, function(error, result) {
      if(error) {
        let sql0 = `SELECT a.* FROM esms a WHERE (a.phone = "${req.body.phonenumber}") `;
        sql0 += ` AND (a.dateAdded > DATE_SUB(NOW(), INTERVAL 5 MINUTE)) `;
        tbls["esms"].execSQL(sql0, function(errx, data){
          if (errx) throw errx;
          if (data.length > 0) {
            res.send(JSON.stringify({
              status: 0,
              message: `Go to motpassword...`,
            })
          );
          } else {
            var data = {
              "username": ApiUserName,
              "channel": 'sms_cskh',
              "endpoint": esmscallback,
              "header": {
                "token": 123
              }
            }
            try {
              registerEndPoint(data, TokenKey).then((resultx) => {
                console.log("status: " + JSON.stringify(resultx,false,4));
                if (resultx.error == 0) {
                  data.phone = req.body.phonenumber;
                  data.u = ApiUserName;
                  data.pwd = TokenKey;
                  //data.sms =  `Mã OTP:${result.otp} để đăng nhập AntiFake, chỉ hiệu lực một lần.`;
                  data.sms =  `Your OTP code is ${result.otp}`;
                  data.bid = 2;
                  data.type = 8;
                  data.json = 1;
                  data.from = 'Vlocal';
                  sendSMS(data).then((smsResult) => {
                    console.log("smsResult: " + JSON.stringify(smsResult,false,4));
                    let smsTextx = '';
                    if (smsResult.error == 1) {
                      smsTextx = smsResult.log;
                    } else {
                      smsTextx = `Mã OTP:${result.otp} để đăng nhập AntiFake, chỉ hiệu lực một lần.`;
                    }
                    tbls['esms'].insert({
                      phone: req.body.phonenumber,
                      smsText: smsTextx,
                      smsID: smsResult.msgid,
                      telcoid: smsResult.carrier,
                      status: smsResult.error,
                      errorcode: smsResult.error_code?smsResult.error_code: 0
                    }, function (err, data){
                      if (err) throw err;
                      if (smsResult.error == 1) {
                        res.send(JSON.stringify({
                            status: 1,  //Sent SMS with OTP
                            pidx: req.body.pidx
                          })
                        );
                      } else {
                        res.send(JSON.stringify({
                            status: 0,  //Sent SMS with OTP
                            message: `Go to motpassword...`,
                          })
                        );
                      }
                      
                    })
                  })
                } else {
                  console.log('result: ' + JSON.stringify(result, false, 4))
                }
              })
            } catch (error) {
              tbls["issue"].insert({issuetypeID: 1, description:"SMS Gateway có vấn đề."},  function(errorx, resultx) {
                if(errorx) throw errorx;
                res.send(JSON.stringify({
                    status: -1,  //Sent SMS with OTP
                    message: 'Xin lỗi quí khách, hệ thống đang gặp sự cố, xin trở lại sau..'
                  })
                );
              })
            }
            
          }
        })
      } else {
        console.log("Số điện thoại đã được đăng ký.." + req.body.phonenumber);
        res.send(JSON.stringify({
            status: 1, // Số điện thoại đã được đăng ký
            pidx: req.body.pidx
          })
        );
      }
    });
  }
  console.log(cmfunc.getTimeStamp() + "/checkphone..");
  var mid = 0; 
  console.log(req.body);
  console.log("idx: " + req.body.idx);
  console.log("buuidx: " + req.session.buuidx);
  var domainy = req.body.urlx.split('/');
  var domainx = domainy[0] + '//' + domainy[2];
  console.log("domainx: " + domainx);

  var sql0 = `SELECT b.groupID, b.memberID, b.roleID, b.typeID FROM groupx a, memberx b WHERE (a.weburl = '${domainx}') AND (a.groupID=b.groupID)`;
  tbls['groupx'].execSQL(sql0, function(errx, datx){
    if (errx) throw errx;
    console.log("sql0: " + sql0);
    //console.log(datx)
    if (datx.length > 0) {
      if (req.body.idx && (req.body.idx.length > 0)) {
        mid = parseInt(decrypt(req.body.idx).replace(/[^0-9]/g,"")); //Login with a referral member..
        chkPhonex(req.body.phonenumber, mid, datx[0].groupID, 3, req, res )
      } else {
        if (req.session.buuidx && (req.session.buuidx.length > 0)) { //Login by a Daily DL 
          var daily =  datx.filter(m=>(m.roleID==5) && (m.typeID==2));
          if (daily.length > 0) mid = daily[0].memberID;
          chkPhonex(req.body.phonenumber, mid, datx[0].groupID, 6, req, res );
        } else { //Login by a normal customer 
          mid = 0;
          chkPhonex(req.body.phonenumber, mid, datx[0].groupID, 3, req, res );
        }
      }
    } else {
      console.log("No matching domain")
      res.send(JSON.stringify({
          status: -1,
          message: `Tên miền không có giá trị..`,
        })
      )
    }
  })
  
});


app.get('/smscallback*', function (req, res) {
  console.log(cmfunc.getTimeStamp() + "/smscallback..: " + req.originalUrl);
  const paramsArray = getParameters(req.originalUrl);
  const smsIDx = paramsArray.filter(f=>f.name==='msgid').length?paramsArray.filter(f=>f.name==='msgid')[0].value:0;
  const statusx = paramsArray.filter(f=>f.name==='status').length?paramsArray.filter(f=>f.name==='status')[0].value:0;
  const stamptx = paramsArray.filter(f=>f.name==='stampt').length?paramsArray.filter(f=>f.name==='stampt')[0].value:0;
  tbls['esms'].findOne({smsID:smsIDx}, function(err, data){
    if (err) {
      console.log("NOT FOUND .. " + smsIDx)
      console.log(req.originalUrl)
    } else {
      data.SendStus = statusx;
      data.sendDateTime = moment.unix(stamptx).format("YYYY-MM-DD HH:mm:ss");
      tbls['esms'].save(data, function(errx, datx){
        console.log("Successfully save eSMS.." + smsIDx)
      })
    }
  })
})

app.get('/topupcallback*', function (req, res) {
  console.log(cmfunc.getTimeStamp() + "/topupcallback..: " + req.originalUrl);
  const paramsArray = getParameters(req.originalUrl);
  const smsIDx = paramsArray.filter(f=>f.name==='msgid').length?paramsArray.filter(f=>f.name==='msgid')[0].value:0;
  const statusx = paramsArray.filter(f=>f.name==='status').length?paramsArray.filter(f=>f.name==='status')[0].value:0;
  const stamptx = paramsArray.filter(f=>f.name==='stampt').length?paramsArray.filter(f=>f.name==='stampt')[0].value:0;
  tbls['etopup'].findOne({smsID:smsIDx}, function(err, data){
    if (err) {
      console.log("NOT FOUND .. " + smsIDx)
      console.log(req.originalUrl)
    } else {
      data.SendStus = statusx;
      data.sendDateTime = moment.unix(stamptx).format("YYYY-MM-DD HH:mm:ss");
      tbls['esms'].save(data, function(errx, datx){
        console.log("Successfully save eSMS.." + smsIDx)
      })
    }
  })
})

app.post('/resetpasswd', (req, res) => {
  console.log(cmfunc.getTimeStamp() + "/resetpasswd..");
  login.checkOTPChangePasswd(req.body.otpx, req.body.pass1, function(error, result) {
    if (error) {
      res.send(JSON.stringify({
        status: 0,
        message: 'Mật mã không đặt lại đươc ..!',
      })
    );
    } else {
      res.send(JSON.stringify({
          status: 1,
          message: {user: result.phone, pass: result.pass},
        })
      );
    }
      
  })
});

app.post('/insertprofile', require('connect-ensure-login').ensureLoggedIn('/mlogin'),
(req, res) => {
  console.log(cmfunc.getTimeStamp() + "/insertprofile..");
  var data = req.body;
  console.log(data);
  var parentMember;
  if (data.roleID==4) {  //Case it is distributor
    parentMember = req.session.memberID;
    putprofile(data)
  } else { //else find Virtual Distributor Staff
    tbls['memberx'].find({roleID:5, typeID:2, divisionID:1}, function(error, datx){
      if (error) {
        res.send(JSON.stringify({
            status: 0,
            message: err
          })
        )
      } else {
        parentMember = datx[0].memberID;
        putprofile(data)
      }
    })
  }
 function putprofile(data) {
    tbls['memberx'].insert({
      name:data.name,
      address:data.address,
      roleID: data.roleID,
      phone:data.phone,
      pass:'z0qkEuBXyRc8ba7d4070b4d8677210562c271978b2', //pass = 'Pass1234'
      email:data.email,
      company:data.company,
      provincesID:data.provincesID,
      wardsID:data.wardsID,
      phuongID:data.phuongID,
      groupID: req.session.groupID,
      parentID: parentMember,
      lastChanged: moment().format("YYYY-MM-DD HH:mm:ss"),
      lastPerson: req.session.memberID,
    }, function(err, data) {
      if (err) {
        res.send(JSON.stringify({
            status: 0,
            message: err
          })
        )
      } else {
        res.send(JSON.stringify({
            status: 1,
            message: 'Cập nhật thành công!!'
          })
        )
      }
    })
 }

});
app.post('/saveprofile', require('connect-ensure-login').ensureLoggedIn('/mlogin'),
(req, res) => {
  console.log(cmfunc.getTimeStamp() + "/saveprofile..");
  var data = req.body;
  console.log(data)
  tbls['memberx'].save({
    name:data.name,
    address:data.address,
    email:data.email,
    company:data.company,
    imgLink:data.imgLink,
    cccdfront:data.cccdfront,
    cccdback:data.cccdback,
    momoAccount:data.momoAccount,
    provincesID:data.provincesID,
    wardsID:data.wardsID,
    phuongID:data.phuongID,
    lastChanged: moment().format("YYYY-MM-DD HH:mm:ss"),
    lastPerson: req.session.memberID,
    memberID: req.session.memberID
  }, function(err, data) {
    if (err) {
      res.send(JSON.stringify({
          status: 0,
          message: err
        })
      )
    } else {
      req.session.name = data.name;
      req.session.company = data.company;
      req.session.imgLink = data.imgLink;
      res.send(JSON.stringify({
          status: 1,
          message: 'Cập nhật thành công!!'
        })
      )
    }
  })

});

app.post('/savewithdraw', require('connect-ensure-login').ensureLoggedIn('/mlogin'),
(req, res) => {
  console.log(cmfunc.getTimeStamp() + "/savewithdraw..");
  var data = req.body;
  console.log(data);
  console.log(req.session);
  tbls['wallet'].insert({
    groupID: req.session.groupID,
    memberID: req.session.memberID,
    saleID: 0,
    debit:data.amount,
    paytype: data.paytype,
    status: data.paytype==1?2:1,
    lastPerson: req.session.memberID
  }, function(err, datb) {
    if (err) {
      res.send(JSON.stringify({
          status: 0,
          message: err
        })
      )
    } else {
      if (data.paytype==1) {
        var datax = {
          "username": ApiUserName,
          "channel": 'sms_cskh',
          "endpoint": etopupcallback,
          "header": {
            "token": 123
          }
        }
        registerEndPoint(datax, TokenKey).then((result) => {
          console.log("status: " + JSON.stringify(result,false,4));
          if (result.error == 0) {
            datax.phone = req.session.phone;
            datax.u = ApiUserName;
            datax.pwd = TokenKey;
            datax.json = 1;
            datax.tid = datb.walletID;
            datax.amount = data.amount;
            topUp(datax).then((smsResult) => {
              console.log("smsResults: " + JSON.stringify(smsResult, false, 4));
              tbls['etopup'].insert({
                topupphone: req.session.phone,
                amount: data.amount,
                walletID: datb.walletID,
                status: smsResult.error,
                errorcode: smsResult.error_code?smsResult.error_code: 0
              }, function (err, data){
                if (err) throw err;
                if (smsResult.error == 1) {
                  res.send(JSON.stringify({
                      status: 0,
                      message: req.session.phone
                    })
                  );
                } else {
                  res.send(JSON.stringify({
                      status: 1,
                      message: 'Cập nhật thành công!!'
                    })
                  );
                }
              })
            })
          }
        })
      }  
    }
  })

});
app.post('/saverating', require('connect-ensure-login').ensureLoggedIn('/mlogin'),
(req, res) => {
  console.log(cmfunc.getTimeStamp() + "/saverating..");
  var data = req.body;
  console.log(data)
  tbls['sale'].save({
    saleID: parseInt(data.saleID),
    star: data.star,
    lastChanged: moment().format("YYYY-MM-DD HH:mm:ss"),
    lastPerson: req.session.memberID
  }, function(err, data) {
    if (err) {
      res.send(JSON.stringify({
          status: 0,
          message: err
        })
      )
    } else {
      res.send(JSON.stringify({
          status: 1,
          message: 'Cập nhật thành công!!'
        })
      )
    }
  })

});
app.post('/savebonus', require('connect-ensure-login').ensureLoggedIn('/mlogin'),
(req, res) => {
  console.log(cmfunc.getTimeStamp() + "/savebonus..");
  console.log(JSON.stringify(req.session, false, 4))
  var data = req.body;
  var prodlist = JSON.parse(data.data)
  var agentStaffID = data.staffID;
  var customerID = req.session.memberID;
  var agentID = 0;
  var diststaffID = 0;
  var saleID = 0;
  var customerBonus = 0;
  var agentstaffBonus = 0;
  var agentBonus = 0;
  var diststaffBonus =0 ;
  var dateAdded = moment().format("YYYY-MM-DD HH:mm:ss");
  var firstpurchase = false;

  var fn2 = function updateProditem(sale) {
    return new Promise(function(resolve, reject) {
        tbls['proditem'].save(sale, function(error, data) {
            if (error) {  
              reject(error);
            } else {
              resolve(sale)
            }
        })
    })
  }

  var fn1 = function getProductBonus(prod){
    return new Promise(function(resolve, reject) {
      var sql0 = `SELECT a.*, c.promotionID, d.customerBonus, d.agentstaffBonus, d.agentBonus, d.diststaffBonus FROM proditem a, prodman b, product c, promotion d `; 
      sql0 += ` WHERE (a.proditemID=${prod.proditemID}) AND (a.prodmanID = b.prodmanID)  `; 
      sql0 += ` AND (a.status = 1) AND (b.productID = c.productID) AND (c.promotionID = d.promotionID) `;
        console.log("sql0: " + sql0)
        tbls['proditem'].execSQL(sql0, function(error, data) {
            if (error) {  
                console.log("ERROR: " + error);
                reject(error);
            } else {
              if (data.length > 0) {
                proditem = {};
                proditem.proditemID = prod.proditemID;
                proditem.saleID = saleID;
                proditem.promotionID = data[0].promotionID;
                proditem.status = 2;
                proditem.lastChanged= dateAdded;
                proditem.lastPerson= req.session.memberID;
                customerBonus += data[0].customerBonus;
                agentstaffBonus += data[0].agentstaffBonus;
                agentBonus += data[0].agentBonus;
                diststaffBonus += data[0].diststaffBonus;
                resolve(proditem);
              } else {
                reject(error);
              }
            }
        })
    })
  }
  
  tbls['sale'].findOne({customerID: req.session.memberID}, function (erro, dato){ 
    if (erro) {
      firstpurchase = true;
    } else {
      firstpurchase = false;
    }
    tbls['sale'].insert({
      customerID: req.session.memberID,
      agentStaffID: data.staffID,
      status:1,
      lastPerson: req.session.memberID
    }, function (errx, datx){
        if (errx) {
          res.send(JSON.stringify({
              status: 0,
              message: 'Cập nhật thất bại!!'
            })
          )
        } else {
          saleID = datx.saleID;
          var sql0 = `SELECT a.*, b.memberID as 'agentID', c.memberID AS 'diststaffID' FROM memberx a, memberx b, memberx c`;
          sql0 += ` WHERE (a.memberID=${datx.agentStaffID}) AND (a.parentID = b.memberID) AND (b.parentID=c.memberID)`;
          console.log("sql0: " + sql0)
          tbls['memberx'].execSQL(sql0, function(erry, daty) {
            if (erry) {
              res.send(JSON.stringify({
                  status: 0,
                  message: 'Cập nhật thất bại!!'
                })
              )
            } else {
              if (daty.length > 0) {
                agentID = daty[0].agentID;
                diststaffID = daty[0].diststaffID;
                var actions = prodlist.map(fn1);
                Promise.all(actions).then( function (da1) {
                  var action2 = da1.map(fn2);
                  Promise.all(action2).then( function (da2) {
                    var sql1 = `INSERT INTO wallet (groupID, memberID, saleID, credit, dateAdded) `;
                    sql1 += ` VALUES (${req.session.groupID}, ${customerID}, ${saleID}, ${customerBonus}, '${dateAdded}'), `;
                    sql1 += ` (${req.session.groupID}, ${agentStaffID},  ${saleID}, ${agentstaffBonus}, '${dateAdded}'), `
                    sql1 += ` (${req.session.groupID}, ${agentID},  ${saleID}, ${agentBonus}, '${dateAdded}'), `
                    if ((firstpurchase) && (req.session.parentID>0)) {
                      sql1 += ` (${req.session.groupID}, ${req.session.parentID},  ${saleID}, ${customerBonus}, '${dateAdded}'), `
                    }
                    sql1 += ` (${req.session.groupID}, ${diststaffID},  ${saleID}, ${diststaffBonus}, '${dateAdded}') ;`
                   
                    console.log("sql1: " + sql1);
                    tbls['wallet'].execSQL(sql1, function(error, data) {
                        if (error) {  
                          res.send(JSON.stringify({
                              status: 0,
                              message: 'Cập nhật thất bại!!'
                            })
                          )
                        } else {
                          res.send(JSON.stringify({
                              status: 1,
                              message: 'Cập nhật thành công!!'
                            })
                          )
                        }
                    })
                  })
                })
              } else {
                res.send(JSON.stringify({
                    status: 0,
                    message: 'Cập nhật thất bại!!'
                  })
                )
              }
            }
          })
        }
    })
  })
  

});
app.post('/manualchangepwd', require('connect-ensure-login').ensureLoggedIn('/mlogin'),
(req, res) => {
  console.log(cmfunc.getTimeStamp() + "/manualchangepwd..");
  login.checkMemberChangePasswd(req.session.memberID, req.body.pass1, function(error, result) {
    if (error) {
      res.send(JSON.stringify({
        status: 0,
        message: 'Mật mã không đặt lại đươc ..!',
      })
    );
    } else {
      res.send(JSON.stringify({
          status: 1,
          message: {user: result.phone, pass: result.pass},
        })
      );
    }
      
  })
});

app.post('/sendinvite', require('connect-ensure-login').ensureLoggedIn('/mlogin'),
(req, res) => {
  console.log(cmfunc.getTimeStamp() + "/sendinvite..");
  var data = req.body;
  tbls["memberx"].find({phone:data.phone}, function(error, result) {
    if (error) throw error;
    if (result.length == 0) {// Found no active record
      tbls["memberx"].insert({
        groupID: req.session.groupID,
        parentID: req.session.memberID,
        phone: data.phone,
        name: data.name,
        roleID: data.roleID,
        company: ((data.roleID==1) || (data.roleID==4) || (data.roleID==5) || (data.roleID==6) )?req.session.company:''
      }, function (errx, datx) {
        if (errx) throw errx;
        res.send(JSON.stringify({
            status: 1,
            message: "200",
          })
        );
      })
    } else { //Found an active record
      if (result[0].status == 1) {
        res.send(JSON.stringify({
            status: 0,
            message: "203",
          })
        );
      } else if (result[0].status == 0) {
        res.send(JSON.stringify({
            status: 0,
            message: "202",
          })
        );
      } else { //account already terminated..
        tbls["memberx"].insert({
          groupID: req.session.groupID,
          parentID: req.session.memberID,
          phone: data.phone,
          name: data.name,
          roleID: data.roleID,
          company: ((data.roleID==1) || (data.roleID==4) || (data.roleID==5) || (data.roleID==6) )?req.session.company:''
        }, function (errx, datx) {
          if (errx) throw errx;
          res.send(JSON.stringify({
              status: 1,
              message: "200",
            })
          );
        })
      }
    }
  })
  
});

app.post('/boxing', require('connect-ensure-login').ensureLoggedIn('/mlogin'),
(req, res) => {
  console.log(cmfunc.getTimeStamp() + `goto boxing`);
  tbls['product'].findOne({productID: req.body.productID}, function(err, data){
    if (err) throw err;
    if (data && data.length > 0) {
      res.send(JSON.stringify({
          status: 1,
          qtyperBox: data[0].qtyperBox,
          boxperPallet: data[0].boxperPallet,
        })
      );
    } else {
      res.send(JSON.stringify({
          status: 0,
          data: null,
        })
      );
    }
    
  })
});

app.post('/saveboxing', require('connect-ensure-login').ensureLoggedIn('/mlogin'),
(req, res) => {
  console.log(cmfunc.getTimeStamp() + "/saveboxing..");
  var data = req.body;
  console.log(JSON.stringify(data,false,4));
  var prodlist = JSON.parse(data.data)
  var boxID = data.boxID;
  var productID = data.productID;
  var promotionID = data.promotionID;
  var lastPerson = req.session.memberID;
  var lastChanged = moment().format("YYYY-MM-DD HH:mm:ss");

  var sql0 = ``;
  prodlist.forEach(m => {
    sql0 += `UPDATE proditem SET boxID = ${boxID}, promotionID=${promotionID},  status = 1, lastChanged="${lastChanged}", lastPerson = ${lastPerson} WHERE (proditemID = ${m.proditemID});`;
  })
  console.log("sql0: " + sql0);
  tbls["proditem"].execSQL(sql0, function (errx, datx) {
    if (errx) {
      res.send(JSON.stringify({
          status: 0,
          message: "Hệ thống bị lỗi",
        })
      )
    } else {
      tbls["box"].save({
        boxID: boxID,
        itemQty: prodlist.length, 
        status: 1,
        productID: productID,
        lastChanged: lastChanged,
        lastPerson: lastPerson 
      }, function (erry, daty) {
        if (erry) {
          res.send(JSON.stringify({
              status: 0,
              message: "Hệ thống bị lỗi"
            })
          )
        } else {
          res.send(JSON.stringify({
              status: 1,
              message: "200 - OK",
            })
          )
        }
      })
    }
  })
})

app.post('/savepalleting', require('connect-ensure-login').ensureLoggedIn('/mlogin'),
(req, res) => {
  console.log(cmfunc.getTimeStamp() + "/savepalleting..");
  var data = req.body;
  console.log(JSON.stringify(data,false,4));
  var boxlist = JSON.parse(data.data)
  var palletID = data.palletID;
  var productID = data.productID;
  var lastPerson = req.session.memberID;
  var lastChanged = moment().format("YYYY-MM-DD HH:mm:ss");

  var sql0 = ``;
  boxlist.forEach(m => {
    sql0 += `UPDATE box SET palletID = ${palletID}, lastChanged="${lastChanged}", lastPerson = ${lastPerson} WHERE (boxID = ${m.boxID});`;
  })
  console.log("sql0: " + sql0);
  tbls["box"].execSQL(sql0, function (errx, datx) {
    if (errx) {
      res.send(JSON.stringify({
          status: 0,
          message: "Hệ thống bị lỗi",
        })
      )
    } else {
      tbls["pallet"].save({
        palletID: palletID, 
        status: 1,
        productID: productID,
        boxQty: boxlist.length,
        lastChanged: lastChanged,
        lastPerson: lastPerson 
      }, function (erry, daty) {
        if (erry) {
          res.send(JSON.stringify({
              status: 0,
              message: "Hệ thống bị lỗi"
            })
          )
        } else {
          res.send(JSON.stringify({
              status: 1,
              message: "200 - OK",
            })
          )
        }
      })
    }
  })
})

app.post('/savestocking', require('connect-ensure-login').ensureLoggedIn('/mlogin'),
(req, res) => {
  console.log(cmfunc.getTimeStamp() + "/savestocking..");
  var data = req.body;
  var palletlist = JSON.parse(data.data)
  var orderxitemID = data.orderxitemID;
  var sql0 = `DELETE FROM palletitems WHERE (orderxitemID = ${orderxitemID});`;
  palletlist.forEach(m => {
    sql0 += `INSERT INTO palletitems (palletID, orderxitemID) VALUES (${m.palletID},${orderxitemID});`;
    sql0 += `UPDATE orderxitem SET status=2 WHERE (orderxitemID=${orderxitemID});`;
  })
  console.log("sql0: " + sql0);
  tbls["palletitems"].execSQL(sql0, function (errx, datx) {
    if (errx) {
      res.send(JSON.stringify({
          status: 0,
          message: "Hệ thống bị lỗi",
        })
      )
    } else {
      res.send(JSON.stringify({
          status: 1,
          message: "200 - OK",
        })
      )
    }
  })
})

app.post('/savesplitting', require('connect-ensure-login').ensureLoggedIn('/mlogin'),
(req, res) => {
  console.log(cmfunc.getTimeStamp() + "/savesplitting..");
  var data = req.body;
  console.log(JSON.stringify(data, false, 4))
  var boxlist = JSON.parse(data.data);
  var curPalletID = data.curPalletID;
  var curboxQty = data.curboxQty;
  var palletID = data.palletID;
  var productID = data.productID;
  var boxQty = data.boxQty;
  var lastPerson = req.session.memberID;
  var lastChanged = moment().format("YYYY-MM-DD HH:mm:ss");

  var sql0 = `UPDATE pallet SET boxQty=${curboxQty}, lastChanged="${lastChanged}", lastPerson = ${lastPerson} WHERE (palletID = ${curPalletID});`;
  sql0 += `UPDATE pallet SET status = 1, productID = ${productID}, boxQty=${boxQty}, lastChanged="${lastChanged}", lastPerson = ${lastPerson} WHERE (palletID = ${palletID});`;
  boxlist.forEach(m => {
    sql0 += `UPDATE box SET palletID=${palletID}, lastChanged="${lastChanged}", lastPerson = ${lastPerson} WHERE (boxID=${m});`;
  })
  console.log("sql0: " + sql0);
  tbls["box"].execSQL(sql0, function (errx, datx) {
    if (errx) {
      res.send(JSON.stringify({
          status: 0,
          message: "Hệ thống bị lỗi",
        })
      )
    } else {
      res.send(JSON.stringify({
          status: 1,
          message: "200 - OK",
        })
      )
    }
  })
})

app.post('/savestockreceived', require('connect-ensure-login').ensureLoggedIn('/mlogin'),
(req, res) => {
  console.log(cmfunc.getTimeStamp() + "/savestockreceived..");
  var data = req.body;
  console.log(JSON.stringify(data, false, 4))
  var boxlist = JSON.parse(data.data);
  var agentID = req.session.memberID;
  var lastPerson = req.session.memberID;
  var lastChanged = moment().format("YYYY-MM-DD HH:mm:ss");

  var sql0 = ``;
  boxlist.forEach(m => {
    sql0 += `UPDATE box SET agentID=${agentID}, status = 2, agentreceivedDate="${lastChanged}",  lastChanged="${lastChanged}", lastPerson = ${lastPerson} WHERE (boxID=${m.boxID});`;
    sql0 += `INSERT INTO wallet (groupID, memberID, credit, comment, refID, lastPerson, status) `;
    sql0 += ` VALUES(${req.session.groupID},${req.session.memberID},'${m.stockbonus}', 'Đại lý nhận hàng', CONCAT('boxID:',${m.boxID}), ${lastPerson}, 2);`;
  })
  console.log("sql0: " + sql0);
  tbls["box"].execSQL(sql0, function (errx, datx) {
    if (errx) {
      res.send(JSON.stringify({
          status: 0,
          message: "Hệ thống bị lỗi",
        })
      )
    } else {
      res.send(JSON.stringify({
          status: 1,
          message: "200 - OK",
        })
      )
    }
  })
})
async function registerEndPoint(data, token) {
  try {
    const response = await axios.post(`https://api.vietguys.biz:4438/callback/v1/register`, data, {
      headers: {
        'Access-Token': token
      }
    });
    return response.data;
  } catch (error) {
    throw error
  }
}
async function topUp(data) {
  try {
    const response = await axios.post(`https://cloudsms2.vietguys.biz:4438/api/topup/index.php`, data);
    return response.data;
  } catch (error) {
    throw error
  }
}
async function sendSMS(data) {
  try {
    const response = await axios.post(`https://cloudsms4.vietguys.biz:4438/api/index.php`, data);
    return response.data;
  } catch (error) {
    throw error
  }
  //return {SMSID:'123456789012-abc-def', CodeResult:100};
}

//*************************************************************** */
function findPhone(phone, req, res) {
  login.genOTP(phone, function(error, datx) {
    if (error) {
      console.log('No account is found....');
      res.send(JSON.stringify({
          status: 0,
          message: "Số ĐT|Email không tồn tại..<br/>Liên lạc: 0908888218 <br/>Zalo|Whatsapp|Viber <br/> Skype: admin@antifake.au",
        })
      );
    } else {
      var data = {
        "username": ApiUserName,
        "channel": 'sms_cskh',
        "endpoint": esmscallback,
        "header": {
          "token": 123
        }
      }
      registerEndPoint(data, TokenKey).then((result) => {
        console.log("status: " + JSON.stringify(result,false,4));
        if (result.error == 0) {
          data.phone = req.body.phonenumber;
          data.u = ApiUserName;
          data.pwd = TokenKey;
          //data.sms =  `Mã OTP:${result.otp} để đăng nhập AntiFake, chỉ hiệu lực một lần.`;
          data.sms =  `Your OTP code is ${datx.otp}`;
          data.bid = 2;
          data.type = 8;
          data.json = 1;
          data.from = 'Vlocal';
      
          sendSMS(data).then((smsResult) => {
            console.log("smsResults: " + JSON.stringify(smsResult, false, 4));
            let smsTextx = '';
            if (smsResult.error == 1) {
              smsTextx = smsResult.log;
            } else {
              smsTextx = `Mã OTP:${datx.otp} để đăng nhập AntiFake, chỉ hiệu lực một lần.`;
            }
            tbls['esms'].insert({
              phone: datx.phone,
              smsText: smsTextx,
              smsID: smsResult.msgid,
              telcoid: smsResult.carrier,
              status: smsResult.error
            }, function (err, data){
              if (err) throw err;
              if (smsResult.error == 1) {
                res.send(JSON.stringify({
                    status: 0,
                    message: datx.phone,
                  })
                );
              } else {
                res.send(JSON.stringify({
                    status: 1,
                    message: datx.phone,
                  })
                );
              }
            })
          })
        } else {
          console.log('result: ' + JSON.stringify(result, false, 4))
        }
      })
    }
  });
};

function checkOTP(otp, req, res) {
  login.checkOTP(otp, function(error, data) {
    if (error) {
      console.log('OTP is incorrect....');
      res.send(JSON.stringify({
          status: 0,
          message: "Mã OTP không đúng..<br/>*** Nhập lại *** ",
        })
      );
    } else {
      res.send(JSON.stringify({
          status: 1,
          message: {otp:data.otp},
        })
      );
    }
  });
};
//*************** Business Management ************************ */
app.get('/accountlist', require('connect-ensure-login').ensureLoggedIn('/login'),
  (req, res) => {
    console.log(cmfunc.getTimeStamp() + 'goto accountlist..');
  	res.render('accountlist', res.locals.la );
});
app.get('/accinit', require('connect-ensure-login').ensureLoggedIn('/login'),
  (req, res) => {
    console.log(cmfunc.getTimeStamp() + 'goto accinit..');
  	res.render('accinit', res.locals.la );
});
app.get('/profitnloss', require('connect-ensure-login').ensureLoggedIn('/login'),
  (req, res) => {
    console.log(cmfunc.getTimeStamp() + 'goto profitnloss..');
  	res.render('profitnloss', res.locals.la );
});
app.get('/balancesheet', require('connect-ensure-login').ensureLoggedIn('/login'),
  (req, res) => {
    console.log(cmfunc.getTimeStamp() + 'goto balancesheet..');
  	res.render('balancesheet', res.locals.la );
});
app.get('/revenue', require('connect-ensure-login').ensureLoggedIn('/login'),
  (req, res) => {
    console.log(cmfunc.getTimeStamp() + 'goto revenue..');
  	res.render('revenue', res.locals.la );
});
app.get('/expense', require('connect-ensure-login').ensureLoggedIn('/login'),
  (req, res) => {
    console.log(cmfunc.getTimeStamp() + 'goto expense..');
  	res.render('expense', res.locals.la );
});
app.get('/payroll', require('connect-ensure-login').ensureLoggedIn('/login'),
  (req, res) => {
    console.log(cmfunc.getTimeStamp() + 'goto payroll..');
  	res.render('payroll', res.locals.la );
});
app.get('/assetmanagement', require('connect-ensure-login').ensureLoggedIn('/login'),
  (req, res) => {
    console.log(cmfunc.getTimeStamp() + 'goto assetmanagement..');
  	res.render('assetmanagement', res.locals.la );
});

//*************** Statistic *********************************** */
app.get('/issue', require('connect-ensure-login').ensureLoggedIn('/login'),
  (req, res) => {
    console.log(cmfunc.getTimeStamp() + 'goto issue..');
  	res.render('issue', res.locals.la );
});

app.get('/qrcodestat', require('connect-ensure-login').ensureLoggedIn('/login'),
  (req, res) => {
    console.log(cmfunc.getTimeStamp() + 'goto qrcodestat..');
  	res.render('qrcodestat',res.locals.la);
});

app.get('/manustat', require('connect-ensure-login').ensureLoggedIn('/login'),
  (req, res) => {
    console.log(cmfunc.getTimeStamp() + 'goto manustat..');
  	res.render('manustat',res.locals.la);
});

app.get('/salestat', require('connect-ensure-login').ensureLoggedIn('/login'),
  (req, res) => {
    console.log(cmfunc.getTimeStamp() + 'goto salestat..');
  	res.render('salestat', res.locals.la);
});

app.get('/workschedule', require('connect-ensure-login').ensureLoggedIn('/login'),
  (req, res) => {
    console.log(cmfunc.getTimeStamp() + 'goto workschedule..');
  	res.render('workschedule', res.locals.la);
});

//*********************** Login ***********************
app.get('/login',  (req, res) => {
    let errmsg = req.flash("errmsg");
    console.log("/login " + JSON.stringify(req.session,false,4));
    if (errmsg.length > 0 ) {
      console.log("errmsg: " + errmsg);
      res.send({ status: 0, message: errmsg });
    } else {
      if (req.useragent.isMobile) {
        res.redirect("/mlogin");
      } else {
        res.render('login', merge({'errmsg':''}, res.locals.la) );
      }
    }
  }
)


app.post('/autologin', passport.authenticate('localAutolog', {
  successReturnToOrRedirect : '/apphome',
  failureRedirect : '/login',
}));

app.post('/login2', passport.authenticate('localLogin2', {
    successReturnToOrRedirect : '/home',
    failureRedirect : '/login',
}));
app.post('/ikitchen/login2', passport.authenticate('localLogin2', {
  successReturnToOrRedirect : '/home',
  failureRedirect : '/login',
}));

app.get('/logout', (req, res) => {
    console.log("LOG-OUT...");
    req.session.reset();
    req.logout();
    return res.redirect('/login');
});


app.post('/newacc', require('connect-ensure-login').ensureLoggedOut(),
    passport.authenticate('localRegister2', {
        successRedirect : '/',
        failureRedirect : '/login',
        failureFlash : true
    })
);



app.post('/resetpwd2', function (req, res) {
  console.log(cmfunc.getTimeStamp() + "/resetpwd2..");
  resetPassword(req.body.username2, req, res);
})

function resetPassword(email, req, res) {
  login.resetPassword(email, function(error, data) {
    if (error) {
      console.log('No Email...');
      res.send(JSON.stringify({
          status: 0,
          title: "Không có Email - xin liên lạc Admin",
        })
      );
    } else {
      let text = `${res.locals.la.loginwithtemporarypasswd} \r\n\r\n ${res.locals.la.username}: ${data.user} \r\n ${res.locals.la.password}: ${data.passx}`;
      cmfunc.sendEmail(data.email, res.locals.la.retrievepassword, text, function(e,o) {
        if (!e) {
          res.send(JSON.stringify({
              status: 1,
              title: res.locals.la.chkemail_resetpwd,
            })
          );
        }
      });
    }
    
  });
};

app.post('/resetpwd', function (req, res) {
  console.log(cmfunc.getTimeStamp() + "/resetpwd..by checking for valid username");
  console.log("req.body: " + JSON.stringify(req.body, false, 4))

  setPassword(req.body.data.username, req.body.data.password, req, res);
})

function setPassword(email, pass, req, res) {
  console.log("email: " + email)
  login.setPassword(email, pass, function(error, data) {
    if (error) {
      console.log('No Email...');
      res.send({
          status: 0,
          title: "Không có tài khoản Email - xin liên lạc Admin",
      })
    } else {
      res.send({
          status: 1,
          title: res.locals.la.chkemail_resetpwd,
      })
    }
    
  });
};

app.post('/getacc', function (req, res) {
  if (cmfunc.isEmpty(req.session.user)) { res.redirect('/'); }
  else {
    console.log(cmfunc.getTimeStamp() + "/getacc..");
    login.getAccountByID(req.session.memberID, function(error, data) {
      if (error) throw error;
      res.send(JSON.stringify(data));
    })
  }
});

app.post('/updatepwd', function (req, res) {
  if (cmfunc.isEmpty(req.session.user)) { res.redirect('/'); }
  else {
    console.log(cmfunc.getTimeStamp() + "/updatepwd..");
    let user = {};
    user.memberID = req.session.memberID;
    user.user = req.body.uname;
    user.pass = req.body.upwd;
    login.updatePassword(user, function(error, data) {
      req.session.pass = data.pass;
      let titlex;
      if (error) {
        if (error == 202) { titlex = res.locals.la.email_alreadyused }
        res.send(JSON.stringify({
            status: 0,
            title: titlex,
          })
        );
      } else {
        res.send(JSON.stringify({
            status: 1,
            title: res.locals.la.updatesuccess,
          })
        );
      }
    })
  }
});

app.post('/addnewcustomer', function (req, res) {
  if (cmfunc.isEmpty(req.session.user)) { res.redirect('/'); }
  else {
    console.log(cmfunc.getTimeStamp() + "/addnewcustomer..");
    console.log('req.body: '+ JSON.stringify(req.body));
    console.log(JSON.stringify(req.files));
    let user = {};
    user.memberID = req.session.memberID;
    user.email = req.body.email;
    user.phone = req.body.phone;
    user.name = req.body.name;
    user.company = req.body.bname;
    user.address = req.body.address;
    user.city = req.body.city;
    user.regono = req.body.brego;
    user.bizregono = req.body.bizregono;
    //updateacc(user);
  }
});

//************************************************************************ */
const getMemberInfo = (req) => {
  return new Promise((resolve, reject) => { 
      console.log(cmfunc.getTimeStamp() + `GET request to /getMemberInfo`);
      let sql0 = `SELECT a.*, b.weburl `;
      sql0 += ` FROM memberx a, groupx b WHERE (a.memberID = ${req.session.memberID}) AND (a.groupID = b.groupID)`; 
      tbls['memberx'].execSQL(sql0, function(error, result) {
        if (error) reject(error);
        req.session.name = result[0].name;
        resolve(result);
      })

  })
};
const getcontactstat = (req) => {
  return new Promise((resolve, reject) => { 
      console.log(cmfunc.getTimeStamp() + `GET request to /getcontactstat`);
      let sql0 = `SELECT COUNT(a.memberID) AS 'total', a.roleID`;
      sql0 += ` FROM memberx a `; 
      if (req.session.groupID > 1) sql0 += ` WHERE (a.groupID = ${req.session.groupID})`;
      sql0 += ` GROUP BY a.roleID `;
      
      tbls['memberx'].execSQL(sql0, function(error, result) {
        if (error) reject(error);
        //console.log(result)
        resolve(result);
      })

  })
};

const getproduct = (req) => {
  return new Promise((resolve, reject) => { 
      console.log(cmfunc.getTimeStamp() + `GET request to /getproduct`);
      let sql0 = `SELECT COUNT(productID) AS 'total'`;
      sql0 += ` FROM product a `; 
      if (req.session.groupID > 1) {
        sql0 += `WHERE (a.groupID = ${req.session.groupID} )`;
      }
      tbls['product'].execSQL(sql0, function(error, result) {
        if (error) reject(error);
        //console.log(result)
        resolve(result);
      })
  })
};
const getcategory = (req) => {
  return new Promise((resolve, reject) => { 
      console.log(cmfunc.getTimeStamp() + `GET request to /getcategory`);
      let sql0 = `SELECT COUNT(categoryID) AS 'total'`;
      sql0 += ` FROM category a `; 
      if (req.session.groupID > 1) {
        sql0 += `WHERE (a.groupID = ${req.session.groupID} )`;
      }
      tbls['category'].execSQL(sql0, function(error, result) {
        if (error) reject(error);
        //console.log(result)
        resolve(result);
      })
  })
};

const getWalletBalance = (req) => {
  return new Promise((resolve, reject) => { 
      console.log(cmfunc.getTimeStamp() + `GET request to /getWalletBalance`);
      let sql0 = `SELECT SUM(a.credit) - SUM(a.debit) AS 'Balance'`;
      sql0 += ` FROM wallet a WHERE (a.memberID = ${req.session.memberID}) AND (a.status > 1)`; 
      sql0 += ` GROUP BY a.memberID `;
      //console.log("sql0: " + sql0);
      tbls['wallet'].execSQL(sql0, function(error, result) {
        if (error) reject(error);
        if (result.length > 0) resolve(result[0].Balance);
        else resolve(0)
        
      })
  })
};
//******************** Gen QRCode  ****************************** */
function pad(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

function genProdQRCode(datx, callback) {
  console.log("genProdQRCode: " + datx.prodmanID);
  var tblx = "proditem";
  var sqlTxt= '';
  var sql0 = '';
  var weburlx = '';
  const { customAlphabet } = require('nanoid');
  var nanoid = customAlphabet('1234567890ABCDEFGHIJKLMNOPQRSTVWXYZabcdefghijklmnopqrstvuwxyz', 16);

  const recCount = datx.qty;
  const prodmanID = datx.prodmanID;
  const warehouseID = datx.warehouseID;
  const productID = datx.productID;
  const weburl =  datx.weburl;
  var refIDx = datx.subdir;

 
  taskRec = [];
  sql0 = `SELECT proditemID AS 'total' FROM proditem`;
  sql0 += ` ORDER BY proditemID DESC LIMIT 1`;

  if (productID === 1) {
    sqlTxt += `INSERT INTO box (prodmanID, uuID, refID, urlLink) VALUES `;
    //  sqlTxt += `INSERT INTO box (prodmanID, uuID, refID, urlLink) VALUES ? `;
    //weburlx =  `${weburl}/b/`;
    weburlx =  `${weburl}/boxchk?`;
  } else if (productID === 2) {
    sqlTxt += `INSERT INTO pallet (prodmanID, uuID, refID, urlLink) VALUES `;
    //  sqlTxt += `INSERT INTO pallet (prodmanID, uuID, refID, urlLink) VALUES ? `;
    weburlx =  `${weburl}/p/`;
  } else {
    sqlTxt += `INSERT INTO proditem (prodmanID, uuID, refID, urlLink) VALUES `;
    //  sqlTxt += `INSERT INTO proditem (prodmanID, uuID, refID, urlLink) VALUES ? `;
    weburlx =  `${weburl}/prodqrchk?`;
  }

  function genItemQRCODE (start) {  
      console.log("start: " + start + ", prodmandID: " + prodmanID);  
      for (var i=0; i < recCount; i++) {
          let nanoidx= nanoid();
          let hexnum = pad(converter.decToHex((start+i+1).toString(),{ prefix: false }).toUpperCase(),8);
          let taskx = {
              prodmanID:  prodmanID,
              uuID: nanoidx,
              refID:  `${refIDx}${hexnum}`,
              urlLink: `${weburlx}${nanoidx}`,
          }
          taskRec.push(taskx);
      }
      console.log("taskRec: " + JSON.stringify(taskRec, false, 4));
      console.log("Count taskRec: " + taskRec.length);
      let romList = [];
      taskRec.some(function(romx){
          //console.log("romx: " + JSON.stringify(Object.values(romx), false, 4));
          let rom = Object.values(romx);
          let romTxt = '(';
          rom.some (function(r){
              if (typeof r === 'string'|| r instanceof String)
              romTxt+= `'${r}',`;
              else   romTxt+= `${r},`;
          })
          //console.log("romTxt: " + romTxt)
          romTxt = romTxt.substring(0, romTxt.length - 1);
          romTxt = romTxt + ")";
          romList.push(romTxt);
      })
      //console.log("romList: " + JSON.stringify(romList, false, 4));
      sqlTxt += romList.join(",");
      sqlTxt += ";"
  }
    console.log(sql0)
    tbls[tblx].execSQL(sql0, function(errorb, datb) {
        if (errorb) {
            console.log("error: " + errorb) ;
        } else {
          let total = (datb && (datb.length > 0)) ? datb[0].total: 0;
          genItemQRCODE(total);
          tbls[tblx].execSQL(sqlTxt, function(errorc, datc) {
          //tbls[tblx].execSQLA(sqlTxt, taskRec, function(errorc, datc) {  
            if (errorc) {
                console.log("error: " + errorc) ;
                callback(true)
            } else {
              if (productID > 2) {
                let sql0 = `SELECT COUNT(*) AS 'total' FROM proditem WHERE (prodmanID = ${prodmanID})`;
                tbls[tblx].execSQL(sql0, function(errord, datd) {
                    if (errord) {
                        console.log("error: " + errord) ;
                        callback(true)
                    } else {
                      if (datd[0].total == recCount) {
                        console.log("SUCCESSFUL recCount: " + recCount + ", generated#: " + datd[0].total) ;
                        callback(false)
                      } else {
                        console.log("ERROR recCount: " + recCount + ", only generated#: " + datd[0].total + " found..") ;
                        callback(true)
                      }
                    }
                })
              } else {
                callback(false);
              }  
            }
          })
        }
    })
    

}

function genWallet(datx, callback) {
  var proditemList=[0];
  //************************************************************** */
  var fn3 = function insertWallet(sale) {
    return new Promise(function(resolve, reject) {
        var sql1 = `INSERT INTO wallet (groupID, memberID, saleID, credit, dateAdded) VALUES (2, ${sale.customerID}, ${sale.saleID}, ${sale.customerBonus}, '${sale.dateAdded}'), `;
        sql1 += ` (2, ${sale.agentStaffID},  ${sale.saleID}, ${sale.agentstaffBonus}, '${sale.dateAdded}'), `
        sql1 += ` (2, ${sale.agentID},  ${sale.saleID}, ${sale.agentBonus}, '${sale.dateAdded}'), `
        sql1 += ` (2, ${sale.diststaffID},  ${sale.saleID}, ${sale.diststaffBonus}, '${sale.dateAdded}') ;`
        console.log("sql1: " + sql1)
        tbls['wallet'].execSQL(sql1, function(error, data) {
            if (error) {  reject(error);
            } else {
                resolve(sale)
            }
        })
    })
  }

  var fn2 = function updateProditem(sale) {
    return new Promise(function(resolve, reject) {
        var sql1 = `UPDATE proditem SET saleID = ${sale.saleID}, status = 2, lastChanged='${sale.dateAdded}' WHERE proditemID IN (${sale.proditemID1},${sale.proditemID2},${sale.proditemID3});`;
        console.log("sql1: " + sql1)
        tbls['proditem'].execSQL(sql1, function(error, data) {
            if (error) {  reject(error);
            } else {
                resolve(sale)
            }
        })
    })
  }


  var fn1 = function genOrderxItems(sale) {
    return new Promise(function(resolve, reject) {
        var pid = generateRandom(3,17);
        let seed;
        var sql0 = `SELECT a.*, d.customerBonus, d.agentstaffBonus, d.agentBonus, d.diststaffBonus FROM proditem a, prodman b, product c, promotion d `; 
        sql0 += ` WHERE (a.prodmanID = b.prodmanID) AND (b.productID = ${pid}) `; 
        sql0 += ` AND (a.status = 1) AND (b.productID = c.productID) AND (c.promotionID = d.promotionID) AND (a.proditemID NOT IN (${proditemList.join(",")}))`;
        if ((pid < 17) && (pid > 13)) sql0 += ` LIMIT 0, ${salenum} `; 
        else sql0 += ` LIMIT 0, ${salenum*3} `; 
        //console.log("sql0: " + sql0);
        tbls['proditem'].execSQL(sql0, function(error, data) {
            if (error) {  reject(error);
            } else {
                if (data.length > 0) {
                  seed = generateRandom(0, data.length-1);
                  sale.proditemID1 = data[seed];
                  proditemList.push(sale.proditemID1.proditemID);
                } else {
                  sale.proditemID1 = {};
                  sale.proditemID1.proditemID = 0;
                  sale.proditemID1.customerBonus = 0;
                  sale.proditemID1.agentstaffBonus = 0;
                  sale.proditemID1.agentBonus = 0;
                  sale.proditemID1.diststaffBonus = 0;
                }
                pid = generateRandom(3,17);
                sql0 = `SELECT a.*, d.customerBonus, d.agentstaffBonus, d.agentBonus, d.diststaffBonus FROM proditem a, prodman b, product c, promotion d `; 
                sql0 += ` WHERE (a.prodmanID = b.prodmanID) AND (b.productID = ${pid}) AND (a.proditemID NOT IN (${proditemList.join(",")}))`;
                sql0 += ` AND (a.status = 1) AND (b.productID = c.productID) AND (c.promotionID = d.promotionID) `;
                if ((pid < 17) && (pid > 13)) sql0 += ` LIMIT 0, ${salenum} `; 
                else sql0 += ` LIMIT 0, ${salenum*3} `; 
                //console.log("sql0: " + sql0);
                tbls['proditem'].execSQL(sql0, function(errorb, datb) {
                    if (errorb) {  reject(errorb);
                    } else {
                        let seed = 0;
                        if (datb.length > 0) {
                          seed = generateRandom(0, datb.length-1);
                          sale.proditemID2 = datb[seed];
                          proditemList.push(sale.proditemID2.proditemID);
                        } else {
                          sale.proditemID2 = {};
                          sale.proditemID2.proditemID = 0;
                          sale.proditemID2.customerBonus = 0;
                          sale.proditemID2.agentstaffBonus = 0;
                          sale.proditemID2.agentBonus = 0;
                          sale.proditemID2.diststaffBonus = 0;  
                        }
                        pid = generateRandom(3,17);
                        sql0 = `SELECT a.*, d.customerBonus, d.agentstaffBonus, d.agentBonus, d.diststaffBonus FROM proditem a, prodman b, product c, promotion d `; 
                        sql0 += ` WHERE (a.prodmanID = b.prodmanID) AND (b.productID = ${pid}) AND (a.proditemID NOT IN (${proditemList.join(",")}))`;
                        sql0 += ` AND (a.status = 1) AND (b.productID = c.productID) AND (c.promotionID = d.promotionID) `;
                        if ((pid < 17) && (pid > 13)) sql0 += ` LIMIT 0, ${salenum} `; 
                        else sql0 += ` LIMIT 0, ${salenum*3} `; 
                        //console.log("sql0: " + sql0);
                        tbls['proditem'].execSQL(sql0, function(errorc, datc) {
                            if (errorc) {  reject(errorc);
                            } else {
                                let seed = 0;
                                if (datc.length > 0) {
                                  seed = generateRandom(0, datc.length-1);
                                  sale.proditemID3 = datc[seed];
                                  proditemList.push(sale.proditemID3.proditemID);
                                } else {
                                  sale.proditemID3 = {};
                                  sale.proditemID3.proditemID = 0;
                                  sale.proditemID3.customerBonus = 0;
                                  sale.proditemID3.agentstaffBonus = 0;
                                  sale.proditemID3.agentBonus = 0;
                                  sale.proditemID3.diststaffBonus = 0;  
                                }
                                sale.customerBonus = sale.proditemID1.customerBonus + sale.proditemID2.customerBonus + sale.proditemID3.customerBonus;
                                sale.agentstaffBonus = sale.proditemID1.agentstaffBonus + sale.proditemID2.agentstaffBonus + sale.proditemID3.agentstaffBonus;
                                sale.agentBonus = sale.proditemID1.agentBonus + sale.proditemID2.agentBonus + sale.proditemID3.agentBonus;
                                sale.diststaffBonus = sale.proditemID1.diststaffBonus + sale.proditemID2.diststaffBonus + sale.proditemID3.diststaffBonus;
                                sale.proditemID1 = sale.proditemID1.proditemID;
                                sale.proditemID2 = sale.proditemID2.proditemID;
                                sale.proditemID3 = sale.proditemID3.proditemID;
                                resolve(sale);
                            }
                        })
                    }
                })
                
            }
        })
    })
  }
  var fn = function getAgentAssociates(sale){
    return new Promise(function(resolve, reject) {
        var sql = `SELECT a.*, b.memberID as 'agentID', c.memberID AS 'diststaffID' FROM memberx a, memberx b, memberx c`;
        sql += ` WHERE (a.memberID=${sale.agentStaffID}) AND (a.parentID = b.memberID) AND (b.parentID=c.memberID)`;
        //console.log("sql: " + sql)
        tbls['memberx'].execSQL(sql, function(error, data) {
            if (error) {  
                console.log("ERROR: " + error);
                reject(error);
            } else {
              sale.agentID = data[0].agentID;
              sale.diststaffID = data[0].diststaffID;
              resolve(sale);
            }
        })
    })
  }

 

  console.log("Get agentID, diststaffID ");
  var actions = datx.map(fn);
  var results = Promise.all(actions).then( function (da1) {
      console.log("Select proditem to be included into the sale ");
      var actions1 = da1.map(fn1);
      var results1 = Promise.all(actions1).then( function (da2) {
          console.log("Update proditem with SaleID ");
          //console.log(JSON.stringify(da2, false, 4))
          var actions2 = da2.map(fn2);
          var results2 = Promise.all(actions2).then( function (da3) {
              console.log("Generate wallet credit.. ");
              //console.log(JSON.stringify(da3, false, 4))
              var actions3 = da2.map(fn3);
              var results3 = Promise.all(actions3).then( function (da4) {
                console.log("Complete...")
                callback(false);
              })
          })
      }) 
  })
  
  /*
  const forEachSeries = async (iterable) => {
    for (const x of iterable) {
      await fn(x)
      await fn1(x)
      await fn2(x)
      await fn3(x)
    }
  }
  forEachSeries(datx);
  */
}

function generateRandom(min = 0, max = 100) {
  let difference = max - min;
  let rand = Math.random();
  rand = Math.floor( rand * difference);
  rand = rand + min;
  return rand;
}

function getParameters(urlString) {
  let paramsArray = [];
  if (urlString.split('?').length > 1) {
    let paramString = urlString.split('?')[1];
    let queryString = new URLSearchParams(paramString);
    for(let pair of queryString.entries()) {
      paramsArray.push({name: pair[0], value:pair[1]})
    }
  }
	return paramsArray;
}
//*********** Functions ***************
module.exports = app;
