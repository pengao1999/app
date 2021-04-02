<template>
  <view>
    <view class="col">
      <view class="col-name">收货人</view>
      <input v-model="name" placeholder="请输入" @blur="iosBlur" />
    </view>
    <view class="col">
      <view class="col-name">手机号码</view>
      <input v-model="mobile" type="number" placeholder="请输入" maxlength="11" @blur="iosBlur" />
    </view>
    <view class="col">
      <view class="col-name">所在地区</view>
      <!--  #ifdef MP-WEIXIN -->
      <picker @change="bindPickerChange" mode="region">
        <input disabled="false" :value="province + ' ' + city + ' ' + area" placeholder="请输入" @blur="iosBlur" />
      </picker>
      <!--  #endif -->
      <!--  #ifdef H5 -->
      <input disabled @click="showMulLinkageThreePicker" :value="province + ' ' + city + ' ' + area" placeholder="请输入" @blur="iosBlur" />
      <!--  #endif -->
    </view>
    <view class="col" style="height: 160rpx;">
      <view class="col-name" style="margin-top: -40rpx;">详细地址</view>
      <textarea v-model="address" placeholder="请输入" />
    </view>
    <view class="col">
      <view class="col-name">标签</view>
      <view class="cu-tag tag round" :key="index" v-for="(tag, index) in tags" @click="tagClick(index)" :class="index == tagIndex ? 'bg-blue' : 'bg-gray'">{{ tag }}</view>
    </view>
    <view class="default">
      <text class="col-name">设置默认地址</text>
      <view class="content">
        <text class="text">提醒：实际下单以默认地址为准</text>
        <switch style="zoom: 0.8;" :checked="is_default == 1" @change="switchChange" />
      </view>
    </view>
    <!-- <view class="default">
   <text class="col-name">设置为默认电话</text>
   <view class="content">
     <text class="text">提醒：设置为用户默认电话，以便平台沟通联系</text>
     <switch style="zoom: 0.8;" :checked="is_defalut_phone==1" @change="switchPhoneChange" />
   </view>
 </view> -->
    <button class="add-address" @click="saveAddress(true, {})">
      <text>保存</text>
    </button>
    <!--  #ifdef H5 -->
    <mpvue-city-picker :themeColor="themeColor" ref="mpvueCityPicker" :pickerValueDefault="cityPickerValueDefault" @onConfirm="regionConfirm"></mpvue-city-picker>
    <!--  #endif -->
  </view>
</template>
<script>
import Config from '../../common/js/Config.js'
import QQMapWX from '../../common/third/qqmap/qqmap-wx-jssdk.js'
import Util from '../../common/js/util.js'
import Toast from '../../common/js/toast.js'
import iosBlur from '../../common/js/iosBlur.js'

import mpvueCityPicker from '@/components/mpvue-citypicker/mpvueCityPicker.vue'

var qqMap = new QQMapWX({
  key: Config.QQMAPKEY, // 必填
})
export default {
  data() {
    return {
      is_defalut_phone: 0,
      id: -1,
      name: '',
      mobile: '',
      province: '',
      city: '',
      area: '',
      address: '',
      is_default: 1,
      areaText: '',
      tags: ['家', '公司', '学校'],
      tagIndex: -1,
      themeColor: '#007AFF',
      cityPickerValueDefault: [18, 0, 0],
    }
  },
  components: {mpvueCityPicker},
  computed: {
    userInfo() {
      console.log(this.$store.state.userInfo)
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
  mixins: [Toast, iosBlur],
  onLoad(options) {
    // 解决ios兼容性
    // #ifdef H5
    document.body.addEventListener('focusout', () => {
      this.iosBlur()
    })
    document.body.addEventListener('focusin', () => {
      this.iosBlur()
    })
    // #endif

    if (options.id) {
      this.id = parseInt(options.id)
      this.getDetail(this.id)

      if (Util.containsKey(this.userInfo, 'user_key') && this.userInfo.tel) {
        this.is_defalut_phone = 0
      } else {
        this.is_defalut_phone = 1
      }
    } else {
      this.mobile = this.userInfo.tel
    }
  },
  methods: {
    getDetail(user_address_key) {
      let self = this
      let postData = {
        user_address_key: user_address_key,
      }
      self.$Phttp.post(Config.JAVA_SAAS_URLS.addressDetail, postData).then(res => {
        res = res.data
        if (res.code === 0) {
          self.name = res.data.name
          self.mobile = res.data.mobile
          self.province = res.data.province
          self.city = res.data.city
          self.area = res.data.area
          self.address = res.data.address
          self.is_default = res.data.is_default
          self.tags.forEach((tag, index) => {
            if (tag === res.data.tag) {
              self.tagIndex = index
            }
          })
        }
      })
    },
    showMulLinkageThreePicker() {
      console.log('show')
      this.$refs.mpvueCityPicker.show()
    },
    saveAddress(getLocation = true, location) {
      let self = this
      if (getLocation) {
        self.getCoordinate(self.province + self.city + self.area + self.address)
        return
      }
      if (!/^(1[3-9])\d{9}$/.test(self.mobile)) {
        self.toast({
          desc: '请填写正确号码',
        })
        return
      }
      if (self.name === '' || self.province === '' || self.address === '') {
        self.toast({
          desc: '请补充完整信息',
        })
        return
      }

      let data = {
        name: self.name,
        mobile: self.mobile,
        province: self.province,
        city: self.city,
        area: self.area,
        address: self.address,
        is_default: self.is_default,
        tag: self.tagIndex >= 0 ? self.tags[self.tagIndex] : '',
        lat: location ? location.lat : '',
        lng: location ? location.lng : '',
        is_defalut_phone: self.is_defalut_phone,
      }
      if (Util.containsKey(self.userInfo, 'user_key')) {
        data = Object.assign(data, {
          user_key: self.userInfo.user_key,
        })
      }
      if (Util.containsKey(self.userInfo, 'uid')) {
        self.userInfo.saas_userid && (data.uid = self.userInfo.saas_userid)
        ;(self.userInfo.customer_key || self.userInfo.customer_key === 0) && (data.customer_key = self.userInfo.customer_key)
      }
      let postUrl = Config.JAVA_SAAS_URLS.addAddress
      if (self.id !== -1) {
        postUrl = Config.JAVA_SAAS_URLS.editWxAddress
        data = Object.assign(data, {
          id: self.id,
        })
      }
      self.$Phttp.post(postUrl, data).then(res => {
        res = res.data
        if (res.code === 0) {
          uni.navigateBack()
          self.$event.$emit('refreshAddress', {})
        }
      })
    },
    regionConfirm(e) {
      let region = e.label.split('-')
      this.province = region[0]
      this.city = region[1]
      this.area = region[2]
    },
    getCoordinate: function(address) {
      var self = this
      qqMap.geocoder({
      	address: address,
      	success: (res) => {
      	},
      	fail: (res) => {
      	},
      	complete: (res) => {
      		if (res.status === 0) {
      			self.saveAddress(false, res.result.location)
      		} else {
      			self.saveAddress(false, {
      				lat: 0,
      				lng: 0
      			})
      		}

      	}
      });
    },
    switchPhoneChange(e) {
      this.is_defalut_phone = e.target.value ? 1 : 0
    },
    switchChange: function(e) {
      this.is_default = e.target.value ? 1 : 0
    },
    onCityClick(e) {
      console.log(JSON.stringify(e))
      this.province = e.province.label
      this.city = e.province.label
      this.area = e.county.label
      // this.townName=e.town.label;
      this.areaText = e.province.label + e.province.label + e.county.label
      this.togglePopup()
    },
    bindPickerChange(e) {
      this.province = e.detail.value[0]
      this.city = e.detail.value[1]
      this.area = e.detail.value[2]
      // this.townName=e.town.label;
      this.areaText = this.province + this.city + this.area
    },
    openPopup() {
      this.$refs.popup.open()
    },
    closePopup() {
      this.$refs.popup.close()
    },
    togglePopup() {
      this.$refs.popup.close()
    },
    tagClick(index) {
      this.tagIndex = index
    },
  },
}
</script>

<style>
.col {
  width: calc(100% - 30rpx);
  margin-left: 30rpx;
  height: 100rpx;
  display: flex;
  align-items: center;
  border-bottom: solid 1rpx #efefef;
}
.col .col-name {
  width: 140rpx;
  font-size: 28rpx;
  color: #333;
}
.col input {
  flex: 1;
  font-size: 30rpx;
  font-weight: 600;
  color: #222;
}
.col textarea {
  flex: 1;
  height: 100rpx;
  font-size: 28rpx;
  font-weight: 600;
  color: #222;
}
.tag {
  font-size: 26upx;
  min-width: 80upx;
  height: 46upx;
}
.default {
  width: calc(100% - 30rpx);
  margin-left: 30rpx;
  padding-top: 20rpx;
  padding-bottom: 20rpx;
  display: flex;
  flex-direction: column;
  border-bottom: solid 1rpx #efefef;
}
.default .col-name {
  font-size: 28rpx;
  color: #333;
}
.default .content {
  width: 100%;
  display: flex;
}
.default .content .text {
  width: calc(100% - 160rpx);
  font-size: 24rpx;
  color: #333;
}
.add-address {
  width: calc(100% - 200rpx);
  height: 80rpx;
  left: 100rpx;
  bottom: 20rpx;
  background: #06c00c;
  /* position: fixed; */
  position: absolute;
  border-radius: 40rpx;
  display: flex;
  justify-content: center;
  align-items: center;
}
.add-address text {
  font-size: 28rpx;
  color: #fff;
  margin-left: 10rpx;
}
</style>
