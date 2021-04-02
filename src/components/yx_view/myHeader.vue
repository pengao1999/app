<template>
	<view class="MyHeader-page" :style="'height:'+height+'px;'+myData.style">
		<view class="head" :style="'margin-top:'+statusBarHeight+'px;'">
			<view class="title-con" :style="myData.titleConStyle">
				<view class="MyHeader-title">{{myData.title}}</view>
			</view>
			<image @tap="closeLogin" v-if="myData.showClose" class="header-close" src="../../static/login_close.png"></image>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				statusBarHeight: 44,
				height: 88,
				myData: {
					style: 'background-color:#FFFFFF;', // 头部样式
					showClose: true,// 返回样式
					title: '验证码登录'
				}
			}
		},
		props: {
			propData: {
				type: Object,
				default() {
					return {}
				}
			}
		},
		watch: {
			systemInfo: {
				handler() {
					if (this.systemInfo !== undefined) {
						this.statusBarHeight = this.systemInfo.statusBarHeight
					}
				},
				immediate: true
			},
			propData: {
				handler() {
					this.myData = Object.assign({}, this.myData, this.propData)
					this.height = this.propData.height
				},
				immediate: true
			}
		},
		computed: {
			systemInfo() {
				return this.$store.state.systemInfo
			},
		},
		methods: {
			closeLogin: function() {
				this.$emit('closeLogin')
			}
		}
	}
</script>

<style>
	.MyHeader-page {
        width: 100%;
        display: flex;
        height: 77upx;
        position: fixed;
        top: 0px;
        z-index: 666;
	}
	.head {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.title-con {
		flex-grow: 1;
		display: flex;
		overflow: hidden;
		text-overflow: ellipsis;
		whitewhite-space: nowrap;
		align-items: center;
		justify-content: center;
		margin-left: 60upx;
	}
	.title {
		font-size: 36upx;
		font-weight: bold;
	}
	.header-close {
		height: 30upx;
		width: 30upx;
		margin-right: 30upx;
	}
</style>
