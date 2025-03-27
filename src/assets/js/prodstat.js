$(() => {
    DevExpress.config({ defaultCurrency: 'VND' });
    $('#pagetitle').html(`${formatMessage('prodstat')}`);
    //********************* SCANNER ******************* */
    var audioCreated = false;
    var rowKey = -1;
    var selectedRowIndex = -1;
    var isEdit = false;
    var scannerOn=false;
    var QRscannerOn=false;

    var decodedBarCode = '';

    //*** initizie sound player ****
    const okBeep = new Audio();
    okBeep.autoplay = false;
    okBeep.src = './assets/audio/beep.mp3';

    const warningBeep = new Audio();
    warningBeep.autoplay = false;
    warningBeep.src = './assets/audio/bad.mp3';


    

    //**************************/
    var parentGroupID = $('#groupid').text();
    var roleID = $('#roleid').text();
    const URL = ''; 
    const tbl = "product";
    const primekey = "productID";
    const memberStore = new DevExpress.data.CustomStore({
      key: primekey,
      load(loadOptions) {
        return sendRequest(`${URL}/product/${parentGroupID}/0`, 'POST');
      },
      update(key, values) {
        console.log(JSON.stringify(values, false, 4))
        values[`${primekey}`] = key;
        return sendRequest(`${URL}/update/${tbl}`, 'POST', {
          data:  JSON.stringify(values)
        });
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
        pageSize: 50,
      },
      pager: {
        showPageSizeSelector: true,
        allowedPageSizes: [50, 100, 200],
        showInfo: true,
        showNavigationButtons: true,
        infoText: `${formatMessage('page')} {0} ${formatMessage('of')} {1} ({2} ${formatMessage('records')})`
      },
      searchPanel: {
          visible: true,
          width: 240,
          placeholder: formatMessage('search'),
      },
      export: {
        enabled: true,
        allowExportSelectedData: false,
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
        allowUpdating: ((parentGroupID > 1) && (roleID==6))?true:false,
        allowAdding: false,
        allowDeleting: false,
        useIcons: true,
        
      },
      onExporting(e) {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Companies');
        worksheet.columns = [
          { width: 5, key: 'id' }, { width: 100, key: 'name'  }, { width: 100, key: 'barcode' }
        ];
        var rows = [];
        var idx=1;
        var selRows = e.component.getSelectedRowsData();
        selRows.forEach((f,index) => {
          let isnum = /^\d+$/.test(f.barcode);
          if ((f.stockqty>0) && !isnum){
            for (i=0;i<f.stockqty;i++) {
              rows.push({id:idx, name:f.productName.substring(0,42),barcode:f.barcode})
              idx++;
            }
          }
        })
        worksheet.addRows(rows);
        workbook.xlsx.writeBuffer().then((buffer) => {
          saveAs(new Blob([buffer], { type: 'application/octet-stream' }), `prodqr${getDateTimeStampString()}.xlsx`);
        });
        
      },
      selection: {
        mode: 'multiple',
        allowSelectAll: true,
        showCheckBoxesMode: 'always'
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
        { dataField: 'productID',
          caption: '...',
          allowEditing: false,
          width:42,
          cellTemplate: cellStatTemplate,
        },
       
        { dataField : 'productName',
          caption: formatMessage('product'),
          allowEditing: false
        },
        { dataField: 'stockqty',
          caption: formatMessage('stockinhand'),
          dataType: "number",
          allowEditing: ((parentGroupID > 1) && (roleID == 6))?true:false,
          width: 80,
          format: "#0.00"
        },
        { dataField: 'qtyperBox',
          caption: formatMessage('qtyperbox'),
          dataType: "number",
          allowEditing: false,
          width: 75,
          format: "0,##0"
        },
       
        { dataField: 'costperitem',
          caption: formatMessage('unitcostprice'),
          format: {
              type: 'currency',
              precision: 0  
          },
          allowEditing: ((parentGroupID > 1) && (roleID == 6))?true:false,
          width: 90    
        },
        { dataField: 'qty',
          caption: formatMessage('qtyx'),
          dataType: "number",
          width: 60,
          allowEditing: true, 
          calculateCellValue: function(rowData){
            return Math.ceil(rowData.qtyperBox * rowData.stockqty);
          },
          format: "0000"
        },
       
        { dataField: 'ucostTotal',
          caption: formatMessage('total'),
          calculateCellValue: function(rowData){
            return rowData.costperitem * rowData.stockqty;
          },
          format: {
              type: 'currency',
              precision: 0  
          },
          allowEditing: false,
          width: 105    
        },
        { dataField: 'reorderlevel',
          caption: formatMessage('reorderlevel'),
          width: 70,
          allowEditing: ((parentGroupID > 1) && (roleID == 6))?true:false,
          visible: true,
          format: "0,##0"
        },
        { dataField: 'itemreorderqty',
          caption: formatMessage('itemreorderqty'),
          width: 80,
          allowEditing: ((parentGroupID > 1) && (roleID == 6))?true:false,
          format: "0,##0"
        },
        { dataField: 'barcode',
          caption: 'Barcode',
          width: 120,
          allowEditing: ((parentGroupID > 1) && (roleID == 6))?true:false,
          visible: true
        },
        { dataField: 'lastexpiryDate',
          caption: formatMessage('expirydate'),
          dataType: 'date',
          width: 160,
          format: locale=='en'?'dd MMM, yyyy':'dd MMMM M, yyyy'
        },
        { dataField: 'lastChanged',
          caption: formatMessage('lastchanged'),
          dataType: 'date',
          width: 110,
          allowEditing: false, 
          visible: true,
          sortOrder: 'desc',
          format: locale=='en'?'dd MMM, yyyy HH:MM':'dd MMMM M, yyyy HH:MM'
        },
        { dataField : 'status',
          caption: formatMessage('status'),
          allowEditing: ((parentGroupID > 1) && (roleID == 6))?true:false, 
          width: 110,
          lookup: {
              dataSource: statusSource2,
              valueExpr: "status",
              displayExpr: "statext"
          }
        },
        { type: 'buttons',
          width: 110,
          buttons: ['edit', 'delete', 
          { text: formatMessage('xchangetransaction'),
          icon: "chart",
          hint: formatMessage('xchangetransaction'),
          onClick: function (e) {
            let data = e.row.data;
            window.location = `/prodmonxfer?${data.productID}`;
          }
        }, { text: formatMessage('purchaserequest'),
          icon: "attach",
          hint: formatMessage('purchaserequest'),
          onClick: function (e) {
              var datax = e.row.data;
              if (datax.stockqty <= datax.reorderlevel) {
                  if (datax.status == 1) {
                      const deferred = $.Deferred();
                      $.ajax({
                          url: `/update/product`,
                          method: "POST",
                          data: {
                              productID:  datax.productID,   
                              status: -1,
                          },
                          dataType: "json",
                          success: function(data) {
                              if (data.status == 0) {
                                  deferred.resolve(false);
                                  screenLog(formatMessage('failed'),'warning');
                              } else  {
                                  deferred.resolve(true);
                                  $.ajax({
                                      url: `/new/prodXfer`,
                                      method: "POST",
                                      data: {
                                          productID: datax.productID,
                                          vendorID:1,
                                          itemcost: datax.costperitem,
                                          qty: datax.itemreorderqty, 
                                          status: 0,
                                      },
                                      dataType: "json",
                                      success: function(data) {
                                          if (data.status == 0) {
                                              deferred.resolve(true);
                                              screenLog(formatMessage('failed'),'warning');
                                          } else  {
                                              deferred.resolve(false);
                                              screenLog(formatMessage("productsuccessupdated"), 'success');
                                              grid.refresh()
                                          }
                                      },
                                      error: function() {
                                          deferred.reject("Data Loading Error");
                                      },
                                      timeout: 5000
                                  });
                              }
                          },
                          error: function() {
                              deferred.reject("Data Loading Error");
                          },
                          timeout: 5000
                      });
                      e.cancel = deferred.promise();
                  } else if (datax.status == 0) {
                      screenLog(formatMessage("productnolongerused"), 'error');
                  } else {
                      screenLog(formatMessage("alreadyordered"), 'warning');
                  }
            } else {
              screenLog(formatMessage("stocklevelisOK"), 'warning');
            }
          }
        }],
        },
      ],
      toolbar: {
        items: [
          {   
            location: 'after',
            widget: 'dxButton',
            options: {
              icon: "fas fa-qrcode", // Font Awesome 5
              elementAttr: {
                id: 'qrButton'
              },
              onClick(e) {
                if (QRscannerOn) {
                  HWScannerStop()
                } else {
                  HWScannerStart()
                }
              },
            },
          }, {   
            location: 'after',
            widget: 'dxButton',
            options: {
              icon: "fas fa-camera", // Font Awesome 5
              onClick() {
                initAudio();
                if (!scannerOn) {
                  startScanner();
                } else {
                  stopScanner();
                }
              },
            },
          },
          'exportButton',
          'searchPanel'
        ],
      },
      summary: {
        totalItems: [{
            name: 'totalselectedrowSummary',
            showInColumn: 'productName',
            displayFormat: "#: {0}",
            summaryType: 'custom',
        },{
            name: 'ucostTotalSummary',
            showInColumn: 'ucostTotal',
            valueFormat: 'currency', 
            displayFormat: "{0}",
            summaryType: 'custom',
        }],
        calculateCustomSummary(options) {
          if (options.name === 'ucostTotalSummary') {
            if (options.summaryProcess === 'start') {
              options.totalValue = 0;
            }
            if (options.summaryProcess === 'calculate') {
                options.totalValue += options.value.costperitem * options.value.stockqty;
            }
          } else if (options.name === 'totalselectedrowSummary') {
            if (options.summaryProcess === 'start') {
              options.totalValue = 0;
            }
            if (options.summaryProcess === 'calculate') {
              if (options.component.isRowSelected(options.value.productID)) {
                options.totalValue+= 1;
              }
            }
          } 
          
        }
      },
      
      onContentReady(e) {
        var grid = e.component;  
        grid.option('loadPanel.enabled', false);
        var selection = grid.getSelectedRowKeys();  
        if(selection.length == 0) {  
            grid.selectRowsByIndexes([0]);  
        }  
      },
      onCellPrepared(e) {
        if(e.rowType === "data" && e.column.dataField === "productID") {
          if (e.row.data['stockqty'] <= e.row.data['reorderlevel'] ) { //run out of stock
            if (e.row.data['status'] == -1) {
              let index = e.row.cells.findIndex(function(col) {
                return e.column.dataField == "productID"
              });
              e.row.cells[index].cellElement.css({
                "color":"rgb(57, 18, 18)",
                "background-color":"rgb(245, 188, 74)",
              })
            }               
          }
        }
        if(e.rowType === "data") {
          let date = new Date(e.row.data['lastexpiryDate'])
          let date2 = new Date();
          date2.setDate(date2.getDate() + 180); //Older than 6 months - stock expiring.
          if (date <= date2) {
              e.cellElement.css({
                "color":"rgb(51,20,100)",
                "background-color":"rgb(255,120,120)",
               
              })
          }
        }
      },
      onRowUpdating(e) {
        //console.log("onRowUpdatingOLD: " + JSON.stringify(e.oldData, false, 4));
        //console.log("onRowUpdatingNEW: " + JSON.stringify(e.newData, false, 4));
        if (e.newData.status < e.oldData.status) e.cancel = true;
        if (e.newData.qty && e.newData.qty>0) {
          e.newData.stockqty = (Math.floor(e.newData.qty/e.oldData.qtyperBox*200)/200).toFixed(3)
        }
      },
      onEditingStart(e) {
        rowKey = e.key;
        isEdit = true;
     },
     
    onSaving(e) {
        console.log('OnSaving...')
        if (isEdit) {
            console.log('OnSaving...decodedBarCode: ' + decodedBarCode)
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

    function cellStatTemplate(container, options) {
      var backendURL = `assets/images/`;
      let imgElement = document.createElement("img");
      let imagepath = `${backendURL}checkgreen.png`;
      if (options.data.stockqty > options.data.reorderlevel) {
        imagepath = `${backendURL}checkgreen.png`;
      } else {
        imagepath = `${backendURL}stocklow.png`;
      }
      imgElement.setAttribute('src',`${imagepath}`);
      imgElement.setAttribute("width", `25`);
      imgElement.setAttribute("height", `24`);
      container.append(imgElement);
    }
  
    
  //***************************************************** */
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
  function isNotEmpty(value) {
      return value !== undefined && value !== null && value !== '';
  }
//************************* */
    const html5QrCode = new Html5Qrcode("reader");
    const qrCodeSuccessCallback = (decodedText, decodedResult) => {
      okBeep.play();
      console.log(`Code matched = ${decodedText}`, decodedResult);
      /* handle success */
      stopScanner();
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
      $('#profileContainer').css("height","860px")
      html5QrCode.stop().then((ignore) => {
          scannerOn = false;
      }).catch((err) => {
      // Stop failed, handle it.
      });
    }

    function startScanner() {
      $('#profileContainer').css("height","640px")
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
      
    }
  
  //******************** */
  
  function HWScannerStart() {
    console.log("HWScannerStart()");
    $('#qrButton').css("background-color", "red");
    QRscannerOn = true;
    initOnScan();

  };
  function HWScannerStop() {
      console.log("HWScannerStop()")
      $('#qrButton').css("background-color", "white");
      QRscannerOn = false;
      destroyOnScan();
  };

  function initOnScan(){
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
          okBeep.play();
          console.log("Code: " + barcode);
          
          if (isEdit) {
            decodedBarCode =  barcode;
            grid.saveEditData().then(() => {
              HWScannerStop();
            });
          } else {
            grid.searchByText(barcode); 
            HWScannerStop();
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
      //onScan.detachFrom(document);
      window.location.reload();	
  }



  });
  