<template>
  <div class="main-page bg-white">
    <div class="Card-40 info-card" style="margin-left: 40upx;margin-top: 55upx;">
      <img class="info-card lf" src="/static/zulin/profile/jingjiren-card.png" />
      <div class="fix-top info-card Card-40 justify-center align-center coloum-container">
        <image
          class="bg-white avatar"
          style="margin-top: -40upx;"
          src="/static/zulin/profile/avatar-round.png"
        />
        <img class="avatar1" :src="userInfo.avatarUrl" />
        <div class="mrg-top-10 text-white" style="font-size: 40upx;">{{hideTel}}</div>
      </div>
    </div>

    <view class="cu-list menu margin-top sm-border mrg-top-30">
      <view class="cu-item arrow" @click="toBill">
        <view class="content row-container">
          <img class="item-icon" src="/static/zulin/profile/jingjiren/money.png" />
          <div style="color: #222222;height: 60upx;line-height: 60upx;margin-left: 20upx;">我的佣金</div>
        </view>
      </view>
      <view class="cu-item arrow">
        <view class="content row-container" @click="toBankCards">
          <img class="item-icon" src="/static/zulin/profile/jingjiren/bank.png" />
          <div style="color: #222222;height: 60upx;line-height: 60upx;margin-left: 20upx;">银行卡</div>
        </view>
      </view>
      <view class="cu-item arrow" @click="toShare()">
        <view class="content row-container">
          <img class="item-icon" src="/static/zulin/profile/jingjiren/qrcode.png" />
          <div style="color: #222222;height: 60upx;line-height: 60upx;margin-left: 20upx;">分享二维码</div>
        </view>
      </view>
      <view class="cu-item arrow" @click="toInvite()">
        <view class="content row-container">
          <img class="item-icon" src="/static/zulin/profile/jingjiren/gift.png" />
          <div style="color: #222222;height: 60upx;line-height: 60upx;margin-left: 20upx;">邀请好友</div>
        </view>
      </view>
      <view class="cu-item arrow" @click="toIntr()">
        <view class="content row-container">
          <img class="item-icon" src="/static/zulin/profile/jingjiren/intr	.png" />
          <div style="color: #222222;height: 60upx;line-height: 60upx;margin-left: 20upx;">产品介绍</div>
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
      hideTel: ''
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
  },
  methods: {
    toBill() {
      uni.navigateTo({
        url: '/pkChaoYueZu/profile/children/leaderBill'
      })
    },
    toBankCards() {
      uni.navigateTo({
        url: '/pkChaoYueZu/profile/children/bankCards'
      })
    },
    // toShare() {
    // 	uni.setStorageSync("dialogData", {
    // 		title: '扫一扫体验超悦租',
    // 		titleStyle: 'color:#1677FF;font-size:16px',
    // 		pic: '/static/zulin/profile/jingjiren/erweima.jpeg',
    // 		buttonType: 'single',
    // 		page: 'savePic',
    // 		showClose: true
    // 	})
    // 	uni.navigateTo({
    // 		url: '/pkChaoYueZu/dialog/popup'
    // 	})
    // },
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
