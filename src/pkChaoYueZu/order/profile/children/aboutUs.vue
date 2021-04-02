<template>
  <view class="container">
    <image src="/static/zulin/profile/empty.png" class="empty-img" />
    <view class="empty-text">暂未开放</view>
    <view class="bottom-btn" @click="toIndex">返回首页看看</view>
  </view>
</template>
<script>
export default {
  name: 'AboutUs',
  methods: {
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
  display: flex;
  flex-direction: column;
  align-items: center;
  .empty-img {
    width: 400rpx;
    height: 250rpx;
    margin-top: 300rpx;
  }
  .empty-text {
    font-size: 30rpx;
    color: #888;
    margin: 60rpx 0;
  }
  .bottom-btn {
    width: 500rpx;
    height: 80rpx;
    line-height: 80rpx;
    background: linear-gradient(
      270deg,
      rgba(255, 66, 48, 1) 0%,
      rgba(253, 118, 45, 1) 100%
    );
    border-radius: 40rpx;
    font-size: 30rpx;
    color: #fff;
    text-align: center;
  }
}
</style>
