

$(() => {
  //****** label header ******/
  $('#pagetitle').html(formatMessage('updateprofile'));
  //**************************/
  const memberID = $('#memberid').text();
  const URL = '';
  const tbl = "memberx";
  const primekey = "memberID";
  const memberStore = new DevExpress.data.CustomStore({
    key: primekey,
    load() {
      return sendRequest(`${URL}/${tbl}/${memberID}`);
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
    }
  });

  const grid = $('#profileContainer').dxDataGrid({
    dataSource: memberStore,
    allowColumnReordering: true,
    allowColumnResizing: true,
    columnAutoWidth: true,
    showBorders: true,
    wordWrapEnabled: true,
    editing: {
      texts: {
        saveRowChanges: formatMessage('save'),
        cancelRowChanges: formatMessage('cancel'),
        editRow: formatMessage('edit'),
        deleteRow: formatMessage('delete')
      },
      mode: 'popup',
      allowUpdating: true,
      allowAdding: false,
      allowDeleting: true,
      useIcons: true,
      popup: {
        title: formatMessage('updateprofile'),
        showTitle: true,
        width: 820,
        height: 700,
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
            }, {
              dataField: 'momoAccount',   
            }],
          }, {
            itemType: 'group',
            items: [{
              dataField: 'company',
            }, {
              dataField: 'roleID',
            }, {
              dataField: 'status', 
            }, {
              dataField: 'dateAdded', 
            }, {
              dataField: 'lastChanged',      
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
        caption: formatMessage('logo') + "  140x140(min)",
        width: 155,
        calculateCellValue: function(rowData) {
          return rowData.subdir +'/'+ rowData.imgLink;
        },
        cellTemplate: cellTemplate,
        editCellTemplate: editCellTemplate
      },
      { dataField: 'name',
        caption: formatMessage('name'),
        validationRules: [{ type: 'required' }],
        width: 180
      },
      { dataField: 'address',
        caption: formatMessage('address'),
        visible: true
      },
      { dataField : 'phuongID',
        caption: formatMessage('phuong'),
        validationRules: [{ type: 'required' }],
        width: 140,
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
        width: 140,
        visible: true,
        setCellValue(rowData, value) {
          rowData.provincesID = value;
          rowData.wardsID = null;
        },
        lookup: {
            dataSource: provincesSource,
            valueExpr: "provincesID",
            displayExpr: "title",
        }
      },
      { dataField: 'phone',
        validationRules: [{ type: 'required' }],
        visible: true,
        width: 110
      },
      { dataField: 'email',
        validationRules: [{type: 'email'}],
        width: 180
      },
      { dataField: 'company',
        caption: formatMessage('company'),
        width: 180,
        visible: false
      },
      { dataField: 'momoAccount',
        caption: formatMessage('momoAccount'),
        visible: false,
      },
      { dataField: 'qrcode',
        caption:  "QRCODE",
        visible: false,
        width: 225,
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
        width: 160,
        allowEditing: false, 
        format: locale=='en'?'dd MMM, yyyy':'dd MMMM M, yyyy'
      },
      { dataField: 'dob',
        caption: formatMessage('dob'),
        visible: false,
        dataType: 'date',
        format: locale=='en'?'dd MMM, yyyy':'dd MMMM M, yyyy'
      },
      
      { dataField : 'status',
        caption: formatMessage('status'),
        visible: false,
        allowEditing: false, 
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
    
    imgElement.setAttribute("width", `140`);
    imgElement.setAttribute("height", `140`);
    container.append(imgElement);
  }
  

  function editCellTemplate(cellElement, cellInfo) {
    if (typeof cellInfo.value === 'undefined') {
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

  function editCellQRCodeTemplate(cellElement, cellInfo) {
    if (typeof cellInfo.value === 'undefined') {
    } else {
      console.log("cellInfo.value: " + cellInfo.value);

      if (cellInfo.value !== 'undefined')  {
        var memberAuthenURL = `public/`;
        let qrcodeElement = document.createElement("div");
        qrcodeElement.classList.add("qrcode");
        new QRCode(qrcodeElement, {
          text: "http://jindo.dev.naver.com/collie",
          width: 130,
          height: 130,
          colorDark : "#000000",
          colorLight : "#ffffff",
          correctLevel : QRCode.CorrectLevel.H
        });
        cellElement.append(qrcodeElement);
      } else {
        var backendURL = `public/`;
        let imageElement = document.createElement("img");
        imageElement.classList.add("qrcode");
        let imagepath = `${backendURL}logoblank.png`;
        console.log("imagepath: " + imagepath);
        imageElement.setAttribute('src',`${imagepath}`);
        imageElement.setAttribute("width", `210`);
        imageElement.setAttribute("height", `180`);
        cellElement.append(imageElement);
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
        console.log(JSON.stringify(result, false, 4))
        d.resolve(result);
      
    }).fail((xhr) => {
      d.reject(xhr.responseJSON ? xhr.responseJSON.Message : xhr.statusText);
    });

    return d.promise();
  }

});
