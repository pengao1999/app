<template>
	<view v-if="show" class="bottom-cart round bg-gray flex-container justify-center align-center" src="/static/home.png" @click="toCart">
		<text class="icon-cart" style="font-size: 45upx;"></text>
	</view>
</template>

<script>
	import Toast from '@/common/js/toast.js'
	import {mapMutations} from 'vuex'
	export default {
		mixins: [Toast],
		props: {
			show: {
				type: Boolean,
				default: true
			}
		},
		methods: {
			...mapMutations(['logout']),
			toCart: function() {
				let self = this
				// self.logout()
				// self.toast({
				// 	desc: '清除成功'
				// })
				uni.navigateTo({
					url: '/pkPointMall/cart/cart'
				})
			}
		}
	}
</script>

<style>
	.bottom-cart {
		position: fixed;
		bottom: 20upx;
		right: 30upx;
		width: 80upx;
		height: 80upx;
		opacity: 0.7;
	}
</style>
