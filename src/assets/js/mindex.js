// Register Service worker to control making site work offline
/*
if ('serviceWorker' in navigator) {
	navigator.serviceWorker
	.register('assets/app.js')
	.then(() => { console.log('Service Worker Registered'); });
}
*/

// Code to handle install prompt on desktop
let deferredPrompt;
const pwaBtn = document.querySelector('.pwa-btn');
const installText = document.querySelector('.pwa-text');	
var PwaKey = 'pwa-modal';
var PwaValue = getCookie(PwaKey);
//pwaBtn.style.display = 'none';

DevExpress.localization.locale("vi");

$( document ).ready(function() {
  var currLoc = $(location).attr('href'); 
  let pattern = /^(https:\/\/)[a-z]{0,16}(.antifake.vn\/)/;
  let result = pattern.test(currLoc);
  if ((!result) && (!currLoc.includes("localhost")) 
  		&& (!currLoc.includes("vitamax.ddns.net"))
  		&& (!currLoc.includes("adminvitamax.ddns.net"))
  		&& (!currLoc.includes("vitamax.antifake.vn"))
  		&& (!currLoc.includes("admin.vitamax.antifake.vn"))
		&& (!currLoc.includes("antifake.ddns.net"))) {
    $('body').addClass("invisible")
  } 
});
  
window.addEventListener('beforeinstallprompt', (e) => {
	// Prevent Chrome 67 and earlier from automatically showing the prompt
	e.preventDefault();
	// Stash the event so it can be triggered later.
	deferredPrompt = e;
	// Update UI to notify the user they can add to home screen
	// pwaBtn.style.display = 'block';
	if(!PwaValue) {
		setTimeout(function(){
			jQuery('.pwa-offcanvas').addClass('show');
			jQuery('.pwa-backdrop').addClass('fade show');
		}, 1000);
	}
	pwaBtn.addEventListener('click', () => {
		// hide our user interface that shows our A2HS button
		// pwaBtn.style.display = 'none';
		// Show the prompt
		deferredPrompt.prompt();
		// Wait for the user to respond to the prompt
		deferredPrompt.userChoice.then((choiceResult) => {
			if (choiceResult.outcome === 'accepted') {
				jQuery('.pwa-offcanvas').slideUp(100, function() {
					jQuery(this).removeClass('show');
				});
				setTimeout(function(){
					jQuery('.pwa-backdrop').removeClass('show');
				}, 500);
				setCookie(PwaKey, false);
			}
			deferredPrompt = null;
		});
	});
});

jQuery('.pwa-backdrop, .pwa-close, .pwa-btn').on('click',function(){
	jQuery('.pwa-offcanvas').slideUp(500, function() {
		jQuery(this).removeClass('show');
	});
	setTimeout(function(){
		jQuery('.pwa-backdrop').removeClass('show');
	}, 500);
	
});
//*************** Devextreme init *********************************************** */
const locale = getLocale();
console.log("lang: " + locale)


const langPack = lang[locale];
const locales = [
    { name: formatMessage('vietnamese') , value: 'vi'},
    { name: formatMessage('english') , value: 'en'},
	{ name: formatMessage('chinese') , value: 'cn'},
	{ name: formatMessage('korean') , value: 'kr'},
    { name: formatMessage('russian') , value: 'ru'},
];

function formatMessage(msg) {
	return langPack[msg];
}
function changeLocale(value) {
  setLocale(value);
  document.location = `/mindex`;
}

function getLocale() {
  const storageLocale = sessionStorage.getItem('locale');
  return storageLocale != null ? storageLocale : 'vi';
}

function setLocale(savingLocale) {
  sessionStorage.setItem('locale', savingLocale);
}

var logger = function() {
  var oldConsoleLog = null;
  var pub = {};
  pub.enableLogger =  function enableLogger() {
                          if(oldConsoleLog == null)
                              return;
                          window['console']['log'] = oldConsoleLog;
                      };

  pub.disableLogger = function disableLogger() {
                          oldConsoleLog = console.log;
                          window['console']['log'] = function() {};
                      };
  return pub;
}();


if ($('#production').text() == 1) logger.disableLogger();
else logger.enableLogger();

//******************************************************************* */
$( "#loginForm1" ).on( "submit", function( event ) {
	event.preventDefault();
	var phoneNumber = document.getElementById('phonenumber').value;
	document.getElementById('urlx').value = window.location;
	console.log("phone: " + phoneNumber);
	if (isValidPhoneNumber(phoneNumber)) {
		$.post(`/checkphone`, $('form#loginForm1').serialize(), function(data) {
			console.log(data)
			if (data.status == 0)  {
				window.location.href = '/motpconfirm';
			} else if (data.status == 1) {
				window.location.href = `/mpassword?${phoneNumber}`;
			} else {
				$('.loginmsg').removeClass('text-soft').addClass('text-danger').html(data.message);
			}
			
		}, "json");
	} else {
		$('.loginmsg').removeClass('text-soft').addClass('text-danger').html(`${formatMessage('invalidphone')}`);
	}	
});

$( "#loginForm2" ).on( "submit", function( event ) {
	event.preventDefault();
	$.post(`/login2`, $('form#loginForm2').serialize(), function(data) {
		//alert("loginForm2 data:" + JSON.stringify(data, false, 4))
		if (data.status == 1)  {
			if (data.roleID == 3) {
				window.location.href = '/mscanner';
			} else if (data.roleID > 3) {
				window.location.href = '/mindex';
			} else if (data.roleID < 3)  {
				window.location.href = '/mpackaging';
			} else {
				window.location.href = '/mindex';
			}
		} else {
			$('.loginmsg').removeClass('text-soft').addClass('text-danger').html(`${data.message}</br>${formatMessage('checkinfo')}`);
		}
	}, "json");
});

$("#forgotpwForm2" ).on( "submit", function( event ) {
	event.preventDefault();		
	$.post(`/forgotpwd`, $('form#forgotpwForm2').serialize(), function(data) {
		if (data.status == 1)  window.location.href = `/motpconfirm`;
		else {
			$('.loginmsg').removeClass('text-soft').addClass('text-danger').html(`${data.message}`);
		}
	}, "json");
});

$("#otpForm2" ).on( "submit", function( event ) {
	event.preventDefault();	
	$.post(`/checkotp`, $('form#otpForm2').serialize(), function(data) {
		console.log("data:" + JSON.stringify(data, false, 4))
		if (data.status == 1) { 
			window.location.href = `/mresetpasswd?${data.message.otp}`;
		} else {
			$('.loginmsg').removeClass('text-soft').addClass('text-danger').html(`${data.message}`);
		}
	}, "json");
});

$("#resetForm2" ).on( "submit", function( event ) {
	event.preventDefault();	
	var pass1 = document.getElementById('pass1').value;
	var pass2 = document.getElementById('pass2').value;
	if (pass1 == pass2) {
		$.post(`/resetpasswd`, $('form#resetForm2').serialize(), function(data) {
			console.log("data:" + JSON.stringify(data, false, 4))
			if (data.status == 1) {
				$.post(`/autologin`, [
					{name:'username2', value: data.message.user},
					{name:'password2', value:data.message.pass}
				], function(datax) {
				}, "json");
				setTimeout(function() {
					window.location.href = '/';
				}, 500)
			} else {
				$('.loginmsg').removeClass('text-soft').addClass('text-danger').html(`${data.message}`);
			}
		}, "json");
	} else {
		$('.loginmsg').removeClass('text-soft').addClass('text-danger').html(`Mật mã không trùng khớp!!`);
	}
});



$("#changepwdForm1").on( "submit", function( event ) {
	event.preventDefault();	
	var pass1 = document.getElementById('pass1').value;
	var pass2 = document.getElementById('pass2').value;
	if (pass1 == pass2) {
		$.post(`/manualchangepwd`, $('form#changepwdForm1').serialize(), function(data) {
			if (data.status == 1) { 
				window.location.href = '/mindex';
			} else {
				$('.loginmsg').removeClass('text-soft').addClass('text-danger').html(`${data.message}`);
			}
		}, "json");
	} else {
		$('.loginmsg').removeClass('text-soft').addClass('text-danger').html(`Mật mã không trùng khớp!!`);
	}
});


//*************************************** */
var namex  = $('#name').text();
var company  = $('#company').text();
var subdir  = $('#subdir').text();
var groupID = $('#groupid').text();
var weburl  = $('#weburl').text();
var memberID  = $('#memberid').text();
var rolex  = $('#rolex').text();
var divisionID  = $('#divisionid').text();

var midx  = $('#midx').text();
var imgLink  = $('#imglinkx').text();
var roleID  = parseInt($('#roleid').text());
$('.namex').html(`${namex.slice(0,20)}`);

var rolesSource;
switch (roleID) {
case 0:
    $('.rolex').html('SuperAdmin');
    rolesSource = [{id: 2, text:formatMessage('manstaff'), icon: "user"},{roleID: 4, text:formatMessage('distributor'), icon: "user"}];
	$('.companyx').html(`${company}`);
    break;
case 1:
    $('.rolex').html('Admin');
	$('.companyx').html(`${company}`);
    break;
case 3:
    $('.rolex').html(formatMessage('customer'));
    break; 
case 6:
    $('.rolex').html(formatMessage('agent'));
    rolesSource = [{id: 3, text:formatMessage('invitedcustomer'), icon: "user"},{id: 7, text:formatMessage('agestaff'), icon: "user"}];
	$('.companyx').html(`${company}`);
    break;        
default:
    $('.rolex').html(formatMessage('agestaff'));
	$('.companyx').html(`${company}`);
    break;    
}

$('.uuid').html(`${subdir}${memberID.toString().padStart(7, '0')}`);




$('.tcreadunderstand').html(`
${formatMessage('tcreadunderstand1')}
<a href="/mtermsandconditions" class="btn-link termsandconditions">${formatMessage('termsandconditions')} </a> 
${formatMessage('tcreadunderstand2')}
`);

$('.ihavereadunderstand').html(`${formatMessage('ihavereadunderstand')}`);
initImageCell(document.getElementById('staffimgx'), imgLink, '110','110');

var qrcodeElement = document.getElementById('qrcodeimg');
if (qrcodeElement !== null) {
	var qrcodeVal = `${weburl}/staff?${subdir}${memberID.toString().padStart(7, '0')}${Math.floor(Date.now()/1000)}`;
	console.log(qrcodeVal)
	new QRCode(qrcodeElement, {
		text: qrcodeVal,
		width: 140,
		height: 140,
		colorDark : "#000000",
		colorLight : "#ffffff",
		correctLevel : QRCode.CorrectLevel.H
	});
}
var wallet = document.getElementsByClassName('wallet');
var walletbalance = document.getElementById('walletbalance')
if ((wallet.length > 0) && (walletbalance !== null)) {
	var walletbalance = document.getElementById('walletbalance').innerHTML;
	document.getElementsByClassName('wallet')[0].innerHTML = formatVNcurrency(walletbalance);
}
$('.catlieu').html(formatMessage('catlieu'));

$('#agentx').html(formatMessage('agent'));
$('#agestaffx').html(formatMessage('agestaff'));
$('#diststaffx').html(formatMessage('diststaff'));


var illnesslist = document.getElementById('illnesslist');
if (illnesslist !== null) {
	const deferred = $.Deferred();
	$.ajax({
		url: `/illness/${groupID}`,
		method: "GET",
		dataType: "json",
		success: function(data) {
			
			if (data.length == 0) {
				deferred.resolve(data);
			} else {
				var itemList =``;
				data.forEach((m, index)=>{
					let illnessName = `illness_${locale}`;
					if (m.status == 1) {
						itemList += `
						<div class="col-6">
							<a href="/mprescription?${m.illnessID}">
								<div class="card-item style-1">
									<div class="dz-media">
										<img src="public/${subdir}/${m.logo}" alt="image">
									</div>
									<div class="dz-content">
										<h6 class="title mb-3"><a href="product.html">${m[illnessName]}</a></h6>
									</div>
								</div>
							</a>
						</div>
						`;
					}
				})
				illnesslist.innerHTML = itemList;
				deferred.resolve(false);
			}
		},
		error: function() {
			deferred.reject("Data Loading Error");
		},
		timeout: 5000
	});
	deferred.promise();
}

/*
var installapp = document.getElementById('installapp');
if (installapp !== null) {
	installapp.innerHTML = `
		<h5 class="title mb-0 text-nowrap text-dark">Anti<img src="assets/images/icons/stop.png" width="36" class="searchicon"><font class="text-dark">Fake</font></h5>
		<h6 class="title font-w600">Cài ứng dụng trên điện thoại</h6>
		<p class="pwa-text">Chọn nút chia sẽ <img src="assets/images/icons/share2.png" alt="share" width="20" height="20">(android), phía trên, góc phải,
		hoặc nút <img src="assets/images/icons/share.png" alt="share" width="24" height="24"> (iphone) phía dưới, mở thư mục,<br/>
		lần xuống cuối trang, rồi chọn "Cài ứng dụng".</p>
		<button type="button" class="btn btn-sm btn-primary pwa-btn">Đóng</button>
	`;
}
*/

var packagetypes = document.getElementById('packagetypes');
if (packagetypes !== null) {
	packagetypes.innerHTML = "";
	if ((roleID==6) || (roleID==7)) {
		if (roleID==6) {
			packagetypes.innerHTML += `
			<div class="col-6">
				<div class="package-box box-4 d-flex align content vertically">
					<img src="assets/images/icons/deliverytruck.png" alt="image" width="48" height="48">
					<a href="/mstockreceive" class="btn package-btn ms-2">
						<p class="title-head text-light"><b>${formatMessage('stockreceive')}</b></p>
					</a>
				</div>
			</div>`;
		}
		if ((roleID==6) || ((roleID==7) && (divisionID==2))) {
			packagetypes.innerHTML += `
			<div class="col-6">
				<div class="package-box box-4 d-flex align content vertically">
					<img src="assets/images/icons/boxchk.png" alt="image" width="48" height="48">
					<a href="/mstockcount" class="btn package-btn ms-2">
						<p class="title-head text-light"><b>${formatMessage('stockcount')}</b></p>
					</a>
				</div>
			</div>
			<div class="col-6">
				<div class="package-box box-4 d-flex align content vertically">
					<img src="assets/images/icons/stockchk.png" alt="image" width="48" height="48">
					<a href="/mstockchk" class="btn package-btn ms-2">
						<p class="title-head text-light"><b>${formatMessage('stockcheck')}</b></p>
					</a>
				</div>
			</div>`;
		}
		if (roleID==7) {
			packagetypes.innerHTML += `<div class="col-6">
				<div class="package-box box-4 d-flex align content vertically">
					<img src="assets/images/icons/timekeeping.png" alt="image" width="48" height="48">
					<a href="/mtimekeeping" class="btn package-btn ms-2">
						<p class="title-head text-light"><b>${formatMessage('timekeeping')}</b></p>
					</a>
				</div>
			</div>
			`;
		}
		
	}
}
      


$('.logout').on('click', function(){
	$.get(`/logout`, function(data) {
		setTimeout(function() { window.location.href = '/apphome'; }, 200);
	});
})



//******************  COMMON FUNCTIONS ***************** */
function ord(str){return str.charCodeAt(0);}
function pad2(n) { return n < 10 ? '0' + n : n }
function getDateTimeStampString() {
	var date = new Date();
	return pad2(date.getFullYear().toString().slice(-2)) + pad2(date.getMonth() + 1) + pad2( date.getDate()) + pad2( date.getHours() ) + pad2( date.getMinutes() ) + pad2( date.getSeconds()); 
}
function formatVNcurrency(amount){
	return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
}
const defaultNumbers =' hai ba bốn năm sáu bảy tám chín';

const chuHangDonVi = ('1 một' + defaultNumbers).split(' ');
const chuHangChuc = ('lẻ mười' + defaultNumbers).split(' ');
const chuHangTram = ('không một' + defaultNumbers).split(' ');

function convert_block_three(number) {
	if(number == '000') return '';
	var _a = number + ''; //Convert biến 'number' thành kiểu string

	//Kiểm tra độ dài của khối
	switch (_a.length) {
	case 0: return '';
	case 1: return chuHangDonVi[_a];
	case 2: return convert_block_two(_a);
	case 3: 
		var chuc_dv = '';
		if (_a.slice(1,3) != '00') {
		chuc_dv = convert_block_two(_a.slice(1,3));
		}
		var tram = chuHangTram[_a[0]] + ' trăm';
		return tram + ' ' + chuc_dv;
	}
}

function convert_block_two(number) {
	var dv = chuHangDonVi[number[1]];
	var chuc = chuHangChuc[number[0]];
	var append = '';

	// Nếu chữ số hàng đơn vị là 5
	if (number[0] > 0 && number[1] == 5) {
	dv = 'lăm'
	}

	// Nếu số hàng chục lớn hơn 1
	if (number[0] > 1) {
	append = ' mươi';
	
	if (number[1] == 1) {
		dv = ' mốt';
	}
	}

	return chuc + '' + append + ' ' + dv; 
}

const dvBlock = '1 nghìn triệu tỷ'.split(' ');

function to_vietnamese(number) {
	var str = parseInt(number) + '';
	var i = 0;
	var arr = [];
	var index = str.length;
	var result = [];
	var rsString = '';
	if (index == 0 || str == 'NaN') {
		return '';
	}
	// Chia chuỗi số thành một mảng từng khối có 3 chữ số
	while (index >= 0) {
		arr.push(str.substring(index, Math.max(index - 3, 0)));
		index -= 3;
	}
	// Lặp từng khối trong mảng trên và convert từng khối đấy ra chữ Việt Nam
	for (i = arr.length - 1; i >= 0; i--) {
		if (arr[i] != '' && arr[i] != '000') {
			result.push(convert_block_three(arr[i]));
			// Thêm đuôi của mỗi khối
			if (dvBlock[i]) {
				result.push(dvBlock[i]);
			}
		}
	}

	// Join mảng kết quả lại thành chuỗi string
	rsString = result.join(' ');

	// Trả về kết quả kèm xóa những ký tự thừa
	return rsString.replace(/[0-9]/g, '').replace(/ /g,' ').replace(/ $/,'');
}

function isValidPhoneNumber(phonenumber) {
    // Regex to check valid
    // International Phone Numbers
    let regex = new RegExp(/^[0](3[2-9]|5[2,5-9]|7[0,6-9]|8[1-9]|9[0-9])[0-9]{7}$/);

    // if phonenumber
    // is empty return false
    if (phonenumber == null) {
        return false;
    }

    // Return true if the phonenumber
    // matched the ReGex
    if (regex.test(phonenumber) == true) {
        return true;
    }
    else {
        return false;
    }
}
function screenLog(msg, typex='warning', duration=3000, mode=0) {
    const message = msg;
    const type = typex;
	var toastHeader = formatMessage('warning');
	var toastBody = msg;
	var toastBg = 'toast-warning';
	var toastTxt = ``;
	if (mode==0) {
		switch(typex) {
			case 'success': 
				toastHeader = formatMessage('updatesuccess');
				toastBg = 'toast-success'; 
				icon = `
				<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="256" height="256" viewBox="0 0 256 256" xml:space="preserve">
					<g style="stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: none; fill-rule: nonzero; opacity: 1;" transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)" >
						<circle cx="45" cy="45" r="45" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(93,201,121); fill-rule: nonzero; opacity: 1;" transform="  matrix(1 0 0 1 0 0) "/>
						<path d="M 69.643 24.047 c -0.566 -0.72 -1.611 -0.862 -2.342 -0.309 c -6.579 4.976 -12.729 10.529 -18.402 16.574 c -3.022 3.229 -5.905 6.603 -8.599 10.161 c -1.431 1.904 -2.808 3.86 -4.109 5.889 h -0.082 l -7.6 -15.206 c -0.073 -0.146 -0.157 -0.293 -0.247 -0.433 c -1.401 -2.168 -4.343 -2.741 -6.462 -1.209 c -1.987 1.437 -2.337 4.279 -1.006 6.339 l 12.304 19.043 l 0.151 0.234 c 0.435 0.676 1.13 1.198 2.019 1.398 c 1.525 0.343 3.04 -0.567 3.671 -1.997 c 1.623 -3.678 3.724 -7.281 6.016 -10.76 c 2.337 -3.525 4.898 -6.936 7.614 -10.228 c 5.102 -6.169 10.74 -11.942 16.842 -17.188 C 70.093 25.768 70.199 24.754 69.643 24.047 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(255,255,255); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" />
					</g>
				</svg>
				`;	
			break;
			case 'info': 
				toastHeader = formatMessage('info');
				toastBg = 'toast-warning';
				icon = `
				<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="256" height="256" viewBox="0 0 256 256" xml:space="preserve">
				<g style="stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: none; fill-rule: nonzero; opacity: 1;" transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)" >
					<path d="M 45 0 C 20.187 0 0 20.187 0 45 c 0 24.813 20.187 45 45 45 s 45 -20.187 45 -45 C 90 20.187 69.813 0 45 0 z M 49.761 20.349 c 3.32 0 6.011 2.691 6.011 6.011 c 0 3.32 -2.691 6.011 -6.011 6.011 s -6.011 -2.691 -6.011 -6.011 C 43.75 23.041 46.441 20.349 49.761 20.349 z M 36.462 65.525 l 4.47 -16.675 l 0.877 -3.293 c 1.955 -6.45 -7.849 -4.116 -10.438 -2.294 l -0.228 -2.605 c 2.843 -2.219 22.272 -9.593 20.395 -0.91 l -2.247 8.183 l -3.1 11.786 c -1.955 6.45 7.849 4.116 10.437 2.294 l 0.228 2.605 C 54.014 66.834 34.585 74.208 36.462 65.525 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(234,0,106); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" />
				</g>
				</svg>
				`;
			break;
			case 'error': 
				toastHeader = formatMessage('error');
				toastBg = 'toast-danger';
				icon = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 50 50" xml:space="preserve" width="64px" height="64px" fill="#ffffff" stroke="#ffffff"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <circle style="fill:#D75A4A;" cx="25" cy="25" r="25"></circle> <polyline style="fill:none;stroke:#FFFFFF;stroke-width:2;stroke-linecap:round;stroke-miterlimit:10;" points="16,34 25,25 34,16 "></polyline> <polyline style="fill:none;stroke:#FFFFFF;stroke-width:2;stroke-linecap:round;stroke-miterlimit:10;" points="16,16 25,25 34,34 "></polyline> </g></svg>`;
			break;
			default:
				toastHeader = formatMessage('warning');
				toastBg = 'toast-warning';
				icon = `
				<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="24" height="24" viewBox="0 0 256 256" xml:space="preserve">
				<g style="stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: none; fill-rule: nonzero; opacity: 1;" transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)" >
					<path d="M 45 87.152 h 39.944 c 3.045 0 5 -3.233 3.587 -5.93 L 48.587 5.018 c -1.516 -2.893 -5.658 -2.893 -7.174 0 L 1.469 81.222 c -1.413 2.697 0.542 5.93 3.587 5.93 H 45 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(234,0,0); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" />
					<path d="M 45 63.666 L 45 63.666 c -1.519 0 -2.769 -1.196 -2.836 -2.714 l -2.617 -25.256 c -0.238 -3.172 2.272 -5.878 5.453 -5.878 h 0 c 3.181 0 5.691 2.705 5.453 5.878 l -2.617 25.256 C 47.769 62.47 46.519 63.666 45 63.666 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(255,255,255); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" />
					<circle cx="45.003" cy="73.383" r="4.523" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(255,255,255); fill-rule: nonzero; opacity: 1;" transform="  matrix(1 0 0 1 0 0) "/>
					<path d="M 45 64.666 c -2.06 0 -3.744 -1.612 -3.835 -3.67 l -2.613 -25.197 c -0.137 -1.817 0.486 -3.597 1.706 -4.912 c 1.22 -1.315 2.948 -2.069 4.742 -2.069 c 1.794 0 3.522 0.754 4.742 2.069 s 1.843 3.095 1.708 4.883 l -2.619 25.285 C 48.745 63.054 47.061 64.666 45 64.666 z M 45 30.818 c -1.257 0 -2.421 0.508 -3.276 1.429 c -0.855 0.922 -1.274 2.12 -1.18 3.374 l 2.615 25.227 c 0.048 1.045 0.854 1.817 1.841 1.817 c 0.987 0 1.794 -0.772 1.837 -1.758 l 2.621 -25.315 c 0.092 -1.226 -0.327 -2.424 -1.182 -3.346 C 47.421 31.326 46.258 30.818 45 30.818 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" />
					<path d="M 45 78.907 c -3.045 0 -5.523 -2.478 -5.523 -5.522 c 0 -3.046 2.478 -5.523 5.523 -5.523 c 3.046 0 5.523 2.478 5.523 5.523 C 50.523 76.429 48.046 78.907 45 78.907 z M 45 69.861 c -1.942 0 -3.523 1.581 -3.523 3.523 c 0 1.942 1.581 3.522 3.523 3.522 c 1.942 0 3.523 -1.58 3.523 -3.522 C 48.523 71.442 46.942 69.861 45 69.861 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" />
					<path d="M 84.944 88.152 H 5.055 c -1.783 0 -3.398 -0.911 -4.321 -2.437 c -0.923 -1.525 -0.979 -3.379 -0.152 -4.957 L 40.527 4.553 C 41.402 2.885 43.116 1.848 45 1.848 c 1.884 0 3.598 1.037 4.473 2.705 l 39.944 76.206 c 0.828 1.578 0.771 3.432 -0.151 4.957 S 86.727 88.152 84.944 88.152 z M 45 3.848 c -1.155 0 -2.165 0.611 -2.701 1.634 L 2.354 81.686 c -0.5 0.954 -0.466 2.073 0.091 2.994 c 0.558 0.922 1.533 1.472 2.61 1.472 h 79.889 c 1.077 0 2.053 -0.55 2.61 -1.472 c 0.557 -0.921 0.591 -2.04 0.091 -2.993 L 47.701 5.482 C 47.165 4.459 46.155 3.848 45 3.848 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" />
				</g>
				</svg>
				`;
			}

		toastTxt = `
		<div id="toast" class="card-img-overlay pt-5 mt-5 ps-3 ">
			<div class="toast style-1 fade mb-2 ${toastBg} show" role="alert" >
				<div class="toast-body">
					${icon}
					<div class="toast-content ms-3 me-2">
						<strong id="toastHeader">${toastHeader}</strong>
						<small id="toastBody" class="d-block">${toastBody}</small>
					</div>
				</div>
			</div>
		</div>
		`;
	} else {
		toastTxt = `
		<div id="toast" class="card-img-overlay pt-5 mt-5 ps-3 ">
			 <div class="dz-spinner color-spinner">
				<div class="spinner-border spinner-sm me-2 mb-2 text-${typex}" role="status">
					<span class="sr-only">${toastBody}</span>
				</div>  
			</div>
		</div>
		`;
	}

	$('#toast').html(toastTxt);		

	$('#toast').show();
    setTimeout(function() {
		$('#toast').fadeOut()
    }, duration);
}

function screenConfirm(headerx, bodymsg, callback) {
	let toastTxt = `
	<div class="toast-container position-absolute top-1 end-0 p-3">
		<div class="toast show" role="alert" aria-live="assertive" aria-atomic="true">
			<div class="toast-header bg-danger text-white">
				<strong class="me-auto">${headerx}</strong>
				<button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
			</div>
			<div class="toast-body">
				${bodymsg}
				<div class="mt-2 pt-2 border-top">
					<button type="button" class="btn btn-primary btn-sm takeaction">${formatMessage('confirm')}</button>
					<button type="button" class="btn btn-secondary btn-sm" data-bs-dismiss="toast">${formatMessage('close')}</button>
				</div>
			</div>
		</div>
	</div>
	`;
	$('#toast').html(toastTxt);		
	$('#toast').show();
	$(".takeaction").on('click', function(e) {
		e.preventDefault();
		$('#toast').hide();
		callback(1)
	})
	$(".takeaction").on('click', function(e) {
		e.preventDefault();
		$('#toast').hide();
		callback(0)
	})
}

function initImageCell(cellElement, img, imgwidth, imgheight) {
    if (cellElement !== null) {
        var backendURL = `public/`;
        let imageElement = document.createElement("img");
        let imagepath = `${backendURL}logoblank2.png`;
		console.log("img: " + img);
        if (img && typeof img !== undefined && (img.length > 0) && (img !== 'undefined') && (img !== 'null')) {
            imagepath =  `${backendURL}${subdir}/${img}`;
        }
        console.log("imagepath: " + imagepath);
        imageElement.setAttribute('src',`${imagepath}`);
        
        imageElement.setAttribute("width", imgwidth);
        imageElement.setAttribute("height", imgheight);
        cellElement.append(imageElement);
    }
}

//********* COMMON FUNCTIONS ***********/    
String.prototype.hexDecode = function(){
    var j;
    var hexes = this.match(/.{1,4}/g) || [];
    var back = "";
    for(j = 0; j<hexes.length; j++) {
        back += String.fromCharCode(parseInt(hexes[j], 16));
    }

    return back;
}

String.prototype.hexEncode = function(){
    var hex, i;

    var result = "";
    for (i=0; i<this.length; i++) {
        hex = this.charCodeAt(i).toString(16);
        result += ("000"+hex).slice(-4);
    }

    return result
}


//****** navigation header label ******/
$('.language').html(formatMessage('language'));
$('.settings').html(formatMessage('settings'));
$('.colortheme').html(formatMessage('colortheme'));
$('.darkmode').html(formatMessage('darkmode'));
$('.usescanner').html(formatMessage('usescanner'));
$('.account').html(formatMessage('account'));
$('#account').html(formatMessage('account'));
$('#logout').html(formatMessage('logout'));
$('#updateprofile').html(formatMessage('updateprofile'));
$('#changepassword').html(formatMessage('changepassword'));
$('#mywallet').html(formatMessage('mywallet'));
$('#checkwallet').html(formatMessage('checkwallet'));
$('.checkwallet').html(formatMessage('checkwallet'));
$('.otherservices').html(`${formatMessage('otherservices')}`);
$('.notfound').html(`${formatMessage('notfound')}`);
$('.notfoundinfo').html(`${formatMessage('notfoundinfo')}`);
$('.sorrytext').html(`${formatMessage('sorrytext')}`);
$('.pleaseenteryourphone').html(`${formatMessage('pleaseenteryourphone')}`);
$('.stockreceive').html(`${formatMessage('stockreceive')}`);
$('.ratingsnreview').html(`${formatMessage('ratingsnreview')}`);
$('.myorders').html(`${formatMessage('myorders')}`);
$('#ordersentnprocessing').html(`${formatMessage('ordersentnprocessing')}`);
$('#orderconfirminfo1').html(`${formatMessage('orderconfirminfo1')}`);
$('.processing').html(`${formatMessage('processing')}`);
$('.search').html(`${formatMessage('search')}`);
$('.contactname').html(`${formatMessage('contactname')}`);
$('.stockcheck').html(`${formatMessage('stockcheck')}`);






	
$('#directorboard').html(formatMessage('directorboard'));
$('#manstaff').html(formatMessage('manstaff'));
$('#distributor').html(formatMessage('distributor'));
$('#diststaff').html(formatMessage('diststaff'));
$('#agent').html(formatMessage('agent'));
$('#agestaff').html(formatMessage('agestaff'));
$('.contact').html(formatMessage('contact'));
$('#customer').html(formatMessage('customer'));
$('#ordersx').html(formatMessage('ordersx'));
$('#payment').html(formatMessage('payment'));


$('#walletmanagement').html(formatMessage('walletmanagement'));
$('#walletxchange').html(formatMessage('walletxchange'));
$('#walletapproval').html(formatMessage('walletapproval'));
$('.chooseproduct').html(formatMessage('chooseproduct'));
$('#payroll').html(formatMessage('payroll'));


$('.doctorprescription').html(formatMessage('doctorprescription'));
$('.requestprescription').html(formatMessage('requestprescription'));
$('.medication').html(formatMessage('medication'));
$('.retailsale').html(formatMessage('retailsale'));
$('.tiemtruyen').html(formatMessage('tiemtruyen'));
$('.stockcount').html(formatMessage('stockcount'));

$('.agegroup').html(formatMessage('agegroup'));
$('.weight').html(formatMessage('weight'));
$('.iscough').html(formatMessage('iscough'));
$('.headacefever').html(formatMessage('headacefever'));
$('.stomach').html(formatMessage('stomach'));
$('.sleepy').html(formatMessage('sleepy'));
$('.diabetic').html(formatMessage('diabetic'));
$('.bloodpressure').html(formatMessage('bloodpressure'));
$('.allergymed').html(formatMessage('allergymed'));
$('.symptom').html(formatMessage('symptom'));
$('.budget').html(formatMessage('budget'));
$('.standard').html(formatMessage('standard'));
$('.premium').html(formatMessage('premium'));
$('.shoppingcart').html(formatMessage('shoppingcart'));
$('.home').html(formatMessage('home'));
















  
