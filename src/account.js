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
  var math = require('mathjs');
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
app.get('/assetlist', function (req, res) {
  if (cmfunc.isEmpty(req.session.user)) { res.redirect('/'); }// if user is not logged-in redirect back to login page //
  else {
    console.log(cmfunc.getTimeStamp() + `/assetlist`);
    let sql;
    sql = ` SELECT b.expensesID, b.amount, b.tax, b.comment, b.datePaid, b.status, b.dateAdded, b.depreciationID `;
    sql += ` FROM expenses b, account c WHERE  (b.accountID = c.accountID)`;
    sql += ` AND ((c.accountName_en=='Equipments|Furnitures') OR (c.accountName_en=='Construction|Renovation') )`; //51-Equipment+Furniture, 52-Construction
    sql += ` AND (b.groupID = ${req.session.groupID}) `;
    console.log('sql: '+ sql);
    tbls["asset"].execSQL(sql, function(error, data) {
      if (error) throw error;
      if (data) {
        res.send(data);
      }
    })
  }
});


app.get('/getTertiaryAccount/:acctype/:lang', function (req, res) {
  if (cmfunc.isEmpty(req.session.user)) { res.redirect('/'); }// if user is not logged-in redirect back to login page //
  else {
    console.log(cmfunc.getTimeStamp() + `/getTertiaryAccount/${req.params.acctype}/${req.params.lang}`);
    let sql = ` SELECT a.* FROM account a WHERE (a.status=1) `;
    sql += ` AND (a.accType = ${req.params.acctype}) AND (a.lastitem = 1) AND (PLEnabled=1)`;
    if (req.params.lang == "vi") {
      sql += ` ORDER BY a.accountName_vi`;
    } else {
      sql += ` ORDER BY a.accountName_en`;
    }
    //console.log('sql: '+ sql);
    tbls["account"].execSQL(sql, function(error, data) {
      if (error) throw error;
      //console.table(data)
      if (data) {
        res.send(data);
      }
    })
  }
});

app.get('/getExpAccount', function (req, res) {
  if (cmfunc.isEmpty(req.session.user)) { res.redirect('/'); }// if user is not logged-in redirect back to login page //
  else {
    console.log(cmfunc.getTimeStamp() + `/getExpAccount`);
    let sql;
    sql = ` SELECT a.accountID, a.accountName_vi, a.accountName_en, a.parentID AS 'parentID', b.parentID AS 'gparentID', `;
    sql += ` b.accountName_vi AS  'parentName', c.accountName_vi AS  'grandparentName', a.status FROM account a, account b, account c `;
    sql += ` WHERE (a.lastitem = 1) AND (a.accType=1) AND ((a.PLEnabled=1) OR (a.subType=1)) AND (a.status =1)  AND (a.parentID = b.accountID) AND (b.parentID = c.accountID) `;
    sql += ` ORDER BY a.accountName_vi `;
    //console.log('sql: '+ sql);
    tbls["account"].execSQL(sql, function(error, data) {
      if (error) throw error;
      //console.table(data)
      if (data) {
        res.send(data);
      }
    })
  }
});

app.get('/getNonPLAccount', function (req, res) {
  if (cmfunc.isEmpty(req.session.user)) { res.redirect('/'); }// if user is not logged-in redirect back to login page //
  else {
    console.log(cmfunc.getTimeStamp() + `/getNonPLAccount`);
    let sql;
    sql = ` SELECT a.accountID, a.accountName_vi, a.accountName_en, a.parentID AS 'parentID', b.parentID AS 'gparentID', `;
    sql += ` b.accountName_vi AS  'parentName', c.accountName_vi AS  'grandparentName', a.status FROM account a, account b, account c `;
    sql += ` WHERE (a.lastitem = 1) AND (a.PLEnabled=0) AND (a.parentID = b.accountID) AND (b.parentID = c.accountID) AND (a.status=1)`;
    sql += ` ORDER BY a.parentID, a.accType`;
    //console.log('sql: '+ sql);
    tbls["account"].execSQL(sql, function(error, data) {
      if (error) throw error;
      //console.table(data)
      if (data) {
        res.send(data);
      }
    })
  }
});

app.get('/getPLAccount/:acctype/:mode', function (req, res) {
  if (cmfunc.isEmpty(req.session.user)) { res.redirect('/'); }// if user is not logged-in redirect back to login page //
  else {
    console.log(cmfunc.getTimeStamp() + `/getPLAccount/${req.params.acctype}/${req.params.mode}`);
    let sql;
    sql = ` SELECT a.accountID, a.accountName_vi, a.accountName_en, a.parentID AS 'parentID', b.parentID AS 'gparentID', a.initbalance, `;
    sql += ` b.accountName_vi AS  'parentName', c.accountName_vi AS  'grandparentName', a.status FROM account a, account b, account c `;
    sql += ` WHERE (a.lastitem = 1) AND (a.PLEnabled=1) AND (a.parentID = b.accountID) AND (b.parentID = c.accountID)`;
    if (req.params.acctype < 2) { //acctype: 0 (Revenue), 1 (Expense), 2 (All), 
      sql += ` AND (a.accType=${req.params.acctype})`;
    }
    if (req.params.mode == 1) {
      sql += ` AND (a.status = 1)`;
    }
    sql += ` ORDER BY a.parentID, a.accType`;
    //console.log('sql: '+ sql);
    tbls["account"].execSQL(sql, function(error, data) {
      if (error) throw error;
      //console.table(data)
      if (data) {
        res.send(data);
      }
    })
  }
});

app.post('/getExpenses', function (req, res) {
  if (cmfunc.isEmpty(req.session.user)) { res.redirect('/'); }// if user is not logged-in redirect back to login page //
  else {
    console.log(cmfunc.getTimeStamp() + `/getExpenses`);
    let sql;
    console.log(req.body);
    var data = req.body;
    if (data.accid > 0) {
      sql = `SELECT a.*, b.name AS 'lastpersonName', c.subdir `;
      sql += `FROM expenses a, memberx b, groupx c, account d, account e `;
      sql += `WHERE (a.accountID = ${data.accid }) AND (a.lastPerson = b.memberID) AND (a.groupID = c.groupID)`;
      sql += ` AND (a.accountID = d.accountID) AND (d.parentID=e.accountID) `; 
    } else {
      sql = `SELECT a.*, b.name AS 'lastpersonName', c.subdir `;
      sql += `FROM expenses a, memberx b, groupx c, account d, account e `;
      sql += ` WHERE (a.lastPerson = b.memberID) AND (a.groupID = c.groupID)`;
      sql += ` AND (a.accountID = d.accountID) AND (d.parentID=e.accountID) `;
    }
    if (data.incLiability==0){
      sql += ` AND (e.accountName_en <> 'Current liabilities') `;
    }
    if (data.fromdate && data.todate) {
      sql += ` AND ((TO_DAYS(a.dateAdded) >= TO_DAYS('${data.fromdate}')) AND (TO_DAYS(a.dateAdded) < TO_DAYS('${data.todate}')))`;
    }
    console.log('sql: '+ sql);
    tbls["expenses"].execSQL(sql, function(error, result) {
      //console.table(data)
      if (error) throw error;
      res.send(result);
    })
  }
});

app.get('/getBalanceSheet/:deoy', function (req, res) {
  var sysinfo;
  var asset = 0;
  var liabilities = 0;
  var netprofit = 0;
  var paidincapital = 0;
  var retainearning = 0;
  var fn3 = function calculateBalance4(dat) {
    return new Promise(function (resolve, reject){
        tbls['account'].save({ accountID:dat.accountID, balance: dat.balance}, function(erra, data) {
          if (erra) { reject(erra);
          } else { resolve(data) }
        })
    })
  }
  var fn2 = function calculateBalance3(dat){
    var sql='';
    return new Promise(function(resolve, reject) {
      if (dat.accountName_en=='Taxes payable') {
        sql = `SELECT (${dat.balance} - IFNULL(SUM(a.amount),0)) AS 'balance', `;
        sql += ` ${dat.accountID} AS 'accountID', '${dat.accountName_en}' AS 'accountName_en' `;
        sql += ` FROM expenses a WHERE  (a.status=1) AND (accountID = ${dat.accountID})`; 
        sql += ` AND (TO_DAYS(a.datePaid) <= TO_DAYS('${req.params.deoy}')) `;
      } else if (dat.accountName_en=='GST') {
        sql = `SELECT (${dat.balance} -  IFNULL(SUM(a.amount),0)) AS 'balance', `; 
        sql += ` ${dat.accountID} AS 'accountID', '${dat.accountName_en}' AS 'accountName_en' `;
        sql += ` FROM expenses a WHERE  (a.status=1) AND (accountID = ${dat.accountID})`; 
        sql += ` AND (TO_DAYS(a.datePaid) <= TO_DAYS('${req.params.deoy}')) `;
     // } else if (dat.accountName_en=='Common stock|Owners Equity') {
     // } else if (dat.accountName_en=='Dividents') {
     // } else if (dat.accountName_en=='Retained Earning') {
      } else {
        sql = `SELECT ${dat.balance} AS 'balance' , ${dat.accountID} AS 'accountID' , '${dat.accountName_en}' AS 'accountName_en' `; 
      } 
      //console.log("sql: " + sql);
      tbls['sale'].execSQL(sql, function(error, data) {
          if (error) { reject(error);
          } else { 
            let result = Object.values(JSON.parse(JSON.stringify(data)))[0];
            if (result.accountName_en=='Taxes payable') {
              if (result.balance < 0) result.balance = 0;
            }
            resolve(result); 
          }
      })
    })
  }
  
  var fn1 = function calculateBalance2(dat){
    var sql='';
    return new Promise(function(resolve, reject) {
      if (dat.accountName_en=='Cash') {
        sql = `SELECT ( ${dat.tRevenue} - IFNULL(SUM(a.amount+a.tax),0) + ${dat.initbalance}) AS 'balance' , `;
        sql += ` ${dat.accountID} AS 'accountID', '${dat.accountName_en}' AS 'accountName_en' `;
        sql += ` FROM expenses a WHERE (a.paytype=0) AND (a.status=1)`; 
        sql += ` AND (TO_DAYS(a.datePaid) <= TO_DAYS('${req.params.deoy}')) `; 
      } else if (dat.accountName_en=='Bank Account') {
        sql = ` SELECT ( ${dat.tRevenue} - IFNULL(SUM(a.amount+a.tax),0) + ${dat.initbalance}) AS 'balance' , `;
        sql += ` ${dat.accountID} AS 'accountID', '${dat.accountName_en}' AS 'accountName_en' `;
        sql += ` FROM expenses a WHERE  ((a.paytype=1) || (a.paytype = 2)) AND (a.status=1)`; 
        sql += ` AND (TO_DAYS(a.datePaid) <= TO_DAYS('${req.params.deoy}')) `;
      } else if (dat.accountName_en=='Taxes payable') {
        sql = `SELECT (${dat.tRevenue} - IFNULL(SUM(a.amount),0))*${sysinfo.companyTax} AS 'balance', IFNULL(SUM(a.amount),0) AS 'totalExpenses', `;
        sql += ` ${dat.accountID} AS 'accountID', '${dat.accountName_en}' AS 'accountName_en' `;
        sql += ` FROM expenses a, account b, account c WHERE  (a.status=1) AND (a.accountID=b.accountID)`;
        sql += ` AND (b.parentID=c.accountID) AND (c.accountName_en != 'Current liabilities')` 
        sql += ` AND (TO_DAYS(a.datePaid) <= TO_DAYS('${req.params.deoy}')) `;
      } else if (dat.accountName_en=='GST') {
        sql = `SELECT (${dat.taxRevenue} -  IFNULL(SUM(a.tax),0)) AS 'balance', `;
        sql += ` ${dat.accountID} AS 'accountID', '${dat.accountName_en}' AS 'accountName_en' `; 
        sql += ` FROM expenses a WHERE  (a.status=1)`; 
        sql += ` AND (TO_DAYS(a.datePaid) <= TO_DAYS('${req.params.deoy}')) `;
     // } else if (dat.accountName_en=='Common stock|Owners Equity') {
     // } else if (dat.accountName_en=='Dividents') {
     // } else if (dat.accountName_en=='Retained Earning') {
     // } else if (dat.accountName_en=='Rawstock Inventory') {
     //   sql = `SELECT (${dat.trawIn} -  IFNULL(SUM(a.itemcost * a.qty),0)) AS 'balance', `;
     //   sql += ` ${dat.accountID} AS 'accountID', '${dat.accountName_en}' AS 'accountName_en' `; 
     //   sql += ` FROM rawstockXfer a WHERE  (a.status=2) AND (a.xferType=1)`; 
     //   sql += ` AND (TO_DAYS(a.lastChanged) <= TO_DAYS('${req.params.deoy}')) `;
     // } else if (dat.accountName_en=='Stock Inventory') {
     //   sql = `SELECT (${dat.tprodIn} -  IFNULL(SUM(a.itemcost * a.qty),0)) AS 'balance', `;
     //   sql += ` ${dat.accountID} AS 'accountID', '${dat.accountName_en}' AS 'accountName_en' `; 
     //   sql += ` FROM prodXfer a WHERE  (a.status=2) AND (a.xferType=1)`; 
     //   sql += ` AND (TO_DAYS(a.lastChanged) <= TO_DAYS('${req.params.deoy}')) `;
      } else {
        sql = `SELECT ${dat.balance} AS 'balance' , ${dat.accountID} AS 'accountID' , '${dat.accountName_en}' AS 'accountName_en' `; 
      } 
      console.log("sql: " + sql);
      tbls['sale'].execSQL(sql, function(error, data) {
          if (error) { reject(error);
          } else { 
            let result = Object.values(JSON.parse(JSON.stringify(data)))[0];
            if (result.accountName_en=='Taxes payable') {
              if (result.balance < 0) result.balance = 0;
            }
            resolve(result); 
          }
      })
    })
  }

  var fn = function calculateBalance(dat){
    var sql='';
    return new Promise(function(resolve, reject) {
      if (dat.accountName_en=='Accounts receivable') {
        sql = `SELECT IFNULL(SUM(a.amount+a.tax),0) AS 'balance', `;
        sql += ` ${dat.accountID} AS 'accountID', '${dat.accountName_en}' AS 'accountName_en', `;
        sql += ` ${dat.initbalance} AS 'initbalance'  FROM sale a WHERE (a.groupID=${req.session.groupID}) AND (a.status=0)`;
        sql += ` AND (TO_DAYS(a.datePaid) <= TO_DAYS('${req.params.deoy}')) `;
      } else if (dat.accountName_en=='Accounts payable') {
        sql = `SELECT IFNULL(SUM(a.amount+a.tax),0) AS 'balance', `;
        sql += ` ${dat.accountID} AS 'accountID', '${dat.accountName_en}' AS 'accountName_en', `;
        sql += ` ${dat.initbalance} AS 'initbalance' FROM expenses a WHERE (a.status=0)`; 
        sql += ` AND (TO_DAYS(a.datePaid) <= TO_DAYS('${req.params.deoy}')) `;
      //} else if (dat.accountName_en=='Rawstock Inventory') {
      //  sql = `SELECT IFNULL(SUM(a.itemcost * a.qty), 0) AS 'trawIn' , ${dat.accountID} AS 'accountID', `;
      //  sql += ` '${dat.accountName_en}' AS 'accountName_en', ${dat.initbalance} AS 'initbalance' `;
      //  sql += ` FROM rawstockXfer a WHERE (a.status=2) AND (a.xferType=0)`; 
      //  sql += ` AND (TO_DAYS(a.lastChanged) <= TO_DAYS('${req.params.deoy}')) `;
      } else if (dat.accountName_en=='Stock Inventory') {
        sql = `SELECT IFNULL(SUM(a.costperitem * a.stockqty),0) AS 'balance', `;
        sql += ` ${dat.accountID} AS 'accountID', '${dat.accountName_en}' AS 'accountName_en', `;
        sql += ` ${dat.initbalance} AS 'initbalance' FROM product a WHERE (a.status=1)`;
        sql += ` AND (TO_DAYS(a.lastChanged) <= TO_DAYS('${req.params.deoy}')) `; 
      } else if (dat.accountName_en=='Cash') {
        sql = `SELECT IFNULL(SUM(a.amount+a.tax),0) AS 'tRevenue' ,  0 AS 'balance', `;
        sql += ` ${dat.accountID} AS 'accountID', '${dat.accountName_en}' AS 'accountName_en', `;
        sql += ` ${dat.initbalance} AS 'initbalance' FROM sale a WHERE (a.paytype=0) AND (a.isPaid=1)`; 
        sql += ` AND (TO_DAYS(a.datePaid) <= TO_DAYS('${req.params.deoy}')) `;
      } else if (dat.accountName_en=='Bank Account') {
       sql = `SELECT IFNULL(SUM(a.amount+a.tax),0) AS 'tRevenue',  0 AS 'balance', `;
       sql += ` ${dat.accountID} AS 'accountID', '${dat.accountName_en}' AS 'accountName_en', `;
       sql += ` ${dat.initbalance} AS 'initbalance' FROM sale a WHERE ((a.paytype=1) || (a.paytype = 2)) AND (a.isPaid=1)`; 
       sql += ` AND (TO_DAYS(a.datePaid) <= TO_DAYS('${req.params.deoy}')) `;
      } else if (dat.accountName_en=='Equipments|Furnitures') {
        sql = `SELECT IFNULL(SUM(a.amount+a.tax),0) AS 'balance' , `;
        sql += ` ${dat.accountID} AS 'accountID', '${dat.accountName_en}' AS 'accountName_en', `;
        sql += ` ${dat.initbalance} AS 'initbalance' FROM expenses a WHERE  (a.accountID=${dat.subType})`; 
        sql += ` AND (TO_DAYS(a.datePaid) <= TO_DAYS('${req.params.deoy}')) `;
      } else if (dat.accountName_en=='Taxes payable') {
        sql = `SELECT IFNULL(SUM(a.amount),0) AS 'tRevenue',  0 AS 'balance', `;
        sql += ` ${dat.accountID} AS 'accountID', '${dat.accountName_en}' AS 'accountName_en', `;
        sql += ` ${dat.initbalance} AS 'initbalance' FROM sale a WHERE (a.isPaid=1)`; 
        sql += ` AND (TO_DAYS(a.datePaid) <= TO_DAYS('${req.params.deoy}')) `;
      } else if (dat.accountName_en=='GST') {
        sql = `SELECT IFNULL(SUM(a.tax),0) AS 'taxRevenue', 0 AS 'balance', `;
        sql += ` ${dat.accountID} AS 'accountID', '${dat.accountName_en}' AS 'accountName_en', `;
        sql += ` ${dat.initbalance} AS 'initbalance' FROM sale a WHERE (a.isPaid=1)`; 
        sql += ` AND (TO_DAYS(a.datePaid) <= TO_DAYS('${req.params.deoy}')) `;
      // } else if (dat.accountName_en=='Common stock|Owners Equity') {
      // } else if (dat.accountName_en=='Dividents') {
      } else if (dat.accountName_en=='Paid-In Capital') {
        sql = `SELECT IFNULL(SUM(a.initbalance),0) AS 'balance' ,`;
        sql += ` ${dat.accountID} AS 'accountID', '${dat.accountName_en}' AS 'accountName_en', `;
        sql += ` ${dat.initbalance} AS 'initbalance' FROM accinit a WHERE (a.groupID=${req.session.groupID})`; 
      // } else if (dat.accountName_en=='Retained Earning') {
      } else {
        sql = `SELECT 0 AS 'balance' , `;
        sql += ` ${dat.accountID} AS 'accountID', '${dat.accountName_en}' AS 'accountName_en', `;
        sql += ` ${dat.initbalance} AS 'initbalance' `; 
      }
      //console.log("sql: " + sql);
      tbls['sale'].execSQL(sql, function(error, data) {
          if (error) { reject(error);
          } else { 
            let result = Object.values(JSON.parse(JSON.stringify(data)))[0];
            resolve(result); 
          }
      })
    })
  }

  if (cmfunc.isEmpty(req.session.user)) { res.redirect('/'); }// if user is not logged-in redirect back to login page //
  else {
    console.log(cmfunc.getTimeStamp() + `/getBalanceSheet/${req.params.deoy}`);
    let sql;
    tbls['systeminfo'].findOne({systeminfoID:1}, function(errx, datx) {
      if (errx) throw errx;
      sysinfo = datx;
      sql = ` SELECT a.*, IFNULL((SELECT b.initbalance FROM accinit b WHERE (a.accountID=b.accountID) AND (b.groupID=${req.session.groupID}) ),0) AS 'initbalance'  `;
      sql += ` FROM account a `;
      sql += ` WHERE (a.lastitem = 1) AND (a.PLEnabled=0) AND (a.status=1)`;
      //console.log('sql: '+ sql);
      tbls["account"].execSQL(sql, function(erry, daty) {
        if (erry) throw erry;
        console.log('*****************dx0**************')
        console.table(daty);
        var actions = daty.map(fn);
        Promise.all(actions).then( function (dx1) {
          console.log('*****************dx1**************')
          console.table(dx1);
          var actionx = dx1.map(fn1);
          Promise.all(actionx).then( function (dx2) {
            console.log('**************dx2*****************')
            console.table(dx2);
            var actiony = dx2.map(fn2);
            Promise.all(actiony).then( function (dx3) {
              console.log('*************dx3******************')
              console.table(dx3);
              var actionz = dx3.map(fn3);
              Promise.all(actiony).then( function (dx4) {
                console.log('*************dx4******************')
                console.table(dx4);
                sql = ` SELECT a.*, a.parentID AS 'parentID', b.parentID AS 'gparentID', `;
                sql += ` UPPER(CONCAT(b.accountName_en,' - ',b.accountName_vi)) AS  'parentName', UPPER(CONCAT(c.accountName_en, ' - ',c.accountName_vi)) AS  'grandparentName' FROM account a, account b, account c `;
                sql += ` WHERE (a.lastitem = 1) AND (a.PLEnabled=0) AND (a.parentID = b.accountID) AND (b.parentID = c.accountID) AND (a.status=1)`;
                sql += ` ORDER BY a.parentID, a.accType`;
                console.log('sql: '+ sql);
                tbls["account"].execSQL(sql, function(error, result) {
                  if (error) throw error;
                  //console.table(result);
                  asset = result.filter(f=> f.grandparentName.includes('ASSETS')).reduce( function(a, b){ return a + b['balance']; }, 0);
                  liabilities = result.filter(f=> f.parentName.includes('LIABILITIES')).reduce( function(a, b){ return a + b['balance']; }, 0);
                  paidincapital = result.filter(f=> f.accountName_en=='Paid-In Capital')[0].balance;
                  netprofit = asset - liabilities - paidincapital;
                  console.log('asset:' + asset);
                  console.log('liabilities:' + liabilities);
                  console.log('paidincapital:' + paidincapital);
                  console.log('netprofit:' + netprofit);
                  divident = math.round(netprofit * sysinfo.dividents);
                  console.log(sysinfo.issuedshare);
                  result.filter(f=> f.accountName_en=='Dividents')[0].balance = divident;
                  result.filter(f=> f.accountName_en=='Dividents')[0].balancex = math.round(divident/sysinfo.issuedshare);
                  retainearning = netprofit - divident;
                  result.filter(f=> f.accountName_en=='Retained Earning')[0].balance = retainearning;
                  console.table(result);
                  res.send(result);
                })
              })
            })
          })
        })
      })
    })
  }
});


//******************************************************************
app.post('/getrego/:tbl', function (req, res) {
  if (cmfunc.isEmpty(req.session.user)) { res.redirect('/'); }// if user is not logged-in redirect back to login page //
  else {
    var tbl = req.params.tbl;
    console.log(cmfunc.getTimeStamp() + "/getrego/"+tbl);
    console.log(JSON.stringify(req.body));
    tbls[tbl].getAllRecords(req.body, null, function(error, data) {
      if (error) throw error;
      if (data) {
        res.send(JSON.stringify(data));
      }
    })
  }
});
app.post('/uploaddocs/:tbl/:searchkey/:id/:subdir', upload.any(), function (req, res) {
  if (cmfunc.isEmpty(req.session.user)) { res.redirect('/'); }// if user is not logged-in redirect back to login page //
  else {
    //console.log('body: '+ JSON.stringify(req.body));
    console.log(cmfunc.getTimeStamp() + "/uploaddocs/"+ req.params.tbl + "/" + req.params.searchkey+ "/" + req.params.id+ "/" + req.params.subdir);
    console.log(JSON.stringify(req.files.file_data));
    let tbl = req.params.tbl;
    let searchkey = req.params.searchkey;
    let id = req.params.id;
    let searchObj = {};
    searchObj[searchkey]= id;
    console.log(searchObj)
    tbls[tbl].find(searchObj, function (error, data) {
      if (error) { res.send(JSON.stringify({ error: 'deletefailed' }));
      } else {
        let filename, fname;
        let filesuploadcount = 0;
        let filescurrentcount = 0;
        let rego;
        let regolist = [];
        let destination;
        console.log('data: '+ JSON.stringify(data))
        if (data !== null) {
          filescurrentcount = data.length;
        }
        console.log('filescurrentcount: '+ filescurrentcount)
        console.log(req.files);
        let vfiles = req.files;
        filesuploadcount = vfiles.length;
        if ( (filesuploadcount + filescurrentcount ) > $CVar.maxRegoUpload) {
          res.send(JSON.stringify({ error: 'exceeduploadfilelimit' }));
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
            console.log('regolist: '+ JSON.stringify(regolist))
            destination = `${$CVar.localStorage}/${req.params.subdir}`;
            cmfunc.moveFile(fname, destination, function (e){
              if (e) throw e;
            })
          })
          insertRego(regolist, tbl, req, res);
        }
      }
    })
  }
})
app.post('/deletedocs/:tbl/:subdir', function (req, res) {
  if (cmfunc.isEmpty(req.session.user)) { res.redirect('/'); }// if user is not logged-in redirect back to login page //
  else {
    console.log('body: '+ JSON.stringify(req.body));
    console.log(cmfunc.getTimeStamp() + `/deletedocs/${req.params.tbl}/${req.params.subdir}`);
    let tbl = req.params.tbl;
    let fname;
    let searchkey = tbl+'ID';
    let id = req.body.key;
    let searchObj = {};
    searchObj[searchkey]= id;
    tbls[tbl].findOne(searchObj, function (error, data) {
      if (error) { res.send(JSON.stringify({ error: 'deletefailed' }));
      } else {
        fname = `${$CVar.localStorage}/${req.params.subdir}/${data.name}`;
        console.log('delete: ' + fname)
        if (fs.existsSync(fname)) {
          fs.unlinkSync(fname);
        }
        tbls[tbl].remove(searchObj, function (error, data) {
          if (error) { res.send(JSON.stringify({ error: 'Delete' }));
          } else {
            res.send([]);
          }
        })
      }
    })
  }
})

app.post('/deletealldocs/:tbl/:subdir', function (req, res) {
  if (cmfunc.isEmpty(req.session.user)) { res.redirect('/'); }// if user is not logged-in redirect back to login page //
  else {
    console.log('body: '+ JSON.stringify(req.body));
    console.log(cmfunc.getTimeStamp() + `/deletedocs/${req.params.tbl}/${req.params.subdir}`);
    let tbl = req.params.tbl;
    let fname;
    let searchObj = req.body;
    tbls[tbl].find(searchObj, function (error, data) {
      if (error) { res.send(JSON.stringify({ error: 'deletefailed' }));
      } else {
        data.forEach(f=>{
          fname = `${$CVar.localStorage}/${req.params.subdir}/${f.name}`;
          console.log('delete: ' + fname)
          if (fs.existsSync(fname)) {
            fs.unlinkSync(fname);
          }
        })
        tbls[tbl].remove(searchObj, function (error, data) {
          if (error) { res.send(JSON.stringify({ error: 'Delete' }));
          } else {
            res.send([]);
          }
        })
      }
    })
  }
})

function insertRego(assetrego, tbl, req, res) {
  tbls[tbl].insert(assetrego, function(error, data) {
    if (error) { res.send(JSON.stringify({ error: 'deletefailed' }));
    } else {
      res.send([]);
    }
  })
};

app.get('/download/:tblx', function (req, res) {
  if (cmfunc.isEmpty(req.session.user)) { res.redirect('/'); }// if user is not logged-in redirect back to login page //
  else {
    console.log(cmfunc.getTimeStamp() + "/download/"+ req.params.tblx);
    let url = req.originalUrl.split("/").pop();
    console.log("url: " + url)
    let tbl = url.split('?')[0];
    let searchkey = tbl+'ID';
    let id = url.split('?')[1].split('=')[1];
    let searchObj = {};
    searchObj[searchkey]= id;
    tbls[tbl].findOne(searchObj, function (error, data) {
      if (error) { res.send(JSON.stringify({ error: 'download failed' }));
      } else {
        const file = `${$CVar.localStorage}/${req.session.subdir}/${data.name}`;
        console.log(file)
        res.download(file); // Set disposition and send it.
      }
    })
  }
})


//************************************************** */
function prepareAccount(groupID, fromdt, todt, valid) {
    let fromtodatestr= `( (TO_DAYS(datePaid) >= TO_DAYS('${fromdt}')) AND (TO_DAYS(datePaid) <= TO_DAYS('${todt}')) ) `;
    let actions, results;
    var accountlist;
    return new Promise(function(resolve, reject) {
      let sql = `SELECT a.* FROM account a WHERE (a.status=1) AND (a.lastitem=1) AND (a.PLEnabled=1) `;
      //console.log('sql0: '+sql);
      tbls["account"].execSQL(sql, function(error, data) {
        if (error) { console.log(JSON.stringify({ status: 0, title: error }));
        } else {
          accountlist = Object.values(JSON.parse(JSON.stringify(data)));
          //console.log(accountlist);
          //console.log(accountlist.filter(f=> f.accountName_en=='Wages expenses')[0].accountID)
          sql = `SELECT ROUND(a.qty*a.price) AS 'Subtotal', ROUND(a.qty*a.price*c.taxrate) AS 'Subtax',`;
          sql += ` ROUND(a.qty*a.price) + ROUND(a.qty*a.price*c.taxrate) AS 'STotal', `;
          sql += ` c.accountID, DATE_FORMAT(b.dateAdded,"%Y-%m-%d") AS 'datePaid', a.saleID AS 'id', `;
          sql += ` e.accountName_vi AS 'name_vi', e.accountName_en AS 'name_en', c.productName AS 'notex',`;
          sql += ` f.accountName_vi AS 'pname_vi', f.accountName_en AS 'pname_en',  g.accountName_vi AS 'gpname_vi', g.accountName_en AS 'gpname_en' `;
          sql += ` FROM saleitems a, sale b, product c, category d, account e, account f, account g `;
          sql += ` WHERE (a.saleID=b.saleID) AND (c.categoryID=d.categoryID) AND (b.status=1)`;
          sql += ` AND (a.productID = c.productID) AND (b.groupID=${groupID})`;
          sql += ` AND (c.accountID=e.accountID) AND (e.parentID=f.accountID) AND (f.parentID=g.accountID) `
          if (valid==1) {
            sql += ` AND (b.incltax = 1) `;
          }
          sql += ` AND  ${fromtodatestr} `;
          console.log('sql1: '+sql);
          tbls["orderx"].execSQL(sql, function(error, datb) {
            if (error) { reject(0)
            } else {
              datblist = Object.values(JSON.parse(JSON.stringify(datb)));
              let wageexpenses = accountlist.filter(f=> f.accountName_en=='Wages expenses')[0].accountID;
              sql = `SELECT IF (a.accountID = ${wageexpenses}, ((a.amount+a.tax)*-1), (a.amount*-1)) AS 'Subtotal',`,
              sql += ` IF (a.accountID = ${wageexpenses}, 0, (a.tax*-1)) AS 'Subtax', `;
              sql += ` IF (a.accountID = ${wageexpenses}, ((a.amount+a.tax)*-1), (a.tax*-1)+(a.amount*-1)) AS 'STotal', `;
              sql += ` a.accountID, DATE_FORMAT(a.datePaid,"%Y-%m-%d") AS 'datePaid', a.expensesID AS 'id', `;
              sql += ` e.accountName_vi AS 'name_vi', e.accountName_en AS 'name_en',  a.comment AS 'notex', `;
              sql += ` f.accountName_vi AS 'pname_vi', f.accountName_en AS 'pname_en',  g.accountName_vi AS 'gpname_vi', g.accountName_en AS 'gpname_en' `;
              sql += ` FROM expenses a, account e, account f, account g `;
              sql += ` WHERE  (a.groupID=${groupID}) AND (a.status = 1)`;
              sql += ` AND (a.accountID=e.accountID) AND (e.parentID=f.accountID) AND (f.parentID=g.accountID) `
              sql += ` AND  ${fromtodatestr} `;
              console.log('sql2: '+sql);
              tbls["expenses"].execSQL(sql, function(error, datc) {
                if (error) { reject(0)
                } else {
                  //console.table(datb);
                  datclist = Object.values(JSON.parse(JSON.stringify(datc)));
                  //console.table(datclist)
                  let datd = datblist.concat(datclist);
                  console.table(datd);
                  resolve(datd)     
                }
              })
            }
          })
        }
      })
    })
  }

app.post('/getAccPL', function (req, res, next) {
    if (cmfunc.isEmpty(req.session.user)) { res.redirect('/'); }// if user is not logged-in redirect back to login page //
    else {
      console.log(req.body)
      console.log(cmfunc.getTimeStamp() + `/getAccPL`);
      
      prepareAccount(req.session.groupID,req.body.fromdate,req.body.todate,req.body.valid)
      .then (function (result) {
        //console.table(result)
        res.send(result)
      })
    }
})

 //*********** Payroll related functions *******************/
app.post('/getPayroll/:pid', function (req, res) {
  if (cmfunc.isEmpty(req.session.user)) { res.redirect('/'); }// if user is not logged-in redirect back to login page //
  else {
    console.log(cmfunc.getTimeStamp() + "/getPayroll/"+req.params.pid);
    let sql = `SELECT a.*, b.name, b.company, b.abn, b.address, b.provincesID, b.wardsID, b.phuongID `;
    sql += `FROM payroll a, memberx b WHERE (a.memberID = ${req.params.pid}) AND (a.memberID = b.memberID)`
    tbls["payroll"].execSQL(sql, function(error, data) {
      if (error) { res.send(JSON.stringify({ status: 0, title: error }));
      } else {
        //console.log(data)
        res.send(data);
      }
    })
  }
}); 

app.post('/getPayrollItem/:pid', function (req, res) {
  if (cmfunc.isEmpty(req.session.user)) { res.redirect('/'); }// if user is not logged-in redirect back to login page //
  else {
    console.log(cmfunc.getTimeStamp() + "/getPayrollItem/"+req.params.pid);
    let sql = `SELECT a.*  FROM payrollitem a WHERE (a.payrollID = ${req.params.pid})`
    tbls["payrollitem"].execSQL(sql, function(error, data) {
      if (error) { res.send(JSON.stringify({ status: 0, title: error }));
      } else {
        //console.log(data)
        res.send(data);
      }
    })
  }
}); 


app.post('/newPayroll', function (req, res) {
  if (cmfunc.isEmpty(req.session.user)) { res.redirect('/'); }// if user is not logged-in redirect back to login page //
  else {
    console.log(cmfunc.getTimeStamp() + "/newPayroll");
    console.log(req.body)
    let sql = `SELECT a.accountID, a.accountName_en  FROM account a WHERE `;
    sql += ` (a.accountName_en = 'Wages expenses') OR `;
    sql += ` (a.accountName_en = 'Payroll Tax') OR `;
    sql += ` (a.accountName_en = 'Superanuation')`;
    tbls["account"].execSQL(sql, function(error, data) {
      if (error) {  res.send({ status: 0});
      } else {
        //console.table(data)
        let sql = `SELECT a.memberID, a.consultantID  FROM memberx a WHERE `;
        sql += ` (a.groupID = ${req.session.groupID}) AND  (a.roleID = 8) AND (a.divisionID = 2) `;
        tbls["memberx"].execSQL(sql, function(errb, datb) {
          if (errb) { res.send({ status: 0});
          } else {
            //console.table(datb)
            let bhytldtn = parseInt(req.body.employersuper) + parseInt(req.body.employeesuper);
            sql = `INSERT INTO expenses (groupID, supplierID, accountID, amount, refID, comment) VALUES `;
            sql += `(${req.body.groupID}, ${req.body.supplierID}, ${data.filter(f=>f.accountName_en=='Wages expenses')[0].accountID}, ${req.body.payingamount}, '${req.body.refID}','${req.body.comment}'),`;
            sql += `(${req.body.groupID}, ${datb.filter(f=>f.consultantID==1)[0].memberID}, ${data.filter(f=>f.accountName_en=='Taxes payable')[0].accountID}, ${req.body.tax}, '${req.body.refID}','${req.body.comment}'),`;
            sql += `(${req.body.groupID}, ${datb.filter(f=>f.consultantID==2)[0].memberID}, ${data.filter(f=>f.accountName_en=='Superanuation')[0].accountID}, ${bhytldtn}, '${req.body.refID}','${req.body.comment}');`;
            console.log(sql)
            tbls["expenses"].execSQL(sql, function(errc, datc) {
              if (errc) {  res.send({ status: 0});
              } else {
                res.send({ status: 1});
              }
            })
          }
        })
      }
    })
  }
}); 

app.post('/newStockPurchase', function (req, res) {
  if (cmfunc.isEmpty(req.session.user)) { res.redirect('/'); }// if user is not logged-in redirect back to login page //
  else {
    console.log(cmfunc.getTimeStamp() + "/newStockPurchase");
    console.log(req.body);
    var data = req.body;
    let sql = `SELECT a.accountID, a.accountName_en  FROM account a WHERE `;
    sql += ` (a.accountName_en = 'Inventory cost') `;
    tbls["account"].execSQL(sql, function(error, datb) {
      if (error) {  res.send({ status: 0});
      } else {
        tbls["expenses"].insert({
          groupID: data.groupID,
          supplierID: data.supplierID,
          accountID: datb[0].accountID,
          amount: data.amount,
          tax: data.tax,
          refID: data.refID,
          comment: data.comment,
          status: data.status
        }, function(errc, datc) {
          if (errc) {  res.send({ status: 0});
          } else {
            res.send({ status: 1});
          }
        })
      }
    })
  }
}); 

app.post('/insertPayrollItem', function (req, res) {
  if (cmfunc.isEmpty(req.session.user)) { res.redirect('/'); }// if user is not logged-in redirect back to login page //
  else {
    console.log(cmfunc.getTimeStamp() + "/insertPayrollItem/");
    let sql = `SELECT a.*  FROM payrollitem a WHERE (a.status = 0) `;
    console.log('sql: ' + sql)
    console.log(req.body)
    tbls["payrollitem"].execSQL(sql, function(error, data) { 
      if (error) {  res.send(JSON.stringify({ status: 0}));
      } else {
        if (data.length > 0) { //Find if day record already existed - update or closed the working date
          let datx = data[0];
          datx.status = 1;
          let a = moment(datx.startTime);
          let b = moment();
          let duration = math.round(moment.duration(b.diff(a)).asHours() *100)/100;
          if (duration < 16) {
            datx.duration = duration;
            datx.endTime= moment().format("YYYY-MM-DD HH:mm:ss");
            datx.numHours = duration*12/16; //12t/ngay --> rateto 16t
          } else { // If not closing shift within 16 hours - default to 12 hrs working..
            datx.endTime= moment(datx.startTime).format("YYYY-MM-DD") + ' 22:00:00';
            let a = moment(datx.startTime);
            let b = moment(datx.endTime);
            datx.duration = math.round(moment.duration(b.diff(a)).asHours() *100)/100;
            datx.numHours = 12;
          }
          tbls["payrollitem"].save(datx, function(errx, datx) {
            if (errx) { res.send(JSON.stringify({ status: 0})); }
            tbls["payroll"].save({payrollID: datx.payrollID, numHours:datx.numHours}, function(erry, daty){
              res.send(JSON.stringify({ status: 2}));
            })
          })
        } else {
          newPayrollItem()
        }
      }
    })
  }


  function newPayrollItem() {
    console.log(req.body)

    let sql = `SELECT a.*  FROM payroll a WHERE (a.status = 0)  `;
    sql += ` AND ((TO_DAYS(a.fromDT) <= TO_DAYS(CURDATE()))  AND (TO_DAYS(a.toDT) >= TO_DAYS(CURDATE()))) `;
    console.log('sql: ' + sql)
    tbls["payroll"].execSQL(sql, function(errb, datb) {
      if (errb) { res.send(JSON.stringify({ status: 0}));
      } else {
        if (datb.length > 0) {
          sql = `SELECT a.* FROM payrollitem a WHERE (a.status = 1) AND  (TO_DAYS(a.workDate) = TO_DAYS('${moment().format("YYYY-MM-DD")}'))`;
          console.log('sql: ' + sql)
          tbls["payrollitem"].execSQL(sql, function(errz, datz) {
            if (errz) { res.send(JSON.stringify({ status: 0}));
            } else {
              if (datz.length > 0) {
                res.send(JSON.stringify({ status: -1})); //Working shift has closed
              } else {
                tbls["payrollitem"].insert({  // Create a new payrollitem
                  payrollID: datb[0].payrollID,
                  workDate: moment().format("YYYY-MM-DD"),
                  startTime: moment().format("YYYY-MM-DD HH:mm:ss"),
                  authorizedID: req.body.authorizedID,
                }, function(errx, datx) {
                  if (errx) { res.send(JSON.stringify({ status: 0}));
                  } else {
                    res.send(JSON.stringify({ status: 1 }));
                  } 
                })
              }
            } 
          })
        } else {
          let startDate = moment().startOf('month').format("YYYY-MM-DD HH:mm:ss");
          let endDate = moment(startDate).endOf('month').format("YYYY-MM-DD HH:mm:ss");
          tbls["payroll"].insert({
            memberID: req.body.memberID,
            fromDT: startDate,
            toDT: endDate,
            rateperHour: req.body.hourlyRate
          }, function(erry, daty) {
            if (erry) { res.send(JSON.stringify({ status: 0}));
            } else {
              tbls["payrollitem"].insert({  // Create a new payrollitem
                payrollID: daty.payrollID,
                workDate: moment().format("YYYY-MM-DD"),
                startTime: moment().format("YYYY-MM-DD HH:mm:ss"),
                authorizedID: req.body.authorizedID
              }, function(errx, datx) {
                if (errx) {  res.send(JSON.stringify({ status: 0}));
                } else {
                  res.send(JSON.stringify({ status: 1}));
                } 
              })
            } 
          })
        }
      }
    })
  }
  

 
}); 

app.post('/getAccInit', function (req, res) {
  if (cmfunc.isEmpty(req.session.user)) { res.redirect('/'); }// if user is not logged-in redirect back to login page //
  else {
    console.log(cmfunc.getTimeStamp() + "/getAccInit");
    console.log(req.body);
    let sql = `SELECT a.*, b.accountName_en, b.accountName_vi, c.name AS 'lastpersonName'  FROM accinit a, account b , memberx c`;
    sql += ` WHERE (a.accountID= b.accountID) AND (a.groupID=${req.session.groupID}) AND (a.lastPerson = c.memberID)`;
    tbls["account"].execSQL(sql, function(error, data) {
      if (error) {  res.send({ status: 0});
      } else {
        res.send(data);
      }
    })
  }
})






} //End of Module
