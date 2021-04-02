<template>
  <view>
    <view class="top" :style="{background: customStyle.background}">
      <image
        class="head"
        :src="userInfo.img ? userInfo.img : '/static/ic_default_head.png'"
        :lazy-load="true"
      />
      <view class="info" v-if="userInfo.tel!=null">
        <text
          class="name"
        >{{userInfo !== undefined ? (userInfo.tel ? userInfo.name : '点击登录') : '点击登录'}}</text>
        <text class="community" v-if="userInfo.community">小区：{{userInfo.community}}</text><br/>
        <text
                class="balance"
        >账户余额：{{userInfo.balance?userInfo.balance + '元':'无'}}</text>
        <text
                class="balance" v-if="userInfo.salesman_code"
        >业务员编号：{{userInfo.salesman_code?userInfo.salesman_code:'无'}}</text>
      </view>
      <view class="info" v-else>
        <view class="cu-tag round login_btn" @click="signIn">点击登录</view>
      </view>
<!--      <text class="message_tip" v-if="message_total>0">{{message_total}}</text>-->
<!--      <image class="message" src="/static/ic_message.png" @tap.stop="toMessage" />-->
    </view>
    <!-- <view class='top-bg-img'></view> -->
  </view>
</template>

<script>
export default {
  props: {
    message_total: {
      type: Number,
      default: 0
    },
    userInfo: {
      type: Object,
      default() {
        return {}
      }
    },
    customStyle: {
      type: Object,
      default(){
        return {}
      }
    }
  },
  methods: {
    isLogOut() {
      this.$emit("isLogOut");
    },
    toMessage() {
      uni.navigateTo({
        url: "/pkMessage/message/message"
      });
    },
    signIn() {
      this.$emit("signIn");
    }
  }
};
</script>

<style lang="scss">
$bg-color: #1dc422;
$text-color: #fff;

.top {
  width: 100%;
  height: 240rpx;
  // background: $bg-color;
  display: flex;
  align-items: center;
  flex-direction: row;
  padding-bottom: 30rpx;
  margin-top: -10rpx;

  .head {
    width: 140rpx;
    height: 140rpx;
    margin-left: 40rpx;
    border-radius: 50%;
  }

  .info {
    margin-left: 30rpx;
    display: flex;
    flex-direction: column;
    flex: 2;

    .name {
      font-size: 40rpx;
      line-height: 50rpx;
      font-weight: bold;
      margin-top: 20rpx;
      color: var(--white);
      // color: $text-color;
    }
    .balance {
      font-size: 26rpx;
      line-height: 36rpx;
      color: var(--white);
    }

    .community {
      font-size: 28rpx;
      line-height: 36rpx;
      // color: $text-color;
    }

    .address {
      font-size: 24rpx;
      line-height: 36rpx;
      // color: $text-color;

      image {
        width: 26rpx;
        height: 26rpx;
        margin-left: 10rpx;
        margin-bottom: -4rpx;
      }
    }

    .login_btn {
      width: 260rpx;
      height: 80rpx;
      border: 1px solid white;
      background: $bg-color;
      color: white;
      margin-top: 20rpx;
    }
  }

  .message_tip {
    width: 30rpx;
    height: 30rpx;
    line-height: 30rpx;
    text-align: center;
    background: #e84118;
    border-radius: 15rpx;
    // color: $text-color;
    font-size: 20rpx;
    margin-left: 25rpx;
    margin-top: 15rpx;
  }

  .message {
    width: 50rpx;
    height: 50rpx;
    margin-top: 22rpx;
    margin-right: 20rpx;
  }
}

.top-bg-img {
  width: 100%;
  height: 60rpx;
  background-attachment: fixed;
  background-repeat: no-repeat;
  background-size: cover;
  background-image: url(../../../static/top_bg.png);
}
</style>
