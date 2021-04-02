<template>
  <view class="content">
    <error-tips :propData="errorData" @hide="errorHide"></error-tips>
    <image src="/static/zulin/verify/success.png" class="success-img" />
    <view class="text-hd">身份证上传成功</view>
    <view class="text-sub">还需去进行人脸识别就可以完成实名认证啦</view>
    <view class="bottom-button" @click="toFaceAuth">去认证</view>
  </view>
</template>
<script>
import Config from './config.js'
import errorTips from '../../components/yx_dialog/myErrorTip.vue'
export default {
  name: 'success',
  components: { errorTips },
  data() {
    return {
      userKey: '',
      test: '',
      // 错误提示
      errorData: {
        show: false,
        desc: ''
      },
    }
  },
  onLoad(options) {
    this.userKey = options.userKey
  },
  methods: {
    errorHide: function (e) {
      if (!e.detail) {
        this.errorData.show = false;
        return
      }
      this.errorData = e.detail
    },
    toFaceAuth() {
      let self = this
      uni.showLoading({
        title: '加载中...'
      })
	  console.log('1')
      this.$Phttp.get(Config.REQUEST_URLS.getFaceUrl, { userKey: this.userKey }).then(res => {
        res = res.data
        if (res.code === 200) {
          const url = res.data
          console.log('url', url)
          const platform = uni.getSystemInfoSync().platform
          self.errorData = Object.assign({}, self.errorData, {
            show: true,
            desc: platform
          })
          if (platform === 'android') {
            let webview = uni.requireNativePlugin('webview-plugin');
			console.log('2');
			console.log(webview);
            if (webview) {
              self.errorData = Object.assign({}, self.errorData, {
                show: true,
                desc: '加载webview'
              })
            }
            webview.show({
              url: url,
            }, result => {
              console.log(JSON.stringify(result))
            });
            uni.navigateTo({
              url: '/pkChaoYueZu/verify/verify'
            })
			console.log('3')
          } else {
            const encodeUrl = encodeURIComponent(url)
            uni.navigateTo({
              url: '/pkChaoYueZu/verify/web?url=' + encodeUrl
            })
          }
        } else if (res.message.includes('用户信息错误！')) {
          self.errorData = Object.assign({}, self.errorData, {
            show: true,
            desc: '请先提交个人基本信息～'
          })
        } else {
          self.errorData = Object.assign({}, self.errorData, {
            show: true,
            desc: res.message
          })
        }
        uni.hideLoading()
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  .success-img {
    width: 160rpx;
    height: 160rpx;
    margin-top: 100rpx;
  }
  .text-hd {
    color: #222;
    font-size: 32rpx;
    margin: 30rpx 0;
  }
  .text-sub {
    font-size: 26rpx;
    color: #999;
  }
  .bottom-button {
    font-size: 30rpx;
    color: #fff;
    margin-top: 150rpx;
    width: 500rpx;
    height: 80rpx;
    line-height: 80rpx;
    text-align: center;
    background:linear-gradient(180deg,rgba(82,171,252,1) 0%,rgba(6,135,255,1) 100%);
    border-radius: 40rpx;
  }
}
</style>
