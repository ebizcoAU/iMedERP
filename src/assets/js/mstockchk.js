DevExpress.config({ defaultCurrency: 'VND' });
var roleID = $('#roleid').text();
var audioCreated = false;
var scannerOn=false;
var decodedBarCode = '';
var kbcode = '';

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
    }

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
        allowedPageSizes: [12, 8],
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
        allowUpdating: false,
        allowAdding:  false,
        allowDeleting: false,
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
            allowEditing: true,
            width: 160,
            visible: true
        },
        { dataField : 'typeID',
            caption: formatMessage('type'),
            width: 55,
            visible: true,
            lookup: {
                dataSource: typeSource,
                valueExpr: "status",
                displayExpr: "statext"
            }
        },
        { dataField: 'stockqty',
            caption: formatMessage('qty'),
            visible: true,
            dataType: "number",
            width: 60,
        },
        { dataField: 'barcode',
            caption: 'Barcode',
            width: 40,
            visible: false
        },
        { dataField: 'categoryName',
            caption: formatMessage('category'),
            width: 160,
        },
        { dataField: 'lastexpiryDate',
            caption: formatMessage('expirydate'),
            dataType: 'date',
            width: 90,
            visible: false,
            format: 'dd/MM/yyyy'
        },
        { dataField: 'qtyx',
            caption: '###',
            dataType: "number",
            width: 65,
            visible: false,
            calculateCellValue: function(rowData){
              return rowData.qtyperBox * rowData.stockqty;
            },
            format: "0,##0"
          },
    ],
    onContentReady(e) {
        var grid = e.component;  
        grid.option('loadPanel.enabled', false);
        var selection = grid.getSelectedRowKeys();  
        if(selection.length == 0) {  
            grid.selectRowsByIndexes([0]);  
        } 
        
    },
    onSelectionChanged(e) {
        selectedRowIndex = e.component.getRowIndexByKey(e.selectedRowKeys[0]);
        if (getCookie('scannerMode')=='ON'){ 
            document.getElementById("searchdummy").focus();
        } else {
            if (scannerOn) stopScanner();
        }
        if (e.component.hasEditData()) {
            e.component.saveEditData().then(() => {});
        } else {
            e.component.cancelEditData();  
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
        console.log(JSON.stringify(result, false, 4))
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
        initAudio();
        if (!scannerOn) {
            HWScannerStart();
        } else {
            HWScannerStop();
        }
    })
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
    console.log(`Code matched = ${decodedText}`, decodedResult);
    /* handle success */
    stopScanner();
    grid.option("grouping.autoExpandAll",true);
    grid.searchByText(decodedText); 
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
        grid.searchByText(barcode); 
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

