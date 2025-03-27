$(() => {
  DevExpress.config({ defaultCurrency: 'VND' });
  window.jsPDF = window.jspdf.jsPDF;
  $('#pagetitle').html(`${formatMessage('ordersx')}:  #${$('#saleno').text()}`);
  $('#customerx').html(`${formatMessage('customer')}: ${$('#customerName').text()}`);
  $('#phonex').html(`${formatMessage('contactphone')}: ${$('#phone').text()}`);
  $('#dateaddedx').html(`${formatMessage('dateadded')}: ${$('#dateadded').text()}`);
  $('#lastchangedx').html(`${formatMessage('lastchanged')}: ${$('#lastchanged').text()}`);

  var stotal = 0;
  var stax = 0;

  var receiptPrinter = null;
  if ((navigator.userAgent.match(/(Android)/))||
      (navigator.userAgent.match(/(Mac OS)/))) { 
      receiptPrinter = new WebBluetoothReceiptPrinter();
      //receiptPrinter = new WebUSBReceiptPrinter();

  }
  var lastUsedDevice = null;
  //*** initialize sound player ****
  var audioCreated = false;
  const okBeep = new Audio();
  okBeep.autoplay = false;
  okBeep.src = './assets/audio/beep.mp3';

  const warningBeep = new Audio();
  warningBeep.autoplay = false;
  warningBeep.src = './assets/audio/bad.mp3';

  function initAudio() {
      if (!audioCreated) {
          okBeep.play();
          okBeep.pause();
          warningBeep.play();
          warningBeep.pause();
          audioCreated = true;
      }
      okBeep.play();
  }

//***** Print Receipt */
    
function printReceipt(scartx) {
    var headerx = [
        { width: 32, marginRight: 1, align: 'left' },
        { width: 20, marginRight: 2, align: 'right' },
        { width: 30, marginRight: 2, align: 'right' }
    ];
    var bodyx = [];

    var encoder = new ReceiptPrinterEncoder({
        feedBeforeCut: 4,
    });
    scartx.forEach((m)=>{
        var umeasure2 = (m.unitMeasure2 > 0) ? unitmeasureSource2x.filter(n => n.status == m.unitMeasure2)[0].statext: '';
        bodyx.push([`${m.productName.substr(0,30)}`, `${m.qty} ${umeasure2} x ${convertcurrencyvndong(m.price)}`, `${convertcurrencyvndong(m.price * m.qty)}`]);
    })

    if (stax>0) {
      bodyx.push([ formatMessage('subtotal2'), '', (encoder) => encoder.bold().text(convertcurrencyvndong(stotal)).bold() ]);
      bodyx.push([ formatMessage('tax2'), '', (encoder) => encoder.bold().text(convertcurrencyvndong(stax)).bold()]);
    }
    bodyx.push([ formatMessage('total2'), '', (encoder) => encoder.bold().text(convertcurrencyvndong(stotal+stax)).bold() ]);
    bodyx.push([ '', '', '='.repeat(30) ]);
    let data = encoder
    .codepage('windows1258')
    .line($('#sxname').text())
    .line($('#sxaddress').text())
    .line('DT: ' + $('#hotline').text())
    .line('MST: ' + $('#abn').text())
    .line('GPKD: ' + $('#license').text())
    .line($('#staffName').text())
    .line(`${formatMessage('date2')}:` + $('#dateadded').text())
    .newline()
    .bold(true)
    .line(`${formatMessage('saledocket2')}:` + $('#saleno').text())
    .bold(false)
    .newline()
    .table(headerx, bodyx)	
    .newline()
    .newline()
    .encode()
    /* Print the receipt */    
    receiptPrinter.print(data);
}
function convertcurrencyvndong(value) {
    return value.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')+'d';
}


$(".printrx").on("click", function(e){
  e.preventDefault();
  var scartx= grid.getDataSource().items();
  if (scartx.length > 0) {
    if ((navigator.userAgent.match(/(Android)/))||
      (navigator.userAgent.match(/(Mac OS)/))) { 
        initAudio();
        if (lastUsedDevice) {
            receiptPrinter.reconnect(lastUsedDevice);
            printReceipt(scartx) 
        } else {
            receiptPrinter.connect();
        }
        receiptPrinter.addEventListener('connected', device => {
            console.log(`Connected to ${device.name} (#${device.id})`);

            printerLanguage = device.language;
            printerCodepageMapping = device.codepageMapping;
            console.log(device);

            /* Store device for reconnecting */
            lastUsedDevice = device;
            printReceipt(scartx) 
            
        });
    }
  }
  
})
  //**************************/
  var parentGroupID = $('#groupid').text();
  var status = $('#statusx').text();
  var incltax = $('#incltaxx').text();
  var productSource = [];
  
  var roleID = $('#roleid').text();
  var oid = $('#saleID').text();
  const URL = ''; 
  const tbl = "saleitems";
  const primekey = "saleitemsID";
  const memberStore = new DevExpress.data.CustomStore({
    key: primekey,
    load() {
      return sendRequest(`${URL}/saleitemslist/${oid}`, 'POST');
    },
    insert(values) {
        console.log(JSON.stringify(values,false,4));
        values[`saleID`] = oid;
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
  
  function saleDocket() {
    var stotal = grid.getTotalSummaryValue('subtotal');
    var stax = grid.getTotalSummaryValue('taxtotal');
    if (incltax==0) {
      stotal += stax;
      stax = 0;
    }
    amountx = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(stotal);
    taxx = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(stax);
    totalx = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(parseInt(stotal+stax));
    grid.columnOption('costperitem', 'visible', false);
    grid.columnOption('unitPrice', 'visible', false);
    grid.columnOption('status', 'visible', false);
    const doc  = new jsPDF({orientation:'portrait'});
    doc.addFileToVFS('Arimo-Regular-normal.ttf', font);
    doc.addFont('Arimo-Regular-normal.ttf', 'Arimo-Regular', 'normal');
    doc.setFont("Arimo-Regular","normal");
    doc.setFontSize(9);
    doc.setTextColor('#333333');
    
    const lastPoint = { x: 0, y: 0 };
    DevExpress.pdfExporter.exportDataGrid({
        jsPDFDocument: doc,
        component: grid,
        topLeft: { x: 1, y: 56 },
        columnWidths: [12, 60, 16, 18, 12, 15, 24, 20],
        customDrawCell({ rect }) {
            if (lastPoint.x < rect.x + rect.w) {
                lastPoint.x = rect.x + rect.w;
            }
            if (lastPoint.y < rect.y + rect.h) {
                lastPoint.y = rect.y + rect.h;
            }
        },
    }).then(() => {
        grid.columnOption('costperitem', 'visible', true);
        grid.columnOption('unitPrice', 'visible', true);
        grid.columnOption('status', 'visible', true);
        const dataCount = grid.getDataSource().items().length;
        const spacex = (dataCount * 16) + 100;
        const header = `${formatMessage('saledocket')}`;
        const orderNumber =`${formatMessage('ordersx')}: ${$('#saleno').text()}`;
        const customerName = $('#customerx').html();
        const phone = $('#phonex').html();
        const dateadded = $('#dateaddedx').html();
        const sxcompany = `${formatMessage('ptyltd')} ${$('#sxname').text()}`;
        const sxaddress = `${formatMessage('address')}: ${$('#sxaddress').text()}`;
        const sxtax = `${formatMessage('taxid')}: ${$('#abn').text()}`;
        const sxphone = `${formatMessage('hotline')}: ${$('#hotline').text()}`;
        const amtwords = to_vietnamese(stotal+stax) + " đồng";
        const bywords = `${formatMessage('totalinword')}`;
        const bywordsamount = `${amtwords}`;

        doc.setFontSize(9);
        doc.text(sxcompany, 15, 8);
        doc.text(sxaddress, 15, 12);
        doc.text(sxtax, 15, 16);
        doc.text(sxphone, 15, 20);

        doc.setLineWidth(0.5);
        doc.setDrawColor(0,0,255); // draw blue lines
        doc.line(15, 22, 195, 22);

        doc.setFontSize(16);
        doc.text(header, 80, 30).setFont("Arimo-Regular", 'bold');
        doc.setFont("Arimo-Regular","normal");
        doc.setFontSize(10);
        
        doc.text(orderNumber, 15, 47);
        doc.text(customerName, 15, 52);
        doc.text(dateadded, 145, 47);
        doc.text(phone, 145, 52);

        doc.setLineWidth(0.5);
        doc.setDrawColor(0,0,0); // draw black lines
        doc.line(15, 62, 195, 62);

        
        doc.setLineWidth(0.5);
        doc.setDrawColor(0,0,0); // draw black lines
        doc.line(15, spacex, 195, spacex);

        doc.textEx(`${formatMessage('subtotal')}`, 155, spacex + 5, 'right', 'middle');
        doc.textEx(`${formatMessage('tax')}`, 155, spacex + 10, 'right', 'middle');
        doc.textEx(`${formatMessage('total')}`, 155, spacex + 15, 'right', 'middle');

        doc.textEx(amountx.replace(/&nbsp;/g, ' '), 190, spacex + 5, 'right', 'middle');
        doc.textEx(taxx.replace(/&nbsp;/g, ' '), 190, spacex + 10, 'right', 'middle');
        doc.textEx(totalx.replace(/&nbsp;/g, ' '), 190, spacex + 15, 'right', 'middle');

        doc.text(bywords, 15, spacex + 20);
        doc.text(bywordsamount, 15, spacex + 25);

        doc.setLineWidth(0.5);
        doc.setDrawColor(0,0,0); // draw black lines
        doc.line(15, spacex+ 29, 195, spacex+ 29);
        doc.text(`${formatMessage('buyer')}`, 35, spacex + 34);
        doc.text(`${formatMessage('signwithname')}`, 35, spacex + 39);
        doc.text(`${formatMessage('seller')}`, 145, spacex + 34);
        doc.text(`${formatMessage('signwithname')}`, 145, spacex + 39);
        doc.text(`${formatMessage('checkcomparewhendelivery')}`,  65, spacex + 80);
        const footer = '...';
        // add custom font to file
        const footerWidth = doc.getTextDimensions(footer).w;
        doc.text(footer, (lastPoint.x - footerWidth), lastPoint.y + 5);
        doc.save(`orders_${$('#orderNumber').text()}.pdf`);

    });
  
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
    searchPanel: {
        visible: true,
        width: 240,
        placeholder: formatMessage('search'),
    },
    toolbar: {
        items: [
            "groupPanel",
            {
              location: "after",
              widget: "dxButton",
              options: {
                  text: formatMessage('print') + ' '+ formatMessage('saledocket'),
                  width: 210,
                  onClick(e) {
                    saleDocket();
                  }
              },
            },
            "addRowButton",
            "searchPanel"
        ]
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
      allowUpdating: ((parentGroupID>1) && ((roleID==6) || ((divisionID==1) && (roleID==1))))?true:false,
      allowAdding: false,
      allowDeleting: ((parentGroupID>1) && ((roleID==6) || ((divisionID==1) && (roleID==1))))?true:false,
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
      { dataField : 'productID',
        caption: 'ID#',
      },
      { dataField : 'productName',
        caption: formatMessage('name'),
      },
      { dataField : 'typeID',
        caption: formatMessage('type'),
        width: 140,
        visible: true,
        lookup: {
            dataSource: typeSource,
            valueExpr: "status",
            displayExpr: "statext"
        }
      },
      { dataField: 'price',
        caption: formatMessage('unitprice'),
        width: 140,
        allowEditing: false,  
        format: {
            type: 'currency',
            precision: 0  
        },
      },
      { dataField: 'qty',
        caption: `${formatMessage('qty')}`,
        width: 120,
        allowEditing: true,
      },
      { dataField : 'unitMeasure2',
        caption: formatMessage('unitmeasure2'),
        width: 80,
        lookup: {
            dataSource: unitmeasureSource2,
            valueExpr: "status",
            displayExpr: "statext"
        }
      },
     
      { dataField: 'costperitem',
        caption: formatMessage('unitcost'),
        visible: false,
        width: 90,
        format: {
            type: 'currency',
            precision: 0  
          }
      },
      { dataField: 'subtotal',
        caption: formatMessage('subtotal'),
        width: 140,
        allowEditing: false,
        calculateCellValue: function(rowData){
            return rowData.qty * rowData.price * (1 - rowData.taxrate);
        },
        format: {
          type: 'currency',
          precision: 0  
        }  
      },
      { dataField: 'taxtotal',
        caption: formatMessage('tax'),
        width: 140,
        allowEditing: true,
        format: {
            type: 'currency',
            precision: 0  
        },
        calculateCellValue: function(rowData) {
          return rowData.qty * rowData.price * rowData.taxrate;
        },  
      },
      { dataField : 'status',
        caption: formatMessage('status'),
        width: 100,
        lookup: {
            dataSource: statusSource2,
            valueExpr: "status",
            displayExpr: "statext"
        }
      },
      { type: 'buttons',
        width: 80,
        buttons: ['edit', 'delete'],
      },
    ],
    summary: {
        totalItems: [{
          column: 'taxtotal',
          summaryType: 'sum',
          displayFormat: `{0} `,
          valueFormat: 'currency',
        },{
          column: 'subtotal',
          summaryType: 'sum',
          displayFormat: `{0} `,
          valueFormat: 'currency',
        }],

      },
    onContentReady(e) {
      var grid = e.component;  
      grid.option('loadPanel.enabled', false);
      var selection = grid.getSelectedRowKeys();  
      if(selection.length == 0) {  
          grid.selectRowsByIndexes([0]);  
      }  
      updateTable(0);
    },
    onRowInserting(e) {
      e.data.unitPrice = productSource.filter(d=> d.productID===e.data.productID)[0].unitPrice;
    },
    onRowInserted(e) {
      updateTable();
    },
    onRowRemoved(e) {
      updateTable();
    },
    onRowUpdated(e) {
      updateTable();
    },
    

    onRowRemoving: function(e) {
      console.log("e.status: " + e.data['status']);
      e.cancel = e.data['status'] > 1?true:false ;
    }
  }).dxDataGrid('instance');


  $('#incltax').on('change', function() {
    if (this.checked) incltax = 1
    else incltax = 0
    updateTable()
    $('#incltaxx').html(incltax);
  })


  function updateTable(mode=1) {
    stotal = grid.getTotalSummaryValue('subtotal');
    stax = grid.getTotalSummaryValue('taxtotal');
    if (incltax==0) {
      stotal += stax;
      stax = 0;
    }
    amountx = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(stotal);
    taxx = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(stax);
    totalx = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(parseInt(stotal+stax));
    $('#amountx').html(`${formatMessage('amount')}: ${amountx}`);
    $('#taxx').html(`${formatMessage('tax')}: ${taxx}`);
    $('#totalx').html(`${formatMessage('total')}: ${totalx}`);
    if (mode==1) {
      
      return sendRequest(`${URL}/update/sale`, 'POST',{
        data: JSON.stringify({
            saleID: oid,
            amount: stotal,
            tax: stax,
            incltax: incltax
        })
    });
    }
    
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
        d.resolve(result);
      
    }).fail((xhr) => {
      d.reject(xhr.responseJSON ? xhr.responseJSON.Message : xhr.statusText);
    });

    return d.promise();
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
