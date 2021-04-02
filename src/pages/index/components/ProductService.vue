<template>
  <view class="service" :style="{background: customFormat.background, marginTop: customFormat.marginTop, marginBottom: customFormat.marginBottom, marginLeft: customFormat.marginLeft, marginRight: customFormat.marginRight}">
    <text class="col-name">服务说明</text>
    <view class="item">
      <view class="point"></view>
      <view class="content">
        <text class="name">划线价格</text>
        <text>
          ：指商品的厂商指导价、标签价格或者商品曾经暂时过的价格，
          <text class="underline">并非原价</text>，仅供参考。
        </text>
      </view>
    </view>
    <view class="item">
      <view class="point"></view>
      <view class="content">
        <text class="name">未划线价格</text>
        <text>
          ：指商品的
          <text class="underline">实时价格</text>，不因表述的差异改变性质。具体成本价跟商品参加活动发生改变，最终以订单结算价格为准。
        </text>
      </view>
    </view>
    <view class="item">
      <view class="point"></view>
      <view class="content">
        <text class="name">关于包装</text>
        <text>
          ：因厂家会在没有任何提前通知的情况下更改产品包装、产地或者一些附件，友邻优选
          <text class="underline">不能确保客户收到的货物与小程序中的图片、产地、附件说明完全一致。</text>若友邻优选没有及时更新，请谅解！
          <text class="red">图片仅供参考，请以实物为准</text>。
        </text>
      </view>
    </view>
    <view class="item">
      <view class="point"></view>
      <view class="content">
        <text class="name">退换货</text>
        <text>
          ：生鲜水果类商品，
          <text class="underline">若无质量问题不支持无理由退货以及拒收</text>，敬请谅解；如您收到的商品有质量问题，请在确定可以提货（以友邻优选小程序微信服务通知提示可以提货开始时间为准）之时
          <text class="red">24小时</text>内联系客服，并提交商品的完整照片及相关证明文件，我们将及时为您进行售后处理。
        </text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'ProductService',
  props: {
    customFormat: {
      type: Object,
      default() {
        return {}
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.service {
  width: calc(100% - 48rpx);
  margin-left: 24rpx;
  margin-right: 24rpx;
  padding-bottom: 30rpx;
  background: #fff;
  box-shadow: 0px 10px 20px 0px rgba(201, 201, 201, 0.16);
  border-radius: 20rpx;
  margin-top: 30rpx;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  .col-name {
    width: calc(100% - 90rpx);
    height: 100rpx;
    line-height: 100rpx;
    font-size: 28rpx;
    color: #333;
    font-weight: bold;
    padding-left: 45rpx;
    padding-right: 45rpx;
  }
  .item {
    width: calc(100% - 50rxp);
    padding: 8rpx 25rpx 8rpx 25rpx;
    display: flex;
    .point {
      width: 6rpx;
      height: 6rpx;
      background: #e84118;
      margin-top: 14rpx;
    }
    .content {
      flex: 1;
      margin-left: 20rpx;
      font-size: 24rpx;
      color: #999;
      line-height: 38rpx;
      .name {
        color: #666;
        font-weight: 600;
      }
      .underline {
        color: #666;
        text-decoration: underline;
      }
      .red {
        color: #e84118;
      }
    }
  }
}

button {
  border-radius: 0upx;
}
</style>