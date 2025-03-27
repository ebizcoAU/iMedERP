$(() => {
    DevExpress.config({ defaultCurrency: 'VND' });
    $('#pagetitle').html(`${formatMessage('prodformula')}`);
    //**************************/
    var parentGroupID = $('#groupid').text();
    var roleID = $('#roleid').text();
    var brandID = 0;
    var catID = 0;
    console.log("parentGroupID: " + parentGroupID +', brandID: '+ brandID +', catID:' + catID)
    var gid = 0;
    var mode = 'new';
    const URL = ''; 
    const tbl = "product";
    const primekey = "productID";
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
      return sendRequestARG(`${URL}/product/${parentGroupID}/${brandID}/${catID}`, 'POST', args);
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
    var brandDataSource = {  
      store: new DevExpress.data.CustomStore({
        key: "brandID",
        loadMode: "raw",
        load: function() {
            //return sendRequest(`${URL}/brand/${parentGroupID}`);
            return $.getJSON(`${URL}/brand/${parentGroupID}`);
         }
      }) 
    }  
  
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
    const grid = $('#profileContainer').dxDataGrid({
      dataSource: memberStore,
      allowColumnReordering: true,
      allowColumnResizing: true,
      columnAutoWidth: true,
      showBorders: true,
      remoteOperations: true,
      wordWrapEnabled: true,
      paging: {
        pageSize: 7,
      },
      pager: {
        showPageSizeSelector: true,
        allowedPageSizes: [7, 10, 12],
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
        allowUpdating: false,
        allowAdding: false,
        allowDeleting: false,
        useIcons: true,
        popup: {
          title: formatMessage('product'),
          showTitle: true,
          width: 1024,
          height: 850,
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
              colCount: 3,
              colSpan: 2,
              items: [{
                itemType: 'group',
                items: [{
                  dataField: 'productName',
                }, {
                  dataField: 'brandID',
                }, {
                  dataField: 'categoryID'
                }, {
                  dataField: 'unitMeasure',
                }, {
                  dataField: 'promotionID',  
                }],
              }, {
                  itemType: 'group',
                  items: [{
                    dataField: 'barcode', 
                  }, {
                    dataField: 'qtyperBox',
                  },{
                    dataField: 'boxperPallet',
                  },{
                    dataField: 'unitPrice',
                  }]
              }, {
                itemType: 'group',
                items: [{
                      dataField: 'dateAdded',
                  },{
                      dataField: 'lastChanged',
                  },{
                      dataField: 'lastpersonName', 
                  }, {
                      dataField: 'status',   
                }],
              }],
          }, {
              itemType: 'group',
              cssClass: 'third-group',
              colCount: 1,
              colSpan: 2,
              items: [{
                itemType: 'group',
                items: [{
                  dataField: 'description',
                  editorType: 'dxTextArea',
                  colSpan: 2,
                  editorOptions: {
                      height: 125,
                  }, 
                }],
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
          width: 50,
        },
        { dataField: 'imgLinkx',
          caption: '...',
          width: 115,
          allowSearch: false,
          allowSorting: false,
          calculateCellValue: function(rowData) {
            return rowData.subdir +'/'+ rowData.imgLink;
          },
          cellTemplate: cellTemplate,
          editCellTemplate: editCellTemplate
        },
        {
          dataField: 'productName',
          caption: formatMessage('name'),
          visible: true
        },
        { dataField : 'brandID',
            caption: formatMessage('brand'),
            width: 120,
            lookup: {
              dataSource: brandDataSource,
              valueExpr: "brandID",
              displayExpr: "brandName"
            }
        },   
        { dataField : 'categoryID',
            caption: formatMessage('category'),
            width: 120,
            lookup: {
              dataSource: categoryDataSource,
              valueExpr: "categoryID",
              displayExpr: "categoryName"
            }
        },
        { dataField : 'promotionID',
            caption: formatMessage('promotion'),
            width: 110,
            lookup: {
              dataSource: promotionDataSource,
              valueExpr: "promotionID",
              displayExpr: "name"
            }
        }, 
        { dataField: 'unitPrice',
          caption: formatMessage('unitprice'),
          width: 100,
          format: {
              type: 'currency',
              precision: 0  
            }  
        },
        { dataField: 'qtyperBox',
          caption: formatMessage('qtyperbox'),
          dataType: "number",
          width: 80,
        },
        { dataField: 'boxperPallet',
          caption: formatMessage('boxperpallet'),
          dataType: "number",
          width: 80,
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
          format: locale=='en'?'dd MMM, yyyy':'dd MMMM M, yyyy'
        },
        { dataField: 'lastpersonName',
          caption: formatMessage('lastperson'),
          width: 160,
          allowEditing: false,
          visible: true 
        },
        { dataField : 'status',
          caption: formatMessage('status'),
          width: 90,
          lookup: {
              dataSource: statusSource,
              valueExpr: "status",
              displayExpr: "statext"
          }
        },
        { type: 'buttons',
          width: 60,
          buttons: [{ 
            text: formatMessage('formula'),
            icon: "product",
            hint: formatMessage('formula'),
            onClick: function (e) {
              let data = e.row.data;
              window.location = `/pformulae_${data.productID}`;
            }
         }],
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
        mode = 'edit';  
      },
      onInitNewRow() {
        mode = 'new';
      },
      
      
    }).dxDataGrid('instance');
  
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
        console.log("imagepath: " + imagepath);
        imageElement.setAttribute('src',`${imagepath}`);
        
        imageElement.setAttribute("width", `120`);
        imageElement.setAttribute("height", `120`);
      
        let fileUploaderElement = document.createElement("div");
    
        cellElement.append(imageElement);
        cellElement.append(fileUploaderElement);
        cellElement.append(buttonElement);
    
        let retryButton = $(buttonElement).dxButton({
          text: "Retry",
          visible: false,
          onClick: function() {
            // The retry UI/API is not implemented. Use a private API as shown at T611719.
            for (var i = 0; i < fileUploader._files.length; i++) {
              delete fileUploader._files[i].uploadStarted;
            }
            fileUploader.upload();
          }
        }).dxButton("instance");
  
        let tablex = "groupx";
        let searchkey = "groupID";
        let field = imagepath.split("/").pop();
        let gid = cellInfo.data.groupID;
        let uploadurl = `uploadimages/${tablex}/${searchkey}/${gid}/${field}` ;
        
        console.log("uploadurl: " + uploadurl);
  
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
              console.log("e.target:"+ args.target.result);
              imageElement.setAttribute('src', args.target.result);
            }
            reader.readAsDataURL(e.value[0]); // convert to base64 string
          },
          onUploaded: function(e){
            //console.log("res: " + e.request.responseText)
            cellInfo.setValue(e.request.responseText);
            retryButton.option("visible", false);
          },
          onUploadError: function(e){
            let xhttp = e.request;
            if(xhttp.status === 400){
              e.message = e.error.responseText;
            }
            if(xhttp.readyState === 4 && xhttp.status === 0) {
              e.message = "Không kết nối được";
            }
            retryButton.option("visible", true);
          }
  
        }).dxFileUploader("instance");
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
          console.log(JSON.stringify(result, false, 4))
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
  
  
  });
  