<template>
	<view style="background: #f4f4f4; height: 100%;">
		<view class="top coloum-container align-center">
			<block v-if="!userInfo.user_key">
				<image class="head" src="/static/ic_default_head.png" @click="toLogin()" />
				<div class="mrg-top-20 text-white" @click="toLogin()">注册/登录</div>
			</block>
			<block v-else>
				<image class="mrg-top-20 head" :src="userInfo.avatarUrl" v-if="userInfo.avatarUrl" @click="toSettingReal()" />
				<image class="mrg-top-20 head" v-else src="/static/ic_default_head.png" @click="toSettingReal()" />
				<div class="mrg-top-10 text-white" @click="toSettingReal()">{{userInfo.nickName?userInfo.nickName: '尊贵会员'}}</div>
			</block>
			<!--      <view class="info">-->
			<!--        <text class="name" style="margin-top: 20upx;" v-if="isRegister">您好,</text>-->
			<!--        <text class="name" style="margin-top: 20upx;" v-else>游客</text>-->
			<!--        <text class="name" style="margin-top: 5upx;" v-if="isRegister">尊敬的会员</text>-->
			<!--        <text class="name" style="margin-top: 5upx;" v-else>当前未登录</text>-->
			<!--        <text class="logout" @click="logout" v-if="isRegister">退出</text>-->
			<!--        <text class="logout" @click="login" v-else>登录</text>-->
			<!--      </view>-->
		</view>

		<view class="order-box">
			<view class="all-order" @tap="toList('')">
				我的订单
				<image src="/static/ic_arrow_right.png" :lazy-load="true" class="arrow" />
				<text>更多</text>
			</view>
			<view class="items">
				<view class="item" @tap="toList('')">
					<view class="order-tag" v-if="allOrderCount>0">{{allOrderCount}}</view>
					<image src="/static/zulin/profile/all.png" :lazy-load="true" />
					<text style="font-size: 30rpx;">全部</text>
				</view>
				<!-- <view class="item" @tap="toList(1)">
          <image src="/static/zulin/profile/rent.png" :lazy-load="true" />
          <text>租赁中</text>
        </view>-->
				<view class="item" @tap="toList('paySuccess')">
					<view class="order-tag" v-if="paySuccessOrderCount>0">{{paySuccessOrderCount}}</view>
					<image src="/static/zulin/profile/rent.png" :lazy-load="true" />
					<text style="font-size: 30rpx;">待配送</text>
				</view>
				<view class="item" @tap="toList('sending')">
					<view class="order-tag" v-if="sendingOrderCount>0">{{sendingOrderCount}}</view>
					<image src="/static/zulin/profile/delivery.png" :lazy-load="true" />
					<text style="font-size: 30rpx;">配送中</text>
				</view>
				<view class="item" @tap="toList('completed')">
					<view class="order-tag" v-if="completedOrderCount>0">{{completedOrderCount}}</view>
					<image src="/static/zulin/profile/complete.png" :lazy-load="true" />
					<text style="font-size: 30rpx;">已完成</text>
				</view>
			</view>
		</view>

		<view class="service-box">
			<view class="service-head">我的服务</view>
			<view class="service-wrap">
				<view class="block" @click="toAddress">
					<image src="/static/zulin/profile/address.png" class="service-img" />
					<view class="service-text">我的地址</view>
				</view>
				<view class="block" @click="toMyBill">
					<image src="/static/zulin/profile/bill.png" class="service-img" />
					<view class="service-text">我的账单</view>
				</view>
				<view class="block" @click="toLeaderIndex">
					<image src="/static/zulin/profile/manager.png" class="service-img" />
					<view class="service-text">经纪人</view>
				</view>
				<view class="block" @click="toShare">
					<image src="/static/zulin/profile/share.png" class="service-img" />
					<view class="service-text">分享给好友</view>
				</view>
				<view class="block" @click="toMyLike">
					<image src="/static/zulin/profile/like.png" class="service-img" />
					<view class="service-text">我的收藏</view>
				</view>
				<view class="block" @click="toAbout">
					<image src="/static/zulin/profile/about.png" class="service-img" />
					<view class="service-text">关于我们</view>
				</view>
				<view class="block" @click="toFedback">
					<image src="/static/zulin/profile/fedback.png" class="service-img" />
					<view class="service-text">意见反馈</view>
				</view>
				<view class="block" @click="toSetting">
					<image src="/static/zulin/profile/setting2.png" class="service-img" />
					<view class="service-text">设置</view>
				</view>
			</view>
		</view>

		<!-- <view class="nav-box">
      <nav-list :propData="navlist" @navClick="navClick"></nav-list>
    </view>-->

		<!-- <view class="columns bg-white">
      <view class="column mrg-top-20" @tap="toList">
        <view class="left">
          <image src="/static/zulin/profile/item1.png" :lazy-load="true" />
          <text>我的订单</text>
        </view>
        <image class="arrow" src="/static/ic_arrow_right.png" :lazy-load="true" />
      </view>
      <view class="column" @tap="toRentInfo">
        <view class="left">
          <image src="/static/zulin/profile/pay.png" :lazy-load="true" />
          <text>我的还款</text>
        </view>
        <image class="arrow" src="/static/ic_arrow_right.png" :lazy-load="true" />
      </view>
      <view class="column" @tap="toRentInfo">
        <view class="left">
          <image src="/static/zulin/profile/item5.png" :lazy-load="true" />
          <text>个人信息</text>
        </view>
        <image class="arrow" src="/static/ic_arrow_right.png" :lazy-load="true" />
      </view>
      <view class="column" @tap="toRentInfo">
        <view class="left">
          <image src="/static/zulin/profile/jinji.png" :lazy-load="true" />
          <text>经纪人</text>
        </view>
        <image class="arrow" src="/static/ic_arrow_right.png" :lazy-load="true" />
      </view>
      <view class="column" @tap="contact">
        <view class="left">
          <image src="/static/zulin/profile/kefu.png" :lazy-load="true" />
          <text>客服中心</text>
        </view>
        <image class="arrow" src="/static/ic_arrow_right.png" :lazy-load="true" />
      </view>
      <view class="column" @tap="toRentInfo">
        <view class="left">
          <image src="/static/zulin/profile/us.png" :lazy-load="true" />
          <text>关于我们</text>
        </view>
        <image class="arrow" src="/static/ic_arrow_right.png" :lazy-load="true" />
      </view>
      <view class="column" @tap="toSetting">
        <view class="left">
          <image src="/static/zulin/profile/setting.png" :lazy-load="true" />
          <text>设置</text>
        </view>
        <image class="arrow" src="/static/ic_arrow_right.png" :lazy-load="true" />
      </view>
    </view>-->

		<myDialog confirmColor="var(--blue)" :title="dialogTitle1" :content="dialogContent1" :dialog-show="showDialog1"
		 @cancelButton="showDialog1=false" @confirmButton="showDialog1=false"></myDialog>
		<myDialog confirmColor="var(--blue)" :title="dialogTitle" :content="dialogContent" :dialog-show="showDialog"
		 @cancelButton="showDialog=false" @confirmButton="confirmAuth"></myDialog>
	</view>
</template>

<script>
	import Config from '../../common/js/Config.js'
	import Toast from '../../common/js/toast.js'
	import Util from '../../common/js/util.js'
	import navList from '../../components/yx_view/navList.vue'
	import myShareDialog from './myShareDialog.js'
	import {
		mapMutations
	} from 'vuex'
	import Auth from '../auth'
	export default {
		components: {
			navList
		},
		data() {
			return {
				order_count: [],
				info: {},
				image_root: '',
				unPayOrderCount: 0,
				paySuccessOrderCount: 0,
				sendingOrderCount: 0,
				completedOrderCount: 0,
				allOrderCount: 0,
				navlist: [{
						image: "/static/coupons.png",
						title: "优惠券",
						tap: 'coupons'
					},
					{
						image: "/static/service.png",
						title: "联系客服"
					},
					{
						tap: 'friend',
						image: "/static/friends.png",
						title: "邀请好友"
					},
					{
						tap: 'service',
						image: "/static/public_account.png",
						title: "服务号"
					}
				],
				dialogTitle1: '',
				dialogContent1: '',
				showDialog1: false,
				contactPhone: ''
			}
		},
		onLoad() {
			this.getContact()
			// this.getUserInfo()
		},
		onShow() {
			let self = this
			let data = {
				page: 1,
				limit: 100,
				state: '',
				user_key: self.userInfo.user_key
			}
			console.log(JSON.stringify(self.userInfo))
			self.$Phttp.post(Config.JAVA_SAAS_URLS.getOrders, data).then((res) => {
				res = res.data
				if (res.code === 0) {
					const list = res.data
					console.log(list)
					let unPay = 0,
						paySuccess = 0,
						sending = 0,
						completed = 0,
						cancel = 0,
						all = 0
					list.forEach((item) => {
						switch (item.state) {
							case 'unPay':
								unPay += 1;
								break;
							case 'paySuccess':
								paySuccess += 1;
								break;
							case 'sending':
								sending += 1;
								break;
							case 'completed':
							case 'arrive':
								completed += 1;
								break;
							case 'cancel':
								cancel += 1;
								break;
						}
						all += 1
					})
					self.unPayOrderCount = unPay
					self.paySuccessOrderCount = paySuccess
					self.sendingOrderCount = sending
					self.completedOrderCount = completed
					self.allOrderCount = all
				}
			})
		},
		mixins: [Toast, Auth, myShareDialog],
		computed: {
			userInfo() {
				return this.$store.state.userInfo
			},
			point_token() {
				return this.$store.state.point_token
			}
		},
		methods: {
			...mapMutations(['logout', 'setUserInfo', 'setLoginWx', 'setCouldModifyGroup', 'setPointToken', 'setRegisterState']),
			getContact() {
				let self = this
				self.$Phttp.post(Config.JAVA_SAAS_URLS.getContact, {}).then(res => {
					res = res.data
					if (res.code === 0) {
						self.contactPhone = res.msg
					}
				})
			},
			toLogin() {
				uni.navigateTo({
					url: '/pkChaoYueZu/info/appLogin'
				})
			},
			getUserInfo: function() {
				let self = this
				self.$Phttp.post(Config.JAVA_SAAS_URLS.getUserInfo, {}).then(res => {
					console.log(res)
					res = res.data
					if (res.code === 0) {
						self.setUserInfo(res.data)
					}
				})
			},
			toList: function(status) {
				// if (this.point_token) {
				//  uni.navigateTo({
				//    url: '/pkChaoYueZu/order/list?status='+status
				//  })
				//  return
				// } else {
				//  uni.navigateTo({
				//    url: '/pkChaoYueZu/profile/login'
				//  })
				//  return
				// }
				if (!this.hasRegister()) return
				if (!this.hasBindTel()) return
				uni.navigateTo({
					url: '/pkChaoYueZu/order/list?status=' + status
				})
			},
			login() {
				uni.navigateTo({
					url: '/pkChaoYueZu/info/phone'
				})
				return
			},
			navClick() {},
			toProtocol() {
				if (!this.hasRegister()) return
				if (!this.hasBindTel()) return
				// let self = this
				// uni.navigateTo({
				//   url: '/pkUserInfo/info/protocol'
				// })
			},
			toBank() {
				uni.navigateTo({
					url: '/pkChaoYueZu/verify/verify'
				})
			},
			toPostsale() {
				let self = this
				if (!this.hasRegister()) return
				if (!this.hasBindTel()) return
				return
				uni.navigateTo({
					url: '/pkPostsale/postsale/postsale'
				})
			},
			toLeaderIndex() {
				if (!this.hasRegister()) return
				if (!this.hasBindTel()) return
				uni.navigateTo({
					url: '/pkChaoYueZu/profile/children/leaderIndex'
				})
			},
			toPersonalInfo() {
				if (!this.hasRegister()) return
				if (!this.hasBindTel()) return
				this.dialogTitle1 = '提示'
				this.dialogContent1 = '暂无相关信息～'
				this.showDialog1 = true
			},
			toRentInfo() {
				if (!this.hasRegister()) return
				if (!this.hasBindTel()) return
				this.dialogTitle1 = '提示'
				this.dialogContent1 = '暂无相关信息～'
				this.showDialog1 = true
			},
			contact() {
				uni.setStorageSync("dialogData", {
					title: '联系我们',
					desc: this.contactPhone,
					page: 'call'
				})
				uni.navigateTo({
					url: '/pkChaoYueZu/dialog/popup'
				})
			},
			// toSetting() {
			//   let self = this
			//   if (!self.hasRegister()) return
			//   uni.navigateTo({
			//     url: '/pkChaoYueZu/info/setting'
			//   })
			// },
			toSettingReal() {
				let self = this
				if (!self.hasRegister()) return
				if (!this.hasBindTel()) return
				uni.navigateTo({
					url: '/pkChaoYueZu/info/setting'
				})
			},
			toAddress() {
				if (!this.hasRegister()) return
				if (!this.hasBindTel()) return
				uni.navigateTo({
					url: '/pkChaoYueZu/order/address'
				})
			},
			toAbout() {
				uni.navigateTo({
					url: '/pkChaoYueZu/profile/children/aboutUs'
				})
			},
			toFedback() {
				if (!this.hasRegister()) return
				if (!this.hasBindTel()) return
				uni.navigateTo({
					url: '/pkChaoYueZu/profile/children/fedback'
				})
			},
			toSetting() {
				if (!this.hasRegister()) return
				if (!this.hasBindTel()) return
				uni.navigateTo({
					url: '/pkChaoYueZu/info/setting'
				})
			},
			toMyBill() {
				if (!this.hasRegister()) return
				if (!this.hasBindTel()) return
				uni.navigateTo({
					url: '/pkChaoYueZu/verify/web?pack=repayment&key=index'
				})
			},
			toMyLike() {
				// this.dialogTitle1 = '提示'
				// this.dialogContent1 = '暂无相关信息～'
				// this.showDialog1 = true
				uni.navigateTo({
					url: '/pkChaoYueZu/profile/children/myLike'
				})
			},
			toShare() {
				// const url = 'http://fintech.test.appkubes.com/#/pages/register/index?invitorKey=' + this.userInfo.user_key,
				const url = Config.FINTECH_SERVER + '/#/pages/register/index?invitorKey=' + this.userInfo.user_key,
					title = '超悦租',
					summary = '选超悦租，比买更实在。租的优惠，一步到位',
					imageUrl = Config.BASE_IMAGE_SERVER + 'attachment/images/avatars/logo.png';
				this.clickShare()
				this.setShareMessage(url, title, summary, imageUrl)
			}
		},
		onHide() {
			console.log('onHide')
		},
		onNavigationBarButtonTap(e) {
			this.toSetting()
		}
	}
</script>

<style>
	page {
		display: flex;
		background: white;
		flex-direction: column;
	}

	.top-bg-img {
		width: 100%;
		height: 60rpx;
		background-attachment: fixed;
		background-repeat: no-repeat;
		background-size: cover;
		background-image: url(../../static/top_bg.png);
	}

	.top {
		width: 100%;
		height: 320rpx;
		/* background: var(--red); */
		background: linear-gradient(270deg,
			rgba(255, 131, 18, 1) 0%,
			rgba(251, 38, 34, 1) 100%);
		display: flex;
		padding-top: 130rpx;
	}

	.top .head {
		width: 140rpx;
		height: 140rpx;
		border-radius: 50%;
	}

	.top .info {
		width: calc(100% - 210rpx);
		margin-left: 30rpx;
		display: flex;
		flex-direction: column;
	}

	.top .info .name {
		font-size: 30rpx;
		line-height: 50rpx;
		font-weight: bold;
		margin-top: 50rpx;
		color: #fff;
	}

	.top .info .community {
		font-size: 28rpx;
		line-height: 36rpx;
		color: #fff;
	}

	.top .info .address {
		font-size: 24rpx;
		line-height: 36rpx;
		color: #fff;
	}

	.top .info .address image {
		width: 26rpx;
		height: 26rpx;
		margin-left: 10rpx;
		margin-bottom: -4rpx;
	}

	.order-box {
		height: 222rpx;
		margin: -40rpx 30rpx 0 30rpx;
		background: #fff;
		border-radius: 20rpx;
		display: flex;
		flex-direction: column;
		box-shadow: 0px 10px 20px 0px rgba(0, 0, 0, 0.02);
		z-index: 1000;
	}

	.order-box .all-order {
		width: calc(100% - 40rpx);
		height: 90rpx;
		line-height: 90rpx;
		padding-left: 20rpx;
		padding-right: 20rpx;
		font-size: 32rpx;
		color: #333;
		font-weight: bold;
		border-bottom: solid 1rpx #eee;
		background: #fff;
		border-top-left-radius: 20rpx;
		border-top-right-radius: 20rpx;
	}

	.order-box .all-order text {
		font-size: 28rpx;
		color: #999;
		float: right;
		font-weight: 400;
		margin-right: 20rpx;
	}

	.order-box .all-order .arrow {
		width: 22rpx;
		height: 22rpx;
		margin-top: 34rpx;
		float: right;
	}

	.order-box .items {
		width: 100%;
		height: 150rpx;
		display: inline-flex;
		background: #fff;
		border-bottom-left-radius: 20rpx;
		border-bottom-right-radius: 20rpx;
		justify-content: space-around;
	}

	.order-box .items .item {
		width: 25%;
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		position: relative;
		font-size: 30rpx;
	}

	.number-badge {
		position: absolute;
		right: 32rpx;
		top: 12rpx;
		background: #f37b1d;
		height: 32rpx;
		line-height: 32rpx;
		width: 32rpx;
		text-align: center;
		border-radius: 16rpx;
		color: white;
	}

	.order-box .items .item image {
		width: 50rpx;
		height: 50rpx;
		margin-top: 20rpx;
	}

	.order-box .items .item text {
		font-size: 20rpx;
		color: #333;
		font-weight: 500;
	}

	.order-box .items .item .tag {
		width: 30upx;
		height: 30upx;
		line-height: 30upx;
		text-align: center;
		background: #e84118;
		border-radius: 15upx;
		color: #fff;
		position: absolute;
		font-size: 20upx;
		margin-left: 25upx;
		margin-top: 15upx;
	}

	.nav-box {
		width: calc(100% - 60rpx);
		margin-top: 20upx;
		margin-left: 30rpx;
		margin-right: 30rpx;
		background: #fff;
		border-radius: 20rpx;
		display: flex;
		flex-direction: column;
		box-shadow: 0px 10px 20px 0px rgba(0, 0, 0, 0.02);
		z-index: 1000;
	}

	.columns {
		padding: 0 47upx;
		margin-top: 40upx;
		display: flex;
		-webkit-border-radius: 20upx;
		-moz-border-radius: 20upx;
		border-radius: 20upx;
		margin-top: -20upx;
		flex-direction: column;
	}

	.column {
		width: 100%;
		height: 120rpx;
		line-height: 120rpx;
		display: inline-flex;
		align-items: center;
		justify-content: space-between;
		border-bottom: solid 1rpx #f4f4f4;
	}

	.column .left {
		display: flex;
		align-items: center;
	}

	.column .left image {
		width: 44rpx;
		height: 44rpx;
	}

	.column .left text {
		font-size: 28rpx;
		color: #333;
		font-weight: 500;
		margin-left: 20rpx;
	}

	.column .arrow {
		width: 22rpx;
		height: 22rpx;
	}

	.delivery-code {
		width: 100%;
		display: inline-flex;
		padding-top: 60rpx;
		background: white;
	}

	.delivery-code .code {
		width: 200rpx;
		height: 200rpx;
		margin-left: 80rpx;
		margin-right: 40rpx;
	}

	.delivery-code .code image {
		width: calc(100% - 10rpx);
		height: calc(100% - 10rpx);
		padding: 5rpx;
	}

	.delivery-code .code canvas {
		background: #fff;
		width: 100%;
		height: 100%;
	}

	.delivery-code .info {
		width: calc(100% - 320rpx);
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.delivery-code .info .take-text {
		font-size: 30rpx;
		color: #e84118;
		margin-top: 20rpx;
	}

	.delivery-code .info .take-code {
		font-size: 22rpx;
		color: #999;
		margin-top: 10rpx;
	}

	.delivery-code .info .get-code {
		width: 180rpx;
		height: 50rpx;
		line-height: 50rpx;
		text-align: center;
		border-radius: 30rpx;
		font-size: 22rpx;
		color: #e84118;
		border: solid 1rpx #e84118;
		margin-top: 10rpx;
	}

	.columns button {
		/* position:unset; */
		display: unset;
		padding-left: unset;
		padding-right: unset;
		box-sizing: unset;
		font-size: unset;
		text-align: center;
		text-decoration: unset;
		line-height: unset;
		border-radius: unset;
		-webkit-tap-highlight-color: unset;
		overflow: unset;
		color: unset;
		background-color: unset;
	}

	switch {
		zoom: 0.7;
	}

	button::after {
		border: none;
	}

	.mask {
		width: 100%;
		height: 100%;
		position: fixed;
		top: 0;
		left: 0;
		background: #000;
		opacity: 0.2;
		overflow: hidden;
		z-index: 99998;
		color: #fff;
	}

	.code-dialog {
		width: calc(100% - 160rpx);
		height: 620rpx;
		left: 80rpx;
		top: calc(50% - 270rpx);
		background: #fff;
		border-radius: 20rpx;
		position: fixed;
		z-index: 99999;
	}

	.dialog-title {
		width: 100%;
		height: 100rpx;
		line-height: 100rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.dialog-title .space {
		width: 40rpx;
		height: 40rpx;
	}

	.dialog-title text {
		font-size: 30rpx;
		font-weight: bold;
		color: #333;
	}

	.dialog-title .close {
		width: 40rpx;
		height: 40rpx;
		margin-right: 20rpx;
		margin-top: -15rpx;
	}

	.code-dialog .code {
		width: 360rpx;
		height: 360rpx;
		margin-left: calc(50% - 180rpx);
	}

	.code-dialog .desc {
		width: 100%;
		height: 80rpx;
		line-height: 29rpx;
		text-align: center;
		font-size: 30rpx;
		color: #e84118;
		margin-top: 20rpx;
	}

	.isMaskPhone {
		width: 100%;
		height: 100%;
		position: fixed;
		top: 0;
		left: 0;
		z-index: 1000;
		background: #000;
		opacity: 0.5;
	}

	#isPhone {
		position: fixed;
		width: 480rpx;
		height: 250rpx;
		background: #fff;
		top: 50%;
		left: 50%;
		margin-left: -265rpx;
		margin-top: -185rpx;
		z-index: 1001;
		padding: 50rpx 50rpx;
		border-radius: 12rpx;
	}

	.isLoginBtn {
		display: flex;
		justify-content: space-around;
	}

	.isLoginBtn button,
	.isLoginBtn navigator {
		background: #fff;
		height: 68rpx;
		line-height: 68rpx;
		font-size: 28rpx;
		width: 260rpx;
		text-align: center;
		color: #4bad37;
		border: 1rpx solid #eee;
		border-radius: 12rpx;
	}

	.isLoginBtn navigator {
		margin-right: 20rpx;
		background: #f2f2f2;
		color: #999;
	}

	.loginTitle {
		font-size: 34rpx;
	}

	.shopImg {
		height: 80rpx;
		display: flex;
		align-items: center;
		padding: 20rpx 0rpx;
		justify-content: center;
		font-size: 28rpx;
	}

	.shopImg>image {
		margin: 0 14rpx 0 0;
		width: 68rpx;
		height: 68rpx;
		border-radius: 50%;
	}

	.ad-box {
		width: 100%;
		height: 120rpx;
		margin-top: 40rpx;
	}

	.ad-box .ad {
		width: 100%;
		height: 100%;
	}

	._qrCode {
		display: flex;
		align-content: center;
		justify-content: center;
	}

	.version-container {
		width: 100%;
		height: 100upx;
		line-height: 100upx;
		text-align: center;
		color: #999;
	}

	.logout {
		position: absolute;
		right: 40rpx;
		top: 80rpx;
		width: 132rpx;
		background: white;
		text-align: center;
		height: 60rpx;
		line-height: 60rpx;
		border-radius: 30rpx;
	}

	.service-box {
		background: #fff;
		border-radius: 20rpx;
		margin: 50rpx 30rpx;
	}

	.service-box .service-head {
		font-size: 30rpx;
		color: #222;
		margin-left: 30rpx;
		font-weight: bold;
		height: 88rpx;
		line-height: 88rpx;
	}

	.service-box .service-wrap {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: space-between;
	}

	.service-box .service-wrap .block {
		width: 160rpx;
		height: 140rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.service-box .service-wrap .block .service-img {
		width: 56rpx;
		height: 56rpx;
		margin-bottom: 20rpx;
	}

	.service-box .service-wrap .block .service-text {
		font-size: 28rpx;
		color: #666;
	}

	.order-tag {
		position: absolute;
		z-index: 1;
		right: 30rpx;
		top: 6rpx;
		border: 1rpx solid #fd501b;
		height: 36rpx;
		width: 36rpx;
		text-align: center;
		line-height: 40rpx;
		border-radius: 20rpx;
		color: #fd501b;
		font-size: 24rpx;
	}
</style>
