<template>
	<view>
		<view class="" :style="'height:'+scrollHeight+'px'">
			<view class="" style="width: 100%;height: 40px;display: flex;justify-content: center;align-items: center;" @click="tosearchpage">
				<image src="http://res.chaoyuezu.cn/attachment/images/20201216/98f065a20ab844aa8f861e7cb2ae1fd7.png" mode="" style="width: 20px;height: 20px;margin-right: 20rpx;"></image>
				点击搜索
			</view>
			<error-tip :propData="errorData" @hide="errorHide"></error-tip>
			<view class="VerticalBox" :style="'height:'+(scrollHeight - 40)+'px'">
				<scroll-view class="VerticalNav nav" scroll-y scroll-with-animation :scroll-top="verticalNavTop" style="height:calc(100vh);background:#f8f8f8;"
				 :style="'height:'+ (scrollHeight - 40) +'px'">
					<view class="cu-item one-line-dot" :class="index==tabCur&&isShowCur==true?'text-blue cur':''" v-for="(item,index) in menuData"
					 :key="index" @tap="setCatId(index)" :data-id="index">{{item.name}}</view>
					<view v-if="isNewcomers" class="cu-item one-line-dot" :class="isSelectNewcomers==true?'text-blue cur':''" @tap="catSelect()">新人专享</view>
				</scroll-view>
				<scroll-view v-if="showRight" class="VerticalMain" scroll-y scroll-with-animation style="height:calc(100vh)"
				 lower-threshold="50" @scrolltolower="isSelectNewcomers==true?getNewcomersGoods(0, currentPage):getGoods(0, currentPage)"
				 :style="'height:'+ (scrollHeight - 40) +'px'">
					<view class="cu-list menu-avatar" v-if="lists.length>0" style="position: relative;">
						<view class="cu-item" style="border-bottom: 1upx solid #eee;" v-for="(item, index) in lists" :style="item.opacityCustom?'opacity:0.7':''"
						 @tap.stop="tryBuy2(item, index)" :key="index">
							<view class="cu-avatar avatar" style="left:20upx;">
								<img class="cu-avatar avatar" style="width: 100%;" :lazy-load="true" :src="image_root+item.pic" @tap="toProduct(item,activity_id,activity_endtime)" />
								<!-- <view class="sale-out" v-if="item.opacityCustom">{{item.opacityText}}</view> -->
							</view>

							<view class="content">
								<view class="coloum-container fixed-height-150" @tap="toProduct(item,activity_id,activity_endtime)">
									<view class="text-black two-line-dot" style="fobt-weight: bold">{{item.name}}</view>
									<view class="text-gray text-sm flex">
										<!--                  <text class="text-gray">销量:{{item.sales_num}}</text>-->
										<div class="cu-tag bg-blue round" v-for="(tag, tIndex) in item.tag_arr" v-if="item.tag_arr.length>0" style="border-radius: 10upx;background: var(--blueLight);color:var(--blue);-webkit-border-radius: 2500px;-moz-border-radius: 2500px;border-radius: 2500px;">{{tag}}</div>
									</view>
								</view>
								<view style="width: 220upx;">
									<text class="text-blue" style="font-size: 34upx;font-weight: bold; color: #222222">¥{{item.unit=='月'?(item.price/30).toFixed(2):item.price}}</text>
									<!-- <text class="text-gray" style="margin-left: 10upx;font-size: 24upx;">/{{item.unit}}</text> -->
									<text class="text-gray" style="margin-left: 10upx;font-size: 24upx;">/天</text>
								</view>
							</view>
							<view class="action bottom" style="height: 100%;">
								<!-- <view class="cart-container fade-in" v-if="item.showCart" @tap.stop="tryBuy(item, index)">
									<image class="text-white cart" src="/static/gouwuche.png"></image>
				  </view>-->
								<!--              <view-->
								<!--                class="buy"-->
								<!--                v-if="item.showCart || item.cart_num == 0"-->
								<!--              >{{item.stock==0?'已售罄':'立即购买'}}</view>-->
								<!--              <view class="add-reduce-container row-container fade-in" v-else>-->
								<!--                <image-->
								<!--                  class="uni-icon uni-icon-minus-filled btn-container"-->
								<!--                  style="font-size: 24px;color:var(&#45;&#45;gray)"-->
								<!--                  @tap.stop="reducePlat(item, index)"-->
								<!--                />-->
								<!--                <view class="btn-container">{{item.cart_num}}</view>-->
								<!--                <image-->
								<!--                  class="uni-icon uni-icon-plus-filled btn-container"-->
								<!--                  style="font-size: 24px;color:#e84118"-->
								<!--                  @tap.stop="addPlat(item, index)"-->
								<!--                />-->
								<!--              </view>-->
							</view>
						</view>
						<uni-load-more :loadingType="loadingType" :contentText="contentText"></uni-load-more>
					</view>
					<view class="main-center-page" style="background: var(--white);padding-top: 450upx;" v-else>
						<image class="empty" :lazy-load="true" src="/static/empty.png" />
						<view class="text-gray">该类目下暂无商品～</view>
					</view>
				</scroll-view>
			</view>

		</view>
		<!--  #ifdef  MP-WEIXIN || H5 -->
		<!-- <my-wx-login :propData="loginDialogData" @handleClose="handleClose" @getUserInfoSuccess="getUserInfoSuccess"
		 @getUserInfoH5="getUserInfoH5"></my-wx-login> -->
		<!--  #endif -->
		<!-- <service-center-dialog :showPositionDialog="showCenterDialog" @enter="toArea"></service-center-dialog> -->
		<!-- <product-selector :propData="selectorData" @close="closeSelector" @reduce="reduceNum" @add="addNum" @submit="submit"
		 @selectAttrItem="selectAttrItem"></product-selector> -->
	</view>
</template>

<script>
	import Config from '@/common/js/Config.js'
	import Toast from '@/common/js/toast.js'
	import Auth from '../../pages/auth.js'
	import Cart from '../../pages/cartsResfresh.js'
	import Util from '../../common/js/util.js'

	import UniLoadMore from '../../components/uni-load-more.vue'
	import ServiceCenterDialog from '../../components/yx_dialog/myServiceCenterDialog.vue'
	import ProductSelector from '../../components/yx_dialog/myProductSelector.vue'
	import UniIcon from '../../components/uni-icon.vue'
	import ErrorTip from '../../components/yx_dialog/myErrorTip.vue'

	import {
		mapMutations
	} from 'vuex'

	const CURRENT_CAT_TYPE = 0;
	const NEXT_CATE_TYPE = 2;
	export default {
		data() {
			return {
				shouldReload: false, //是否需要重新加载
				menuData: [], //左侧菜单列表
				lists: [], //商品列表
				image_root: '', //图片地址
				tabCur: 0, //当前选中菜单下标
				verticalNavTop: 0, //菜单根据用户点击自动滑动，该值为菜单列表滑动距离
				catType: CURRENT_CAT_TYPE, //正在抢购
				currentPage: 1, //商品列表下次加载页码
				loadingType: 1, //加载提示语下标
				contentText: {
					contentdown: "上拉显示更多",
					contentrefresh: "正在加载...",
					contentnomore: "没有更多数据了"
				}, //加载提示语
				loadingPageSuccess: true, //是否加载数据成功，防止多次加载
				showCenterDialog: false, //是否显示运营中心弹窗
				showRight: false,
				activity_id: 0, //活动id
				activity_endtime: 0, //活动结束时间
				selectorData: {
					show: false
				}, //商品选择器，当商品存在多规格时弹出
				selectorIdx: 0, //选择器对应商品列表商品下标
				// 错误提示
				errorData: {
					show: false,
					desc: ''
				},
				mapLists: new Map(),
				isToProduct: false,
				isError: false,
				isSelectNewcomers: false,
				isShowCur: true,
				loginDialogData: {
					show: false
				},
			};
		},
		watch: {
			acts: {
				handler() {
					if (this.acts !== undefined) {
						this.activity_id = this.acts.id
						this.activity_endtime = this.acts.end_time
					}
				},
				immediate: true
			},
			tabCur: {
				handler() {
					if (this.menuData.length > 0) {}
				},
				immediate: true
			},
			catId: {
				handler(newest, old) {
					let self = this
					if (this.menuData.length > 0) {
						if (this.isNewcomersPage != 1) {
							self.TabSelect(newest)
						}

					}
				},
				immediate: true
			},
			menuData: {
				handler() {
					if (this.menuData.length > 0) {
						this.TabSelect(this.catId)
					}
				},
				immediate: true
			},
			refreshCategoryGoodList: {
				handler() {
					if (this.refreshCategoryGoodList.length > 0) {
						this.refreshCartNum()
					}
				},
				immediate: true
			},
			isNewcomersPage: {
				handler() {},
				immediate: true
			},
			isNewcomers: {
				handler() {},
				immediate: true
			},
			userInfo: {
				handler(newest, old) {
					if ((this.userInfo === undefined) ||
						(this.userInfo != undefined && !Util.containsKey(this.userInfo, 'user_key'))) {} else {
						if (Util.containsKey(newest, 'id') && !Util.containsKey(old, 'id')) {
							this.lists = []
							this.mapLists = new Map()
							this.currentPage = 1
							this.loadingType = 1
							this.getGoods(CURRENT_CAT_TYPE, this.currentPage)
						}
						this.loginDialogData = Object.assign({}, this.loginDialogData, {
							show: false
						})
					}
					if (this.userInfo != undefined && Util.containsKey(this.userInfo, 'user_key')) {
						this.resfreshCartNum(this.userInfo.user_key, (res) => {})
					}
				},
				immediate: true
			},
		},
		mixins: [Toast, Auth, Cart],
		components: {
			UniLoadMore,
			ServiceCenterDialog,
			UniIcon,
			ProductSelector,
			ErrorTip
		},
		onLoad() {
			let self = this
			// if (!self.checkLogin()) return //判断是否登录
			self.setUuid(Config.PLAT_UUID)
			self.getClassify();
			setTimeout(() => {
				self.showRight = true
			}, 100)
			uni.getSystemInfo({
				success: function(res) {
					self.scrollHeight = res.windowHeight
				}
			});
			// console.info(this.scrollHeight)
		},
		onShow() {
			if (this.shouldReload) {
				console.log('3')
				this.shouldReload = false
				this.getClassify()
			}
			if (this.refreshCart && Util.containsKey(this.userInfo, 'user_key')) {
				console.log('2')
				this.resfreshCartNum(this.userInfo.user_key, (res) => {})
			}
			if (this.isNewcomersPage == 1) {
				console.log('isNewcomersPage=1')
				this.setNewPageTag()
				this.catSelect()
			}
		},
		onReady() {
			uni.hideLoading()
		},
		computed: {
			globalI() {
				return this.$store.state.globalI
			},
			group() {
				return this.$store.state.group
			},
			catId() {
				return this.$store.state.catId
			},
			acts() {
				return this.$store.state.acts
			},
			userInfo() {
				return this.$store.state.userInfo
			},
			refreshCategoryGoodList() {
				return this.$store.state.refreshCategoryGoodList
			},
			refreshCart() {
				return this.$store.state.refreshCart
			},
			isNewcomersPage() {
				return this.$store.state.isNewcomersPage
			},
			isNewcomers() {
				return this.$store.state.isNewcomers
			},
			point_token() {
				return this.$store.state.point_token
			}
		},
		methods: {
			...mapMutations(['setCatId', 'setRefreshCart', 'emptyCategoryRefresh', 'addIndexRefresh',
				'setInChooseProductCartNum', 'setIsNewcomersPage', 'setLoginWx', 'setUserInfo', 'setUuid'
			]),
			/**
			 * 重置分类
			 */
			changeClassify: function() {
				// this.menuData=[{ //分类类别
				// 	name: '全部商品',
				// 	id: '0',
				// 	recommend: 0
				// }]
				this.menuData = []
				this.getClassify();
			},
			getClassify: function() {
				let self = this
				// if (self.$cache.get('classify', false)) {
				// 	// self.cTabBars = self.$cache.get('classify', false) || []
				// 	self.menuData = self.$cache.get('classify', false) || []
				// 	self.setCatId(0)
				// 	return
				// }
				self.$Phttp.post(Config.JAVA_SAAS_URLS.getClassify, {}).then((res) => {
					res = res.data
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
					// self.menuData = self.menuData.concat(res.data)
					self.setCatId(0)
					self.$cache.put('classify', self.menuData, Config.CACHE_TIMEOUT)
				})
			},
			getGoods: function(catType = CURRENT_CAT_TYPE, page = 1) {
				let self = this
				if (!self.loadingPageSuccess) return
				if (self.loadingType === 2) return
				self.loadingPageSuccess = false
				console.log(self.menuData)
				let data = {
					page: page,
					size: Config.PAGE_LIMIT,
					category_key: self.menuData.length > 0 ? self.menuData[self.tabCur].category_key : '',
					is_selling: 0
				}
				self.$Phttp.post(Config.JAVA_SAAS_URLS.getCategoryGoods, data).then((res) => {
					self.toast(true)
					// #ifdef MP-ALIPAY
					uni.hideToast()
					// #endif
					console.log(self);
					console.log('成功关闭')
					uni.stopPullDownRefresh()
					self.loadingPageSuccess = true
					res = res.data
					console.log(res);
					if (res.data.list.length < Config.PAGE_LIMIT) {
						self.loadingType = 2
					} else {
						self.loadingType = 0
					}
					self.image_root = res.other.img_root
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
			},
			getNewcomersGoods: function(catType = CURRENT_CAT_TYPE, page = 1) {
				let self = this
				return
				if (!self.loadingPageSuccess) return
				if (self.loadingType === 2) return
				self.loadingPageSuccess = false
				let data = {
					i: self.globalI,
					act_type: catType,
					page: page,
					limit: Config.PAGE_LIMIT,
					latitude: self.group.latitude,
					longitude: self.group.longitude,
					cat_key: 0,
					user_key: self.userInfo.user_key
				}
				self.$Phttp.post(Config.JAVA_SAAS_URLS.newcomersList, data).then((res) => {
					self.toast(true)
					uni.stopPullDownRefresh()
					self.loadingPageSuccess = true
					res = res.data
					if (res.data.goods.length < Config.PAGE_LIMIT) {
						self.loadingType = 2
					} else {
						self.loadingType = 0
					}
					self.image_root = res.other.img_root
					let lists = res.data.goods
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

						self.lists.push(item)
						console.log('aaaaaaa')
						console.log(self.lists.length)
						self.mapLists.set(item.id, self.lists.length - 1)
					})
					for (var i = 0; i < 3; i++) {
						setTimeout(() => {
							console.log('bbb')
							self.lists = Object.assign([], self.lists)
							console.log(self.lists.length)
						}, 100)
					}
					self.currentPage++;
				}).catch(err => {
					self.loadingPageSuccess = true
					if (self.isError) return
					self.isError = true
					uni.showModal({
						title: '温馨提示',
						content: '抱歉，获取商品信息失败，请检查网络！',
						showCancel: false,
						comfirmText: '重试',
						success: (res) => {
							self.getNewcomersGoods(catType, page)
						}
					})
				})
			},
			toArea: function() {
				uni.navigateTo({
					url: '/pkUserInfo/address/area?page=1'
				})
			},
			setNewPageTag: function() {
				let self = this
				self.setIsNewcomersPage(0)
			},
			toProduct: function(good, activity_id, activity_endtime) {
				console.log(good.id);
				let self = this
				if (self.isToProduct) return
				self.isToProduct = true
				setTimeout(() => {
					self.isToProduct = false
				}, 800)
				self.setInChooseProductCartNum(good.cart_num)
				uni.navigateTo({
					// url: '/pages/index/product?id='+good.id+"&activity_id="+activity_id+"&activity_endtime="+activity_endtime
					url: '/pkPointMall/index/detail?id=' + good.id
				})
			},
			tryBuy: function(item, index) {
				let self = this
				if (!this.isLogin()) return
				if (item.attrgroups.length > 0) {
					self.selectorIdx = index
					self.buy(item)
				} else {
					if (!this.checkLogin()) return //判断是否登录
					if (!this.isGoodAvailable(item)) return
					self.addCart(item, index)
				}
			},
			tryBuy2: function(item, index) {
				uni.navigateTo({
					url: '/pkChaoYueZu/index/detail?key=' + item.goods_key
				})
			},
			addCart: function(item, index) {
				let self = this
				self.toast({
					type: 'loading',
					desc: '加载中...',
				})
				let data = {
					i: self.globalI,
					user_key: self.userInfo.user_key,
					goods_id: item.id,
					activity_id: self.activity_id, //活动id
					activity_endtime: self.activity_endtime, //活动结束时间
					store_id: 0,
					num: 1,
					token: self.userInfo.access_token,
					attr_ids: '',
					attr_names: ''
				}
				self.$Phttp.post(Config.JAVA_SAAS_URLS.joinCart, data).then((res) => {
					res = res.data
					if (res.code === 0) {
						self.setRefreshCart(true)
						self.toast({
							desc: '已加入购物车',
							type: 'success',
							time: 1500
						})
						self.lists[index].cart_num = 1
						self.addIndexRefresh({
							goods_id: item.id,
							cart_num: 1,
							cart_id: res.data
						})
						self.lists[index].cart_id = res.data
						self.lists[index].showCart = false
						for (var i = 0; i < 3; i++) {
							setTimeout(() => {
								self.lists[index].showCart = false
							}, 100)
						}
					} else {
						self.toast({
							desc: res.msg,
							type: 'warn',
							time: 3000
						})
					}
					self.resfreshCartNum(self.userInfo.user_key, (res) => {})
				})
			},
			buy: function(item) {
				let self = this
				if (item.stock === 0) {
					self.toast({
						desc: '已售罄,刷新重试'
					})
					return
				}
				self.selectorData = Object.assign({}, item, {
					show: true,
					image_root: self.image_root,
					num: 1,
				})
				setTimeout(() => {
					self.selectorData = Object.assign({}, self.selectorData)
				}, 200)
				self.selectorData.origin_id = item.id
				self.retSetAttrGroupStatus()
				if (self.selectorData.attrgroups.length > 0) {
					self.selectAttrItem()
				}
			},
			retSetAttrGroupStatus: function() {
				let self = this
				self.selectorData.attrgroups.forEach((item, i) => {
					item.attrs.forEach((attr, j) => {
						if (j === 0) {
							self.selectorData.attrgroups[i].attrs[j] = Object.assign({}, self.selectorData.attrgroups[i].attrs[j], {
								status: true
							})
							self.selectorData.attrgroups[i].selectAttrsId = j
						} else {
							self.selectorData.attrgroups[i].attrs[j] = Object.assign({}, self.selectorData.attrgroups[i].attrs[j], {
								status: false
							})
						}
					})
				})
			},
			setAttrGroupStatus: function(groups_idx, attrs_idx) {
				let self = this
				self.selectorData.attrgroups[groups_idx].attrs[attrs_idx].status = true
				self.selectorData.attrgroups[groups_idx].selectAttrsId = attrs_idx
				self.selectorData.attrgroups[groups_idx].attrs.forEach((item, index) => {
					if (index !== attrs_idx) {
						self.selectorData.attrgroups[groups_idx].attrs[index].status = false
					}
				})
			},
			selectAttrItem: function(data) {
				let self = this
				self.toast({
					type: 'loading',
					desc: '加载中...'
				})
				if (data !== undefined && data.groups_idx !== undefined && data.attrs_idx !== undefined)
					self.setAttrGroupStatus(data.groups_idx, data.attrs_idx)

				var attr_ids = ','
				var chooseSpec = ''
				self.selectorData.attrgroups.forEach((item, idx) => {
					attr_ids += item.attrs[item.selectAttrsId].id + ','
					chooseSpec += item.attrs[item.selectAttrsId].name + " "
				})
				let postData = {
					i: self.globalI,
					attr_ids: attr_ids,
					goods_id: self.selectorData.id,
				}
				self.$Phttp.post(Config.JAVA_SAAS_URLS.getGoodAttrs, postData).then((res) => {
					self.toast(true)
					res = res.data
					if (res.code === 0) {
						self.selectorData = Object.assign({}, self.selectorData, res.data[0], {
							chooseSpec: chooseSpec,
							attr_ids: attr_ids,
							attr_names: chooseSpec
						})
					}
				})
			},
			closeSelector: function() {
				this.selectorData.show = false
			},
			reduceNum: function() {
				if (this.selectorData.num > 1) {
					this.selectorData.num--;
				} else {
					this.toast({
						type: 'warn',
						desc: '商品不得少于1件'
					})
				}
			},
			addNum: function() {
				if (this.selectorData.num < this.selectorData.stock) {
					this.selectorData.num++;
				} else {
					this.toast({
						type: 'warn',
						desc: '商品库存不足'
					})
				}
			},
			submit: function() {
				let self = this
				if (!this.checkLogin()) return //判断是否登录
				if (!this.isAvailable()) return
				self.toast({
					type: 'loading',
					desc: '加载中...',
				})
				let data = {
					user_key: self.userInfo.user_key,
					goods_id: self.selectorData.goods_id,
					store_id: 0,
					activity_id: this.activity_id, //活动id
					activity_endtime: this.activity_endtime, //活动
					num: self.selectorData.num,
					token: self.userInfo.access_token,
					attr_ids: self.selectorData.attr_ids === undefined ? '' : self.selectorData.attr_ids,
					attr_names: self.selectorData.chooseSpec === undefined ? '' : self.selectorData.chooseSpec
				}
				self.$Phttp.post(Config.JAVA_SAAS_URLS.joinCart, data).then((res) => {
					res = res.data
					if (res.code === 0) {
						self.setRefreshCart(true)
						self.toast({
							desc: '已加入购物车',
							type: 'success',
							time: 3000
						})
						self.lists[self.selectorIdx].cart_num++
						self.addIndexRefresh({
							goods_id: self.selectorData.goods_id,
							cart_num: self.lists[self.selectorIdx].cart_num,
							cart_id: res.data
						})
						self.lists[self.selectorIdx].cart_id = res.data
						self.lists[self.selectorIdx].showCart = false
						self.selectorData.show = false
					} else {
						self.toast({
							desc: res.msg,
							type: 'warn',
							time: 3000
						})
					}
					self.resfreshCartNum(this.userInfo.user_key, (res) => {})
				})
			},
			isGoodAvailable: function(item) {
				let self = this
				var totalSecond = item.end_time2 - Date.parse(new Date()) / 1000;
				if (totalSecond <= 0) {
					self.toast({
						type: 'warn',
						desc: '活动已结束'
					})
					return false
				}
				if (item.stock < 1) {
					self.toast({
						type: 'warn',
						desc: '库存不足'
					})
					return false
				}

				if ((new Date()).getTime() / 1000 < item.goods_begin_time) {
					self.toast({
						type: 'warn',
						desc: '活动未开始'
					})
					return false
				}
				if ((new Date()).getTime() / 1000 > item.end_time2) {
					self.toast({
						type: 'warn',
						desc: '活动已结束'
					})
					return false
				}
				return true
			},
			isAvailable: function() {
				let self = this
				var totalSecond = this.selectorData.end_time2 - Date.parse(new Date()) / 1000;
				if (totalSecond <= 0) {
					self.toast({
						type: 'warn',
						desc: '活动已结束'
					})
					return false
				}
				if (this.selectorData.stock < 1) {
					self.toast({
						type: 'warn',
						desc: '库存不足'
					})
					return false
				}

				if ((new Date()).getTime() / 1000 < this.selectorData.goods_begin_time) {
					self.toast({
						type: 'warn',
						desc: '活动未开始'
					})
					return false
				}
				if ((new Date()).getTime() / 1000 > this.selectorData.end_time2) {
					self.toast({
						type: 'warn',
						desc: '活动已结束'
					})
					return false
				}
				return true
			},
			reducePlat: function(item, idx) {
				let self = this
				if (item.attrgroups.length > 0) {
					self.errorData = Object.assign({
						show: true,
						desc: '多规格商品只能去购物车移除'
					})
					return
				}

				if (!this.checkLogin()) return //判断是否登录
				if (!this.isGoodAvailable(item)) return
				self.updateCart(item.id, item.cart_id, item.cart_num - 1, idx)
			},
			updateCart: function(goods_id, cart_id, num, idx) {
				let self = this
				self.toast({
					type: 'loading',
					desc: '处理中...'
				})
				let data = {
					user_key: self.userInfo.user_key,
					token: self.userInfo.access_token,
					cart_id: cart_id,
					num: num
				}
				self.$Phttp.post(Config.JAVA_SAAS_URLS.updateCart, data).then((res) => {
					self.toast(true)
					res = res.data
					if (res.code === 0) {
						self.setRefreshCart(true)
						if (num === 0) {
							self.toast({
								type: 'success',
								desc: '已移除购物车'
							})
							self.lists[idx].cart_num = 0
							self.lists[idx].showCart = true
							for (var i = 0; i < 3; i++) {
								setTimeout(() => {
									self.lists[idx].showCart = true
								}, 100)
							}
							self.addIndexRefresh({
								goods_id: goods_id,
								cart_num: 0
							})
						} else {
							self.lists[idx].cart_num = num
							self.addIndexRefresh({
								goods_id: goods_id,
								cart_num: num
							})
						}
					} else {
						self.toast({
							type: 'warn',
							desc: '库存不足'
						})
					}
					self.resfreshCartNum(self.userInfo.user_key, (res) => {})
				})
			},
			addPlat: function(item, idx) {
				let self = this
				if (item.attrgroups.length > 0) {
					self.selectorIdx = idx
					self.buy(item)
					return
				}

				if (!this.checkLogin()) return //判断是否登录
				if (!this.isGoodAvailable(item)) return
				self.updateCart(item.id, item.cart_id, item.cart_num + 1, idx)
			},
			catSelect: function() {
				this.isSelectNewcomers = true
				this.isShowCur = false
				this.verticalNavTop = (this.menuData.length - 1) * 50
				this.toast({
					desc: '加载中',
					type: 'loading'
				})
				this.lists = []
				this.mapLists = new Map()
				this.currentPage = 1
				this.loadingType = 1
				this.getNewcomersGoods(CURRENT_CAT_TYPE, this.currentPage)
			},
			TabSelect(id) {
				id = parseInt(id)
				console.log("id" + id)
				this.isShowCur = true
				this.tabCur = id;
				this.verticalNavTop = (id - 1) * 50
				this.isSelectNewcomers = false;
				this.toast({
					desc: '加载中',
					type: 'loading'
				})

				this.lists = []
				this.mapLists = new Map()
				this.currentPage = 1
				this.loadingType = 1
				this.getGoods(CURRENT_CAT_TYPE, this.currentPage)
			},
			// 错误隐藏
			errorHide: function(e) {
				if (!e.detail) {
					this.errorData.show = false;
					return
				}
				this.errorData = e.detail
			},
			refreshCartNum: async function() {
				let self = this
				if (self.lists.length === 0) {
					self.emptyCategoryRefresh()
					return
				}
				self.refreshCategoryGoodList.forEach((item, index) => {
					item.multi ? item.cart_num = self.lists[self.mapLists.get(parseInt(item.goods_id))].cart_num + item.cart_num :
						null;
					if (item.cart_num > 0) {
						self.lists[self.mapLists.get(parseInt(item.goods_id))].cart_num = item.cart_num
						self.lists[self.mapLists.get(parseInt(item.goods_id))].showCart = false
						item.cart_id ? self.lists[self.mapLists.get(parseInt(item.goods_id))].cart_id = item.cart_id : null
					} else {
						self.lists[self.mapLists.get(parseInt(item.goods_id))].cart_num = 0
						self.lists[self.mapLists.get(parseInt(item.goods_id))].showCart = true
					}
				})
				self.emptyCategoryRefresh()
			},
			getUserInfoSuccess: function(userInfo) {
				this.setUserInfo(userInfo)
				this.setLoginWx(true)
			},
			getUserInfoH5: function() {
				this.setLoginWx(true)
			},
			handleClose: function() {
				this.loginDialogData.show = false
			},
			isLogin: function() {
				// #ifdef MP-WEIXIN || H5
				if (this.userInfo === undefined || !Util.containsKey(this.userInfo, 'user_key')) {
					this.loginDialogData = Object.assign({}, this.loginDialogData, {
						show: true
					})
					return false
				}
				// #endif
				return true
			},
			toSearch: function() {
				// uni.navigateTo({
				// 	url: '/pkMain/goodslist/goodslist'
				// })
				uni.navigateTo({
					url: '/pkPointMall/index/search?key=' + '请输入商品名称/关键字'
				})
			},
			tosearchpage(){
				uni.navigateTo({
					url:'./tosearchpage/tosearchpage'
				})
			}
		},
		onPullDownRefresh() {
			console.log('aaa')
			if (this.group !== undefined && this.group !== '') {
				this.TabSelect(this.tabCur)
			}
		}
	}
</script>

<style>
	@import url("../../common/css/animation.css");
	@import url("../../common/css/colorui.css");
	@import url("../../common/css/common.css");

	.top {
		width: 100%;
		height: 85upx;
		background: #f37b1d;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.top .search {
		width: calc(100% - 60upx);
		height: 58upx;
		border-radius: 34upx;
		background: #fff;
		margin-left: 30upx;
		margin-right: 30upx;
		margin-top: 10upx;
		display: flex;
		align-items: center;
		/* background:rgba(244,244,244,1); */
	}

	.top .search .keyword {
		height: 68upx;
		line-height: 68upx;
		font-size: 24upx;
		color: #666;
		width: calc(100% - 90upx);
		margin-left: 35upx;
	}

	.top .search .button {
		width: 68upx;
		height: 48upx;
		padding: 10upx 20upx;
	}

	.VerticalNav.nav {
		width: 200upx;
		white-space: initial;
		border-right: 1upx solid #f8f8f8;
	}

	.VerticalNav.nav .cu-item {
		width: 100%;
		text-align: center;
		margin: 0;
		border: none;
		height: 50px;
		line-height: 50px;
		position: relative;
	}

	.VerticalNav.nav .cu-item.cur {}

	.VerticalNav.nav .cu-item.cur::after {
		content: "";
		width: 8upx;
		height: 60upx;
		border-radius: 6upx;
		position: absolute;
		background-color: currentColor;
		top: 0;
		left: 0upx;
		bottom: 0;
		margin: auto;
	}

	.avatar {
		width: 150upx;
		height: 150upx;
		border-radius: 20upx;
	}

	.bottom {
		display: flex;
		align-items: flex-end;
	}

	.cart-container {
		width: 60upx;
		height: 60upx;
		line-height: 60up;
		border-radius: 50%;
		background: var(--main);
		align-items: center;
		justify-content: center;
		display: flex;
		margin-left: 70upx;
	}

	.empty {
		width: 100upx;
		height: 80upx;
	}

	.cart-container .cart {
		width: 32upx;
		height: 32upx;
	}

	.btn-container {
		width: 50upx;
		height: 50upx;
		display: flex;
		justify-content: center;
		align-items: center;
		text-align: center;
	}

	.VerticalBox {
		display: flex;
	}

	.fixed-height-150 {
		height: 150upx;
	}

	.VerticalMain {
		background-color: white;
		flex: 1;
	}

	.buy {
		width: 140rpx;
		height: 50rpx;
		line-height: 50rpx;
		background: #f37b1d;
		border-radius: 25rpx;
		text-align: center;
		font-size: 20rpx;
		color: #fff;
		font-weight: 500;
	}

	.sale-out {
		width: 130upx;
		height: 130upx;
		border-radius: 50%;
		color: white;
		background: black;
		opacity: 0.7;
		text-align: center;
		line-height: 150upx;
		position: absolute;
		font-size: 24upx;
	}
</style>
