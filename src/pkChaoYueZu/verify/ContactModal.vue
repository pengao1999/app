<template>
  <view v-if="show">
    <view class="mask" @click="close"></view>
    <error-tips :propData="errorData" @hide="errorHide"></error-tips>
    <view class="container">
      <view class="title">通讯录列表</view>
      <scroll-view class="content" scroll-y="ture" show-scrollbar="true" @scroll.stop>
        <text v-if="contacts.length===0">暂无联系人</text>
        <view v-else>
          <radio-group @change="radioChange">
            <view class="row-wrap" v-for="(item, index) in contacts" :key="index">
              <radio :value="item.name" :checked="index === current" />
              <view class="text-name">{{item.name}}</view>
              <view class="text-mobile">{{item.mobile}}</view>
            </view>
          </radio-group>
        </view>
      </scroll-view>
      <view class="bottom-btn" @click="confirm">确定</view>
    </view>
  </view>
</template>
<script>
import errorTips from '../../components/yx_dialog/myErrorTip.vue'
export default {
  name: 'ContactModal',
  components: { errorTips },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    contacts: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      current: -1,
      // 错误提示
      errorData: {
        show: false,
        desc: ''
      },
    }
  },
  methods: {
    close() {
      this.$emit('close')
    },
    confirm() {
      this.$emit('confirm', this.current)
      this.close()
    },
    radioChange: function (evt) {
      for (let i = 0; i < this.contacts.length; i++) {
        if (this.contacts[i].name === evt.target.value) {
          this.current = i;
          break;
        }
      }
    },
    errorHide: function (e) {
      if (!e.detail) {
        this.errorData.show = false;
        return
      }
      this.errorData = e.detail
    },
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
  height: 950rpx;
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
    height: 700rpx;
    width: 100%;
    margin: 16rpx 40rpx;
    display: flex;
    flex-direction: column;
    text {
      margin: 30rpx 0;
      font-size: 30rpx;
      text-align: center;
    }
    .row-wrap {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      width: 700rpx;
      height: 50rpx;
      line-height: 50rpx;
      margin: 20rpx 0;
      align-items: center;
      .text-name {
        margin: 10rpx 30rpx;
        width: 400rpx;
        flex: 1;
        text-align: left;
      }
      .text-mobile {
        margin-right: 30rpx;
      }
    }
  }
  .bottom-btn {
    height: 100rpx;
    width: 100%;
    line-height: 100rpx;
    background: #ef4136;
    color: #fff;
    font-size: 28rpx;
    // position: absolute;
    // bottom: 0;
    text-align: center;
  }
}
</style>