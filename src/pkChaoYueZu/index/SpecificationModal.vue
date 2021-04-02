<template>
  <view>
    <view class="mask" @click="close"></view>
    <view class="container">
      <view class="head">
        <image :src="pic" />
        <text>¥{{goods.price}}</text>
      </view>
      <view class="content">
        <view class="content-row" v-for="(specification, specIndex) in specifications" :key="specIndex">
          <view class="title">{{specification.name}}</view>
          <view class="cards">
            <view
              class="card"
              v-for="(item, attrIndex) in specification.attrs"
              :key="attrIndex"
              :class="attrIndex===specificIndexs[specIndex]?'card-high-light':''"
              @click="selectSpecific(specIndex, attrIndex)"
            >{{item.name}}</view>
          </view>
        </view>
      </view>
      <view class="bottom-btn" @click="close">确定</view>
    </view>
  </view>
</template>
<script>
export default {
  name: 'SpecificationModal',
  props: {
    specifications: {
      type: Array,
      default() {
        return [{
          name: 'size',
          attrs: ['128G', '256G', '512G']
        },{
          name: 'color',
          attrs: ['black', 'white']
        }]
      }
    },
		index: {
			type: Array,
			default() {
        return []
      }
		},
    pic: {
      type: String,
      default: ''
    },
    goods: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  watch: {
    index: {
      handler(){
        this.specificIndexs = this.index
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    close() {
      this.$emit('close')
    },
    selectSpecific(specIndex, attrIndex){
        this.specificIndexs[specIndex] = attrIndex
        console.log('index',this.specificIndexs)
        this.$emit('selectSpecific', this.specificIndexs)
    }
  }
}
</script>
<style lang="scss" scoped>
.mask {
  position: fixed;
  top: 0;
  z-index: 100;
  width: 100%;
  height: 100vh;
  left: 0;
  background: black;
  overflow: hidden;
  opacity: 0.3;
}
.container {
  width: 100%;
  min-height: 700rpx;
  overflow: hidden;
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 10001;
  background: #fff;
  border-top-left-radius: 20rpx;
  border-top-right-radius: 20rpx;
  .head {
    width: 100%;
    height: 200rpx;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    margin: 20rpx;
    border-bottom: 1rpx solid #f4f4f4;
    image {
      margin: 10rpx;
      height: 150rpx;
      width: 150rpx;
    }
    text {
      font-size: 50rpx;
      font-weight: bold;
      color: #f37b1d;
      margin-left: 50rpx;
    }
  }
  .content {
    margin: 16rpx 40rpx;
    display: flex;
    flex-direction: column;
    .content-row {
      margin: 30rpx 20rpx;
      .title {
      }
      .cards {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        flex-wrap: wrap;
        .card {
          height: 50rpx;
          line-height: 50rpx;
          width: 180rpx;
          border: 1rpx solid #333;
          border-radius: 10rpx;
          background: #fff;
          color: #333;
          text-align: center;
          margin: 10rpx 20rpx;
        }
        .card-high-light {
          background: #f37b1d;
          color: #fff;
          border: none;
        }
      }
    }
  }
  .bottom-btn {
    height: 100rpx;
    width: 100%;
    line-height: 100rpx;
    background: #f37b1d;
    color: #fff;
    font-size: 28rpx;
    position: absolute;
    bottom: 0;
    text-align: center;
  }
}
</style>