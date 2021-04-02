<template>
	<view style="background: #f4f4f4; height: 100%;">
		<!-- <view class="row">
      <view class="row-wrap">
        <image src="/static/zulin/profile/wx.png" class="row-img" />
        <view class="content-wrap">
          <view>
            <text style="font-size: 30rpx; color: #222; font-weight: bold;">微信客服</text>
            <text>（每天9:00 - 21:00）</text>
          </view>
          <view>{{wechatNum}}</view>
        </view>
      </view>
    </view> -->
		<view class="row">
			<view class="row-wrap" @click="callPhone">
				<image src="/static/zulin/profile/phone.png" class="row-img" />
				<view class="content-wrap">
					<view>
						<text style="font-size: 30rpx; color: #222; font-weight: bold;">电话客服</text>
						<text>（每天9:00 - 21:00）</text>
					</view>
					<view>{{phoneNum}}</view>
				</view>
			</view>
		</view>
		<view class="row">
			<view class="row-wrap" @click="wxService">
				<image src="/static/zulin/profile/wx.png" class="row-img" />
				<view class="content-wrap">
					<view>
						<text style="font-size: 30rpx; color: #222; font-weight: bold;">微信客服</text>
						<text>（每天9:00 - 21:00）</text>
					</view>
					<view>点击查看</view>
				</view>
			</view>
		</view>
	</view>
</template>
<script>
	import Config from '@/common/js/Config.js'
	export default {
		name: 'Service',
		data() {
			return {
				wechatNum: '13560038043',
				phoneNum: '***********',
				contactQrCode: ''
			}
		},
		onLoad() {
			this.getContact()
			this.getContactQrCode()
		},
		methods: {
			getContact() {
				let self = this
				self.$Phttp.post(Config.JAVA_SAAS_URLS.getContact, {}).then(res => {
					res = res.data
					if (res.code === 0) {
						this.phoneNum = res.msg
					}
				})
			},
			getContactQrCode() {
				let self = this
				self.$Phttp.get(Config.JAVA_SAAS_URLS.getContactQrCode, {}).then(res => {
					res = res.data
					if (res.code === 0) {
						this.contactQrCode = res.other.img_root + res.data
					}
				})
			},
			wxService() {
				uni.setStorageSync("dialogData", {
				  title: '联系我们',
				  pic: this.contactQrCode,
				  buttonType: 'single',
						showClose: true,
						page: 'savePic'
				})
				uni.navigateTo({
				  url: '/pkChaoYueZu/dialog/popup'
				})
			},
			callPhone() {
				uni.setStorageSync("dialogData", {
					title: '联系我们',
					desc: this.phoneNum,
					page: 'call'
				})
				uni.navigateTo({
					url: '/pkChaoYueZu/dialog/popup'
				})
			}
		}
	}
</script>
<style lang="scss" scoped>
	.row {
		padding: 30rpx;
		background: #fff;

		.row-wrap {
			display: flex;
			flex-direction: row;

			.row-img {
				width: 88rpx;
				height: 88rpx;
			}

			.content-wrap {
				flex: 1;
				margin-left: 24rpx;
				display: flex;
				flex-direction: column;
			}
		}
	}
</style>
