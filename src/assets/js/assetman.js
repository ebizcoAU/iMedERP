$(() => {
    $('#pagetitle').html(`${formatMessage('assetmanagement')}`);
  DevExpress.config({ defaultCurrency: 'VND' });

    //**************************/
    var parentGroupID = $('#groupid').text();
    var roleID = $('#roleid').text();
    //console.log("parentGroupID: " + parentGroupID)
    var gid = 0;
    var mode = 'new';
    const URL = ''; 
    const tbl = "expenses";
    const primekey = "expensesID";
    const memberStore = new DevExpress.data.CustomStore({
      key: primekey,
      load() {
        return sendRequest(`${URL}/assetlist`);
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
      remoteOperations: false,
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
        allowUpdating:((parentGroupID > 1) && ((divisionID==1) && (roleID==6)))?true:false,
        allowAdding: ((parentGroupID > 1) && ((divisionID==1) && (roleID==6)))?true:false,
        allowDeleting: ((parentGroupID > 1) && ((divisionID==1) && (roleID==6)))?true:false,
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
        { dataField: 'expensesID',
          caption: formatMessage('reference'),
          allowEditing: false, 
          visible: true,
          width: 100
      },
      { dataField: 'comment',
        caption: formatMessage('comment'),
        visible: true,
      },
      { dataField: 'amount',
        caption: formatMessage('amount'),
        format: {
            type: 'currency',
            precision: 0  
        },
        allowEditing: ((parentGroupID > 1) && (roleID == 6))?true:false,
        width: 110    
      },
      { dataField: 'tax',
        caption: formatMessage('tax'),
        format: {
            type: 'currency',
            precision: 0  
        },
        allowEditing: ((parentGroupID > 1) && (roleID == 6))?true:false,
        width: 110    
      }, 
       
      { dataField : 'depreciationID',
        caption: formatMessage('depreciation'),
        width: 160,
        visible: true,
        lookup: {
          dataSource: depreciationSource, 
          valueExpr: "status",
          displayExpr: "statext",
        }
      },

        { dataField: 'datePaid',
            caption: formatMessage('paydate'),
            visible: true,
            dataType: 'date',
            allowEditing: false,
            width: 140, 
            format: locale=='en'?'dd MMM, yyyy':'dd MMMM M, yyyy'
        },
       
        { dataField: 'dateAdded',
            caption: formatMessage('dateadded'),
            visible: true,
            dataType: 'date',
            allowEditing: false, 
            width: 140,
            format: locale=='en'?'dd MMM, yyyy':'dd MMMM M, yyyy'
        },
       
        { dataField : 'status',
          caption: formatMessage('status'),
          width: 200,
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
  