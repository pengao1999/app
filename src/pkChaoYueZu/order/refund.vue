<template>
	<view class="content">
		<view class="items" v-for="(item, index) in order.ordergoodses" :key="index">
		  <view class="item" @tap="detail(item.goods_id)">
			<image :src="image_root + item.pic" />
			<view class="center">
			  <text class="title">{{ item.goods_name }}</text>
			  <text
				class="tag"
				style="color: #666666;"
				v-if="item.attr_names"
			  >规格：{{ item.attr_names }}</text>
			</view>
			<view class="right">
			  <text class="tag">￥{{ item.amount }}</text>
			  <text class="tag" style="color: #999">x {{ item.num }}</text>
			</view>
		  </view>
		</view>
		<view style="background: rgba(248,248,248,1); height: 20rpx;width: 100%;"></view>
		<view class="row-wrap">
		  <view class="row-title">是否已经完成订单租金</view>
		  <picker
		    :range="finishOrderList"
		    :value="finishOrderIndex"
		    class="row-picker"
		    @change="handleFinishOrderChange"
		  >
		    <view>{{finishOrderList[finishOrderIndex]}}</view>
		  </picker>
		  <image src="/static/zulin/verify/icon-right.png" class="nav-icon" />
		</view>
		<view class="row-wrap">
		  <view class="row-title">退款方式</view>
		  <picker
		    :range="refundTypeList"
		    :value="refundTypeIndex"
		    class="row-picker"
		    @change="handleRefundTypeChange"
		  >
		    <view>{{refundTypeList[refundTypeIndex]}}</view>
		  </picker>
		  <image src="/static/zulin/verify/icon-right.png" class="nav-icon" />
		</view>
		<view class="row-wrap">
			<view class="row-title">押金金额</view>
			<view class="row-prize">{{order.amount-order.delivery_money}}</view>
		</view>
		
		<view class="buttons">
		  <view class="button">提交</view>
		</view>
	</view>
</template>

<script>
import Config from '../../common/js/Config.js'
import Util from '../../common/js/util.js'
import Timer from '../../common/js/timeCounter.js'
import Toast from '../../common/js/toast.js'
import Pay from '../../common/js/pay.js'
import Auth from '../auth'

import PayDialog from '../../components/yx_dialog/myPayDialog.vue'
import { mapMutations } from 'vuex'
export default {
  data() {
    return {
      id: '',
      surplusTime: '',
      order: {},
      productNum: 0,
      expectTime: '',
      nowTime: 0,
      image_root: '',
      timer: Object,
      finishOrder: '请选择',
      finishOrderList: ['请选择','是','否',],
      finishOrderIndex: 0,
	  refundType: '请选择',
	  refundTypeList: ['请选择','方式1','方式2',],
	  refundTypeIndex: 0,
    }
  },
  mixins: [Timer, Toast, Pay, Auth],
  components: {
    PayDialog,
  },
  computed: {
    userInfo() {
      return this.$store.state.userInfo
    },
    globalI() {
      return this.$store.state.globalI
    },
  },
  onLoad(options) {
    this.setUuid(Config.PLAT_UUID)
    this.nowTime = Date.parse(new Date()) / 1000
    console.log('nowTime', this.nowTime)
    if (options.key) {
      this.id = options.key
      this.getOrderDetail()
    }
  },
  methods: {
	  ...mapMutations(['setUuid']),
	  getOrderDetail: function () {
	    let self = this
	    let data = {
	      i: self.globalI,
	      order_key: self.id,
	    }
	    self.$Phttp.post(Config.JAVA_SAAS_URLS.orderDetail, data).then(res => {
	      res = res.data
	      if (res.code === 0) {
	        self.order = res.data
	        self.image_root = res.other.img_root
	        self.productNum = self.getProductNum(res.data.ordergoodses)
	      }
	    })
	  },
	  handleFinishOrderChange(e) {
	    this.FinishOrderIndex = e.target.value
	  },
	  handleRefundTypeChange(e) {
	    this.refundTypeIndex = e.target.value
	  },
  },
  onUnload() {
	this.clearTimer()
  },
}
</script>

<style lang="scss" scoped>
page {
  background:#fff;
}
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  background: #fff;
  .items {
    background: #FFFFFF;
    width: 100%;
    padding-top: 10rpx;
    padding-bottom: 10rpx;
    border-bottom: 1rpx solid #f4f4f4;
    .item {
      width: calc(100% - 40rpx);
      height: 130rpx;
      padding: 20rpx;
      position: relative;
      display: flex;
      flex-direction: row;
  	.center {
  	  flex: 1;
  	}
  	image {
  	  width: 130rpx;
  	  height: 130rpx;
  	  border-radius: 20rpx;
  	  float: left;
  	}
  	.title {
  	  width: 400rpx;
  	  font-size: 28rpx;
  	  color: #2f3640;
  	  margin-left: 30rpx;
  	  float: left;
  	  font-weight: 500;
  	  overflow: hidden;
  	  text-overflow: ellipsis;
  	  white-space: nowrap;
  	}
  	.tag {
  	  font-size: 22rpx;
  	  color: #333;
  	  font-weight: 500;
  	  margin-left: 30rpx;
  	  float: left;
  	  margin-top: 10rpx;
  	}
  	.right {
  	  display: flex;
  	  flex-direction: column;
  	  align-items: flex-end;
  	}
    } 
  }
  .row-wrap {
      display: flex;
      flex-direction: row;
      width: 100%;
      background: #fff;
      border-bottom: 1rpx solid #f4f4f4;
      color: #999;
      align-items: center;
      .row-title {
        width: 700rpx;
        font-size: 30rpx;
        color: #999;
        height: 96rpx;
        line-height: 96rpx;
        margin-left: 20rpx;
      }
      .row-select {
        font-size: 26rpx;
        margin-left: 20rpx;
        margin-bottom: 4rpx;
        border-bottom: 1rpx solid #f4f4f4;
        width: 500rpx;
        height: 50rpx;
        background: #fff;
        text-align: center;
      }
      .row-input {
        height: 96rpx;
        width: 100%;
        text-align: right;
        margin-right: 36rpx;
        font-size: 30rpx;
      }
	  .row-picker {
	    width: 100%;
	    height: 100%;
	    line-height: 96rpx;
	    text-align: right;
	    align-content: center;
	    margin-right: 20rpx;
	    font-size: 30rpx;
	  }
	  .nav-icon {
	    width: 32rpx;
	    height: 32rpx;
	    margin-right: 20rpx;
	  }
	  .row-prize {
		  margin-right: 30rpx;
		  font-size:32rpx;
		  font-family:DINMittelschriftStd;
		  color:rgba(22,119,255,1);
		  width:200rpx;
		  text-align: right;
	  }
	}
	
	.buttons {
	  width: 100%;
	  display: flex;
	  background:rgba(255,255,255,1);
	  position: fixed;
	  left: 0;
	  bottom: 0;
	  justify-content: center;
	  padding-bottom: 0;
	  padding-bottom: constant(safe-area-inset-bottom);
	  padding-bottom: env(safe-area-inset-bottom);
	}
	
	.buttons .button {
	  width:622rpx;
	  height:84rpx;
	  line-height: 80rpx;
	  text-align: center;
	  background:linear-gradient(180deg,rgba(82,171,252,1) 0%,rgba(6,135,255,1) 100%);
	  border-radius:44rpx;
	  font-size:30rpx;
	  font-family:PingFangSC-Medium,PingFang SC;
	  font-weight:500;
	  color:rgba(255,255,255,1);
	}
}
</style>
