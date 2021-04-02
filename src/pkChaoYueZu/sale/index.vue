<template>
	<view>
		<view class="top-box">
			<view class="tb-user-face">
				<image :src="userInfo.avatar_url" v-if="userInfo.avatar_url" class="tbuf-img"></image>
				<image :src="faceSrc" v-else class="tbuf-img"></image>
			</view>
			<view class="tb-user-info">
				<view class="tb-user-name">{{userInfo.nick_name?userInfo.nick_name:userInfo.tel}}</view>
				<view class="tb-user-invent">推荐人：{{statis.invite_name?statis.invite_name:'无'}}
				</view>
				<view class="tb-user-perm">
					<view class="tbup-tag">{{statis.role_name}}</view>
				</view>
			</view>
		</view>
		<!-- <view class="list-wrap">
			<view class="list-row" @click="toDividendOrder">
				<image class="row-image" src="/static/chaoyuezu/profile/icon-invent-code.png" />
				<view class="row-content">我的邀请码：2222</view>
			</view>
		</view> -->
		<view class="split10"></view>
		<view class="shareCode" style="width: 100%;padding: 20rpx 25rpx;background-color: #FFFFFF;display: flex;justify-content: space-between;align-items: center;box-sizing: border-box;">
			<view class="">
				专属推荐码: <text style="color: #1677ff;font-weight: bold;">{{inviteCode}}</text>
			</view>
			<view class="" @click.stop="changeCode">
				<view class="" style="padding:0 20rpx;background: linear-gradient(180deg, #52abfc 0%, #0687ff 100%);border-radius: 40rpx;color: #FFFFFF;">
					更改上级
				</view>
			</view>
		</view>
		<view class="split10"></view>
		<view class="list-wrap2">
			<view class="list-row">
				<view class="lf-info">
					<view class="text-num">{{statis.withdrawed_money}}</view>
					<view class="text-title">成功提现佣金（元）</view>
				</view>
			</view>
			<view class="list-row">
				<view class="lf-info">
					<view class="text-num">{{statis.sure_brokerage}}</view>
					<view class="text-title">可提现佣金（元）</view>
				</view>
				<view class="rg-btn" @click="getCash">
					<view class="btn-blue">佣金提现</view>
				</view>
			</view>
		</view>

		<view class="split10"></view>

		<view class="list-grid-4">
			<view class="list-grid-item" @click="toCommission">
				<image class="list-grid-item-img" src="/static/chaoyuezu/profile/icon-deved-01.png"></image>
				<view class="list-grid-box">
					<view class="lgb-num">{{statis.total_brokerage}}</view>
					<view class="lgb-title">分销佣金</view>
				</view>
			</view>
			<view class="list-grid-item" @click="toOrder">
				<image class="list-grid-item-img" src="/static/chaoyuezu/profile/icon-deved-02.png"></image>
				<view class="list-grid-box">
					<view class="lgb-num">{{statis.order_num}}笔</view>
					<view class="lgb-title">分销订单</view>
				</view>
			</view>
			<view class="list-grid-item" @click="toWithdrawDetails">
				<image class="list-grid-item-img" src="/static/chaoyuezu/profile/icon-deved-03.png"></image>
				<view class="list-grid-box">
					<view class="lgb-num">{{statis.withdraw_num}}笔</view>
					<view class="lgb-title">提现明细</view>
				</view>
			</view>
			<view class="list-grid-item" @click="toMyMember">
				<image class="list-grid-item-img" src="/static/chaoyuezu/profile/icon-deved-04.png"></image>
				<view class="list-grid-box">
					<view class="lgb-num">{{statis.hierarchy_num}}人</view>
					<view class="lgb-title">我的会员</view>
				</view>
			</view>
		</view>

		<view class="split10"></view>

		<view class="list-wrap">
			<view class="list-row" @click="toBankCards">
				<view class="row-content">银行卡</view>
				<image src="/static/zulin/verify/icon-right.png" class="nav-icon" />
			</view>
			<view class="list-row" @click="handlePopup" v-if="statis.apply_status === 1 || statis.apply_status === 2">
				<view class="row-content">校园经理</view>
				<view class="row-value">{{ statusToChange }}</view>
				<image src="/static/zulin/verify/icon-right.png" class="nav-icon" />
			</view>

			<!-- <view class="list-row" @click="toInvite">
				<view class="row-content">邀请您的好友</view>
				<image src="/static/zulin/verify/icon-right.png" class="nav-icon" />
			</view> -->

			<view class="list-row" @click="toShare">
				<view class="row-content">分享减免租金</view>
				<image src="/static/zulin/verify/icon-right.png" class="nav-icon" />
			</view>

			<!-- <view class="list-row" @click="toUpgrade">
				<view class="row-content">申请成为校园经理</view>
				<image src="/static/zulin/verify/icon-right.png" class="nav-icon" />
			</view> -->
		</view>

		<view class="split10"></view>

		<!-- 遮罩层、弹框 -->
		<view class="mask" v-if="activeMask"></view>
		<view class="popup-box" v-if="activeMask">
			<view class="popup-inner">
				<view class="popup-inner-btn-close" @click="handlePopup">X</view>
				<view class="popup-inner-content">
					<view v-if="tempApplyStatus === '0'">抱歉，您还不是校园经理！</view>
					<view v-else>
						<image src="/static/icon-congrate.png" class="icon-congrate"></image>
						<view>申请成功，请等待审核结果！</view>
					</view>
				</view>
				<view class="popup-inner-btn-box" v-if="tempApplyStatus === '0'" @click="handleApplySchoolManageEvent">立即申请成为校园经理</view>
			</view>
		</view>

		<!-- 更改上级弹窗 -->
		<view class="maskpopup" catchtouchmove="true" style="display: flex;justify-content: center;align-items: center;flex-direction: column;"
		 v-if="ischangeCode">
			<view class="maskcontent" style="padding: 25rpx;border-radius: 40rpx;background-color: #FFFFFF;">
				<view class="mcinput" style="margin-bottom: 50rpx;">
					<input @input="mcinput" style="text-align: center;" type="text" value="" placeholder="输入上级推荐码" />
				</view>
				<view class="mcbtn" style="width: 100%;" @click.stop.prevent="mcinputSunmit">
					<view style="text-align: center;background: linear-gradient(rgb(82, 171, 252) 0%, rgb(6, 135, 255) 100%);border-radius: 40rpx;color: #FFFFFF;padding: 5rpx 0;"
					 class="cd_mcbtn">
						确认更改
					</view>
				</view>
			</view>
			<view class="mcimg" style="margin-top: 50rpx;" @click.stop.prevent="changeCode">
				<image style="width: 80rpx;height: 80rpx;" src="/static/ic_circle_close.png" mode=""></image>
			</view>
		</view>

		<myDialog confirmColor="var(--blue)" title="提示" content="当前无交易订单,不具备分销条件" :dialog-show="dialogShow" :isShowCancel="false"
		 @confirmButton="dialogShow=false"></myDialog>
	</view>
</template>

<script>
	import Config from "@/common/js/Config.js";
	import Toast from '@/common/js/toast.js'
	import myShareDialog from '../profile/myShareDialog.js'
	export default {
		mixins: [Toast, myShareDialog],
		onLoad(options) {
			let self = this;
			uni.setNavigationBarTitle({
				title: "分销中心"
			});
		},
		onShow() {
			this.getHierarchyStatis()
			this.hasAvailableOrder()
			this.generateCode()
		},
		computed: {
			userInfo() {
				return this.$store.state.userInfo
			},
			statusToChange() {
				return this.statusDict[this.statis.apply_status]
			}
		},
		data() {
			return {
				faceSrc: '/static/chaoyuezu/index/huawei.png',
				statis: {
					total_brokerage: '',
					history_brokerage: '',
					hierarchy_num: '',
					order_num: '',
					withdraw_num: '',
					withdrawed_money: '',
					invite_name: '',
					role_name: '',
					apply_status: ''
				},
				statusDict: ['未达到资格', '立即申请', ' 审核中', '申请通过'],
				activeMask: false,
				tempApplyStatus: '0',
				userHasAvailableOrder: false,
				dialogShow: false,
				inviteCode: '******',
				ischangeCode: false,
				mcinputValue: ''
			}
		},
		methods: {
			getHierarchyStatis() {
				let self = this
				let getData = {
					userKey: self.userInfo.user_key
				}
				self.$Phttp.get(Config.JAVA_SAAS_URLS.getHierarchyStatis, getData).then(res => {
					res = res.data
					console.log("---" + JSON.stringify(res))
					if (res.code === 0) {
						self.statis.total_brokerage = res.data.total_brokerage || 0
						self.statis.history_brokerage = res.data.history_brokerage || 0
						self.statis.hierarchy_num = res.data.hierarchy_num || 0
						self.statis.order_num = res.data.order_num || 0
						self.statis.withdraw_num = res.data.withdraw_num || 0
						self.statis.withdrawed_money = res.data.withdrawed_money || 0
						self.statis.invite_name = res.data.invite_name
						self.statis.role_name = res.data.role_name
						self.statis.apply_status = res.data.apply_status
						self.statis.sure_brokerage = res.data.sure_brokerage
						self.statis.owe_brokerage = res.data.owe_brokerage
						self.statis.separated_brokerage = res.data.separated_brokerage
					}
					console.log(self.statis)
				})
			},
			handleApplySchoolManageEvent() {
				uni.showLoading({
					title: '申请中...'
				});
				let self = this

				// self.activeMask = true

				let getData2 = {
					userKey: self.userInfo.user_key
				}
				console.log('请求接口:' + Config.JAVA_SAAS_URLS.applySchoolManage);
				console.log('请求参数:' + JSON.stringify(getData2));

				self.$Phttp.post(Config.JAVA_SAAS_URLS.applySchoolManage, getData2, 'application/x-www-form-urlencoded').then(res => {
					res = res.data
					uni.hideLoading();
					console.log("返回数据:" + JSON.stringify(res))
					if (res.code === 0) {
						self.tempApplyStatus = '1'
						self.statis.apply_status = 2;
					} else {
						uni.showToast({
							title: res.msg,
							duration: 3000
						})
					}
				})
			},
			generateCode() {
				let self = this
				let parme = {
					userKey: self.userInfo.user_key
				}
				self.$Phttp.get(Config.JAVA_SAAS_URLS.generateCode, parme).then(res => {
					if (res.data.code == 0) {
						this.inviteCode = res.data.msg
					}
				}, errpr => {
					console.log(error)
				})
			},
			handlePopup() {
				let self = this
				if (self.statis.apply_status === 2) {
					uni.showToast({
						title: '审核中,请等待！',
						duration: 3000
					})
					return false
				}
				self.activeMask = !self.activeMask
			},
			toMyMember() {
				uni.navigateTo({
					url: '/pkChaoYueZu/sale/memberList'
				})
			},
			toCommission() {
				uni.navigateTo({
					url: '/pkChaoYueZu/sale/saleCommissionList'
				})
			},
			toOrder() {
				uni.navigateTo({
					url: '/pkChaoYueZu/sale/saleOrderList?total=' + (this.statis.history_brokerage - this.statis.sure_brokerage)
				})
			},
			toBankCards() {
				uni.navigateTo({
					url: '/pkChaoYueZu/profile/children/bankCards'
				})
			},
			toWithdrawDetails() {
				uni.navigateTo({
					url: '/pkChaoYueZu/sale/withdrawDetails?total=' + this.statis.history_brokerage
				})
			},
			getCash() {
				uni.navigateTo({
					url: '/pkChaoYueZu/profile/children/getCash?balance=' + this.statis.sure_brokerage
				})
			},
			toInvite() {
				// const url = 'http://fintech.test.appkubes.com/#/pages/register/index?invitorKey=' + this.userInfo.user_key,
				if (!this.userHasAvailableOrder) {
					this.dialogShow = true
					return
				}
				const url = Config.FINTECH_SERVER + '/#/pages/register/index?invitorKey=' + this.userInfo.user_key,
					title = '超悦租',
					summary = '选超悦租，比买更实在。租的优惠，一步到位',
					imageUrl = Config.BASE_IMAGE_SERVER + 'attachment/images/avatars/logo.png';
				this.clickShare()
				this.setShareMessage(url, title, summary, imageUrl)
			},
			toShare() {
				console.log(this.statis);
				if (this.statis.role_name.indexOf('普通用户') !== -1) {
					uni.showToast({
						title: '暂不对普通用户开放',
						duration: 3000,
						icon: 'none'
					})
					return
				}
				// const url = 'http://fintech.test.appkubes.com/#/pages/register/index?invitorKey=' + this.userInfo.user_key
				const url = Config.FINTECH_SERVER + '/#/pages/register/index?invitorKey=' + this.userInfo.user_key;
				const encodedUrl = encodeURIComponent(url);
				uni.navigateTo({
					url: '/pkChaoYueZu/profile/children/share?url=' + encodedUrl
				});
			},
			toUpgrade() {
				const self = this
				let parme = {
					userKey: self.userInfo.user_key
				}
				self.$Phttp.get(Config.JAVA_SAAS_URLS.getisCanUpgrade, parme).then(res => {
					res = res.data
					console.log(res)
					if (res.data > 0) {
						uni.navigateTo({
							url: './toUpgrade'
						})
					} else {
						console.log(self.toast)
						self.toast('您暂且不满足条件')
					}
				})
			},
			hasAvailableOrder() {
				let self = this
				let getData = {
					userKey: self.userInfo.user_key
				}
				self.$Phttp.get(Config.JAVA_SAAS_URLS.hasAvailableOrder, getData).then(res => {
					res = res.data
					self.userHasAvailableOrder = res.data
				})
			},
			changeCode(event) {
				event.preventDefault();
				this.ischangeCode = !this.ischangeCode
			},
			mcinput(e) {
				this.mcinputValue = e.detail.value
			},
			mcinputSunmit() {
				let self = this
				let parme = {
					userKey: self.userInfo.user_key,
					recomCode: self.mcinputValue
				}
				self.$Phttp.get(Config.JAVA_SAAS_URLS.upParentUser, parme).then(res => {
					console.log(res)
					let message = ''
					if (res.data.code == 0) {
						uni.showToast({
							title: '修改成功',
							duration: 2000,
							icon: 'none'
						})
						self.ischangeCode = !self.ischangeCode
						this.getHierarchyStatis()
						this.hasAvailableOrder()
						this.generateCode()
						return false
					} else {
						message = res.data.msg
					}
					uni.showToast({
						title: message,
						duration: 2000,
						icon: 'none'
					})
					self.ischangeCode = !self.ischangeCode
				}, error => {
					uni.showToast({
						title: error.data.msg,
						duration: 1000,
						icon: 'none'
					})
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	page {
		background: #f8f8f8;
	}

	.mt10 {
		margin-top: 20rpx;
	}

	.split10 {
		width: 100%;
		height: 20rpx;
		background-color: #f8f8f8;
	}

	.top-box {
		display: flex;
		justify-content: flex-start;
		align-items: center;
		padding: 44rpx 30rpx;
		width: 100%;
		height: 216rpx;
		box-sizing: border-box;
		background: linear-gradient(180deg, rgba(82, 171, 252, 1) 0%, rgba(6, 135, 255, 1) 100%);

		.tb-user-face {
			width: 128rpx;
			height: 128rpx;
			border: 4rpx solid #fff;
			border-radius: 128rpx;

			.tbuf-img {
				width: 100%;
				height: 100%;
				background-size: 100%;
				border-radius: 128rpx;
			}
		}

		.tb-user-info {
			margin-left: 34rpx;
			flex: 1;
			display: flex;
			flex-direction: column;

			.tb-user-name {
				font-size: 36rpx;
				line-height: 48rpx;
				font-weight: 500;
				color: #fff;
			}

			.tb-user-invent {
				font-size: 26rpx;
				color: #fff;
			}

			.tb-user-perm {
				margin-top: 8rpx;
				font-size: 24rpx;
				color: #fff;

				.tbup-tag {
					float: left;
					padding: 0 28rpx;
					font-size: 24rpx;
					border: 1px solid #fff;
					border-top-left-radius: 28rpx;
					border-top-right-radius: 28rpx;
					border-bottom-left-radius: 28rpx;
					border-bottom-right-radius: 28rpx;
				}
			}
		}
	}

	.list-wrap {
		display: flex;
		flex-direction: column;
		width: 100%;

		.list-row {
			margin-top: 30rpx;
			padding: 0 30rpx;
			display: flex;
			flex-direction: row;
			height: 110rpx;
			align-items: center;
			font-size: 30rpx;
			font-family: PingFangSC-Medium, PingFang SC;
			font-weight: 500;
			color: rgba(34, 34, 34, 1);
			background: #fff;
			border-bottom: 1rpx solid #efefef;

			&:last-child {
				border-bottom: 0;
			}

			.row-content {
				font-size: 30rpx;
				flex: 1;
				display: flex;
				flex-direction: column;
			}

			.row-value {
				color: #666
			}

			.row-image {
				width: 40rpx;
				height: 40rpx;
				margin-right: 20rpx;
				margin-left: 30rpx;
			}

			.nav-icon {
				width: 40rpx;
				height: 40rpx;
			}
		}
	}

	.list-wrap2 {
		background: #fff;
		display: flex;

		.list-row {
			display: flex;
			align-items: center;
			justify-content: flex-start;
			padding: 30rpx 0 30rpx 30rpx;
			// border-bottom: 1rpx solid #f0f0f0;

			&:last-child {
				border-bottom: 0;
			}

			.lf-info {
				// width: 75%;
				border-right: 1rpx solid #f0f0f0;

				.text-num {
					font-size: 40rpx;
					font-weight: 400;
					color: rgba(22, 119, 255, 1);
				}

				.text-title {
					font-size: 26rpx;
					font-weight: 400;
					font-family: PingFangSC-Regular, PingFang SC;
					color: rgba(153, 153, 153, 1);
				}
			}

			.rg-btn {
				flex: 1;
				padding-left: 50rpx;

				.btn-blue {
					width: 164rpx;
					height: 56rpx;
					line-height: 56rpx;
					background: linear-gradient(180deg, rgba(82, 171, 252, 1) 0%, rgba(6, 135, 255, 1) 100%);
					border-radius: 24rpx;
					color: #fff;
					text-align: center;
				}
			}
		}
	}

	.list-grid-4 {
		display: flex;
		align-items: center;
		justify-content: space-between;
		flex-direction: row;
		flex-wrap: wrap;

		.list-grid-item {
			display: flex;
			align-items: center;
			justify-content: center;
			padding: 30rpx;
			width: 50%;
			box-sizing: border-box;
			background: #fff;
			border-width: 0 1rpx 1rpx 0;
			border-color: #f0f0f0;
			border-style: solid;

			.list-grid-item-img {
				margin-right: 30rpx;
				width: 60rpx;
				height: 60rpx;
			}

			.list-grid-box {
				flex: 1;

				.lgb-num {
					font-size: 30rpx;
					font-weight: 400;
					color: rgba(34, 34, 34, 1);
				}

				.lgb-title {
					font-size: 26rpx;
					font-weight: 400;
					color: rgba(153, 153, 153, 1);
				}
			}
		}
	}

	.mask {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: calc(100vh);
		background-color: rgba($color: #333, $alpha: .8);
		z-index: 1001;
	}

	.maskpopup {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: calc(100vh);
		background-color: rgba($color: #333, $alpha: .8);
		z-index: 1001;
	}

	.popup-box {
		position: absolute;
		top: 0;
		left: 0;
		display: flex;
		align-items: center;
		width: 100%;
		height: calc(100vh);
		background-color: rgba($color: #333, $alpha: .8);
		z-index: 1002;

		.popup-inner {
			position: relative;
			margin-left: auto;
			margin-right: auto;
			width: 560rpx;
			height: 360rpx;
			background-color: #fff;

			.popup-inner-btn-close {
				position: absolute;
				top: 14rpx;
				right: 14rpx;
				width: 50rpx;
				height: 50rpx;
				line-height: 50rpx;
				text-align: center;
				font-size: 36rpx;
				font-weight: 600;
				color: #999;
			}

			.popup-inner-content {
				margin: 110rpx auto 60rpx;
				font-size: 36rpx;
				color: #000;
				text-align: center;

				.icon-congrate {
					width: 100rpx;
					height: 100rpx;
				}
			}

			.popup-inner-btn-box {
				margin-left: auto;
				margin-right: auto;
				width: 90%;
				height: 76rpx;
				line-height: 76rpx;
				text-align: center;
				font-size: 28rpx;
				color: #fff;
				background: linear-gradient(357deg, rgba(6, 135, 255, 1) 0%, rgba(82, 171, 252, 1) 100%);
				border-radius: 40rpx;
			}
		}
	}
</style>
