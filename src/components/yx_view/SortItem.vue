<template>
	<block>
		<view class="row-container fixed-top bg-white" style="height: 88upx;border-bottom: 1px solid #F8F8F8;width: 100%;">
			<view class="flex-container justify-center align-center" style="width: 250upx;height: 100%;" @click="tab(0)">
				<view class="flex-container justify-center align-center" :style="curItem==0?'border-bottom: 2px solid var(--orange);':''" :class="curItem==0?'text-orange':''" style="height: 100%;width: 100upx;">
					综合
				</view>
			</view>
			<view class="flex-container justify-center align-center" style="width: 250upx;height: 100%;"  @click="tab(1)">
				<view class="row-container justify-center align-center" :style="curItem==1?'border-bottom: 2px solid var(--orange);':''" :class="curItem==1?'text-orange':''" style="height: 100%;width: 100upx;">
					销量
					<view class="coloum-container">
						<text class="icon-fold" v-if="is_sales_up || curItem!=1" style="line-height: 0.5;"></text>
						<text class="icon-unfold" v-if="!is_sales_up || curItem!=1" style="line-height: 0.5;"></text>
					</view>
				</view>
			</view>
			<view class="flex-container justify-center align-center" style="width: 250upx;height: 100%;"  @click="tab(2)">
				<view class="row-container justify-center align-center" :style="curItem==2?'border-bottom: 2px solid var(--orange);':''" :class="curItem==2?'text-orange':''" style="height: 100%;width: 100upx;">
					<text>价格</text>
					<view class="coloum-container">
						<text class="icon-fold" v-if="is_price_up || curItem!=2" style="line-height: 0.5;"></text>
						<text class="icon-unfold" v-if="!is_price_up || curItem!=2" style="line-height: 0.5;"></text>
					</view>
				</view>
			</view>
		</view>
	</block>
</template>

<script>
	export default {
		data() {
			return {
				is_price_up: false,
				is_sales_up: false
			}
		},
		props: {
			curItem: {
				type: Number,
				default: 0
			}
		},
		methods: {
			tab(curIndex) {
				let is_up = false
				if (curIndex===1) {
					this.is_sales_up = !this.is_sales_up
					is_up = this.is_sales_up
				}
				if (curIndex===2) {
					this.is_price_up = !this.is_price_up
					is_up = this.is_price_up
				}
				this.$emit('clickTab', {curItem: curIndex, is_up: is_up})
			}
		}
	}
</script>

<style lang="scss">
	.fixed-top {
		position: fixed;
		top: 0;
		z-index: 999;
	}
</style>
