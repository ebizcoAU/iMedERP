$(() => {
  DevExpress.config({ defaultCurrency: 'VND' });
  const pagetitle = $('#pagetitlex').text();
  if (pagetitle == 'walletxchange') $('#pagetitle').html(`${formatMessage('walletxchange')}`)
  else if (pagetitle == 'checkwallet') $('#pagetitle').html(`${formatMessage('checkwallet')}`);
  //**************************/
  var parentGroupID = $('#groupid').text();
  var roleID = $('#roleid').text();
  var accountID = $('#accountID').text();
  var totalCredit, totalDebit;

  console.log("parentGroupID: " + parentGroupID)
  const URL = ''; 
  const tbl = "wallet";
  const primekey = "walletID";
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
      return sendRequestARG(`${URL}/walletlist/${accountID}`, 'POST', args);  
      
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
  const grid = $('#profileContainer').dxDataGrid({
    dataSource: memberStore,
    allowColumnReordering: true,
    allowColumnResizing: true,
    columnAutoWidth: true,
    showBorders: true,
    remoteOperations: true,
    wordWrapEnabled: true,
    paging: {
      pageSize: 22,
    },
    pager: {
      showPageSizeSelector: true,
      allowedPageSizes: [22, 26, 30],
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
      allowUpdating:  ((parentGroupID > 1) && (((divisionID==1) && (roleID==1)) || ((roleID==2)&&(divisionID==2))))?true:false,
      allowAdding: false,
      allowDeleting:  ((parentGroupID > 1) && (((divisionID==1) && (roleID==1)) || ((roleID==2)&&(divisionID==2))))?true:false,
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
      { dataField: 'walletID',
        caption: formatMessage('id')+'#',
        width: 100,
        allowEditing: false,
        visible: true
      },
      { dataField : 'memberName',
        caption: formatMessage('name'),
        allowEditing: false,
        width: 180
      },
      { dataField : 'memberPhone',
        caption: formatMessage('contactphone'),
        allowEditing: false,
        width: 110
      },
      { dataField : 'roleIDx',
        caption: formatMessage('role'),
        allowEditing: false,
        width: 140,
        lookup: {
            dataSource: roleSource,
            valueExpr: "status",
            displayExpr: "statext"
        }
      },
      { dataField: 'debit',
        caption: formatMessage('debitx'),
        width: 120,
        allowEditing: false,
        format: {
            type: 'currency',
            precision: 0  
          }  
      },   
      { dataField: 'credit',
        caption: formatMessage('creditx'),
        width: 120,
        allowEditing: false,
        format: {
            type: 'currency',
            precision: 0  
          }  
      },
      { dataField: 'paytype',
        caption: formatMessage('paytype'),
        width: 140,
        allowEditing: false,
        lookup: {
            dataSource: paySource,
            valueExpr: "status",
            displayExpr: "statext"
        }
      },
      { dataField: 'refID',
        caption: formatMessage('reference'),
        width: 240,
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
      { dataField: 'lastChanged',
        caption: formatMessage('lastchanged'),
        dataType: 'date',
        width: 140,
        allowEditing: false,
        visible:false,
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
        width: 110,
        lookup: {
            dataSource: orderxSource,
            valueExpr: "status",
            displayExpr: "statext"
        }
      },
      { type: 'buttons',
        width: 90,
        buttons: ['edit', 'delete'],
      },
    ],
    summary: {
      totalItems: [{
          column: 'debit',
          summaryType: 'sum',
          valueFormat: 'currency', 
          customizeText: function (data) {
              console.log(data)
              totalDebit = data.value.debit;
              totalCredit = data.value.credit;
              let totalTxt = `${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalDebit)}`;
              return `${totalTxt}`; 
          }
      }, {    
          column: 'credit',
          summaryType: 'sum',
          valueFormat: 'currency', 
          customizeText: function (data) {
              let totalTxt = `${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalCredit)}`;
              return `${totalTxt}`; 
          }
      }]
    },
    onContentReady(e) {
      //console.log('totalDebit: ' + totalDebit + ', totalCredit: ' + totalCredit)
      var tBalance = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalCredit - totalDebit);
      if (accountID >0) $('#summary').html(`<b>${formatMessage('tbalance')}: &nbsp;&nbsp;&nbsp;&nbsp; ${tBalance}</b>`);
    },
    onRowRemoving: function(e) {
      e.cancel = e.data['status'] > 1?true:false ;
    },
    onRowDblClick(e) {
        if (e.key !== 0) {
          if (e.data.saleID > 0) {
            console.log(JSON.stringify(e.data,false,4))
            window.location = `/salecart_${e.data.saleID}`;
          }
        }
    },
    onRowPrepared: function(e) {
      if (e.rowType === "data") {
          if ((e.data.status == 1) && (e.data.debit > 0)) {
              e.rowElement.css({"color":"#333333", "background-color":"#BB8855"});
          } else if ((e.data.status == 1) && (e.data.credit > 0)) {
              e.rowElement.css({"color":"#CCCCCC", "background-color":"#BB2222"});
          } else if (e.data.status == 2) {
            e.cancel = true
          }
      }
    },
    onEditingStart: function(e) {
        if (e.data.status == 2) {
          e.cancel= true
        } else if ((e.data.paytype == 1) && (e.data.debit > 0)) {
          e.cancel= true
        } else if ((roleID==1) && (e.data.status == 1) && (e.data.credit > 0)) {
          e.cancel= true
        }
    }
    
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
