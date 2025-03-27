module.exports = function(app){
  var http = require("http");
  var path = require('path');
  var fetch = require('node-fetch');
  var merge = require('merge'), original, cloned;
  var nodemailer = require('nodemailer');
  var moment = require('moment');
  var path = require('path');
  var cmfunc = require('./cmfunc');
  var tbls = require('./tables').tbls;

  const fileUpload = require('express-fileupload');
  var fs = require("fs"); //Load the filesystem module

  app.get('/member', function(req, res, next){
    if (cmfunc.isEmpty(req.session.user)) { res.redirect('/'); }
    else {
      try {
        console.log(cmfunc.getTimeStamp() + 'GET request to /member');
        let sql0 = `SELECT a.*, b.name AS "lastPersonName"`;
        sql0 += ` FROM memberx a, memberx b`;
        sql0 += ` WHERE  (a.groupID = ${req.session.groupID}) AND (a.lastPerson = b.memberID) `; 
        tbls['memberx'].execSQL(sql0, function(error, result) {
          if (error) throw error;
          //console.log("result: "  + JSON.stringify(result,false,4));
          res.send(result);
        })
      } catch (error) {
        res.send({ error: -1, message: 'Unknown exception' });
        console.log('API-Exception', error);
      }
    }
  });

  app.get('/getresources', function(req, res, next){
    if (cmfunc.isEmpty(req.session.user)) { res.redirect('/'); }
    else {
      try {
        console.log(cmfunc.getTimeStamp() + 'GET request to /getresources');
        let sql0 = `SELECT a.memberID AS "id", CONCAT(a.position,"-",a.abbrName) AS "text"`;
        sql0 += ` FROM memberx a `;
        sql0 += ` WHERE  (a.groupID = ${req.session.groupID})`;
        sql0 += ` AND (a.divisionID <= 2)`; 
        tbls['memberx'].execSQL(sql0, function(error, result) {
          if (error) throw error;
          //console.log("result: "  + JSON.stringify(result,false,4));
          res.send(result);
        })
      } catch (error) {
        res.send({ error: -1, message: 'Unknown exception' });
        console.log('API-Exception', error);
      }
    }
  });
  
  app.get('/todolist/:datx', function(req, res, next){
    if (cmfunc.isEmpty(req.session.user)) { res.redirect('/'); }// if user is not logged-in redirect back to login page //
    else {
      try {
        console.log(cmfunc.getTimeStamp() + `GET request to /todolist/${req.params.datx}`);
        
        let sql0 = `SELECT a.*, b.taskName, b.taskID, b.taskDescription, b.endDate AS 'endDate', b.completion, b.usedHrs,  `;
        sql0 += ` CONCAT(f.projectNumber,"-",e.areaNumber,"-",LPAD(d.moduleSeq,2,0),":",b.taskID) AS 'projNum' `;
        sql0 += ` FROM todolist a, task b, phase c, module d, area e, project f`; 
        sql0 += ` WHERE  (a.taskID = b.taskID) AND (a.taskID > 0) AND (b.phaseID = c.phaseID) AND (c.moduleID = d.moduleID) AND (d.areaID = e.areaID) AND (e.projectID = f.projectID)`;
        sql0 += ` AND ((TO_DAYS('${req.params.datx}') >= TO_DAYS(b.startDate)) AND (TO_DAYS('${req.params.datx}') <= TO_DAYS(b.endDate)))`;
        sql0 += ` AND (a.assignTo = ${req.session.memberID})`;
        //console.log("sql0: "  + sql0);
        
        const fn0 = new Promise((resolve, reject) => {
          tbls["todolist"].execSQL(sql0, function(error, data) {
            if (error) { reject(error) ;
            } else {
              //console.log("result0: "  + JSON.stringify(data,false,4));
              resolve(data);
            }
          })
        })
        
        let fn3 = function getCompletion(dat) {
          return new Promise((resolve, reject) => {
            let sql0 = `SELECT MAX(a.completion) AS "maxCompletion", SUM(a.duration) AS "usedHrs" `;
            sql0 += ` FROM timeevent a WHERE (a.todolistID = ${dat.todolistID})`;
            //console.log('sql0: ' + sql0);
            tbls["todolist"].execSQL(sql0, function(error, data) {
              if (error) { reject(error) ;
              } else {
                let maxVal = data[0].maxCompletion > 0 ?data[0].maxCompletion:0;
                let usedVal = data[0].usedHrs > 0 ?data[0].usedHrs:0;
                let sql1 = `UPDATE task SET completion = ${maxVal}, usedHrs = ${usedVal} WHERE (taskID = ${dat.refID})`;
                //console.log('sql1: ' + sql1);
                tbls["task"].execSQL(sql1, function(errorb, datb) {
                  if (errorb) { reject(errorb) ;
                  } else {
                    dat.progress = maxVal;
                    dat.usedHrs = usedVal;
                    resolve(dat);
                  }
                })
              }
            })
          })
        }
        Promise.all([fn0])
        .then((responses) => {
          console.log("responses: "  + JSON.stringify(responses,false,4));
          var todolist = [];
          responses[0].forEach((aa) => {
            var todox = {};
            todox.todolistID = aa.todolistID;
            todox.projNum = aa.projNum;
            todox.name = aa.taskName;
            todox.description = aa.taskDescription;
            todox.endDate = aa.endDate;
            todox.progress = aa.completion.toFixed(2);
            todox.usedHrs = aa.usedHrs;
            todox.refID = aa.taskID;
            todolist.push(todox);
          })
          //console.log("todolist: "  + JSON.stringify(todolist,false,4));
          var actions = todolist.map(fn3);
          Promise.all(actions).then( function (d1) {
            //console.log("d1: "  + JSON.stringify(d1,false,4));
            res.send(d1);
          })
        })
        .catch((error) => {
          res.send({ error: -1, message: 'Unknown exception' });
          console.log('API-Exception', error);
        });

      } catch (error) {
        res.send({ error: -1, message: 'Unknown exception' });
        console.log('API-Exception', error);
      }
    }
  })

  app.get('/timeevent/:datx', function(req, res, next){
    if (cmfunc.isEmpty(req.session.user)) { res.redirect('/'); }// if user is not logged-in redirect back to login page //
    else {
      try {
        console.log(cmfunc.getTimeStamp() + `GET request to /timeevent/${req.params.datx}`);
        //Scan for task...
        let sql0 = `SELECT x.*, b.taskName AS 'name', CONCAT(f.projectNumber,"-",e.areaNumber,"-",LPAD(d.moduleSeq,2,0),":",b.taskID) AS 'projNum' `;
        sql0 += ` FROM timeevent x, todolist a, task b, phase c, module d, area e, project f`; 
        sql0 += ` WHERE  (x.todolistID = a.todolistID) AND ((a.taskID = b.taskID) AND (a.taskID > 0)) AND (b.phaseID = c.phaseID) `; 
        sql0 += ` AND (c.moduleID = d.moduleID) AND (d.areaID = e.areaID) AND (e.projectID = f.projectID)`;
        sql0 += ` AND ((TO_DAYS('${req.params.datx}') = TO_DAYS(x.clockin)) AND (TO_DAYS('${req.params.datx}') = TO_DAYS(x.clockout)))`;
        sql0 += ` AND (a.assignTo = ${req.session.memberID})`;
        //console.log("sql0: "  + sql0);
                
        tbls['timeevent'].execSQL(sql0, function(error0, result) {
          if (error0) throw error0;
          res.send(result);
        })
      } catch (error) {
        res.send({ error: -1, message: 'Unknown exception' });
        console.log('API-Exception', error);
      }
    }
  })

  app.get('/timesheet/:datx', function(req, res, next){
    if (cmfunc.isEmpty(req.session.user)) { res.redirect('/'); }
    else {
      try {
        console.log(cmfunc.getTimeStamp() + `GET request to /timesheet/${req.params.datx}`);
        var startDate = moment(req.params.datx).startOf('year').format("YYYY-MM-DD");
        var endDate = moment(req.params.datx).endOf('year').format("YYYY-MM-DD");
        console.log("start: " + startDate + ", end:" + endDate);
        let sql0 = `SELECT a.*, b.name AS "lastPersonName"`;
        sql0 += ` FROM timesheet a, memberx b`;
        sql0 += ` WHERE  (a.memberID = ${req.session.memberID}) AND (b.groupID = ${req.session.groupID}) AND (a.lastPerson = b.memberID) `;
        sql0 += ` AND (((TO_DAYS(a.fromDate) >= TO_DAYS("${startDate}")) AND (TO_DAYS(a.toDate) <= TO_DAYS("${endDate}"))) `; 
        sql0 += ` AND ((TO_DAYS(a.toDate) > TO_DAYS("${startDate}")) AND (TO_DAYS(a.toDate) < TO_DAYS("${endDate}"))))`;
        //console.log("sql0: " + sql0 );
        tbls['memberx'].execSQL(sql0, function(error, result) {
          if (error) throw error;
          //console.log("result: "  + JSON.stringify(result,false,4));
          res.send(result);
        })
      } catch (error) {
        res.send({ error: -1, message: 'Unknown exception' });
        console.log('API-Exception', error);
      }
    }
  });

  app.get('/timeevent/:tid/:fromx/:tox', function(req, res, next){
    if (cmfunc.isEmpty(req.session.user)) { res.redirect('/'); }// if user is not logged-in redirect back to login page //
    else {
      try {
        console.log(cmfunc.getTimeStamp() + `GET request to /timeevent/${req.params.tid}/${req.params.fromx}/${req.params.tox}`);
        var tid = req.params.tid;
        //Scan for task...
        var sql0 = `SELECT  SUM(x.duration) AS 'dur',  DATE(x.clockin) AS "datex" , `; 
        sql0 += ` b.taskName AS 'name', CONCAT(f.projectNumber,"-",e.areaNumber,"-",LPAD(d.moduleSeq,2,0),":",b.taskID) AS 'projNum' `;
        sql0 += ` FROM timeevent x, todolist a, task b, phase c, module d, area e, project f`; 
        sql0 += ` WHERE  (x.todolistID = a.todolistID) AND ((a.taskID = b.taskID) AND (a.taskID > 0)) AND (b.phaseID = c.phaseID) `; 
        sql0 += ` AND (c.moduleID = d.moduleID) AND (d.areaID = e.areaID) AND (e.projectID = f.projectID)`;
        sql0 += ` AND ((TO_DAYS('${req.params.fromx}') <= TO_DAYS(x.clockin)) AND (TO_DAYS('${req.params.tox}') >= TO_DAYS(x.clockout)))`;
        sql0 += ` AND (a.assignTo = ${req.session.memberID})`;
        sql0 += ` GROUP BY datex, projNum`;
        //console.log("sql0: "  + sql0);
        
        const fn0 = new Promise((resolve, reject) => {
            //console.log("sql0: "  + sql0);
            tbls["timeevent"].execSQL(sql0, function(error, data) {
              if (error) { reject(error) ;
              } else {
                //console.log("result0: "  + JSON.stringify(data,false,4));
                resolve(data);
              }
            })
        })
       
        Promise.all([fn0])
        .then((responses) => {
          //console.log("responses: "  + JSON.stringify(responses,false,4));
          const result = responses[0];
          var totalHrsx = result.reduce((total, next) => total + next.dur, 0);
          tbls['timesheet'].save({timesheetID: tid, totalHrs: totalHrsx }, function(error, resx){
            if (error) throw error;
              res.send(result);
          })
        })
        .catch((error) => {
          res.send({ error: -1, message: 'Unknown exception' });
          console.log('API-Exception', error);
        });
      } catch (error) {
        res.send({ error: -1, message: 'Unknown exception' });
        console.log('API-Exception', error);
      }
    }
  })

  

  

  



} //End of Module
