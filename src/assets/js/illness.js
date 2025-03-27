$(() => {
  var parentGroupID = $('#groupid').text();
  var roleID = $('#roleid').text();
  //****** label header ******/
  $('#pagetitle').html(`${formatMessage('illness')}`); 
  //**************************/
  console.log("parentGroupID: " + parentGroupID  +', roleID: '+ roleID )
  var gid = 0;
  var mode = 'new';
  const URL = ''; 
  const tbl = "illness";
  const primekey = "illnessID";
  const memberStore = new DevExpress.data.CustomStore({
    key: primekey,
    load() {
      return sendRequest(`${URL}/illness/${parentGroupID}`);
    },
    insert(values) {
        console.log(JSON.stringify(values,false,4))
        values.groupID = parentGroupID;
        if ('logox' in values) {
          values.logo = values.logox.split("/").pop();
          delete values.logox;
        }
        return sendRequest(`${URL}/new/${tbl}`, 'POST', {
            data: JSON.stringify(values),
        });
    },
    update(key, values) {
      console.log(JSON.stringify(values, false, 4))
      values[`${primekey}`] = key;
      if ('logox' in values) {
        values.logo = values.logox.split("/").pop();
        delete values.logox;
      }
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
      pageSize: 16,
    },
    pager: {
      showPageSizeSelector: true,
      allowedPageSizes: [16,24],
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
        title: formatMessage('illness'),
        showTitle: true,
        width: 820,
        height: 580,
      },
      form: {
        labelMode: 'floating',
        items: [{
          itemType: 'group',
          cssClass: 'first-group',
          colCount: 4,
          colSpan: 2,
          items: [{
            dataField: 'logox',
            colSpan: 1,
          }, {
            itemType: 'group',
            colSpan: 3,
            items: [{
              dataField: 'illness_vi',
            },{
              dataField: 'illness_en',
            },{
              dataField: 'illness_cn',
            },{
              dataField: 'illness_kr',
            },{
              dataField: 'illness_ru',
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
              dataField: 'dateAdded',
            }, {
              dataField: 'lastChanged',
            }],
          }, {
            itemType: 'group',
            items: [{
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
      { dataField: 'logox',
        caption: formatMessage('logo') + " 80x30",
        width: 95,
        allowSearch: false,
        calculateCellValue: function(rowData) {
          return rowData.subdir +'/'+ rowData.logo;
        },
        cellTemplate: cellTemplate,
        editCellTemplate: editCellTemplate
      },
      { dataField: 'illness_vi',
        caption: formatMessage('name'),
        validationRules: [{ type: 'required' }],
        
      },
      { dataField: 'illness_en',
        caption: formatMessage('english'),
        validationRules: [{ type: 'required' }],
        width: 220
      },
      { dataField: 'illness_cn',
        caption: formatMessage('chinese'),
        validationRules: [{ type: 'required' }],
        width: 180
      },
      { dataField: 'illness_kr',
        caption: formatMessage('korean'),
        validationRules: [{ type: 'required' }],
        width: 180
      },
      { dataField: 'illness_ru',
        caption: formatMessage('russian'),
        validationRules: [{ type: 'required' }],
        width: 270
      },
      { dataField: 'lastpersonName',
        caption: formatMessage('lastperson'),
        width: 180,
        allowEditing: false, 
        visible: false
        },
      { dataField: 'dateAdded',
        caption: formatMessage('dateadded'),
        dataType: 'date',
        width: 160,
        allowEditing: false, 
        visible: false,
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
    
    imgElement.setAttribute("width", `80`);
    imgElement.setAttribute("height", `30`);
    container.append(imgElement);
  }
  

  function editCellTemplate(cellElement, cellInfo) {
    if ((typeof cellInfo.value === 'undefined') || (mode == 'new')) {
    } else {
      var backendURL = `public/`;
      let buttonElement = document.createElement("div");
      buttonElement.classList.add("retryButton");
    
      let imageElement = document.createElement("img");
      imageElement.classList.add("uploadedImage");
      let imagepath = `${backendURL}logoblank.png`;

      //console.log("cellInfo.value: " + cellInfo.value);

      if ((cellInfo.value.split("/")[1] !== 'undefined') && (cellInfo.value.split("/")[1].length > 0)) {
        imagepath =  `${backendURL}${cellInfo.value}`;
      }
      console.log("imagepath: " + imagepath);
      imageElement.setAttribute('src',`${imagepath}`);
      
      imageElement.setAttribute("width", `140`);
      imageElement.setAttribute("height", `50`);
    
      let fileUploaderElement = document.createElement("div");
  
      cellElement.append(imageElement);
      cellElement.append(fileUploaderElement);
      cellElement.append(buttonElement);
  
      let retryButton = $(buttonElement).dxButton({
        text: "Retry",
        visible: false,
        onClick: function() {
          // The retry UI/API is not implemented. Use a private API as shown at T611719.
          for (var i = 0; i < fileUploader._files.length; i++) {
            delete fileUploader._files[i].uploadStarted;
          }
          fileUploader.upload();
        }
      }).dxButton("instance");

      let tablex = "groupx";
      let searchkey = "groupID";
      let field = imagepath.split("/").pop();
      let uploadurl = `uploadimages/${tablex}/${searchkey}/${gid}/${field}` ;
      
      console.log("uploadurl: " + uploadurl);

      let fileUploader = $(fileUploaderElement).dxFileUploader({
        multiple: false,
        accept: "image/*",
        uploadMode: "instantly",
        uploadUrl: uploadurl,
        labelText: '.',
        selectButtonText: formatMessage('fileselect'),
        maxFileSize: 1000000,
        onValueChanged: function(e) {
          let reader = new FileReader();
          reader.onload = function(args) {
            console.log("e.target:"+ args.target.result);
            imageElement.setAttribute('src', args.target.result);
          }
          reader.readAsDataURL(e.value[0]); // convert to base64 string
        },
        onUploaded: function(e){
          //console.log("res: " + e.request.responseText)
          cellInfo.setValue(e.request.responseText);
          retryButton.option("visible", false);
        },
        onUploadError: function(e){
          let xhttp = e.request;
          if(xhttp.status === 400){
            e.message = e.error.responseText;
          }
          if(xhttp.readyState === 4 && xhttp.status === 0) {
            e.message = "Không kết nối được";
          }
          retryButton.option("visible", true);
        }

      }).dxFileUploader("instance");
    }
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
