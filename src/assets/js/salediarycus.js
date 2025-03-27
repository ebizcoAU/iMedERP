$(() => {
  DevExpress.config({ defaultCurrency: 'VND' });
  $('#pagetitle').html(`${formatMessage('salediarybycustomer')}`);
  //**************************/
  var parentGroupID = $('#groupid').text();
  var roleID = $('#roleid').text();
  var divisionID = $('#divisionid').text();
  var memberID = $('#memberid').text();
  var memberName = $('#name').text();
  var subdir = $('#subdir').text();
  var customerSource = [];
  var selectedmember=0;
  const delayMin = 15;

//************************************************ */
$.post(`/getcustomermember`, {  //Get NVSX - Sale
}).done(function (data){
    if (data.status) {
        screenLog(formatMessage('invalidmember'), 'error');
    } else {
        customerSource = data;
        customerSource.sort(function(a, b) {
            return a.name.localeCompare(b.name);
        });
        customerSource.forEach(obj => {obj.namex = `${obj.name} (${rolexSource.filter(f=>f.status==obj.roleID)[0].statext})` })
        selectedmember = customerSource[0].memberID;
        $('#custimgx').attr('src', `public/${subdir}/${customerSource[0].imgLink}`);
        $("#searchBox").dxLookup({
            label:  formatMessage('search'),
            labelMode: 'static',
            value: customerSource[0].memberID,
            cancelButtonText: formatMessage('cancel'),
            noDataText: formatMessage('nodatatext'),
            searchPlaceholder: formatMessage('search'),
            dataSource: new DevExpress.data.DataSource({ 
                store: customerSource,
                sort: ['namex'], 
                key: "[memberID]"
            }),
            valueExpr: "memberID",
            displayExpr: "namex",
            onValueChanged(a) {
                let selected = customerSource.filter(f=> f.memberID === a.value);
                selectedmember = selected[0].memberID;
                $('#custimgx').attr('src', `public/${subdir}/${selected[0].imgLink}`);
                grid.refresh();
                removeMedia(); 
            },
        }).dxLookup('instance');
    }
})



function removeMedia() {
    if ($("#videox")[0]) $("#videox")[0].pause();
    $('video').attr("hidden", "hidden")    
    if ($("#audiox")[0]) $("#audiox")[0].pause();
    $('audioc').attr("hidden", "hidden")
    $('#imagex').html('');    
}

//************************* */
const URL = ''; 
const tbl = "diary";
const primekey = "diaryID";
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
        return sendRequestARG(`${URL}/salediarybycustomer/${selectedmember}`, 'POST', args);
    },
    insert(values) {
        console.log(JSON.stringify(values,false,4));
        values[`customerID`] = selectedmember;
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
var staffDataSource = {  
    store: new DevExpress.data.CustomStore({
      key: "memberID",
      loadMode: "raw",
      load: function() {
          return sendRequest(`${URL}/getmember`, 'POST', {  
            roleID: JSON.stringify([2]),
            divisionID: JSON.stringify([3,4]),
            typex: 0
          });
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
    pageSize: 18,
    },
    pager: {
    showPageSizeSelector: true,
    allowedPageSizes: [18, 24],
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
        allowUpdating: ((parentGroupID > 1) && ((divisionID==1) && (roleID==1)))?true:false,
        allowAdding: false,
        allowDeleting: ((parentGroupID > 1) && ((divisionID==1) && (roleID==1)))?true:false,
        useIcons: true,
        form: {
            labelMode: 'floating',
            items: [{
                itemType: 'group',
                cssClass: 'second-group',
                colCount: 3,
                colSpan: 2,
                items: [{
                  itemType: 'group',
                  items: [{
                    dataField: 'dateAdded',
                  }, {
                    dataField: 'customerID',
                  }],
                }, {
                    itemType: 'group',
                    items: [{
                      dataField: 'lastChanged', 
                    }, {
                      dataField: 'staffID',
                    }]
                }, {
                  itemType: 'group',
                  items: [{
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
                    dataField: 'note',
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
    { dataField: 'dateAdded',
        caption: formatMessage('dateadded'),
        dataType: 'date',
        width: 160,
        sortIndex: 0, 
        sortOrder: "desc",
        visible: true,
        format: locale=='en'?'dd MMM, yyyy hh:mm:ss':'dd/MM/yyyy hh:mm:ss'
    },
    {
        dataField: 'diaryID',
        caption: formatMessage('id') ,
        allowEditing: false,
        allowSorting: false,
        width:'80',
        visible: false
    },
    { dataField : 'staffID',
        caption: formatMessage('staff')+ '*',
        width: 200,
        allowSorting: false,
        allowEditing: false,
        lookup: {
            dataSource: staffDataSource,
            valueExpr: "memberID",
            displayExpr: "namex"
        }
    },
      
    { dataField: 'note',
        allowSorting: false,
        allowEditing: false,
        caption: formatMessage('content'),
        visible: true
    },
    
    
    { dataField: 'lastChanged',
        caption: formatMessage('lastchanged'),
        dataType: 'date',
        width: 140,
        allowEditing: false,
        visible:false,
        format: locale=='en'?'dd MMM, yyyy':'dd/MM/yyyy'
    },
    { dataField: 'lastpersonName',
        caption: formatMessage('lastperson'),
        width: 160,
        allowEditing: false,
        visible: false 
    },
    
    { dataField : 'status',
        caption: formatMessage('status'),
        allowSorting: false,
        width: 120,
        lookup: {
            dataSource: diarySource,
            valueExpr: "status",
            displayExpr: "statext"
        }
    },
    { type: 'buttons',
        width: 110,
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
    
    onCellPrepared(e) {
        if (e.rowType === "data") {
            if (e.row.data['status'] == 0) {
                e.cellElement.addClass('bg-warning');
                e.cellElement.addClass('text-dark');
            } else if (e.row.data['status'] == 1) {
                e.cellElement.addClass('bg-success');
                e.cellElement.addClass('text-dark');
            } else if (e.row.data['status'] == 2) {
                e.cellElement.addClass('bg-danger');
                e.cellElement.addClass('text-dark');
            } else if (e.row.data['status'] == 3) {
                e.cellElement.addClass('bg-info');
                e.cellElement.addClass('text-dark');
            } else {  
                e.cellElement.addClass('bg-light');
                e.cellElement.addClass('text-dark');
            }
        }
    },
    onRowUpdating(e) {
        if (e.newData.hasOwnProperty('status')) {
          if (e.newData['status'] < e.oldData['status']) {
            if (e.newData['status'] == 0) {  //Moving from "prepare" to "confirmed"
              screenLog(formatMessage("confirmed"), 'error')
              e.cancel = true;
            } else if (e.oldData['status'] > 2) {
              if (roleID==1) {
                e.cancel = false;
              } else {
                screenLog(formatMessage("closed"), 'error')  
                e.cancel = true;
              }  
            } else {
              e.cancel = false;  
            }
          } else {
            e.cancel = false;
          }
        } else {
          if (e.oldData['status'] > 2) {
            if (roleID==1) {
                e.cancel = false;
            } else {
                screenLog(formatMessage("closed"), 'error')  
                e.cancel = true;
            }  
          } else {
            e.cancel = false;
          }
        }
    },
    onRowDblClick(e) {
        if (e.key !== 0) {
            let data = e.data;
            var htmlTxt='';
            if ((data.dtype == 1) && (data.note && data.note != null)) {
                htmlTxt += `
                    <div id="videoplayer"></div>
                `;
            
            } else if ((data.dtype == 2) && (data.note && data.note != null)) {    
                $('audio').removeAttr("hidden");
                htmlTxt += `
                <div class="card-body">
                    <div class="row">
                        <div  id="audioplayer"></div>
                    </div>
                </div>
                `;
            
            } else if ((data.dtype == 3) && (data.note && data.note != null)) {
                htmlTxt += `
                    <div class="card-bodyt">
                        <div class="image-set" id="imagex"></div>
                    </div>
                `;
            } else {
                htmlTxt += `<div class="fw-bold text-start py-2"  id="diarytitle"></div>`;
                $.post(`/getdiarymsg`, { 
                    'diaryID': data.diaryID
                }).done(function (datx){
                    //console.log(datx)
                    htmlTxt += `<div class="card-bodyx px-1 py-1"> `;
                    if (datx.length > 0) {
                        datx.forEach((f, index) => {
                            let myDate = new Date(f.dateAdded);
                            let dateExp = formatAMPM(myDate);
                            let curDate = new Date();
                            const dateDifferenceInMinutes = (dateInitial, dateFinal) => Math.round((dateFinal - dateInitial) / 60000);
                            let mindiff =  dateDifferenceInMinutes(myDate,curDate);
                            htmlTxt += `
                                <div class="chat-content ${f.teammemberID==f.staffID?'':'user'}" id="div_${f.diarymsgID}" >
                                    <div class="message-item">
                                        <div class="message-time"><small>${f.teammember.substring(0,18) + ' '+dateExp}</small></div>  `;
                            if (mindiff < delayMin) {
                                htmlTxt += `            
                                        <div class="d-flex  flex-row">
                                            <div class="bubble">${f.note}</div>
                                            <a href="javascript:void(0);" class="btn-msgdel ps-2 pt-2" id="btn_${f.diarymsgID}">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 256 256">
                                                    <g style="stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: none; fill-rule: nonzero; opacity: 1;" transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)" >
                                                        <circle cx="45" cy="45" r="45" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(224,70,70); fill-rule: nonzero; opacity: 1;" transform="  matrix(1 0 0 1 0 0) "/>
                                                        <rect x="17.5" y="39" rx="0" ry="0" width="55" height="12" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(255,255,255); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) "/>
                                                    </g>
                                                 </svg>
                                            </a> 
                                        </div>
                                    </div> 
                                </div>

                                `;
                            } else {
                                htmlTxt += ` <div class="bubble">${f.note}</div></div></div> `;
                            }
                        })
                        //console.log(htmlTxt)
                        initChat(htmlTxt, data) ;
                        $('.btn-msgdel').on('click', function(){
                            var idx = this.id.split("_")[1];
                            $.post(`/delete/diarymsg`, { data: JSON.stringify({diarymsgID: this.id.split("_")[1]})}, function(datx){
                                $(`#div_${idx}`).remove();
                            })
                        })
                    } else {
                        htmlTxt += `</div>`;
                        initChat(htmlTxt, data) ;
                        
                    }
                })
            }
            
            
            //console.log(htmlTxt)
            $('#cardbody').html(htmlTxt);
            
            if ((data.dtype == 1) && (data.note && data.note != null)) { /************************ VIDEO  *************************/
                $('#videox').removeAttr("hidden");
                $('#videoplayer').html($('<video />', {
                    id: 'videox',
                    src: `./public/${subdir}/${data.note}`,
                    type: 'video/mp4',
                    controls: true,
                    autoplay: true,
                    width: 330,
                    height: 480
                }));
                $("#videox").css('object-fit:contain;');
                $("#videox")[0].play();
                $('.footer').html(``);
            } else if ((data.dtype == 2) && (data.note && data.note != null)) {  /************************ AUDIO  *************************/
                $('#audioplayer').html($('<audio />', {
                    id: 'audiox',
                    src: `./public/${subdir}/${data.note}`,
                    type: 'audio/*',
                    controls: true,
                    autoplay: false,
                    width: 320,
                    height: 20
                }));
                $('.footer').html(``);
            } else if (data.dtype == 3) {
                if (data.note && data.note != null) { /************************ IMAGES  *************************/
                    let imageText = '';
                    let imageA = data.note.split(",");
                    imageA.forEach((m, index)=> {
                        //console.log(m)
                        imageText += `
                        <a data-title="${data.dateAdded}_${index}"
                            href="public/${subdir}/${m}" >
                            <img src="public/${subdir}/${m}" alt="" width='90' height='80' style="object-fit:contain;">
                        </a>
                        `;
                    })
                    $('#imagex').html(imageText);
                    $('.image-set a').click(function (e) {
                        e.preventDefault();
                        var items = $('.image-set a').get().map(function (el) {
                            return {
                                src: $(el).attr('href'),
                                title: $(el).attr('data-title')
                            }
                        });
                        var options = {
                            index: $(this).index(),
                            resizable: false,
                            headerToolbar: ['close'],
                            multiInstances: false
                        };
                        new PhotoViewer(items, options);
                    });  
                } else {
                    $('#imagex').html('');  
                }
                $('.footer').html(``);
            } else {
                $('.footer').html(``);
            }
            
        }
    },
    onRowRemoving(e) {
        if (e.key !== 0) {
            if (e.data.status == 1) {
                e.cancel = true;
            } else {
                let data = e.data;
                let promise1;
                if (data.note && data.note != null) {
                    let url = `/deletefiles/diary/diaryID/${data.diaryID}/${subdir}/note`;
                    promise1 = new Promise((resolve, reject) => {
                        $.post(url, { 
                        }).done(function (datx){
                            resolve(datx)
                        })
                    })
                } else {
                    promise1 = 1;
                }
                Promise.all([promise1]).then((values) => {
                    $('#cardbody').html('');
                    e.cancel = false;
                });
            }
        }
    }
}).dxDataGrid('instance');

  
//***************************************************** */
function initChat(htmlTxt, data) {
    //console.log(htmlTxt)
    $('#cardbody').html(htmlTxt);
    let myDate = new Date(data.dateAdded);
    let dateExp =  myDate.getDate() + '/' + (myDate.getMonth() + 1)  + '/' + myDate.getFullYear();
    $('#diarytitle').html(`<b>${formatMessage('chatobjective')}: </b>` + data.note.substring(0,64) + '. ' + dateExp);
    $('.footer').html(`
        <div class="container p-2">
            <div class="chat-footer">
                <form>
                    <div class="form-group boxed">
                        <div class="d-flex flex-row input-wrapper message-area">
                            <input type="text" class="form-control" placeholder="Type message...">
                            <a href="javascript:void(0);" class="btn btn-chat btn-icon btn-secondary p-0 btn-rounded">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path d="M21.4499 11.11L3.44989 2.11C3.27295 2.0187 3.07279 1.9823 2.87503 2.00546C2.67728 2.02862 2.49094 2.11029 2.33989 2.24C2.18946 2.37064 2.08149 2.54325 2.02982 2.73567C1.97815 2.9281 1.98514 3.13157 2.04989 3.32L4.99989 12L2.09989 20.68C2.05015 20.8267 2.03517 20.983 2.05613 21.1364C2.0771 21.2899 2.13344 21.4364 2.2207 21.5644C2.30797 21.6924 2.42378 21.7984 2.559 21.874C2.69422 21.9496 2.84515 21.9927 2.99989 22C3.15643 21.9991 3.31057 21.9614 3.44989 21.89L21.4499 12.89C21.6137 12.8061 21.7512 12.6786 21.8471 12.5216C21.9431 12.3645 21.9939 12.184 21.9939 12C21.9939 11.8159 21.9431 11.6355 21.8471 11.4784C21.7512 11.3214 21.6137 11.1939 21.4499 11.11ZM4.70989 19L6.70989 13H16.7099L4.70989 19ZM6.70989 11L4.70989 5L16.7599 11H6.70989Z" fill="#fff"/>
                                </svg>
                            </a>
                        </div>
                    </div>
                </form>
            </div>    
        </div>
    `);
    $('.message-area .form-control').keypress(function (e) {
        var key = e.which;
        if(key == 13)  // the enter key code
         {
            doAction()  
            e.preventDefault()
         }
       }); 
    $('.btn-chat').on('click', function() {
        doAction()
    });

    function doAction() {
        var chatInput = $('.message-area .form-control');
        var chatMessageValue = chatInput.val();
        let myDate = new Date();
        let dateExp = formatAMPM(myDate);
        $.post(`/new/diarymsg`, {data:JSON.stringify({diaryID:data.diaryID, note:chatMessageValue, teammemberID:memberID})}, function(datx){
            $.post(`/update/diary`, { data: JSON.stringify({diaryID: data.diaryID})}, function(daty){
                var messageHtml = `
                <div class="chat-content ${memberID==data.staffID?'':'user'}" id="div_${datx.newid}">
                    <div class="message-item">
                        <div class="message-time"><small>${memberName.substring(0,18) + ' '+dateExp}</small></div>
                        <div class="d-flex  flex-row">
                            <div class="bubble">${chatMessageValue}</div>
                            <a href="javascript:void(0);" class="btn-msgdel ps-2" id="btn_${datx.newid}">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 256 256">
                                <g style="stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: none; fill-rule: nonzero; opacity: 1;" transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)" >
                                        <circle cx="45" cy="45" r="45" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(224,70,70); fill-rule: nonzero; opacity: 1;" transform="  matrix(1 0 0 1 0 0) "/>
                                        <rect x="17.5" y="39" rx="0" ry="0" width="55" height="12" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(255,255,255); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) "/>
                                    </g>
                                </svg>
                            </a> 
                        </div>
                    </div>
                </div>
                `;
                if(chatMessageValue.length > 0){
                    $('.card-bodyx').append(messageHtml);
                    $('.btn-msgdel').on('click', function(){
                        var idx = this.id.split("_")[1];
                        $.post(`/delete/diarymsg`, { data: JSON.stringify({diarymsgID: this.id.split("_")[1]})}, function(datx){
                            $(`#div_${idx}`).remove();
                            
                        })
                    })
                }
                window.scrollTo(0, document.body.scrollHeight);
                chatInput.val('');              
            })
        })
    }
}

function formatAMPM(date) {
    var datex = date.getDate();
    var monthx = date.getMonth()+1;
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTime = datex + '/' +monthx + ' ' +hours + ':' + minutes + ' ' + ampm;
    return strTime;
}
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
        if (url == '/getmember') {
            result.forEach(obj => {obj.namex = `${obj.name} (${manDivisionSource.filter(f=>f.status==obj.divisionID)[0].statext})` })
        }
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


});
