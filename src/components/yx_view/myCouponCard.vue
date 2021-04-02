<template>
	<view class="Coupon-Card">
		<view class="expired-tap" v-if="((isExpired && showBtn) || coupon.state==2) || isGet">
			<text class="text">{{(showBtn && coupon.state==2)?'已使用':handlerText}}</text>
		</view>
		<view class="Coupon-left" :style="isExpired || isGet || coupon.state==2?'background: #999':'background:linear-gradient(70deg,#40e90a,#06C00C)'">
			<view class="Coupon-left-line"></view>
			<view class="Coupon-left-val">
				<text style="font-size: 28upx;">¥</text>
				<text style="font-size: 50upx;font-weight: bold;">{{coupon.use_money}}</text>
			</view>
			<view style="font-size: 28upx;">{{coupon.name}}</view>
		</view>
		<view class="Coupon-right">
			<view class="expired-container" v-if="!isExpired && isQuickExpired  && showBtn && coupon.state!==2">
				<image class="img" src="../../static/tag.png"></image>
				<text class="Coupon-quick-expired">快过期</text>
			</view>
			<view class="content-container">
				<text class="title-container">
					<text class="coupon-type" :style="(isExpired || isGet) || coupon.state==2?'background: #999':'background: #06C00C;'">全品</text>
					<text class="coupon-title">{{coupon.name}}</text>
				</text>
				<view class="Coupon-buy">
					<view class="Coupon-time">{{begin_time}}-{{end_time}}</view>
					<view class="buy-btn" v-if="showBtn" @tap="clickBtn(coupon)" :style="(isExpired || isGet) || coupon.state==2?'border: 0.5px solid #999;color: #999;':'border: 0.5px solid #06C00C;color: #06C00C;'">{{btnText}}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				isExpired: false, //是否过期
				isQuickExpired: false,
				begin_time: '',
				end_time: ''
			}
		},
		props: {
			coupon: {
				type: Object,
				default() {
					return {}
				}
			},
			showBtn: {
				type: Boolean,
				default: false
			},
			btnText: {
				type: String,
				default: ''
			},
			handlerText: {
				type: String,
				default: ''
			},
			isGet: {
				type: Boolean,
				default: false
			},
			index: {
				type: Number,
				default: 0
			}
			
		},
		watch: {
			coupon: {
				handler() {
					console.log(this.coupon)
					if (this.coupon !== undefined){
						this.isCouponQuickExpired()
						this.begin_time = /\d{4}.\d{1,2}.\d{1,2}/g.exec(this.coupon.begin_time.split('-').join('.'))[0]
	
						this.end_time = /\d{4}.\d{1,2}.\d{1,2}/g.exec(this.coupon.end_time.split('-').join('.'))[0]
					}
				},
				immediate: true
			}
		},
		methods: {
			isCouponQuickExpired: function() {
				var end = new Date(this.coupon.end_time)
				var end_timestamp = end.getTime()
				var now_timestamp = new Date().getTime()
				if ((end_timestamp - now_timestamp) < 0) {
					this.isExpired = true
					return
				}
				if ((end_timestamp - now_timestamp)/86400000 < 3) {
					this.isQuickExpired = true
					return
				}
			},
			clickBtn: function(coupon) {
				if ((this.isExpired && this.showBtn) || this.isGet) return
				this.$emit('clickBtn', coupon, this.index)
			}
		}
	}
</script>

<style>
	.Coupon-Card {
		width: calc(100% - 60upx);
		margin-left: 30upx;
		background:white;
		height: 200upx;
		margin-top: 20upx;
		display: flex;
		flex-direction: row;
		box-shadow:0px 10px 20px 0px rgba(0, 0, 0, 0.02);
	}
	.expired-tap {
		position: absolute;
		width: calc(100% - 60upx);
		height: 200upx;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.expired-tap .text {
		font-size: 50upx;
		border: 4upx solid #333;
		padding: 10upx 20upx;
		/* Rotate div */
		transform:rotate(25deg);
		-ms-transform:rotate(25deg); /* Internet Explorer */
		-moz-transform:rotate(25deg); /* Firefox */
		-webkit-transform:rotate(25deg); /* Safari 和 Chrome */
		-o-transform:rotate(25deg); /* Opera */
	}
	.Coupon-left {
		width: 35%;
		display: flex;
		justify-content: center;
		align-items: center;
		display: flex;
		flex-direction: column;
		color: white;
	}
	.Coupon-left-line {
		width: 10upx;
		height: 200upx;
		position: absolute;
		margin-left: -15%;
		margin-top: 0upx;
		border-right: 2upx dashed #F8F8F8;
		/* background: linear-gradient(135deg, #F8F8F8, #F8F8F8 45%, #40e90a, transparent 55%, transparent 100%), linear-gradient(45deg, transparent, transparent 45%, transparent, #F8F8F8 55%, #F8F8F8 100%);
		background-size: 0.5em 0.5em;
		background-repeat: repeat-y, repeat-y; */
	}
	.Coupon-right {
		width: 65%;
		height: 100%;
	}
	.content-container {
		width: 98%;
		height: 100%;
		display: flex;
		flex-direction: column;
		padding: 10upx;
		float: left;
	}
	.expired-container {
		width: 60%;
		height: 150upx;
		position: absolute;
	}
	.expired-container .img {
		margin-right:-5rpx;
		margin-top:-5rpx;
		width:70rpx;
		height:70rpx;
		float:right;
	}
	.Coupon-quick-expired {
		float: right;
		margin-right:-80rpx;
		margin-top:7rpx;
		padding: 5upx 15upx;
		font-size:16rpx;
		color: #fff;
		/* Rotate div */
		transform:rotate(45deg);
		-ms-transform:rotate(45deg); /* Internet Explorer */
		-moz-transform:rotate(45deg); /* Firefox */
		-webkit-transform:rotate(45deg); /* Safari 和 Chrome */
		-o-transform:rotate(45deg); /* Opera */
	}
	.title-container {
		display:-webkit-box;
		display:-webkit-flex;
		display:-ms-flexbox;
		display:flex;
		-webkit-flex-wrap:wrap;
		-ms-flex-wrap:wrap;
		height: 120upx;
		overflow:hidden; 
		text-overflow:ellipsis;
		display:-webkit-box; 
		-webkit-box-orient:vertical;
		-webkit-line-clamp:2; 
		border-bottom: 2upx dashed #F2F2F2;
	}
	.title-container .coupon-type {
		padding: 2upx 10upx;
		border-radius: 20upx;
		font-size: 22upx;
		color: white;
	}
	.title-container .coupon-title {
		font-size: 24upx;
		margin-left: 10upx;
	}
	.Coupon-buy {
		display: flex;
		flex-direction: row;
		align-items: center;
		margin-top: 10upx;
	}
	.Coupon-buy .Coupon-time {
		width: calc(100% - 150upx);
		min-width: 300upx;
		font-size: 24upx;
	}
	.Coupon-buy .buy-btn {
		padding: 5upx 15upx;
		justify-content: center;
		font-size: 24upx;
		border-radius: 25upx;
	}
</style>
