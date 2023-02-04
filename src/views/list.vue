<script setup>
	import withLoading from '../tools/withLoading.js';
	import {RouterLink,RouterView,useRoute,useRouter} from 'vue-router';
	import {useStore} from '../store/index.js';
	import {ref,reactive,computed,onMounted,watch} from "vue";
	import axios from "../tools/axios.js";
	import {ElMessage} from 'element-plus';
	import msg from '../tools/myMessage.js'

	let store = useStore();
	const router = useRouter();
	const route = useRoute();
	let login = computed(() => store.login);
	let networkId = computed(()=> {
		if(store.user&&store.user.networkId){return store.user.networkId;}
		return null;
		});
	//默认的快件获取url
	let listUrl = computed(() => {
		if(store.user.role==3)return '/express/courierlist';
		return "/express/list"
		});
	let networkParams = reactive({
		current: 1,
		size: 10
	}); //网点查询数据
	let courierParams = reactive({
		current: 1,
		size: 10,
		status: -1
	}); //网点查询数据
	// 弹窗
	let show = ref(true);
	let title = ref('选择快递员');
	let form = reactive({});
	let optionData = reactive({list:[]});
	// 分页器
	let pageSize = ref(4);
	let currentPage = ref(1);

	//自动更改显示数量
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
		let height = test.value.offsetHeight;
		if (height > 600) {
			pageSize.value += 6;
		} else if (height > 400) {
			pageSize.value += 4;
		}
		myObserver.observe(content.value);
		myObserver.observe(test.value);
	});
	//获取快递列表
	getList({
		data: {
			current: 0,
			size: 100,
			networkId: store.user.networkId
		},
		url: listUrl.value,
	});
	// console.log(store.data)
	// 计算列表显示数据
	let list = computed(() => {
		if (store.data.list) return store.data.list;
		return [];
	});
	let showList = computed(() => list.value.filter((value, index) => index >= (currentPage.value - 1) * pageSize.value &&
		index <= currentPage.value * pageSize.value - 1 ));
	let total = computed(() => list.value.length);


	// method
	//获取总列表数据
	function getList({url,data,response,isShow,method = 'get'}) {
		show.value = isShow;
		withLoading(axios)({
				method,
				url,
				data
			})
			.then(res => {
				console.log('axios返回', res.data)
				if (response=='optionData') {
					if(res.data.errcode!=0) return msg(res.data.errmsg,'error');
					optionData.list= res.data.data.list
					return
				}
				store.data = res.data.data;
				
			})
	}

	//操作
	function operate({url,data,method = 'get',isShow,type}) {
		console.log('operate',optionData.list)
		show.value = isShow;
		if(type=='paijian'&&type=='shoujian'){
			 delete data.networkId
		}else if(type=='zhuanyun'){
			delete data.courierId
		}
			withLoading(axios)({
					url,
					method,
					data
				})
				.then(res => {
					getList({
						data: {
							current: 0,
							size: 100,
							networkId: store.user.networkId
						},
						url: listUrl.value,
					});
					console.log('axios返回', res.data);
				})
	}
</script>

<template>
	<div class="content" ref="content" v-if="login">
		<!-- 快递任务弹窗 -->
		<el-dialog v-model="show" :title="'请选择'+title">
			<template v-if="title=='收件员'||title=='派件员'">
				<el-select  v-model="form.courierId" placeholder="请选择">
					<el-option v-for="(item,index) in optionData.list"  :key="index"
						:label="item.realName"  :value="item.id" />
				</el-select>
				</template>
				<template v-else>
					<el-select  v-model="form.networkId" placeholder="请选择">
						<template v-for="(item,index) in optionData.list">
						<el-option  v-if="item.id!=networkId" :label="item.networkName"
							:value="item.id" />
							</template>
					</el-select>
					</template>
			<template #footer>
				<span class="dialog-footer">
					<el-button v-if="title=='收件员'" @click="operate({url:'/express/shoujian',data:form,method:'post',type:'shoujian'})">确认</el-button>
					<el-button v-else-if="title=='派件员'" @click="operate({url:'/express/paijian',data:form,method:'post',type:'paijian'})">确认</el-button>
					<el-button v-else @click="operate({url:'/express/zhuanyun',data:form,method:'post',type:'zhuanyun'})">确认</el-button>
					<el-button type="primary" @click="show = false">取消</el-button>
				</span>
			</template>
		</el-dialog>
		<!-- 按钮 -->
		<el-button-group v-if="store.user.role==3">
			<el-button type="primary" @click="getList({url:listUrl,data:{current:1,size:100,status:-1}})">全部</el-button>
			<el-button type="primary" @click="getList({url:listUrl,data:{current:1,size:100,status:2}})">待揽件</el-button>
			<el-button type="primary" @click="getList({url:listUrl,data:{current:1,size:100,status:4}})">待派件</el-button>
		</el-button-group>
		<!-- 表格 -->
		<template v-if="store.data.list">
			<el-table :data="showList" border table-layout="auto">
				<el-table-column prop="id" label="快递单号" />
				<el-table-column label="寄件人">
					<template #default='{ row, column, $index }'>
						{{row.senderName}}<br />{{row.senderPhone}}
					</template>
				</el-table-column>
				<el-table-column label="寄件人地址">
					<template #default='{ row, column, $index }'>
						{{row.senderProvince}}&nbsp{{row.senderCity}}{{row.senderArea}}<br />{{row.senderAddress}}
					</template>
				</el-table-column>
				<el-table-column label="收件人">
					<template #default='{ row, column, $index }'>
						{{row.receiverName}}<br />{{row.receiverPhone}}
					</template>
				</el-table-column>
				<el-table-column label="收件人地址">
					<template #default='{ row, column, $index }'>
						{{row.receiverProvince}}{{row.receiverCity}}{{row.receiverArea}}<br />{{row.receiverAddress}}
					</template>
				</el-table-column>
				<el-table-column label="状态">
					<template #default='{ row, column, $index }'>
						<template v-if="row.status==0">待审核</template>
						<template v-else-if="row.status==1">待揽件</template>
						<template v-else-if="row.status==2">揽件中</template>
						<template v-else-if="row.status==3">运输中</template>
						<template v-else-if="row.status==4">派件中</template>
						<template v-else-if="row.status==5">已妥投</template>
						<template v-else-if="row.status==8">已撤单</template>
						<template v-else-if="row.status==9">已拒收</template>
						<template v-else>{{row.status}}</template>
					</template>
				</el-table-column>
				<el-table-column prop="weight" label="重量" />
				<el-table-column prop="type" label="类型" />
				<el-table-column prop="gmtCreate" label="下单时间" />
				<el-table-column label="操作">
					<template #default='{ row, column, $index }'>
						<!-- 网点功能 -->
						<el-button-group v-if="store.user.role==2" class="btn-group">
							<el-button type="primary" v-if="row.status==1"
								@click="form.expressId=row.id,title='收件员',getList({url:'/courier/list',data:courierParams,response:'optionData',isShow:true})">
								收件</el-button>
							<el-button type="primary" v-if="row.status==3"
								@click="form.expressId=row.id,title='派件员',getList({url:'/courier/list',data:courierParams,response:'optionData',isShow:true})">
								派件</el-button>
							<el-button type="primary" v-if="row.status==3"
								@click="form.expressId=row.id,title='网点',getList({url:'/network/list',data:networkParams,response:'optionData',isShow:true})">
								转运</el-button>
						</el-button-group>
						<!-- 快递员功能 -->
						<el-button-group v-if="store.user.role==3" class="btn-group">
							<el-button type="primary" v-if="row.status==2"
								@click="operate({url:'/express/lanjian',data:{expressId:row.id},method:'post'})">揽收</el-button>
							<el-button type="primary" v-if="row.status==4"
								@click="operate({url:'/express/tuotou',data:{expressId:row.id},method:'post'})">妥投</el-button>
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
	@import'../assets/global.scss';

	.content {
		display: flex;
		flex-flow: column;
		height: 100%;
		width: 100%;
		justify-content: center;
		align-items: center;
		padding: 1%;

		.el-button-group {
			align-self: flex-start;
		}
	}

	.btn-group {
		display: inline-flex;
	}

	.el-table :deep(.cell) {
		display:flex;
		align-items: center;
		justify-content: center;
		text-align: center;
		white-space:nowrap;
	}
</style>
