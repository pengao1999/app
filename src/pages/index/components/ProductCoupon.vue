<template>
  <view
    class="uni-list-cell uni-list-cell-last"
    style="margin-top: 20rpx;background:white"
    hover-class="uni-list-cell-hover"
    @tap.stop="getCoupons"
    :style="{background: customFormat.background, marginTop: customFormat.marginTop, marginBottom: customFormat.marginBottom, marginLeft: customFormat.marginLeft, marginRight: customFormat.marginRight}"
  >
    <view class="uni-list-cell-navigate uni-navigate-right">
      领券
      <uni-badge :text="couponLength.toString()" type="danger"></uni-badge>
    </view>
  </view>
</template>

<script>
import uniBadge from "../../../components/uni-badge.vue"

export default {
  name: 'ProductCoupon',
  components: { uniBadge },
  props: {
    couponLength: {
      type: Number,
      default: 0
    },
    customFormat: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  methods: {
    getCoupons() {
      this.$emit('clickCounpons')
    }
  }
}
</script>

<style lang="scss" scoped>
</style>