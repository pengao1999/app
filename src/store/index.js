import Vue from 'vue'
import Vuex from 'vuex'
import Cache from '../common/js/Cache.js'
import Toast from '../common/js/toast.js'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		auth: false, //用户是否授权
		systemInfo: Object, //设备消息
		userLocation: undefined, //用户定位
		userCustomLocation: undefined, //用户自选定位
		group: undefined, //当前最近社区
		userInfo: undefined, //用户信息
		myLeaderInfo: undefined, //我的提货点中心
		isTryGetUserInfo: false ,//是否已完成获取用户的操作，在App.vue中确认，此举能保证弹窗
		ads: undefined, //广告
		refreshCart: false, //是否需要刷新购物车
		loginWx: false, //是否使用微信登录，登录操作将在App.vue执行
		loginWxSuccess: false, //是否登录成功
		acts: undefined, //活动
		globalI:10, //全局变量i
		reLoginByGlobalI: false, //由于globalI的改变，是否需要重新登录
		catId: 0, //分类id
		refreshIndexGoodList: [], //用作首页商品购物车数量更新
		refreshCategoryGoodList : [], //用作分类页商品购物车数量更新
		inChooseProductCartNum: 0, //用户进行商品详情对应商品购物车数量
		couldModifyGroup: true, //是否可以修改提货点信息
		isNewcomersPage: 0, //是否是新人专享进入分类页
		isNewcomers: 0, //是否是新人
		shareLeader: {}, //分享提货点


		uuid: '3f65caf6-a03e-4f74-8617-407b55c2cde8', //当前商店的管理员uuid
		op_uuid: '', //分享进来的管理员uuid
		store: {}, //当前商城信息
		isRegister: false, //根据用户信息中是否包含手机号判断用户是否注册，在app.vue处监听

		//积分商城
		point_token: '', //积分商城用户token
		clientId:'' //推送clientId
	},
	mutations: {
		setAuth(state, auth) {
			state.auth = auth
		},
		setSystemInfo(state, system) {
			state.systemInfo = system
		},
		setUserLocation(state, location) {
			state.userLocation = location
		},
		setGroup(state, group) {
			group = undefined
			if (Cache.get('couldModifyGroup', undefined) === false && state.group !== undefined) {
				uni.showToast({
					icon: 'none',
					title: '请在我的页面先解绑提货点，再继续操作'
				})
				return
			}
			state.group = group
			Cache.put('group', state.group, 7200000)
		},
		setGroupForce(state, group) {
			group = undefined
			state.group = group
			Cache.put('group', state.group, 7200000)
		},
		setUserInfo(state, userInfo) {
			state.userInfo = Object.assign({}, state.userInfo, userInfo)
			uni.setStorageSync("userInfo", state.userInfo)
		},
		setTryGetUserInfo(state, isTry) {
			state.isTryGetUserInfo = isTry
		},
		setUserCustomLocation(state, userCustomLocation) {
			state.userCustomLocation = userCustomLocation
		},
		setAds(state, ads) {
			state.ads = ads
		},
		setRefreshCart(state, refreshCart) {
			state.refreshCart = refreshCart
		},
		setLoginWx(state, loginWx) {
			state.loginWx = loginWx
		},
		setLoginWxSuccess(state, loginWxSuccess) {
			state.loginWxSuccess = loginWxSuccess
		},
		setMyLeaderInfo(state, myLeaderInfo) {
			state.myLeaderInfo = myLeaderInfo
		},
		logout(state) {
			state.userInfo = {}
			state.loginWxSuccess = false
			uni.removeStorageSync('userInfo')
		},
		setActs(state, acts) {
			state.acts = acts
		},
		setGlobalI(state, globalI) {
			state.globalI = 10
			uni.setStorageSync('globalI', 10)
		},
		setIsNewcomersPage(state, isNewcomersPage) {
			state.isNewcomersPage = 0
		},
		setisNewcomers(state, isNewcomers) {
			state.isNewcomers = 0
			uni.setStorageSync('isNewcomers', 0)
		},
		setReLoginByGlobalI(state, reLoginByGlobalI) {
			state.reLoginByGlobalI = reLoginByGlobalI
		},
		setCatId(state, catId) {
			state.catId = catId
		},
		addIndexRefresh(state, obj) {
			state.refreshIndexGoodList.push(obj)
		},
		addCategoryRefresh(state, obj) {
			state.refreshCategoryGoodList.push(obj)
		},
		emptyIndexRefresh(state) {
			state.refreshIndexGoodList = []
		},
		emptyCategoryRefresh(state) {
			state.refreshCategoryGoodList = []
		},
		setInChooseProductCartNum(state, inChooseProductCartNum) {
			state.inChooseProductCartNum = inChooseProductCartNum
		},
		setCouldModifyGroup(state, couldModifyGroup) {
			state.couldModifyGroup = couldModifyGroup
			Cache.put('couldModifyGroup', couldModifyGroup, 72000000)
		},
		setUuid(state, uuid) {
			state.uuid = uuid
			Cache.put('uuid', uuid, 72000000)
		},
		setStore(state, store) {
			state.store = store
			Cache.put('store', store, 72000000)
		},
		setOpUuid(state, op_uuid) {
			state.op_uuid = op_uuid
		},
		setShareLeader(state,shareLeader){
			state.shareLeader=shareLeader
		},
		setPointToken(state, point_token) {
			state.point_token = point_token
			Cache.put('point_token', point_token, 72000000)
		},
		setRegisterState(state, isRegister) {
			state.isRegister = isRegister
		},
		setClientId(state, clientId){
			state.clientId = clientId
		}
	},
	actions: {
	}
})

export default store
