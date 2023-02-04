<template>
	  <!-- 主体 -->
	<div class="content">
		<!-- 头部 -->
		<header class="header">
			<p>快递管理系统</p>
			<div class="admin">
				<a @click="">
					<img src="../assets/head.jpg" alt="" />
				</a>
				<span>退出登录</span>
				<a @click="dialogVisible=true">
					<img src="../assets/end.svg" alt="" />
				</a>
			</div>
		</header>
		<!--弹窗 -->
		<el-dialog v-model="dialogVisible" width="300px">
			{{msg}}
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="this.$router.push('/')">确定</el-button>
				</span>
			</template>
		</el-dialog>
		<!-- 侧边栏 -->
		<el-menu background-color="#545c64" text-color="#fff" class="ver" @select="select">
			<el-menu-item index="1">
				<el-icon>
					<img src="../assets/admin.svg" alt="" style="width: 20px;" />
				</el-icon>
				<template #title>管理员设置</template>
			</el-menu-item>
			<el-menu-item index="2">
				<el-icon>
					<img src="../assets/user.png" alt="" style="width: 22px;" />
				</el-icon>
				<template #title>用户管理</template>
			</el-menu-item>
			<el-menu-item index="3">
				<el-icon>
					<img src="../assets/web.png" alt="" style="width: 28px;" />
				</el-icon>
				<template #title>网点管理</template>
			</el-menu-item>
			<el-menu-item index="4">
				<el-icon>
					<img src="../assets/express.png" alt="" style="width: 17px;" />
				</el-icon>
				<template #title>快件管理</template>
			</el-menu-item>
		</el-menu>
		<!-- 显示区 -->
		<div class="body">
			<routerView />
		</div>
		<!-- 底部 -->
		<div class="floor">
			<p>版权所有</p>
			<p>版权所有</p>
		</div>
	</div>
</template>
<script>
	export default {
		inject: ['url'],
		data() {
			return {
				dialogVisible: false,
				msg: '确定退出',
				loading: false
			}
		},
		inject: ['url'],
		computed: {

		},
		methods: {
			select(index) {
				this.loading = true;
				if (index == 4) {
					this.axios({
							url: this.url + "/express/list",
							method: "get",
							data: {
								startRn: 0,
								perPage: 10
							}
						})
						.then(res => {
							this.loading = false;
							this.$store.state.data=res.data.data;
							console.log(res.data.data)
							this.$router.push('/main/list')
						})
						.catch(err => {
							this.loading = false;
							console.log(err)
						})
				}
			}
		}

	}
</script>
<style scoped>
	.content {
		display: grid;
		height: 100vh;
		grid: 40px calc(100vh - 80px) 40px / 25% 75%;
		grid-template-areas:
			"header header"
			"left body"
			"left floor";
	}

	.header {
		grid-area: header;
		background-color: #545c64;
		position: sticky;
		width: 100%;
		padding: 0 12px 0 32px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		color: white;
		font: 22px/1 Tahoma, Helvetica, Arial, "\5b8b\4f53", sans-serif;

	}

	.admin {
		display: flex;
		min-width: 170px;
		justify-content: space-evenly;
		align-items: center;
		font-size: 15px;
	}

	.admin img {
		height: 40px;
		padding: 4px;
		border-radius: 50%;
		vertical-align: -3px;
	}

	.ver {
		grid-area: left;
	}

	.body {
		grid-area: body;
	}

	.floor {
		grid-area: floor;
		text-align: center;
		line-height: 20px;
		font-size: 12px;
		font-weight: 500;
		color: var(--vt-c-text-2);
		transition: color .25s;
	}
</style>
