<template>
  <view class="content">
    <error-tips :propData="errorData" @hide="errorHide"></error-tips>
    <view class="row-wrap">
      <view class="row-title"><view class="red-dot">*</view>行业</view>
      <picker
        :range="industryList"
        :value="industryIndex"
        class="row-picker"
        @change="handleIndustryChange"
      >
        <view>{{industryList[industryIndex]}}</view>
      </picker>
      <image src="/static/zulin/verify/icon-right.png" class="nav-icon" />
    </view>
    <view class="row-wrap">
      <view class="row-title"><view class="red-dot">*</view>职业</view>
      <input placeholder="请输入职业" class="row-input" v-model="job" />
    </view>
    <view class="row-wrap">
      <view class="row-title"><view class="red-dot">*</view>月收入</view>
      <input
        placeholder="请输入"
        class="row-input"
        v-model="income"
        type="number"
      />
    </view>
    <view class="row-wrap">
      <view class="row-title"><view class="red-dot">*</view>发薪日</view>
      <picker
        :range="dayList"
        :value="dayIndex"
        class="row-picker"
        @change="handleDayChange"
      >
        <view>{{dayList[dayIndex]}}</view>
      </picker>
    </view>

    <view class="brLine"></view>

    <view class="row-wrap">
      <view class="row-title"><view class="red-dot">*</view>单位名称</view>
      <input placeholder="请填写" class="row-input" v-model="companyName" />
    </view>
    <view class="row-wrap">
      <view class="row-title"><view class="red-dot">*</view>单位地址(省市区)</view>
      <input
        disabled
        placeholder="请输入"
        class="row-input"
        :value="province + ' ' + city + ' ' + area"
        @blur="iosBlur"
        @click="showMulLinkageThreePicker"
      />
    </view>
    <view class="row-wrap">
      <view class="row-title"><view class="red-dot">*</view>单位地址(街道)</view>
      <input placeholder="请输入" class="row-input" v-model="address" />
    </view>
    <view class="row-wrap">
      <view class="row-title">单位电话</view>
      <input placeholder="区号-固话号码" class="row-input" v-model="companyPhone" maxlength="13"/>
    </view>
    <view class="row-wrap">
      <view class="row-title">单位电话分机号码</view>
      <input
        placeholder="选填"
        class="row-input"
        type="number"
        v-model="companyPhoneSub"
      />
    </view>
	
	<view class="brLine"></view>
	
	<view class="row-wrap">
	    <view class="row-title"><view class="red-dot">*</view>工作证明 <view class="fs18">（工牌、名片、社保缴纳证明、工资流水）</view></view>
	    <!-- <image src="/static/zulin/verify/icon-right.png" class="nav-icon"/> -->
	</view>
	
	<view class="row-wrap" style="padding-bottom: 20rpx;">
	    <image :src="worksPhoto" class="card-img" @click="addWorksPhoto"/>
	</view>

    <!-- <view class="bottom" @click="upload" >{{!ifVerified ? '提交': '下一步'}}</view> -->
    <view class="bottom" v-if="!ifVerified" @click="upload" >提交</view>

    <mpvue-city-picker
      :themeColor="themeColor"
      ref="mpvueCityPicker"
      :pickerValueDefault="cityPickerValueDefault"
      @onConfirm="regionConfirm"
    ></mpvue-city-picker>
  </view>
</template>
<script>
import iosBlur from '../../common/js/iosBlur.js'
import mpvueCityPicker from '@/components/mpvue-citypicker/mpvueCityPicker.vue'
import errorTips from '../../components/yx_dialog/myErrorTip.vue'
import Config from './config.js'
import Config2 from '../../common/js/Config.js'
export default {
  name: 'workInfo',
  components: {
    mpvueCityPicker, errorTips
  },
  mixins: [iosBlur],
  data() {
    return {
      userKey: '',
      province: '',
      city: '',
      area: '',
      address: '',
      cityPickerValueDefault: [8, 0, 0],
      job: '',
      contactOne: '',
      contactTwo: '',
      themeColor: '#f00a1e',
      industry: '请选择',
      industryList: Config.INDUSTRY_LIST,
      industryIndex: 0,
      dayList: Config.DAY_LIST,
      dayIndex: 0,
      income: '',
      payDay: '',
      companyName: '',
      companyPhone: '',
      companyPhoneSub: '',
	  worksPhoto: "/static/icon-default-degree.png",
	  workingCertPath: '',
	  workingCertFile: '',
      // 错误提示
      errorData: {
        show: false,
        desc: ''
      },
      ifVerified: false,
    }
  },
  onLoad(options) {
    this.userKey = options.userKey;
    this.ifVerified = options.isCompleted === '0' ? false : true;
  },
  onShow() {
    let self = this
    if (self.userKey == '' || self.userKey == undefined) {
      return;
    }
    self.$Phttp.get(Config.REQUEST_URLS.getJobInfo, { userKey: self.userKey, appKey: 123 }).then(res => {
      res = res.data
      if (res.code === 200 && res.data.job) {
        self.industryIndex = Config.INDUSTRY_LIST.indexOf(res.data.industry)
        self.job = res.data.job
        self.income = res.data.monthlyIncome
        self.dayIndex = Config.DAY_LIST.indexOf(res.data.payDay)
        self.companyName = res.data.employer
        self.province = res.data.employerProvince
        self.city = res.data.employerCity
        self.area = res.data.employerDistrict
        self.address = res.data.employerAddress
        self.companyPhone = res.data.employerPhone1
        self.companyPhoneSub = res.data.employerPhone2
		self.icCardPhoto = res.data.icCardPhoto || "/static/icon-default-degree.png"
        // self.ifVerified = true
      }
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
    upload() {
      let self = this
      if (self.ifVerified) {
        // self.errorData = Object.assign({}, self.errorData, {
        //   show: true,
        //   desc: "已提交，不必重复填写"
        // })
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
	  if(self.worksPhoto.indexOf('icon-default-degree') > 0) {
	  		  self.errorData = Object.assign({}, self.errorData, {
	  		    show: true,
	  		    desc: '请上传工作证明~'
	  		  })
	  		  return
	  }
      // if (self.companyPhone && !(/^(0\d{2,3}\-)?([1-9]\d{7,8})+/.test(self.companyPhone))) {
      //   self.errorData = Object.assign({}, self.errorData, {
      //     show: true,
      //     desc: "请输入正确的固话号码格式!"
      //   })
      //   return
      // }
      const data = {
        userKey: self.userKey,
        employer: self.companyName,
        employerAddress: self.address,
        employerCity: self.city,
        employerDistrict: self.area,
        employerPhone1: self.companyPhone,
        employerPhone2: self.companyPhoneSub,
        employerProvince: self.province,
        industry: self.industryList[self.industryIndex],
        job: self.job,
        monthlyIncome: self.income,
        payDay: self.dayList[self.dayIndex],
		icCardPhoto: self.worksPhoto
      }
      self.$Phttp.post(Config.REQUEST_URLS.addJobInfo, data, 'application/json').then(res => {
        res = res.data
        if (res.code === 200) {
          self.errorData = Object.assign({}, self.errorData, {
            show: true,
            desc: "已成功提交!"
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
	addWorksPhoto() {
	    let self = this
	    uni.chooseImage({
	      count: 1,
	      sizeType: ['compressed'],
	      sourceType: ['album', 'camera'],
	      success: function (res) {
	        self.workingCertPath = res.tempFilePaths[0]
	        self.workingCertFile = res.tempFiles[0]
	        if (self.workingCertFile.size > Config.UPLOAD_LIMIT) {
	          uni.showToast({
	            title: '请尽量选择小于6M的图片',
	            icon: "none"
	          })
	          self.workingCertPath = ''
	          return
	        }
	        uni.uploadFile({
	          url: Config2.JAVA_SAAS_URLS.uploadImage,
	          filePath: self.workingCertPath,
	          name: 'file',
	          formData: {
	            'userKey': self.userKey
	          },
	          success: res => {
	            const response = JSON.parse(res.data)
	            if (response.code === 0) {
	              self.errorData = Object.assign({}, self.errorData, {
	                show: true,
	                desc: "已成功上传工作证明！"
	              })
	              self.worksPhoto = response.data.full_path
	
	            } else {
	              uni.showToast({
				  title: '上传图片失败:' + response.msg,
				  icon: "none"
				})
	            }
	          },
	          fail: err => {
	            console.error(err)
	            self.errorData = Object.assign({}, self.errorData, {
	              show: true,
	              desc: '服务器异常，上传图片失败'
	            })
	          }
	        })
	      }
	    })
	},
    checkInfo() {
      return this.industryIndex !== 0 && this.job && this.income && this.dayIndex !== 0 && this.companyName && this.province && this.city && this.area && this.address
    },
    handleIndustryChange(e) {
      this.industryIndex = e.target.value
    },
    handleDayChange(e) {
      this.dayIndex = e.target.value
    },
    errorHide: function (e) {
      if (!e.detail) {
        this.errorData.show = false;
        return
      }
      this.errorData = e.detail
    },
  }
}
</script>
<style lang="scss" scoped>
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  background: #f4f4f4;
  height: 100vh;
  .row-wrap {
    display: flex;
    flex-direction: row;
    width: 100%;
    background: #fff;
    border-bottom: 1rpx solid #f4f4f4;
    color: #999;
    align-items: center;
    .row-title {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      width: 700rpx;
      font-size: 30rpx;
      color: #999;
      height: 96rpx;
      line-height: 96rpx;
      margin-left: 20rpx;
      .red-dot {
      	float: left;
      	color: #F43F3B;
      	font-size: 24rpx;
      }
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
      // height: 100%;
      line-height: 96rpx;
      text-align: right;
      margin-right: 20rpx;
      font-size: 30rpx;
      align-content: center;
    }
    .nav-icon {
      width: 32rpx;
      height: 32rpx;
      margin-right: 20rpx;
    }
  }
}

.bottom {
  background:linear-gradient(180deg,rgba(82,171,252,1) 0%,rgba(6,135,255,1) 100%);
  border-radius: 50rpx;
  width: 666rpx;
  height: 88rpx;
  line-height: 88rpx;
  color: #fff;
  font-size: 32rpx;
  font-weight: 400;
  align-items: center;
  text-align: center;
  margin: 50rpx 0;
}

.uni-collapse-cell {
  border: none;
}
.uni-collapse-cell__title-text {
  text-align: right;
}
.active-item-text {
  color: #fb2622;
}
.brLine {
    width:100%;
    height: 20rpx;
    background: #f4f4f4;
}
.card-img {
    margin-top: 20rpx;
    margin-left: 40rpx;
    width: 160rpx;
    height: 160rpx;
}
.fs24 {
	font-size: 24rpx;
}
</style>
