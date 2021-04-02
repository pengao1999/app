<template>
	<view style="background: #fff; height: 100%;">
		<view class="top coloum-container">
			<view class="state-top"></view>
			<view class="headview">
				<block v-if="!userInfo.user_key">
					<image class="head" src="/static/ic_default_head.png" @click="toLogin()" />
					<div class="namediv text-white" @click="toLogin()">注册/登录</div>
				</block>
				<block v-else>
					<image class="head" :src="userInfo.avatarUrl" v-if="userInfo.avatarUrl" @click="toSettingReal()" />
					<image class="head" v-else src="/static/ic_default_head.png" @click="toSettingReal()" />
					<div class="namediv text-white" @click="toSettingReal()">{{userInfo.nickName?userInfo.nickName: '尊贵会员'}}</div>
				</block>
			</view>
			<view class="headBar" v-if="false">
				<div class="title">校园大使</div>
				<!-- <div class="title">营销大赛</div> -->
				<div class="desc">成为校园大使,分享免租金,推广赚佣金</div><br />
				<!-- <div class="desc">成为悦租杯创客营销大赛的参赛者</div><br /> -->
				<view class="join-btn" @click="toProtocolPage">
					<image class="btn-img" src="/static/chaoyuezu/profile/join.png" />
				</view>
			</view>
			<!-- <view class="topBtn">
				<image class="row-image" src="/static/chaoyuezu/profile/icon_sign.png" />
				<image class="row-image" src="/static/chaoyuezu/profile/icon_notice.png" />
			</view> -->
		</view>
		<view class="flexMsg" v-if="false">
			<view class="list-row" @click.stop="godiscountcoupon">
				<image class="row-image" src="/static/chaoyuezu/profile/bg1.png" />
				<div class="row-title">优惠券</div>
				<div class="row-value"><span class="row-num">3</span>张</div>
			</view>
			<view class="list-row">
				<image class="row-image" src="/static/chaoyuezu/profile/bg2.png" />
				<view class="row-title">悦币</view>
				<view class="row-value"><span class="row-num">3</span>个</view>
			</view>
			<view class="list-row">
				<image class="row-image" src="/static/chaoyuezu/profile/bg3.png" />
				<view class="row-title">钱包余额</view>
				<view class="row-value"><span class="row-num">3</span>元</view>
			</view>
		</view>
		<view class="list-wrap">
			<view class="list-row" @click="toLeader" v-if="false">
				<image class="row-image" src="/static/chaoyuezu/profile/person.png" />
				<view class="row-content">校园大使</view>
				<image src="/static/zulin/verify/icon-right.png" class="nav-icon" />
			</view>
			<view class="list-row" @click="toBillList">
				<image class="row-image" src="/static/chaoyuezu/profile/personMessage.png" />
				<view class="row-content">我的账单</view>
				<image src="/static/zulin/verify/icon-right.png" class="nav-icon" />
			</view>
			<!-- <view class="list-row" @click="toShare">
				<image class="row-image" src="/static/chaoyuezu/profile/share.png" />
				<view class="row-content">分享给好友</view>
				<image src="/static/zulin/verify/icon-right.png" class="nav-icon" />
			</view> -->
			<!-- <view class="list-row" @click="toAddress">
				<image class="row-image" src="/static/chaoyuezu/profile/personMessage.png" />
				<view class="row-content">我的地址</view>
				<image src="/static/zulin/verify/icon-right.png" class="nav-icon" />
			</view> -->
			<view class="list-row" @click="toMyLike">
				<image class="row-image" src="/static/chaoyuezu/profile/star.png" />
				<view class="row-content">我的收藏</view>
				<image src="/static/zulin/verify/icon-right.png" class="nav-icon" />
			</view>
			<!-- <view class="list-row" @click="toService">
				<image class="row-image" src="/static/chaoyuezu/profile/earing.png" />
				<view class="row-content">客服小悦</view>
				<image src="/static/zulin/verify/icon-right.png" class="nav-icon" />
			</view> -->
			<!-- <view class="list-row" @click="toAbout">
				<image class="row-image" src="/static/chaoyuezu/profile/flag.png" />
				<view class="row-content">关于我们</view>
				<image src="/static/zulin/verify/icon-right.png" class="nav-icon" />
			</view> -->
			<!-- <view class="list-row">
				<image class="row-image" src="/static/chaoyuezu/profile/message.png" />
				<view class="row-content">我的评价</view>
				<image src="/static/zulin/verify/icon-right.png" class="nav-icon" />
			</view> -->
			<view class="list-row" @click="toFedback">
				<image class="row-image" src="/static/chaoyuezu/profile/booking.png" />
				<view class="row-content">意见反馈</view>
				<image src="/static/zulin/verify/icon-right.png" class="nav-icon" />
			</view>
			<view class="list-row" @click="toSetting">
				<image class="row-image" src="/static/chaoyuezu/profile/setting.png" />
				<view class="row-content">设置</view>
				<image src="/static/zulin/verify/icon-right.png" class="nav-icon" />
			</view>
			<!-- <view class="list-row" @click="test">
				<image class="row-image" src="/static/chaoyuezu/profile/money.png" />
				<view class="row-content">兼职</view>
				<image src="/static/zulin/verify/icon-right.png" class="nav-icon" />
			</view> -->
		</view>
	</view>
</template>

<script>
	import Config from '../../common/js/Config.js'
	import Toast from '../../common/js/toast.js'
	import Util from '../../common/js/util.js'
	import myShareDialog from './myShareDialog.js'
	import {
		mapMutations
	} from 'vuex'
	import Auth from '../auth'
	export default {
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
				dialogTitle1: '',
				dialogContent1: '',
				showDialog1: false,
				contactPhone: ''
			}
		},
		onLoad() {
			// this.getContact()
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
			toLogin() {
				uni.navigateTo({
					url: '/pkChaoYueZu/info/appLogin'
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
			toBillList() {
				if (!this.hasRegister()) return
				if (!this.hasBindTel()) return
				uni.navigateTo({
					// url: '/pkChaoYueZu/verify/web?pack=repayment&key=billList&title=我的账单'
					url: '/pkChaoYueZu/repayment/billList'
				})
			},
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
			toLeader() {
				if (!this.hasRegister()) return
				if (!this.hasBindTel()) return
				uni.navigateTo({
					url: '/pkChaoYueZu/sale/index'
				})
			},
			toIntr() {
				uni.navigateTo({
					url: '/pkChaoYueZu/index/saledetail?key=' + '2eb1a1914f376c1de1d3e5654e25c2cd'
				})
				// uni.navigateTo({
				// 	url: '/pkUserInfo/info/protocolDetails?id=e246aef2ca224b3b81530b43147165a4&title=校园大使&isshow=true'
				// })
			},
			godiscountcoupon() {
				if (!this.hasRegister()) return
				if (!this.hasBindTel()) return
				uni.navigateTo({
					url: '/pkChaoYueZu/profile/children/discountcoupon'
				})
			},
			toShare() {
				// const url = 'http://fintech.test.appkubes.com/#/pages/register/index?invitorKey=' + this.userInfo.user_key;
				const url = Config.FINTECH_SERVER + '/#/pages/register/index?invitorKey=' + this.userInfo.user_key,
					title = '超悦租',
					summary = '选超悦租，比买更实在。租的优惠，一步到位',
					imageUrl = Config.BASE_IMAGE_SERVER + 'attachment/images/avatars/logo.png'
				this.clickShare()
				this.setShareMessage(url, title, summary, imageUrl)
			},
			toService() {
				uni.navigateTo({
					url: '/pkChaoYueZu/profile/children/service'
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
			toProtocolPage() {
				this.toIntr()
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

<style lang="scss" scoped>
	page {
		display: flex;
		background: white;
		flex-direction: column;
	}

	.state-top {
		width: 100%;
		height: var(--status-bar-height);
		box-sizing: border-box;
		padding-top: 44px;
		background: linear-gradient(270deg,
			rgba(108, 181, 248, 1) 0%,
			rgba(50, 156, 254, 1) 100%);
	}

	.top {
		width: 100%;
		height: 310rpx;
		background: linear-gradient(270deg,
			rgba(108, 181, 248, 1) 0%,
			rgba(50, 156, 254, 1) 100%);
		display: flex;
		position: relative;

		.topBtn {
			margin-top: -270rpx;
			margin-left: 556rpx;

			.row-image {
				width: 48rpx;
				height: 48rpx;
				margin-right: 40rpx;
			}
		}

		.headview {
			margin-left: 30rpx;
			display: flex;
			flex-direction: row;
			color: #666;
			// margin-top: 98rpx;
			font-size: 28rpx;

			.head {
				display: block;
				width: 108rpx;
				height: 108rpx;
				border-radius: 50%;
				margin-right: 30rpx;
				margin-left: 10rpx;
				// margin-top: -8rpx;
			}

			.namediv {
				margin-top: 20rpx;
				height: 108rpx;
				display: flex;
				align-items: center;
			}
		}

		.headBar {
			width: 690rpx;
			// height: 112rpx;
			background: linear-gradient(90deg, rgba(255, 224, 97, 1) 0%, rgba(255, 191, 32, 1) 100%);
			border-radius: 8rpx;
			margin-left: 30rpx;
			margin-top: 12rpx;
			position: absolute;
			/* #ifdef APP-PLUS */
			
			/* #endif */
			/* #ifndef APP-PLUS */
			
			/* #endif */
			bottom: 0;
			display: flex;
			align-items: center;
			box-sizing: border-box;
			padding: 20rpx;

			.title {
				width: 118rpx;
				height: 28rpx;
				font-size: 28rpx;
				font-family: MFJianHei_Noncommercial-Regular, MFJianHei_Noncommercial;
				font-weight: 400;
				color: rgba(177, 94, 21, 1);
				line-height: 28rpx;
			}

			.desc {
				flex: 1;
				font-size: 20rpx;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: rgba(195, 103, 21, 1);
				line-height: 26rpx;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
			}

			.join-btn {
				display: flex;
				align-items: center;
				.btn-img {
					width: 152rpx;
					height: 44rpx;
				}
			}
		}
	}

	.flexMsg {
		height: 204rpx;
		display: flex;
		flex-direction: row;
		background: #fff;
		margin-left: 30rpx;
		position: relative;
		z-index: 1000;

		.list-row {
			width: 220rpx;
			border-radius: 8rpx;
			margin-right: 15rpx;
			margin-top: 40rpx;
			font-size: 26rpx;
			font-family: PingFangSC-Medium, PingFang SC;
			color: rgba(34, 34, 34, 1);

			.row-image {
				width: 220rpx;
				height: 136rpx;
			}

			.row-title {
				position: relative;
				margin-left: 18rpx;
				margin-top: -140rpx;
				z-index: 1000;
			}

			.row-value {
				.row-num {
					font-size: 36rpx;
					font-family: PingFangSC-Medium, PingFang SC;
					font-weight: 500;
					color: rgba(22, 119, 255, 1);
					line-height: 50rpx;
				}

				position:relative;
				margin-left: 18rpx;
				margin-top: 20rpx;
				z-index: 1000;
			}
		}
	}

	.list-wrap {
		display: flex;
		flex-direction: column;
		width: 100%;
		background: #fff;

		.list-row {
			margin: 0 24rpx;
			display: flex;
			flex-direction: row;
			height: 140rpx;
			align-items: center;
			border-bottom: 1rpx solid #f4f4f4;
			font-size: 30rpx;
			font-family: PingFangSC-Medium, PingFang SC;
			font-weight: 500;
			color: rgba(34, 34, 34, 1);

			.row-content {
				flex: 1;
				display: flex;
				flex-direction: column;
			}

			.row-image {
				width: 40rpx;
				height: 40rpx;
				margin-right: 40rpx;
				margin-left: 36rpx;
			}

			.nav-icon {
				width: 40rpx;
				height: 40rpx;
			}
		}
	}
</style>
