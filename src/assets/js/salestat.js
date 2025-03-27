$(() => {
  $('#pagetitle').html(`${formatMessage('salestat')}`);
  var defCatName = '';
  var defBrandName = '';
  var curYear = new Date().getFullYear();
  const URL = ''; 
  var roleID = $('#roleid').text();
  setTimeout(expand1, 4000);
//***************************************************** */
const chartStore = new DevExpress.data.CustomStore({
  key: 'productID',
  load() {
    return sendRequest(`${URL}/saledata`);
  }
});
const pivotGridChart = $('#pivotgrid-chart').dxChart({
  commonSeriesSettings: {
    type: 'bar',
  },
  tooltip: {
    enabled: true,
    format: {
      type: 'fixedPoint',
      precision: 0  
    },
    customizeTooltip(args) {
      return {
        html: `${args.seriesName} | Total >${args.valueText}`,
      };
    },
  },
  size: {
    height: 200,
  },
  adaptiveLayout: {
    width: 450,
  },
}).dxChart('instance');

const pivotGrid = $('#pivotgrid').dxPivotGrid({
  allowSortingBySummary: true,
  allowFiltering: true,
  showBorders: true,
  showColumnGrandTotals: true,
  showRowGrandTotals: true,
  showRowTotals: false,
  showColumnTotals: false,
  allowExpandAll: true,
  fieldChooser: {
    enabled: true,
    height: 400,
  },
  texts: {
    grandTotal: formatMessage('total'),
    total: formatMessage('subtotal'),
  },
  dataSource: {
    store: chartStore,
    fields: [{ 
      caption: formatMessage('brand'),
      width: 100,
      dataField: 'brandName',
      area: 'row',
    },{      
        caption: formatMessage('category'),
        width: 90,
        dataField: 'categoryName',
        area: 'row',
    },{      
        caption: formatMessage('product'),
        width: 300,
        dataField: 'productName',
        area: 'row',
        sortBySummaryField: 'Total'
    },{      
      dataField: 'date',
      dataType: 'date',
      area: 'column',
    }, {
      groupName: 'date',
      groupInterval: 'month',
      visible: true,
    }, {
      caption: 'Total',
      dataField: 'subtotal',
      dataType: 'number',
      summaryType: 'sum',
      format: {
        type: 'fixedPoint',
        precision: 0  
      },
      area: 'data',
    }]
  },
}).dxPivotGrid('instance');

pivotGrid.bindChart(pivotGridChart, {
  dataFieldsDisplayMode: 'splitPanes',
  alternateDataFields: false,
});

function expand1() {
  var ar1 = [defBrandName];
  var cur1 = [curYear];
  var ar2 = [defBrandName, defCatName];
  var cur2 = [curYear, 'Q1'];
  const dataSource = pivotGrid.getDataSource();
  dataSource.expandHeaderItem('row', ar1);
  dataSource.expandHeaderItem('column', cur1);
  setTimeout(function(){
    const dataSource = pivotGrid.getDataSource();
    dataSource.expandHeaderItem('row', ar2);
    dataSource.expandHeaderItem('column', cur2);
  }, 100);
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
        if (url.includes('/saledata')) {
          defCatName = result.catName;
          defBrandName = result.brandName;
          d.resolve(result.result);
        } else {
          d.resolve(result);
        }
        
      
    }).fail((xhr) => {
      d.reject(xhr.responseJSON ? xhr.responseJSON.Message : xhr.statusText);
    });

    return d.promise();
  }


});
