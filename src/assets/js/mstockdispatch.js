
$(() => {
    var roleID = $('#roleid').text();
    var groupID = $('#groupid').text();
    $('.stockdispatch').html(formatMessage('stockdispatch'));
    $('#datex').html(`<b>${formatMessage('date')}</b>`);
    $.datepicker.regional["vi-VN"] =
    {
      closeText: "Đóng",
      prevText: "Trước",
      nextText: "Sau",
      currentText: "Hôm nay",
      monthNames: ["Tháng Một", "Tháng Hai", "Tháng Ba", "Tháng Tư", "Tháng Năm", "Tháng Sáu", "Tháng Bảy", "Tháng Tám", "Tháng Chín", "Tháng Mười", "Tháng Mười Một", "Tháng Mười Hai"],
      monthNamesShort: ["Một", "Hai", "Ba", "Bốn", "Năm", "Sáu", "Bảy", "Tám", "Chín", "Mười", "Mười một", "Mười hai"],
      dayNames: ["Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"],
      dayNamesShort: ["CN", "Hai", "Ba", "Tư", "Năm", "Sáu", "Bảy"],
      dayNamesMin: ["CN", "T2", "T3", "T4", "T5", "T6", "T7"],
      weekHeader: "Tuần",
      dateFormat: "dd/mm/yy",
      firstDay: 1,
      isRTL: false,
      showMonthAfterYear: false,
      yearSuffix: ""
    };
  
    $.datepicker.setDefaults($.datepicker.regional["vi-VN"]);
    var todayx = timeSolver.getString(new Date(), "YYYY-MM-DD")
    $('#todayx').val(todayx);  //Default when first start

    $( "#todayx" ).datepicker({
      onSelect: function() { 
        var dateObject = $(this).datepicker('getDate'); 
        todayx = timeSolver.getString(dateObject, "YYYY-MM-DD");
        grid.refresh();
      }
    })
    
    var parentGroupID = $('#groupid').text();

    const URL = ''; 
    const tbl = "orderx";
    const primekey = "orderxID";

    const memberStore = new DevExpress.data.CustomStore({
      key: primekey,
      load() {
        return sendRequest(`${URL}/dispatchlist`, 'POST',{
          mode: [2,3,4],
          fromdate: todayx,
          todate: todayx
        });
      },
      update(key, values) {
        console.log(JSON.stringify(values, false, 4))
        values[`${primekey}`] = key;
        return sendRequest(`${URL}/update/${tbl}`, 'POST', {
          data:  JSON.stringify(values)
        });
      }
    });


//************************************************ */
  const grid = $('#orderlist').dxDataGrid({
    dataSource: memberStore,
    allowColumnReordering: true,
    allowColumnResizing: true,
    columnAutoWidth: true,
    showBorders: true,
    remoteOperations: false,
    wordWrapEnabled: true,
    paging: {
      pageSize: 12,
    },
    pager: {
      showPageSizeSelector: true,
      allowedPageSizes: [12, 18, 24],
      showInfo: true,
      showNavigationButtons: true,
      infoText: `${formatMessage('page')} {0} ${formatMessage('of')} {1} ({2} ${formatMessage('records')})`
    },
    searchPanel: {
        visible: false,
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
      allowUpdating: ((parentGroupID > 1) && (roleID < 3))?true:false,
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
        dataField: 'orderNumber',
        caption: formatMessage('ordersx'),
        allowEditing: false,
        width:'90',
        visible: true
      },
      { dataField: 'dateDispatched',
        caption: formatMessage('datedispatched'),
        dataType: 'date',
        allowEditing: false,
        visible: true,
        format: locale=='en'?'dd MMM, yyyy':'dd/MM/yyyy'
      },
      { dataField : 'status',
        caption: formatMessage('status'),
        width: 90,
        lookup: {
            dataSource: progressSource,
            valueExpr: "status",
            displayExpr: "statext"
        }
      },
      { type: 'buttons',
        width: 40,
        buttons: ['edit'],
      }
    ],
    onContentReady(e) {
      var grid = e.component;  
      grid.option('loadPanel.enabled', false);
      var selection = grid.getSelectedRowKeys();  
      if(selection.length == 0) {  
          grid.selectRowsByIndexes([0]);  
      }  
    },
    onRowUpdating(e) {
        if (e.newData.hasOwnProperty('status')) {
            if (e.newData['status'] >= e.oldData['status']) {
              if ((e.oldData['status'] == 2) && (e.newData['status'] == 3)) {  //Moving from "ready" to "complete"
              } else {
              }
              e.cancel = false;
            } else {
                screenLog(formatMessage("cantupgrade"),'warning');
                e.cancel = true;
            } 
        } else {
          if (e.oldData['status'] > 3) {
            screenLog(formatMessage("orderdispatched"),'error');
            e.cancel = true;
          } else {
            e.cancel = false;
          }
        }
    },
    onRowDblClick(e) {
        if (e.key !== 0) {
            console.log(JSON.stringify(e.data,false,4))
            window.location = `/mshoppingcart?${e.data.orderxID}`;
        }
    }
  }).dxDataGrid('instance');
})

//***************************************************** */
function sendRequest(url, method = 'GET', data) {
    const d = $.Deferred();
    $.ajax(url, {
      method,
      data,
      cache: false,
      xhrFields: { withCredentials: true },
    }).done((result) => {
        d.resolve(result);
    }).fail((xhr) => {
      d.reject(xhr.responseJSON ? xhr.responseJSON.Message : xhr.statusText);
    });

    return d.promise();
  }