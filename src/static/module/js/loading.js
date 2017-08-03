
// 数据加载动态 层 空出第一行便于合并
// 合并到 common.js中 以来 common.js的方法 有: parseDom
var Loading = (function(){
	var loadingHtml = 
					'<div class="loading_toast hidden">'+
						'<div class="mask_transparent"></div>'+
						'<div class="toast">'+
							'<div class="loading">'+
								'<div class="loading_leaf loading_leaf_0"></div>'+
								'<div class="loading_leaf loading_leaf_1"></div>'+
								'<div class="loading_leaf loading_leaf_2"></div>'+
								'<div class="loading_leaf loading_leaf_3"></div>'+
								'<div class="loading_leaf loading_leaf_4"></div>'+
								'<div class="loading_leaf loading_leaf_5"></div>'+
								'<div class="loading_leaf loading_leaf_6"></div>'+
								'<div class="loading_leaf loading_leaf_7"></div>'+
								'<div class="loading_leaf loading_leaf_8"></div>'+
								'<div class="loading_leaf loading_leaf_9"></div>'+
						'<div class="loading_leaf loading_leaf_10"></div>'+
						'<div class="loading_leaf loading_leaf_11"></div>'+
						'</div>'+
					'<p class="toast_content">数据加载中</p>'+
					'</div>'+
					'</div>';
	var loading = null;				
	var text = '数据加载中';
	function Loading(){
		var _this = this;
		this.code = null;

		this.setMsg = function( msg ){ //设置文字 
			msg && ( text = msg );
			var content = _this.code.querySelector('.toast_content');
			content.innerText = text;
			return _this;
		}
		this.init = function(){ // 代码加载到  body 中
			_this.code = parseDom( loadingHtml );
			document.body.appendChild( _this.code );
		}
		this.show = function( msg ){ //显示
			_this.code.classList.remove('hidden');
			_this.setMsg(msg);
			return _this;
		}	
		this.hide = function(){// 隐藏
			_this.code.classList.add('hidden');
			return _this;
		}
		return this.init();
	}
	return {
		init:function(){
			return loading || (loading = new Loading());
		}
	}					
}());