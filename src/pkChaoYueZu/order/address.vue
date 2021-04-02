<template>
  <view>
    <radio-group class="cu-list menu-avatar">

<!--      <radio-group class="bg-white">-->
        <view class="cu-item" style="margin-bottom: 20upx;" :class="modalName == 'move-box-' + index ? 'move-cur' : ''" v-for="(item, index) in list" :key="index" :data-target="'move-box-' + index">
          <div class="coloum-container">
            <view class="address-container" @click="setAddressDefault(item.user_address_key, item.is_default, index)">
              <view class="row-container">
                <view class="title one-line-dot">{{ item.name }}</view>
                <view class="title" style="margin-left: 40upx;margin-right: 20upx;">{{ item.mobile }}</view>
                <view class="cu-tag tag round bg-blue" style="margin-top: 10upx;" v-if="item.is_default">默认</view>
                <!-- <view class="cu-tag tag round bg-blue" style="margin-top: 10upx;" v-if="item.tag">{{ item.tag }}</view> -->
              </view>
              <view class="row-container">
                <view class="address one-line-dot">{{ item.province }}{{ item.city }}{{ item.address }}</view>
              </view>
              <view class="icon-delete to-edit" style="font-size: 26upx;" @click.stop="delAddress(item.user_address_key)"></view>
            </view>
            <!-- <div style="height: 80upx;border-top: 1px solid #F8F8F8;">
              <div @click="toDetail(item.user_address_key)" style="float: right;margin-right: 30upx;color: #999999;font-style: 28upx;margin-top: 20upx;">编辑</div>
            </div> -->
            <view style="height: 80upx;border-top: 1px solid #F8F8F8; display: flex; flex-direction: row; align-items: center; justify-content: space-between;">
              <view>
                <radio :checked="item.is_default" class="blue" style="margin-right: 10rpx;transform:scale(0.8)" @click="handleDefault(item.user_address_key, item.is_default, index)" color="#FB2622"></radio>
                <text>设为默认</text>
              </view>
              <view @click="toDetail(item.user_address_key)" style="float: right;margin-right: 30upx;color: #999999;font-style: 28upx;">编辑</view>
            </view>
          </div>
  <!--        <view class="move">-->
  <!--          <view class="bg-red" @click="delAddress(item.id)">删除</view>-->
  <!--        </view>-->
        </view>
<!--      </radio-group>-->
    </radio-group>
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
        ifCheck: false,
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
          url: '/pkChaoYueZu/order/addAddress?user_address_key=' + user_address_key,
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
          ;(self.userInfo.customer_id || self.userInfo.customer_id === 0) && (data.customerId = self.userInfo.customer_id)
        }
        self.$Phttp.post(Config.JAVA_SAAS_URLS.getAddresses, data).then(res => {
          res = res.data
          if (res.code === 0) {
            res.data.forEach((item, index) => {
              if (item.is_default === 1) {
                item.is_default = true
              } else {
                item.is_default = false
              }
            })
            self.list = res.data
          }
        })
      },
      addAddress() {
        uni.navigateTo({
          url: '/pkChaoYueZu/order/addAddress',
        })
      },
      handleDefault(user_address_key, is_default, index){
        let self = this
        if (is_default === '1' || is_default === 1) {
          return
        }
        let postData = {}
        self.userInfo.user_key && (postData.user_key = self.userInfo.user_key)
        user_address_key && (postData.address_key = user_address_key)
        self.$Phttp.post(Config.JAVA_SAAS_URLS.setAddressDefault, postData).then(res => {
          res = res.data
          if (res.code === 0) {
            self.getList()
          }
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
        self.userInfo.user_key && (postData.user_key = self.userInfo.user_key)
        user_address_key && (postData.address_key = user_address_key)

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
            customerId: self.userInfo.customer_id,
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
    }
  }
</script>

<style>
  page {
    background: #F8F8F8;
  }
  .row-container {
    width: auto;
    margin-right: 50px;
  }
  .cu-list.menu-avatar > .cu-item {
    height: 250upx;
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
    /* background: #06c00c; */
    background:linear-gradient(180deg,rgba(82,171,252,1) 0%,rgba(6,135,255,1) 100%);
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
