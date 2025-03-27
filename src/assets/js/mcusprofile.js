
$(() => {
DevExpress.localization.locale(locale);
console.log(DevExpress.localization.locale());

$('#customername').html(formatMessage('customername'));

var imgLink  = $('#imglink').text();

var namex  = $('#name').text();
var cid  = $('#cid').text();
var company  = $('#company').text();
var groupID  = $('#groupid').text();
var subdir  = $('#subdir').text();
var emailx  = $('#email').text();
var memberID  = $('#memberid').text();
var roleID  = parseInt($('#roleid').text());
$('.namex').html(`${namex.slice(0,20)}`);
$('.rolex').html(formatMessage('customer'));
$('.companyx').html(`${company}`);



$("#namexTxt").html(formatMessage('customername'));
var name = $("#namex").dxTextBox({
    stylingMode: 'outline',
    labelMode: 'floating',
    value: $('#name').text()
}).dxTextBox('instance');

$("#phonexTxt").html(formatMessage('phone'));
var phone = $("#phonex").dxTextBox({
    stylingMode: 'outline',
    labelMode: 'floating',
    value: $('#phone').text()
}).dxTextBox('instance');

$("#dobxTxt").html(formatMessage('dob'));
var dob = $("#dobx").dxDateBox({
    type: 'date',
    stylingMode: 'outline',
    labelMode: 'floating',
    value: $('#dob').text()
}).dxDateBox('instance');


$('.profileBtn').on('click', function(){
    if (cid > 0) {
        var objArray = [
            {name:'memberID', value: cid},
            {name:'name', value: name.option('value')},
            {name:'phone', value: phone.option('value')},
            {name:'dob', value: dob.option('value')},
        ];
        if (imgLink.length > 0) objArray.push({name:'imgLink', value: imgLink});
        //console.log(objArray)
        $.post(`/update/memberx`, objArray, function(data) {
            if (data.status == 1) { 
                window.location= document.referrer;
            } else {
                screenLog(data.message, 'error')
            }
        }, "json");
    } else {
        var objArray = [
            {name:'name', value: name.option('value')},
            {name:'phone', value: phone.option('value')},
            {name:'dob', value: dob.option('value')},
            {name:'parentID', value: memberID},
            {name:'groupID', value: groupID},
            {name:'roleID', value: 3},
            {name:'status', value: 1},

        ];
        if (imgLink.length > 0) objArray.push({name:'imgLink', value: imgLink});
        //console.log(objArray)
        $.post(`/new/memberx`, objArray, function(data) {
            if (data.status == 1) { 
                localStorage.setItem('customerID', data.newid);
                window.location= document.referrer;
            } else {
                screenLog(data.message, 'error')
            }
        }, "json");
    }
   
});

initImageCell(document.getElementById('staffimg'), "imgLink", imgLink, '110','110');

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
        let uploadurl = `uploadimages/${tablex}/${searchkey}/${groupID}/${field}` ;
        
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