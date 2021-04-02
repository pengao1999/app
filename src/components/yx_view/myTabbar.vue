<template>
	<scroll-view id="tab-bar" class="tab" scroll-x :scroll-with-animation="true" :scroll-left="scrollX">
		<view class="uni-swiper-tab" :style="'width:'+ cTabBars.length*75 + 'px;'">
			<view :id="'tab'+index" v-for="(tab,index) in cTabBars" :key="tab.id" :class="['swiper-tab-list',cIndex==index ? 'active' : '']" @tap="tapTab(index)">
				<view>{{tab.name}}</view>
				<image v-if="tab.recommend" class="tab-icon" src="../../static/hot.gif"></image>
			</view>
		 </view>
		<view class="line-controller" :style="'transform:translateX('+100*cIndex+'%);'">
			<view class="line"></view>
		</view>
	</scroll-view>
</template>

<script>
	export default {
		data() {
			return {
				scrollX: 0,
			}
		},
		props: {
			cTabBars: {
				type: Array,
				default() {
					return []
				}
			},
			cIndex: {
				type: Number,
				default: 0
			}
		},
		watch: {
			cIndex: {
				handler() {
					if (this.cIndex === 0) {
						this.scrollX = 0
					}
				}
			}
		},
		onLoad() {
		},
		methods: {
			tapTab: function(index) {
				this.scrollX = 75*index-60
				this.$emit('tapTab', index)
			}
		}
	}
</script>

<style>
	.tab {
		height: 90upx;
		width: 92%;
		display: flex;
		flex-direction: column;
		margin-left: 4%;
	}
	.tab .line-controller {
		width: 150upx;
		position: relative;
		bottom: 0;
		left: 0;
		height: 10rpx;
		transition: all .3s ease-out .1s;
		display: flex;
		align-content: center;
		justify-content: center;
	}
	.line {
		height: 100%;
		width: 50upx;
		background: #1dc422;
		border-radius: 10upx;
	}
	.uni-swiper-tab {
		display: flex;
		flex-direction: row;
		line-height: 80upx;
		height: 80upx;
	}
	.swiper-tab-list {
		font-size: 28upx;
		width: 150upx;
		text-align: center;
		color: #333;
	}
	.uni-swiper-tab .active {
		font-size: 32upx;
		color: black;
		font-weight: bold;
		border-bottom: 3upx
	}
	.uni-tab-bar .active {
		color: #007AFF;
	}
	
	.uni-tab-bar .swiper-box {
		flex: 1;
		width: 100%;
		height: calc(100% - 100upx);
	}
	.tab-icon {
		width: 26upx;
		height: 13upx;
		float: right;
		margin-top: -60upx;
		margin-right: -10upx;
	}
	::-webkit-scrollbar{
		width: 0;
		height: 0;
		color: transparent;
	}
	.uni-swiper-tab {
		border-bottom: 0upx;
	}
</style>
