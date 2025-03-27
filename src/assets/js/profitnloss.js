$(() => {
  DevExpress.config({ defaultCurrency: 'VND' });
  $('#pagetitle').html(`${formatMessage('profitnloss')}`);
  const URL = ''; 
  var roleID = $('#roleid').text();
  let drillDownDataSource = {};
  var f = new Date();
  f.setMonth(f.getMonth() - 36);

  var todate= moment().endOf('month');
  var fromdate= moment(todate).subtract(36, 'month');

  var lang = getLocale();
  var valid = 0;
//***************************************************** */
const chartStore = new DevExpress.data.CustomStore({
  key: '',
  load() {
    return sendRequest(`${URL}/getAccPL`,'POST',{
      valid: valid,
      fromdate:  fromdate.format("YYYY-MM-DD"),
      todate: todate.format("YYYY-MM-DD"),
    });
  }
});

const pivotGrid = $('#pivotgrid').dxPivotGrid({
  allowSortingBySummary: true,
  allowFiltering: true,
  showBorders: true,
  showColumnGrandTotals: true,
  showColumnTotals: true,
  showRowGrandTotals: true,
  showRowTotals: true,
  allowExpandAll: true,
  onCellClick(e) {
    if (e.area === 'data') {
      const pivotGridDataSource = e.component.getDataSource();
      const rowPathLength = e.cell.rowPath.length;
      const rowPathName = e.cell.rowPath[rowPathLength - 1];
      const popupTitle = ` ${formatMessage('drilldown')} ${rowPathName || formatMessage('total')}`;

      drillDownDataSource = pivotGridDataSource.createDrillDownDataSource(e.cell);
      xferpopup.option('title', popupTitle);
      xferpopup.show();
    }
  },
  texts: {
    grandTotal: formatMessage('netincome'),
    total: formatMessage('total'),
  },
  dataSource: {
    store: chartStore,
    fields: [{   
      dataField: `gpname_${lang}`,
      width: 70,
      area: 'row',
      sortOrder: 'asc',
      expanded: true
    }, {   
      dataField: `pname_${lang}`,
      width: 100,
      area: 'row',
      expanded: true
    }, {   
      dataField: `name_${lang}`,
      width: 140,
      area: 'row'
    }, {   
      dataField: 'datePaid',
      dataType: 'date',
      area: 'column',
    }, {
      groupName: 'date',
      groupInterval: 'month',
      visible: true,
    }, {
      caption: formatMessage('amount'),
      dataField: 'Subtotal',
      dataType: 'number',
      summaryType: 'sum',
      format: {
        type: 'currency',
        precision: 0  
      },
      area: 'data',
    }, {
      caption: formatMessage('tax'),
      dataField: 'Subtax',
      dataType: 'number',
      summaryType: 'sum',
      format: {
        type: 'currency',
        precision: 0  
      },
      area: 'data',  
    }, {
      caption: formatMessage('total'),
      dataField: 'STotal',
      dataType: 'number',
      summaryType: 'sum',
      format: {
        type: 'currency',
        precision: 0  
      },
      area: 'data', 
    }]
  
      
  },
  
  onContentReady: function () {  
    // Small Text  
    $(".dx-group-row.dx-row > td").css("paddingBottom", "4px");  
    $(".dx-datagrid .dx-row > td").css("padding", "4px");  
    $(".dx-widget").css("fontSize", "14px"); 
  },  
  onCellPrepared(e) {
    const { cell } = e;
    cell.area = e.area;
    if (isTotalCell(cell) || isGrandTotalCell(cell) ) {
      const appearance = getConditionalAppearance(cell);
      Object.assign(e.cellElement.get(0).style, getCssStyles(appearance));
    }
    e.cellElement.css("font-size", "13px");
    if (e.area == 'row' ){
        e.cellElement.css("background-color", "#798881"); //Grey
        e.cellElement.css("color", "white");
    } else if (e.area == "column"){
        e.cellElement.css("background-color", "#359f6e"); //Green
        e.cellElement.css("color", "white");
    } else if (e.area == "data"){

             
    } else {

    }
  },
}).dxPivotGrid('instance');

const xferpopup = $('#xferpopup').dxPopup({
  width: 840,
  height: 580,
  showCloseButton: true,
  contentTemplate(contentElement) {
    $('<div />')
      .addClass('drill-down')
      .dxDataGrid({
        width: '800px',
        height: '560px',
        columns: [
          { dataField: 'id',
            caption: formatMessage('id'),
            dataType: "number",
            width: 80,
          },
          { dataField: `name_${lang}`,
            caption: formatMessage('category'),
            dataType: "number",
            width: 200,
          },
          { dataField: 'Subtotal',
            caption: formatMessage('total'),
            dataType: "number",
            width: 160,
            format: {
              type: 'currency',
              precision: 0  
            },
          },
          { dataField: 'Subtax',
            caption: formatMessage('tax'),
            dataType: "number",
            width: 160,
            format: {
              type: 'currency',
              precision: 0  
            },
          },
          { dataField: 'datePaid',
            caption: formatMessage('dateadded'),
            dataType: "date",
            width: 140,
          }
        ],
        summary: {
          totalItems: [{ 
              showInColumn: `name_${lang}`,
              displayFormat: `${formatMessage('numorders')} {0}`,
              summaryType: 'count'
          }, {    
              column: 'Subtotal',
              valueFormat: 'currency', 
              displayFormat: "{0}",
              summaryType: 'sum'
          }, {    
              column: 'Subtax',
              valueFormat: 'currency', 
              displayFormat: "{0}",
              summaryType: 'sum'
          }],
          
        },
        
      })
      .appendTo(contentElement);
  },
  onShowing() {
    $('.drill-down')
      .dxDataGrid('instance')
      .option('dataSource', drillDownDataSource);
  },
  onShown() {
    $('.drill-down')
      .dxDataGrid('instance')
      .updateDimensions();
  },
}).dxPopup('instance');

function getCssStyles(appearance) {
  return {
    'background-color': `#${appearance.fill}`,
    color: `#${appearance.font}`,
    'font-weight': appearance.bold ? 'bold' : undefined,
  };
}

function isDataCell(cell) {
  return (cell.area === 'data' && cell.rowType === 'D' && cell.columnType === 'D');
}

function isTotalCell(cell) {
  return (cell.type === 'T'  || cell.rowType === 'T'|| cell.columnType === 'T');
}

function isGrandTotalCell(cell) {
  return (cell.type === 'GT' || cell.rowType === 'GT' || cell.columnType === 'GT');
}

function getConditionalAppearance(cell) {
  if (isTotalCell(cell)) {
    return { fill: 'E2E2E2', font: '3F3F3F', bold: true };
  }
  if (isGrandTotalCell(cell)) {
    return { fill: 'C2C2D2', font: '3F3F3F', bold: true };
  }
  
  return { font: '9C6500', fill: 'FFEB9C' };
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
        //console.table(result)
        d.resolve(result);
      
    }).fail((xhr) => {
      d.reject(xhr.responseJSON ? xhr.responseJSON.Message : xhr.statusText);
    });

    return d.promise();
  }


});
