<template>
  <view
    class="top"
    :style="{ background: format.background, color: format.color }"
  >
    <view class="address" @tap.stop="toStoreList">
      <image src="/static/ic_coordinate.png" />
      <text>{{ store.store_name ? store.store_name : "请选择您的小区" }}</text>
      <image src="/static/ic_arrow_down_white.png" class="arrow" />
    </view>
    <view
      class="roll"
      style="background: url('https://wxapp.test.youxuanbest.com/attachment/images/8/2019/01/z64H6Z9o3GvMFMMT4v4O4ZmAG3fL74.png');"
      v-if="showRecord"
    >
      <swiper
        :vertical="true"
        :autoplay="autoplay"
        :interval="4000"
        :duration="1000"
        :circular="true"
      >
        <swiper-item
          class="item"
          v-for="(item, index) in newOrders"
          :key="index"
          catchtouchmove="move"
        >
          <image class="head" :src="item.userImg" />
          <view class="text">买了{{ item.goodseName }}</view>
        </swiper-item>
      </swiper>
    </view>
    <view class="search" v-else>
      <input
        class="keyword"
        type="text"
        placeholder="请输入商品名称New"
        placeholder-class="placeholder"
        disabled="true"
        @tap.stop="toSearch"
      />
    </view>
  </view>
</template>

<script>
export default {
  name: 'IndexTopAddress',
  props: {
    store: {
      type: Object,
      default() {
        return {}
      }
    },
    newOrders: {
      type: Array,
      default() {
        return []
      }
    },
    node: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      autoplay: true
    }
  },
  computed: {
    format() { return this.node.format },
    showRecord() { return this.node.element.showRecord }
  },
  methods: {
    toStoreList() {
      uni.navigateTo({
        url: '/pkUserInfo/address/area'
      })
    },
    toSearch() {
      uni.navigateTo({
        url: '/pkMain/goodslist/goodslist'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.top {
  width: 100%;
  height: 100rpx;
  background: #1dc422;
  color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .address {
    height: 40upx;
    line-height: 40upx;
    display: flex;
    align-items: center;
    padding-left: 30rpx;
    padding-right: 30rpx;
    image {
      width: 30rpx;
      height: 30rpx;
    }

    text {
      line-height: 38rpx;
      font-size: 32rpx;
      font-weight: 500;
      //   color: #fff;
      margin-left: 10rpx;
      max-width: 280rpx;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }
    .arrow {
      width: 28rpx;
      height: 28rpx;
      margin-left: 10rpx;
      margin-top: 4rpx;
    }
  }

  .roll {
    height: 50rpx;
    width: 300rpx;
    overflow: hidden;
    background: #eee;
    border-radius: 25rpx;
    margin-right: 20rpx;
    swiper {
      height: 50rpx;
    }
    .item {
      line-height: 42rpx;
      height: 42rpx;
      display: flex;
      align-items: center;
      margin-left: 4rpx;
      .head {
        width: 42rpx;
        height: 42rpx;
        border-radius: 50%;
        background: #eee;
        margin-left: 4rpx;
      }
      .text {
        flex: 1;
        font-size: 22rpx;
        // color: #fff;
        margin-left: 10rpx;
        margin-right: 10rpx;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
      }
    }
  }

  .search {
    width: calc(100% - 60rpx);
    height: 58rpx;
    border-radius: 34rpx;
    background: #fff;
    margin-left: 30rpx;
    margin-right: 30rpx;
    margin-top: 10rpx;
    display: flex;
    align-items: center;
    .keyword {
      height: 68rpx;
      line-height: 68rpx;
      font-size: 24rpx;
      color: #666;
      width: calc(100% - 100rpx);
      margin-left: 40rpx;
    }
    .button {
      width: 28rpx;
      height: 28rpx;
      float: right;
    }
  }
}
</style>