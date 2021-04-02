<template>
	<view class="new-modal" v-if="myData.show">
		<view class="new-modal-content">
			<view class="new-modal-header new-modal-hearder-first">您还未登录</view>
			<view class="new-modal-body" style="min-height:0;margin-bottom:0;max-height:none">
				<view class="new-modal-tip">
					<view style="font-size: 30rpx; color: #666;">请先登录再进行操作</view>
				</view>
				<!-- <view style="text-align:center">
					<image class="new-modal-img" src="../../static/icon-login-index.png"></image>
				</view> -->
				<view class="flex-x-center mrg-top-20">
					<view class="row-container">
						<button class="btn new-modal-btn bg-red" @click="handleClose" style="width:220rpx;height:80rpx;line-height:80rpx;font-size:32upx;border-radius:80rpx;margin-bottom:40rpx;font-size: 30upx;">暂不登录</button>
						<!-- #ifdef H5 -->
						<button class="btn new-modal-btn" @tap="getUserInfoH5" style="background-color:#04be01;width:220rpx;height:80rpx;line-height:80rpx;border-radius:80rpx;color:#fff;margin-bottom:20rpx;font-size: 30upx;">立即登录</button>
						<!-- #endif -->
						<!-- #ifdef MP-WEIXIN -->
						<button @getuserinfo="onLoginTab" class="btn new-modal-btn" openType="getUserInfo" style="background-color:#04be01;width:220rpx;height:80rpx;line-height:80rpx;border-radius:80rpx;color:#fff;margin-bottom:20rpx;font-size: 30upx;">立即登录</button>
						<!-- #endif -->
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				myData: {
					show: false
				}
			}
		},
		props: {
			propData: {
				type:Object,
				default() {
					return {}
				}
			}
		},
		onLoad() {
			console.log('myLogin')
		},
		watch: {
			propData: {
				handler() {
					let data = {}
					data = Object.assign({}, data, this.myData, this.propData)
					this.myData = data
				},
				immediate: true
			}
		},
		methods: {
			/**
			* 登陆异常处理
			*/
			onLoginTab: function(res) {
				if (res.detail.errMsg === "getUserInfo:fail auth deny") {
					return;
				} else if (res.detail.errMsg === "getUserInfo:ok"){
					this.$emit('getUserInfoSuccess', res.detail.userInfo)
				}
			},
			getUserInfoH5: function() {
				this.$emit('getUserInfoH5')
			},
			handleClose: function() {
				this.$emit('handleClose')
			}
		}
	}
</script>

<style>
	.new-modal {
	  width: 750rpx;
	  height: 100%;
	  position: fixed;
	  left: 0;
	  top: 0;
	  background-color: rgba(0, 0, 0, 0.5);
	  z-index: 9999;
	  display: -webkit-box;
	  display: -webkit-flex;
	  display: flex;
	  -webkit-box-pack: center;
	  -ms-flex-pack: center;
	  justify-content: center;
	  -webkit-box-align: center;
	  -ms-flex-align: center;
	  -ms-grid-row-align: center;
	  align-items: center;
	}

	.new-modal-content {
	  width: 630rpx;
	  height: auto;
	  background-color: #fff;
	  border-radius: 16rpx;
	}

	.new-modal-header {
	  padding: 48rpx 0 32rpx 0;
	  text-align: center;
	  line-height: 88rpx;
	  font-size: 13pt;
	}

	.new-modal-body {
	  padding: 0 24rpx;
	  min-height: 400rpx;
	  color: #666;
	  margin-bottom: 48rpx;
	  max-height: 700rpx;
	  overflow-y: auto;
	}

	.new-modal-footer {
	  height: 88rpx;
	  width: 100%;
	  border-top: 1rpx solid #e2e2e2;
	  display: -webkit-box;
	  display: -webkit-flex;
	  display: flex;
	}
	.new-modal-hearder-first {
		padding:30rpx 0;
		line-height:60rpx;
		border-bottom: 1rpx solid #eee;
	}
	.new-modal-hearder-second {
		padding:30rpx 0;
		line-height:60rpx;
		font-size:11pt;
		border-bottom: 1rpx solid #eee;
	}
	.new-modal-tip {
		padding:32rpx 0 0 0;
		text-align: center
	}
	.new-modal-img {
		width:500rpx;
		height:460rpx;
	}
</style>
