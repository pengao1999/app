<template>
  <view style="background: #f4f4f4; height: 100%;">
    <view class="row">
      <view class="row-wrap">
        <image src="/static/zulin/profile/wx.png" class="row-img" />
        <view class="content-wrap">
          <view>
            <text style="font-size: 30rpx; color: #222; font-weight: bold;">微信客服</text>
            <text>（每天9:00 - 21:00）</text>
          </view>
          <view>{{wechatNum}}</view>
        </view>
      </view>
    </view>
    <view class="row">
      <view class="row-wrap" @click="callPhone">
        <image src="/static/zulin/profile/phone.png" class="row-img" />
        <view class="content-wrap">
          <view>
            <text style="font-size: 30rpx; color: #222; font-weight: bold;">电话客服</text>
            <text>（每天9:00 - 21:00）</text>
          </view>
          <view>{{phoneNum}}</view>
        </view>
      </view>
    </view>
  </view>
</template>
<script>
export default {
  name: 'Service',
  data() {
    return {
      wechatNum: '13560038043',
      phoneNum: '13560038043'
    }
  },
  methods: {
    callPhone() {
      uni.setStorageSync("dialogData", {
        title: '联系我们',
        desc: this.phoneNum,
        page: 'call'
      })
      uni.navigateTo({
        url: '/pkChaoYueZu/dialog/popup'
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.row {
  padding: 30rpx;
  background: #fff;
  .row-wrap {
    display: flex;
    flex-direction: row;
    .row-img {
      width: 88rpx;
      height: 88rpx;
    }
    .content-wrap {
      flex: 1;
      margin-left: 24rpx;
      display: flex;
      flex-direction: column;
    }
  }
}
</style>
