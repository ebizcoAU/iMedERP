$(() => {
  DevExpress.config({ defaultCurrency: 'VND' });
  window.jsPDF = window.jspdf.jsPDF;
  $('#pagetitle').html(`${formatMessage('rawmon')}`);
  //**************************/
  var roleID = $('#roleid').text();
  var parentGroupID = $('#groupid').text();
  var rawstockID = $('#rawstockid').text();
  const URL = ''; 
  const tbl = "rawstockXfer";
  const primekey = "rawstockXferID";
  const memberStore = new DevExpress.data.CustomStore({
    key: primekey,
    load() {
      return sendRequest(`${URL}/rawstockXfer/${rawstockID}`, 'POST');
    },
    insert(values) {
        console.log(JSON.stringify(values,false,4));
        
        return sendRequest(`${URL}/new/${tbl}`, 'POST', {
            data: JSON.stringify(values),
        });
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
var supplierDataSource = {  
  store: new DevExpress.data.CustomStore({
    key: "memberID",
    loadMode: "raw",
    load: function() {
        return sendRequest(`${URL}/get/memberx/roleID/eq/8/and/status/eq/1`,'POST');
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
    remoteOperations: false,
    wordWrapEnabled: true,
    paging: {
      pageSize: 15,
    },
    pager: {
      showPageSizeSelector: true,
      allowedPageSizes: [15, 30, 100],
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
      allowUpdating: ((parentGroupID > 1) && (((divisionID==1) && (roleID==1)) || ((divisionID==2) && (roleID==2))))?true:false,
      allowAdding: false,
      allowDeleting: ((parentGroupID > 1) && (((divisionID==1) && (roleID==1)) || ((divisionID==2) && (roleID==2))))?true:false,
      useIcons: true,
      
    },
    selection: {
      mode: 'multiple',
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
        dataField: 'rawstockXferID',
        caption: formatMessage('id'),
        allowEditing: false,
        width:70
      },
      {
        dataField: 'rawstockName',
        caption: formatMessage('name'),
        allowEditing: false,
        visible: true
      },
      { dataField : 'vendorID',
        caption: formatMessage('supplier'),
        width: 140,
        lookup: {
          dataSource: supplierDataSource,
          valueExpr: "memberID",
          displayExpr: "company"
        }
      },   
      { dataField: 'vendorItemNo',
        caption: formatMessage('stocknum') ,
        width: 100,
        visible: false
      },
      {
        dataField: 'xferType',
        caption: formatMessage('stockmove'),
        visible: true,
        allowEditing: false,
        width: 120,
        lookup: {
          dataSource: statusSource3,
          valueExpr: "status",
          displayExpr: "statext"
        }
      },
      {
        dataField: 'ordernum',
        caption: formatMessage('ordersx'),
        width:90,
        visible: true,
        allowEditing: false,
        calculateCellValue: function(rowData) {
          return `${rowData.subdir}PO${rowData.rawstockXferID}`;
        },
      },
      {
        dataField: 'refID',
        caption: formatMessage('reference'),
        width:90,
        visible: true
      },
      {
          dataField: 'comment',
          caption: formatMessage('comment'),
          width:'140',
          visible: false
      },
      {   dataField: 'qrcodeID',
          caption:  "QRCODE",
          visible: false,
          width: 225,
          calculateCellValue: function(rowData) {
          //return `${rowData.weburl}/staffqrchk?${rowData.subdir}${rowData.memberID}`; 
              return rowData.qrcodeID
          },
          editCellTemplate: editCellQRCodeTemplate
      },
      { dataField: 'itemcost',
        caption: formatMessage('upurprice'),
        width: 100,
        format: {
            type: 'currency',
            precision: 0  
          }  
      },
      { dataField: 'qty',
        caption: formatMessage('qty'),
        width: 80,
        format: "0,##0"
      },
      { dataField : 'unitMeasure',
        caption: formatMessage('unitmeasure'),
        width: 70,
        allowEditing: false,
        visible: true,
        lookup: {
            dataSource: unitweightSource,
            valueExpr: "status",
            displayExpr: "statext"
        }
      },
      { dataField: 'taxrate',
        caption: formatMessage('taxrate'),
        width: 70,
        format: {
          type: 'percent',
          precision: 2  
        } 
      },
      { dataField: 'incltax',
        caption: formatMessage('incltax'),
        width: 50,
        dataType: 'boolean'
      },
      { dataField: 'totalcost',
        caption: formatMessage('total'),
        width: 120,
        allowEditing: false,
        calculateCellValue: function(rowData){
          return rowData.incltax==1?rowData.qty * rowData.itemcost * (1+rowData.taxrate):rowData.qty * rowData.itemcost ;
        },
        format: {
            type: 'currency',
            precision: 0  
          }  
      },
     
      { dataField: 'dateAdded',
        caption: formatMessage('dateadded'),
        dataType: 'date',
        width: 140,
        allowEditing: false,
        visible: false,
        format: locale=='en'?'dd MMM, yyyy':'dd MMMM M, yyyy'
      },
      { dataField: 'lastChanged',
        caption: formatMessage('lastorderdate'),
        dataType: 'date',
        width: 140,
        allowEditing: false,
        visible: true,
        format: locale=='en'?'dd MMM, yyyy':'dd MMMM M, yyyy'
      },
      { dataField: 'lastpersonName',
        caption: formatMessage('lastperson'),
        width: 130,
        allowEditing: false,
        visible: false 
      },
      { dataField : 'status',
        caption: formatMessage('status'),
        allowEditing: ((parentGroupID > 1) && ((roleID == 1) || ((roleID==2)&&(divisionID==2))))?true:false,
        width: 130,
        lookup: {
            dataSource: purchasexSource,
            valueExpr: "status",
            displayExpr: "statext"
        }
      },
      { type: 'buttons',
        width: 100,
        buttons: ['edit', 'delete', 
        { text: formatMessage('issuepurorder'),
          icon: "pdffile",
          hint: formatMessage('issuepurorder'),
          onClick: function (e) {
            let data = e.row.data;
            const lastPoint = { x: 0, y: 0 };
            console.log(data)
            if ((data.qty > 0) && (data.itemcost>0) && (data.status > 0)) {
              const doc  = new jsPDF({orientation:'portrait'});
              doc.addFileToVFS('Arimo-Regular-normal.ttf', font);
              doc.addFont('Arimo-Regular-normal.ttf', 'Arimo-Regular', 'normal');
              doc.setFont("Arimo-Regular","normal");
              doc.setFontSize(9);
              doc.setTextColor('#333333');
              
              const header = `${formatMessage('podocket')}`;
              const orderNumber =`${formatMessage('ordersx')}: ${data.subdir}PO${data.rawstockID}`;
              const vendorName = `${formatMessage('supplier')}: ${data.company}`;
              const address = `${formatMessage('address')}: ${data.address}`; 
              const phone = `${formatMessage('contactphone')}: ${data.phone}`; 
              const contactname = `${formatMessage('contactname')}: ${data.name}`;  
              const dateordered = data.dateAdded;
              const amount = data.itemcost * data.qty;
              const tax = data.incltax==1?amount * data.taxrate:0;
              const total = amount + tax;
              var amountx = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
              var taxx = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(tax);
              var totalx = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(tax + amount);
              var itemcostx = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(data.itemcost);
              const sxcompany = `${formatMessage('ptyltd')} ${data.sxname}`;
              const sxaddress = `${formatMessage('address')}: ${data.sxaddress}`;
              const sxtax = `${formatMessage('taxid')}: ${data.abn}`;
              const sxphone = `${formatMessage('hotline')}: ${data.hotline}`;
              const amtwords = to_vietnamese(total) + " đồng";
              const bywords = `${formatMessage('byword')}: ${amtwords}`;

              const pageWidth = doc.internal.pageSize.getWidth();
              doc.setFontSize(9);
              doc.text(sxcompany, 15, 8);
              doc.text(sxaddress, 15, 12);
              doc.text(sxtax, 15, 16);
              doc.text(sxphone, 15, 20);

              var img = new Image()
              img.src = `public/${data.subdir}/${data.logox}`;
              doc.addImage(img, 'png', 170, 4, 15, 15)

              doc.setLineWidth(0.5);
              doc.setDrawColor(0,0,255); // draw blue lines
              doc.line(15, 25, 195, 25);

              doc.setFontSize(16);
              doc.text(header, 80, 32).setFont("Arimo-Regular", 'bold');
              doc.setFont("Arimo-Regular","normal");
              doc.setFontSize(10);
              
              doc.text(orderNumber, 15, 42);
              doc.text(vendorName, 15, 47);
              doc.text(address, 15, 52);
              doc.text(dateordered, 145, 42);
              doc.text(phone, 145, 47);
              doc.text(contactname, 145, 52);
              
              doc.setLineWidth(0.5);
              doc.setDrawColor(0,0,0); // draw black lines
              doc.line(15, 60, 195, 60);

              doc.text(formatMessage('name'), 15, 68);
              doc.text(formatMessage('upurprice'), 95, 68);
              doc.text(formatMessage('qty'), 125, 68);
              doc.text(formatMessage('total'), 168, 68);
              doc.text(data.rawstockName, 15, 72);
              doc.textEx(itemcostx.replace(/&nbsp;/g, ' '), 115, 72, 'right', 'middle');
              doc.textEx(data.qty.toString().replace(/&nbsp;/g, ' '), 140, 72, 'right', 'middle');
              doc.textEx(amountx.replace(/&nbsp;/g, ' '), 185, 72, 'right', 'middle');
              

              const spacex =  140;
              doc.setLineWidth(0.5);
              doc.setDrawColor(0,0,0); // draw black lines
              doc.line(15, spacex, 195, spacex);

              doc.textEx(`${formatMessage('subtotal')}`, 145, spacex + 5, 'right', 'middle');
              doc.textEx(`${formatMessage('tax')}`, 145, spacex + 10, 'right', 'middle');
              doc.textEx(`${formatMessage('total')}`, 145, spacex + 15, 'right', 'middle');

              doc.textEx(amountx.replace(/&nbsp;/g, ' '), 185, spacex + 5, 'right', 'middle');
              doc.textEx(taxx.replace(/&nbsp;/g, ' '), 185, spacex + 10, 'right', 'middle');
              doc.textEx(totalx.replace(/&nbsp;/g, ' '), 185, spacex + 15, 'right', 'middle');



              doc.text(bywords, 15, spacex + 20);

              doc.setLineWidth(0.5);
              doc.setDrawColor(0,0,0); // draw black lines
              doc.line(15, spacex+ 24, 195, spacex+ 24);

              doc.text(`${formatMessage('goodreceiver')}`, 15, spacex + 30);
              doc.text(`${formatMessage('storemanger')}`, 85, spacex + 30);
              doc.text(`${formatMessage('manager')}`, 145, spacex + 30);

              const footer = '...';
              // add custom font to file
              
              const footerWidth = doc.getTextDimensions(footer).w;
              doc.text(footer, (lastPoint.x - footerWidth), lastPoint.y + 5);
              doc.save(`${data.subdir}PO${data.rawstockID}.pdf`);
            } else {
              if (data.status==0) {
                screenLog(formatMessage('ponotyetorder'),'error');
              } else {
                screenLog(formatMessage('pofailed'),'error');
              }
            }
          }
        }],
      }
    ],
    onSelectionChanged(e) {
      e.component.refresh(true);
    },
    summary: {
      totalItems: [{
        column: 'rawstockName',
        summaryType: 'min',
        customizeText(itemInfo) {
          return `${formatMessage('total')}`;
        },
      },{
        name: 'qtySummary',
        showInColumn: 'qty',
        displayFormat: "{0}",
        valueFormat: "0,##0",
        summaryType: 'custom',
      },{
        name: 'totalcostSummary',
        showInColumn: 'totalcost',
        valueFormat: 'currency', 
        displayFormat: "{0}",
        summaryType: 'custom',
      }],
      
      calculateCustomSummary(options) {
        if (options.name === 'qtySummary') {
          if (options.summaryProcess === 'start') {
            options.totalValue = 0;
          }
          if (options.summaryProcess === 'calculate') {
            if (options.component.isRowSelected(options.value.rawstockXferID)) {
              if (options.value.xferType == 0) {
                options.totalValue += options.value.qty;
              } else {
                options.totalValue -= options.value.qty;
              }
            }
          }
        }
        if (options.name === 'totalcostSummary') {
          if (options.summaryProcess === 'start') {
            options.totalValue = 0;
          }
          if (options.summaryProcess === 'calculate') {
            if (options.component.isRowSelected(options.value.rawstockXferID)) {
              if (options.value.xferType == 0) {
                options.totalValue += (options.value.qty * options.value.itemcost);
              } else {
                options.totalValue -= (options.value.qty * options.value.itemcost);
              }
            }
          }
        }
      }
    },
    onContentReady(e) {
      e.component.selectAll();  
    },

    onCellPrepared(e) {
      if (e.rowType === "data") {
          if (e.row.data['status'] == 0) {
            e.cellElement.css({
                "color":"rgb(50,50,50)",
                "background-color":"rgb(220,180,20)",
            })
          } else if (e.row.data['status'] == 1) {
            e.cellElement.css({
              "color":"rgb(50,50,50)",
              "background-color":"rgb(255,120,120)",
            })
          } else {    
          }
      }
    },

  onRowUpdating (e) {
      if (e.oldData.status ==2) {
        screenLog(formatMessage('ordercompleted'),'warning');
        e.cancel = true;
      } else {
        if ((e.oldData.status == 1) && (e.newData.status==2)) {
          if ((isNotEmpty(e.oldData.refID)) || (isNotEmpty(e.newData.refID))) {
            const deferred = $.Deferred();
            var datax = e.oldData;
            $.ajax({
                url: `/getrecord/rawstock/${datax.rawstockID}`,
                method: "POST",
                data: {
                    rawstockID:  datax.rawstockID,   
                },
                dataType: "json",
                success: function(data) {
                  $.ajax({
                      url: `/update/rawstock`,
                      method: "POST",
                      data: {
                          rawstockID: datax.rawstockID,
                          stockqty: datax.qty + data.stockqty,  
                          costperitem: Math.round((((datax.qty * datax.itemcost) + (data.stockqty * data.costperitem))/(datax.qty + data.stockqty))/10)*10,
                          status: 1,
                      },
                      dataType: "json",
                      success: function(data) {
                          if (data.status == 0) {
                              deferred.resolve(true);
                              screenLog(formatMessage('failed'),'warning');
                          } else  {
                              deferred.resolve(false);
                              grid.refresh()
                          }
                      },
                      error: function() {
                          deferred.reject("Data Loading Error");
                      },
                      timeout: 5000
                  });
                },
                error: function() {
                    deferred.reject("Data Loading Error");
                },
                timeout: 5000
            });
            e.cancel = deferred.promise();
  
          } else {
            screenLog(formatMessage('musthaverefid'),'warning');
            e.cancel = true;
          }
          
        } else if (e.newData.status < e.oldData.status) {
          screenLog(formatMessage('cantupgrade'),'warning');
          e.cancel = true;
        } 
      }
  }
    
}).dxDataGrid('instance');  



  function editCellQRCodeTemplate(cellElement, cellInfo) {
    if (typeof cellInfo.value === 'undefined') {
    } else {
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
      if (isNotEmpty(result.totalCount)) {
        d.resolve(result.data, {
          totalCount: result.totalCount
        });
      } else {
        d.resolve([], {
          totalCount: 0
        });
      }
  }).fail((xhr) => {
    d.reject(xhr.responseJSON ? xhr.responseJSON.Message : xhr.statusText);
  });
  return d.promise();
}

function isNotEmpty(value) {
  return value !== undefined && value !== null && value !== '';
}


var splitRegex = /\r\n|\r|\n/g;
  jsPDF.API.textEx = function (text, x, y, hAlign, vAlign) {
    var fontSize = this.internal.getFontSize() / this.internal.scaleFactor;

    // As defined in jsPDF source code
    var lineHeightProportion = 1.15;

    var splittedText = null;
    var lineCount = 1;
    if (vAlign === 'middle' || vAlign === 'bottom' || hAlign === 'center' || hAlign === 'right') {
        splittedText = typeof text === 'string' ? text.split(splitRegex) : text;

        lineCount = splittedText.length || 1;
    }

    // Align the top
    y += fontSize * (2 - lineHeightProportion);

    if (vAlign === 'middle')
        y -= (lineCount / 2) * fontSize;
    else if (vAlign === 'bottom')
        y -= lineCount * fontSize;

    if (hAlign === 'center' || hAlign === 'right') {
        var alignSize = fontSize;
        if (hAlign === 'center')
            alignSize *= 0.5;

        if (lineCount > 1) {
            for (var iLine = 0; iLine < splittedText.length; iLine++) {
                this.text(splittedText[iLine], x - this.getStringUnitWidth(splittedText[iLine]) * alignSize, y);
                y += fontSize * lineHeightProportion;
            }
            return this;
        }
        x -= this.getStringUnitWidth(text) * alignSize;
    }

    this.text(text, x, y);
    return this;
  };



});

