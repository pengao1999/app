import Config from '../common/js/Config.js'
export default {
	data() {
		return {
			isRereshing: false
		}
	},
	methods: {
		resfreshCartNum: async function(user_key, success) {
			let self = this
			if (self.isRereshing) return
			self.isRereshing = true
			let data = {
				user_key : user_key,
				is_super_plat: true
			}
			self.$Phttp.post(Config.JAVA_SAAS_URLS.getCartNum, data).then((res) => {
				self.isRereshing = false
				if (res.data.code === 0) {
					if (res.data.data) {
						uni.setTabBarBadge({
							index: 2,
							text: res.data.data.toString()
						})
					} else {
						uni.removeTabBarBadge({
							index: 2,
							text: 0
						})
					}
				}
				success(res)
			})
		}
	}
}
