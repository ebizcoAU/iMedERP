$(() => {
  DevExpress.config({ defaultCurrency: 'VND' });
  $('#pagetitle').html(`${formatMessage('revenue')}`);
  
  var fromdate= moment().startOf('month');
  var todate= moment(fromdate).endOf('month');
  
  //**************************/
  var parentGroupID = $('#groupid').text();
  var roleID = $('#roleid').text();
  var subdir = $('#subdir').text();
  var totalAmount, totalTax;
  var mode;

  const URL = ''; 
  const tbl = "sale";
  const tbl1 = "saleitems";
  const primekey = "saleID";
  const memberStore = new DevExpress.data.CustomStore({
    key: primekey,
    load() {
        return sendRequest(`${URL}/salelist`, 'POST', {
          fromdate:  fromdate.format("YYYY-MM-DD"),
          todate: todate.format("YYYY-MM-DD"),
        });
    },
    update(key, values) {
      console.log(JSON.stringify(values, false, 4))
      values[`${primekey}`] = key;
      if ('imgLink' in values) {
        values.imgLink = values.imgLink.split("/").pop();
      }
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

  var manstaffDataSource = {  
    store: new DevExpress.data.CustomStore({
      key: "memberID",
      loadMode: "raw",
      load: function() {
          return $.getJSON(`${URL}/agentStafflist`);
      },
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
      pageSize: 20,
    },
    pager: {
      showPageSizeSelector: true,
      allowedPageSizes: [20, 28],
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
      const worksheet = workbook.addWorksheet('sales');

      DevExpress.excelExporter.exportDataGrid({
          component: e.component,
          worksheet,
          autoFilterEnabled: true,
      }).then(() => {
          workbook.xlsx.writeBuffer().then((buffer) => {
            saveAs(new Blob([buffer], { type: 'application/octet-stream' }), `sales${getDateTimeStampString()}.xlsx`);
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
      allowUpdating:  ((roleID==6) && (divisionID=1))?true:false,
      allowAdding: ((roleID==6) && (divisionID=1))?true:false,
      allowDeleting: ((roleID==6) && (divisionID=1))?true:false,
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
                    dataField: 'dateAdded',
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
                  dataField: 'agentStaffID',
                }, {
                  dataField: 'customerName', 
                }, {
                  dataField: 'customerPhone',
                }]
            }, {
                itemType: 'group',
                items: [{
                    dataField: 'dateAdded',
                }, {
                    dataField: 'incltax', 
                }],
            }, {
              itemType: 'group',
              items: [{
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
              }],
            }],
        }, {
            itemType: 'group',
            cssClass: 'third-group',
            colCount: 5,
            colSpan: 2,
            items: [{
                itemType: 'group',
                colSpan: 2,
                items: [{
                    dataField: 'imgLink',
                }]
              },{
                itemType: 'group',
                colSpan: 3,
                items: [{
                  dataField: 'description',
                  editorType: 'dxTextArea',
                  editorOptions: {
                    height: 270,
                  }
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
        dataField: 'saleID',
        caption: formatMessage('ordersx') ,
        allowEditing: false,
        width:'90',
        visible: true
      },
      { dataField: 'customerPhone',
        caption: formatMessage('phone'),
        allowEditing: false,
        width: 110,
        visible: true,
      },
      { dataField: 'customerName',
        caption: formatMessage('customer'),
        allowEditing: false,
        visible: true,
      },
      { dataField: 'imgLink',
        width: 75,
        allowSearch: false,
        allowSorting: false,
        visible: false,
        calculateCellValue: function(rowData) {
          return subdir +'/'+ rowData.imgLink;
        },
        editCellTemplate: editCellTemplate
      },
      { dataField: 'incltax',
        caption: formatMessage('incltax'),
        allowEditing: false,
        width: 70,
        dataType: 'boolean'
      },
      { dataField: 'agentStaffID',
        caption: formatMessage('salestaff')+ '*',
        allowFiltering: false,
        allowEditing: false,
        width: 140,
        lookup: {
          dataSource: manstaffDataSource,
          valueExpr: "memberID",
          displayExpr: "name"
        } 
      },
     
      { dataField: 'amount',
        caption: formatMessage('amount'),
        width: 110,
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
        width: 190,
        allowEditing: false,
        calculateCellValue: function(rowData){
            return rowData.amount + rowData.tax;
        },
        format: {
            type: 'currency',
            precision: 0  
        }  
      },
      { dataField: 'paytype',
        caption: formatMessage('paytype'),
        allowFiltering: false,
        visible: true,
        width: 100,
        lookup: {
            dataSource: paytypeDataSource,
            valueExpr: `status`,
            displayExpr: `statext`
        },
      },
      { dataField: 'description',
        caption: formatMessage('description'),
        visible: false
      }, 
      { dataField: 'dateAdded2',
        caption: formatMessage('dateadded'),
        dataType: 'date',
        width: 120,
        allowEditing: false,
        autoExpandGroup: false,
        groupIndex: 0,
        visible: true,
        format: locale=='en'?'dd MMM, yyyy':'dd/MM/yyyy',
      },
      
      { dataField: 'lastChanged',
        caption: formatMessage('lastchanged'),
        dataType: 'date',
        width: 120,
        allowEditing: false,
        visible:true,
        format: locale=='en'?'dd MMM, yyyy':'dd/MM/yyyy'
      },
      { dataField : 'status',
        caption: formatMessage('status'),
        allowFiltering: false,
        width: 110,
        lookup: {
            dataSource: statusSource,
            valueExpr: "status",
            displayExpr: "statext"
        }
      },
      { type: 'buttons',
        width: 110,
        buttons: ['edit', 'delete', 
        { text: formatMessage('product'),
            icon: "cart",
            hint: "Shop",
            onClick: function (e) {
                let data = e.row.data;
                window.location = `/shoppingcart?${data.saleID}`;
            }
        }],
      },
    ],
    summary: {
      groupItems: [{
        column: 'saleID',
        summaryType: 'count',
        displayFormat: '{0} orders',
      }, {
        column: 'amount',
        summaryType: 'sum',
        valueFormat: 'currency',
        showInGroupFooter: false,
        displayFormat: '{0}',
        alignByColumn: true,
      }, {
        column: 'tax',
        summaryType: 'sum',
        valueFormat: 'currency',
        showInGroupFooter: false,
        displayFormat: '{0}',
        alignByColumn: true,
      }, {
        column: 'total',
        summaryType: 'sum',
        valueFormat: 'currency',
        showInGroupFooter: false,
        displayFormat: '{0}',
        alignByColumn: true,
      }],
      totalItems: [{ 
        name: 'utotalTotalSummary',
        showInColumn: 'total',
        valueFormat: 'currency', 
        displayFormat: formatMessage('total') + ": {0}",
        summaryType: 'custom', 
      },{
        name: 'ucashTotalSummary',
        showInColumn: 'total',
        valueFormat: 'currency', 
        displayFormat: formatMessage('cash') + ": {0}",
        summaryType: 'custom',
      },{
        name: 'ubankxferTotalSummary',
        showInColumn: 'total',
        valueFormat: 'currency', 
        displayFormat: formatMessage('bankxfer') + ": {0}",
        summaryType: 'custom',
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
      }],
      calculateCustomSummary(options) {
        switch (options.name ) {
          case 'ucashTotalSummary': 
            if (options.summaryProcess === 'start') {
              options.totalValue = 0;
            }
            if (options.summaryProcess === 'calculate') {
              if (options.value.paytype==0) {
                options.totalValue += options.value.amount + options.value.tax;
              }
            }
          break;
          case 'ubankxferTotalSummary': 
            if (options.summaryProcess === 'start') {
              options.totalValue = 0;
            }
            if (options.summaryProcess === 'calculate') {
              if (options.value.paytype==1) {
                options.totalValue += options.value.amount + options.value.tax;
              }
            }
          break;
          case 'utotalTotalSummary': 
            if (options.summaryProcess === 'start') {
              options.totalValue = 0;
            }
            if (options.summaryProcess === 'calculate') {
                options.totalValue += options.value.amount + options.value.tax;
            }
          break;
        }
      }
    },
    toolbar: {
      items: [
        {   
          location: 'after',
          template: `<div id="back">${formatMessage('daterangefilter')}</div>`
        }, {
          location: 'after',
          widget: 'dxButton',
          options: {
            icon: 'chevrondoubleleft',
            onClick() {
              fromdate = moment(fromdate).startOf('quarter');
              fromdate = fromdate.subtract(1,'quarter');
              todate = moment(fromdate).add(1,'quarter');
              grid.option('toolbar.items[4].options.value', fromdate);
              grid.option('toolbar.items[5].options.value', todate);
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
              grid.option('toolbar.items[4].options.value', fromdate);
              grid.option('toolbar.items[5].options.value', todate);
              grid.refresh()
            },
          },
        }, {
          location: 'after',
          widget: 'dxButton',
          options: {
            icon: 'spinleft',
            onClick() {
              fromdate = fromdate.subtract(1,'days');
              todate = moment(fromdate).add(1, 'days');
              grid.option('toolbar.items[4].options.value', fromdate);
              grid.option('toolbar.items[5].options.value', todate);
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
              icon: 'spinright',
              onClick() {
                fromdate = fromdate.add(1,'days');
                todate = moment(fromdate).add(1, 'days');
                grid.option('toolbar.items[4].options.value', fromdate);
                grid.option('toolbar.items[5].options.value', todate);
                grid.refresh()
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
              grid.option('toolbar.items[4].options.value', fromdate);
              grid.option('toolbar.items[5].options.value', todate);
              grid.refresh()
            },
          },
        }, {
          location: 'after',
          widget: 'dxButton',
          options: {
            icon: 'chevrondoubleright',
            onClick() {
              fromdate = moment(fromdate).startOf('quarter');
              fromdate = fromdate.add(1,'quarter');
              todate = moment(fromdate).add(1,'quarter');
              grid.option('toolbar.items[4].options.value', fromdate);
              grid.option('toolbar.items[5].options.value', todate);
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
              grid.option('toolbar.items[4].options.value', fromdate);
              grid.option('toolbar.items[5].options.value', todate);
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
    
    onRowUpdating: function(e) {
      console.log(e.oldData)
      if (e.newData.incltax) {
        e.newData.incltax = 1;
        //e.newData.amount = 
      } else {
        e.newData.incltax = 0;
      }
    },
    
    onRowDblClick(e) {
        if (e.key !== 0) {
          let data = e.data;
          window.location = `/shoppingcart?${data.saleID}`;
        }
    },
   
    onEditingStart(e) {
        mode = 'edit';  
    },
    onInitNewRow() {
        mode = 'new';
    },
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

  function editCellTemplate(cellElement, cellInfo) {
    if ((typeof cellInfo.value === 'undefined') || (mode == 'new')) {
    } else {
      var backendURL = `public/`;
      let buttonElement = document.createElement("div");
      buttonElement.classList.add("retryButton");
    
      
      let imagepath = `${backendURL}logoblank.png`;

      console.log("cellInfo.value: " + cellInfo.value);

      if ((cellInfo.value.split("/")[1] !== 'undefined') && (cellInfo.value.split("/")[1].length > 0)) {
        imagepath =  `${backendURL}${cellInfo.value}`;
      }

      console.log(imagepath)
      var imageElement = `
      <a data-gallery="manual" 
        data-title="" 
         href="${imagepath}" style="object-fit:cover">
          <img src="${imagepath}" id="imgElem" alt="" width='480' height='270' id="myimg">
      </a>
      `;

      cellElement.append(imageElement);


    $('[data-gallery]').on("click", function(e) {
        e.preventDefault();
        var items = $('[data-gallery]').get().map(function (el) {
          return {
            src: $(el).attr('href'),
            title: $(el).attr('data-title')
          }
        });
        var options = {
          index: $(this).index(),
          fixedModalPos: true,
          initModalPos: {
            top: 100,
            bottom: 100
          },
          keyboard: true
        };
        new PhotoViewer(items, options);
      
    });  

  
    
      let fileUploaderElement = document.createElement("div");
      let uploaderElement = document.createElement("div");
      uploaderElement.classList.add('d-flex');
      uploaderElement.classList.add('flex-row');

      uploaderElement.append(fileUploaderElement);
      uploaderElement.append(buttonElement);

      cellElement.append(uploaderElement);
      
      let tablex = "groupx";
      let searchkey = "groupID";
      let field = imagepath.split("/").pop();
      let gid = cellInfo.data.groupID;
      let uploadurl = `uploadimages/${tablex}/${searchkey}/${gid}/${field}` ;
      let deleteurl = `deleteimages/${tablex}/${searchkey}/${gid}/${field}` ;

      console.log("deleteurl: " + deleteurl);

      let deleteButton = $(buttonElement).dxButton({
        text: 'X',
        visible: true,
        onClick: function() {
          $.post(deleteurl, function(data) {
            cellInfo.setValue("");
            imgElem.setAttribute('src', `${backendURL}logoblank.png`);
          })
        }
      }).dxButton("instance");

      let fileUploader = $(fileUploaderElement).dxFileUploader({
        multiple: false,
        accept: "image/*",
        uploadMode: "instantly",
        uploadUrl: uploadurl,
        labelText: '.',
        selectButtonText: formatMessage('fileselect'),
        maxFileSize: 2000000,
        onValueChanged: function(e) {
          let reader = new FileReader();
          reader.onload = function(args) {
            console.log("e.target:"+ args.target.result);
            imgElem.setAttribute('src', args.target.result);
          }
          reader.readAsDataURL(e.value[0]); // convert to base64 string
        },
        onUploaded: function(e){
          //console.log("res: " + e.request.responseText)
          cellInfo.setValue(e.request.responseText);
          //retryButton.option("visible", false);
        },
        onUploadError: function(e){
          let xhttp = e.request;
          if(xhttp.status === 400){
            e.message = e.error.responseText;
          }
          if(xhttp.readyState === 4 && xhttp.status === 0) {
            e.message = "Không kết nối được";
          }
          //retryButton.option("visible", true);
        }

      }).dxFileUploader("instance");
    }
  }




})

