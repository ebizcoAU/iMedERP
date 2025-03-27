
$(() => {

$('#customername').html(formatMessage('customername'));
$('#address').html(formatMessage('address'));
$('#cccdfronttxt').html(formatMessage('idfront'));
$('#cccdbacktxt').html(formatMessage('idback'));

var imgLink  = $('#imglinkx').text();
var cccdfront=$('#cccdfront').text();
var cccdback=$('#cccdback').text();
var gid  = $('#groupid').text();
var address  = $('#addressee').text().slice(0,34);
var provincesIDx = parseInt($('#provincesid').text()) > 0?parseInt($('#provincesid').text()):0;
var wardsIDx = parseInt($('#wardsid').text()) > 0? parseInt($('#wardsid').text()):0;
var phuongIDx = parseInt($('#phuongid').text()) > 0? parseInt($('#phuongid').text()):0;
var province = (provincesIDx > 0) ? provincesSource.filter(m => m.provincesID ==provincesIDx)[0].title: '';
var ward = (wardsIDx > 0) ? wardsSource.filter(m => m.wardsID ==wardsIDx)[0].title: '';
var phuong = (phuongIDx > 0) ? phuongSource.filter(m => m.phuongID ==phuongIDx)[0].title: '';
address += `<br/> ${phuong} ${ward} ${province}`;

var namex  = $('#name').text();
var company  = $('#company').text();
var subdir  = $('#subdir').text();
var groupID = $('#groupid').text();
var emailx  = $('#email').text();
var memberID  = $('#memberid').text();
var roleID  = parseInt($('#roleid').text());
$('.namex').html(`${namex.slice(0,20)}`);
$('.emailx').html(`${emailx}`);

var rolesSource;
switch (roleID) {
case 1:
    $('.rolex').html(formatMessage('directorboard'));
    rolesSource = [{id: 2, text:formatMessage('manstaff'), icon: "user"},{roleID: 4, text:formatMessage('distributor'), icon: "user"}];
    $('.companyx').html(`${company}`);
    break;
case 2:
    $('.rolex').html(formatMessage('manstaff'));
    $('.companyx').html(`${company}`);
    break;
case 3:
    $('.rolex').html(formatMessage('customer'));
    break; 
case 4:
    $('.rolex').html(formatMessage('distributor'));
    rolesSource = [{id: 3, text:formatMessage('invitedcustomer'), icon: "user"},{id: 5, text:formatMessage('diststaff'), icon: "user"}];
    $('.companyx').html(`${company}`);
    break;
case 5:
    $('.rolex').html(formatMessage('diststaff'));
    rolesSource = [{id: 3, text:formatMessage('invitedcustomer'), icon: "user"},{id: 6, text:formatMessage('agent'), icon: "user"}];
    $('.companyx').html(`${company}`);
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

setTimeout(function(){
    wardsID.option("dataSource", new DevExpress.data.DataSource({  
        store: wardsSource, 
        filter: ['provincesID', '=', provincesID.option('value')],
        key: "wardsID"
    })); 
}, 500);

var name = $("#namex").dxTextBox({
    label:  formatMessage('customername'),
    stylingMode: 'outline',
    labelMode: 'floating',
    value: $('#name').text()
}).dxTextBox('instance');

var provincesID = $("#cityx").dxLookup({
    label:  formatMessage('city_suburb'),
    labelMode: 'floating',
    value: parseInt($('#provincesid').text()),
    cancelButtonText: formatMessage('cancel'),
    noDataText: formatMessage('nodatatext'),
    searchPlaceholder: formatMessage('search'),
    dataSource: new DevExpress.data.DataSource({ 
        store: provincesSource,
        sort: ['title'], 
        key: "provincesID"
    }),
    valueExpr: "provincesID",
    displayExpr: "title",
    onValueChanged(e) {
        wardsID.option("dataSource", new DevExpress.data.DataSource({  
            store: wardsSource, 
            filter: ['provincesID', '=', e.value],
            key: "wardsID"
        }));  
    },
   
}).dxLookup('instance');

var wardsID = $("#wardx").dxLookup({
    label:  formatMessage('ward'),
    labelMode: 'floating',
    value: parseInt($('#wardsid').text()),
    cancelButtonText: formatMessage('cancel'),
    noDataText: formatMessage('nodatatext'),
    searchPlaceholder: formatMessage('search'),
    dataSource: new DevExpress.data.DataSource({ 
        store: wardsSource, 
        key: "wardsID"
    }),
    valueExpr: "wardsID",
    displayExpr: "title",
    onValueChanged(e) {
        phuongID.option("dataSource", new DevExpress.data.DataSource({  
            store: phuongSource, 
            filter: ['wardsID', '=', e.value],
            key: "phuongID"
        }));  
    },
    
}).dxLookup('instance');


var phuongID = $("#phuongx").dxLookup({
    label:  formatMessage('phuong'),
    labelMode: 'floating',
    value: parseInt($('#phuongid').text()),
    cancelButtonText: formatMessage('cancel'),
    noDataText: formatMessage('nodatatext'),
    searchPlaceholder: formatMessage('search'),
    dataSource: new DevExpress.data.DataSource({ 
        store: phuongSource, 
        key: "phuongID"
    }),
    valueExpr: "phuongID",
    displayExpr: "title"
    
}).dxLookup('instance');

var address = $("#addressx").dxTextBox({
    label:  formatMessage('address'),
    stylingMode: 'outline',
    labelMode: 'floating',
    value: $('#addressee').text()
}).dxTextBox('instance');

var email = $("#emailx").dxTextBox({
    label:  'Email',
    stylingMode: 'outline',
    labelMode: 'floating',
    value: $('#email').text()
}).dxTextBox('instance');

var company = $("#companyx").dxTextBox({
    label:  formatMessage('company'),
    stylingMode: 'outline',
    labelMode: 'floating',
    value: company
}).dxTextBox('instance');

var momoAccount = $("#momoaccountx").dxTextBox({
    label:  formatMessage('momoAccount'),
    stylingMode: 'outline',
    labelMode: 'floating',
    value: $('#momoaccount').text() !== "null" ?$('#momoaccount').text(): ""
}).dxTextBox('instance');


$('.profileBtn').on('click', function(){
    if ((roleID == 1) || (roleID == 2) || (roleID > 3)) {
        var objArray = [
            {name:'name', value: name.option('value')},
            {name:'provincesID', value: provincesID.option('value')},
            {name:'wardsID', value: wardsID.option('value')},
            {name:'phuongID', value: phuongID.option('value')},
            {name:'address', value: address.option('value')},
            {name:'email', value: email.option('value')},
            {name:'company', value: company.option('value')},
            {name:'momoAccount', value: momoAccount.option('value')},
        ];
        if (imgLink.length > 0) objArray.push({name:'imgLink', value: imgLink});
        if (cccdfront.length > 0) objArray.push({name:'cccdfront', value: cccdfront});
        if (cccdback.length > 0) objArray.push({name:'cccdback', value: cccdback});
    } else {
        var objArray = [
            {name:'name', value: name.option('value')},
            {name:'provincesID', value: provincesID.option('value')},
            {name:'wardsID', value: wardsID.option('value')},
            {name:'phuongID', value: phuongID.option('value')},
            {name:'email', value: email.option('value')},
            {name:'momoAccount', value: momoAccount.option('value')},
        ];
        if (imgLink.length > 0) objArray.push({name:'imgLink', value: imgLink});
    }
    //console.log(objArray)
	$.post(`/saveprofile`, objArray, function(data) {
		if (data.status == 1) { 
            window.location= document.referrer;
		} else {
            screenLog(data.message, 'error')
		}
	}, "json");
});

initImageCell(document.getElementById('staffimg'), "imgLink", imgLink, '110','110');
initImageCell(document.getElementById('cccdfrontx'), "cccdfront", cccdfront,'340','162');
initImageCell(document.getElementById('cccdbackx'), "cccdback", cccdback,'340','162');

function initImageCell(cellElement, cell, img, imgwidth, imgheight) {
    if (cellElement !== null) {
        var backendURL = `public/`;
        let buttonElement = document.createElement("div");
        buttonElement.classList.add("retryButton");
    
        let imageElement = document.createElement("img");
        let imagepath = `${backendURL}logoblank2.png`;
        if (img && typeof img !== undefined && (img.length > 0) && (img !== 'undefined')) {
            imagepath =  `${backendURL}${subdir}/${img}`;
        }
        //console.log("imagepath: " + imagepath);
        imageElement.setAttribute('src',`${imagepath}`);
        
        imageElement.setAttribute("width", imgwidth);
        imageElement.setAttribute("height", imgheight);
    
        let fileUploaderElement = document.createElement("div");
        cellElement.append(imageElement);
        cellElement.append(fileUploaderElement);
        cellElement.append(buttonElement);
    
        let retryButton = $(buttonElement).dxButton({
            text: "",
            visible: false,
            onClick: function() {
                // The retry UI/API is not implemented. Use a private API as shown at T611719.
                for (var i = 0; i < fileUploader._files.length; i++) {
                delete fileUploader._files[i].uploadStarted;
                }
                fileUploader.upload();
            }
        }).dxButton("instance");
    
        let tablex = "groupx";
        let searchkey = "groupID";
        let field = imagepath.split("/").pop();
        let uploadurl = `uploadimages/${tablex}/${searchkey}/${gid}/${field}` ;
        
        //console.log("uploadurl: " + uploadurl);
    
        let fileUploader = $(fileUploaderElement).dxFileUploader({
        multiple: false,
        accept: "image/*",
        uploadMode: "instantly",
        uploadUrl: uploadurl,
        labelText: '.',
        selectButtonText: formatMessage('imageselect'),
        maxFileSize: 2000000,
        onValueChanged: function(e) {
            let reader = new FileReader();
            reader.onload = function(args) {
            console.log("e.target:"+ args.target.result);
            imageElement.setAttribute('src', args.target.result);
            }
            reader.readAsDataURL(e.value[0]); // convert to base64 string
        },
        onUploaded: function(e){
            console.log("res: " + e.request.responseText);
            if (cell == "imgLink") imgLink = e.request.responseText.split("/").pop();
            if (cell == "cccdfront") cccdfront = e.request.responseText.split("/").pop();
            if (cell == "cccdback") cccdback = e.request.responseText.split("/").pop();
            
            retryButton.option("visible", false);
        },
        onUploadError: function(e){
            let xhttp = e.request;
            if(xhttp.status === 400){
            e.message = e.error.responseText;
            }
            if(xhttp.readyState === 4 && xhttp.status === 0) {
            e.message = "Không kết nối được";
            }
            retryButton.option("visible", true);
        }
    
        }).dxFileUploader("instance");
    }
}



})