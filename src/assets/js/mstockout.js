
import QrScanner from "./qr-scanner.min.js";
const camList = document.getElementById('cam-list');
const camQrResult = document.getElementById('cam-qr-result');
var weburl  = $('#weburl').text();
var saveprod = ``;
var scanner;
var roleID = $('#roleid').text();
var productID = $('#pidx').text();
var orderxitemID = $('#orderxitemidx').text();
var qtyx = parseInt($('#qtyx').text());
var prodnamex = $('#prodnamex').text();

var tempResult = '';
var timerInterval;
var boxID = 0;
var audioCreated = false;
var totalbox = 0;


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

getorderxitem();

//************************** */
    $('.pagetitlex').html(`${prodnamex.split("-")[0].trim().substring(0,21)}, #${qtyx} ${formatMessage('box')}`);
    $('#scanqrcode').html(formatMessage('scanqrcode'));
    $('#counter').html(`0`);
    $('#submit').html(`${formatMessage('submit')}`);

//************************** */

var prodlist = [];
$('#butTxt').html(formatMessage("scanqrcode"));


$('#qrcode').on("click", function() {
    initAudio()
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
        // for debugging
        window.scanner = scanner;
    } else {
        closeScanner();
    }
})

function closeScanner() {
    $('#butTxt').html(formatMessage("scanqrcode"));
    $('#maindisplay').html(saveprod);
    scanner.stop();
    scanner.destroy();
    scanner = null;
    tempResult = '';
}

function setResult(label, result) {
    var scanUrl = result.data;
    
    if (scanUrl.includes(`${weburl}/p/`)) {
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
                if (!isAlreadyInList(palletidx)) {
                    getpalletdetail(palletidx);
                    setTimeout(function() {
                        scanner.start();
                    }, 200);
                } else {
                    setTimeout(function() {
                        scanner.start();
                    }, 100);
                }
                
                setTimeout(function() {
                    scanner.start();
                }, 200);
            } else {
                warningBeep.play();
                screenLog(formatMessage("invalidpallet"), "error");
                setTimeout(function() {
                    scanner.start();
                }, 1000);

            }
        }
    } else {
        screenLog(formatMessage("invalidpallet"), "error");
        warningBeep.play();
    }
    
    
}

function checkEligibility() {
    if ((totalbox == qtyx) || (totalbox==0)) {
        return true
    } else {
        return false
    }
}

function getpalletdetail(uuid) {
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
        if (datx.productID == productID) {
            if (datx.status==2) {
                screenLog(formatMessage("palletactivated"), 'warning')
                if (audioCreated) warningBeep.play()
            } else if (datx.status==1) {
                if (audioCreated) okBeep.play();
                prodlist.push({
                    uuID: datx.uuID,
                    palletID: datx.palletID,
                    refID: datx.refID,
                    boxQty: datx.boxQty
                })
                updateDisplayList(prodlist)
            } else {
                screenLog(formatMessage("invalidpallet"), 'warning')
                if (audioCreated) warningBeep.play()
            }    
        } else {
            screenLog(formatMessage("wrongproduct"), 'warning')
            if (audioCreated) warningBeep.play()
        } 
        
    })
}


function getorderxitem() {
    const deferred = $.Deferred();
    $.ajax({
        url: `/orderxitemstock/${orderxitemID}`,
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
        if (datx.length > 0) {
            prodlist = datx;
            updateDisplayList(datx);
        } else {
            prodlist = [];
            if (audioCreated) warningBeep.play();
            screenLog(formatMessage("noboxarrange"), "warning");
        }
    })
}

function isAlreadyInList(uuid) {
    return prodlist.filter(m=> m.uuID===uuid).length > 0 ? true: false;
}

function removelist(pid) {
    var prodtemp = prodlist.filter(m=> m.palletID!==pid);
    prodlist = prodtemp;
    updateDisplayList(prodlist)
}



function updateDisplayList(dat) {
    totalbox = 0;
    $('#prodlist').empty();
    $('#prodlist').append(`
            <li>
                <div class="item-content">
                    <div class="item-inner">
                        <div class="item-footer">
                            <h6 class="item-title sub-title"><a href="javascript:void(0);">${formatMessage("pallet")}</a></h6>
                            <h6 class="item-title sub-title"><a href="javascript:void(0);">${formatMessage("boxqty")}</a></h6>
                            <h6 class="item-title sub-title"><a href="javascript:void(0);"></a></h6>
                        </div>
                    </div>
                </div>
            </li>
        `);
    dat.forEach(m=>{
        $('#prodlist').append(`
            <li id="palletID_${m.palletID}">
                <div class="item-content">
                    <div class="item-inner">
                        <div class="item-footer">
                            <h6 class="item-title sub-title"><a href="javascript:void(0);">${m.refID.trim()}</a></h6>
                            <h6 class="item-title sub-title"><a href="javascript:void(0);">${m.boxQty}</a></h6>
                            <a href="#" class="cart-btn class-entry" >
                                <svg width="64" height="64" viewBox="0 0 64 64" fill="white" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M56.6601 12.14H45.5901V7.14C45.5795 5.77485 45.0305 4.46906 44.0624 3.50654C43.0942 2.54401 41.7853 2.00259 40.4201 2H23.5801C22.208 2.00265 20.893 2.54957 19.9237 3.52072C18.9545 4.49187 18.4101 5.80791 18.4101 7.18V12.18H7.34009C6.80965 12.18 6.30095 12.3907 5.92587 12.7658C5.5508 13.1409 5.34009 13.6496 5.34009 14.18C5.34009 14.7104 5.5508 15.2191 5.92587 15.5942C6.30095 15.9693 6.80965 16.18 7.34009 16.18H10.9301V56.82C10.9301 58.1938 11.4758 59.5114 12.4473 60.4828C13.4187 61.4543 14.7363 62 16.1101 62H47.8901C49.2639 62 50.5815 61.4543 51.5529 60.4828C52.5243 59.5114 53.0701 58.1938 53.0701 56.82V16.14H56.6601C57.1905 16.14 57.6992 15.9293 58.0743 15.5542C58.4494 15.1791 58.6601 14.6704 58.6601 14.14C58.6601 13.6096 58.4494 13.1009 58.0743 12.7258C57.6992 12.3507 57.1905 12.14 56.6601 12.14ZM22.4101 7.14C22.4204 6.83575 22.5479 6.54726 22.7659 6.33481C22.984 6.12237 23.2757 6.00241 23.5801 6H40.4201C40.7313 6.00264 41.0289 6.12812 41.248 6.34913C41.4672 6.57014 41.5901 6.86877 41.5901 7.18V12.18H22.4101V7.14Z" />
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
            </li>
        `);
        $(`#palletID_${m.palletID}`).on( 'click', function(e) {
            removelist(m.palletID) ;
        } );	
        totalbox+=m.boxQty;
    })
    
    $('#counter').html(`${totalbox}`);

    		
}

$('.submitx').on("click", function() {
    initAudio();
    if (checkEligibility()) {
        submitClaimBonus();
    } else {
        screenLog(formatMessage('qtynotmatch'), 'error');
        warningBeep.play();
    }
})

function submitClaimBonus() {
    var  prodlistx = prodlist.map(m=> { return {palletID:m.palletID} });
    if (roleID < 3) {
        okBeep.play(); 
        $.post(`/savestocking`, [
            {name:'orderxitemID', value: orderxitemID},
            {name:'data', value: JSON.stringify(prodlistx)}
        ], function(data) {
            if (data.status == 1) {
                window.location = document.referrer;
            } else {
                screenLog(data.message, 'error');
            }
        }, "json");
    } else {
        screenLog(formatMessage('authoritytodo'), 'warning');
        warningBeep.play();
    }
}


    

    



