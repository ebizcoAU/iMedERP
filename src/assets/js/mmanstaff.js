$(() => {
    var mid = $('#memberid').text();
    var subdir  = $('#subdir').text();
    var roleID  = $('#roleid').text();
    var parentGroupID = $('#groupid').text();

//*********************************************** */
    const URL = ''; 
    const tbl = "memberx";
    const primekey = "memberID";
    const memberStore = new DevExpress.data.CustomStore({
    key: primekey,
    load(loadOptions) {
      return sendRequest(`${URL}/manstaff/${mid}`, 'POST');
    },
  });

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
      pageSize: 8,
    },
    pager: {
      showPageSizeSelector: true,
      allowedPageSizes: [8, 12, 16],
      showInfo: true,
      showNavigationButtons: true,
      infoText: `${formatMessage('page')} {0} ${formatMessage('of')} {1} ({2} ${formatMessage('records')})`
    },
    searchPanel: {
        visible: true,
        width: 240,
        placeholder: formatMessage('search'),
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
    showColumnHeaders: false,
    columns: [
      { dataField: 'imgLinkx',
        caption: '',
        width: 85,
        allowSearch: false,
        allowSorting: false,
        allowEditing: false,
        calculateCellValue: function(rowData) {
          return rowData.subdir +'/'+ rowData.imgLink;
        },
        cellTemplate: cellTemplate,
      },
      { dataField: 'namex',
        caption: formatMessage('name'),
        allowEditing: false,
        sortIndex: 0, 
        sortOrder: "asc",
        calculateCellValue: function (rowData) { // combines display values
            return `${rowData.name}/${rowData.phone}/${rowData.email}`;
        },
        cellTemplate: cellTextTemplate,
      },
      { dataField: 'name',
        caption: formatMessage('name'),
        validationRules: [{ type: 'required' }],
        allowEditing: false,
        visible: false
      },
      { dataField: 'company',
        caption: formatMessage('company'),
        width: 140,
        visible: false,
        allowEditing: false
      },
      { dataField: 'phone',
        validationRules: [{ type: 'required' }],
        visible: false,
        allowEditing: false,
        width: 110
      },
      { dataField: 'email',
        validationRules: [{type: 'email'}],
        visible: false,
        allowEditing: false,
        width: 180
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
    onSelectionChanged(selectedItems) {
      const data = selectedItems.selectedRowsData[0];
      if (data) {
        //console.log(JSON.stringify(data,false,4))
        gid = data.groupID;
        subdir = data.subdir; 
      }
    },
    onEditingStart(e) {
      console.log("e: " + e.data.groupID + " /" + e.data.subdir)
      gid = e.data.groupID;
      subdir = e.data.subdir;    
      mode = 'edit';  
    },
    onRowUpdating(e) {
      if (e.oldData.status == -1) e.cancel = true;       
    },
    onInitNewRow() {
      mode = 'new';
    },
    onRowPrepared: function(e) {
      if (e.rowType === "data") {
        if (e.data.status == 0) {
            e.rowElement.css({"color":"#666666", "background-color":"#AAAAAA"});
        } else if (e.data.status == -1) {
            e.rowElement.css({"color":"#CCCCCC", "background-color":"#BB2222"});
        } 
      }
    }
    
  }).dxDataGrid('instance');

  function cellTextTemplate(container, options) {
    console.log(options.value)
    var textx = options.value.split("/");
    const txtElement = document.createElement("div");
    txtElement.className = 'd-flex flex-column';
    const subTxt1 = document.createElement("div");
    subTxt1.className = 'p-0';
    subTxt1.innerHTML = textx[0];
    txtElement.append(subTxt1);
    const subTxt2 = document.createElement("div");
    subTxt2.className = 'p-0';
    subTxt2.innerHTML = textx[1];
    txtElement.append(subTxt2);
    const subTxt3 = document.createElement("div");
    subTxt3.className = 'p-0';
    subTxt3.innerHTML = textx[2];
    txtElement.append(subTxt3);
    
    container.append(txtElement);
  }

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
    
    imgElement.setAttribute("width", `75`);
    imgElement.setAttribute("height", `75`);
    container.append(imgElement);
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


})