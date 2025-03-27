
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
var idx=[];
var splitModeOn = false;
var curPalletID = 0;
var curboxQty = 0;
var curPalletUUID = 0;
var curProductID = 0;

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

//************************** */

    $('#scanqrcode').html(formatMessage('scanqrcode'));
    $('#counter').html(`0`);
    $('#splitTxt').html(`${formatMessage('splitx')}`);

//************************** */

var boxlist = [];
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
    $('#maindisplay').html(``);
    scanner.stop();
    scanner.destroy();
    scanner = null;
    tempResult = '';
}

function setResult(label, result) {
    var scanUrl = result.data;
    console.log(scanUrl)
    if (scanUrl.includes(`${weburl}/p/`)) {
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
            if (scanUrl && scanUrl.split("/").length>1 && scanUrl.split("/").pop()) {
                let boxidx = scanUrl.split("/").pop();
                getpalletdetail(boxidx);
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

function getboxdetail(palletID) {
    const deferred = $.Deferred();
    $.ajax({
        url: `/get/box/palletID/eq/${palletID}/null/null/null/null`,
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
                curboxQty = datx.length;
                updateDisplayList(datx);
            } else { 
                screenLog(formatMessage("palletempty"), 'warning')
                if (audioCreated) warningBeep.play()
            }
            closeScanner();
        } else {
            if (audioCreated) warningBeep.play();
            screenLog(formatMessage("invalidpallet"), "error");
        }
    })
}


function getpalletdetail(uuid) {
    const deferred = $.Deferred();
    $.ajax({
        url: `/palletdetail/${uuid}`,
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
            if (!splitModeOn) {
                if (datx.status==0) {
                    screenLog(formatMessage("palletempty"), 'warning')
                    if (audioCreated) warningBeep.play()
                } else if (datx.status == 2) {  
                    screenLog(formatMessage("palletactivated"), 'warning')
                    if (audioCreated) warningBeep.play() 
                } else if (datx.status==1) { 
                    if (audioCreated) okBeep.play();
                    curPalletID = datx.palletID;
                    curPalletUUID = datx.uuID;
                    curProductID= datx.productID;
                    $('#palletid').html(`${datx.refID}`);
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
                    getboxdetail(datx.palletID);
                }
            } else {
                splitModeOn = false;
                if (datx.status==0) {
                    if (audioCreated) okBeep.play();
                    submitSplit(datx.palletID);
                } else if (datx.status == 2) {  
                    screenLog(formatMessage("palletactivated"), 'warning')
                    if (audioCreated) warningBeep.play(); 
                    closeScanner();
                } else if (datx.status==1) { 
                    screenLog(formatMessage("palletused"), 'warning')
                    if (audioCreated) warningBeep.play();
                    closeScanner();
                }
            }
            
        }
    })
}


function updateDisplayList(data) {
    let lineindex = 0;
    data.forEach((m, index) =>{
        if (index%3==0) {
            lineindex = index;
            $('#boxlist').append(`
            <li id="${m.boxID}">
                <div class="item-content">
                    <div class="item-inner">
                        <div class="item-footer line${index}">
                            <input type="checkbox" name="idx" id="idx_${m.refID.trim()}" value="${m.boxID}" > 
                                <label for="idx">${m.refID.trim()}</label>
                            </div>
                        </div>
                    </div>
                </div>
            </li>
        `);
        } else {
            $(`.line${lineindex}`).append(`
                <input type="checkbox" name="idx" id="idx_${m.refID.trim()}" value="${m.boxID}" > 
                    <label for="idx">${m.refID.trim()}</label>
                </div>
            `); 
        }
        
    })
    $('#counter').html(`${data.length}`);
}

function reset() {
    boxlist = [];
    boxID = 0;
    $('#palletid').html(``);
    $('#boxlist').empty();
    $('#counter').html(`0`);
}

$('#splitx').on("click", function() {
    initAudio();
    var form_data = new FormData(document.querySelector("form"));
    splitModeOn=true;
    idx=[];
    for(var pair of form_data.entries())  {
        if (pair[0]=="idx") idx.push(pair[1])
    }
    if (idx.length > 0) {
        curboxQty -= idx.length;
        if ($('#butTxt').text().trim() == formatMessage("scanqrcode")) {
            saveprod = $('#maindisplay').html();
            $('#butTxt').html(formatMessage("stoptext"));
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
            window.scanner = scanner;
        } else {
            closeScanner();
        }
    } else {
        screenLog(formatMessage('palletempty'), 'warning');
        warningBeep.play();
    }
    
})

function submitSplit(palletID) {
    if (roleID < 3) {
        okBeep.play(); 
        $.post(`/savesplitting`, [
            {name:'curPalletID', value:curPalletID},
            {name:'curboxQty', value: curboxQty},
            {name:'palletID', value:palletID},
            {name:'productID', value:curProductID},
            {name:'boxQty', value:idx.length},
            {name:'data', value: JSON.stringify(idx)},
        ], function(data) {
            if (data.status == 1) {
                reset();
                getpalletdetail(curPalletUUID);
            } else {
                screenLog(data.message, 'error');
            }
        }, "json");
    } else {
        screenLog(formatMessage('authoritytodo'), 'warning');
        warningBeep.play();
    }
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


    



