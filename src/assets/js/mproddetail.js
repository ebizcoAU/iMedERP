
$(() => {

    var prodid  = $('#prodid').text();
    var memberid = $('#memberid').text();
    var roleid = $('#roleid').text();
    var catid = 0;
    var catName = '';
    var prodName = '';
    var imgLinkx = '';
    var pricex =  0;
    var discountx = 0.00;
    var newpricex = 0;
    var taxratex = 0.00;
    var qtyperboxx = 0;

    
    
    var shopcartx = getCookie(`antifakeebiz${memberid}`);
    var qtyx = 0;
    if (shopcartx && (shopcartx !== '[]')) {
        shopcartx = JSON.parse(shopcartx.hexDecode());
        if (shopcartx.length > 0) {
            var foundIndex = shopcartx.findIndex(x => x.productID == prodid);
            if (foundIndex > -1) {
                qtyx = shopcartx[foundIndex].qty;
            }
        }
    } else {
        shopcartx = [];
    }
    
    var prodimages = document.getElementById('prodimages');
    if (prodimages !== null) {
        const deferred = $.Deferred();
        $.ajax({
            url: `/product/${prodid}`,
            method: "POST",
            dataType: "json",
            success: function(data) {
                var datx = data.data;
                if (datx.length == 0) {
                    $('#pagetitle').html(formatMessage("noproductavail"));
                    deferred.resolve(data);
                } else {
                    $('#pagetitle').html(datx[0].productName);
                    $('#unitprice').html(formatMessage('unitprice'));
                    $('#boxprice').html(formatMessage('box'));
                    var itemList =``;
                    itemList += `
                    <div class="swiper-slide" >
                        <div class="dz-banner-heading">
                            <div class="overlay-black-light">
                                <img src="public/${subdir}/${datx[0].imgLink}" class="bnr-img" alt="bg-image">
                            </div>
                        </div>
                    </div>
                    `;
                    if (datx[0].imgLink1 !== "") {
                        itemList += `
                        <div class="swiper-slide" >
                            <div class="dz-banner-heading">
                                <div class="overlay-black-light">
                                    <img src="public/${subdir}/${datx[0].imgLink1}" class="bnr-img" alt="bg-image">
                                </div>
                            </div>
                        </div>
                        `;
                    }
                    if (datx[0].imgLink2 !== "") {
                        itemList += `
                        <div class="swiper-slide" >
                            <div class="dz-banner-heading">
                                <div class="overlay-black-light">
                                    <img src="public/${subdir}/${datx[0].imgLink2}" class="bnr-img" alt="bg-image">
                                </div>
                            </div>
                        </div>
                        `;
                    } 
                    if (datx[0].imgLink3 !== "") {
                        itemList += `
                        <div class="swiper-slide" >
                            <div class="dz-banner-heading">
                                <div class="overlay-black-light">
                                    <img src="public/${subdir}/${datx[0].imgLink3}" class="bnr-img" alt="bg-image">
                                </div>
                            </div>
                        </div>
                        `;
                    } 
                    if (datx[0].imgLink4 !== "") {
                        itemList += `
                        <div class="swiper-slide" >
                            <div class="dz-banner-heading">
                                <div class="overlay-black-light">
                                    <img src="public/${subdir}/${datx[0].imgLink4}" class="bnr-img" alt="bg-image">
                                </div>
                            </div>
                        </div>
                        `;
                    } 
                    if (datx[0].imgLink5 !== "") {
                        itemList += `
                        <div class="swiper-slide" >
                            <div class="dz-banner-heading">
                                <div class="overlay-black-light">
                                    <img src="public/${subdir}/${datx[0].imgLink5}" class="bnr-img" alt="bg-image">
                                </div>
                            </div>
                        </div>
                        `;
                    } 
                    prodimages.innerHTML = itemList;
                    var umeasure = (datx[0].unitMeasure > 0) ? unitmeasureSource.filter(m => m.status == datx[0].unitMeasure)[0].statext: '';
                    $('#qtyperbox').html(`${datx[0].qtyperBox} ${umeasure}/${formatMessage('box')}`);
                    $('#catName').html(`<a href="/mprodcat?${datx[0].categoryID}&${datx[0].subcatID}">${datx[0].categoryName}</a>`);
                    $('#prodName').html(datx[0].productName);
                    $('#proddescription').html(datx[0].description);
                    
                    $('#offprice').html(`<h6>${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(datx[0].unitPrice)}</h6>`);
                    if ((roleid == 4) || (roleid==1)) {
                        newpricex = datx[0].distributorRate;
                    } else if ((roleid==5) || (roleid==6)) {
                        newpricex = datx[0].agentRate;
                    } else {
                        newpricex = datx[0].onlineRate;
                    }
                    discountx = Math.round(((datx[0].unitPrice - newpricex)/datx[0].unitPrice*100));
                    $('#newprice').html(`${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(newpricex)}`);
                    $('#newpricex').html(`${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(newpricex * datx[0].qtyperBox)}`);
                    $('#add2cart').html(formatMessage('add2cart')); 
                    $('#discountx').html(formatMessage('specialdiscount').toUpperCase() + ` ${discountx} %`); 
                    $( "#qtyx" ).val( qtyx );
                    imgLinkx = datx[0].imgLink;
                    catid = datx[0].categoryID;
                    subcatid = datx[0].subcatID;
                    catName = datx[0].categoryName;
                    prodName = datx[0].productName;
                    pricex = datx[0].unitPrice;
                    taxratex = datx[0].taxrate;
                    qtyperboxx = datx[0].qtyperBox;
                    unitmeasurex = datx[0].unitMeasure;

                    if ((roleid == 4) || (roleid == 5) || (roleid == 6) || (roleid==1)) {
                        $(".stepperx").TouchSpin({min: 1000, max: 100000, stepinterval: 1000});
                    } else {
                        $(".stepperx").TouchSpin({min: 0, max: 100, stepinterval: 1});
                    }
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

    $('#inputFormx').on('submit', (e) => {
        e.preventDefault();
        let qtyx = $("#qtyx").val();
        if (qtyx > 0) {
            var foundIndex = shopcartx.findIndex(x => x.productID == prodid);
            if (foundIndex > -1) {
                shopcartx[foundIndex].qty = qtyx;
                shopcartx[foundIndex].price = pricex;
                shopcartx[foundIndex].newprice = newpricex;
                shopcartx[foundIndex].taxrate = taxratex;
                shopcartx[foundIndex].qtyperbox = qtyperboxx;
                shopcartx[foundIndex].unitmeasure = unitmeasurex;
                
            } else {
                shopcartx.push({
                    productID: prodid,
                    categoryID: catid,
                    subcatID:subcatid,
                    catName: catName,
                    prodName: prodName,
                    imgLink: imgLinkx,
                    price: pricex,
                    newprice: newpricex,
                    taxrate: taxratex,
                    discount: discountx,
                    qty:qtyx,
                    qtyperBox: qtyperboxx,
                    unitMeasure: unitmeasurex
                });
            }
            
            setCookie(`antifakeebiz${memberid}`, JSON.stringify(shopcartx).hexEncode());
    
            window.location = `/mshopcartlist`;
        } else {
            var foundIndex = shopcartx.findIndex(x => x.productID == prodid);
            console.log(foundIndex);
            if (foundIndex > -1) {
                shopcartx = shopcartx.filter(function(x) { return x.productID != prodid});
            } else {
                screenLog(formatMessage("add2cartnoqty"),"error")
            }
            setCookie(`antifakeebiz${memberid}`, JSON.stringify(shopcartx).hexEncode());
        }
        
    });
    
   
})