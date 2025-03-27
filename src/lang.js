module.exports = function(lang){
  var la = {};
  switch (lang) {
    case 'en':
      la = {
        submit: 'Submit',
        login: 'Log in',
        lostyourpassword: 'Lost your password?',
        newtosite: 'New to site?',
        retrievepassword: 'Retrieve Password',
        login_form:'Login',
        username: 'Username',
        password: 'Password',
        passwordrestriction: 'Min 8 chars with atleast 1 upper, 1 lower letter, 1 number',
        confirmpassword: 'Confirm Password',
        create_account: 'Create Account',
        update_account: 'Update Account',
        update_password: 'Update Password',
        person_name: 'Contact Name',
        person_phone: 'Contact Phone ',
        person_id: 'Personal ID(Driver Lic)',
        business_name: 'Business Name',
        address: 'Address',
        city_suburb: 'City/Suburb',
        contactphone: 'Phone',
        businessrego: 'ABN',
        please_login: 'Hello - Please Login To Your Account',
        username_notfound: 'Username is not found',
        username_islocked: 'User is temporary locked please contact Admin',
        invalid_password:'Invalid password',
        username_istaken: 'Username is already taken..',
        ur_alreadyregister: 'Already registered',
        email_alreadyused: 'Email is already used',
        chkemail_confirm: "Please check your email to confirm that you have successfully registered.",
        chkemail_resetpwd: "Please check your email to verify password reset.",
        alreadyregister: "Already a member?",
        enteremail2retrievepassword: 'Enter your email to retrieve password',
        losspassword: 'Loss Password',
        loginwithtemporarypasswd: 'This is your temporary password https://antifake.vn, please login your account and change it.',
        warningemailchanged: 'Warning - your account Email has been changed.  Please ignore if it were you who made the change, if you think that your account has been hacked, please contact ikaraoke.vn@gmail.com',
        changedemail: 'Changed contact Email',
        enterusername:'Please enter your username.',
        enterpassword: 'Please enter your password',
        enternewpassword: 'Please enter the new password',
        password6charslong: 'Your password must be atleast 6 chars long',
        entername: 'Please enter contact person',
        enterbusinessname: 'Please enter your business name',
        enteremail: 'Please enter your email for contact',
        digitonly: 'Please enter 0-9 digits only',
        enterphone: 'Please enter your contact phone',
        enteraddress: 'Please enter your address',
        entercity: 'Please enter your city/suburb',
        enterbrego: 'Please enter your ABN',

        totalsessions: 'Total Sessions',
        totalmembers: 'Total Members',
        totalplays: 'Total Plays',
        totalassets: 'Total Assets',
        totalviewers: 'Total Viewers',
        totaltransaction:'Total Transactions',
        totalsearch: 'Total Search',
        logout: 'Log out',
        close: 'Close',
        pleasewait: 'Please wait...',
        welcomehome: 'Welcome to AntiFake!',
        confirmsuccess: 'This email confirms that you have successfully created new account on AntiFake',
        updatesuccess: 'The record is updated successfully !!',
        updatefailed: 'The record is updated unsuccessfully !!',
        deletesuccess: 'The record is deleted successfully !!',
        deletefailed: 'The record delete is failed !!',
        home: 'Home',
        appstat: 'App Usage Statistic',
        roomsold: '#Room Sold',
        numads: '#ads',
        numviewers: '#viewers',
        numsessions: '#sessions',
        calendar: 'Calendar',

        lastchanged: 'Last Edit Date',
        dateadded: 'First Edit Date',
        registereddate: 'Registered Date',
        memberdated: 'Official Member AntiFake',
        customerdated: 'Official Joining Date',
        approvedno: 'Approved No.',
        approveddate: 'Approved Date',
        status: 'Status',
        legend: 'Legend',
        description: 'Description',
        update: 'Update',
        edit: 'Edit',
        deletex: 'Delete',
        newx: 'New',
        fileupload: 'Upload Video',
        fileselect: 'Choose file',
        imageselect: 'Upload image file',
        exportdata: 'Export Data',
        confirmtodelete: 'Confirm to delete',
        confirmed: 'Confirmed',
        broadcast: 'Broadcast',

        manage: 'Managing',
        youhavenotlogin: 'You have not logged in!!',
        enteremailasusername:'Please enter email as your username.',
        good: 'Look good!!',
        pwdnotmatched: 'Confirmed passwords not matched!',
        donthaveanaccount: 'Don\'t have an account?',
        register: 'Register',
        trial30days: 'Experience 30 days free trial with AntiFake Hotel Management System.',
        experienceabe: 'AntiFake - a simple way to manage your hotel business',
        activitylog: 'Activity Log',

        livestatistic: 'DASHBOARD',
        businessactivity: 'Business Activity',
        distributionnetwork: 'Distribution Network',
        interface: 'Interface',
        videotools: 'Video Making Tools',
        convertimagetovideoslide: 'Convert images into Video',
        imagetranseffect: 'Image Transition Effect',
        workingcalendar: 'Working Calendar',
        settingcalendar: 'Setting Calendar',
        settingschedule: 'Setting Schedule',
        investors: 'Shareholder',
        references: 'References',

        viewrego: 'Add support documents',

        selectx: 'Select',
        uploadbizregodoc: 'Upload business registration',
        viewbizrego: 'Please fill-in the contact person and business name',
        bizregodoc: 'Business registration',
        notexist: 'Not existed',
        language: 'Language',
        english: 'English',
        vietnamese: 'Vietnamese',
        reset: 'Reset',
        uploadfiles: 'Upload files',


        pleaseselectanitem: 'Please select an item!',
        customer: 'Customer',
        revenue: 'Revenue',
        expense: 'Expenses',
        humanresource: 'Human Resource',
        payroll: 'Payroll',
        paychart: 'Paychart',
        stafflist: 'Staff List',
        staff: 'Staff',
        staffselect: 'Select Staff',
        payslip: 'Pay Advice',
        search: 'Search',
        agentlist: 'Agents List',
        supplierlist: 'Supplier List',
        customerlist: 'Customer List',
        memberlist: 'Member List',
        zalolist: 'Zalo List',
        contact: 'Contact',
        businessmanagement: 'Business Management',
        bookingmanagement: 'Booking Management',
        bookingchart: 'Booking Chart',
        financemanagement: 'Finance Management',
        profitnloststatement: 'Profit&Loss Statement',
        profitnlostchart: 'Profit&Loss Chart',
        pricechart: 'Price Chart',
        authoritytodo: 'Sorry you have no authority to perform this task!',
        accommodation: 'Accommodation',
        bookingcalendar: 'Booking Calendar',
        roomlist: 'Room List',

        exceeduploadfilelimit: 'Exceed the allowable number of upload files',
        viewimage: 'View/Load Images',

        managementboardlist: 'Management Board List',
        settings: 'Settings',
        managementboard: 'Management Board',
        administration: 'Administration',
        investorlist: 'Shareholder List',
        workschedule: 'Roster Schedule',

        saveroster: 'Save roster',
        savewklyschedule: 'Save current shown weekly roster for the following weeks',
        numweektobeschedule: 'Please enter the number of weeks that roster will be applied for',
        cantdeleteexistingevent: 'Can\'t overwrite used events',
        addnote: 'Add Note..',
        note: 'Note',
        deleterecord: 'Delete record',
        save: 'Save',
        fromdate: 'From Date',
        todate: 'To Date',
        print: 'Print',
        taxfileno: "ABN No.",
        payee: 'Payee',
        ebit: 'EBIT',
        npat: 'NPAT',
        tgstsales: 'GST on Sales',
        paygtaxwithheld: 'PAYG Tax Withheld',
        tgstpurchases: 'GST on Purchases',
        gstamount: 'GST Balance',
        total: "Total",
        dateof: 'Date: ',
        period: 'Period',
        quarter: 'Quarter',
        expenseslist: 'Expenses List',
        saleslist: 'Revenues List',
        accountisused: 'Unable to delete - account is already in use!',
        paidamount: 'Paid Amt',
        unionfee: 'Union Fee',
        deletex: 'Delete',

        journal: 'Journal',
        gstactivity: 'GST Activity Statement',
        checkaccount: 'Check Account',
        getmoney: 'Withdraw money',
        addmoney: 'Add money',
        invoiceads: 'Invoice',
        invoicetext1: 'Thank you for using our services.',
        invoicetext2: 'Please find and check attached invoice for your conveniences!',
        invoicereceive: '',
        invoice: 'Tax Invoice',
        refund: 'Refund',
        cancellationfee: 'Cancellation Fee',
        GST: 'GST',
        cancelled: 'CANCELLED',
        monitor: 'Monitor',
        design: 'Design',
        createpanogroup: 'Setting up screen group',
        panogroup: "Screen Group",
        others: 'Others',
        termsandcondtions: 'Terms & Conditions of Use',
        accountmanagement: 'Account Management',

        contactus: 'Contact AntiFake',
        maintenanceSchedule: 'Maintenance Schedule',
        roomname: 'Room Name',
        doublebookingerror: 'Double booking error!!',
        pay: 'Pay',
        saleinvoice: 'Sale Invoice',
        deletex: 'Delete',
        adults: 'Adults',
        children: 'Children',
        goodservice: 'Product|Service',
        registrationcard: 'Registration Card',
        emailbooking: 'Email Booking',
        emailinvoice: 'Email Invoice',
        emailstatement: 'Email Statement',
        bookingconfirmation: 'Booking Confirmation',
        numadults: 'No.Adults',
        numchildren: 'No.Child',
        instruction0: 'Check in time is 2:00PM.',
        instruction1: 'Check out time is 10:00AM.',
        instruction2: 'Late Check out between 10:00am until 1:00pm is subject to availability at a charge of $75 for a 1 bedroom appartment and $150 for a 2 bedroom appartment. Checkout after 1:00pm will incur full tariff.',
        instruction3: 'Extra fold out beds are available at $30 per night.',
        instruction4: 'Infant cots are available at a charge of $14 per night, or $65 per week.',
        instruction5: 'Our Payment/Cancellation policy is as follows: 7 days prior to the date of your arrival, the total amount is taken off the credit card provide and is non-refundable.',
        instruction6: 'All bookings will only be accepted with a valid credit card. Cash or debit card bookings will require a $300 bond which is refundable on departure.',
        instruction7: 'All Cancellations requires 7 days notice and failure will incur full cost of your booking cancellation fee. This condition does not apply to 15% discount NOREFUND Promo.',
        instruction8: 'Please note that your bank will charge a 1.8% Surcharge on any payments made by credit cards.',
        instruction9: ' Please note that that Anti-Social behaviour is strictly prohibited, and penalties of a $300 fine as well as police involvement will occur to anyone found guilty.',
        termsnconditions: 'Terms & Conditions',
        paytype: 'Paying Method',
        unitprice: 'Unit Price',
        tax: 'Tax',
        qty: 'Qty',
        subtotal: 'Subtotal',
        notpaidyet: 'This invoice has not been paid.',
        fullypaid: 'This invoice is fully paid',
        paid: 'Paid',
        cash: 'CASH',
        credit: 'VISA|MASTER',
        eftpos: 'EFTPOS',
        paypal: 'PAYPAL',
        square: 'SQUARE',
        amex: 'AMEX',
        crypto: 'CRYPTO',
        bankxfer: 'BANKWIRED',
        item: 'Chi tiết',
        thankyouforusingourservice: 'Thank you for using our services.',
        serviceschedule: 'Service Schedule',
        cleaningschedule: 'Cleaning Schedule',
        schedule: 'Schedule',
        booksearch: 'Booking Search',
        settings: 'Settings',
        room: 'Room',
        roomtype: 'Room Type',
        roompricelist: 'Room Price',
        holidaycalendar: 'Holiday & Peak Calendar',
        holidaytable: 'Holiday Calendar',
        highseasontable: 'Peak Season Calendar',
        services: 'Services',
        servicestype: 'Services Type',
        serviceslist: 'Services List',
        incidentregister: 'Incident Register',
        assetmanagement: 'Asset Management',
        assetlist: 'Asset List',
        depreciationschedule: 'Depreciation Schedule',
        deprectype: 'Depreciation Type',
        balancesheet: 'Balance Sheet',
        selectdate: 'Select Date',
        arrival:'NEWARRIVAL',
        tidy:'TIDY',
        checkonly: 'CHKONLY',
        linchg: 'LINCHG',
        towechg: 'TOWECHG',
        depart: 'DEPART',
        autogen: 'AutoGen',
        longterm: 'LONGTRM',
        selfserv: 'SELFSERV',
        noservice: 'NOSERVICE',
        hours: 'Hrs',
        minutes: 'Mins',
        totalcustomers: 'Total Customers Stayed',
        totalroomnightsold: 'Total Room Night Sold',
        totalroomnightavail: 'Total Room Night Avail',
        totalbooking: 'Total Booking',
        onlinebooking: 'Total Online Booking',
        directbooking: 'Total Direct Booking',
        partnerbooking: 'Total Partner Booking',

        saletarget: 'Sale Target',
        achievedrevenue: 'Achieved Revenue',
        plannedbudget: 'Planned Budget',
        actualexpenses: 'Actual Expenses',
        occupancyrate: 'Occupancy Rate',
        adr: 'Average Daily Rate',
        revpar: 'Rev Per Avail Room',
        stayduration: 'Average Stay Duration',
        averagespending: 'Average Spending',
        numbookings: '#Bookings',
        unitbed: 'Unit/Room',
        norecordfoundwarning: 'No record found!!!',
        combinesuper: 'Super payment',
        restaurant: 'Restaurant',
        conference: 'Conference',
        tablelist: 'Table List',
        table: 'Table',
        tablebooking: 'Restaurant Booking',
        menu: 'Dish Menu',
        menulist: 'Menu List',
        menuraw: 'Stock required for dish',
        dishlist: 'Dish List',
        purchaseorder: 'Purchase Order',
        netbalance: 'NET BALANCE',
        foodstock: 'Stock Inventory',
        stocklist: 'Stock List',
        stocklosswrittenoff: 'Stock loss being written off',
        accountinit: 'Account Initialization',
        accountinitnote1: 'Account initialization is the first step to enter the inital value for all accounts ie Bank|Cash account, value of land, building, equipments, construction, goodswill, etc,, and initial owners equity',
        accountinitnote2: 'The balance sheet must be balanced before the business starts to operate i.e. Assets = Liabilities + Shareholder|Owners Equity',
        assets: 'Assets',
        liabilitiesequity: 'Shareholder|Owner\'s Equity',
        dish: 'Dish',
        ingredients: 'Ingredients',
        dishgroup: 'Dish Group',
        depreciation: 'Depreciation',
        buildings:'Building & Construction',
        equipments: 'Equipments & Fittings',
        myroster: 'My Roster',
        maintenance: 'Maintenance',
        incident: 'Incident',
        personalinfo: 'Personal Info',
        tabletype: 'Table Type',
        statement: 'Statement',
        statementlist: 'Statement List',
        invoicelist: 'Invoice List',
        expenselist: 'Expense List',
        setpayall: 'Set Pay All',
        totalpaid: 'Total Paid',
        totaltax: 'Total Tax',
        totalsuper: 'Total Super',
        totalnet: 'Total Net',
        payrollstatement: 'Payroll Statement',
        night:'Nights',
        business: 'Business',
        info: 'Info',
        features: 'Features',
        deals: 'Deals',
        issue: 'Internal Mail',
        dualingroup: '2StaffTeam',
        owneraccount: 'Owner Account',
        ownername: "Owner\'s name",
        selectmonth: 'Select a monthly period',





















      }
    break;
    case 'vi':
      la = {
        submit: 'Nhập',
        login: 'Nhập tài khoản',
        lostyourpassword: 'Bị mất mật mã?',
        newtosite: 'Mới vào lần đầu?',
        retrievepassword: 'Tìm lại mật mã',
        login_form:'Nhập tài khoản',
        username: 'Tên tài khoản',
        password: 'Mật mã',
        passwordrestriction: 'Ít nhất 8 chữ, gồm 1 chữ hoa, 1 thường, và 1 số',
        confirmpassword: 'Lặp lại mật mă',
        create_account: 'Đăng ký tài khoãn',
        update_account: 'Chỉnh sữa tài khoãn',
        update_password: 'Chỉnh sữa mật mã',
        person_name: 'Tên người đại diện',
        person_id: 'Số CMND',
        person_phone: 'Điện thoại liên lạc',
        business_name: 'Tên doanh nghiệp',
        address: 'Địa chỉ',
        city_suburb: 'Quận/Huyện',
        contactphone: 'Điện thoại',
        businessrego: 'Mã số thuế',
        please_login: 'Xin vui lòng nhập mật mã vào tài khoản cũa Bạn',
        username_notfound: 'Tài khoãn không tồn tại',
        username_islocked: 'Tài khoãn bị khoá, xin liên lạc Admin',
        invalid_password:'Mật mã không đúng',
        username_istaken: 'Tên tài khoãn đã có người dùng',
        ur_alreadyregister: 'Bạn đã đăng ký',
        email_alreadyused: 'Email đã có người dùng',
        chkemail_confirm: "Làm ơn kiểm tra Email để xác định Bạn đã đăng ký thành công",
        chkemail_resetpwd: "Kiểm tra Email để xác định mật mã được đặt lại.",
        alreadyregister: "Đã đăng ký ?",
        enteremail2retrievepassword: 'Nhập Email để tìm lại mật mã',
        losspassword: 'Mất mật mã',
        loginwithtemporarypasswd: 'Đây là mật mã tạm OTP để Bạn nhập vào AntiFake https://antifake.vn, chỉ hiệu lực một lần sử dụng',
        warningemailchanged: 'Cảnh báo tài khoãn Email cũa Bạn bị thay đổi. Bạn không cần quan tâm nếu bạn chủ động làm việc này. Trường hợp Bạn nghĩ tài khoãn cũa mình bị hacked xin liên lạc ikaraoke.vn@gmail',
        changedemail: 'Thay đổi tài khoãn Email',
        enterusername:'Vui lòng nhập tên tài khoản.',
        enterpassword: 'Vui lòng nhập mật mã.',
        enternewpassword: 'Vui lòng nhập mật mã mới..',
        password6charslong: 'Mật mã phải có ít nhất 6 ký tự',
        entername: 'Vui lòng nhập tên người đại diện để liên lạc',
        enterbusinessname: 'Vui lòng nhập tên doanh nghiệp',
        enteremail: 'Vui lòng nhập địa chỉ Email',
        digitonly: 'Vui lòng chỉ nhập số 0-9',
        enterphone: 'Vui lòng nhập số điện thoại',
        enteraddress: 'Vui lòng nhập địa chỉ',
        entercity: 'Vui lòng nhập tên Quận/Huyện hay Thành Phố/Tỉnh',
        enterbrego: 'Vui lòng nhập số đăng ký doanh nghiệp hay số VAT',

        totalsessions: 'Số chương trình',
        totalmembers: 'Số thành viên tham gia',
        totalplays: 'Số lượt chiếu',
        totalassets: 'Số quảng cáo',
        totalviewers: 'Số người xem',
        totaltransaction:'Số giao dịch',
        totalsearch: 'Tổng số lần tìm kiếm',
        logout: 'Xuất',
        close: 'Đóng',
        pleasewait: 'Xin vui lòng đợi trong giây lát..',
        welcomehome: 'Chào mừng các bạn đến với AntiFake ',
        confirmsuccess: 'Tin nhắn này xác nhận Bạn đã thành công tạo được tài khoãn trên AntiFake.',
        updatesuccess: 'Tập dữ liệu được cập nhật thành công.',
        updatefailed: 'Tập dữ liệu cập nhật thất bại.',
        deletesuccess: 'Tập dữ liệu được huỷ bỏ thành công.',
        deletefailed: 'Huỷ bõ tập dữ liệu bị thất bại !!',
        home: 'Báo cáo',
        appstat: 'Tổng quan',

        roomsold: '#Phòng bán',
        numads: '#quảng cáo',
        numviewers: '#người xem',
        numsessions: '#chương trình',
        calendar: 'Lịch',

        lastchanged: 'Ngày cập nhật cuối',
        dateadded: 'Ngày cập nhật đầu',
        registereddate: 'Ngày đăng ký',
        memberdated: 'Ngày gia nhập AntiFake',
        customerdated: 'Ngày gia nhập',
        approvedno: 'Giâý phép số',
        approveddate: 'Ngày cấp',
        status: 'Tình trạng',
        legend: 'Chú giải',
        description: 'Chú thích',
        update: 'Chỉnh sửa',
        edit: 'Chỉnh',
        deletex: 'Xoá',
        newx: 'Thêm mục',
        fileupload: 'Tải file',
        fileselect: 'Chọn file',
        imageselect: 'Chọn hình ảnh để tải',
        entertitle: 'Vui lòng nhập tựa đề',
        exportdata: 'Xuất dữ liệu',
        confirmtodelete: 'Xác nhận huỷ bỏ',
        confirmed: 'Xác nhận',
        broadcast: 'Phát sóng',

        manage: 'Quản lý',
        youhavenotlogin: 'Bạn chưa đăng ký!!',
        enteremailasusername:'Vui lòng nhập email cho tên tài khoản',
        lookgood: 'Điền đúng, tốt!',
        pwdnotmatched: 'Mật mã lặp lại không trùng!',
        donthaveanaccount: 'Bạn chưa có tài khoản?',
        register: 'Đăng ký',
        trial30days: 'Trãi nghiệm hệ thống quản lý khách sạn AntiFake với 30 ngày miễn phí.',
        experienceabe: 'AntiFake hệ thống quản lý khách sạn AntiFake công nghiệp 4.0',
        activitylog: 'Lưu ký hoạt động',

        livestatistic: 'Thông tin tổng quát',
        businessactivity: 'Hoạt động kinh doanh',
        distributionnetwork: 'Mạng lưới phân phối',
        interface: 'Kết nối',
        videotools: 'Công cụ làm Video',
        convertimagetovideoslide: 'Chuyển Hình qua Video',
        imagetranseffect: 'Biến hoạ Video',
        workingcalendar: 'Lịch hoạt động ',
        settingcalendar: 'Lên lịch làm việc',
        settingschedule: 'Lên lịch phát sóng',
        investors: 'Cổ Đông',
        references: 'Tham khảo',
        viewrego: 'Bổ túc hồ sơ',

        selectx: 'Chọn lựa',
        uploadbizregodoc: 'Tải giấy chứng nhận đăng ký kinh doanh',
        viewbizrego: 'Xin điền tên người đại diện và tên doanh nghiệp',
        bizregodoc: 'Giấy phép kinh doanh',
        notexist: 'Chưa có',
        language: 'Ngôn ngữ',
        english: 'Tiếng Anh',
        vietnamese: 'Tiếng Việt',
        reset: 'Đặt lại',
        uploadfiles: 'Tải hồ sơ',

        pleaseselectanitem: 'Vui lòng lựa chọn một danh mục!',
        customer: 'Khách hàng',
        revenue: 'Doanh thu',
        expense: 'Chi tiêu',
        humanresource: 'Quản lý nhân sự',
        payroll: 'Lương bổng',
        paychart: 'Bảng giá lương',
        stafflist: 'Danh sách nhân viên',
        staff: 'Nhân viên',
        staffselect: 'Chọn nhân viên',
        payslip: 'Phiếu trả lương',
        account: 'Tài khoản',
        search: 'Tìm',
        agentlist: 'Danh sách đối tác',
        supplierlist: 'Danh sách nhà cung cấp',
        customerlist: 'Danh sách khách hàng',
        memberlist: 'Danh sách thành viên',
        zalolist: 'Danh sách Zalo',
        contact: 'Danh bạ',
        businessmanagement: 'Quản lý kinh doanh',
        bookingmanagement: 'Quản lý đặt phòng',
        financemanagement: 'Quản lý tài chính',
        profitnloststatement: 'Bảng tổng kết thu nhập',
        profitnlostchart: 'Biểu thị chi thu',
        pricechart: 'Biểu thị giá phòng',
        bookingchart: 'Biểu thị phòng đặt qua các kênh',
        authoritytodo: 'Xin lỗi, bạn không có thẩm quyền phê chuẩn chuyện này',
        accommodation: 'Đặt phòng',
        bookingcalendar: 'Lịch đặt phòng',
        roomlist: 'Danh sách phòng',
        exceeduploadfilelimit: 'Vuợt quá sồ lượng tập tin cho phép',
        viewimage: 'Xem/Tải hình ảnh',
        address: 'Địa chỉ',
        selectx: 'Chọn lựa',
        settings: 'Cài đặt',
        managementboard: 'Ban Quản trị',
        diagnostic: 'Chuẩn đoán',
        value: 'Điểm thang',
        order: 'Thứ tự xếp',
        save: 'Lưu',
        province: 'Tỉnh/Thành phố',
        ward: 'Quận/Huyện',
        ranking: 'Xếp hạng',
        area: 'Diện tích Km2',
        population: 'Dân số',
        managementboardlist: 'Danh sách ban quản trị',
        workschedule: 'Bảng phân công',
        investorlist: 'Danh sách Cổ Đông',
        administration: 'Cơ sở hành chính',
        savewklyschedule: 'Thao tác này sẽ copy lịch trình làm việc đang hiển thị vào cho những tuần kế tiếp',
        numweektobeschedule: 'Vui lòng nhập số tuần mà lịch trình sẽ được áp dụng cho',
        cantdeleteexistingevent: 'Không thể xoá lịch trình đã xử dụng!!',
        addnote: 'Thêm lời ghi chú',
        note: 'Tin nhắn',
        deleterecord: 'Huỷ tập tin',
        fromdate: 'Từ ngày',
        todate: 'Tới ngày',
        print: 'In',
        payee: 'Tên NV',
        taxfileno: 'CMND',
        ebit: 'EBIT Thu nhập trước lãi vay và thuế',
        npat: 'NPAT Thu nhập sau lãi vay và thuế',
        tgstsales: 'VAT Thu',
        paygtaxwithheld: 'Thuế Thu Nhập',
        tgstpurchases: 'VAT Chi',
        gstamount: 'VAT sau Thu Chi',
        total: "Tổng số",
        dateof: 'Ngày: ',
        period: 'Chu kỳ',
        quarter: 'Quý',
        expenseslist: 'Danh sách chi tiêu',
        saleslist: 'Danh sách doanh thu',
        accountisused: 'Không thể xoá - Tài khoản đã được sử dụng!',
        paidamount: 'Lương',
        unionfee: 'Liên Đoàn Lao Động',
        deletex: 'Huỷ',
        journal: 'Nhật ký cái',
        checkaccount: 'Tài Khoản Thu Nhập',
        getmoney: 'Rút tiền',
        addmoney: 'Nạp thêm tiền',
        invoiceads: 'Hoá đơn dịch vụ quảng cáo',
        invoicetext1: 'Xin cám ơn quý khách đã sử dụng hệ thống quản lý khách sạn AntiFake',
        invoicetext2: 'Xin quý khách làm ơn kiểm tra hoá đơn đính kèm với Email này',
        invoicereceive: '',
        invoice: 'Hoá đơn',
        refund: 'Hoàn tiền',
        cancellationfee: 'Phí huỷ hợp đồng',
        GST:'GTGT',
        cancelled: 'ĐÃ HUỸ',
        monitor: 'Giám sát',
        design: 'Thiết kế',
        createpanogroup: 'Tạo nhóm cho màn hình.',
        panogroup: 'Nhóm cho màn hình',
        others: 'Phụ lục',
        termsandcondtions: 'Điều khoản & điều kiện sử dụng dịch vụ AntiFake',
        accountmanagement: 'Quản lý tài khoản',
        contactus: 'Liên hệ AntiFake',
        maintenanceSchedule: 'Lịch trình bảo trì',
        roomname: 'Tên phòng',
        doublebookingerror: 'Lỗi! booking bị trùng ngày',
        pay: 'Thanh toán',
        saleinvoice: 'Hoá đơn',
        deletex: 'Huỷ bỏ',
        adults: 'Người lớn',
        children: 'Trẻ em',
        goodservice: 'Sản phẩm| Dịch vụ',
        registrationcard: 'Giấy đăng ký phòng',
        emailbooking: 'Email Booking',
        emailinvoice: 'Email Hoá Đơn',
        emailstatement: 'Email Hoá Đơn Định Kỳ',
        bookingconfirmation: 'Thư xác nhận phòng đã được đặt',
        numadults: 'Số Nglớn',
        numchildren: 'Số TrẻEm',
        instruction0: 'Check in time is 2:00PM.',
        instruction1: 'Check out time is 10:00AM.',
        instruction2: 'Late Check out between 10:00am until 1:00pm is subject to availability at a charge of $75 for a 1 bedroom appartment and $150 for a 2 bedroom appartment. Checkout after 1:00pm will incur full tariff.',
        instruction3: 'Extra fold out beds are available at $30 per night.',
        instruction4: 'Infant cots are available at a charge of $14 per night, or $65 per week.',
        instruction5: 'Our Payment/Cancellation policy is as follows: 7 days prior to the date of your arrival, the total amount is taken off the credit card provide and is non-refundable.',
        instruction6: 'All bookings will only be accepted with a valid credit card. Cash or debit card bookings will require a $300 bond which is refundable on departure.',
        instruction7: 'All Cancellations requires 7 days notice and failure will incur full cost of your booking cancellation fee. This condition does not apply to 15% discount NOREFUND Promo',
        instruction8: 'Please note that your bank will charge a 1.8% Surcharge on any payments made by credit cards.',
        instruction9: ' Please note that that Anti-Social behaviour is strictly prohibited, and penalties of a $300 fine as well as police involvement will occur to anyone found guilty.',
        termsnconditions: 'Điều Khoản & Điều Kiện',
        paytype: 'Trả bằng',
        unitprice: 'Đơn giá',
        tax: 'Thuế',
        qty: 'Số',
        subtotal: 'Thành tiền',
        notpaidyet: 'Hoá đơn chưa được thanh toán',
        fullypaid: 'Hoá đơn đã thanh toán',
        paid: 'Đã trả',
        cash: 'TIỀN',
        credit: 'VISA|MASTER',
        eftpos: 'DEBIT',
        paypal: 'PAYOO',
        amex: 'AMEX',
        square: 'MOMO',
        crypto: 'CRYPTO',
        bankxfer: 'CHUYỂN TÀI KHOẢN',
        item: 'Tên sản phẩm|dịch vụ',
        thankyouforusingourservice: 'Cám ơn khách hàng đã sử dụng dịch vụ cũa chúng tôi.',
        serviceschedule: 'Lịch phân công',
        cleaningschedule: 'Lịch trình vệ sinh phòng',
        schedule: 'Bảng',
        booksearch: 'Tìm Booking',
        settings: 'Cài đặt',
        room: 'Phòng',
        roomtype: 'Loại phòng',
        roompricelist: 'Giá phòng',
        holidaycalendar: 'Lịch lễ & cao điểm',
        holidaytable: 'Bảng ngày nghỉ lễ',
        highseasontable: 'Bảng ngày cao điểm',
        services: 'Dịch vụ',
        servicestype: 'Loại Dịch vụ',
        serviceslist: 'Danh sách dịch vụ',
        incidentregister: 'Báo cáo tai nạn',
        assetmanagement: 'Quản lý tài sản',
        assetlist: 'Danh sách tài sản',
        depreciationschedule: 'Lịch khấu trừ',
        deprectype: 'Loại khấu trừ',
        balancesheet: 'Bảng quyết toán',
        gstactivity: 'VAT khấu trừ',
        selectdate: 'Chọn ngày',
        arrival:'KháchMới',
        tidy:'DọnGọn',
        checkonly: 'KiểmTra',
        linchg: 'DọnGiường',
        towechg: 'ThayKhăn',
        depart: 'KháchĐi',
        autogen: 'TựXuất',
        shortterm: 'NgắnHạn',
        longterm: 'DàiHạn',
        selfserv: 'Tựxử',
        noservice: 'MiễnLàm',
        hours: 'Giờ',
        minutes: 'Phút',

        totalcustomers: 'Số khách hàng tạm trú',
        totalroomnightsold: 'Số phòng/đêm đã đặt',
        totalroomnightavail: 'Số phòng/đêm có sẵn',
        totalbooking: 'Số lượt đặt phòng',
        onlinebooking: 'Số phòng đặt online',
        directbooking: 'Số phòng đặt trực tiếp',
        partnerbooking: 'Số phòng đặt qua đối tác',

        saletarget: 'Chỉ tiêu doanh thu',
        achievedrevenue: 'Doanh thu đạt được',
        plannedbudget: 'Dự thảo ngân sách',
        actualexpenses: 'Tổng phí đã chi',
        occupancyrate: 'Tỷ lệ phòng bán',
        adr: 'Giá trung bình/đêm',
        revpar: 'Thu trung bình/phòng',
        stayduration: 'Thời gian ở trung bình',
        averagespending: 'Chi trung binh/người',
        numbookings: '#Phòng đặt',
        unitbed: 'Hộ|Phòng',
        norecordfoundwarning: 'Dữ liệu không có tồn tại',
        combinesuper: 'BHXH|YT|TN',
        restaurant: 'Nhà hàng',
        conference: 'Hội nghị',
        tablelist: 'Danh sách bàn',
        table: 'Bàn',
        conference: 'Phòng hội nghị',
        tablebooking: 'Đặt bàn',
        menu: 'Thực đơn',
        menulist: 'Danh sách thực đơn',
        menuraw: 'Thực đơn nguyên liệu',
        dishlist: 'Danh sách món ăn',
        purchaseorder: 'Đơn mua hàng',
        netbalance: 'SAI NGẠCH',
        foodstock: 'Kho nguyên liệu',
        foodcat: 'Loại nguyên liệu',
        stocklist: 'Nguyên liệu',
        stocklosswrittenoff: 'Nguyên liệu hao mất bị khấu trừ',
        accountinit: 'Khởi động tài khoản',
        accountinitnote1: 'Khởi động tài khoản là bước đầu tiên nhập số liệu ban đầu cho tất cả tài khoản trước khi hoạt động như tiền trong ngân hàng, giá trị đất/nhà/máy móc, giá trị cải tạo, tiền đầu tư ban đàu',
        accountinitnote2: 'Bảng cân xứng phải cân trước khi doanh nghiệp đi vào hoạt động ví dụ: giá trị tài sản = giá trị trách nhiệm',
        assets: 'Tài sản sở hữu',
        liabilitiesequity: 'Tài sãn vay và trách nhiệm trã',
        dish: 'Món ăn',
        ingredients: 'Nguyên liệu',
        dishgroup: 'Nhóm món ăn',
        depreciation: 'Khấu_trừ',
        buildings:'Xây dựng',
        equipments: 'Đồ đặc & Dụng cụ',
        myroster: 'Bảng công tác',
        maintenance: 'Bão trì',
        incident: 'Sự cố',
        personalinfo: 'Dữ liệu cá nhân',
        tabletype: 'Loại bàn',
        statement: 'Statement',
        statementlist: 'Hoá đơn theo kỳ',
        invoicelist: 'Danh sách hoá đơn thu',
        expenselist: 'Danh sách hoá đơn chi',
        setpayall: 'Cài trả hết',
        totalpaid: 'Tổng số tiền trả',
        totaltax: 'Tổng thuế',
        totalsuper: 'Tổng trả BHXHLD',
        totalnet: 'Tổng sau chi phí',
        payrollstatement: 'Lương trả theo kỳ',
        night: 'Đêm',
        business: 'Doanh Nghiệp',
        info: 'Tin tức',
        features: 'Điểm nổi bật',
        deals: 'Khuyến mãi',
        issue: 'Tin nhắn nội bộ',
        dualingroup: '2Ng/Nhóm',
        owneraccount: 'Tài khoản chủ hộ',
        ownername: 'Tên chủ hộ',
        selectmonth: 'Chọn theo chu kỳ tháng: ',
        

























      }
    break;
    case '':
    break;
    case '':
    break;
  }

  return la;

} //End of Module
