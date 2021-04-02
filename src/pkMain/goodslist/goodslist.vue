<template>
	<view class="main">
	    <!-- 搜索框开始 -->
		<view class='top'>
		  <view class='search'>
			<input class='keyword' type='text' bindconfirm="search" v-model="inputKeyword"  placeholder='请输入商品名称/关键字'  placeholder-class='placeholder' @confirm='search()'></input>
			<!-- <view class = "search-button" @tap='searchGoods()'> -->
				<image class='button' @tap='search()' src='../../static/ic_search.png'></image>
		<!-- 	</view> -->
		  </view>
		</view>
		<!-- 搜索框结束 -->
		<!-- 产品列表开始 -->

		<scroll-view  class="VerticalMain" scroll-y scroll-with-animation :style="'height:'+scrollHeight+'px'" lower-threshold="50" @scrolltolower="loadMore()">
			<view class="cu-list menu-avatar" v-if="lists.length>0">
				<view class="cu-item" style="border-bottom: 1upx solid #eee;" v-for="(item, index) in lists" :style="item.opacityCustom?'opacity:0.7':''" :key="index">
					<view class="cu-avatar avatar" style="left:20upx;" >
						<image class="cu-avatar avatar" :lazy-load="true" :src="image_root+item.pic" @tap="toProduct(item,activity_key,activity_endtime)"></image>
						<view class="sale-out" v-if="item.opacityCustom">{{item.opacityText}}</view>
					</view>

					<view class="content">
						<view class="coloum-container fixed-height-150" @tap="toProduct(item,activity_key,activity_endtime)">
							<view class="text-black two-line-dot">{{item.name}}</view>
							<view class="text-gray text-sm flex">
								<text class="text-gray">
									销量:{{item.sales_num}}
								</text>
							</view>
						</view>
						<view style="width: 220upx;">
							<text class="text-red" style="font-size: 34upx;font-weight: bold;">¥{{item.price}}</text>
							<text class="text-gray" style="margin-left: 10upx;text-decoration: line-through;font-size: 24upx;">¥{{item.original_price}}</text>
						</view>
					</view>
					<view class="action bottom" style="height: 100%;">
						<view class='buy' v-if="item.showCart || item.cart_num == 0" @tap.stop="tryBuy(item, index)">{{item.stock==0?'已售罄':'加入购物车'}}</view>
						<view class="add-reduce-container row-container fade-in" v-else>
							<image class="uni-icon uni-icon-minus-filled btn-container" style="font-size: 24px;color:var(--gray)" @tap.stop="reducePlat(item, index)"></image>
							<view class="btn-container">{{item.cart_num}}</view>
							<image  class="uni-icon uni-icon-plus-filled btn-container" style="font-size: 24px;color:#e84118" @tap.stop="addPlat(item, index)"></image>
						</view>
					</view>
				</view>
				<uni-load-more :loadingType="loadingType" :contentText="contentText"></uni-load-more>
			</view>
			<view class="goods-center-page" v-else-if="showmessage">
				<image class="goods_empty" :lazy-load="true" src="/static/empty.png"></image>
				<view class="text-gray">未找到商品～</view>
			</view>
		</scroll-view>
		<!-- 产品列表结束 -->
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

	import {mapMutations} from 'vuex'

	const CURRENT_CAT_TYPE = 0;
	const NEXT_CATE_TYPE = 2;
	export default {
		data() {
			return {
				shouldReload: false, //是否需要重新加载
				menuData: [],  //左侧菜单列表
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
					contentnomore: ""
				}, //加载提示语
				loadingPageSuccess: true, //是否加载数据成功，防止多次加载
				showCenterDialog: false, //是否显示运营中心弹窗
				showGoods: false,
				activity_key:0, //活动id
				activity_endtime:0, //活动结束时间
				selectorData: {
					show: false
				}, //商品选择器，当商品存在多规格时弹出
				selectorIdx: 0,//选择器对应商品列表商品下标
				// 错误提示
				errorData: {
					show: false,
					desc: ''
				},
				mapLists: new Map(),
				isToProduct: false,
				isError: false,
				isSelectNewcomers:false,
				isShowCur:true,
				inputKeyword:'',
				showmessage:false,
				scrollHeight:0
			};
		},
		watch: {
			acts: {
				handler() {
					if (this.acts !== undefined) {
						this.activity_key = this.acts.activity_key
						this.activity_endtime = this.acts.end_time
					}
				},
				immediate: true
			},
			tabCur: {
				handler() {
					if (this.menuData.length > 0) {
					}
				},
				immediate: true
			},
			group: {
				handler() {
					if (this.group !== undefined && this.group !== '') {
						this.showCenterDialog = false
						if (this.menuData.length > 0) {
							this.TabSelect(this.catId)
						}
					} else {
						this.showCenterDialog = true
					}
				},
				deep: true
			},


			refreshCategoryGoodList: {
				handler() {
					if (this.refreshCategoryGoodList.length > 0) {
						this.refreshCartNum()
					}
				},
				immediate: true
			},
			globalI: {
				handler(newest, old) {
					if (old !== undefined)
						this.shouldReload = true
				},
				immediate: true
			}
		},
		mixins: [Toast, Auth, Cart],
		components: {
			UniLoadMore, ServiceCenterDialog, UniIcon, ProductSelector, ErrorTip
		},
		onLoad() {
			let self = this
			if (!self.checkLogin()) return //判断是否登录

			setTimeout(()=> {
				self.showGoods = true
			}, 100)
		},
		onShow() {
			let self=this
			if (this.shouldReload) {
				this.shouldReload = false
			}
			if (this.refreshCart) {
				this.resfreshCartNum(this.userInfo.user_key, this.group ? this.group.id : '', (res)=>{})
			}
			uni.getSystemInfo({
			    success: function (res) {
					self.scrollHeight=res.windowHeight-43
			    }
			});
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
			}
		},
		methods: {
			...mapMutations(['setCatId', 'setRefreshCart', 'emptyCategoryRefresh', 'addIndexRefresh', 'setInChooseProductCartNum','setIsNewcomersPage']),

			search(){
				this.lists=[]
				this.currentPage=1;
				this.searchGoods()
			},
			searchGoods:function(){
				console.log('start search')
		        let self = this
				self.toast({
					type: 'loading',
					desc: '加载中...',
				})
				self.showmessage=false
		        let data = {
		        	i:self.globalI,
		        	act_type: 0,
		        	page: self.currentPage,
		        	limit: Config.PAGE_LIMIT,
		        	cat_key: 0,
		        	user_key: Util.containsKey(self.userInfo, 'user_key') ? self.userInfo.user_key : 0,
					key:self.inputKeyword
		        }
		        self.$Phttp.post(Config.JAVA_SAAS_URLS.getSaasGoods, data).then((res) => {
		        		self.toast(true)
						self.showmessage=true
		        		res = res.data
		        		self.image_root=res.other.img_root
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
		        			if (item.goods_begin_time > (new Date()).getTime()/1000) {
		        				item.opacityCustom = true
		        				item.opacityText = '活动未开始'
		        			}
		        			if (item.end_time2 < (new Date()).getTime()/1000) {
		        				item.opacityCustom = true
		        				item.opacityText = '活动已结束'
		        			}
		        			self.lists.push(item)
		        			self.mapLists.set(item.id, self.lists.length - 1)
		        		})
						if (lists.length < Config.PAGE_LIMIT) {
							self.loadingType = 2
						} else {
							self.loadingType = 1
						}
		        		for(var i=0; i<3; i++) {
		        			setTimeout(()=>{
		        				self.lists = Object.assign([], self.lists)
		        			}, 100)
		        		}


		        	})
			},
			toProduct: function(good,activity_key,activity_endtime) {
				let self = this
				if (self.isToProduct) return
				self.isToProduct = true
				setTimeout(()=> {
					self.isToProduct = false
				}, 800)
				self.setInChooseProductCartNum(good.cart_num)
				uni.navigateTo({
					url: '/pages/index/product?goods_key='+good.goods_key+"&activity_key="+activity_key+"&activity_endtime="+activity_endtime
				})
			},
			tryBuy: function(item, index) {
				let self = this
				if (item.attrgroups.length > 0) {
					self.selectorIdx = index
					self.buy(item)
				} else {
					if (!this.checkLogin()) return //判断是否登录
					if ( !this.isGoodAvailable(item) ) return
					self.addCart(item, index)
				}
			},
			addCart: function(item, index) {
				let self = this
				self.toast({
					type: 'loading',
					desc: '加载中...',
				})
				console.log(JSON.stringify(self.group))
				let data = {
					i:self.globalI,
					user_key: self.userInfo.user_key,
					leader_key: self.group ? self.group.leader_key : '',
					goods_key: item.goods_key,
					activity_key:self.activity_key,//活动id
					activity_endtime:self.activity_endtime,//活动结束时间
					store_key: 0,
					num: 1,
					token: self.userInfo.access_token,
					attr_keys: '',
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
								goods_key : item.goods_key,
								cart_num: 1,
								cart_key  : res.data.cart_key
							})
							self.lists[index].cart_key = res.data.cart_key
							self.lists[index].showCart = false
							for(var i=0; i<3; i++) {
								setTimeout(()=>{
									self.lists[index].showCart = false
								}, 100)
							}
						}else{
							self.toast({
								desc: res.msg,
								type: 'warn',
								time: 3000
							})
						}
						self.resfreshCartNum(this.userInfo.user_key, (res) => {})
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
					show : true,
					image_root: self.image_root,
					num: 1,
				})
				setTimeout(()=>{
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
						if (j===0) {
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
				if (data !== undefined && data.groups_idx!==undefined && data.attrs_idx!==undefined)
					self.setAttrGroupStatus(data.groups_idx, data.attrs_idx)

				var attr_keys = ','
				var chooseSpec = ''
				self.selectorData.attrgroups.forEach((item, idx) => {
					attr_keys += item.attrs[item.selectAttrsId].id + ','
					chooseSpec += item.attrs[item.selectAttrsId].name + " "
				})
				let postData = {
					i:self.globalI,
					attr_keys : attr_keys,
					goods_key : self.selectorData.goods_key,
				}
				self.$Phttp.post(Config.JAVA_SAAS_URLS.getGoodAttrs, postData).then((res) => {
						self.toast(true)
						res = res.data
						if (res.code === 0) {
							self.selectorData = Object.assign({}, self.selectorData, res.data[0], {
								chooseSpec: chooseSpec,
								attr_keys: attr_keys,
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
				if ( !this.isAvailable() ) return
				if (this.userInfo.community === null) {
					this.toLeaderList()
					return
				}
				self.toast({
					type: 'loading',
					desc: '加载中...',
				})
				let data = {
					user_key: self.userInfo.user_key,
					leader_key: self.group.leader_key,
					goods_key: self.selectorData.goods_key,
					store_key: 0,
					activity_key:this.activity_key,//活动id
					activity_endtime:this.activity_endtime,//活动
					num: self.selectorData.num,
					token: self.userInfo.access_token,
					attr_keys: self.selectorData.attr_keys === undefined?'':self.selectorData.attr_keys,
					attr_names: self.selectorData.chooseSpec === undefined?'':self.selectorData.chooseSpec
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
							self.lists[self.selectorIdx].cart_num ++
							self.addIndexRefresh({
								goods_key : self.selectorData.goods_key,
								cart_num: self.lists[self.selectorIdx].cart_num,
								cart_key  : res.data
							})
							self.lists[self.selectorIdx].cart_key = res.data
							self.lists[self.selectorIdx].showCart = false
							self.selectorData.show = false
						} else {
							self.toast({
								desc: res.msg,
								type: 'warn',
								time: 3000
							})
						}
						self.resfreshCartNum(this.userInfo.user_key, this.group ? this.group.id : '', (res)=>{})
					})
			},
			isGoodAvailable: function(item) {
				let self = this
				var totalSecond = item.end_time2 - Date.parse(new Date()) / 1000;
				if (totalSecond<=0){
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

				if ((new Date()).getTime()/1000 < item.goods_begin_time) {
					self.toast({
						type: 'warn',
						desc: '活动未开始'
					})
					return false
				}
				if ((new Date()).getTime()/1000 > item.end_time2) {
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
				if (totalSecond<=0){
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

				if ((new Date()).getTime()/1000 < this.selectorData.goods_begin_time) {
					self.toast({
						type: 'warn',
						desc: '活动未开始'
					})
					return false
				}
				if ((new Date()).getTime()/1000 > this.selectorData.end_time2) {
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
				if ( !this.isGoodAvailable(item) ) return
				self.updateCart(item.goods_key, item.cart_key, item.cart_num-1, idx)
			},
			updateCart: function(goods_key, cart_key, num, idx) {
				let self = this
				self.toast({
					type: 'loading',
					desc: '处理中...'
				})
				let data = {
					user_key: self.userInfo.user_key,
					token: self.userInfo.access_token,
					cart_key: cart_key,
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
								for (var i=0; i<3; i++) {
									setTimeout(()=>{
										self.lists[idx].showCart = true
									}, 100)
								}
								self.addIndexRefresh({
								goods_key : goods_key,
								cart_num: 0
							})
							} else {
								self.lists[idx].cart_num = num
								self.addIndexRefresh({
								goods_key : goods_key,
								cart_num: num
							})
							}
						} else {
							self.toast({
								type: 'warn',
								desc: '库存不足'
							})
						}
						self.resfreshCartNum(self.userInfo.user_key, self.group.id, (res)=>{})
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
				if ( !this.isGoodAvailable(item) ) return
				self.updateCart(item.goods_key, item.cart_key, item.cart_num+1, idx)
			},

			// 错误隐藏
			errorHide: function (e) {
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
					item.multi ? item.cart_num = self.lists[self.mapLists.get(parseInt(item.goods_key))].cart_num  + item.cart_num : null;
					if (item.cart_num > 0) {
						self.lists[self.mapLists.get(parseInt(item.goods_key))].cart_num = item.cart_num
						self.lists[self.mapLists.get(parseInt(item.goods_key))].showCart = false
						item.cart_key ? self.lists[self.mapLists.get(parseInt(item.goods_key))].cart_key = item.cart_key: null
					} else {
						self.lists[self.mapLists.get(parseInt(item.goods_key))].cart_num = 0
						self.lists[self.mapLists.get(parseInt(item.goods_key))].showCart = true
					}
				})
				self.emptyCategoryRefresh()
			},
			loadMore(){
				if (this.loadingType === 2) {
					return
				}
				this.loadingType = 1
				this.currentPage++;
				this.searchGoods()
			}
		},
		onPullDownRefresh() {
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
	.main{
	}
	.top {
	   width: 100%;
	   height: 85upx;
	   background: #1dc422;
	   display: flex;
	   flex-direction: column;
	   align-items: center;
	 }
	 .top  .search {
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

	.top  .search .keyword {
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
	.goods_empty {
		width: 184upx;
		height: 128upx;
		margin-bottom: 31upx;
	}
	.search_button{
		width: 70upx;
		height: 70upx;
	}
	.VerticalMain{
		background-color: #FFFFFF;
	}

	.VerticalNav.nav {
		width: 200upx;
		white-space: initial;
		border-right: 1upx solid #F8F8F8;
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

	.VerticalNav.nav .cu-item.cur {
	}

	.VerticalNav.nav .cu-item.cur::after {
		content: "";
		width: 8upx;
		height: 30upx;
		border-radius: 10upx 0 0 10upx;
		position: absolute;
		background-color: currentColor;
		top: 0;
		right: 0upx;
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
		align-items:center;
		justify-content:center;
		display:flex;
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
		flex: 1;
	}
	.buy {
		width: 140upx;
		height: 50upx;
		line-height: 50upx;
		background: #e84118;
		border-radius: 25upx;
		text-align: center;
		font-size: 20upx;
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
	.goods-center-page{
		display: -webkit-box;
		display: -webkit-flex;
		display: -ms-flexbox;
		display: flex;
		-webkit-box-orient: vertical;
		-webkit-box-direction: normal;
		-webkit-flex-direction: column;
		-ms-flex-direction: column;
		flex-direction: column;
		-webkit-box-align: center;
		-webkit-align-items: center;
		-ms-flex-align: center;
		align-items: center;
		margin-top:200rpx;

	}
</style>
