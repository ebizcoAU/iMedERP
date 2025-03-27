$(() => {
  DevExpress.config({ defaultCurrency: 'VND' });
  $('#pagetitle').html(`${formatMessage('accountinit')}`);
  var roleID = $('#roleid').text();
  var divisionID = $('#divisionid').text();
  var parentGroupID = $('#groupid').text();
  var lang = getLocale();

//***************************************************** */

var accountDataSource = {  
    store: new DevExpress.data.CustomStore({
      key: "accountID",
      loadMode: "raw",
      load: function() {
        return sendRequest(`${URL}/getNonPLAccount`);
       }
    }) 
  }  


//***************************************************** */
const URL = ''; 
const tbl = "accinit";
const primekey = "accinitID";
const memberStore = new DevExpress.data.CustomStore({
    key: primekey,
    load() {
        return sendRequest(`${URL}/getAccInit`, 'POST');
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


const grid = $('#profileContainer').dxDataGrid({
    dataSource: memberStore,
    allowColumnReordering: true,
    allowColumnResizing: true,
    columnAutoWidth: true,
    showBorders: true,
    remoteOperations: false,
    wordWrapEnabled: true,
    paging: {
        pageSize: 48,
    },
    pager: {
        showPageSizeSelector: true,
        allowedPageSizes: [48, 60],
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
        allowUpdating: ((parentGroupID>1) && ((roleID==6) || ((divisionID==1) && (roleID==1))))?true:false,
        allowAdding: ((parentGroupID>1) && ((roleID==6) || ((divisionID==1) && (roleID==1))))?true:false,
        allowDeleting:((parentGroupID>1) && ((roleID==6) || ((divisionID==1) && (roleID==1))))?true:false,
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
    {   dataField: 'accinitID',
        caption: formatMessage('id'),
        allowEditing: false,
        width: 80,
    },
    {   dataField : 'accountID',
        caption: formatMessage('account') + ' *',
        allowFiltering: false,
        lookup: {
            dataSource: accountDataSource,
            valueExpr: "accountID",
            displayExpr: `accountName_${lang}`
        }
    },   
    { dataField: 'accountName_en',
        caption: 'Account Name',
        allowEditing: false,
        width: 240,
       
    },
    { dataField: 'initbalance',
        caption: formatMessage('initbalance'),
        width: 240,
        format: {
            type: 'currency',
            precision: 0  
          } 
    },
    { dataField: 'dateAdded',
        caption: formatMessage('dateadded'),
        alignment: 'right',
        dataType: 'date',
        width: 140,
        allowEditing: false,
        format: locale=='en'?'dd MMM, yyyy ':'dd/MM/yyyy '
    },
    { dataField: 'lastChanged',
        caption: formatMessage('lastchanged'),
        dataType: 'date',
        width: 120,
        allowEditing: false,
        format: locale=='en'?'dd MMM, yyyy ':'dd/MM/yyyy '
    },
    { dataField: 'lastpersonName',
        caption: formatMessage('lastperson'),
        width: 120,
        allowEditing: false,
    },
    { type: 'buttons',
        width: 110,
        buttons: ['edit', 'delete',
            
        ],
    },
    ],
    summary: {
        groupItems: [{
          name: 'initTotal',
          showInColumn: 'initbalance',  
          summaryType: 'custom',
          showInGroupFooter: true,
          valueFormat: "currency",
          displayFormat: `${formatMessage('total')}: {0}`
        }],
        calculateCustomSummary(options) {
            if (options.name === 'initTotal') {
              if (options.summaryProcess === 'start') {
                options.totalValue = 0;
              }
              if (options.summaryProcess === 'calculate') {
                  options.totalValue += options.value.initbalance;
              }
            }
        }
    },
    customizeColumns: function(columns) {
        for (var i = 0; i < columns.length; i++) {
            columns[i].groupCellTemplate = function(cellElement, cellInfo) {
                if (cellInfo.text.split('_').length > 1) {
                    if ((parentGroupID > 1) && ((roleID == 1) || ((roleID=2)&&(divisionID==2)))) {
                        $("<span class='px-4 text-dark'>").text(cellInfo.text).appendTo(cellElement);
                        $("<div>").appendTo(cellElement).dxButton({
                            icon: 'plus',
                            type: 'info',
                            onClick: function(e) {
                                var initValues = {
                                    'parentID': cellInfo.text.split('_')[1]
                                };
                                cellInfo.component.__initValues = initValues;
                                cellInfo.component.addRow();
                            }
                        });
                    } else {
                        $("<span>").text(cellInfo.text).appendTo(cellElement);
                    }
                } else {
                    $("<span>").text(cellInfo.text).appendTo(cellElement);
                }
            }
        }
    },
    onInitNewRow: function(e) {
        if (e.component.__initValues) {
          for (var prop in e.component.__initValues) {
              e.data[prop] = e.component.__initValues[prop];  
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

  function isNotEmpty(value) {
    return value !== undefined && value !== null && value !== '';
  }


});
