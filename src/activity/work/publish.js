// 发布参数设置 用js 作为 json的返回 是因为 js中 可以写注释
module.exports = {
    // 如服务部署在 http://www.baidu.com 上  " / " + 路径 =  http://www.baidu.com/路径
    page: {
        base: { // 页面 base标签 路径 其下方的 资源都是相对于 此 目录 ,可以解决 js中跳转页面出错的问题
            rls: '/activity/work/',
            dev: '/activity/work/',
            test: '/activity/work/'
        },
        // 公共资源 根路径,此项目依赖 wechat下的 static公共资源,若要单独启动此项目,需要拷贝公共资源或公共资源配置到某个端口服务下
        // 这样只要修改 ctx 前缀就可以获取到 公共资源
        common: {
            ctx: '/' // 根路径 引入 公共资源可以-> g<%=ctx%>/css/reset.css 然后 ctx 用 ulp-template / gulp-ejs 替换
        }
    }
}