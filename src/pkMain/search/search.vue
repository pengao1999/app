<template>
	<view class="">
		<!-- <block  v-if="!loginDialogData.show"> -->
		<view>
			<view class="input-view">
				<image src="../../static/ic_search.png" class="search"></image>
				<input confirm-type="search" @confirm="confirm" v-model="searchKey" class="input" type="text" placeholder="输入商品名称/关键词" @focus="onFocus" @blur="onBlur"/>
			</view>
			<view class="search-button">
				<text class="right" @tap="search">搜索</text>
			</view>
		</view>
		<!-- 标题栏和状态栏占位符 -->
		<view class="titleNview-placing" :style="'height:'+navHeight+'px;'"></view>
		<view class="hot">热门搜索</view>
		<view class="uni-flex uni-row" style="flex-wrap: wrap; margin-top: 20upx;">
			
			<view class="text flexItem" v-for="(item,index) in titleData" :key="index" @tap="searchTitle(item)">
				{{item}}
			</view>
		</view>
	</view>
</template>


<style lang="scss">
	.titleNview-placing {
		background: rgba(255,255,255,1);
	}
	.input-view {
		margin-left: 18upx;
		left: 50%;
		transform: translateX(-50%);
		position: absolute;
		width:480upx;
		display: flex;
		align-items:center;
		height: 60upx;
		background:rgba(244,244,244,1);
		border-radius:35upx;
		padding: 0 30upx;
		flex-wrap:nowrap;
		margin-top: 17upx;
		line-height:60upx;
		.search{
			width: 26upx;
			height: 26upx;
		}
		.input {
			margin-left: 10upx;
			flex: 1;
			border-radius:30upx;
			font-family:PingFang-SC-Medium;
			font-weight:500;
			padding: 16upx;
			font-size:28upx;
		}
	}
	.right{
		width: 50upx;
		margin-top: 5upx;
		font-size:25upx;
		font-family:PingFang-SC-Bold;
		font-weight:bold;
	}
	.hot{
		margin-left: 31upx;
		margin-top: 60upx;
		font-size:26upx;
		font-family:PingFang-SC-Bold;
		font-weight:bold;
		color:rgba(51,51,51,1);
	}
	.search-button{
		text-align: right;
		height: 60upx;
		line-height:60upx ;
		padding-top:12upx;
		padding-right: 15upx;
	}
	.flexItem{
		height: 60upx;
		line-height: 60upx;
		width: 200upx;
		text-align: center;
		margin-left: 37.5upx;
		margin-top: 30upx;
		background:rgba(255,255,255,1);
		border-radius:30px;
		font-size: 28upx;
		font-family:PingFang-SC-Medium;
		font-weight:500;
		color:rgba(252,93,60,1);
	}
</style>
