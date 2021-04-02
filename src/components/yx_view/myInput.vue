<template>
	<view class="myInput-page" style="margin-right:66upx;" :style="propData.inputStyle">
		<input class="myInput-page-input" :value="propData.val" :type="propData.type" @input="inputVal" :placeholder="propData.placeholder" />
		<image v-if="propData.showClear" @tap.stop="clearVal" class="myInput-page-clear" src="../../static/login_close.png"></image>
		<view v-if="propData.showCodeButton" @tap.stop="clickCodeButton" class="myInput-page-clear myInput-page-button">{{propData.countDownNum>0?'剩余'+propData.countDownNum+'秒':'获取验证码'}}</view>
	</view>
</template>

<script>
	export default {
		props: {
			propData: {
				type: Object,
				default() {
					return {}
				}
			}
		},
		methods:{
			inputVal: function(e) {
				this.$emit('inputVal', e.detail.value)
			},
			clickCodeButton: function() {
				this.$emit('clickCodeButton')
			},
			clearVal: function() {
				this.$emit('clearVal')
			}
		}
	}
</script>

<style>
	.myInput-page {
		height: 100upx;
	}
	.myInput-page-input {
		width: 70%;
		float: left;
		margin-top: 22upx;
		font-size: 36upx;
		padding-bottom: 32upx;
	}
	.myInput-page-clear {
		float: right;
		width: 24upx;
		height: 24upx;
		margin-top: 38upx;
	}
	.myInput-page-button {
		float: right;
		height: 100%;
		width: 150upx;
		color: #44BD32;
		font-size: 26upx;
		display: flex;
		justify-content: center;
		align-items: center;
		margin-top: 0upx;
	}
</style>
