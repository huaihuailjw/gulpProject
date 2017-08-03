## 公共静态资源
> 公共静态资源统一放到 src/static下.

* static:
* css 公共css编写目录
* function scss 公用 funtion,mixin方法
* js 公共js目录
* images 公共图片目录
* js 公共js目录
* module 模块化目录用于 js css文件下 文件的引入
* vendor 第三方插件如：jquery,bootstrap等

### common.js
>common.js提供公共的js方法，dialog弹出、loading加载等内容。

#### Dialog 
>加载公共弹出代码,并暴露相关方法调用。    
代码会加载到body中且只加载一次

* 代码初始化并返回对象
```js
    var dialog = Dialog.init('alert');//只有一个确认按钮
    var dialog = Dialog.init('confirm');//取消 确定两个按钮

   注意： 两种类型的 dialog创建的是个单例对象
   var dialog1 = Dialog.init('alert'); 
   var dialog2 = Dialog.init('alert'); 

   dialog1 = dialog2 = 同一个实例对象
```
* 显隐及标题内容设值
```js
    dialog.show(); // 显示弹窗
    dialog.hide(); // 隐藏弹窗
    dialog.setValue(title,text); // 设置标题、内容
    dialog.show(title,text); //设置标题、内容并显示
```
* 事件绑定及可用事件类型
    + cancel 取消按钮事件
    + confirm 确定按钮事件
    + show 显示弹窗前执行事件
    + shown 显示弹窗后执行事件
    + hide 隐藏弹窗前执行事件
    + hidden 隐藏弹窗后执行事件

```js
    // 事件绑定
    dialog.on('cancel',function(){
        ....
    });
    // 事件解除
    dialog.off('cancel');
    // 解除全部事件绑定
    dialog.off();

    // ps: 每次Dialog初始化时 Dialog.init('') 时之前绑定的事件都会解除
```
* 所有弹出提示公用一个dialog实例对象
    >若一个方法中用到了弹窗并且绑定了事件

    ```js
        var dialog = Dialog.init('alert');

        dialog.on('confirm',function(){
            alert('confirm 1');
        });
    ```
    >同时另一个方法中也要用到弹窗 并绑定事件

    ```js
        dialog.on('confirm',function(){
            alert('confirm 2');
        });
        // 这时 点击确定按钮将会弹出 confirm 1 和 confirm 2
        // 因此若要重复使用应这样

        dialog.off() //解除全部绑定事件 或 off('confirm')
            .on('confirm',function(){
                alert('confirm 2');
            });
            或者
        var dialog2 = Dialog.init('alert');// init中会解除所有的事件绑定
        dialog2.on('confirm',function(){
            ....
        });
    ```
#### Loading
>数据获取时的动画加载  
同样初始化时代码会自动加载到 body中且只加载一次

* 初始化方法
```js
    var loading = Loading.init();//加载html并返回单例对象
```
* 显隐及文字信息设置
```js
    loading.show(); // 显示
    loading.hide(); //隐藏
    loading.setMsg('加载中'); //设置弹层文字信息
    loading.show('加载中'); // 设置文字并显示
```
