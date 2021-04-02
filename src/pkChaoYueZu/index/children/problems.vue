<template>
	<view>
		<view style="width: 690upx;background: #E7F1FF;padding: 20upx 30upx;">
			<view style="color: #666666;font-size: 26upx;">{{deviceInfo}}</view>
		</view>
		<block v-for="(item, index) in items" :key="index">
			<block v-if="item.name=='颜色'">
				<view class="block-container" style="width: 690upx;">
					<block v-for="(children, tIndex) in item.sonList" :key="tIndex">
						<view class="cu-tag border round" @click="item.pickIndex=tIndex" :style="item.pickIndex==tIndex?'border: 2upx solid #1677FF;color: #1677FF;':'border: 2upx solid #CCCCCC;color: #222222;'"  style="padding:10upx 50upx;font-size: 26upx; margin-left: 30upx;margin-top: 30upx;">{{children.name}}</view>
					</block>
				</view>
				<view style="height: 20upx;"></view>
			</block>
			<block v-else>
				<view class="cu-form-group" @click="showDrawer(index)">
					<view class="title">{{item.name}}</view>
					<text :class="item.drawShow?'icon-unfold':'icon-right'"></text>
				</view>
				<view v-if="item.drawShow" class="bg-white">
					<view style="height: 20upx;"></view>
					<view v-for="(children, cIndex) in item.sonList" :key="cIndex" class="row-container" @click="clickItem(item, cIndex)" :style="item.pickIndex==cIndex?'border: 2upx solid #1677FF;color: #1677FF;':'border: 2upx solid #CCCCCC;color: #222222;'" style="width: 650upx;padding: 20upx;border-radius: 5upx;margin-bottom: 20upx;margin-left: 30upx;">
						<view>{{children.name}}</view>
						<view style="margin-left: auto;">¥{{children.price.toFixed(2)}}</view>
					</view>
					<view style="height: 20upx;"></view>
				</view>
			</block>
		</block>
		<view class="fixed-bttom bg-white row-container align-center" style="width: 690upx;height: 120upx;padding: 10upx 30upx;">
			<view class="coloum-container">
				<view style="color: #666666;font-size: 26upx;">预计维修费：<text style="color: #222;font-size: 30upx;">后台估算中</text></view>
				<!-- <view style="color: #999999;font-size: 22upx;">以实际维修情况为准</view> -->
			</view>
			<button class="cu-btn bg-gradual-blue round" style="margin-left: auto;font-size: 30upx;padding: 30upx 86upx;" @click="toOrder()">下一步</button>
		</view>
	</view>
</template>

<script>
	import PConfig from '../../verify/config.js'
	import Toast from '@/common/js/toast.js'
	export default {
		mixins: [Toast],
		data() {
			return {
				code: "",
				items: [],
				total: 0,
				deviceInfo: "iphone 7"
			}
		},
		onLoad(options) {
			let self = this
			self.code = options.code
			self.deviceInfo = options.name
			self.getRepairItems(options.code)
		},
		methods: {
			clickItem(item, cIndex) {
				item.pickIndex = cIndex
				this.calcTotal()
			},
			calcTotal() {
				let self = this
				let total = 0
				self.items.forEach((item, index) => {
					if (item.name == '颜色'){
					} else {
						if (item.pickIndex > -1) {
							total += item.sonList[item.pickIndex].price
						}
					}
				})
				self.total = total
			},
			getRepairItems(code) {
				let self = this
				self.$Phttp.get(PConfig.REQUEST_URLS.getRepairItems, {code: code}).then(res => {
					res = res.data
					if (res.code === 200) {
						res.data.forEach((item, index) => {
							if (item.name == '颜色') {
								item.pickIndex = 0
							} else {
								item.pickIndex = -1
							}
							item.drawShow = false
						})
						self.items = res.data

					}
				})
			},
			showDrawer(index) {
				this.items[index].drawShow = !this.items[index].drawShow
			},
			toOrder() {
				let self = this

				if(self.total === 0) {
					self.toast({
						desc: '您的手机看上去不需要维修！'
					})
					return
				}

				let colorItem = []
				let itemList = []
				self.items.forEach((item, index) => {
					if (item.name == '颜色') {
						colorItem = item.sonList[item.pickIndex]
					} else {
						if (item.pickIndex >= 0) {
							itemList.push(Object.assign(item.sonList[item.pickIndex], {
								itemCode: item.sonList[item.pickIndex].code
							}))
						}
					}
				})
				let deviceInfo = Object.assign({
					deviceInfo: self.deviceInfo,
					colorItem:  colorItem,
					itemList: itemList,
					code: self.code
				})
				uni.setStorageSync("repairOrderInfo", deviceInfo)
				uni.navigateTo({
					url: '/pkChaoYueZu/index/children/order'
				})
			}
		}
	}
</script>

<style>
	page {
		background-color: #F8F8F8;
	}
</style>
