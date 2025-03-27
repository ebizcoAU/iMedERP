
$(() => {
    $('#pagetitle').html(formatMessage('shoppingcart'));
    $('#continueshopping').html(formatMessage('continueshopping'));
    var memberid = $('#memberid').text();
    var roleid = $('#roleid').text();
    var divisionid = $('#divisionid').text();
    var taxVal = 0;
    var subtotalVal = 0;
    var totalVal = 0;
    var productSource = [];
    
    


//********************* SCANNER ******************* */
    var audioCreated = false;
    var scannerOn=false;

    //*** initizie sound player ****
    const okBeep = new Audio();
    okBeep.autoplay = false;
    okBeep.src = './assets/audio/beep.mp3';

    const warningBeep = new Audio();
    warningBeep.autoplay = false;
    warningBeep.src = './assets/audio/bad.mp3';

 //************************************************ */
 $.getJSON(`/productlist`,function (data){
    data.forEach(f=> {
        f.productName = capitalizeFirstLetter(f.productName.trim());
        productSource.push(f)
    });
    productSource.sort(function(a, b) {
        return a.productName.localeCompare(b.productName);
    });
 })
 function capitalizeFirstLetter(val) {
    return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}
 //************************************************ */
    var searchbox = $("#searchBox").dxLookup({
        label:  formatMessage('search'),
        labelMode: 'floating',
        value:productSource[0],
        cancelButtonText: formatMessage('cancel'),
        noDataText: formatMessage('nodatatext'),
        searchPlaceholder: formatMessage('search'),
        dataSource: new DevExpress.data.DataSource({ 
            store: productSource,
            sort: ['productName'], 
            key: "[productID]"
        }),
        valueExpr: "productID",
        displayExpr: "productName",
        onValueChanged(a) {
            var foundIndex = shopcartx.findIndex(x => x.productID == a.value);
            if (foundIndex == -1) {
                var e = productSource.filter(f=> f.productID === a.value)[0];
                shopcartx.push({
                    productID: e.productID,
                    categoryID: e.categoryID,
                    typeID: e.typeID,
                    catName: e.categoryName,
                    prodName: e.productName,
                    barcode: e.barcode,
                    costperitem: e.costperitem,
                    price: e.unitPrice,
                    price2: e.unitPrice2,
                    pricex: e.unitPrice2,
                    taxrate: e.taxrate,
                    stockqty: e.stockqty,
                    refID: 0,
                    qty: 1,
                    qtyperBox: e.qtyperBox,
                    qtyperPack: e.qtyperPack,
                    buytype: 2,
                    unitMeasure: e.unitMeasure,
                    unitMeasure2: e.unitMeasure2
                });
                cartlisting(); 
            }
        },
       
    }).dxLookup('instance');
 //************************************************ */
    var shopcartx = localStorage.getItem(`imedic${memberid}`);
    if (shopcartx && (shopcartx !== '[]')) {
        shopcartx = JSON.parse(shopcartx.hexDecode());
    } else {
        shopcartx = [];
    }
    cartlisting(); 
    

    function cartlisting () {
        var linebg = 'bg-light';
        if (getCookie('themeVersion_value')=='theme-dark'){
            linebg = 'bg-dark';
        }
        var prodlisting = document.getElementById('prodlisting');
        if (prodlisting !== null) {
            var itemList =``;
            shopcartx.forEach((m, index)=>{
                //console.log(m)
                var toaIDText = (m.refID > 0)?`${formatMessage('prescription')}:${m.refID}`:''; 
                var utype = (m.typeID > 0) ? typeSource.filter(n => n.status == m.typeID)[0].statext: '';
                var umeasure1 = (m.unitMeasure > 0) ? unitmeasureSource.filter(n => n.status == m.unitMeasure)[0].statext: '';
                var umeasure2 = (m.unitMeasure2 > 0) ? unitmeasureSource2.filter(n => n.status == m.unitMeasure2)[0].statext: '';
                var umeasureTxt = `${m.qtyperBox} ${umeasure2}/${umeasure1}`;   
                itemList += `
                <li class="item-content ${index%2==0?linebg:''}  pt-2 mt-0">
                    <div>
                        <div class="item-inner">
                            <div class="item-title-row">
                                <h6 class="item-title sub-title">${m.prodName}</h6>
                                <div class="d-flex">
                                    <div class="item-subtitle text-dark">${m.catName} (${umeasureTxt})/${utype}, ${formatMessage('warehouse2')}:${Math.round(m.stockqty*m.qtyperBox)} ${umeasure2}</div>
                                    <h6 class="text-warning ps-2">${toaIDText}</h6>
                                </div>
                            </div>
                            <div class="item-title-row">
                                <div class="d-flex justify-content-between">
                                    <div class="d-flex flex-row">
                                        <div class="dz-stepper border-1 style-3 rounded-stepper">
                                            <input class="stepper" type="text" value="${m.qty}" id="${m.productID}">
                                        </div>
                                        <div class="d-flex flex-column ps-2">`;
                                        if ((m.unitMeasure==1) && (m.qtyperPack>1)) {
                                            itemList += `
                                            <div class="btn-group mb-2 btn-group-sm">
                                                <button class="btn btn-primary ${m.productID} ${m.buytype==0?'active':''}"  name="buytype" type="button" id="${m.productID}" value="0" style="height:28px">${umeasure1}</button>
                                                <button class="btn btn-primary ${m.productID} ${m.buytype==1?'active':''}"  name="buytype" type="button" id="${m.productID}" value="1" style="height:28px">Vỉ</button>
                                                <button class="btn btn-primary ${m.productID} ${m.buytype==2?'active':''}" name="buytype" type="button" id="${m.productID}" value="2" style="height:28px">${umeasure2}</button>
                                            </div>
                                            `;
                                        } else if (((m.unitMeasure==1)||(m.unitMeasure==2)) && (m.qtyperPack==1)) {
                                            itemList += `
                                            <div class="btn-group mb-2 btn-group-sm">
                                                <button class="btn btn-primary ${m.productID} ${m.buytype==0?'active':''}"  name="buytype" type="button" id="${m.productID}" value="0" style="height:28px">${umeasure1}</button>
                                                <button class="btn btn-primary ${m.productID} ${m.buytype==2?'active':''}" name="buytype" type="button" id="${m.productID}" value="2" style="height:28px">${umeasure2}</button>
                                            </div>
                                            `;
                                        }
                                        itemList += `
                                            <div class="d-flex flex-row ">
                                                <div class="me-2 mb-0 mt-1" style="color:#666;font-size:14px;font-weight:400">${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(m.pricex)}/${m.buytype==1?'Vỉ':m.buytype==0?umeasure1:umeasure2}</div>
                                                <div class="me-2 mb-0" style="color:#66E;font-size:16px;font-weight:900">${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(m.pricex * m.qty)}</div>
                                            </div> 
                                        </div>
                                        <div class="d-flex flex-column align-item-start"> `;
                                            if ((m.refID < 2) && (m.unitMeasure2<6) ){
                                                itemList += `                        
                                                <div class="d-flex flex-row ps-2 pt-0 ml-auto p-2">
                                                    <div class="me-2 mb-0" style="color:#666;font-size:16px;font-weight:500">${formatMessage('prescription')}</div>
                                                    <input type="checkbox" class="chkToa" id="toa_${index}" ${m.refID>0?'checked':''}> 
                                                </div>`;
                                            }
                                        itemList += `   
                                                <div class="delBtn ps-3" id="del_${m.productID}_${m.refID}"><i class="fa fa-trash"></i></div> 
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </li>
                `;

               
            })
            prodlisting.innerHTML = itemList;

            $(`.chkToa:checkbox`).on('change', function(e){
                e.preventDefault();
                var index = this.id.split("_")[1];
                if ($(this).is(':checked')) {
                    shopcartx[index].refID = 1;
                    if (shopcartx[index].pricex < 500) {
                        shopcartx[index].pricex = shopcartx[index].pricex * 3;
                    } else if (shopcartx[index].price2 < 1500) {
                        shopcartx[index].pricex = shopcartx[index].pricex * 2.1;
                    } else if (shopcartx[index].price2 < 3200) {
                        shopcartx[index].pricex = shopcartx[index].pricex * 1.7;
                    } else {
                        shopcartx[index].pricex = shopcartx[index].pricex * 1.3;
                    }
                } else {
                    shopcartx[index].refID = 0;
                    if (shopcartx[index].pricex < 1500) {
                        shopcartx[index].pricex = shopcartx[index].pricex / 3;
                    } else if (shopcartx[index].pricex < 3400) {
                        shopcartx[index].pricex = shopcartx[index].pricex / 2.1;
                    } else if (shopcartx[index].price2 < 5440) {
                        shopcartx[index].pricex = shopcartx[index].pricex / 1.7;
                    } else {
                        shopcartx[index].pricex = shopcartx[index].pricex / 1.3;
                    }
                }
                cartlisting();
            })
            
            $(".delBtn").on('click', function(e){
                e.preventDefault();
                var pid = this.id;
                console.log(pid)
                screenConfirm(formatMessage('confirm2delete'), formatMessage('about2delete'), function(result){
                    if (result == 1) { //ok confirm to delete
                        let carttmp = shopcartx.filter(function(x) { return x.productID == pid.split("_")[1]});
                        //console.log(carttmp)
                        let reftmp = carttmp.filter(function(x) { return x.refID == pid.split("_")[2]})[0];
                        //console.log(reftmp)
                        shopcartx = shopcartx.filter(function(x) { return  (x.productID != reftmp.productID)});
                        //console.log(shopcartx)
                        cartlisting();
                    }
                })
            })
            $(".stepper").on('change', function(e){
                var foundIndex = shopcartx.findIndex(x => x.productID == e.target.id);
                if (foundIndex > -1) {
                    shopcartx[foundIndex].qty = e.target.value;
                    let qtyx = 0;
                    if (shopcartx[foundIndex].buytype==2) { //Vien
                        if (parseInt(shopcartx[foundIndex].qty) >= shopcartx[foundIndex].qtyperBox) {
                            shopcartx[foundIndex].pricex = Math.ceil((shopcartx[foundIndex].price/shopcartx[foundIndex].qtyperBox)/100)*100;
                        } else {
                            shopcartx[foundIndex].pricex = shopcartx[foundIndex].price2
                        }
                        qtyx = parseInt(shopcartx[foundIndex].qty);
                    } else if (shopcartx[foundIndex].buytype==1){ //Vi
                        shopcartx[foundIndex].pricex = shopcartx[foundIndex].price2 * shopcartx[foundIndex].qtyperPack;
                        qtyx = parseInt(shopcartx[foundIndex].qty) * shopcartx[foundIndex].qtyperPack;

                    } else { //Hộp, Block
                        shopcartx[foundIndex].pricex = shopcartx[foundIndex].price;
                        qtyx = parseInt(shopcartx[foundIndex].qty) * shopcartx[foundIndex].qtyperBox;
                    }

                    if (qtyx > Math.round(shopcartx[foundIndex].stockqty * shopcartx[foundIndex].qtyperBox)) {
                        shopcartx[foundIndex].qty --;
                        screenLog(formatMessage('qtyexceedstockavail'),'error', 2000)
                    }
                }
                cartlisting();
            })
            
            $(".stepper").TouchSpin({min: 0, max: 100, stepinterval: 1});

            $('button:button[name="buytype"]').on("click", function(e) {
                e.preventDefault();
                var value = $(this).val();
                let maxval = 0;
                var foundIndex = shopcartx.findIndex(x => x.productID == e.target.id);
                if (foundIndex > -1) {
                    if (value==0) { //Hộp, Block
                        shopcartx[foundIndex].pricex = shopcartx[foundIndex].price;
                        maxval = Math.round(shopcartx[foundIndex].stockqty * shopcartx[foundIndex].qtyperBox/shopcartx[foundIndex].qtyperBox)
                        if (shopcartx[foundIndex].qty > maxval)  shopcartx[foundIndex].qty = maxval;
                    } else if (value==1) { //Vi
                        shopcartx[foundIndex].pricex = Math.ceil(shopcartx[foundIndex].price2 * shopcartx[foundIndex].qtyperPack/100)*100;
                        maxval = Math.round(shopcartx[foundIndex].stockqty * shopcartx[foundIndex].qtyperBox/shopcartx[foundIndex].qtyperPack)
                        if (shopcartx[foundIndex].qty > maxval)  shopcartx[foundIndex].qty = maxval;
                    } else {
                        shopcartx[foundIndex].pricex = shopcartx[foundIndex].price2;
                        maxval = Math.round(shopcartx[foundIndex].stockqty * shopcartx[foundIndex].qtyperBox)
                        if (shopcartx[foundIndex].qty > maxval)  shopcartx[foundIndex].qty = maxval;
                    }
                    shopcartx[foundIndex].buytype = value;
                    //console.log(shopcartx[foundIndex].pricex)
                }
                cartlisting();
            });

            calcTotal();
        }
    }
    
    function calcTotal() {
        subtotalVal = 0;
        taxVal = 0;
        shopcartx.forEach((f) => {
            //console.log(f.taxrate)
            subtotalVal+= (f.pricex * f.qty);
            taxVal+= (f.pricex * f.qty * f.taxrate );
        })
        totalVal = subtotalVal;
        subtotalVal = subtotalVal - taxVal;
        
        $('#subtotal').html(formatMessage('subtotal'));
        $('#tax').html(formatMessage('tax'));
        $('#total').html(formatMessage('total') + ' (' + shopcartx.length + ')');
        
        $('#subtotalVal').html(`${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(subtotalVal)}`);
        $('#taxVal').html(`${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(taxVal)}`);
        $('#totalVal').html(`${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalVal)}`);
        if (shopcartx && shopcartx.length > 0) {
            localStorage.setItem(`imedic${memberid}`, JSON.stringify(shopcartx).hexEncode());
        } else{
            localStorage.removeItem(`imedic${memberid}`);
        }
    }

    $(".delallBtn").on('click', function(e){
        e.preventDefault();
        screenConfirm(formatMessage('confirm2delete'), formatMessage('about2deleteall'), function(result){
            if (result == 1) { //ok confirm to delete
                shopcartx = [];
                cartlisting();
                stopScanner() 
            }
        })
    })
    
    $(".checkoutBtn").on('click', function(e){
        e.preventDefault();
        if (shopcartx && shopcartx.length > 0) {
            shopcartx = shopcartx.filter(m =>  parseInt(m.qty) > 0)
            cartlisting();
            setTimeout(function() {
                window.location = `/mcheckout`;
            }, 1000);
            
        } else{
            screenLog(formatMessage('youhaveemptycart'),'info')
        }
        
    })

    $(".fastcheckBtn").on('click', function(e){
        e.preventDefault();
        if (shopcartx && shopcartx.length > 0) {
            shopcartx = shopcartx.filter(m =>  parseInt(m.qty) > 0)
            cartlisting();
            setTimeout(function() {
                window.location = `/mcheckout2`;
            }, 1000);
            
        } else{
            screenLog(formatMessage('youhaveemptycart'),'info')
        }
        
    })
    
    function findProduct (barcode) {
        var foundIndex = shopcartx.findIndex(x => x.barcode == barcode);
        if (foundIndex == -1) {
            var e = productSource.filter(f=> f.barcode === barcode)[0];
            console.log(e)
            shopcartx.push({
                productID: e.productID,
                categoryID: e.categoryID,
                typeID: e.typeID,
                catName: e.categoryName,
                prodName: e.productName,
                barcode: e.barcode,
                costperitem: e.costperitem,
                price: e.unitPrice,
                price2: e.unitPrice2,
                pricex: e.unitPrice2,
                taxrate: e.taxrate,
                stockqty: e.stockqty,
                refID: 0,
                qty: 1,
                qtyperBox: e.qtyperBox,
                qtyperPack: e.qtyperPack,
                buytype: 2,
                unitMeasure: e.unitMeasure,
                unitMeasure2: e.unitMeasure2
            });
            cartlisting(); 
        }
    }

//**************************** */


if (getCookie('scannerMode')=='ON'){
    initAudio();
    HWScannerStart();
    $('#qrcode').css("display","none");
} else {
    $('#qrcode').on("click", function() {
        initAudio();
        if (!scannerOn) {
            startScanner();
        } else {
            stopScanner();
        }
    })
}



//************************* */
const html5QrCode = new Html5Qrcode("reader");
const qrCodeSuccessCallback = (decodedText, decodedResult) => {
    okBeep.play();
    //console.log(`Code matched = ${decodedText}`, decodedResult);
    /* handle success */
    stopScanner();
    findProduct(decodedText); 
    setTimeout(function () {
        startScanner();
    }, 500);
    
};
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

function stopScanner() {
    html5QrCode.stop().then((ignore) => {
        $('#butTxt').removeClass("buttonGREEN");
        $('#butTxt').addClass("buttonRED");
        scannerOn = false;
    }).catch((err) => {
    // Stop failed, handle it.
    });
}

function startScanner() {
    $('#butTxt').removeClass("buttonRED");
    $('#butTxt').addClass("buttonGREEN");
    scannerOn = true;
    // If you want to prefer front camera
    const formatsToSupport = [
        Html5QrcodeSupportedFormats.QR_CODE,
        Html5QrcodeSupportedFormats.EAN_13,
    ];
    const config = {
        fps: 10,
        qrbox: { width: 300, height: 200 },
        aspectRatio: 1,
        formatsToSupport:formatsToSupport,
      };
     
    html5QrCode.start({ facingMode: "environment" }, config, qrCodeSuccessCallback);

    // wait 2 seconds to guarantee the camera has already started to apply the focus mode and zoom...
    
    setTimeout(function () {
        html5QrCode.applyVideoConstraints({
            focusMode: "continuous",
            advanced: [{ zoom: 3.0 }],
        });
        okBeep.play();
    }, 2000);
    
}

    function HWScannerStart() {
        console.log("HWScannerStart()")
        var code = "";
        $('#butTxt').removeClass("buttonRED");
        $('#butTxt').addClass("buttonGREEN");
        scannerOn = true;
        initOnScan();
    
    };
    function HWScannerStop() {
        console.log("HWScannerStop()")
        var code = "";
        $('#butTxt').removeClass("buttonGREEN");
        $('#butTxt').addClass("buttonRED");
        scannerOn = false;
        destroyOnScan();
        
    };

    function initOnScan(){
            
        var prop;
        var array;
        var suffixKeyCodes = [9,13];
        var prefixKeyCodes = [];
        
        var options = {
            timeBeforeScanTest: 100, 
            avgTimeByChar: 30,
            minLength: 10, 
            suffixKeyCodes: suffixKeyCodes,
            prefixKeyCodes: prefixKeyCodes, 
            scanButtonLongPressTime: 500, 
            stopPropagation: true, 
            preventDefault: true,
            reactToPaste: true,
            reactToKeyDown: true,
            singleScanQty: 1
        }
        options.onScan = function(barcode, qty){
            console.log("[onScan]: Code: " + barcode + " Quantity: " + qty);
            findProduct(barcode); 
        };
        options.onScanError = function(){};
        options.onKeyProcess = function(){};        
        options.onKeyDetect = function(){};
        options.ignoreIfFocusOn = true;
        options.scanButtonKeyCode = false;
        options.onScanButtonLongPress = function(){};
        options.onPaste = function(){};
        
        
        try {
            onScan.attachTo(document, options);
            console.log("onScan Started!");
        } catch(e) {
            onScan.setOptions(document, options);
            console.log("onScansettings changed!");
        }
        

    }

    function destroyOnScan(){
        console.log("onScan destroyed!");
        onScan.detachFrom(document);	
    }
    
})