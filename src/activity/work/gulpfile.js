var gulp = require('gulp'); // gulp
var sass = require('gulp-sass'); // 编译sass
var uglify = require('gulp-uglify'); // 丑化压缩 js
var gulpif = require('gulp-if'); // pipe 中判断
var rename = require('gulp-rename'); // 重命名
var prettify = require('gulp-prettify'); // html 格式化
var ejs = require('gulp-ejs'); // 模板替换，文件内容引入，数据循环展示，根据参数判断展示哪段代码
var browserSync = require('browser-sync'); // 启动服务 文件修改实时同步到浏览器
var yargs = require('yargs').argv; // 获取 终端写的命令参数
var autoprefixer = require('gulp-autoprefixer');
var htmlmin = require('gulp-htmlmin');

var pub = require('./publish'); // 发布配置

//路径配置
var pathConfig = {
    server: { // 启动服务相关配置
        root: __dirname + '/build',
        startPath: 'portal.html'
    },
    base:'/activity/work/',
    basepath: __dirname + '/build', // 文件编译 指定根目录
    baseDir: '/t/', // 输出到 根目录下的 文件夹的名称
    output: { // 各个资源 对应的输出路径
        app: '',
        js: 'static/js/',
        css: 'static/css/',
        images: 'static/images/'
    },
    get: function (name) {
        return this.basepath + this.baseDir + (this.output[name] || '');
    },
    apiBase: pub.page.apiBase.test, //"测试"
    replaceStr: 'wechatConfig' in global ? global.wechatConfig.replaceStr : 'build/wechat' // 路径替换内容 将 应用打包到对应的位置
}
var compress = false; // 压缩控制参数
var rlsStatus = false; // 是否是发布状态 默认不是
/**
 * 文件放到发布目录下
 */
function toRlsDir() {
    // 发布时 直接 将文件编译到 wechat 目录下
    // 当前 的 __dirname = src\
    // 替换 src 直接就是 wechat 目录对应的 文件夹 =
    // build\
    pathConfig.basepath = __dirname.replace('src', pathConfig.replaceStr); // 放到 wechat目录下
    pathConfig.baseDir = '/'; // 连接 basepath 和  output字段之前的 斜线
    if (!!global.wechatConfig) { // 设置 启动 外层服务的 初始化访问页面 gulp service --wechat:s --pub test --torls
        global.wechatConfig.startPath = pathConfig.base + 'portal.html';
    }
}
// 所有任务 执行前的 变量赋值 操作
gulp.task('work:setValue', function () {
    if (yargs.pub) { // 有 pub 参数
        switch (yargs.pub) {
            case 'rls': // 发布
                pathConfig.apiBase = pub.page.apiBase.rls;
                toRlsDir();
                rlsStatus = true;
                compress = true;
                console.log('进入发布状态');
                break;
            case 'dev': // 开发
                pathConfig.apiBase = pub.page.apiBase.dev;
                console.log('进入开发状态');
                break;
            case 'test': // 测试
                pathConfig.apiBase = pub.page.apiBase.test;
                toRlsDir();
                console.log('进入测试状态');
                break;
        };
    };
    if (yargs.torls) { // 设置编译文件 放到 最外层的 wechat中 用于 在 wechat中开启服务查看子功能的页面的操作
        toRlsDir();
    }
    if (typeof yargs.name === 'string' && !rlsStatus) { // 通过命令 设置打包后的文件夹的名称 / 项目的名称
        if (yargs.name.charAt(0) != '/') {
            yargs.name = '/' + yargs.name;
        }
        if (yargs.name.charAt(yargs.name.length - 1) != '/') {
            yargs.name = yargs.name + '/';
        }
        pathConfig.baseDir = yargs.name;
    };
    if (yargs.ss) { // 启动以wechat/build为根路径的服务
        // 修改 pageBase,修改代码打包位置
        toRlsDir();
        // 修改启动服务的根路径
        pathConfig.server.root = __dirname.substring(0, __dirname.indexOf('src')) + pathConfig.replaceStr;
        console.log('设置启动服务的根目录为:' + pathConfig.server.root);
        //修改根路径 到项目启始页的前缀
        pathConfig.server.startPath = pathConfig.base + 'portal.html';
    }
    if (yargs.min) { //用min命令控制代码压缩压缩  ' gulp --min '  开启代码压缩
        compress = true;
        console.log('开启代码压缩');
    };
    console.log('代码打包到 ' + pathConfig.basepath + pathConfig.baseDir + ' 文件夹下');
});
// scss处理到 css
gulp.task('work:css', function () {
    gulp.src(__dirname + '/src/static/css/*.scss') //该任务针对的文件
        .pipe(sass({
            outputStyle: 'compressed' // 压缩
        }))
        .pipe(autoprefixer({
            browsers: ['> 1%', 'last 2 versions', 'Firefox ESR', 'Opera 12.1']
        }))
        .pipe(gulp.dest(pathConfig.get('css')))
        .pipe(browserSync.reload({
            stream: true
        })); //将会在src/css下生成index.css
});
// js处理
gulp.task('work:js', function () {
    gulp.src(__dirname + '/src/static/js/*.js')
        .pipe(gulpif(compress, uglify()))
        .pipe(ejs({
            apiBase: pathConfig.apiBase
        }))
        .pipe(gulp.dest(pathConfig.get('js')))
        .pipe(browserSync.reload({
            stream: true
        }));
});
// html 应用
gulp.task('work:app', function () {
    gulp.src(__dirname + '/src/app/*.html')
        .pipe(ejs({
            common: pub.page.common.ctx, //指定地址
            rev: "?v=" + new Date().getTime()
        }))
        .pipe(htmlmin({
            collapseWhitespace: true,
            removeComments: true
        }))
        .pipe(gulp.dest(pathConfig.get('app')))
        .pipe(browserSync.reload({
            stream: true
        }));
});
// 图片处理
gulp.task('work:images', function () {
    gulp.src(__dirname + '/src/static/images/**/*.*')
        .pipe(gulp.dest(pathConfig.get('images')));
});
//服务
gulp.task('work:server', function () {
    yargs.p = yargs.p || 3000;
    browserSync.init({
        server: {
            baseDir: pathConfig.server.root,
            index: '/index.html'
        },
        porwork: yargs.p,
        startPath: pathConfig.server.startPath,
        browser: ["chrome"]
    });
});
gulp.task('work:all', ['work:setValue', 'work:css', 'work:js', 'work:app', 'work:images']);

gulp.task('work:watch', function () {
    gulp.watch(__dirname + '/src/static/css/*.scss', ['work:css']);
    gulp.watch(__dirname + '/src/static/module/css/*.scss', ['work:css']);
    gulp.watch(__dirname + '/src/static/js/*.js', ['work:js']);
    gulp.watch(__dirname + '/src/**/*.html', ['work:app']);
    gulp.watch(__dirname + '/src/static/images/**/*.*', ['work:images']);
});
gulp.task('default', ['work:all'], () => {
    if (yargs.w) {
        gulp.start('work:watch');
    };
    if (yargs.s) { // 以当前目录下的 build为根路径的服务
        gulp.start('work:server');
    } else if (yargs.ss) { // 以/build为根路径的服务
        gulp.start('work:server');
    }
});

// 暴露接口
module.exports = {
    compile: function () {
        console.log('开始执行 T 的编译!');
        yargs.pub = typeof yargs.pub === 'string' ? yargs.pub : 'rls';
        gulp.start('default');
    }
}