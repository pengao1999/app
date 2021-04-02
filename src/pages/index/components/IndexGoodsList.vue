<template>
  <view class="items">
    <view
      class="item item-saleout"
      v-for="(item, index) in lists"
      :key="item.id"
      :class="item.stock == 0 ? '' : 'fade-in'"
      :style="item.opacityCustom ? 'opacity:0.6' : ''"
      @click.stop="toProduct(item, activity_key, activity_endtime)"
    >
      <view class="sale-out" v-if="item.opacityCustom">{{
        item.opacityText
      }}</view>
      <image :src="image_root + item.pic" :lazy-load="true"></image>
      <text class="title">{{ item.name }}</text>
      <text
        v-if="item.subheading !== undefined && item.subheading !== null"
        class="desc"
        >{{ item.subheading }}</text
      >
      <view class="info">
        <text class="sales">销量：{{ item.sales_num }}</text>
        <text class="price">￥{{ item.price }}</text>
        <text
          v-if="item.unit !== undefined && item.unit !== null"
          class="goods_unit"
          >/{{ item.unit }}</text
        >
        <text class="cost-price">￥{{ item.original_price }}</text>
      </view>
      <view class="bottom">
        <view class="progress">
          <progress
            class="my-progress"
            border-radius="14"
            :percent="
              item.stock === 0
                ? 0
                : (item.stock / (item.sales_num + item.stock)) * 100
            "
            activeColor="#1dc422"
            active
            stroke-width="22"
          />
          <text
            :style="
              (item.stock / (item.sales_num + item.stock)) * 100 < 60
                ? 'color:black'
                : ''
            "
            >剩余{{ item.stock }}
          </text>
        </view>

        <view class="buy-container">
          <view
            class="buy"
            v-if="item.showCart"
            @tap.stop="tryBuy(item, index)"
            >{{ item.stock == 0 ? "已售罄" : "加入购物车" }}</view
          >
          <view class="add-reduce-container row-container fade-in" v-else>
            <image
              class="uni-icon uni-icon-minus-filled btn-container"
              :lazy-load="true"
              style="width:50upx;height:50upx;font-size: 24px;color:#aaaaaa"
              @tap.stop="reducePlat(item, index)"
            ></image>
            <view class="btn-container">{{ item.cart_num }}</view>
            <image
              class="uni-icon uni-icon-plus-filled btn-container"
              :lazy-load="true"
              style="width:50upx;height:50upx;font-size: 24px;color:#e84118"
              @tap.stop="addPlat(item, index)"
            ></image>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'IndexGoodsList',
  props: {
    lists: {
      type: Array,
      default() {
        return []
      }
    },
    image_root: {
      type: String,
      default: ''
    },
    activity_key: {
      type: String,
      default: ''
    },
    activity_endtime: {
      type: String,
      default: ''
    }
  },
  methods: {
    toProduct(item) {
      this.$emit('toProduct', item)
    },
    tryBuy(item, index) {
      this.$emit('tryBuy', item, index)
    },
    reducePlat(item, index) {
      this.$emit('reducePlat', item, index)
    },
    addPlat(item, index) {
      this.$emit('addPlat', item, index)
    }
  }
}
</script>

<style lang="scss" scoped>
.items {
  width: 100%;
  display: flex;
  flex-direction: column;
  .item {
    width: calc(100% - 48rpx);
    margin-left: 24rpx;
    margin-right: 24rpx;
    height: 220rpx;
    padding-top: 30rpx;
    padding-bottom: 30rpx;
    background: #fff;
    position: relative;
    border-bottom: solid 1rpx #eee;
    image {
      width: 220rpx;
      height: 220rpx;
      border-radius: 20rpx;
      float: left;
    }
    .title {
      width: calc(100% - 240rpx);
      height: 50rpx;
      line-height: 50rpx;
      font-size: 32rpx;
      color: #2f3640;
      margin-left: 20rpx;
      float: left;
      font-weight: bold;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .desc {
      width: calc(100% - 240rpx);
      height: 40rpx;
      line-height: 40rpx;
      font-size: 26rpx;
      color: #888;
      margin-left: 20rpx;
      font-weight: 400;
      float: left;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .tag {
      height: 26rpx;
      line-height: 26rpx;
      font-size: 18rpx;
      color: #ccc;
      margin-left: 20rpx;
      padding-left: 20rpx;
      padding-right: 20rpx;
      border: solid 1rpx #ccc;
      border-radius: 26rpx;
      float: left;
      margin-top: 10rpx;
    }
    .info {
      width: calc(100% - 240rpx);
      margin-left: 20rpx;
      margin-top: 10rpx;
      float: left;
      display: flex;
      align-items: baseline;
      .sales {
        font-size: 26rpx;
        color: #888;
      }
      .price {
        font-size: 36rpx;
        color: #e84118;
        font-weight: bold;
        margin-left: auto;
      }
      .sub-price {
        font-size: 18rpx;
        color: #e84118;
        font-weight: bold;
      }
      .cost-price {
        font-size: 18rpx;
        color: #888;
        text-decoration: line-through;
        margin-left: 20rpx;
      }
      .goods_unit {
        font-size: 18rpx;
        color: #888;
        margin-left: 10rpx;
      }
    }
    .bottom {
      width: calc(100% - 240rpx);
      position: absolute;
      right: 0rpx;
      bottom: 30rpx;
      display: flex;
      .progress {
        width: calc(100% - 220rpx);
        height: 50rpx;
        uni-progress {
          margin-top: 4rpx;
          width: 100%;
        }
        text {
          width: calc(100% - 220rpx);
          height: 50rpx;
          line-height: 50rpx;
          text-align: center;
          position: absolute;
          top: 0;
          left: 0;
          font-size: 24rpx;
          color: #fff;
        }
      }
    }
    .buy-container {
      margin-left: auto;
      width: 140rpx;
      height: 50rpx;
    }
    .buy {
      width: 140rpx;
      height: 50rpx;
      line-height: 50rpx;
      background: #e84118;
      border-radius: 25rpx;
      text-align: center;
      font-size: 20rpx;
      color: #fff;
      font-weight: 500;
    }
  }
  .item-saleout {
    stop-opacity: 0.7;
  }
}

uni-progress,
.uni-progress-bar,
.uni-progress-inner-bar {
  border-radius: 15px !important;
}

.sale-out {
  width: 150upx;
  height: 150upx;
  border-radius: 50%;
  color: white;
  background: black;
  opacity: 0.7;
  text-align: center;
  line-height: 150upx;
  position: absolute;
  margin-left: 35upx;
  margin-top: 35upx;
}
</style>