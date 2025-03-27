
$(() => {
    
    var memberid = $('#memberid').text();
    var groupid = $('#groupid').text();
    $('#pagetitle').html('CHECKOUT');

    var cidx = 0;
    var namex ='';
    var phonex ='';
    var abnx ='';
    var dobx ='';
    var imgLink  = "";
    

    var company ='';
    $('#cashondelivery').html(formatMessage('cashondelivery'));
    $('#paycash').html(formatMessage('paybycash'));
    $('#banktransfer').html(formatMessage('banktransfer'));
    $('.submitBtn').html(formatMessage('submit'));

    var customerSource = [];

    $('#phonexTxt').html(formatMessage('phone'));
    $('#namexTxt').html(`${formatMessage('customername')} ${formatMessage('customer')}`);
    $('#dobxTxt').html(formatMessage('dob'));
//************************************************ */
    $.getJSON(`/customerlist`,function (data){
        data.forEach(f=> {
            customerSource.push(f)
        });
        customerSource.sort(function(a, b) {
            return a.namephone.localeCompare(b.namephone);
        });
        cidx = localStorage.getItem('customerID');
        if (cidx) {
            var e = customerSource.filter(f=> f.memberID == cidx)[0];
            console.log(e)
            cidx = e.memberID;
            namex  = e.name; 
            phonex  = e.phone;
            dobx  = e.dob;
            $('#namex').val(namex);
            $('#dobx').val(dobx);
            $('#phonex').val(phonex);
        }
    })
//************************************************ */
var searchbox = $("#searchBox").dxLookup({
    label:  formatMessage('search') ,
    labelMode: 'floating',
    width: 300,
    cancelButtonText: formatMessage('cancel'),
    noDataText: formatMessage('nodatatext'),
    searchPlaceholder: formatMessage('search'),
    dataSource: new DevExpress.data.DataSource({ 
        store: customerSource,
        sort: ['namephone'], 
        key: "[memberID]"
    }),
    valueExpr: "memberID",
    displayExpr: "namephone",
    onValueChanged(a) {
        var e = customerSource.filter(f=> f.memberID == a.value)[0];
        console.log(e)
        cidx = e.memberID;
        namex  = e.name; 
        phonex  = e.phone;
        abnx  = e.abn;
        dobx  = e.dob;
        $('#namex').val(namex);
        $('#dobx').val(dobx);
        $('#phonex').val(phonex);
        localStorage.setItem('customerID', cidx);
    },
   
}).dxLookup('instance');
//************************************************ */
$("#removeorder").on('click', function(e){
    e.preventDefault();
    screenConfirm(formatMessage('confirm2delete'), formatMessage('about2deleteall'), function(result){
        if (result == 1) { //ok confirm to delete
            localStorage.removeItem(`imedic${memberid}`);
            window.location = "/mindex";
        }
    })
})

$(".addBtn").on('click', function(e){
    e.preventDefault();
    window.location = `/mcusprofile?0`;
})

$(".editBtn").on('click', function(e){
    e.preventDefault();
    window.location = `/mcusprofile?${cidx}`;
})
//************************************************ */

$('.submitBtn').on('click', function(){
    var valuex = $("input[type=radio][name=btnradio]:checked").val();
    if ((cidx==0) ) {
        screenLog(formatMessage('nobuyerinfo'), 'error');
    } else {
        var tempdata = {
            groupID: groupid,
            customerID: cidx,
            agentStaffID: memberid,
            amount: subtotalVal,
            tax: taxVal,
            status:1,
            incltax: 1,
            paytype: valuex,
            orderitems: shopcartx,
        };
        if (imgLink.length > 0) {
            tempdata.imgLink = imgLink;
        }
        const deferred = $.Deferred();
        $.ajax({
            url: `/insertsalex`,
            method: "POST",
            dataType: "json",
            data: tempdata,
            success: function(data) {
                if (data.status < 0) {
                    screenLog(`${formatMessage('sentresult')}: ${formatMessage('falied')}`, 'error');
                } else {
                    localStorage.removeItem(`customerID`);
                    localStorage.removeItem(`imedic${memberid}`);
                    window.location.href = "/mpaymentconfirm" 
                }
                deferred.resolve(data);
            },
            error: function() {
                deferred.reject("Data Loading Error");
            },
            timeout: 5000
        });
        deferred.promise();
    }
})
    

    var shopcartx = localStorage.getItem(`imedic${memberid}`);
    if (shopcartx && (shopcartx !== '[]')) {
        shopcartx = JSON.parse(shopcartx.hexDecode());
        shopcartx.forEach((f)=>{
            if (f.buytype==2) {
                f.price = f.price2;
            } else if (f.buytype==1) {
                f.price = f.price2;
                f.qty = f.qty * f.qtyperPack
            } else {
                f.price = Math.round(f.pricex/f.qtyperBox);
                f.qty = f.qty * f.qtyperBox
            }
            delete f.barcode;
            delete f.catName;
            delete f.prodName;
            f.costperitem = Math.ceil((f.costperitem/f.qtyperBox)/10)*10;
            delete f.qtyperBox;
            delete f.unitMeasure;
            f.tax = f.price * f.taxrate;
            delete f.typeID;
        })
        

    } else {
        shopcartx = [];
        screenLog(formatMessage('youhaveemptycart'))
    }
    var subtotalVal = 0;
    var taxVal = 0;
    shopcartx.forEach((f) => {
        subtotalVal+= (f.price * f.qty);
        taxVal+= (f.price * f.qty * f.taxrate);
    })
    var totalVal = subtotalVal;
    subtotalVal = subtotalVal - taxVal;

    $('#salemanTxt').html(formatMessage('saleman'));
    $('#saleman').val($('#name').text());
    $('#subtotalTxt').html(formatMessage('subtotal'));
    $('#subtotal').val(`${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(subtotalVal)}`);
    $('#taxTxt').html(formatMessage('tax'));
    $('#tax').val(`${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(taxVal)}`);
    $('#totalTxt').html(formatMessage('total'));
    $('#total').val(`${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalVal)}`);
    
    initImageCell(document.getElementById('prescriptionimg'), "imgLink", imgLink, '300','600');

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
        let uploadurl = `uploadimages/${tablex}/${searchkey}/${groupid}/${field}` ;
        
        //console.log("uploadurl: " + uploadurl);
    
        let fileUploader = $(fileUploaderElement).dxFileUploader({
        multiple: false,
        accept: "image/*",
        uploadMode: "instantly",
        uploadUrl: uploadurl,
        labelText: '.',
        selectButtonText: formatMessage('imageselect'),
        maxFileSize: 3000000,
        onValueChanged: function(e) {
            var file = e.value[0];
            // Ensure it's an image
            if (file.type.match(/image.*/)) {
                console.log('An image has been loaded');

                // Load the image
                var reader = new FileReader();
                reader.onload = function (readerEvent) {
                    var image = new Image();
                    image.onload = function (imageEvent) {
                        // Resize the image
                        var canvas = document.createElement('canvas'),
                            max_size = 640,// TODO : pull max size from a site config
                            width = image.width,
                            height = image.height;
                        if (width > height) {
                            if (width > max_size) {
                                height *= max_size / width;
                                width = max_size;
                            }
                        } else {
                            if (height > max_size) {
                                width *= max_size / height;
                                height = max_size;
                            }
                        }
                        canvas.width = width;
                        canvas.height = height;
                        canvas.getContext('2d').drawImage(image, 0, 0, width, height);
                        var dataUrl = canvas.toDataURL(`image/jpeg`);
                        var resizedImage = dataURLToBlob(dataUrl);
                        $.event.trigger({
                            type: "imageResized",
                            blob: resizedImage,
                            url: dataUrl
                        });
                    }
                    image.src = readerEvent.target.result;
                }
                reader.readAsDataURL(file);
            }
        },
        onUploaded: function(e){
            console.log("res: " + e.request.responseText);
            if (cell == "imgLink") imgLink = e.request.responseText.split("/").pop();
            imageElement.setAttribute('src', `${backendURL}/${e.request.responseText}`);
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