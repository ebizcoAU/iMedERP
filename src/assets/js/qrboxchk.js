    import QrScanner from "./qr-scanner.min.js";
    const camList = document.getElementById('cam-list');
    const camQrResult = document.getElementById('cam-qr-result');
    var weburl  = $('#weburl').text();
    var saveprod = ``;
    var scanner;
    var start = false;
    var tempResult = '';
    var timerInterval;


    const okBeep = new Audio();
    okBeep.autoplay = false;
    okBeep.src = './assets/audio/beep.mp3';

    const warningBeep = new Audio();
    warningBeep.autoplay = false;
    warningBeep.src = './assets/audio/bad.mp3';

    
    //************************** */
    var proddetails = ``;
    var boxitem = {};
    boxitem.status = parseInt($('#status').text());
    boxitem.productName = $('#productName').text();
    boxitem.refID = $('#refID').text();
    boxitem.subdir = $('#subdir').text();
    boxitem.uuID = $('#uuID').text();
    boxitem.imgLink = $('#imgLink').text();
    updateDisplayList(boxitem);
    //************************** */
    $('#butTxt').html(formatMessage("scanqrcode"));
    $('#claimbonus').html(formatMessage("claimbonus"));

    $('#qrcode').on("click", function() {
        if (!start) {
            okBeep.play();
            okBeep.pause();
            warningBeep.play();
            warningBeep.pause();
            start = true;
        }
        okBeep.play();
        if ($('#butTxt').text().trim() == formatMessage("scanqrcode")) {
            $('#butTxt').html(formatMessage("stoptext"));
            $('#maindisplay').html(`<div id="video-container"><video id="qr-video" class="card-top-image "></video></div>`);
            $('#maindisplay').addClass("bg-dark");
            $(".bg-color").css("background-color", "rgba(0, 0, 0, 0.8)");
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
            $('#butTxt').html(formatMessage("stoptext"));
            closeScanner();
        }
    })

    function setResult(label, result) {
        var scanUrl = result.data;
        if (scanUrl.includes(`${weburl}/boxchk`)) {
            if (scanUrl === tempResult) {
            } else {
                scanner.stop();
                tempResult = scanUrl;
                clearTimeout(timerInterval);
                timerInterval = setTimeout(function() {
                    tempResult = ''; //Clear temp result..
                }, 5000);
                if (scanUrl && scanUrl.split("?").length>1 && scanUrl.split("?")[1].split("&").length>0) {
                    let uuidx = scanUrl.split("?")[1].split("&")[0];
                    getboxdetail(uuidx);
                    
                } else {
                    warningBeep.play();
                    updateDisplayList({status:0})
                    setTimeout(function() {
                        scanner.start();
                    }, 500);
                }
            }
        } else {
            warningBeep.play();
            updateDisplayList({status:0})
            setTimeout(function() {
                $('#butTxt').html(formatMessage("stoptext"));
                closeScanner();
            }, 500);
        }
        
    }
    function closeScanner() {
        $('#butTxt').html(formatMessage("scanqrcode"));
        scanner.destroy();
        scanner = null;
        tempResult = '';
    }

    function getboxdetail(uuid) {
        const deferred = $.Deferred();
        $.ajax({
            url: `/boxdetails/${uuid}`,
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
                boxitem = datx;
                if (boxitem.status==1) {
                    okBeep.play();
                    updateDisplayList(boxitem);
                } else { 
                    warningBeep.play()
                    updateDisplayList(boxitem);
                }
                closeScanner();
            } else {
                warningBeep.play();
                updateDisplayList({status:0});
                closeScanner();
            }
        })
    }

    function updateDisplayList(m) {
        $('#maindisplay').removeClass("bg-dark");
        if (m.status == 1) {
            proddetails = `
            <div class="d-flex flex-column">
                <div style="text-align: center;"><b>${m.productName.split("-")[0].trim()}</b></div>
                <div style="text-align: center;"><b> Mã số THÙNG: ${$('#refID').text()}</b></div>
                <div style="text-align: center;" class="text-success"><b>SẢN PHẨM THẬT CHÍNH HÃNG</b></div>
                <div style="text-align: center;"><b>Tình trạng: </b><span class="text-success"><b>CHƯA ĐƯỢC KÍCH HOẠT</b></span></div>
                <div class="pt-3 h6 d-flex flex-column">
                    <div style="text-align: center;"><b>CHỈ DÀNH RIÊNG CHO ĐẠI LÝ SỬ DỤNG</b></div>
                     <span style="text-align: center;">Vui lòng kích hoạt thùng sản phẩm này.</span>
                </div>
            </div> `;
            $('.claimbonus').removeClass('disabled');
        } else  if (m.status == 2) {
            proddetails = `
            <div class="d-flex flex-column">
                <div style="text-align: center;"><b>${m.productName.split("-")[0].trim()}</b></div>
                <div style="text-align: center;"><b> Mã số THÙNG: ${$('#refID').text()}</b></div>
                <div style="text-align: center;" class="text-success"><b>SẢN PHẨM THẬT CHÍNH HÃNG</b></div>
                <div style="text-align: center;"><b>Tình trạng: </b><span style="color:#CD7F32"><b>ĐÃ ĐƯỢC KÍCH HOẠT</b></span></div>
                <div class="h6 pt-3  d-flex flex-column">
                    <div style="text-align: center;"><b>CHỈ DÀNH RIÊNG CHO ĐẠI LÝ SỬ DỤNG</b></div>
                    <span style="text-align: center;">Vui lòng chọn thùng sản phẩm khác.</span>
                </div>
            </div> `;
            $('.claimbonus').addClass('disabled');
        } else {
            proddetails = `
            <div class="d-flex flex-column">
                <div class="bg-dark"><div style="text-align: center;" class="h5 pt-2 text-warning"><b>CẢNH BÁO HÀNG GIẢ</b></div></div>
                <div style="text-align: center;" class="text-danger"><b>Đại lý thận trọng không sử dụng sản phẩm này.</b></span></div>
                <div class="h6 pt-3  d-flex flex-column">
                    <div style="text-align: center;"><b>CHỈ DÀNH RIÊNG CHO ĐẠI LÝ SỬ DỤNG</b></div>
                </div>
            </div> `;  
            $('.claimbonus').addClass('disabled');
        }
        
        var textdisplay = `
        <img class="pt-3 mx-auto"  src="" width="200" class="px-6" id="prodimg">
        <div class="card-img-overlay d-flex justify-content-around">
            <div class="card-block mx-auto ps-1">
            </div>
            <div class="card-block pe-2 mx-auto">
                <img src="" width="60" id="prodstatus">
            </div>
        </div>
        <div class="card-body" style="background-color: rgba(248, 244, 243, 0.8);border-radius: 5%">
            <p class="card-text">
                <div id="proddetails" style="font-size:17px"></div> 
            </p>
        </div>`;
        $('#maindisplay').html(textdisplay);
        $('#proddetails').html(proddetails);
        if (m.status == 1) {
            $(".bg-color").css("background-color", "rgba(0, 0, 0, 0.8)");
            $('#prodimg').attr("src", `public/${m.subdir}/${m.imgLink}`);
            $('#prodstatus').attr("src", "assets/images/icons/checked.png");
        } else if (m.status == 2) {
            $(".bg-color").css("background-color", "rgba(153, 92, 0, 0.8)");
            $('#prodimg').attr("src", `public/${m.subdir}/${m.imgLink}`);
            $('#prodstatus').attr("src", "assets/images/icons/crossed.png");
        } else {
            $(".bg-color").css("background-color", "rgba(246, 77, 21, 0.8)");
            $('#prodimg').attr("src", `assets/images/icons/stop.png`);
            $('#prodstatus').attr("visibility", false);
        }
    }

    $('.claimbonus').on("click", function() {
        submitClaimBonus();
    })

    function submitClaimBonus() {
        if (scanner) closeScanner();
        if (boxitem.status == 1) {
            okBeep.play();
            setCookie('bidx', boxitem.uuID); 
            window.location.href = `/mindex`;
        } else {
            warningBeep.play();
        }
        
    }
//********* COMMON FUNCTIONS ***********/    
function setCookie(cname, cvalue, exhours) {
    var d = new Date();
    d.setTime(d.getTime() + (0.5*60*1000)); /* 60 Minutes */
    var expires = "expires="+ d.toString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function formatMessage (msg) {
    if (msg == "scanqrcode") return "Quét";
    if (msg == "claimbonus") return "Kích hoạt";
    if (msg == "productauthentication") return "Xác nhận sản phẩm";
    if (msg == "stoptext") return "Dừng";
    
}
    
    
