<template>
  <swiper
    class="swiper"
    indicator-dots
    autoplay
    :interval="5000"
    :duration="1000"
    :circular="true"
    :style="{
      height: customFormat.height,
      marginTop: customFormat.marginTop,
      marginBottom: customFormat.marginBottom
    }"
    @change="changeSwiperImg"
  >
    <swiper-item
      v-for="(item, index) in banners"
      :key="index"
      @tap.stop="bannerTap(item)"
    >
      <image mode="aspectFill" :lazy-load="true" :src="item.pic" />
    </swiper-item>
  </swiper>
</template>

<script>
export default {
  name: 'IndexSwiper',
  props: {
    banners: {
      type: Array,
      default() {
        return []
      }
    },
    customFormat: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  methods: {
    changeSwiperImg(e) {
      this.$emit('changeImg', e)
    },
    bannerTap(banner) {
      this.$emit('bannerTap', banner)
    }
  }
}
</script>

<style lang="scss" scoped>
.swiper {
  width: 100%;
  height: 320rpx;
  image {
    width: 100%;
    height: 100%;
  }
}
</style>