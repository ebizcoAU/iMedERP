

$(() => {
  //****** label header ******/
  $('#pagetitle').html(`${formatMessage('customer')}`);
  //**************************/
  var parentGroupID = $('#agestaffgroupID').text();
  var roleID = $('#roleid').text();
  var gid = 0;
  var mode = 'new';
  var oldData = {};
  const URL = ''; 
  const tbl = "memberx";
  const primekey = "memberID";
  const memberStore = new DevExpress.data.CustomStore({
    key: primekey,
    load() {
      return sendRequest(`${URL}/customer`, 'POST');
    },
    insert(values) {
        console.log(JSON.stringify(values,false,4))
        values.parentID = asid;
        values.groupID = $('#groupid').text();
        values.roleID = 3;
        
        return sendRequest(`${URL}/new/${tbl}`, 'POST', {
            data: JSON.stringify(values),
        });
    },
    update(key, values) {
      console.log(JSON.stringify(values, false, 4))
      values[`${primekey}`] = key;
      
      if ('imgLinkx' in values) {
        values.imgLink = values.imgLinkx.split("/").pop();
        delete values.imgLinkx;
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
      allowUpdating: (($('#groupid').text()>1) && ((roleID==6) || ((divisionID==1) && (roleID==1))))?true:false,
      allowAdding:  (($('#groupid').text()>1) && ((roleID==6) || ((divisionID==1) && (roleID==1))))?true:false, 
      allowDeleting:  (($('#groupid').text()>1) && ((roleID==6) || ((divisionID==1) && (roleID==1))))?true:false,
      useIcons: true,
      popup: {
        title: formatMessage('customer'),
        showTitle: true,
        width: 820,
        height: 720,
      },
      form: {
        labelMode: 'floating',
        items: [{
          itemType: 'group',
          cssClass: 'first-group',
          colCount: 4,
          colSpan: 2,
          items: [{
            dataField: 'imgLinkx',
            colSpan: 1,
          }, {  
            dataField: 'qrcode',
            colSpan: 1,
          }, {
            itemType: 'group',
            colSpan: 2,
            items: [{
              dataField: 'name',
            }, {
              dataField: 'phone',
            }, {
              dataField: 'email',
            }, {
              dataField: 'dob',
              editorType: 'dxDateBox',
              editorOptions: {
                width: '100%',
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
              dataField: 'company',
            }, {
              dataField: 'roleID',
            }, {
              dataField: 'momoAccount', 
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
      { dataField: 'imgLinkx',
        caption: formatMessage('logo') + " 140x140",
        allowSearch: false,
        allowSorting: false,
        allowEditing: (($('#groupid').text()>1) && (roleID==1))?true:false, 
        width: 75,
        calculateCellValue: function(rowData) {
          return rowData.subdir +'/'+ rowData.imgLink;
        },
        cellTemplate: cellTemplate,
        editCellTemplate: editCellTemplate
      },
      { dataField: 'name',
        caption: formatMessage('name'),
        allowEditing: false, 
        validationRules: [{ type: 'required' }]
      },
      { dataField: 'company',
        caption: '....',
        width: 180,
        allowEditing: false,
        visible: false
      },
      { dataField: 'address',
        caption: formatMessage('address'),
        allowEditing: false,
        visible: false
      },
     
      { dataField : 'phuongID',
        caption: formatMessage('phuong'),
        validationRules: [{ type: 'required' }],
        width: 120,
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
        width: 120,
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
        allowEditing: false, 
        width: 120,
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
        allowEditing: false, 
        visible: true,
        width: 110
      },
      { dataField: 'email',
        validationRules: [{type: 'email'}],
        allowEditing: false, 
        visible: false,
        width: 140
      },
      { dataField: 'momoAccount',
        caption: formatMessage('momoAccount'),
        allowEditing: false, 
        visible: false,
      },
      { dataField: 'qrcode',
        caption:  "QRCODE",
        allowEditing: false, 
        visible: false,
        width: 225,
        calculateCellValue: function(rowData) {
          return `${rowData.weburl}/staffqrchk?${rowData.subdir}${rowData.memberID}`;
        },
        editCellTemplate: editCellQRCodeTemplate
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
        visible: false,
        width: 160,
        allowEditing: false, 
        format: locale=='en'?'dd MMM, yyyy':'dd MMMM M, yyyy'
      },
      { dataField: 'dob',
        caption: formatMessage('dob'),
        allowEditing: false, 
        visible: false,
        dataType: 'date',
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
      { dataField : 'roleID',
        caption: formatMessage('role'),
        visible: false,
        allowEditing: false, 
        lookup: {
            dataSource: roleSource,
            valueExpr: "status",
            displayExpr: "statext"
        }
      },
      { type: 'buttons',
        width: 100,
        buttons: ['edit', 'delete', 
        { text: formatMessage('product'),
            icon: "money",
            hint: "Account",
            onClick: function (e) {
              if (($('#groupid').text()>1) && ((roleID==1) || (roleID==6))) {
                window.location = `/salexchg_${e.row.data.memberID}_0_0`;
              } else {
                  const message = formatMessage("authoritytodo");
                  const type = 'error';
                  toast.option({ message , type });
                  toast.show();
                  e.cancel = true;
              }
            }
        }],
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
    onRowUpdating(e) {
      oldData = e.oldData;
    },
    onRowDblClick(e) {
      if (e.key !== 0) {
        grid.editRow(e.rowIndex)
      }
    }
    
  }).dxDataGrid('instance');

  function cellTemplate(container, options) {
    var backendURL = `public/`;
    let imgElement = document.createElement("img");
    let imagepath = `${backendURL}logoblank.png`;
    //console.log("options.value: " + options.value);

    if ((options.value.split("/")[1] !== 'null') && (options.value.split("/")[1].length > 0)) {
      imagepath =  `${backendURL}${options.value}`;
    }
    //console.log("imagepath: " + imagepath);
    
    imgElement.setAttribute('src',`${imagepath}`);
    
    imgElement.setAttribute("width", `60`);
    imgElement.setAttribute("height", `68`);
    container.append(imgElement);
  }
  

  function editCellTemplate(cellElement, cellInfo) {
    if ((typeof cellInfo.value === 'undefined') || (mode == 'new')) {
    } else {
      var backendURL = `public/`;
      let buttonElement = document.createElement("div");
      buttonElement.classList.add("retryButton");
    
      let imageElement = document.createElement("img");
      let imagepath = `${backendURL}logoblank.png`;

      console.log("cellInfo.value: " + cellInfo.value);

      if ((cellInfo.value.split("/")[1] !== 'undefined') && (cellInfo.value.split("/")[1].length > 0)) {
        imagepath =  `${backendURL}${cellInfo.value}`;
      }
      console.log("imagepath: " + imagepath);
      imageElement.setAttribute('src',`${imagepath}`);
      
      imageElement.setAttribute("width", `140`);
      imageElement.setAttribute("height", `140`);
    
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
          console.log("res: " + e.request.responseText)
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

  function editCellQRCodeTemplate(cellElement, cellInfo) {
    if (typeof cellInfo.value === 'undefined') {
    } else {
      console.log("cellInfo.value: " + cellInfo.value);
      if ((typeof cellInfo.value === 'undefined') || (cellInfo.value === null)) {
        var backendURL = `public/`;
        let imageElement = document.createElement("img");
        imageElement.classList.add("qrcode");
        let imagepath = `${backendURL}logoblank.png`;
        console.log("imagepath: " + imagepath);
        imageElement.setAttribute('src',`${imagepath}`);
        imageElement.setAttribute("width", `140`);
        imageElement.setAttribute("height", `140`);
        cellElement.append(imageElement);
      } else {
        let qrcodeElement = document.createElement("div");
        qrcodeElement.classList.add("qrcode");
        new QRCode(qrcodeElement, {
          text: `${cellInfo.value}`,
          width: 130,
          height: 130,
          colorDark : "#000000",
          colorLight : "#ffffff",
          correctLevel : QRCode.CorrectLevel.H
        });
        cellElement.append(qrcodeElement);
      } 
      
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

  

});



