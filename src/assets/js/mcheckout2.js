
$(() => {
    
    var memberid = $('#memberid').text();
    var groupid = $('#groupid').text();
    $('#pagetitle').html('FAST CHKOUT');

    var cidx = 0;
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
        cidx = customerSource.filter(f=> f.name === 'KH1UNO')[0].memberID;
        console.log(cidx);
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
    subtotalVal = subtotalVal - taxVal;


   
})