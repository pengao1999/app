<template>
  <view class="content">
    <!-- <view class="content-head" @click="checkState">
      <image style="width: 700rpx;height: 350rpx;" src="/static/zulin/verify/pic_bg.png" />
      <div style="position: absolute;left: 0rpx;top: 0rpx;" class="content-head">
        <view class="head-text-state">• {{state==1?'已认证':'未认证'}}</view>
        <view class="head-text">可使用额度(元)</view>
        <view class="head-text-limit">{{usable.toFixed(2)}}</view>
        <view class="head-text-usable" style="margin-top: 15upx;">可租赁总额度(元) {{limit.toFixed(2)}}</view>
        <view class="head-text-desc">循环租赁, 可获得更高额度</view>
      </div>
    </view> -->
    <view class="list-wrap">
      <view class="list-row" @click="toIdCard">
        <image class="row-image" src="/static/zulin/verify/icon-fenxiao.png" />
        <view class="row-content">
          <text class="content-text-hd">实名认证</text>
          <text class="content-text-sub">认证身份证信息</text>
        </view>
        <view v-if="ifIdCardAuth==2">已认证</view>
        <view class="row-state-text" v-if="ifIdCardAuth==1 || ifIdCardAuth==0">未认证</view>
        <image src="/static/zulin/verify/icon-right.png" class="nav-icon" />
      </view>
      <view class="list-row" @click="toPersonalInfo">
        <image class="row-image" src="/static/zulin/verify/icon-cooperation.png" />
        <view class="row-content">
          <text class="content-text-hd">个人信息认证</text>
          <text class="content-text-sub">认证个人基本信息</text>
        </view>
        <view v-if="ifPersonalInfo==1">已认证</view>
        <view class="row-state-text" v-if="ifPersonalInfo==0">未认证</view>
        <image src="/static/zulin/verify/icon-right.png" class="nav-icon" />
      </view>
      <view class="list-row" @click="toBankCard">
        <image class="row-image" src="/static/zulin/verify/icon-pkg.png" />
        <view class="row-content">
          <text class="content-text-hd">银行卡认证</text>
          <text class="content-text-sub">认证银行卡信息</text>
        </view>
        <view v-if="ifBankCardAuth==1 && ifOperaterAuth==1">已认证</view>
        <view class="row-state-text" v-if="ifBankCardAuth==0 || ifOperaterAuth==0">未认证</view>
        <image src="/static/zulin/verify/icon-right.png" class="nav-icon" />
      </view>

      <!-- <view class="list-row" @click="toOperater">
        <image class="row-image" src="/static/zulin/profile/phone.png" />
        <view class="row-content">
          <text class="content-text-hd">运营商认证</text>
          <text class="content-text-sub">认证运营商信息</text>
        </view>
        <view v-if="ifOperaterAuth==1">已认证</view>
        <view class="row-state-text" v-if="ifOperaterAuth==0">未认证</view>
        <image src="/static/zulin/verify/icon-right.png" class="nav-icon" />
      </view> -->
    </view>
    <myDialog
	confirmColor="var(--blue)"
      :title="dialogTitle"
      :content="dialogContent"
      :dialog-show="showDialog"
      @cancelButton="showDialog=false"
      @confirmButton="confirmAuth"
    ></myDialog>
  </view>
</template>

<script>
import Auth from '../auth'
import Config from './config.js'
import { mapMutations } from 'vuex'
export default {
  name: 'index',
  data() {
    return {
      userKey: '',
      limit: 0,
      usable: 0,
      ifPersonalInfo: -1,
      ifIdCardAuth: -1,
      ifBankCardAuth: -1,
      ifOperaterAuth: -1,
      state: -1,
	  creditStatus:-1
    }
  },
  mixins: [Auth],
  computed: {
    userInfo() {
      return this.$store.state.userInfo
    }
  },
  onLoad(options) {
    this.hasRegister()
    this.userKey = options.userKey
  },
  onShow() {
    let self = this
    const data = {
      userKey: self.userInfo.user_key || '',
      appKey: '123'
    }
    uni.showLoading({
      title: '加载中...'
    })
    self.$Phttp.get(Config.REQUEST_URLS.creditLimit, data).then(res => {
      const response = res.data
      if (response.code === 200) {
        self.limit = response.data.creditAmount / 100
        self.usable = (response.data.creditAmount - response.data.freezeAmount - response.data.frozenAmount) / 100
		self.creditStatus  = response.data.creditStatus
	  }
      uni.hideLoading()
    })

    self.$Phttp.get(Config.REQUEST_URLS.creditStatus, data).then(res => {
      res = res.data
      if (res.code === 200) {
        self.ifPersonalInfo = res.data.isBaseInfoCertificate
        self.ifIdCardAuth = res.data.isRealNameCertificate
        self.ifBankCardAuth = res.data.isBankCardCertificate
        self.ifOperaterAuth = res.data.isOperatorGet
        self.state = res.data.isAllCertificate
      }
    })
  },
  methods: {
    ...mapMutations([]),
    toPersonalInfo() {
      if (!this.hasRegister()) return
      if (!this.hasBindTel()) return
	  
	  if (this.ifIdCardAuth != 2) {
		uni.showToast({
		  title: '请先完成实名认证',
		  icon: "none"
		})
		return
	  }

	  
      uni.navigateTo({
        // url: '/pkChaoYueZu/verify/web?key=personalInfo&pack=index'
        url: '/pkChaoYueZu/verify/personalInfo?userKey='+this.userInfo.user_key
      })
    },
    toIdCard() {
      if (!this.hasRegister()) return
      if (!this.hasBindTel()) return
      if (this.ifIdCardAuth == '2') {
        uni.showToast({
          title: '您已通过实名认证!',
          icon: "none"
        })
      } else {
        const platform = uni.getSystemInfoSync().platform
        if (platform === 'android') {
          this.plusReady();
        }
        uni.navigateTo({
          // url: '/pkChaoYueZu/verify/web?key=idCard&pack=auth&state=' + this.ifIdCardAuth
          url: '/pkChaoYueZu/verify/idCard?state=' + this.ifIdCardAuth + '&userKey=' + this.userInfo.user_key
        })
      }
    },
    toBankCard() {
      if (!this.hasRegister()) return
      if (!this.hasBindTel()) return
      if (this.ifBankCardAuth == 1 && this.ifOperaterAuth == 1) {
        uni.showToast({
          title: '您已通过银行卡认证!',
          icon: "none"
        })
      } else {
        if (this.ifIdCardAuth != 2) {
          uni.showToast({
            title: '请先完成实名认证',
            icon: "none"
          })
          return
        }
        if (!this.ifPersonalInfo) {
          uni.showToast({
            title: '请先完成个人信息认证',
            icon: "none"
          })
          return
        }
        uni.navigateTo({
          url: '/pkChaoYueZu/verify/bankCard?userKey=' + this.userInfo.user_key
        })
      }
    },
    toOperater() {
      if (!this.hasRegister()) return
      if (!this.hasBindTel()) return
      if (this.ifOperaterAuth == '1') {
        uni.showToast({
          title: '您已通过运营商认证!',
          icon: "none"
        })
      } else {
        uni.navigateTo({
          url: '/pkChaoYueZu/verify/operater?userKey=' + this.userInfo.user_key
        })
      }
    },
    checkState() {
      if (this.state) {
        uni.navigateTo({
          url: '/pages/index/complete?usable=' + this.usable
        })
      } else {
        uni.showToast({
          title: '您还未全部认证通过',
          icon: "none"
        })
      }
    },
    plusReady() {
      var Build = plus.android.importClass("android.os.Build");
      var Manifest = plus.android.importClass("android.Manifest");
      var MainActivity = plus.android.runtimeMainActivity();
      //var context=main.getApplicationContext(); //未用到,在此仅供参考

      var ArrPermissions = [
        Manifest.permission.READ_EXTERNAL_STORAGE,
        Manifest.permission.WRITE_EXTERNAL_STORAGE,
        Manifest.permission.CAMERA,
        Manifest.permission.RECORD_AUDIO
      ];

      function PermissionCheck(permission) {
        if (Build.VERSION.SDK_INT >= 23) {
          if (MainActivity.checkSelfPermission(permission) == -1) {
            return false;
          }
        }
        return true;
      }

      function PermissionChecks(Arr) {
        var HasPermission = true;
        for (var index in Arr) {
          var permission = Arr[index];
          //如果此处没有权限,则是用户拒绝了
          if (!PermissionCheck(permission)) {
            HasPermission = false;
            break;
          }
        }
        return HasPermission;
      }

      function PermissionRequest(Arr) {
        var REQUEST_CODE_CONTACT = 101;
        if (Build.VERSION.SDK_INT >= 23) {
          MainActivity.requestPermissions(Arr, REQUEST_CODE_CONTACT);
        }
      }

      //如果没有权限，则申请
      if (!PermissionChecks(ArrPermissions)) {
        PermissionRequest(ArrPermissions);
      } else { //如果拥有权限，那么干点啥吧^_^
        //.......
      }
    }
  }
}
</script>

<style lang="scss">
page {
	width: 100%;
	height: 100%;
	background: #f4f4f4;
}
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  // height: calc(100vh - 0rpx);
  background: #f4f4f4;
  .content-head {
    width: 700rpx;
    height: 350rpx;
    -moz-background-size: 100% 100%;
    border-radius: 20rpx;
    margin: 36rpx 24rpx 20rpx 24rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    .head-text-state {
      text-align: end;
      width: 100%;
      font-size: 24rpx;
      color: #fff;
      margin-right: 90rpx;
      margin-top: 30rpx;
    }
    .head-text {
      font-size: 28rpx;
      color: #fff;
      font-weight: 400;
    }
    .head-text-limit {
      color: #fff;
      font-weight: bold;
      font-size: 64rpx;
    }
    .head-text-desc {
      width: 100%;
      text-align: center;
      color: #fff;
      font-size: 24rpx;
      font-weight: 300;
      height: 56rpx;
      line-height: 56rpx;
    }
    .head-text-usable {
      color: #fff;
      font-size: 26rpx;
      font-weight: 400;
      margin-bottom: 10rpx;
    }
  }
  .list-wrap {
    display: flex;
    flex-direction: column;
    width: 100%;
    background: #fff;
    .list-row {
      margin: 0 24rpx;
      display: flex;
      flex-direction: row;
      height: 180rpx;
      justify-content: center;
      align-items: center;
      border-bottom: 1rpx solid #f4f4f4;
      color: #666;
      font-size: 28rpx;
      .row-image {
        width: 100rpx;
        height: 100rpx;
        margin-right: 36rpx;
      }
      .row-content {
        flex: 1;
        display: flex;
        flex-direction: column;
        .content-text-hd {
          color: #333;
          font-size: 34rpx;
        }
        .content-text-sub {
          color: #d4d4d4;
          font-size: 24rpx;
          margin-top: 10rpx;
        }
      }
      .row-state-text {
        // width: 100rpx;
        font-size: 28rpx;
        color: var(--blue);
      }
      .nav-icon {
        width: 40rpx;
        height: 40rpx;
      }
    }
  }
}

.bottom {
  background:linear-gradient(180deg,rgba(82,171,252,1) 0%,rgba(6,135,255,1) 100%);
  border-radius: 50rpx;
  width: 666rpx;
  height: 88rpx;
  line-height: 88rpx;
  color: #fff;
  font-size: 32rpx;
  font-weight: 400;
  align-items: center;
  text-align: center;
  margin: 50rpx 0;
}
</style>
