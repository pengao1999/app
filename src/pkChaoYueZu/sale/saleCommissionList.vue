<template>
    <view class="content">
        <view class="sc-top">
        	<view class="sc-t-num">{{ record.total_brokerage }}</view>
			<view class="sc-t-title">累计佣金（元）</view>
			<view class="sc-abs-btn" @click="toWithdrawDetails">
				提现明细
			</view>
        </view>
		<view class="split10"></view>
		<view class="scl-card">
			<view class="scl-card-item">
				<view class="scl-card-item_title">可提现佣金</view>
				<view class="scl-card-item_value fc-blue"> {{ record.sure_brokerage }} 元</view>
			</view>
		</view>
		<view class="split10"></view>
		<view class="scl-card">
			<view class="scl-card-item">
				<view class="scl-card-item_title">已申请佣金</view>
				<view class="scl-card-item_value"> {{ record.applyed_brokerage }} 元</view>
			</view>
			<view class="scl-card-item">
				<view class="scl-card-item_title">待打款佣金</view>
				<view class="scl-card-item_value"> {{ record.withdrawing_brokerage }} 元</view>
			</view>
			<view class="scl-card-item">
				<view class="scl-card-item_title">冻结佣金</view>
				<view class="scl-card-item_value"> {{ record.history_brokerage - record.sure_brokerage }} 元</view>
			</view>
			<view class="scl-card-item">
				<view class="scl-card-item_title">成功提现佣金</view>
				<view class="scl-card-item_value"> {{ record.withdraw_success_brokerage }} 元</view>
			</view>
			<view class="scl-card-item">
				<view class="scl-card-item_title">扣除提现手续费</view>
				<view class="scl-card-item_value"> {{ record.service_brokerage }} 元</view>
			</view>
		</view>
		<view class="split10"></view>
		<view class="scl-card">
			<view class="scl-card-item">
				<view class="scl-card-item_title">待收货佣金</view>
				<view class="scl-card-item_value"> {{ record.in_way_brokerage }} 元</view>
			</view>
			<view class="scl-card-item">
				<view class="scl-card-item_title">未结算佣金</view>
				<view class="scl-card-item_value"> {{ record.un_pay_brokerage }} 元</view>
			</view>
		</view>
		<view class="split10"></view>	
		<view class="sc-readme">
			<view class="sc-readme_title">用户需知</view>
			<view class="sc-readme_value">买家确认收货后，立即获得分销佣金， 注意: 可用佣金满<view class="inline fc-blue">10</view>元后才能申请提现</view>
		</view>

		<view class="flex-bottom">
			<view class="btn-blue" @click="getCash">
				我要提现
			</view>
		</view>

		<view class="occ-block"></view>
    </view>
</template>

<script>
    import Config from '../../common/js/Config.js'
    import Util from '../../common/js/util.js'
    import Toast from '../../common/js/toast.js'
    export default {
        name: "SaleCommissionList",
        components: {
        },
        data() {
            return {
                balance: '0',
				total: '0',
				record: {}
            }
        },
		onLoad(options) {
			this.initCommissionData();
		},
		computed: {
			userInfo() {
				return this.$store.state.userInfo
			}
		},
        methods: {
        	initCommissionData() {
				let self = this;
				let params = {
					userKey: self.userInfo.user_key
				};
				console.log('initCommissionData调用接口-获取提现明细：' + Config.JAVA_SAAS_URLS.getBrokerageDetail);
				console.log('initCommissionData传递参数：' + JSON.stringify(params))
				self.$Phttp.get(Config.JAVA_SAAS_URLS.getBrokerageDetail, params).then(res => {
					console.log('返回数据' + JSON.stringify(res));
					self.record = res.data.data;
				})
			},
            toWithdrawDetails() {
				uni.navigateTo({
					url: '/pkChaoYueZu/sale/withdrawDetails?total=' + this.record.history_brokerage
				})
			},
			getCash() {
				uni.navigateTo({
				  url: '/pkChaoYueZu/profile/children/getCash?balance=' + this.record.total_brokerage
				})
			}
        }
    }
</script>

<style lang="scss" scoped>
page {
    background: #f8f8f8;
}
.content {
	width: 100%;
	height: 100%;
	.mt10 {
		margin-top: 20rpx;
	}
	.fc-blue {
		color: #1677FF !important;
	}
	.inline {
		display: inline;
	}
	.split10 {
		width: 100%;
		height: 20rpx;
		background-color: #f8f8f8;
	}
	.sc-top {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 216rpx;
		background:linear-gradient(180deg,rgba(82,171,252,1) 0%,rgba(6,135,255,1) 100%);
		color: #fff;
		.sc-t-num {
			font-size: 50rpx;
			font-weight: 600;
		}
		.sc-t-title {
			margin-top: 10rpx;
			font-size: 26rpx;
		}
		.sc-abs-btn {
			position: absolute;
			top: 40rpx;
			right: 15rpx;
			padding: 5rpx 28rpx;
			font-size: 24rpx;
			border: 1rpx solid #fff;
			border-radius: 50rpx;
		}
	}
	.scl-card {
		padding-left: 30rpx;
		background: #fff;
		box-sizing: border-box;
		.scl-card-item {
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 34rpx 30rpx 34rpx 0;
			box-sizing: border-box;
			border-bottom: 1rpx solid #f0f0f0;
			.scl-card-item_title {
				font-size: 30rpx;
				font-weight: 400;
				color: #222;
			}
			.scl-card-item_value {
				font-size: 30rpx;
				font-weight: 400;
				color: #222;
			}
			&:last-child {
				border-bottom: 0;
			}
		}
	}
	.sc-readme {
		background: #fff;
		box-sizing: border-box;
		padding: 34rpx 30rpx;
		.sc-readme_title {
			font-size: 30rpx;
			font-weight: 400;
			color: #222;
		}
		.sc-readme_value {
			width: 80%;
			font-size: 26rpx;
			font-weight: 400;
			color: #999;
		}
	}
	.flex-bottom {
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		width: 100%;
		height: 108rpx;
		background: #fff;
		.btn-blue {
			margin: 12rpx auto 0;
			width: 90%;
			height: 84rpx;
			line-height: 84rpx;
			background:linear-gradient(180deg,rgba(82,171,252,1) 0%,rgba(6,135,255,1) 100%);
			border-radius: 44rpx;
			color: #fff;
			font-size: 30rpx;
			font-weight:500;
			text-align: center;
			border-top: 1rpx solid #f2f2f2;
		}
	}
	.occ-block {
		width: 100%;
		height: 128rpx;
	}
}
</style>
