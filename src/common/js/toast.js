import Util from './util'
import Assign from 'object-assign'

export default {
	methods: {
		...Util, // 类型判断
		/**
		 * toast信息
		 * text——信息
		 * close——是否关闭
		 * type——类型
		 * time——显示时间
		 * */
		toast: function(options) {
			let config = {
				type: 'none'
			}
			if (this.isObject(options)) {
				config = Assign({}, config, options)
			}
			if (typeof options === 'boolean') {
				config = Assign({}, config, {
					close: options
				})
			}
			if (typeof options === 'string') {
				config = Assign({}, config, {
					desc: options
				})
			}
			let type = config.type || 'none'
			let time = config.time || 3000
			let text = config.desc || ''
			let close = config.close || false
			let callback = config.callback
			let path = config.path
			let img = ''
			if (type === 'warn') {
				img = '/static/cancel.png'
				time = 2000;
			}
			if (type === 'success') {
				img = '/static/success.png'
				time = 2000;
			}
			if (type === 'loading') {
				time = config.time || 3000
			}
			// 关闭
			if (close) {
				uni.hideToast()
			}

			if (text === '' && type === 'none') {
				return
			}
			// #ifndef MP-ALIPAY
			let cfg = {
				icon: type,
				title: text,
				duration: time
			}
			// #endif

			// #ifdef MP-ALIPAY
			let cfg = {
				icon: type,
				title: text
			}
			// #endif
			if (img !== '') {
				cfg.image = img
			}
			uni.showToast(cfg)
			// 回调
			if (callback && this.isFunction(callback)) {
				setTimeout(function() {
					callback()
				}, time)
			}
		}
	}
}
