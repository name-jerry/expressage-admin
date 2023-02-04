<script setup>
	import withLoading from '../tools/withLoading.js';
	import msg from '../tools/myMessage.js';
	import {
		RouterLink,
		RouterView,
		useRoute,
		useRouter
	} from 'vue-router';
	import {
		useStore
	} from '../store/index.js';
	import {
		ref,
		reactive,
		computed,
		onMounted,
		watch
	} from "vue";
	import axios from "../tools/axios.js";
	import {
		ElMessage
	} from 'element-plus';

	let store = useStore();
	const router = useRouter();
	const route = useRoute();
	let login = computed(() => store.login);
	//params
	let couriersParams = reactive({
		current: 1,
		size: 10,
		status: -1
	});
	// 弹窗
	let show = ref(true);
	let is = ref(true);
	let update = ref(true);
	let title = ref('修改信息');
	let form = ref('')
	// 分页器
	let pageSize = ref(4);
	let currentPage = ref(1);

	//根据屏幕尺寸更改显示数量
	let content = ref();
	let test = ref();
	const myObserver = new ResizeObserver(entries => {
		if (!entries[1] || currentPage.value != 1) return;
		let testH = entries[1].contentRect.height;
		if (testH > 100) {
			pageSize.value++;
		} else if (testH < 10 && pageSize.value > 4) {
			pageSize.value--;
		}

	});
	onMounted(() => {
		// console.log(test.value.offsetHeight)
		let height = test.value.offsetHeight;
		if (height > 600) {
			pageSize.value += 6;
		} else if (height > 400) {
			pageSize.value += 4;
		}
		myObserver.observe(content.value);
		myObserver.observe(test.value);
	});
	// console.log(store.data)
	//验证
	const rules = reactive({
		adminName: [{
			required: true,
			max: 20,
			min: 2,
			message: '请输入2-20位的名字',
			trigger: "blur"
		}],
		password: [{
			type: "string",
			required: true,
			message: '请输入密码',
			trigger: 'blur'
		}],
		password2: [{
			type: "string",
			required: true,
			message: '请输入密码',
			trigger: 'blur'
		}],
		phone: [{
			type: "string",
			required: true,
			message: '请输入正确手机号',
			trigger: 'blur',
			pattern: /^1[3-9][0-9]{9}$/
		}, ],
		realName: [{
			required: true,
			message: '请输入姓名',
			trigger: 'change'
		}],

	})
	// 验证方法
	const formEl = ref();
	const submit = async () => {
		if (!formEl) return
		await formEl.value.validate((valid, fields) => {
			if (valid) {
				if (form.value.password != form.value.password2) return msg('密码不一致', 'error');
				withLoading(axios)({
						url: "/courier/add",
						data: {
							roleId: 3,
							...form.value
						},
						method: 'post'
					})
					.then(res => {
						console.log('axios getList返回', res.data);
						if (res.data.errcode != 0) {
							return msg(res.data.errmsg, 'error')
						}else if (res.data.errcode == 0) {
						msg('成功', 'success');
						getList({
							url: "/courier/list",
							data: {
								current: 1,
								size: 10,
								status: -1
							}
						});
					}});
			} else {
				console.log('error submit!', fields)
			}
		})
	}
	// 计算列表显示数据
	let list = computed(() => {
		if (store.data.list) {
			return store.data.list
		};
		return []
	});
	let showList = computed(() => list.value.filter((value, index) => index >= (currentPage.value - 1) *
		pageSize.value &&
		index <= currentPage.value * pageSize.value - 1));
	let total = computed(() => list.value.length);

	//默认加载时调用
	getList({
		url: "/courier/list",
		data: {
			current: 1,
			size: 10,
			status: -1
		}
	});
	// method
	//获取总列表数据
	function getList({url,data,response,isShow,method = 'get'}) {
		withLoading(axios)({
				method,
				url,
				data
			})
			.then(res => {
				console.log('axios getList返回', res.data);
				if (res.data.errcode != 0) return msg(res.data.errmsg, 'error');
				if (response == 'info') {
					is.value = true;
					store.formData = res.data.data.info;
					form.value = res.data.data.info;
					console.log(form)
					return
				} else if (res.data.data) {
					store.data.list = res.data.data.list;
				}


			})
		show.value = isShow;
	}
	//操作
	function operate({
		url,
		data,
		method = 'get',
		isShow,
		type
	}) {
		// console.log('operate', optionData.list)
		show.value = isShow;

		withLoading(axios)({
				url,
				method,
				data
			})
			.then(res => {
				getList({
					url: "/courier/list",
					data: {
						current: 1,
						size: 10,
						status: -1
					}
				});
				console.log('axios operate返回', res.data);
			})
	}
	// 增加
	function add() {
		is.value = false
		form.value = {}
		show.value = true;

	}
</script>

<template>
	<div class="content" ref="content" v-if="login">
		<!-- 快递任务弹窗 -->
		<el-dialog v-model="show" :title="title">
			<template v-if="form">
				<el-form :model="form" :rules="rules" ref="formEl">
					<el-form-item label="登录名" prop="adminName">
						<el-input v-model="form.adminName" :disabled="is" />
					</el-form-item>
					<el-form-item v-if='!is' label="密码" prop="password">
						<el-input v-model="form.password" type="password" show-password placeholder="请输入密码" />
					</el-form-item>
					<el-form-item v-if='!is' label="确认密码" prop="password2">
						<el-input v-model="form.password2" type="password" show-password placeholder="请再次输入密码" />
					</el-form-item>
					<el-form-item label="真实姓名" prop="realName">
						<el-input v-model="form.realName" />
					</el-form-item>
					<el-form-item label="手机号" prop="phone">
						<el-input v-model="form.phone" />
					</el-form-item>
				</el-form>
			</template>
			<template #footer>
				<span class="dialog-footer">
					<el-button type="primary" v-if="is" @click="operate({url:'/courier/save',data:form,method:'post'})">
						确认</el-button>
					<el-button type="primary" v-else @click="submit">确认</el-button>
					<el-button @click="show = false">取消</el-button>
				</span>
			</template>
		</el-dialog>
		<!-- 按钮 -->
		<div class="btn-group">
			<el-button-group>
				<el-button type="primary" @click=" getList({url:'/courier/list',data:{current:1,size:10,status:-1}}) ">
					全部
				</el-button>
				<el-button type="primary" @click="getList({url:'/courier/list' ,data:{current:1,size:10,status:1}})">正常
				</el-button>
				<el-button type="primary" @click="getList({url:'/courier/list' ,data:{current:1,size:10,status:0}})">禁用
				</el-button>
			</el-button-group>
			<el-button type="primary" @click="add">增加</el-button>
		</div>
		<template v-if="showList">
			<el-table :data="showList" border table-layout="auto">
				<el-table-column prop="id" label="id" />
				<el-table-column prop="adminName" label="账号" />
				<el-table-column prop="realName" label="姓名" />
				<el-table-column prop="phone" label="联系方式" />
				<el-table-column label="状态">
					<template #default='{ row, column, $index }'>
						<template v-if="row.status==1">正常</template>
						<template v-else-if="row.status==0">禁用</template>
					</template>
				</el-table-column>
				<el-table-column label="操作">
					<template #default='{ row, column, $index }'>
						<el-button-group>
							<el-button type="warning" v-if="row.status==1"
								@click="operate({url:'/admin/status',data:{id:row.id,status:0},method:'post'})">禁用
							</el-button>
							<el-button type="primary" v-if="row.status==0"
								@click="operate({url:'/admin/status',data:{id:row.id,status:1},method:'post'})">激活
							</el-button>
							<el-button type="primary"
								@click="getList({url:'/courier/getinfo',response:'info',data:{id:row.id},isShow:true})">
								修改</el-button>
							<el-button type="danger"
								@click="operate({url:'/courier/delete',data:{id:row.id},method:'post'})">删除</el-button>
						</el-button-group>
					</template>
				</el-table-column>
			</el-table>
		</template>
		<el-pagination :hide-on-single-page="total<=pageSize" background layout="prev, pager, next"
			:page-size='pageSize' :total="total" v-model:current-page="currentPage" />
		<div ref="test" class="flex-auto" />
	</div>

</template>

<style scoped lang="scss">
	.content {
		display: flex;
		flex-flow: column;
		height: 100%;
		width: 100%;
		justify-content: center;
		align-items: center;
		padding: 1%;


	}

	.btn-group {
		display: flex;
		align-self: stretch;
		justify-content: space-between;
	}

	.el-form-item:deep(>label) {
		width: 80px;
	}

	.el-table :deep(.cell) {
		display: flex;
		align-items: center;
		justify-content: center;
		text-align: center;
		white-space: nowrap;
	}
</style>
