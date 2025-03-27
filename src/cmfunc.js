//var sig_schedReadyToSend = 0;
module.exports = {
  sig_panotvupdate: 0,
  set_panotvupdate: function(state) {
    this.sig_panotvupdate = state;
  },
  get_panotvupdate: function() {
    return this.sig_panotvupdate;
  },
  mqttClient:0,
  set_mqttClient: function(client) {
    this.mqttClient = client;
  },
  get_mqttClient: function() {
    return this.mqttClient;
  },
  sig_schedReadyToSend: 0,
  set_schedReadyToSend: function(state) {
    console.log('set...' + state);
    this.sig_schedReadyToSend = state;
  },
  get_schedReadyToSend: function() {
    return this.sig_schedReadyToSend;
  },
  isEmptyObj:  function (obj) {
      for(var key in obj) {
          if(obj.hasOwnProperty(key))
              return false;
      }
      return true;
  },
  isEmpty: function (value){
    return value === undefined || value === null || value.length === 0;
  },
  secondsToString: function (seconds) {
    var numyears = Math.floor(seconds / 31536000);
    var numdays = Math.floor((seconds % 31536000) / 86400); 
    var numhours = Math.floor(((seconds % 31536000) % 86400) / 3600);
    var numminutes = Math.floor((((seconds % 31536000) % 86400) % 3600) / 60);
    var numseconds = (((seconds % 31536000) % 86400) % 3600) % 60;
    var tyears = numyears > 0? numyears + "y ": "";
    var tdays = numdays > 0? numdays + "d ": numyears > 0? "0d ": "";
    var thours = numhours > 0? numhours + "h ": numdays > 0? "0h ": "";
    var tmins = numminutes > 0? numminutes + "m ": numhours > 0? "0m ": "";
    var tsecs = numseconds > 0? numseconds + "s ": numminutes > 0? "0s": "";    
    return tyears + tdays + thours + tmins + tsecs;  
  },
  getTimeStamp: function () {
    var currentdate = new Date();
    var datetime =  currentdate.getDate() + "/" + (currentdate.getMonth()+1)  + "/" + currentdate.getFullYear() + " @ ";
    datetime += currentdate.getHours() + ":"  + currentdate.getMinutes() + ":" + currentdate.getSeconds() + ": ";
    return datetime;
  },
  sendEmail: function (toemail, subjectx, textx, callback) {
    var tbls = require('./tables').tbls;
    console.log(this.getTimeStamp() + "/sendEmail.." + toemail);
    tbls['systeminfo'].findOne({systeminfoID:1}, function(error, data) {
      console.log( JSON.stringify(data,false,4));
      if (error) { console.log('error: '+ error)
      } else {
        var nodemailer = require('nodemailer');
        var transporter = nodemailer.createTransport({
          service: 'gmail',
          //host: "mail.icumedia.com.au",
          port: 465,
          secure: true,
          auth: {
            user: `${data.email}`,
            pass: `${data.pass}`,
          },
          tls: {
            rejectUnauthorized: false
          }
        });
        var mailOptions = {
          from: `${data.email}`,
          to: toemail,
          subject: subjectx,
          text: textx
        };
        transporter.sendMail(mailOptions, function(error, info){
          console.log("AA:" + JSON.stringify(info,false,4));
          console.log("bb:" + JSON.stringify(error,false,4));
          if (error) {
            callback(error);
          } else {
            console.log('Email sent: ' + info.response);
            callback('', true);
          }
        });
      }
    })
  },
  sendHtmlEmail: function (toemail, subjectx, textx, htmlx, callback) {
    var tbls = require('./tables').tbls;
    console.log(this.getTimeStamp() + "/sendEmail.." + toemail);
    tbls['systeminfo'].findOne({systeminfoID:1}, function(error, data) {
      if (error) { console.log('error: '+ error)
      } else {
        var nodemailer = require('nodemailer');
        var transporter = nodemailer.createTransport({
          //service: 'gmail',
          host: "mail.icumedia.com.au",
          port: 465,
          secure: true,
          auth: {
            user: `${data.email}`,
            pass: `${data.pass}`,
          },
          tls: {
            rejectUnauthorized: false
          }
        });
        var mailOptions = {
          from: `${data.email}`,
          to: toemail,
          subject: subjectx,
          text: textx
        };
        transporter.sendMail(mailOptions, function(error, info){
          if (error) {
            callback(error);
          } else {
            console.log('Email sent: ' + info.response);
            callback('', true);
          }
        });
      }
    })
  },
  sendEmailwithAttachment: function (toemail, subjectx, textx, attachs, callback) {
    var tbls = require('./tables').tbls;
    console.log(this.getTimeStamp() + "/sendEmail.." + toemail);
    tbls['systeminfo'].findOne({systeminfoID:1}, function(error, data) {
      if (error) { console.log('error: '+ error)
      } else {
        var nodemailer = require('nodemailer');
        var transporter = nodemailer.createTransport({
          //service: 'gmail',
          host: "mail.icumedia.com.au",
          port: 465,
          secure: true,
          auth: {
            user: `${data.email}`,
            pass: `${data.pass}`,
          },
          tls: {
            rejectUnauthorized: false
          }
        });
        var mailOptions = {
          from: `${data.email}`,
          to: toemail,
          subject: subjectx,
          text: textx,
          attachments: attachs
        };
        transporter.sendMail(mailOptions, function(error, info){
          if (error) {
            callback(error);
          } else {
            console.log('Email sent: ' + info.response);
            callback('', true);
          }
        });
      }
    })
  },
  mkdir: function (dir, callback){
    var fs = require('fs');
    if (!fs.existsSync(dir)){
      fs.mkdirSync(dir, 0744);
      callback(1);
    } else {
      callback(0);
    }
  },
  rmdir: function (dir){
    var fs = require('fs');
    var rimraf = require("rimraf");
    rimraf.sync(dir);
  },
  //moves the $file to $dir2
  moveFile: function(file, dir2, callback) {
    var fs = require('fs');
    var path = require('path');
    //gets file name and adds it to dir2
    var f = path.basename(file);
    var dest = path.resolve(dir2, f);

    fs.rename(file, dest, (err)=>{
      if(err) callback(err);
      else callback(0);
    });
  },

  renameFile: function(file1, file2, callback) {
    var fs = require('fs');
    fs.rename(file1, file2, (err)=>{
      if(err) callback(err);
      else callback(0);
    });
  }


} //end of module
