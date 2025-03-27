$(() => {
  var parentGroupID = $('#groupid').text();
  var roleID = $('#roleid').text();
  //****** label header ******/
  $('#pagetitle').html(`${formatMessage('symptom')}`); 
 
  //**************************/
  console.log("parentGroupID: " + parentGroupID  +', roleID: '+ roleID )
  var gid = 0;
  var mode = 'new';
  const URL = ''; 
  const tbl = "symptom";
  const primekey = "symptomID";
  const memberStore = new DevExpress.data.CustomStore({
    key: primekey,
    load() {
      return sendRequest(`${URL}/symptom/${parentGroupID}`);
    },
    insert(values) {
        console.log(JSON.stringify(values,false,4))
        values.groupID = parentGroupID;
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
      pageSize: 20,
    },
    pager: {
      showPageSizeSelector: true,
      allowedPageSizes: [20,24],
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
      allowUpdating: ((parentGroupID>1) && ((roleID==6) || ((divisionID==1) && (roleID==1))))?true:false,
      allowAdding:  ((parentGroupID>1) && ((roleID==6) || ((divisionID==1) && (roleID==1))))?true:false, 
      allowDeleting:  ((parentGroupID>1) && ((roleID==6) || ((divisionID==1) && (roleID==1))))?true:false,
      useIcons: true,
      popup: {
        title: formatMessage('category'),
        showTitle: true,
        width: 820,
        height: 550,
      },
      form: {
        labelMode: 'floating',
        items: [{
          itemType: 'group',
          cssClass: 'first-group',
          colCount: 4,
          colSpan: 2,
          items: [{
            itemType: 'group',
            colSpan: 4,
            items: [{
              dataField: 'symptomName',
            }, {
              dataField: 'description',
              editorType: 'dxTextArea',
              colSpan: 2,
              editorOptions: {
                height: 80,
              },  
            
            }],
          }],
        }, {
          itemType: 'group',
          cssClass: 'second-group',
          colCount: 2,
          colSpan: 2,
          items: [{
            itemType: 'group',
            items: [{
              dataField: 'specialdiscount',
            }, {
              dataField: 'dateAdded',
            }, {
              dataField: 'lastChanged',
            }],
          }, {
            itemType: 'group',
            items: [{
              dataField: 'taxrate',
            }, {
              dataField: 'lastpersonName', 
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
      { dataField: 'symptomName',
        caption: formatMessage('name'),
        validationRules: [{ type: 'required' }],
        width: 270
      },
      { dataField: 'description',
        calculateDisplayValue: function(rowData) {
            return  rowData.description.substring(0,56);
        },
        caption: formatMessage('description'),
      },
      { dataField: 'lastpersonName',
        caption: formatMessage('lastperson'),
        width: 140,
        allowEditing: false, 
        visible: true
        },
      { dataField: 'dateAdded',
        caption: formatMessage('dateadded'),
        dataType: 'date',
        width: 160,
        allowEditing: false, 
        format: locale=='en'?'dd MMM, yyyy':'dd MMMM M, yyyy'
      },
      { dataField: 'lastChanged',
        caption: formatMessage('lastchanged'),
        dataType: 'date',
        width: 160,
        allowEditing: false, 
        format: locale=='en'?'dd MMM, yyyy':'dd MMMM M, yyyy'
      },
      { dataField : 'status',
        caption: formatMessage('status'),
        width: 90,
        lookup: {
            dataSource: statusSource,
            valueExpr: "status",
            displayExpr: "statext"
        }
      },
      { type: 'buttons',
        width: 80,
        buttons: ['edit', 'delete'],
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
    onSelectionChanged(selectedItems) {
      const data = selectedItems.selectedRowsData[0];
      if (data) {
        //console.log(JSON.stringify(data,false,4))
        gid = data.groupID;
        subdir = data.subdir; 
      }
    },
    onEditingStart(e) {
      console.log("e: " + e.data.groupID + " /" + e.data.subdir)
      gid = e.data.groupID;
      subdir = e.data.subdir;    
      mode = 'edit';  
    },
    onInitNewRow() {
      mode = 'new';
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
        console.log(JSON.stringify(result, false, 4))
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
