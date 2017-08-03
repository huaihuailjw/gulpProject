var gulp = require('gulp');
var yargs = require('yargs').argv;
pathConfig = {
    activity: './src/activity/', //活动
    standard: './src/standard/' //非活动
};
gulp.task('work', function () {
    var jcbd = require(pathConfig.activity + 'work/gulpfile');
    jcbd.compile();
});

gulp.task('t', function () {
    var jcbd = require(pathConfig.standard + 't/gulpfile');
    jcbd.compile();
});

module.exports = {
    task: ['work', 't']
}