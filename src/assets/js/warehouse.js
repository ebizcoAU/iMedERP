$(() => {
    $('#pagetitle').html(`${formatMessage('warehouse')}`);
    //**************************/
    var parentGroupID = $('#groupid').text();
    var roleID = $('#roleid').text();
    console.log("parentGroupID: " + parentGroupID)
    var gid = 0;
    var mode = 'new';
    const URL = ''; 
    const tbl = "warehouse";
    const primekey = "warehouseID";
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
      return sendRequestARG(`${URL}/warehouselist`, 'POST', args);
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
        mode: 'popup',
        allowUpdating: ((parentGroupID > 1) && ((divisionID==1) && (roleID==1)))?true:false,
        allowAdding: ((parentGroupID > 1) && ((divisionID==1) && (roleID==1)))?true:false,
        allowDeleting: ((parentGroupID > 1) && ((divisionID==1) && (roleID==1)))?true:false,
        useIcons: true,
        popup: {
            title: formatMessage('warehouse'),
            showTitle: true,
            width: 1024,
            height: 520,
        },
        form: {
            labelMode: 'floating',
            items: [{
            itemType: 'group',
            cssClass: 'first-group',
            colCount: 1,
            colSpan: 2,
            itemType: 'group',
            cssClass: 'second-group',
            colCount: 2,
            colSpan: 2,
            items: [{
                itemType: 'group',
                items: [{
                dataField: 'name',
                }, {    
                dataField: 'phone',
                }, {
                dataField: 'address',
                }, {
                dataField: 'provincesID',
                }, {
                dataField: 'wardsID', 
              }, {
                dataField: 'phuongID', 
                }],
            }, {
                itemType: 'group',
                items: [{
                 dataField: 'staffname',
                }, {
                dataField: 'dateAdded',
                }, {
                dataField: 'lastChanged',
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
         /*
        { dataField : 'warehouseID',
            caption: formatMessage('id'),
            width: 60,   
        }, 
        */
        { dataField: 'name',
            caption: formatMessage('name'),
            validationRules: [{ type: 'required' }],
            width: 140,
        },
        { dataField: 'staffname',
            caption: formatMessage('staffname'),
            validationRules: [{ type: 'required' }],
            visible: true,
            width: 140
        },
        { dataField: 'address',
            caption: formatMessage('address'),
            visible: true
        },
        { dataField : 'phuongID',
          caption: formatMessage('phuong'),
          validationRules: [{ type: 'required' }],
          width: 160,
          visible: true,
          lookup: {
            dataSource(options) {
              return {
                store: phuongSource,
                filter: options.data ? ['wardsID', '=', options.data.wardsID] : null,
                sort: ['title']
              };
            },
            valueExpr: "phuongID",
            displayExpr: "title",
          }
        },
        { dataField : 'wardsID',
          caption: formatMessage('ward'),
          validationRules: [{ type: 'required' }],
          width: 160,
          visible: true,
          setCellValue(rowData, value) {
            rowData.wardsID = value;
            rowData.phuongID = null;
          },
          lookup: {
            dataSource(options) {
              return {
                store: wardsSource,
                filter: options.data ? ['provincesID', '=', options.data.provincesID] : null,
                sort: ['title']
              };
            },
            valueExpr: "wardsID",
            displayExpr: "title",
          }
        },
        { dataField : 'provincesID',
          caption: formatMessage('province'),
          validationRules: [{ type: 'required' }],
          width: 160,
          visible: true,
          setCellValue(rowData, value) {
            rowData.provincesID = value;
            rowData.wardsID = null;
          },
          lookup: {
            dataSource: {  
              store: provincesSource,  
              sort: "title"  
            }, 
            valueExpr: "provincesID",
            displayExpr: "title",
          }
        },
        { dataField: 'phone',
            validationRules: [{ type: 'required' }],
            visible: true,
            width: 110
        },
        { dataField: 'dateAdded',
            caption: formatMessage('dateadded'),
            visible: false,
            dataType: 'date',
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
        { dataField: 'lastpersonName',
            caption: formatMessage('lastperson'),
            width: 180,
            allowEditing: false, 
            visible: false
        },
        { dataField : 'status',
          caption: formatMessage('status'),
          width: 110,
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
  