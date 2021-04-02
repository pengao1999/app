<template>
  <view>
    <view class="container">
      <view class="content">{{contentText}}</view>
      <button @click="handleClick">{{buttonText}}</button>
    </view>
  </view>
</template>
<script>
export default {
  name: 'stageLimit',
  data() {
    return {
      contents: {
        underReview: '您的分期额度正在审核中',
        toApply: '请先领取分期额度哦～'
      },
      buttons: {
        underReview: '点击查看',
        toApply: '立即领取'
      },
      contentText: '',
      buttonText: ''
    }
  },
  onLoad(options) {
    const category = options.category || 'toApply'
    this.contentText = this.contents[category]
    this.buttonText = this.buttons[category]
  },
  methods: {
    handleClick() {

    }
  }
}
</script>
<style lang="scss" scoped>
.container {
  width: 100%;
  background: #ffffff;
  .content {
    margin-top: 30vh;
    width: 100%;
    text-align: center;
    font-size: 36rpx;
    color: #333;
  }
  button {
    width: 70%;
    height: 70rpx;
    margin-top: 50rpx;
    line-height: 70rpx;
    background: #f37b1d;
    color: #fff;
    border-radius: 33rpx;
    font-size: 30rpx;
  }
}
</style>