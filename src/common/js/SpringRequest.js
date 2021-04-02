import Config from './Config.js'
import store from '../../store'
import Toast from '../../common/js/toast.js'
module.exports = {
	post: function(url, data, header, cache = false) {
		//console.log(url)
		data = Object.assign(data, {
			app_key: "123",
			is_register: store.state.isRegister,
			is_super_plat: process.env.VUE_APP_SUPER_PLATFORM_MODE
		})

		// header = header || 'application/x-www-form-urlencoded'
		header = header || 'application/json'
		return new Promise((succ, error) => {
			uni.request({
				url: url,
				data: data,
				method: 'POST',
				header: {
					'content-type': header,
					'X-TOKEN': store.state.point_token,
					'X-PLATFORM': store.state.uuid
				},
				success: function(result) {
					succ.call(self, result)
					if (cache) {
						uni.setStorage({
							key: url + JSON.stringify(data),
							data: JSON.stringify(result)
						})
					}
				},
				fail: function(e) {
					//console.log('fail:' + JSON.stringify(e))
					uni.showToast({
						title: '网络异常～',
						image: '',
						icon: 'none',
					})
					if (cache) {
						let res = uni.getStorageSync(url + JSON.stringify(data))
						if (res) {
							res = JSON.parse(res)
							succ.call(self, res)
							return
						} else {
							error.call(self, e)
						}
					}
					error.call(self, e)

				},
			})
		})
	},
	get: function(url, data, header, cache = false) {
		//console.log(url, data)
		header = header || 'application/x-www-form-urlencoded'
		return new Promise((succ, error) => {
			uni.request({
				url: url,
				data: data,
				method: 'GET',
				header: {
					'content-type': header,
					'x-token': store.state.point_token,
					'X-UUID': store.state.uuid
				},
				success: function(result) {
					if (cache) {
						uni.setStorageSync(url, result)
					}
					succ.call(self, result)
				},
				fail: function(e) {
					// uni.showModal({
					// 	title: "提示",
					// 	content: JSON.stringify(uni.getStorageSync(url))
					// })
					if (cache) {
						let res = uni.getStorageSync(url)
						if (res) {
							succ.call(res)
							return
						} else {
							error.call(self, e)
						}
					}
					error.call(self, e)
					var pages = getCurrentPages()
					var page = pages[pages.length - 1].route
					uni.reLaunch({
						url: '/pages/error',
					})
				},
			})
		})
	},
}
