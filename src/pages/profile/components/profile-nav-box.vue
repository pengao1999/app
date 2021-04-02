<template>
  <view class="nav-box" :style="{background: customStyle.background, color: customStyle.color, borderRadius: customStyle.borderRadius, marginLeft: customStyle.marginLeft, marginRight: customStyle.marginRight, marginTop: customStyle.marginTop, marginBottom: customStyle.marginBottom}">
    <nav-list :propData="navList" @navClick.stop="navClick"></nav-list>
  </view>
</template>

<script>
import NavList from "@/components/yx_view/navList.vue";

export default {
  props: {
    navList: {
      type: Array,
      default() {
        return [];
      }
    },
    customStyle: {
      type: Object,
      default(){
        return {}
      }
    }
  },
  components: {
    NavList
  },
  methods: {
    navClick(tap) {
      this.$emit("navClick", tap);
    }
  }
};
</script>

<style lang="scss">
// $bg-color: #fff;

.nav-box {
  // margin-top: 20rpx;
  // margin-left: 30rpx;
  // margin-right: 30rpx;
  // background: $bg-color;
  // border-radius: 20rpx;
  width: calc(100% - 60rpx);
  display: flex;
  flex-direction: column;
  box-shadow: 0px 10px 20px 0px rgba(0, 0, 0, 0.02);
  z-index: 1000;
}
</style>
