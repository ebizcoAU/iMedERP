

$( document ).ready(function() {
  //****** label header ******/
  $('#pagetitle').html(formatMessage('customer'));
  $('#header1').html(formatMessage('customerlist'));
  $('#header2').html(formatMessage('propertylist'));
  //**************************/
  var gid = 0;
  var pid = 0;
  var subdir = '';
  const URL = '';
  const tbl = "customer";
  const primekey = "customerID";
  const operatorStore = new DevExpress.data.CustomStore({
    key: primekey,
    load() {
      return sendRequest(`${URL}/${tbl}`);
    },
    insert(values) {
      console.log(JSON.stringify(values,false,4))
      return sendRequest(`${URL}/new/${tbl}`, 'POST', {
        data: JSON.stringify(values),
      });
    },
    update(key, values) {
      values[`${primekey}`] = key;
      if ('logox' in values) {
        values.logo = values.logox.split("/").pop();
        delete values.logox;
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

  $('#operatorContainer').dxDataGrid({
    dataSource: operatorStore,
    allowColumnReordering: true,
    allowColumnResizing: true,
    columnAutoWidth: true,
    showBorders: true,
    searchPanel: {
      visible: true,
      width: 240,
      placeholder: formatMessage('search'),
    },
    editing: {
      texts: {
        saveRowChanges: formatMessage('save'),
        cancelRowChanges: formatMessage('cancel'),
      },
      mode: 'popup',
      allowUpdating: true,
      allowAdding: true,
      allowDeleting: true,
      useIcons: true,
      popup: {
        title: formatMessage('operatorinfo'),
        showTitle: true,
        width: 1280,
        height: 560,
      },
      form: {
        items: [{
          itemType: 'group',
          colCount: 4,
          colSpan: 2,
          items: [
            { dataField: 'name', colSpan: 2},
            'phone', 'abn',
            { dataField: 'address', colSpan: 2},
            'countryID','status', 
            { dataField: 'email', colSpan: 2},
            {
              dataField: 'website',
              editorType: 'dxTextArea',
              colSpan: 2,
              editorOptions: {
                height: 32,
              },
            },
            {
              dataField: 'about',
              editorType: 'dxTextArea',
              colSpan: 2,
              editorOptions: {
                height: 180,
              },
            },
            {
              dataField: "logox",
              colSpan: 2
            },
            'dateAdded', 'approvedDate','lastPersonName', 'lastChanged' 
          ],
        
        }
      ]},
    },
    selection: {
      mode: 'single',
    },
    loadPanel: {
      enabled: true,
    },  
    onContentReady(e) {
        var grid = e.component;  
        grid.option('loadPanel.enabled', false);
        var selection = grid.getSelectedRowKeys();  
        if(selection.length == 0) {  
            grid.selectRowsByIndexes([0]);  
        }  
    },
    hoverStateEnabled: true,
    scrolling: {
      rowRenderingMode: 'virtual',
    },
    rowAlternationEnabled: true,
    columns: [
      { dataField: 'logox',
        caption: formatMessage('logo') + "  120x120(min)",
        width: 70,
        calculateCellValue: function(rowData) {
          return rowData.subdir +'/'+ rowData.logo;
        },
        cellTemplate: cellTemplate,
        editCellTemplate: editCellTemplate
      },
      { dataField: 'name',
        caption: formatMessage('business_name'),
        validationRules: [{ type: 'required' }]
      },
      { dataField: 'address',
        caption: formatMessage('address'),
        visible: true,
        width: 400,
        validationRules: [{ type: 'required' }]  
      },
      { dataField: 'phone',
        validationRules: [{ type: 'required' }],
        visible: true
      },
      { dataField: 'email',
        validationRules: [{ type: 'required' },{type: 'email'}],
        visible: true
      },
      
      { dataField: 'dateAdded',
        caption: formatMessage('dateadded'),
        visible: false,
        dataType: 'date',
        allowEditing: false, 
        format: 'dd MMM, yyyy'
      },
      { dataField: 'approvedDate',
        caption: formatMessage('approveddate'),
        visible: false,
        dataType: 'date',
        allowEditing: true,
        format: 'dd MMM, yyyy'
      },
      { dataField: 'lastChanged',
        caption: formatMessage('lastchanged'),
        dataType: 'date',
        width: 160,
        allowEditing: false, 
        format: 'dd MMM, yyyy H:mm:ss'
      },
      { dataField: 'lastPersonName',
        caption: formatMessage('lastpeson'),
        visible: false,
        allowEditing: false
      },
      { dataField : 'countryID',
        caption: formatMessage('country'),
        width: 90,
        lookup: {
            dataSource: countrySource,
            valueExpr: "status",
            displayExpr: "statext"
        }
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
      { dataField: 'abn',
        caption: formatMessage('abn'),
        visible: false
      },
      { dataField: 'about',
      caption: formatMessage('description'),
        visible: false
      },
      { type: 'buttons',
        width: 80,
        buttons: ['edit', 'delete'],
      },
    ],
    toolbar: {
      items: [
        {
          name: 'addRowButton',
          showText: 'always',
          options: {
            text: formatMessage('addnewoperator')
        	}
        },
        {
          name: 'searchPanel',
          showText: 'always'
        },
      ],
    },
    onSelectionChanged(selectedItems) {
      const data = selectedItems.selectedRowsData[0];
      if (data) {
        console.log(JSON.stringify(data,false,4))
        gid = data.groupID;
        subdir = data.subdir; 
        $('#propertyContainer').dxDataGrid("instance").refresh()
      }
    },
    onEditingStart(e) {
      gid = e.data.groupID;
      subdir = e.data.subdir;    
    }
    
  });

  function cellTemplate(container, options) {
    var backendURL = `public/`;
    let imgElement = document.createElement("img");
    if (options.value.split("/")[1] !== "") {
      imgElement.setAttribute("src", `${backendURL}${options.value}`);
    } else {
      imgElement.setAttribute("src", `${backendURL}logoblank.png`);
    }
    
    imgElement.setAttribute("width", `60`);
    imgElement.setAttribute("height", `60`);
    container.append(imgElement);
  }
  

  function editCellTemplate(cellElement, cellInfo) {
    if (typeof cellInfo.value === 'undefined') {
    } else {
      var backendURL = `public/`;
      let buttonElement = document.createElement("div");
      buttonElement.classList.add("retryButton");
    
      let imageElement = document.createElement("img");
      imageElement.classList.add("uploadedImage");
      let imagepath = `${backendURL}logoblank.png`;
      if (cellInfo.value.split("/")[1] !== 'undefined') {
        imagepath =  `${backendURL}${cellInfo.value}`;
      }
      //console.log("imagepath: " + imagepath);
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
      let field = cellInfo.value.split("/").pop();
  
      let fileUploader = $(fileUploaderElement).dxFileUploader({
        multiple: false,
        accept: "image/*",
        uploadMode: "instantly",
        uploadUrl: `uploadimages/${tablex}/${searchkey}/${gid}/${field}`,
        onValueChanged: function(e) {
          let reader = new FileReader();
          reader.onload = function(args) {
            imageElement.setAttribute('src', subdir+'/'+args.target.result);
          }
          reader.readAsDataURL(e.value[0]); // convert to base64 string
        },
        onUploaded: function(e){
          cellInfo.setValue(e.request.responseText);
          retryButton.option("visible", false);
        },
        onUploadError: function(e){
          let xhttp = e.request;
          if(xhttp.status === 400){
            e.message = e.error.responseText;
          }
          if(xhttp.readyState === 4 && xhttp.status === 0) {
            e.message = "Connection refused";
          }
          retryButton.option("visible", true);
        }

      }).dxFileUploader("instance");
    }
  }

//*************************************** */
const tbl2 = "property";
const primekey2 = "propertyID";
const propertyStore = new DevExpress.data.CustomStore({
  key: primekey2,
  load() {
    if (gid > 0) {
      return sendRequest(`${URL}/${tbl2}/operator/${gid}`);
    } else {
      return []
    }      
  },
  insert(values) {
    values[`groupID`] = pid;
    console.log(JSON.stringify(values,false,4))
    return sendRequest(`${URL}/new/${tbl2}`, 'POST', {
      data: JSON.stringify(values),
    });
  },
  update(key, values) {
    values[`${primekey2}`] = key;
    if ('imgsrc' in values) {
      values.imgsrc = values.imgsrc.split("/").pop();
    }
    return sendRequest(`${URL}/update/${tbl2}`, 'POST', {
      data:  JSON.stringify(values)
    });
  },
  remove(key) {
    let datax = {};
    datax[`${primekey2}`] = key;
    return sendRequest(`${URL}/delete/${tbl2}`, 'POST', {
      data: JSON.stringify(datax)
    });
  }
});
$('#propertyContainer').dxDataGrid({
  dataSource: propertyStore,
  columnAutoWidth: true,
  showBorders: true,
  searchPanel: {
    visible: true,
    width: 240,
    placeholder: formatMessage('search')
  },
  editing: {
    texts: {
      saveRowChanges: formatMessage('save'),
      cancelRowChanges: formatMessage('cancel'),
    },
    mode: 'popup',
    allowUpdating: true,
    allowAdding: true,
    allowDeleting: true,
    useIcons: true,
    popup: {
      title: formatMessage('propertyinfo'),
      showTitle: true,
      width: 1280,
      height: 560,
    },
    form: {
      items: [{
        itemType: 'group',
        colCount: 4,
        colSpan: 2,
        items: [
          { dataField: 'name', colSpan: 2},
          { dataField: 'address', colSpan: 2},
          { dataField: 'shorttext', colSpan: 2},
          'countryID', 'provincesID',
          {
            dataField: 'about',
            editorType: 'dxTextArea',
            colSpan: 2,
            editorOptions: {
              height: 180,
            },
          },
          {
            dataField: "imgsrc",
            colSpan: 2
          },
          { dataField: 'website', colSpan: 2},
          'isSpecial', 'isShowCase',
          'propertytype', 'dateAdded', 
          'lastPersonName', 'lastChanged' 
        ],
      }],
    },
  },
  selection: {
    mode: 'single',
  },
  loadPanel: {
    enabled: true,
  },
  scrolling: {
    mode: 'virtual',
  },
  sorting: {
    mode: 'none',
  },
  onContentReady(e) {
    e.component.option('loadPanel.enabled', false);
  },
  hoverStateEnabled: true,
  rowAlternationEnabled: true,
  columns: [
    { dataField:'propertyID',
        caption: 'ID',
        visible: false
    },
    { dataField: 'name',
      caption: formatMessage('propertyname'),
      width: 300,
      validationRules: [{ type: 'required' }] 
    },
    { dataField: 'address',
      caption: formatMessage('address'),
      visible: true,
      width: 400,
      validationRules: [{ type: 'required' }]  
    },
    { dataField : 'propertytypeID',
      caption: formatMessage('type'),
      lookup: {
          dataSource: propertySource,
          valueExpr: "status",
          displayExpr: "statext"
      }
    },
    { dataField: 'shorttext',
      caption: formatMessage('propertybrief'),
      visible: false,
      width: 300,
      validationRules: [{ type: 'required' }] 
    },
    { dataField : 'countryID',
      caption: formatMessage('country'),
      validationRules: [{ type: 'required' }],  
      visible: false,
      width: 90,
      setCellValue(rowData, value) {
        rowData.countryID = value;
        rowData.provincesID = null;
      },
      lookup: {
          dataSource: countrySource,
          valueExpr: "status",
          displayExpr: "statext"
      }
    },
    { dataField : 'provincesID',
      caption: formatMessage('province'),
      validationRules: [{ type: 'required' }],
      visible: false,
      width: 90,
      lookup: {
        dataSource(options) {
          return {
            store: provincesSource,
            filter: options.data ? ['countryID', '=', options.data.countryID] : null,
            sort: ['title']
          };
        },
        valueExpr: "provincesID",
        displayExpr: "title",
      }
    },
    { dataField: 'dateAdded',
      caption: formatMessage('dateadded'),
      visible: false,
      dataType: 'date',
      allowEditing: false, 
      format: 'dd MMM, yyyy'
    },
    { dataField: 'approvedDate',
      caption: formatMessage('approveddate'),
      visible: false,
      dataType: 'date',
      allowEditing: true,
      format: 'dd MMM, yyyy'
    },
    { dataField: 'lastChanged',
      caption: formatMessage('lastchanged'),
      dataType: 'date',
      width: 160,
      allowEditing: false, 
      format: 'dd MMM, yyyy H:mm:ss'
    },
    { dataField: 'lastPersonName',
      caption: formatMessage('lastpeson'),
      visible: false,
      allowEditing: false
    },
    { dataField : 'isSpecial',
      caption: formatMessage('isspecial'),
      lookup: {
        dataSource: yesnoSource,
        valueExpr: "status",
        displayExpr: "statext"
      }
    },
    { dataField : 'isShowCase',
      caption: formatMessage('isshowcase'),
      lookup: {
        dataSource: yesnoSource,
        valueExpr: "status",
        displayExpr: "statext"
      }
    },
    { dataField : 'status',
      caption: formatMessage('status'),
      lookup: {
        dataSource: statusSource,
        valueExpr: "status",
        displayExpr: "statext"
      }
    },
    { dataField: 'imgsrc',
        caption: formatMessage('mainimg')  + " 1200x675(min)",
        width: 70,
        visible: false,
        editCellTemplate: editCellTemplate2
      },
    { type: 'buttons',
        width: 80,
        buttons: ['edit', 'delete'],
    },
  ],
  toolbar: {
    items: [
      {
        name: 'addRowButton',
        showText: 'always',
        options: {
          text: formatMessage('addnewproperty')
        }
      },
      {
        name: 'searchPanel',
        showText: 'always'
      },
    ],
  },
  onSelectionChanged(selectedItems) {
    const data = selectedItems.selectedRowsData[0];
    if (data) {
      console.log(JSON.stringify(data,false,4))
      pid = data.propertyID;
    }
  }
});


function editCellTemplate2(cellElement, cellInfo) {
  if (typeof cellInfo.value === 'undefined') {
  } else {
    var backendURL = `public/${subdir}/`;
    let buttonElement = document.createElement("div");
    buttonElement.classList.add("retryButton");
  
    let imageElement = document.createElement("img");
    imageElement.classList.add("uploadedImage");
    let imagepath = `${backendURL}logoblank.png`;
    if (cellInfo.value.split("/")[1] !== 'undefined') {
      imagepath =  `${backendURL}${cellInfo.value}`;
    }
    console.log("cellInfo.value: " + cellInfo.value);
    console.log("imagepath: " + imagepath);
    imageElement.setAttribute('src',`${imagepath}`);
    imageElement.setAttribute("width", `320`);
    imageElement.setAttribute("height", `180`);
  
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
    let field = cellInfo.value.split("/").pop();

    let fileUploader = $(fileUploaderElement).dxFileUploader({
      multiple: false,
      accept: "image/*",
      uploadMode: "instantly",
      uploadUrl: `uploadimages/${tablex}/${searchkey}/${gid}/${field}`,
      onValueChanged: function(e) {
        let reader = new FileReader();
        reader.onload = function(args) {
          imageElement.setAttribute('src', args.target.result);
        }
        reader.readAsDataURL(e.value[0]); // convert to base64 string
      },
      onUploaded: function(e){
        if (typeof e.request.responseText.status === 'undefined') {
          cellInfo.setValue(e.request.responseText);
          retryButton.option("visible", false);
        }
      },
      onUploadError: function(e){
        let xhttp = e.request;
        if(xhttp.status === 400){
          e.message = e.error.responseText;
        }
        if(xhttp.readyState === 4 && xhttp.status === 0) {
          e.message = "Connection refused";
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
        //console.log(JSON.stringify(result, false, 4))
        d.resolve(result);
      
    }).fail((xhr) => {
      d.reject(xhr.responseJSON ? xhr.responseJSON.Message : xhr.statusText);
    });

    return d.promise();
  }

});
