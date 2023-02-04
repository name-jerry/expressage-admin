<template>
	<el-form :model="ruleForm" :rules="rules" ref="formEl">
		<p>寄方信息</p>
		<el-form-item label="姓名" prop="senderName">
			<el-input v-model="ruleForm.senderName" />
		</el-form-item>
		<el-form-item label="手机号" prop="senderPhone">
			<el-input v-model="ruleForm.senderPhone" />
		</el-form-item>
		<el-form-item label="省市区" prop="senderAreas">
			<el-cascader v-model="ruleForm.senderAreas" :options="address" filterable :props="props" clearable
				placeholder="请选择" />
		</el-form-item>
		<el-form-item label="详细地址" prop="senderAddress">
			<el-input v-model="ruleForm.senderAddress" />
		</el-form-item>
		<p>收方信息</p>
		<el-form-item label="姓名" prop="receiverName">
			<el-input v-model="ruleForm.receiverName" />
		</el-form-item>
		<el-form-item label="手机号" prop="receiverPhone">
			<el-input v-model="ruleForm.receiverPhone" />
		</el-form-item>
		<el-form-item label="省市区" prop="receiverAreas">
			<el-cascader v-model="ruleForm.receiverAreas" :options="address" filterable :props="props" clearable
				placeholder="请选择" />
		</el-form-item>
		<el-form-item label="详细地址" prop="receiverAddress">
			<el-input v-model="ruleForm.receiverAddress" />
		</el-form-item>
		<el-form-item label="快件类型" prop="type" style="flex: 100%;">
			<el-radio-group v-model="ruleForm.type">
				<el-radio label="文件" />
				<el-radio label="电子产品" />
				<el-radio label="服装鞋帽" />
				<el-radio label="食品" />
				<el-radio label="医药卫生" />
				<el-radio label="其他" />
			</el-radio-group>
		</el-form-item>

		<el-form-item label="快件重量" prop="weight" style="flex: 100%;">
			<el-radio-group v-model="ruleForm.weight" @change="change">
				<el-radio label="1kg">1kg</el-radio>
				<el-radio label="3kg">3kg</el-radio>
				<el-radio label="10kg">10kg</el-radio>
				<el-radio label=">20kg">>20kg</el-radio>
				<el-radio label="4">
					<span v-if="!isShow">手动输入</span><template v-if='isShow'><input
							v-model="ruleForm.weight" />kg</template>
				</el-radio>
			</el-radio-group>
		</el-form-item>
		<el-form-item style="align-items: center;">
			<el-button type="primary" @click="submit">确认寄件</el-button>
			<el-button type="danger" @click="reset">重置表单</el-button>
		</el-form-item>
	</el-form>
</template>

<script setup>
	import {reactive,ref,watch, inject} from 'vue';
	import {address} from "../assets/address.js";
	import axios from "axios";
	import withLoading from '../components/withLoading.js';
	
	const url=inject('url')
	//加载
	//表对象
	const ruleForm = reactive({
		senderName: "",
		senderPhone: "",
		senderAreas: [],
		senderAddress: "",
		receiverName: "",
		receiverPhone: "",
		receiverAreas: [],
		receiverAddress: "",
		type: "",
		weight: ""
	})
	//验证
	const rules = reactive({
		senderName: [{required: true,message: '请输入姓名',trigger: 'blur'},
		{max:20,min:2,message:'请输入2-20位的名字',trigger:"blur"}],
		senderPhone: [{type: "string",required: true,message: '请输入正确手机号',trigger: 'blur',pattern: /^1[3-9][0-9]{9}$/} ],
		senderAreas: [{required: true,message: '请选择区域',trigger: 'change'}],
		senderAddress: [{required: true,message: '请输入地址',trigger: 'change'}],
		receiverName: [{required: true,message: '请输入姓名',trigger: 'blur'},
		{max:20,min:2,message:'请输入2-20位的名字',trigger:"blur"}
		],
		receiverPhone: [{type: "string",required: true,message: '请输入正确手机号',trigger: 'blur',pattern: /^1[3-9][0-9]{9}$/}, ],
		receiverAreas: [{required: true,message: '请选择区域',trigger: 'change'}],
		receiverAddress: [{required: true,message: '请输入地址',trigger: 'change'} ],
		type: [{required: true,message: '请选择类型',trigger: 'change'} ],
		weight: [{required: true,message: '请选择重量',trigger: 'change'}]
	})
	//省市区属性
	const props = {
		expandTrigger: 'hover',
	}
	// 寄方省市区
	watch(() => ruleForm.senderAreas, (data) => {
		if (data == undefined) return;
		ruleForm.senderProvince = data[0];
		ruleForm.senderArea = data[1];
		ruleForm.senderCity = data[2];
	})
	// 收方省市区
	watch(() => ruleForm.receiverAreas, (data) => {
		if (data == undefined) return;
		ruleForm.receiverProvince = data[0];
		ruleForm.receiverArea = data[1];
		ruleForm.receiverCity = data[2];
	})
	//重量
	let weight = ref('');
	let isShow = ref(false);

	function change(e) {
		if (e == 4) {
			isShow.value = true;
			console.log("11" + e);
			ruleForm.weight = '';
		} else {
			isShow.value = false;
		}
	}

	// 按钮事件
	const formEl = ref();
	const submit = async () => {
		if (!formEl) return
		await formEl.value.validate((valid, fields) => {
			if (valid) {
				console.log('submit!')
				// delete ruleForm.senderAreas;
				// delete ruleForm.receiverAreas;
				withLoading(axios)({
						url: url + "/express/add",
						method: "post",
						data: ruleForm
					})
					.then(res => {
						console.log(JSON.stringify(res.data));
						if (res.data.errcode == 0) {
							// store.user.userName = form.userName;
							// router.push('/list');
							return ElMessage('寄送成功');
						}
					})
			} else {
				console.log('error submit!', fields)
			}
		})
	}
	const reset = () => {
		if (!formEl) return
		formEl.value.resetFields()
		console.log('reset')
	}
</script>

<style scoped lang="scss">
	.el-form {
		display: flex;
		flex-flow: row wrap;
		padding: 20px;

		p {
			width: 100%;
			text-align: left;
			font-size: 15px;
			font-weight: 600;
			margin: 20px 0px;
		}

		.el-form-item {
			flex: 1 1 40%;
			flex-direction: column;
			padding-right: 20px;
		}

		.el-form-item:deep(>label) {
			display: inline-flex;
			justify-content: left;
		}
	}
</style>
