<template>
  <view class="container">
    <view class="row-wrap">
      <view class="title">头像</view>
      <image :src="headImgSrc" class="head-img" @click="handleClick" />
    </view>
    <view class="row-wrap">
      <view class="title">昵称</view>
      <input class="nick-input" placeholder="请输入昵称" v-model="nickName" />
    </view>

    <view class="bottom-btn" @click="submit">确认修改</view>
  </view>
</template>
<script>
import Config from '../../common/js/Config.js'
import { mapMutations } from 'vuex'
export default {
  name: 'InfoEditor',
  data() {
    return {
      nickName: '',
      imgRoot: '',
      headImgSrc: '/static/ic_default_head.png',
      userKey: ''
    }
  },
  computed: {
  },
  onLoad() {
    console.log('user info', this.$store.state.userInfo)
    const userInfo = this.$store.state.userInfo
    const img = userInfo.avatarUrl
    if (img) {
      this.headImgSrc = img
    }
    this.nickName = userInfo.nickName
    this.userKey = userInfo.user_key
  },
  methods: {
    ...mapMutations(['setUserInfo']),
    handleClick() {
      let self = this
      uni.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: function (res) {
          const filePath = res.tempFilePaths[0]
          uni.uploadFile({
            url: Config.JAVA_SAAS_URLS.uploadImage,
            filePath: filePath,
            name: 'file',
            formData: {},
            success: res => {
              const response = JSON.parse(res.data)
              if (response.code === 0) {
                self.headImgSrc = response.data.full_path
              } else {
                uni.showToast({
                  title: '上传图片失败:' + response.msg,
                  icon: "none"
                })
              }
            },
            fail: err => {
              uni.showToast({
                title: '上传图片失败，请重新选择～',
                icon: "none"
              })
            }
          })
        }
      })
    },
    submit() {
      let self = this
      const data = {
        avatar_url: self.headImgSrc,
        nick_name: self.nickName,
        user_key: self.userKey
      }
      self.$Phttp.post(Config.JAVA_SAAS_URLS.modifyUserInfo, data).then(res => {
        res = res.data
        if (res.code === 0) {
          self.setUserInfo({
            nickName: self.nickName,
            avatarUrl: self.headImgSrc
          })
          uni.navigateBack()
        } else {
          uni.showToast({
            title: '修改信息失败，请稍后重试～',
            icon: "none"
          })
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.container {
  height: 100%;
  background: #f4f4f4;
  display: flex;
  flex-direction: column;
  align-items: center;
  .row-wrap {
    display: flex;
    flex-direction: row;
    background: #fff;
    width: 750rpx;
    justify-content: space-between;
    border-bottom: 1rpx solid #f4f4f4;
    align-items: center;
    padding: 20rpx 0;
    .title {
      margin: 0 30rpx;
      font-size: 32rpx;
      color: #333;
    }
    .head-img {
      width: 180rpx;
      height: 180rpx;
      margin: 0 30rpx;
      border: 1rpx solid #f4f4f4;
    }
    .nick-input {
      flex: 1;
      text-align: right;
      font-size: 30rpx;
      margin-right: 30rpx;
    }
  }
  .bottom-btn {
    width: 500rpx;
    height: 80rpx;
    line-height: 80rpx;
		background:linear-gradient(180deg,rgba(82,171,252,1) 0%,rgba(6,135,255,1) 100%);
    border-radius: 40rpx;
    font-size: 30rpx;
    color: #fff;
    text-align: center;
    margin-top: 50rpx;
  }
}
</style>