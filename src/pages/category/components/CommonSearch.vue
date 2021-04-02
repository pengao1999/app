<template>
  <view class="top" :style="{background: customFormat.background}">
    <view class="search">
      <input
        class="keyword"
        type="text"
        placeholder="请输入商品名称/关键字"
        placeholder-class="placeholder"
        disabled="true"
        @tap.stop="toSearch"
      />
      <image class="button" @tap.stop="toSearch" src="/static/ic_search.png" />
    </view>
  </view>
</template>

<script>
export default {
  name: 'CommonSearch',
  props: {
    customFormat: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  methods: {
    toSearch() {
      uni.navigateTo({
        url: '/pkMain/goodslist/goodslist'
      })
    },
  }
}
</script>

<style lang="scss" scoped>
@import url("../../../common/css/colorui.css");

.top {
  width: 100%;
  height: 85upx;
  background: #1dc422;
  display: flex;
  flex-direction: column;
  align-items: center;
  .search {
    width: calc(100% - 60upx);
    height: 58upx;
    border-radius: 34upx;
    background: #fff;
    margin-left: 30upx;
    margin-right: 30upx;
    margin-top: 10upx;
    display: flex;
    align-items: center;
    /* background:rgba(244,244,244,1); */
    .keyword {
      height: 68upx;
      line-height: 68upx;
      font-size: 24upx;
      //   color: #666;
      width: calc(100% - 90upx);
      margin-left: 35upx;
    }
    .button {
      width: 68rpx;
      height: 48rpx;
      padding: 10rpx 20rpx;
    }
  }
}
</style>