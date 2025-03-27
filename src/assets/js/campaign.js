$(() => {
  DevExpress.config({ defaultCurrency: 'VND' });
  $('#pagetitle').html(`${formatMessage('campaign')}`);
  //**************************/
  var parentGroupID = $('#groupid').text();
  var roleID = $('#roleid').text();
  console.log("parentGroupID: " + parentGroupID)
  var gid = 0;
  var mode = 'new';
  const URL = ''; 
  const tbl = "product";
  const primekey = "productID";
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
    return sendRequestARG(`${URL}/campaignlist`, 'POST', args);
    },
    update(key, values) {
      console.log(JSON.stringify(values, false, 4))
      values[`${primekey}`] = key;
      return sendRequest(`${URL}/update/${tbl}`, 'POST', {
        data:  JSON.stringify(values)
      });
    }
  });

  //************************************************ */
  var promoteDataSource = {  
    store: new DevExpress.data.CustomStore({
      key: "promoteID",
      loadMode: "raw",
      load: function() {
          return $.getJSON(`${URL}/promotion/${parentGroupID}`);
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
    remoteOperations: true,
    wordWrapEnabled: true,
    paging: {
      pageSize: 7,
    },
    pager: {
      showPageSizeSelector: true,
      allowedPageSizes: [7, 10, 12],
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
      allowUpdating: ((parentGroupID > 1) && ((divisionID==1) && (roleID==1)))?true:false,
      allowAdding: ((parentGroupID > 1) && ((divisionID==1) && (roleID==1)))?true:false,
      allowDeleting: ((parentGroupID > 1) && ((divisionID==1) && (roleID==1)))?true:false,
      useIcons: true
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
      { dataField: 'imgLinkx',
        caption: `.`,
        width: 115,
        allowSearch: false,
        allowSorting: false,
        calculateCellValue: function(rowData) {
          return rowData.subdir +'/'+ rowData.imgLink;
        },
        allowEditing: false, 
        cellTemplate: cellTemplate,
      },
      { dataField: 'productName',
        caption: formatMessage('name'),
        allowEditing: false
      },
      { dataField : 'promotionID',
          caption: formatMessage('promotion'),
          width: 140,
          lookup: {
            dataSource: promoteDataSource,
            valueExpr: "promotionID",
            displayExpr: "name"
          }
      },
      { dataField: 'customerBonus',
        caption: formatMessage('customerbonus'),
        dataType: "number",
        format: {
          type: 'fixedPoint',
          precision: 0  
        },  
        width: 75
      },
      { dataField: 'agentstaffBonus',
        caption: formatMessage('agentstaffbonus'),
        dataType: "number",
        format: {
          type: 'fixedPoint',
          precision: 0  
        },  
        width: 75
      },
      { dataField: 'agentBonus',
        caption: formatMessage('agentbonus'),
        dataType: "number",
        format: {
          type: 'fixedPoint',
          precision: 0  
        },  
        width: 75
      },
      { dataField: 'diststaffBonus',
        caption: formatMessage('diststaffbonus'),
        dataType: "number",
        format: {
          type: 'fixedPoint',
          precision: 0  
        },  
        width: 75
      },
      { dataField: 'unitPrice',
        caption: formatMessage('unitprice'),
        format: {
            type: 'currency',
            precision: 0  
        },
        allowEditing: false,
        width: 100    
      },
      { dataField: 'startDate',
        caption: formatMessage('fromdate'),
        dataType: 'date',
        width: 160,
        allowEditing: false,
        format: locale=='en'?'dd MMM, yyyy':'dd MMMM M, yyyy'
      },
      { dataField: 'endDate',
        caption: formatMessage('todate'),
        dataType: 'date',
        width: 160,
        allowEditing: false,
        format: locale=='en'?'dd MMM, yyyy':'dd MMMM M, yyyy'
      },
      { dataField: 'lastChanged',
        caption: formatMessage('lastchanged'),
        dataType: 'date',
        width: 140,
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
        console.log(JSON.stringify(data,false,4))
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
    onRowDblClick(e) {
        if (e.key !== 0) {
            console.log(JSON.stringify(e.data,false,4))
            window.location = `/product_${e.data.brandID}_0`;
        }
    }
    
  }).dxDataGrid('instance');

  function cellTemplate(container, options) {
    var backendURL = `public/`;
    let imgElement = document.createElement("img");
    let imagepath = `${backendURL}logoblank.png`;
    console.log("options.value: " + options.value);

    if ((options.value.split("/")[1] !== 'undefined') && (options.value.split("/")[1].length > 0)) {
      imagepath =  `${backendURL}${options.value}`;
    }
    console.log("imagepath: " + imagepath);
    
    imgElement.setAttribute('src',`${imagepath}`);
    
    imgElement.setAttribute("width", `100`);
    imgElement.setAttribute("height", `100`);
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
