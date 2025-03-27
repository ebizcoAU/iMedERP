
import QrScanner from "./qr-scanner.min.js";
const camList = document.getElementById('cam-list');
const camQrResult = document.getElementById('cam-qr-result');
var weburl  = $('#weburl').text();
var saveprod = ``;
var scanner;
var roleID = $('#roleid').text();
var productID = $('#pidx').text();
var subdir  = $('#subdir').text();
var tempResult = '';
var timerInterval;
var palletID = 0;
var audioCreated = false;
var gotpalletqrcode = false;


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
    getboxdetail(pidx);
} else if (puuid && puuid.length > 0) {
    getboxdetail(puuid);
}

getproduct();

//************************** */

    $('#scanqrcode').html(formatMessage('scanqrcode'));
    $('#counter').html(`0`);
    $('#reset').html(`${formatMessage('reset')}`);

//************************** */

var boxlist = [];
$('#butTxt').html(formatMessage("scanqrcode"));


$('#qrcode').on("click", function() {
    initAudio()
    if ($('#butTxt').text().trim() == formatMessage("scanqrcode")) {
        saveprod = $('#maindisplay').html();
        $('#butTxt').html(formatMessage("loadtext"));
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
        if (checkEligibility()) {
            submitClaimBonus();
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
                if (!isAlreadyInList(boxidx)) {
                    getboxdetail(boxidx);
                    setTimeout(function() {
                        if (getCookie('scannerMode')=='ON') {
                        } else {
                            scanner.start();
                        } 
                    }, 200);
                } else {
                    setTimeout(function() {
                        if (getCookie('scannerMode')=='ON') {
                        } else {
                            scanner.start();
                        } 
                    }, 200);
                }
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
    } else if (scanUrl.includes(`${weburl}/p/`)) {
        if (scanUrl === tempResult) {
        } else {
            scanner.stop();
            tempResult = scanUrl;
            clearTimeout(timerInterval);
            timerInterval = setTimeout(function() {
                tempResult = ''; //Clear temp result..
            }, 30000);
            if (scanUrl && scanUrl.split("/").length>1 && scanUrl.split("/").pop()) {
                let palletidx = scanUrl.split("/").pop();
                getpalletdetail(palletidx);
                setTimeout(function() {
                    if (getCookie('scannerMode')=='ON') {
                    } else {
                        scanner.start();
                    } 
                }, 200);
            } else {
                warningBeep.play();
                screenLog(formatMessage("invalidpallet"), "error");
                setTimeout(function() {
                    if (getCookie('scannerMode')=='ON') {
                    } else {
                        scanner.start();
                    } 
                }, 1000);

            }
        }

    } else {
        screenLog(formatMessage("invalidqrcode"), "error");
        warningBeep.play();
    }
    
}

function getboxdetail(uuid) {
    const deferred = $.Deferred();
    $.ajax({
        url: `/get/box/uuID/eq/${uuid}/null/null/null/null`,
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
        if (datx && datx.productID == productID) {
            if (datx.status==1) {
                if (audioCreated) okBeep.play();
                var daty = {id: boxlist.length+1, uuID: datx.uuID, boxID: datx.boxID, refID: datx.refID};
                boxlist.push(daty);
                updateDisplayList(daty);
            } else if (datx.status == 0){ 
                screenLog(formatMessage("boxempty"), 'warning')
                if (audioCreated) warningBeep.play()
            } else { 
                screenLog(formatMessage("boxactivated"), 'warning')
                if (audioCreated) warningBeep.play()
            }
        } else {
            if (audioCreated) warningBeep.play();
            screenLog(formatMessage("invalidbox"), "error");
        }
    })
}

function checkEligibility() {
    if (gotpalletqrcode) {
        return true;
    } else {
        warningBeep.play();
        screenLog(formatMessage("enterpalletqrcode"), "error");
        return false;
    }
}

function getpalletdetail(uuid) {
    gotpalletqrcode = true;
    const deferred = $.Deferred();
    $.ajax({
        url: `/get/pallet/uuID/eq/${uuid}/null/null/null/null`,
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
            if (datx.status==1) {
                screenLog(formatMessage("palletused"), 'warning')
                if (audioCreated) warningBeep.play()
            } else {
                if (audioCreated) okBeep.play();
            }    
            gotpalletqrcode = true;
            $('#palletid').html(`<div class="bg-dark"><div style="text-align: center;" class="h6 px-3 pt-2 pb-1 text-warning"><b>${datx.refID}</b></div></div>`);
            palletID = datx.palletID;
        } else {
            if (audioCreated) warningBeep.play();
            screenLog(formatMessage("enterboxqrcode"), "error");
        }
    })
}

function getproduct() {
    const deferred = $.Deferred();
    $.ajax({
        url: `/getrecord/product/${productID}`,
        method: "POST",
        dataType: "json",
        success: function(data) {
            if (data.status == 0) {
                deferred.reject(false);
            } else {
                deferred.resolve(data);
            }
        },
        error: function() {
            deferred.reject("Data Loading Error");
        },
        timeout: 5000
    });
    deferred.promise().then((datx)=>{
        if (datx) {
            $('.productname').html(`${datx.productName.split("-")[0]}`);
            $('#prodimg').attr("src", `public/${subdir}/${datx.imgLink}`)
        } else {
            if (audioCreated) warningBeep.play();
            screenLog(formatMessage("invalidproduct"), "error");
        }
    })
}

function isAlreadyInList(uuid) {
    return boxlist.filter(m=> m.uuID===uuid).length > 0 ? true: false;
}

function removelist(pid) {
    $(`#boxitemID_${pid}`).remove();
    var prodtemp = boxlist.filter(m=> m.id!==pid);
    boxlist = prodtemp;
    $('#counter').html(`${boxlist.length}`);

    $('#boxlist').empty();
    let lineindex = 0;
    boxlist.forEach((m, index) =>{
        lineindex = Math.floor(index/2);
        if (index%2==0) {
            $('#boxlist').append(`
            <li>
                <div class="item-content">
                    <div class="item-inner">
                        <div class="item-footer line${lineindex} ">
                            <div style="display:flex; flex-direction: row;" id="boxitemID_${m.id}">
                                <h6 class="item-title sub-title pe-5 "><a href="javascript:void(0);">${m.refID.trim()}</a></h6>
                                <a href="#" class="cart-btn class-entry" >
                                    <svg width="64" height="64" viewBox="0 0 64 64" fill="white" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M56.6601 12.14H45.5901V7.14C45.5795 5.77485 45.0305 4.46906 44.0624 3.50654C43.0942 2.54401 41.7853 2.00259 40.4201 2H23.5801C22.208 2.00265 20.893 2.54957 19.9237 3.52072C18.9545 4.49187 18.4101 5.80791 18.4101 7.18V12.18H7.34009C6.80965 12.18 6.30095 12.3907 5.92587 12.7658C5.5508 13.1409 5.34009 13.6496 5.34009 14.18C5.34009 14.7104 5.5508 15.2191 5.92587 15.5942C6.30095 15.9693 6.80965 16.18 7.34009 16.18H10.9301V56.82C10.9301 58.1938 11.4758 59.5114 12.4473 60.4828C13.4187 61.4543 14.7363 62 16.1101 62H47.8901C49.2639 62 50.5815 61.4543 51.5529 60.4828C52.5243 59.5114 53.0701 58.1938 53.0701 56.82V16.14H56.6601C57.1905 16.14 57.6992 15.9293 58.0743 15.5542C58.4494 15.1791 58.6601 14.6704 58.6601 14.14C58.6601 13.6096 58.4494 13.1009 58.0743 12.7258C57.6992 12.3507 57.1905 12.14 56.6601 12.14ZM22.4101 7.14C22.4204 6.83575 22.5479 6.54726 22.7659 6.33481C22.984 6.12237 23.2757 6.00241 23.5801 6H40.4201C40.7313 6.00264 41.0289 6.12812 41.248 6.34913C41.4672 6.57014 41.5901 6.86877 41.5901 7.18V12.18H22.4101V7.14Z" />
                                    </svg>
                                </a>
                            </div>
                        </div>
                        
                    </div>
                </div>
            </li>
        `);
        } else {
            $(`.line${lineindex}`).append(`
            <div style="display:flex; flex-direction: row;" id="boxitemID_${m.id}">
                <h6 class="item-title sub-title pe-5"><a href="javascript:void(0);">${m.refID.trim()}</a></h6>
                <a href="#" class="cart-btn class-entry" >
                    <svg width="64" height="64" viewBox="0 0 64 64" fill="white" xmlns="http://www.w3.org/2000/svg">
                        <path d="M56.6601 12.14H45.5901V7.14C45.5795 5.77485 45.0305 4.46906 44.0624 3.50654C43.0942 2.54401 41.7853 2.00259 40.4201 2H23.5801C22.208 2.00265 20.893 2.54957 19.9237 3.52072C18.9545 4.49187 18.4101 5.80791 18.4101 7.18V12.18H7.34009C6.80965 12.18 6.30095 12.3907 5.92587 12.7658C5.5508 13.1409 5.34009 13.6496 5.34009 14.18C5.34009 14.7104 5.5508 15.2191 5.92587 15.5942C6.30095 15.9693 6.80965 16.18 7.34009 16.18H10.9301V56.82C10.9301 58.1938 11.4758 59.5114 12.4473 60.4828C13.4187 61.4543 14.7363 62 16.1101 62H47.8901C49.2639 62 50.5815 61.4543 51.5529 60.4828C52.5243 59.5114 53.0701 58.1938 53.0701 56.82V16.14H56.6601C57.1905 16.14 57.6992 15.9293 58.0743 15.5542C58.4494 15.1791 58.6601 14.6704 58.6601 14.14C58.6601 13.6096 58.4494 13.1009 58.0743 12.7258C57.6992 12.3507 57.1905 12.14 56.6601 12.14ZM22.4101 7.14C22.4204 6.83575 22.5479 6.54726 22.7659 6.33481C22.984 6.12237 23.2757 6.00241 23.5801 6H40.4201C40.7313 6.00264 41.0289 6.12812 41.248 6.34913C41.4672 6.57014 41.5901 6.86877 41.5901 7.18V12.18H22.4101V7.14Z" />
                    </svg>
                </a>
            </div>
            `); 
        }
        $(`#boxitemID_${m.id}`).on( 'click', function(e) {
            removelist(m.id) ;
        } );
    })
}

function updateDisplayList(m) {
    /*
    $('#boxlist').append(`
        <li id="boxitemID_${m.id}">
            <div class="item-content">
                <div class="item-inner">
                    <div class="item-footer">
                        <h6 class="item-title sub-title"><a href="javascript:void(0);">${m.refID.trim()}</a></h6>
                        <a href="#" class="cart-btn class-entry">
                            <svg width="64" height="64" viewBox="0 0 64 64" fill="white" xmlns="http://www.w3.org/2000/svg">
                                <path d="M56.6601 12.14H45.5901V7.14C45.5795 5.77485 45.0305 4.46906 44.0624 3.50654C43.0942 2.54401 41.7853 2.00259 40.4201 2H23.5801C22.208 2.00265 20.893 2.54957 19.9237 3.52072C18.9545 4.49187 18.4101 5.80791 18.4101 7.18V12.18H7.34009C6.80965 12.18 6.30095 12.3907 5.92587 12.7658C5.5508 13.1409 5.34009 13.6496 5.34009 14.18C5.34009 14.7104 5.5508 15.2191 5.92587 15.5942C6.30095 15.9693 6.80965 16.18 7.34009 16.18H10.9301V56.82C10.9301 58.1938 11.4758 59.5114 12.4473 60.4828C13.4187 61.4543 14.7363 62 16.1101 62H47.8901C49.2639 62 50.5815 61.4543 51.5529 60.4828C52.5243 59.5114 53.0701 58.1938 53.0701 56.82V16.14H56.6601C57.1905 16.14 57.6992 15.9293 58.0743 15.5542C58.4494 15.1791 58.6601 14.6704 58.6601 14.14C58.6601 13.6096 58.4494 13.1009 58.0743 12.7258C57.6992 12.3507 57.1905 12.14 56.6601 12.14ZM22.4101 7.14C22.4204 6.83575 22.5479 6.54726 22.7659 6.33481C22.984 6.12237 23.2757 6.00241 23.5801 6H40.4201C40.7313 6.00264 41.0289 6.12812 41.248 6.34913C41.4672 6.57014 41.5901 6.86877 41.5901 7.18V12.18H22.4101V7.14Z" />
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
        </li>
    `);
    */

    let index = boxlist.length - 1;
    let lineindex = Math.floor(index/2) < 0 ? 0: Math.floor(index/2);
    console.log("index: " + index);
    console.log("lineindex: " + lineindex);
    if (index%2==0) {
        $('#boxlist').append(`
        <li>
            <div class="item-content">
                <div class="item-inner">
                    <div class="item-footer line${lineindex} ">
                        <div style="display:flex; flex-direction: row;" id="boxitemID_${m.id}">
                            <h6 class="item-title sub-title pe-5 "><a href="javascript:void(0);">${m.refID.trim()}</a></h6>
                            <a href="#" class="cart-btn class-entry" >
                                <svg width="64" height="64" viewBox="0 0 64 64" fill="white" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M56.6601 12.14H45.5901V7.14C45.5795 5.77485 45.0305 4.46906 44.0624 3.50654C43.0942 2.54401 41.7853 2.00259 40.4201 2H23.5801C22.208 2.00265 20.893 2.54957 19.9237 3.52072C18.9545 4.49187 18.4101 5.80791 18.4101 7.18V12.18H7.34009C6.80965 12.18 6.30095 12.3907 5.92587 12.7658C5.5508 13.1409 5.34009 13.6496 5.34009 14.18C5.34009 14.7104 5.5508 15.2191 5.92587 15.5942C6.30095 15.9693 6.80965 16.18 7.34009 16.18H10.9301V56.82C10.9301 58.1938 11.4758 59.5114 12.4473 60.4828C13.4187 61.4543 14.7363 62 16.1101 62H47.8901C49.2639 62 50.5815 61.4543 51.5529 60.4828C52.5243 59.5114 53.0701 58.1938 53.0701 56.82V16.14H56.6601C57.1905 16.14 57.6992 15.9293 58.0743 15.5542C58.4494 15.1791 58.6601 14.6704 58.6601 14.14C58.6601 13.6096 58.4494 13.1009 58.0743 12.7258C57.6992 12.3507 57.1905 12.14 56.6601 12.14ZM22.4101 7.14C22.4204 6.83575 22.5479 6.54726 22.7659 6.33481C22.984 6.12237 23.2757 6.00241 23.5801 6H40.4201C40.7313 6.00264 41.0289 6.12812 41.248 6.34913C41.4672 6.57014 41.5901 6.86877 41.5901 7.18V12.18H22.4101V7.14Z" />
                                </svg>
                            </a>
                        </div>
                    </div>
                    
                </div>
            </div>
        </li>
    `);
    } else {
        $(`.line${lineindex}`).append(`
        <div style="display:flex; flex-direction: row;" id="boxitemID_${m.id}">
            <h6 class="item-title sub-title pe-5"><a href="javascript:void(0);">${m.refID.trim()}</a></h6>
            <a href="#" class="cart-btn class-entry" >
                <svg width="64" height="64" viewBox="0 0 64 64" fill="white" xmlns="http://www.w3.org/2000/svg">
                    <path d="M56.6601 12.14H45.5901V7.14C45.5795 5.77485 45.0305 4.46906 44.0624 3.50654C43.0942 2.54401 41.7853 2.00259 40.4201 2H23.5801C22.208 2.00265 20.893 2.54957 19.9237 3.52072C18.9545 4.49187 18.4101 5.80791 18.4101 7.18V12.18H7.34009C6.80965 12.18 6.30095 12.3907 5.92587 12.7658C5.5508 13.1409 5.34009 13.6496 5.34009 14.18C5.34009 14.7104 5.5508 15.2191 5.92587 15.5942C6.30095 15.9693 6.80965 16.18 7.34009 16.18H10.9301V56.82C10.9301 58.1938 11.4758 59.5114 12.4473 60.4828C13.4187 61.4543 14.7363 62 16.1101 62H47.8901C49.2639 62 50.5815 61.4543 51.5529 60.4828C52.5243 59.5114 53.0701 58.1938 53.0701 56.82V16.14H56.6601C57.1905 16.14 57.6992 15.9293 58.0743 15.5542C58.4494 15.1791 58.6601 14.6704 58.6601 14.14C58.6601 13.6096 58.4494 13.1009 58.0743 12.7258C57.6992 12.3507 57.1905 12.14 56.6601 12.14ZM22.4101 7.14C22.4204 6.83575 22.5479 6.54726 22.7659 6.33481C22.984 6.12237 23.2757 6.00241 23.5801 6H40.4201C40.7313 6.00264 41.0289 6.12812 41.248 6.34913C41.4672 6.57014 41.5901 6.86877 41.5901 7.18V12.18H22.4101V7.14Z" />
                </svg>
            </a>
        </div>
        `); 
    }


    $('#counter').html(`${boxlist.length}`);

    $(`#boxitemID_${m.id}`).on( 'click', function(e) {
        removelist(m.id) ;
    } );	
}

$('.resetx').on("click", function() {
    initAudio();
    reset();
})

function reset() {
    boxlist = [];
    gotpalletqrcode = false;
    palletID = 0;
    $('#boxlist').empty();
    $('#palletid').html(``);
    $('#counter').html(`0`);
}

function submitClaimBonus() {
    var  boxlistx = boxlist.map(m=> { return {boxID:m.boxID} });
    if (roleID < 3) {
        if (boxlistx.length > 0) {
            okBeep.play(); 
            $.post(`/savepalleting`, [
                {name:'palletID', value: palletID},
                {name:'productID', value: productID},
                {name:'data', value: JSON.stringify(boxlistx)}
            ], function(data) {
                if (data.status == 1) {
                    reset();
                } else {
                    screenLog(data.message, 'error');
                }
            }, "json");
        } else {
            screenLog(formatMessage('palletempty'), 'warning');
            warningBeep.play();
        }
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
