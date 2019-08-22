
    var dev = window.localStorage.getItem('currentHost') || 'http://10.0.0.221:18900';
    window.ShiYue = {
        base: dev,
        uploadBaseURL: dev,
        showRcBaseURL: dev,
        ysy: 'http://demo.yishengya.cn/authentication/index',
        pageSize: 30,
        notAllowUpload: ['jspx', 'jsp', 'exe']
    }