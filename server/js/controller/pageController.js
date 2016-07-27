/**
 * 页面入口的
 */
var config = require('../../../resource/config.json');
var qzzUrl = config.qzzUrl;


module.exports = {
    homepage: function(req, res) {
        res.render('index', { qzzUrl: qzzUrl });
        res.end("");
    }
};