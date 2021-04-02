<template>
  <view>
    <view class="mask" @click="close"></view>
    <view class="container">
      <view class="title">分期测算</view>
      <view class="content">
        <text class="text-hd">分期（月）</text>
        <view class="cards" v-if="propsData.length!==0">
          <view
            class="card-item"
            v-for="(item, index) in propsData"
            :key="index"
            :class="index===activeIdx ? 'high-light-card-item' : ''"
            @click="selectStage(index)"
          >
            <text class="card-text-hd">¥{{item.pricePerStage}} X {{item.stageCount}}期</text>
            <text class="card-text">含综合费用平均¥{{item.charge}}/期</text>
          </view>
        </view>
				<view v-else style="margin-top: 40rpx;">暂无数据</view>
      </view>
      <view class="foot">本页面为估算金额，具体金额以订单结算为准</view>
      <view style="margin-bottom: 180rpx;"></view>
      <view class="bottom-btn" @click="close">确定</view>
    </view>
  </view>
</template>
<script>
export default {
  name: 'StagingService',
  props: {
    propsData: {
      type: Array,
      default() {
        return []
      }
    },
		index: {
			type: Number,
			default: 0
		}
  },
	data(){
		return {
			activeIdx: this.index
		}
	},
  methods: {
    close() {
      this.$emit('close')
    },
    selectStage(index) {
      this.activeIdx = index
      this.$emit('select', index)
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
  .title {
    height: 120rpx;
    line-height: 120rpx;
    font-size: 36rpx;
    text-align: center;
    margin: 0 10rpx;
    color: #333;
    border-bottom: 1rpx solid #f4f4f4;
  }
  .content {
    margin: 16rpx 40rpx;
    display: flex;
    flex-direction: column;
    text {
      font-size: 26rpx;
    }
    .text-hd {
      font-size: 30rpx;
      color: #333;
    }
    .cards {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      justify-content: space-between;
      .card-item {
        width: 300rpx;
        height: 130rpx;
        line-height: 65rpx;
        margin: 16rpx 0;
        color: #333;
        border-radius: 10rpx;
        border: 1rpx solid #f4f4f4;
        display: flex;
        flex-direction: column;
        text-align: center;
        .card-text {
          font-size: 18rpx;
        }
        .card-text-hd {
          font-size: 30rpx;
          font-weight: bold;
        }
      }
      .high-light-card-item {
        background: #f37b1d;
        color: white;
      }
    }
  }
  .foot {
    position: absolute;
    bottom: 100rpx;
    color: grey;
    text-align: center;
    font-size: 26rpx;
    width: 100%;
    height: 80rpx;
    line-height: 80rpx;
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