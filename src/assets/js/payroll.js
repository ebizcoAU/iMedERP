$(() => {
    DevExpress.config({ defaultCurrency: 'VND' });
    $('#pagetitle').html(`${formatMessage('payroll')}`);

    var fromdate= moment().startOf('month');
    var todate= moment(fromdate).add(1, 'month');

    //**************************/
    var parentGroupID = $('#groupid').text();
    var roleID = $('#roleid').text();
    var divisionID = $('#divisionid').text();
    var memberID = $('#memberid').text();
    var memberName = $('#name').text();
    var subdir = $('#subdir').text();
    var staffSource = [];
    var selectedMem=null;
    var selectedpayroll=null;
    var status = 1;
    var holidayentitlement;
    var sickentitlement;
    var longentitlement;
    var accountlist;
  
  //************************************************ */
  $.post(`/getPayrollMember`, {  
  }).done(function (data){
      if (data.status) {
          screenLog(formatMessage('invalidmember'), 'error');
      } else {
          staffSource = data;
          staffSource.sort(function(a, b) {
              return a.name.localeCompare(b.name);
          });
          staffSource.forEach(obj => {obj.namex = `${obj.name} (${agentDivisionSource.filter(f=>f.status==obj.divisionID)[0].statext})` })
          selectedMem = staffSource[0];
          grid.refresh();
          $('#staffimgx').attr('src', `public/${subdir}/${staffSource[0].imgLink}`);
          $("#searchBox").dxLookup({
              label:  formatMessage('search'),
              labelMode: 'static',
              value: staffSource[0].memberID,
              cancelButtonText: formatMessage('cancel'),
              noDataText: formatMessage('nodatatext'),
              searchPlaceholder: formatMessage('search'),
              dataSource: new DevExpress.data.DataSource({ 
                  store: staffSource,
                  sort: ['namex'], 
                  key: "[memberID]"
              }),
              valueExpr: "memberID",
              displayExpr: "namex",
              onValueChanged(a) {
                  selectedMem = staffSource.filter(f=> f.memberID === a.value)[0];
                  $('#staffimgx').attr('src', `public/${subdir}/${selectedMem.imgLink}`);
                  grid.refresh();
              },
          }).dxLookup('instance');
      }
  })
  
  
  //************************************************ */
  const URL = ''; 
  const tbl = "payroll";
  const primekey = "payrollID";
  const memberStore = new DevExpress.data.CustomStore({
      key: primekey,
      load(loadOptions) {
        if (selectedMem) {
            return sendRequest(`${URL}/getPayroll/${selectedMem.memberID}`, 'POST');
        }
      },
      insert(values) {
          //console.log(JSON.stringify(values,false,4));
          values[`memberID`] = selectedMem.memberID;
          values[`rateperHour`] = selectedMem.hourlyRate;
          values[`holidayentitlement`] = Math.round(selectedMem.annualLeave/12*100)/100;
          values[`sickentitlement`] = Math.round(selectedMem.sickLeave/12*100)/100;
          values[`longentitlement`] = Math.round(selectedMem.longserviceLeave/12*100)/100;
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
  
  //************************************************ */
  const grid = $('#payrollContainer').dxDataGrid({
      dataSource: memberStore,
      allowColumnReordering: true,
      allowColumnResizing: true,
      columnAutoWidth: true,
      showBorders: true,
      remoteOperations: false,
      wordWrapEnabled: true,
      paging: {
      pageSize: 8,
      },
      pager: {
          showPageSizeSelector: true,
          allowedPageSizes: [8, 12],
          showInfo: true,
          showNavigationButtons: true,
          infoText: `${formatMessage('page')} {0} ${formatMessage('of')} {1} ({2} ${formatMessage('records')})`
      },
      searchPanel: {
          visible: true,
          width: 240,
          placeholder: '.',
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
        allowUpdating:  ((parentGroupID > 1) && (((divisionID==1) && (roleID==6))))?true:false,
        allowAdding:  ((parentGroupID > 1) && (((divisionID==1) && (roleID==6))))?true:false,
        allowDeleting:  ((parentGroupID > 1) && (((divisionID==1) && (roleID==6))))?true:false,
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
        {
            dataField: 'payrollID',
            caption: formatMessage('id') ,
            allowEditing: false,
            width:'50'
        },
        { dataField: 'dateAdded',
            caption: formatMessage('dateadded'),
            dataType: 'date',
            sortIndex: 0, 
            sortOrder: "desc",
            visible: false,
            format: locale=='en'?'dd MMM, yyyy':'dd/MM/yyyy'
        },        
        {   dataField : 'fromDT',
            caption: formatMessage('fromdate'),
            dataType: 'date',
            allowEditing: true,
            visible: true,
            format: locale=='en'?'dd MMM, yyyy':'dd/MM/yyyy'
        }, 
        {   dataField : 'toDT',
            caption: formatMessage('todate'),
            dataType: 'date',
            allowEditing: true,
            visible: true,
            format: locale=='en'?'dd MMM, yyyy':'dd/MM/yyyy'
        },
        { dataField: 'numHours',
            caption: formatMessage('numhours'),
            allowEditing: false,
            width: 60,
        },   
        {   dataField: 'rateperHour',
            caption: formatMessage('rateperHour'),
            width: 90,
            allowEditing: false,
            format: {
                type: 'currency',
                precision: 0  
            }  
        },
        { dataField: 'amount',
            caption: formatMessage('amount'),
            width: 110,
            allowEditing: false,
            format: {
                type: 'currency',
                precision: 0  
            },
        },
        { dataField: 'tax',
            caption: formatMessage('incometax'),
            width: 110,
            allowEditing: false,
            format: {
                type: 'currency',
                precision: 0  
            }  
        },
        { dataField: 'employersuper',
            caption: formatMessage('employersuper'),
            width: 110,
            allowEditing: false,
            format: {
                type: 'currency',
                precision: 0  
            }  
        },
        { dataField: 'employeesuper',
            caption: formatMessage('employeesuper'),
            width: 110,
            allowEditing: false,
            format: {
                type: 'currency',
                precision: 0  
            }  
        },
        { dataField: 'totalPaid',
            caption: formatMessage('netamount'),
            width: 110,
            allowEditing: false,
            calculateCellValue: function(rowData) {
                return  rowData.amount - rowData.tax - rowData.employeesuper;
            },
            format: {
                type: 'currency',
                precision: 0  
            }  
        },
        { dataField: 'paidDate',
            caption: formatMessage('datepaid'),
            dataType: 'date',
            width: 110,
            allowEditing: false,
            visible:true,
            format: locale=='en'?'dd MMM, yyyy':'dd/MM/yyyy'
        },
        { dataField: 'lastChanged',
            caption: formatMessage('lastchanged'),
            dataType: 'date',
            width: 100,
            allowEditing: false,
            visible:false,
            format: locale=='en'?'dd MMM, yyyy':'dd/MM/yyyy'
        },
        { dataField: 'lastpersonName',
            caption: formatMessage('lastperson'),
            width: 160,
            allowEditing: false,
            visible: false 
        },
        { dataField : 'status',
            caption: formatMessage('status'),
            allowSorting: false,
            width: 100,
            lookup: {
                dataSource: payrollSource,
                valueExpr: "status",
                displayExpr: "statext"
            }
        },
        { type: 'buttons',
            width: 70,
            buttons: ['edit', 'delete'],
        },
      ],
      summary: {
        totalItems: [{
            column: 'amount',
            summaryType: 'sum',
            valueFormat: 'currency', 
            displayFormat: "{0}",
        }, {    
            column: 'tax',
            summaryType: 'sum',
            valueFormat: 'currency', 
            displayFormat: "{0}",
        }, {    
            column: 'employersuper',
            summaryType: 'sum',
            valueFormat: 'currency', 
            displayFormat: "{0}",
        }, {    
            column: 'employeesuper',
            summaryType: 'sum',
            valueFormat: 'currency', 
            displayFormat: "{0}",
        }, {    
            column: 'totalPaid',
            valueFormat: 'currency', 
            summaryType: 'sum',
            displayFormat: "{0}", 
        }]
      },
      toolbar: {
        items: [
          {   
            location: 'after',
            widget: 'dxButton',
            options: {
              text: formatMessage('copylastmonth'),
              onClick() {
                
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
          }, 
            'addRowButton'
          , {
            location: 'after',
            widget: 'dxButton',
            options: {
              icon: 'refresh',
              onClick() {
                grid.refresh();
              },
            },
          },
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
            $('#cardbody').html(`
            <div>
                <p class='pt-4'>${formatMessage('holidayentitlement')}: </p>
                <p class='ps-3'>${holidayentitlement} ${formatMessage('date')}</p>
                <hr class="mt-2 mb-3"/>
                <p>${formatMessage('sickentitlement')}: </p>
                <p class='ps-3'>${sickentitlement} ${formatMessage('date')}</p>
                <hr class="mt-2 mb-3"/>
                <p>${formatMessage('longentitlement')}: </p>
                <p class='ps-3'>${longentitlement} ${formatMessage('date')}</p>
            </div>

            `);
              
          }  
      },
      
      onCellPrepared(e) {
          if (e.rowType === "data") {
              if (e.row.data['status'] == 0) {
                  e.cellElement.addClass('bg-warning');
                  e.cellElement.addClass('text-dark');
              } else if (e.row.data['status'] == 1) {
                  e.cellElement.addClass('bg-success');
                  e.cellElement.addClass('text-white');
              } else {
              }
          }
      },
      onRowUpdated(e) {
        selectedpayroll = e.data;
        grid2.refresh();
      },
      onRowUpdating(e) {
          if (e.newData.hasOwnProperty('status')) {
            if (e.newData['status'] == 1) { //Moving from "Prososed" to "Ready"
                let url = `/newPayroll`;
                $.post(url, { 
                    groupID: parentGroupID,
                    supplierID: e.oldData['memberID'],
                    amount: e.oldData['amount'],
                    tax:  e.oldData['tax'],
                    employersuper: e.oldData['employersuper'],
                    employeesuper: e.oldData['employeesuper'],
                    payingamount: e.oldData.amount - e.oldData.tax - e.oldData.employeesuper,
                    refID:  `P_${e.oldData['payrollID']}`,
                    comment: `${e.oldData.fromDT} - ${e.oldData.toDT}`
                }, function (daty) {
                    if (daty.status==0) {
                        screenLog(formatMessage("processing"), 'error')  
                    }
                })
            } else {
              e.cancel = false;
            }
          } else {
            if (e.oldData['status'] > 0) {
              if (roleID==1) {
                  e.cancel = false;
              } else {
                  screenLog(formatMessage("processing"), 'error')  
                  e.cancel = true;
              }  
            } else {
              e.cancel = false;
            }
          }
      },
      onSelectionChanged(selectedItems) {
        selectedpayroll = selectedItems.selectedRowsData[0];
        $('#payrollItemContainer').dxDataGrid("instance").refresh()
      },
      onRowRemoving(e) {
        if (e.key !== 0) {
            if (e.data.status > 2) {
                e.cancel = true;
            } else {
                let data = e.data;
                let promise1;
                let url = `/delete/payrollitem`;
                promise1 = new Promise((resolve, reject) => {
                    $.post(url, { 
                      data: JSON.stringify({payrollID:data.payrollID})
                    }).done(function (datx){
                        resolve(datx)
                    })
                })
                Promise.all([promise1]).then((values) => {
                    e.cancel = false;
                    grid2.refresh()
                });
            }
        }
      },
      onInitNewRow: function (e) { 
        var date = new Date();
        let startOfMonth =  new Date(date.getFullYear(), date.getMonth(), 1);
        let endOfMonth =  new Date(date.getFullYear(), date.getMonth()+1, 0);
        e.data.fromDT = startOfMonth;  
        e.data.toDT = endOfMonth;  
      } , 
      onRowInserted(e) {
        selectedpayroll.payrollID = e.data.newid;
        grid2.refresh()
      },
      
      onRowDblClick(e) {
        if (e.rowType == 'data') {
            e.component.editRow(e.rowIndex)
        }      
      },
      onFocusedCellChanging(e) {
            if ((e.newColumnIndex === 0 && e.prevColumnIndex === e.columns.length - 1) && e.component.hasEditData()) {
                e.component.saveEditData();
            }
      },
  }).dxDataGrid('instance');

//*********************************************************** */ 
const tbl2 = "payrollitem";
const primekey2 = "payrollitemID";
const memberStore2 = new DevExpress.data.CustomStore({
      key: primekey2,
      load(loadOptions) {
          if (selectedpayroll) {
            return sendRequest(`${URL}/getPayrollItem/${selectedpayroll.payrollID}`, 'POST');
          }
      },
      insert(values) {
          //console.log(JSON.stringify(values,false,4));
          values[`payrollID`] = selectedpayroll.payrollID ;
          return sendRequest(`${URL}/new/${tbl2}`, 'POST', {
              data: JSON.stringify(values),
          });
      },
      update(key, values) {
        console.log(JSON.stringify(values, false, 4))
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
      },
});
const grid2 = $('#payrollItemContainer').dxDataGrid({
    dataSource: memberStore2,
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
        allowedPageSizes: [10, 12],
        showInfo: true,
        showNavigationButtons: true,
        infoText: `${formatMessage('page')} {0} ${formatMessage('of')} {1} ({2} ${formatMessage('records')})`
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
      allowUpdating: ((parentGroupID > 1) && (((divisionID==1) && (roleID==6))))?true:false,
      allowAdding: ((parentGroupID > 1) && (((divisionID==1) && (roleID==6))))?true:false,
      allowDeleting: ((parentGroupID > 1) && (((divisionID==1) && (roleID==6))))?true:false,
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
      {
          dataField: 'payrollitemID',
          caption: formatMessage('id') ,
          allowEditing: false,
          width:'110'
      },
      { dataField: 'workDate',
          caption: formatMessage('workdate'),
          dataType: 'date',
          width: 140,
          sortIndex: 0, 
          sortOrder: "desc",
          visible: true,
          format: locale=='en'?'dd MMM, yyyy':'dd/MM/yyyy'
      },        
      { dataField: 'paytype',
        caption: formatMessage('wagetype') + '#1',
        width: 160,
        allowEditing: false,
        calculateDisplayValue: function(rowData) {
            return  formatMessage('normal');
        },
      },  
      { dataField: 'numHours',
          caption: formatMessage('numhours'),
          allowEditing: false,
          width: 90,
          allowEditing: true,
      }, 
     
    { dataField: 'paytype2',
        caption: formatMessage('wagetype') + '#2',
        allowEditing: false,
        width: 160,
        allowEditing: true,
        setCellValue(rowData, value) {
            rowData.paytype2 = value;
            rowData.factor2 = paytypeSource.filter(f=>f.status==value)[0].factor;
        },
        lookup: {
            dataSource: paytypeSource,
            valueExpr: "status",
            displayExpr: "statext"
        }
    },  
    { dataField: 'numHours2',
        caption: formatMessage('numhours'),
        width: 90,
        allowEditing: true,
    }, 
    { dataField: 'factorx2',
        caption: formatMessage('factor'),
        allowEditing: false,
        width: 100,
        calculateCellValue: function(rowData) {
            if (rowData && rowData.paytype2 >= 0) {
                return paytypeSource.filter(f=>f.status==rowData.paytype2)[0].factor;
            } else {
                return 1
            }
            
        },
    }, 
    { dataField: 'totalx2',
        caption: formatMessage('subtotal'),
        allowEditing: false,
        calculateDisplayValue: function(rowData) {
            if (rowData && rowData.paytype2 >= 0) {
                return  Math.round(rowData.numHours2 * paytypeSource.filter(f=>f.status==rowData.paytype2)[0].factor *100)/100;
            } else {
                return 0
            }
        },
    },  
    
    { dataField: 'totalxx',
        caption: formatMessage('total'),
        allowEditing: false,
        calculateDisplayValue: function(rowData) {
            if (rowData && rowData.paytype2 >= 0) {
                return  Math.round(((rowData.numHours2 * paytypeSource.filter(f=>f.status==rowData.paytype2)[0].factor) + rowData.numHours) *100)/100;
            } else {
                return 0
            }
        },
    }, 
     
      { type: 'buttons',
          width: 80,
          buttons: ['edit', 'delete'],
      },
    ],
    summary: {
      totalItems: [{
            name: 'totalxSummary',
            showInColumn: 'numHours',
            displayFormat: "{0}",
            summaryType: 'custom',
      }, {    
        column: 'numHours2',
        summaryType: 'sum',
        displayFormat: "{0}",
      }, {  
            name: 'totalx2Summary',
            showInColumn: 'totalx2',
            displayFormat: "{0}",
            summaryType: 'custom',
      }, {  
        name: 'totalxxSummary',
        showInColumn: 'totalxx',
        displayFormat: "{0}",
        summaryType: 'custom',
      }],

      calculateCustomSummary(options) {
        if (options.name === 'totalxSummary') {
          if (options.summaryProcess === 'start') {
            options.totalValue = 0;
          }
          if (options.summaryProcess === 'calculate') {
            options.totalValue +=  options.value.numHours
          }
        }
        if (options.name === 'totalx2Summary') {
            if (options.summaryProcess === 'start') {
              options.totalValue = 0;
            }
            if (options.summaryProcess === 'calculate') {
              options.totalValue += options.value.numHours2 * paytypeSource.filter(f=>f.status==options.value.paytype2)[0].factor;
            }
            if (options.summaryProcess === 'finalize') {
                options.totalValue =  Math.round(options.totalValue*100)/100;
            }
        }
        if (options.name === 'totalxxSummary') {
            if (options.summaryProcess === 'start') {
              options.totalValue = 0;
            }
            if (options.summaryProcess === 'calculate') {
              options.totalValue += options.value.numHours;
              options.totalValue += options.value.numHours2 * paytypeSource.filter(f=>f.status==options.value.paytype2)[0].factor;
            }
            if (options.summaryProcess === 'finalize') {
                options.totalValue =  Math.round(options.totalValue*100)/100;
            }
          }
      }
    },
    onContentReady(e) {
        var grid = e.component;  
        grid.option('loadPanel.enabled', false);
        var selection = grid.getSelectedRowKeys();  
        if(selection.length == 0) {  
            grid.selectRowsByIndexes([0]);  
        } 
    },
    onRowInserted(e) {
        updatePayroll(e);
    },
    onRowUpdated(e) {
        updatePayroll(e);
    },
    onRowUpdating(e) {
        if (selectedpayroll.status > 0) {
            screenLog(formatMessage("alreadyPaid"), 'error')  
            e.cancel = true
        } else {
            e.cancel = false;
        }
    },
    onRowDblClick(e) {
        if (e.rowType == 'data') {
            e.component.editRow(e.rowIndex)
        }      
    },
    onFocusedCellChanging(e) {
        if ((e.newColumnIndex === 0 && e.prevColumnIndex === e.columns.length - 1) && e.component.hasEditData()) {
          e.component.saveEditData();
        }
    },
    onRowRemoving(e) {
      if (e.key !== 0) {
          if (e.data.status > 1) {
              screenLog(formatMessage("alreadyPaid"), 'error')  
              e.cancel = true;
          } else {
              let data = e.data;
              let promise1;
              let url = `/delete/payrollitem`;
              promise1 = new Promise((resolve, reject) => {
                  $.post(url, { 
                    data: JSON.stringify({payrollID:data.payrollID})
                  }).done(function (datx){
                      resolve(datx)
                  })
              })
              Promise.all([promise1]).then((values) => {
                  e.cancel = false;
              });
          }
      }
    }
}).dxDataGrid('instance');
  
function updatePayroll(e) {
    let totalHrs1 = e.component.getTotalSummaryValue('totalxSummary')
    let totalHrs2 = e.component.getTotalSummaryValue('totalx2Summary')
    let totalHrs = Math.round((totalHrs1 + totalHrs2)*100)/100;
    console.log(selectedMem)
    console.log(selectedpayroll)
    $.post('update/payroll', {
        payrollID: selectedpayroll.payrollID,
        numHours: totalHrs,
        amount: Math.round(selectedpayroll.rateperHour * totalHrs),
        tax: calculateTaxScale(selectedpayroll.rateperHour * totalHrs),
        employersuper: Math.round(selectedpayroll.rateperHour * totalHrs * selectedMem.employersuper),
        employeesuper:  Math.round(selectedpayroll.rateperHour * totalHrs * selectedMem.employeesuper),
    }).then(function() {
        grid.refresh();
    })
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
          //console.log(JSON.stringify(result, false, 4))
          if (url.includes('/getPayroll/')) {
            holidayentitlement =  result.filter(f=>f.status>1).reduce(function (acc, obj) { return acc + obj.holidayentitlement; }, 0);
            sickentitlement = result.filter(f=>f.status>1).reduce(function (acc, obj) { return acc + obj.sickentitlement; }, 0);
            longentitlement = result.filter(f=>f.status>1).reduce(function (acc, obj) { return acc + obj.longentitlement; }, 0);
          }
          
          d.resolve(result);
        
      }).fail((xhr) => {
        d.reject(xhr.responseJSON ? xhr.responseJSON.Message : xhr.statusText);
      });
  
      return d.promise();
    }
  
    function calculateTaxScale(amount) {
        let tax = 0;
        const incomeTaxSource = [
            { status: 0, statext: 5000000 , tax: 0.05, taxamount: 250000},
            { status: 1, statext: 10000000, tax: 0.10, taxamount: 750000},
            { status: 2, statext: 18000000, tax: 0.15, taxamount: 1950000},
            { status: 3, statext: 32000000, tax: 0.20, taxamount: 4750000},
            { status: 4, statext: 52000000, tax: 0.25, taxamount: 8750000},
            { status: 5, statext: 80000000, tax: 0.30, taxamount: 17150000}
        ];
        
        if (amount > 80000000) {
            tax = ((amount - 80000000) * 0.35) + 17150000;  //Max 35% limit > 80,000,000
        } else if (amount > 52000000) {
            tax = ((amount - 52000000) * 0.30) + 8750000;  
        } else if (amount > 32000000) {
            tax = ((amount - 32000000) * 0.25)+ 4750000;  
        } else if (amount > 18000000) {
            tax = ((amount - 18000000) * 0.20) + 1950000;  
        } else if (amount > 10000000) {
            tax = ((amount - 10000000) * 0.15) + 750000; 
        } else if (amount > 5000000) {
            tax = ((amount - 5000000) * 0.10) + 250000; 
        } else  {
            tax = amount * 0.050;  
        }
        return Math.round(tax);
    }
  
  
  });
  