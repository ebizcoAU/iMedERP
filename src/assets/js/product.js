$(() => {
  DevExpress.config({ defaultCurrency: 'VND' });
  $('#pagetitle').html(`${formatMessage('product')}`);
  //**************************/
  var parentGroupID = $('#productgroupID').text();
  var roleID = $('#roleid').text();
  var catID = $('#catID').text();
  var subdir = $('#subdir').text();
  var rowDatax={};
  var priceIndex = -1;
  console.log("parentGroupID: " + parentGroupID +', catID:' + catID)
  var mode = 'new';
  const URL = ''; 
  const tbl = "product";
  const primekey = "productID";
  const memberStore = new DevExpress.data.CustomStore({
    key: primekey,
    load() {
      return sendRequestARG(`${URL}/product/${parentGroupID}/${catID}`, 'POST');
    },
    insert(values) {
        console.log(JSON.stringify(values,false,4));
        values[`groupID`] = parentGroupID;
        if ('imgLinkx' in values) {
          values.imgLink = values.imgLinkx.split("/").pop();
          delete values.imgLinkx;
        }
        return sendRequest(`${URL}/new/${tbl}`, 'POST', {
            data: JSON.stringify(values),
        });
    },
    update(key, values) {
      console.log(JSON.stringify(values, false, 4))
      values[`${primekey}`] = key;
      if ('imgLinkx' in values) {
        values.imgLink = values.imgLinkx.split("/").pop();
        delete values.imgLinkx;
      }
      if ('imgLink1x' in values) {
        values.imgLink1 = values.imgLink1x.split("/").pop();
        delete values.imgLink1x;
      }
      if ('imgLink2x' in values) {
        values.imgLink2 = values.imgLink2x.split("/").pop();
        delete values.imgLink2x;
      }
      if ('imgLink3x' in values) {
        values.imgLink3 = values.imgLink3x.split("/").pop();
        delete values.imgLink3x;
      }
      if ('imgLink4x' in values) {
        values.imgLink4 = values.imgLink3x.split("/").pop();
        delete values.imgLink4x;
      }
      if ('imgLink5x' in values) {
        values.imgLink5 = values.imgLink3x.split("/").pop();
        delete values.imgLink5x;
      }
      if ('imgLinky' in values) {
        values.imgLink = values.imgLinky.split("/").pop();
        delete values.imgLinky;
      }
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
  $.ajax({
      url: `${URL}/category/${parentGroupID}`,
      method: "GET",
      dataType: "json",
      async: true,
      success: function(data) {
          if (data.length == 0) {
            screenLog('System Error','No Category defined');
          } else {
            const grid = $('#profileContainer').dxDataGrid({
              dataSource: memberStore,
              allowColumnReordering: true,
              allowColumnResizing: true,
              columnAutoWidth: true,
              showBorders: true,
              remoteOperations: false,
              wordWrapEnabled: true,
              paging: {
                pageSize: 20,
              },
              pager: {
                showPageSizeSelector: true,
                allowedPageSizes: [20, 25, 30],
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
                mode: 'popup',
                allowUpdating: ((parentGroupID>1) && ((roleID==6) || ((divisionID==1) && (roleID==1))))?true:false,
                allowAdding:  ((parentGroupID>1) && ((roleID==6) || ((divisionID==1) && (roleID==1))))?true:false, 
                allowDeleting:  ((parentGroupID>1) && ((roleID==6) || ((divisionID==1) && (roleID==1))))?true:false,
                useIcons: true,
                popup: {
                  title: formatMessage('product'),
                  showTitle: true,
                  width: 1420,
                  height: 780,
                },
                form: {
                  labelMode: 'floating',
                  items: [{
                    itemType: 'group',
                    cssClass: 'first-group',
                    colCount: 6,
                    colSpan: 2,
                    items: [{
                      dataField: 'imgLinkx',
                    }, {
                      dataField: 'imgLink1x',
                    }, {  
                      dataField: 'imgLink2x',
                    }, {
                      dataField: 'imgLink3x'
                    }, {
                      dataField: 'imgLink4x'  
                    }, {
                      dataField: 'imgLink5x'   
                    }],
                  }, {
                      itemType: 'group',
                      cssClass: 'second-group',
                      colCount: 10,
                      colSpan: 2,
                      items: [{
                        itemType: 'group',
                        colSpan: 2,
                        items: [{
                          dataField: 'productName',
                        }, {
                          dataField: 'categoryID'
                        }, {
                          dataField: 'typeID'
                        }, {
                          dataField: 'unitMeasure',  
                        }, {
                          dataField: 'unitMeasure2', 
                        }, {
                          dataField: 'qtyperBox', 
                        }, {
                          dataField: 'qtyperPack', 
                        

                        }],
                      }, {
                        itemType: 'group',
                        colSpan: 2,
                        items: [{
                          dataField: 'costperitem', 
                        }, {
                          dataField: 'unitPrice', 
                        }, {
                          dataField: 'unitPrice2', 
                        },{
                          dataField: 'status',  
                        },{
                          dataField: 'taxrate', 
                        },{
                          dataField: 'barcode', 
                        },{
                          dataField: 'priceIndex', 
                        }]
                      }, {
                          itemType: 'group',
                          colSpan: 2,
                          items: [{
                            dataField: 'lastexpiryDate', 
                          },{
                            dataField: 'dateAdded',  
                          },{
                            dataField: 'lastChanged',  
                          },{
                            dataField: 'lastpersonName',  
                          }, {
                            dataField: 'description',
                            editorType: 'dxTextArea',
                            colSpan: 2,
                            editorOptions: {
                                height: 130,
                            }, 
                          }]
                      }, {
                        itemType: 'group',
                        colSpan: 4,
                        items: [{
                           
                            dataField: 'imgLinky',
                        }]
                      }],
                  }]
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
                { dataField: 'productID',
                  caption: formatMessage('id'),
                  allowEditing: false,
                  width: 60,
                },
                { dataField: 'imgLinkx',
                  caption: formatMessage('logo') + " 140x140",
                  width: 115,
                  visible: false,
                  allowSearch: false,
                  allowSorting: false,
                  calculateCellValue: function(rowData) {
                    return rowData.subdir +'/'+ rowData.imgLink;
                  },
                  cellTemplate: cellTemplate,
                  editCellTemplate: editCellTemplate
                },
                { dataField: 'imgLink1x',
                  caption: formatMessage('logo') + " 140x140",
                  allowSearch: false,
                  visible: false,
                  calculateCellValue: function(rowData) {
                    return rowData.subdir +'/'+ rowData.imgLink1;
                  },
                  cellTemplate: cellTemplate,
                  editCellTemplate: editCellTemplate
                },
                { dataField: 'imgLink2x',
                  caption: formatMessage('logo') + " 140x140",
                  allowSearch: false,
                  visible: false,
                  calculateCellValue: function(rowData) {
                    return rowData.subdir +'/'+ rowData.imgLink2;
                  },
                  cellTemplate: cellTemplate,
                  editCellTemplate: editCellTemplate
                },
                { dataField: 'imgLink3x',
                  caption: formatMessage('logo') + " 140x140",
                  allowSearch: false,
                  visible: false,
                  calculateCellValue: function(rowData) {
                    return rowData.subdir +'/'+ rowData.imgLink3;
                  },
                  cellTemplate: cellTemplate,
                  editCellTemplate: editCellTemplate
                },
                { dataField: 'imgLink4x',
                  caption: formatMessage('logo') + " 140x140",
                  allowSearch: false,
                  visible: false,
                  calculateCellValue: function(rowData) {
                      return rowData.subdir +'/'+ rowData.imgLink4;
                  },
                  cellTemplate: cellTemplate,
                  editCellTemplate: editCellTemplate
                },
                { dataField: 'imgLink5x',
                  caption: formatMessage('logo') + " 140x140",
                  allowSearch: false,
                  visible: false,
                  calculateCellValue: function(rowData) {
                      return rowData.subdir +'/'+ rowData.imgLink5;
                  },
                  cellTemplate: cellTemplate,
                  editCellTemplate: editCellTemplate
                },
                { dataField: 'imgLinky',
                  width: 75,
                  visible: false,
                  allowEditing: false,
                  allowSearch: false,
                  calculateCellValue: function(rowData) {
                      return  rowData.productID +'/'+rowData.status;
                  },
                  editCellTemplate: editCellTemplate2
                },
                {
                  dataField: 'productName',
                  caption: formatMessage('name'),
                  visible: true
                },
                
                { dataField : 'categoryID',
                    caption: formatMessage('category'),
                    width: 210,
                    setCellValue(rowData, value) {
                      rowData.categoryID = value;
                      rowData.subcatID = null;
                    },
                    lookup: {
                      dataSource: categoryDataSource,
                      valueExpr: "categoryID",
                      displayExpr: "categoryName"
                    }
                },
                { dataField : 'typeID',
                  caption: formatMessage('type'),
                  width: 100,
                  visible: true,
                  lookup: {
                      dataSource: typeSource,
                      valueExpr: "status",
                      displayExpr: "statext"
                  }
                },
                { dataField : 'priceIndex',
                  caption: formatMessage('priceindex'),
                  width: 140,
                  visible: false,
                  lookup: {
                      dataSource: priceIndexSource,
                      valueExpr: "status",
                      displayExpr: "statext"
                  }
                },
                { dataField : 'promotionID',
                    caption: formatMessage('promotion'),
                    width: 110,
                    visible: false,
                    lookup: {
                      dataSource: promotionDataSource,
                      valueExpr: "promotionID",
                      displayExpr: "name"
                    }
                }, 
                { dataField: 'costperitem',
                  caption: formatMessage('unitcost'),
                  width: 100,
                  format: {
                      type: 'currency',
                      precision: 0  
                    }  
                },
                { dataField: 'taxrate',
                  caption: formatMessage('taxrate'),
                  width: 120,
                  format: {
                    type: 'percent',
                    precision: 2  
                  }  
                },
                { dataField: 'unitPrice',
                  caption: formatMessage('unitprice'),
                  width: 80,
                  format: {
                      type: 'currency',
                      precision: 0  
                    }  
                },
                { dataField: 'unitPrice2',
                  caption: formatMessage('unitprice2'),
                  width: 80,
                  format: {
                      type: 'currency',
                      precision: 0  
                    }  
                },
                { dataField : 'unitMeasure',
                  caption: formatMessage('unitmeasure'),
                  width: 80,
                  lookup: {
                      dataSource: unitmeasureSource,
                      valueExpr: "status",
                      displayExpr: "statext"
                  }
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
                { dataField: 'description',
                  caption: formatMessage('productdescription'),
                  allowSearch: false,
                  visible: false
                },
                { dataField: 'qtyperBox',
                  caption: formatMessage('qtyperbox'),
                  dataType: "number",
                  width: 75,
                },
                { dataField: 'qtyperPack',
                  caption: formatMessage('qtyperpack'),
                  dataType: "number",
                  width: 70,
                },
                { dataField: 'barcode',
                  caption: 'Barcode',
                  allowEditing: ((parentGroupID>1) && ((roleID==6) || ((divisionID==1) && (roleID==1))))?true:false,
                  visible: false
                },
                { dataField: 'lastexpiryDate',
                  caption: formatMessage('expirydate'),
                  dataType: 'date',
                  width: 160,
                  format: locale=='en'?'dd MMM, yyyy':'dd MMMM M, yyyy',
                  visible: false
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
                  caption: formatMessage('lastchanged'),
                  dataType: 'date',
                  width: 140,
                  allowEditing: false,
                  sortOrder: 'desc',
                  format: locale=='en'?'dd MMM, yyyy':'dd MMMM M, yyyy'
                },
                { dataField: 'lastpersonName',
                  caption: formatMessage('lastperson'),
                  width: 160,
                  allowEditing: false,
                  allowSearch: false,
                  visible: false 
                },
                { dataField : 'status',
                  caption: formatMessage('status'),
                  width: 90,
                  visible: false,   
                  lookup: {
                      dataSource: statusSource2,
                      valueExpr: "status",
                      displayExpr: "statext"
                  }
                },
                { type: 'buttons',
                  width: 110,
                  buttons: ['edit', 'delete', 
                    { text: formatMessage('product'),
                        icon: "money",
                        hint: "Account",
                        onClick: function (e) {
                          if (($('#groupid').text()>1) && ((roleID==1) || (roleID==6))) {
                            window.location = `/salexchg_0_${e.row.data.productID}_0`;
                          } else {
                              const message = formatMessage("authoritytodo");
                              const type = 'error';
                              toast.option({ message , type });
                              toast.show();
                              e.cancel = true;
                          }
                        }
                    }]
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
              onEditingStart(e) {
                rowDatax = e.data;
                mode = 'edit';  
              },
              onInitNewRow(e) {
                mode = 'new';
                e.data.qtyperBox = 60;
                e.data.qtyperPack = 10;
                e.data.costperitem = 0;
                rowDatax = e.data;

              },
             
              onEditorPreparing: function(e) {  
                function calcPrice() {
                   // Emulating a web service call  
                   var factSi = priceIndexSource.filter(f=>f.status==priceIndex)[0].factorSi;
                   var factLe = priceIndexSource.filter(f=>f.status==priceIndex)[0].factorLe;
                   console.log(factSi + "," + factLe)
                   window.setTimeout(function () {  
                     if (rowDatax.qtyperBox > 1) {
                       component.cellValue(rowIndex, "unitPrice", Math.ceil(rowDatax.costperitem * factSi/1000)*1000);  
                       component.cellValue(rowIndex, "unitPrice2", Math.ceil((rowDatax.costperitem * factLe / rowDatax.qtyperBox)/100)*100); 
                     } else {
                       component.cellValue(rowIndex, "unitPrice", Math.ceil(rowDatax.costperitem * factSi/1000)*1000);  
                       component.cellValue(rowIndex, "unitPrice2", Math.ceil(rowDatax.costperitem * factSi/1000)*1000);  
                     }
                   }, 500);  
                }
                var component = e.component,  
                    rowIndex = e.row && e.row.rowIndex;
                if(e.dataField === "costperitem") {  
                  var onValueChanged = e.editorOptions.onValueChanged;  
                  e.editorOptions.onValueChanged = function(e) {  
                    onValueChanged.call(this, e);  
                    rowDatax.costperitem = e.value;
                    if ((priceIndex > -1) && (rowDatax.qtyperBox>0)) {
                      calcPrice()  
                    } else {
                      priceIndex = 0;
                      calcPrice() 
                    }
                  }  
                }
                if(e.dataField === "qtyperBox") {  
                  var onValueChanged = e.editorOptions.onValueChanged;  
                  e.editorOptions.onValueChanged = function(e) {  
                    onValueChanged.call(this, e);  
                    rowDatax.qtyperBox = e.value;
                    if ((priceIndex > -1) && (rowDatax.costperitem>0)) {
                      calcPrice() 
                    }
                  }  
                }   
                if ((e.dataField === "priceIndex") && rowDatax){  
                  //console.log(rowDatax)
                  var onValueChanged = e.editorOptions.onValueChanged;  
                  e.editorOptions.onValueChanged = function(e) {  
                    onValueChanged.call(this, e); 
                    priceIndex = e.value; 
                    calcPrice() 
                  }  
                }  
              },
              onCellPrepared(e) {
                if(e.rowType === "data") {
                  if (e.row.data['status'] == 0) {
                    e.cellElement.css({
                      "color":"rgb(51,20,100)",
                      "background-color":"rgb(255,120,120)",
                      
                    })
                  }
                }
              },  
              
            }).dxDataGrid('instance');
          }
      },
      error: function() {
          deferred.reject("Data Loading Error");
      },
      timeout: 5000
  });

  var categoryDataSource = {  
    store: new DevExpress.data.CustomStore({
      key: "categoryID",
      loadMode: "raw",
      load: function() {
          //return sendRequest(`${URL}/category/${parentGroupID}`);
          return $.getJSON(`${URL}/category/${parentGroupID}`);
      },
    })
  }  

  var promotionDataSource = {  
    store: new DevExpress.data.CustomStore({
      key: "promotionID",
      loadMode: "raw",
      load: function() {
          return $.getJSON(`${URL}/promotion/${parentGroupID}`);
      },
    })
  }  

 

//************************************************ */
  

  function cellTemplate(container, options) {
    var backendURL = `public/`;
    let imgElement = document.createElement("img");
    let imagepath = `${backendURL}logoblank.png`;
    //console.log("options.value: " + options.value);

    if ((options.value.split("/")[1] !== 'undefined') && (options.value.split("/")[1].length > 0)) {
      imagepath =  `${backendURL}${options.value}`;
    }
    //console.log("imagepath: " + imagepath);
    
    imgElement.setAttribute('src',`${imagepath}`);
    
    imgElement.setAttribute("width", `100`);
    imgElement.setAttribute("height", `100`);
    container.append(imgElement);
  }

  function editCellTemplate(cellElement, cellInfo) {
    if ((typeof cellInfo.value === 'undefined') || (mode == 'new')) {
    } else {
      var backendURL = `public/`;
      let buttonElement = document.createElement("div");
      buttonElement.classList.add("retryButton");
    
      let imageElement = document.createElement("img");
      imageElement.classList.add("uploadedImage");
      let imagepath = `${backendURL}logoblank.png`;

      //console.log("cellInfo.value: " + cellInfo.value);

      if ((cellInfo.value.split("/")[1] !== 'undefined') && (cellInfo.value.split("/")[1].length > 0)) {
        imagepath =  `${backendURL}${cellInfo.value}`;
      }
      //console.log("imagepath: " + imagepath);
      imageElement.setAttribute('src',`${imagepath}`);
      
      imageElement.setAttribute("width", `100`);
      imageElement.setAttribute("height", `100`);
    
      let fileUploaderElement = document.createElement("div");
      let uploaderElement = document.createElement("div");
      uploaderElement.classList.add('d-flex');
      uploaderElement.classList.add('flex-row');

      uploaderElement.append(fileUploaderElement);
      uploaderElement.append(buttonElement);

      cellElement.append(imageElement);
      cellElement.append(uploaderElement);
      
      let tablex = "groupx";
      let searchkey = "groupID";
      let field = imagepath.split("/").pop();
      let gid = cellInfo.data.groupID;
      let uploadurl = `uploadimages/${tablex}/${searchkey}/${gid}/${field}` ;
      let deleteurl = `deleteimages/${tablex}/${searchkey}/${gid}/${field}` ;

      //console.log("deleteurl: " + deleteurl);

      let deleteButton = $(buttonElement).dxButton({
        text: 'X',
        visible: true,
        onClick: function() {
          console.log("DDD")
          $.post(deleteurl, function(data) {
            cellInfo.setValue(data);
            imageElement.setAttribute('src', '');
          })
        }
      }).dxButton("instance");

      let fileUploader = $(fileUploaderElement).dxFileUploader({
        multiple: false,
        accept: "image/*",
        uploadMode: "instantly",
        uploadUrl: uploadurl,
        labelText: '.',
        selectButtonText: formatMessage('fileselect'),
        maxFileSize: 1000000,
        onValueChanged: function(e) {
          let reader = new FileReader();
          reader.onload = function(args) {
            //console.log("e.target:"+ args.target.result);
            imageElement.setAttribute('src', args.target.result);
          }
          reader.readAsDataURL(e.value[0]); // convert to base64 string
        },
        onUploaded: function(e){
          //console.log("res: " + e.request.responseText)
          cellInfo.setValue(e.request.responseText);
          //retryButton.option("visible", false);
        },
        onUploadError: function(e){
          let xhttp = e.request;
          if(xhttp.status === 400){
            e.message = e.error.responseText;
          }
          if(xhttp.readyState === 4 && xhttp.status === 0) {
            e.message = "Không kết nối được";
          }
          //retryButton.option("visible", true);
        }

      }).dxFileUploader("instance");
    }
  }

  function editCellTemplate2(cellElement, cellInfo) {
    let filelist = [], status=0;
    if ((typeof cellInfo.value === 'undefined') || (mode == 'new')) {
    } else {
      //console.log("cellInfo.value: " + cellInfo.value);
      let fileUploaderElement = document.createElement("div");
      let inputElement = document.createElement("input");
      inputElement.setAttribute('id', 'file_upload');
      inputElement.setAttribute('type', 'file');
      inputElement.setAttribute('multiple', 'true');

      fileUploaderElement.append(inputElement);
      cellElement.append(fileUploaderElement);

      initImageView(cellInfo.value.split("/")[0], cellInfo.value.split("/")[1])
      
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
            totalCount: result.totalCount
          });
      
    }).fail((xhr) => {
      d.reject(xhr.responseJSON ? xhr.responseJSON.Message : xhr.statusText);
    });

    return d.promise();
  }

  function isNotEmpty(value) {
    return value !== undefined && value !== null && value !== '';
  }

   /****************  IMAGES ************************ */
   function initImageView(productID,status) {

    const maxFileUpload = 10;
    var docImg=[];
    var docPreview=[];
    function getmemberrego() { return $.ajax({ type: 'POST', url: '/getrego/productrego', dataType: 'json', data: {productID:productID}  }); }
    $.when(getmemberrego()).done(function (r1) {
        r1.forEach(function (datax) {
            //console.log('datax: '+ JSON.stringify(datax));
            docImg.push(`public/${subdir}/${datax.name}`);
            let doc;
            doc = {key:datax.productregoID, width: '60px'}
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
            initialPreviewDownloadUrl: `download/productrego`, 
        };
        
        $.extend(fileuploadOptions,{
            showRemove: false,
            uploadUrl: `/uploaddocs/productrego/productID/${productID}/${subdir}`,
            deleteUrl: `/deletedocs/productrego/${subdir}`,
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
