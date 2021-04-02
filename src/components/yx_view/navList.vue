<template>
	<div>
	<!-- 导航栏板块 -->
	<view class="index-navlist" >
		<!--  #ifdef  MP-WEIXIN -->
		<view class="navlist-item-container" v-for="(nav,index) in navlist" :key="index" @tap="toNavList(nav.url,nav.title)">
		<!--  #endif -->
		<!--  #ifdef  APP-PLUS || H5 -->
		<view class="navlist-item-container" style="width: 33.3%;" v-for="(nav,index) in navlist" :key="index" @tap="toNavList(nav.url,nav.title)">
		<!--  #endif -->
			<!--  #ifdef  MP-WEIXIN -->
			<button class="nalist-item" style="background-color:white;" open-type="contact" v-if="index==1">
				<image :src="nav.image" :lazy-load="true" mode="widthFix"></image>
				<view class="is-size-14" style="line-height:1.2;">{{nav['title']}}</view>
			</button>
			<view class="nalist-item" @tap.stop="navClick(nav.tap)" v-else>
				<image :src="nav.image" :lazy-load="true" mode="widthFix"></image>
				<view class="is-size-14">{{nav['title']}}</view>
			</view>
			<!--  #endif -->
			<!--  #ifdef  APP-PLUS || H5 -->
			<view class="nalist-item" @tap.stop="navClick(nav.tap)" v-if="index!=1">
				<image :src="nav.image" :lazy-load="true" mode="widthFix"></image>
				<view class="is-size-14">{{nav['title']}}</view>
			</view>
			<!--  #endif -->
		</view>
	</view>
	<!-- 导航栏板块 -->
	</div>
</template>

<script>
	export default {
		data() {
			return {
				navlist:[]
			}
		},
		props: {
			propData: {
				type: Array,
				default() {
					return []
				}
			}
		},
		watch: {
			propData: {
				handler() {
					this.navlist = Object.assign({}, this.navlist, this.propData)
				},
				immediate: true
			}
		},
		methods: {
			navClick: function(tap) {
				this.$emit('navClick', tap)
			}
		}
	}
</script>

<style lang="scss">
	/* 导航模块 */
	.index-navlist {
		border-bottom:10upx;
		padding-top:20upx !important;
		padding-bottom:20upx !important;
		position:relative;
		overflow:hidden;
		.navlist-item-container {
			text-align:center !important;
			display:block;
			width:25%;
			float:left;
			-webkit-box-flex:0;
			-ms-flex:0 0 auto;
			-webkit-flex:0 0 auto;
			flex:0 0 auto;
			.nalist-item {
				padding-top:10upx !important;
				padding-bottom:10upx !important;
				font-size:22upx !important;
				color: #333333;
				image {
					width:70upx;
					height:70upx;
					display:inline-block;
					overflow:hidden;
				}
			}
			.nalist-item:after {
				border: 0upx;
			}
		}
	}
	/* 导航模块 */
</style>
