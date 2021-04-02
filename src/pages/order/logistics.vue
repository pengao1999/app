<template>
  <view class="container">
    <view class="tui-order-header">
      <view class="tui-text"
        >订单编号：
        <text class="tui-bold">{{ order_no }}</text>
      </view>
      <view class="tui-text">国内承运人：{{ company_name }}</view>
      <view class="tui-text">预计送达： {{ delivery_time }}</view>
    </view>
    <view class="tui-order-tracking">
      <view v-if="traces && traces.length === 0">暂无物流信息</view>
      <tui-time-axis v-if="traces && traces.length > 0">
        <tui-timeaxis-item bgcolor="none" v-for="(dot, dIndex) in traces" :key="`dot${dIndex}`">
          <template v-slot:node>
            <!-- <view class="tui-node tui-bg-primary">
							<tui-icon name="check" color="#fff" :size="14" :bold="true"></tui-icon>
						</view> -->
            <view class="tui-node">
              <tui-icon name="transport" color="#fff" :size="13"></tui-icon>
            </view>
          </template>

          <template v-slot:content>
            <view>
              <view class="tui-order-title">{{ dot.AcceptStation }}</view>
              <view class="tui-order-desc">{{ dot.AcceptTime }}</view>
              <!-- <view class="tui-order-time tui-gray">{{dot.AcceptTime}}</view> -->
            </view>
          </template>
        </tui-timeaxis-item>
      </tui-time-axis>
    </view>
  </view>
</template>

<script>
import Config from '@/common/js/Config.js'

import tuiIcon from '@/components/icon/icon'
import tuiTimeAxis from '@/components/time-axis/time-axis'
import tuiTimeaxisItem from '@/components/timeaxis-item/timeaxis-item'

Date.prototype.Format = function(fmt) {
  var o = {
    'M+': this.getMonth() + 1, //月份
    'd+': this.getDate(), //日
    'H+': this.getHours(), //小时
    'm+': this.getMinutes(), //分
    's+': this.getSeconds(), //秒
    'q+': Math.floor((this.getMonth() + 3) / 3), //季度
    S: this.getMilliseconds(), //毫秒
  }
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length))
  for (var k in o) if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length))
  return fmt
}
export default {
  components: {
    tuiIcon,
    tuiTimeAxis,
    tuiTimeaxisItem,
  },
  data() {
    return {
      traces: [],
      company_name: '',
      order_no: '',
      delivery_time: '',
    }
  },
  onLoad(options) {
    this.getKdTraces(options.order_no)
  },
  methods: {
    getKdTraces(order_no) {
      let self = this
      self.$Phttp.post(Config.JAVA_SAAS_URLS.getKdTraces, {order_no: order_no}).then(res => {
        res = res.data
        if (res.code === 0) {
          for (var i = res.data.traces.length - 1; i >= 0; i--) {
            self.traces.push(res.data.traces[i])
          }
          self.company_name = res.data.company_name
          self.order_no = res.data.order_no
          self.delivery_time = new Date(res.data.delivery_time).Format('yyyy-MM-dd HH:mm:ss')
        }
      })
    },
  },
}
</script>

<style>
.tui-order-header {
  padding: 30upx;
  box-sizing: border-box;
  background: #fff;
}

.tui-text {
  font-size: 28upx;
  color: #333;
  padding: 4upx;
}

.tui-bold {
  font-weight: bold;
}

.tui-node {
  background: #ddd;
  height: 44upx;
  width: 44upx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  padding-top: 0;
}

.tui-node-small {
  height: 16upx !important;
  width: 16upx !important;
}

.tui-bg-primary {
  background: #5677fc !important;
}

.tui-order-tracking {
  padding: 30upx 30upx 30upx 40upx;
  background: #fff;
  margin-top: 20upx;
  box-sizing: border-box;
}

.tui-order-title {
  color: #333;
  font-weight: bold;
  font-size: 32upx;
  font-family: 'microsoft yahei';
}

.tui-order-desc {
  font-size: 28upx;
  color: #333;
  padding: 12upx 0;
}

.tui-ptop {
  display: flex;
  justify-content: flex-start;
  line-height: 28upx;
}

.tui-order-time {
  font-size: 24upx;
  font-weight: bold;
}

.tui-gray {
  color: #848484 !important;
}

.tui-light-gray {
  color: #888 !important;
}

.tui-primary {
  color: #5677fc;
}
</style>
