<template>
  <view>
    <view v-if="showUserInfo">
      <profile-user-info
        :message_total="2"
        :userInfo="userInfo"
        :customStyle="infoStyle"
        @isLogOut="isLogout"
        @signIn="signIn"
      ></profile-user-info>
    </view>

    <view v-if="showOrder">
      <profile-user-order
        :order_count="order_count"
        :customStyle="orderStyle"
        :customItem="orderItem"
        @toOrderList="toList"
      ></profile-user-order>
    </view>

    <view v-if="showNav">
      <profile-nav-box :navList="navlist" :customStyle="navStyle" @navClick="navClick"></profile-nav-box>
    </view>

    <view v-if="showColoum">
      <profile-columns
        :userInfo="userInfo"
        :customStyle="columnStyle"
        :customItem="columnItem"
        :is-register="isRegister"
        @toApply="toApply"
        @toProtocol="toProtocol"
        @recruitSupplier="recruitSupplier"
        @toPostsale="toPostsale"
        @toLeader="toLeader"
        @logout="isLogout"
      ></profile-columns>
    </view>

<!--    <view v-if="showCode">-->
<!--      <profile-delivery-code :customStyle="codeStyle" @generateCode="generateCode"></profile-delivery-code>-->
<!--    </view>-->

<!--    <view class="mask" @tap.stop="codeDialog" v-if="showCodeDialog"></view>-->
<!--    <view class="code-dialog" @tap.stop="getCode" v-if="showCodeDialog">-->
<!--      <view class="dialog-title">-->
<!--        <text class="space"></text>-->
<!--        <text>提货码（点击刷新）</text>-->
<!--        <image src="/static/ic_close.png" class="close" @tap.stop="codeDialog" :lazy-load="true" />-->
<!--      </view>-->
<!--      <qrcode-->
<!--        :val="qrval"-->
<!--        :size="qrsize"-->
<!--        :background="qrbackground"-->
<!--        :foreground="qrforeground"-->
<!--        :pdground="qrpdground"-->
<!--        :icon="qricon"-->
<!--        :iconSize="qriconsize"-->
<!--        :lv="qrlv"-->
<!--        ref="qrcode"-->
<!--        @result="qrR"-->
<!--      ></qrcode>-->
<!--      <view class="desc">向提货点出示二维码提货</view>-->
<!--    </view>-->
<!--    <view class="ad-box" v-if="banner && banner.pic != undefined">-->
<!--      <image class="ad" :src="image_root+banner.pic" @tap.stop="adClick" />-->
<!--    </view>-->
<!--    <view style="width:100%;position:relative;">-->
<!--      <official-account style></official-account>-->
<!--    </view>-->
    <view class="version-container">当前版本号：{{version}}</view>

    <!--  #ifdef  MP-WEIXIN -->
    <my-wx-login
      :propData="loginDialogData"
      @handleClose="handleClose"
      @getUserInfoSuccess="getUserInfoSuccess"
    ></my-wx-login>
    <!--  #endif -->
  </view>
</template>

<script>
import Config from "@/common/js/Config.js";
import Toast from "@/common/js/toast.js";
import Auth from "../auth.js";
import Util from "@/common/js/util.js";
import { mapMutations } from "vuex";

import qrcode from "@/common/third/qrcode/qrcode.vue";
// #ifdef  MP-WEIXIN
import MyWxLogin from "@/components/yx_dialog/myWXLoginDialog.vue";
// #endif

import ProfileUserInfo from "./components/profile-user-info.vue";
import ProfileUserOrder from "./components/profile-user-order.vue";
import ProfileNavBox from "./components/profile-nav-box.vue";
import ProfileColumns from "./components/profile-columns.vue";
import ProfileDeliveryCode from "./components/profile-delivery-code.vue";

import * as profilePageCustomization from "@/pages/customization/profile-page-customization.json";

export default {
  data() {
    return {
      order_count: {},
      message_total: 0,
      info: {},
      qrcode: {},
      qrval: "二维码", // 要生成的二维码值
      qrsize: 200, // 二维码大小
      qrbackground: "#FFFFFF", // 背景色
      qrforeground: "#000000", // 前景色
      qrpdground: "#000000", // 角标色
      qricon: "", // 二维码图标
      qriconsize: 25, // 二维码图标大小
      qrlv: 3, // 二维码容错级别 ，一般不用设置，默认就行
      qrSrc: "",
      showCodeDialog: false,
      loginDialogData: {
        show: false
      },
      navlist: [],
      // navlist: [{
      // 		image: "/static/coupons.png",
      // 		title: "优惠券",
      // 		tap: 'coupons'
      // 	},
      // 	{
      // 		image: "/static/service.png",
      // 		title: "联系客服"
      // 	},
      // 	{
      // 		tap: 'friend',
      // 		image: "/static/friends.png",
      // 		title: "邀请好友"
      // 	},
      // 	{
      // 		tap: 'service',
      // 		image: "/static/public_account.png",
      // 		title: "服务号"
      // 	}
      // ],
      banner: {},
      image_root: "",
      timer: {},
      version: "",
      showUserInfo: true,
      showOrder: false,
      showNav: false,
      showColoum: false,
      showCode: false,
      infoStyle: {},
      orderStyle: {},
      orderItem: {},
      navStyle: {},
      columnStyle: {},
      columnItem: {},
      codeStyle: {}
    };
  },
  onLoad() {
    let self = this;
    if (!self.checkLogin()) return; //判断是否登录
    self.version = Config.VERSION;
    //#ifdef APP-PLUS
    plus.runtime.getProperty(plus.runtime.appid, function(widgetInfo) {
      self.version = widgetInfo.version;
    });
    //#endif

    self.showUserInfo = self.checkCustomizedModule("userInfo");
    setTimeout(() => {
      self.showOrder = self.checkCustomizedModule("userOrder");
    }, 80);
    setTimeout(() => {
      self.showNav = self.checkCustomizedModule("navBox");
    }, 120);
    setTimeout(() => {
      self.showColoum = self.checkCustomizedModule("columns");
    }, 160);
    setTimeout(() => {
      self.showCode = self.checkCustomizedModule("deliveryCode");
    }, 200);

    self.infoStyle = self.getCustomStyle('userInfo')
    self.orderStyle = self.getCustomStyle("userOrder");
    self.navStyle = self.getCustomStyle("navBox");
    self.columnStyle = self.getCustomStyle("columns");
    self.codeStyle = self.getCustomStyle("deliveryCode");

    self.orderItem = self.getCustomizedElement("userOrder");
    self.navlist = self.getCustomizedElement("navBox");
    self.columnItem = self.getCustomizedElement("columns");
  },
  onShow() {
    if (Util.containsKey(this.userInfo, "id")) {
      this.GetMyInfo();
    }
    if (this.showCodeDialog) {
      this.autoRefreshCode();
    }
  },
  mixins: [Toast, Auth],
  components: {
    // tkiQrcode
    qrcode,
    ProfileUserInfo,
    ProfileUserOrder,
    ProfileNavBox,
    ProfileColumns,
    ProfileDeliveryCode,
    // #ifdef  MP-WEIXIN
    MyWxLogin
    // #endif
  },
  watch: {
    userInfo: {
      handler() {
        if (
          this.userInfo === undefined ||
          (this.userInfo != undefined && !Util.containsKey(this.userInfo, "id"))
        ) {
        } else {
          this.loginDialogData = Object.assign({}, this.loginDialogData, {
            show: false
          });
        }
      },
      immediate: true
    },
    ads: {
      handler() {
        if (this.ads !== undefined) {
          this.getBanner();
        }
      },
      immediate: true
    }
  },
  computed: {
    userInfo() {
      return this.$store.state.userInfo;
    },
    isTryGetUserInfo() {
      return this.$store.state.isTryGetUserInfo;
    },
    group() {
      return this.$store.state.group;
    },
    ads() {
      return this.$store.state.ads;
    },
    globalI() {
      return this.$store.state.globalI;
    },
    couldModifyGroup() {
      return this.$store.state.couldModifyGroup;
    }
  },
  methods: {
    ...mapMutations([
      "logout",
      "setUserInfo",
      "setLoginWx",
      "setCouldModifyGroup"
    ]),

    checkCustomizedModule(moduleName) {
      return profilePageCustomization[moduleName];
    },
    getCustomStyle(moduleName) {
      let customObj = {}
      if (profilePageCustomization[moduleName] && profilePageCustomization[moduleName]['format']) {
        customObj = profilePageCustomization[moduleName]['format']
      }
      return customObj
    },
    getCustomizedElement(moduleName) {
      if (
        profilePageCustomization[moduleName] &&
        profilePageCustomization[moduleName]["element"]
      ) {
        return profilePageCustomization[moduleName]["element"];
      }
      return {};
    },
    signIn() {
      if (!this.hasRegister())  return
    },
    GetMyInfo() {
      let self = this;
      if (!self.isRegister) return
      let data = {
        i: self.globalI,
        user_key: self.userInfo.user_key
      };
      self.$Phttp.post(Config.JAVA_SAAS_URLS.myInfo, data).then(res => {
        uni.stopPullDownRefresh();
        res = res.data;
        self.order_count = res.data.order_count;
        self.message_total = res.data.message_total;
        self.info = res.data;
        self.image_root = res.other.imgRoot;
        delete res.data.openid
        self.setUserInfo(res.data);
      });
    },
    getBanner: function() {
      this.banner = this.ads.userBanner;
    },
    login() {
      uni.navigateTo({
        url: "../../pages/profile/login/login"
      });
    },
    toList(status) {
      let self = this;
      if (!self.hasRegister())  return
      uni.navigateTo({
        url: `/pages/order/list?status=${status}&leader_key=-1`
      });
    },
    recruitSupplier: function() {
      let self = this;
      if (!self.hasRegister())  return
      if (this.info.has_store) {
        uni.navigateTo({
          url: "/pkLeaderInfo/store/center"
        });
      } else {
        console.log(Config.RECRUITE_SUPPLIER);
        uni.navigateTo({
          url: "/pkMain/profile/webview?url=" + Config.RECRUITE_SUPPLIER
        });
      }
    },
    isUserLogin: function() {
      let self = this;
      if (
        self.userInfo === undefined ||
        (self.userInfo != undefined && !Util.containsKey(self.userInfo, "id"))
      ) {
        return false;
      }
      return true;
    },
    toApply(isLeader) {
      let self = this;
      if (!self.hasRegister())  return
      if (isLeader) {
        uni.navigateTo({
          url: "/pkLeaderInfo/center/index"
        });
      } else {
        uni.navigateTo({
          url: "/pkUserInfo/info/apply"
        });
      }
    },
    toProtocol: function() {
      let self = this;
      if (!self.hasRegister())  return
      uni.navigateTo({
        url : "/pkUserInfo/info/protocol"
      })
    },
    toPostsale: function() {
      let self = this;
      if (!self.hasRegister())  return
    },
    generateCode() {
      let self = this;
      if (!self.hasRegister())  return
      this.getCode();
      this.autoRefreshCode();
    },
    getCode: function() {
      let self = this;
      if (!self.hasRegister())  return
      let data = {
        i: self.globalI,
        user_key: self.userInfo.user_key
      };
      self.$Phttp.post(Config.JAVA_SAAS_URLS.userCode, data).then(res => {
        res = res.data;
        if (res.code === 0) {
          self.qrval = "code-" + res.data;
          self.showCodeDialog = true;
          setTimeout(() => {
            self.showCodeDialog = true;
            self.$refs.qrcode.creatQrcode();
          }, 100);
        }
      });
    },
    bindLeader: function(e) {
      let self = this;
      if (!self.hasRegister())  return
      this.setCouldModifyGroup(!e.detail.value);
    },
    handleClose: function() {
      this.loginDialogData.show = false;
    },
    codeDialog: function() {
      let self = this;
      self.clearTimer();
      self.showCodeDialog = Object.assign(false);
      for (var i = 0; i < 4; i++) {
        setTimeout(() => {
          self.showCodeDialog = Object.assign(false);
        }, 100);
      }
      self.clearTimer();
      self.$refs.qrcode.clearQrcode();
    },
    toContact: function() {
      let self = this;
      if (!self.isUserLogin()) {
        this.loginDialogData = Object.assign({}, this.loginDialogData, {
          show: true
        });
        return;
      }
      uni.navigateTo({
        url: "/pkMain/profile/webview?url=" + Config.CONTACT_URL
      });
    },
    toMessage() {
      uni.navigateTo({
        url: "/pkMessage/message/message"
      });
    },
    openMap: function() {
      let self = this;
      if (!self.hasRegister())  return
      uni.openLocation({
        name: this.group.community,
        latitude: parseFloat(this.group.latitude),
        longitude: parseFloat(this.group.longitude),
        success: () => {
          console.log("open map.");
        }
      });
    },
    isLogout: function() {
      let self = this
      uni.showModal({
        title: "提示",
        content: "是否登出本账号？",
        confirmColor: "#1dc422",
        success: res => {
          if (res.confirm) {
            let userInfo = {
              openid: self.userInfo.openid,
              uuid: self.userInfo.uuid,
              bind_uuid: self.userInfo.bind_uuid,
            }
            self.logout();
            self.setUserInfo(userInfo)
            // #ifdef APP-PLUS
            uni.reLaunch({
              url: "/pkUserInfo/info/login"
            });
            // #endif

            // #ifdef H5
            uni.reLaunch({
              url: "/pages/index/main"
            });
            //#endif
          }
        }
      });
    },
    getUserInfoSuccess: function(userInfo) {
      this.setUserInfo(userInfo);
      this.setLoginWx(true);
      this.GetMyInfo();
    },
    navClick(tap) {
      let self = this;
      if (!self.hasRegister())  return
      switch (tap) {
        case "coupons":
          uni.navigateTo({
            url: "/pkMain/profile/coupons"
          });
          break;
        case "friend":
          uni.navigateTo({
            url: "/pkUserInfo/info/friends"
          });
          break;
        case "service":
          uni.previewImage({
            count: 1,
            urls: [Config.SERVICE_LOGO]
          });
      }
    },
    adClick: function() {
      uni.navigateTo({
        url: "/pages/index/product?id=" + this.banner.param
      });
    },
    autoRefreshCode: function() {
      let self = this;
      self.timer = setInterval(() => {
        self.$refs.qrcode.creatQrcode();
      }, 8000);
    },
    clearTimer: function() {
      if (!Util.isEmptyObject(this.timer)) clearInterval(this.timer);
    },
    toLeader: function () {
      let self = this;
      if (!self.hasRegister())  return
      uni.navigateTo({
        url: '/pkUserInfo/info/leader'
      })
    }
  },
  onHide() {
    console.log("onHide");

    this.clearTimer();
  },
  onPullDownRefresh() {
    console.log("onPullDownRefresh");
    if (
      (this.userInfo === undefined && this.isTryGetUserInfo) ||
      (this.userInfo != undefined &&
        !Util.containsKey(this.userInfo, "nickName") &&
        this.isTryGetUserInfo)
    ) {
    } else {
      console.log("hideLogin");
      this.loginDialogData = Object.assign({}, this.loginDialogData, {
        show: false
      });
    }

    if (!this.loginDialogData.show && this.userInfo.user_key !== undefined) {
      this.GetMyInfo();
    }
  },
  onShareAppMessage() {
    return {
      title: "友邻优选-大家都在用的社区团购APP",
      path:
        "/pages/index/main?user_key=" + this.userInfo.user_key + "&i=" + this.globalI
    };
  }
};
</script>

<style lang="scss">
page {
  display: flex;
  background: white;
  flex-direction: column;
}

switch {
  zoom: 0.7;
}

button::after {
  border: none;
}

.mask {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background: #000;
  opacity: 0.2;
  overflow: hidden;
  z-index: 99998;
  color: #fff;
}

.code-dialog {
  width: calc(100% - 160upx);
  height: 620rpx;
  left: 80rpx;
  top: calc(50% - 270upx);
  background: #fff;
  border-radius: 20rpx;
  position: fixed;
  z-index: 99999;

  .dialog-title {
    width: 100%;
    height: 100rpx;
    line-height: 100rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .space {
      width: 40rpx;
      height: 40rpx;
    }

    text {
      font-size: 30rpx;
      font-weight: bold;
      color: #333;
    }

    .close {
      width: 40rpx;
      height: 40rpx;
      margin-right: 20rpx;
      margin-top: -15rpx;
    }
  }

  .code {
    width: 360rpx;
    height: 360rpx;
    margin-left: calc(50% - 180rpx);
  }

  .desc {
    width: 100%;
    height: 80rpx;
    line-height: 30rpx;
    text-align: center;
    font-size: 30rpx;
    color: #e84118;
    margin-top: 20rpx;
  }
}

.ad-box {
  width: 100%;
  height: 120rpx;
  margin-top: 40rpx;

  .ad {
    width: 100%;
    height: 100%;
  }
}

.version-container {
  position: fixed;
  bottom: 20rpx;
  width: 100%;
  height: 100rpx;
  line-height: 100rpx;
  text-align: center;
  color: #999;
}
</style>
