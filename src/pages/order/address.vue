<template>
  <view>
    <view class="cu-list menu-avatar">
      <view class="cu-item" :class="modalName == 'move-box-' + index ? 'move-cur' : ''" v-for="(item, index) in list" :key="index" @touchstart="ListTouchStart" @touchmove="ListTouchMove" @touchend="ListTouchEnd" :data-target="'move-box-' + index">
        <view class="address-container" @click="setAddressDefault(item.id, item.is_default, index)">
          <view class="row-container">
            <view class="title one-line-dot">{{ item.name }}</view>
            <view class="title" style="margin-left: 40upx;margin-right: 20upx;">{{ item.mobile }}</view>
            <view class="cu-tag tag round bg-red" style="margin-top: 10upx;" v-if="item.is_default">默认</view>
            <view class="cu-tag tag round bg-blue" style="margin-top: 10upx;" v-if="item.tag">{{ item.tag }}</view>
          </view>
          <view class="row-container">
            <view class="address one-line-dot">{{ item.province }}{{ item.city }}{{ item.area }}{{ item.address }}</view>
          </view>
          <view class="icon-edit to-edit" @click.stop="toDetail(item.id)"></view>
        </view>
        <view class="move">
          <!-- <view class="bg-grey" @click="setAddressDefault(item.id)">默认</view> -->
          <view class="bg-red" @click="delAddress(item.id)">删除</view>
        </view>
      </view>
    </view>
    <view class="empty-page" v-if="list.length == 0">
      <image src="/static/icon_empty.png" class="empty" />
      <view style="margin-top: 20upx;color: black;">暂无可选地址，请新增地址～</view>
    </view>
    <button class="add-address" @click="addAddress()">
      <image src="/static/ic_add2.png" />
      <text>新增地址</text>
    </button>
  </view>
</template>
<script>
import Config from '../../common/js/Config.js'
import Util from '../../common/js/util.js'
export default {
  data() {
    return {
      modalName: null,
      listTouchStart: 0,
      listTouchDirection: null,
      list: [],
    }
  },
  computed: {
    userInfo() {
      return this.$store.state.userInfo
    },
    group() {
      return this.$store.state.group
    },
    ads() {
      return this.$store.state.ads
    },
    globalI() {
      return this.$store.state.globalI
    },
  },
  onLoad() {
    console.log('onload')
    this.$event.$on('refreshAddress', ({}) => {
      this.ist = []
      this.getList()
    })
  },
  onShow() {
    console.log('onShow')
    this.getList()
  },
  methods: {
    // ListTouch触摸开始
    ListTouchStart(e) {
      this.listTouchStart = e.touches[0].pageX
    },

    // ListTouch计算方向
    ListTouchMove(e) {
      this.listTouchDirection = e.touches[0].pageX - this.listTouchStart > 0 ? 'right' : 'left'
    },

    // ListTouch计算滚动
    ListTouchEnd(e) {
      if (this.listTouchDirection == 'left') {
        this.modalName = e.currentTarget.dataset.target
      } else {
        this.modalName = null
      }
      this.listTouchDirection = null
    },
    toDetail(user_address_key) {
      uni.navigateTo({
        url: '/pages/order/addAddress?id=' + user_address_key,
      })
    },
    getList() {
      let self = this
      let data = {}
      if (Util.containsKey(self.userInfo, 'user_key')) {
        data = Object.assign(data, {
          user_key: self.userInfo.user_key,
        })
      }
      if (Util.containsKey(self.userInfo, 'uid')) {
        self.userInfo.uid && (data.saas_userid = self.userInfo.uid)
        ;(self.userInfo.customer_key || self.userInfo.customer_key === 0) && (data.customer_key = self.userInfo.customer_key)
      }
      self.$Phttp.post(Config.JAVA_SAAS_URLS.getAddresses, data).then(res => {
        res = res.data
        if (res.code === 0) {
          self.list = res.data
        }
      })
    },
    addAddress() {
      console.log(slef)
      uni.navigateTo({
        url: '/pages/order/addAddress',
      })
    },
    setAddressDefault(user_address_key, is_default, index) {
      let self = this
      console.log(self.modalName)
      if ('move-box-' + index === self.modalName) return
      if (is_default === '1' || is_default === 1) {
        uni.navigateBack()
        return
      }

      let postData = {}
      self.userInfo.uid && (postData.user_key = self.userInfo.uid)
      user_address_key && (postData.user_address_key = user_address_key)

      self.$Phttp.post(Config.JAVA_SAAS_URLS.setAddressDefault, postData).then(res => {
        res = res.data
        if (res.code === 0) {
          uni.navigateBack()
        }
      })
    },
    delAddress(user_address_key) {
      let self = this
      let postData = {
        user_address_key: user_address_key,
      }
      if (Util.containsKey(self.userInfo, 'user_key')) {
        postData = Object.assign(postData, {
          user_key: self.userInfo.user_key,
        })
      }
      if (Util.containsKey(self.userInfo, 'uid')) {
        postData = Object.assign(postData, {
          saas_userid: self.userInfo.uid,
          customer_key: self.userInfo.customer_key,
        })
      }
      uni.showModal({
        title: '提示',
        content: '确定删除该地址？',
        confirmColor: '#06C00C',
        success(res) {
          console.log(res)
          if (res.confirm) {
            self.$Phttp.post(Config.JAVA_SAAS_URLS.delAddress, postData).then(res => {
              res = res.data
              if (res.code === 0) {
                self.list = []
                self.getList()
              }
            })
          }
        },
      })
    },
  },
}
</script>

<style>
.row-container {
  width: auto;
  margin-right: 50px;
}
.cu-list.menu-avatar > .cu-item {
  height: 150upx;
  padding: 0upx;
  border-bottom: 1upx solid #f6f6f6;
}
.address-container {
  width: 710upx;
  padding: 20upx 15upx;
  display: flex;
  flex-direction: column;
}
.title {
  font-size: 34upx;
  font-weight: bold;
  color: black;
  margin-bottom: 10upx;
}
.tag {
  font-size: 24upx;
  min-width: 80upx;
  height: 38upx;
}
.address {
  color: #666;
  font-size: 26upx;
}
.to-edit {
  position: absolute;
  font-size: 36upx;
  color: black;
  right: 40upx;
  top: 30upx;
  zoom: 1.5;
}
.empty-page {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.empty {
  width: 350upx;
  height: 350upx;
  margin-top: 200upx;
}
.add-address {
  width: calc(100% - 200rpx);
  height: 80rpx;
  left: 100rpx;
  bottom: 20rpx;
  background: #06c00c;
  position: fixed;
  border-radius: 40rpx;
  display: flex;
  justify-content: center;
  align-items: center;
}
.add-address image {
  width: 28rpx;
  height: 28rpx;
}
.add-address text {
  font-size: 28rpx;
  color: #fff;
  margin-left: 10rpx;
}
</style>
