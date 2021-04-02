<template>
  <view class="content">
    <image src="/static/zulin/verify/success.png" class="success-img" />
    <view class="text-hd">运营商认证成功，赶紧去下单吧</view>
    <view class="bottom-button" @click="goBack">返回</view>
  </view>
</template>
<script>
export default {
  name: 'OperaterSuccess',
  data() {
    return {

    }
  },
  methods: {
    goBack() {
		// uni.navigateBack({
		//   delta: 5,
		// })
      setTimeout(function(){uni.switchTab({url: '/pkChaoYueZu/profile/profile'})}, 500)
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
    background: linear-gradient(
      270deg,
      rgba(255, 66, 48, 1) 0%,
      rgba(253, 118, 45, 1) 100%
    );
    border-radius: 40rpx;
  }
}
</style>
