$(() => {
  DevExpress.config({ defaultCurrency: 'VND' });
  $('#pagetitle').html(`${formatMessage('ordersx')}`);
  //**************************/
  var parentGroupID = $('#groupid').text();
  var roleID = $('#roleid').text();
  var subdir = $('#subdir').text();
  var totalAmount, totalTax;
  var mode;

  const URL = ''; 
  const tbl = "orderx";
  const tbl1 = "orderxitem";
  const primekey = "orderxID";
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
        return sendRequestARG(`${URL}/orderxlist/0`, 'POST', args);
    },
    insert(values) {
        console.log(JSON.stringify(values,false,4));
        values[`groupID`] = parentGroupID;
        if (!values.hasOwnProperty['salestaffID']) values['salestaffID'] = $('#memberid').text();
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
        return sendRequest(`${URL}/deleteMasterSlave/${tbl}&${tbl1}`, 'POST', {
          data: JSON.stringify(datax)
        });
    },
  });

  //************************************************ */
  var distributorDataSource = {  
    store: new DevExpress.data.CustomStore({
      key: "memberID",
      loadMode: "raw",
      load: function() {
          return sendRequest(`${URL}/distlist`);
       }
    }) 
  }  

  var manstaffDataSource = {  
    store: new DevExpress.data.CustomStore({
      key: "memberID",
      loadMode: "raw",
      load: function() {
          return $.getJSON(`${URL}/manxlist`);
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
    remoteOperations: true,
    wordWrapEnabled: true,
    filterRow: { visible: true },
    headerFilter: { visible: true },
    paging: {
      pageSize: 22,
    },
    pager: {
      showPageSizeSelector: true,
      allowedPageSizes: [22, 28],
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
      const worksheet = workbook.addWorksheet('ordersx');

      DevExpress.excelExporter.exportDataGrid({
          component: e.component,
          worksheet,
          autoFilterEnabled: true,
      }).then(() => {
          workbook.xlsx.writeBuffer().then((buffer) => {
            saveAs(new Blob([buffer], { type: 'application/octet-stream' }), `ordersxlist${getDateTimeStampString()}.xlsx`);
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
      mode: 'form',
      allowUpdating: ((parentGroupID > 1) && (((divisionID==1) && (roleID==1)) || ((roleID==2)&&(divisionID==2))))?true:false,
      allowAdding: ((parentGroupID > 1) && (((divisionID==1) && (roleID==1)) || ((roleID==2)&&(divisionID==2))))?true:false,
      allowDeleting:  ((parentGroupID > 1) && (((divisionID==1) && (roleID==1)) || ((roleID==2)&&(divisionID==2))))?true:false,
      useIcons: true,
      form: {
        labelMode: 'floating',
        items: [{
            itemType: 'group',
            cssClass: 'second-group',
            colCount: 5,
            colSpan: 2,
            items: [{
              itemType: 'group',
              items: [{
                    dataField: 'dateConfirm',
                }, {
                    dataField: 'amount',
                    format: "currency",  
                    editorOptions: {  
                      format: " #,##0.## đ"  
                    }  
                }, {
                    dataField: 'tax',
                    format: "currency",  
                    editorOptions: {  
                      format: " #,##0.## đ"  
                    }  
              }],
            }, {
              itemType: 'group',
              items: [{
                    dataField: 'dateDispatched', 
                }, {
                    dataField: 'distributorID',
                }, {
                    dataField: 'salestaffID',
                }]
            }, {
                itemType: 'group',
                items: [{
                    dataField: 'dateCompleted',
                }, {
                    dataField: 'isPaid',
                }, {
                    dataField: 'incltax', 
                }],
            }, {
              itemType: 'group',
              items: [{
                    dataField: 'datePaid', 
                }, {
                    dataField: 'paytype',
                }, {
                    dataField: 'status',
                }],
            }, {
              itemType: 'group',
              items: [{
                  dataField: 'dateAdded',
              }, {
                  dataField: 'lastChanged',
              }, {
                  dataField: 'description', 
              }],
            }],
        }, {
            itemType: 'group',
            cssClass: 'third-group',
            colCount: 5,
            colSpan: 2,
            items: [{
                itemType: 'group',
                colSpan: 5,
                items: [{
                    dataField: 'imgLinkx',
               }]
            }]
        }]
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
      {
        dataField: 'orderNumber',
        caption: formatMessage('ordersx') ,
        allowEditing: false,
        width:'90',
        visible: true
      },
      { dataField : 'distributorID',
          caption: formatMessage('distributor')+ '*',
          allowFiltering: false,
          lookup: {
            dataSource: distributorDataSource,
            valueExpr: "memberID",
            displayExpr: "company"
          }
      },   
      { dataField: 'paytype',
        caption: formatMessage('paytype'),
        allowFiltering: false,
        visible: false,
        width: 120,
        lookup: {
            dataSource: paytypeDataSource,
            valueExpr: `status`,
            displayExpr: `statext`
        },
      },
      { dataField: 'incltax',
        caption: formatMessage('incltax'),
        allowFiltering: false,
        width: 70,
        dataType: 'boolean'
      },
      { dataField: 'description',
        caption: formatMessage('description'),
        visible: false
      },
      { dataField: 'imgLinkx',
        width: 75,
        allowSearch: false,
        allowSorting: false,
        visible: false,
        calculateCellValue: function(rowData) {
            return  rowData.orderxID +'/'+rowData.status;
        },
        editCellTemplate: editCellTemplate
      },
      { dataField: 'dateConfirmed',
        caption: formatMessage('confirmed')+ '*',
        dataType: 'date',
        width: 120,
        allowEditing: false,
        visible: true,
        format: locale=='en'?'dd MMM, yyyy':'dd/MM/yyyy'
      },
      { dataField: 'dateDispatched',
        caption: formatMessage('datedispatched')+ '*',
        dataType: 'date',
        width: 120,
        allowEditing: true,
        visible: true,
        format: locale=='en'?'dd MMM, yyyy':'dd/MM/yyyy'
      },
      { dataField: 'dateCompleted',
        caption: formatMessage('completed')+ '*',
        dataType: 'date',
        width: 120,
        allowEditing: true,
        visible: true,
        format: locale=='en'?'dd MMM, yyyy':'dd/MM/yyyy'
      },
      { dataField: 'datePaid',
        caption: formatMessage('completed')+ '*',
        dataType: 'date',
        width: 120,
        allowEditing: true,
        visible: false,
        format: locale=='en'?'dd MMM, yyyy':'dd/MM/yyyy'
      },
      { dataField: 'salestaffID',
        caption: formatMessage('salestaff')+ '*',
        allowEditing: false,
        width: 140,
        lookup: {
          dataSource: manstaffDataSource,
          valueExpr: "memberID",
          displayExpr: "name"
        } 
      },
      { dataField: 'dateAdded',
        caption: formatMessage('dateadded'),
        dataType: 'date',
        width: 120,
        allowEditing: false,
        visible: true,
        format: locale=='en'?'dd MMM, yyyy':'dd/MM/yyyy'
      },
      { dataField: 'lastChanged',
        caption: formatMessage('lastchanged'),
        dataType: 'date',
        width: 140,
        allowEditing: false,
        visible:false,
        format: locale=='en'?'dd MMM, yyyy':'dd/MM/yyyy'
      },
      { dataField: 'lastpersonName',
        caption: formatMessage('lastperson'),
        allowFiltering: false,
        width: 160,
        allowEditing: false,
        visible: false 
      },
      
      { dataField : 'status',
        caption: formatMessage('status'),
        allowFiltering: false,
        width: 110,
        lookup: {
            dataSource: progressSource,
            valueExpr: "status",
            displayExpr: "statext"
        }
      },
      { dataField: 'amount',
        caption: formatMessage('amount'),
        width: 120,
        allowEditing: false,
        format: {
            type: 'currency',
            precision: 0  
          }  
      },
      { dataField: 'tax',
        caption: formatMessage('tax'),
        width: 110,
        allowEditing: false,
        format: {
            type: 'currency',
            precision: 0  
          }  
      },
      { dataField: 'total',
        caption: formatMessage('total'),
        width: 120,
        allowEditing: false,
        calculateCellValue: function(rowData){
            return rowData.incltax==1?rowData.amount + rowData.tax:rowData.amount ;
        },
        format: {
            type: 'currency',
            precision: 0  
            }  
      },
      { type: 'buttons',
        width: 90,
        buttons: ['edit', 'delete', 
        { text: formatMessage('product'),
            icon: "cart",
            hint: "Shop",
            onClick: function (e) {
                let data = e.row.data;
                window.location = `/shoppingcart?${data.orderxID}`;
            }
        }],
      },
    ],
    summary: {
      totalItems: [{
          column: 'amount',
          summaryType: 'sum',
          valueFormat: 'currency', 
          customizeText: function (data) {
              if (data.value) {
                totalAmount = data.value.amount;
                totalTax = data.value.tax;
              } else {
                totalAmount = 0;
                totalTax = 0;
              }
              let totalTxt = `${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalAmount)}`;
              return `${totalTxt}`; 
          }
      }, {    
          column: 'tax',
          summaryType: 'sum',
          valueFormat: 'currency', 
          customizeText: function (data) {
              let totalTxt = `${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalTax)}`;
              return `${totalTxt}`; 
          }
      }, {    
        column: 'total',
        valueFormat: 'currency', 
        summaryType: 'custom',
        customizeText: function (data) {
            let totalTxt = `${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalAmount+totalTax)}`;
            return `${totalTxt}`; 
        }
      }]
    },
    onContentReady(e) {
      var grid = e.component;  
      grid.option('loadPanel.enabled', false);
      var selection = grid.getSelectedRowKeys();  
      if(selection.length == 0) {  
          grid.selectRowsByIndexes([0]);  
      }  
    },
    onRowUpdating(e) {
      if (e.newData.hasOwnProperty('status')) {
        if (e.newData['status'] >= e.oldData['status']) {
          if ((e.oldData['status'] == 0) && (e.newData['status'] == 1)) {  //Moving from "prepare" to "confirmed"
            e.newData['dateConfirmed'] = new Date().toISOString().slice(0, 19).replace('T', ' ');
          } else if ((e.oldData['status'] == 1) && (e.newData['status'] == 2)) {  //Moving from "comfirmed" to "ready"
          } else if ((e.oldData['status'] == 2) && (e.newData['status'] == 3)) {  //Moving from "ready" to "shipped" 
            e.newData['dateDispatched'] = new Date().toISOString().slice(0, 19).replace('T', ' ');
          } else if ((e.oldData['status'] == 3) && (e.newData['status'] == 4)) {  //Moving from "shipped" to "complete" 
            e.newData['dateCompleted'] = new Date().toISOString().slice(0, 19).replace('T', ' ');
          } else {
            e.cancel = false;
          }
        } else {
          screenLog(formatMessage("cantupgrade"), 'error')
          e.cancel = true;
        }
      } else {
        if (e.oldData['status'] > 2) {
          screenLog(formatMessage("orderdispatched"), 'error')
          e.cancel = true;
        } else {
          e.cancel = false;
        }
       
      }
    },
    onCellPrepared(e) {
      if (e.rowType === "data") {
        if (e.row.data['status'] == 0) {
            e.cellElement.css({
                "color":"rgb(50,50,50)",
                "background-color":"rgb(220,180,20)"
            })
        } else if (e.row.data['status'] == 1) {
            e.cellElement.css({
                "color":"rgb(30,30,30)",
                "background-color":"rgb(120,255,120)"
              })
        } else if (e.row.data['status'] == 2) {
            e.cellElement.css({
                "color":"rgb(30,30,30)",
                "background-color":"rgb(60,155,60)"
            })
        } else if (e.row.data['status'] == 3) {
            e.cellElement.css({
                "color":"rgb(240,240,240)",
                "background-color":"rgb(20,60,125)"
            })
        }
      }
    },
    onRowInserted(e) {
      console.log(e.data)
      let data = e.data;
      window.location = `/shoppingcart?${data.orderxID}`;
    },
    
    onRowDblClick(e) {
        if (e.key !== 0) {
          let data = e.data;
          window.location = `/shoppingcart?${data.orderxID}`;
        }
    },
    onRowRemoving(e) {
      if (e.key !== 0) {
        if (e.data.status > 2) {
          screenLog(formatMessage("alreadyPaid"), 'error')
          e.cancel = true;
        } else {
          console.log(e.data);
          sendRequest(`/deletealldocs/orderxrego/${subdir}`, 'POST', {
            orderxID: e.data.orderxID
          }).done(function (datx){
            e.cancel = false;
          })
        }
      }
    },
    onEditingStart(e) {
      mode = 'edit';  
    },
    onInitNewRow() {
        mode = 'new';
    },
  }).dxDataGrid('instance');

  function editCellTemplate(cellElement, cellInfo) {
    let filelist = [], status=0;
    if ((typeof cellInfo.value === 'undefined') || (mode == 'new')) {
    } else {
      
      //console.log("cellInfo.value: " + cellInfo.value);
      let fileUploaderElement = document.createElement("div");
      let inputElement = document.createElement("input");
      inputElement.setAttribute('id', 'file_upload');
      inputElement.setAttribute('type', 'file');
      inputElement.setAttribute('multiple', 'true');

      fileUploaderElement.append(inputElement);
      cellElement.append(fileUploaderElement);

      initImageView(cellInfo.value.split("/")[0], cellInfo.value.split("/")[1])
      
    }
  }
//***************************************************** */
function dynamicSort(property) {
  var sortOrder = 1;
  if(property[0] === "-") {
      sortOrder = -1;
      property = property.substr(1);
  }
  return function (a,b) {
      var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
      return result * sortOrder;
  }
}
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
        if (url.includes('/distlist')) {
          result.sort(dynamicSort('company'))
        }
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
            summary: result.totalSummary,
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

/****************  IMAGES ************************ */
function initImageView(orderxID,status) {
  const maxFileUpload = 6;
  var docImg=[];
  var docPreview=[];
  function getmemberrego() { return $.ajax({ type: 'POST', url: '/getrego/orderxrego', dataType: 'json', data: {orderxID:orderxID}  }); }
  $.when(getmemberrego()).done(function (r1) {
      r1.forEach(function (datax) {
          //console.log('datax: '+ JSON.stringify(datax));
          docImg.push(`public/${subdir}/${datax.name}`);
          let doc;
          doc = {'key':datax.orderxregoID}
          docPreview.push(doc);
      })
      //console.dir('docImg: '+ JSON.stringify(docImg, false, 4));
      //console.dir('docPreview: '+JSON.stringify(docPreview));
      //console.log('subdir: '+ subdir);

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
          initialPreviewDownloadUrl: `download/orderxrego`, 
      };
      //console.log('status: ' + status)
      if (status > 3) {
          $.extend(fileuploadOptions,{
              showUpload: false,
              showBrowse: false,
              showRemove: false,
              showCaption: false,
              fileActionSettings: {
                  showDrag: false,
                  showZoom: true,
                  showUpload: false,
                  showRemove: false,
                  
              },
          });
      } else {
          $.extend(fileuploadOptions,{
              showRemove: false,
              uploadUrl: `/uploaddocs/orderxrego/orderxID/${orderxID}/${subdir}`,
              deleteUrl: `/deletedocs/orderxrego/${subdir}`,
              uploadIcon : "<i class='fas fa-upload'></i>",
              removeIcon : "<i class='fas fa-trash-alt'></i>",
              browseIcon : "<i class='fas fa-folder-open'></i>",
              removeClass : 'btn btn-danger',
              allowedFileExtensions: ["jpg", "png", "gif", "pdf", "jpeg", "mp4", "mp3"]
          });
      }
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


$.fn.fileinputLocales['vi'] = {
  sizeUnits: ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'], 
  bitRateUnits: ['B/s', 'KB/s', 'MB/s', 'GB/s', 'TB/s', 'PB/s', 'EB/s', 'ZB/s', 'YB/s'],
  fileSingle: 'file',
  filePlural: 'files',
  browseLabel: `${formatMessage('browse')} &hellip;`,
  removeLabel: formatMessage('delete'),
  removeTitle: 'Clear selected files',
  cancelLabel: 'Cancel',
  cancelTitle: 'Abort ongoing upload',
  pauseLabel: 'Pause',
  pauseTitle: 'Pause ongoing upload',
  uploadLabel: formatMessage('upload'),
  uploadTitle: 'Upload selected files',
  msgNo: 'No',
  msgNoFilesSelected: 'No files selected',
  msgPaused: 'Paused',
  msgCancelled: formatMessage('cancel'),
  msgPlaceholder: 'Select {files} ...',
  msgZoomModalHeading: 'Detailed Preview',
  msgFileRequired: 'You must select a file to upload.',
  msgSizeTooSmall: 'File "{name}" (<b>{size}</b>) is too small and must be larger than <b>{minSize}</b>.',
  msgSizeTooLarge: 'File "{name}" (<b>{size}</b>) exceeds maximum allowed upload size of <b>{maxSize}</b>.',
  msgFilesTooLess: 'You must select at least <b>{n}</b> {files} to upload.',
  msgFilesTooMany: 'Number of files selected for upload <b>({n})</b> exceeds maximum allowed limit of <b>{m}</b>.',
  msgTotalFilesTooMany: 'You can upload a maximum of <b>{m}</b> files (<b>{n}</b> files detected).',
  msgFileNotFound: 'File "{name}" not found!',
  msgFileSecured: 'Security restrictions prevent reading the file "{name}".',
  msgFileNotReadable: 'File "{name}" is not readable.',
  msgFilePreviewAborted: 'File preview aborted for "{name}".',
  msgFilePreviewError: 'An error occurred while reading the file "{name}".',
  msgInvalidFileName: 'Invalid or unsupported characters in file name "{name}".',
  msgInvalidFileType: 'Invalid type for file "{name}". Only "{types}" files are supported.',
  msgInvalidFileExtension: 'Invalid extension for file "{name}". Only "{extensions}" files are supported.',
  msgFileTypes: {
      'image': 'image',
      'html': 'HTML',
      'text': 'text',
      'video': 'video',
      'audio': 'audio',
      'flash': 'flash',
      'pdf': 'PDF',
      'object': 'object'
  },
  msgUploadAborted: 'The file upload was aborted',
  msgUploadThreshold: 'Processing &hellip;',
  msgUploadBegin: 'Initializing &hellip;',
  msgUploadEnd: 'Done',
  msgUploadResume: 'Resuming upload &hellip;',
  msgUploadEmpty: formatMessage('nodataupload'),
  msgUploadError: 'Upload Error',
  msgDeleteError: 'Delete Error',
  msgProgressError: 'Error',
  msgValidationError: 'Validation Error',
  msgLoading: 'Loading file {index} of {files} &hellip;',
  msgProgress: 'Loading file {index} of {files} - {name} - {percent}% completed.',
  msgSelected: '{n} {files} selected',
  msgProcessing: 'Processing ...',
  msgFoldersNotAllowed: 'Drag & drop files only! Skipped {n} dropped folder(s).',
  msgImageWidthSmall: 'Width of image file "{name}" must be at least <b>{size} px</b> (detected <b>{dimension} px</b>).',
  msgImageHeightSmall: 'Height of image file "{name}" must be at least <b>{size} px</b> (detected <b>{dimension} px</b>).',
  msgImageWidthLarge: 'Width of image file "{name}" cannot exceed <b>{size} px</b> (detected <b>{dimension} px</b>).',
  msgImageHeightLarge: 'Height of image file "{name}" cannot exceed <b>{size} px</b> (detected <b>{dimension} px</b>).',
  msgImageResizeError: 'Could not get the image dimensions to resize.',
  msgImageResizeException: 'Error while resizing the image.<pre>{errors}</pre>',
  msgAjaxError: 'Something went wrong with the {operation} operation. Please try again later!',
  msgAjaxProgressError: '{operation} failed',
  msgDuplicateFile: 'File "{name}" of same size "{size}" has already been selected earlier. Skipping duplicate selection.',
  msgResumableUploadRetriesExceeded:  'Upload aborted beyond <b>{max}</b> retries for file <b>{file}</b>! Error Details: <pre>{error}</pre>',
  msgPendingTime: '{time} remaining',
  msgCalculatingTime: 'calculating time remaining',
  ajaxOperations: {
      deleteThumb: 'file delete',
      uploadThumb: 'file upload',
      uploadBatch: 'batch file upload',
      uploadExtra: 'form data upload'
  },
  dropZoneTitle: 'Drag & drop files here &hellip;',
  dropZoneClickTitle: '<br>(or click to select {files})',
  fileActionSettings: {
      removeTitle: 'Remove file',
      uploadTitle: 'Upload file',
      uploadRetryTitle: 'Retry upload',
      downloadTitle: 'Download file',
      rotateTitle: 'Rotate 90 deg. clockwise',
      zoomTitle: 'View details',
      dragTitle: 'Move / Rearrange',
      indicatorNewTitle: 'Not uploaded yet',
      indicatorSuccessTitle: 'Uploaded',
      indicatorErrorTitle: 'Upload Error',
      indicatorPausedTitle: 'Upload Paused',
      indicatorLoadingTitle:  'Uploading &hellip;'
  },
  previewZoomButtonTitles: {
      prev: 'View previous file',
      next: 'View next file',
      rotate: 'Rotate 90 deg. clockwise',
      toggleheader: 'Toggle header',
      fullscreen: 'Toggle full screen',
      borderless: 'Toggle borderless mode',
      close: 'Close detailed preview'
  }
};
});
