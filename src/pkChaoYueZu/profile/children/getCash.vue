<template>
	<view class style="width: 100%;">
		<view class="box">
			<view class="balance">￥{{balance.toFixed(2)}}</view>
			<text class="text">可提现金额</text>
			<text class="b-text">提现金额</text>
			<view class="input-box">
				<text class="unit">￥</text>
				<input type="number" v-model="wbalance" placeholder="最低可提现1元" />
				<text class="all" @click="all()">全部</text>
			</view>
			<view class="col">
				<text class="name">银行卡</text>
				<!-- <input
          v-model="aliAccount"
          placeholder="请输入支付宝账号"
          style="font-size: 30rpx; text-align: right"
        />-->
				<view style="display: flex; flex-direction: row; align-items: center;">
					<picker :range="bankList" :value="bankIndex" class="row-picker" @change="handleBankChange">
						<view>{{bankList[bankIndex]}}</view>
					</picker>
					<image src="/static/ic_arrow_right.png" style="width: 26rpx; height: 26rpx; margin-left: 10rpx;" />
				</view>
			</view>
			<view class="col">
				<text class="name">银行</text>
				<text class="value">{{bankInfoList[bankIndex].bank_card_name}}</text>
			</view>
			<view class="col">
				<text class="name">真实姓名</text>
				<text class="value">{{bankInfoList[bankIndex].bank_card_username}}</text>
			</view>
			<view class="col">
				<text class="name">手机号码</text>
				<text class="value">{{bankInfoList[bankIndex].bank_bind_phone}}</text>
			</view>
		</view>
		<!-- <view class="texts">
      <view style="float: left; display: flex; align-items: center;" @tap="showPopup()">
        <image src="/static/wenhao.png" />
        <text class="text" style="margin-left: 10upx;">提现规则</text>
      </view>
      <text class="text" @tap="profitDetails">收益明细</text>
    </view>-->
		<view class="submit" :style="{background:(wbalance>=1&&wbalance<=balance)?'#0687FF':'#DDDDDD'}" @tap="confirm">提交审核</view>

		<view class="text-blue text-center" style="font-size: 26upx;margin-top: 100upx;" @click="toBankCards">去添加银行卡</view>
		<!-- <view class="notice">*每月25号后可提现上个月内确认收货的订单收益</view> -->
		<!-- <view
      v-show="showType === 'middle-list'"
      @click="togglePopup('')"
    >
      <scroll-view :scroll-y="true" class="uni-center center-box">
        <text class="activityRule">提现规则</text>
        <view class="ruleContent">
          1、工作日当天18:00前提现，当天2小时内到账；当天18:00后提现，次日10点前到账。
          <br />2、工作日当天18:00后提现，次日恰逢休息日或节假日，提现顺延至第一个工作日的12：00前到账。
          <br />3、休息日或节假日提现顺延至第一个工作日的12：00前到账。
          <br />
        </view>
      </scroll-view>
    </view>-->
	</view>
</template>
<script>
	import Toast from '../../../common/js/toast.js'
	import Config from '../../../common/js/Config.js'
	import {
		mapMutations
	} from 'vuex'
	export default {
		components: {},
		data() {
			return {
				balance: 0,
				wbalance: 0,
				showType: '',
				aliAccount: '',
				bankList: ['请选择已绑定的银行卡'],
				bankIndex: 0,
				bankInfoList: [{}]
			}
		},
		computed: {
			userInfo() {
				return this.$store.state.userInfo
			}
		},
		mixins: [Toast, Config],
		onLoad(options) {
			console.log(options)
			this.balance = Number(options.balance) || 0
			this.getBankList()
		},
		methods: {
			...mapMutations(['setUserInfo', 'setRefresh']),
			getBankList() {
				let self = this
				const params = {
					appKey: '123',
					userKey: self.userInfo.user_key
				}
				self.$Phttp.get(Config.JAVA_SAAS_URLS.getBankCardList, params).then(res => {
					res = res.data
					if (res.code === 0) {
						let list = res.data
						if (list.length === 0) {
							uni.showToast({
								title: '还未添加银行卡～',
								icon: "none",
								duration: 3000
							})
							return
						}
						self.bankInfoList = [{}].concat(list)
						list = list.map(item => item.bank_card_number)
						self.bankList = ['请选择已绑定的银行卡'].concat(list)
					} else {
						uni.showToast({
							title: '获取绑定银行卡失败',
							icon: "none",
							duration: 2000
						})
					}
				})
			},
			handleBankChange(e) {
				this.bankIndex = e.target.value
			},
			all() {
				this.wbalance = this.balance
			},
			toBankCards() {
				uni.navigateTo({
					url: '/pkChaoYueZu/profile/children/bankCards'
				})
			},
			confirm() {
				let self = this
				if (this.wbalance < 1 || this.wbalance > this.balance) {
					return
				}
				if (this.bankIndex === 0) {
					uni.showToast({
						title: '请选择银行卡！',
						duration: 2000,
						icon: "none"
					})
					return
				}
				let postData = {
					bank_card_num: self.bankList[self.bankIndex],
					bank_name: self.bankInfoList[self.bankIndex].bank_card_name,
					real_name: self.bankInfoList[self.bankIndex].bank_card_username,
					real_tel: self.bankInfoList[self.bankIndex].bank_bind_phone,
					user_key: self.userInfo.user_key,
					withdraw_money: self.wbalance
				}
				self.$Phttp.post(Config.JAVA_SAAS_URLS.withdraw, postData).then(res => {
					res = res.data
					if (res.code === 0) {
						uni.showToast({
							title: '已提交审核',
							icon: "none",
							duration: 2000
						})
					} else {
						uni.showToast({
							title: res.msg,
							icon: "none",
							duration: 2000
						})
					}
					setTimeout(function() {
						uni.navigateBack()
					}, 2000)
				})
			},
		}
	}
</script>

<style>
	.box {
		width: calc(100% - 60upx);
		margin: 20upx 30upx;
		background: #fff;
		border-radius: 10upx;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.box .balance {
		font-size: 46upx;
		font-weight: bold;
		color: #222;
		margin-top: 60upx;
	}

	.text {
		font-size: 24upx;
		color: #222;
	}

	.b-text {
		width: calc(100% - 60upx);
		margin-left: 30upx;
		margin-right: 30upx;
		font-size: 28upx;
		color: #222;
		font-weight: bold;
		margin-top: 20upx;
	}

	.input-box {
		width: calc(100% - 60upx);
		padding-left: 30upx;
		padding-right: 30upx;
		display: flex;
		justify-content: space-between;
		height: 100upx;
		align-items: center;
		border-bottom: solid 1upx #eee;
		margin-bottom: 20upx;
	}

	.input-box .unit {
		width: 60upx;
		font-size: 30upx;
		font-weight: bold;
		color: #222;
	}

	.input-box input {
		flex: 1;
		font-size: 30upx;
		color: #222;
	}

	.input-box .all {
		width: 60upx;
		height: 60upx;
		line-height: 60upx;
		text-align: center;
		font-size: 30upx;
		color: var(--blue);
	}

	.col {
		width: calc(100% - 60upx);
		padding-left: 30upx;
		padding-right: 30upx;
		height: 80upx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-bottom: 1rpx solid #f4f4f4;
	}

	.col .name {
		width: 160upx;
		font-size: 28upx;
		color: #666;
	}

	.col .value {
		flex: 1;
		font-size: 28upx;
		color: #999;
		text-align: right;
	}

	.col .edit {
		width: 80upx;
		font-size: 24upx;
		background: #fc5d3c;
		height: 40upx;
		line-height: 40upx;
		text-align: center;
		border-radius: 20upx;
		color: #fff;
	}

	.center-box {
		padding: 30upx;
		width: 600upx;
		overflow: hidden;
		/* height: 700upx; */
	}

	.activityRule {
		font-size: 40upx;
		font-weight: bold;
		text-align: center;
	}

	.ruleContent {
		font-size: 27upx;
		text-align: left;
		margin-top: 20upx;
	}

	.texts {
		width: 100%;
		height: 40upx;
	}

	.texts image {
		width: 30upx;
		height: 30upx;
		margin-left: 40upx;
	}

	.texts .text {
		height: 40upx;
		line-height: 40upx;
		font-size: 28upx;
		color: #1890ff;
		margin-right: 40upx;
		float: right;
	}

	.submit {
		width: calc(100% - 100upx);
		margin: 60upx 50upx 20upx 50upx;
		height: 80upx;
		line-height: 80upx;
		background: #ddd;
		color: #fff;
		text-align: center;
		border-radius: 40upx;
	}

	.active {
		background: #fc5d3c;
	}

	.notice {
		width: 100%;
		color: #fc5d3c;
		font-size: 24upx;
		text-align: center;
	}
</style>
