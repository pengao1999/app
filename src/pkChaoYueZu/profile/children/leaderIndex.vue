<template>
  <div class="main-page">
	  <div class="user-info">
		  <div class="row-container align-center" style="height: 100%;">
			  <image
			    class="bg-white avatar"
				:src="userInfo.avatarUrl"
			  />
			  <view class="coloum-container text-white" style="margin-left: 30upx;">
				  <view style="font-size: 36upx;">{{userInfo.name?userInfo.name:hideTel}}</view>
				  <view style="font-size: 26upx;">推荐人：邓超-超悦租</view>
			  </view>
		  </div>
	  </div>


		  <view class="row-container bg-white mrg-top-20 align-center" style="height: 110upx;">
			  <image style="margin-left: 30upx;width: 40upx;height: 40upx;" src="/static/chaoyuezu/profile/invite.png"></image>
			  <view class="text-white" style="margin-left: 20upx;color: #222;font-size: 30upx;">我的邀请码：2212</view>
		  </view>
	  <view class="bg-white mrg-top-20">
		  <view class="mrg-top-20 flex-container align-center" style="height: 162upx;width: 100%;">
			  <view class="coloum-container" style="margin-left: 30upx;">
				  <view class="text-blue" style="font-size: 40upx;">0.00</view>
				  <view style="color: #999;font-size: 26upx;">成功提现佣金（元）</view>
			  </view>
		  </view>
		  <view style="width: 720upx;margin-left: 30upx;height: 1px;background-color: #F8F8F8;"></view>
		  <view class="bg-white row-container align-center" style="height: 162upx;width: 100%;">
			  <view class="coloum-container" style="margin-left: 30upx;">
				  <view class="text-blue" style="font-size: 40upx;">{{balance.toFixed(2)}}</view>
				  <view style="color: #999;font-size: 26upx;">可提现佣金（元）</view>
			  </view>
			  <button class="bg-gradual-blue round" style="margin-left:auto;margin-right:30upx;font-size: 24upx;" @click="getCash">佣金提现</button>
		  </view>
	  </view>

	  <view class="bg-white mrg-top-20 block-container">
		  <view class="row-container align-center" style="border-right: 2upx solid #F0F0F0;width: 374upx;height: 160upx;">
			  <image style="margin-left: 30upx;width: 60upx;height: 60upx;" src="/static/chaoyuezu/profile/money.png"></image>
			  <view class="coloum-container" style="margin-left: 20upx;">
				  <view style="color: #222;font-size: 30upx;">0.00</view>
				  <view style="color: #999;font-size: 26upx;">分销佣金</view>
			  </view>
		  </view>
		  <view class="row-container align-center" style="width: 374upx;height: 160upx;" @click="toBill(1)">
		  			  <image style="margin-left: 30upx;width: 60upx;height: 60upx;" src="/static/chaoyuezu/profile/order.png"></image>
		  			  <view class="coloum-container" style="margin-left: 20upx;">
		  				  <view style="color: #222;font-size: 30upx;">0笔</view>
		  				  <view style="color: #999;font-size: 26upx;">分销订单</view>
		  			  </view>
		  </view>
		  <view class="row-container align-center" style="border-right: 2upx solid #F0F0F0;width: 374upx;height: 160upx;border-top: 2upx solid #F0F0F0;">
		  			  <image style="margin-left: 30upx;width: 60upx;height: 60upx;" src="/static/chaoyuezu/profile/package.png"></image>
		  			  <view class="coloum-container" style="margin-left: 20upx;">
		  				  <view style="color: #222;font-size: 30upx;">0笔</view>
		  				  <view style="color: #999;font-size: 26upx;">提现明细</view>
		  			  </view>
		  </view>
		  <view class="row-container align-center" style="width: 374upx;height: 160upx;border-top: 2upx solid #F0F0F0;" @click="toBill(0)">
		  			  <image style="margin-left: 30upx;width: 60upx;height: 60upx;" src="/static/chaoyuezu/profile/vip.png"></image>
		  			  <view class="coloum-container" style="margin-left: 20upx;">
		  				  <view style="color: #222;font-size: 30upx;">{{vipTotal}}人</view>
		  				  <view style="color: #999;font-size: 26upx;">我的会员</view>
		  			  </view>
		  </view>
	  </view>

    <view class="cu-list menu margin-top sm-border mrg-top-30">
      <view class="cu-item arrow" style="height: 110upx;">
        <view class="content row-container" @click="toBankCards">
          <img class="item-icon" src="/static/zulin/profile/jingjiren/bank.png" />
          <div style="color: #222222;height: 60upx;line-height: 60upx;margin-left: 20upx;">银行卡</div>
        </view>
      </view>
     <!-- <view class="cu-item arrow mrg-top-20" style="height: 110upx;" @click="toShare()">
        <view class="content row-container">
          <img class="item-icon" src="/static/zulin/profile/jingjiren/qrcode.png" />
          <div style="color: #222222;height: 60upx;line-height: 60upx;margin-left: 20upx;">分享二维码</div>
        </view>
      </view> -->
      <view class="cu-item arrow mrg-top-20" style="height: 110upx;" @click="toInvite()">
        <view class="content row-container">
          <img class="item-icon" src="/static/zulin/profile/jingjiren/gift.png" />
          <div style="color: #222222;height: 60upx;line-height: 60upx;margin-left: 20upx;">邀请好友</div>
        </view>
      </view>
    </view>
  </div>
</template>

<script>
import myShareDialog from '../myShareDialog.js'
import Config from '../../../common/js/Config.js'
export default {
  data() {
    return {
      hideTel: '',
	  billStatis: {
	    today_brokerage: 0,
	    this_month_brokerage: 0,
	    today_order_count: 0,
	    this_month_order_count: 0
	  },
	  historys: [],
	  hPageConf: {
	    page: 1,
	    size: 20,
	  },
	  sPageConf: {
	    page: 1,
	    size: 20
	  },
	  balance: 0,
	  vipTotal: 0
    }
  },
  mixins: [myShareDialog],
  computed: {
    userInfo() {
      return this.$store.state.userInfo
    }
  },
  onLoad() {
    this.hideTel = this.changeStr(this.userInfo.tel, 4, "****")
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
		   self.vipTotal = res.data.total
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
	getCash() {
	  uni.navigateTo({
	    url: '/pkChaoYueZu/profile/children/getCash?balance=' + this.balance
	  })
	},
    toBill(index) {
      uni.navigateTo({
        url: '/pkChaoYueZu/profile/children/leaderBill?tab='+index
      })
    },
    toBankCards() {
      uni.navigateTo({
        url: '/pkChaoYueZu/profile/children/bankCards'
      })
    },
    toShare() {
      // const url = 'http://fintech.test.appkubes.com/#/pages/register/index?invitorKey=' + this.userInfo.user_key
      const url = Config.FINTECH_SERVER + '/#/pages/register/index?invitorKey=' + this.userInfo.user_key
      const encodedUrl = encodeURIComponent(url)
      uni.navigateTo({
        url: '/pkChaoYueZu/profile/children/share?url=' + encodedUrl
      })
    },
    toInvite() {
      // const url = 'http://fintech.test.appkubes.com/#/pages/register/index?invitorKey=' + this.userInfo.user_key,
      const url = Config.FINTECH_SERVER + '/#/pages/register/index?invitorKey=' + this.userInfo.user_key,
			title = '超悦租',
			summary = '选超悦租，比买更实在。租的优惠，一步到位',
			imageUrl = Config.BASE_IMAGE_SERVER + 'attachment/images/avatars/logo.png';
      this.clickShare()
      this.setShareMessage(url, title, summary, imageUrl)
    },
    changeStr(str, index, changeStr) {
      return str.substr(0, index) + changeStr + str.substr(index + changeStr.length);
    },
    toIntr() {
      uni.navigateTo({
        url: "/pkUserInfo/info/protocolDetails?id=1a4db6ef00ae4b189ffc40805d8b9a9f&title=产品介绍"
      })
    }
  }
}
</script>

<style scoped>
page {
  background: #f8f8f8;
}
.user-info {
	width:100%;
	height:216upx;
	background:linear-gradient(180deg,rgba(82,171,252,1) 0%,rgba(6,135,255,1) 100%);
}
.Card-40 {
  border-radius: 40upx;
}
.info-card {
  width: 670upx;
  height: 372upx;
}
.fix-top {
  position: absolute;
  margin-top: -382upx;
  margin-left: 0upx;
}
.avatar {
  width: 100upx;
  height: 100upx;
  -webkit-border-radius: 100upx;
  -moz-border-radius: 100upx;
  border-radius: 100upx;
  background:linear-gradient(180deg,rgba(82,171,252,1) 0%,rgba(6,135,255,1) 100%);
  border: 6upx solid white;
  margin-left: 30upx;
}
.avatar1 {
  z-index: 11;
  margin-top: -90upx;
  width: 80upx;
  height: 80upx;
  -webkit-border-radius: 80upx;
  -moz-border-radius: 80upx;
  border-radius: 80upx;
}
.item-icon {
  width: 50upx;
  height: 50upx;
}
</style>
