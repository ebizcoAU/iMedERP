$(() => {
  DevExpress.config({ defaultCurrency: 'VND' });
  window.jsPDF = window.jspdf.jsPDF;
  $('#pagetitle').html(`${formatMessage('prodformula')}:  #${$('#productName').text()}`);
  $('#procedure').html(formatMessage('procedure'));
  $('#saveIt').html(formatMessage('save'));

 

  //**************************/
  var parentGroupID = $('#groupid').text();
  var roleID = $('#roleid').text();
  var subdir = $('#subdir').text();
  var pid = parseInt($('#productID').text());
  initImageView(pid);

  const URL = ''; 
  const tbl = "prodformula";
  const primekey = "prodformulaID";
  const memberStore = new DevExpress.data.CustomStore({
    key: primekey,
    load(loadOptions) {
        return sendRequest(`${URL}/prodformulalist/${pid}`, 'POST');
    },
    insert(values) {
        console.log(JSON.stringify(values,false,4));
        values[`productID`] = pid;
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
  var rawstockDataSource = {  
    store: new DevExpress.data.CustomStore({
      key: "rawstockID",
      loadMode: "raw",
      load: function() {
          return sendRequest(`${URL}/get/rawstock/groupID/equal/${parentGroupID}/null/null/null/null`,'POST');
       }
    }) 
  }  
   $('#saveIt').on('click', function(e) {
    e.preventDefault();
    sendRequest(`${URL}/update/product`, 'POST', {
        data: JSON.stringify({
          productID: pid,
          manprocedure: $('#manproEdit').val()
        })
    }).then(function(data){
      window.location = "/prodformula"
    });
    
  })
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
      allowUpdating: ((parentGroupID > 1) && (roleID == 1))?true:false,
      allowAdding: ((parentGroupID > 1) && (roleID == 1))?true:false,
      allowDeleting: ((parentGroupID > 1) && (roleID == 1))?true:false,
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
      { dataField: 'qty',
        caption: `${formatMessage('qty')}`,
        width: 90,
        allowEditing: true,
        calculateDisplayValue: function (rowData) {
          if (rowData.unitMeasure < 2) {
            return new Intl.NumberFormat('vi-VN', {minimumFractionDigits: 3, maximumFractionDigits:3}).format(rowData.qty);
          } else {
            return new Intl.NumberFormat('vi-VN').format(rowData.qty);
          }
        }
      },
      { dataField : 'unitMeasure',
          caption: formatMessage('unitmeasure'),
          width: 140,
          visible: true,
          lookup: {
              dataSource: unitweightMinSource,
              valueExpr: "status",
              displayExpr: "statext"
          }
    },
     
    {   type: 'buttons',
        width: 80,
        buttons: ['edit', 'delete'],
    },
    ],
    
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

/****************  IMAGES ************************ */
function initImageView(productID) {

  const maxFileUpload = 10;
  var docImg=[];
  var docPreview=[];
  function getmemberrego() { return $.ajax({ type: 'POST', url: '/getrego/prodformrego', dataType: 'json', data: {productID:productID}  }); }
  $.when(getmemberrego()).done(function (r1) {
      r1.forEach(function (datax) {
          //console.log('datax: '+ JSON.stringify(datax));
          docImg.push(`public/${subdir}/${datax.name}`);
          let doc;
          doc = {key:datax.prodformregoID, width: '60px'}
          docPreview.push(doc);
      })
      //console.dir('docImg: '+ JSON.stringify(docImg, false, 4));
      //console.dir('docPreview: '+JSON.stringify(docPreview));

      var fileuploadOptions = {
          theme: 'fa5',
          append: true,
          language: 'vi',
          uploadAsync: false,
          browseOnZoneClick: false,
          overwriteInitial: true,
          initialPreviewAsData: true,
          initialPreviewFileType: 'image',
          initialPreview: docImg,
          initialPreviewConfig: docPreview,
          maxFileCount: maxFileUpload,
          maxFileSize: 10000,
          initialCaption: formatMessage('fileselect'),
          autoOrientImage: true,
          initialPreviewDownloadUrl: `download/prodformrego`, 
      };
      
      $.extend(fileuploadOptions,{
          showRemove: false,
          uploadUrl: `/uploaddocs/prodformrego/productID/${productID}/${subdir}`,
          deleteUrl: `/deletedocs/prodformrego/${subdir}`,
          uploadIcon : "<i class='fas fa-upload'></i>",
          removeIcon : "<i class='fas fa-trash-alt'></i>",
          browseIcon : "<i class='fas fa-folder-open'></i>",
          removeClass : 'btn btn-danger',
          allowedFileExtensions: ["jpg", "png", "gif", "pdf", "jpeg", "mp4", "mp3"]
      });
      
      $("#file_upload").fileinput(fileuploadOptions)
      .on('fileuploaded', function(event, previewId, index, fileId) {
          console.log('File Uploaded', 'ID: ' + fileId + ', Thumb ID: ' + previewId);
          window.location.reload();
      }).on('filedeleted', function(event, previewId, index, fileId) {
          console.log('File Deleted');
      }).on('fileuploaderror', function(event, data, msg) {
          console.log('File Upload Error');
      }).on('filebatchuploadcomplete', function(event, preview, config, tags, extraData) {
          console.log('File Batch Uploaded', preview, config, tags, extraData);
      });
  })
}




});
