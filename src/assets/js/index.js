$(() => {
  $('#pagetitle').html(`${formatMessage('siteactivity')} - ${formatMessage('siteactivity1')}`);
  var constat = JSON.parse($('#constat').text());
  var productstat = JSON.parse($('#productstat').text());

  //console.log(JSON.stringify(constat, false, 4))
  $('#distributorNo').html('0');
  $('#diststaffNo').html('0');
  $('#agentNo').html(parseInt(constat.filter(f => f.roleID === 6)[0].total).toLocaleString("en-US"));
  $('#agestaffNo').html(parseInt(constat.filter(f => f.roleID === 7)[0].total).toLocaleString("en-US"));
  $('#manufacturerNo').html('0');
  $('#manstaffNo').html('0');
  $('#customerNo').html(parseInt(constat.filter(f => f.roleID === 3)[0].total).toLocaleString("en-US"));

  $('#brandNo').html('0');
  $('#productNo').html(parseInt(productstat[0].total).toLocaleString("en-US"));
  $('#warehouseNo').html('0');
  $('#palletNo').html('0');
  $('#boxNo').html('0');
  $('#proditemNo').html('0');

  $('#top10category').html(`${formatMessage('top10category')}`);
  $('#top10agent').html(`${formatMessage('top10agent')}`);
  $('#top10agentstaff').html(`${formatMessage('top10agentstaff')}`);
  $('#top10products').html(`${formatMessage('top10products')}`);

  var groupID = $('#groupid').text();
  var subdir = $('#subdir').text();
  const URL = ''; 
  
  

//************************************************ */
  var parentGroupID = $('#groupid').text();
  var roleID = $('#roleid').text();
  
  const memberStore = new DevExpress.data.CustomStore({
    key: 'memberx',
    load(loadOptions) {
        return sendRequest(`${URL}/top10category`, 'GET');
    }
  });
  const grid0 = $('#categoryContainer').dxDataGrid({
    dataSource: memberStore,
    allowColumnReordering: true,
    allowColumnResizing: true,
    columnAutoWidth: true,
    showBorders: true,
    remoteOperations: false,
    showColumnHeaders: false,
    wordWrapEnabled: true,
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
      { dataField: 'idx',
        caption: '#',
        width: 35,
        allowEditing: false
      },
      { dataField: 'imgLinkx',
          caption: `.`,
          width: 55,
          allowSorting: false,
          calculateCellValue: function(rowData) {
            return rowData.subdir +'/'+ rowData.imgLink;
          },
          allowEditing: false, 
          cellTemplate: cellTemplate,
      },
      { dataField : 'name',
        caption: formatMessage('diststaff'),
        allowSorting: false,
      },
      { dataField: 'subtotal',
        caption: formatMessage('qty'),
        width: 60,
        allowEditing: false,
        format: {
          type: 'fixedPoint',
          precision: 0  
        }
      }
    ]
    
  }).dxDataGrid('instance');

  function cellTemplate(container, options) {
    var backendURL = `public/`;
    let imgElement = document.createElement("img");
    let imagepath = `${backendURL}logoblank.png`;
    //console.log("options.value: " + options.value);

    if ((options.value.split("/")[1] !== 'undefined') && (options.value.split("/")[1].length > 0)) {
      imagepath =  `${backendURL}${options.value}`;
    }
    //console.log("imagepath: " + imagepath);
    
    imgElement.setAttribute('src',`${imagepath}`);
    
    imgElement.setAttribute("width", `40`);
    imgElement.setAttribute("height", `40`);
    container.append(imgElement);
  }
//************************************************ */
const memberStore1 = new DevExpress.data.CustomStore({
  key: 'memberID',
  load(loadOptions) {
      return sendRequest(`${URL}/top10agent`, 'GET');
  }
});
const grid1 = $('#agentContainer').dxDataGrid({
  dataSource: memberStore1,
  allowColumnReordering: true,
  allowColumnResizing: true,
  columnAutoWidth: true,
  showBorders: true,
  remoteOperations: false,
  showColumnHeaders: false,
  wordWrapEnabled: true,
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
    { dataField: 'idx',
      caption: '#',
      width: 35,
      allowEditing: false
    },
    { dataField: 'imgLinkx',
        caption: `.`,
        width: 55,
        allowSorting: false,
        calculateCellValue: function(rowData) {
          return rowData.subdir +'/'+ rowData.imgLink;
        },
        allowEditing: false, 
        cellTemplate: cellTemplate,
    },
    { dataField : 'name',
      caption: formatMessage('agent'),
      allowSorting: false,
    },
    { dataField: 'subtotal',
      caption: formatMessage('qty'),
      width: 60,
      allowEditing: false,
      format: {
        type: 'fixedPoint',
        precision: 0  
      }
    }
  ]
}).dxDataGrid('instance');

//************************************************ */
const memberStore2 = new DevExpress.data.CustomStore({
  key: 'memberID',
  load(loadOptions) {
      return sendRequest(`${URL}/top10agentstaff`, 'GET');
  }
});
const grid2 = $('#agentstaffContainer').dxDataGrid({
  dataSource: memberStore2,
  allowColumnReordering: true,
  allowColumnResizing: true,
  columnAutoWidth: true,
  showBorders: true,
  remoteOperations: false,
  showColumnHeaders: false,
  wordWrapEnabled: true,
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
    { dataField: 'idx',
      caption: '#',
      width: 35,
      allowEditing: false
    },
    { dataField: 'imgLinkx',
        caption: `.`,
        width: 55,
        allowSorting: false,
        calculateCellValue: function(rowData) {
          return rowData.subdir +'/'+ rowData.imgLink;
        },
        allowEditing: false, 
        cellTemplate: cellTemplate,
    },
    { dataField : 'name',
      caption: formatMessage('agestaff'),
      allowSorting: false,
    },
    { dataField: 'subtotal',
      caption: formatMessage('qty'),
      width: 60,
      allowEditing: false,
      format: {
        type: 'fixedPoint',
        precision: 0  
      }
    }
  ]
  
}).dxDataGrid('instance');


//************************************************ */
const memberStore3 = new DevExpress.data.CustomStore({
  key: 'productID',
  load(loadOptions) {
      return sendRequest(`${URL}/top10products`, 'GET');
  }
});
const grid3 = $('#productContainer').dxDataGrid({
  dataSource: memberStore3,
  allowColumnReordering: true,
  allowColumnResizing: true,
  columnAutoWidth: true,
  showBorders: true,
  remoteOperations: false,
  showColumnHeaders: false,
  wordWrapEnabled: true,
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
    { dataField: 'idx',
      caption: '#',
      width: 35,
      allowEditing: false
    },
    { dataField: 'imgLinkx',
        caption: `.`,
        width: 55,
        allowSorting: false,
        calculateCellValue: function(rowData) {
          return rowData.subdir +'/'+ rowData.imgLink;
        },
        allowEditing: false, 
        cellTemplate: cellTemplate,
    },
    { dataField : 'productName',
      caption: formatMessage('product'),
      allowSorting: false,
    },
    { dataField: 'subtotal',
      caption: formatMessage('qty'),
      width: 60,
      allowEditing: false,
      format: {
        type: 'fixedPoint',
        precision: 0  
      }
    }
  ]
  
}).dxDataGrid('instance');

//***************************************************** */
  function sendRequest(url, method = 'GET', data) {
    const d = $.Deferred();
    //console.log("url: " + url)
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




});
