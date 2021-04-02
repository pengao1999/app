<template>
  <view class="content">
    <view class="list-wrap">
      <view class="list-row" @click="toBaseInfo">
        <image class="row-image" src="/static/zulin/verify/icon-mes.png" />
        <text class="row-content">基本信息&nbsp;<text class="fc-red"> * </text></text>
        <text class="text-completed" v-if="completeBaseInfo==1">已完成</text>
        <text class="text-not-completed" v-if="completeBaseInfo==0">未完成</text>
        <image class="row-right" src="/static/zulin/verify/icon-right.png" />
      </view>
      <view class="list-row" @click="toStudentInfo">
        <image class="row-image" src="/static/zulin/verify/icon-student.png" />
        <text class="row-content">学生信息认证</text>
        <text class="text-completed" v-if="completeStudentInfo==1">已完成</text>
        <text class="text-not-completed" v-if="completeStudentInfo==0">学生必填</text>
        <image class="row-right" src="/static/zulin/verify/icon-right.png" />
      </view>
      <view class="list-row" @click="toWorkInfo">
        <image class="row-image" src="/static/zulin/verify/icon-work.png" />
        <text class="row-content">工作人士信息认证</text>
        <text class="text-completed" v-if="completeWorkInfo==1">已完成</text>
        <text class="text-not-completed" v-if="completeWorkInfo==0">工作人士必填</text>
        <image class="row-right" src="/static/zulin/verify/icon-right.png" />
      </view>
	  <view class="list-row" @click="toCompanyInfo">
	    <image class="row-image" src="/static/zulin/verify/icon-work.png" />
	    <text class="row-content">企业租赁信息</text>
	    <text class="text-completed" v-if="completeCompanyInfo==1">已完成</text>
	    <text class="text-not-completed" v-if="completeCompanyInfo==0">企业必填</text>
	    <image class="row-right" src="/static/zulin/verify/icon-right.png" />
	  </view>
      <view class="list-row" @click="toEmergencyContact">
        <image class="row-image" src="/static/zulin/verify/icon-iphone.png" />
        <text class="row-content">紧急联系人&nbsp;<text class="fc-red"> * </text></text>
        <text class="text-completed" v-if="completeContact==1">已完成</text>
        <text class="text-not-completed" v-if="completeContact==0">未完成</text>
        <image class="row-right" src="/static/zulin/verify/icon-right.png" />
      </view>
    </view>
	
	<!-- <view class="bottom" @click="goback">返回</view> -->
	
	<view class="wxts-box">
		<view class="wxts-title">温馨提示：</view>
		<view class="wxts-row">1. <text class="fc-red">*</text>为必填。</view>
		<view class="wxts-row">2. 学生信息、工作人士信息、企业租赁信息认证，根据您自身情况，以上信息三选一。</view>
	</view>
  </view>
</template>
<script>
import Config from './config.js'
export default {
  name: 'personalInfo',
  data() {
    return {
      userKey: '',
      completeBaseInfo: -1,
      completeWorkInfo: -1,
      completeContact: -1,
      completeStudentInfo: -1,
	  completeCompanyInfo: -1
    }
  },
  onLoad(options) {
    this.userKey = options.userKey
  },
  onShow() {
    let self = this
    uni.showLoading({
      title: '加载中...'
    })
    self.$Phttp.get(Config.REQUEST_URLS.creditStatus, { userKey: self.userKey, appKey: 123 }).then(res => {
      res = res.data
      if (res.code === 200) {
        self.completeBaseInfo = res.data.isBaseInfo
        self.completeWorkInfo = res.data.isJob
        self.completeContact = res.data.isEmergency
        self.completeStudentInfo = res.data.isStudent
		self.completeCompanyInfo = res.data.isCompany
      }
      uni.hideLoading()
    })
  },
  methods: {
    toBaseInfo() {
      uni.navigateTo({
        url: '/pkChaoYueZu/verify/baseInfo?userKey=' + this.userKey + '&isCompleted=' + this.completeBaseInfo
      })
    },
    toStudentInfo() {
      uni.navigateTo({
        url: '/pkChaoYueZu/verify/studentInfo?userKey=' + this.userKey + '&isCompleted=' + this.completeStudentInfo
      })
    },
    toWorkInfo() {
      uni.navigateTo({
        url: '/pkChaoYueZu/verify/workInfo?userKey=' + this.userKey + '&isCompleted=' + this.completeWorkInfo
      })
    },
	toCompanyInfo() {
	  uni.navigateTo({
	    url: '/pkChaoYueZu/verify/companyInfo?userKey=' + this.userKey + '&isCompleted=' + this.completeCompanyInfo
	  })
	},
    toEmergencyContact() {
      uni.navigateTo({
        url: '/pkChaoYueZu/verify/emergencyContact?userKey=' + this.userKey + '&isCompleted=' + this.completeContact
      })
    }
	// goback() {
	// 	uni.navigateTo({
	// 		url: '/pkChaoYueZu/verify/verify?userKey=' + this.userKey
	// 	});
	// }
  }
}
</script>
<style lang="scss" scoped>
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: calc(100vh - 0rpx);
  background: #f4f4f4;
  .list-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 750rpx;
    background: #fff;
    .list-row {
      display: flex;
      flex-direction: row;
      align-items: center;
      width: 700rpx;
      height: 110rpx;
      border-bottom: 1rpx solid #f4f4f4;
      .row-image {
        width: 40rpx;
        height: 40rpx;
        margin: 0 20rpx;
      }
      .row-content {
		display: flex;
		align-items: center;  
        flex: 1;
        font-size: 34rpx;
        color: #333;
      }
      .row-right {
        width: 40rpx;
        height: 40rpx;
      }
    }
  }
}
.text-completed {
  font-size: 28rpx;
  color: #333;
}
.text-not-completed {
  font-size: 28rpx;
  color: var(--blue);
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
  margin: 50rpx 0 0;
}
.wxts-box {
	position: absolute;
	bottom:50rpx;
	left:30rpx;
	right: 30rpx;
	.wxts-title {
		font-size: 28rpx;
		font-weight: 600;
		color: #666;
	}
	.wxts-row {
		display: flex;
		align-items: center;
		margin-top: 10rpx;
		padding-left: 24px;
		font-size: 24rpx;
		color: #999;
	}
}
.fs36 {
	font-size: 36rpx;
}
.fc-red {
	color: #f30;
}
</style>
