$(() => {
  DevExpress.config({ defaultCurrency: 'VND' });
  $('#pagetitle').html(`${formatMessage('balancesheet')}`);
  var roleID = $('#roleid').text();
  var divisionID = $('#divisionid').text();
  var parentGroupID = $('#groupid').text();
  var lang = getLocale();

    var yeargroup = [];
    var curyear = new Date().getFullYear();
    var curyearend = `${curyear}-12-31`;
    yeargroup.push({status: `${curyear}-12-31`, statext:`${formatMessage('financialyear')}: ${curyear}`});
    yeargroup.push({status: `${curyear-1}-12-31`, statext:`${formatMessage('financialyear')}: ${curyear-1}`});
    yeargroup.push({status: `${curyear-2}-12-31`, statext:`${formatMessage('financialyear')}: ${curyear-2}`});
    yeargroup.push({status: `${curyear-3}-12-31`, statext:`${formatMessage('financialyear')}: ${curyear-3}`});
    yeargroup.push({status: `${curyear-4}-12-31`, statext:`${formatMessage('financialyear')}: ${curyear-4}`});

//***************************************************** */
const URL = ''; 
const tbl = "account";
const primekey = "accountID";
const memberStore = new DevExpress.data.CustomStore({
    key: primekey,
    load() {
        return sendRequest(`${URL}/getBalanceSheet/${curyearend}`);
    }
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
    rowAlternationEnabled: false,
    columns: [
        {   dataField: 'accountID',
            caption: formatMessage('id'),
            allowEditing: false,
            width: 80,
        },
        {
            dataField: 'grandparentName',
            caption: '',
            groupIndex: 0,
            sortIndex: 0, 
            sortOrder: "asc"
        },

        {   dataField: 'parentName',
            caption: '',
            groupIndex: 1,
            sortIndex: 1, 
            sortOrder: "asc",
        },
        {   dataField: `accountName_${lang}`,
            caption: formatMessage('accountname'),
            allowEditing: false,
        },
        {   dataField: 'accountName_en',
            caption: 'Account Name',
            allowEditing: false,
            sortIndex: 2, 
            sortOrder: "asc"
        },
        {   dataField: 'balance',
            caption: '.',
            allowEditing: false,
            width: 300,
            format: {
                type: 'currency',
                precision: 0  
            } 
        },
        {   dataField: 'balancex',
            caption: '.',
            alignment: 'right',
            allowEditing: false,
            width: 120,
            format: {
                type: 'currency',
                precision: 0  
            } 
        },
        {   dataField: 'balancey',
            caption: '.',
            allowEditing: false,
            width: 120,
            format: {
                type: 'currency',
                precision: 0  
            } 
        },
    ],
    toolbar: {
        items: [
            {
              location: 'before',
              widget: 'dxSelectBox',
              options: {
                width: 225,
                items: yeargroup,
                displayExpr: 'statext',
                valueExpr: 'status',
                value: curyearend,
                onValueChanged(e) {
                    console.log(e.value)
                    curyearend = e.value;
                    grid.refresh();
                },
              },
            }, {
                name: 'searchPanel'
            }
        ]
    },
    summary: {
        groupItems: [{
          name: 'balanceTotal',
          showInColumn: 'balance',  
          summaryType: 'custom',
          showInGroupFooter: true,
          valueFormat: "currency",
          displayFormat: `${formatMessage('total')}: {0}`
        }],
        calculateCustomSummary(options) {
            if (options.name === 'balanceTotal') {
              if (options.summaryProcess === 'start') {
                options.totalValue = 0;
              }
              if (options.summaryProcess === 'calculate') {
                  options.totalValue += options.value.balance;
              }
            }
        }
    },
    customizeColumns: function(columns) {
        for (var i = 0; i < columns.length; i++) {
            columns[i].groupCellTemplate = function(cellElement, cellInfo) {
                $("<span class='px-4 text-dark'>").text(cellInfo.text).appendTo(cellElement);
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
        var gridx = e.component;  
        gridx.option('loadPanel.enabled', false);
        var selection = gridx.getSelectedRowKeys();  
        if(selection.length == 0) {  
            gridx.selectRowsByIndexes([0]);  
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
