<template>
  <view v-if="show">
    <view class="mask" @click="close"></view>
    <view class="container">
      <view class="title">服务说明</view>
      <view class="content">
        <text class="text-hd">{{service.name}}</text>
        <text>{{service.desc}}</text>
      </view>
      <view class="foot">回收服务由第三方（回收宝）提供</view>
      <view class="bottom-btn" @click="close">确定</view>
    </view>
  </view>
</template>
<script>
export default {
  name: 'ServiceModal',
  props: {
    service: {
      type: Object,
      default() {
        return {}
      }
    },
		show: {
			type: Boolean,
			default: false
		}
  },
  methods: {
    close() {
      this.$emit('close')
    }
  }
}
</script>
<style lang="scss" scoped>
.mask {
  position: fixed;
  top: 0;
  z-index: 100;
  width: 100%;
  height: 100vh;
  left: 0;
  background: black;
  overflow: hidden;
  opacity: 0.3;
}
.container {
  width: 100%;
  height: 600rpx;
  overflow: hidden;
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 10001;
  background: #fff;
  border-top-left-radius: 20rpx;
  border-top-right-radius: 20rpx;
  .title {
    height: 120rpx;
    line-height: 120rpx;
    font-size: 36rpx;
    text-align: center;
    margin: 0 10rpx;
    color: #333;
    border-bottom: 1rpx solid #f4f4f4;
  }
  .content {
    margin: 16rpx 40rpx;
    display: flex;
    flex-direction: column;
    text {
      font-size: 26rpx;
    }
    .text-hd {
      font-size: 30rpx;
      color: #333;
    }
  }
  .foot {
    position: absolute;
    bottom: 100rpx;
    color: grey;
    text-align: center;
    font-size: 26rpx;
    width: 100%;
    height: 80rpx;
    line-height: 80rpx;
  }
  .bottom-btn {
    height: 100rpx;
    width: 100%;
    line-height: 100rpx;
    background: #ef4136;
    color: #fff;
    font-size: 28rpx;
    position: absolute;
    bottom: 0;
    text-align: center;
  }
}
</style>