<template>
</template>

<template>
	<view style="background-color: #FFFFFF;height: 100%;">
		<view class="top coloum-container" style="height: 100%;">
			<view class="swiper-scoll">
				<v-tabs v-model="current" :scroll="false" :fixed="true" :tabs="tabs" @change="vtabschange"></v-tabs>
			</view>
			<view class="vtansswiper-box">
				<swiper class="vswiper-box" :current="current" :indicator-dots="indicatorDots" :autoplay="autoplay" :interval="interval"
				 :duration="duration" @change="swiperchange">
					<swiper-item>
						<scroll-view scroll-y="true" style="height: 100%;">
							<view class="scbox">
								<block v-for="(item,index) in resobj" :key="index">
									<view class="bgpic" :style="{'background-image':bgimgarr[item.CommissionIsactive]}">
										<view class="bgpic-left">
											<view style="font-size: 18rpx;color: #FFFFFF;line-height: 1 !important;">
												{{item.CommissionName}}
											</view>
											<view style="font-size: 18rpx;color: #FFFFFF;text-align: center;line-height: 1 !important;">
												{{item.CommissionAbout}}
											</view>
											<view style="display: flex;justify-content: center;align-items: center;">
												<view style="font-size: 18rpx;color: #FFFFFF;line-height: 1 !important;">
													{{item.CommissionStarttime}}
												</view> 
												<view style="font-size: 10rpx;color: #FFFFFF;line-height: 1 !important;">~</view> 
												<view style="font-size: 18rpx;color: #FFFFFF;line-height: 1 !important;">
													{{item.CommissionEndtime}}
												</view>
											</view>
										</view>
										<view class="bgpic-right">
											<view style="font-size: 50rpx;font-weight: bolder;color: rgb(255,215,0);">
												￥{{item.CommissionMoney}}
											</view>
										</view>
									</view>
								</block>
							</view>
						</scroll-view>
					</swiper-item>
					<swiper-item>
						<scroll-view scroll-y="true" style="height: 100%;">
							<view class="scbox">
								<block v-for="(item,index) in resobj" :key="index">
									<view class="bgpic" :style="{'background-image':bgimgarr[item.CommissionIsactive]}">
										<view class="bgpic-left">
											<view style="font-size: 18rpx;color: #FFFFFF;line-height: 1 !important;">
												{{item.CommissionName}}
											</view>
											<view style="font-size: 18rpx;color: #FFFFFF;text-align: center;line-height: 1 !important;">
												{{item.CommissionAbout}}
											</view>
											<view style="display: flex;justify-content: center;align-items: center;">
												<view style="font-size: 18rpx;color: #FFFFFF;line-height: 1 !important;">
													{{item.CommissionStarttime}}
												</view> 
												<view style="font-size: 10rpx;color: #FFFFFF;line-height: 1 !important;">~</view> 
												<view style="font-size: 18rpx;color: #FFFFFF;line-height: 1 !important;">
													{{item.CommissionEndtime}}
												</view>
											</view>
										</view>
										<view class="bgpic-right">
											<view style="font-size: 50rpx;font-weight: bolder;color: rgb(255,215,0);">
												￥{{item.CommissionMoney}}
											</view>
										</view>
									</view>
								</block>
							</view>
						</scroll-view>
					</swiper-item>
					<swiper-item>
						<scroll-view scroll-y="true" style="height: 100%;">
							<view class="scbox">
								<block v-for="(item,index) in resobj" :key="index">
									<view class="bgpic" :style="{'background-image':bgimgarr[item.CommissionIsactive]}">
										<view class="bgpic-left">
											<view style="font-size: 18rpx;color: #FFFFFF;line-height: 1 !important;">
												{{item.CommissionName}}
											</view>
											<view style="font-size: 18rpx;color: #FFFFFF;text-align: center;line-height: 1 !important;">
												{{item.CommissionAbout}}
											</view>
											<view style="display: flex;justify-content: center;align-items: center;">
												<view style="font-size: 18rpx;color: #FFFFFF;line-height: 1 !important;">
													{{item.CommissionStarttime}}
												</view> 
												<view style="font-size: 10rpx;color: #FFFFFF;line-height: 1 !important;">~</view> 
												<view style="font-size: 18rpx;color: #FFFFFF;line-height: 1 !important;">
													{{item.CommissionEndtime}}
												</view>
											</view>
										</view>
										<view class="bgpic-right">
											<view style="font-size: 50rpx;font-weight: bolder;color: rgb(255,215,0);">
												￥{{item.CommissionMoney}}
											</view>
										</view>
									</view>
								</block>
							</view>
						</scroll-view>
					</swiper-item>
					<swiper-item>
						<scroll-view scroll-y="true" style="height: 100%;">
							<view class="scbox">
								<block v-for="(item,index) in resobj" :key="index">
									<view class="bgpic" :style="{'background-image':bgimgarr[item.CommissionIsactive]}">
										<view class="bgpic-left">
											<view style="font-size: 18rpx;color: #FFFFFF;line-height: 1 !important;">
												{{item.CommissionName}}
											</view>
											<view style="font-size: 18rpx;color: #FFFFFF;text-align: center;line-height: 1 !important;">
												{{item.CommissionAbout}}
											</view>
											<view style="display: flex;justify-content: center;align-items: center;">
												<view style="font-size: 18rpx;color: #FFFFFF;line-height: 1 !important;">
													{{item.CommissionStarttime}}
												</view> 
												<view style="font-size: 10rpx;color: #FFFFFF;line-height: 1 !important;">~</view> 
												<view style="font-size: 18rpx;color: #FFFFFF;line-height: 1 !important;">
													{{item.CommissionEndtime}}
												</view>
											</view>
										</view>
										<view class="bgpic-right">
											<view style="font-size: 50rpx;font-weight: bolder;color: rgb(255,215,0);">
												￥{{item.CommissionMoney}}
											</view>
										</view>
									</view>
								</block>
							</view>
						</scroll-view>
					</swiper-item>
				</swiper>
			</view>
		</view>
	</view>
</template>
<script>
	import vTabs from '@/components/v-tabs/v-tabs.vue'
	export default {
		data() {
			return {
				current: 0,
				tabs: ['全部', '未使用', '已使用', '已过期'],
				bgimgarr: ['url(../../../static/lcimg/useimg.jpg)', 'url(../../../static/lcimg/usedimg.jpg)',
					'url(../../../static/lcimg/overtimeimg.jpg)'
				],
				resobj: [{
						'CommissionName': '超悦租专享优惠券',
						'CommissionMoney': 50,
						'CommissionAbout': '满400减50',
						'CommissionStarttime': '2015-11-10',
						'CommissionEndtime': '2015-12-10',
						'CommissionIsactive': 0,
					},
					{
						'CommissionName': '超悦租专享优惠券',
						'CommissionMoney': 100,
						'CommissionAbout': '满400减50满400减50满400减50满400减50',
						'CommissionStarttime': '2015-11-10',
						'CommissionEndtime': '2015-12-10',
						'CommissionIsactive': 0
					},
					{
						'CommissionName': '超悦租专享优惠券',
						'CommissionMoney': 100,
						'CommissionAbout': '满400减50满400减50满400减50满400减50',
						'CommissionStarttime': '2015-11-10',
						'CommissionEndtime': '2015-12-10',
						'CommissionIsactive': 1
					},
					{
						'CommissionName': '超悦租专享优惠券',
						'CommissionMoney': 100,
						'CommissionAbout': '满400减50满400减50满400减50满400减50',
						'CommissionStarttime': '2015-11-10',
						'CommissionEndtime': '2015-12-10',
						'CommissionIsactive': 1
					},
					{
						'CommissionName': '超悦租专享优惠券',
						'CommissionMoney': 100,
						'CommissionAbout': '满400减50满400减50满400减50满400减50',
						'CommissionStarttime': '2015-11-10',
						'CommissionEndtime': '2015-12-10',
						'CommissionIsactive': 2
					},
					{
						'CommissionName': '超悦租专享优惠券',
						'CommissionMoney': 100,
						'CommissionAbout': '满400减50满400减50满400减50满400减50',
						'CommissionStarttime': '2015-11-10',
						'CommissionEndtime': '2015-12-10',
						'CommissionIsactive': 2
					}
				]
			}
		},
		components: {
			vTabs
		},
		onLoad() {
			console.log(this.bgimgarr[0])
		},
		methods: {
			vtabschange(e) {

			},
			swiperchange(event) {
				console.log(event)
				this.current = event.detail.current
			}
		}
	}
</script>

<style lang="scss" scoped>
	.swiper-scoll {
		width: 100%;
		position: relative;
	}

	.vtansswiper-box {
		width: 100%;
		height: calc(100% - 70rpx);

		.vswiper-box {
			width: 100%;
			height: 100%;
		}
	}

	.scbox {
		width: 100%;
		padding: 25upx;
		box-sizing: border-box;

		.bgpic {
			width: 100%;
			height: 170upx;
			margin-bottom: 25upx;
			background-size: 100%;
			display: flex;
			align-items: center;
			justify-content: center;
			.bgpic-left{
				width: 410upx;
				height: calc(100% - 18upx);
				box-sizing: border-box;
				padding: 20upx;
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				align-items: center;
			}
			.bgpic-right{
				width: 250upx;
				height: calc(100% - 18upx);
				display: flex;
				align-items: center;
				justify-content: center;
			}
		}
	}
</style>
