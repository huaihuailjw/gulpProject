/**
 *
 *返回一个n-m的随机数
 * @param {any} n
 * @param {any} m
 * @returns
 */
function rnd(n, m) {
    return Math.random() * (m - n) + n;
}
/**
 *
 * 获取地址栏的?后面的参数
 * @param {any} str
 * @param {any} name
 * @returns
 */
function GetQueryString(str, name) {
    str = decodeURIComponent(str);
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = str.substr(str.indexOf("?") + 1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}
/**
 *
 *获取地址栏里的某一个参数
 * @param {any} name
 * @returns
 */
function getUrlQueryString(name) {
    return GetQueryString(window.location.href, name);
}
/**
 *
 *去除收尾空格的函数
 * @param {any} str
 * @returns
 */
function trim(str) {
    return str.replace(/^\s+|\s+$/g, '');
}
/**
 *
 * 转化 html 字符串 到 dom元素
 * @param {any} str
 * @returns
 */
function parseDom(str) {
    var div = document.createElement('div');
    div.innerHTML = str;
    return div.childNodes[0];
}
/**
 *
 * 封装ajax
 * @param {any} obj
 * @param {any} ignore true 忽略公共参数的添加
 */
function ajaxBase(obj, ignore) {
    var confirm = null;
    var loading = null;
    var sign = obj.url.indexOf('?') > 0 ? '&' : '?';
    
};
// @@include('../module/js/loading.js')
// @@include('../module/js/dialog.js')