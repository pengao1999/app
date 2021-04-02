<template>
	<view class="tabs-card">
		<!-- <image :src="image_root + item.pic" mode=""></image> -->
		<view class="productCard coloum-container shadow-warp" style="border-radius: 10upx;" @click="clickItem()">
			<img class="productImg bg-gray" :src="image_root+item.pic">
			<view class="productInfoContainer">
				<view class="row-container">
					<!-- <view class="cu-tag" style="background: #FEEEEE;color:#FF6060;text-align: center;" v-if="tag">{{tag}}</view> -->
					<view class="one-line-dot" style="width: calc(100% - 60upx); color: #999999;margin-left: 5upx;">{{item.name}}</view>
				</view>
				<view style="color: #222222;margin-top: 5upx" v-if="item.original_price">¥{{item.original_price.toFixed(2)}}元</view>
				<view class="row-container align-center" style="margin-top: 6upx;">
					<view class="cu-capsule radius">
						<!-- <view class='cu-tag sm' style="background: #3D3129;padding-left: 4upx;padding-right: 4upx;">
		                    <text class='icon-crownfill' style="color:#F2CDAF;font-size: 18upx;"></text>
		                </view> -->

						<!-- <view class="cu-tag sm" style="color:#3B2F26;background: #EDC79B;margin-left: 0;padding-left: 4upx;padding-right: 4upx;font-size: 8upx;">
		                    会员折扣
		                </view> -->
					</view>
					<!-- <image src="/static/chaoyuezu/index/vip.png" mode="widthFix" style="width: 140upx;"></image>
					<image style="width: 150upx;margin-left: 20upx;" mode="widthFix" src="/static/chaoyuezu/index/shareGoods.png"></image> -->
					<!-- <view class="cu-tag sm text-white" style="background: linear-gradient(180deg,rgba(82,171,252,1) 0%,rgba(6,135,255,1) 100%);padding-left: 4upx;padding-right: 4upx;font-size: 18upx;margin-left: 10upx;">
		                分享免租金
		            </view> -->
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		components: {

		},
		props: {
			item: {
				type: [Object, Array],
				default: () => {}
			},
			image_root: {
				type: String,
				default: ''
			}
		},
		data() {
			return {

			}
		},
		methods: {
			clickItem() {
				this.$emit("clickItem", this.item.goods_key)
			}
		},
	}
</script>

<style lang="scss" scoped>
	.tabs-card {
		width: 90%;
		height: 500rpx;
		background-color: white;
		margin: 5% 5% 0 5%;
		display: flex;
		flex-wrap: wrap;
		border-radius: 20upx;
	}
	.productCard {
	    width: 334upx;
	    height: 538upx;
	    border-radius:8upx;
	    .productImg {
	        width: 100%;
	        height: 334upx;
	        border-top-left-radius: 8upx;
	        border-top-right-radius: 8upx;
	    }
	    .productInfoContainer {
	        padding: 20upx 30upx 30upx 30upx;
	    }
	}

	// .productCard {
	// 	width: 334upx;
	// 	height: 498upx;
	// 	border-radius: 8upx;
	// 	justify-content: center;
	// 	align-items: center;
	// }

	// .productImg {
	// 	width: 280upx;
	// 	height: 304upx;
	// 	border-top-left-radius: 8upx;
	// 	border-top-right-radius: 8upx;
	// }

	// .productInfoContainer {
	// 	padding: 20upx 10upx 20upx 20upx;
	// 	align-items: flex-start;
	// }
</style>
