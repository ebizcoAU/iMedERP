
import QrScanner from "./qr-scanner.min.js";
const camList = document.getElementById('cam-list');
const camQrResult = document.getElementById('cam-qr-result');
var weburl  = $('#weburl').text();
var saveprod = ``;
var scanner;
var roleID = $('#roleid').text();
var tempResult = '';
var timerInterval;
var staffID = 0;
var audioCreated = false;
var qrcodeStat = false;

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
    var subdir = $('#subdir').text();
    var textdisplay = `
    <div class="card-img-overlay d-flex justify-content-around">
        <div class="card-block mx-auto ps-1">
        </div>
        <div class="card-block pe-2 mx-auto">
            <img src="" width="60" id="prodstatus">
        </div>
    </div>`;
    if (getCookie('scannerMode')=='ON'){
        textdisplay += `
            <h5>${formatMessage('productauthentication')}</h5>`;
           
    } else {
        textdisplay += `
            <div class="card-body scannerBG" style="border-radius: 5%">
            <p class="card-text">
                <div id="proddetails">
                    <h5>${formatMessage('productauthentication')}</h5>
                    <p style="font-size:17px">Bấm nút <span class="fw-bolder text-danger">Kích hoạt</span> để được tích luỹ điểm.</p>
                </div> 
            </p>
        </div>`;
    }
   
    $('#maindisplay').html(textdisplay);
    $('#prodstatus').attr("visibility", false);
    

//************************** */

var prodlist = [];
//$('#butTxt').html(formatMessage("scanqrcode"));
$('#claimbonus').html(formatMessage("claimbonus"));

$(function() {
    if (getCookie('scannerMode')=='ON'){
        $('#qrcode').removeClass("invisible")
        initAudio();
    } else {
        $('#qrcode').click(); 
    }    
});

$('#staffid').html(`<p style="font-size:15px">Quêt sản phẩm QRCODE để xác nhận thật giả.</p>`)
$('#staffid2').html(`<p style="font-size:17px">Bấm nút <span class="fw-bolder text-danger">Kích hoạt</span> để được tích luỹ điểm.</p>`)

$('#qrcode').on("click", function() {
    initAudio();
    if (!qrcodeStat) {
        console.log("SCAN ON")
        saveprod = $('#maindisplay').html();
        $('#qrcode').html(`<i class="fa fa-stop">`);
        qrcodeStat = true;
        if (getCookie('scannerMode')=='ON'){
            HWScannerStart();
        } else {
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
        }
    } else {
        console.log("SCAN OFF")
        qrcodeStat = false;
        $('#qrcode').html(`<i class="fa fa-qrcode">`);
        if (getCookie('scannerMode')=='ON') {
            HWScannerStop();
        } else {
            closeScanner();
        }
    }
})

function closeScanner() {
    //$('#butTxt').html(formatMessage("scanqrcode"));
    $('#maindisplay').html(saveprod);
    scanner.stop();
    scanner.destroy();
    scanner = null;
    tempResult = '';
}

function setResult(label, result) {
    var scanUrl = result.data;
    if (scanUrl.includes(`${weburl}/prodqrchk`)) {
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
            }, 5000);
            if (scanUrl && scanUrl.split("?").length>1 && scanUrl.split("?")[1].split("&").length>0) {
                let uuidx = scanUrl.split("?")[1].split("&")[0];
                if (!isAlreadyInList(uuidx)) {
                    getproductdetail(uuidx);
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
                screenLog(formatMessage("carefultouseproduct"), "error");
                setTimeout(function() {
                    if (getCookie('scannerMode')=='ON') {
                    } else {
                        scanner.start();
                    } 
                }, 1000);

            }
        }
    } else if (scanUrl.includes(`${weburl}/staffqrchk`)) {
        if (scanUrl === tempResult) {
        } else {
            scanner.stop();
            tempResult = scanUrl;
            clearTimeout(timerInterval);
            timerInterval = setTimeout(function() {
                tempResult = ''; //Clear temp result..
            }, 5000);
            if (scanUrl && scanUrl.split("?").length>1) {
                let staffidx = scanUrl.split("?")[1];
                getstaffdetail(staffidx);
                setTimeout(function() {
                    if (getCookie('scannerMode')=='ON') {
                    } else {
                        scanner.start();
                    } 
                }, 200);
            } else {
                warningBeep.play();
                screenLog(formatMessage("invalidstaffid"), "error");
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

function getTotal() {
    return prodlist.reduce( function(a, b){
        if (b.status == 1) return a + b.bonus;
        else return a;
    }, 0);
}

function getproductdetail(uuid) {
    if (uuid.length > 0) {
        const deferred = $.Deferred();
        $.ajax({
            url: `/proddetails/${uuid}`,
            method: "GET",
            dataType: "json",
            success: function(data) {
                if (data.status == 0) {
                    deferred.reject(false);
                } else {
                    deferred.resolve(data.data);
                }
            },
            error: function() {
                deferred.reject("Data Loading Error");
            },
            timeout: 5000
        });
        deferred.promise().then((datx)=>{
            if (datx) {
                if (datx.status==1) {
                    if (datx.bstatus==2) {
                        if (audioCreated) okBeep.play();
                        prodlist.push(datx);
                        updateDisplayList(datx);
                    } else {
                        screenLog(formatMessage("itemnotregistered"))
                        if (audioCreated) warningBeep.play()
                    }
                } else if (datx.status==2) { 
                    screenLog(formatMessage("alreadyactivated"))
                    if (audioCreated) warningBeep.play()
                } else { 
                    screenLog(formatMessage("invalidproduct"))
                    if (audioCreated) warningBeep.play()
                }
            } else {
                if (audioCreated) warningBeep.play();
                screenLog(formatMessage("carefultouseproduct"), "error");
            }
        })
    }
}

function getstaffdetail(uuid) {
    const deferred = $.Deferred();
    $.ajax({
        url: `/staffdetails/${uuid}`,
        method: "GET",
        dataType: "json",
        success: function(data) {
            if (data.status == 0) {
                deferred.reject(false);
            } else {
                deferred.resolve(data.data);
            }
        },
        error: function() {
            deferred.reject("Data Loading Error");
        },
        timeout: 5000
    });
    deferred.promise().then((datx)=>{
        if (datx) {
            if ((datx.status==1) && (datx.roleID==7)) {
                if (audioCreated) okBeep.play();
                staffID = datx.memberID;
                $('#staffid').html(formatMessage('salemanid')+`${subdir}${datx.memberID.toString().padStart(6, '0')}`);
                $('#staffid2').html("");
            } else { 
                screenLog(formatMessage("invalidstaffid"))
                if (audioCreated) warningBeep.play()
            }
        } else {
            if (audioCreated) warningBeep.play();
            screenLog(formatMessage("invalidstaffid"), "error");
        }
    })
}

function isAlreadyInList(uuid) {
    return prodlist.filter(m=> m.uuID===uuid).length > 0 ? true: false;
}

function removelist(pid) {
    $(`#totaldiv`).remove();
    $(`#proditemID_${pid}`).remove();
    var prodtemp = prodlist.filter(m=> m.proditemID!==pid);
    prodlist = prodtemp;
    $('#prodlist').append(`
        <li id="totaldiv">
            <div class="item-content">
                <div class="item-inner">
                    <div class="item-footer">
                        <div class="d-flex align-items-between">
                            <svg class="me-2" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <g clip-path="url(#clip0_361_453)">
                                <path d="M14.6666 0.000106812H9.12485C8.75825 0.000106812 8.24587 0.212488 7.98685 0.471314L0.389089 8.06903C-0.129696 8.58723 -0.129696 9.43684 0.389089 9.95441L6.04624 15.6114C6.56385 16.1296 7.41263 16.1296 7.93103 15.6108L15.5288 8.01423C15.7876 7.75544 16 7.24224 16 6.87642V1.3335C16 0.600298 15.3998 0.000106812 14.6666 0.000106812ZM11.9998 5.33347C11.2634 5.33347 10.6664 4.73585 10.6664 4.00008C10.6664 3.26309 11.2634 2.66669 11.9998 2.66669C12.7362 2.66669 13.3334 3.26309 13.3334 4.00008C13.3334 4.73585 12.7362 5.33347 11.9998 5.33347Z" fill="#C29C1D"/>
                                </g>
                                <defs>
                                <clipPath >
                                <rect width="16" height="16" fill="white"/>
                                </clipPath>
                                </defs>
                            </svg>
                            <h6 class="font-16  text-dark mb-0 font-w400">${formatMessage('totalbonus')}: </h6>
                        </div>
                        <a href="#">
                            <h6 class="font-16  text-dark mb-0 font-w400">${formatVNcurrency(getTotal())}</h6>
                        </a>
                    </div>
                </div>
            </div>
        </li>
    `);
    
    if (prodlist.length > 0) {
        if (staffID == 0) $('#staffid').html(formatMessage('scansaleqrcodeid'));
    }
}



function updateDisplayList(m) {
    $(`#totaldiv`).remove();
    $('#prodlist').append(`
        <li id="proditemID_${m.proditemID}">
            <div class="item-content">
                <div class="item-media media media-95"><img src="./public/${m.subdir}/${m.imgLink}" alt="logo">
                    <a href="javascript:void(0);" class="item-bookmark icon-4">
                        ${m.status==1?`
                        <img src="assets/images/icons/checked.png" />`:`<img src="assets/images/icons/crossed.png" />`}
                    </a>    
                </div>
                <div class="item-inner">
                    <div class="item-title-row">
                        <h5 class="item-title sub-title"><a href="javascript:void(0);">${m.productName.split("-")[0].trim()}</a></h5>
                        <div class="item-subtitle text-soft">${m.productName.split("-")[1].trim()}</div>
                    </div>
                    <div class="item-footer">
                        <div class="d-flex align-items-center">
                            <svg class="me-2" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <g clip-path="url(#clip0_361_453)">
                                <path d="M14.6666 0.000106812H9.12485C8.75825 0.000106812 8.24587 0.212488 7.98685 0.471314L0.389089 8.06903C-0.129696 8.58723 -0.129696 9.43684 0.389089 9.95441L6.04624 15.6114C6.56385 16.1296 7.41263 16.1296 7.93103 15.6108L15.5288 8.01423C15.7876 7.75544 16 7.24224 16 6.87642V1.3335C16 0.600298 15.3998 0.000106812 14.6666 0.000106812ZM11.9998 5.33347C11.2634 5.33347 10.6664 4.73585 10.6664 4.00008C10.6664 3.26309 11.2634 2.66669 11.9998 2.66669C12.7362 2.66669 13.3334 3.26309 13.3334 4.00008C13.3334 4.73585 12.7362 5.33347 11.9998 5.33347Z" fill="#C29C1D"/>
                                </g>
                                <defs>
                                <clipPath >
                                <rect width="16" height="16" fill="white"/>
                                </clipPath>
                                </defs>
                            </svg>
                            <h6 class="font-14 text-accent mb-0 font-w400">${formatMessage('bonus')}: ${formatVNcurrency(m.bonus)}</h6>
                        </div>
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

    $('#prodlist').append(`
        <li id="totaldiv">
            <div class="item-content">
                <div class="item-inner">
                    <div class="item-footer">
                        <div class="d-flex align-items-between">
                            <svg class="me-2" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <g clip-path="url(#clip0_361_453)">
                                <path d="M14.6666 0.000106812H9.12485C8.75825 0.000106812 8.24587 0.212488 7.98685 0.471314L0.389089 8.06903C-0.129696 8.58723 -0.129696 9.43684 0.389089 9.95441L6.04624 15.6114C6.56385 16.1296 7.41263 16.1296 7.93103 15.6108L15.5288 8.01423C15.7876 7.75544 16 7.24224 16 6.87642V1.3335C16 0.600298 15.3998 0.000106812 14.6666 0.000106812ZM11.9998 5.33347C11.2634 5.33347 10.6664 4.73585 10.6664 4.00008C10.6664 3.26309 11.2634 2.66669 11.9998 2.66669C12.7362 2.66669 13.3334 3.26309 13.3334 4.00008C13.3334 4.73585 12.7362 5.33347 11.9998 5.33347Z" fill="#C29C1D"/>
                                </g>
                                <defs>
                                <clipPath >
                                <rect width="16" height="16" fill="white"/>
                                </clipPath>
                                </defs>
                            </svg>
                            <h6 class="font-16  text-dark mb-0 font-w400">${formatMessage('totalbonus')}:</h6>
                        </div>
                        <a href="#">
                            <h6 class="font-16  text-dark mb-0 font-w400">${formatVNcurrency(getTotal())}</h6>
                        </a>
                    </div>
                </div>
            </div>
        </li>
    `);	

    $(`#proditemID_${m.proditemID}`).on( 'click', function(e) {
        removelist(m.proditemID) ;
    } );	
    
    if (prodlist.length > 0) {
        if (staffID == 0) $('#staffid').html(formatMessage('scansaleqrcodeid'));
    }
}

$('.claimbonus').on("click", function() {
    initAudio();
    submitClaimBonus();
})

function submitClaimBonus() {
    var  prodlistx = prodlist.map(m=> { return {proditemID:m.proditemID} });
    if (prodlistx.length > 0) {
        if (staffID > 0) {
            closeScanner();
            if (roleID == 3) {
                okBeep.play(); 
                $.post(`/savebonus`, [
                    {name:'staffID', value: staffID},
                    {name:'data', value: JSON.stringify(prodlistx)}
                ], function(data) {
                    if (data.status == 1) {
                        prodlist = [];
                        $('#prodlist').empty();
                        window.location.href = '/mwallet';
                    } else {
                        screenLog(data.message);
                    }
                }, "json");
            } else {
                screenLog(formatMessage('authoritytodo'));
                okBeep.play();
            }
        } else {
            screenLog(formatMessage('pleasescansaleman'));
            okBeep.play();
        }
    } else {
        screenLog(formatMessage('youhaveemptycart'));
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


    

    



