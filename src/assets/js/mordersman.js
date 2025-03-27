
$(() => {
    var memberid = $('#memberid').text();
    var roleid = $('#roleid').text();
    $('#pagetitle').html(formatMessage('myorders'));
    var receiptPrinter = null;
    if ((navigator.userAgent.match(/(Android)/))) { //Android mobile devices 
        if (window.matchMedia("(max-width: 512px)").matches)  { //mobile devices     
            receiptPrinter = new WebBluetoothReceiptPrinter();
        } else {
            //receiptPrinter = new WebUSBReceiptPrinter();
        }   
    } else if (navigator.userAgent.match(/(Mac OS)/)) {
        if (window.matchMedia("(max-width: 512px)").matches)  { //mobile devices  
            //receiptPrinter = new WebBluetoothReceiptPrinter();
        } else {
            receiptPrinter = new WebBluetoothReceiptPrinter();
        }
    } else {
         receiptPrinter = new WebUSBReceiptPrinter();
    } 
    var lastUsedDevice = null;

//*** initialize sound player ****
var audioCreated = false;
const okBeep = new Audio();
okBeep.autoplay = false;
okBeep.src = './assets/audio/beep.mp3';

const warningBeep = new Audio();
warningBeep.autoplay = false;
warningBeep.src = './assets/audio/bad.mp3';

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

//***** Print Receipt */
    
function printReceipt(sidx, scartx) {
    var totalx=0;
    var headerx = [
        { width: 32, marginRight: 1, align: 'left' },
        { width: 16, marginRight: 2, align: 'right' },
        { width: 30, marginRight: 2, align: 'right' }
    ];
    var bodyx = [];

    var encoder = new ReceiptPrinterEncoder({
        feedBeforeCut: 4,
    });
    var salex = shopcartx.filter(f=> f.saleID==sidx)[0];
    scartx.forEach((m)=>{
        var umeasure2 = (m.unitMeasure2 > 0) ? unitmeasureSource2x.filter(n => n.status == m.unitMeasure2)[0].statext: '';
        bodyx.push([`${m.productName.substr(0,30)}`, `${m.qty} ${umeasure2} x ${convertcurrencyvndong(m.price)}`, `${convertcurrencyvndong(m.price * m.qty)}`]);
        totalx += (m.price * m.qty);
    })

    bodyx.push([ '', '', '='.repeat(12) ]);
    bodyx.push([ formatMessage('total2'), '', (encoder) => encoder.bold().text(convertcurrencyvndong(totalx)).bold() ]);

    let data = encoder
    .codepage('windows1253')
    .line($('#sxname').text())
    .line($('#sxaddress').text())
    .line('DT: ' + $('#hotline').text())
    .line('MST: ' + $('#abn').text())
    .line('GPKD: ' + $('#license').text())
    .line($('#staffName').text())
    .line(`${formatMessage('date2')}: ${salex.dateAdded}`)
    .newline()
    .bold(true)
    .line(`${formatMessage('saledocket2')}: ${salex.saleno}`)
    .bold(false)
    .newline()
    .table(headerx, bodyx)	
    .newline()
    .newline()
    .newline()
    .newline()
    .encode()
    /* Print the receipt */    
    receiptPrinter.print(data);
}
function convertcurrencyvndong(value) {
    return value.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')+'d';
}
//*************************************** */    
    var shopcartx=[];
    var shopcartitemx=[];


    var currentDate = calcTime('+11.0');
    var tomorrow = calcTime('+11.0');
    tomorrow.setDate(tomorrow.getDate() + 1);

    var fromdate = $("#fromdate").dxDateBox({
        type: 'date',
        stylingMode: 'outline',
        labelMode: 'floating',
        label: formatMessage('fromdate'),
        width: 140,
        value: currentDate,
        onChange(e) {
            searchMe();
        }
    }).dxDateBox('instance');

    var todate = $("#todate").dxDateBox({
        type: 'date',
        stylingMode: 'outline',
        labelMode: 'floating',
        label: formatMessage('todate'),
        width: 140,
        value: tomorrow,
        onChange(e) {
            searchMe();
        }
    }).dxDateBox('instance');


    $('#backx').on('click', function() {
        let fromx = fromdate.option('value');
        let tox = todate.option('value');
        fromx = timeSolver.subtract(fromx, 1, "d");
        tox = timeSolver.subtract(tox, 1, "d"); 
        $("#fromdate").dxDateBox('option', 'value', new Date(timeSolver.getString(fromx,"YYYY-MM-DD")));
        $("#todate").dxDateBox('option', 'value', new Date(timeSolver.getString(tox,"YYYY-MM-DD")));
        searchMe();
    }) 

    $('#forwardx').on('click', function() {
        let fromx = fromdate.option('value');
        let tox = todate.option('value');
        fromx = timeSolver.add(fromx, 1, "d");
        tox = timeSolver.add(tox, 1, "d"); 
        $("#fromdate").dxDateBox('option', 'value', new Date(timeSolver.getString(fromx,"YYYY-MM-DD")));
        $("#todate").dxDateBox('option', 'value', new Date(timeSolver.getString(tox,"YYYY-MM-DD")));
        searchMe();
    }) 

    $(function() {
        searchMe();
    });
    
    function searchMe () {
        var orderlistingpanel = document.getElementById('orderlistingpanel');
        if (orderlistingpanel !== null) {
            const deferred = $.Deferred();
            $.ajax({
                url: `/salelist`,
                method: "POST",
                dataType: "json",
                data: {
                    agentStaffID: memberid,
                    fromdate: timeSolver.getString(new Date(fromdate.option('value')), "YYYY-MM-DD"),
                    todate: timeSolver.getString(new Date(todate.option('value')), "YYYY-MM-DD"),
                },
                success: function(data) {
                    shopcartx = data;
                    $.ajax({
                        url: `/saleitemslist`,
                        method: "POST",
                        dataType: "json",
                        data: {
                            agentStaffID: memberid,
                            fromdate: timeSolver.getString(new Date(fromdate.option('value')), "YYYY-MM-DD"),
                            todate: timeSolver.getString(new Date(todate.option('value')), "YYYY-MM-DD"),
                        },
                        success: function(datb) {
                            shopcartitemx = datb;
                            var itemList =``;
                            const options = { weekday: 'short', month: "short", day: "numeric", year: "numeric", hour: 'numeric', minute: 'numeric', hour12: false};
                            data.forEach((m, index)=>{
                                itemList += `
                                <div class="accordion-item">
                                    <div class="accordion-header" id="heading${index+1}">
                                            <div class="d-flex align-items-center">
                                                <div class="icon-box ${m.status==1?'bg-primary':m.status==2?'bg-danger':m.status==3?'bg-info':m.status==4?'bg-success':''} me-3">
                                                    <a href="javascript:void(0);" class="accordion-button collapsed" data-bs-toggle="collapse" data-bs-target="#collapse${index+1}" aria-expanded="true" aria-controls="collapse${index+1}">
                                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M20.929 1.628C20.8546 1.44247 20.7264 1.28347 20.5608 1.17153C20.3952 1.05959 20.1999 0.999847 20 1H4C3.80012 0.999847 3.60479 1.05959 3.43919 1.17153C3.2736 1.28347 3.14535 1.44247 3.071 1.628L1.071 6.628C1.02414 6.74643 1.00005 6.87264 1 7V22C1 22.2652 1.10536 22.5196 1.29289 22.7071C1.48043 22.8946 1.73478 23 2 23H22C22.2652 23 22.5196 22.8946 22.7071 22.7071C22.8946 22.5196 23 22.2652 23 22V7C23 6.87264 22.9759 6.74643 22.929 6.628L20.929 1.628ZM4.677 3H19.323L20.523 6H3.477L4.677 3ZM3 21V8H21V21H3Z" fill="#FFA902"/>
                                                            <path d="M10 17H6C5.73478 17 5.48043 17.1054 5.29289 17.2929C5.10536 17.4804 5 17.7348 5 18C5 18.2652 5.10536 18.5196 5.29289 18.7071C5.48043 18.8947 5.73478 19 6 19H10C10.2652 19 10.5196 18.8947 10.7071 18.7071C10.8946 18.5196 11 18.2652 11 18C11 17.7348 10.8946 17.4804 10.7071 17.2929C10.5196 17.1054 10.2652 17 10 17Z" fill="#FFA902"/>
                                                        </svg>
                                                    </a>
                                                </div>
                                                <div>
                                                    <h6 class="sub-title d-flex flex-row">
                                                        <span class="text-dark">#${m.saleno}&nbsp;&nbsp;</span>
                                                       <i id="sidx_${m.saleID}" class="fa-solid fa-file-lines printrx"></i>
                                                    </h6>
                                                    <h6 class="sub-title">
                                                        <span class="text-dark">${new Intl.DateTimeFormat("vi-VN", options).format(new Date(m.dateAdded))}</span>
                                                    </h6>
                                                    <span class="text-warning">
                                                        ${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(m.amount)} +
                                                        ${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(m.tax)} =
                                                        ${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(m.amount + m.tax)}
                                                    </span>
                                                    
                                                </div>
                                            </div>
                                    </div>
                                    <div id="collapse${index+1}" class="accordion-collapse collapse " aria-labelledby="heading${index+1}" data-bs-parent="#orderlistingpanel">
                                    <div class="accordion-body pb-0">
                                        <ul class="p-2">
							
                                `;
                                var datc = datb.filter(f=> f.saleID==m.saleID);
                                datc.forEach((n, indexN)=>{
                                    var umeasureTxt = (n.unitMeasure2 > 0) ? unitmeasureSource2.filter(x => x.status == n.unitMeasure2)[0].statext: '';
                                    var utypeTxt = (n.typeID > 0) ? typeSource.filter(x => x.status == n.typeID)[0].statext: '';
                                    itemList += `
                                                <li class="d-flex align-items-start mb-3">
                                                    <div class="me-3">
                                                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <rect width="14" height="14" rx="7" fill="#027335"/>
                                                        </svg>
                                                    </div>
                                                    <div class="d-flex flex-column ">
                                                        <h6 class="sub-title mb-1">${n.productName.substring(0,72)}</h6>
                                                        <div class="d-flex ">
                                                            <span class="text-soft">#${utypeTxt},</span>
                                                            <span class="text-soft">#${n.qty} ${umeasureTxt},</span>
                                                            <span class="text-soft">${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n.price)}/${umeasureTxt},</span>
                                                            <span class="text-info" style="font-weight:600">${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n.qty * n.price)}</span>
                                                        </div>
                                                    </div>
                                                </li>
                                    `;
                                }) 

                                itemList += `
                                        </ul>
                                        </div>
                                    </div>
                                </div>
                                `;
                            })
                            orderlistingpanel.innerHTML = itemList;
                            $(".printrx").on("click", function(e){
                                //console.log(e.target.id);
                                var scartx= shopcartitemx.filter(f=> f.saleID==e.target.id.split("_")[1]);
                                if (receiptPrinter) {
                                    if ((navigator.userAgent.match(/(Android)/))||
                                    (navigator.userAgent.match(/(Mac OS)/))) { 
                                        initAudio();
                                        if (lastUsedDevice) {
                                            receiptPrinter.reconnect(lastUsedDevice);
                                            printReceipt(e.target.id.split("_")[1], scartx) 
                                        } else {
                                            receiptPrinter.connect();
                                        }
                                        receiptPrinter.addEventListener('connected', device => {
                                            console.log(`Connected to ${device.name} (#${device.id})`);
                                
                                            printerLanguage = device.language;
                                            printerCodepageMapping = device.codepageMapping;
                                            console.log(device);
                                
                                            /* Store device for reconnecting */
                                            lastUsedDevice = device;
                                            printReceipt(e.target.id.split("_")[1], scartx) 
                                            
                                        });
                                    } else {
                                        screenLog(formatMessage('noprintersupport'),'warning')
                                    }
                                } else {
                                    screenLog(formatMessage('noprintersupport'),'warning')
                                }
                                
                            })
                            calcTotal();
                            deferred.resolve(false);
                        },
                        error: function() {
                            screenLog('Data Loading Error', 'error');
                            deferred.reject("Data Loading Error");
                        },
                    })
                },
                error: function() {
                    screenLog('Data Loading Error', 'error');
                    deferred.reject("Data Loading Error");
                },
                timeout: 5000
            });
            deferred.promise();
            
        }
    }
    
   
    function calcTime(offset) {
        var d = new Date();
        var utc = d.getTime() + (d.getTimezoneOffset() * 60000);
        var nd = new Date(utc + (3600000*offset));
        return nd;
    }
    
    function calcTotal() {
        subtotalVal = 0;
        taxVal = 0;
        shopcartx.forEach((f) => {
            subtotalVal+= f.amount;
            taxVal+= f.tax ;
        })
        totalVal = subtotalVal + taxVal;
        
        $('#subtotal').html(formatMessage('subtotal'));
        $('#tax').html(formatMessage('tax'));
        $('#total').html(`${formatMessage('total')} ${shopcartx.length} (${formatMessage('ordersy')})`);
        
        $('#subtotalVal').html(`${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(subtotalVal)}`);
        $('#taxVal').html(`${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(taxVal)}`);
        $('#totalVal').html(`${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalVal)}`);
        
    }
    
})