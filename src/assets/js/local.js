var roleID = $('#roleid').text();
var divisionID = $('#divisionid').text();
var memberID = $('#memberid').text();

var fullscreen = false;
var currLoc = $(location).attr('href'); 
let pattern = /^(https:\/\/)[a-z]{0,18}(.antifake.vn\/)/;
let result = pattern.test(currLoc);
if ((!result) && (!currLoc.includes("localhost")) 
  && (!currLoc.includes("vintaminon.ddns.net"))
  && (!currLoc.includes("adminvintaminon.ddns.net")) 
  && (!currLoc.includes("antifake.ddns.net")) ) {
  $('body').addClass("invisible")
} 

$('.js-fullscreen').click(function(){
    //console.log ("groupID: " + $("#groupid").text());
    var elem = document.documentElement;
    function openFullscreen () {
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if (elem.webkitRequestFullscreen) { /* Safari */
            elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) { /* IE11 */
            elem.msRequestFullscreen();
        }
    }
    function closeFullscreen() {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) { /* Safari */
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) { /* IE11 */
            document.msExitFullscreen();
        }
    }
    fullscreen = !fullscreen;
    if (fullscreen) openFullscreen()
    else closeFullscreen()			
    
    
});
DevExpress.localization.loadMessages(lang);

const locale = getLocale();
DevExpress.localization.locale(locale);

const { formatMessage } = DevExpress.localization;

const locales = [
    { name: formatMessage('vietnamese') , value: 'vi'},
    { name: formatMessage('english') , value: 'en'}
    
];



const selectBoxOptions = {
  inputAttr: { id: 'selectInput' },
  dataSource: locales,
  displayExpr: 'name',
  valueExpr: 'value',
  value: locale,
  onValueChanged: changeLocale,
};

function changeLocale(data) {
  setLocale(data.value);
  document.location.reload();
}

function getLocale() {
  const storageLocale = sessionStorage.getItem('locale');
  return storageLocale != null ? storageLocale : 'vi';
}

function setLocale(savingLocale) {
  sessionStorage.setItem('locale', savingLocale);
}

const theme = getTheme();
const themes = [
  { name: formatMessage('lightmode') , value: '1'},
  { name: formatMessage('darkmode') , value: '2'},
  { name: 'Đỏ Son' , value: '3'},
  { name: 'Xanh Trời' , value: '4'},
  { name: 'Trăng Tối' , value: '5'},
  { name: 'Xanh cây' , value: '6'},

]; 
const themeselectBoxOptions = {
  inputAttr: { id: 'selectThemeInput' },
  dataSource: themes,
  displayExpr: 'name',
  valueExpr: 'value',
  value: theme,
  onValueChanged: changeTheme,
};

function changeTheme(data) {
  setTheme(data.value);
  $.post(`/update/memberx`, {
    'memberID': memberID,
    'themeID': data.value
  }, function(data){
    window.location = window.location.href;
  })
}
function getTheme() {
  const storageLocale = sessionStorage.getItem('dx-theme');
  return storageLocale != null ? storageLocale : 'generic.light';
}

function setTheme(savingTheme) {
  sessionStorage.setItem('dx-theme', savingTheme);
}

$('#themeselectBox').dxSelectBox(themeselectBoxOptions);


var logger = function() {
  var oldConsoleLog = null;
  var pub = {};
  pub.enableLogger =  function enableLogger() {
                          if(oldConsoleLog == null)
                              return;
                          window['console']['log'] = oldConsoleLog;
                      };

  pub.disableLogger = function disableLogger() {
                          oldConsoleLog = console.log;
                          window['console']['log'] = function() {};
                      };
  return pub;
}();

$('#selectBox').dxSelectBox(selectBoxOptions);

if ($('#production').text() == 1) logger.disableLogger();
else logger.enableLogger();

function screenLog(msg, typex='info') {
  const message = msg;
  const type = typex;
  toast.option({ message, type });
  toast.show(); 
}

const toast = $('#toast').dxToast({ 
  displayTime: 3000,
  width: 'auto',
  show: {
    type: 'fade',
    duration: 400,
    from: 0,
    to: 1
  },
  hide: {
      type: 'fade',
      duration: 400,
      from: 1,
      to: 0
  }
 }).dxToast('instance');

  //******************  COMMON FUNCTIONS ***************** */
  function pad2(n) { return n < 10 ? '0' + n : n }
  function getDateTimeStampString() {
    var date = new Date();
    return pad2(date.getFullYear().toString().slice(-2)) + pad2(date.getMonth() + 1) + pad2( date.getDate()) + pad2( date.getHours() ) + pad2( date.getMinutes() ) + pad2( date.getSeconds()); 
    }

    const defaultNumbers =' hai ba bốn năm sáu bảy tám chín';

    const chuHangDonVi = ('1 một' + defaultNumbers).split(' ');
    const chuHangChuc = ('lẻ mười' + defaultNumbers).split(' ');
    const chuHangTram = ('không một' + defaultNumbers).split(' ');
    
    function convert_block_three(number) {
      if(number == '000') return '';
      var _a = number + ''; //Convert biến 'number' thành kiểu string
    
      //Kiểm tra độ dài của khối
      switch (_a.length) {
        case 0: return '';
        case 1: return chuHangDonVi[_a];
        case 2: return convert_block_two(_a);
        case 3: 
          var chuc_dv = '';
          if (_a.slice(1,3) != '00') {
            chuc_dv = convert_block_two(_a.slice(1,3));
          }
          var tram = chuHangTram[_a[0]] + ' trăm';
          return tram + ' ' + chuc_dv;
      }
    }
    
    function convert_block_two(number) {
      var dv = chuHangDonVi[number[1]];
      var chuc = chuHangChuc[number[0]];
      var append = '';
    
      // Nếu chữ số hàng đơn vị là 5
      if (number[0] > 0 && number[1] == 5) {
        dv = 'lăm'
      }
    
      // Nếu số hàng chục lớn hơn 1
      if (number[0] > 1) {
        append = ' mươi';
        
        if (number[1] == 1) {
          dv = ' mốt';
        }
      }
    
      return chuc + '' + append + ' ' + dv; 
    }

    const dvBlock = '1 nghìn triệu tỷ'.split(' ');

    function to_vietnamese(number) {
        var str = parseInt(number) + '';
        var i = 0;
        var arr = [];
        var index = str.length;
        var result = [];
        var rsString = '';

        if (index == 0 || str == 'NaN') {
            return '';
        }

        // Chia chuỗi số thành một mảng từng khối có 3 chữ số
        while (index >= 0) {
            arr.push(str.substring(index, Math.max(index - 3, 0)));
            index -= 3;
        }

        // Lặp từng khối trong mảng trên và convert từng khối đấy ra chữ Việt Nam
        for (i = arr.length - 1; i >= 0; i--) {
            if (arr[i] != '' && arr[i] != '000') {
            result.push(convert_block_three(arr[i]));

            // Thêm đuôi của mỗi khối
            if (dvBlock[i]) {
                result.push(dvBlock[i]);
            }
            }
        }

        // Join mảng kết quả lại thành chuỗi string
        rsString = result.join(' ');

        // Trả về kết quả kèm xóa những ký tự thừa
        return rsString.replace(/[0-9]/g, '').replace(/ /g,' ').replace(/ $/,'');
    }

    

    //****** navigation header label ******/
  $('#livestatistic').html(formatMessage('livestatistic'));
  $('#siteactivity').html(formatMessage('siteactivity'));
  $('#summarystat').html(formatMessage('summarystat'));
  $('#salestat').html(formatMessage('salestat'));
  $('.mangroup').html(formatMessage('mangroup'));
  $('.directorboard').html(formatMessage('directorboard'));
  $('.manstaff').html(formatMessage('manstaff'));
  $('.distributor').html(formatMessage('distributor'));
  $('.diststaff').html(formatMessage('diststaff'));
  $('.agent').html(formatMessage('agent'));
  $('.agestaff').html(formatMessage('agestaff'));
  $('.contact').html(formatMessage('contact'));
  $('.customer').html(formatMessage('customer'));
  $('.supplier').html(formatMessage('supplier'));
  $('#productmanagement').html(formatMessage('productmanagement'));
  $('.brand').html(formatMessage('brand'));
  $('.category').html(formatMessage('category'));
  $('.product').html(formatMessage('product'));
  $('.prodsearch').html(formatMessage('prodsearch'));
  $('.boxsearch').html(formatMessage('boxsearch'));
  $('.palletsearch').html(formatMessage('palletsearch'));
  $('#manufacturingmanagement').html(formatMessage('manufacturingmanagement'));
  $('.prodman').html(formatMessage('prodman'));
  $('#businessmanagement').html(formatMessage('businessmanagement'));
  $('.prodstat').html(formatMessage('prodstat'));
  $('.prodmon').html(formatMessage('prodmon'));
  $('.rawstat').html(formatMessage('rawstat'));
  $('.rawmon').html(formatMessage('rawmon'));
  $('.prodformula').html(formatMessage('prodformula'));
  $('#salespreadmap').html(formatMessage('salespreadmap'));
  $('#brandspread').html(formatMessage('brandspread'));
  $('#categoryspread').html(formatMessage('categoryspread'));
  $('#productspread').html(formatMessage('productspread'));
  $('#distributorspread').html(formatMessage('distributorspread'));
  $('#walletmanagement').html(formatMessage('walletmanagement'));
  $('#walletxchange').html(formatMessage('walletxchange'));
  $('#walletapproval').html(formatMessage('walletapproval'));

  $('#account').html(formatMessage('account'));
  $('#settings').html(formatMessage('settings'));
  $('#updateprofile').html(formatMessage('updateprofile'));
  $('#changepassword').html(formatMessage('changepassword'));
  $('#mywallet').html(formatMessage('mywallet'));
  $('#checkwallet').html(formatMessage('checkwallet'));

  $('#promotionmanagement').html(formatMessage('promotionmanagement'));
  $('#promotion').html(formatMessage('promotion'));
  $('#campaign').html(formatMessage('campaign'));
  $('.warehouse').html(formatMessage('warehouse'));
  $('.palletqrcode').html(formatMessage('palletqrcode'));
  $('.boxqrcode').html(formatMessage('boxqrcode'));
  $('.exportedqrcode').html(formatMessage('exportedqrcode'));
  $('.pallet').html(formatMessage('pallet'));
  $('.box').html(formatMessage('box'));
  $('#manageorders').html(formatMessage('manageorders'));
  $('.ordersx').html(formatMessage('ordersx'));
  $('.incltax').html(formatMessage('incltax'));

  $('.qrcodestat').html(formatMessage('qrcodestat'));
  $('.manustat').html(formatMessage('manustat'));
  $('.salestat').html(formatMessage('salestat'));

  $('#supportmanagement').html(formatMessage('supportmanagement'));
  $('#esmsxchange').html(formatMessage('esmsxchange'));
  $('#resetdb').html(formatMessage('resetdb'));
  $('#topupservice').html(formatMessage('topupservice'));
  $('#promotype').html(formatMessage('promotype'));
  $('#mangagesalediary').html(formatMessage('mangagesalediary'));
  $('.salediarybystaff').html(formatMessage('salediarybystaff'));
  $('.salediarybycustomer').html(formatMessage('salediarybycustomer'));
  $('.workschedule').html(formatMessage('workschedule'));
  $('.manschedule').html(formatMessage('manschedule'));
  $('.deliveryschedule').html(formatMessage('deliveryschedule'));



  //************* Finance *************/
  $('.financemanagement').html(formatMessage('financemanagement'));
  $('.accountinit').html(formatMessage('accountinit'));
  $('.profitnloss').html(formatMessage('profitnloss'));
  $('.balancesheet').html(formatMessage('balancesheet'));
  $('.revenue').html(formatMessage('revenue'));
  $('.expense').html(formatMessage('expense'));
  $('.payroll').html(formatMessage('payroll'));
  $('.assetman').html(formatMessage('assetmanagement'));
  $('.accountlist').html(formatMessage('accountlist'));
  $('.quickcheck').html(formatMessage('quickcheck'));
  $('.illness').html(formatMessage('illness'));
  $('.symptom').html(formatMessage('symptom'));
  $('.prescription').html(formatMessage('prescription'));
  $('.diagnostic').html(formatMessage('diagnostic'));
  $('#prescriptionlist').html(formatMessage('prescriptionlist'));
  $('#medicationlist').html(formatMessage('medicationlist'));
  $('.prodcount').html(formatMessage('prodcount'));

  
  






  $.fn.fileinputLocales['vi'] = {
    sizeUnits: ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'], 
    bitRateUnits: ['B/s', 'KB/s', 'MB/s', 'GB/s', 'TB/s', 'PB/s', 'EB/s', 'ZB/s', 'YB/s'],
    fileSingle: 'file',
    filePlural: 'files',
    browseLabel: `${formatMessage('browse')} &hellip;`,
    removeLabel: formatMessage('delete'),
    removeTitle: 'Clear selected files',
    cancelLabel: formatMessage('cancel'),
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
    dropZoneTitle: ' Kéo & bỏ file ở đây &hellip;',
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

  
  
  
  
  

 



