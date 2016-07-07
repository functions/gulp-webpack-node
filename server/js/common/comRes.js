
module.exports = {
     success: function(res, data) {
        if (!res || 'function' !== typeof res.write) {
            console.warn("必须传入Response对象");
        }
        var output = {
            status: 0,
            message: 'success',
            data : data
        };
        res.setHeader('Content-Type', 'application/json');
        res.write(JSON.stringify(output));
        res.end("");
    },
    error: function(res, error) {
        if (!res || 'function' !== typeof res.write) {
            console.warn("必须传入Response对象");
        }
        if(typeof error === 'string'){
            error = {
                code : error
            };
        }
        var output;
        if (error && this.ERRORSTATUS[error.code]) {
            output = this.ERRORSTATUS[error.code];
        } else if (error && error.status) {
            output = error;
        } else {
            output = this.ERRORSTATUS.DEFAULT;
        }
        res.setHeader('Content-Type', 'application/json');
        res.write(JSON.stringify(output));
        res.end("");
    },
    // 消息码
    ERRORSTATUS: {
        DEFAULT : {
            status : -1,
            message : '服务器错误'
        },
        NOLOGIN : {
            status : -101,
            message : '未登陆，请先登录'
        },
        WAITTING:{
            status : -404,
            message : '暂未开发，敬请等待'
        },
        needParam:{
            status : -1,
            message : '缺少参数'
        }
    }
};
