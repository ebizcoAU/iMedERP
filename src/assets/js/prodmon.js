$(() => {
  DevExpress.config({ defaultCurrency: 'VND' });
  window.jsPDF = window.jspdf.jsPDF;
  $('#pagetitle').html(`${formatMessage('prodmon')}`);

  var todate= moment().startOf('days');
  var fromdate= moment(todate).subtract(1, 'days');

  //**************************/
  var roleID = $('#roleid').text();
  var parentGroupID = $('#groupid').text();
  var productID = $('#productid').text();
  if (productID > 0) { //broader the search for 2 year
    fromdate =  fromdate.subtract(2,'year');
  }
  const URL = ''; 
  const tbl = "prodXfer";
  const primekey = "prodXferID";
  const memberStore = new DevExpress.data.CustomStore({
    key: primekey,
    load() {
      return sendRequest(`${URL}/prodXfer`, 'POST', {
        pid: productID,
        fromdate:  fromdate.format("YYYY-MM-DD"),
        todate: todate.format("YYYY-MM-DD"),
      });
    },
    insert(values) {
        console.log(JSON.stringify(values,false,4));
        
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
var supplierDataSource = {  
  store: new DevExpress.data.CustomStore({
    key: "memberID",
    loadMode: "raw",
    load: function() {
        return sendRequest(`${URL}/get/memberx/roleID/eq/8/and/status/eq/1`,'POST');
     }
  }) 
}   

//************************************************ */
  const grid = $('#profileContainer').dxDataGrid({
    dataSource: memberStore,
    allowColumnReordering: true,
    allowColumnResizing: true,
    columnAutoWidth: true,
    showBorders: true,
    remoteOperations: false,
    wordWrapEnabled: true,
    export: {
      enabled: true,
    },
    paging: {
      pageSize: 50,
    },
    pager: {
      showPageSizeSelector: true,
      allowedPageSizes: [50, 100, 150],
      showInfo: true,
      showNavigationButtons: true,
      infoText: `${formatMessage('page')} {0} ${formatMessage('of')} {1} ({2} ${formatMessage('records')})`
    },
    searchPanel: {
        visible: true,
        width: 240,
        placeholder: formatMessage('search'),
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
      allowUpdating: ((parentGroupID > 1) && ((roleID == 1) || (roleID==6)))?true:false,
      allowAdding: false,
      allowDeleting: ((parentGroupID > 1) && ((roleID == 1) || (roleID==6)))?true:false,
      useIcons: true,
      
    },
    selection: {
      mode: 'multiple',
      allowSelectAll: true,
      showCheckBoxesMode: 'always'
    },
    
    
    hoverStateEnabled: true,
    scrolling: {
      rowRenderingMode: 'virtual',
    },
    rowAlternationEnabled: true,
    columns: [
      { 
        dataField: 'prodXferID',
        caption: formatMessage('id'),
        allowEditing: false,
        visible: false,
        width:70
      },
      {
        dataField: 'productName',
        caption: formatMessage('name'),
        allowEditing: false,
        visible: true,
        calculateDisplayValue: function (rowData) { // combines display values
          let isnum = /^\d+$/.test(rowData.barcode);
          if (isnum) {
            return rowData.productName;
          } else {
            return rowData.productName + " (**)";
          }
        }
      },
      { dataField: 'expiryDate',
        caption: formatMessage('expirydate'),
        dataType: 'date',
        width: 120,
        allowEditing: true,
        visible: true,
        format: locale=='en'?'dd/MM/yyyy':'dd/MM/yyyy'
      },
      { dataField : 'vendorID',
        caption: formatMessage('supplier'),
        width: 130,
        lookup: {
          dataSource: supplierDataSource,
          valueExpr: "memberID",
          displayExpr: "company"
        }
      }, 
      {
        dataField: 'refID',
        caption: formatMessage('invoicenum'),
        width: 90,
        visible: true
      },
      { dataField: 'prizeaward',
        caption: formatMessage('specialdiscount'),
        width: 90,
        format: {
            type: 'currency',
            precision: 0  
          }  
      },
      { dataField: 'costperitem',
        caption: formatMessage('costperitem'),
        width: 90,
        allowEditing: false,
        format: {
            type: 'currency',
            precision: 0  
          }  
      },
      { dataField: 'itemcostoem',
        caption: formatMessage('upurpriceoem'),
        width: 90,
        format: {
            type: 'currency',
            precision: 0  
          }  
      },
      { dataField: 'itemcost',
        caption: formatMessage('newprice'),
        width: 90,
        allowEditing: false,
        format: {
            type: 'currency',
            precision: 0  
        }
      },
      { dataField: 'qty',
        caption: formatMessage('qty'),
        width: 60,
        format: "0,##0"
      },
      { dataField: 'gifts',
        caption: formatMessage('gifts'),
        width: 50,
        allowEditing: true,
        dataType: 'boolean'
      },
      { dataField: 'incltax',
        caption: formatMessage('incltax'),
        width: 50,
        allowEditing: true,
        dataType: 'boolean'
      },
      { dataField: 'taxrate',
        caption: formatMessage('taxrate'),
        width: 70,
        allowEditing: false,
        format: {
          type: 'percent',
          precision: 2  
        } 
      },
      { dataField: 'totalcost',
        caption: formatMessage('total'),
        width: 100,
        allowEditing: false,
        calculateCellValue: function(rowData){
          return rowData.qty * rowData.itemcost ;
        },
        format: {
            type: 'currency',
            precision: 0  
          }  
      },
      { dataField: 'dateAdded',
        caption: formatMessage('dateadded'),
        dataType: 'date',
        width: 90,
        allowEditing: false,
        visible: false,
        format: locale=='en'?'dd/MM/yyyy':'dd/MM/yyyy'
      },
      { dataField: 'lastChanged',
        caption: formatMessage('lastorderdate'),
        dataType: 'date',
        width: 90,
        allowEditing: false,
        visible: false,
        format: locale=='en'?'dd/MM/yyyy':'dd/MM/yyyy'
      },
      { dataField: 'lastpersonName',
        caption: formatMessage('lastperson'),
        width: 130,
        allowEditing: false,
        visible: false 
      },
      { dataField : 'status',
        caption: formatMessage('status'),
        allowEditing: ((parentGroupID > 1) && ((roleID == 1) || (roleID==6)))?true:false,
        width: 120,
        sortOrder: 'asc',
        lookup: {
            dataSource: purchasexSource,
            valueExpr: "status",
            displayExpr: "statext"
        }
      },
      { type: 'buttons',
        width: 100,
        buttons: ['edit', 'delete', 
        { text: formatMessage('issuepurorder'),
          icon: "pdffile",
          hint: formatMessage('issuepurorder'),
          onClick: function (e) {
            var data = e.row.data;
            calculateNewPrice(data);
            
          }
        }],
      }
    ],
    toolbar: {
      items: [
        {   
          location: 'after',
          template: `<div id="back">${formatMessage('daterangefilter')}</div>`
        }, {
          location: 'after',
          widget: 'dxButton',
          options: {
            icon: 'chevrondoubleleft',
            onClick() {
              fromdate = moment(fromdate).startOf('month');
              fromdate = fromdate.subtract(1,'month');
              todate = moment(fromdate).add(1,'month');
              grid.option('toolbar.items[3].options.value', fromdate);
              grid.option('toolbar.items[4].options.value', todate);
              grid.refresh()
            },
          },
        }, {
          location: 'after',
          widget: 'dxButton',
          options: {
            icon: 'chevronleft',
            onClick() {
              fromdate = fromdate.subtract(1,'days');
              todate = moment(fromdate).add(1, 'days');
              grid.option('toolbar.items[3].options.value', fromdate);
              grid.option('toolbar.items[4].options.value', todate);
              grid.refresh()
            },
          },
        },{
          location: 'after',
          widget: 'dxDateBox',
          options: {
            width: 160,
            value: fromdate,
            displayFormat: 'dd/MM/yyyy',
            onValueChanged(e) {
              fromdate = moment(e.value);
              if (fromdate.isBefore(todate)) {
                grid.refresh()
              }
            },
          },
        }, {
          location: 'after',
          widget: 'dxDateBox',
          options: {
            width: 160,
            value: todate,
            displayFormat: 'dd/MM/yyyy',
            onValueChanged(e) {
              todate = moment(e.value);
              if (fromdate.isBefore(todate)) {
                grid.refresh()
              }
            },
          },
        }, {
            location: 'after',
            widget: 'dxButton',
            options: {
              icon: 'chevronright',
              onClick() {
                fromdate = fromdate.add(1,'days');
                todate = moment(fromdate).add(1, 'days');
                grid.option('toolbar.items[3].options.value', fromdate);
                grid.option('toolbar.items[4].options.value', todate);
                grid.refresh()
              },
            },
        }, {
          location: 'after',
          widget: 'dxButton',
          options: {
            icon: 'chevrondoubleright',
            onClick() {
              fromdate = moment(fromdate).startOf('month');
              fromdate = fromdate.add(1,'month');
              todate = moment(fromdate).add(1,'month');
              grid.option('toolbar.items[3].options.value', fromdate);
              grid.option('toolbar.items[4].options.value', todate);
              grid.refresh()
            },
          },
        }, {
          location: 'after',
          widget: 'dxButton',
          options: {
            text: formatMessage('today'),
            onClick() {
              fromdate = moment();
              todate = moment(fromdate).add(1,'days');
              grid.option('toolbar.items[3].options.value', fromdate);
              grid.option('toolbar.items[4].options.value', todate);
              grid.refresh()
            },
          },
        }, {
          location: 'after',
          widget: 'dxButton',
          options: {
            icon: 'refresh',
            onClick() {
              grid.refresh();
            },
          },
        }, {
          location: 'after',
          widget: 'dxButton',
          options: {
            icon: 'print',
            text: formatMessage('qrcode'),
            onClick() {
              printExcel(grid.getSelectedRowsData())
            },
          },
        }, {
            location: 'after',
            widget: 'dxButton',
            options: {
              icon: 'print',
              text: formatMessage('podocket'),
              onClick() {
                calculateNewPrice2(grid.getSelectedRowsData(), function(error, data) {
                  if (!error) {
                    printPDF(data);
                    window.location.reload();
                  }
                })
              },
            },
        },
        'exportButton',
        'searchPanel'
      ],
    },
    onEditorPrepared(e) {
      if (e.parentType === "dataRow" && ((e.dataField === "manDate") || (e.dataField === "expiryDate"))) {  
        e.editorName = "dxDateBox";  
      }  
    },
    
    onSelectionChanged(e) {
      e.component.refresh(true);
    },
    summary: {
      totalItems: [{
        name: 'totalselectedrowSummary',
        showInColumn: 'productName',
        displayFormat: "#: {0}",
        summaryType: 'custom',
      },{
        column: 'vendorID',
        summaryType: 'min',
        customizeText(itemInfo) {
          return `${formatMessage('total')}`;
        }
      },{
        name: 'totalcostSummary',
        showInColumn: 'totalcost',
        valueFormat: 'currency', 
        displayFormat: "{0}",
        summaryType: 'custom',
      }],
      
      calculateCustomSummary(options) {
        if (options.name === 'totalcostSummary') {
          switch(options.summaryProcess) {
            case "start":
                options.totalValue = 0;
                break;
            case "calculate":
                if (options.component.isRowSelected(options.value.prodXferID)) {
                  options.totalValue += (options.value.qty * options.value.itemcost);
                }
                break;
            case "finalize":
                options.totalValue = Math.round(options.totalValue/100)*100
                break;
          }
        } else if (options.name === 'totalselectedrowSummary') {
          if (options.summaryProcess === 'start') {
            options.totalValue = 0;
          }
          if (options.summaryProcess === 'calculate') {
            if (options.component.isRowSelected(options.value.prodXferID)) {
              options.totalValue+= 1;
            }
          }
        }
      }
    },
    onExporting(e) {
      genExcel(e.component.getSelectedRowsData());
    },

    onContentReady(e) {
    },

    onCellPrepared(e) {
      if (e.rowType === "data") {
          if (e.row.data['status'] == 0) {
            e.cellElement.css({
                "color":"rgb(50,50,50)",
                "background-color":"rgb(220,180,20)",
            })
          } else if (e.row.data['status'] == 1) {
            e.cellElement.css({
              "color":"rgb(50,50,50)",
              "background-color":"rgb(255,120,120)",
            })
          } else {    
          }
      }
    },

  onRowUpdating (e) {
      if (e.oldData.status ==2) {
        screenLog(formatMessage('ordercompleted'),'warning');
        e.cancel = true;
      } else {
        if ((e.oldData.status == 1) && (e.newData.status==2)) {
          if (e.newData.expiryDate) {
            e.newData.expiryDate = timeSolver.getString(new Date(e.newData.expiryDate), "YYYY-MM-DD");
          }
          if (e.newData.manDate) {
            e.newData.manDate = timeSolver.getString(new Date(e.newData.manDate), "YYYY-MM-DD");
          }
          if ((isNotEmpty(e.oldData.refID)) || (isNotEmpty(e.newData.refID))) {
            const deferred = $.Deferred();
            var datprod = [];
            var commentx = [];
            var datax = e.oldData;
            //**************** */
            var ds = grid.getDataSource().items();
            //console.log(ds)
            //console.log(data)
            if ((datax.qty > 0) && (datax.vendorID>1) && (datax.itemcost>0) && (datax.status > 0) && (datax.refID!=null)) {
              var dsx = ds.filter(item => (item.refID==datax.refID) && (item.qty>0));
              //console.log(dsx);
              var dsy = dsx.map(obj=>({...obj, status:2  }));
              //console.log(dsy);
              var tcostx = 0;
              var ttaxx = 0;
              dsy.forEach(m=>{
                let newcostperitem = Math.round((((m.qty * m.itemcost) + (m.stockqty * m.costperitem))/(m.qty + m.stockqty))/10)*10
                let variationratio =  0;
                if (m.costperitem > 0) {
                  variationratio = m.itemcost/m.costperitem;
                } else {
                  variationratio = 1;
                }
                datprod.push({
                  productID: m.productID,
                  stockqty: m.qty + m.stockqty,  
                  costperitem: newcostperitem,
                  unitPrice:  (m.itemcost>m.costperitem)?Math.round(m.unitPrice * variationratio/1000)*1000:m.unitPrice,
                  unitPrice2:  (m.itemcost>m.costperitem)?Math.round(m.unitPrice2 * variationratio/100)*100:m.unitPrice2,
                  lastexpiryDate: timeSolver.getString(new Date(m.expiryDate), "YYYY-MM-DD"),
                  status: 1,
                })

                if (m.gifts == 1) { //it is a gift - no tax, ignore tax
                  tcostx += Math.ceil( m.qty * m.itemcost *100)/100;
                  ttaxx += 0;
                } else {
                  if (m.incltax==1) {
                    tcostx += Math.ceil( (m.qty * m.itemcost / (1+m.taxrate))*100 )/100;
                    ttaxx +=  Math.ceil( m.qty * m.itemcost * m.taxrate*100 )/100;
                  } else {
                    tcostx += Math.ceil(m.qty * m.itemcost*100)/100;
                    ttaxx += 0;
                  }
                }
              })
            } else {
              screenLog(formatMessage('ponotyetorder'),'warning');
              e.cancel = true;
            }

            //**************** */
            $.ajax({
              url: `/update/product`,
              method: "POST",
              data: {'data' : JSON.stringify(datprod)},
              dataType: "json",
              success: function(datb) {
                  if (datb.status == 0) {
                      deferred.resolve(true);
                      screenLog(formatMessage('failed'),'warning');
                  } else  {
                    $.ajax({
                      url: `/newStockPurchase`,
                      method: "POST",
                      data: {
                          groupID: parentGroupID,
                          supplierID: (e.newData.vendorID && e.newData.vendorID>0)?e.newData.vendorID:e.oldData.vendorID,
                          amount: tcostx,
                          tax: ttaxx,
                          refID: `S_${datax.prodXferID}_${datax.refID}`,
                          comment: `N/A`,
                          status: 0,
                      },
                      dataType: "json",
                      success: function(datc) {
                          if (datc.status == 0) {
                              deferred.resolve(true);
                              screenLog(formatMessage('failed'),'warning');
                          } else  {
                            $.ajax({
                              url: `/update/${tbl}`,
                              method: "POST",
                              data: {'data' : JSON.stringify(dsy)},
                              dataType: "json",
                              success: function(datax) {
                                if (datax.status == 0) {
                                    deferred.resolve(false);
                                    screenLog(formatMessage('failed'),'warning');
                                } else  {
                                    deferred.resolve(false);
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
                  }
              },
              error: function() {
                  deferred.reject("Data Loading Error");
              },
              timeout: 5000
          });
            e.cancel = deferred.promise();
  
          } else {
            screenLog(formatMessage('musthaverefid'),'warning');
            e.cancel = true;
          }
        } else if ((e.oldData.status == 0) && (e.newData.status==1)) {  
          if (((e.oldData.itemcostoem > 0) || (e.newData.itemcostoem && e.newData.itemcostoem > 0)) && 
             ((e.oldData.qty > 0) || (e.newData.qty && e.newData.qty > 0)) &&
             ((e.oldData.vendorID > 1) || (e.newData.qty && e.newData.qty >  1))) {
              e.cancel = false;
          } else {
            if (e.oldData.status==0) {
              screenLog(formatMessage('ponotyetorder'),'error');
            } else {
              screenLog(formatMessage('pofailed'),'error');
            }
            e.cancel = true;
          }
        } else if (e.newData.status < e.oldData.status) {
          screenLog(formatMessage('cantupgrade'),'warning');
          e.cancel = true;
        } else {
          if (e.newData.expiryDate) {
            e.newData.expiryDate = timeSolver.getString(new Date(e.newData.expiryDate), "YYYY-MM-DD");
          }
          if (e.newData.manDate) {
            e.newData.manDate = timeSolver.getString(new Date(e.newData.manDate), "YYYY-MM-DD");
          }
        }
      }
  }
    
}).dxDataGrid('instance');  

//***************************************************** */
function calculateNewPrice(data) {
  var ds = grid.getDataSource().items();
  if (data.status > 1) {
    //goto expenses with RefID.
  } else {
    if ((data.qty > 0) && (data.vendorID>1) && (data.itemcostoem>0) && (data.status > 0) && (data.refID!=null)) {
      let dsx = ds.filter(item => (item.refID==data.refID) && (item.status < 2) && (item.qty>0));
      //console.log(dsx);
      let dsy = dsx.map(obj=>({...obj, status:1, refID:data.refID, prizeaward:data.prizeaward, vendorID:data.vendorID }));
      //console.log(dsy);
      var tcostx = 0;
      var tprizex = 0;
      dsy.forEach(f=>{
        if (!f.gifts) {
          if (f.incltax) {
            tcostx +=  Math.round((f.itemcostoem * (1 + f.taxrate)) * f.qty);
          } else  {
            tcostx +=  Math.round(f.itemcostoem  * f.qty);
          }
        } else {
          if (f.incltax) {
            tprizex += Math.round((f.itemcostoem * (1 + f.taxrate)) * f.qty);
          } else  {
            tprizex += Math.round(f.itemcostoem * f.qty);
          }
        }
      });
      var netcostx = tcostx - tprizex - data.prizeaward;
      dsy.forEach(f=>{
        if (!f.gifts) {
          if (f.incltax) {
            f.itemcost = Math.ceil((((((f.itemcostoem * (1 + f.taxrate)) * f.qty)/tcostx)) * netcostx)/f.qty *100)/100;
          } else  {
            f.itemcost = Math.ceil(((((f.itemcostoem * f.qty)/tcostx)) * netcostx)/f.qty *100)/100;
          }
        } else {
          if (f.incltax) {
            f.itemcost = Math.ceil(f.itemcostoem * (1 + f.taxrate) * 100)/100;
          } else  {
            f.itemcost = Math.ceil(f.itemcostoem * 100)/100;
          }
        }
      });
      const deferred = $.Deferred();
      $.ajax({
          url: `/update/${tbl}`,
          method: "POST",
          data: {'data' : JSON.stringify(dsy)},
          dataType: "json",
          success: function(datax) {
            if (datax.status == 0) {
                deferred.resolve(false);
                screenLog(formatMessage('failed'),'warning');
            } else  {
                deferred.resolve(false);
            }
          },
          error: function() {
              deferred.reject("Data Loading Error");
          },
          timeout: 10000
      });
      deferred.promise();
      window.location.reload()
    } else {
      if (data.status==0) {
        screenLog(formatMessage('ponotyetorder'),'error');
      } else {
        screenLog(formatMessage('pofailed'),'error');
      }
    }
  }
}
function calculateNewPrice2(ds, callback) {
  if (ds.length > 0) {
    var data = ds[0];
    console.log(data)
    if ((data.qty > 0) && (data.vendorID>1) && (data.refID!=null)) {
      let dsx = ds.filter(item => (item.status == 0) && (item.qty>0));
      //console.log(dsx);
      let dsy = dsx.map(obj=>({...obj, refID:data.refID, prizeaward:data.prizeaward, vendorID:data.vendorID }));
      //console.log(dsy);
      const deferred = $.Deferred();
      $.ajax({
          url: `/update/${tbl}`,
          method: "POST",
          data: {'data' : JSON.stringify(dsy)},
          dataType: "json",
          success: function(datax) {
            if (datax.status == 0) {
                deferred.resolve(false);
                screenLog(formatMessage('failed'),'warning');
            } else  {
                deferred.resolve(false);
            }
          },
          error: function() {
              deferred.reject("Data Loading Error");
          },
          timeout: 10000
      });
      deferred.promise();
      callback(false, dsy);
    }
  } else {
    screenLog(formatMessage('pofailed'),'error');
    callback(true, []);
  }
  
  
}
function genExcel(dsx) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Products');
  worksheet.columns = [
    { width: 5, key: 'id' }, { width: 45, key: 'name'  }, { width: 16, key: 'barcode'},
    { width: 12, key: 'price' }, { width: 4, key: 'qty'  }, { width: 5, key: 'incltax'},
    { width: 5, key: 'taxrate'},{ width: 12, key: 'totalcost'}
  ];
  var rows = [];
  var idx=1;
  dsx.forEach((f,index) => {
    console.log(f)
    if (f.qty>0){
      rows.push({
        id:idx, 
        name:f.productName.substring(0,42),
        barcode:f.barcode,
        price:f.itemcost,
        qty:f.qty,
        incltax:f.incltax,
        taxrate:f.taxrate,
        totalcost:(f.incltax==0)?f.itemcost*f.qty:f.itemcost*f.qty*(1+f,taxrate),
      })
      idx++;
    }
  })
  worksheet.addRows(rows);
  workbook.xlsx.writeBuffer().then((buffer) => {
    saveAs(new Blob([buffer], { type: 'application/octet-stream' }), `prod${getDateTimeStampString()}.xlsx`);
  });
  
}
function printExcel(selRows) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Companies');
  worksheet.columns = [
    { width: 5, key: 'id' }, { width: 100, key: 'name'  }, { width: 100, key: 'barcode' }
  ];
  var rows = [];
  var idx=1;
  selRows.forEach((f,index) => {
    let isnum = /^\d+$/.test(f.barcode);
    if ((f.qty>0) && !isnum){
      for (i=0;i<f.qty;i++) {
        rows.push({id:idx, name:f.productName.substring(0,42),barcode:f.barcode})
        idx++;
      }
    }
  })
  worksheet.addRows(rows);
  workbook.xlsx.writeBuffer().then((buffer) => {
    saveAs(new Blob([buffer], { type: 'application/octet-stream' }), `prodQR${getDateTimeStampString()}.xlsx`);
  });
}

function printPDF(dsx) {
  const lastPoint = { x: 0, y: 0 };
  const doc  = new jsPDF({orientation:'portrait'});
  doc.addFileToVFS('Arimo-Regular-normal.ttf', font);
  doc.addFont('Arimo-Regular-normal.ttf', 'Arimo-Regular', 'normal');
  doc.setFont("Arimo-Regular","normal");
  doc.setFontSize(9);
  doc.setTextColor('#333333');
  
  var data = dsx[0];
  console.log(data)
  const header = `${formatMessage('podocket')}`;
  const orderNumber =`${formatMessage('ordersx')}: ${data.refID}`;
  const vendorName = `${formatMessage('supplier')}: ${data.scompany}`;
  const address = `${formatMessage('address')}: ${data.saddress}`; 
  const phone = `${formatMessage('contactphone')}: ${data.sphone}`; 
  const contactname = `${formatMessage('contactname')}: ${data.sname}`;  
  const dateordered = data.dateAdded;
  const sxcompany = `${data.sxname}`;
  const sxaddress = `${formatMessage('address')}: ${data.sxaddress}`;
  const sxtax = `${formatMessage('taxid')}: ${data.abn}`;
  const sxphone = `${formatMessage('hotline')}: ${data.hotline}`;
 

  const pageWidth = doc.internal.pageSize.getWidth();
  doc.setFontSize(9);
  doc.text(sxcompany, 15, 8);
  doc.text(sxaddress, 15, 12);
  doc.text(sxtax, 15, 16);
  doc.text(sxphone, 15, 20);
/*
  var img = new Image()
  img.src = `public/${data.subdir}/${data.logox}`;
  console.log(img.src)
  doc.addImage(img, 'png', 150, 4, 45, 15)
*/
  doc.setLineWidth(0.5);
  doc.setDrawColor(0,0,255); // draw blue lines
  doc.line(15, 25, 195, 25);

  doc.setFontSize(16);
  doc.text(header, 80, 32).setFont("Arimo-Regular", 'bold');
  doc.setFont("Arimo-Regular","normal");
  doc.setFontSize(10);
  
  doc.text(orderNumber, 15, 42);
  doc.text(vendorName, 15, 47);
  doc.text(address, 15, 52);
  doc.text(dateordered, 145, 42);
  doc.text(phone, 145, 47);
  doc.text(contactname, 145, 52);
  
  doc.setLineWidth(0.5);
  doc.setDrawColor(0,0,0); // draw black lines
  doc.line(15, 60, 195, 60);

  doc.text(formatMessage('name'), 15, 68);
  //doc.text(formatMessage('upurprice'), 95, 68);
  doc.text(formatMessage('qty'), 125, 68);
  //doc.text(formatMessage('total'), 168, 68);

  var amount = 0;
  var tax = 0;
  var total = 0;
  dsx.forEach((dx, index) => {
    let amounty = dx.itemcost * dx.qty;
    amount+= amounty;
    let taxy = dx.incltax?amount * dx.taxrate:0;
    tax+= taxy;
    let totaly = amounty + taxy;
    total+= totaly;
    var itemcostx = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(dx.itemcost);
    doc.text(dx.productName, 15, 72 + (index*5));
    //doc.textEx(itemcostx.replace(/&nbsp;/g, ' '), 115, 72 + (index*5), 'right', 'middle');
    doc.textEx(dx.qty.toString().replace(/&nbsp;/g, ' '), 140, 72 + (index*5), 'right', 'middle');
    var amountA = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amounty);
    //doc.textEx(amountA.replace(/&nbsp;/g, ' '), 185, 72 + (index*5), 'right', 'middle');
  });
  var amountx = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  var taxx = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(tax);
  var totalx = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(total);
  var amtwords = to_vietnamese(total) + " đồng";
  var bywords = `${formatMessage('byword')}: ${amtwords}`;
  
  const spacex =  240;
  doc.setLineWidth(0.5);
  doc.setDrawColor(0,0,0); // draw black lines
  doc.line(15, spacex, 195, spacex);

  doc.textEx(`${formatMessage('subtotal')}`, 145, spacex + 5, 'right', 'middle');
  doc.textEx(`${formatMessage('tax')}`, 145, spacex + 10, 'right', 'middle');
  doc.textEx(`${formatMessage('total')}`, 145, spacex + 15, 'right', 'middle');

  //doc.textEx(amountx.replace(/&nbsp;/g, ' '), 185, spacex + 5, 'right', 'middle');
  //doc.textEx(taxx.replace(/&nbsp;/g, ' '), 185, spacex + 10, 'right', 'middle');
  //doc.textEx(totalx.replace(/&nbsp;/g, ' '), 185, spacex + 15, 'right', 'middle');



  //doc.text(bywords, 15, spacex + 20);

  doc.setLineWidth(0.5);
  doc.setDrawColor(0,0,0); // draw black lines
  doc.line(15, spacex+ 24, 195, spacex+ 24);

  doc.text(`${formatMessage('storemanger')}`, 85, spacex + 30);
  doc.text(`${formatMessage('manager')}`, 145, spacex + 30);

  const footer = '...';
  // add custom font to file
  
  const footerWidth = doc.getTextDimensions(footer).w;
  doc.text(footer, (lastPoint.x - footerWidth), lastPoint.y + 5);
  doc.save(`${data.subdir}PO${data.productID}.pdf`);

}


function sendRequest(url, method = 'GET', data) {
  const d = $.Deferred();
  //console.log("url: " + url)
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


var splitRegex = /\r\n|\r|\n/g;
  jsPDF.API.textEx = function (text, x, y, hAlign, vAlign) {
    var fontSize = this.internal.getFontSize() / this.internal.scaleFactor;

    // As defined in jsPDF source code
    var lineHeightProportion = 1.15;

    var splittedText = null;
    var lineCount = 1;
    if (vAlign === 'middle' || vAlign === 'bottom' || hAlign === 'center' || hAlign === 'right') {
        splittedText = typeof text === 'string' ? text.split(splitRegex) : text;

        lineCount = splittedText.length || 1;
    }

    // Align the top
    y += fontSize * (2 - lineHeightProportion);

    if (vAlign === 'middle')
        y -= (lineCount / 2) * fontSize;
    else if (vAlign === 'bottom')
        y -= lineCount * fontSize;

    if (hAlign === 'center' || hAlign === 'right') {
        var alignSize = fontSize;
        if (hAlign === 'center')
            alignSize *= 0.5;

        if (lineCount > 1) {
            for (var iLine = 0; iLine < splittedText.length; iLine++) {
                this.text(splittedText[iLine], x - this.getStringUnitWidth(splittedText[iLine]) * alignSize, y);
                y += fontSize * lineHeightProportion;
            }
            return this;
        }
        x -= this.getStringUnitWidth(text) * alignSize;
    }

    this.text(text, x, y);
    return this;
  };


});

