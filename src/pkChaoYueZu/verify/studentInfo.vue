<template>
  <view class="content">
    <error-tips :propData="errorData" @hide="errorHide"></error-tips>
	<view class="brLine"></view>
    <view class="row-wrap">
      <view class="row-title"><view class="red-dot">*</view>班级学号</view>
      <input placeholder="请填写" class="row-input" v-model="studentId"/>
    </view>
    <view class="row-wrap">
      <view class="row-title"><view class="red-dot">*</view>学校名称</view>
      <input placeholder="请填写" class="row-input" v-model="schoolName" />
    </view>
	<view class="row-wrap">
	  <view class="row-title"><view class="red-dot">*</view>在校住宿地址</view>
	  <input placeholder="请填写" class="row-input" v-model="schoolAddress"/>
	</view>

	<view class="brLine"></view>

	<view class="row-wrap">
	  <view class="row-title">学信网账号（若有必填）</view>
	  <input placeholder="请填写" class="row-input" v-model="collegeAccount" />
	</view>
	<view class="row-wrap">
	  <view class="row-title">学信网密码（若有必填）</view>
	  <input placeholder="请填写" class="row-input" v-model="collegePw" />
	</view>

	<view class="brLine"></view>

	<view class="row-wrap">
	  <view class="row-title"><view class="red-dot">*</view>所学专业</view>
	  <input placeholder="请填写" class="row-input" v-model="major" />
	</view>
	<view class="row-wrap">
	  <view class="row-title"><view class="red-dot">*</view>所在年级</view>
	  <input placeholder="请填写" class="row-input" v-model="grade" />
	</view>

	<view class="brLine"></view>

	<view class="row-wrap">
        <view class="row-title"><view class="red-dot">*</view>花呗额度</view>
        <input type="number" placeholder="请填写(正整数)" class="row-input" v-model="huabei" @blur="formatNum($event)"/>
    </view>

    <view class="brLine"></view>

	<view class="row-wrap">
	  <view class="row-title">有无信用卡</view>
	  <picker
	    :range="creditcardList"
	    :value="creditcardIndex"
	    class="row-picker"
	    @change="handleCreditcardChange"
	  >
	    <view>{{creditcardList[creditcardIndex]}}</view>
	  </picker>
	  <image src="/static/zulin/verify/icon-right.png" class="nav-icon" />
	</view>

	<view class="brLine"></view>

	<view class="row-wrap">
	  <view class="row-title">是否兼职</view>
	  <picker
	    :range="jobList"
	    :value="jobIndex"
	    class="row-picker"
	    @change="handleJobChange"
	  >
	    <view>{{jobList[jobIndex]}}</view>
	  </picker>
	  <image src="/static/zulin/verify/icon-right.png" class="nav-icon" />
	</view>

	<view class="row-wrap">
	  <view class="row-title">月生活费</view>
	  <input type="number" placeholder="请填写(正整数)" class="row-input" v-model="income" @blur="formatNum($event)" />
	</view>

	<view class="brLine"></view>

	<view class="row-wrap">
	    <view class="row-title"><view class="red-dot">*</view>学生证明(如:学生证,校园卡,缴费单,录取通知书)</view>
	    <image src="/static/zulin/verify/icon-right.png" class="nav-icon"/>
	</view>

	<view class="row-wrap" style="padding-bottom: 20rpx;">
	    <image :src="icCardPhoto" class="card-img" @click="addIdCardStudent"/>
	</view>

	<view class="brline-block"></view>

    <!-- <view class="bottom" @click="upload">{{!ifVerified ? '提交': '下一步'}}</view> -->
	<view class="flex-bottom">
		<view v-if="!ifVerified" class="bottom" @click="upload">提交</view>
	</view>

  </view>
</template>
<script>
import iosBlur from '../../common/js/iosBlur.js'
import mpvueCityPicker from '@/components/mpvue-citypicker/mpvueCityPicker.vue'
import errorTips from '../../components/yx_dialog/myErrorTip.vue'
import Config from './config.js'
import Config2 from '../../common/js/Config.js'
export default {
  name: 'studentInfo',
  components: {
    mpvueCityPicker, errorTips
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
	  ifVerified: false,
      studentId: '',
      schoolName: '',
      schoolAddress: '',
      jobList: Config.COMM_LIST,
      jobIndex: 0,
      creditcardList: Config.COMM_LIST,
      creditcardIndex: 0,
      collegeAccount: '',
      collegePw: "",
      major: "",
      grade: "",
      huabei: "",
      income: "",
	  icCardPhoto: "/static/icon-default-degree.png",
	  idCardStudentPath: '',
	  idCardStudentFile: ''
    }
  },
  onLoad(options) {
    this.userKey = options.userKey;
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

    this.init();

  },
  onShow() {
    let self = this
    if (self.userKey == undefined) {
      self.userKey = '';
      return;
    }
  },
  methods: {
    init() {
        let self = this
        uni.showLoading({
            title: '加载中...'
        })

        self.$Phttp.get(Config.REQUEST_URLS.getStudentInfo, { userKey: self.userKey, appKey: 123 }).then(res => {
            res = res.data
            if (res.code === 200) {
                self.studentId = res.data.studentNo;
                self.schoolName = res.data.schoolName;
                self.schoolAddress = res.data.schoolLivingAddress;
                if(res.data.hasPartTimeJob === 0){ // 未认证
                    self.jobIndex = 1
                }else if (res.data.hasPartTimeJob === 1) {
                    self.jobIndex = 2
                }else {
                    self.jobIndex = 0
                }
                if(res.data.hasCreditCard === 0){ // 未认证
                    self.creditcardIndex = 1
                }else if (res.data.hasCreditCard === 1) {
                    self.creditcardIndex = 2
                }else {
                    self.creditcardIndex = 0
                }
                self.collegeAccount = res.data.chsiAccount;
                self.collegePw = res.data.chsiPwd;
                self.major = res.data.majorName;
                self.grade = res.data.grade;
                self.huabei = res.data.huabeiAmount;
                self.income = res.data.monthlyIncome;
                self.icCardPhoto = res.data.icCardPhoto || "/static/icon-default-degree.png"
            }
            uni.hideLoading()
        })
    },
    errorHide: function (e) {
      if (!e.detail) {
        this.errorData.show = false;
        return
      }
      this.errorData = e.detail
    },
    upload() {
      let self = this
      if (self.ifVerified) {
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
	  if(self.icCardPhoto.indexOf('icon-default-degree') > 0) {
		  self.errorData = Object.assign({}, self.errorData, {
		    show: true,
		    desc: '请上传学生证件照~'
		  })
		  return
	  }

      if (self.userKey == undefined) {
        self.userKey = '';
      }

      const data = { // 提交参数
	    studentNo: self.studentId,
	    schoolName: self.schoolName,
		schoolLivingAddress: self.schoolAddress,
        chsiAccount: self.collegeAccount || "无",
        chsiPwd: self.collegePw || "无",
		majorName: self.major,
        grade: self.grade,
        hasCreditCard: self.creditcardIndex === 2 ? 0 : 1,
        hasPartTimeJob: self.jobIndex === 2 ? 0 : 1,
        huabeiAmount: Math.round(self.huabei) || 0,
        monthlyIncome: Math.round(self.income) || 0,
        icCardPhoto: self.icCardPhoto,
        userKey: self.userKey
      }
	  console.log('请求参数：' + JSON.stringify(data));
	  console.log('请求接口：' + Config.REQUEST_URLS.addStudentInfo);

	  self.$Phttp.post(Config.REQUEST_URLS.addStudentInfo, data, 'application/json').then(res => {
	    console.log("返回数据：" + JSON.stringify(res))
	  	res = res.data
	    if (res.code === 200) {
	      self.errorData = Object.assign({}, self.errorData, {
	        show: true,
	        desc: "学生基本信息保存成功!"
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
	addIdCardStudent() {
	    let self = this
	    uni.chooseImage({
	      count: 1,
	      sizeType: ['compressed'],
	      sourceType: ['album', 'camera'],
	      success: function (res) {
	        self.idCardStudentPath = res.tempFilePaths[0]
	        self.idCardStudentFile = res.tempFiles[0]
	        if (self.idCardStudentFile.size > Config.UPLOAD_LIMIT) {
	          uni.showToast({
	            title: '请尽量选择小于6M的图片',
	            icon: "none"
	          })
	          self.idCardStudentPath = ''
	          return
	        }
	        uni.uploadFile({
	          url: Config2.JAVA_SAAS_URLS.uploadImage,
	          filePath: self.idCardStudentPath,
	          name: 'file',
	          formData: {
	            'userKey': self.userKey
	          },
	          success: res => {
	            const response = JSON.parse(res.data)
	            if (response.code === 0) {
	              self.errorData = Object.assign({}, self.errorData, {
	                show: true,
	                desc: "已成功上传学生证！"
	              })
	              self.icCardPhoto = response.data.full_path

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
      let self = this
      return self.studentId && self.schoolName && self.schoolAddress && self.major && self.grade && self.huabei && self.income
    },
    handleJobChange(e) {
      this.jobIndex = e.target.value
    },
    handleCreditcardChange(e) {
      this.creditcardIndex = e.target.value
    },
	formatNum(event) {
		let self = this
		if(event.detail.value.indexOf(".") > 0) {
			self.errorData = Object.assign({}, self.errorData, {
			  show: true,
			  desc: '请输入整数！'
			})
		}
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
  background: #f4f4f4;
  padding-bottom: 100rpx;
  .text-tips {
    height: 60rpx;
    line-height: 60rpx;
    background:rgba(244,249,255,1);
    font-size: 24rpx;
    color: #1677FF;
    width: 100%;
  }
  .row-wrap {
    display: flex;
    flex-direction: row;
    width: 100%;
	background:rgba(255,255,255,1);
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
      height: 100%;
      line-height: 96rpx;
      text-align: right;
      align-content: center;
      margin-right: 20rpx;
      font-size: 30rpx;
    }
    .nav-icon {
      width: 32rpx;
      height: 32rpx;
      margin-right: 20rpx;
    }
  }
}

.flex-bottom {
	position: fixed;
	bottom: 0;
	padding: 10rpx 0;
	width: 100%;
	background: #f4f4f4;
	z-index: 99999;
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
	  margin: 0 auto;
	}
}

.uni-collapse-cell__title {
  text-align: right;
}
.active-item-text {
  color: #1677FF;
}
.brLine {
    width:100%;
    height: 20rpx;
    background: #f4f4f4;
}
.brline-block {
	width: 100%;
	height: 80rpx;
	background: #f4f4f4;
}
.card-img {
    margin-top: 20rpx;
    margin-left: 40rpx;
    width: 160rpx;
    height: 160rpx;
}

</style>
