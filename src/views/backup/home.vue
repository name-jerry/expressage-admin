<script>
	export default {
		inject: ['url'],
		data() {
			return {
				dialogVisible: false,
				msg: '确定退出',
				loading: false,
				page: [new URL('../assets/slide2.jpeg',
					import.meta.url).href, new URL('../assets/slide3.jpeg',
					import.meta.url).href]
			}
		},
		inject: ['url'],
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
							this.$store.state.data = res.data.data;
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
<template>
	<div class="content">
		<routerView />
		<!-- 轮播图 -->
		<el-carousel class="slide">
			<el-carousel-item v-for="item in page">
				<el-image :src="item" fit="cover" class="page"></el-image>
			</el-carousel-item>
		</el-carousel>
		<!-- 显示区 -->
		<div class="body">
			<p>物流服务介绍</p>
			<el-menu mode="horizontal" >
				<el-menu-item index="1">快递服务</el-menu-item>
				<el-menu-item index="2">快运服务</el-menu-item>
				<el-menu-item index="3">冷运服务</el-menu-item>
				<el-menu-item index="4">医药服务</el-menu-item>
				<el-menu-item index="5">国际服务</el-menu-item>
			</el-menu>
		</div>
	</div>
</template>

<style scoped lang="scss">
	@import "../assets/global.scss";

	.content {
		height: 100%;
		display: flex;
		flex-direction: column;

		.slide {
			height: 300px;

			.page {
				width: 100%;
				height: 100%;
			}
		}
	}

	.body {
		flex: auto;
		display: flex;
		flex-flow: column;
		align-items: center;
		&>p:first-child {
			font: {
				size: 30px;
				weight: 800
			}
		}
		.el-menu {
			width: 550px;
			height: 50px;
			display: flex;
			justify-content: center;
			background-color: rgba(1, 1, 1, 0);
		}
	}
</style>
