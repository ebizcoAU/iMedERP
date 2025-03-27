DevExpress.config({ defaultCurrency: 'VND' });
var roleID = $('#roleid').text();
var audioCreated = false;
var isEdit = false;
var scannerOn=false;
var decodedBarCode = '';
var kbcode = '';
var collapsed = true;

//*** initizie sound player ****
const okBeep = new Audio();
okBeep.autoplay = false;
okBeep.src = './assets/audio/beep.mp3';

const warningBeep = new Audio();
warningBeep.autoplay = false;
warningBeep.src = './assets/audio/bad.mp3';

//**************************/
var parentGroupID = $('#groupid').text();
var rowKey = -1;
var selectedRowIndex = -1;
var grid;
const URL = ''; 
const tbl = "product";
const primekey = "productID";
const memberStore = new DevExpress.data.CustomStore({
key: primekey,
load() {
    
return sendRequest(`${URL}/product2/${parentGroupID}`, 'POST');
},
insert(values) {
    console.log(JSON.stringify(values,false,4));
    values[`groupID`] = parentGroupID;
    return sendRequest(`${URL}/new/${tbl}`, 'POST', {
        data: JSON.stringify(values),
    });
},
update(key, values) {
    console.log(JSON.stringify(values, false, 4))
    values[`${primekey}`] = key;
    return sendRequest(`${URL}/update/${tbl}`, 'POST', {
    data:  JSON.stringify(values)
    });
},
remove(key) {
    let datax = {};
    datax[`${primekey}`] = key;
    return sendRequest(`${URL}/delete/${tbl}`, 'POST', {
        data: JSON.stringify(datax)
    });
},
});

//************************************************ */

grid = $('#profileContainer').dxDataGrid({
    dataSource: memberStore,
    allowColumnReordering: true,
    allowColumnResizing: true,
    columnAutoWidth: true,
    showBorders: true,
    remoteOperations: false,
    wordWrapEnabled: true,
    paging: {
        pageSize: 12,
    },
    pager: {
        showPageSizeSelector: true,
        allowedPageSizes: [8, 12],
        showInfo: true,
        showNavigationButtons: true,
        infoText: `${formatMessage('page')} {0} ${formatMessage('of')} {1} ({2} ${formatMessage('records')})`
    },
    searchPanel: {
        visible: true,
        width: 300,
        placeholder: formatMessage('search'),
    },
    groupPanel: { visible: true },
    grouping: {
      autoExpandAll: false,
    },
    editing: {
        texts: {
            saveRowChanges: formatMessage('save'),
            cancelRowChanges: formatMessage('cancel'),
            editRow: formatMessage('edit'),
            deleteRow: formatMessage('delete'),
            confirmDeleteMessage: formatMessage('about2delete'),
            confirmDeleteTitle: formatMessage('confirm2delete'),
            addRow:formatMessage('newx')
        },
        mode: 'row',
        allowUpdating: ((parentGroupID>1) && ((roleID==6) || ((divisionID==1) && (roleID==7))))?true:false,
        allowAdding:  false,
        allowDeleting:  ((parentGroupID>1) && ((roleID==6) || ((divisionID==1) && (roleID==7))))?true:false,
        useIcons: true,
    },
    selection: {
        mode: 'single',
    },
    loadPanel: {
        enabled: true,
    },  
    
    hoverStateEnabled: true,
    scrolling: {
        rowRenderingMode: 'virtual',
    },
    rowAlternationEnabled: true,
    columns: [
    {
        dataField: 'categoryName',
        caption: '#',
        groupIndex: 0,
    },
    { dataField: 'productID',
        caption: formatMessage('id'),
        allowEditing: false,
        width: 60,
        visible: false
    },
    {
        dataField: 'productName',
        caption: formatMessage('name'),
        width: 160,
        visible: true
    },
    
    { dataField: 'unitPrice',
        caption: formatMessage('unitprice'),
        width: 80,
        format: {
            type: 'currency',
            precision: 0  
        }  
    },
    
    { dataField: 'unitPrice2',
        caption: formatMessage('unitprice2'),
        width: 80,
        format: {
            type: 'currency',
            precision: 0  
        }  
    },
    { dataField: 'stockqty',
        caption: formatMessage('qty'),
        visible: true,
        dataType: "number",
        width: 60,
    },
    { dataField: 'lastexpiryDate',
        caption: formatMessage('expirydate'),
        dataType: 'date',
        width: 130,
        visible: true,
        format: 'dd/MM/yyyy'
    },
    { dataField: 'barcode',
        caption: 'Barcode',
        width: 40,
        visible: false
    },
    { type: 'buttons',
        width: 35,
        buttons: ['delete'],
        visible: false
    },
    ],
    onContentReady(e) {
        if (!collapsed) {
            collapsed = true;
            e.component.expandRow([0]);
        }
        
    },
    onSelectionChanged(e) {
        selectedRowIndex = e.component.getRowIndexByKey(e.selectedRowKeys[0]);
        console.log('isEdit: ' + isEdit)
        if (isEdit) {
            if (getCookie('scannerMode')=='ON'){ 
                if (scannerOn) HWScannerStop();
            } else {
                if (scannerOn) stopScanner();
            }
            if (e.component.hasEditData()) {
                e.component.saveEditData().then(() => {});
            } else {
                e.component.cancelEditData();  
            }
            isEdit = false;
        
        } else {
            document.getElementById("searchdummy").focus();
        }
    },
    onEditingStart(e) {
        console.log('onEditingStart, isEdit: ' + isEdit + ', kbcode: ' + decodedBarCode);
        if (getCookie('scannerMode')=='ON'){   //this is to fix default "Enter" key entered when scanning with HWScanner
            if (isEdit) {
                e.cancel = false;
            } else {
                e.cancel = true;
                document.getElementById("searchdummy").focus();
            }
        } else {

        }
    },
    onCellPrepared(e) {
        if(e.rowType === "data") {
            if (e.row.data['barcode'] && e.row.data['barcode'].length > 0) {
              e.cellElement.css({
                "color":"rgb(51,20,100)",
                "background-color":"rgb(245, 182, 114)",
              })
            }
        }
    },
    onRowDblClick(e) {
        console.log('onRowDblClick');
        if (e.key !== 0) {
            rowKey = e.key;
            isEdit = true;
            grid.editRow(selectedRowIndex);
        }
    },
    
    onSaving(e) {
        console.log('OnSaving...')
        if (isEdit) {
            //console.log('OnSaving...AAAA')
            if (isNotEmpty(decodedBarCode)) {
                if (e.changes.length == 0) {
                    e.changes.push({
                        type: "update",
                        key: rowKey,
                        data: {barcode: decodedBarCode}
                    });
                } else {
                    e.changes[0].data['barcode'] = decodedBarCode;
                }
                decodedBarCode = null; // Reset
            }
            isEdit = false; 
        }
        
    },
   

}).dxDataGrid('instance');

//************************************************ */
function sendRequest(url, method = 'GET', data) {
    const d = $.Deferred();
    console.log("url: " + url)
    $.ajax(url, {
        method,
        data,
        cache: false,
        xhrFields: { withCredentials: true },
    }).done((result) => {
        //console.log(JSON.stringify(result, false, 4))
        d.resolve(result);
        
    }).fail((xhr) => {
        d.reject(xhr.responseJSON ? xhr.responseJSON.Message : xhr.statusText);
    });

    return d.promise();
}


function sendRequestARG(url, method = 'GET', data) {
    const d = $.Deferred();
    console.log("url: " + url)
    $.ajax(url, {
        method,
        data,
        cache: false,
        xhrFields: { withCredentials: true },
    }).done((result) => {
        //console.log(JSON.stringify(result, false, 4))
        d.resolve(result.data, {
            totalCount: result.totalCount
            });
        
    }).fail((xhr) => {
        d.reject(xhr.responseJSON ? xhr.responseJSON.Message : xhr.statusText);
    });

    return d.promise();
}

function isNotEmpty(value) {
    return value !== undefined && value !== null && value !== '';
}

//**************************** */


if (getCookie('scannerMode')=='ON'){
    HWScannerStart();
    $('#qrcode').on("click", function() {
        if (!scannerOn) {
            HWScannerStart();
        } else {
            HWScannerStop();
        }
    })
} else {
    $('#qrcode').on("click", function() {
        initAudio();
        okBeep.play();
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
    console.log(`Code matched = ${decodedText}`, decodedResult);
    /* handle success */
    stopScanner();
    console.log(`isEdit =` + isEdit);
    grid.option("grouping.autoExpandAll",true);
    if (isEdit) {
        decodedBarCode =  decodedText;
        grid.saveEditData().then(() => {});
    } else {
        grid.searchByText(decodedText); 
    }
   
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
            advanced: [{ zoom: 6.0 }],
        });
        okBeep.play();
    }, 2000);
    
}

//**************************** */
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
        grid.option("grouping.autoExpandAll",true);
        if (isEdit) {
            decodedBarCode =  barcode;
            grid.saveEditData().then(() => {});
        } else {
            grid.cancelEditData();  
            grid.searchByText(barcode); 
        }
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



