

$(() => {
  var asid = $('#agentstaffid').text();
  //****** label header ******/
  $('#pagetitle').html(`${formatMessage('servicerating')}`);
  //**************************/
  
  var roleID = $('#roleid').text();
  var gid = 0;
  var mode = 'new';
  var oldData = {};
  const URL = ''; 
  const tbl = "sale";
  const primekey = "saleID";
  const memberStore = new DevExpress.data.CustomStore({
    key: primekey,
    load() {
      return sendRequest(`${URL}/rating/${asid}`, 'POST');
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
      allowUpdating: (($('#groupid').text()>1) && (roleID==1))?true:false, 
      allowAdding: (($('#groupid').text()>1) && (roleID==1))?true:false,  
      allowDeleting: (($('#groupid').text()>1) && (roleID==1))?true:false, 
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
      { dataField: 'saleID',
        caption: formatMessage('id'),
        width: 80,
      },
      { dataField: 'customerName',
        caption: formatMessage('name'),
        width: 160,
      },
      { dataField: 'phone',
        validationRules: [{ type: 'required' }],
        visible: true,
        width: 110
      },
      { dataField: 'comment',
        caption: formatMessage('comment'),
      },
      { dataField: 'starx',
        caption: formatMessage('servicerating'),
        width: 200,
        calculateCellValue: function(rowData) {
          return rowData.star;
        },
        cellTemplate: cellTemplate,
      },
      { dataField: 'dateAdded',
        caption: formatMessage('dateadded'),
        dataType: 'date',
        width: 160,
        allowEditing: false, 
        format: locale=='en'?'dd MMM, yyyy':'dd MMMM M, yyyy'
      },
      { dataField : 'status',
        caption: formatMessage('status'),
        visible: true,
        allowEditing: (($('#groupid').text()>1) && (roleID==1))?true:false, 
        width: 90,
        lookup: {
            dataSource: statusSource,
            valueExpr: "status",
            displayExpr: "statext"
        }
      },
      { type: 'buttons',
        width: 80,
        buttons: ['edit', 'delete']
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
        gid = data.groupID;
      }
    },
    onEditingStart(e) {
      gid = e.data.groupID;
      mode = 'edit';  
    },
    onRowUpdating(e) {
      oldData = e.oldData;
    },
    onInitNewRow() {
      mode = 'new';
    }
    
  }).dxDataGrid('instance');

  function cellTemplate(container, options) {
    console.log(options.value)

    let imgElement = document.createElement("div");
    imgElement.classList.add("d-flex", "justify-content-between", "align-items-center");
    let imgStar0 = document.createElement("div");
    imgStar0.className="ratings";
    for (var x=0; x< options.value; x++) {
        let imgStar1 = document.createElement("i");
        imgStar1.classList.add("fa", "fa-star", "rating-color");
        imgStar0.append(imgStar1);
    }
    
    imgElement.append(imgStar0);
    container.append(imgElement);

  
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
            totalCount: result.totalCount
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
