$(() => {
    DevExpress.config({ defaultCurrency: 'VND' });
    $('#pagetitle').html(`${formatMessage('boxsearch')}`);
    if ($('#palletID').text() > 0) {
      $('#header').addClass('visible');
      $('#productNamex').html(`${formatMessage('product')}: ${$('#productName').text()}`);
      $('#refIDx').html(`${formatMessage('pallet')} REFID: ${$('#palletRefID').text()}`);
      $('#uuIDx').html(`${formatMessage('pallet')} UUID: ${$('#uuID').text()}`);
      $('#boxQtyx').html(`${formatMessage('qty')} ${formatMessage('box')}: ${$('#boxQty').text()} ${formatMessage('box')}`);
      $('#dateAdded').html(`${formatMessage('dateadded')}: ${$('#dateAddedx').text()}`);
      $('#status').html(`${formatMessage('status')}: ${qrcodeSource.filter(f => f.status == $('#statusx').text())[0].statext}`);
    } else {
      $('#header').addClass('invisible');
    }
    
    //**************************/
    var parentGroupID = $('#groupid').text();
    var roleID = $('#roleid').text();
    var mode = 'new';
    const URL = ''; 
    const tbl = "box";
    const primekey = "boxID";
    const memberStore = new DevExpress.data.CustomStore({
      key: primekey,
      load(loadOptions) {
        const args = {};
        [
          'skip',
          'take',
          'requireTotalCount',
          'requireGroupCount',
          'sort',
          'filter',
          'totalSummary',
          'group',
          'groupSummary',
        ].forEach((i) => {
          if (i in loadOptions && isNotEmpty(loadOptions[i])) {
            args[i] = JSON.stringify(loadOptions[i]);
          }
        });  
        return sendRequestARG(`${URL}/boxsearchlist/${$('#palletID').text()}`, 'POST', args);
      },
      update(key, values) {
        console.log(JSON.stringify(values, false, 4))
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
  var agentDataSource = {  
    store: new DevExpress.data.CustomStore({
      key: "memberID",
      loadMode: "raw",
      load: function() {
          return $.getJSON(`${URL}/agent/${parentGroupID}`);
      },
    })
  }   
  var productDataSource = {  
    store: new DevExpress.data.CustomStore({
      key: "productID",
      loadMode: "raw",
      load: function() {
          return $.getJSON(`${URL}/product/${parentGroupID}`);
       }
    }) 
  }   
  //************************************************ */
    const grid = $('#profileContainer').dxDataGrid({
      dataSource: memberStore,
      allowColumnReordering: true,
      allowColumnResizing: true,
      columnAutoWidth: true,
      showBorders: true,
      remoteOperations: true,
      wordWrapEnabled: true,
      paging: {
        pageSize: 20,
      },
      pager: {
        showPageSizeSelector: true,
        allowedPageSizes: [20, 50, 100],
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
        mode: 'form',
        allowUpdating: ((parentGroupID > 1) && (roleID < 3))?true:false,
        allowAdding: false,
        allowDeleting: ((parentGroupID > 1) && (roleID < 3))?true:false,
        useIcons: true,
        form: {
          labelMode: 'floating',
          items: [{
            itemType: 'group',
            cssClass: 'first-group',
            colCount: 7,
            colSpan: 2,
            items: [{
              dataField: 'urlLinkx',
              colSpan: 1,
            }, {
              itemType: 'group',
              colSpan: 2,
              items: [{
                dataField: 'refID',
              }, {
                dataField: 'uuID',
              }],
            }, {
              itemType: 'group',
              colSpan: 2,
              items: [{
                dataField: 'urlLink',
              }, {
                dataField: 'productID',
              }],  
            }, {
              itemType: 'group',
              colSpan: 2,
              items: [{
                dataField: 'lastChanged',
              }, {
                dataField: 'status',
              }],    
            }],
          }],
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
        { dataField: 'refID',
          caption: 'REFID',
          allowEditing: false,
        },
        { dataField: 'uuID',
          caption: 'UUID',
          allowEditing: false,
        },
        { dataField: 'urlLink',
          allowEditing: false,
          caption: 'urlLink',
          width: 400,
        },
        { dataField: 'urlLinkx',
          caption:  "QRCODE",
          visible: false,
          width: 225,
          calculateCellValue: function(rowData) {
            return rowData.urlLink;
          },
          editCellTemplate: editCellQRCodeTemplate
        },
        { dataField: 'itemQty',
          allowEditing: false,
          allowFiltering: false,
          width: 55,
          caption: formatMessage('box')
        },
        { dataField: 'agentID',
          allowEditing: false,
          width: 160,
          caption: formatMessage('agent'),
          lookup: {
            dataSource: agentDataSource,
            valueExpr: "memberID",
            displayExpr: "compname"
          }
        },
        { dataField: 'productID',
          allowEditing: false,
          width: 240,
          caption: formatMessage('product'),
          lookup: {
            dataSource: productDataSource,
            valueExpr: "productID",
            displayExpr: "productName"
          }
        },
        { dataField: 'dateAdded',
          caption: formatMessage('dateadded'),
          dataType: 'date',
          width: 130,
          allowEditing: false,
          allowFiltering: false,
          visible: false,
          format: locale=='en'?'dd MMM, yyyy':'dd MMMM M, yyyy'
        },
        { dataField: 'lastChanged',
          caption: formatMessage('lastchanged'),
          dataType: 'date',
          width: 130,
          allowEditing: false,
          allowFiltering: false,
          visible: true,
          format: locale=='en'?'dd MMM, yyyy':'dd MMMM M, yyyy'
        },
        { dataField: 'lastpersonName',
          caption: formatMessage('lastperson'),
          allowEditing: false,
          allowFiltering: false,
          width: 140,
          visible: false
        },
        { dataField : 'status',
          caption: formatMessage('status'),
          width: 120,
          lookup: {
              dataSource: qrcodeSource,
              valueExpr: "status",
              displayExpr: "statext"
          }
        },
        { type: 'buttons',
          width: 100,
          buttons: ['edit', 'delete', 
          { text: formatMessage('download'),
                icon: "download",
                hint: "Download",
                onClick: function (e) {
                  let data = e.row.data;
                  if (data.status >= 1) {
                    window.location = `/prodsearch_${data.boxID}`;
                  } else {
                    screenLog(formatMessage("boxempty"), 'warning');
                  }
                }
          }],
        }
      ],
      onRowRemoving: function(e) {
        console.log("e.status: " + e.data['status']);
        e.cancel = e.data['status'] > 0?true:false ;
      }
      
    }).dxDataGrid('instance');

    function editCellQRCodeTemplate(cellElement, cellInfo) {
      if (typeof cellInfo.value === 'undefined') {
      } else {
        console.log("cellInfo.value: " + cellInfo.value);
        if ((typeof cellInfo.value === 'undefined') || (cellInfo.value === null)) {
          var backendURL = `public/`;
          let imageElement = document.createElement("img");
          imageElement.classList.add("qrcode");
          let imagepath = `${backendURL}logoblank.png`;
          console.log("imagepath: " + imagepath);
          imageElement.setAttribute('src',`${imagepath}`);
          imageElement.setAttribute("width", `140`);
          imageElement.setAttribute("height", `140`);
          cellElement.append(imageElement);
        } else {
          var memberAuthenURL = $('#memberAuthenURL').text();
          let qrcodeElement = document.createElement("div");
          qrcodeElement.classList.add("qrcode");
          new QRCode(qrcodeElement, {
            text: `${cellInfo.value}`,
            width: 130,
            height: 130,
            colorDark : "#000000",
            colorLight : "#ffffff",
            correctLevel : QRCode.CorrectLevel.H
          });
          cellElement.append(qrcodeElement);
        } 
        
      }
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
          d.resolve(result);
        
      }).fail((xhr) => {
        d.reject(xhr.responseJSON ? xhr.responseJSON.Message : xhr.statusText);
      });
  
      return d.promise();
    }
  
  
    function sendRequestARG(url, method = 'GET', data) {
      const d = $.Deferred();
      console.log("url: " + url)
      $.ajax(url, {
        method,
        data,
        cache: false,
        xhrFields: { withCredentials: true },
      }).done((result) => {
          //console.log(JSON.stringify(result, false, 4))
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

    function pad2(n) { return n < 10 ? '0' + n : n }
    function getDateTimeStampString() {
        var date = new Date();
        return pad2(date.getFullYear().toString().slice(-2)) + pad2(date.getMonth() + 1) + pad2( date.getDate()) + pad2( date.getHours() ) + pad2( date.getMinutes() ) + pad2( date.getSeconds()); 
    }
  
  
  });
  