<template>
  <view class="base-info" id="base-info" :style="{background: customFormat.background, marginTop: customFormat.marginTop, marginBottom: customFormat.marginBottom, marginLeft: customFormat.marginLeft, marginRight: customFormat.marginRight}">
    <view class="top">
      <view class="price-box">
        <text class="unit">￥</text>
        <text class="price">{{integerPrice}}</text>
        <text class="sub-price">.{{decimalPrice}}</text>
        <text class="o-price">￥{{goods.original_price}}</text>
      </view>
<!--      <view class="right base-right">-->
<!--        <text>距结束</text>-->
<!--        <text>{{countDownDay}}天{{countDownHour}}:{{countDownMinute}}:{{countDownSecond}}</text>-->
<!--      </view>-->
    </view>
    <view class="info">
      <text class="title">{{goods.name}}</text>
      <text class="desc">现在下单，预计{{expectTime}}可配送上门</text>
      <view class="bottom">剩余{{goods.stock}}件，已售{{goods.sales_num}}件</view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'ProductBaseInfo',
  props: {
    customFormat: {
      type: Object,
      default() {
        return {}
      }
    },
    integerPrice: {
      type: Number,
      default: 0
    },
    decimalPrice: {
      type: Number,
      default: 0
    },
    goods: {
      type: Object,
      default() {
        return {
          name: '',
          stock: 0,
          sales_num: 0
        }
      }
    },
    expectTime: {
      type: String,
      default: ''
    },
    countDownDay: {
      type: String,
      default: ''
    },
    countDownHour: {
      type: String,
      default: ''
    },
    countDownMinute: {
      type: String,
      default: ''
    },
    countDownSecond: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="scss" scoped>
.base-info {
  // width: calc(100% - 48rpx);
  height: 300rpx;
  margin-left: 24rpx;
  margin-right: 24rpx;
  background: #fff;
  box-shadow: 0px 10px 20px 0px rgba(201, 201, 201, 0.16);
  border-radius: 20rpx;
  display: flex;
  flex-direction: column;
  position: relative;
  margin-top: -80rpx;
  .top {
    width: 100%;
    height: 110rpx;
    background: linear-gradient(90deg, #08c00d 0%, #7fd754 100%);
    border-radius: 20rpx 20rpx 0rpx 0rpx;
    display: flex;
    color: #fff;
    .price-box {
      margin-bottom: 20rpx;
      display: flex;
      align-items: flex-end;
      .unit {
        font-size: 36rpx;
        line-height: 36rpx;
        margin-left: 50rpx;
      }
      .price {
        font-size: 76rpx;
        line-height: 76rpx;
        margin-left: 5rpx;
        margin-bottom: -2rpx;
        display: block;
      }
      .sub-price {
        font-size: 46rpx;
        line-height: 46rpx;
        display: block;
      }
      .o-price {
        font-size: 28rpx;
        margin-left: 20rpx;
        line-height: 28rpx;
        text-decoration: line-through;
        display: block;
      }
    }
    .right {
      width: 242rpx;
      height: 120rpx;
      // background: rgba(64, 65, 70, 1);
      border-radius: 20rpx 20rpx 0px 0px;
      padding-left: 50rpx;
      position: absolute;
      right: 0;
      top: -10rpx;
      display: flex;
      align-items: center;
      flex-direction: column;
      justify-content: center;
      text {
        font-size: 30rpx;
        font-weight: bold;
        color: #c4a466;
      }
    }
    .base-right {
      background-image: url("http://fanimg.aprain.cn/time_bg.png");
      background-size: 100% 100%;
      -moz-background-size: 100% 100%;
    }
  }
  .info {
    width: calc(100% - 48rpx);
    margin-left: 24rpx;
    margin-right: 24rpx;
    display: flex;
    flex-direction: column;
    .title {
      width: 100%;
      height: 60rpx;
      line-height: 60rpx;
      margin-top: 15rpx;
      font-size: 32rpx;
      font-weight: bold;
      color: #333;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .desc {
      width: 100%;
      height: 45rpx;
      font-size: 24rpx;
      line-height: 45rpx;
      font-weight: 400;
      color: #888;
    }
    .bottom {
      width: 100%;
      height: 45rpx;
      font-size: 24rpx;
      line-height: 45rpx;
      font-weight: 400;
      color: #333;
      .money {
        color: #f76260;
        margin-left: 5rpx;
        margin-right: 5rpx;
      }
    }
  }
}
</style>
