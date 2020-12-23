// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

// 导入element-ui 以及样式
import ElementUI from 'element-ui'
import "element-ui/lib/theme-chalk/index.css"

// 导入全局演样式
import "../static/css/global.css"

import settings from "./settings";

Vue.prototype.$settings = settings;

// 配置axios
import axios from "axios"
// 将axios注入到vue实例
Vue.prototype.$axios = axios

// 导入极验的js
import "../static/js/gt"

// 全局注册
Vue.use(ElementUI)

// vue-vedie的配置
require('video.js/dist/video-js.css');
require('vue-video-player/src/custom-theme.css');
import VideoPlayer from 'vue-video-player'

Vue.use(VideoPlayer);
Vue.config.productionTip = false
import store from "./store/index"
/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    components: {App},
    template: '<App/>',
    store,
})
