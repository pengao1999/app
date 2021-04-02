<template>
	<view class="content">
		<error-tips :propData="errorData" @hide="errorHide"></error-tips>
		<view class="text-tips" v-show="!ifVerified">
			<text style="margin-left: 35rpx;">请填写本人有效信息，可提升审核速度</text>
		</view>
		<view class="row-wrap">
			<view class="row-title">姓名</view>
			<input placeholder="请输入姓名" class="row-input" disabled v-model="name" />
		</view>
		<view class="row-wrap">
			<view class="row-title">手机号码</view>
			<input placeholder="请输入号码" type="number" class="row-input" disabled v-model="phone" />
		</view>
		<view class="row-wrap">
			<view class="row-title">
				<view class="fc-red">*</view>微信号码
			</view>
			<input placeholder="请输入微信号" class="row-input" v-model="wechat" />
		</view>
		<view class="row-wrap">
			<view class="row-title">
				<view class="fc-red">*</view>邮箱
			</view>
			<input placeholder="请输入邮箱" class="row-input" v-model="email" />
		</view>
		<view class="row-wrap">
			<view class="row-title">
				<view class="fc-red">*</view>身份证
			</view>
			<input placeholder="请输入身份证号" type="idcard" class="row-input" v-model="idCardNum" />
		</view>
		<view class="row-wrap">
			<view class="row-title">
				<view class="fc-red">*</view>居住地(省市区)
			</view>
			<input disabled placeholder="请输入" class="row-input" :value="province + ' ' + city + ' ' + area" @blur="iosBlur"
			 @click="showMulLinkageThreePicker" />
		</view>
		<view class="row-wrap">
			<view class="row-title">
				<view class="fc-red">*</view>居住地址(街道)
			</view>
			<input placeholder="请输入" class="row-input" v-model="address" />
		</view>
		<!-- <view class="row-wrap">
	  <view class="row-title">房屋类型</view>
	  <picker
	    :range="housingList"
	    :value="housingIndex"
	    class="row-picker"
	    @change="handleHousingChange"
	  >
	    <view>{{housingList[housingIndex]}}</view>
	  </picker>
	  <image src="/static/zulin/verify/icon-right.png" class="nav-icon" />
	</view>
	<view class="row-wrap">
	  <view class="row-title">房屋性质</view>
	  <picker
	    :range="livingTypeList"
	    :value="livingTypeIndex"
	    class="row-picker"
	    @change="handlelivingTypeChange"
	  >
	    <view>{{livingTypeList[livingTypeIndex]}}</view>
	  </picker>
	  <image src="/static/zulin/verify/icon-right.png" class="nav-icon" />
	</view> -->
		<view class="brLine" style="width:100%;height: 20rpx;background: #f4f4f4;"></view>
		<view class="row-wrap">
			<view class="row-title">职业</view>
			<input placeholder="请填写" type="job" class="row-input" v-model="job" />
		</view>
		<view class="row-wrap">
			<view class="row-title">
				<view class="fc-red">*</view>婚姻
			</view>
			<picker :range="marriageList" :value="marriageIndex" class="row-picker" @change="handleMarriageChange">
				<view>{{marriageList[marriageIndex]}}</view>
			</picker>
			<image src="/static/zulin/verify/icon-right.png" class="nav-icon" />
		</view>
		<view class="row-wrap">
			<view class="row-title">
				<view class="fc-red">*</view>学历
			</view>
			<picker :range="degreeList" :value="degreeIndex" class="row-picker" @change="handleDegreeChange">
				<view>{{degreeList[degreeIndex]}}</view>
			</picker>
			<image src="/static/zulin/verify/icon-right.png" class="nav-icon" />
		</view>
		<!--<view class="row-wrap">-->
		<!--<view class="row-title">学院名称（学生填写）</view>-->
		<!--<input-->
		<!--placeholder="请填写"-->
		<!--type="college"-->
		<!--class="row-input"-->
		<!--v-model="college"-->
		<!--/>-->
		<!--</view>-->
		<!--<view class="row-wrap">-->
		<!--<view class="row-title">学信网账号（学生必填）</view>-->
		<!--<input-->
		<!--placeholder="请填写"-->
		<!--type="collegeAccount"-->
		<!--class="row-input"-->
		<!--v-model="collegeAccount"-->
		<!--/>-->
		<!--</view>-->
		<!--<view class="row-wrap">-->
		<!--<view class="row-title">学信网密码（学生必填）</view>-->
		<!--<input-->
		<!--placeholder="请填写"-->
		<!--type="collegePw"-->
		<!--class="row-input"-->
		<!--v-model="collegePw"-->
		<!--/>-->
		<!--</view>-->
		<!-- <view class="bottom" @click="upload">{{!ifVerified ? '提交': '下一步'}}</view> -->
		<view class="bottom" v-if="!ifVerified" @click="upload">提交</view>

		<mpvue-city-picker :themeColor="themeColor" ref="mpvueCityPicker" :pickerValueDefault="cityPickerValueDefault"
		 @onConfirm="regionConfirm"></mpvue-city-picker>
	</view>
</template>
<script>
	import iosBlur from '../../common/js/iosBlur.js'
	import mpvueCityPicker from '@/components/mpvue-citypicker/mpvueCityPicker.vue'
	import errorTips from '../../components/yx_dialog/myErrorTip.vue'
	import Config from './config.js'
	export default {
		name: 'baseInfo',
		components: {
			mpvueCityPicker,
			errorTips
		},
		mixins: [iosBlur],
		data() {
			return {
				userKey: '',
				// 错误提示
				errorData: {
					show: false,
					desc: ''
				},
				province: '',
				city: '',
				area: '',
				cityPickerValueDefault: [8, 0, 0],
				name: '',
				phone: '',
				idCardNum: '',
				job: '',
				email: '',
				contactOne: '',
				contactTwo: '',
				address: '',
				themeColor: '#f00a1e',
				degree: '请选择',
				degreeList: Config.DEGREE_LIST,
				degreeIndex: 0,
				housing: '请选择',
				housingList: Config.HOUSING_LIST,
				housingIndex: 0,
				livingType: '请选择',
				livingTypeList: Config.LIVINGTYPE_LIST,
				livingTypeIndex: 0,
				marriage: '请选择',
				marriageList: Config.MARRIAGE_LIST,
				marriageIndex: 0,
				ifVerified: false,
				wechat: ''
			}
		},
		onLoad(options) {
			this.userKey = options.userKey
			// this.userKey = 'b9eee5b78dd842618247eb44ca594ed6';
			this.ifVerified = options.isCompleted === '0' ? false : true
			// 解决ios兼容性
			// #ifdef H5
			document.body.addEventListener('focusout', () => {
				this.iosBlur()
			})
			document.body.addEventListener('focusin', () => {
				this.iosBlur()
			})
			// #endif
		},
		onShow() {
			let self = this
			if (self.userKey == undefined) {
				self.userKey = '';
				return;
			}
			uni.showLoading({
				title: '加载中...'
			})
			self.$Phttp.get(Config.REQUEST_URLS.getBaseInfo, {
				userKey: self.userKey,
				appKey: 123
			}).then(res => {
				res = res.data
				console.log('----' + JSON.stringify(res));
				if (res.code === 200 && res.data.realName) {
					self.name = res.data.realName
					self.phone = res.data.phone ? res.data.phone : ''
					self.email = res.data.email || '';
					self.idCardNum = res.data.identityNum
					self.province = res.data.livingProvince ? res.data.livingProvince : ''
					self.city = res.data.livingCity ? res.data.livingCity : ''
					self.area = res.data.livingDistrict ? res.data.livingDistrict : ''
					self.address = res.data.livingDetail ? res.data.livingDetail : ''
					self.housing = res.data.housing
					self.degreeIndex = res.data.education ? Config.DEGREE_LIST.indexOf(res.data.education) : 0
					self.marriageIndex = res.data.marriage ? Config.MARRIAGE_LIST.indexOf(res.data.marriage) : 0
					self.housingIndex = res.data.housing ? Config.HOUSING_LIST.indexOf(res.data.housing) : 0
					self.livingTypeIndex = res.data.livingType ? Config.LIVINGTYPE_LIST.indexOf(res.data.livingType) : 0
					self.job = res.data.job ? res.data.job : ''
					self.college = res.data.college ? res.data.college : ''
					self.collegeAccount = res.data.collegeAccount ? res.data.collegeAccount : ''
					self.collegePw = res.data.collegePw ? res.data.collegePw : ''
					self.wechat = res.data.wechat ? res.data.wechat : ''
					// self.ifVerified = true
				}
				uni.hideLoading()
			})
		},
		methods: {
			showMulLinkageThreePicker() {
				this.$refs.mpvueCityPicker.show()
			},
			regionConfirm(e) {
				let region = e.label.split('-')
				this.province = region[0]
				this.city = region[1]
				this.area = region[2]
			},
			errorHide: function(e) {
				if (!e.detail) {
					this.errorData.show = false;
					return
				}
				this.errorData = e.detail
			},
			upload() {
				let self = this
				if (self.ifVerified) {
					// self.errorData = Object.assign({}, self.errorData, {
					//   show: true,
					//   desc: "已提交，不必重复填写"
					// })
					// return
					uni.navigateBack()
					return
				}
				if (!self.checkInfo()) {
					self.errorData = Object.assign({}, self.errorData, {
						show: true,
						desc: '请填写完整信息~'
					})
					return
				}
				if (!(/^1(3|4|5|6|7|8|9)\d{9}$/.test(self.phone))) {
					self.errorData = Object.assign({}, self.errorData, {
						show: true,
						desc: "请输入正确的手机号码"
					})
					return
				}
				if (!(/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(self.idCardNum))) {
					self.errorData = Object.assign({}, self.errorData, {
						show: true,
						desc: "请输入正确的身份证号码"
					})
					return
				}
				if (self.userKey == undefined) {
					self.userKey = '';
				}
				const data = {
					userKey: self.userKey,
					realName: self.name,
					phone: self.phone,
					email: self.email,
					identityNum: self.idCardNum,
					livingProvince: self.province,
					livingCity: self.city,
					livingDistrict: self.area,
					livingDetail: self.address,
					housing: self.housingList[self.housingIndex],
					livingType: self.livingTypeList[self.livingTypeIndex],
					education: self.degreeList[self.degreeIndex],
					marriage: self.marriageList[self.marriageIndex],
					job: self.job,
					college: self.college,
					collegeAccount: self.collegeAccount,
					collegePw: self.collegePw,
					wechat: self.wechat
				}
				self.$Phttp.post(Config.REQUEST_URLS.addBaseInfo, data, 'application/json').then(res => {
					res = res.data
					if (res.code === 200) {
						self.errorData = Object.assign({}, self.errorData, {
							show: true,
							desc: "用户基本信息保存成功!"
						})
						uni.navigateBack()
					} else {
						self.errorData = Object.assign({}, self.errorData, {
							show: true,
							desc: '提交失败，请稍后重试～'
						})
					}
				})
			},
			checkInfo() {
				let self = this
				const flag = self.name && self.phone && self.wechat && self.email && self.idCardNum && self.province && self.city &&
					self.area && self.address && self.degreeIndex !== 0 && self.marriageIndex !== 0
				return flag
			},
			handleDegreeChange(e) {
				this.degreeIndex = e.target.value
				console.log(this.degreeIndex)
			},
			handleMarriageChange(e) {
				this.marriageIndex = e.target.value
				console.log(this.marriageIndex)
			},
			handleHousingChange(e) {
				this.housingIndex = e.target.value
				console.log(this.housingIndex)
			},
			handlelivingTypeChange(e) {
				this.livingTypeIndex = e.target.value
				console.log(this.livingTypeIndex)
			}
		}
	}
</script>
<style lang="scss" scoped>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 100%;
		background: #fff;
		padding-bottom: 100rpx;

		.text-tips {
			height: 60rpx;
			line-height: 60rpx;
			background: rgba(244, 249, 255, 1);
			font-size: 24rpx;
			color: #1677FF;
			width: 100%;
		}

		.row-wrap {
			display: flex;
			flex-direction: row;
			width: 100%;
			background: rgba(255, 255, 255, 1);
			border-bottom: 1rpx solid #f4f4f4;
			color: #999;
			align-items: center;

			.row-title {
				display: flex;
				align-items: center;
				width: 700rpx;
				font-size: 30rpx;
				color: #999;
				height: 96rpx;
				line-height: 96rpx;
				margin-left: 30rpx;
			}

			.row-select {
				font-size: 26rpx;
				margin-left: 20rpx;
				margin-bottom: 4rpx;
				border-bottom: 1rpx solid #f4f4f4;
				width: 500rpx;
				height: 50rpx;
				background: #fff;
				text-align: center;
			}

			.row-input {
				height: 96rpx;
				width: 100%;
				text-align: right;
				margin-right: 36rpx;
				font-size: 30rpx;
			}

			.row-picker {
				width: 100%;
				height: 100%;
				line-height: 96rpx;
				text-align: right;
				align-content: center;
				margin-right: 20rpx;
				font-size: 30rpx;
			}

			.fc-red {
				margin-left: -12rpx;
				margin-right: 6rpx;
				font-size: 24rpx;
				color: #f30;
			}

			.nav-icon {
				width: 32rpx;
				height: 32rpx;
				margin-right: 20rpx;
			}
		}
	}

	.bottom {
		background: linear-gradient(180deg, rgba(82, 171, 252, 1) 0%, rgba(6, 135, 255, 1) 100%);
		border-radius: 50rpx;
		width: 666rpx;
		height: 88rpx;
		line-height: 88rpx;
		color: #fff;
		font-size: 32rpx;
		font-weight: 400;
		align-items: center;
		text-align: center;
		margin-top: 20rpx;
		// margin-top: 200rpx;
		// bottom: 20rpx;
		// position: fixed;
	}

	.uni-collapse-cell__title {
		text-align: right;
	}

	.active-item-text {
		color: #1677FF;
	}
</style>
