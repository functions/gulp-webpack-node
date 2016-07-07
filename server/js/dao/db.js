var mysql = require("mysql");

// 连接池容量
var POOL_SIZE = 10,
    cwd = process.cwd(),
    config = require(cwd + "/resource/config.js"),
    CONNECT_CONFIG = {
        "info": config
    };

//数据库链接方法
var connect = {
    mysql: function(pattern, sql, data, callback) {
        if (!pattern.pool) {
            pattern.info.connectionLimit = POOL_SIZE;
            pattern.pool = mysql.createPool(pattern.info);
        }

        pattern.pool.getConnection(function(error, connection) {
            // 输出sql和data
            console.info("excute sql:", sql);
            console.info("by data:", data);
            if (error) {
                console.error('获取数据库连接异常！\n', error);
                callback({
                    error: error
                });
                return;
            }

            connection.query(sql, data, function(err, results) {
                // 返回连接池
                connection.release(function(error) {
                    if (error) {
                        console.error('关闭数据库连接异常！\n', error);
                    }
                });

                if (err) {
                    err.sql = sql;
                    console.error("db error:", err);
                    callback({
                        error: err
                    });
                    return;
                }
                callback(results);
            });
        });
    }
};

exports.query = function(sql, data) {
    return new Promise(function(resolve, reject){
        connect.mysql(CONNECT_CONFIG, sql, data, function(result){
            if (result.error) {
                reject(result);
                return;
            }else {
                resolve(result);
                return;
            }
        });
    });
};
