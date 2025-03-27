$(() => {
  DevExpress.config({ defaultCurrency: 'VND' });
  $('#pagetitle').html(`${formatMessage('accountlist')}`);
  var roleID = $('#roleid').text();
  var divisionID = $('#divisionid').text();
  var parentGroupID = $('#groupid').text();
  var lang = getLocale();

//***************************************************** */





//***************************************************** */
const URL = ''; 
const tbl = "account";
const primekey = "accountID";
const memberStore = new DevExpress.data.CustomStore({
    key: primekey,
    load() {
        return sendRequest(`${URL}/getPLAccount/2/0`);
    },
    insert(values) {
        console.log(JSON.stringify(values,false,4));
        values[`groupID`] = parentGroupID;
        values[`PLEnabled`] = 1;
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
        pageSize: 64,
    },
    pager: {
        allowedPageSizes: [64, 80],
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
        allowUpdating: ((parentGroupID > 1) && (((divisionID==1) && (roleID==1)) || ((roleID=2)&&(divisionID==2))))?true:false,
        allowAdding: false,
        allowDeleting: ((parentGroupID > 1) && (((divisionID==1) && (roleID==1)) || ((roleID=2)&&(divisionID==2))))?true:false,
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
        calculateCellValue: function(rowData) {
            return rowData.parentName +'_'+ rowData.parentID;
        },
        
    },
    {   dataField: `accountName_${lang}`,
        caption: formatMessage('accountname'),
        width: 400,
        sortIndex: 2, 
        sortOrder: "asc"
    },
    { dataField: 'accountName_en',
        caption: 'Account Name',
        width: 400,
        
    },
    { dataField : 'status',
        caption: formatMessage('status'),
        width: 140,
        lookup: {
            dataSource: statusSource,
            valueExpr: "status",
            displayExpr: "statext"
        }
    },
    { type: 'buttons',
        width: 90,
        buttons: ['edit', 'delete'],
    }],
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
