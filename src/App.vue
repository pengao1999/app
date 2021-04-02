<script>
	import {
		mapMutations
	} from 'vuex'
	import Login from 'common/js/Login.js'
	import Config from 'common/js/Config.js'
	import Util from 'common/js/util.js'
	// #ifdef H5
	import WX from 'jweixin-module'
	// import vConsole from 'vconsole'
	// Config.DEBUG && new vConsole()
	// #endif

	export default {
		data() {
			return {
				isGettingUserInfo: false,
			}
		},
		onLaunch: function(options) {
			console.log(options)
			let self = this
			let version = uni.getStorageSync("version") || -1
			version = parseInt(version)
			console.log('123')
			// #ifndef MP-ALIPAY
			if (options.query.uuid) {
				this.setOpUuid(options.query.uuid)
			}
			// #endif

			console.log('456')
			this.setPointToken(this.$cache.get('point_token', '') ? this.$cache.get('point_token', '') : '')
			// #ifndef MP-ALIPAY
			if (options.query.token) {
				this.setPointToken(options.query.token)
			}
			// #endif

			this.getSystemInfo()
			// #ifdef  MP-WEIXIN
			// this.getUserInfoFromWX()
			// #endif

			this.setUserInfo(uni.getStorageSync("userInfo"))
			this.setGroupForce(this.$cache.get('group', undefined) ? this.$cache.get('group', undefined) : undefined)
			// this.setUuid(this.$cache.get('uuid', '') ? this.$cache.get('uuid', ''): '')

			if (!this.uuid) {
				uni.reLaunch({})
			}
			// #ifndef MP-ALIPAY
			if (options.query.user_key) {
				setTimeout(() => {
					self.checkRole(options.query.user_key)
				}, 2000)
			}
			// #endif


			if (this.$cache.get('couldModifyGroup', undefined) === false) {
				this.setCouldModifyGroup(this.$cache.get('couldModifyGroup', undefined) ? this.$cache.get('couldModifyGroup',
					undefined) : false)
			} else {
				this.setCouldModifyGroup(true)
			}

			// #ifdef MP-WEIXIN
			this.getVersion(version)
			// #endif

			// #ifdef H5
			this.getUserInfoH5()
			this.setTryGetUserInfo(true)
			// #endif
			// TODO: other plat
			console.log('App Launch')

			// #ifdef APP-PLUS 

			//收到透传消息  
			//只有APP在线时，才会触发receive事件，透传消息不会触发系统消息,需要创建本地消息  
			plus.push.addEventListener("receive", function(msg) {
				console.log("(receive):" + JSON.stringify(msg));
				if (plus.os.name == "iOS") { //如果是IOS  
					var payload = msg.payload;
					//【APP离线】收到消息，但没有提醒（发生在一次收到多个离线消息时，只有一个有提醒，但其他的没有提醒）  
					//【APP在线】收到消息，不会触发系统消息,需要创建本地消息，但不能重复创建。必须加msg.type验证去除死循环                
					if (msg.aps == null && msg.type == "receive") {
						var title = payload.title;
						var content = payload.content;
						//创建本地消息,发送的本地消息也会被receive方法接收到，但没有type属性，且aps是null   
						plus.push.createMessage(content, payload, {
							title: title,
							sound: 'system',
							delay: 3
						})
					}
				}
				if (plus.os.name == "Android") { //如果是Android，当APP在线时，收到透传消息不会进入系统消息，需要发送本地提醒。  
					var payload = JSON.parse(msg.payload);
					// var title = payload.title;  
					// var content = payload.content;  
					// plus.push.createMessage(content,payload,{
					// 	 title:title,
					//      sound:'system',  
					//      delay:3  
					// }) 
					if (payload != null || payload != undefined) {
						if (payload.type === 'page') {
							uni.navigateTo({
								url: payload.param
							})
						}
					}
				}
			}, false);

			//消息点击事件  
			//【APP在线】，收到透传消息通过，不会提醒至通知栏目，需要发送本地消息，再进行点击触发的点击事件。  
			//【APP离线】，收到离线透传消息，必须通过Java后台的Intent字符串携带payload，且符合格式才能触发click事件，格式不符合不会触发。  
			plus.push.addEventListener("click", function(msg) {
				console.log("(click):" + JSON.stringify(msg));
				if (plus.os.name == "iOS") { //如果是IOS  
					var payload;
					if (msg.type == "click") { //APP离线点击包含click属性，这时payload是JSON对象  
						payload = msg.payload;
					} else { //APP在线，收到消息不会包含type属性,这时的payload是JSON字符串，需要转为JSON对象  
						payload = JSON.parse(msg.payload);
					}
					console.log(JSON.stringify(payload))
					if (payload.type === 'page') {
						uni.navigateTo({
							url: payload.param
						})
					}
				}
				if (plus.os.name == "Android") { //如果是Android，收到playload均是是JSON字符串，需要转为JSON对象  
					var payload = JSON.parse(msg.payload);
					console.log(JSON.stringify(payload))
					if (payload != null || payload != undefined) {
						// if(payload.type==='page'){
						// 	uni.navigateTo({
						// 		url:payload.param
						// 	})
						// } 
					}
				}
			}, false);
			let cid = ''
			cid = plus.push.getClientInfo().clientid
			if (cid.length > 4) {
				console.log(cid.length + 'cid.length > 4:' + cid)
				self.setClientId(cid)
			} else {
				console.log(cid.length + 'else:' + cid)
				var time = 0;
				var timer = setInterval(function() {
					time += 500;
					cid = plus.push.getClientInfo().clientid
					if (cid.length > 4 || time >= 10000) {
						console.log('CID:' + cid)
						clearInterval(timer);
						self.setClientId(cid)
					}
				}, 500);
			}
			// #endif
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		},
		watch: {
			userInfo: {
				handler() {
					if (this.userInfo != undefined && Util.containsKey(this.userInfo, 'unionid') && Util.containsKey(this.userInfo,
							'nickName') && this.isTryGetUserInfo && !Util.containsKey(this.userInfo, 'user_key')) {
						this.wxLogin()
					}
					if (Util.containsKey(this.userInfo, 'tel') && !Util.isEmptyString(this.userInfo['tel'])) {
						this.setRegisterState(true)
					} else {
						this.setRegisterState(false)
					}
				},
				immediate: true,
			},
			isTryGetUserInfo: {
				handler() {
					if (this.userInfo != undefined && Util.containsKey(this.userInfo, 'unionid') && Util.containsKey(this.userInfo,
							'nickName') && this.isTryGetUserInfo && !Util.containsKey(this.userInfo, 'user_key')) {
						this.wxLogin()
					}
				},
				immediate: true,
			},
			loginWx: {
				handler() {
					if (this.loginWx) {
						// #ifdef MP-WEIXIN || APP-PLUS
						this.setLoginWx(false)
						this.getUserInfoFromWX()
						// #endif
						// #ifdef H5
						this.loginWxH5()
						// #endif
					}
				},
				immediate: true,
			},
		},
		computed: {
			userInfo() {
				return this.$store.state.userInfo
			},
			isTryGetUserInfo() {
				return this.$store.state.isTryGetUserInfo
			},
			loginWx() {
				return this.$store.state.loginWx
			},
			globalI() {
				return this.$store.state.globalI
			},
			reLoginByGlobalI() {
				return this.$store.state.reLoginByGlobalI
			},
			uuid() {
				return this.$store.state.uuid
			},
			op_uuid() {
				return this.$store.state.op_uuid
			},
			isRegister() {
				return this.$store.state.isRegister
			}
		},
		methods: {
			...mapMutations(['setAuth', 'setSystemInfo', 'setUserInfo', 'setTryGetUserInfo', 'setLoginWx', 'setLoginWxSuccess',
				'setGroup', 'setGlobalI', 'setReLoginByGlobalI', 'logout', 'setCouldModifyGroup', 'setGroupForce', 'setUuid',
				'setStore', 'setOpUuid', 'setShareLeader', 'setPointToken', 'setRegisterState', 'setClientId'
			]),
			getSystemInfo: function() {
				let that = this
				uni.getSystemInfo({
					success(system) {
						if (system.errMsg === 'getSystemInfo:ok') {
							console.log(system)
							that.setSystemInfo(system)

							// #ifdef MP-WEIXIN
							if (system.SDKVersion <= '2.2.5') {
								uni.reLaunch({
									url: '/pages/public',
								})
							}
							// #endif
						}
					},
				})
			},
			getUserInfoFromWX: function() {
				let self = this
				if (self.isGettingUserInfo) return
				self.isGettingUserInfo = true
				// 尝试登录
				Login.getLoginCode(loginRes => {
					if (loginRes.errMsg === 'login:ok') {
						// #ifdef APP-PLUS
						self.setUserInfo(loginRes.authResult)
						self.setLoginWxSuccess(true)
						// #endif
						// 尝试获取用户信息
						Login.getUserInfo(resInfo => {
							// 获取用户公开信息成功
							if (resInfo.errMsg === 'getUserInfo:ok') {
								self.setUserInfo(resInfo.userInfo)

								// 获取用户openid
								// #ifdef MP-WEIXIN
								let data = {
									i: self.globalI,
									code: loginRes.code,
									iv: resInfo.iv,
									data: resInfo.encryptedData,
								}
								self.$Phttp.post(Config.JAVA_SAAS_URLS.getOpenID, data).then(res => {
									res = res.data
									self.setUserInfo(res.data)
									self.isGettingUserInfo = false
									self.setLoginWxSuccess(true)
								})
								// #endif
								// #ifdef APP-PLUS
								let data2 = Object.assign({}, self.userInfo, {
									i: self.globalI,
									name: self.userInfo.nickName,
									img: self.userInfo.avatarUrl,
									email: '',
									share_user_key: '',
								})
								self.$http.post(Config.URLS.wxLogin, data2).then(res => {
									res = res.data
									self.setUserInfo(res.data)
									self.isGettingUserInfo = false
									self.setLoginWxSuccess(true)
								})
								//#endif
							}

							self.setTryGetUserInfo(true)
						})

						setTimeout(() => {
							self.isGettingUserInfo = false
							self.setTryGetUserInfo(true)
						}, 1000)
					}
				})
			},
			tryLoginByCode: function(code, callback) {
				let self = this
				self.$Phttp
					.post(Config.JAVA_SAAS_URLS.loginByWx, {
						code: code,
					})
					.then(res => {
						res = res.data
						if (res.code === 1) {
							if (res.data === null && self.uuid === '') {
								uni.reLaunch({
									url: '/pkUserInfo/address/area',
								})
								return
							}
							if (self.op_uuid) {
								self.setUuid(self.op_uuid)
							} else {
								if (self.uuid === '') {
									uni.reLaunch({
										url: '/pkUserInfo/address/area',
									})
								}
							}

						} else {
							if (res.data === null) {
								uni.reLaunch({
									url: '/pkUserInfo/address/area',
								})
								return
							}
							if (!res.data.bind_uuid && !self.op_uuid) {
								uni.reLaunch({
									url: '/pkUserInfo/address/area',
								})
							}
							if (!res.data.bind_uuid && self.op_uuid) {
								self.setUuid(self.op_uuid)
							}
							if (res.data.bind_uuid) self.setUuid(res.data.bind_uuid)
							self.setUserInfo(res.data)
							self.setTryGetUserInfo(true)
						}
						callback(res)
					})
			},
			wxLogin: function() {},
			postDataToNView: function(data) {
				// #ifdef APP-PLUS
				var pages = getCurrentPages()
				var page = pages[pages.length - 1]
				var currentWebview = page.$getAppWebview()
				plus.webview.postMessageToUniNView(data, currentWebview.id)
				// #endif
			},
			// #ifdef H5
			// wechat h5登录、分享
			loginWxH5: function() {
				if (this.isWeiXin()) {
					window.location.href = Config.H5_WX_LOGIN
				}
			},
			getUserInfoH5: function() {
				let self = this
				let code = self.getParam('code')
				if (code === null || code === '') return
				self.$http
					.post(Config.URLS.authH5, {
						code: code,
						i: self.globalI,
					})
					.then(res => {
						res = res.data
						if (res.code === 0) {
							self.setUserInfo(res.data)
							self.setUserInfo({
								h5openid: res.data.openid,
							})
							self.setTryGetUserInfo(true)
						}
					})
			},
			isWeiXin: function() {
				var ua = window.navigator.userAgent.toLowerCase()
				if (ua.match(/MicroMessenger/i) == 'micromessenger') {
					return true
				} else {
					return false
				}
			},
			getParam: function(name) {
				var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
				var r = window.location.search.substr(1).match(reg)
				if (r != null) {
					return unescape(r[2])
				}
				return null
			},
			// #endif
			checkRole(invite_id) {
				let self = this
				self.$Phttp.post(Config.JAVA_SAAS_URLS.queryByUserId, {
					user_key: invite_id
				}).then(res => {
					res = res.data
					if (res.code === 0) {
						if (!self.isRegister) {
							self.setUserInfo({
								invite_id: invite_id,
								bind_sales_key: invite_id
							})
						}
						if (self.isRegister && self.userInfo.bind_sales_key === 0) {
							self.bindSalesman(invite_id)
						}
					}
				})
			},
			getVersion(version) {
				let self = this
				self.$Phttp.post(Config.JAVA_SAAS_URLS.version, {}).then(res => {
					res = res.data
					if (res.code === 0) {
						let new_version = parseInt(res.msg)
						if (new_version !== version) {
							uni.setStorageSync("version", new_version)
							Login.getLoginCode(loginRes => {
								self.tryLoginByCode(loginRes.code, res => {})
							})
						} else {
							self.setTryGetUserInfo(true)
						}
					}
				})
			},
			bindSalesman(sales_id) {
				let self = this
				let postData = {
					user_key: self.userInfo.user_key,
					leader_key: sales_id
				}
				self.$Phttp.post(Config.JAVA_SAAS_URLS.setDefaultSalesman, postData).then(res => {
					self.setUserInfo({
						bind_sales_key: sales_id
					})
				})
			}
		},
		onUniNViewMessage: function(e) {
			let self = this
			let action = e.data.action
			let data = e.data.data
			switch (action) {
				case 'getCode':
					self.$http.post(Config.URLS.getCode, data).then(res => {
						res = res.data
						if (res.code === 0) {
							let postData = {
								action: 'countDown',
							}
							self.postDataToNView(postData)
						}
					})
					break
				case 'telLogin':
					self.$http.post(Config.URLS.telLogin, data).then(res => {
						res = res.data
						if (res.code === 0) {
							self.setUserInfo(res.data)
							let postData = {
								action: 'closeLogin',
							}
							self.postDataToNView(postData)
						} else {
							let postData = {
								action: 'error',
								msg: res.msg,
							}
							self.postDataToNView(postData)
						}
					})
					break
				case 'loginWx':
					self.setLoginWx(true)
			}
		},
	}
</script>

<style>
	/* uni.css - 通用组件、模板样式库，可以当作一套ui库应用 */
	@import url('./common/css/uni.css');
	@import url('./common/css/icon.css');
	@import url('./common/css/common.css');

	/*每个页面公共css */
	page {
		height: 100%;
		font-size: 11pt;
		color: #555;
		background: #fff;
		overflow-x: hidden;
		font-family: PingFang-SC-Bold;
	}

	.top-bg-img {
		width: 100%;
		height: 60rpx;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		position: unset;
		-moz-background-size: 100% 100%;
	}

	.h_line {
		height: 1px;
		border: none;
		border-bottom: 1px solid #e6e6e6;
		transform: scaleY(0.5);
		transform-origin: 0 0;
	}

	.w_line {
		width: 1px;
		border: none;
		border-left: 1px solid #e6e6e6;
		transform: scaleX(0.5);
		transform-origin: 0 0;
	}
</style>
