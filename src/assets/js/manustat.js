$(() => {
  $('#pagetitle').html(`${formatMessage('manustat')}`);
  var defBrandName = '';
  var defCategoryName = '';
  var curYear = new Date().getFullYear();
  const URL = ''; 

//***************************************************** */
const chartStore2 = new DevExpress.data.CustomStore({
  key: '',
  load() {
    return sendRequest(`${URL}/prodmandata`);
  }
});
const pivotGridChart2 = $('#pivotgrid2-chart').dxChart({
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

const pivotGrid2 = $('#pivotgrid2').dxPivotGrid({
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
    store: chartStore2,
    fields: [{
      caption: formatMessage('brand'),
      width: 120,
      dataField: 'brandName',
      area: 'row',
      sortBySummaryField: 'Total',
    }, {
      caption: formatMessage('category'),
      width: 120,
      dataField: 'categoryName',
      area: 'row'
    }, {
      caption: formatMessage('product'),
      width: 120,
      dataField: 'productName',
      area: 'row'
    }, {
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

pivotGrid2.bindChart(pivotGridChart2, {
  dataFieldsDisplayMode: 'splitPanes',
  alternateDataFields: false,
});

function expand2() {
  var ar1 = [defBrandName];
  var ar2 = [defBrandName,defCategoryName];
  var cur1 = [curYear];
  var cur2 = [curYear, 'Q1'];
  const dataSource = pivotGrid2.getDataSource();
  dataSource.expandHeaderItem('row', ar1);
  dataSource.expandHeaderItem('column', cur1);
  setTimeout(function(){
    const dataSource = pivotGrid2.getDataSource();
    dataSource.expandHeaderItem('row', ar2);
    dataSource.expandHeaderItem('column', cur2);
  }, 500);
}

setTimeout(expand2, 1000);
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
        if (url.includes('/prodmandata')) {
            defBrandName = result.brandName;
            defCategoryName = result.categoryName;
            console.log("defBrandName: " +  defBrandName);
            console.log("defCategoryName: " +  defCategoryName);
            d.resolve(result.result);  
        } else {
          d.resolve(result);
        }
        
      
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
        console.log(JSON.stringify(result, false, 4))
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


});
