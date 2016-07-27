/**
 * 对应 url_host 表
 */

// var mysql = require("mysql");
var db = require('./common/db.js');
// var Promise = require('promise');

module.exports = {

    listAll: function() {
        var sql = 'SELECT id FROM tableA';
        return db.execSQL(sql);
    }

};