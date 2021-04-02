<template>
	<view class="container" style="background-color: #EFEFEF;min-height: 100vh;">
		<view class="block-container" style="width: 750upx;">
			<view class="justify-center" v-for="(item,index) in lists" :key="index" style="width:50%;display: flex;margin-bottom: 20upx;">
				<Tabcards :item="item" :image_root="image_root" @clickItem="toProduct"></Tabcards>
				<!-- <product-card :img="imgRoot+product.pic" :price="product.price" :title="product.name" :productKey="product.goods_key" @clickItem="toProduct"></product-card> -->
			</view>
		</view>
		<view style="height: 100upx;"></view>
	</view>
</template>

<script>
	import Tabcards from './tabs-card.vue'

	//组件必须
	import {
		QSTabsWxsListMixin
	} from '../mixins/QS-tabs-wxs-list-mixin.js';
	export default {
		components: {
			Tabcards
		},
		props: {
			lists: {
				type: Array,
				default: () => []
			},
			image_root: {
				type: String,
				default: ''
			}
		},
		watch: {
			lists:{
				handler:function(val,oldval){
					const self = this
					val.forEach((item,index)=>{
						if(item.name.indexOf('成为校园经理') !== -1){
							self.lists.splice(index,1);
						}
					})
				},
				immediate: true
			}
		},
		data() {
			return {

			}
		},
		mounted() {
			
		},
		methods: {
			toProduct(key) {
				uni.navigateTo({
				    url: '/pkChaoYueZu/index/saledetail?key=' + key
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.aaa {
		width: 100%;
		text-align: center;
		color: red;
		font-size: 48rpx;
	}
</style>
