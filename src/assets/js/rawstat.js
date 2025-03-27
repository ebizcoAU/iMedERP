$(() => {
    DevExpress.config({ defaultCurrency: 'VND' });
    $('#pagetitle').html(`${formatMessage('rawstat')}`);
    //**************************/
    var roleID = $('#roleid').text();
    var parentGroupID = $('#groupid').text();
    const URL = ''; 
    const tbl = "rawstock";
    const primekey = "rawstockID";
    const memberStore = new DevExpress.data.CustomStore({
      key: primekey,
      load() {
        return sendRequest(`${URL}/rawstock/${parentGroupID}`, 'POST');
      },
      insert(values) {
          console.log(JSON.stringify(values,false,4));
          values[`groupID`] = parentGroupID;
          values[`status`] = 0;
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
    const grid = $('#profileContainer').dxDataGrid({
      dataSource: memberStore,
      allowColumnReordering: true,
      allowColumnResizing: true,
      columnAutoWidth: true,
      showBorders: true,
      remoteOperations: false,
      wordWrapEnabled: true,
      paging: {
        pageSize: 15,
      },
      pager: {
        showPageSizeSelector: true,
        allowedPageSizes: [15, 18, 20],
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
        mode: 'popup',
        allowUpdating: true,
        allowAdding: ((parentGroupID > 1) && ((divisionID==1) && (roleID==1)))?true:false,
        allowDeleting: true,
        useIcons: true,
        popup: {
          title: formatMessage('rawstock'),
          showTitle: true,
          width: 1024,
          height: 680,
        },
        form: {
          labelMode: 'floating',
          items: [{
              itemType: 'group',
              cssClass: 'second-group',
              colCount: 3,
              colSpan: 2,
              items: [{
                    itemType: 'group',
                    items: [{
                    dataField: 'rawstockID',
                    }, {
                    dataField: 'rawstockName',
                    }, {
                    dataField: 'location'
                    }, {
                    dataField: 'qrcodeID',
                   
                    }],
                }, {
                    itemType: 'group',
                    items: [{
                        dataField: 'costperitem',
                        editorType: 'dxNumberBox',
                        editorOptions: {
                          format: {
                            type: "currency",
                            precision: 0
                          }
                        },    
                    },{
                        dataField: 'unitMeasure',
                    },{
                        dataField: 'stockqty',
                    },{
                        dataField: 'totalvalue',
                        editorType: 'dxNumberBox',
                        editorOptions: {
                          format: {
                            type: "currency",
                            precision: 0
                          }
                        }, 
                    },{
                        dataField: 'reorderlevel',
                    },{
                        dataField: 'daysperreorder',  
                    }]
                }, {
                    itemType: 'group',
                    items: [{
                        dataField: 'itemreorderqty',
                    },{
                        dataField: 'itemdiscontinued',
                    },{
                        dataField: 'dateAdded', 
                    }, {
                        dataField: 'lastChanged', 
                    },{
                        dataField: 'lastpersonName',     
                    }, {
                        dataField: 'status',         
                    }],
                }],
            }, {
              itemType: 'group',
              cssClass: 'third-group',
              colCount: 6,
              colSpan: 2,
              items: [{
                itemType: 'group',
                items: [{
                  dataField: 'qrcodeIDx',
                }],
              }, {
                itemType: 'group',
                colSpan: 5,
                items: [{
                  dataField: 'description',
                  editorType: 'dxTextArea',
                  editorOptions: {
                      height: 125,
                  }, 
                }],
              }],
          }]
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
        { dataField: 'rawstockID',
          caption: '...',
          allowEditing: false,
          width:48,
          cellTemplate: cellStatTemplate,
        },
        {
            dataField: 'rawstockName',
            caption: formatMessage('name'),
            width:'300',
            visible: true
        },
        {
            dataField: 'description',
            caption: formatMessage('description'),
            width:'140',
            visible: false
        },
        {
            dataField: 'location',
            caption: formatMessage('location'),
            width:'130',
            visible: true
        },
       
        { dataField: 'qrcodeID',
          caption: formatMessage('id') + ' QRCODE',
          width: 100,
          visible: false
        },
        
        {   dataField: 'qrcodeIDx',
            caption:  "QRCODE",
            visible: false,
            width: 225,
            allowEditing: false,
            calculateCellValue: function(rowData) {
                return `${rowData.weburl}/rawstkqrchk?${rowData.qrcodeID}`;
            },
            editCellTemplate: editCellQRCodeTemplate
        },
        { dataField: 'costperitem',
          caption: formatMessage('upurprice'),
          width: 100,
          allowEditing: false,
          format: {
              type: 'currency',
              precision: 0  
            }  
        },
        { dataField: 'stockqty',
          caption: formatMessage('stockinhand'),
          allowEditing: ((parentGroupID > 1) && (roleID == 1))?true:false,
          width: 80,
          calculateDisplayValue: function (rowData) {
            if (rowData.unitMeasure < 2) {
              return new Intl.NumberFormat('vi-VN', {minimumFractionDigits: 2, maximumFractionDigits:2}).format(rowData.stockqty);
            } else {
              return new Intl.NumberFormat('vi-VN').format(rowData.stockqty);
            }
          }
        },
        { dataField : 'unitMeasure',
          caption: formatMessage('unitmeasure'),
          width: 70,
          visible: true,
          lookup: {
              dataSource: unitweightSource,
              valueExpr: "status",
              displayExpr: "statext"
          }
        },
        { dataField: 'totalvalue',
          caption: formatMessage('total'),
          width: 120,
          allowEditing: false,
          calculateCellValue: function(rowData){
            return rowData.stockqty * rowData.costperitem;
          },
          format: {
              type: 'currency',
              precision: 0  
            }  
        },
        { dataField: 'reorderlevel',
          caption: formatMessage('reorderlevel'),
          width: 80,
          visible: true,
          format: "0,##0"
        },
        { dataField: 'daysperreorder',
          caption: formatMessage('daysperreorder'),
          width: 80,
          visible: true
        },
        { dataField: 'itemreorderqty',
          caption: formatMessage('itemreorderqty'),
          width: 90,
          visible: true,
          format: "0,##0"
        },
        { dataField: 'itemdiscontinued',
          caption: formatMessage('itemdiscontinued'),
          width: 70,
          visible: true,
          lookup: {
            dataSource: yesnoSource,
            valueExpr: "status",
            displayExpr: "statext"
          }
        },
        { dataField: 'dateAdded',
          caption: formatMessage('dateadded'),
          dataType: 'date',
          width: 140,
          allowEditing: false,
          visible: false,
          format: locale=='en'?'dd MMM, yyyy':'dd MMMM M, yyyy'
        },
        { dataField: 'lastChanged',
          caption: formatMessage('lastorderdate'),
          dataType: 'date',
          allowEditing: false,
          visible: true,
          format: locale=='en'?'dd MMM, yyyy':'dd MMMM M, yyyy'
        },
        { dataField: 'lastpersonName',
          caption: formatMessage('lastperson'),
          width: 160,
          allowEditing: false,
          visible: false 
        },
        { dataField : 'status',
          caption: formatMessage('status'),
          allowEditing: ((parentGroupID > 1) && (roleID == 1))?true:false,
          width: 90,
          lookup: {
              dataSource: statusSource2,
              valueExpr: "status",
              displayExpr: "statext"
          }
        },
        { type: 'buttons',
          width: 130,
          buttons: ['edit', 'delete', 
          { text: formatMessage('xchangetransaction'),
            icon: "chart",
            hint: formatMessage('xchangetransaction'),
            onClick: function (e) {
              let data = e.row.data;
              window.location = `/rawmonxfer?${data.rawstockID}`;
            }
          }, { text: formatMessage('purchasestock'),
            icon: "money",
            hint: formatMessage('purchasestock'),
            onClick: function (e) {
                var datax = e.row.data;
                if (datax.stockqty <= datax.reorderlevel) {
                    if (datax.status == 1) {
                        const deferred = $.Deferred();
                        $.ajax({
                            url: `/update/rawstock`,
                            method: "POST",
                            data: {
                                rawstockID:  datax.rawstockID,   
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
                                        url: `/new/rawstockXfer`,
                                        method: "POST",
                                        data: {
                                            rawstockID: datax.rawstockID,
                                            xferType:  0,
                                            qty: datax.itemreorderqty, 
                                            itemcost: datax.costperitem,   
                                            status: 0,
                                        },
                                        dataType: "json",
                                        success: function(data) {
                                            if (data.status == 0) {
                                                deferred.resolve(true);
                                                screenLog(formatMessage('failed'),'warning');
                                            } else  {
                                                deferred.resolve(false);
                                                screenLog(formatMessage("rawstocksuccessupdated"), 'success');
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
                        screenLog(formatMessage("rawstocknolongerused"), 'error');
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
      onSelectionChanged(e) {
        e.component.refresh(true);
      },
      summary: {
        totalItems: [{
          column: 'rawstockName',
          summaryType: 'min',
          customizeText(itemInfo) {
            return `${formatMessage('total')}`;
          },
        },{
          column: 'stockqty',
          displayFormat: "{0}",
          summaryType: 'sum',
          valueFormat: "0,##0"
        },{
          column: 'totalvalue',
          valueFormat: 'currency', 
          displayFormat: "{0}",
          summaryType: 'sum',
        }],
        
        
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
        if(e.rowType === "data" && e.column.dataField === "rawstockID") {
            if (e.row.data['stockqty'] <= e.row.data['reorderlevel'] ) {
              if (e.row.data['status'] == -1) {
              } else {
                var index = e.row.cells.findIndex(function(col) {
                  return e.column.dataField == "rawstockID"
                });
                e.row.cells[index].cellElement.css({
                  "color":"rgb(51,20,100)",
                  "background-color":"rgb(255,120,120)",
                })
              }               
            }
        }  
        if(e.rowType === "data") {
          if (e.row.data['stockqty'] <= e.row.data['reorderlevel'] ) {
            if (e.row.data['status'] == -1) {
              e.cellElement.css({
                "color":"rgb(51,20,100)",
                "background-color":"rgb(255,120,120)",
              })
            }
             
          }
        }


      },
      
    }).dxDataGrid('instance');
  
    function cellStatTemplate(container, options) {
      var backendURL = `assets/images/`;
      let imgElement = document.createElement("img");
      let imagepath = `${backendURL}checkgreen.png`;
      //console.log("options.data: " + JSON.stringify(options.data,false,4));
      if (options.data.stockqty > options.data.reorderlevel) {
        imagepath = `${backendURL}checkgreen.png`;
      } else {
        imagepath = `${backendURL}stocklow.png`;
      }
      imgElement.setAttribute('src',`${imagepath}`);
      imgElement.setAttribute("width", `32`);
      imgElement.setAttribute("height", `32`);
      container.append(imgElement);
    }

    function editCellQRCodeTemplate(cellElement, cellInfo) {
        if (typeof cellInfo.value === 'undefined') {
        } else {
          if ((typeof cellInfo.value === 'undefined') || (cellInfo.value === null)) {
            var backendURL = `public/`;
            let imageElement = document.createElement("img");
            imageElement.classList.add("qrcode");
            let imagepath = `${backendURL}logoblank.png`;
            console.log("imagepath: " + imagepath);
            imageElement.setAttribute('src',`${imagepath}`);
            imageElement.setAttribute("width", `140`);
            imageElement.setAttribute("height", `140`);
            cellElement.append(imageElement);
          } else {
            let qrcodeElement = document.createElement("div");
            qrcodeElement.classList.add("qrcode");
            new QRCode(qrcodeElement, {
              text: `${cellInfo.value}`,
              width: 130,
              height: 130,
              colorDark : "#000000",
              colorLight : "#ffffff",
              correctLevel : QRCode.CorrectLevel.H
            });
            cellElement.append(qrcodeElement);
          } 
          
        }
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
      const d = $.Deferred();
      console.log("url: " + url)
      $.ajax(url, {
        method,
        data,
        cache: false,
        xhrFields: { withCredentials: true },
      }).done((result) => {
        if (isNotEmpty(result.totalCount)) {
          d.resolve(result.data, {
            totalCount: result.totalCount
          });
        } else {
          d.resolve([], {
            totalCount: 0
          });
        }
        
      }).fail((xhr) => {
        d.reject(xhr.responseJSON ? xhr.responseJSON.Message : xhr.statusText);
      });
  
      return d.promise();
    }
  
    function isNotEmpty(value) {
      return value !== undefined && value !== null && value !== '';
    }
  
  
  });
  