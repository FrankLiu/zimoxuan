import Vue from 'vue'
import VueRouter from 'vue-router'
// import VueResource from 'vue-resource'
// import ElementUI from 'element-ui'
// import 'element-ui/lib/theme-default/index.css'
import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'
import FastClick from 'fastclick'

Vue.use(VueRouter)
// Vue.use(ElementUI)
Vue.use(MintUI)

// 2. 定义路由
import routes from './routers'

// 3. 创建 router 实例，然后传 `routes` 配置
// 你还可以传别的配置参数, 不过先这么简单着吧。
const router = new VueRouter({
  mode: 'history',
  routes // （缩写）相当于 routes: routes
})
FastClick.attach(document.body)

/* eslint-disable no-new */
new Vue({
  router
}).$mount('#app')
