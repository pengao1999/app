<template>
	<view class="container main-page" :class="getFixedClass">
		<scroll-view scroll-y class="scrollView" lower-threshold="100" :scroll-top="scrollTop" @scroll="scrollFn($event)"
		 @scrolltolower="getNewcomersGoods">

			<!-- 保证性能勿删 -->
			<view class="scroll-container" style="padding-top: 20rpx;">
				<!-- 保证性能勿删 -->
				<block v-if="getShow">
					<view class="swiper-box">
						<mosowe-swiper :lists="swiperList" :touchable="false" :autoplay="false" indicator="" imageKey="pic" pyramid
						 pyramidMargin="120rpx" @change="bannerChange" />
					</view>
					<view class="swiper-scoll">
						<s-tabs color="#999999" activeColor="#222222" :lineHeight="10" lineColor="#1677FF" :effect="true" @change="change"
						 @render="render">
							<s-tab v-for="(item,index) of menuData" :title="item.name" :key="index" v-if="">
								<block>
									<Iosphone :lists="lists[index]" :image_root="image_root"></Iosphone>
								</block>
							</s-tab>
						</s-tabs>
					</view>
				</block>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	import Config from '@/common/js/Config.js'
	import Toast from '@/common/js/toast.js'
	import Util from '@/common/js/util.js'
	import ImageCache from '@/common/js/ImageCache.js'
	import Mosoweswiper from '@/components/mosowe-swiper/mosowe-swiper.vue'
	import sTabs from '@/components/s-tabs/index.vue'
	import sTab from '@/components/s-tab/index.vue'
	import Iosphone from './Iosphone.vue'
	//组件必须
	import {
		QSTabsWxsListMixin
	} from '../mixins/QS-tabs-wxs-list-mixin.js';
	import {
		mapMutations
	} from 'vuex'

	const CURRENT_CAT_TYPE = 0;
	export default {
		components: {
			Mosoweswiper,
			sTabs,
			sTab,
			Iosphone
		},
		mixins: [QSTabsWxsListMixin(), Toast], //组件必须
		data() {
			return {
				swiperList: [{
						pic: ''
					},
					{
						pic: ''
					},
					{
						pic: ''
					}
				],
				menuData: [], //s-tabs标签,
				lists: [], //Iosphone数据集合,
				catType: CURRENT_CAT_TYPE, //正在抢购,
				image_root: '', //图片地址,
				page: 1, //请求页数,
				activeitem: 0, //当前s-tabs选中的下标
			}
		},
		methods: {
			init(refresh) { //若是用户触发下拉刷新则refresh为true
				let self = this
				if (!self.refreshClear) self.oldScrollTop = 0;
				self.toast({
					type: 'loading'
				})
				self.getAd();
				self.getClassifysTabs();
				setTimeout(() => {
					self.$emit('refreshEnd');
				}, 1500)
			},
			getAd() {
				let self = this
				console.log(self.$http)
				self.$Phttp.post(Config.JAVA_SAAS_URLS.getAds, {}).then(res => {
					self.toast(true)
					res = res.data
					if (res.code === 0) {
						self.imgRoot = res.other.img_root
						res.data.banner.forEach((item, index) => {
							let name = item.pic
							let imageUrl = self.imgRoot + item.pic
							item.pic = ImageCache.get(name, imageUrl)
							item.picName = name
							item.originalPic = imageUrl
						})
						self.swiperList = res.data.banner

						// self.indexAd = Object.assign(res.data.indexAd, {
						// 	picName: res.data.indexAd.pic,
						// 	originalPic: res.other.img_root + res.data.indexAd.pic,
						// 	pic: ImageCache.get(res.data.indexAd.pic, res.other.img_root + res.data.indexAd.pic)
						// })
					}
				})
			},
			getClassifysTabs() {
				let self = this
				let data = {
					"app_key": "123",
					"is_selling": 1
				}
				self.$Phttp.post(Config.JAVA_SAAS_URLS.getClassify, data).then((res) => {
					res = res.data
					self.tabsarr = res.data.main
					console.log(res.data.main)
					if (res.code === 0)
						// this.menuData=[{ //分类类别
						// 	name: '全部商品',
						// 	id: '0',
						// 	recommend: 0
						// }]
						self.menuData = []
					// self.cTabBars = self.cTabBars.concat(res.data)
					res.data.main.forEach((item, index) => {
						// item.cate_img = img_root + item.cate_img
						if (item.name === '全部商品') {
							item.id = 0
						}

						self.menuData.push(item)
					})
					self.getList()
					// self.menuData = self.menuData.concat(res.data)
					// self.setCatId(0)
					// self.$cache.put('classify', self.menuData, Config.CACHE_TIMEOUT)
				})
			},
			getList(catType = CURRENT_CAT_TYPE, page = 1) {
				let self = this;
				self.menuData.forEach((item, index) => {
				self.lists[index] = []
					let data = {
						page: page,
						size: Config.PAGE_LIMIT,
						category_key: item.category_key ? item.category_key : '',
						is_selling:1
					}
					self.$Phttp.post(Config.JAVA_SAAS_URLS.getCategoryGoods, data).then((res) => {
						// self.toast(true)
						// uni.stopPullDownRefresh()
						// self.loadingPageSuccess = true
						res = res.data
						self.lists[index] = res.data.list
						self.lists.splice(index, 1, res.data.list)
						self.image_root = res.other.img_root
						return
						if (res.data.list.length < Config.PAGE_LIMIT) {
							self.loadingType = 2
						} else {
							self.loadingType = 0
						}
						let lists = res.data.list
						lists.forEach((item, index) => {
							item.opacityCustom = false
							if (item.cart_num > 0) {
								item.showCart = false
							} else {
								item.showCart = true
							}

							if (item.stock === 0) {
								item.opacityCustom = true
								item.opacityText = '已抢光'
							}
							if (item.goods_begin_time > (new Date()).getTime() / 1000) {
								item.opacityCustom = true
								item.opacityText = '活动未开始'
							}
							if (item.end_time2 < (new Date()).getTime() / 1000) {
								item.opacityCustom = true
								item.opacityText = '活动已结束'
							}
							item.tag_arr = item.tags.split(",")
							self.lists.push(item)
							self.mapLists.set(item.id, self.lists.length - 1)
						})
						for (var i = 0; i < 3; i++) {
							setTimeout(() => {
								self.lists = Object.assign([], self.lists)
							}, 100)
						}
						self.currentPage++;
					}).catch(err => {
						console.log(err);
						self.loadingPageSuccess = true
						if (self.isError) return
						self.isError = true
						uni.showModal({
							title: '温馨提示',
							content: '抱歉，获取商品信息失败，请检查网络！',
							showCancel: false,
							comfirmText: '重试',
							success: (res) => {
								self.getGoods(catType, page)
							}
						})
					})
				})
				console.log(self.lists)
			},
			bannerChange() {

			},
			change(e) {
				this.activeitem = e
				this.page = 1
			},
			render() {

			},
			getNewcomersGoods() {
				let self = this
				if (self.lists[self.activeitem].length < Config.PAGE_LIMIT * self.page) return
				self.page++;
				let data = {
					page: self.page,
					size: Config.PAGE_LIMIT,
					is_selling:1,
					category_key: self.menuData[self.activeitem].category_key ? self.menuData[self.activeitem].category_key : '',
				}
				self.$Phttp.post(Config.JAVA_SAAS_URLS.getCategoryGoods, data).then((res) => {
					// self.toast(true)
					// uni.stopPullDownRefresh()
					// self.loadingPageSuccess = true
					res = res.data
					res.data.list.forEach((item, index) => {
						self.lists[self.activeitem].push(item)
					})
					// self.lists[index] = res.data.list
					// self.lists.splice(index, 1, res.data.list)
					// self.image_root = res.other.img_root
					return
					if (res.data.list.length < Config.PAGE_LIMIT) {
						self.loadingType = 2
					} else {
						self.loadingType = 0
					}
					let lists = res.data.list
					lists.forEach((item, index) => {
						item.opacityCustom = false
						if (item.cart_num > 0) {
							item.showCart = false
						} else {
							item.showCart = true
						}

						if (item.stock === 0) {
							item.opacityCustom = true
							item.opacityText = '已抢光'
						}
						if (item.goods_begin_time > (new Date()).getTime() / 1000) {
							item.opacityCustom = true
							item.opacityText = '活动未开始'
						}
						if (item.end_time2 < (new Date()).getTime() / 1000) {
							item.opacityCustom = true
							item.opacityText = '活动已结束'
						}
						item.tag_arr = item.tags.split(",")
						self.lists.push(item)
						self.mapLists.set(item.id, self.lists.length - 1)
					})
					for (var i = 0; i < 3; i++) {
						setTimeout(() => {
							self.lists = Object.assign([], self.lists)
						}, 100)
					}
					self.currentPage++;
				}).catch(err => {
					console.log(err);
					self.loadingPageSuccess = true
					if (self.isError) return
					self.isError = true
					uni.showModal({
						title: '温馨提示',
						content: '抱歉，获取商品信息失败，请检查网络！',
						showCancel: false,
						comfirmText: '重试',
						success: (res) => {
							self.getGoods(catType, page)
						}
					})
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import url("../css/QS-tabs-wxs-list-components.css");

	.swiper-box {
		width: 100%;
	}

	.swiper-scoll {
		width: 100%;
		position: relative;
	}

	.scroll-container {
		padding-bottom: 0 !important;
	}
</style>
