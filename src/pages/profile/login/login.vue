<template>
	<view class="page">
		<view class="hello">你好，</view>
		<view class="hello2">欢迎加入友邻优选商城</view>
		<view class="edit-box" style="margin-top: 120rpx;">
			<input type="number" placeholder="请输入手机号" v-model="phone" />
			<image src="../../../static/ic_close.png"></image>
		</view>
		<view class="line"></view>
		<view class="edit-box">
			<input type="number" placeholder="请输入验证码" v-model="code" />
			<text class="get-code" @click="getCode">获取验证码</text>
		</view>
		<view class="btn-into" style="margin-top: 140rpx;" @click="login">进入</view>
		<view class="desc">
			<text>登录即表示已阅读并同意</text>
			<text class="protocol">《友邻优选商城用户服务协议》</text>
		</view>
		<view class="logins">
			<image src="../../../static/ic_password_login.png"></image>
			<image src="../../../static/ic_wechat_login.png" @click="wxLogin"></image>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				phone: '',
				code: ''
			};
		},
		methods: {
			getCode() {
				let _this = this;
				let reg=/^1[3456789]\d{9}$/;
				if(_this.phone.length!=11){  
					uni.showToast({
						title: '请输入正确的手机号',
						icon: 'none',
						duration: 2000
					});
					return
				} 
				if(!reg.test(_this.phone)){  
					uni.showToast({
						title: '请输入正确的手机号',
						icon: 'none',
						duration: 2000
					});
					return
				} 
				uni.request({
					url: 'https://test.youxuanbest.com/app/index.php?i=8&t=0&v=1.0.5&from=wxapp&c=entry&a=wxapp&do=Ccode|getcode',
					data: {
						tel: _this.phone,
						m: 'sqtg_sun',
					},
					success: (res) => {
						console.log(res.data);
					}
				});
			},
			login() {
				let _this = this;
				if(!(/^1[3|4|5|8][0-9]\d{4,8}$/.test(_this.phone))){  
					uni.showToast({
						title: '请输入正确的手机号',
						icon: 'none',
						duration: 2000
					});
					return
				} 
				if (_this.code == '') {
					uni.showToast({
						title: '请输入手机验证码',
						icon: 'none',
						duration: 2000
					});
					return
				}
				uni.request({
					url: 'https://test.youxuanbest.com/app/index.php?i=8&t=0&v=1.0.5&from=wxapp&c=entry&a=wxapp&do=Cuser|loginbytel',
					data: {
						tel: _this.phone,
						code: _this.code,
						m: 'sqtg_sun',
					},
					success: (res) => {
						console.log(res.data);
						if (res.data.code == 0) {
							uni.setStorageSync('userInfo', res.data.data);
							uni.navigateBack({
								delta: 1
							});
						} else {
							uni.showToast({
								title: res.data.msg,
								icon: 'none',
								duration: 2000
							});
						}

					}
				});
			},
			wxLogin() {
				let _this=this
				uni.login({
					provider: 'weixin',
					success: function(loginRes) {
						console.log(loginRes.authResult);
						_this.wxLoginHandle(loginRes.authResult.unionid)
					},
					fail:function(res){
						uni.showToast({
							title: JSON.stringify(res),
							icon: 'none',
							duration: 2000
						});
						console.log(res)
					}
				});
			},
			
			wxLoginHandle(unionid) {
				uni.request({
					url: 'https://test.youxuanbest.com/app/index.php?i=8&t=0&v=1.0.5&from=wxapp&c=entry&a=wxapp&do=Cuser|loginbyunionid',
					data: {
						unionid: unionid,
						m: 'sqtg_sun',
					},
					success: (res) => {
						console.log(res.data);
						if (res.data.code == 0) {
							uni.setStorageSync('userInfo', res.data.data);
							uni.navigateBack({
								delta: 1
							});
						} else {
							uni.showToast({
								title: res.data.msg,
								icon: 'none',
								duration: 2000
							});
						}
				
					}
				});
			}
		}
	}
</script>

<style>
	page {
		width: calc(100% - 132rpx);
		display: flex;
		flex-direction: column;
		padding: 66rpx;
		font-family: PingFang-SC-Heavy;
	}

	.hello {
		font-size: 40rpx;
		font-weight: 800;
		color: #000;
		margin-top: 15rpx;
	}

	.hello2 {
		font-size: 28rpx;
		font-weight: 800;
		color: #707070;
	}

	.edit-box {
		width: 100%;
		height: 100rpx;
		display: flex;
		align-items: center;
	}

	.edit-box input {
		height: 80rpx;
		line-height: 80rpx;
		font-size: ;
		flex: 1;
		font-size: 40rpx;
		font-weight: bold;
	}

	input::-webkit-input-placeholder {
		color: #DAE0E6;
	}

	input:-moz-placeholder {
		color: #DAE0E6;
	}

	input::-moz-placeholder {
		color: #DAE0E6;
	}

	input:-ms-input-placeholder {
		color: #DAE0E6;
	}

	.edit-box image {
		width: 24rpx;
		height: 24rpx;
	}

	.edit-box .get-code {
		font-size: 26rpx;
		font-weight: 800;
		color: #44BD32;
	}

	.line {
		width: 100%;
		height: 2px;
		background: #DAE0E6;
	}

	.btn-into {
		width: 100%;
		height: 88rpx;
		line-height: 88rpx;
		text-align: center;
		font-size: 36rpx;
		color: #fff;
		background: #44BD32;
		border-radius: 44px;
	}

	.desc {
		margin-top: 20rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 22rpx;
		font-weight: 800;
		color: #999999;
	}

	.desc .protocol {
		color: #44BD32;
		text-decoration: underline;
	}

	.logins {
		position: fixed;
		width: 100%;
		left: 0;
		bottom: 80rpx;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.logins image {
		width: 88rpx;
		height: 88rpx;
		margin-left: 30rpx;
		margin-right: 30rpx;
	}
</style>
