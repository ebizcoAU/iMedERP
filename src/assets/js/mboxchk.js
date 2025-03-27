
import QrScanner from "./qr-scanner.min.js";
const camList = document.getElementById('cam-list');
const camQrResult = document.getElementById('cam-qr-result');
var weburl  = $('#weburl').text();
var saveprod = ``;
var scanner;
var roleID = $('#roleid').text();
var tempResult = '';
var timerInterval;
var boxID = 0;
var audioCreated = false;


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
    }
    okBeep.play();
}

var pidx = getCookie("pidx");
var puuid = $('#puuid').text();
if (pidx && pidx.length > 0) {
    deleteCookie("pidx")
    getproductdetail(pidx);
} else if (puuid && puuid.length > 0) {
    getproductdetail(puuid);
}

//************************** */

    $('#scanqrcode').html(formatMessage('scanqrcode'));
    $('#counter').html(`0`);

//************************** */

var prodlist = [];
$('#butTxt').html(formatMessage("scanqrcode"));


$('#qrcode').on("click", function() {
    initAudio()
    if ($('#butTxt').text().trim() == formatMessage("scanqrcode")) {
        reset();
        saveprod = $('#maindisplay').html();
        $('#butTxt').html(formatMessage("stoptext"));
        if (getCookie('scannerMode')=='ON'){
            HWScannerStart();
        } else {
            $('#maindisplay').html(`<div id="video-container"><video id="qr-video" class="card-top-image"></video></div>`);
            const video = document.getElementById('qr-video');
            const videoContainer = document.getElementById('video-container');
            scanner = new QrScanner(video, result => setResult(camQrResult, result,{maxScansPerSecond:1}), {
                onDecodeError: error => {
                },
                highlightScanRegion: true,
                highlightCodeOutline: true,
            });
            scanner.start();
            // for debugging
            window.scanner = scanner;
        }
    } else {
        $('#butTxt').html(formatMessage("scanqrcode"));
        if (getCookie('scannerMode')=='ON'){
            HWScannerStop();
        } else {
            closeScanner();
        }
    }
})

function closeScanner() {
    $('#maindisplay').html(saveprod);
    scanner.stop();
    scanner.destroy();
    scanner = null;
    tempResult = '';
}

function setResult(label, result) {
    var scanUrl = result.data;
    if (scanUrl.includes(`${weburl}/boxchk`)) {
        if (scanUrl === tempResult) {
        } else {
            if (getCookie('scannerMode')=='ON') {
                HWScannerStop();
            } else {
                scanner.stop();
            } 
            tempResult = scanUrl;
            clearTimeout(timerInterval);
            timerInterval = setTimeout(function() {
                tempResult = ''; //Clear temp result..
            }, 30000);
            if (scanUrl && scanUrl.split("?").length>1 && scanUrl.split("?")[1].split("&").length>0) {
                let boxidx = scanUrl.split("?")[1].split("&")[0];
                getboxdetail(boxidx);
            } else {
                warningBeep.play();
                screenLog(formatMessage("invalidbox"), "error");
                setTimeout(function() {
                    if (getCookie('scannerMode')=='ON') {
                    } else {
                        scanner.start();
                    } 
                }, 1000);

            }
        }
    } else {
        screenLog(formatMessage("invalidbox"), "error");
        warningBeep.play();
    }
    
}

function getproductdetail(boxID) {
    const deferred = $.Deferred();
    $.ajax({
        url: `/get/proditem/boxID/eq/${boxID}/null/null/null/null`,
        method: "POST",
        dataType: "json",
        success: function(data) {
            deferred.resolve(data);
        },
        error: function() {
            deferred.reject("Data Loading Error");
        },
        timeout: 5000
    });
    deferred.promise().then((datx)=>{
        if (datx) {
            if (datx.length > 0) {
                updateDisplayList(datx);
            } else { 
                screenLog(formatMessage("boxempty"), 'warning')
                if (audioCreated) warningBeep.play()
            }
            closeScanner();
        } else {
            if (audioCreated) warningBeep.play();
            screenLog(formatMessage("invalidbox"), "error");
        }
    })
}


function getboxdetail(uuid) {
    const deferred = $.Deferred();
    $.ajax({
        url: `/boxdetail/${uuid}`,
        method: "POST",
        dataType: "json",
        success: function(data) {
            deferred.resolve(data[0]);
        },
        error: function() {
            deferred.reject("Data Loading Error");
        },
        timeout: 5000
    });
    deferred.promise().then((datx)=>{
        if (datx) {
            if (datx.status==0) {
                screenLog(formatMessage("boxempty"), 'warning')
                if (audioCreated) warningBeep.play()
            } else if (datx.status == 2) {  
                screenLog(formatMessage("boxactivated"), 'warning')
                if (audioCreated) warningBeep.play() 
            } else if (datx.status==1) { 
                screenLog(formatMessage("boxused"), 'warning')
                if (audioCreated) okBeep.play();
                $('#boxid').html(`${datx.refID}`);
                $('#maindisplay').html(`<div class="dz-list style-3"><ul>
                    <li>
                        <div class="item-content">
                            <div class="item-media media media-95"><img src="./public/${datx.subdir}/${datx.imgLink}" alt="logo">
                                <a href="javascript:void(0);" class="item-bookmark icon-4">
                                </a>  
                            </div>
                            <div class="item-inner">
                                <div class="item-title-row">
                                    <h5 class="item-title sub-title"><a href="javascript:void(0);">${datx.productName.split("-")[0].trim()}</a></h5>
                                    <div class="item-subtitle text-soft">${datx.productName.split("-")[1].trim()}</div>
                                </div>
                            </div>
                        </div>
                    </li>   
                </ul></div>`);
                getproductdetail(datx.boxID)
            }
        }
    })
}


function updateDisplayList(data) {
    let lineindex = 0;
    data.forEach((m, index) =>{
        if (index%3==0) {
            lineindex = index;
            $('#prodlist').append(`
            <li id="${m.proditemID}">
                <div class="item-content">
                    <div class="item-inner">
                        <div class="item-footer line${index}">
                            <h6 class="item-title sub-title"><a href="javascript:void(0);">${m.refID.trim()}</a></h6>
                            
                        </div>
                    </div>
                </div>
            </li>
        `);
        } else {
            $(`.line${lineindex}`).append(`
                <h6 class="item-title sub-title"><a href="javascript:void(0);">${m.refID.trim()}</a></h6>
            `); 
        }
        
    })
    $('#counter').html(`${data.length}`);
}

function reset() {
    prodlist = [];
    boxID = 0;
    $('#boxid').html(``);
    $('#prodlist').empty();
    $('#counter').html(`0`);
}



//**************************** */
function HWScannerStart() {
    var code = "";
    document.addEventListener('keypress', e => {
        //usually scanners throw an 'Enter' key at the end of read
        //console.log(e.key)
        if (e.key === 'Enter') {
            console.log(code);
            /// code ready to use 
            setResult("scanner", {data:code});  
            code = "";  
        } else {
            code += e.key; //while this is not an 'enter' it stores the every key            
        }
    });
};
function HWScannerStop() {
    var code = "";
    document.removeEventListener('keypress', e => {
        console.log("SCANNER stop...")           
    });

    
};
