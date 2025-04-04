
var currentURL = window.location.href;

function dzThemeSettings()
{
	var dzThemeSettings = `<ul class="theme-color-settings">
	<li><input class="filled-in" id="primary_color_1" name="primary_bg" type="radio" value="color-red" /><label for="primary_color_1"></label></li>
	<li><input class="filled-in" id="primary_color_2" name="primary_bg" type="radio" value="color-green" /> <label for="primary_color_2"></label>
	</li><li><input class="filled-in" id="primary_color_3" name="primary_bg" type="radio" value="color-blue" /> <label for="primary_color_3"></label></li>
	<li><input class="filled-in" id="primary_color_4" name="primary_bg" type="radio" value="color-pink" /> <label for="primary_color_4"></label></li>
	<li><input class="filled-in" id="primary_color_5" name="primary_bg" type="radio" value="color-yellow" /> <label for="primary_color_5"></label></li>
	<li><input class="filled-in" id="primary_color_6" name="primary_bg" type="radio" value="color-orange" /> <label for="primary_color_6"></label></li>
	<li><input class="filled-in" id="primary_color_7" name="primary_bg" type="radio" value="color-purple" /> <label for="primary_color_7"></label></li>
	<li><input class="filled-in" id="primary_color_8" name="primary_bg" type="radio" value="color-deeppurple" /> <label for="primary_color_8"></label></li>
	<li><input class="filled-in" id="primary_color_9" name="primary_bg" type="radio" value="color-lightblue" /> <label for="primary_color_9"></label></li>
	<li><input class="filled-in" id="primary_color_10" name="primary_bg" type="radio" value="color-teal" /> <label for="primary_color_10"></label></li>
	<li><input class="filled-in" id="primary_color_11" name="primary_bg" type="radio" value="color-lime" /> <label for="primary_color_11"></label></li>
	<li><input class="filled-in" id="primary_color_12" name="primary_bg" type="radio" value="color-deeporange" /> <label for="primary_color_12"></label></li>
	</ul>`;
}


    /* Theme Panel Save */
	var themeOption = ['themeColor','themeVersion'];
	const body = $('body');
    const html = $('html');
	

/* Only For Tanam Package Kit */	
var isCookieSet = true;
	
if(
	currentURL.indexOf('ecommerce') > -1
	|| currentURL.indexOf('fruits') > -1
	|| currentURL.indexOf('meat') > -1
	|| currentURL.indexOf('milk') > -1
	|| currentURL.indexOf('restaurant') > -1 
){
	isCookieSet = false;
}
/* Only For Tanam Package Kit END */	

(function($) {
    "use strict"
	dzThemeSettings();

    //get the DOM elements from right sidebar
    const versionSelect = $('#theme_version');
	
	var getUrlParameter = function getUrlParameter(sParam) {
		var sPageURL = window.location.search.substring(1),
			sURLVariables = sPageURL.split('&'),
			sParameterName,
			i;

		for (i = 0; i < sURLVariables.length; i++) {
			sParameterName = sURLVariables[i].split('=');

			if (sParameterName[0] === sParam) {
				return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
			}
		}
		return false;
	};
	
	var theme =  getUrlParameter('color-theme');
	var themeMode =  getUrlParameter('theme-mode');
	//console.log(theme);
	
    // Change the theme version controller
    jQuery('.theme-btn').on('click',function(){
        jQuery('body').toggleClass('theme-dark');
        jQuery('.theme-btn').toggleClass('active');
        if(jQuery('body').hasClass('theme-dark')){
           setCookie('themeVersion_value', 'theme-dark'); 
		   $('.approvallogo').attr("src", `assets/images/icons/whiteqrcode.png`); //VP 
		   $('.searchicon').attr("src", `assets/images/icons/stop.png`); //VP  
		   $(".scanBG").css("background-color", "rgba(48, 44, 43, 0.8)"); //VP 
        }else{
           setCookie('themeVersion_value', ''); 
		   $('.approvallogo').attr("src", `assets/images/icons/approval.png`); //VP  
		   $('.searchicon').attr("src", `assets/images/icons/stop.png`); //VP  
		   $(".scanBG").css("background-color", "rgba(248, 244, 243, 0.8)"); //VP 
        }
		handleMenuLogo(getCookie('themeColor_value'));
    });

	 // Change the theme version controller
	 jQuery('.scanner-btn').on('click',function(){
        if (getCookie('scannerMode')=='ON'){
           setCookie('scannerMode', ''); 
        }else{
           setCookie('scannerMode', 'ON'); 
        }
		if (window.location.href.includes('mscanner'))
 			window.location.reload();
    });

	
	//change the primary color controller
    $('input[name="theme_color"]').on('click', function() {
        body.attr('data-theme-color',  this.value);
		//alert(111);
		if(isCookieSet){
			//console.log(22+'-'+this.value);
			setCookie('themeColor_value', this.value);
			handleMenuLogo(getCookie('themeColor_value'));
		}
    });
	
	if(theme){
		console.log("theme: " + theme)
		body.attr('data-theme-color', theme);
		setCookie('themeColor_value', theme);
	}
	if(themeMode){
		if(themeMode == "dark"){
			jQuery('body').addClass('theme-dark');
			setCookie('themeVersion_value', 'theme-dark'); 
			$('.approvallogo').attr("src", `assets/images/icons/whiteapproval.png`); //VP 
		    $('.searchicon').attr("src", `assets/images/icons/stop.png`); //VP  
		}else if(themeMode == "light"){
			jQuery('body').removeClass('theme-dark');
			setCookie('themeVersion_value', ''); 
			$('.approvallogo').attr("src", `assets/images/icons/approval.png`); //VP  
		    $('.searchicon').attr("src", `assets/images/icons/stop.png`); //VP  
		}
	}
    
    
	/* Set Theme By Cookie */
	
		//console.log(444);
		//console.log(getCookie('themeColor_value'));
		setThemePanel();
	
	
	
    
    
	
})(jQuery);


/* Cookies Function */
function setCookie(cname, cvalue, exhours) 
{
    var d = new Date();
    d.setTime(d.getTime() + (0.5*60*1000)); /* 60 Minutes */
    var expires = "expires="+ d.toString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) 
{
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function deleteCookie(cname) 
{
	var d = new Date();
	d.setTime(d.getTime() + (1)); // 1/1000 second
	var expires = "expires="+ d.toString();
	//document.cookie = cname + "=1;" + expires + ";path=/";
	document.cookie = cname + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT"+";path=/";
}

function deleteAllCookie(reload = true)
{
	jQuery.each(themeOption, function(optionKey, optionValue) {
			deleteCookie(optionKey);
	});
	if(reload){
		location.reload();
	}
}

function setThemePanel(){
    jQuery.each(themeOption, function(index, themeOptionItem) {
		themeOptionItemValue = getCookie(themeOptionItem+'_value');
		
		/* Only For Tanam Package Kit */
		if(!isCookieSet && themeOptionItem == 'themeColor'){
			return true;
		}
		/* Only For Tanam Package Kit END */
			
		
		if(themeOptionItemValue != '' && themeOptionItemValue != 1){
			
			if(themeOptionItem == 'themeColor'){
				body.attr('data-theme-color', themeOptionItemValue);
			}else if(themeOptionItem == 'themeVersion'){
				body.addClass(themeOptionItemValue);
                jQuery('.theme-btn').addClass('active');
			}
		}
	});
}
/* Cookies Function End */