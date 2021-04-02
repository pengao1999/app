<template>
  <view class="container">
    <view class="row-wrap" @click="toAddress">
      <text class="row-text">编辑收货地址</text>
      <image src="/static/ic_arrow_right.png" class="right-img" />
    </view>
    <view class="row-wrap" @click="toUpdatePassword">
      <text class="row-text">修改密码</text>
      <image src="/static/ic_arrow_right.png" class="right-img" />
    </view>
    <view class="bottom-btn" @click="handleLogout">退出登录</view>
    <myDialog
	confirmColor="var(--blue)"
      title="退出登录"
      content="您确定要退出登录吗?"
      :dialog-show="logoutDialog"
      @cancelButton="logoutDialog=false"
      @confirmButton="logoutReal"
    ></myDialog>
  </view>
</template>
<script>
import { mapMutations } from 'vuex'
export default {
  name: 'Setting',
  data() {
    return {
      logoutDialog: false
    }
  },
  methods: {
    ...mapMutations(['logout']),
    toAddress() {
      uni.navigateTo({
        url: '/pkChaoYueZu/order/address'
      })
    },
    toUpdatePassword() {
      // uni.showToast({
      //   title: '暂未开放',
      //   duration: 2000,
      //   icon: "none"
      // })
      uni.navigateTo({
        url: '/pkChaoYueZu/profile/children/updatePassword'
      })
    },
    backToIndex() {
      uni.switchTab({
        url: '/pkChaoYueZu/index/main'
      })
    },
    handleLogout() {
      let self = this
      self.logoutDialog = true
    },
    logoutReal() {
      let self = this
      self.logout()
      self.toast({
        desc: '您已退出登录～'
      })
      uni.switchTab({
        url: '/pkChaoYueZu/profile/profile'
      })
    },
  }
}
</script>
<style lang="scss" scoped>
.container {
  background: #f4f4f4;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  .row-wrap {
    width: 100%;
    display: flex;
    flex-direction: row;
    height: 110rpx;
    line-height: 110rpx;
    align-items: center;
    background: #fff;
    border-bottom: 1rpx solid #f4f4f4;
    .row-text {
      flex: 1;
      margin-left: 30rpx;
    }
    .right-img {
      width: 30rpx;
      height: 30rpx;
      margin-right: 30rpx;
    }
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
    font-size: 30rpx;
    color: #fff;
    margin-top: 40rpx;
    text-align: center;
  }
}
</style>
