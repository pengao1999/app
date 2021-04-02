<template>
	<view class='page'>
		<image class='success-img' src='../../static/ic_pay_success.png'></image>
		<text class='text'>支付成功</text>
		<text class='desc'>我们会尽快安排送货，请关注提货通知。</text>
		<view class='order-info'>
			<view class='col-top'>
				<text>订单信息</text>
			</view>
			<view class='info'>
				<view class='row'>
					<text class='name'>订单编号</text>
					<text class='content'>{{orderNo}}</text>
				</view>
				<view class='row'>
					<text class='name'>下单时间</text>
					<text class='content'>{{createTime}}</text>
				</view>
				<view class='row'>
					<text class='name'>商品活动</text>
					<text class='content'>￥0.00</text>
				</view>
				<view class='row'>
					<text class='name'>社区活动</text>
					<text class='content'>￥0.00</text>
				</view>
			</view>
			<view class='bottom'>
				<text>合计：</text>
				<text class='price'>{{price}}</text>
			</view>
		</view>
		<view class='buttons'>
			<view class="button2" @tap='toOrder'>查看订单</view>
			<view class="button" @tap='back'>继续购买</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				id: '',
				orderNo: '',
				createTime: '',
				price: ''
			}
		},
		onLoad(options) {
			this.initPage(options)
		},
		computed: {
			userInfo() {
				return this.$store.state.userInfo
			},
			globalI() {
				return this.$store.state.globalI
			}
		},
		methods: {
			initPage: function(options) {
				this.id = options.id
				this.orderNo = options.orderNo
				this.createTime = options.createTime
				this.price = options.price
			},
			toOrder: function() {
				uni.redirectTo({
					url: '/pages/order/detail?id=' + this.id
				})
			},
			back: function() {
				uni.navigateBack({
					delta: 1
				})
			}
		},
		onShareAppMessage() {
			return {
				title: '友邻优选-大家都在用的社区团购APP',
				path: '/pages/index/main?user_key=' + this.userInfo.user_key + '&i=' + this.globalI
			}
		}
	}
</script>

<style>
	page {
		background: #f6f6f6;
		height: 100%;
	}

	.page {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.success-img {
		width: 140rpx;
		height: 140rpx;
	}

	.text {
		font-size: 40rpx;
		color: #06c00c;
		margin-top: 20rpx;
		font-weight: bold;
	}

	.desc {
		font-size: 24rpx;
		color: #666;
		margin-top: 20rpx;
	}

	.order-info {
		width: calc(100% - 48rpx);
		margin-left: 24rpx;
		margin-right: 24rpx;
		background: #fff;
		border-radius: 20rpx;
		margin-top: 60rpx;
	}

	.order-info .col-top {
		width: calc(100% -60rpx);
		height: 80rpx;
		padding-left: 30rpx;
		padding-right: 30rpx;
		border-bottom: solid 1rpx #eee;
		display: flex;
		align-items: center;
		font-size: 28rpx;
		font-weight: 500;
		color: #333;
	}

	.order-info .info {
		width: calc(100% - 48rpx);
		margin-left: 24rpx;
		margin-right: 24rpx;
		padding-top: 30rpx;
		padding-bottom: 30rpx;
		background: #fff;
	}

	.order-info .info .row {
		width: 100%;
		line-height: 40rpx;
		display: flex;
		font-size: 24rpx;
		color: #333;
		flex-wrap: wrap;
	}

	.order-info .info .row .name {
		width: 130rpx;
		height: 40rpx;
		line-height: 40rpx;
	}

	.order-info .info .row .content {
		width: calc(100% - 162rpx);
		padding-left: 30rpx;
		border-left: solid 1rpx #f6f6f6;
	}

	.order-info .bottom {
		width: calc(100% - 60rpx);
		height: 100rpx;
		padding-left: 30rpx;
		padding-right: 30rpx;
		display: flex;
		align-items: center;
		font-size: 28rpx;
		font-weight: 500;
		color: #333;
		justify-content: flex-end;
		border-top: solid 1rpx #eee;
	}

	.order-info .bottom .price {
		font-size: 36rpx;
		font-weight: 500;
		color: #e84118;
	}

	.buttons {
		width: calc(100% - 60rpx);
		margin-left: 30rpx;
		margin-right: 30rpx;
		margin-top: 60rpx;
		display: flex;
		justify-content: center;
	}

	.button {
		width: 300rpx;
		margin-left: 30rpx;
		margin-right: 30rpx;
		height: 100rpx;
		line-height: 100rpx;
		text-align: center;
		margin: 0 auto;
		background: #fff;
		background: #05bf0a;
		color: #fff;
		font-size: 30rpx;
		border-radius: 50rpx;
	}

	.button2 {
		width: 300rpx;
		margin-left: 30rpx;
		margin-right: 30rpx;
		height: 98rpx;
		line-height: 98rpx;
		text-align: center;
		margin: 0 auto;
		background: #fff;
		border: solid 1rpx #05bf0a;
		color: #05bf0a;
		font-size: 30rpx;
		border-radius: 50rpx;
	}
</style>
