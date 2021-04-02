<template>
  <view class="container">
    <view class="text-hd">恭喜！下单成功</view>
    <view class="text-sub">分享给好友吧</view>
    <view class="icon-row">
      <view class="icon-block">
        <image src="/static/wx.png" class="icon" />
        <text class="bottom-text">微信好友</text>
      </view>
      <view class="icon-block">
        <image src="/static/wxpy.png" class="icon" />
        <text class="bottom-text">朋友圈</text>
      </view>
      <view class="icon-block">
        <image src="/static/hy.png" class="icon" />
        <text class="bottom-text">好友</text>
      </view>
    </view>
    <view class="button-block">
      <button class="order-btn" @click="toOrder">去我的订单查看</button>
      <button class="index-btn" @click="toIndex">首页</button>
    </view>
  </view>
</template>
<script>
export default {
  name: 'PaySuccess',
  data() {
    return {
      orderKey: ''
    }
  },
  onLoad(options) {
    this.orderKey = options.key
  },
  methods: {
    toOrder() {
      uni.navigateTo({
        url: '/pkChaoYueZu/order/detail?key=' + this.orderKey
      })
    },
    toIndex() {
      uni.switchTab({
        url: '/pkChaoYueZu/index/main'
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.container {
  align-items: center;
  display: flex;
  flex-direction: column;
  .text-hd {
    font-size: 36rpx;
    color: #222;
    margin-top: 72rpx;
  }
  .text-sub {
    color: #999;
    font-size: 30rpx;
    margin-top: 20rpx;
  }
  .icon-row {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    margin-top: 50rpx;
    width: 90%;
    .icon-block {
      display: flex;
      flex-direction: column;
      align-items: center;
      .icon {
        width: 88rpx;
        height: 88rpx;
      }
      .bottom-text {
        font-size: 26rpx;
        color: #222;
      }
    }
  }
  .button-block {
    margin-top: 160rpx;
    .order-btn {
      width: 400rpx;
      height: 84rpx;
      line-height: 84rpx;
      background: linear-gradient(
        90deg,
        rgba(251, 38, 34, 1) 0%,
        rgba(255, 131, 18, 1) 100%
      );
      border-radius: 42rpx;
      color: #fff;
      font-size: 30rpx;
    }
    .index-btn {
      width: 400rpx;
      height: 84rpx;
      line-height: 84rpx;
      background: linear-gradient(
        270deg,
        rgba(227, 227, 227, 1) 0%,
        rgba(204, 204, 204, 1) 100%
      );
      border-radius: 42rpx;
      color: #fff;
      font-size: 30rpx;
      margin-top: 40rpx;
    }
    button:after {
      border: none;
    }
  }
}
</style>
