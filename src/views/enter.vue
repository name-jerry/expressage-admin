<template>
	<div v-if="!store.login" class="content">
		<div class="main">
			<form>
				<fieldset class="form">
					<legend>用户{{title}}</legend>
					<router-view />
				</fieldset>
			</form>
		</div>
	</div>
</template>
<script setup>
	import {ref,computed} from "vue";
	import {useStore} from '../store/index.js';
	
	let store = useStore();
	let title = ref('登录');
</script>
<style scoped>
	.content {
		display: flex;
		height: 100%;
		width: 100%;
		justify-content: center;
		align-items: center;
		background-image: linear-gradient(160deg, #00ffd5 20%, #008cff 80%);
	}

	.form {
		width: 400px;
		padding: 0px 30px 30px;
		display: flex;
		flex-flow: row wrap;
		background-color: #BEFFFFFF;
		box-shadow: 0px 0px 6px;
		border-radius: 5px;
	}

	.form>legend {
		font: bold 25px/30px Georgia, serif;
		text-shadow: 0px 0px 3px;
		padding: 20px;
	}
</style>
