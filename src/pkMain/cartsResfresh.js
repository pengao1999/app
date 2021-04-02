import Config from '../common/js/Config.js'
export default {
	methods: {
		resfreshCartNum: async function(user_key, leader_key, success) {
			let self = this
			let data = {
				user_key : user_key,
				leader_key : leader_key
			}
			self.$http.post(Config.URLS.getCartNum, data,).then((res) => {
				if (res.data.code === 0) {
					if (res.data.data!==0) {
						uni.setTabBarBadge({
							index: 2,
							text: res.data.data.toString()
						})
					} else {
						uni.removeTabBarBadge({
							index: 2
						})
					}
					
				}
				
				success(res)
			})
		}
	}
}