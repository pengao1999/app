<template>
  <view class="order-box" :style="{background: customStyle.background, color: customStyle.color, borderRadius: customStyle.borderRadius, marginLeft: customStyle.marginLeft, marginRight: customStyle.marginRight, marginTop: customStyle.marginTop, marginBottom: customStyle.marginBottom}">
    <view class="all-order" @tap.stop="toOrderList(0)">
      我的订单
      <image src="/static/ic_arrow_right.png" :lazy-load="true" class="arrow" />
      <text>全部订单</text>
    </view>
    <!-- <view class="items">
      <view class="item" @tap.stop="toOrderList(1)" v-if="customItem.pendingPay">
        <image src="/static/ic_pay.png" :lazy-load="true" />
        <text>{{customItem.pendingPay.title}}</text>
        <text class="tag" v-if="order_count.state1 > 0">{{order_count.state1}}</text>
      </view>
      <view class="item" @tap.stop="toOrderList(2)" v-if="customItem.pendingDelivery">
        <image src="/static/ic_send.png" :lazy-load="true" />
        <text>{{customItem.pendingDelivery.title}}</text>
        <text class="tag" v-if="order_count.state2 > 0">{{order_count.state2}}</text>
      </view>
      <view class="item" @tap.stop="toOrderList(3)" v-if="customItem.delivering">
        <image src="/static/ic_sended.png" :lazy-load="true" />
        <text>{{customItem.delivering.title}}</text>
        <text class="tag" v-if="order_count.state3 > 0">{{order_count.state3}}</text>
      </view>
      <view class="item" @tap.stop="toOrderList(4)" v-if="customItem.pendingPick">
        <image src="/static/ic_take.png" :lazy-load="true" />
        <text>{{customItem.pendingPick.title}}</text>
        <text class="tag" v-if="order_count.state4 > 0">{{order_count.state4}}</text>
      </view>
      <view class="item" @tap.stop="toOrderList(5)" v-if="customItem.completed">
        <image src="/static/ic_finish.png" :lazy-load="true" />
        <text>{{customItem.completed.title}}</text>
        <text class="tag" v-if="order_count.state5 > 0">{{order_count.state5}}</text>
      </view>
    </view> -->
    <view class="items">
      <view class="item" v-for="(item,index) in customItem" :key="index" @tap.stop="toOrderList(item.param)">
        <image :src="item.icon" :lazy-load="true" />
        <text>{{item.name}}</text>
        <text class="tag" v-if="order_count.state1 > 0">{{order_count.state1}}</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    order_count: {
      type: Object,
      default() {
        return {};
      }
    },
    customStyle: {
      type: Object,
      default() {
        return {}
      }
    },
    customItem: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  methods: {
    toOrderList(status) {
      this.$emit("toOrderList", status);
    }
  }
};
</script>

<style lang="scss">
.order-box {
  width: calc(100% - 60rpx);
  height: 222rpx;
  // margin-top: -120rpx;
  // margin-left: 30rpx;
  // margin-right: 30rpx;
  // background: #fff;
  // color: #333;
  // border-radius: 20rpx;
  display: flex;
  flex-direction: column;
  box-shadow: 0px 10px 20px 0px rgba(0, 0, 0, 0.02);
  z-index: 1000;

  .all-order {
    width: calc(100% - 40upx);
    height: 90rpx;
    line-height: 90rpx;
    padding-left: 20rpx;
    padding-right: 20rpx;
    font-size: 32rpx;
    font-weight: bold;
    border-bottom: solid 1rpx #eee;
    border-top-left-radius: 20rpx;
    border-top-right-radius: 20rpx;

    text {
      font-size: 28rpx;
      float: right;
      font-weight: 400;
      margin-right: 20rpx;
    }

    .arrow {
      width: 22rpx;
      height: 22rpx;
      margin-top: 34rpx;
      float: right;
    }
  }

  .items {
    width: 100%;
    height: 150rpx;
    display: inline-flex;
    border-bottom-left-radius: 20rpx;
    border-bottom-right-radius: 20rpx;
    display: flex;
    flex-direction: row;
    justify-content: space-around;

    .item {
      width: 20%;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;

      image {
        width: 60rpx;
        height: 60rpx;
        margin-top: 20rpx;
      }

      text {
        font-size: 20rpx;
        font-weight: 500;
      }

      .tag {
        width: 30rpx;
        height: 30rpx;
        line-height: 30rpx;
        text-align: center;
        background: #e84118;
        border-radius: 15rpx;
        color: #fff;
        position: absolute;
        font-size: 20rpx;
        margin-left: 25rpx;
        margin-top: 15rpx;
      }
    }
  }
}
</style>
