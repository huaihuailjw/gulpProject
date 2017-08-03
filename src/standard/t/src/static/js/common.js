/**
 * 是否是微信客户端
 * 
 * @returns
 */
function is_weixin() {
    var ua = navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i) == "micromessenger") {
        return true;
    } else {
        return false;
    }
}
// 图片链接预览功能
var imgObj = {
        base: document.baseURI+"<%=apiBase%>",
        origin: window.location.origin,
        srcList: [], // 图片 url 列表
        srcTable: [],
        getBase: function (path) {
            var _this = this;
            var base = _this.base;
            if (path.indexOf('/') == 0) { //根路径下的图片
                base = _this.origin;
            }
            if (path.indexOf('http') == 0) { // 全路径
                base = '';
            }
            if (path.indexOf('data:image') == 0) { // 字符串数据 
                base = '';
            }
            return base;
        },
        refresh: function () {
            var _this = this;
            var imgs = document.querySelectorAll('img');
            if (imgs.length) {
                _this.srcList = [];
                _this.srcTable = [];
                imgs = Array.prototype.slice.call(imgs, 0); //除了crome 其他浏览器获取的可能不是 数组对象,必须转化为数组
                imgs.forEach(function (img, index) {
                    var path = img.getAttribute('src');
                    var ignore = img.getAttribute('ignore');
                    if (path && !ignore) {
                        var base = _this.getBase(path);
                        if (!is_weixin()) {
                            console.log(img.getBoundingClientRect().width, img.width, img.height);
                            _this.srcTable.push({
                                src: base + path,
                                w: img.getBoundingClientRect().width || img.width || 360,
                                h: img.getBoundingClientRect().height || img.height || 200
                            })
                        }
                        _this.srcList.push(base + path);
                    }
                });
            }
        },
        init: function () {
            var _this = this;
            var imgs = document.querySelectorAll('img');
            if (imgs.length) {
                setTimeout(function () {
                    _this.refresh();
                }, 800);
                imgs = Array.prototype.slice.call(imgs, 0); //除了crome 其他浏览器获取的可能不是 数组对象,必须转化为数组

                imgs.forEach(function (img, index) {
                    var path = img.getAttribute('src');
                    var ignore = img.getAttribute('ignore');
                    if (path && !ignore) {
                        var base = _this.getBase(path);

                        img.addEventListener('click', function () {
                            // _this.refresh();
                            if (!is_weixin()) {
                                //TODO 不是微信时的图片显示
                                _this.photo({
                                    current: base + path,
                                    srcTable: _this.srcTable,
                                    srcList: _this.srcList
                                }, true, this);
                            } else {
                                var wxClone = wx;
                                try {
                                    wxClone = parent.wx || wx;
                                } catch (error) {
                                    console.log('no parent window');
                                }
                                wxClone.previewImage({ // 预览图片不需要 获取签名 配置wx.config 只要有 weixin.js就可以用
                                    current: base + path, // 当前显示图片的http链接
                                    urls: _this.srcList // 需要预览的图片http链接列表
                                });
                            }
                        });
                    }
                });
            }
        },
        showOne: function (path, width, height) {
            var _this = this;
            var wxClone = wx;
            try {
                wxClone = parent.wx || wx;
            } catch (error) {
                console.log('no parent window');
            }
            var base = _this.getBase(path);
            var url = base + path;
            var sign = url.indexOf('?') > -1 ? '&' : '?';
            url = url + sign + 'version=' + ~new Date();

            if (!is_weixin()) {
                //TODO 不是微信时的图片显示
                _this.photo({
                    current: url,
                    srcList: [url],
                    width: width,
                    height: height
                });
            } else {
                wxClone.previewImage({
                    current: url,
                    urls: [url]
                });

            }
        },
        photo: function (obj, multi, img) {
            var _this = this;
            var pswpElement = document.querySelectorAll('.pswp')[0];
            var current = obj.current;
            var index = 0;
            var srcList = obj.srcList;
            var srcTable = obj.srcTable;
            var l = srcList.length;

            var w = obj.width || 320;
            var h = obj.height || 200;

            try {
                w = img.getBoundingClientRect().width;
                h = img.getBoundingClientRect().height;
            } catch (error) {

            }
            var items = [];
            for (var i = 0; i < l; i++) {
                if (current == srcList[i]) {
                    index = i;
                }
                items.push({
                    src: srcList[i],
                    w: w,
                    h: h
                });
            }
            if (multi) {
                items = _this.srcTable;
            }
            // define options (if needed)
            var options = {
                // optionName: 'option value'
                index: index // start at first slide
            };
            // Initializes and opens PhotoSwipe
            var gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);
            gallery.init();
        }
}
/**
 * 日志记录
 */
function logRecord() {

	ajaxActionLog({ // 日志记录
		data: {
			module: 'traffic'
		},
		stopLocation: true // 禁止位置的获取
	});

}
/**
 * 
 * dom加载完成后执行
 * @param {any} callback
 */
function domReady(callback) {
    var readyState = document.readyState;
    var _do = function () {
        backAction();
        imgObj.init();
        typeof callback === 'function' && callback();
        logRecord();
    }
    if (readyState == 'complete') {
        _do();
    } else {
        document.addEventListener('DOMContentLoaded', function () {
            _do();
        }, false);
    }
}