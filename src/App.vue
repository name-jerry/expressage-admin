<script setup>
	import {RouterLink,RouterView,useRoute,useRouter} from 'vue-router';
	import {ref,reactive,computed,watch} from "vue";
	import	{useStore} from './store/index.js';
	import msg from './tools/myMessage.js';
	
	const store=useStore();
	const router = useRouter();
	const route = useRoute();
	let login = computed(()=>store.login);
	let user = computed(()=> store.user);
	let show = ref(false);
	let role=computed(() => {
		switch(store.user.role){
		    case 1 :
		       return "超级管理员"
		    case 2 :
		       return "网点管理员"
			 case 3 :
			      return "业务员"
		}
		})
	function quit(){
		router.push('/login');
		show.value=false;
		store.login=false;
	}
	

</script>
<template>
	<div class="content">
		<!-- 弹窗 -->
		<el-dialog v-model="show" title="--提示--" width="30%" center>
		    <span>确定退出吗?</span>
		    <template #footer>
		      <span class="dialog-footer">
				<el-button type="primary" @click="quit" >确定</el-button>
		        <el-button @click="show = false">取消</el-button>
		      </span>
		    </template>
		  </el-dialog>
		<!-- 头部 -->
		<header class="header" v-if="login">
			<div class="login">
			<img src="./assets/homeicon.png" alt="" class="icon first" />
			<span >归属网点ID:{{user.networkId}}</span>
			</div>
			<div class="user" >
					<img src="./assets/head.jpg" alt="" class="icon" />
				<span>你好!{{role+user.userName}}</span>
				<a @click="show=true" >
					<img src="./assets/end.svg" alt="" class="icon"/>
				</a>
			</div>
		</header>
		<div class="body flex-auto ">
<!-- 垂直导航 -->
			<el-menu v-if="login" default-active="route.path" mode="vertical" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b" router>
				<!-- <el-menu-item  index="/">管理员设置</el-menu-item> -->
				<el-menu-item v-if="store.user.role==2" :index="'/couriers'"  >快递员管理</el-menu-item>
				<el-menu-item :index="'/list'" >快递管理</el-menu-item>
			</el-menu>
		<div class="main flex-auto " >
			<router-view/>
			<!-- 底部 -->
			<footer class="footer" v-if="login">
				<p>版权所有©快递管理系统 2021-2022</p>
			</footer>
		</div>
		</div>
	</div>
</template>

<style scoped lang="scss">
	@import'./assets/global.scss';
	.content {
		width: 100%;
		height: 100%;
		display: flex;
		flex-flow: column;
		.header {
			padding: 0px 20px;
			height: $header-height;
			width: 100%;
			display: flex;
			background-color: $theme-color;
			justify-content: space-between;
			align-items: center;
			}
	}
	.body{
		display: flex;
		.el-menu {
			background-color: lighten($theme-color,6%);
			width: 150px;
		}
		.main {
			display:flex;
			justify-content: end;
			flex-direction: column;
			.footer{height: 50px;@include center;}
		}
	}
		.icon {
			width: 45px;
			height: 45px;
			
		}

		.first {
			border-radius: 0;
			box-shadow: 0px 0px 2px black;
			background-color: aquamarine;
			box-shadow: 0 0 1px darken(aquamarine,10%);
		}
		.login {
			display: inline-flex;
			width: 160px;
			height: 100%;
			align-items: center;
			justify-content: space-between;
			color: white;
			font-size: 15px;
		}

		.user {
			
			display: inline-flex;
			height: 100%;
			align-items: center;
			justify-content: space-evenly;
			color: white;
			.icon {border-radius: 50%; padding: 5px}
			.icon:hover {
				padding: 0px;
			}
		}
		
</style>
