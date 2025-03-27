
import QrScanner from "./qr-scanner.min.js";
const camList = document.getElementById('cam-list');
const camQrResult = document.getElementById('cam-qr-result');
$('#pagetitle').html(formatMessage('idscan'));
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

$('#staffid').html(`<p style="font-size:16px">${formatMessage('scanqr4id')}</p>`)

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
    if (scanUrl.includes(`${weburl}/prodqrchk`)) {
        if (scanUrl === tempResult) {
        } else {
            scanner.stop();
            tempResult = scanUrl;
            clearTimeout(timerInterval);
            timerInterval = setTimeout(function() {
                tempResult = ''; //Clear temp result..
            }, 5000);
            
        }
    } else if (scanUrl.includes(`${weburl}/staff`)) {
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
                    getLocation();
                    setCookie('cid', staffidx)
                    setCookie('cidlong', longitude)
                    setCookie('cidlat', latitude)
                    window.location= `/mcheckout`
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

    



