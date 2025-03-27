$(() => {
  DevExpress.config({ defaultCurrency: 'VND' });
  var parentGroupID = $('#groupid').text();
  var roleID = $('#roleid').text();
  var selectedRowIndex = -1;
  //****** label header ******/
  $('#pagetitle').html(`${formatMessage('prescription')}`); 
  $('#illness').html(`${formatMessage('illness')}`); 
  //**************************/
  console.log("parentGroupID: " + parentGroupID  +', roleID: '+ roleID )


  
//******************************************** */
    const illnessName = `illness_${locale}`;
    var iid = 0;
    const URL0 = '';
    const tbl0 = "illness";
    const primekey0 = "illnessID";
    const illnessStore = new DevExpress.data.CustomStore({
        key: primekey0,
        load() {
            return sendRequest(`${URL0}/illness/${parentGroupID}`);
        },
    });
    $('#illnessContainer').dxSelectBox({
        dataSource: illnessStore,
        dropDownOptions: {
            showTitle: false,
        },
        displayExpr: function(item) {
            return item && item.illnessID + '-' + item.illness_vi
        },
        valueExpr: 'illnessID',
        searchEnabled: true, 
        placeholder:formatMessage('selectillness'), 
        onSelectionChanged: function (e) {
            //console.log("evalues: " + JSON.stringify(e.selectedItem, false, 4))
            iid = e.selectedItem.illnessID;
            $('#toaContainer').dxDataGrid("instance").refresh()
        },
    });

    var lookupProductSource = {
        store: new DevExpress.data.CustomStore({
            key: 'productID',
            loadMode: 'raw',
            load: function() {
                return sendRequest(`/product/${parentGroupID}`, 'POST')
            }
        }),
        sort: "memberID"
    };
/******************************************** */  
    var selectedRowIndex0=-1;
    var tid = -1;
    var agegroupid = -1;
    var toaprice = 0.00; 
    var toacost = 0.00; 
    const URL = '';
    const tbl = "toa";
    const primekey = "toaID";
    const toaStore = new DevExpress.data.CustomStore({
      key: primekey,
      load() {
        return sendRequest(`${URL}/toa/${parentGroupID}/${iid}`);
      },
      insert(values) {
        values[`groupID`] = parentGroupID;
        console.log(JSON.stringify(values,false,4))
        return sendRequest(`${URL}/new/${tbl}`, 'POST', {
          data: JSON.stringify(values),
        });
      },
      update(key, values) {
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
  
    const grid0 = $('#toaContainer').dxDataGrid({
      dataSource: toaStore,
      allowColumnReordering: true,
      allowColumnResizing: true,
      columnAutoWidth: true,
      showBorders: true,
      wordWrapEnabled: true,
      searchPanel: {
        visible: true,
        width: 240
      },
      paging: {
        pageSize: 20,
      },
      pager: {
        showPageSizeSelector: true,
        allowedPageSizes: [20, 24],
        showInfo: true,
        showNavigationButtons: true,
        infoText: `${formatMessage('page')} {0} ${formatMessage('of')} {1} ({2} ${formatMessage('records')})`
      },
      editing: {
        mode: 'row',
        allowUpdating: ((parentGroupID>1) && ((roleID==6) || ((divisionID==1) && (roleID==1))))?true:false,
        allowAdding: ((parentGroupID>1) && ((roleID==6) || ((divisionID==1) && (roleID==1))))?true:false,
        allowDeleting: ((parentGroupID>1) && ((roleID==6) || ((divisionID==1) && (roleID==1))))?true:false,
        useIcons: true,
        popup: {
          title: 'Customer Info',
          showTitle: true,
          width: 700,
          height: 550,
        },
      },
      selection: {
        mode: 'single',
      },
      loadPanel: {
        enabled: true,
      },  
      onContentReady(e) {
          var grid = e.component;  
          grid.option('loadPanel.enabled', false);
          var selection = grid.getSelectedRowKeys();  
          if(selection.length == 0) {  
              grid.selectRowsByIndexes([0]);  
          }  
      },
      hoverStateEnabled: true,
      scrolling: {
        rowRenderingMode: 'virtual',
      },
      rowAlternationEnabled: true,
      columns: [
        { dataField:'toaID',
          caption: 'ID',
          width: 50,
        },
        { dataField: `agegroup`,
            caption: formatMessage('agegroup'),
            validationRules: [{ type: 'required' }],
            width: 130,
            visible: true,
            setCellValue(rowData, value) {
              rowData.agegroup = value;
              rowData.weight = null;
            },
            lookup: {
                dataSource: ageSource,
                valueExpr: "ageid",
                displayExpr: "statext"
            }
        },
        { dataField: `weight`,
            caption: formatMessage('weight'),
            validationRules: [{ type: 'required' }],
            width: 100,
            visible: true,
            lookup: {
              dataSource(options) {
                return {
                  store: weightSource,
                  filter: options.data ? ['ageid', '=', options.data.agegroup] : null,
                  sort: ['title']
                };
              },
              valueExpr: "weightid",
              displayExpr: "statext"
            }
        },
        { dataField: `cough`,
            caption: formatMessage('cough'),
            validationRules: [{ type: 'required' }],
            width: 85,
            visible: true,
            lookup: {
                dataSource: coughSource,
                valueExpr: "status",
                displayExpr: "statext"
            }
        },
        { dataField: `headacefever`,
          caption: formatMessage('headacefever'),
          validationRules: [{ type: 'required' }],
          width: 70,
          visible: true,
          showEditorAlways: true,
          datatype: 'boolean',
      },
        { dataField: `stomach`,
            caption: formatMessage('stomach'),
            validationRules: [{ type: 'required' }],
            width: 60,
            visible: true,
            showEditorAlways: true,
            datatype: 'boolean',
        },
        { dataField: `sleepy`,
            caption: formatMessage('sleepy'),
            validationRules: [{ type: 'required' }],
            width: 60,
            visible: true,
            showEditorAlways: true,
            datatype: 'boolean',
        },
        { dataField: `diabetic`,
            caption: formatMessage('diabetic'),
            validationRules: [{ type: 'required' }],
            width: 60,
            visible: true,
            showEditorAlways: true,
            datatype: 'boolean',
        },
        { dataField: `bloodpressure`,
            caption: formatMessage('bloodpressure'),
            validationRules: [{ type: 'required' }],
            width: 60,
            visible: true,
            showEditorAlways: true,
            datatype: 'boolean',
        },
        { dataField: `allergy`,
          caption: formatMessage('allergymed'),
          validationRules: [{ type: 'required' }],
          width: 60,
            visible: true,
            showEditorAlways: true,
            datatype: 'boolean',
        },
        { dataField: `priceoption`,
            caption: formatMessage('priceoption'),
            validationRules: [{ type: 'required' }],
            width: 100,
            visible: true,
            lookup: {
                dataSource: priceSource,
                valueExpr: "status",
                displayExpr: "statext"
            }
        },
        
        { dataField: 'comment',
            caption: formatMessage('comment'),
            width: 120,
            calculateDisplayValue: function(rowData){
              return rowData.comment && rowData.comment.substr(0,20)+'...';
            },
            visible: true
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
            width: 120,
            allowEditing: false, 
            visible: false,
            format: locale=='en'?'dd MMM, yyyy':'dd MMMM M, yyyy'
        },
        { type: 'buttons',
            width: 80,
            buttons: ['edit', 'delete'],
        },
      ],
      toolbar: {
        items: [
          {
            location: 'after',
            widget: 'dxButton',
            options: {
              icon: 'copy',
              text: formatMessage('copyprescription'),
              onClick() {
                if (tid > -1) {
                  const deferred = $.Deferred();
                  $.ajax({
                      url: `/copyprescription/${tid}`,
                      method: "POST",
                      data: null,
                      dataType: "json",
                      success: function(datax) {
                          if (datax.status == 0) {
                              deferred.resolve(false);
                              screenLog(formatMessage('failed'),'warning');
                          } else  {
                              deferred.resolve(true);
                              $('#toaContainer').dxDataGrid("instance").refresh()
                          }
                         
                      },
                      error: function() {
                          deferred.reject("Data Loading Error");
                      },
                      timeout: 5000
                  });
                  deferred.promise();
                } else {
                  screenLog(formatMessage('failed'),'warning');
                }
                
              },
            },
          },
          {
            location: 'after',
            widget: 'dxButton',
            options: {
              icon: 'copy',
              text: formatMessage('copyprescriptionbyage'),
              onClick() {
                if (agegroupid > -1) {
                  const deferred = $.Deferred();
                  $.ajax({
                      url: `/copyprescription/${tid}/${agegroupid}`,
                      method: "POST",
                      data: null,
                      dataType: "json",
                      success: function(datax) {
                          if (datax.status == 0) {
                              deferred.resolve(false);
                              screenLog(formatMessage('failed'),'warning');
                          } else  {
                              deferred.resolve(true);
                              $('#toaContainer').dxDataGrid("instance").refresh()
                          }
                      },
                      error: function() {
                          deferred.reject("Data Loading Error");
                      },
                      timeout: 5000
                  });
                  deferred.promise();
                } else {
                  screenLog(formatMessage('failed'),'warning');
                }
              },
            },
          },
          {
            name: 'addRowButton',
            showText: 'always',
            options: {
              text: formatMessage('addnewprescription')
            }
          },
          {
            name: 'searchPanel',
            showText: 'always',
            options: {
              text: 'Search...'
            }
          },
        ],
      },
      onEditorPreparing: function(e) {
        if (e.parentType === "dataRow" && (
          (e.dataField === "headacefever") || 
          (e.dataField === "stomach") || 
          (e.dataField === "sleepy") || 
          (e.dataField === "diabetic") || 
          (e.dataField === "allergy") || 
          (e.dataField === "bloodpressure"))) {
          e.editorElement.dxCheckBox({
            value: e.value,
            readOnly: e.readOnly,
            onValueChanged: function(ea) {
              if (ea.value)
                e.setValue(1);
              else
                e.setValue(0);
            } 
          });
          e.cancel = true;
        }
      },
      onInitNewRow: function(e) {
        e.data.illnessID = iid;
        e.data.agegroup = 0;
        e.data.weight = 0;
        e.data.cough = 0;
        e.data.headacefever = 0;
        e.data.stomach = 0;
        e.data.sleepy = 0;
        e.data.diabetic = 0;
        e.data.bloodpressure = 0;
        e.data.allergy = 0;
        e.data.priceoption = 0;
        e.data.status = 1;           
      },
      onContentReady(e) {
        var grid = e.component;  
        var selection = grid.getSelectedRowKeys();  
        if(selection.length == 0) {  
            grid.selectRowsByIndexes([0]);  
        }  
      },
      onSelectionChanged(e) {
        selectedRowIndex = e.component.getRowIndexByKey(e.selectedRowKeys[0]);
        const data = e.selectedRowsData[0];
        if (data) {
          tid = data.toaID;
          agegroupid = data.agegroup;
          $('#medicationContainer').dxDataGrid("instance").refresh()
        }
      },
      onRowDblClick(e) {
        if (e.key !== 0) {
          grid0.editRow(selectedRowIndex);
        }
      },

    }).dxDataGrid('instance');
    //******************** Products ***************** */
    var selectedRowIndex=-1;
    const tbl2 = "toaproduct";
    const primekey2 = "toaproductID";
    const toaproductStore = new DevExpress.data.CustomStore({
      key: primekey2,
      load() {
        if (tid > 0) {
            return sendRequest(`${URL}/toaproduct/${tid}`, 'POST');
        }      
      },
      insert(values) {
        values[`toaID`] = tid;
        console.log(JSON.stringify(values,false,4))
        return sendRequest(`${URL}/new/${tbl2}`, 'POST', {
          data: JSON.stringify(values),
        });
      },
      update(key, values) {
        values[`${primekey2}`] = key;
        return sendRequest(`${URL}/update/${tbl2}`, 'POST', {
          data:  JSON.stringify(values)
        });
      },
      remove(key) {
        let datax = {};
        datax[`${primekey2}`] = key;
        return sendRequest(`${URL}/delete/${tbl2}`, 'POST', {
          data: JSON.stringify(datax)
        });
      }
    });
    const grid = $('#medicationContainer').dxDataGrid({
      dataSource: toaproductStore,
      columnAutoWidth: true,
      showBorders: true,
      wordWrapEnabled: true,
      searchPanel: {
        visible: true,
        width: 240
      },
      editing: {
        mode: 'row',
        allowUpdating: true,
        allowAdding: true,
        allowDeleting: true,
        useIcons: true,
      },
      selection: {
        mode: 'single',
      },
      loadPanel: {
        enabled: true,
      },
      scrolling: {
        mode: 'virtual',
      },
      sorting: {
        mode: 'none',
      },
      onContentReady(e) {
        e.component.option('loadPanel.enabled', false);
      },
      hoverStateEnabled: true,
      rowAlternationEnabled: true,
      columns: [
        { dataField:'toaproductID',
            caption: 'ID',
            width: 80,
            visible: false
        },
        { dataField: 'productID',
            caption: formatMessage('name'),
            width: 200,
            lookup: {
              dataSource: lookupProductSource,
              valueExpr: "productID",
              displayExpr: "productName"
            },
            validationRules: [{ type: 'required' }] 
        },
        { dataField: 'qty',
            caption: formatMessage('qty'),
            dataType: "number",
            width: 55,
        },
        { dataField: 'unitPrice2',
            caption: formatMessage('unitprice2'),
            allowEditing: false,
            width: 70,
            format: {
                type: 'currency',
                precision: 0  
            }  
         },
        { dataField : 'unitMeasure2',
            caption: formatMessage('unitmeasure2'),
            width: 60,
            allowEditing: false,
            lookup: {
                dataSource: unitmeasureSource2,
                valueExpr: "status",
                displayExpr: "statext"
            }
        },
        { dataField: 'subtotal',
            caption: formatMessage('subtotal'),
            dataType: "number",
            width: 80,
            allowEditing: false,
            calculateCellValue: function(rowData){
              return rowData.unitPrice2 * rowData.qty;
            },
            format: {
                type: 'currency',
                precision: 0  
            }  
        },
        { type: 'buttons',
            width: 80,
            buttons: ['edit', 'delete'],
        },
      ],
      onSelectionChanged(e) {
        selectedRowIndex = e.component.getRowIndexByKey(e.selectedRowKeys[0]);
      },
      onInitNewRow: function(e) {
        e.data.qty = 1;        
      },
      onRowDblClick(e) {
        if (e.key !== 0) {
          grid.editRow(selectedRowIndex);
        }
      },
      toolbar: {
        items: [
          {
            name: 'addRowButton',
            showText: 'always',
            options: {
              text: formatMessage('addnewmedication')
            }
          },
          {
            name: 'searchPanel',
            showText: 'always',
            options: {
              text: 'Search...'
            }
          },
        ],
      },
      summary: {
        totalItems: [{
            name: 'usubtotalSummary',
            showInColumn: 'subtotal',
            valueFormat: 'currency', 
            displayFormat: "{0}",
            summaryType: 'custom',
        },
        {
            name: 'utotalSummary',
            showInColumn: 'productID',
            valueFormat: 'currency', 
            displayFormat: "Giá bán: {0}",
            summaryType: 'custom',
        }],
        calculateCustomSummary(options) {
          if (options.name === 'usubtotalSummary') {
            switch(options.summaryProcess) {
              case "start":
                  options.totalValue = 0;
                  break;
              case "calculate":
                  options.totalValue += options.value.qty * options.value.unitPrice2;
                  break;
              case "finalize":
                  toacost = options.totalValue;
                  break;
            }
          } else if (options.name === 'utotalSummary') {
            switch(options.summaryProcess) {
              case "start":
                  options.totalValue = 0;
                  break;
              case "calculate":
                  options.totalValue += options.value.qty * options.value.unitPrice2;
                  break;
              case "finalize":
                  if (options.totalValue <= 6000) {
                    options.totalValue = 10000;
                  } else if (options.totalValue <= 8000) {
                    options.totalValue = 12000;
                  } else if (options.totalValue <= 11000) {
                    options.totalValue = 14000;
                  } else if (options.totalValue <= 14000) {
                    options.totalValue = 18000;
                  } else if (options.totalValue <= 17000) {
                    options.totalValue = 22000;
                  } else if (options.totalValue <= 20000) {
                    options.totalValue = 25000;
                  } else {
                    options.totalValue =  25000 + (options.totalValue - 20000);
                  }
                  toaprice = options.totalValue;
                  break;
            }
          }
          
        },
      },
      onRowUpdated(e) {
        updatingToaPrice();
      },
      onRowInserted(e) {
        updatingToaPrice();
      },
      onRowRemoved(e) {
        updatingToaPrice();
      },
    
    }).dxDataGrid('instance');

  
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
  
    function updatingToaPrice() {
      const deferred = $.Deferred();
      $.ajax({
          url: `/update/toa`,
          method: "POST",
          data: {
            toaID: tid,
            toaprice: toaprice,
            toacost: toacost
          },
          dataType: "json",
          success: function(datax) {
              if (datax.status == 0) {
                  deferred.resolve(false);
                  screenLog(formatMessage('failed'),'warning');
              } else  {
                  deferred.resolve(true);
              }
              
          },
          error: function() {
              deferred.reject("Data Loading Error");
          },
          timeout: 5000
      });
      deferred.promise();
    }

});
