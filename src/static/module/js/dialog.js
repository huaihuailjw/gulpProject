
// 公用弹出框 空出第一行便于合
// 合并到 common.js中 以来 common.js的方法 有: parseDom
var Dialog = (function(){
	
	var eventObj = { // 事件绑定类型定义
		cancel:[], confirm:[],
		show:[], shown:[],
		hide:[], hidden:[]
	}
	
	// 根据 type 获取对应代码的 dom
	var _getDom = function( type ){
		var className = type == 'alert'	? 'dialog_alert':'dialog_confirm';
		var html = 
		'<div class="'+className+' hidden">'+
			'<div class="mask"></div>'+
			'<div class="dialog">'+
				'<div class="dialog_hd"><strong class="dialog_title"></strong></div>'+
				'<div class="dialog_bd"></div>'+
				'<div class="dialog_ft">'+
					( type != 'alert' ? 
					'<a href="javascript:;" class="btn_dialog default">取消</a>':'')+
					'<a href="javascript:;" class="btn_dialog primary">确定</a>'+
				'</div>'+
			'</div>'+
		'</div>';
		return parseDom( html );
	}
	
	
	var _trigger = function(name){ // 触发事件
		var arr = eventObj[name];
		for( var i=0,l=arr.length;i<l;i++ ){
			arr[i].apply(this,[]);
		}
	}
	var _append = function( child ){
		document.body.appendChild( child );
	}
	var _bindEvent = function(elem,type,handler){ // 事件绑定
		if(elem){
			var types = type.split(',');//绑定多个事件类型 click,touchstart
			for(var i=0,l=types.length;i<l;i++){
				elem.addEventListener(types[i],handler,true);
			}
		}
	}
	var obj = { // dialog返回两种类型 alert 类型 和 confirm类型
		alert:null, // 只有确定按钮
		confirm:null // 有取消按钮 确定按钮
	}
	function Dialog(type){
		var _this = this;
		this.code = null;
		this.btnClick = function(){ //取消 確定按鈕 点击事件
			var sureBtn = _this.code.querySelector('.primary');
			var cancelBtn = _this.code.querySelector('.default');
			_bindEvent(sureBtn,'click,touchstart',function(event){
					_trigger('confirm');
					_this.hide();
					event && event.preventDefault();
			});
			_bindEvent(sureBtn,'touchmove,touchend',function(event){
				event && event.stopPropagation();
			});
			_bindEvent(cancelBtn,'click,touchstart',function(event){
					_trigger('cancel');
					_this.hide();
					event && event.preventDefault();
			});
			_bindEvent(cancelBtn,'touchmove,touchend',function(event){
				event && event.stopPropagation();
			});
		}
		this.init = function(type){ // 初始化方法
			_this.code = _getDom(type);	
			_append( _this.code );
			_this.btnClick();
		}
		this.on = function(name,handler){ // 事件绑定
			if( name in eventObj ){ // 绑定的事件必须是 eventObj中定义的
				eventObj[name].push(handler);
			}
			return _this;
		}
		this.off = function(name){// 事件解除
			if(!name){ // 解除全部
				eventObj = { // 
					cancel:[], confirm:[],
					show:[], shown:[],
					hide:[], hidden:[]
				}
				return _this;
			}
			if(name in eventObj ){ // 解除某个事件类型
				eventObj[name] = [];
			}
			return _this;
		}
		this.setValue = function(title,text){ // 设置 标题和 提示内容
			var dgtitle = this.code.querySelector('.dialog_title');
			dgtitle.innerText = title || '';
			var dgtext = this.code.querySelector('.dialog_bd');
			dgtext.innerText = text || '';
			return _this;			
		}
		this.show = function(title,text){ //显示dialog
			_trigger('show');
			(title || text) && _this.setValue(title,text);
			_this.code.classList.remove('hidden');
			_trigger('shown');
			return _this;
		}
		this.hide = function(){ // 隐藏 dialog
			_trigger('hide');
			_this.code.classList.add('hidden');
			_trigger('hidden');
			return _this;
		}
		return this.init( type );
	}

	return {
		init:function( type ){ // 初始化 添加dialog代碼到 body中
			if( !type in obj ){ // 符合返回 要求
				throw "只支持 alert 和 confirm类型";
			}
			if( !obj[type] ){
				obj[type] = new Dialog(type);
			}else{
				obj[type].off(); // 重复使用时 将之前绑定的事件 删除掉
			}
			return obj[type];
		}
	}
}());