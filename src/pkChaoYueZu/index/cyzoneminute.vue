<template>
	<view class="container">
		<bw-swiper :swiperList="swiperList" :circular='false' :autoplay='false' :indicatorActiveColor="'#52ABFC'" :fullScreen='true'
		 :imageKey="'img'" :textKey="'imgtext'" @change='change' style="width:100%"></bw-swiper>
		<transition name="btntransition">
			<view class="flex_go" v-if="isshow" @click.stop="tomain">
				进入超悦租
			</view>
		</transition>
	</view>
</template>

<script>
	import bwSwiper from '@/wxcomponents/bw-swiper/bw-swiper.vue'
	export default {
		data() {
			return {
				swiperList: [{
						img: '/static/lcimg/APP1.jpg',
						imgtext: 'APP1.jpg'
					},
					{
						img: '/static/lcimg/APP2.jpg',
						imgtext: 'APP2.jpg'
					},
					{
						img: '/static/lcimg/APP3.jpg',
						imgtext: 'APP3.jpg'
					}
				],
				isshow: false
			}
		},
		components: {
			bwSwiper
		},
		onLoad(options) {

		},
		methods: {
			change: function(e) {
				e.detail.current == this.swiperList.length - 1 ? this.isshow = true : this.isshow = false
			},
			tomain: function() {
				uni.reLaunch({
					url:'/pkChaoYueZu/index/main'
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	.flex_go {
		width: fit-content;
		position: fixed;
		bottom: 88rpx;
		left: 0;
		right: 0;
		color: red;
		font-size: 30rpx;
		font-weight: bolder;
		margin: auto;
		width: 165px;
		height: 47px;
		line-height: 47px;
		background: -webkit-linear-gradient(left, #52abfc 0%, #0687ff 100%);
		background: linear-gradient(90deg, #52abfc 0%, #0687ff 100%);
		border-radius: 23px;
		color: #fff;
		text-align: center;
		font-size: 18px;
	}

	.btntransition-enter-active {
		transition: opacity 0.5s
	}

	.btntransition-leave-active {
		transition: opacity 0s
	}

	.btntransition-enter,
	.btntransition-leave-to {
		opacity: 0
	}
</style>
