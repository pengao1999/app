<template>
  <view class="buyers" id="buyers" :style="{background: customFormat.background, marginTop: customFormat.marginTop, marginBottom: customFormat.marginBottom, marginLeft: customFormat.marginLeft, marginRight: customFormat.marginRight}">
    <view class="col-title">
      <text class="title">购买记录</text>
      <view class="right">
        已有
        <text class="num">{{hasBoughtAmount}}</text>人购买，商品共销售
        <text class="num">{{goods.sales_num}}</text>份
        <image class="arrow" src="/static/ic_arrow_right.png" :lazy-load="true" />
      </view>
    </view>
    <view class="conten">
      <block v-for="(item, index) in goods.users" :key="index">
        <image
          v-if="(showMore&index<29)|(!showMore&index<11)"
          :src="item.img?item.img:'../../static/ic_default_head.png'"
          :lazy-load="true"
          class="user"
        />
        <!-- <image src="/static/ic_more_buyer.png" class='user' v-else-if="!showMore&index>11"/> -->
      </block>
      <image
        v-if="showMoreButton"
        :src="showMore?'/static/ic_retract.png':'/static/ic_more_buyer.png'"
        :lazy-load="true"
        class="user"
        @tap.stop="showMoreData"
      />
    </view>
  </view>
</template>
<script>
export default {
  name: 'ProductBuyer',
  props: {
    customFormat: {
      type: Object,
      default() {
        return {}
      }
    },
    showMore: {
      type: Boolean,
      default: false
    },
    showMoreButton: {
      type: Boolean,
      default: false
    },
    hasBoughtAmount: {
      type: Number,
      default: 0
    },
    goods: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  methods: {
    showMoreData() {
      this.$$emit('showMoreData')
    }
  }
}
</script>

<style lang="scss" scoped>
.wxParse ._image {
  width: 100%;
  display: flex;
}

.buyers {
  width: calc(100% - 48rpx);
  margin-left: 24rpx;
  margin-right: 24rpx;
  max-height: 340rpx;
  background: #fff;
  box-shadow: 0px 10px 20px 0px rgba(201, 201, 201, 0.16);
  border-radius: 20rpx;
  margin-top: 20rpx;
  overflow: hidden;
  .col-title {
    width: 100%;
    height: 100rpx;
    line-height: 100rpx;
    border-bottom: solid 1rpx #f6f6f6;
    display: flex;
    justify-content: space-between;
    .title {
      font-size: 28rpx;
      color: #333;
      font-weight: bold;
      margin-left: 40rpx;
    }
    .right {
      font-size: 20rpx;
      color: #333;
      display: flex;
      align-items: center;
      margin-right: 20rpx;
    }
    .num {
      font-size: 24rpx;
      color: #08c00d;
      margin-left: 5rpx;
      margin-right: 5rpx;
    }
    .arrow {
      width: 16rpx;
      height: 16rpx;
      margin-left: 10rpx;
    }
  }
  .conten {
    width: calc(100% - 48rpx);
    padding: 15rpx 24rpx 15rpx 24rpx;
    display: flex;
    flex-wrap: wrap;
    overflow: hidden;
  }
  .user {
    width: 80rpx;
    height: 80rpx;
    border-radius: 50%;
    margin: 15rpx;
  }
  .more {
    position: absolute;
    right: 0rpx;
    bottom: 0rpx;
  }
}
</style>