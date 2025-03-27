

$(() => {
  var mid = $('#manufacturerID').text();
  //****** label header ******/
  if (mid > 0) {
    $('#pagetitle').html(`${formatMessage('distributor')}`);
  } else {
    $('#pagetitle').html(`${formatMessage('norecordfoundwarning')}`);
  }


  var consultantSource = {  
    store: new DevExpress.data.CustomStore({
      key: "memberID",
      loadMode: "raw",
      load: function() {
          return sendRequest(`${URL}/getmember`, 'POST', {  //Get NVSX - Sale
            roleID: JSON.stringify([2]),
            divisionID: JSON.stringify([3,4]),
            typex: 1
        })
      },
    })
  }  
  //**************************/
  var parentGroupID = $('#mangroupID').text();
  var roleID = $('#roleid').text();
  var divisionID = $('#divisionid').text();
  var subdir = $('#subdir').text();

  var gid = 0;
  var mode = 'new';
  var oldData = {};
  const URL = ''; 
  const tbl = "memberx";
  const primekey = "memberID";
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
      return sendRequestARG(`${URL}/distributor/${mid}`, 'POST', args);
    },
    insert(values) {
        console.log(JSON.stringify(values,false,4))
        values.parentID = mid;
        values.groupID = parentGroupID;
        values.roleID = 4;
        
        if ('imgLinkx' in values) {
          values.imgLink = values.imgLinkx.split("/").pop();
          delete values.imgLinkx;
        }
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
    remoteOperations: true,
    wordWrapEnabled: true,
    paging: {
      pageSize: 8,
    },
    pager: {
      showPageSizeSelector: true,
      allowedPageSizes: [8, 12, 16],
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
      allowUpdating: ((divisionID==1) && (roleID==1))?true:false,
      allowAdding: ((divisionID==1) && (roleID==1))?true:false,
      allowDeleting: ((divisionID==1) && (roleID==1))?true:false,
      useIcons: true,
      popup: {
        title: formatMessage('distributor'),
        showTitle: true,
        width: 1280,
        height: 840,
      },
      form: {
        labelMode: 'floating',
        items: [{
          itemType: 'group',
          cssClass: 'first-group',
          colCount: 6,
          colSpan: 2,
          items: [{
            dataField: 'imgLinkx',
            colSpan: 1,
          }, {  
            dataField: 'qrcodex',
            colSpan: 1,
          }, {
            itemType: 'group',
            colSpan: 4,
            items: [{
              dataField: 'name',
            }, { 
              dataField: 'divisionID',
            }, {
              dataField: 'phone',
            }, {
              dataField: 'email',
           
            }],
          }],
        }, {
          itemType: 'group',
          cssClass: 'second-group',
          colCount: 4,
          colSpan: 2,
          items: [{
            itemType: 'group',
            colSpan: 1,
            items: [{
              dataField: 'address',
            }, {
              dataField: 'provincesID',
            }, {
              dataField: 'wardsID',
            }, {
              dataField: 'phuongID', 
            }, {
              dataField: 'dob',
              editorType: 'dxDateBox',
              editorOptions: {
                width: '100%',
              },
            }, {
              dataField: 'momoAccount', 
            }],
          }, {
            itemType: 'group',
            colSpan: 1,
            items: [{
              dataField: 'company',
            }, {
              dataField: 'abn',
            }, {
              dataField: 'roleID',
            }, {
              dataField: 'status', 
            }, {
              dataField: 'dateAdded', 
            }, {
              dataField: 'lastChanged', 
            }],
          }, {
            itemType: 'group',
            colSpan: 2,
            items: [{
              dataField: 'imgLinky',
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
        caption: formatMessage('logo') + " 80x80",
        width: 100,
        allowSearch: false,
        allowSorting: false,
        calculateCellValue: function(rowData) {
          return rowData.subdir +'/'+ rowData.imgLink;
        },
        cellTemplate: cellTemplate,
        editCellTemplate: editCellTemplate
      },
      { dataField: 'imgLinky',
        width: 75,
        visible: false,
        calculateCellValue: function(rowData) {
            return  rowData.memberID +'/'+rowData.status;
        },
        editCellTemplate: editCellTemplate2
      },
      { dataField: 'company',
        caption: formatMessage('company'),
        visible: true,
        allowEditing: true
      },
      { dataField: 'name',
        caption: formatMessage('contactname'),
        validationRules: [{ type: 'required' }],
        width: 160,
        visible: true
      },
      { dataField: 'address',
        caption: formatMessage('address'),
        validationRules: [{ type: 'required' }],
        visible: false
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
        width: 140,
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
      { dataField: 'consultantID',
        caption: formatMessage('consultant'),
        visible: true,
        width: 180,
        lookup: {
            dataSource: consultantSource,
            valueExpr: "memberID",
            displayExpr: "name",
        }
      },
      { dataField: 'email',
        validationRules: [{type: 'email'}],
        visible: false,
        width: 180
      },
      { dataField: 'abn',
        caption: formatMessage('taxfilenumber'),
        visible: true,
        width: 110
      },
      { dataField: 'momoAccount',
        caption: formatMessage('momoAccount'),
        visible: false,
      },
      { dataField: 'qrcodex',
        caption:  "QRCODE",
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
        visible: false,
        dataType: 'date',
        width: 140,
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
        visible: true,
        allowEditing: (($('#groupid').text() > 1) && (roleID==1))?true:false,
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
        width: 110,
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
    onRowUpdating(e) {
      oldData = e.oldData;
    },
    onRowRemoving(e) {
      if (e.key !== 0) {
        console.log(e.data);
        sendRequest(`/deletealldocs/memberrego/${subdir}`, 'POST', {
          memberID: e.data.memberID
        }).done(function (datx){
          e.cancel = false;
        })
      }
    },
    onRowDblClick(e) {
        if (e.key !== 0) {
            console.log(JSON.stringify(e.data,false,4))
            window.location = `/diststaff_${e.data.memberID}`;
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
    
    imgElement.setAttribute("width", `85`);
    imgElement.setAttribute("height", `85`);
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
      if ((typeof cellInfo.value === 'undefined') || (cellInfo.value === null)) {
        var backendURL = `public/`;
        let imageElement = document.createElement("img");
        imageElement.classList.add("qrcode");
        let imagepath = `${backendURL}logoblank.png`;
        console.log("imagepath: " + imagepath);
        imageElement.setAttribute('src',`${imagepath}`);
        imageElement.setAttribute("width", `210`);
        imageElement.setAttribute("height", `180`);
        cellElement.append(imageElement);
      } else {
        var canssmsWebUrlave = $('#canssmsWebUrlave').text();
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

  function editCellTemplate2(cellElement, cellInfo) {
    let filelist = [], status=0;
    if ((typeof cellInfo.value === 'undefined') || (mode == 'new')) {
    } else {
      
      console.log("cellInfo.value: " + cellInfo.value);
      let fileUploaderElement = document.createElement("div");
      let inputElement = document.createElement("input");
      inputElement.setAttribute('id', 'file_upload');
      inputElement.setAttribute('type', 'file');
      inputElement.setAttribute('multiple', 'true');

      fileUploaderElement.append(inputElement);
      cellElement.append(fileUploaderElement);

      initImageView(cellInfo.value.split("/")[0])
      
    }
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
    //console.log("url: " + url)
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

  function initImageView(memberID) {
    const maxFileUpload = 6;
    var docImg=[];
    var docPreview=[];
    function getmemberrego() { return $.ajax({ type: 'POST', url: '/getrego/memberrego', dataType: 'json', data: {memberID:memberID}  }); }
    $.when(getmemberrego()).done(function (r1) {
        r1.forEach(function (datax) {
            let doc;
            if (datax.name.split('.')[1]=='pdf') {
                docImg.push(`public/${subdir}/${datax.name}`);
                doc = {key:datax.memberregoID, size:datax.size, caption:datax.name, type:'pdf'}
            } else {
                docImg.push(`public/${subdir}/${datax.name}`);
                doc = {key:datax.memberregoID, size:datax.size, caption:datax.name}
            }
            docPreview.push(doc);
        })
        console.dir('docImg: '+ JSON.stringify(docImg, false, 4));
        console.dir('docPreview: '+JSON.stringify(docPreview));

        var fileuploadOptions = {
            theme: 'fa5',
            append: true,
            language: 'vi',
            uploadAsync: false,
            browseOnZoneClick: false,
            overwriteInitial: true,
            initialPreviewAsData: true,
            initialPreviewFileType: 'image',
            initialPreview: docImg,
            initialPreviewConfig: docPreview,
            maxFileCount: maxFileUpload,
            maxFileSize: 10000,
            initialCaption: formatMessage('fileselect'),
            autoOrientImage: true,
            initialPreviewDownloadUrl: `download/memberrego`, 
        };
        
        $.extend(fileuploadOptions,{
            showRemove: false,
            uploadUrl: `/uploaddocs/memberrego/memberID/${memberID}/${subdir}`,
            deleteUrl: `/deletedocs/memberrego/${subdir}`,
            uploadIcon : "<i class='fas fa-upload'></i>",
            removeIcon : "<i class='fas fa-trash-alt'></i>",
            browseIcon : "<i class='fas fa-folder-open'></i>",
            removeClass : 'btn btn-danger',
            allowedFileExtensions: ["jpg", "png", "gif", "pdf", "jpeg", "mp4", "mp3"]
        });
        
        $("#file_upload").fileinput(fileuploadOptions)
        .on('fileuploaded', function(event, previewId, index, fileId) {
            console.log('File Uploaded', 'ID: ' + fileId + ', Thumb ID: ' + previewId);
            window.location.reload();
        }).on('filedeleted', function(event, previewId, index, fileId) {
            console.log('File Deleted');
        }).on('fileuploaderror', function(event, data, msg) {
            console.log('File Upload Error');
        }).on('filebatchuploadcomplete', function(event, preview, config, tags, extraData) {
            console.log('File Batch Uploaded', preview, config, tags, extraData);
        });
    })
  }

});
