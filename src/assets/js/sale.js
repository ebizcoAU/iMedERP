$(() => {
  DevExpress.config({ defaultCurrency: 'VND' });
  $('#pagetitle').html(`${formatMessage('salenumber')}:  ${$('#saleID').text()}`);
  $('#agentCompanyx').html(`${formatMessage('agent')}: ${$('#agentCompany').text()}`);
  $('#agentAddressx').html(`${formatMessage('address')}: ${$('#agentAddress').text()}`);
  $('#dateAddedx').html(`${formatMessage('dateadded')}: ${$('#dateAdded').text()}`);
  $('#customerNamex').html(`${formatMessage('customer')}: ${$('#customerName').text()}`);
  $('#customerPhonex').html(`Phone: ${$('#customerPhone').text()}`);
  $('#customerEmailx').html(`Email: ${$('#customerEmail').text()}`);
  $('#agentNamex').html(`${formatMessage('agestaff')}: ${$('#agentName').text()}`);
  $('#agentPhonex').html(`Phone: ${$('#agentPhone').text()}`);
  $('#agentEmailx').html(`Email: ${$('#agentEmail').text()}`);
    
  //**************************/
  var parentGroupID = $('#groupid').text();
  var roleID = $('#roleid').text();
  var sid = parseInt($('#saleID').text());
  const URL = ''; 
  const tbl = "proditem";
  const primekey = "proditemID";
  const memberStore = new DevExpress.data.CustomStore({
    key: primekey,
    load(loadOptions) {
        return sendRequest(`${URL}/saleitemlist/${sid}`, 'POST');
    }
  });

  //************************************************ */
  var productDataSource = {  
    store: new DevExpress.data.CustomStore({
      key: "productID",
      loadMode: "raw",
      load: function() {
          return $.getJSON(`${URL}/product/${parentGroupID}`);
       }
    }) 
  }  
  
//************************************************ */
  const grid = $('#profileContainer').dxDataGrid({
    dataSource: memberStore,
    allowColumnReordering: true,
    allowColumnResizing: true,
    columnAutoWidth: true,
    showBorders: true,
    remoteOperations: false,
    wordWrapEnabled: true,
    searchPanel: {
        visible: true,
        width: 240,
        placeholder: formatMessage('search'),
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
      { dataField: 'idx',
        caption: '#',
        width: 50,
        allowEditing: false
      },
      { dataField: 'imgLinkx',
          caption: `.`,
          width: 115,
          allowSorting: false,
          calculateCellValue: function(rowData) {
            return rowData.subdir +'/'+ rowData.imgLink;
          },
          allowEditing: false, 
          cellTemplate: cellTemplate,
      },
      { dataField : 'productID',
        caption: formatMessage('product'),
        lookup: {
            dataSource: productDataSource,
            valueExpr: "productID",
            displayExpr: "productName" 
        }
      },
      { dataField: 'customerBonus',
          caption: formatMessage('customerbonus'),
          width: 120,
          allowEditing: false,
          format: {
            type: 'currency',
            precision: 0  
          },
      },
      { dataField: 'agentstaffBonus',
          caption: formatMessage('agentstaffbonus'),
          width: 120,
          allowEditing: false,
          format: {
            type: 'currency',
            precision: 0  
          },
      },
      { dataField: 'agentBonus',
          caption: formatMessage('agentbonus'),
          width: 120,
          allowEditing: false,
          format: {
            type: 'currency',
            precision: 0  
          },
      },
      { dataField: 'diststaffBonus',
          caption: formatMessage('diststaffbonus'),
          width: 120,
          allowEditing: false,
          format: {
            type: 'currency',
            precision: 0  
          },
      },
      { dataField: 'refID',
        caption: 'RefID',
        width: 120,
        allowEditing: false
      },
      { dataField : 'status',
        caption: formatMessage('status'),
        width: 140,
        allowEditing: false,
        lookup: {
            dataSource: qrcodeSource,
            valueExpr: "status",
            displayExpr: "statext"
        }
      }
      
    ],
    summary: {
        totalItems: [{
          column: 'customerBonus',
          summaryType: 'sum',
          displayFormat: `{0}`,
          valueFormat: 'currency',
        },{
          column: 'agentstaffBonus',
          summaryType: 'sum',
          displayFormat: `{0}`,
          valueFormat: 'currency',
        },{
            column: 'agentBonus',
            summaryType: 'sum',
            displayFormat: `{0}`,
            valueFormat: 'currency',
        },{
            column: 'diststaffBonus',
            summaryType: 'sum',
            displayFormat: `{0}`,
            valueFormat: 'currency',      
        }],
    },
    onContentReady(e) {
      var grid = e.component;  
      grid.option('loadPanel.enabled', false);
      var selection = grid.getSelectedRowKeys();  
      if(selection.length == 0) {  
          grid.selectRowsByIndexes([0]);  
      }  
    }
    
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
    
    imgElement.setAttribute("width", `100`);
    imgElement.setAttribute("height", `100`);
    container.append(imgElement);
  }

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
