<template>
	<div>
		<view class="mask"></view>
		<view class="select-window">
			<!-- <image class='close' src='../static/ic_close.png'></image> -->
			<image class='image'></image>
			<!-- <text class='title'>{{data.name}}</text> -->
			<view class='price-box'>
				<text class='price'>￥</text>
				<text class='sub-price'>.99</text>
				<text class='cost-price'>￥120</text>
				<text class='stock'>剩余 266</text>
			</view>
			<!-- <text class='select-text' wx:if="{{chooseSpec!=null}}">已选择：{{chooseSpec}}</text> -->
			<text class='select-text'>未选择</text>
			<view style='width:100%; height:20rpx; float: left;'></view>
			<!-- <block wx:for="{{goods.attrgroups}}" wx:key="key">
				<view class='column'>
					<text class='name'>{{item.name}}</text>
					<view class='content'>
						<block wx:for="{{item.attrs}}" wx:for-item="attr" wx:key="key" wx:for-index="idx">
							<text class='spec {{attr.status?"select":""}}' bindtap="spTap" data-id="{{attr.id}}" data-idx="{{idx}}"
							 data-index="{{index}}">{{attr.name}}</text>
						</block>
					</view>
				</view>
			</block> -->
			<view class='column'>
				<text class='name'>数量</text>
				<view class='content'>
					<!-- <image class='reduce' bindtap='reduceNum' src='../static/ic_reduce.png'></image> -->
					<text class='num'>1</text>
					<!-- <image class='add' bindtap='addNum' src='../static/ic_add.png'></image> -->
				</view>
			</view>
			<view class='submit'>确 定</view>
		</view>

		<!-- <wxs src="../../wxs/price.wxs" module="price"></wxs> -->
	</div>
</template>

<script>
// 	export default {
// 		props: ['data'],
// 		data(){
// 			return{
// 				
// 			}
// 		}
// 	}
</script>

<style>
	.mask {
		width: 100%;
		height: 100%;
		position: fixed;
		top: 0;
		left: 0;
		background: #000;
		opacity: 0.2;
		overflow: hidden;
		z-index: 98;
		color: #fff;
	}

	.select-window {
		width: 100%;
		overflow: hidden;
		position: fixed;
		bottom: 0;
		left: 0;
		z-index: 10001;
		background: #fff;
		border-top-left-radius: 20rpx;
		border-top-right-radius: 20rpx;
	}

	.select-window .close {
		width: 30rpx;
		height: 30rpx;
		position: absolute;
		top: 40rpx;
		right: 30rpx;
	}

	.select-window .image {
		width: 160rpx;
		height: 160rpx;
		margin-left: 40rpx;
		margin-top: 40rpx;
		border-radius: 20rpx;
		float: left;
	}

	.select-window .title {
		width: calc(100% - 290rpx);
		font-size: 28rpx;
		color: #333;
		float: left;
		padding-right: 40rpx;
		margin-top: 40rpx;
		margin-left: 30rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		font-weight: bold;
	}

	.select-window .price-box {
		width: calc(100% - 290rpx);
		margin-top: 120rpx;
		margin-left: 30rpx;
		display: flex;
		align-items: flex-end;
	}

	.select-window .price {
		font-size: 36rpx;
		color: #e84118;
		font-weight: bold;
		margin-left: 30rpx;
		margin-bottom: -5rpx;
		float: left;
	}

	.select-window .sub-price {
		font-size: 18rpx;
		color: #e84118;
		font-weight: bold;
		float: left;
	}

	.select-window .cost-price {
		font-size: 18rpx;
		color: #888;
		text-decoration: line-through;
		margin-left: 20rpx;
		float: left;
		font-weight: 500;
	}

	.select-window .stock {
		font-size: 20rpx;
		color: #888;
		margin-left: 20rpx;
		float: left;
		font-weight: 500;
	}

	.select-window .select-text {
		width: calc(100% - 300rpx);
		font-size: 22rpx;
		color: #333;
		margin-left: 20rpx;
		float: left;
		font-weight: 500;
	}

	.select-window .column {
		width: calc(100% - 80rpx);
		padding-top: 10rpx;
		padding-bottom: 10rpx;
		margin-left: 40rpx;
		margin-right: 40rpx;
		display: inline-flex;
	}

	.select-window .column .name {
		width: 80rpx;
		height: 40rpx;
		line-height: 40rpx;
		font-size: 20rpx;
		color: #333;
		font-weight: 500;
	}

	.select-window .column .content {
		width: calc(100% - 80rpx);
		display: flex;
		flex-wrap: wrap;
	}

	.select-window .column .content .spec {
		height: 40rpx;
		line-height: 40rpx;
		border: solid 1rpx #ccc;
		padding-left: 25rpx;
		padding-right: 25rpx;
		font-size: 20rpx;
		color: #ccc;
		border-radius: 30rpx;
		margin: 5rpx 10rpx 5rpx 10rpx;
	}

	.select-window .column .content .select {
		border: solid 1rpx #1dc422;
		color: #1dc422;
	}

	.select-window .column .content .reduce,
	.select-window .column .content .add {
		width: 40rpx;
		height: 40rpx;
		float: left;
	}

	.select-window .column .content .num {
		width: 60rpx;
		height: 40rpx;
		text-align: center;
		line-height: 40rpx;
		font-size: 20rpx;
		color: #333;
		font-weight: 500;
		float: left;
	}

	.select-window .submit {
		width: 100%;
		height: 88rpx;
		line-height: 88rpx;
		background: #e84118;
		text-align: center;
		font-size: 28rpx;
		color: #fff;
		margin-top: 30rpx;
		font-weight: bold;
	}
</style>
