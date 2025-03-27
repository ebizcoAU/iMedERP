$(() => {
  DevExpress.config({ defaultCurrency: 'VND' });
  $('#pagetitle').html(`${formatMessage('promotype')}`);
  //**************************/
  var parentGroupID = $('#groupid').text();
  var roleID = $('#roleid').text();
  console.log("parentGroupID: " + parentGroupID)
  var gid = 0;
  const URL = ''; 
  const tbl = "groupx";
  const primekey = "groupID";
  const memberStore = new DevExpress.data.CustomStore({
    key: primekey,
    load(loadOptions) {
      return sendRequest(`${URL}/promotypelist`, 'POST');
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
  const grid = $('#profileContainer').dxDataGrid({
    dataSource: memberStore,
    allowColumnReordering: true,
    allowColumnResizing: true,
    columnAutoWidth: true,
    showBorders: true,
    remoteOperations: false,
    wordWrapEnabled: true,
    paging: {
      pageSize: 10,
    },
    pager: {
      showPageSizeSelector: true,
      allowedPageSizes: [10, 12, 16],
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
      const worksheet = workbook.addWorksheet('promotion');

      DevExpress.excelExporter.exportDataGrid({
          component: e.component,
          worksheet,
          autoFilterEnabled: true,
      }).then(() => {
          workbook.xlsx.writeBuffer().then((buffer) => {
            saveAs(new Blob([buffer], { type: 'application/octet-stream' }), `promotion_${getDateTimeStampString()}.xlsx`);
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
      allowUpdating: ((parentGroupID > 1) && ((divisionID==1) && (roleID==1)))?true:false,
      useIcons: true,
      popup: {
        title: formatMessage('product'),
        showTitle: true,
        width: 1024,
        height: 840,
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
      { dataField: 'referPromo',
        caption: 'Bonus ' + formatMessage('referral'),
        validationRules: [{ type: 'required' }],
        width: 140,
        format: {
            type: 'percent',
            precision: 2  
          }  
      },
      { dataField: 'topAgentStaff1',
        caption: 'Bonus ' + formatMessage('top10agentstaff')+'#1',
        width: 140,
        format: {
            type: 'currency',
            precision: 0  
          } 
      },
      { dataField: 'topAgentStaff2',
        caption: 'Bonus ' + formatMessage('top10agentstaff')+'#2',
        width: 140,
        format: {
            type: 'currency',
            precision: 0  
          } 
      },
      { dataField: 'topAgentStaff3',
        caption: 'Bonus ' + formatMessage('top10agentstaff')+'#3',
        width: 140,
        format: {
            type: 'currency',
            precision: 0  
          } 
      },
      { dataField: 'topAgent1',
        caption: 'Bonus ' + formatMessage('top10agent')+'#1',
        format: {
            type: 'currency',
            precision: 0  
          } 
      },
      { dataField: 'topAgent2',
        caption: 'Bonus ' + formatMessage('top10agent')+'#2',
        format: {
            type: 'currency',
            precision: 0  
          } 
      },
      { dataField: 'topAgent3',
        caption: 'Bonus ' + formatMessage('top10agent')+'#3',
        width: 140,
        format: {
            type: 'currency',
            precision: 0  
          } 
      },
      { dataField: 'topDistStaff1',
        caption: 'Bonus ' + formatMessage('top10diststaff')+'#1',
        width: 160,
        format: {
            type: 'currency',
            precision: 0  
          } 
      },
      { dataField: 'topDistStaff2',
        caption: 'Bonus ' + formatMessage('top10diststaff')+'#2',
        width: 160,
        format: {
            type: 'currency',
            precision: 0  
          } 
      },
      { dataField: 'topDistStaff3',
        caption: 'Bonus ' + formatMessage('top10diststaff')+'#3',
        width: 160,
        format: {
            type: 'currency',
            precision: 0  
          } 
      },
      { type: 'buttons',
        width: 100,
        buttons: ['edit'],
      },
    ],
    onContentReady(e) {
      var grid = e.component;  
      grid.option('loadPanel.enabled', false);
      var selection = grid.getSelectedRowKeys();  
      if(selection.length == 0) {  
          grid.selectRowsByIndexes([0]);  
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


  function isNotEmpty(value) {
    return value !== undefined && value !== null && value !== '';
  }


});
