<template>
	<view>
		<view style="padding: 30upx 30upx 40upx 30upx;">
			<view style="color: #666666;font-size: 26upx;">维修方式 </view>
			<view class="row-container align-center mrg-top-20">
				<image style="width: 64upx;" mode="widthFix" src="/static/chaoyuezu/index/weixiu/ic_kd.png"></image>
				<view style="color: #222222;font-size: 30upx;margin-left: 16upx;">邮寄维修</view>
			</view>
		</view>
		<view class="cu-form-group">
			<input class="title" v-model="formItem.goodsTitle" placeholder="名称"/>
			<!-- <text class="icon-right"></text> -->
		</view>
		<view class="cu-form-group">
			<textarea style="height: 200rpx;" class="title" v-model="formItem.goodsSpec" placeholder="器件型号(型号,规格信息等)"/>
			<!-- <text class="icon-right"></text> -->
		</view>
		<view class="cu-form-group">
			<input class="title" v-model="formItem.goodsColor" placeholder="颜色"/>
			<!-- <text class="icon-right"></text> -->
		</view>
		<view class="cu-form-group">
			<input class="title" v-model="formItem.receiveAddress" placeholder="我的地址(上门收件地址)"/>
			<!-- <text class="icon-right"></text> -->
		</view>
		<view class="cu-form-group">
			<input class="title" v-model="formItem.receiveUserName" placeholder="我的姓名(寄件人姓名)"/>
			<!-- <text class="icon-right"></text> -->
		</view>
		<view class="cu-form-group">
			<input class="title" type="number" v-model="formItem.receiveUserPhone" placeholder="我的手机号(寄件人手机号)"/>
			<!-- <text class="icon-right"></text> -->
		</view>
		<!-- <view class="cu-form-group">
			<input class="title" v-model="formItem.repairType" placeholder="维修方式"/>
			<text class="icon-right"></text>
		</view> -->
		<view style="background: #eee;height: 2upx;width: 100%;"></view>
		<view class="cu-form-group">
			<picker style="width: 90rpx" :value="dateIndex" :range="dates" @change="bindPickerChange">
				<div class="title" style="padding-right: 0rpx;">{{dates[dateIndex]}}</div>
			</picker>
			-
			<picker style="width: 100%;margin-left: 10rpx;" mode="time" start="09:00" end="21:00" @change="TimeChange">
				<input class="title" disabled v-model="formItem.takeDeviceTime" placeholder="上门收货时间"/>
			</picker>
		</view>
		<view style="background: #eee;height: 2upx;width: 100%;"></view>
		<view class="cu-form-group" >
			<input class="title" v-model="formItem.remark" placeholder="备注信息" />
			<!-- <text class="icon-right"></text> -->
		</view>
		<view style="height: 20upx;"></view>
		<view class="cu-form-group">
			<view class="title">设备信息</view>
			<text style="margin-left: auto;">{{formItem.deviceInfo}}</text>
		</view>
		<view class="cu-form-group" v-for="(item, index) in formItem.itemList" :key="index">
			<view class="title">{{item.name}}</view>
			<text style="margin-left: auto;">¥{{item.price.toFixed(2)}}</text>
		</view>
		<view class="text-center" style="width: 100%;margin-top: 20upx;color: #999999;">提交订单等同于同意<text style="color: #0687FF;" @click="toArticle('f5e712c34479491986ef572ea2c737b5', '超悦租维修服务条款')">《超悦租维修服务条款》</text></view>
		<view style="height: 150rpx;"></view>
		<button @click="submitOrder()" class="fixed-bttom cu-btn round bg-gradual-blue" style="width: 690upx;bottom: 30upx;margin-left: 30upx;font-size: 30upx;height: 88upx;">提交订单</button>
	</view>
</template>

<script>
	import PConfig from '../../verify/config.js'
	import Toast from '../../../common/js/toast.js'
	export default {
		mixins: [Toast],
		data() {
			return {
				deviceInfo: "",
				items: [],
				dates: ['今天', '明天', '后天'],
				dateIndex: 0,
				colorItem: {},
				formItem: {
					goodsTitle: "", //手机名称
					goodsColor: "", //手机颜色
					goodsSpec: "", //规格
					deviceInfo: "", //设备信息
					iem: "", //手机平板IEe
					itemList: [], //维修问题列表
					receiveAddress: "", //维修人地址
					receiveUserName: "", //收件人姓名
					receiveUserPhone: "", //维修人手机号
					remark: "", //备注
					repairType: "邮寄维修", //维修方式
					takeDeviceTime: "", //上门拿货时间
					userId: "", //客户ID
				}
			}
		},
		computed: {
			userInfo() {
				return this.$store.state.userInfo
			}
		},
		onLoad(options) {
			let self = this
			let deviceInfo = uni.getStorageSync("repairOrderInfo")
			self.formItem.deviceInfo = deviceInfo.deviceInfo
			self.formItem.itemList = deviceInfo.itemList
			self.formItem.iem = deviceInfo.code
		},
		methods:{
			bindPickerChange(e) {
				this.dateIndex = e.target.value
			},
			TimeChange(e) {
				this.formItem.takeDeviceTime = e.detail.value
			},
			toArticle(id, title) {
				uni.navigateTo({
					url: "/pkUserInfo/info/protocolDetails?id=" + id + "&title=" + title
				})
			},
			getDate(index) {
				var date = new Date()
				date.setTime(date.getTime() + index*24*60*60*1000)
				return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
			},
			submitOrder() {
				let self = this
				if (self.formItem.goodsTitle === "") {
					self.toast({
						desc: '请填写名称'
					})
					return
				}
				if (self.formItem.goodsColor === "") {
					self.toast({
						desc: '请填写颜色'
					})
					return
				}
				if (self.formItem.goodsSpec === "") {
					self.toast({
						desc: '请填写型号'
					})
					return
				}
				if (self.formItem.receiveAddress === "") {
					self.toast({
						desc: '请填写收件地址'
					})
					return
				}
				if (self.formItem.receiveUserName === "") {
					self.toast({
						desc: '请填写收件人姓名'
					})
					return
				}
				if (self.formItem.receiveUserPhone === "") {
					self.toast({
						desc: '请填写维修人手机号'
					})
					return
				}
				if (self.formItem.repairType === "") {
					self.toast({
						desc: '维修方式'
					})
					return
				}
				self.formItem.userId = self.userInfo.user_key
				self.formItem.takeDeviceTime = self.getDate(self.dateIndex) + " " + self.formItem.takeDeviceTime
				self.$Phttp.post(PConfig.REQUEST_URLS.repairOrder, self.formItem).then(res => 					{
					res = res.data
					if (res.code === 200) {
						self.toast({
							desc: '提交成功'
						})
						setTimeout(()=>{
							uni.navigateBack({
								delta: 2
							})
						}, 1200)
					} else {
						self.toast({
							desc: res.message
						})
					}
				})
			}
		}
	}
</script>

<style scoped>
	page {
		background: #F8F8F8;
	}
</style>
