<template>
	<view>
		<error-tip :propData="errorData" @hide="errorHide"></error-tip>
		<view class="items">
			<view class="item" @click="toAddress" style="align-items: center;">
				<view class="address-container row-container" v-if="address.address">
					<img src="/static/chaoyuezu/location.png" style="width:68upx;height:68upx;margin-left:30upx">
					<view class="coloum-container " style="margin-left:20upx">
						<view class="row-container">
							<!-- <text style="color:#999999;width: 100upx;" v-if="!isoneprice">租户：</text> -->
							<text style="color:#999999;width: 100upx;">用户：</text>
							<view class="text-black one-line-dot" style="margin-right: 10upx;">{{ address.name }}</view>
							<view class="text-black one-line-dot" style="flex:1">{{ address.mobile }}</view>
						</view>
						<view class="row-container">
							<text style="color:#999999;width: 100upx;">地址：</text>
							<!--                <view class="cu-tag tag round bg-red" v-if="address.is_default">默认</view>-->
							<!--                <view class="cu-tag tag round bg-blue" v-if="address.tag">{{ address.tag }}</view>-->
							<view class="address text-black one-line-dot" style="width: 500upx;">{{ address.province + address.city + address.area + ' ' + address.address }}</view>
						</view>
					</view>
				</view>
				<view v-else class="no-address-container">暂无收货地址，立即添加</view>
			</view>
		</view>
		<view class="items mrg-top-20" v-for="(item, index) in goodses" :key="index">
			<view class="item">
				<block>
					<view class="content">
						<image :src="image_root + item.pic" />
						<text class="title">{{ item.name }}</text>
						<view class="descs coloum-container">
							<div class="desc one-line-dot">套餐：{{item.attr_names}}</div>
							<div class="desc one-line-dot" v-if="!isoneprice">租期起算日：{{rentTime.start}}</div>
							<div class="desc one-line-dot" v-if="!isoneprice">租期结止日：{{rentTime.end}}</div>
							<div class="desc one-line-dot">数量：{{item.num}}</div>
						</view>
						<view class="item">
							<view class="attr" v-for="(good, i) in goodses" :key="good.goods_id" style="margin-top: 20upx;">
							</view>
						</view>
					</view>
				</block>
				<!-- 特惠套餐 -->
				<block v-if="item.preferJson && item.preferJson.length > 0">
					<view class="content" v-for="(item,index) in item.preferJson" :key='index'>
						<image :src="image_root + item.pic" />
						<text class="title">{{ item.name }}</text>
						<view class="descs coloum-container">
							<div class="desc one-line-dot">套餐：{{item.name}}</div>
							<div class="desc one-line-dot">单价：{{item.price}}</div>
							<!-- <div class="desc one-line-dot" v-if="!isoneprice">租期起算日：{{rentTime.start}}</div>
							<div class="desc one-line-dot" v-if="!isoneprice">租期结止日：{{rentTime.end}}</div> -->
							<!-- <div class="desc one-line-dot">数量：{{item.num}}</div> -->
							<div class="desc one-line-dot">数量：{{goodses[0].num}}</div>
						</view>
						<view class="item">
							<view class="attr" v-for="(good, i) in goodses" :key="good.goods_id" style="margin-top: 20upx;">
							</view>
						</view>
					</view>
				</block>

				<div class="coloum-container" style="padding:0px 30upx;">
					<div style="height: 1px;width: 690upx;background: #F8F8F8;margin-bottom: 30upx;"></div>
					<div class="row-container text-black" style="height: 80upx;font-size: 32upx;" v-if="!isoneprice">
						<div>每期租金</div>
						<div style="margin-left: auto;">¥ {{(cost_per_month).toFixed(2)}} * 1{{rentOrderPeroid.unit}}</div>
					</div>
					<div class="row-container text-black" style="height: 80upx;font-size: 32upx;" v-else>
						<div>购买价格</div>
						<div style="margin-left: auto;">¥ {{goodses[0].original_price}}</div>
					</div>
					<div class="row-container text-black" style="height: 80upx;font-size: 32upx;" v-if="goodses[0].rent_type !==  null">
						<div class='row-container text-black' v-if="goodses[0].rent_type == 0">
							<div>特惠商品金额</div>
							<div style="margin-left: auto;">¥ {{preferJsonmoney}}</div>
						</div>
						<div class='row-container text-black' v-else>
							<div>特惠商品租金</div>
							<div style="margin-left: auto;">¥ {{((preferJsonmoney/rentOrderPeroid.periods)* goodses[0].num).toFixed(2)}} * 1{{rentOrderPeroid.unit}}</div>
						</div>

					</div>
					<!--          <div class="row-container" style="height: 60upx;color: #999;">-->
					<!--            <div>尾期租金</div>-->
					<!--            <div style="margin-left: auto;">¥ {{(cost_per_month).toFixed(2)}} * 1{{rentOrderPeroid.unit}}</div>-->
					<!--          </div>-->
					<div class="row-container" style="height: 60upx;color: #999;" v-if="!isoneprice">
						<div>总期数</div>
						<div style="margin-left: auto;">{{rentOrderPeroid.periods}}{{rentOrderPeroid.unit}}</div>
					</div>
					<!--<div class="row-container" style="height: 60upx;color: #999;">-->
					<!--<div>总租金</div>-->
					<!--<div style="margin-left: auto;">¥ {{(cost_per_month*rentOrderPeroid.periods).toFixed(2)}}</div>-->
					<!--</div>-->
					<!-- <div class="row-container" style="height: 60upx;color: #999;" v-if="!isoneprice">
						<div>物流运费</div>
						<div style="margin-left: auto;" v-if="delivery_fee>0">¥ {{delivery_fee.toFixed(2)}}</div>
						<div style="margin-left: auto;font-size: 10px;" v-else>租期大于12月（包含12个月）全国包邮（部分地区除外）</div>
					</div> -->
					<div class="row-container" style="height: 60upx;color: #999;">
						<div>物流运费</div>
						<!-- <div style="margin-left: auto;" v-if="delivery_fee>0">¥ {{delivery_fee.toFixed(2)}}</div> -->
						<div style="margin-left: auto;font-size: 10px;" v-if="rentOrderPeroid.periods >= 12">全国包邮(部分地区除外)</div>
						<div style="margin-left: auto;font-size: 10px;" v-else>顺丰到付(仅限12期及以上)</div>
					</div>
				</div>

				<div class="coloum-container" style="padding:0px 30upx;" v-if="associationsPrice">
					<div style="height: 1px;width: 690upx;background: #F8F8F8;margin-bottom: 30upx;"></div>
					<div class="row-container text-black" style="height: 80upx;font-size: 32upx;">
						<div>增值服务</div>
						<div style="margin-left: auto;">￥{{(associationsPrice).toFixed(2)}}</div>
					</div>
					<view v-for="(associa, index) in associations" :key="index">
						<div class="row-container" style="height: 60upx;color: #999;">
							<div>{{associa.name}}</div>
							<div style="margin-left: auto;">¥ {{(associa.price).toFixed(2)}}*{{associa.num}}</div>
						</div>
					</view>
				</div>

				<!-- 溢价费 -->
				<div class="coloum-container" style="padding:0px 30upx;" v-if="goodses[0].bargain_fee">
					<div style="height: 1px;width: 690upx;background: #F8F8F8;margin-bottom: 30upx;"></div>
					<div class="row-container text-black" style="height: 80upx;font-size: 32upx;">
						<div>溢价费</div>
						<div style="margin-left: auto;">￥{{(goodses[0].bargain_fee * goodses[0].num).toFixed(2)}}</div>
					</div>
					<!-- <view v-for="(associa, index) in associations" :key="index">
						<div class="row-container" style="height: 60upx;color: #999;">
							<div>{{associa.name}}</div>
							<div style="margin-left: auto;">¥ {{(associa.price).toFixed(2)}}*{{associa.num}}</div>
						</div>
					</view> -->
				</div>

				<div class="coloum-container" style="padding:0px 30upx;" v-if="!isoneprice">
					<div style="height: 1px;width: 690upx;background: #F8F8F8;margin-bottom: 30upx;"></div>
					<div class="row-container text-black" style="height: 80upx;font-size: 32upx;">
						<div>需缴纳押金</div>
						<div style="margin-left: auto;">待审核</div>
					</div>
					<!-- <div class="row-container" style="height: 60upx;color: #999;">
            <div>押金冻结方式</div>
            <div style="margin-left: auto;">文案 </div>
          </div> -->
				</div>

				<div class="coloum-container" style="padding:0px 30upx;" v-if="!isoneprice">
					<div style="height: 1px;width: 690upx;background: #F8F8F8;margin-bottom: 30upx;"></div>
					<!-- <div class="row-container text-black" style="height: 80upx;font-size: 32upx;">
            <div>买断价</div>
            <div style="margin-left: auto;">￥{{(parseFloat(cost_per_month*rentOrderPeroid.periods)+parseFloat(cost_money)).toFixed(2)}}</div>
          </div> -->
					<div class="row-container" style="height: 60upx;color: #999;">
						<div>* 到期如需买断 预计补差价</div>
						<div style="margin-left: auto;">¥ {{(cost_money).toFixed(2)}}</div>
					</div>
				</div>
				<block v-if="!isoneprice">
					<view class="subTotal" v-if="isactive">
						<text style="color: grey;">小计：</text>
						<!-- ¥{{(delivery_fee + cost_per_month + original_price - parseFloat(getCreditCutAmount())).toFixed(2)}} -->
						¥{{(associationsPrice + delivery_fee + cost_per_month + original_price*productNum + ((goodses[0].bargain_fee?goodses[0].bargain_fee:0) * goodses[0].num) + ((goodses[0].rent_type == 0?preferJsonmoney:preferJsonmoney/rentOrderPeroid.periods) * goodses[0].num) - parseFloat(getCreditCutAmount())).toFixed(2)}}
					</view>
				</block>
				<block v-else>
					<view class="subTotal" v-if="isactive">
						<text style="color: grey;">小计：</text>
						<!-- ¥{{(delivery_fee + cost_per_month + original_price - parseFloat(getCreditCutAmount())).toFixed(2)}} -->
						¥{{(goodses[0].original_price + associationsPrice).toFixed(2)}}
					</view>
				</block>

				<view class="subTotal" v-if="!isactive">
					<text style="color: grey;">活动价:</text>
					<!-- ¥{{(delivery_fee + cost_per_month + original_price - parseFloat(getCreditCutAmount())).toFixed(2)}} -->
					¥ 1元(首月)
				</view>
			</view>
		</view>
		<view class="activehd">
			<view>活动邀请码</view>
			<view><input type="text" placeholder="专属活动邀请码,可不填" @input="factivecode" /></view>
		</view>
		<div class="coloum-container mrg-top-20 bg-white" style="padding:0px 30upx;">
			<div style="height: 1px;width: 690upx;background: #F8F8F8;margin-bottom: 30upx;"></div>
			<div class="row-container text-black" style="height: 80upx;font-size: 32upx;">
				<div>支付方式</div>
			</div>
			<checkbox-group class="block" @change="CheckboxChange">
				<radio-group @change="radioChange">
					<view class="cu-form-group" style="padding-left: 0upx;">
						<view class="row-container align-center">
							<radio class='round blue' value="wxh5pay" :class="payType=='wxh5pay'?'checked':''" :checked="payType=='wxh5pay'?true:false"
							 color="#0081ff"></radio>
							<view style="font-size: 24upx;color: #222222;margin-left: 12upx;">微信支付</view>
						</view>
					</view>
					<view class="cu-form-group" style="padding-left: 0upx;">
						<view class="row-container align-center">
							<radio class='round blue' value="alih5pay" :class="payType=='alih5pay'?'checked':''" :checked="payType=='alih5pay'?true:false"
							 color="#0081ff"></radio>
							<view style="font-size: 24upx;color: #222222;margin-left: 12upx;">支付宝支付</view>
						</view>
					</view>
				</radio-group>
			</checkbox-group>
		</div>

		<view class="ad-box" style="margin-top:40rpx;" v-if="ads !== undefined && ads.createOrderBanner !== null">
			<image class="ad" :src="image_root + ads.createOrderBanner.pic" @tap="adClick(ads.createOrderBanner.param)" />
		</view>
		<view style="margin: 20rpx 20rpx 160rpx 28rpx; display:flex; flex-direction: row; flex-wrap: wrap; align-items: center;"
		 v-if="!isoneprice">
			<radio :checked="ifCheck" class="blue" style="margin-right: 10rpx;" @click="ifCheck = !ifCheck" color="#52ABFC"></radio>
			<text style="color: #999; font-size: 28rpx; margin-right: 10rpx;">我已经阅读并同意</text>
			<text @click="toArticle('4bfe53e037814d2c95cc2e108a1ae568', '租赁服务协议')" style="color: #1677FF;">《租赁服务协议》</text>
			<text @click="toArticle('f01d136d4e9e4a9d98877ad1126908d0', '隐私权政策')" style="color: #1677FF;">《隐私权政策》</text>
			<text @click="toArticle('805865ea5e714e678874f0d26b0e4b1a', '质检还机赔偿说明')" style="color: #1677FF;">《质检还机赔偿说明》</text>
		</view>
		<view style="height: 80rpx;"></view>
		<view class="bottom-tools" style="padding: 20upx 0;">
			<!--      <view class="left">-->
			<!--        <view class="all-price">-->
			<!--          <text>总计：</text>-->
			<!--          <text class="price">￥{{ actualPrice }}</text>-->
			<!--        </view>-->
			<!--        <view class="desc">总额：￥{{ allprice }} 配送费：¥{{ devliery_cost }} 优惠：￥{{ coupon.money }}</view>-->
			<!--      </view>-->
			<!--      <button class="cu-btn buy" @tap="subOrder">去结算</button>-->
			<button v-if="!isoneprice" class="cu-btn round bg-gradual-blue" style="width: 690upx;height: 80upx;margin-left: 30upx;-webkit-border-radius: 1000upx;-moz-border-radius: 1000upx;border-radius: 1000upx;"
			 @click="subOrder(false)">提交审核</button>
			<button v-else class="cu-btn round bg-gradual-blue" style="width: 690upx;height: 80upx;margin-left: 30upx;-webkit-border-radius: 1000upx;-moz-border-radius: 1000upx;border-radius: 1000upx;"
			 @click="subOrder(true)">提交订单</button>
		</view>
		<delivery-plan-dialog :show="showDeliveryPlan" :planMode="planMode" :plan="deliveryPlan" :deliveryKey="deliveryKey"
		 :num="deliveryNum" :index="deliveryIndex" @clickRidio="switchDeliveryPlan" @hide="hideDeliveryPlan" @generatePlan="generatePlan"></delivery-plan-dialog>
		<wx-phone-dialog :propData="phoneDialogData" @getPhoneNumber="getPhoneNumber"></wx-phone-dialog>
		<coupon-seclector :propData="couponSelector" :coupons="coupons" btnText="立即使用" @close="closeCouponSelector"
		 @getCouponById="getCouponById"></coupon-seclector>
		<delivery-pattern-dialog :show="showPatternDialog" :devliery_home_switch="config.devliery_home_switch"
		 :devliery_leader_switch="config.devliery_leader_switch" :devliery_day_setting="config.devliery_day_setting"
		 :devliery_cost_setting="config.devliery_cost_setting" @close="showPatternDialog = false" @modeHome="modeHome"
		 @modeSelf="modeSelf"></delivery-pattern-dialog>

		<coupon-modal :show="isShowCouponModal" @close="hideCouponModal"></coupon-modal>
		<monthly-supply-modal :show="isShowMonthlySupplyModal" :staging="staging[stageIdx]" :originalPrice="Number(allprice)"
		 @close="hideMonthlySupplyModal"></monthly-supply-modal>
		<myDialog title="提示" content="请确认订单无误,点击确认进入审核阶段" confirmColor="var(--blue)" :dialog-show="payDialog" @cancelButton="payDialog=false"
		 @confirmButton="subOrder(true)"></myDialog>
	</view>
</template>

<script>
	import TimerCounter from '../../common/js/timeCounter.js'
	import Config from '../../common/js/Config.js'
	import CreditConfig from '../verify/config.js'
	import Toast from '../../common/js/toast.js'
	import Pay from '../../common/js/pay.js'
	import Util from '../../common/js/util.js'

	import WxPhoneDialog from '../../components/yx_dialog/myWXPhoneDialog.vue'
	import UniBadge from '../../components/uni-badge.vue'
	import CouponSeclector from '../../components/yx_dialog/myCouponSelector.vue'
	import ErrorTip from '../../components/yx_dialog/myErrorTip.vue'
	import MyOrderTip from '../../components/yx_dialog/myOrderTip.vue'
	import DeliveryPlanDialog from '../../components/yx_dialog/deliveryPlanDialog.vue'
	import DeliveryPatternDialog from '../../components/yx_dialog/deliveryPatternDialog.vue'
	import CouponModal from './CouponModal.vue'
	import MonthlySupplyModal from './MonthlySupplyModal.vue'
	import {
		mapMutations
	} from 'vuex'
	export default {
		data() {
			return {
				activecode: '', //活动邀请码
				isoneprice: false, //是否为一口价
				isactive: true, //是否为一元购活动
				skuGoodsPrice: 0, //上页面带过来的商品价格
				payDialog: false,
				ifCheck: false,
				show: false, //
				goodses: [], //下单商品列表
				expectTime: '', //到货时间
				image_root: '', // 图片域名
				allprice: 0, // 总金额
				productNum: 0, // 产品数量
				actualPrice: 0, // 最终金额
				coupon: {
					money: 0,
					id: 0,
				}, //优惠金额
				showComfrimDialog: false,
				phoneDialogData: {
					show: false,
				}, // 获取用户电话信息
				isWeixinPay: false, //是否微信支付
				payType: 'wxh5pay',
				couponLength: 0, //优惠券数量
				couponSelector: {
					show: false,
				}, // 优惠券选择器
				coupons: [], // 优惠券列表
				// 错误提示
				errorData: {
					show: false,
					desc: '',
				},
				orderTipData: {
					show: true,
				},
				isPayIng: false,
				showDeliveryPlan: false,
				deliveryKey: 'normal',
				deliveryNum: 0,
				deliveryIndex: 0,
				deliveryPlan: [],
				planMode: 'normal',
				address: {
					name: '请选择地址',
					mobile: '',
					tag: '',
					is_default: 0,
					province: '',
					city: '',
					area: '',
					address: '',
				},
				is_choose_address: false,
				showPatternDialog: false,
				delivery_mode: 'home',
				devliery_cost: 0,
				delivery_store: {
					name: '',
					address: '',
				}, //配送方式为自提时，自提点的信息
				config: {
					credit_ali_pay: '0', //是否开启支付宝字符
					credit_point_pay: '0', //是否开启积分兑换
					credit_point_to_money: '1', //积分-人民币兑换比例
					credit_return_url: '1', //返回的url
					credit_search_holder: '1', //搜索关键词
					credit_wechat_pay: '0', //是开开启微信支付
				},
				// quotaResult: {enabled:true, quota: 0.01},
				quotaResult: {},
				stageTotal: 0,
				// staging: [{repay_amount_sum: 6666, periods: 3, repayment_detail_list: [{repay_amount: 2179}]}, {repay_amount_sum: 7777, periods: 6, repayment_detail_list: [{repay_amount: 1379}]}, {repay_amount_sum: 8888, periods: 9, repayment_detail_list: [{repay_amount: 1179}]}],
				staging: [],
				stageObj: {},
				stageIdx: 0,
				cAttr: {},
				cAttrName: {},
				isShowCouponModal: false,
				isShowMonthlySupplyModal: false,
				creditAmount: 0.00,
				original_price: 0.00,
				rentOrderPeroid: {
					unit: '周',
					periods: 10
				},
				rentTime: {
					start: '',
					end: ''
				},
				cost_money: -1, //买断价


				//租赁相关
				cost_per_month: 0, //单期租金
				rent_interest_rate: 0, //利息率
				delivery_fee: 0, //运费

				associations: [],
				associationsPrice: 0,
			}
		},
		mixins: [TimerCounter, Toast, Pay],
		components: {
			WxPhoneDialog,
			UniBadge,
			CouponSeclector,
			ErrorTip,
			MyOrderTip,
			DeliveryPlanDialog,
			DeliveryPatternDialog,
			CouponModal,
			MonthlySupplyModal
		},
		watch: {
			ads: {
				handler() {},
				immediate: true,
			},
			goodses: {
				handler() {
					if (this.goodses.length !== 0 && this.actualPrice !== 0) {
						this.getCouponList()
					}
				},
				immediate: true,
			},
			actualPrice: {
				handler() {
					if (this.goodses.length !== 0 && this.actualPrice !== 0) {
						this.getCouponList()
					}
				},
				immediate: true,
			},
		},
		computed: {
			group() {
				return this.$store.state.group
			},
			ads() {
				return this.$store.state.ads
			},
			globalI() {
				return this.$store.state.globalI
			},
			userInfo() {
				return this.$store.state.userInfo
			},
			point_token() {
				return this.$store.state.point_token
			},
			totalPrice() {
				return this.goodses.reduce((accumulator, current) => accumulator + current.num * current.price, 0).toFixed(2)
			},
			preferJsonmoney() {
				let preferJsonmoney = 0
				if (this.goodses[0].preferJson && this.goodses[0].preferJson.length > 0) {
					this.goodses[0].preferJson.forEach((item, index) => {
						preferJsonmoney += item.price
					})
				}
				return preferJsonmoney
			}
		},
		onLoad(options) {
			if (options.dims) {
				this.dims = options.dims
			}
			let self = this
			if (options.skuGoodsPrice) {
				this.skuGoodsPrice = options.skuGoodsPrice
			}
			// self.creditAmount = (parseInt(options.creditAmount)/100).toFixed(2)
			self.getCreditAmount()
			self.getDeliveryFee()
			this.setUuid(Config.PLAT_UUID)
			// self.getConfig()
			self.initPage(options.way)
			self.parseSpecificCode(options.rentCode)
			self.getPeriodSetting(options.rentCode)

			self.$event.$on('planChange', plan => {
				self.createPlan(plan)
			})

			self.$event.$on(Config.EVENT.REFRESH_DEFAULT_LEADER, ({}) => {
				(self.delivery_store = {
					user_key: self.userInfo.bind_leader,
					name: self.userInfo.community_name,
					address: self.userInfo.community_address,
				})//配送方式为自提时，自提点的信息
				
			})
			self.getTrialBalance()
		},
		getCredits() {},
		onShow() {
			let self = this
			// temp solution
			// self.setUserInfo({uid: '1199528476659490817'})

			// self.getUserInfo()
			self.getDefaultAddress()
			// let timer = setInterval(()=>{
			// 	if (self.goodses.length === 0) {
			// 		self.initPage()
			// 	} else {
			// 		clearInterval(timer)
			// 	}
			// }, 100)
		},
		methods: {
			...mapMutations(['setUserInfo', 'setRefreshCart', 'addIndexRefresh', 'addCategoryRefresh', 'setisNewcomers',
				'setUuid'
			]),
			factivecode: function(event) {
				this.activecode = event.detail.value
			},
			initPage: function(way) {
				let self = this
				if (this.goodses.length !== 0) return
				var a = getCurrentPages()
				var t = a[a.length - 2]
				if (way === '1') {
					var e = []
					var cart = t.data.cart
					cart.forEach((item, index) => {
						if (item.status) {
							e.push(
								Object.assign(item, {
									mode: 'normal',
								})
							)
						}
					})
				} else {
					var e = [
						Object.assign(uni.getStorageSync('goods'), {
							mode: 'normal',
						}),
					]
				}
				this.image_root = uni.getStorageSync('image_root')
				var o = 0
				for (var s = 0; s < e.length; s++) {
					o += e[s].price * e[s].num
				}
				this.show = true
				this.goodses = e
				this.goodses.forEach((item, index) => {
					if (item.attr_names.indexOf('一元买断') !== -1) {
						this.isactive = false
					} else {
						this.isactive = true
					}
				})
				this.productNum = this.getProductNum(e)
				this.allprice = o.toFixed(2)
				this.original_price = parseFloat(this.goodses[0].original_price)

				this.cost_money = this.goodses[0].cost_price * this.goodses[0].num
				this.rent_interest_rate = this.goodses[0].rent_interest_rate
				this.getTotalPrice()
				this.goodses.forEach((good, index) => {
					// self.getStage(good.goods_id, good.version)
				})
				this.goodses.forEach((item, index) => {
					if (item.attr_names.indexOf('一口价') !== -1) {
						this.isoneprice = true
					}
				})
				const cAttr = uni.getStorageSync('cAttr')
				this.cAttr = cAttr

				this.associations = uni.getStorageSync('associations')
				let assoPrice = 0
				this.associations.forEach(item => {
					assoPrice += item.price * item.num
				})
				this.associationsPrice = assoPrice
			},
			getCreditAmount() {
				let self = this
				let postData = {
					appKey: '123',
					userKey: self.userInfo.user_key
				}
				self.$Phttp.get(CreditConfig.REQUEST_URLS.creditLimit, postData).then(res => {
					res = res.data
					if (res.code === 200) {
						self.creditAmount = ((res.data.creditAmount - res.data.freezeAmount - res.data.frozenAmount) / 100).toFixed(2)
					}
				})
			},
			parseSpecificCode(periodsCode) {
				let self = this
				let postData = {
					periods_code: periodsCode
				}
				self.$Phttp.post(Config.JAVA_SAAS_URLS.parseSpecificCode, postData).then(res => {
					res = res.data
					if (res.code === 0) {
						self.rentOrderPeroid.periods = res.data.periods
						self.rentOrderPeroid.unit = self.parseUnit(res.data.periods_type)
						self.getTotalPrice()
					}
				})
			},
			getPeriodSetting(code) {
				let self = this
				let postData = {
					periodCode: code
				}
				self.$Phttp.get(CreditConfig.REQUEST_URLS.getPeriodSettingUsingGET, postData).then(res => {
					res = res.data
					if (res.code === 200) {
						self.rentTime.start = res.data.rentStartDate
						self.rentTime.end = res.data.rentEndDate
					}
				})
			},
			parseUnit(unit) {
				switch (unit) {
					case 1:
						return '日'
					case 2:
						return '周'
					case 3:
						return '月'
					case 4:
						return '年'
				}
			},
			getTrialBalance() {
				let self = this
				// let postData = {
				//   rentAmout: self.actualPrice*100,
				//   userKey: self.userInfo.user_key
				// }
				// self.$Phttp.post(Config.XINYONG_URLS.getTrialBalance, postData, "application/json").then(res => {
				// })
			},
			radioChange: function(e) {
				this.payType = e.target.value
			},
			selectAttr: function(i, name, k, v) {
				this.$set(this.cAttr, k, v)
				this.$set(this.cAttrName, k, name)
				let cAttr = []
				let cAttrName = []
				Object.values(this.cAttr).map(value => cAttr.push(value))
				Object.values(this.cAttrName).map(value => cAttrName.push(value))
				this.goodses[i]['attr_ids'] = `,${cAttr.join(',')},`
				this.goodses[i]['attr_names'] = `,${cAttrName.join(',')},`
			},
			getStage: function(id, version) {
				let self = this
				self.toast({
					type: 'loading',
					time: 8000,
				})
				self.$Phttp.get(Config.JAVA_SAAS_URLS.getStage, {
					goodsId: id,
					version
				}).then(res => {
					self.toast(true)
					res = res.data
					if (res.code === 0 && res.data) {
						self.quotaResult = res.data.quota_result || {}
						self.stageObj = res.data.strategy_result || {}
						self.staging = self.stageObj.repayment_info_list || []
						self.selectStage(0)
					} else {
						this.toast({
							desc: res.msg || '获取分期方案失败',
						})
					}
				})
			},
			getDeliveryFee() {
				let self = this
				self.$Phttp.post(Config.JAVA_SAAS_URLS.getDeliveryFee, {}).then(res => {
					res = res.data
					if (res.code === 0) {
						self.delivery_fee = parseFloat(res.msg) || 0
					}
				})
			},
			getConfig: function() {
				let self = this
				self.$Phttp.post(Config.JAVA_SAAS_URLS.getSetting, {}).then(res => {
					res = res.data
					if (res.code === 0) {
						self.config = Object.assign(self.config, res.data)
						if (self.config.credit_point_pay === '1') {
							self.payType = 'point'
							return
						}
						if (self.config.credit_wechat_pay === '1') {
							self.payType = 'wxh5pay'
							return
						}
						if (self.config.credit_ali_pay === '1') {
							self.payType = 'alih5pay'
							return
						}
					}
				})
			},
			selectDeliveryPattern: function() {},
			getUserInfo: function() {
				let self = this
				self.$Phttp.post(Config.JAVA_SAAS_URLS.getUserInfo, {}).then(res => {
					res = res.data
					if (res.code === 0 && res.data) {
						self.setUserInfo(res.data)
					}
				})
			},
			toAgreement: function() {
				// // #ifdef H5
				// window.location.href = Config.CONTRACT_URL
				// // #endif

				// // #ifdef APP-PLUS
				// const CONTRACT_URL = 'https://fqy.hzdataplatform.com/h5/#/store/storeContract/total'
				// plus.runtime.openWeb(CONTRACT_URL)
				// // #endif
			},
			getDefaultAddress: function() {
				let self = this
				let postData = {}
				if (Util.containsKey(self.userInfo, 'user_key')) {
					postData = Object.assign({
						user_key: self.userInfo.user_key,
					})
				}
				// if (Util.containsKey(self.userInfo, 'uid')) {
				//   postData = Object.assign({
				//     saas_userid: self.userInfo.uid,
				//     customerId: self.userInfo.customer_id,
				//   })
				// }
				self.$Phttp.post(Config.JAVA_SAAS_URLS.getSassDefaultAddress, postData).then(res => {
					res = res.data
					if (res.code === 0) {
						if (res.data === null) {
							self.is_choose_address = false
						} else {
							self.is_choose_address = true
							self.address = Object.assign(self.address, res.data)
						}
					}
				})
			},
			getCredits() {
				return (this.actualPrice * parseFloat(this.config.credit_point_to_money)).toFixed(2)
			},
			getProductNum: function(list) {
				var num = 0
				for (var i = 0; i < list.length; i++) {
					num += list[i].num
				}
				return num
			},
			getTotalPrice: function() {
				this.actualPrice = (this.allprice - parseFloat(this.coupon.money)).toFixed(2)
				this.cost_per_month = this.actualPrice / this.rentOrderPeroid.periods + this.actualPrice * this.rent_interest_rate *
					0.01
			},
			adClick: function(id) {
				uni.navigateTo({
					url: '/pages/index/product?id=' + id,
				})
			},
			create: function() {
				// if (this.allprice === '0.00') {
				// 	this.toast({
				// 		type: 'warn',
				// 		desc: '无法购买'
				// 	})
				// 	return
				// }
				if (this.delivery_mode === 'home') {
					this.subOrder()
					return
				}
				this.showComfrimDialog = true
			},
			checkUserPhone: function() {
				// #ifdef APP-PLUS
				// #endif
			},
			hideComfirmDialog: function() {
				this.showComfrimDialog = false
			},
			hideDeliveryPlan: function() {
				this.showDeliveryPlan = false
			},
			subOrder2() {
				uni.navigateTo({
					url: '/pkChaoYueZu/order/detail?id=729'
				})
				// window.location.hash='/pkChaoYueZu/order/detail'
			},
			subOrder: function(isForce = false) {
				let self = this
				if (self.isPayIng) return
				self.isPayIng = true
				setTimeout(() => {
					self.isPayIng = false
				}, 1000)
				if (self.delivery_mode === 'home') {
					if (!Util.containsKey(self.address, 'user_address_key')) {
						self.toast({
							desc: '请填写收货地址～',
							type: 'warn',
							time: 2000,
						})
						return
					}
				}
				if (!self.isoneprice) {
					if (!self.ifCheck) {
						self.toast({
							desc: '请阅读并同意《租赁服务协议》',
							time: 2000,
						})
						return
					}
				}


				if (self.delivery_mode === 'self') {
					if (!Util.containsKey(self.address, 'user_address_key')) {
						self.toast({
							desc: '请填写收货地址～',
							type: 'warn',
							time: 2000,
						})
						return
					}
				}
				let goods_num = 0
				let isAttr = false
				self.goodses.forEach((good, index) => {
					if (good.attrgroups && good.attrgroups.length > 0 && !good.attr_keys) {
						isAttr = false
						return
					} else {
						isAttr = true
						goods_num += good.num
					}
				})
				self.associations.forEach((item, index) => {
					goods_num += item.num
				})

				if (self.isoneprice !== 1) {
					if (self.creditAmount === 0) {
						uni.setStorageSync("dialogData", {
							title: '提示',
							desc: '请等待额度审核，无法下单',
							page: 'closePage'
						})
						uni.navigateTo({
							url: '/pkChaoYueZu/dialog/popup'
						})
						return
					}

					// if (self.original_price * self.productNum - self.getCreditCutAmount() > 0) {
					// 	uni.setStorageSync("dialogData", {
					// 		title: '提示',
					// 		desc: '您的额度不足，请联系客服',
					// 		page: 'closePage'
					// 	})
					// 	uni.navigateTo({
					// 		url: '/pkChaoYueZu/dialog/popup'
					// 	})
					// 	return
					// }
				}

				self.toast({
					desc: '正在生成订单...',
					type: 'loading',
					time: 8000,
				})
				let pamount;
				let preferJsonmoney = 0;
				if (self.goodses[0].preferJson && self.goodses[0].preferJson.length > 0) {
					self.goodses[0].preferJson.forEach((item, index) => {
						preferJsonmoney += item.price
					})
				}
				let preferJsonmoneycopy = (self.goodses[0].rent_type == 0 ? preferJsonmoney : (preferJsonmoney / self.rentOrderPeroid
					.periods) * self.goodses[0].num)
				if (!self.isactive) {
					pamount = 1
				} else if (self.isoneprice) {
					pamount = self.goodses[0].original_price + self.associationsPrice
				} else {
					pamount = self.associationsPrice + self.delivery_fee + self.cost_per_month + self.original_price *
						self.productNum + (self.goodses[0].bargain_fee ? self.goodses[0].bargain_fee * self.goodses[0].num : 0) + preferJsonmoneycopy -
						parseFloat(
							self.getCreditCutAmount())
				}
				let prefer_amountcopy;
				if (self.goodses[0].rent_type !== null && self.goodses[0].rent_type == 1) {
					prefer_amountcopy = (preferJsonmoney / self.rentOrderPeroid.periods) * self.goodses[0].num
				} else if (self.goodses[0].rent_type !== null && self.goodses[0].rent_type == 0) {
					prefer_amountcopy = preferJsonmoney * self.goodses[0].num
				} else {
					prefer_amountcopy = 0
				}
				let data = {
					leader_key: "",
					amount: parseFloat(self.associationsPrice) + parseFloat(self.delivery_fee) + parseFloat(self.cost_per_month *
						self.rentOrderPeroid.periods),
					goodses: JSON.stringify(self.goodses),
					coupon_money: self.coupon.money,
					usercoupon_key: self.coupon.usercoupon_key ? self.coupon.usercoupon_key : "",
					pay_amount: pamount,
					lng: self.address.lng,
					lat: self.address.lat,
					order_type: 1,
					address_key: self.address.user_address_key ? self.address.user_address_key : 0,
					delivery_money: self.delivery_fee,
					goods_num: goods_num,
					name: self.address.name,
					mobile: self.address.mobile,
					address: self.address.province + self.address.city + self.address.area + self.address.address,
					user_key: self.userInfo.user_key,
					deposit_money: 0,
					is_collected: 1,
					user_origin: 'zulin',
					use_deposit_money: 0,
					dims: self.dims ? self.dims : '',
					bargain_fee: self.goodses[0].bargain_fee ? (self.goodses[0].bargain_fee * self.goodses[0].num) : 0,
					prefer_amount: prefer_amountcopy,
					prefer_json: JSON.stringify(self.goodses[0].preferJson && self.goodses[0].preferJson.length ? self.goodses[0].preferJson :
						[])
				}
				if (!isForce) {
					self.payDialog = true
					self.isPayIng = false
					self.toast(true)
					return
				}
				data.owing_amount = parseFloat(data.amount - data.pay_amount).toFixed(2)
				if (self.delivery_mode === 'self') {
					data = Object.assign(data, {
						leader_key: self.delivery_store.user_key,
						order_type: 2,
					})
				}
				// #ifdef APP-PLUS
				if (self.payType === 'alih5pay') {
					data.payment_type = 'alipay'
					data.pay_type = 2
				}
				if (self.payType === 'wxh5pay') {
					data.payment_type = 'wxapppay'
					data.pay_type = 1
				}
				if (self.payType === 'point') {
					data.payment_type = 'point'
					data.pay_type = 3
				}
				if (self.payType === 'staging') {
					const periodObj = self.staging[self.stageIdx] || {}
					if ((!self.quotaResult.enabled && !periodObj.periods) || (!!self.quotaResult.enabled && !periodObj.periods) || (!
							self.quotaResult.enabled && periodObj.periods)) {
						self.toast({
							desc: '暂无可用支付方式',
						})
						return
					}
					data.payment_type = 'installment'
					data.pay_type = 4
					data.periods = periodObj.periods
				}
				// #endif
				// if (self.actualPrice == 0) {
				// 	data = Object.assign(data, {
				// 		payment_type: 'free',
				// 		pay_type: 5,
				// 	})

				// }
				// data.payment_type = 'wxapppay'

				let rentInfoVO = {
					buy_out_amount: self.cost_money * 100,
					credit_amount: 0,
					credit_increase_amount: 0,
					fist_pay_amount: self.cost_per_month * 100,
					interest_rate: self.rent_interest_rate,
					rent_amount: self.actualPrice * 100,
					rent_type: self.cost_money > 0 ? "BUYOUT" : "NORMAL",
					sku_goods_price: parseInt(self.skuGoodsPrice) * 100
				}

				let orderGoodsList = []
				self.goodses.forEach((good, gIndex) => {
					orderGoodsList.push({
						goods_key: good.goods_key,
						num: good.num,
						attr_names: good.attr_names,
						extend_price: (self.cost_per_month * self.rentOrderPeroid.periods) / good.num,
						pic: good.pic,
						attr_json: good.attr_json,
						sku_goods_price: good.attr_names.indexOf('碎屏宝') == -1 ? parseInt(self.skuGoodsPrice) * 100 : 0,
					})
				})

				let associateGoods = []

				self.associations.forEach((good, gIndex) => {
					associateGoods.push({
						goods_key: good.goods_key,
						num: good.num,
						attr_names: null
					})
				})

				let postData2 = {
					order: data,
					order_extend_vo: data,
					order_goods_list: orderGoodsList,
					associate_goods: associateGoods,
					rent_info_vo: rentInfoVO,
					code: self.activecode ? self.activecode : ''
				}
				// if(this.goodses[0].name.indexOf("成为校园")!=-1){
				// 	data.is_collected=0;
				// }
				self.$Phttp.post(Config.JAVA_SAAS_URLS.addOrder, postData2).then(res => {
					res = res.data
					self.toast(true)
					if (res.code === 0) {
						// if(this.goodses[0].name.indexOf("成为校园")==-1){
						// }
						self.autoSign(res.data.orderInfo.flex_segment1)

						// 直接去到等待页面
						uni.redirectTo({
							url: "/pkChaoYueZu/order/children/waiting"
						})
					} else {
						self.toast(true)
						self.errorData = Object.assign({
							show: true,
							desc: res.msg,
						})
					}
				})
			},
			autoSign(orderKey) {
				let getUrl = "http://192.168.0.134:8084/signature/wukong/signAuto"
				let getData = {
					orderKey: orderKey
				}
				this.$Phttp.get(getUrl, getData).then(res => {

				})
			},
			// 错误隐藏
			errorHide: function(e) {
				if (!e.detail) {
					this.errorData.show = false
					return
				}
				this.errorData = e.detail
			},
			openMap: function() {
				uni.openLocation({
					name: this.group.community,
					latitude: parseFloat(this.group.latitude),
					longitude: parseFloat(this.group.longitude),
					success: () => {
					},
				})
			},
			testApp: function(url) {
				let self = this
				var timeout,
					t = 1000,
					hasApp = true
				setTimeout(function() {
					if (!hasApp) {
						self.toast({
							time: 3000,
							desc: '您没有安装微信，请先安装微信!',
						})
					} else {}
					document.body.removeChild(ifr)
				}, 2000)
				var t1 = Date.now()
				var ifr = document.createElement('iframe')
				ifr.setAttribute('src', url)
				ifr.setAttribute('style', 'display:none')
				document.body.appendChild(ifr)
				timeout = setTimeout(function() {
					var t2 = Date.now()
					if (!t1 || t2 - t1 < t + 100) {
						hasApp = false
					}
				}, 2000)
			},
			getPhoneNumber: function(detail) {
				let self = this
				self.toast({
					desc: '加载中...',
					type: 'loading',
					time: 8000,
				})
				let data = {
					i: self.globalI,
					data: detail.encryptedData,
					iv: encodeURIComponent(detail.iv),
				}
				self.$http.post(Config.URLS.decryptTel, data).then(res => {
					res = res.data
					if (res.code === 0) {
						self.setPhoneNumber(res.data.phoneNumber)
					}
				})
			},
			getDefaultLeader: function(isForce = false) {
				let self = this
				let data = {}
				self.$http.post(Config.URLS.getDefaultLeader, data).then(res => {
					res = res.data
					self.delivery_store = Object.assign(self.delivery_store, res.data)
				})
			},
			setPhoneNumber: function(phoneNumber) {
				let self = this
				let data = {
					tel: phoneNumber,
				}
				self.$http.post(Config.URLS.bindTelWithoutCode, data).then(res => {
					self.toast(true)
					res = res.data
				})
			},
			selectWeixinPay: function(isWeiXinPay) {
				this.isWeixinPay = isWeiXinPay
			},
			// 优惠券相关
			getCoupons: function() {
				if (this.couponLength === 0) {
					this.toast({
						type: 'warn',
						desc: '无优惠券可使用',
					})
					return
				}
				this.couponSelector = Object.assign({}, this.couponSelector, {
					show: true,
				})
			},
			closeCouponSelector: function() {
				this.couponSelector = Object.assign({}, this.couponSelector, {
					show: false,
				})
			},
			// 获取优惠券列表
			getCouponList: function() {
				let self = this
				let data = {
					i: self.globalI,
					goodses: JSON.stringify(self.goodses),
					total_price: self.actualPrice,
				}
				// self.$http.post(Config.URLS.couponsInOrder, data).then((res) => {
				// 	res = res.data
				// 	if (res.code === 0) {
				// 		self.couponLength = res.data.length
				// 		self.coupons = res.data
				// 	}
				// })
			},
			getCouponById: function(coupon_id, index) {
				this.closeCouponSelector()
				this.coupon = Object.assign({}, this.coupon, {
					money: this.coupons[index].money,
					id: this.coupons[index].usercoupon_id,
				})
				this.getTotalPrice()
			},
			CheckboxChange: function(e) {
			},
			// 优惠券相关
			switchDeliveryPlan: function(key) {
				this.deliveryKey = key
			},
			toDesignPlan: function(num, index) {
				this.showDeliveryPlan = true
				this.deliveryNum = num
				this.deliveryIndex = index
				this.deliveryPlan = Util.containsKey(this.goodses[index], 'plan') ? this.goodses[index].plan : []
				this.planMode = Util.containsKey(this.goodses[index], 'mode') ? this.goodses[index].mode : 'normal'
				this.deliveryKey = this.planMode
			},
			createPlan: function(plan) {
				let self = this
				// self.goodses[self.deliveryIndex] = Object.assign(self.goodses[self.deliveryIndex], {
				// 	plan: plan,
				// 	mode: self.deliveryKey
				// })
				self.deliveryPlan = plan
				self.planMode = self.deliveryKey
			},
			generatePlan: function() {
				let self = this
				self.goodses[self.deliveryIndex] = Object.assign(self.goodses[self.deliveryIndex], {
					plan: self.deliveryPlan,
					mode: self.deliveryKey,
				})
				self.showDeliveryPlan = false
			},
			getPlanMode: function(mode) {
				if (mode === 'normal') return '普通配送'
				return '已生成配送计划'
			},
			toAddress: function() {
				uni.navigateTo({
					url: '/pkChaoYueZu/order/address',
				})
			},
			modeSelf: function(store) {
				this.delivery_store = store
				this.delivery_mode = 'self'
				this.showPatternDialog = false
				this.devliery_cost = 0
				this.getTotalPrice()
			},
			modeHome: function() {
				this.delivery_mode = 'home'
				this.showPatternDialog = false
				this.devliery_cost = this.config.devliery_cost_setting
				this.getTotalPrice()
			},
			toLeaderList: function() {
				uni.navigateTo({
					url: '/pkUserInfo/address/address',
				})
			},
			selectStage(idx) {
				let self = this
				this.stageIdx = idx
			},
			showCouponModal() {
				this.isShowCouponModal = true
			},
			hideCouponModal() {
				this.isShowCouponModal = false
			},
			showMonthlySupplyModal() {
				this.isShowMonthlySupplyModal = true
			},
			hideMonthlySupplyModal() {
				this.isShowMonthlySupplyModal = false
			},
			getCreditCutAmount() {
				return this.creditAmount - this.original_price * this.productNum > 0 ? (this.original_price * this.productNum).toFixed(
					2) : this.creditAmount
			},
			toArticle(id, title) {
				uni.navigateTo({
					url: "/pkUserInfo/info/protocolDetails?id=" + id + "&title=" + title
				})
			}
		},
	}
</script>

<style lang="scss" scoped>
	@import url("../../common/css/animation.css");

	page {
		background: #f6f6f6;
	}

	scroll-view {
		width: 100%;
		height: 100%;
		margin-bottom: 98rpx;
	}

	.attr .attrs>span {
		height: 50rpx;
		line-height: 50rpx;
		margin: 0px 10rpx;
		background: #eee;
		padding: 0px 10rpx;
		border-radius: 10rpx;
		color: #acacac;
	}

	.attr .attrs>span.active {
		color: #f76260;
	}

	.info {
		width: calc(100% - 50rpx);
		padding: 50rpx 25rpx 25rpx 25rpx;
		background: #fff;
		display: flex;
		flex-direction: column;
	}

	.info .row {
		width: 100%;
		line-height: 50rpx;
		display: flex;
		font-size: 24rpx;
		color: #333;
		flex-wrap: wrap;
	}

	.info .row .name {
		width: 120rpx;
		height: 50rpx;
		line-height: 50rpx;
	}

	.address-container {
		padding: 20upx 0px;
	}

	.title {
		font-size: 34upx;
		font-weight: bold;
		margin-bottom: 10upx;
	}

	.tag {
		font-size: 24upx;
		min-width: 80upx;
		height: 38upx;
	}

	.address {
		color: #666;
		font-size: 26upx;
	}

	.info .row .content {
		width: calc(100% - 138rpx);
		margin-left: 18rpx;
	}

	.info .row .content image {
		width: 30rpx;
		height: 30rpx;
		margin-left: 10rpx;
		margin-bottom: -6rpx;
	}

	.line {
		width: 100%;
		height: 4rpx;
		margin: 0;
		display: block;
	}

	.to-address {
		position: absolute;
		font-size: 28upx;
		font-weight: bold;
		color: black;
		right: 40upx;
		margin-top: 50upx;
	}

	.items {
		width: 100%;
		display: flex;
		flex-direction: column;
	}

	/* .items::after {
		content: '>';
		position: absolute;
		font-size: 36upx;
		top: 50upx;
		right: 50upx;
	} */

	.items .item {
		width: 100%;
		background: #fff;
		border-radius: 15rpx;
		display: flex;
		flex-direction: column;
	}

	.items .item .top {
		width: calc(100% - 60rpx);
		height: 76rpx;
		line-height: 76rpx;
		padding-left: 30rpx;
		padding-right: 30rpx;
		font-size: 24rpx;
		color: #888;
		display: flex;
		align-items: center;
		border-bottom: solid 1rpx #eee;
	}

	.items .item .top .num {
		margin-left: auto;
	}

	.items .item .content {
		width: calc(100% - 60rpx);
		padding: 30rpx;
	}

	.items .item .content image {
		width: 160rpx;
		height: 160rpx;
		border-radius: 10rpx;
		float: left;
	}

	.items .item .content .title {
		width: calc(100% - 180rpx);
		height: 40rpx;
		line-height: 40rpx;
		font-size: 28rpx;
		color: #333;
		font-weight: 500;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		margin-left: 20rpx;
		float: left;
	}

	.items .item .content .descs {
		width: calc(100% - 180rpx);
		margin-left: 20rpx;
		font-size: 22rpx;
		color: #999999;
		font-weight: 500;
		display: flex;
		float: left;
	}

	.items .item .content .desc {
		margin-right: 30rpx;
	}

	.items .item .content .bottom {
		width: calc(100% - 180rpx);
		font-size: 28rpx;
		color: #333;
		font-weight: bold;
		margin-left: 20rpx;
		float: left;
		margin-top: 10rpx;
	}

	.pays {
		width: calc(100% - 48rpx);
		margin-left: 24rpx;
		margin-right: 24rpx;
		margin-top: 30rpx;
		display: flex;
		flex-direction: column;
		background: #fff;
		border-radius: 20rpx;
	}

	.pays .top {
		width: calc(100% - 60rpx);
		height: 76rpx;
		line-height: 76rpx;
		padding-left: 30rpx;
		padding-right: 30rpx;
		font-size: 24rpx;
		color: #888;
		display: flex;
		align-items: center;
		border-bottom: solid 1rpx #eee;
	}

	.pays .item {
		width: calc(100% - 68rpx);
		padding-left: 15rpx;
		padding-right: 15rpx;
		margin-left: 15rpx;
		margin-right: 15rpx;
		margin-top: 20rpx;
		margin-bottom: 20rpx;
		display: flex;
		align-items: center;
		border-radius: 20rpx;
	}

	.pays .item image {
		width: 60rpx;
		height: 60rpx;
	}

	.pays .item .centet {
		display: flex;
		flex-direction: column;
		margin-left: 20rpx;
	}

	.pays .item .centet .name {
		font-size: 28rpx;
		color: #333;
	}

	.pays .item .centet .desc {
		font-size: 20rpx;
		color: #999;
	}

	.myCheckBox {
		margin-left: auto;
		transform: scale(0.8, 0.8);
	}

	.bottom-tools {
		width: 100%;
		height: 98rpx;
		background: #fff;
		position: fixed;
		z-index: 10;
		left: 0;
		bottom: 0;
		padding-bottom: 0;
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
	}

	.bottom-tools .buy {
		float: right;
		/* width: 250rpx; */
		height: 98rpx;
		line-height: 98rpx;
		text-align: center;
		background: #f37b1d;
		font-size: 28rpx;
		font-weight: bold;
		color: #fff;
		margin-left: auto;
	}

	button {
		border-radius: 0upx;
	}

	.bottom-tools .left {
		height: 98upx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		float: left;
		margin-left: 30rpx;
	}

	.bottom-tools .left .all-price {
		font-size: 20rpx;
		font-weight: bold;
		color: #333;
	}

	.bottom-tools .left .all-price .price {
		font-size: 28rpx;
		font-weight: bold;
		color: #f37b1d;
	}

	.bottom-tools .left .desc {
		font-size: 18rpx;
		font-weight: 400;
		color: #888;
		margin-top: 5rpx;
	}

	.ad-box {
		width: 100%;
		height: 120rpx;
	}

	.ad-box .ad {
		width: 100%;
		height: 100%;
	}

	.mask {
		width: 100%;
		height: 100%;
		position: fixed;
		top: 0;
		left: 0;
		background: #000;
		opacity: 0.2;
		overflow: hidden;
		z-index: 98;
		color: #fff;
	}

	.confirm-dialog {
		width: 100%;
		/* height: 670rpx; */
		background: #f6f6f6;
		border-radius: 20px 20px 0px 0px;
		position: fixed;
		bottom: 0;
		left: 0;
		z-index: 99;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding-bottom: 0;
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
	}

	.confirm-dialog .notice {
		font-size: 28rpx;
		font-weight: bold;
		color: #333;
		margin-top: 40rpx;
	}

	.confirm-dialog .expect {
		font-size: 24rpx;
		font-weight: bold;
		color: #08c00d;
		margin-top: 15rpx;
	}

	.confirm-dialog .order-info {
		width: calc(100% - 48rpx);
		margin-left: 24rpx;
		margin-right: 24rpx;
		padding-top: 30rpx;
		background: #fff;
		border-radius: 20rpx;
		margin-top: 25rpx;
	}

	.confirm-dialog .order-info .row {
		width: calc(100% - 60rpx);
		margin-left: 30rpx;
		margin-right: 30rpx;
		line-height: 40rpx;
		display: flex;
		font-size: 24rpx;
		color: #333;
		flex-wrap: wrap;
	}

	.confirm-dialog .order-info .row .name {
		width: 190rpx;
		height: 40rpx;
		line-height: 40rpx;
	}

	.confirm-dialog .order-info .row .content {
		width: calc(100% - 222rpx);
		padding-left: 30rpx;
		border-left: solid 1rpx #f6f6f6;
	}

	.confirm-dialog .order-info .bottom {
		width: 100%;
		height: 74rpx;
		line-height: 74rpx;
		border-top: solid 1rpx #f6f6f6;
		display: flex;
		align-items: center;
		justify-content: flex-end;
		font-size: 24rpx;
		font-weight: bold;
		color: #333;
		margin-top: 20rpx;
	}

	.confirm-dialog .order-info .bottom .price {
		font-size: 28rpx;
		font-weight: bold;
		color: #f76260;
		margin-right: 30rpx;
	}

	.confirm-dialog .buttons {
		width: 100%;
		height: 98rpx;
		display: flex;
		background: #fff;
		margin-top: 20rpx;
	}

	.confirm-dialog .buttons .button {
		width: 50%;
		height: 98rpx;
		line-height: 98rpx;
		text-align: center;
		font-size: 28rpx;
		font-weight: bold;
		color: #333;
	}

	.confirm-dialog .buttons .button.pay {
		background: #e84118;
		color: #fff;
	}

	.isLoginBtn {
		display: flex;
		justify-content: space-around;
	}

	.isLoginBtn button,
	.isLoginBtn navigator {
		background: #fff;
		height: 68rpx;
		line-height: 68rpx;
		font-size: 28rpx;
		width: 260rpx;
		text-align: center;
		color: #4bad37;
		border: 1rpx solid #eee;
		border-radius: 12rpx;
	}

	.isLoginBtn navigator {
		margin-right: 20rpx;
		background: #f2f2f2;
		color: #999;
	}

	.tip0 {
		font-size: 38upx;
		font-weight: bold;
		color: #1dc422;
		margin-left: 20upx;
	}

	.tip1 {
		font-size: 28upx;
		color: #333;
		margin-left: 20upx;
		margin-right: 20upx;
	}

	.staging {
		width: calc(48% - 16rpx);
		margin-top: 20rpx;
		border-radius: 10rpx;
		text-align: center;
		/* padding-bottom: 10upx; */
		background: #e6e6e6;
		display: flex;
		flex-direction: column;
		justify-content: center;
		-ms-flex-item-align: center;
		min-height: 100rpx;
	}

	.staging-selected {
		background: #f37b1d;
		color: #ffffff;
	}

	.staging>View {
		flex: 1;
	}

	.staging:nth-child(2n) {
		margin-left: 4%;
	}

	.coupon {
		height: 100rpx;
		line-height: 100rpx;
		border-top: 1rpx solid #f4f4f4;
		border-bottom: 1rpx solid #f4f4f4;
		margin: 0 20rpx;
		display: flex;
		flex-direction: row;
		justify-content: space-between;

		.right-arrow {
			margin-right: 30rpx;
		}
	}

	.subTotal {
		height: 100rpx;
		line-height: 100rpx;
		display: flex;
		flex-direction: row;
		justify-content: flex-end;
		margin-right: 50rpx;
	}

	.no-address-container {
		height: 80rpx;
		line-height: 80rpx;
		width: 440rpx;
		text-align: center;
		border: 1rpx solid rgba(253, 80, 27, 1);
		border-radius: 40rpx;
		margin: 30rpx 0;
		color: #FD501B;
		font-size: 30rpx;
	}

	.activehd {
		width: 100%;
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-top: 20rpx;
		padding: 0 25rpx;
		box-sizing: border-box;
	}
</style>
