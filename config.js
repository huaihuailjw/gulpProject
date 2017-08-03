// config.js 配置 整体代码打包位置
var obj = {
    basepath: 'build',
    baseDir: 'wechat'
}
module.exports = {
    basepath: obj.basepath,
    baseDir: obj.baseDir,
    dest: (function () { // 打包目录目的地
        return './' + obj.basepath + '/' + obj.baseDir + '/'; // ./build/wechat/
    }()),
    replaceStr: (function () { // 分支中 替换路径 专用 意在将 分支中的代码 打包到 dest 下对应的目录
        return obj.basepath + '/' + obj.baseDir;
    }()),
    link: { // 公共的链接
        domain: '正式环境', // 正式环境 域名 测试时可以通过修改此参数 避免本地启动服务访问不到对应的服务 
    }
}