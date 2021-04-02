<template>
  <view class="delivery-code" @tap.stop="generateCode" :style="{background: customStyle.background}">
    <view class="code">
      <!-- <tki-qrcode v-if="false" :val="qrval" :size="qrsize" :background="qrbackground" :foreground="qrforeground" :pdground="qrpdground" :icon="qricon" :iconSize="qriconsize" :lv="qrlv" ref="qrcode" @result="qrR"></tki-qrcode> -->
      <image src="/static/ewm.png" :lazy-load="true" />
    </view>

    <view class="info">
      <text class="take-text">向提货点出示二维码提货</text>
      <text class="take-code">或出示提货码</text>
      <text class="get-code">使用提货码</text>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    customStyle: {
      type: Object,
      default(){
        return {}
      }
    }
  },
  methods: {
    generateCode() {
      this.$emit("generateCode");
    }
  }
};
</script>

<style lang="scss">
.delivery-code {
  width: 100%;
  display: inline-flex;
  padding-top: 60rpx;
  // background: white;

  .code {
    width: 200rpx;
    height: 200rpx;
    margin-left: 80rpx;
    margin-right: 40rpx;

    image {
      width: calc(100% - 10rpx);
      height: calc(100% - 10rpx);
      padding: 5rpx;
    }

    canvas {
      background: #fff;
      width: 100%;
      height: 100%;
    }
  }

  .info {
    width: calc(100% - 320rpx);
    display: flex;
    flex-direction: column;
    align-items: center;

    .take-text {
      font-size: 30rpx;
      color: #e84118;
      margin-top: 20rpx;
    }

    .take-code {
      font-size: 22rpx;
      color: #999;
      margin-top: 10rpx;
    }

    .get-code {
      width: 180rpx;
      height: 50rpx;
      line-height: 50rpx;
      text-align: center;
      border-radius: 30rpx;
      font-size: 22rpx;
      color: #e84118;
      border: solid 1rpx #e84118;
      margin-top: 10rpx;
    }
  }
}
</style>
