$(() => {

  $('#pagetitle').html(`${formatMessage('workschedule')}`);
  var roleID = $('#roleid').text();
  var subdir = $('#subdir').text();
  var parentGroupID = $('#groupid').text();

  //var  dt = new Date().toISOString().split("T")[0];
  //console.log(dt)
  
//***************************************************** */


  
//***************************************************** */
const URL = ''; 
var  productData = [];

const tbl = "prodman";
const primekey = "prodmanID";
const memberStore = new DevExpress.data.CustomStore({
    key: primekey,
    load() {
      return sendRequest(`${URL}/prodmanlist`);
    },
    update(key, values) {
      console.log(JSON.stringify(values, false, 4))
      values['manDate']  = values['startDate'].replaceAll('/', '-');
      values['manEnd']  = values['endDate'].replaceAll('/', '-');
      values[`${primekey}`] = key;
      console.log(values)
      delete values.text;
      delete values.startDate;
      delete values.endDate;
      delete values.allDay;
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

sendRequest(`${URL}/productref`).then(function(data) {
  console.log(data)
  productData = data;
  $('#scheduler').dxScheduler({
    timeZone: 'Asia/Ho_Chi_Minh',
    dataSource: memberStore,
    views: ['week', 'month'],
    currentView: 'week',
    currentDate: new Date(),
    startDayHour: 8,
    endDayHour: 22,
    allDayPanelMode: 'hidden',
    height: 960,
    resources: [{
      fieldExpr: 'productID',
      dataSource: productData,
    }],
    appointmentTemplate(model) {
      //console.log(model.appointmentData)
      const productInfo = productData.filter(f=>f.productID == model.appointmentData.productID)[0] || {};
      //console.log(productInfo)

      return $(`${"<div class='text-white'>"
                + "<img width='90', height='100' src='"}public/${subdir}/${productInfo.imgLink}' />`
                 + `<div class='font-weight-bolder pt-1'>${model.appointmentData.text}</div>`
                + `<div class='text-wrap'>${productInfo.productName.substring(0,32)}</div>`
                + `<div>${model.appointmentData.startDate.split(' ')[1]}</div>`
                + `<div>${model.appointmentData.endDate.split(' ')[1]}</div>`
                + '</div>');
    },
    editing: {
      allowAdding: false,
      allowDeleting: false,
      allowUpdating: true,
      allowResizing: true,
      allowDragging: true,
    },
    onAppointmentUpdated(e) {
      //console.log('Updated: ' + JSON.stringify(e.appointmentData));
    },
    onAppointmentClick(e) {
      e.cancel = true;
    },
    onAppointmentDblClick(e) {
      e.cancel = true;
    },
  }).dxScheduler('instance');

});

 
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
      //console.log(result)
      d.resolve(result);
    }).fail((xhr) => {
      d.reject(xhr.responseJSON ? xhr.responseJSON.Message : xhr.statusText);
    });

    return d.promise();
  }


  function sendRequestARG(url, method = 'GET', data) {
    const d = $.Deferred();
    //console.log("url: " + url)
    $.ajax(url, {
      method,
      data,
      cache: false,
      xhrFields: { withCredentials: true },
    }).done((result) => {
        console.log(JSON.stringify(result, false, 4))
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
