$(() => {
    DevExpress.config({ defaultCurrency: 'VND' });
    $('#pagetitle').html(`${formatMessage('qrcodetable')}`);
    $('#prodmanidx').html(`${formatMessage('id')}: ${$('#prodmanID').text()}`);
    $('#batchnumx').html(`${formatMessage('id')} batch: ${$('#batchNum').text()}`);
    $('#productnamex').html(`${formatMessage('product')}: ${$('#prodmanName').text()}`);
    $('#qtyx').html(`${formatMessage('qty')}: ${$('#qty').text()}`);
    $('#warehousex').html(`${formatMessage('warehouse')}: ${$('#warehouseName').text()}`);
    var unitcostx = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format($('#unitCost').text());
    $('#unitcostx').html(`${formatMessage('unitcost')}: ${unitcostx}`);
    $('#qtyboxx').html(`${formatMessage('qty')} ${formatMessage('box')}: ${$('#qtyBox').text()}`);
    $('#mandatex').html(`${formatMessage('mandate')}: ${$('#mandate').text()}`);
    $('#expirydatex').html(`${formatMessage('expirydate')}: ${$('#expirydate').text()}`);
    //**************************/
    var parentGroupID = $('#groupid').text();
    var mode = 'new';
    const URL = ''; 
    const tbl = "prodman";
    const primekey = "prodmanID";
    const productID = parseInt($('#productID').text());
    const prodmanID = $('#prodmanID').text();
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

        if (productID === 1) {
            return sendRequestARG(`${URL}/boxlist/${prodmanID}`, 'POST', args); 
        } else if (productID === 2) {
            return sendRequestARG(`${URL}/palletlist/${prodmanID}`, 'POST', args);      
        } else {
            return sendRequestARG(`${URL}/prodxlist/${prodmanID}`, 'POST', args);
        }
      
      }
    });
   
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
        pageSize: 14,
      },
      pager: {
        showPageSizeSelector: true,
        allowedPageSizes: [14, 16, 20],
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
        const worksheet = workbook.addWorksheet('qrcode');
        if (productID > 2) {
          e.component.beginUpdate();  
          e.component.columnOption("uuID", "visible", false); 
          e.component.columnOption("refID", "visible", false); 
          e.component.columnOption("dateAdded", "visible", false); 
          e.component.columnOption("lastChanged", "visible", false); 
        }
        DevExpress.excelExporter.exportDataGrid({
            component: e.component,
            worksheet,
            autoFilterEnabled: true,
        }).then(() => {
            workbook.xlsx.writeBuffer().then((buffer) => {
                if (productID === 1) {
                    saveAs(new Blob([buffer], { type: 'application/octet-stream' }), `box_${prodmanID}_${getDateTimeStampString()}.xlsx`);
                } else if (productID === 2) {
                    saveAs(new Blob([buffer], { type: 'application/octet-stream' }), `pallet_${prodmanID}_${getDateTimeStampString()}.xlsx`);
                } else {
                    saveAs(new Blob([buffer], { type: 'application/octet-stream' }), `product_${prodmanID}_${getDateTimeStampString()}_1.xlsx`);
                    e.component.beginUpdate();  
                    e.component.columnOption("urlLink", "visible", false); 
                    e.component.columnOption("refID", "visible", true); 
                    DevExpress.excelExporter.exportDataGrid({
                        component: e.component,
                        worksheet,
                        autoFilterEnabled: true,
                    }).then(() => {
                        workbook.xlsx.writeBuffer().then((buffer) => {
                            saveAs(new Blob([buffer], { type: 'application/octet-stream' }), `product_${prodmanID}_${getDateTimeStampString()}_2.xlsx`);
                        });
                    });
                }
            });
        });
        
        e.cancel = true;
      },
      onExported(e) {
        if (productID > 2) {
          e.component.columnOption("uuID", "visible", true); 
          e.component.columnOption("refID", "visible", true); 
          e.component.columnOption("dateAdded", "visible", true); 
          e.component.columnOption("lastChanged", "visible", true); 
          e.component.endUpdate(); 
        }
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
        allowAdding: false,
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
        { dataField: 'urlLink',
          caption: 'urlLink',
        },
        { dataField: 'refID',
          caption: 'REFID',
          width: 120,
        },
        { dataField: 'uuID',
          caption: 'UUID',
          width: 200,
        },
        { dataField: 'indexNum',
          caption: 'itemID',
          width: 120,
        },
        { dataField: 'dateAdded',
          caption: formatMessage('dateadded'),
          dataType: 'date',
          width: 140,
          allowEditing: false,
          visible: true,
          format: locale=='en'?'dd MMM, yyyy':'dd MMMM M, yyyy'
        },
        { dataField: 'lastChanged',
          caption: formatMessage('lastchanged'),
          dataType: 'date',
          width: 140,
          allowEditing: false,
          visible: true,
          format: locale=='en'?'dd MMM, yyyy':'dd MMMM M, yyyy'
        }
      ]
      
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
  