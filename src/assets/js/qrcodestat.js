$(() => {
  $('#pagetitle').html(`${formatMessage('qrcodestat')}`);
  var defDistName = '';
  var defDistStaffName = '';
  var defAgentName = '';
  var curYear = new Date().getFullYear();
  const URL = ''; 
  var roleID = $('#roleid').text();
  var fieldArray = [];
  if (roleID == 1) {
    fieldArray = [{
      caption: formatMessage('distributor'),
      width: 120,
      dataField: 'distName',
      area: 'row',
      sortBySummaryField: 'Total',
    }, {
      caption: formatMessage('diststaff'),
      width: 120,
      dataField: 'diststaffName',
      area: 'row'
    }, {
      caption: formatMessage('agent'),
      width: 120,
      dataField: 'agentName',
      area: 'row'
    }];
    setTimeout(expand1, 2000);
  } else if (roleID == 4) { 
    fieldArray = [{
      caption: formatMessage('diststaff'),
      width: 120,
      dataField: 'diststaffName',
      area: 'row'
    }, {
      caption: formatMessage('agent'),
      width: 120,
      dataField: 'agentName',
      area: 'row'
    }]; 
    setTimeout(expand2, 2000);
  } else if (roleID == 5) { 
    fieldArray = [{
      caption: formatMessage('agent'),
      width: 120,
      dataField: 'agentName',
      area: 'row'
    }]; 
    setTimeout(expand3, 2000); 
  } else {
    fieldArray = [{
      caption: formatMessage('agestaff'),
      width: 120,
      dataField: 'agentstaffName',
      area: 'row'    
    }]
  }
//***************************************************** */
const chartStore = new DevExpress.data.CustomStore({
  key: '',
  load() {
    return sendRequest(`${URL}/chartdata`);
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
    fields: fieldArray.concat([{      
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
    }])
  },
}).dxPivotGrid('instance');

pivotGrid.bindChart(pivotGridChart, {
  dataFieldsDisplayMode: 'splitPanes',
  alternateDataFields: false,
});

function expand1() {
  var ar1 = [defDistName];
  var ar2 = [defDistName,defDistStaffName];
  var ar3 = [defDistName,defDistStaffName,defAgentName];
  var cur1 = [curYear];
  var cur2 = [curYear, 'Q1'];
  const dataSource = pivotGrid.getDataSource();
  dataSource.expandHeaderItem('row', ar1);
  dataSource.expandHeaderItem('column', cur1);
  setTimeout(function(){
    const dataSource = pivotGrid.getDataSource();
    dataSource.expandHeaderItem('row', ar2);
    dataSource.expandHeaderItem('column', cur2);
    setTimeout(function(){
      const dataSource = pivotGrid.getDataSource();
      dataSource.expandHeaderItem('row', ar3);
      dataSource.expandHeaderItem('column', cur2);
    }, 100);
  }, 100);
}

function expand2() {
  var ar1 = [defDistStaffName];
  var cur1 = [curYear, 'Q1'];
  const dataSource = pivotGrid.getDataSource();
  dataSource.expandHeaderItem('row', ar1);
  dataSource.expandHeaderItem('column', cur1);
}

function expand3() {
  var ar1 = [defAgentName];
  var cur1 = [curYear, 'Q1'];
  const dataSource = pivotGrid.getDataSource();
  dataSource.expandHeaderItem('row', ar1);
  dataSource.expandHeaderItem('column', cur1);
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
        //console.log(JSON.stringify(result, false, 4))
        if (url.includes('/chartdata')) {
          if (roleID == 1) {
            defDistName = result.distName;
            defDistStaffName = result.diststaffName;
            defAgentName = result.agentName;
          } else if (roleID == 4) {
            defDistStaffName = result.diststaffName;
            defAgentName = result.agentName;
          } else if (roleID == 5) {
            defAgentName = result.agentName;  
          }
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
