<template>
	<!-- 导航栏板块 -->
	<view class="index-navlist">
		<view class="navlist-item-container" :style="navStyle" v-for="(nav,index) in navlist" :key="nav.category_key" v-if="index < 10"
		 @tap="toNavList(index)">
			<view class="nalist-item">
				<image v-if="nav.cate_img!=''" :src="nav.cate_img"></image>
				<image class="bg-gray" v-else :src="nav.cate_img"></image>
				<view class="is-size-14 one-line-dot" v-if="nav.name!=''">{{nav['name']}}</view>
				<view class="is-size-14 one-line-dot bg-gray" style="width: 60%;margin-left:20%;height: 30upx;" v-else></view>
			</view>
		</view>
	</view>
	<!-- 导航栏板块 -->
</template>

<script>
	import Util from '@/common/js/util.js'
	export default {
		data() {
			return {
				navlist: [],
				navStyle: ''
			}
		},
		props: {
			propData: {
				type: Array,
				default () {
					return []
				}
			}
		},
		watch: {
			propData: {
				handler() {
					this.navlist = []
					this.navlist = Util.obj2Array(Object.assign({}, this.navlist, this.propData))
					if (this.navlist.length > 4) {
						let length = this.navlist.length >= 10 ? 10 : this.navlist.length
						let perLineNum = length > 5 ? Math.ceil(length / 2) : length
						this.navStyle = 'width:' + (100 / perLineNum) + '%'
					}
				},
				immediate: true
			}
		},
		methods: {
			toNavList: function(index) {
				console.log(index)
				let sindex = 0
				if (index == 0) {
					sindex = 4
				} else if (index == 1) {
					sindex = 0
				} else if (index == 2) {
					sindex = 6
				} else if (index == 3) {
					console.log('进来了')
					sindex = 5
				} else if (index == 4) {
					sindex = 7
				}
				console.log(sindex)
				this.$emit('clickNavList', sindex)
				// this.$emit('clickNavList', index)
			}
		}
	}
</script>

<style scoped lang="scss">
	/* 导航模块 */
	.index-navlist {
		border-bottom: 10upx;
		padding-top: 20upx !important;
		padding-bottom: 20upx !important;
		display: flex;
		flex-direction: row;
		justify-content: space-around;
		flex-wrap: wrap;

		.navlist-item-container {
			text-align: center !important;
			display: flex;
			flex-direction: column;

			.nalist-item {
				padding-top: 10upx !important;
				padding-bottom: 10upx !important;
				font-size: 25upx;

				// color: #333333;
				image {
					width: 70upx;
					height: 70upx;
					display: inline-block;
					overflow: hidden;
				}
			}
		}
	}

	/* 导航模块 */
</style>
