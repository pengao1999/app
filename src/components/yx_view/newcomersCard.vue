<template>
	<view class="">
		<view class="ModuleTitle">
			<view class="title">新人专享</view>
			<view class="mores" @tap="loadMore">
				<view class="more">更多</view>
			</view>
		</view>
		<view class="" style="margin-left: 25upx;">
			<scroll-view class="scroll-view_H" scroll-x="true">
				<view class='scrollItem .item-saleout' v-for="(product, index) in productList" :key="index" :class="product.stock==0?'':'fade-in'" :style="product.opacityCustom?'opacity:0.6':''" @tap="toProduct(product,activity_key,activity_endtime)">
					<view class="sale-out" v-if="product.opacityCustom">{{product.opacityText}}</view>
					<image class="itemImg" :src="image_root+product.pic" lazy-load="true"></image>
					<view class="infos" > 
						<text class='desc'>{{product.name}}</text>
						<view class='info'>
							<view class='sales'>￥{{product.price}}</view>
						</view>
						<text class='price'>￥{{product.original_price}}</text>
					</view>
				</view>
			</scroll-view>
		</view>
		
	</view>
	
</template>

<script>
	import Config from '../../common/js/Config.js'
	import Toast from '../../common/js/toast.js'
	export default {
		data() {
			return {
				productList: [],
				image_root:'',
			}
		},
		props: {
			propData: {
				type: Object,
				default() {
					return {}
				}
			},
			pickData: {
				type: Object,
				default() {
					return {}
				}
			},
			activity_key: {
				type: String,
				default: '-'
			},
			activity_endtime: {
				type: String,
				default: '-'
			},
			userdata: {
				type: Object,
				default() {
					return {}
				}
			},
			cardI:{
				type: Number,
				default: 0
			}
			
			
		},
		watch: {
			cardI: {
				handler() {
					this.productList=[]
					this.getNewcomersGoods()
				},
				immediate: true
			}
		},
		mixins: [Toast],	
		mounted() {
			this.getNewcomersGoods()
		},
		methods: {
			getNewcomersGoods: function() {
				let self = this
				return
				let postData = {
					i:self.globalI,
					act_type:0,
					limit: Config.PAGE_LIMIT,
					leader_key: self.propData.leader_key,
					latitude: self.propData.latitude,
					longitude: self.propData.longitude,
					cat_key: 0,
					user_key: self.userdata.user_key
				}
				self.$http.post(Config.URLS.newcomersList, postData).then((res) => {
					self.toast(true)
					res = res.data
					if (res.code === 0) {
						let lists = res.data.goods
						self.productList=[]
						lists.forEach((item, index) => {
							item.opacityCustom = false
							if (item.stock === 0) {
								item.opacityCustom = true
								item.opacityText = '已抢光'
							}
							if (item.goods_begin_time > (new Date()).getTime()/1000) {
								item.opacityCustom = true
								item.opacityText = '活动未开始'
							}
							if (item.end_time2 < (new Date()).getTime()/1000) {
								item.opacityCustom = true
								item.opacityText = '活动已结束'
							}
							self.productList.push(item);
						})
					
					}
				}).catch((res)=>{
					
				})
			},
			toProduct: function(good,activity_key,activity_endtime) {
				let self = this
				self.$emit("setInChooseProductCartNum",good.cart_num)
				if (self.isToProduct) return
				self.isToProduct = true
				setTimeout(()=> {
					self.isToProduct = false
				}, 800)
				uni.navigateTo({
					url: '/pages/index/product?goods_key='+good.goods_key+"&activity_key="+activity_key+"&activity_endtime="+activity_endtime
				})
			},
			loadMore: function(){
				this.$emit('setNewPageTag');
				uni.switchTab({
					url: '/pages/category/category'
				})
			},
		
		}
	}
</script>

<style lang="scss">
	.ModuleTitle {
		height: 90upx;
		display: flex;
		align-items: center;
		flex-direction: row;
		background:rgba(244,244,244,1);
		.icon {
			width: 30upx;
			height: 30upx;
			// background: #333333;
			margin-left: 40upx;
		}
		.title {
			font-size: 26upx;
			margin-left: 21upx;
			font-family:PingFang-SC-Bold;
			font-weight:bold;
			color:rgba(51,51,51,1);
		}
		.mores{
			display: inline-flex;
			justify-content: center;
			align-items: center;
			margin-left: auto;
		}
		.more{
			font-size:26upx;
			font-family:PingFang-SC-Medium;
			font-weight:500;
			color:rgba(153,153,153,1);
			margin-right:15upx;
		}
		.moreImg{
			margin-right: 35upx;
			width: 10upx;
			height: 20upx;
		}
	}
	.scroll-view_H {
		
		background:rgba(255,255,255,1);
		border-radius:20upx;
		white-space: nowrap;
		// width: 100%;
// 		display:flex;
// 		flex-direction: row;
	}

	.scrollItem{
		margin: 5upx;
		display: inline-block;
		width: 200upx;
		height: 350upx;
		background: #fff;
		text-align: center;
		font-size: 36upx;
	}
// 		}
		.itemImg {
			width: 200upx;
			height: 200upx;
			border-radius: 20upx;
			// float: left;
		}
		
		
		.infos{
			// width: 200upx;
			height: 150upx;
			// background: red;
			display: flex;
			flex-direction: column;
		}
		.desc {
			text-align: center;
			font-size:24upx;
			font-family:PingFang-SC-Regular;
			font-weight:400;
			color:rgba(51,51,51,1);
			height: 40upx;
			line-height: 40upx;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
		
		
		.info {
			margin-top: 30upx;
			width: 200upx;
			margin-top: 10upx;
			display: flex;
			align-items: center;
			justify-content: center;
		}
		
		.sales {
			font-size:23upx;
			font-family:PingFang-SC-Bold;
			font-weight:bold;
			color:rgba(252,93,59,1);
			
		}
		
		.wuyuan {
			margin-left: 10upx;
			// padding-top: 1upx;
			font-family:PingFang-SC-Bold;
			font-weight:bold;
			font-size: 20upx;
			text-align: center;
			color: rgba(252,93,59,1);
			width:61upx;
			height:21upx;
			line-height: 21upx;
			border:1upx solid rgba(252,93,59,1);
			border-radius:22upx;
			// margin-left: auto;
		}
		
		.price {
			margin-top: 10upx;
			// margin-left: 30upx;
			text-align: center;
			font-size: 22upx;
			color: #888;
			font-weight: bold;
			text-decoration: line-through;
		}
		.item-saleout {
			stop-opacity: 0.7;
		}
		
		.sale-out {
			width: 150upx;
			height: 150upx;
			border-radius: 50%;
			color: white;
			background: black;
			opacity: 0.7;
			text-align: center;
			line-height: 150upx;
			position: absolute;
			margin-left: 35upx;
			margin-top: 35upx;
		}
</style>
