$(() => {
  DevExpress.config({ defaultCurrency: 'VND' });
  $('#pagetitle').html(`${formatMessage('expense')}`);

  var fromdate= moment().startOf('month');
  var todate= moment(fromdate).add(1, 'month');

  //**************************/
  var parentGroupID = $('#groupid').text();
  var roleID = $('#roleid').text();
  var divisionID = $('#divisionid').text();
  var memberID = $('#memberid').text();
  var memberName = $('#name').text();
  var subdir = $('#subdir').text();
  var selectedaccount=0;
  var lang = getLocale();
  var incLiability = 0;
  var mode;
  var accountlist = [];
//************************* */
const URLx = ''; 
const tblx = "account";
const primekeyx = "accountID";
const memberStorex = new DevExpress.data.CustomStore({
    key: primekeyx,
    load() {
        return sendRequest(`${URL}/getExpAccount`);
    },
});

//************************************************ */
const gridx = $('#listContainer').dxDataGrid({
    dataSource: memberStorex,
    allowColumnReordering: true,
    allowColumnResizing: true,
    columnAutoWidth: true,
    showBorders: true,
    remoteOperations: false,
    wordWrapEnabled: true,
    paging: {
        pageSize: 60,
    },
    pager: {
        showPageSizeSelector: true,
        allowedPageSizes: [24, 28],
        showInfo: true,
        showNavigationButtons: true,
        infoText: `${formatMessage('page')} {0} ${formatMessage('of')} {1} ({2} ${formatMessage('records')})`
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
    {   dataField: 'accountID',
        caption: formatMessage('id'),
        allowEditing: false,
        visible: false,
        width: 80,
    },
    {   dataField: 'parentName',
        caption: '',
        groupIndex: 0,
        sortIndex: 0, 
        sortOrder: "asc",
    },
    { dataField: `accountName_${lang}`,
        caption: 'Account Name',
        sortIndex: 2, 
        sortOrder: "asc"
    }],
    onContentReady(e) {
        var grid = e.component;  
        grid.option('loadPanel.enabled', false);
        var selection = grid.getSelectedRowKeys();  
        if(selection.length == 0) {  
            grid.selectRowsByIndexes([0]);  
        }  
    },
    
    onRowClick(e) {
        if ((e.key !== 0) && (e.rowType=='data')) {
            let data = e.data;
            selectedaccount = data.accountID;
            grid.refresh()
        }
    },
   
}).dxDataGrid('instance');
//************************* */
const URL = ''; 
const tbl = "expenses";
const primekey = "expensesID";
const memberStore = new DevExpress.data.CustomStore({
    key: primekey,
    load() {
        return sendRequest(`${URL}/getExpenses`, 'POST', {
          incLiability: incLiability,
          accid: selectedaccount,  
          fromdate:  fromdate.format("YYYY-MM-DD"),
          todate: todate.format("YYYY-MM-DD"),
        })
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

//************************************************ */
  var supplierDataSource = {  
    store: new DevExpress.data.CustomStore({
      key: "memberID",
      loadMode: "raw",
      load: function() {
        return sendRequest(`${URL}/get/memberx/roleID/greaterequal/7/AND/groupID/eq/${parentGroupID}`, 'POST');
       }
    }) 
  }  

  var accountDataSource = {  
    store: new DevExpress.data.CustomStore({
      key: "accountID",
      loadMode: "raw",
      load: function() {
        return sendRequest(`${URL}/getExpAccount`);
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
    paging: {
        pageSize:18,
    },
    pager: {
        showPageSizeSelector: true,
        allowedPageSizes: [18, 24],
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
        mode: 'form',
        allowUpdating: ((parentGroupID>1) && ((roleID==6) || ((divisionID==1) && (roleID==1))))?true:false,
        allowAdding: ((parentGroupID>1) && ((roleID==6) || ((divisionID==1) && (roleID==1))))?true:false,
        allowDeleting: ((parentGroupID>1) && ((roleID==6) || ((divisionID==1) && (roleID==1))))?true:false,
        useIcons: true,
        form: {
            labelMode: 'floating',
            items: [{
                itemType: 'group',
                cssClass: 'second-group',
                colCount: 4,
                colSpan: 2,
                items: [{
                  itemType: 'group',
                  items: [{
                        dataField: 'dateAdded',
                    }, {
                        dataField: 'amount',
                        format: "currency",  
                        editorOptions: {  
                          format: " #,##0"  
                        }  
                    }, {
                        dataField: 'tax',
                        format: "currency",  
                        editorOptions: {  
                          format: " #,##0"  
                        }  
                    }, {
                        dataField: 'datePaid',
                        editorType: "dxDateBox"
                    }, {
                        dataField: 'supplierID',
                    }, {
                        dataField: 'accountID',
                    }, {
                        dataField: 'refID',
                  }],
                }, {
                  itemType: 'group',
                  items: [{
                        dataField: 'lastpersonName', 
                    }, {
                        dataField: 'lastChanged', 
                    }, {
                        dataField: 'paytype',
                    }, {
                        dataField: 'status',
                    }, {
                        dataField: 'comment',
                        editorType: 'dxTextArea',
                        colSpan: 2,
                        editorOptions: {
                            height: 120,
                        }, 
                    }],
                }, {
                    itemType: 'group',
                    colSpan: 2,
                    items: [{
                        dataField: 'imgLinkx',
                   }]
                }],
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
        dataField: 'expensesID',
        caption: formatMessage('id') ,
        allowEditing: false,
        width:'80',
        visible: true
    },
    {   dataField : 'supplierID',
        caption: formatMessage('supplier') + '*',
        allowFiltering: false,
        
        lookup: {
            dataSource: supplierDataSource,
            valueExpr: "memberID",
            displayExpr: "namex",
        }
    }, 
    {   dataField : 'accountID',
        caption: formatMessage('account') + ' *',
        allowFiltering: false,
        width: 160,
        lookup: {
            dataSource: accountDataSource,
            valueExpr: "accountID",
            displayExpr: `accountName_${lang}`
        }
    },     
    { dataField: 'paytype',
        caption: formatMessage('paytype'),
        visible: true,
        width: 120,
        lookup: {
            dataSource: paytypeDataSource,
            valueExpr: `status`,
            displayExpr: `statext`
        },
    },
    {  dataField: 'refID',
        caption: formatMessage('reference'),
        width: 120,
        allowEditing: false,
        visible: true,
    },
    {  dataField: 'comment',
        caption: formatMessage('comment'),
        width: 240,
        visible: false,
        calculateDisplayValue: function (rowData) {
            return rowData.comment?rowData.comment.substring(0,80):'';
        }
    },
    { dataField: 'imgLinkx',
        width: 75,
        allowSearch: false,
        allowSorting: false,
        visible: false,
        calculateCellValue: function(rowData) {
            return  rowData.expensesID +'/'+rowData.status+'/'+rowData.refID;
        },
        editCellTemplate: editCellTemplate
    },
    { dataField: 'dateAdded',
        caption: formatMessage('dateadded'),
        alignment: 'right',
        dataType: 'date',
        width: 140,
        allowEditing: false,
        visible: false,
        format: locale=='en'?'dd MMM, yyyy ':'dd/MM/yyyy '
    },
    { dataField: 'datePaid',
        caption: formatMessage('datepaid'),
        dataType: 'date',
        width: 120,
        allowEditing: true,
        visible: true,
        format: locale=='en'?'dd MMM, yyyy ':'dd/MM/yyyy ',
    },
    { dataField: 'lastChanged',
        caption: formatMessage('lastchanged'),
        dataType: 'date',
        width: 120,
        visible:false,
        allowEditing: false,
        format: locale=='en'?'dd MMM, yyyy ':'dd/MM/yyyy '
    },
    { dataField: 'lastpersonName',
        caption: formatMessage('lastperson'),
        width: 120,
        allowEditing: false,
        allowSorting: false,
        allowFiltering: false,
        visible: false 
    },
    
    { dataField : 'status',
        caption: formatMessage('status'),
        width: 90,
        lookup: {
            dataSource: paidStatus,
            valueExpr: "status",
            displayExpr: "statext"
        },
    },
    { dataField: 'amount',
        caption: formatMessage('amount'),
        visible: true,
        width: 120,
        alignment: 'right',
        format: {
          type: 'currency',
          precision: 0  
      },
    },
    { dataField: 'tax',
        caption: formatMessage('tax'),
        visible: true,
        width: 110,
        alignment: 'right',
        format: {
          type: 'currency',
          precision: 0  
      },
    },
    { type: 'buttons',
        width: 100,
        buttons: ['edit', 'delete'],
    },
    ],
    summary: {
        totalItems: [{ 
            column: 'status',
            valueFormat: 'string', 
            displayFormat: formatMessage('total')
        },{  column: 'status',
            valueFormat: 'string', 
            displayFormat: formatMessage('fullypaid')
        },{  column: 'status',
            valueFormat: 'string', 
            displayFormat: formatMessage('notpaidyet')
        },{ 
            column: 'amount',
            valueFormat: 'currency', 
            displayFormat: "{0}",
            summaryType: 'sum',
        },{
            column: 'tax',
            valueFormat: 'currency', 
            displayFormat: "{0}",
            summaryType: 'sum',
            
        }, {
            name: 'upaidAmountTotalSummary',
            showInColumn: 'amount',
            valueFormat: 'currency', 
            displayFormat: "{0}",
            summaryType: 'custom',
        },{
            name: 'upaidTaxTotalSummary',
            showInColumn: 'tax',
            valueFormat: 'currency', 
            displayFormat:  "{0}",
            summaryType: 'custom',
        }, {
            name: 'unotpaidAmountTotalSummary',
            showInColumn: 'amount',
            valueFormat: 'currency', 
            displayFormat: "{0}",
            summaryType: 'custom',
        },{
            name: 'unotpaidTaxTotalSummary',
            showInColumn: 'tax',
            valueFormat: 'currency', 
            displayFormat: "{0}",
            summaryType: 'custom',
          
        }],
        calculateCustomSummary(options) {
            switch (options.name ) {
              case 'upaidAmountTotalSummary': 
                if (options.summaryProcess === 'start') {
                  options.totalValue = 0;
                }
                if (options.summaryProcess === 'calculate') {
                  if (options.value.status==1) {
                    options.totalValue += options.value.amount;
                  }
                }
              break;
              case 'upaidTaxTotalSummary': 
                if (options.summaryProcess === 'start') {
                  options.totalValue = 0;
                }
                if (options.summaryProcess === 'calculate') {
                  if (options.value.status==1) {
                    options.totalValue += options.value.tax;
                  }
                }
              break;
              case 'unotpaidAmountTotalSummary': 
                if (options.summaryProcess === 'start') {
                  options.totalValue = 0;
                }
                if (options.summaryProcess === 'calculate') {
                  if (options.value.status==0) {
                    options.totalValue += options.value.amount;
                  }
                }
              break;
              case 'unotpaidTaxTotalSummary': 
                if (options.summaryProcess === 'start') {
                  options.totalValue = 0;
                }
                if (options.summaryProcess === 'calculate') {
                  if (options.value.status==0) {
                    options.totalValue += options.value.tax;
                  }
                }
              break;
            }
        }
    },
    toolbar: {
        items: [
          {   
            location: 'after',
            widget: 'dxCheckBox',
            options: {
              text: formatMessage('includeliability'),
              value: false,
              onValueChanged(e) {
                if (e.value) incLiability = 1;
                else incLiability = 0;
                grid.refresh()
              },
            },
          }, {
            location: 'after',
            widget: 'dxButton',
            options: {
              icon: 'chevrondoubleleft',
              onClick() {
                fromdate = moment(fromdate).startOf('year');
                fromdate = fromdate.subtract(1,'year');
                todate = moment(fromdate).add(1,'year');
                grid.option('toolbar.items[3].options.value', fromdate);
                grid.option('toolbar.items[4].options.value', todate);
                grid.refresh()
              },
            },
          }, {
            location: 'after',
            widget: 'dxButton',
            options: {
              icon: 'chevronleft',
              onClick() {
                fromdate = moment(fromdate).startOf('month');
                fromdate = fromdate.subtract(1,'month');
                todate = moment(fromdate).add(1,'month');
                grid.option('toolbar.items[3].options.value', fromdate);
                grid.option('toolbar.items[4].options.value', todate);
                grid.refresh()
              },
            },
          },{
            location: 'after',
            widget: 'dxDateBox',
            options: {
              width: 160,
              value: fromdate,
              displayFormat: 'dd/MM/yyyy',
              onValueChanged(e) {
                fromdate = moment(e.value);
                if (fromdate.isBefore(todate)) {
                  grid.refresh()
                }
              },
            },
          }, {
            location: 'after',
            widget: 'dxDateBox',
            options: {
              width: 160,
              value: todate,
              displayFormat: 'dd/MM/yyyy',
              onValueChanged(e) {
                todate = moment(e.value);
                if (fromdate.isBefore(todate)) {
                  grid.refresh()
                }
              },
            },
          }, {
              location: 'after',
              widget: 'dxButton',
              options: {
                icon: 'chevronright',
                onClick() {
                    fromdate = moment(fromdate).startOf('month');
                    fromdate = fromdate.add(1,'month');
                    todate = moment(fromdate).add(1,'month');
                    grid.option('toolbar.items[3].options.value', fromdate);
                    grid.option('toolbar.items[4].options.value', todate);
                    grid.refresh()
                },
              },
          }, {
            location: 'after',
            widget: 'dxButton',
            options: {
              icon: 'chevrondoubleright',
              onClick() {
                fromdate = moment(fromdate).startOf('year');
                fromdate = fromdate.add(1,'year');
                todate = moment(fromdate).add(1,'year');
                grid.option('toolbar.items[3].options.value', fromdate);
                grid.option('toolbar.items[4].options.value', todate);
                grid.refresh()
              },
            },
          }, {
            location: 'after',
            widget: 'dxButton',
            options: {
              text: formatMessage('today'),
              onClick() {
                fromdate = moment();
                todate = moment(fromdate).add(1,'days');
                grid.option('toolbar.items[3].options.value', fromdate);
                grid.option('toolbar.items[4].options.value', todate);
                grid.refresh()
              },
            },
          }, {
            location: 'after',
            widget: 'dxButton',
            options: {
              icon: 'refresh',
              onClick() {
                grid.refresh();
              },
            },
          },
          'addRowButton',
          'exportButton',
          'searchPanel'
        ],
    },
    onContentReady(e) {
        var grid = e.component;  
        grid.option('loadPanel.enabled', false);
        var selection = grid.getSelectedRowKeys();  
        if(selection.length == 0) {  
            grid.selectRowsByIndexes([0]);  
        }  
    },
    onCellPrepared(e) {
        if (e.rowType === "data") {
            if (e.row.data['status'] == 0) {
                e.cellElement.css({
                    "color":"#33333",
                    "background-color":"#ffa3a3",
                })
            }
        }
    },
    onRowUpdating(e) {
        console.log(accountlist)
        if (e.newData.hasOwnProperty('status')) {
          if (e.newData['status'] < e.oldData['status']) {
            screenLog(formatMessage("alreadyPaid"), 'error')
            e.cancel = true;
          } else {
            e.newData['datePaid'] = new Date().toISOString().slice(0, 19).replace('T', ' ');
            e.newData['refID'] = e.oldData['refID'];
            if (e.oldData['accountID'] == accountlist.filter(f=>f.accountName_en == "Equipments|Furnitures")[0].accountID) {
                const deferred = $.Deferred();
                $.ajax({
                    url: `/new/asset`,
                    method: "POST",
                    data: {
                        groupID: parentGroupID,
                        expensesID: e.oldData['expensesID'],
                        name: e.oldData['comment'],
                    },
                    dataType: "json",
                    success: function(data) {
                        if (data.status == 1) {
                            deferred.resolve(false);
                        } else  {
                            screenLog('System Error','warning');
                            deferred.resolve(true);
                        }
                    },
                    error: function() {
                        deferred.reject("Data Loading Error");
                    },
                    timeout: 5000
                });
                e.cancel = deferred.promise();
            } else {
                e.cancel = false; 
            }
          }
        } else if (e.oldData['status'] == 1) {
            screenLog(formatMessage("cantedit"), 'error')
            e.cancel = true;
        } else {
            e.cancel = false; 
        }
    },
    onRowRemoving(e) {
        if (e.key !== 0) {
            if (e.data.status > 2) {
              screenLog(formatMessage("alreadyPaid"), 'error')
              e.cancel = true;
            } else {
              console.log(e.data);
              sendRequest(`/deletealldocs/expensesrego/${subdir}`, 'POST', {
                expensesID: e.data.expensesID
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
      console.log("cellInfo.value: " + cellInfo.value);

      let etype = cellInfo.value.split("/")[2]
      let etypex = etype.split("_")[0];
      if ((etype==0) || (etypex=='S')){
        let fileUploaderElement = document.createElement("div");
        let inputElement = document.createElement("input");
        inputElement.setAttribute('id', 'file_upload');
        inputElement.setAttribute('type', 'file');
        inputElement.setAttribute('multiple', 'true');
  
        fileUploaderElement.append(inputElement);
        cellElement.append(fileUploaderElement);

        let expensesID = cellInfo.value.split("/")[0];
        let status = cellInfo.value.split("/")[1];

        const maxFileUpload = 6;
        
        var docImg=[];
        var docPreview=[];
        function getmemberrego() { return $.ajax({ type: 'POST', url: '/getrego/expensesrego', dataType: 'json', data: {expensesID:expensesID}  }); }
        $.when(getmemberrego()).done(function (r1) {
            r1.forEach(function (datax) {
                //console.log('datax: '+ JSON.stringify(datax));
                let doc;
                if (datax.name.split('.')[1]=='pdf') {
                    docImg.push(`public/${subdir}/${datax.name}`);
                    doc = {key:datax.expensesregoID, size:datax.size, caption:datax.name, type:'pdf'}
                } else {
                    docImg.push(`public/${subdir}/${datax.name}`);
                    doc = {key:datax.expensesregoID, size:datax.size, caption:datax.name}
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
                maxFileSize: 100000,
                initialCaption: formatMessage('fileselect'),
                autoOrientImage: true,
                initialPreviewDownloadUrl: `download/expensesrego`, 
            };
            if (status > 0) {
                $.extend(fileuploadOptions,{
                  showUpload: false,
                  showBrowse: false,
                  showRemove: false,
                  showCaption: false,
                  fileActionSettings: {
                      showDrag: false,
                      showZoom: true,
                      showUpload: true,
                      showRemove: true,
                      
                  },
                });
            } else {
                $.extend(fileuploadOptions,{
                  showUpload: true,
                  showBrowse: true,
                  showRemove: true,
                  showCaption: true,
                  showRemove: true,
                  uploadUrl: `/uploaddocs/expensesrego/expensesID/${expensesID}/${subdir}`,
                  deleteUrl: `/deletedocs/expensesrego/${subdir}`,
                  uploadIcon : "<i class='fas fa-upload'></i>",
                  removeIcon : "<i class='fas fa-trash-alt'></i>",
                  browseIcon : "<i class='fas fa-folder-open'></i>",
                  removeClass : 'btn btn-danger',
                  allowedFileExtensions: ["jpg", "png", "gif", "pdf", "jpeg", "mp4"],
                  fileActionSettings: {
                      showDrag: false,
                      showZoom: true,
                      showUpload: true,
                      showRemove: true,
                  },
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
    $.ajax(url, {
      method,
      data,
      cache: false,
      xhrFields: { withCredentials: true },
    }).done((result) => {
        if (url.includes('/get/memberx')) {
            result.forEach(obj => {
                if (obj.roleID==7) {
                    obj.namex = `${obj.name} (${manDivisionSource.filter(f=>f.status==obj.divisionID)[0].statext})` 
                } else if (obj.roleID==8) {
                    if (obj.divisionID==1) {
                        obj.namex = `${obj.name+' ('+obj.company+')'}` 
                    } else {
                        obj.namex = `${obj.name} (${supplierDivisionSource.filter(f=>f.status==obj.divisionID)[0].statext})` 
                    }
                }
            })
            result.sort(dynamicSort('namex'))
        } else if (url.includes('/getExpAccount')) {
            accountlist = result;
        }
        //console.log(JSON.stringify(result, false, 4))
        d.resolve(result);
      
    }).fail((xhr) => {
      d.reject(xhr.responseJSON ? xhr.responseJSON.Message : xhr.statusText);
    });

    return d.promise();
  }

  function sendRequestARG(url, method = 'GET', data) {
    const d = $.Deferred();
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

  

  


});
