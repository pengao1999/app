<template>
  <div class="main-page" style="background:#F0F0F0;">
    <scroll-view scroll-x class="bg-white nav">
      <view class="flex text-center">
        <view
          class="cu-item flex-sub"
          :class="index==TabCur?'text-blue cur':''"
          v-for="(item,index) in tabs"
          :key="index"
          @tap="tabSelect"
          :data-id="index"
        >{{item}}</view>
      </view>
    </scroll-view>
    <div class="coloum-container bg-white" v-if="TabCur==0">
      <div
        class="row-container"
        style="width: 96%;height: 80upx;margin-left: 2%;border-bottom: 1px solid #F0F0F0;"
      >
        <div
          class="text-black justify-center align-center"
          style="width: 25%;font-size: 32upx;font-weight: bold;display:flex;"
        >头像</div>
        <div
          class="text-black justify-center align-center"
          style="width: 25%;font-size: 32upx;font-weight: bold;display:flex;"
        >昵称</div>
        <div
          class="text-black justify-center align-center"
          style="width: 25%;font-size: 32upx;font-weight: bold;display:flex;"
        >电话号码</div>
        <div
          class="text-black justify-center align-center"
          style="width: 25%;font-size: 32upx;font-weight: bold;display:flex;"
        >创建时间</div>
      </div>

      <div style="width: 100%;text-align: center;margin-top: 30upx;" v-if="users.length==0">暂无数据</div>

      <div
        class="row-container"
        v-for="(item, index) in users"
        :key="index"
        style="width: 96%;height: 80upx;margin-left: 2%;border-bottom: 1px solid #F0F0F0;"
      >
        <div
          class="justify-center align-center"
          style="width: 25%;font-size: 28upx;display:flex;color: #666666;"
        >
          <image
            class="round"
            style="width: 60upx;height: 60upx;"
            :src="item.img?item.img:'/static/zulin/profile/manager.png'"
          />
        </div>
        <div
          class="justify-center align-center"
          style="width: 25%;font-size: 28upx;display:flex;color: #666666;"
        >{{item.name?item.name: "未设置"}}</div>
        <div
          class="justify-center align-center"
          style="width: 25%;font-size: 28upx;display:flex;color: #666666;"
        >{{item.tel}}</div>
        <div
          class="justify-center align-center one-line-dot"
          style="width: 25%;font-size: 28upx;display:flex;color: #666666;"
        >{{item.create_time}}</div>
      </div>
    </div>

    <view class="balance" style="margin-top: 30upx;" v-if="TabCur==1">
      <view class="profit">
        <view class="profit-v">
          <text class="profit-t profit-z">余额</text>
          <text class="profit-t profit-s">￥{{balance.toFixed(2)}}</text>
        </view>
        <view class="profit-v">
          <text class="settlement">每月25号可提现上月结算收益</text>
        </view>
      </view>
      <view class="cash bg-gradual-blue" @tap="getCash">立即提现</view>
    </view>

    <div class="statis-container bg-white row-container" v-if="TabCur==1">
      <div class="statis-card coloum-container justify-center align-center">
        <div style="color: #999999;font-size: 24upx;">今日佣金</div>
        <div class="text-blue" style="margin-top: 5upx;font-size: 40upx;">
          {{billStatis.today_brokerage.toFixed(2)}}
          <span
            style="font-size: 24upx;margin-left: 10upx;"
          >元</span>
        </div>
        <div style="margin-top: 5upx;">
          <span style="color: #999999;font-size: 24upx;">本月佣金</span>
          <span style="margin-left: 10upx;">{{billStatis.this_month_brokerage.toFixed(2)}}</span>
        </div>
      </div>
      <div style="width: 2upx;height: 210upx;background: #F0F0F0;"></div>
      <div class="statis-card coloum-container justify-center align-center">
        <div style="color: #999999;font-size: 24upx;">今日成交</div>
        <div class="text-blue" style="margin-top: 5upx;font-size: 40upx;">
          {{billStatis.today_order_count}}
          <span style="font-size: 24upx;margin-left: 10upx;">笔</span>
        </div>
        <div style="margin-top: 5upx;">
          <span style="color: #999999;font-size: 24upx;">本月成交</span>
          <span style="margin-left: 10upx;">{{billStatis.this_month_order_count}}</span>
        </div>
      </div>
    </div>
    <div class="coloum-container bg-white mrg-top-10" style="width: 100%;" v-if="TabCur==1">
      <div
        class="row-container"
        style="width: 96%;height: 80upx;margin-left: 2%;border-bottom: 1px solid #F0F0F0;"
      >
        <div
          class="text-black justify-center align-center"
          style="width: 25%;font-size: 32upx;font-weight: bold;display:flex;"
        >手机</div>
        <div
          class="text-black justify-center align-center"
          style="width: 25%;font-size: 32upx;font-weight: bold;display:flex;"
        >佣金</div>
        <div
          class="text-black justify-center align-center"
          style="width: 25%;font-size: 32upx;font-weight: bold;display:flex;"
        >租赁时间</div>
        <div
          class="text-black justify-center align-center"
          style="width: 25%;font-size: 32upx;font-weight: bold;display:flex;"
        >状态</div>
      </div>

      <div style="width: 100%;text-align: center;margin-top: 30upx;" v-if="historys.length==0">暂无数据</div>

      <div
        class="row-container"
        v-for="(item, index) in historys"
        :key="index"
        style="width: 96%;height: 80upx;margin-left: 2%;border-bottom: 1px solid #F0F0F0;"
      >
        <div
          class="justify-center align-center"
          style="width: 25%;font-size: 28upx;display:flex;color: #666666;"
        >{{item.tel}}</div>
        <div
          class="justify-center align-center"
          style="width: 25%;font-size: 28upx;display:flex;color: #666666;"
        >{{item.brokerage.toFixed(2)}}</div>
        <div
          class="justify-center align-center"
          style="width: 25%;font-size: 28upx;display:flex;color: #666666;"
            >{{item.create_time_str}}</div>
          <div class="justify-center align-center" style="width: 25%;font-size: 28upx;display:flex;color: #666666;" :style="{color: item.state=='unSettlement'?'var(--red)':'#666666'}">
              {{item.state=='unSettlement'?'未结':'已结'}}
          </div>
      </div>
    </div>
  </div>
</template>

<script>
import Config from '../../../common/js/Config'
import Util from '../../../common/js/util.js'
import Toast from '../../../common/js/toast'
export default {
  name: "leaderBill",
  data() {
    return {
      billStatis: {
        today_brokerage: 0,
        this_month_brokerage: 0,
        today_order_count: 0,
        this_month_order_count: 0
      },
      historys: [],
      TabCur: 0,
      scrollLeft: 0,
      tabs: [
        '我的推荐',
        '我的佣金'
      ],
      hPageConf: {
        page: 1,
        size: 20,
      },
      sPageConf: {
        page: 1,
        size: 20
      },
      users: [],
      balance: 0,
    }
  },
  mixins: [Toast],
  computed: {
    userInfo() {
      return this.$store.state.userInfo
    }
  },
  onLoad(options) {
	  this.TabCur = parseInt(options.tab)
    this.getTodayStatis()
    this.getLeaderHistory()
    this.getHierarchy()
  },
  onShow() {
    this.getBrokerage()
  },
  methods: {
    getBrokerage() {
      let self = this
      const params = {
        appKey: 123,
        userKey: self.userInfo.user_key
      }
      self.$Phttp.get(Config.JAVA_SAAS_URLS.getBrokerage, params).then(res => {
        res = res.data
        if (res.code === 0) {
          self.balance = res.data.total_brokerage
        }
      })
    },
    getHierarchy() {
      let self = this
      self.hPageConf.userKey = self.userInfo.user_key
      self.$Phttp.get(Config.JAVA_SAAS_URLS.getHierarchy, self.hPageConf).then(res => {
        res = res.data
        if (res.code === 0) {
          res.data.records.forEach((user, index) => {
            user.tel = self.changeStr(user.tel, 4, "****")
            user.create_time = user.create_time
            self.users.push(user)
          })
          self.hPageInfo.page++
        }
      })
    },
    getTodayStatis() {
      let self = this

      let postData = {
        userKey: self.userInfo.user_key,
        appKey: "123"
      }
      self.toast({
        type: 'loading'
      })
      self.$Phttp.get(Config.JAVA_SAAS_URLS.getTodayStatis, postData).then(res => {
        res = res.data
        self.toast(true)
        if (res.code === 0) {
          self.billStatis = Object.assign(self.billStatis, res.data)
        }
      })
    },
    getLeaderHistory() {
      let self = this

      let postData = {
        appKey: "123",
        page: 1,
        size: 20,
        userKey: self.userInfo.user_key
      }

      self.$Phttp.get(Config.JAVA_SAAS_URLS.getLeaderHistory, postData).then(res => {
        res = res.data
        if (res.code === 0) {
          res.data.list.forEach((item, index) => {
            item.tel = self.changeStr(item.tel, 4, "****")
            item.create_time = Util.formaeDateStr(item.create_time)
          })
          self.historys = res.data.list
        }
      })
    },
    changeStr(str, index, changeStr) {
      return str.substr(0, index) + changeStr + str.substr(index + changeStr.length);
    },
    tabSelect(e) {
      this.TabCur = e.currentTarget.dataset.id;
      this.scrollLeft = (e.currentTarget.dataset.id - 1) * 60
    },
    getCash() {
      uni.navigateTo({
        url: '/pkChaoYueZu/profile/children/getCash?balance=' + this.balance
      })
    }
  }
}
</script>

<style scoped lang="scss">
page {
  background: #f0f0f0;
}
.statis-container {
  width: 100%;
  .statis-card {
    width: 374upx;
    height: 210upx;
    border-top: 1px solid #f0f0f0;
  }
}
//余额view
.balance {
  display: flex;
  flex-direction: row;
  margin-left: 5%;
  width: 90%;
  height: 120upx;
  //   background: linear-gradient(0deg, rgba(66, 66, 66, 1), rgba(21, 21, 21, 1));
  background: var(--blueLight);
  border-radius: 20upx 20upx 0upx 0upx;
  .profit {
    display: flex;
    flex-direction: column;
    margin-left: 40upx;
    margin-top: 10upx;
    .profit-v {
      align-items: baseline;
      flex-direction: row;
      display: flex;
      .profit-t {
        font-size: 28upx;
        font-family: PingFang-SC-Medium;
        font-weight: 500;
        color: #1677FF;
      }
      .profit-z {
        // width: 49upx;
        height: 23upx;
      }

      .profit-s {
        margin-left: 48upx;
        //      width:73upx;
        height: 19upx;
      }
      .settlement {
        margin-top: 15upx;
        // width:275upx;
        // height:17upx;
        font-size: 20upx;
        font-family: PingFang-SC-Regular;
        font-weight: 400;
        color: #555;
      }
    }
  }
  //立即提现
  .cash {
    line-height: 60upx;
    font-size: 26upx;
    font-family: PingFang-SC-Medium;
    font-weight: 500;
    text-align: center;
    margin-left: auto;
    margin-right: 40upx;
    margin-top: 25upx;
    width: 200upx;
    height: 60upx;
    // color: rgba(0, 0, 0, 1);
    // background: rgba(199, 184, 123, 1);
    border-radius: 30upx;
  }
}
</style>
