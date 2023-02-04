<script>
	export default {
		inject: ['url'],
		data() {
			return {
				form: {},
				show: false,
				msg: '',
				loading: false,
			}
		},
		methods: {
			submit() {
				if (this.form.userName == null || this.form.password == null ||this.form.password2 == null||this.form.sex==null) {
					this.msg = '请输入完整'
					this.show = true
					return
				};
				if (this.form.password != this.form.password2) {
					this.msg = '两次密码不一致'
					this.show = true
					return
				};
				this.loading = true;
				this.axios({
						url: this.url + "/user/reg",
						method: "post",
						data: this.form
					})
					.then(res => {
						console.log(res);
						if (res.data.errcode == 0) return this.$router.push('/main');
						this.loading = false;
						this.msg = res.data.errmsg;
						this.show = true
					})
					.catch(err => {
						this.loading = false;
						console.log(res.data)
					})
			}
		},
	}
</script>
<template>
	<!--弹窗 -->
	<el-dialog v-model="show" width="300px">
		{{msg}}
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="show=false">确定</el-button>
			</span>
		</template>
	</el-dialog>
	<el-input v-model="form.userName" placeholder="请输入账号">
		<template #prepend>账号:</template>
	</el-input>
	<el-input v-model="form.password" name="password" type="password" show-password placeholder="请输入密码">
		<template #prepend>密码:</template>
	</el-input>
	<el-input v-model="form.password2" name="password2" type="password" show-password placeholder="请再次输入密码">
		<template #prepend>密码:</template>
	</el-input>
	<el-input v-model="form.phone" name="phone" type="tel" placeholder="手机号">
		<template #prepend>手机:</template>
	</el-input>
	 <el-form-item label="性别" style="display: flex;margin-bottom: 5px;" >
	      <el-radio-group v-model="form.sex" >
	        <el-radio border label="男" />
	        <el-radio border label="女" />
	      </el-radio-group>
	    </el-form-item>
		<el-input v-model="form.address" name="address" type="textarea" maxlength="30" show-word-limit placeholder="请输入地址" style="margin-bottom: 5px;">
		</el-input>
	<el-button type="success" plain  @click="submit" v-loading.fullscreen="loading">注册</el-button>
</template>

<style scoped>
	.el-input {
		margin-bottom: 5px;
	}

	.el-input:deep(.el-input-group__prepend){
		width: 70px;
	}
	.el-form-item:deep(>label){
		width: 70px;
		align-self: center;
	}
	.el-form-item:deep(>label:before){
		content: "*";
		color: var(--el-color-danger);
		margin-right: 4px;
	}
	.el-form-item:deep(.el-form-item__content){
		flex: auto;
	}
	.el-input:deep(.el-input-group__prepend:before) {
		content: "*";
		color: var(--el-color-danger);
		margin-right: 4px;
	}
	button {
		flex: auto;
	}
</style>
