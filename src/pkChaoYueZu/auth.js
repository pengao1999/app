import Util from '../common/js/util.js'
export default {
	data() {
		return {
			dialogTitle: "",
			dialogContent: "",
			showDialog: false
		}
	},
	computed: {
		isRegister() {
			return this.$store.state.isRegister
		},
		userInfo() {
			return this.$store.state.userInfo
		}
	},
	methods: {
		checkLogin: function() {
			// #ifdef APP-PLUS
			if (this.userInfo === undefined || !Util.containsKey(this.userInfo, 'user_key')) {

				uni.reLaunch({
					url: '/pkUserInfo/info/login',
					animationType: 'slide-in-bottom',
					animationDuration: 500
				})
				return false
			}
			// #endif
			return true
		},
		confirmAuth() {
			this.showDialog = false
			uni.navigateTo({
				url: '/pkChaoYueZu/info/appLogin'
			})
		},
		hasBindTel() {
			let self = this
			if (Util.containsKey(self.userInfo, "tel")) return true

			uni.setStorageSync("dialogData", {
				title: '提示',
				desc: '您还没绑定手机号哦～',
				page: '/pkChaoYueZu/info/phone'
			})
			uni.navigateTo({
				url: '/pkChaoYueZu/dialog/popup'
			})
		},
		hasRegister() {
			let self = this
			if (self.isRegister || self.userInfo.user_key) return true
			// self.dialogTitle = "提示"
			// self.dialogContent = "该功能需要用户登录后使用，请确认是否登录？"
			// self.showDialog = true
			uni.setStorageSync("dialogData", {
				title: '提示',
				desc: '该功能需要用户登录后使用，请确认是否登录？',
				page: '/pkChaoYueZu/info/appLogin'
			})
			uni.navigateTo({
				url: '/pkChaoYueZu/dialog/popup'
			})
		}
	}
}
