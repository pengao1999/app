<template>
  <view class="content">
    <error-tips :propData="errorData" @hide="errorHide"></error-tips>
	<view class="brLine"></view>
    <view class="row-wrap">
      <view class="row-title"><view class="red-dot">*</view>法人姓名</view>
      <input placeholder="请填写" class="row-input" v-model="legalPersonName"/>
    </view>
    <view class="row-wrap">
      <view class="row-title"><view class="red-dot">*</view>法人电话</view>
      <input placeholder="请填写" class="row-input" v-model="legalPersonTel" />
    </view>
	<view class="row-wrap">
	  <view class="row-title"><view class="red-dot">*</view>单位具体地址</view>
	  <input placeholder="请填写" class="row-input" v-model="companyAddress"/>
	</view>
	<view class="row-wrap">
      <view class="row-title"><view class="red-dot">*</view>单位座机(或者同事电话)</view>
      <input placeholder="请填写" class="row-input"  v-model="companyTel" />
    </view>

    <view class="brLine"></view>

    <view class="row-wrap">
      <view class="row-title"><view class="red-dot">*</view>公司主营业务</view>
      <input placeholder="请填写" class="row-input"  v-model="mainBusiness" />
    </view>

    <view class="brLine"></view>
    <view class="row-wrap">
        <view class="row-title"><view class="red-dot">*</view>上传营业执照</view>
        <image src="/static/zulin/verify/icon-right.png" class="nav-icon"/>
    </view>
    <view class="row-wrap" style="padding-bottom: 20rpx;">
        <image :src="licensePhoto" class="card-img"  @click="addCompanyImg"/>
    </view>
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
      legalPersonName: '',
      legalPersonTel: '',
	  companyAddress: '',
	  companyTel: '',
	  mainBusiness: '',
	  licensePhoto: "/static/icon-default-degree.png",
	  idCardCompanyPath: '',
	  idCardCompanyFile: ''
    }
  },
  onLoad(options) {
    this.userKey = options.userKey;
    this.ifVerified = options.isCompleted === '0' ? false : true
	this.init();
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
    
  },
  methods: {
    errorHide: function (e) {
      if (!e.detail) {
        this.errorData.show = false;
        return
      }
      this.errorData = e.detail
    },
	init() {
		let self = this
		if (self.userKey == undefined) {
		  self.userKey = '';
		  return;
		}
		uni.showLoading({
		  title: '加载中...'
		})
		
		self.$Phttp.get(Config.REQUEST_URLS.getCompanyInfo, { userKey: self.userKey, appKey: 123 }).then(res => {
		  res = res.data
		  if (res.code === 200) {
			  self.legalPersonName = res.data.legalPersonName,
			  self.legalPersonTel = res.data.legalPersonTel,
			  self.companyAddress = res.data.companyAddress,
			  self.companyTel = res.data.companyTel,
			  self.mainBusiness = res.data.mainBusiness,
			  self.licensePhoto = res.data.licensePhoto || "/static/icon-default-degree.png"
		  }
		  uni.hideLoading()
		})
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
      if(self.licensePhoto.indexOf('icon-default-degree') > 0) {
    	  self.errorData = Object.assign({}, self.errorData, {
    	    show: true,
    	    desc: '请上传公司营业执照~'
    	  })
    	  return
      }
    
      if (self.userKey == undefined) {
        self.userKey = '';
      }
    
      const data = { // 提交参数
	    legalPersonName: self.legalPersonName,
	    legalPersonTel: self.legalPersonTel,
	    companyAddress: self.companyAddress,
	    companyTel: self.companyTel,
	    mainBusiness: self.mainBusiness,
	    licensePhoto: self.licensePhoto,
        userKey: self.userKey
      }
      console.log('请求参数：' + JSON.stringify(data));
      console.log('请求接口：' + Config.REQUEST_URLS.addCompanyInfo);
      
      self.$Phttp.post(Config.REQUEST_URLS.addCompanyInfo, data, 'application/json').then(res => {
        console.log("返回数据：" + JSON.stringify(res))
      	res = res.data
        if (res.code === 200) {
          self.errorData = Object.assign({}, self.errorData, {
            show: true,
            desc: "企业信息保存成功!"
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
	addCompanyImg() {
	    let self = this
	    uni.chooseImage({
	      count: 1,
	      sizeType: ['compressed'],
	      sourceType: ['album', 'camera'],
	      success: function (res) {
	        self.idCardCompanyPaht = res.tempFilePaths[0]
	        self.idCardCompanyFile = res.tempFiles[0]
	        if (self.idCardCompanyFile.size > Config.UPLOAD_LIMIT) {
	          uni.showToast({
	            title: '请尽量选择小于6M的图片',
	            icon: "none"
	          })
	          self.idCardCompanyPaht = ''
	          return
	        }
	        uni.uploadFile({
	          url: Config2.JAVA_SAAS_URLS.uploadImage,
	          filePath: self.idCardCompanyPaht,
	          name: 'file',
	          formData: {
	            'userKey': self.userKey
	          },
	          success: res => {
	            const response = JSON.parse(res.data)
	            if (response.code === 0) {
	              self.errorData = Object.assign({}, self.errorData, {
	                show: true,
	                desc: "已成功上传营业执照！"
	              })
				  
	              self.licensePhoto = response.data.full_path
				
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
      return self.legalPersonName && self.legalPersonTel && self.companyAddress && self.companyTel && self.mainBusiness
    }
  }
}
</script>
<style lang="scss">
page {
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #f4f4f4;
}
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
  background: #f4f4f4;
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
	height: 160rpx;
	background: #f4f4f4;
}
.card-img {
    margin-top: 20rpx;
    margin-left: 40rpx;
    width: 160rpx;
    height: 160rpx;
}
</style>
