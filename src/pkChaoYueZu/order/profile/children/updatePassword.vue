<template>
  <view class="container">
    <view style="height: 20rpx; width:100%"></view>
    <view class="row-input">
      <input placeholder="请输入新密码" style="margin:20rpx;" v-model="newPassword" />
    </view>
    <view class="bottom-btn" @click="confirm">确定</view>
  </view>
</template>
<script>
export default {
  name: 'UpdatePassword',
  data() {
    return {
      newPassword: '',
    }
  },
  methods: {
    confirm() {

    }
  }
}
</script>
<style lang="scss" scoped>
.container {
  height: 100%;
  background: #f4f4f4;
  display: flex;
  flex-direction: column;
  align-items: center;
  .row-input {
    width: 100%;
    height: 100rpx;
    font-size: 30rpx;
    color: #999;
    background: #fff;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .bottom-btn {
    width: 600rpx;
    height: 80rpx;
    line-height: 80rpx;
    background: linear-gradient(
      270deg,
      rgba(255, 66, 48, 1) 0%,
      rgba(253, 118, 45, 1) 100%
    );
    border-radius: 40rpx;
    color: #fff;
    font-size: 30rpx;
    margin-top: 30rpx;
    text-align: center;
  }
}
</style>