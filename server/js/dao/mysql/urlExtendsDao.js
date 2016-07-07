/**
 * 对应 url_host 表
 */

var mysql = require("mysql");
var db = require('./common/db.js');
var Promise = require('promise');

/*@Repository("urlExtendsDao")*/
module.exports = {

    listExtendsById: function(pathId) {
        var sql = 
                'SELECT id, path_id, hash, query, page_code, weight ' + 
                'FROM url_extends ' + 
                'WHERE path_id=' + pathId + 
                ' ORDER BY weight DESC';
        return db.query(sql);
    },

    /**
     * 新建一个路径规则
     * @param  {[type]} hostId   [description]
     * @param  {[type]} path     [description]
     * @param  {[type]} pageCode [description]
     * @return {[type]}          [description]
     */
    newExtends: function(params) {
        var pathId = mysql.escape(params.pathId);
        var extend = params.extends;
        if (extend === '') { 
            extend = 'NULL'; 
        } else {
            extend = mysql.escape(params.extends);
        }
        var type = params.type;
        var sql = 'INSERT INTO url_extends(path_id, ' + type + ', page_code, weight)' + 
                  'VALUES(' + pathId + ', ' + extend + ', 0, 0)';
        return new Promise(function(resolve, reject) {
            db.query(sql).then(function() {
                // 查询出最后插入的 extends id
                sql = 'SELECT id FROM url_extends order by id desc limit 1';
                // 更新 url_path 表， 标记当前的 path 使用了 hash 或者 query
                var sqlUpdate = 'UPDATE url_path SET use_' + type + '=1 WHERE id=' + pathId;
                return Promise.all([ db.query(sql), db.query(sqlUpdate)]);
            })
            .then(function(result) {
                // 取出第一条语句执行结果的第一条记录中的 id
                resolve(result[0][0].id);
            })
            .catch(function(error) {
                reject(error);
            })
        });
    },

    /**
     * 更新一个路径规则
     * @return {[type]}          [description]
     */
    updateExtends: function(params) {
        var extend = params.extends;
        if (extend === '') { 
            extend = 'NULL'; 
        } else {
            extend = mysql.escape(params.extends);
        }
        console.log(extend);
        var extId = mysql.escape(params.extId);
        var type = params.type;
        // 更新参数规则
        var sql = 'UPDATE url_extends SET ' + type + '=' + extend + ' WHERE id=' + extId;
        // 查询出当前参数规则对应的路径规则 path_id
        var sqlSelect = 'SELECT path_id FROM url_extends WHERE id=' + extId;

        return Promise.all([
            db.query(sql), 
            db.query(sqlSelect)
        ])
        .then(function(result) {
            var pathId = result[1][0].path_id;
            // 更新路径规则的 use_hash 或者 use_query 字段
            return setPathUseHashQuery (pathId);
        });
    },

    /**
     * 更新 pageCode
     * @param  {[type]} extendsId [description]
     * @param  {[type]} pageCode  [description]
     * @return {[type]}           [description]
     */
    extendsPageCode: function(extendsId, pageCode) {
        var sql = 'UPDATE url_extends SET page_code=' + pageCode + ' WHERE id=' + extendsId;
        return db.query(sql);
    },

    /**
     * 删除参数规则
     * @param  {[type]} extId [description]
     * @return {[type]}       [description]
     */
    removeExtends: function(extId) {
        // 查询出当前参数规则对应的路径规则 path_id
        var sql = 'SELECT path_id FROM url_extends WHERE id=' + extId;
        var pathId = 0;
        return db.query(sql)
            .then(function(result) {
                pathId = result[0].path_id;
                // 删除当前参数规则
                sql = 'DELETE FROM url_extends WHERE id=' + extId
                return db.query(sql);
            })
            .then(function() {
                // 更新路径规则的 use_hash 和 use_query 参数
                return setPathUseHashQuery (pathId);
            });
    },

        /**
     * 调整顺序
     * @param  {[type]} pathMap = {
     *                          id: weight
     *                        }
     * @return {[type]}         [description]
     */
    orderExtends: function(pathMap) {
        var sql = '',
            i = 0,
            pathId = 0,
            weight = 0,
            promiseArray = [],
            count = 0;

        return new Promise(function(resolve, reject) {
            for (i = 0; i < pathMap.length; i++) {
                pathId = +pathMap[i].id;
                weight = +pathMap[i].weight;

                sql = 'UPDATE url_extends SET weight=' + weight +' WHERE id=' + pathId;
                promiseArray.push( db.query(sql) );
                
                count++;
            }

            Promise.all(
                promiseArray
            )
            .then(function(results) {
                if (results.length === count) {
                    resolve();
                }
                else {
                    reject('update total: ' + count + ', need total: ' + results.length);
                }
            })
            .catch(function(error) {
                reject(error);
            });
        })
    }

};


/**
 * 更新路径规则的 use_hash 和 use_query 参数
 * @param {[type]} pathId [description]
 */
function setPathUseHashQuery (pathId) {
    // 查询出当前路径规则下分别有多少 hash 规则， 多少 query 规则
    var sql = 'SELECT count(hash) AS count_hash, count(query) AS count_query ' + 
              'FROM url_extends WHERE path_id=' + pathId;

    return db.query(sql)
        .then(function(result) {
            // 接下来更新 url_path 表中的 use_hash 和 use_query 字段
            var item = result[0];
            var sqlArray = [];

            // 如果 hash 规则的数量为 0
            var hashCount = item.count_hash > 0 ? 1 : 0;
            sqlArray.push('use_hash=' + hashCount);
            
            // 如果 query 规则的数量为 0
            var queryCount = item.count_query > 0 ? 1 : 0;
            sqlArray.push('use_query=' + queryCount);

            if (sqlArray.length > 0) {
                // 更新 url_path 表中的 use_hash 和 use_query 字段
                sql = 'UPDATE url_path SET ' + sqlArray.join(',') + ' WHERE id=' + pathId;
                return db.query(sql);
            }
            // 没有执行更新
            return Promise.resolve();
        });
}