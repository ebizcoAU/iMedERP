
$(() => {
    DevExpress.config({ defaultCurrency: 'VND' });
    var illid  = $('#illid').text();
    var groupID = $('#groupid').text();
    var memberid = $('#memberid').text();
    var roleid = $('#roleid').text();
    var illname  = $('#illname').text();
    var itemList=[];

    $('#pagetitle').html(illname);

    var agevalue=-1;  
    var weightvalue=-1;
    var coughvalue=-1;
    var headacefevervalue=0;
    var stomachvalue=0;
    var sleepvalue=0;
    var diabeticvalue=0;
    var bloodpressurevalue=0;
    var allergyvalue=0;

    const ageBox = $('#ageBox').dxSelectBox({
        dataSource: ageSource,
        displayExpr: 'statext',
        valueExpr: 'ageid',
        placeholder: formatMessage('search'),
        onValueChanged: function (e) {  
            agevalue = e.value;
            if (agevalue < 2) {
                $("#diabeticBox").dxSwitch("instance").option('disabled', false)
                $("#bloodpressureBox").dxSwitch("instance").option('disabled', false)
                $("#allergymedBox").dxSwitch("instance").option('disabled', false)
            } else {
                $("#diabeticBox").dxSwitch("instance").option('disabled', true)
                $("#bloodpressureBox").dxSwitch("instance").option('disabled', true)
                $("#allergymedBox").dxSwitch("instance").option('disabled', true)
            }

            let weightBox = $("#weightBox").dxSelectBox("instance");
            weightBox.getDataSource().filter(['ageid', '=', e.value]);  
            weightBox.getDataSource().load();
            findPrescription();
        }  
    }).dxSelectBox;

    const weightBox = $('#weightBox').dxSelectBox({
        dataSource: weightSource,
        displayExpr: 'statext',
        valueExpr: 'weightid',
        placeholder: formatMessage('search'),
        onValueChanged: function (e) {  
            weightvalue = e.value;
            findPrescription();
        }  
    }).dxSelectBox;

    const coughBox = $('#coughBox').dxSelectBox({
        dataSource: coughSource,
        displayExpr: 'statext',
        valueExpr: 'status',
        placeholder: formatMessage('search'),
        onValueChanged: function (e) {  
            coughvalue = e.value;
            findPrescription();
        }  
    }).dxSelectBox;

    const headacefeverBox = $('#headacefeverBox').dxSwitch({
        value: false,
        switchedOffText: formatMessage('choiceno'),
        switchedOnText: formatMessage('choiceyes'),
        onValueChanged: function (e) {  
            headacefevervalue = e.value?1:0;
            findPrescription();
        }  
    }).dxSwitch;

    const stomachBox = $('#stomachBox').dxSwitch({
        value: false,
        switchedOffText: formatMessage('choiceno'),
        switchedOnText: formatMessage('choiceyes'),
        onValueChanged: function (e) {  
            stomachvalue = e.value?1:0;
            findPrescription();
        }  
    }).dxSwitch;

    const sleepyBox = $('#sleepyBox').dxSwitch({
        value: false,
        switchedOffText: formatMessage('choiceno'),
        switchedOnText: formatMessage('choiceyes'),
        onValueChanged: function (e) {  
            sleepvalue =  e.value?1:0;
            findPrescription();
        }  
    }).dxSelectBox;

    const diabeticBox = $('#diabeticBox').dxSwitch({
        value: false,
        switchedOffText: formatMessage('choiceno'),
        switchedOnText: formatMessage('choiceyes'),
        onValueChanged: function (e) {  
            diabeticvalue = e.value?1:0;
            findPrescription();
        }  
    }).dxSelectBox;

    

    const bloodpressureBox = $('#bloodpressureBox').dxSwitch({
        value: false,
        switchedOffText: formatMessage('choiceno'),
        switchedOnText: formatMessage('choiceyes'),
        onValueChanged: function (e) {  
            bloodpressurevalue = e.value?1:0;
            findPrescription();
        }  
    }).dxSelectBox;
    const allergymedBox = $('#allergymedBox').dxSwitch({
        value: false,
        switchedOffText: formatMessage('choiceno'),
        switchedOnText: formatMessage('choiceyes'),
        onValueChanged: function (e) {  
            allergyvalue = e.value?1:0;
            findPrescription();
        }  
    }).dxSelectBox;

    $('#buybudget').dxButton({
        stylingMode: 'contained',
        text: formatMessage('buybudget'),
        type: 'warning',
        disabled: false,
        onClick() {
            add2Cart(0);
        },
    });

    $('#buystandard').dxButton({
        stylingMode: 'contained',
        text: formatMessage('buystandard'),
        type: 'success',
        disabled: false,
        onClick() {
            add2Cart(1);
        },
    });

    $('#buypremium').dxButton({
        stylingMode: 'contained',
        text: formatMessage('buypremium'),
        type: 'danger',
        disabled: false,
        onClick() {
            add2Cart(2);
        },
    });

    function add2Cart(id) {
        console.log(itemList)
        if (itemList && (itemList.length > 0) && itemList[id] &&  (itemList[id].length > 0)) {
            bootbox.prompt({
                title: formatMessage('promptnumberofdoses'), 
                size: 'small',
                centerVertical: true,
                callback: function(result){ 
                    if (result && result > 0) {
                        var shopcartx = localStorage.getItem(`imedic${memberid}`);
                        if (shopcartx && (shopcartx !== '[]')) {
                            shopcartx = JSON.parse(shopcartx.hexDecode());
                        } else {
                            shopcartx = [];
                        }
                        itemList[id].forEach((e,index) => {
                            shopcartx.push({
                                productID: e.productID,
                                categoryID: e.categoryID,
                                typeID: e.typeID,
                                catName: e.categoryName,
                                prodName: e.productName,
                                barcode: e.barcode,
                                costperitem:e.costperitem,
                                price2: Math.round((e.unitPrice2*e.toaprice/e.toacost)/100)*100, 
                                taxrate: e.taxrate,
                                refID: parseInt(e.toaID),
                                qty: e.qty * result,
                                qtyperBox: e.qtyperBox,
                                unitMeasure: e.unitMeasure,
                                unitMeasure2: e.unitMeasure2
                            });
                        })
                        console.log(shopcartx)
                        if (shopcartx && shopcartx.length > 0) {
                            localStorage.setItem(`imedic${memberid}`, JSON.stringify(shopcartx).hexEncode());
                        } else{
                            localStorage.removeItem(`imedic${memberid}`);
                        }
                        window.location = "/mshopcartlist"
                    } 
                    
                }
            });
        } else {
            screenLog(formatMessage("noprescriptionavailable"), 'warning', 5000);
        }
    }

    function findPrescription () {
        if (checkready()) {
            const deferred = $.Deferred();
            $.ajax({
                url: `/toa/${groupID}/${illid}`,
                method: "POST",
                data: {
                    agevalue: agevalue,   
                    weightvalue: weightvalue,   
                    coughvalue: coughvalue, 
                    headacefevervalue: headacefevervalue,   
                    stomachvalue: stomachvalue,   
                    sleepvalue: sleepvalue,   
                    diabeticvalue: diabeticvalue,   
                    bloodpressurevalue: bloodpressurevalue,  
                    allergyvalue: allergyvalue  
                },
                dataType: "json",
                success: function(data) {
                    //console.log(data)
                    itemList=[];
                    if (data.length == 0) {
                        screenLog(formatMessage("noprescriptionavailable"));
                        priceSource.forEach((a, indexa) => {
                            $(`#toacomment${indexa}`).html('');
                        })
                        deferred.resolve(false);
                    } else {
                        priceSource.forEach((a, indexa) => {
                            itemList[a.status] = [];
                            data.forEach((b, indexb)=>{
                                if (b.priceoption==a.status) {
                                    itemList[a.status].push({
                                        toaID:b.toaID,
                                        toaproductID: b.toaproductID,
                                        qty:b.qty, 
                                        productID:b.productID, 
                                        productName:b.productName, 
                                        costperitem:b.costperitem,
                                        uprice:Math.round((b.unitPrice2*b.qty*b.toaprice/b.toacost)/100)*100, 
                                        unitPrice2:b.unitPrice2,
                                        toaprice:b.toaprice,
                                        toacost:b.toacost,
                                        unitMeasure2:b.unitMeasure2,
                                        unitMeasure:b.unitMeasure,
                                        qtyperBox:b.qtyperBox,
                                        categoryID:b.categoryID,
                                        categoryName:b.categoryName,
                                        typeID:b.typeID,
                                        barcode:b.barcode,
                                        taxrate:b.taxrate,
                                    })
                                }
                                $(`#toacomment${indexa}`).html(b.comment)
                            })
                        })
                    }
                    priceSource.forEach((a, indexa) => {
                        genToa(indexa)
                    })
                    function genToa(id) {
                        $(`#price${id}`).dxDataGrid({
                            dataSource: itemList[id],
                            keyExpr: 'toaproductID',
                            columns: [
                                { dataField: 'productName',
                                    caption: formatMessage('name'),
                                    allowEditing: false
                                },
                                { dataField: 'qty',
                                    allowEditing: false,
                                    caption: '##',
                                    dataType: "number",
                                    width: 40,
                                },
                                { dataField: 'uprice',
                                    caption: formatMessage('unitprice'),
                                    allowEditing: false,
                                    width: 70,
                                    format: {
                                        type: 'currency',
                                        precision: 0  
                                    }  
                                },
                                { dataField : 'unitMeasure2',
                                    caption: formatMessage('unit'),
                                    width: 50,
                                    allowEditing: false,
                                    lookup: {
                                        dataSource: unitmeasureSource2,
                                        valueExpr: "status",
                                        displayExpr: "statext"
                                    }
                                }
                            ],
                            summary: {
                                totalItems: [{
                                    name: 'usubtotalSummary',
                                    showInColumn: 'uprice',
                                    valueFormat: 'currency', 
                                    displayFormat: "{0}",
                                    summaryType: 'custom',
                                }],
                                calculateCustomSummary(options) {
                                    if (options.name === 'usubtotalSummary') {
                                    if (options.summaryProcess === 'start') {
                                        options.totalValue = 0;
                                    }
                                    if (options.summaryProcess === 'calculate') {
                                        options.totalValue += options.value.uprice;
                                    }
                                    }
                                    
                                }
                                },
                            showBorders: true,
                        });
                    }
                    deferred.resolve(data);
                },
                error: function() {
                    screenLog('Data Loading Error', 'error')
                    deferred.reject("Data Loading Error");
                },
                timeout: 5000
            });
            deferred.promise();
        }
    }

    function checkready() {
        /*
        console.log('agevalue: ' + agevalue);
        console.log('weightvalue: ' + weightvalue);
        console.log('coughvalue: ' + coughvalue);
        console.log('headacefevervalue: ' + headacefevervalue);
        console.log('stomachvalue: ' + stomachvalue);
        console.log('sleepvalue: ' + sleepvalue);
        console.log('diabeticvalue: ' + diabeticvalue);
        console.log('bloodpressurevalue: ' + bloodpressurevalue);
        console.log('allergyvalue: ' + allergyvalue);
        */
        if ((agevalue > -1) && 
        (weightvalue > -1) && 
        (coughvalue > -1) && 
        (headacefevervalue > -1) && 
        (stomachvalue > -1) && 
        (sleepvalue > -1) && 
        (diabeticvalue > -1) &&
        (bloodpressurevalue > -1) &&
        (allergyvalue > -1)) {
            return true
        } else {
            return false
        }
    }

    
    
    
    })