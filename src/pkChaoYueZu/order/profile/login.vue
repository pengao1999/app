<template>
  <view style="padding-top:80rpx;">
    <!-- 自定义头部 -->
    <!-- <my-header :propData="headerData" @closeLogin="closeLogin"></my-header> -->

    <error-tip :propData="errorData" @hide="errorHide"></error-tip>
    <view class="Login-page" :style="'height:'+height+'px;'">
      <view class="Login-page-tel">
        <view class="tip1">您好，</view>
        <view class="tip2">欢迎加入</view>
        <view style="margin-top:129upx;">
          <my-input :propData="telInput" @inputVal="inputTel" @clearVal="clearTel"></my-input>
          <my-input :propData="codeInput" @inputVal="inputCode" @clickCodeButton="sendCode"></my-input>
        </view>
        <view class="enter" @tap="enter">进入</view>
        <view class="protocol-container">
          <text class="tip3">登录即表示已阅读并同意</text>
          <text class="tip4" @tap="clickProtocol">《友邻优选商城用户服务协议》</text>
        </view>
        <!-- <view class="bottom-container">
					<image v-if="diplayPasswordButton" class="slide-up" src="../../static/password.png" ></image>
					<image  style="margin-left: 61upx;" v-if="!diplayWxButton"></image>
					<image v-if="diplayWxButton" @tap.stop="loginWx" class="slide-up" style="margin-left: 61upx;" src="../../static/wechat.png"></image>
        </view>-->
      </view>
    </view>
  </view>
</template>

<script>
import Util from '../../common/js/util.js'
import Toast from '../../common/js/toast.js'
import Config from '../../common/js/Config.js'

import MyHeader from '../../components/yx_view/myHeader.vue'
import MyInput from '../../components/yx_view/myInput.vue'
import ErrorTip from '../../components/yx_dialog/myErrorTip.vue'

import { mapMutations } from 'vuex'
export default {
  config: {
    title: '验证码登录',
    disableSwipeBack: true
  },
  components: { MyHeader, MyInput, ErrorTip },
  mixins: [Toast],
  data() {
    return {
      headerData: {
        title: '验证码登录',
        height: 80
      },
      height: 500,
      telInput: {
        placeholder: '请输入手机号',
        style: 'padding-right:66px',
        showClear: false,
        showCodeButton: false,
        inputStyle: 'border-bottom: 1px solid rgba(218,224,230,1);',
        val: ''
      },
      codeInput: {
        placeholder: '短信验证码',
        style: 'padding-right:66px',
        showClear: false,
        showCodeButton: true,
        val: '',
        countDownNum: 0
      },
      diplayPasswordButton: false,
      diplayWxButton: false,
      // 错误提示
      errorData: {
        show: false,
        desc: ''
      },
      timer: Object
    }
  },
  onLoad() {
    // this.toast({
    // 	desc: '加载中...',
    // 	type: 'loading',
    // 	time: 2000
    // })
    this.showBottomButton()
  },
  watch: {
    systemInfo: {
      handler() {
        console.log(JSON.stringify(this.systemInfo))
        if (this.systemInfo !== undefined) {
          this.height = this.systemInfo.windowHeight - this.headerData.height
          console.log(this.height)

        }
      },
      immediate: true
    },
    loginWxSuccess: {
      handler() {
        if (this.loginWxSuccess) {
          uni.switchTab({
            url: '/pkChaoYueZu/index/main'
          })
        }
      },
      immediate: true
    }
  },
  computed: {
    systemInfo() {
      return this.$store.state.systemInfo
    },
    loginWxSuccess() {
      return this.$store.state.loginWxSuccess
    },
    globalI() {
      return this.$store.state.globalI
    },
    point_token() {
      return this.$store.state.point_token
    }
  },
  methods: {
    ...mapMutations(['setLoginWx', 'setUserInfo', 'setPointToken']),
    showBottomButton: function () {
      this.diplayPasswordButton = true
      setTimeout(() => {
        this.diplayWxButton = true
      }, 800)
    },
    loginWx: function () {
      this.setLoginWx(true)
    },
    closeLogin: function () {
      console.log('closeLogin')
      uni.showToast({
        title: '请先登录哦～',
        icon: 'none'
      })
      uni.navigateBack()
    },
    inputTel: function (val) {
      let self = this
      if (val.length === 0) {
        self.telInput.showClear = false
      } else {
        self.telInput.showClear = true
      }
      self.telInput.val = val
    },
    inputCode: function (val) {
      this.codeInput.val = val
    },
    clearTel: function () {
      this.telInput.val = ''
    },
    // 错误隐藏
    errorHide: function (e) {
      if (!e.detail) {
        this.errorData.show = false;
        return
      }
      this.errorData = e.detail
    },
    sendCode: function () {
      console.log('sendCode')
      let self = this
      if (self.codeInput.countDownNum > 0) {
        self.errorData = Object.assign({}, self.errorData, {
          show: true,
          desc: "还需要等待" + self.codeInput.countDownNum + "秒"
        })
        return
      }
      if (!(/^1(3|4|5|7|8|9)\d{9}$/.test(self.telInput.val))) {
        self.errorData = Object.assign({}, self.errorData, {
          show: true,
          desc: "请输入正确的手机号码"
        })
        return
      }

      // get code.
      let data = {
        i: self.globalI,
        tel: self.telInput.val,
        m: 'sqtg_sun'
      }
      self.$Phttp.post(Config.JAVA_SAAS_URLS.getCode, data).then((res) => {
        res = res.data
        console.log(JSON.stringify(res))
        if (res.code === 0) {
          self.errorData = Object.assign({}, self.errorData, {
            show: true,
            desc: "已成功发送验证码"
          })
          self.codeInput.countDownNum = 120
          self.countDown()
        } else {
          self.errorData = Object.assign({}, self.errorData, {
            show: true,
            desc: res.msg
          })
        }

      })
    },
    countDown: function () {
      let self = this;
      //如果将定时器设置在外面，那么用户就看不到countDownNum的数值动态变化，所以要把定时器存进data里面
      self.timer = setInterval(function () {
        self.codeInput.countDownNum--;
        if (self.codeInput.countDownNum == 0) {
          self.clearTimer()
        }
      }, 1000)
    },
    clearTimer: function () {
      if (!Util.isEmptyObject(this.timer))
        clearInterval(this.timer)
    },
    enter2() {
      // temp: hard code token to login
      // this.setPointToken('eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1aWQiOiIxMTk5NTI4NDc2NjU5NDkwODE3In0.Ttg7Mj_eqB8K9HAUUXj33phzTNDtP9ZTmJjtbY67cDU')

      this.setPointToken('eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1aWQiOiIxMTc4MTUzNzk4MjMzODI1MjgxIn0.2BGq5_YCcmf98dLoKRtL_TtIFOvOalUPhPUm8HMwr1U')
      uni.reLaunch({
        url: '/pkPointMall/index/main'
      })
      // uni.navigateBack()
    },
    clickProtocol() {
      uni.navigateTo({
        url: '/pkUserInfo/info/protocolDetails?id=10'
      })
    },
    enter: function () {
      let self = this
      self.toast({
        type: 'loading',
        desc: '登录中...'
      })
      let data = {
        i: self.globalI,
        tel: self.telInput.val,
        code: self.codeInput.val
      }
      self.$Phttp.post(Config.JAVA_SAAS_URLS.telLogin, data).then((res) => {
        self.toast(true)
        res = res.data
        console.log(JSON.stringify(res))
        if (res.code === 0) {
          self.setUserInfo(res.data)
          self.setPointToken(res.data.token)
          // self.closeLogin()
          // uni.reLaunch({
          // 	url: '/pkPointMall/index/main'
          // })
          console.log('token', this.point_token)
          uni.navigateBack()
        } else {
          self.errorData = Object.assign({}, self.errorData, {
            show: true,
            desc: res.msg
          })
        }
      })
    }
  }
}
</script>

<style>
@import url("../../common/css/animation.css");
.Login-page {
  width: 100%;
}
.Login-page-tel {
  padding-left: 66upx;
}
.tip1 {
  font-size: 40upx;
  font-family: PingFang-SC-Heavy;
  font-weight: 800;
  color: rgba(0, 0, 0, 1);
  /* #ifdef APP-PLUS || MP-WEIXIN */
  padding-top: 100rpx;
  /* #endif */
  /* #ifdef H5 */
  padding-top: 45px;
  /* #endif */
}
.tip2 {
  margin-top: 15upx;
  font-size: 28upx;
  font-family: PingFang-SC-Heavy;
  font-weight: 800;
  color: rgba(112, 112, 112, 1);
}
.enter {
  margin-top: 128upx;
  height: 88upx;
  line-height: 88rpx;
  background: #ef4136;
  color: white;
  font-size: 37upx;
  text-align: center;
  margin-right: 66upx;
  border-radius: 44upx;
}
.enter:active {
  opacity: 0.7;
}
.protocol-container {
  margin-top: 29upx;
  display: flex;
  flex-direction: row;
  font-size: 22upx;
  justify-content: center;
  align-items: center;
  margin-right: 66upx;
}
.tip3 {
  color: #999999;
}
.tip4 {
  color: #44bd32;
  text-decoration: underline;
}
.bottom-container {
  margin-top: 100upx;
  width: 618upx;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.bottom-container image {
  width: 88upx;
  height: 88upx;
}
.bottom-container image:active {
  opacity: 0.7;
}
</style>
