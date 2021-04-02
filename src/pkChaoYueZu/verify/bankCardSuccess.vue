<template>
  <view class="content">
    <error-tips :propData="errorData" @hide="errorHide"></error-tips>
    <image src="/static/zulin/verify/success.png" class="success-img" />
    <view class="text-hd">银行卡认证成功</view>
    <view class="text-sub">请进行下一步运营商认证</view>
    <view class="bottom-button" @click="next">下一步</view>
  </view>
</template>
<script>
import Config from './config.js'
import errorTips from '../../components/yx_dialog/myErrorTip.vue'
export default {
  name: 'BankCardSuccess',
  components: { errorTips },
  data() {
    return {
      userKey: '',
      test: '',
      // 错误提示
      errorData: {
        show: false,
        desc: ''
      },
    }
  },
  onLoad(options) {
    this.userKey = options.userKey
  },
  methods: {
    errorHide: function (e) {
      if (!e.detail) {
        this.errorData.show = false;
        return
      }
      this.errorData = e.detail
    },
    next(){
      uni.navigateTo({
        url: '/pkChaoYueZu/verify/operater?userKey=' + this.userKey
      })
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
  .success-img {
    width: 160rpx;
    height: 160rpx;
    margin-top: 100rpx;
  }
  .text-hd {
    color: #222;
    font-size: 32rpx;
    margin: 30rpx 0;
  }
  .text-sub {
    font-size: 26rpx;
    color: #999;
  }
  .bottom-button {
    font-size: 30rpx;
    color: #fff;
    margin-top: 150rpx;
    width: 500rpx;
    height: 80rpx;
    line-height: 80rpx;
    text-align: center;
    background:linear-gradient(180deg,rgba(82,171,252,1) 0%,rgba(6,135,255,1) 100%);
    border-radius: 40rpx;
  }
}
</style>