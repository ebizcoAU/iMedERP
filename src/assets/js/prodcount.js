$(() => {
    DevExpress.config({ defaultCurrency: 'VND' });
    $('#pagetitle').html(`${formatMessage('prodcount')}`);

    var fromdate= moment().startOf('month');
    var todate= moment(fromdate).add(1, 'month');
  

    //**************************/
    var parentGroupID = $('#groupid').text();
    var roleID = $('#roleid').text();
    console.log("parentGroupID: " + parentGroupID)
    var mode = 'new';
    const URL = ''; 
    const tbl = "prodcount";
    const primekey = "prodcountID";
    const memberStore = new DevExpress.data.CustomStore({
      key: primekey,
      load() {
        return sendRequest(`${URL}/prodcount`, 'POST', {
          fromdate:  fromdate.format("YYYY-MM-DD"),
          todate: todate.format("YYYY-MM-DD"),
        });
      },
    });
  
  
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
        pageSize: 18,
      },
      pager: {
        showPageSizeSelector: true,
        allowedPageSizes: [18, 24, 30],
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
        { dataField: 'prodcountID',
          caption: '...',
          width:60
        },
       
        { dataField : 'productName',
          caption: formatMessage('product'),
        },
        { dataField: 'stockqty',
          caption: formatMessage('stockinhand'),
          dataType: "number",
          width: 80,
          format: "0,##0.00"
        },
        { dataField: 'countqty',
            caption: formatMessage('countqty'),
            dataType: "number",
            width: 80,
            format: "0,##0.00"
          },
        { dataField: 'qtyx',
            caption: formatMessage('variedqty'),
            dataType: "number",
            calculateCellValue: function(rowData){
                return rowData.stockqty -  rowData.countqty;
            },
            width: 90,
            format: "0,##0"
        },
        { dataField: 'qtyperBox',
          caption: formatMessage('qtyperbox'),
          dataType: "number",
          width: 80,
          format: "0,##0"
        },
       
        { dataField: 'costperitem',
          caption: formatMessage('unitcostprice'),
          format: {
              type: 'currency',
              precision: 0  
          },
          width: 110    
        },
        
        { dataField: 'ucostTotal',
          caption: formatMessage('total'),
          calculateCellValue: function(rowData){
            return rowData.costperitem * (rowData.stockqty -  rowData.countqty);
          },
          format: {
              type: 'currency',
              precision: 0  
          },
          width: 110    
        },
        { dataField: 'countedDate',
            caption: formatMessage('dateadded'),
            dataType: 'date',
            width: 200,
            format: locale=='en'?'dd MMM, yyyy':'dd MMMM M, yyyy'
        },
        
      ],
      summary: {
        totalItems: [{
            name: 'ucostTotalSummary',
            showInColumn: 'ucostTotal',
            valueFormat: 'currency', 
            displayFormat: "{0}",
            summaryType: 'custom',
        }],
        calculateCustomSummary(options) {
          if (options.name === 'ucostTotalSummary') {
            if (options.summaryProcess === 'start') {
              options.totalValue = 0;
            }
            if (options.summaryProcess === 'calculate') {
                options.totalValue += options.value.costperitem * (options.value.stockqty - options.value.countqty);
            }
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
                fromdate = moment(fromdate).startOf('month');
                fromdate = fromdate.subtract(1,'month');
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
              icon: 'chevronleft',
              onClick() {
                fromdate = fromdate.subtract(1,'days');
                todate = moment(fromdate).add(1, 'days');
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
                  fromdate = fromdate.add(1,'days');
                  todate = moment(fromdate).add(1, 'days');
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
          //console.log(JSON.stringify(result, false, 4))
          d.resolve(result);
        
      }).fail((xhr) => {
        d.reject(xhr.responseJSON ? xhr.responseJSON.Message : xhr.statusText);
      });
  
      return d.promise();
    }

  

  });
  