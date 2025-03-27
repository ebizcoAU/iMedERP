$(() => {
  DevExpress.config({ defaultCurrency: 'VND' });
  var parentGroupID = $('#groupid').text();
  var roleID = $('#roleid').text();
  //****** label header ******/
  $('#pagetitle').html(`${formatMessage('diagnostic')}`); 
  $('#illness').html(`${formatMessage('illness')}`); 
  //**************************/
  console.log("parentGroupID: " + parentGroupID  +', roleID: '+ roleID )

//******************************************** */
    const illnessName = `illness_${locale}`;
    var ds1=[];
    var ds2=[];
    var iid = 0;
    const URL0 = '';
    const tbl0 = "illness";
    const primekey0 = "illnessID";
    const illnessStore = new DevExpress.data.CustomStore({
        key: primekey0,
        load() {
            return sendRequest(`${URL0}/illness/${parentGroupID}`);
        },
    });
    $('#illnessContainer').dxSelectBox({
        dataSource: illnessStore,
        dropDownOptions: {
            showTitle: false,
        },
        displayExpr: function(item) {
            return item && item.illnessID + '-' + item.illness_vi
        },
        valueExpr: 'illnessID',
        searchEnabled: true, 
        placeholder:formatMessage('selectillness'), 
        onSelectionChanged: function (e) {
            //console.log("evalues: " + JSON.stringify(e.selectedItem, false, 4))
            iid = e.selectedItem.illnessID;
            $('#grid2').dxDataGrid("instance").refresh();
        },
    });

/******************************************** */  
    const URL = '';
    const tbl = "symptom";
    const primekey = "symptomID";
    const toaStore = new DevExpress.data.CustomStore({
      key: primekey,
      load() {
        return sendRequest(`${URL}/symptom/0`);
      },
      reshapeOnPush: true
    });
  
    $('#grid1').dxDataGrid({
      dataSource: toaStore,
      showBorders: true,
      rowAlternationEnabled: true,
      rowDragging: {
        allowReordering: true,
        data: 1,
        group: 'tasksGroup',
      },
      scrolling: {
        mode: 'virtual',
      },
      columns: [{ 
            dataField:'symptomName',
            caption: formatMessage('symptom'),
            dataType: 'string',
        }, {
            dataField: 'symptomID',
            visible: false,
        }
      ],
    })
    //******************** PROJECT ***************** */
    const tbl2 = "illnessSymptom";
    const primekey2 = "illnessSymptomID";
    const illSymptStore = new DevExpress.data.CustomStore({
      key: primekey2,
      load() {
            if (iid > 0) {
                return sendRequest(`${URL}/illnessSymptom/${iid}`);
            }
      },
      reshapeOnPush: true,  
      insert(values) {
        console.log(JSON.stringify(values,false,4))
        values[`illnessID`] = iid;
        return sendRequest(`${URL}/new/${tbl2}`, 'POST', {
          data: JSON.stringify(values),
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
    $('#grid2').dxDataGrid({
      dataSource: illSymptStore,
      showBorders: true,
      rowAlternationEnabled: true,
      rowDragging: {
        data: 2,
        group: 'tasksGroup',
        onAdd,
        onRemove
      },
      scrolling: {
        mode: 'virtual',
      },
      columns: [{ 
            dataField:'symptomName',
            dataType: 'string',
            caption: formatMessage('symptominillness'),
            
        }, {
            dataField: 'illnessID',
            dataType: 'number',
            visible: false,
        }
      ],
      onContentReady(e) {
        var grid = e.component;  
        ds2 = grid.getDataSource().items();
        var selection = grid.getSelectedRowKeys();  
        if(selection.length == 0) {  
            grid.selectRowsByIndexes([0]);  
        };
        $('#grid1').dxDataGrid("instance").refresh();  
      },
     
    })


    function onAdd(e) {
        console.log(e.itemData)
        const values = {symptomID: e.itemData.symptomID};
        illSymptStore.insert(values).then(() => {
            $('#grid2').dxDataGrid("instance").refresh();
        });
    }

    function onRemove(e) {
        const key = e.itemData.illnessSymptomID;
        const values = { Status: e.toData };
    
        illSymptStore.remove(key).then(() => {
            $('#grid2').dxDataGrid("instance").refresh();
        });
    }

    function sendRequest(url, method = 'GET', data) {
      const d = $.Deferred();
      var resultx;
      console.log("url: " + url)
      $.ajax(url, {
        method,
        data,
        cache: false,
        xhrFields: { withCredentials: true },
      }).done((result) => {
        //console.log(JSON.stringify(result, false, 4))
        if (url=='/symptom/0') {
            console.log(ds2)
            ds2.forEach((item)=>{
                result = result.filter(function( obj ) {
                    return obj.symptomID !== item.symptomID;
                });
            })  
            resultx = result;   
        } else {
            resultx = result;
        }
        d.resolve(resultx);
      }).fail((xhr) => {
        d.reject(xhr.responseJSON ? xhr.responseJSON.Message : xhr.statusText);
      });
  
      return d.promise();
    }
  


});
