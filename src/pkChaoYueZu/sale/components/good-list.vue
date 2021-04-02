<!-- 商品列表组件 <pd-list :list="xx"></pd-list> -->
<template>
	<view class="pd-list">
		<view class="pd-li" v-for="(item, index) in list" :key="index">
			<view class="pd-list-header">
				<image class="pd-lh-img" v-if="item.img" :src="item.img" mode="widthFix"/>
				<image class="pd-lh-img" v-else src="/static/chaoyuezu/profile/icon-red-star.png" mode="widthFix"/>
				<view class="pd-name">{{item.name}}</view>
				<text class="pd-status text-red">{{item.status}}</text>
			</view>
			<view class="pd-list-body" v-for="(good, gIndex) in item.order_goods" :key="gIndex" v-if="good.type == 1">
				<image class="pd-lb-img" :src="imgRoot + good.pic"/>
				<view class="pd-lb-cen">
					<view class="pd-lb-cen-title">{{good.goods_name}}</view>
					<view class="pd-lb-cen-subtitle">{{good.attr_names}}</view>
				</view>
				<view class="pd-lb-rg">
					<view class="pd-lb-bot-text">预计</view>
					<view class="pd-lb-bot-text">+{{item.brokerage}}</view>
				</view>
			</view>
			<view class="pd-list-info">
				<view class="pd-li-text">分销等级：{{item.lev}}</view>
				<view class="pd-li-text">订单编号：{{item.order_no}}</view>
				<view class="pd-li-text">下单时间：{{item.create_time}}</view>
				<view class="pd-li-text">扣除佣金：<text style="color: red;">{{item.deducted}}</text></view>
			</view>
			<view class="pd-list-footer">预计佣金：+{{item.brokerage - item.deducted}}</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			imgRoot: 'http://res.chaoyuezu.cn/attachment'
		}
	},
	props:{
		list: { // 数据列表
			type: Array,
			default(){
				return []
			}
		}
	}
}
</script>

<style lang="scss" scoped>
	/*数据列表*/
	.pd-list{
		height: 100%;
	}
	.pd-li{
		position: relative;
		display: flex;
		flex-direction: column;
		margin-top: 20upx;
		// height: 520upx;
		// max-height: 520upx;
		background-color: #fff;
		.pd-list-header {
			display: flex;
			align-items: center;
			justify-content: flex-start;
			padding: 20upx 30upx;
			.pd-lh-img {
				width: 56upx;
				height: 56upx;
			}
			.pd-name {
				margin-left: 30upx;
				width: 75%;
				font-size: 30upx;
				color: #222;
				font-weight: 400;
			}
			.pd-status {
				font-size: 26upx;
				font-weight: 400;
				&.text-green {
					color: #66C666
				}
				&.text-red {
					color: #FF7334
				}
			}
		}
		.pd-list-body {
			display: flex;
			padding: 20upx 30upx;
			background:rgba(245,245,245,1);
			.pd-lb-img {
				width: 126upx;
				height: 126upx;
			}
			.pd-lb-cen {
				display: flex;
				flex-direction: column;
				width: 68%;
				.pd-lb-cen-title {
					font-size: 26upx;
					color: #222;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 2;
					overflow: hidden;
				}
				.pd-lb-cen-subtitle {
					flex: 1;
					font-size: 22upx;
					color: #666;
				}
			}
			.pd-lb-rg {
				margin-left: 20upx;
				.pd-lb-bot-text{
					font-size: 26upx;
					color: #999;
				}
			}
		}
		.pd-list-info {
			padding: 20upx 30upx;
			.pd-li-text {
				font-size: 24upx;
				color: #999;
			}
		}
		.pd-list-footer {
			padding: 20upx 30upx;
			border-top: 1upx solid #f0f0f0;
			font-size: 26upx;
			color: #222;
			text-align: right;
		}
	}

</style>
