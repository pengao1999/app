<template>
	<view class="productCard bg-white coloum-container shadow-warp" style="border-radius: 10upx;" @click="clickItem()">
		<image lazy-load class="productImg bg-gray" :src="img"></image>
		<view class="productInfoContainer">
			<view class="row-container">
				<view class="cu-tag" style="background: #FEEEEE;color:#FF6060;text-align: center;" v-if="tag">{{tag}}
				</view>
				<view class="one-line-dot" style="color: #999999;margin-left: 5upx;">{{title}}</view>
			</view>
			<view style="color: #222222;margin-top: 5upx" v-if="price">¥{{(price/30).toFixed(2)}}/天起</view>
			<view class="row-container align-center" style="margin-top: 6upx;">
				<view class="cu-capsule radius">
					<!-- <view class='cu-tag sm' style="background: #3D3129;padding-left: 4upx;padding-right: 4upx;">
                        <text class='icon-crownfill' style="color:#F2CDAF;font-size: 18upx;"></text>
                    </view> -->

					<!-- <view class="cu-tag sm" style="color:#3B2F26;background: #EDC79B;margin-left: 0;padding-left: 4upx;padding-right: 4upx;font-size: 8upx;">
                        会员折扣
                    </view> -->
				</view>
				<image lazy-load src="/static/chaoyuezu/index/vip.png" mode="widthFix" style="width: 140upx;"></image>
				<image lazy-load style="width: 150upx;margin-left: 20upx;" mode="widthFix"
					src="/static/chaoyuezu/index/shareGoods.png"></image>
				<!-- <view class="cu-tag sm text-white" style="background: linear-gradient(180deg,rgba(82,171,252,1) 0%,rgba(6,135,255,1) 100%);padding-left: 4upx;padding-right: 4upx;font-size: 18upx;margin-left: 10upx;">
                    分享免租金
                </view> -->
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "productCard",
		props: {
			img: {
				type: String,
				default: ''
			},
			title: {
				type: String,
				default: ''
			},
			productKey: {
				type: String,
				default: ''
			},
			price: {
				type: Number,
				default: 0
			},
			tag: {
				type: String,
				default: ""
			}
		},
		methods: {
			clickItem() {
				this.$emit("clickItem", this.productKey)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.productCard {
		width: 334upx;
		height: 538upx;
		border-radius: 8upx;

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
</style>
