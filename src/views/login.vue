<template>
	<el-input v-model="form.userName" placeholder="请输入账号">
		<template #prepend>账号:</template>
	</el-input>
	<el-input v-model="form.password" type="password" show.value-password placeholder="请输入密码">
		<template #prepend>密码:</template>
	</el-input>
	<el-input v-model="form.verify" placeholder="请输入验证码" style="flex: 1 0 50%;">
		<template #prepend>验证码:</template>
	</el-input>
	<myverify :code='code' @click="randomCode"></myverify>
	<el-button type="success" plain @click="submit">登录</el-button>
</template>
<script setup>
	import myverify from '../components/myverify .vue';
	import {RouterLink,RouterView,useRoute,useRouter} from 'vue-router';
	import {useStore} from '../store/index.js';
	import {ref,reactive,computed,inject,onMounted} from "vue";
	import axios from "../tools/axios.js";
	import withLoading from '../tools/withLoading.js';
	import msg from '../tools/myMessage.js';
	
	onMounted(()=>ElMessage('欢迎'))
	let store = useStore();
	const router = useRouter();
	const route = useRoute();
	let url = inject('url');
	let form = reactive({});
	let code = ref('');
	let codes = ref('abcde1323');
	// 生成随机验证码
	randomCode();
	function randomCode(){
		code.value = '';
		for (let i = 0; i < 4; i++) {
			code.value += codes.value[Math.floor(Math.random() * codes.value.length)]
		}
	}
	function submit() {
		if (!form.userName  || !form.password  || !form.verify ) {
			randomCode();
			return  msg('请输入完整')
			}else if (code.value != form.verify){
			randomCode();
			return msg('验证码有误')
			};
		withLoading(axios)({
				url: "/login",
				method: "post",
				data: form
			}).then(res => {
				console.log('axios返回',res.data)
				if (res.data.errcode == 0) {
					store.login = true;
					store.user.userName = form.userName;
					store.user.role = res.data.data.role;
					if(res.data.data.networkId)store.user.networkId = res.data.data.networkId;
					store.data=res.data.data;
					store.token=res.data.data.token;
					return msg('登录成功','success');
				}
				msg(res.data.errmsg); 
			})
	}
</script>
<style scoped>
	.el-input {
		margin-bottom: 5px;
	}

	.el-input :deep(.el-input-group__prepend) {
		width: 70px;
	}

	.el-input :deep(.el-input-group__prepend:before) {
		content: "*";
		color: var(--el-color-danger);
		margin-right: 4px;
	}

	button {
		flex: auto;
	}
</style>
