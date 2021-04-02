<template>
  <view class="content">
    <view class="row-wrap">
      <view class="row-title">银行卡号</view>
      <input focus placeholder="请输入银行卡号" type="number" class="row-input" v-model="cardNumber" />
    </view>
    <view class="row-wrap">
      <view class="row-title">开户行</view>
      <picker :range="bankList" :value="bankIndex" class="row-picker" @change="handleBankChange">
        <view>{{bankList[bankIndex]}}</view>
      </picker>
      <image src="/static/zulin/verify/icon-right.png" class="nav-icon" />
    </view>
    <view class="row-wrap">
      <view class="row-title">真实姓名</view>
      <input placeholder="请输入姓名" class="row-input" v-model="realName" />
    </view>
    <view class="row-wrap">
      <view class="row-title">预留手机号码</view>
      <input placeholder="请输入手机号" type="number" class="row-input" v-model="phone" />
    </view>
    <!-- <view class="row-wrap">
      <view class="row-title">短信验证码</view>
      <input placeholder="请填写验证码" type="number" class="row-input" v-model="identityCode" />
      <view class="code-button" @click="getCode">{{countDownNum>0?'剩余'+countDownNum+'秒':'获取验证码'}}</view>
    </view>-->

    <view class="bottom" @click="upload">添加</view>
  </view>
</template>
<script>
import Config from '../../verify/config.js'
import MallConfig from '../../../common/js/Config'
import Toast from '../../../common/js/toast'
export default {
  name: 'AddBankCard',
  data() {
    return {
      cardNumber: '',
      phone: '',
      realName: '',
      bankIndex: 0,
      bankList: Config.BANK_LIST,
    }
  },
  mixins: [Toast],
  onLoad() {

  },
  computed: {
    userInfo() {
      return this.$store.state.userInfo
    }
  },
  methods: {
    handleBankChange(e) {
      this.bankIndex = e.target.value
    },
    upload() {
      let self = this
      console.log(this.cardNumber + ' ' + this.phone + ' ' + this.bankList[this.bankIndex])
      if (self.cardNumber.length === 0) {
        self.toast({
          desc: '请填写银行卡号'
        })
        return
      }

      if (self.phone.length !== 11) {
        self.toast({
          desc: '请填写预留手机号'
        })
        return
      }

      if (self.realName === '') {
        self.toast({
          desc: '请填写真实姓名'
        })
        return
      }

      if (self.bankIndex === 0) {
        self.toast({
          desc: '请选择银行卡银行'
        })
        return
      }

      let postData = {
        bank_bind_phone: self.phone,
        bank_card_name: self.bankList[self.bankIndex],
        bank_card_number: self.cardNumber,
        bank_card_username: self.realName,
        user_key: self.userInfo.user_key
      }
      self.toast({
        type:'loading'
      })
      self.$Phttp.post(MallConfig.JAVA_SAAS_URLS.addBankCard, postData).then(res=> {
        res = res.data
        self.toast(true)
        if (res.code === 0) {
          self.toast({
            desc: '添加成功'
          })
          setTimeout(()=>{
            uni.navigateBack()

          }, 800)
        } else {
          self.toast({
            desc: '添加失败'
          })
        }
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
  height: calc(100vh - 0rpx);
  background: #f4f4f4;
  position: relative;
  .text-head {
    width: 100%;
    margin-left: 20rpx;
    color: #999;
    font-size: 24rpx;
    height: 60rpx;
    line-height: 60rpx;
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
      width: 310rpx;
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
      width: 500rpx;
      height: 40rpx;
      text-align: center;
    }
    .row-input {
      height: 96rpx;
      width: 100%;
      text-align: right;
      margin-right: 36rpx;
      font-size: 30rpx;
    }
    .code-button {
      color: #1677FF;
      border: 1rpx solid #1677FF;
      font-size: 18rpx;
      font-weight: 400;
      width: 300rpx;
      height: 50rpx;
      line-height: 50rpx;
      border-radius: 25rpx;
      margin-right: 36rpx;
      text-align: center;
    }
    .row-picker {
      width: 100%;
      //   height: 96rpx;
      line-height: 96rpx;
      text-align: right;
      margin-right: 20rpx;
      font-size: 30rpx;
    }
    .nav-icon {
      width: 32rpx;
      height: 32rpx;
      margin-right: 20rpx;
    }
  }
}

.bottom {
  background-image: linear-gradient(270deg, #f00a1e 0%, #f08414 100%);
  border-radius: 50rpx;
  width: 666rpx;
  height: 88rpx;
  line-height: 88rpx;
  color: #fff;
  font-size: 32rpx;
  font-weight: 400;
  align-items: center;
  text-align: center;
  // position: absolute;
  // bottom: 50rpx;
  margin: 50rpx 0;
}

.active-item-text {
  color: #f00a1e;
}
</style>
