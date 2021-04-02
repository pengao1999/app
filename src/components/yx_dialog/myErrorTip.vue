<!--ErrorTip-page-->
<template>
  <view class="ErrorTip-page">
    <view class="tip" :class="myData.anim||'slide-down'" v-if="myData.show">{{myData.desc}}</view>
  </view>
</template>
<script>
  export default {
    config: {},
    props: {
      propData: {
				type: Object,
				default() {
					return {}
				}
			}
    },
    components: {},
    data() {
      return {
		  myData: {},
		  timeOut: null
	  }
    },
    watch: {
      propData: {
        handler(newv, oldv) {
          let that = this
          this.myData = Object.assign({}, this.propData)
          if (that.timeOut !== null) {
            clearTimeout(that.timeOut)
          }
          let time = that.myData.time || 3000
          that.timeOut = setTimeout(function () {
            clearTimeout(that.timeOut)
            that.myData.show = false
            !that.myData.show && that.$emit('hide', Object.assign({}, that.myData))
          }, time)
        },
        immediate: true
      }
    },
    methods: {}
  }
</script>
<style>
  @import "../../common/css/animation";
  .tip {
    position: fixed;
    z-index: 999;
    width: 100%;
    height: 88upx;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    background: #F24D4D;
    left: 0upx;
    font-size: 28upx;
  }
</style>
