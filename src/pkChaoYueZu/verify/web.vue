<template>
  <!-- <web-view :src="urlRoot + pack + '/' +key + '?userKey=' + userInfo.user_key + '&state=' + state"></web-view> -->
  <web-view :src="webViewUrl"></web-view>
</template>

<script>
import Config from '../../common/js/Config.js'
export default {
  name: "web",
  data() {
    return {
      // urlRoot: "http://fintech.test.appkubes.com/#/pages/",
      urlRoot: Config.FINTECH_SERVER + '/#/pages/',
      key: "",
      pack: "",
      state: '',
      url: '',
      contactList: 'empty'
    }
  },
  computed: {
    userInfo() {
      return this.$store.state.userInfo
    },
    webViewUrl() {
      let returnUrl = ''
      if (this.url) {
        returnUrl = this.url
      } else {
        returnUrl = this.urlRoot + this.pack + '/' + this.key + '?userKey=' + this.userInfo.user_key
      }
      return returnUrl
    }
  },
  onLoad(options) {
    this.key = options.key
    this.pack = options.pack
    this.state = options.state
    this.url = options.url

	if (options.title) {
		uni.setNavigationBarTitle({
			title: options.title
		})
	}
    // this.getContacts()
  },
  onShow() {
  	console.log(this.returnUrl)
  },
  methods: {
    getNameNPhone(contacts) {
      let returnList = []
      contacts.forEach(element => {
        const item = {
          name: element.displayName,
          mobile: element.phoneNumbers[0].value
        }
        returnList.push(item)
      });
      return returnList
    },
    getContacts: function () {
      let self = this
      // 获取通讯录对象
      plus.contacts.getAddressBook(plus.contacts.ADDRESSBOOK_PHONE, function (addressbook) {
        console.log('获取通讯录对象成功')
        // 查找联系人  
        addressbook.find(["displayName", "phoneNumbers"], function (contacts) {
          console.log('获取联系人成功')
          let returnList = []
          contacts.forEach(element => {
            let item = {
              name: element.displayName,
              mobile: element.phoneNumbers[0].value
            }
            returnList.push(item)
          })
          console.log('list', JSON.stringify(returnList))
          self.contactList = returnList

        }, function () {
          uni.showToast({
            title: '获取联系人失败',
            duration: 2000
          })
        }, { multiple: true });
      }, function (e) {
        uni.showToast({
          title: '获取通讯录对象失败:' + e.message,
          duration: 2000
        })
      });
    }
  }
}
</script>

<style scoped>
</style>
