$(() => {
  DevExpress.config({ defaultCurrency: 'VND' });
  window.jsPDF = window.jspdf.jsPDF;
  $('#pagetitle').html(`${formatMessage('rawstockused')}`);
    
  //**************************/
  var parentGroupID = $('#groupid').text();
  var roleID = $('#roleid').text();
  var prodmanID = $('#prodmanID').text();
  //console.log("parentGroupID: " + parentGroupID)
  var pid = parseInt($('#productID').text());
  var pqty = parseInt($('#pqty').text());
  var unitcostx = 0;
  const URL = ''; 
  const primekey = "prodformulaID";
  const memberStore = new DevExpress.data.CustomStore({
    key: primekey,
    load(loadOptions) {
        return sendRequest(`${URL}/prodformulalist/${pid}/${pqty}`,'POST');
    },
   
  });
  var pqtyFormat = new Intl.NumberFormat('vi-VN').format(pqty); 
  $('#prodrawx').html(`
    <h5>${formatMessage('product')}: ${$('#productName').text()}</h5>
    <h5>${formatMessage('batchnum')}: ${$('#pbatchnum').text()}</h5>
    <h5>${formatMessage('qty')}: ${pqtyFormat}</h5>
    
  `);

  //************************************************ */
  var rawstockDataSource = {  
    store: new DevExpress.data.CustomStore({
      key: "rawstockID",
      loadMode: "raw",
      load: function() {
          return sendRequest(`${URL}/get/rawstock/groupID/equal/${parentGroupID}/null/null/null/null`,'POST');
          
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
    searchPanel: {
        visible: true,
        width: 240,
        placeholder: formatMessage('search'),
    },
    export: {
      enabled: true,
      formats: ['pdf'],
  },
  onExporting(e) {
      const grid = e.component;
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
          topLeft: { x: 1, y: 36 },
          columnWidths: [10, 60, 20, 30, 30, 30],
          customDrawCell({ rect }) {
              if (lastPoint.x < rect.x + rect.w) {
                  lastPoint.x = rect.x + rect.w;
              }
              if (lastPoint.y < rect.y + rect.h) {
                  lastPoint.y = rect.y + rect.h;
              }
          },
      }).then(() => {
          
          const header = `${formatMessage('rawstockused')}`;
          const batchnum =`${formatMessage('batchnum')}: ${$('#pbatchnum').text()}`;
          const productName = `${formatMessage('product')}: ${$('#productName').text()}`; 
          const sxQty = `${formatMessage('qty')}: ${$('#pqty').text()}`; 
          const mandate = `${formatMessage('mandate')}: ${$('#pmandate').text()}`; 
          const expirydate = `${formatMessage('expirydate')}: ${$('#expirydate').text()}`; 
         
          

          const pageWidth = doc.internal.pageSize.getWidth();
          doc.setFontSize(9);

          var img = new Image()
          img.src = `public/${$('#subdir').text()}/${$('#pimgLink').text()}`;
          doc.addImage(img, 'png', 170, 4, 15, 15);
          doc.setFontSize(16);
          doc.text(header, 15, 15).setFont("Arimo-Regular", 'bold');

          doc.setLineWidth(1.0);
          doc.setDrawColor(0,0,255); // draw blue lines
          doc.line(15, 22, 195, 22);

          doc.setFont("Arimo-Regular","normal");
          doc.setFontSize(11);
          
          doc.text(productName, 15, 32);
          doc.text(batchnum, 15, 38);
          doc.text(sxQty, 15, 44);
          doc.text(mandate, 125, 38);
          doc.text(expirydate, 125, 44);
          
          
          const footer = '...';
          // add custom font to file
          
          const footerWidth = doc.getTextDimensions(footer).w;
          doc.text(footer, (lastPoint.x - footerWidth), lastPoint.y + 5);

          doc.save(`rawstocktake_${$('#pbatchnum').text()}.pdf`);
          

      });
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
      { dataField: 'idx',
        caption: '#',
        width: 40,
        allowEditing: false
      },
      { dataField : 'rawstockID',
        caption: formatMessage('rawstock'),
        lookup: {
            dataSource: rawstockDataSource,
            valueExpr: "rawstockID",
            displayExpr: "rawstockName" 
        }
      },
      { dataField: 'stkreq',
        caption: `${formatMessage('qty')}`,
        width: 120,
        alignment: 'right',
        calculateCellValue: function(rowData) {
          if (rowData.unitMeasure < 2) return  new Intl.NumberFormat('vi-VN').format(rowData.stkreq); 
          else return new Intl.NumberFormat('vi-VN').format(rowData.stkreq); 
        },
      },
      { dataField: 'costperitem',
        caption: `${formatMessage('upurprice')}`,
        width: 120,
        format: {
            type: "currency",
            precision: 0
        }
      },
      { dataField : 'unitMeasure',
          caption: formatMessage('unitmeasure'),
          width: 120,
          visible: true,
          allowEditing: false,
          lookup: {
              dataSource: unitweightSource,
              valueExpr: "status",
              displayExpr: "statext"
          }
      },
      { dataField: 'subtotal',
        caption: `${formatMessage('total')}`,
        width: 160,
        calculateCellValue: function(rowData){
          return rowData.stkreq * rowData.costperitem;
        },
        format: {
            type: "currency",
            precision: 0
        }
      },
   
    ],

    summary: {
      totalItems: [{
        name: 'subtotalSummary',
        showInColumn: 'subtotal',
        valueFormat: 'currency', 
        displayFormat: "{0}",
        summaryType: 'custom',
      }],
      calculateCustomSummary(options) {
        if (options.name === 'subtotalSummary') {
          if (options.summaryProcess === 'start') {
            options.totalValue = 0;
          }
          if (options.summaryProcess === 'calculate') {
            options.totalValue += (options.value.stkreq * options.value.costperitem);
          }
          if (options.summaryProcess === 'finalize') {
            unitcostx = options.totalValue/pqty;
            let unitcostxTxt = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(unitcostx);
            $('#proddate').html(`
              <h5>${formatMessage('mandate')}: ${$('#pmandate').text()}</h5>
              <h5>${formatMessage('expirydate')}: ${$('#pexpirydate').text()}</h5>
              <h5>${formatMessage('unitcost')}: ${unitcostxTxt}/${formatMessage('product')}</h5>
            `);
          }
        }
      }
    },
    
    onContentReady(e) {
      console.log("unitcostx: " + unitcostx);
      const deferred = $.Deferred();
        $.ajax({
            url: `/update/prodman`,
            method: "POST",
            data: {
                prodmanID:  prodmanID, 
                unitCost:  unitcostx,  
            },
            dataType: "json",
            success: function(data) {
                if (data.status == 0) {
                    deferred.resolve(true);
                    screenLog(formatMessage('failed'),'warning');
                } else  {
                    deferred.resolve(false);
                }
            },
            error: function() {
                deferred.reject("Data Loading Error");
            },
            timeout: 5000
        });
        deferred.promise();
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
