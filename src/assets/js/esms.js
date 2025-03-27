$(() => {
  DevExpress.config({ defaultCurrency: 'VND' });
  $('#pagetitle').html(`${formatMessage('esmsxchange')}`)
  //**************************/
  var parentGroupID = $('#groupid').text();
  var roleID = $('#roleid').text();
  var accountID = $('#accountID').text();
  const URL = ''; 
  const tbl = "esms";
  const primekey = "esmsID";
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
      return sendRequestARG(`${URL}/esmslist`, 'POST', args);  
    }
  });

//************************************************ */
  


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
      pageSize: 20,
    },
    pager: {
      showPageSizeSelector: true,
      allowedPageSizes: [20, 24, 28],
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
      const worksheet = workbook.addWorksheet('ordersx');

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
      { dataField: 'esmsID',
        caption: formatMessage('id')+'#',
        width: 100,
        allowEditing: false,
        visible: true
      },
      { dataField : 'phone',
        caption: 'Phone',
        allowEditing: false,
        width: 110
      },
      { dataField : 'smsText',
        caption: formatMessage('content'),
        allowEditing: false,
      },
      { dataField : 'smsID',
        caption: formatMessage('id')+' SMS',
        allowEditing: false,
        width: 220
      },
      { dataField: 'dateAdded',
        caption: formatMessage('dateadded'),
        dataType: 'date',
        width: 240,
        allowEditing: false,
        visible: true,
        sortIndex: 0, 
        sortOrder: "desc",
        format: locale=='en'?'dd MMM, yyyy hh:mm:ss':'dd MMMM M, yyyy hh:mm:ss'
      },
      { dataField : 'accountbalance',
        caption: formatMessage('tbalance'),
        allowEditing: false,
        width: 110
      },
      { dataField : 'status',
        caption: formatMessage('status'),
        width: 180,
        lookup: {
            dataSource: esmsstatusSource,
            valueExpr: "status",
            displayExpr: "statext"
        }
      },
      { dataField : 'errorcode',
        caption: formatMessage('resultSMS'),
        width: 230,
        lookup: {
            dataSource: esmsSource,
            valueExpr: "status",
            displayExpr: "statext"
        }
      },
      { dataField : 'sendStatus',
        caption: formatMessage('sentresult'),
        width: 110
      }
    ],

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
