/**
 * 页面入口的
 * @Author yuanqin.wang
 * @Date 2016-03-31
 */
var config = require('../../../resource/config.json');
var qzzUrl = config.qzzUrl;
/*@Controller*/
module.exports = {
    /*@Autowired("../service/loginService")*/
    loginService: null,


    /*@RequestMapping("/")*/
    index: function(req, res) {
        renderView (res, 'index');
        res.end("");
    },
    /*@RequestMapping("/404")*/
    error: function(req, res) {
        res.render('error');
        res.end("");
    },
    /*@RequestMapping([{url: "/data"},{url: "/data/{menu}/{channel}/{page}"},{url: "/data/{menu}/{channel}"},{url: "/data/{menu}"}])*/
    data: function(req, res) {
        renderView (res, 'index');
        res.end("");
    },
    /*@RequestMapping("/healthcheck.html")*/
    healthcheck: function(req, res) {
        res.write("200");
        res.end("");
    },
    /*@RequestMapping([{url: "/admin"}, {url: "/admin/{menu}"}, {url: "/admin/{menu}/{submenu}"}])*/
    admin: function(req, res) {
        var path = req.path;
        // 检查是否已经登录
        if (this.loginService.isLogin(req)) {
            renderView (res, 'admin');
            res.end();
        } else {
            // 没有登录
            // 如果当前是登录页, 则渲染登录页
            if (path === '/admin/login') {
                res.render('login');
                res.end();
            } 
            // 如果是登录验证接口
            else if (path === '/admin') {
                // 调用登录验证接口
                this.loginService.doLogin(req, res);
            }
            else {
                // 跳转到奥登录页
                res.redirect(301, '/admin/login');
            }
        }
    }

};



function renderView (res, view) {
    res.render(view, { qzzUrl: qzzUrl });
}