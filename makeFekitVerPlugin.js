var fs = require('fs'),
    path = require('path');

var makeFekitVerPlugin = function(verPath, spliter) {
    this.verPath = verPath || __dirname;
    this.spliter = spliter || '@';
}

makeFekitVerPlugin.prototype.apply = function(compiler) {
    var that = this;
    compiler.plugin("done", function(stats) {
        var json = stats.toJson();
        var hash = json.hash,
            files = json.assets//json.assetsByChunkName;
        ensureDir([
            path.join(that.verPath, 'ver'),
            path.join(that.verPath, 'ver/scripts'),
            path.join(that.verPath, 'ver/styles')
        ], fs.W_OK);
        var all = "";
        files.forEach(function(file){
            var fullname = file.name;
            var name = fullname.replace(that.spliter + hash, '');
            fs.writeFileSync(path.join(that.verPath, 'ver/' + name + '.ver'), hash);
            all += fullname + '\n';
        });
        fs.writeFileSync(path.join(that.verPath, 'ver/versions.mapping'), all );
    });
};

function ensureDir(paths, mode){
    paths.forEach(function(path){
        try {
            fs.accessSync(path, mode);
        } catch (e) {
            fs.mkdirSync(path);
        } 
    });    
}

module.exports = makeFekitVerPlugin;