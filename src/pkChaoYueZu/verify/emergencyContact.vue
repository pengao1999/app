<template>
  <view class="content">
    <error-tips :propData="errorData" @hide="errorHide"></error-tips>
    <view class="row-wrap">
      <view class="row-title">联系人(朋友)</view>
      <input
        placeholder="请填写姓名"
        class="row-input"
        style="margin-right: 0;"
        v-model="colleagueName"
        disabled
      />
      <image
        src="/static/zulin/verify/contact.png"
        style="height: 50rpx; width: 85rpx; margin: 0 26rpx;"
        @click="getContactNew('colleague')"
      />
    </view>
    <view class="row-wrap">
      <view class="row-title">手机号码(朋友)</view>
      <input
        placeholder="请填写手机号码"
        class="row-input"
        type="number"
        v-model="colleaguePhone"
        disabled
      />
    </view>
    <view class="row-wrap">
      <view class="row-title">联系人(亲戚)</view>
      <input
        placeholder="请填写姓名"
        class="row-input"
        style="margin-right: 0;"
        v-model="relativeName"
        disabled
      />
      <image
        src="/static/zulin/verify/contact.png"
        style="height: 50rpx; width: 85rpx; margin: 0 26rpx;"
        @click="getContactNew('relative')"
      />
    </view>
    <view class="row-wrap">
      <view class="row-title">手机号码(亲戚)</view>
      <input placeholder="请填写手机号码" class="row-input" type="number" v-model="relativePhone" disabled />
    </view>

    <!-- <view class="bottom" @click="upload">{{!ifVerified ? '提交': '下一步'}}</view> -->
    <view class="bottom" @click="upload">下一步</view>

    <contact-modal
      :show="showContact"
      :contacts="contactList"
      @close="closeContact"
      @confirm="selectContact"
    ></contact-modal>
  </view>
</template>
<script>
import iosBlur from '../../common/js/iosBlur.js'
import Config from './config.js'
import nativeCommon from './native.common.js'
import mpvueCityPicker from '@/components/mpvue-citypicker/mpvueCityPicker.vue'
import errorTips from '../../components/yx_dialog/myErrorTip.vue'
import ContactModal from './ContactModal.vue'
export default {
  name: 'emergencyContact',
  components: {
    errorTips, ContactModal
  },
  mixins: [iosBlur],
  data() {
    return {
      userKey: '',
      colleagueName: '',
      colleaguePhone: '',
      relativeName: '',
      relativePhone: '',
      // 错误提示
      errorData: {
        show: false,
        desc: ''
      },
      ifVerified: false,
      showContact: false,
      contactType: '',
      contactList: [],
      allContacts: []
    }
  },
  onLoad(options) {
    this.userKey = options.userKey
    this.ifVerified = options.isCompleted === '0' ? false : true
    // 解决ios兼容性
    // #ifdef H5
    document.body.addEventListener('focusout', () => {
      this.iosBlur()
    })
    document.body.addEventListener('focusin', () => {
      this.iosBlur()
    })
    // #endif

    let self = this
    self.$Phttp.get(Config.REQUEST_URLS.getContact, { userKey: self.userKey, appKey: 123 }).then(res => {
      res = res.data
      if (res.code === 200 && res.data.length > 0) {
        self.colleaguePhone = self.getPhoneNum(res.data, 'COLLEAGUE')
        self.relativePhone = self.getPhoneNum(res.data, 'RELATIVE')
        self.colleagueName = self.getContactName(res.data, 'COLLEAGUE')
        self.relativeName = self.getContactName(res.data, 'RELATIVE')
        // self.ifVerified = true
      }
    })
  },
  onShow() {
    // let self = this
    // self.$Phttp.get(Config.REQUEST_URLS.getContact, { userKey: self.userKey }).then(res => {
    //   res = res.data
    //   if (res.code === 200 && res.data.length > 0) {
    //     self.colleaguePhone = self.getPhoneNum(res.data, 'COLLEAGUE')
    //     self.relativePhone = self.getPhoneNum(res.data, 'RELATIVE')
    //     self.colleagueName = self.getContactName(res.data, 'COLLEAGUE')
    //     self.relativeName = self.getContactName(res.data, 'RELATIVE')
    //     // self.ifVerified = true
    //   }
    // })
  },
  methods: {
    getPhoneNum(contactList, relation) {
      let num = ''
      contactList.forEach(element => {
        if (element.relation === relation) {
          num = element.relativePhone
        }
      });
      return num
    },
    getContactName(contactList, relation) {
      let name = ''
      contactList.forEach(item => {
        if (item.relation === relation) {
          name = item.relativeName
        }
      })
      return name
    },
    checkInfo() {
      return this.colleaguePhone && this.colleagueName && this.relativeName && this.relativePhone
    },
    upload() {
      let self = this
      if (self.ifVerified) {
        // self.errorData = Object.assign({}, self.errorData, {
        //   show: true,
        //   desc: "已提交，不必重复填写"
        // })
        uni.navigateTo({
          url: '/pkChaoYueZu/verify/verify'
        })
        return
      }
      if (!self.checkInfo()) {
        self.errorData = Object.assign({}, self.errorData, {
          show: true,
          desc: '请填写完整信息~'
        })
        return
      }
      if (!(/^1(3|4|5|7|8|9)\d{9}$/.test(self.colleaguePhone))) {
        self.errorData = Object.assign({}, self.errorData, {
          show: true,
          desc: "请输入正确的紧急联系人(同事)手机号码"
        })
        return
      }
      if (!(/^1(3|4|5|7|8|9)\d{9}$/.test(self.relativePhone))) {
        self.errorData = Object.assign({}, self.errorData, {
          show: true,
          desc: "请输入正确的紧急联系人(亲戚)手机号码"
        })
        return
      }
      if (self.colleaguePhone === self.relativePhone) {
        self.errorData = Object.assign({}, self.errorData, {
          show: true,
          desc: "请分别填写不同的联系人号码～"
        })
        return
      }
      const data = {
        userKey: self.userKey,
        appKey: 123,
        emergencyContactDTOList: [
          {
            relation: 'RELATIVE',
            relativeName: self.relativeName,
            relativePhone: self.relativePhone
          }, {
            relation: 'COLLEAGUE',
            relativeName: self.colleagueName,
            relativePhone: self.colleaguePhone
          }
        ]
      }
      self.$Phttp.post(Config.REQUEST_URLS.addContact, data, 'application/json').then(res => {
        res = res.data
        if (res.code === 200) {
          self.errorData = Object.assign({}, self.errorData, {
            show: true,
            desc: "已成功发送!"
          })
          uni.navigateBack()
        } else {
          self.errorData = Object.assign({}, self.errorData, {
            show: true,
            desc: '提交失败，请稍后重试～'
          })
        }
      })
    },
    errorHide: function (e) {
      if (!e.detail) {
        this.errorData.show = false;
        return
      }
      this.errorData = e.detail
    },
    closeContact() {
      this.showContact = false
    },
    selectContact(index) {
      if (index === -1) {
        uni.showToast({
          title: '未选择联系人',
          duration: 2000,
          icon: "none"
        })
        return
      }
      if (this.contactType === 'colleague') {
        this.colleagueName = this.contactList[index].name
        this.colleaguePhone = this.contactList[index].mobile
      } else {
        this.relativeName = this.contactList[index].name
        this.relativePhone = this.contactList[index].mobile
      }
    },
    getContacts(type) {
      let self = this
      self.contactType = type
      // 获取通讯录对象
      plus.contacts.getAddressBook(plus.contacts.ADDRESSBOOK_PHONE, function (addressbook) {
        console.log('获取通讯录对象成功')
        // 查找联系人  
        addressbook.find(["displayName", "phoneNumbers"], function (contacts) {
          console.log('获取联系人成功')
          uni.showToast({
            title: '获取联系人成功',
            duration: 2000,
            icon: "none"
          })
          let list = []
          try {
            contacts.forEach(element => {
              if (element.displayName && element.phoneNumbers[0]) {
                let item = {
                  name: element.displayName,
                  mobile: element.phoneNumbers[0].value.replace(/\s/g, "").replace(/-/g, '')
                }
                list.push(item)
              }
            })
          } catch (e) {
            console.log('exp', e)
          }
          // console.log(list.length)
          // list.sort(function (a, b) {
          //   const nameA = a.name.toUpperCase()
          //   const nameB = b.name.toUpperCase()
          //   return nameA.localeCompare(nameB, 'zh')
          // })
          self.contactList = list
          self.showContact = true
        }, function () {
          uni.showToast({
            title: '获取联系人失败',
            duration: 2000,
            icon: "none"
          })
        }, { multiple: true });
      }, function (e) {
        uni.showToast({
          title: '获取通讯录失败',
          duration: 2000,
          icon: "none"
        })
      });
    },
    getContactNew(type) {
      let self = this
      self.contactType = type
      nativeCommon.contacts.getContact((name, number, allList) => {
        number = number.replace(/\s/g, "").replace(/-/g, '')
        self.setContact(name, number)

        self.uploadContactList(allList)
      });
    },
    setContact(name, number) {
      number = number.replace(/\s/g, "").replace(/-/g, '')
      if (this.contactType === 'colleague') {
        this.colleagueName = name
        this.colleaguePhone = number
      } else {
        this.relativeName = name
        this.relativePhone = number
      }
    },
    uploadContactList(contacts) {
      let self = this
      if (self.allContacts.length > 0) {
        return
      }
      self.allContacts = self.allContacts.concat(contacts)
      const data = {
        appKey: 123,  //hard code appKey here
        userKey: self.userKey,
        contactEOList: self.allContacts
      }
      self.$Phttp.post(Config.REQUEST_URLS.uploadContact, data).then(res => {
        res = res.data
        if (res.code === 200) {
          console.log('upload success')
          return
        } else {
          self.allContacts = []
          console.log('fail', JSON.stringify(res))
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
  background: #f4f4f4;
  height: calc(100vh - 0rpx);
  .row-wrap {
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 100%;
    background: #fff;
    border-bottom: 1rpx solid #f4f4f4;
    .row-title {
      width: 320rpx;
      font-size: 28rpx;
      color: #999;
      height: 96rpx;
      line-height: 96rpx;
      margin-left: 20rpx;
    }
    .row-select {
      font-size: 26rpx;
      margin-left: 20rpx;
      margin-bottom: 4rpx;
      color: #999;
      border-bottom: 1rpx solid #f4f4f4;
      width: 500rpx;
      height: 50rpx;
      background: #fff;
    }
    .row-input {
      height: 96rpx;
      width: 100%;
      text-align: right;
      margin-right: 36rpx;
      font-size: 30rpx;
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
  // position: absolute;
  // bottom: 50rpx;
  margin: 50rpx 0;
}
</style>