import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/main.css'
import axios from 'axios'
import VueAxios from 'vue-axios'
import store from './store/store'
import msg from './tools/myMessage.js'

const app = createApp(App);
router.beforeEach(async (to,from)=>{
	let login=false;
	if (window.sessionStorage.getItem('main')) {
		login = JSON.parse(window.sessionStorage.getItem('main')).login
	};
	
	if(!login&&to.name != 'login'){
		msg('请登录');
		return {name:'login'}
	}
})
// 设置全局属性
app.provide('url','http://122.112.236.72:8889/api');
app.use(router).use(VueAxios, axios).use(store)
axios.defaults.withCredentials = true;
axios.defaults.timeout=5000;
app.mount('#app');
