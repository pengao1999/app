<template>
  <view class="product-detail" :style="{background: customFormat.background, marginTop: customFormat.marginTop, marginBottom: customFormat.marginBottom, marginLeft: customFormat.marginLeft, marginRight: customFormat.marginRight}">
    <view class="col-title">
      <view class="title">
        <text>商</text>
        <text class="point">·</text>
        <text>品</text>
        <text class="point">·</text>
        <text>详</text>
        <text class="point">·</text>
        <text>情</text>
      </view>
      <text class="sub-title">PURCHASE RECORDS</text>
    </view>
    <block>
      <uParse :content="goods.details" @preview="preview" @navigate="navigate" />
    </block>
  </view>
</template>

<script>
import uParse from '../../../common/third/uParse/src/wxParse.vue'

export default {
  name: 'ProductDetail',
  components: {
    uParse
  },
  props: {
    customFormat: {
      type: Object,
      default() {
        return {}
      }
    },
    goods: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  methods: {
    preview() {

    },
    navigate() {

    }
  }
}
</script>

<style lang="scss" scoped>
.product-detail {
  width: 100%;
  //   min-height: 1000rpx;
  margin-top: 30rpx;
  display: flex;
  flex-direction: column;
  .col-title {
    width: 100%;
    height: 100rpx;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .title {
      font-size: 28rpx;
      font-weight: bold;
      color: #333;
      .point {
        font-size: 20rpx;
        color: #ddd;
        margin-left: 10rpx;
        margin-right: 10rpx;
      }
      .sub-title {
        font-size: 12rpx;
        font-weight: bold;
        color: #bbb;
        letter-spacing: 3rpx;
        margin-top: 10rpx;
      }
    }
  }
}
</style>