$(() => {
  DevExpress.config({ defaultCurrency: 'VND' });
  const pagetitle = $('#pagetitlex').text();
  $('#pagetitle').html(`${formatMessage('walletxchange')}`);
  var todate= moment().endOf('years');
  var fromdate= moment().startOf('years');
  
  //**************************/

  var parentGroupID = $('#groupid').text();
  var roleID = $('#roleid').text();
  var selID = $('#selID').text();

  const URL = ''; 
  const tbl = "saleitems";
  const primekey = "saleitemsID";
  const memberStore = new DevExpress.data.CustomStore({
    key: primekey,
    load() {
      let tmp = {
        mid: selID,
        fromdate:  fromdate.format("YYYY-MM-DD"),
        todate: todate.format("YYYY-MM-DD")
      }
      if (pagetitle == 'custxchg') {
        return sendRequest(`${URL}/salexchg/0`, 'POST', tmp);  
      } else if (pagetitle == 'prodxchg') {
        return sendRequest(`${URL}/salexchg/1`, 'POST', tmp);  
      } else if (pagetitle == 'staffxchg') {
        return sendRequest(`${URL}/salexchg/2`, 'POST', tmp);  
      }
      
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

//**************************/
   var categoryDataSource = {  
    store: new DevExpress.data.CustomStore({
      key: "categoryID",
      loadMode: "raw",
      load: function() {
          return $.getJSON(`${URL}/category/${parentGroupID}`);
      },
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
    paging: {
      pageSize: 25,
    },
    pager: {
      showPageSizeSelector: true,
      allowedPageSizes: [25, 50, 100],
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
      const worksheet = workbook.addWorksheet('saleitems');

      DevExpress.excelExporter.exportDataGrid({
          component: e.component,
          worksheet,
          autoFilterEnabled: true,
      }).then(() => {
          workbook.xlsx.writeBuffer().then((buffer) => {
            saveAs(new Blob([buffer], { type: 'application/octet-stream' }), `wallet${getDateTimeStampString()}.xlsx`);
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
      mode: 'row',
      allowUpdating:  false,
      allowAdding: false,
      allowDeleting:  false,
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
    rowAlternationEnabled: false,
    columns: [
      { dataField: 'saleitemsID',
        caption: formatMessage('id')+'#',
        width: 80,
        allowEditing: false,
        visible: true
      },
      { dataField: 'saleID',
        caption: formatMessage('invoicenum'),
        width: 80,
        allowEditing: false
      }, 
      { dataField: 'custName',
        caption: formatMessage('customer'),
        width: 140,
        allowEditing: false
      }, 
      { dataField: 'staffName',
        caption: formatMessage('staff'),
        width: 140,
        allowEditing: false
      }, 
      { dataField: 'productName',
        caption: formatMessage('product'),
        allowEditing: false
      },  
      { dataField : 'categoryID',
        caption: formatMessage('category'),
        width: 210,
        setCellValue(rowData, value) {
          rowData.categoryID = value;
          rowData.subcatID = null;
        },
        lookup: {
          dataSource: categoryDataSource,
          valueExpr: "categoryID",
          displayExpr: "categoryName"
        }
      },
      { dataField : 'typeID',
        caption: formatMessage('type'),
        width: 70,
        visible: true,
        lookup: {
            dataSource: typeSource,
            valueExpr: "status",
            displayExpr: "statext"
        }
      }, 
      { dataField: 'price',
        caption: formatMessage('unitprice'),
        width: 100,
        allowEditing: false,
        format: {
            type: 'currency',
            precision: 0  
          }  
      },
      { dataField: 'qty',
        caption: formatMessage('qty'),
        width: 60,
        allowEditing: false,
      },
      { dataField: 'ucostTotal',
        caption: formatMessage('total'),
        calculateCellValue: function(rowData){
          return rowData.price * rowData.qty;
        },
        format: {
            type: 'currency',
            precision: 0  
        },
        allowEditing: false,
        width: 120    
      },
      { dataField: 'dateAdded',
        caption: formatMessage('dateadded'),
        dataType: 'date',
        width: 140,
        allowEditing: false,
        visible: true,
        sortIndex: 0, 
        sortOrder: "desc",
        format: locale=='en'?'dd MMM, yyyy':'dd MMMM M, yyyy'
      },
    ],
    summary: {
      totalItems: [{
          name: 'ucostTotalSummary',
          showInColumn: 'ucostTotal',
          valueFormat: 'currency', 
          displayFormat: "{0}",
          summaryType: 'custom',
        },{
          name: 'uqtyTotalSummary',
          showInColumn: 'qty',
          displayFormat: "{0}",
          summaryType: 'custom',
      }],
      calculateCustomSummary(options) {
        if (options.name === 'ucostTotalSummary') {
          if (options.summaryProcess === 'start') {
            options.totalValue = 0;
          }
          if (options.summaryProcess === 'calculate') {
              options.totalValue += options.value.qty * options.value.price;
          }
        }
        if (options.name === 'uqtyTotalSummary') {
          if (options.summaryProcess === 'start') {
            options.totalValue = 0;
          }
          if (options.summaryProcess === 'calculate') {
              options.totalValue += options.value.qty;
          }
        }
      }
    },
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
              fromdate = moment(fromdate).startOf('year');
              fromdate = fromdate.subtract(1,'year');
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
              fromdate = fromdate.subtract(1,'month');
              todate = moment(fromdate).add(1, 'month');
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
                fromdate = fromdate.add(1,'month');
                todate = moment(fromdate).add(1, 'month');
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
              fromdate = moment(fromdate).startOf('year');
              fromdate = fromdate.add(1,'year');
              todate = moment(fromdate).add(1,'year');
              grid.option('toolbar.items[3].options.value', fromdate);
              grid.option('toolbar.items[4].options.value', todate);
              grid.refresh()
            },
          },
        }, {
          location: 'after',
          widget: 'dxButton',
          options: {
            text: formatMessage('thismonth'),
            onClick() {
              todate= moment().startOf('month');
              fromdate= moment(todate).subtract(1, 'month');
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
            onClick() {
              printExcel(grid.getSelectedRowsData())
            },
          },
        },
        'exportButton',
        'searchPanel'
      ],
    },
    
  }).dxDataGrid('instance');

  

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
        //console.log(JSON.stringify(result, false, 4))
        d.resolve(result.data, {
            totalCount: result.totalCount,
            summary: result.totalSummary,
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
