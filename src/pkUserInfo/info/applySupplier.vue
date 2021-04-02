<template>
	<view>
		<error-tip :propData="errorData" @hide="errorHide"></error-tip>
		<view class='top'>
		  <view class='title'>申请供应商身份</view>
		  <view class='desc'>需要您填写真实姓名并选择地区</view>
		</view>
		<image src='../../static/top_bg.png' class='top-bg-img'></image>
		<view class='content'>
		  <form @submit="formBindsubmit">
			<view class='column-box'>
			  <input hidden name="id" :value="id"></input>
			  <input hidden name="latitude" :value="latitude"></input>
			  <input hidden name="longitude" :value="longitude"></input>
			  <view class='col'>
				<text class='name'>选择地址</text>
				<input disabled name="leaderchoice" class='input' placeholder='请选择地区' @tap='selectAddress' :value="coordinates"></input>
			  </view>
			  <view class='col'>
				<text class='name'>详细地址</text>
				<input name="address" class='input' placeholder='请填写详细地址' :value='supplier.address'></input>
			  </view>
			  <view class='col'>
				<text class='name'>公司名称</text>
				<input name="company" class='input' placeholder='请填写公司名称' :value="supplier.company"></input>
			  </view>
			  <view class='col'>
				<text class='name'>姓名</text>
				<input name="name" class='input' placeholder='请填写您的姓名' :value="supplier.name"></input>
			  </view>
			  <view class='col'>
				<text class='name'>联系方式</text>
				<input name="tel" class='input' placeholder='请填写联系方式' :value="supplier.tel"></input>
			  </view>
			   <view class='col'>
				<text class='name'>商品名称</text>
				<input name="product" class='input' placeholder='请填写商品名称' :value="supplier.product"></input>
			  </view>
			  <view class='col'>
				<text class='name'>商品来源</text>
				<input name="source" class='input' placeholder='请填写商品来源' :value="supplier.source"></input>
			  </view>
			  <view class='col'>
				<text class='name'>配送地址</text>
				<input name="shipping_address" class='input' placeholder='请填写配送地址' :value="supplier.shipping_address"></input>
			  </view>
			  <view class='col'>
				<text class='name'>备注</text>
				<input name="remark" class='input' placeholder='请填写备注' :value="supplier.remark"></input>
			  </view>
			</view>

			<view class='provision' v-if="!supplier.check_state|supplier.check_state==3">
			  <checkbox-group>
				<label class="checkbox">
				  <checkbox :value="hasread" :checked="hasread" @click.stop="checkReadProtocal(hasread)" class="round" /> 已阅读
				</label>
				<text @tap="tapreadFirst">《供应商申请协议》</text>
			  </checkbox-group>
			</view>

			<button formType="submit" class='submit' v-if="!supplier.check_state">提交申请</button>
			<button class="submit gray" v-if="supplier.check_state==1">待审核</button>
			<button class="submit" formType="submit" v-if="supplier.check_state==3">重新提交</button>
		  </form>
		  <view class='reason' v-if="supplier.check_state==3">审核失败原因：{{supplier.fail_reason}}</view>
		</view>
		<view class="mask" v-if="hasreadWind"></view>
		<block v-if="hasreadWind">
		  <view class="rule">
			<view class="ruleTit">团长申请协议</view>
			<view class="ruleCont">
				<uParse :content="detail.nodes" @preview="preview" @navigate="navigate" />
			</view>
			<view @tap="tapRulebtn" class="ruleBtn">我已阅读</view>
		  </view>
		</block>
	</view>
</template>

<script>
	import Config from '../../common/js/Config.js'
	import Toast from '../../common/js/toast.js'

	import uParse from '../../common/third/uParse/src/wxParse.vue'
	import ErrorTip from '../../components/yx_dialog/myErrorTip.vue'

	export default {
		data() {
			return {
				id: 0,
				hasread: false,
				supplier: {
				  check_state: 0
				},
				address: '',
				coordinates: '',
				latitude: 0,
				longitude: 0,
				// 错误提示
				errorData: {
					show: false,
					desc: ''
				},
			}
		},
		components: {
			uParse, ErrorTip
		},
		mixins:[Toast],
		computed: {
			userInfo() {
				return this.$store.state.userInfo
			},
			globalI() {
				return this.$store.state.globalI
			}
		},
		onLoad() {
			this.initPage()
		},
		methods: {
			initPage: function() {
				this.getMyLeader()
			},
			getMyLeader: function() {
				let self = this
				self.toast({
					type: 'loading',
					desc: '加载中...'
				})
				let data = {
					i:self.globalI,
					user_key: self.userInfo.user_key
				}
				self.$http.post(Config.URLS.myStore, data).then((res) => {
					self.toast(true)
					res = res.data
					if (res.code === 0) {
						if (res.data !== null) {
							self.supplier = Object.assign({}, res.data)
							self.coordinates = res.data.longitude+','+res.data.latitude
							self.longitude = res.data.longitude
							self.latitude = res.data.latitude
						}
					}
				})
			},
			selectAddress: function() {
				let self = this
				uni.chooseLocation({
					success(e) {
						self.supplier = Object.assign({},self.supplier, {
							address: e.address
						})
						self.coordinates = e.latitude + ',' + e.longitude
						self.latitude = e.latitude
						self.longitude = e.longitude
					},
					fail(e) {
						self.toast({
							type: 'warn',
							desc: '获取失败...'
						})
					}
				})
			},
			checkReadProtocal: function(hasread) {
				this.hasread = !hasread
			},
			formBindsubmit: function(e) {
				console.log(e)
				let self = this
				let data = e.detail.value
				if (!data.latitude || !data.latitude) {
					self.errorData = Object.assign({
						show: true,
						desc: '请选择地区'
					})
					return
				}
				if (!data.address) {
					self.errorData = Object.assign({
						show: true,
						desc: '请填写详细地址'
					})
					return
				}
				if (!data.company) {
					self.errorData = Object.assign({
						show: true,
						desc: '请填写公司名称'
					})
					return
				}
				if (!data.name) {
					self.errorData = Object.assign({
						show: true,
						desc: '请填写您的姓名'
					})
					return
				}
				if (!data.tel) {
					self.errorData = Object.assign({
						show: true,
						desc: '请填写联系方式'
					})
					return
				}
				if (!data.product) {
					self.errorData = Object.assign({
						show: true,
						desc: '请填写商品名称'
					})
					return
				}
				if (!data.source) {
					self.errorData = Object.assign({
						show: true,
						desc: '请填写商品来源'
					})
					return
				}
				if (!data.shipping_address) {
					self.errorData = Object.assign({
						show: true,
						desc: '请填写配送地址'
					})
					return
				}
				if (!self.hasread) {
					self.errorData = Object.assign({
						show: true,
						desc: '请确认已阅读供应商申请协议'
					})
					return
				}
				self.toast({
					desc: '加载中...',
					type: 'loading'
				})
				data = Object.assign({}, data, {
					i:self.globalI,
					user_key: self.userInfo.user_key
				})
				self.$http.post(Config.URLS.applyStore, data).then((res) => {
					res = res.data
					if (res.code === 0) {
						self.toast({
							type:'success',
							desc:'提交成功'
						})
						self.supplier = Object.assign({}, self.supplier, res.data.data)
					}
				})
			},
			// 错误隐藏
			errorHide: function (e) {
			    if (!e.detail) {
			        this.errorData.show = false;
			        return
			    }
			    this.errorData = e.detail
			},
		},
		onShareAppMessage() {
			return {
				title: '友邻优选-大家都在用的社区团购APP',
				path: '/pages/index/main?user_key='+this.userInfo.user_key+'&i='+this.globalI
			}
		}
	}
</script>

<style>
	page {
	  background: #f6f6f6;
	}

	.top {
	  width: 100%;
	  height: 240rpx;
	  background: #1dc422;
	  display: flex;
	  padding-top: 30rpx;
	  flex-direction: column;
	}

	.top .title {
	  font-size: 46rpx;
	  line-height: 50rpx;
	  font-weight: bold;
	  color: #fff;
	  margin-left: 60rpx;
	  margin-top: 40rpx;
	}

	.top .desc {
	  font-size: 30rpx;
	  line-height: 36rpx;
	  color: #fff;
	  margin-left: 60rpx;
	  margin-top: 15rpx;
	}

	.content {
	  width: 100%;
	  position: absolute;
	  top: 220rpx;
	}

	.column-box {
	  width: calc(100% - 40rpx);
	  margin-left: 20rpx;
	  margin-right: 20rpx;
	  background: #fff;
	  border-radius: 20rpx;
	  display: flex;
	  flex-direction: column;
	}

	.column-box .col {
	  width: calc(100% - 48rpx);
	  height: 100rpx;
	  line-height: 100rpx;
	  margin-left: 24rpx;
	  margin-right: 24rpx;
	  border-bottom: solid 1rpx #ccc;
	  display: flex;
	  align-items: center;
	}

	.column-box .col:last-child {
	  border-bottom: 0;
	}

	.column-box .col .name {
	  width: 160rpx;
	  font-size: 28rpx;
	  color: #333;
	}

	.column-box .col .input {
	  width: calc(100% - 160rpx);
	  height: 80rpx;
	  font-size: 28rpx;
	  color: #666;
	}

	.provision {
	  width: calc(100% - 60rpx);
	  padding-left: 30rpx;
	  padding-right: 30rpx;
	  margin-top: 40rpx;
	  font-size: 28rpx;
	  display: flex;
	  align-items: center;
	}

	checkbox {
	  /* zoom: 70%; */
	}

	.provision text {
	  color: #1dc422;
	}

	.submit {
	  width: calc(100% - 40rpx);
	  height: 100rpx;
	  line-height: 100rpx;
	  margin-top: 60rpx;
	  margin-left: 20rpx;
	  margin-right: 20rpx;
	  border-radius: 50rpx;
	  background: #1dc422;
	  color: #fff;
	  font-size: 30rpx;
	  font-weight: bold;
	  text-align: center;
	}

	.gray {
	  background: #ccc;
	}

	.reason{
	  width: calc(100% - 60rpx);
	  padding-left: 30rpx;
	  padding-right: 30rpx;
	  margin-top: 40rpx;
	  font-size: 28rpx;
	  color: #666;
	}

	.mask {
		position: fixed;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		background: rgba(0,0,0,0.3);
	}

	.rule {
		width: 90%;
		padding: 30rpx;
		position: fixed;
		left: 5%;
		top: 50%;
		z-index: 12;
		transform: translateY(-50%);
		background: #fff;
		border-radius: 15rpx;
		box-sizing: border-box;
	}

	.ruleTit {
		font-size: 32rpx;
		text-align: center;
	}

	.ruleBtn {
		width: 200rpx;
		margin: 0 auto;
		margin-top: 30rpx;
		height: 60rpx;
		line-height: 60rpx;
		text-align: center;
		background: #1dc422;
		border-radius: 10rpx;
		font-size: 28rpx;
		color: #fff;
	}

	.ruleCont {
		margin-top: 30rpx;
	}
	.top-bg-img {
	  width: 100%;
	  height: 60rpx;
	  background-repeat: no-repeat;
	  background-size: 100% 100%;
	  -moz-background-size: 100% 100%;
	}
</style>
