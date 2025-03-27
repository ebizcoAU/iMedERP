
$(() => {
    var memberID = $('#memberid').text();
    var roleID =$('#roleid').text();
    var divisionID = $('#divisionid').text();
    var parentGroupID = $('#groupid').text();
    $('#pagetitle').html(formatMessage('payroll'));
    $('#summary').html(formatMessage('leavesummary'));
    var subdir = $('#subdir').text();
    var selectedMem=null;
    var selectedpayroll=null;
    var holidayentitlement;
    var sickentitlement;
    var longentitlement;
    var status = 1;

$.post(`/getPayrollMember`, {
    memberID: memberID  
}).done(function (data){
    if (data.status) {
        screenLog(formatMessage('invalidmember'), 'error');
    } else {
        selectedMem = data[0];
        grid.refresh();
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
            return sendRequest(`${URL}/getPayroll/${memberID}`, 'POST');
        }
      }
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
      pageSize: 10,
      },
      pager: {
          showPageSizeSelector: true,
          allowedPageSizes: [10, 16],
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
        allowUpdating: false,
        allowAdding: false,
        allowDeleting: false,
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
            width:'70'
        },
        {   dataField : 'fromDT',
            caption: formatMessage('fromdate'),
            dataType: 'date',
            width: 100,
            allowEditing: true,
            visible: true,
            format: locale=='en'?'dd MMM, yyyy':'dd/MM/yyyy'
        }, 
        {   dataField : 'toDT',
            caption: formatMessage('todate'),
            dataType: 'date',
            width: 100,
            allowEditing: true,
            visible: true,
            format: locale=='en'?'dd MMM, yyyy':'dd/MM/yyyy'
        },
        { dataField: 'amount',
            caption: formatMessage('amount'),
            width: 120,
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
            width: 120,
            allowEditing: false,
            format: {
                type: 'currency',
                precision: 0  
            }  
        },
        { dataField: 'employeesuper',
            caption: formatMessage('employeesuper'),
            width: 130,
            allowEditing: false,
            format: {
                type: 'currency',
                precision: 0  
            }  
        },
        { dataField: 'totalPaid',
            caption: formatMessage('netamount'),
            width: 130,
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
            width: 100,
            allowEditing: false,
            visible:true,
            format: locale=='en'?'dd MMM, yyyy':'dd/MM/yyyy'
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
      onContentReady(e) {
          var grid = e.component;  
          grid.option('loadPanel.enabled', false);
          var selection = grid.getSelectedRowKeys();  
          if(selection.length == 0) {  
            grid.selectRowsByIndexes([0]);  
            $('#notex').html(`
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
                  e.cellElement.addClass('text-dark');
              } else {
              }
          }
      },
      
      onRowDblClick(e) {
        if (e.rowType == 'data') {
          selectedpayroll = e.data;
          $('#offcanvasLeft').offcanvas('show');
          status = selectedpayroll.status;
          $('#payrollItemContainer').dxDataGrid("instance").refresh()
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
      }
      
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
    pageSize: 15,
    },
    pager: {
        showPageSizeSelector: true,
        allowedPageSizes: [15, 20],
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
        allowUpdating: false,
        allowAdding: false,
        allowDeleting: false,
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
      { dataField: 'workDate',
          caption: formatMessage('workdate'),
          dataType: 'date',
          width: 100,
          sortIndex: 0, 
          sortOrder: "desc",
          visible: true,
          format: locale=='en'?'dd MMM, yyyy':'dd/MM/yyyy'
      },        
      { dataField: 'numHours',
        caption: formatMessage('normal'),
        width: 70,
        allowEditing: false,
      },  
    { dataField: 'numHours2',
        caption: formatMessage('overtime'),
        width: 50,
        allowEditing: false,
    },
    { dataField: 'totalx2',
        caption: formatMessage('factor'),
        allowEditing: false,
        width: 50,
        alignment: 'right',
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
        alignment: 'right',
        calculateDisplayValue: function(rowData) {
            if (rowData && rowData.paytype2 >= 0) {
                return  Math.round(((rowData.numHours2 * paytypeSource.filter(f=>f.status==rowData.paytype2)[0].factor) + rowData.numHours) *100)/100;
            } else {
                return 0
            }
        },
    }
    
    ],
    summary: {
      totalItems: [{
            name: 'totalxSummary',
            showInColumn: 'numHours',
            displayFormat: "{0}",
            summaryType: 'custom',
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
            console.log(selectedpayroll) ;
            if (selectedpayroll) {
                let datefrom = new Date(selectedpayroll.fromDT);
                let dateto = new Date(selectedpayroll.toDT);
                let datestr = `${datefrom.toLocaleDateString()} - ${dateto.toLocaleDateString()} `;
                $('#payrollidx').html(datestr);
            }
            
        } 
        
    },
    
}).dxDataGrid('instance');
    
    
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
  
    
   
   
    
    
    
})