<template>
  <view :style="{height: customFormat.height, marginTop: customFormat.marginTop, marginBottom: customFormat.marginBottom, marginLeft: customFormat.marginLeft, marginRight: customFormat.marginRight}">
    <swiper
      class="swiper"
      id="swiper"
      @change="intervalChange"
      :duration="500"
      :circular="true"
      autoplay
    >
      <block v-for="(item, index) in images" :key="index">
        <swiper-item>
          <image :src="image_root + item" :lazy-load="true" mode="aspectFill" />
        </swiper-item>
      </block>
    </swiper>

    <view class="swiper-num">{{intervalVal}}/{{images!==null?images.length:0}}</view>

    <!-- #ifdef APP-PLUS||H5 -->
    <button class="share" @tap.stop="clickShare">
      <image src="/static/ic_share.png" :lazy-load="true" />
      <text>分享</text>
    </button>
    <!-- #endif -->
    <!-- #ifdef MP-WEIXIN -->
<!--    <button class="share" @tap.stop="showWXShareDialog(true)">-->
<!--      <image src="/static/ic_share.png" :lazy-load="true" />-->
<!--      <text>分享</text>-->
<!--    </button>-->
    <!-- #endif -->
  </view>
</template>

<script>
export default {
  name: 'ProductSwaiper',
  props: {
    images: {
      type: Array,
      default() {
        return []
      }
    },
    image_root: {
      type: String,
      default: ''
    },
    customFormat: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      intervalVal: 1,
    }
  },
  methods: {
    intervalChange: function (e) {
      this.intervalVal = e.detail.current + 1
    },
    clickShare() {
      // todo
    },
    showWXShareDialog() {
      this.$emit('showWXShareDialog')
    }
  }
}
</script>

<style lang="scss" scoped>
.swiper {
  width: 100%;
  height: 530rpx;
  image {
    width: 100%;
    height: 100%;
  }
}

.swiper-num {
  width: 80rpx;
  height: 40rpx;
  border-radius: 20rpx;
  line-height: 40rpx;
  text-align: center;
  font-size: 24rpx;
  color: #fff;
  background: #000;
  position: relative;
  top: -120rpx;
  left: calc(50% - 50rpx);
  opacity: 0.6;
}

.share {
  position: fixed !important;
  z-index: 9999;
  width: 170rpx;
  height: 60rpx;
  background: #1dc422;
  border-radius: 30rpx 0rpx 0rpx 30rpx;
  position: absolute;
  top: 80rpx;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  image {
    width: 40rpx;
    height: 40rpx;
  }
  text {
    font-size: 28rpx;
    font-weight: 500;
    color: #fff;
    margin-left: 10rpx;
  }
}
button {
  border-radius: 0rpx;
}

button::after {
  border: none;
}
</style>
