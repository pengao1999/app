import Util from '../common/js/util.js'
export default {
	computed: {
		isRegister() {
			return this.$store.state.isRegister
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
		hasRegister() {
			let self = this
			if (self.isRegister) return true
			uni.showModal({
				content: '该功能需要用户登录后使用，请确认是否登录？',
				confirmColor: "#1dc422",
				success: (res) => {
					console.log(res)
					if ( res.confirm ) {
						uni.navigateTo({
							url: '/pkUserInfo/info/wxLogin'
						})
					} else {

					}
					return false
				}
			})
		}
	}
}
