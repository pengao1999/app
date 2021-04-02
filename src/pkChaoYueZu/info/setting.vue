<template>
  <div>
    <uni-list>
      <uni-list-item title="编辑收货地址" @onClick="toAddress" />
      <uni-list-item title="编辑个人信息" @onClick="toInfoEditor" />
      <!-- <uni-list-item title="修改密码" /> -->
    </uni-list>
    <div
      class="fixed-bttom safe-area bg-white justify-center"
      style="padding: 12upx 0;width: 100%;display: flex;"
    >
      <button
        class="cu-btn round text-white bg-blue"
        @click="handleLogout"
        style="width: 622upx;height: 80upx;"
      >退出登录</button>
    </div>
    <myDialog
      title="退出登录"
      content="您确定要退出登录吗?"
	  confirmColor="var(--blue)"
      :dialog-show="logoutDialog"
      @cancelButton="logoutDialog=false"
      @confirmButton="logoutReal"
    ></myDialog>
  </div>
</template>

<script>
import Toast from '@/common/js/toast'
import uniList from '@/components/uni-list/uni-list.vue'
import uniListItem from '@/components/uni-list-item/uni-list-item.vue'

import { mapMutations } from 'vuex'
export default {
  name: "setting",
  data() {
    return {
      logoutDialog: false
    }
  },
  components: {
    uniList, uniListItem
  },
  mixins: [Toast],
  methods: {
    ...mapMutations(['logout']),
    handleLogout() {
      let self = this
      self.logoutDialog = true
    },
    logoutReal() {
      let self = this
      self.logout()
      self.toast({
        desc: '您已退出登录～'
      })
      uni.navigateBack();
    },
    toAddress() {
      uni.navigateTo({
        url: '/pkChaoYueZu/order/address'
      })
    },
    toInfoEditor() {
      uni.navigateTo({
        url: '/pkChaoYueZu/info/infoEditor'
      })
    }
  }
}
</script>

<style scoped>
page {
  background: #f8f8f8;
}
</style>
