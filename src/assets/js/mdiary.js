
$(() => {
    $('#pagetitle').html(formatMessage('salediary'));
    $('#potentialcustomer').html(formatMessage('newcustomer'));
    $('#videorecording').html(formatMessage('videorecording'));
    $('#imagerecording').html(formatMessage('imagerecording'));
    $('#videowatching').html(formatMessage('videowatching'));
    $('#msgchatting').html(formatMessage('msgchat'));
    $('.saveBtn').html(formatMessage('save'));

    var subdir = $('#subdir').text();
    var memberID = $('#memberid').text();
    var roleID = $('#roleid').text();
    var cid = $('#cid').text();

    var customerSource = [];
    var selectedmember=0;
    var diaryID=0;

    URL = window.URL || window.webkitURL;


 /************************************************ */
$.post(`/getcustomermember`, {  //Get NVSX - Sale
}).done(function (data){
    if (data.status) {
        screenLog(formatMessage('invalidmember'), 'error');
    } else {
        customerSource = data;
    }
    customerSource.forEach(obj => {obj.namex = `${obj.name} (${rolexSource.filter(f=>f.status==obj.roleID)[0].statext})` })
    if (cid == 0) {
        selectedmember = customerSource[0].memberID;
    } else {
        selectedmember = cid;
    }
    grid.refresh();
    $('#custimgx').attr('src', `public/${subdir}/${customerSource[0].imgLink}`);
    $("#searchBox").dxLookup({
        label:  formatMessage('customer'),
        labelMode: 'static',
        value: parseInt(selectedmember),
        cancelButtonText: formatMessage('cancel'),
        noDataText: formatMessage('nodatatext'),
        searchPlaceholder: formatMessage('search'),
        dataSource: new DevExpress.data.DataSource({ 
            store: customerSource,
            key: "[memberID]"
        }),
        valueExpr: "memberID",
        displayExpr: "namex",
        onValueChanged(a) {
            let selected = customerSource.filter(f=> f.memberID === a.value);
            selectedmember = selected[0].memberID;
            $('#custimgx').attr('src', `public/${subdir}/${selected[0].imgLink}`);
            grid.refresh();
        },
        
    
    }).dxLookup('instance');
})

//************************* */
const URLx = ''; 
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
        return sendRequestARG(`${URLx}/salediarybycustomer/${selectedmember}`, 'POST', args);
    },
    insert(values) {
        console.log(JSON.stringify(values,false,4));
        values[`customerID`] = selectedmember;
        values[`staffID`] = memberID;
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
const grid = $('#profileContainer').dxDataGrid({
    dataSource: memberStore,
    allowColumnReordering: true,
    allowColumnResizing: true,
    columnAutoWidth: true,
    showBorders: true,
    remoteOperations: true,
    wordWrapEnabled: true,
    paging: {
        pageSize: 10,
    },
    pager: {
    showPageSizeSelector: true,
    allowedPageSizes: [10, 12],
    showInfo: true,
    showNavigationButtons: true,
    infoText: `${formatMessage('page')} {0} ${formatMessage('of')} {1} ({2} ${formatMessage('records')})`
    },
    searchPanel: {
        visible: true,
        width: 330,
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
        { dataField: 'dateAdded',
            caption: formatMessage('date'),
            dataType: 'date',
            width: 90,
            allowEditing: false,
            sortIndex: 0, 
            sortOrder: "desc",
            visible: true,
            format: locale=='en'?'dd MMM, yyyy hh:mm:ss':'dd/MM/yyyy hh:mm:ss'
        },
        { dataField: 'note',
            caption: formatMessage('content'),
            visible: true,
            calculateCellValue: function(rowData) {
                return rowData.dtype +'/'+ rowData.note;
              },
            cellTemplate: cellTemplate
        },
        {   type: 'buttons',
            width: 40,
            buttons: [ 
            {   icon: "check",
                hint: "checkIt",
                onClick: function (e) {
                    $.post(`/update/diary`, {
                        diaryID: e.row.data.diaryID,
                        status: 1,
                    }, function(datx){
                        window.location = `/mdiarylisting?${cid}`;
                    })
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
        
        $("a[rel^='like']").click(function(){
           var playurl = this.dataset['para1'];
           $('#videoplayerz').html($('<video />', {
                id: 'videoz',
                src: playurl,
                type: 'video/mp4',
                controls: true,
                autoplay: true,
            }));
            $(`#offcanvasLeft5`).on("hide.bs.offcanvas", function(e) {
                $("#videoz").attr("src", ""); // Remove the video source.
            });
        });
        
        $(`#offcanvasLeft2`).on("show.bs.offcanvas", function(e) {
            $.post(`/new/diary`, {
                customerID: selectedmember,
                staffID: memberID,
                dtype: 3
            }).done(function (data){
                //console.log(data)
                diaryID = data.newid;
                initImageView(data.newid); 
            })
            
        });
        $(`#offcanvasLeft2`).on("hide.bs.offcanvas", function(e) {
            if (diaryID > 0) {
                $.post(`/get/diary/diaryID/eq/${diaryID}/null/null/null/null}`, {
                }).done(function (data){
                    console.log(data)
                    if (data[0] && data[0].note == null) {
                        $.post(`/delete/diary`, {
                            data: JSON.stringify({'diaryID': diaryID})
                        }).done(function (data){
                            console.log('deleted: ' + diaryID)
                        })
                    }
                })
            }
        });
        $(`#offcanvasLeft3`).on("show.bs.offcanvas", function(e) {
            let docText = `
                 <label for="noteHeader">${formatMessage('chatobjective')}</label><br>
                <textarea type="text" id="noteHeader" /></textarea>
            `;
            $('#notex').html(docText);
        });
        
    },
    
    onCellPrepared(e) {
        if (e.rowType === "data") {
            if (e.row.data['status'] == 0) {
                e.cellElement.css({
                    "color":"#33333",
                    "background-color":"#fbcea0",
                })
            } else if (e.row.data['status'] == 1) {
                e.cellElement.css({
                    "color":"#33333",
                    "background-color":"#b5eeb9",
                })
            } else if (e.row.data['status'] == 2) {
                e.cellElement.css({
                    "color":"#33333",
                    "background-color":"#ffa3a3",
                })
            } else if (e.row.data['status'] == 3) {
                e.cellElement.css({
                    "color":"#33333",
                    "background-color":"#addfee",
                })
            } else {  
                e.cellElement.css({
                    "color":"#33333",
                    "background-color":"#eeeeee",
                })
            }
        }
    },
    
    onRowDblClick(e) {
        if (e.key !== 0) {
            let data = e.data;
            window.location = `/mdiaryedit?${data.diaryID}?${data.customerID}`;
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
                    e.cancel = false;
                });
            }
        }
    }
}).dxDataGrid('instance');

//*************** adding new member ************************ */
$('#customername').html(formatMessage('customername'));
$('#address').html(formatMessage('address'));

var company  = $('#company').text();
var subdir  = $('#subdir').text();


setTimeout(function(){
    wardsID.option("dataSource", new DevExpress.data.DataSource({  
        store: wardsSource, 
        filter: ['provincesID', '=', provincesID.option('value')],
        key: "wardsID"
    })); 
}, 500);

var name = $("#namex").dxTextBox({
    label:  formatMessage('customername'),
    stylingMode: 'outline',
    labelMode: 'floating',
    value: ''
}).dxTextBox('instance');

var phone = $("#phonex").dxTextBox({
    label:  formatMessage('phone'),
    stylingMode: 'outline',
    labelMode: 'floating',
    value: ''
}).dxTextBox('instance');

var roleID = $("#rolex").dxLookup({
    label:  formatMessage('role'),
    labelMode: 'floating',
    value: 4,
    cancelButtonText: formatMessage('cancel'),
    noDataText: formatMessage('nodatatext'),
    searchPlaceholder: formatMessage('search'),
    dataSource: new DevExpress.data.DataSource({ 
        store: rolexSource,
        sort: ['statext'], 
        key: "status"
    }),
    valueExpr: "status",
    displayExpr: "statext",
   
}).dxLookup('instance');
var provincesID = $("#cityx").dxLookup({
    label:  formatMessage('city_suburb'),
    labelMode: 'floating',
    value: parseInt($('#provincesid').text()),
    cancelButtonText: formatMessage('cancel'),
    noDataText: formatMessage('nodatatext'),
    searchPlaceholder: formatMessage('search'),
    dataSource: new DevExpress.data.DataSource({ 
        store: provincesSource,
        sort: ['title'], 
        key: "provincesID"
    }),
    valueExpr: "provincesID",
    displayExpr: "title",
    onValueChanged(e) {
        wardsID.option("dataSource", new DevExpress.data.DataSource({  
            store: wardsSource, 
            filter: ['provincesID', '=', e.value],
            key: "wardsID"
        }));  
    },
   
}).dxLookup('instance');

var wardsID = $("#wardx").dxLookup({
    label:  formatMessage('ward'),
    labelMode: 'floating',
    value: parseInt($('#wardsid').text()),
    cancelButtonText: formatMessage('cancel'),
    noDataText: formatMessage('nodatatext'),
    searchPlaceholder: formatMessage('search'),
    dataSource: new DevExpress.data.DataSource({ 
        store: wardsSource, 
        key: "wardsID"
    }),
    valueExpr: "wardsID",
    displayExpr: "title",
    onValueChanged(e) {
        phuongID.option("dataSource", new DevExpress.data.DataSource({  
            store: phuongSource, 
            filter: ['wardsID', '=', e.value],
            key: "phuongID"
        }));  
    },
    
}).dxLookup('instance');


var phuongID = $("#phuongx").dxLookup({
    label:  formatMessage('phuong'),
    labelMode: 'floating',
    value: parseInt($('#phuongid').text()),
    cancelButtonText: formatMessage('cancel'),
    noDataText: formatMessage('nodatatext'),
    searchPlaceholder: formatMessage('search'),
    dataSource: new DevExpress.data.DataSource({ 
        store: phuongSource, 
        key: "phuongID"
    }),
    valueExpr: "phuongID",
    displayExpr: "title"
    
}).dxLookup('instance');

var address = $("#addressx").dxTextBox({
    label:  formatMessage('address'),
    stylingMode: 'outline',
    labelMode: 'floating',
    value: $('#addressee').text()
}).dxTextBox('instance');

var email = $("#emailx").dxTextBox({
    label:  'Email',
    stylingMode: 'outline',
    labelMode: 'floating',
    value: $('#email').text()
}).dxTextBox('instance');

var company = $("#companyx").dxTextBox({
    label:  formatMessage('company'),
    stylingMode: 'outline',
    labelMode: 'floating',
    value: ""
}).dxTextBox('instance');


$('.profileBtn').on('click', function(e){
    e.preventDefault();
    var objArray = [
        {name:'name', value: name.option('value')},
        {name:'phone', value: phone.option('value')},
        {name:'roleID', value: roleID.option('value')},
        {name:'provincesID', value: provincesID.option('value')},
        {name:'wardsID', value: wardsID.option('value')},
        {name:'phuongID', value: phuongID.option('value')},
        {name:'address', value: address.option('value')},
        {name:'email', value: email.option('value')},
        {name:'company', value: company.option('value')},
    ];
    //console.log(objArray)
	$.post(`/insertprofile`, objArray, function(data) {
		if (data.status == 1) { 
            window.location.reload();
		} else {
            screenLog(data.message, 'error')
		}
	}, "json");
});
//************  VIDEO  *************/

$('#vrecordButton').html(`<i class="fa fa-video-camera fa-md" aria-hidden="true"></i>`);

$('#vrecordButton').on('click', function(e) {
    e.preventDefault();
    $('#videocapturex').click();
})

$('#videocapturex').on('change', function(e){
    while (vrecordingsList.hasChildNodes()) {
        vrecordingsList.removeChild(vrecordingsList.lastChild);
    }
    
    var url = URL.createObjectURL(this.files[0]);
    var li = document.createElement('li');
    $('#videoplayerx').html($('<video />', {
        id: 'videoy',
        src: url,
        type: 'video/*',
        controls: true,
        autoplay: true,
    }));
    
    var filenamex = 'DV'+ (Math.floor(new Date().getTime() / 1000)).toString()+ '.mp4';

     //upload link 
    var uploadx = document.createElement('a');
    var file = this.files[0];
    uploadx.href = "#";
    uploadx.classList.add("btn", "btn-success", "btn-md", "text-dark", "px-4", "py-3", "mt-3");
    uploadx.innerHTML = `<i class="fa fa-upload fa-lg" aria-hidden="true"></i>&nbsp;&nbsp;&nbsp;${formatMessage('save')}`;
    uploadx.addEventListener("click", function(event) {
        var xhr = new XMLHttpRequest();
        xhr.onload = function(e) {
            if (this.readyState === 4) {
                let data = JSON.parse(e.target.responseText)
                if (data.status == 1) {
                    window.location.reload(true);
                } else {
                    screenLog(formatMessage('updatefailed'), 'error')
                }
            } 
        };
        var fd = new FormData();
        fd.append("note", file, filenamex);
        xhr.open("POST", `/insertfiles/diary/${selectedmember}/1/${subdir}`, true);
        xhr.send(fd);
    })
    li.appendChild(document.createTextNode(" ")) //add a space in between 
    li.style.display = 'flex';
    li.style.alignItems = 'center';
    li.style.flexDirection = 'column';

    li.appendChild(uploadx) //add the upload link to li

    vrecordingsList.appendChild(li);
})

/****************  IMAGES ************************ */
function initImageView() {
    const maxFileUpload = 6;
    var docImg=[];
    var docPreview=[];
    
    var fileuploadOptions = {
        theme: 'fa5',
        append: true,
        language: 'vi',
        uploadAsync: false,
        browseOnZoneClick: false,
        overwriteInitial: true,
        initialPreviewAsData: true,
        initialPreview: docImg,
        initialPreviewConfig: docPreview,
        maxFileCount: maxFileUpload,
        maxFileSize: 10000,
        initialCaption: formatMessage('fileselect'),
        autoOrientImage: true,
    };
    
    $.extend(fileuploadOptions,{
        uploadUrl: `/uploadfiles/diary/diaryID/${diaryID}/${subdir}`,
        uploadIcon : "<i class='fas fa-upload'></i>",
        removeIcon : "<i class='fas fa-trash-alt'></i>",
        browseIcon : "<i class='fas fa-folder-open'></i>",
        removeClass : 'btn btn-danger',
        allowedFileExtensions: ["jpg", "png", "gif", "pdf", "jpeg"]
    });
    $("#file_upload").fileinput(fileuploadOptions)
    .on('fileuploaded', function(event, previewId, index, fileId) {
        console.log('File Uploaded', 'ID: ' + fileId + ', Thumb ID: ' + previewId);
        window.location.reload();
     }).on('fileuploaderror', function(event, data, msg) {
        console.log('File Upload Error');
     }).on('filebatchuploadcomplete', function(event, preview, config, tags, extraData) {
        console.log('File Batch Uploaded', preview, config, tags, extraData);
        window.location.reload();
     });;
}


$.fn.fileinputLocales['vi'] = {
    sizeUnits: ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'], 
    bitRateUnits: ['B/s', 'KB/s', 'MB/s', 'GB/s', 'TB/s', 'PB/s', 'EB/s', 'ZB/s', 'YB/s'],
    fileSingle: 'file',
    filePlural: 'files',
    browseLabel: `${formatMessage('browse')} &hellip;`,
    removeLabel: formatMessage('delete'),
    removeTitle: 'Clear selected files',
    cancelLabel: 'Cancel',
    cancelTitle: 'Abort ongoing upload',
    pauseLabel: 'Pause',
    pauseTitle: 'Pause ongoing upload',
    uploadLabel: formatMessage('upload'),
    uploadTitle: 'Upload selected files',
    msgNo: 'No',
    msgNoFilesSelected: 'No files selected',
    msgPaused: 'Paused',
    msgCancelled: formatMessage('cancel'),
    msgPlaceholder: 'Select {files} ...',
    msgZoomModalHeading: 'Detailed Preview',
    msgFileRequired: 'You must select a file to upload.',
    msgSizeTooSmall: 'File "{name}" (<b>{size}</b>) is too small and must be larger than <b>{minSize}</b>.',
    msgSizeTooLarge: 'File "{name}" (<b>{size}</b>) exceeds maximum allowed upload size of <b>{maxSize}</b>.',
    msgFilesTooLess: 'You must select at least <b>{n}</b> {files} to upload.',
    msgFilesTooMany: 'Number of files selected for upload <b>({n})</b> exceeds maximum allowed limit of <b>{m}</b>.',
    msgTotalFilesTooMany: 'You can upload a maximum of <b>{m}</b> files (<b>{n}</b> files detected).',
    msgFileNotFound: 'File "{name}" not found!',
    msgFileSecured: 'Security restrictions prevent reading the file "{name}".',
    msgFileNotReadable: 'File "{name}" is not readable.',
    msgFilePreviewAborted: 'File preview aborted for "{name}".',
    msgFilePreviewError: 'An error occurred while reading the file "{name}".',
    msgInvalidFileName: 'Invalid or unsupported characters in file name "{name}".',
    msgInvalidFileType: 'Invalid type for file "{name}". Only "{types}" files are supported.',
    msgInvalidFileExtension: 'Invalid extension for file "{name}". Only "{extensions}" files are supported.',
    msgFileTypes: {
        'image': 'image',
        'html': 'HTML',
        'text': 'text',
        'video': 'video',
        'audio': 'audio',
        'flash': 'flash',
        'pdf': 'PDF',
        'object': 'object'
    },
    msgUploadAborted: 'The file upload was aborted',
    msgUploadThreshold: 'Processing &hellip;',
    msgUploadBegin: 'Initializing &hellip;',
    msgUploadEnd: 'Done',
    msgUploadResume: 'Resuming upload &hellip;',
    msgUploadEmpty: formatMessage('nodataupload'),
    msgUploadError: 'Upload Error',
    msgDeleteError: 'Delete Error',
    msgProgressError: 'Error',
    msgValidationError: 'Validation Error',
    msgLoading: 'Loading file {index} of {files} &hellip;',
    msgProgress: 'Loading file {index} of {files} - {name} - {percent}% completed.',
    msgSelected: '{n} {files} selected',
    msgProcessing: 'Processing ...',
    msgFoldersNotAllowed: 'Drag & drop files only! Skipped {n} dropped folder(s).',
    msgImageWidthSmall: 'Width of image file "{name}" must be at least <b>{size} px</b> (detected <b>{dimension} px</b>).',
    msgImageHeightSmall: 'Height of image file "{name}" must be at least <b>{size} px</b> (detected <b>{dimension} px</b>).',
    msgImageWidthLarge: 'Width of image file "{name}" cannot exceed <b>{size} px</b> (detected <b>{dimension} px</b>).',
    msgImageHeightLarge: 'Height of image file "{name}" cannot exceed <b>{size} px</b> (detected <b>{dimension} px</b>).',
    msgImageResizeError: 'Could not get the image dimensions to resize.',
    msgImageResizeException: 'Error while resizing the image.<pre>{errors}</pre>',
    msgAjaxError: 'Something went wrong with the {operation} operation. Please try again later!',
    msgAjaxProgressError: '{operation} failed',
    msgDuplicateFile: 'File "{name}" of same size "{size}" has already been selected earlier. Skipping duplicate selection.',
    msgResumableUploadRetriesExceeded:  'Upload aborted beyond <b>{max}</b> retries for file <b>{file}</b>! Error Details: <pre>{error}</pre>',
    msgPendingTime: '{time} remaining',
    msgCalculatingTime: 'calculating time remaining',
    ajaxOperations: {
        deleteThumb: 'file delete',
        uploadThumb: 'file upload',
        uploadBatch: 'batch file upload',
        uploadExtra: 'form data upload'
    },
    dropZoneTitle: 'Drag & drop files here &hellip;',
    dropZoneClickTitle: '<br>(or click to select {files})',
    fileActionSettings: {
        removeTitle: 'Remove file',
        uploadTitle: 'Upload file',
        uploadRetryTitle: 'Retry upload',
        downloadTitle: 'Download file',
        rotateTitle: 'Rotate 90 deg. clockwise',
        zoomTitle: 'View details',
        dragTitle: 'Move / Rearrange',
        indicatorNewTitle: 'Not uploaded yet',
        indicatorSuccessTitle: 'Uploaded',
        indicatorErrorTitle: 'Upload Error',
        indicatorPausedTitle: 'Upload Paused',
        indicatorLoadingTitle:  'Uploading &hellip;'
    },
    previewZoomButtonTitles: {
        prev: 'View previous file',
        next: 'View next file',
        rotate: 'Rotate 90 deg. clockwise',
        toggleheader: 'Toggle header',
        fullscreen: 'Toggle full screen',
        borderless: 'Toggle borderless mode',
        close: 'Close detailed preview'
    }
};
//***************************************************** */

$('.saveBtn').on('click', function(e){
    e.preventDefault();
    $.post(`/new/diary`, {
        customerID: selectedmember,
        staffID: memberID,
        dtype: 4,
        note: $('#noteHeader').val()
    }).done(function (datx){
        if (datx.status == 1) {
            window.location =  `/mdiarylist?${selectedmember}`
        } else {
            screenLog(formatMessage('updatefailed'), 'error')
        }
    })
})

$('.clearBtn').on('click', function(e){
    e.preventDefault();
    $('#noteHeader').val('');
    $('#noteTxt').val('');
    
})

function cellTemplate(container, options) {
    //console.log("options.value: " + options.value);
    let backendURL = `public/${subdir}`;
    let imgElement= document.createElement("div");
    if (options.value.split("/")[0] == "1") { //video
        let vid = document.createElement("a");
        vid.setAttribute('id', 'vidplayer')
        vid.setAttribute('href', `javascript:void(0);`);
        vid.setAttribute('rel', `like`);
        vid.setAttribute('data-para1', `./public/${subdir}/${options.value.split("/")[1]}`);
        vid.setAttribute('data-bs-toggle', 'offcanvas')
        vid.setAttribute('data-bs-target', '#offcanvasLeft5')
        vid.setAttribute('aria-controls', '#offcanvasLeft5')
        vid.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 256 256" xml:space="preserve">
            <g style="stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: none; fill-rule: nonzero; opacity: 1;" transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)" >
                <path d="M 83.964 27.023 l -15.558 5.526 V 25.16 c 0 -3.881 -3.146 -7.027 -7.027 -7.027 H 7.027 C 3.146 18.133 0 21.279 0 25.16 V 64.84 c 0 3.881 3.146 7.027 7.027 7.027 H 61.38 c 3.881 0 7.027 -3.146 7.027 -7.027 v -7.389 l 15.558 5.526 C 86.908 64.022 90 61.839 90 58.715 V 31.285 C 90 28.161 86.908 25.978 83.964 27.023 z M 46.67 46.886 L 29.143 57.64 c -1.474 0.904 -3.369 -0.156 -3.369 -1.886 V 34.246 c 0 -1.729 1.895 -2.79 3.369 -1.886 L 46.67 43.114 C 48.077 43.978 48.077 46.022 46.67 46.886 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" />
            </g>
        </svg>
        `;
        imgElement.append(vid);
       
   
    } else if (options.value.split("/")[0] == "3") { //image
        let imagelist = options.value.split("/")[1];
        if (imagelist && (imagelist !== 'undefined') && (imagelist.split(",").length > 0)) {
          let imgArray = imagelist.split(",");
          imgContainer = [];
          imgArray.forEach((f,index)=>{
            if (index % 3 == 0) {
                imgContainer = document.createElement("div");
                imgContainer.classList.add("d-flex", "justify-content-startw")
            }
            let img = document.createElement("img");
            img.classList.add("cover");
            imagepath =  `${backendURL}/${f}`;
            img.setAttribute('src',`${imagepath}`);
            imgContainer.append(img);
            if (((index > 0) && (index % 2 == 0)) ||(index+1==imgArray.length)) {
                imgElement.append(imgContainer);
            }
            
          })  
          
        }
    } else {//text
        imgElement = options.value.split("/")[1].substring(0,128);
    }
   
    container.append(imgElement);
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

 
    
    
})