
import QrScanner from "./qr-scanner.min.js";
const camList = document.getElementById('cam-list');
const camQrResult = document.getElementById('cam-qr-result');
$('#pagetitle').html(formatMessage('timekeeping'));
var weburl  = $('#weburl').text();
var scanner;
var roleID = $('#roleid').text();
var tempResult = '';
var timerInterval;
var staffID = 0;
var audioCreated = false;
var qrcodeStat = false;
var latitude = 0.00;
var longitude = 0.00;

//*** initizie sound player ****
const okBeep = new Audio();
okBeep.autoplay = false;
okBeep.src = './assets/audio/beep.mp3';

const warningBeep = new Audio();
warningBeep.autoplay = false;
warningBeep.src = './assets/audio/bad.mp3';

//************************* */
function initAudio() {
    if (!audioCreated) {
        okBeep.play();
        okBeep.pause();
        warningBeep.play();
        warningBeep.pause();
        audioCreated = true;
    } else {
        okBeep.play();
    }
}

    

//************************** */
$(function() {
    $('#qrcode').click(); 
});

$('#staffid').html(`<p style="font-size:16px">${formatMessage('scanqrtimekeeping')}</p>`)

$('#qrcode').on("click", function() {
    initAudio();
    if (!qrcodeStat) {
        console.log("SCAN ON")
        $('#qrcode').html(`<i class="fa fa-stop">`);
        qrcodeStat = true;
        $('#maindisplay').html(`<div id="video-container"><video id="qr-video"></video></div>`);
        const video = document.getElementById('qr-video');
        scanner = new QrScanner(video, result => setResult(camQrResult, result,{maxScansPerSecond:1}), {
            onDecodeError: error => {
            },
            highlightScanRegion: true,
            highlightCodeOutline: true,
        });
        scanner.start();
        // for debugging
        window.scanner = scanner;
    } else {
        console.log("SCAN OFF")
        qrcodeStat = false;
        $('#qrcode').html(`<i class="fa fa-qrcode">`);
        closeScanner();
    }
})

function closeScanner() {
    scanner.stop();
    scanner.destroy();
    scanner = null;
    tempResult = '';
}

function setResult(label, result) {
    var scanUrl = result.data;
    console.log("scanurl: " + scanUrl)
    console.log("weburl: " + `${weburl}/staff`)
    if (scanUrl.includes(`${weburl}/staff`)) {
        if (scanUrl === tempResult) {
        } else {
            scanner.stop();
            tempResult = scanUrl;
            clearTimeout(timerInterval);
            timerInterval = setTimeout(function() {
                tempResult = ''; //Clear temp result..
            }, 5000);
            if (scanUrl && scanUrl.split("?").length>1) {
                okBeep.play();
                let datx = scanUrl.split("?")[1];
                let staffidx = datx.substring(3,10);
                let timedx = datx.substring(10)
                //console.log("staffidx: " + staffidx)
                //console.log("timedx: " + timedx)
                let timediff =  (Math.floor(Date.now()/1000)) - timedx;
                if (timediff > 60) {
                    screenLog(formatMessage("invalidstaffid"), "error");
                    setTimeout(function() {
                        scanner.start();
                    }, 1000);
                } else {
                    //getLocation();
                    //setCookie('cid', staffidx);
                    //setCookie('cidlong', longitude);
                    //setCookie('cidlat', latitude);
                    getstaffdetail(staffidx);
                }
            } else {
                warningBeep.play();
                screenLog(formatMessage("invalidstaffid"), "error");
                setTimeout(function() {
                    scanner.start();
                }, 1000);
            }
        }

    } else {
        screenLog(formatMessage("invalidqrcode"), "error");
        warningBeep.play();
    }
    
}

function getLocation(){
    if(navigator.geolocation){
       // timeout at 60000 milliseconds (60 seconds)
      var options = {timeout:60000};
      navigator.geolocation.getCurrentPosition(showLocation, errorHandler, options);
    } else{
      console.log("Sorry, browser does not support geolocation!"); //Send msg to server
    }
}

function showLocation(position) {
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;
    console.log("latitude: " + latitude + ", longitude: "+ longitude);
}

function errorHandler(err) {
    if(err.code == 1) {
       console.log("Error: Access is denied!");
    } else if( err.code == 2) {
       console.log("Error: Position is unavailable!");
    }
}  

function getstaffdetail(uuid) {
    sendRequest(`/staffdetails/${uuid}`)
    .then((data)=>{
        if (data.status == 0) {
            if (audioCreated) warningBeep.play();
            screenLog(formatMessage("invalidstaffid"), "error");
        } else {
            let datx= data.data;
            if (datx) {
                if ((datx.status==1) && (((datx.roleID==7) && ((datx.divisionID==2)||(datx.divisionID==3))) || (datx.roleID==6))) {
                    if (audioCreated) okBeep.play();
                    sendRequest(`/staffdetails/${memberID}`).then((daty)=>{
                        sendRequest(`/insertPayrollItem`, 'POST',{
                            memberID: memberID,
                            authorizedID: datx.memberID,
                            hourlyRate: daty.data.hourlyRate
                        }).then((datb)=>{
                            console.log(datb);
                            if (datb.status == 0) {
                                screenLog(formatMessage("errorupdating"), "error");
                            } else if (datb.status == 1 ) {
                                screenLog(formatMessage("timesheetstart"), "success");
                            } else if (datb.status == 2 ) {
                                screenLog(formatMessage("timesheetend"), "success");
                            } else if (datb.status == -1 ) {
                                screenLog(formatMessage("timesheetclosed"), "info");
                            }
                            setTimeout(function() {
                                window.location = `/mindex`;
                            }, 2000)
                        })
                    })
                } else { 
                    screenLog(formatMessage("invalidstaffid"))
                    if (audioCreated) warningBeep.play()
                }
            } else {
                if (audioCreated) warningBeep.play();
                screenLog(formatMessage("invalidstaffid"), "error");
            }
        }
    })
    
}

function sendRequest(url, method = 'GET', data) {
    const d = $.Deferred();
    console.log("url: " + url)
    $.ajax(url, {
      method,
      data,
      dataType: "json",
      cache: false,
      xhrFields: { withCredentials: true },
    }).done((result) => {      
        //console.log(JSON.stringify(result, false, 4))
        d.resolve(result);
      
    }).fail((xhr) => {
      d.reject(xhr.responseJSON ? xhr.responseJSON.Message : xhr.statusText);
    });

    return d.promise();
  }

    



