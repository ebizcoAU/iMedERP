$(() => {
    DevExpress.config({ defaultCurrency: 'VND' });
    $('#pagetitle').html(`${formatMessage('prodman')}`);
    var  currentDate = new Date().toISOString().split("T")[0];
    //console.log(convertMYSQLDateTime2JSDateTime(currentDate))
    //**************************/
    var parentGroupID = $('#groupid').text();
    var roleID = $('#roleid').text();
    var mode = 'new';
    const URL = ''; 
    const tbl = "prodman";
    const tbl1 = "proditem";
    const primekey = "prodmanID";
    const memberStore = new DevExpress.data.CustomStore({
      key: primekey,
      load(loadOptions) {
        const args = {};
        [
          'skip',
          'take',
          'requireTotalCount',
          'requireGroupCount',
          'sort',
          'filter',
          'totalSummary',
          'group',
          'groupSummary',
        ].forEach((i) => {
          if (i in loadOptions && isNotEmpty(loadOptions[i])) {
            args[i] = JSON.stringify(loadOptions[i]);
          }
        });  
      return sendRequestARG(`${URL}/prodmanlist`, 'POST', args);
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
          return sendRequest(`${URL}/deleteMasterSlave/${tbl}&${tbl1}`, 'POST', {
              data: JSON.stringify(datax)
          });
      },
    });
  
    //************************************************ */
    var productDataSource = {  
      store: new DevExpress.data.CustomStore({
        key: "productID",
        loadMode: "raw",
        load: function() {
            return $.getJSON(`${URL}/productlist`);
         }
      }) 
    }  
    var warehouseDataSource = {  
      store: new DevExpress.data.CustomStore({
        key: "warehouseID",
        loadMode: "raw",
        load: function() {
            return $.getJSON(`${URL}/warehouse/${parentGroupID}`);
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
      remoteOperations: true,
      wordWrapEnabled: true,
      paging: {
        pageSize: 7,
      },
      pager: {
        showPageSizeSelector: true,
        allowedPageSizes: [7, 10, 12],
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
      onExporting(e) {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('prodman');

        DevExpress.excelExporter.exportDataGrid({
            component: e.component,
            worksheet,
            autoFilterEnabled: true,
        }).then(() => {
            workbook.xlsx.writeBuffer().then((buffer) => {
              saveAs(new Blob([buffer], { type: 'application/octet-stream' }), `prodman_${getDateTimeStampString()}.xlsx`);
            });
        });
        e.cancel = true;
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
        mode: 'popup',
        allowUpdating:((parentGroupID > 1) && (((divisionID==1) && (roleID==1)) || ((roleID==2) && (divisionID==2))))?true:false,
        allowAdding: ((parentGroupID > 1) && (((divisionID==1) && (roleID==1)) || ((roleID==2) && (divisionID==2))))?true:false,
        allowDeleting: ((parentGroupID > 1) && (((divisionID==1) && (roleID==1)) || ((roleID==2) && (divisionID==2))))?true:false,
        useIcons: true,
        popup: {
          title: formatMessage('prodman'),
          showTitle: true,
          width: 1024,
          height: 640,
        },
        form: {
          labelMode: 'floating',
          items: [{
            itemType: 'group',
            cssClass: 'first-group',
            colCount: 4,
            colSpan: 2,
            items: [{
              dataField: 'imgLinkx',
              colSpan: 1,
            }, {
              itemType: 'group',
              colSpan: 3,
              items: [{
                dataField: 'productID',
              }, {
                dataField: 'warehouseID',
              }, {
                dataField: 'description',
                editorType: 'dxTextArea',
                editorOptions: {
                    height: 85,
                }, 
              }],
            }],
          }, {
            itemType: 'group',
            cssClass: 'second-group',
            colCount: 3,
            colSpan: 2,
            items: [{
              itemType: 'group',
              items: [{
                dataField: 'qty',
              }, {
                dataField: 'unitCost',
                editorType: 'dxNumberBox',
                editorOptions: {
                  format: {
                    type: "currency",
                    precision: 0
                  }
                }, 
              }, {
                dataField: 'batchNum',
              }],
            }, {
              itemType: 'group',
              items: [{
                dataField: 'dateAdded',
              }, {
                dataField: 'lastChanged',
              }, {
                dataField: 'lastpersonName', 
              }],
            }, {
              itemType: 'group',
              items: [{
                dataField: 'manDate',
              }, {
                dataField: 'expiryDate',
              }, {
                dataField: 'status',   
              }],
            }],
          }],
        },
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
        { dataField: 'prodmanID',
          caption: formatMessage('id'),
          width: 60,
        },
        { dataField: 'imgLinkx',
          caption: `.`,
          width: 115,
          allowSorting: false,
          calculateCellValue: function(rowData) {
            return rowData.subdir +'/'+ rowData.imgLink;
          },
          allowEditing: false, 
          cellTemplate: cellTemplate,
        },
        { dataField : 'productID',
            caption: formatMessage('product'),
            lookup: {
              dataSource: productDataSource,
              valueExpr: "productID",
              displayExpr: "productName"
            }
        },
        { dataField : 'warehouseID',
            caption: formatMessage('warehouse'),
            width: 100,   
            lookup: {
              dataSource: warehouseDataSource,
              valueExpr: "warehouseID",
              displayExpr: "name"
            }
        },
        { dataField: 'batchNum',
          caption: 'Batch No.',
          width: 90,
          allowEditing: false,
          calculateCellValue: function(rowData) {
            return rowData.subdir + rowData.prodmanID;
          },
        }, 
        { dataField: 'description',
          caption: formatMessage('description'),
          visible: false
        }, 
        { dataField: 'qty',
          caption: formatMessage('qty'),
          format: {
            type: 'fixedPoint',
            precision: 0  
          },
          width: 80    
        },  
        { dataField: 'unitCost',
          caption: formatMessage('unitcost'),
          format: {
              type: 'currency',
              precision: 0  
          },
          allowEditing: true,
          width: 90    
        },
        { dataField: 'qtyperBox',
          caption: formatMessage('qtyperbox'),
          dataType: "number",
          width: 80,
          allowEditing: false
        },
        { dataField: 'boxperPallet',
          caption: formatMessage('boxperpallet'),
          dataType: "number",
          width: 80,
          allowEditing: false
        },
        { dataField: 'manDate',
          caption: formatMessage('mandate'),
          dataType: 'date',
          width: 130,
          allowEditing: true,
          format: locale=='en'?'dd MMM, yyyy':'dd MMMM M, yyyy'
        },
        { dataField: 'expiryDate',
          caption: formatMessage('expirydate'),
          dataType: 'date',
          width: 130,
          allowEditing: true,
          format: locale=='en'?'dd MMM, yyyy':'dd MMMM M, yyyy'
        },
        
        { dataField: 'dateAdded',
          caption: formatMessage('dateadded'),
          dataType: 'date',
          width: 130,
          allowEditing: false,
          visible: false,
          format: locale=='en'?'dd MMM, yyyy':'dd MMMM M, yyyy'
        },
        { dataField: 'lastChanged',
          caption: formatMessage('lastchanged'),
          dataType: 'date',
          width: 130,
          allowEditing: false,
          visible: false,
          format: locale=='en'?'dd MMM, yyyy':'dd MMMM M, yyyy'
        },
        { dataField: 'lastpersonName',
          caption: formatMessage('lastperson'),
          allowEditing: false,
          visible: false
        },
        { dataField : 'status',
          caption: formatMessage('status'),
          width: 120,
          lookup: {
              dataSource: manSource,
              valueExpr: "status",
              displayExpr: "statext"
          }
        },
        { type: 'buttons',
          width: 120,
          buttons: ['edit', 'delete', 
          { text: formatMessage('download'),
            icon: "download",
            hint: "Download",
            onClick: function (e) {
              let data = e.row.data;
              if (data.status >= 2) {
                window.location = `/prodqrcode_${data.prodmanID}_${data.status}`;
              } else {
                screenLog(formatMessage("noqrcodeavailable"), 'warning');
              }
            }
          }, {
            text: formatMessage('rawstockused'),
            icon: "floppy",
            hint: formatMessage('rawstockused'),
            onClick: function (e) {
              let data = e.row.data;
              if (data.productID  < 3) {
                screenLog(formatMessage("norawstockused"), 'warning');
              } else {
                if (data.status < 5) {
                  window.location = `/rawstockused_${data.prodmanID}`;
                } else {
                  screenLog(formatMessage("unable2calculatecost") + '. ' + formatMessage("transationalreadycompleted") , 'error');
                }
                
              }
            }
          }],
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
      onEditingStart(e) {
        mode = 'edit';  
      },
      onRowUpdating(e) {
        //console.log("onRowUpdatingOLD: " + JSON.stringify(e.oldData, false, 4));
        //console.log("onRowUpdatingNEW: " + JSON.stringify(e.newData, false, 4));
        if (e.newData.hasOwnProperty('status')) {
          if (e.newData.status < e.oldData.status) {
            screenLog(formatMessage("cantupgrade"), 'error');
            e.cancel = true;
          } else {
            if ((e.oldData.status == 0) && (e.newData.status==1)) { // Proposed --> GenQRCODE
              setTimeout(() => {
                grid.refresh();
              }, 30000);
            } else if ((e.oldData.status == 4) && (e.newData.status==5)) { // Complete --> In Stock
              if (e.oldData['unitCost'] > 0) {
                const deferred = $.Deferred();
                $.ajax({
                    url: `/stockChkIn`,
                    method: "POST",
                    data: {
                        prodmanID: e.oldData['prodmanID'],
                        productID: e.oldData['productID'],
                        unitCost: e.oldData['unitCost'],
                        subdir: e.oldData['subdir'],
                        costperitem: e.oldData['costperitem'],
                        stockqty: e.oldData['stockqty'],
                    },
                    dataType: "json",
                    success: function(data) {
                        if (data.status == 0) {
                            deferred.resolve(false);
                        } else  {
                          screenLog('System Error','warning');
                          deferred.resolve(true);
                        }
                    },
                    error: function() {
                        deferred.reject("Data Loading Error");
                    },
                    timeout: 5000
                });
                e.cancel = deferred.promise();
              } else {
                screenLog(formatMessage('unitcostcantbezero'),'error');
                e.cancel = true;
              }
              
            } else if ((e.oldData.status == 2) && (e.newData.status==3)) { //Ready --> In-Production
              let tdate = convertMYSQLDateTime2JSDateTime(currentDate);
              e.newData.manDate = tdate[0];
              e.newData.manEnd = tdate[1];
              const deferred = $.Deferred();
              $.ajax({
                  url: `/rawStockTake`,
                  method: "POST",
                  data: {
                      prodmanID: e.oldData['prodmanID'],
                      productID: e.oldData['productID'],
                      batchNum: e.oldData['batchNum'],
                      qty: e.oldData['qty']
                  },
                  dataType: "json",
                  success: function(data) {
                    console.log(data)
                      if (data.status == -1) {
                        screenLog(formatMessage("notenoughrawstock") + ' -- ' + data.data, 'error');
                        deferred.resolve(true);
                      } else  {
                        deferred.resolve(false);
                      }
                  },
                  error: function() {
                      deferred.reject("Data Loading Error");
                  },
                  timeout: 5000
              });
              e.cancel = deferred.promise();
            } else if ((e.oldData.status !== 4) && (e.newData.status==5)) {
              if (e.oldData.productID < 3) {
                e.cancel = false;
              }  else {
                screenLog(formatMessage("cantupgrade"), 'error');
                e.cancel = true;
              }
            } else {
              e.cancel = false;
            }
          }
        } else if ((e.newData.hasOwnProperty('productID') || e.newData.hasOwnProperty('qty') ) && (e.oldData.status > 1)){  
          screenLog(formatMessage("qrcodealreadygenerated"), 'error');
          e.cancel = true;
        } else {
          e.cancel = false;
        }

      },
      onInitNewRow() {
        mode = 'new';
      },
      onRowRemoving: function(e) {
        console.log("e.status: " + e.data['status']);
        if (e.data['status'] > 2) {
            screenLog(formatMessage("qrcodealreadygenerated"), 'error');
            e.cancel = true;
        } else {
          e.cancel = false;
        }
      },
      
    }).dxDataGrid('instance');

    function convertMYSQLDateTime2JSDateTime(datex) {
      console.log(datex)
      var t = datex.split(/[- :]/);
      var tdate = [];
      tdate.push(`${t[0]}-${t[1]}-${t[2]} 8:00:00`);
      tdate.push(`${t[0]}-${t[1]}-${t[2]} 12:00:00`);
      return tdate;
    }
  
    function cellTemplate(container, options) {
      var backendURL = `public/`;
      let imgElement = document.createElement("img");
      let imagepath = `${backendURL}logoblank.png`;
      //console.log("options.value: " + options.value);
      //console.log("options.data: " + JSON.stringify(options.data,false,4));
      if ((options.value.split("/")[1] !== 'undefined') && (options.value.split("/")[1].length > 0)) {
        imagepath =  `${backendURL}${options.value}`;
      } else if (options.data.productID === 1) {
        imagepath = `${backendURL}box.png`;
      } else if (options.data.productID === 2) {
        imagepath = `${backendURL}pallet.png`;
      }

      //console.log("imagepath: " + imagepath);
      
      imgElement.setAttribute('src',`${imagepath}`);
      
      imgElement.setAttribute("width", `100`);
      imgElement.setAttribute("height", `100`);
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
  
  
    function sendRequestARG(url, method = 'GET', data) {
      console.log("url: " + url)
      const d = $.Deferred();
      $.ajax(url, {
        method,
        data,
        cache: false,
        xhrFields: { withCredentials: true },
      }).done((result) => {
          //console.log(JSON.stringify(result, false, 4))
          d.resolve(result.data, {
              totalCount: result.totalCount,
              summary: result.summary,
              groupCount: result.groupCount,
            });
        
      }).fail((xhr) => {
        d.reject(xhr.responseJSON ? xhr.responseJSON.Message : xhr.statusText);
      });
  
      return d.promise();
    }
  
    function isNotEmpty(value) {
      return value !== undefined && value !== null && value !== '';
    }
  
  
  });
  