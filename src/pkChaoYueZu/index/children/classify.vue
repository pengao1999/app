<template>
	<view>
		<img class="product-banner" v-if="showBanner=='true'" :src="imgRoot + classify.cate_img" style="margin: 30upx;">
		<view class="uni-product-list">
		  <view
		    class="uni-product"
		    v-for="(product,index) in list"
		    @click="toProduct(product.goods_key)"
		    :key="index"
		  >
		    <view class="image-view">
		      <image class="uni-product-image" v-if="product.pic!=''" :src="imgRoot+product.pic" />
		      <image class="uni-product-image bg-gray" v-else />
		    </view>
		    <view
		      class="uni-product-title one-line-dot text-center uni-bold"
		      v-if="product.name!=''"
		    >{{product.name}}</view>
		    <view
		      class="uni-product-title bg-gray"
		      style="width: 120upx;height: 30upx;height: 80upx;"
		      v-else
		    >{{product.name}}</view>
		    <view class="row-container">
		      <view class="uni-product-price text-center" v-if="product.price!=''" style="width: 185upx;">
		        <text
		          class="uni-product-price-original"
		          style="font-size: 22upx;color:#e84118"
		        >￥{{product.price.toFixed(2)}}</text>
		
		        <text
		          class="uni-product-price-favour"
		          style="font-size: 24upx;"
		        >/{{product.unit}}</text>
		      </view>
		      <view
		        class="uni-product-title bg-gray"
		        style="width: 120upx;height: 30upx;margin-top: 6upx;"
		        v-else
		      >{{product.name}}</view>
		      <!-- <view class="add-reduce-container row-container fade-in" style="width: 140upx;">
								<image class="uni-icon uni-icon-minus-filled btn-container" :lazy-load="true" style="width:50upx;height:50upx;font-size: 24px;color:#aaaaaa"></image>
								<view class="btn-container" style="width: 40upx;">10</view>
								<image class="uni-icon uni-icon-plus-filled btn-container" :lazy-load="true" style="width:50upx;height:50upx;font-size: 24px;color:#e84118"></image>
		      </view>-->
		    </view>
		  </view>
		</view>
	</view>
</template>

<script>
	import Config from '@/common/js/Config.js'
	export default {
		data() {
			return {
				list: [],
				imgRoot: '',
				classify : {},
				showBanner: 'false'
			}
		},
		onLoad(options) {
			this.classify = uni.getStorageSync("children_classify")
			uni.setNavigationBarTitle({
				title: this.classify.name
			})
			this.showBanner = options.showBanner
			this.getCategoryGoods(options.key)
		},
		methods: {
			toProduct: function (key) {
			  // window.location.href = 'http://www.baidu.com'
			  // window.open('http://h5app.test.youxuanbest.com/#/pkPointMall/index/detail?id='+id+'&token=' + this.point_token, '商品详情')
			  uni.navigateTo({
			    url: '/pkChaoYueZu/index/detail?key=' + key
			  })
			},
			getCategoryGoods(key) {
				let self = this
				let postData = {
					page: 1,
					size: 100,
					category_key: key,
					app_key: "123",
				}
				self.$Phttp.post(Config.JAVA_SAAS_URLS.getCategoryGoods, postData).then(res => {
					res = res.data
					if (res.code === 0) {
						self.list = res.data.list
						self.imgRoot = res.other.img_root
					}
					console.log(self.list)
				})
			}
		}
	}
</script>

<style scoped>
	.product-banner {
	    width: 690upx;
	    height: 160upx;
	}
</style>
