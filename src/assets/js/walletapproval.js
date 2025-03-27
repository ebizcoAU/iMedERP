$(() => {
  DevExpress.config({ defaultCurrency: 'VND' });
  $('#pagetitle').html(`${formatMessage('walletapproval')}`);
  
 
//************************************************ */
$("#confirmButton").dxButton({
  text: formatMessage('confirm'),
  type: 'success',
  onClick: function() {
    var myDialog = DevExpress.ui.dialog.custom({
      title: formatMessage('confirmtoproceed'),
      messageHtml: `<b>${formatMessage('proceedtocomplete')}</b>`,
      buttons: [{
          text: formatMessage('yes'),
          onClick: function(e) {
              return { buttonText:'Y'  }
          }
        }, {
          text: formatMessage('no'),
          onClick: function(e) {
              return { buttonText: 'N'}
          }
        } 
      ]
    });
    myDialog.show().done(function(dialogResult) {
        if (dialogResult.buttonText == 'Y') {
          $.ajax({
            url: `/approvedwallet`,
            method: "POST",
            data: {
            },
            dataType: "json",
            success: function(data) {
                if (data.status == 0) {
                  grid.refresh();
                  grid2.refresh();
                } else {
                  const message = formatMessage("errorupdating");
                  const type = 'warning';
                  toast.option({ message , type });
                  toast.show(); 
                }
            },
            error: function() {
              const message = formatMessage("errorupdating");
              const type = 'warning';
              toast.option({ message , type });
              toast.show(); 
            },
            timeout: 5000
        });
        }
    });
  } 
});

 //**************************/
 var parentGroupID = $('#groupid').text();
 var roleID = $('#roleid').text();
 console.log("parentGroupID: " + parentGroupID)
 const URL = ''; 
 const tbl = "wallet";
 const primekey = "";
 const memberStore = new DevExpress.data.CustomStore({
   key: primekey,
   load(loadOptions) {
     return sendRequest(`${URL}/walletapproval/0`, 'POST');  
   }
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
    scrolling: {
      rowRenderingMode: 'virtual',
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
      { dataField : 'memberName',
        caption: formatMessage('name'),
        allowEditing: false,
        sortIndex: 1, 
        sortOrder: "asc", 
      },
      { dataField : 'Qty',
        caption: formatMessage('qty'),
        allowEditing: false,
        width: 100,
      },  
      { dataField : 'creditx',
        caption: formatMessage('creditx'),
        allowEditing: false,
        width: 200,
        format: {
          type: 'currency',
          precision: 0  
        }  
      },  
      { dataField: 'dateAdded',
        caption: formatMessage('dateadded'),
        dataType: 'date',
        width: 160,
        sortIndex: 0, 
        sortOrder: "desc", 
        allowEditing: false,
        visible: true,
        groupIndex: 0,
        format: locale=='en'?'dd MMM, yyyy':'dd MMMM M, yyyy'
      }
    ],
    summary: {
      groupItems: [{
        column: 'qty',
        summaryType: 'sum',
        displayFormat: `{0} ${formatMessage('productactivate')}`,
      }, {
        column: 'creditx',
        summaryType: 'sum',
        valueFormat: 'currency',
        showInGroupFooter: true,
        alignByColumn: true,
        displayFormat: `{0}`,
      }],
      totalItems: [{
        column: 'creditx',
        summaryType: 'sum',
        displayFormat: `${formatMessage('totaldaily')}: {0}`,
        valueFormat: 'currency',
      }],
    },
    grouping: {
      texts: {
        groupContinuesMessage: formatMessage('continuesnextpage')
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
    onRowRemoving: function(e) {
      e.cancel = e.data['status'] > 1?true:false ;
    },
    
  }).dxDataGrid('instance');
/******************************************************** */
  const memberStore2 = new DevExpress.data.CustomStore({
  key: primekey,
  load(loadOptions) {
    return sendRequest(`${URL}/walletapproval/1`, 'POST');  
  }
  });
//******************************************************* */
  const grid2 = $('#profileContainer2').dxDataGrid({
    dataSource: memberStore2,
    allowColumnReordering: true,
    allowColumnResizing: true,
    columnAutoWidth: true,
    showBorders: true,
    remoteOperations: false,
    wordWrapEnabled: true,
    scrolling: {
      rowRenderingMode: 'virtual',
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
      { dataField : 'productName',
        caption: formatMessage('product'),
        allowEditing: false,
        sortIndex: 1, 
        sortOrder: "asc", 
      },
      { dataField : 'Qty',
        caption: formatMessage('qty'),
        allowEditing: false,
        width: 100,
      },  
      { dataField: 'dateAdded',
        caption: formatMessage('dateadded'),
        dataType: 'date',
        width: 160,
        sortIndex: 0, 
        sortOrder: "desc", 
        allowEditing: false,
        visible: true,
        groupIndex: 0,
        format: locale=='en'?'dd MMM, yyyy':'dd MMMM M, yyyy'
      }
    ],
    summary: {
      groupItems: [{
        column: 'Qty',
        summaryType: 'sum',
        showInGroupFooter: true,
        alignByColumn: true,
        displayFormat: `{0}`,
      }],
      totalItems: [{
        column: 'Qty',
        summaryType: 'sum',
        displayFormat: `${formatMessage('total')}: {0}`,
      }],
    },
    grouping: {
      texts: {
        groupContinuesMessage: formatMessage('continuesnextpage')
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
    onRowRemoving: function(e) {
      e.cancel = e.data['status'] > 1?true:false ;
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
        console.log(JSON.stringify(result, false, 4))
        d.resolve(result);
      
    }).fail((xhr) => {
      d.reject(xhr.responseJSON ? xhr.responseJSON.Message : xhr.statusText);
    });

    return d.promise();
  }

});
