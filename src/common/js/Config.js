const debug = process.env.NODE_ENV === 'development' ? true : false

const sitebase_test = process.env.VUE_APP_SITEBASE ? process.env.VUE_APP_SITEBASE : 'https://saas2.test.dayforfree.cn'
const sitebase_real = process.env.VUE_APP_SITEBASE ? process.env.VUE_APP_SITEBASE : 'https://saas2.dayforfree.cn'
const siteroot_test = process.env.VUE_APP_SITEROOT ? process.env.VUE_APP_SITEROOT :
	'https://saas2.test.dayforfree.cn/api/'
const siteroot_real = process.env.VUE_APP_SITEROOT ? process.env.VUE_APP_SITEROOT : 'https://saas2.dayforfree.cn/api/'

const qqmap_uri = 'https://apis.map.qq.com' //非h5使用
const qqmap_uri_h5_test = 'https://api.test.youxuanbest.com' //h5测试
const qqmap_uri_h5_real = 'https://apis.youxuanbest.com' //h5正式
const qqMapKey = 'VN4BZ-3UVLP-5E3DW-L6OEI-6OTCS-HZFAW'
const wx_appid = 'wxc55109df94cd0150'
const service_appid = 'wx6d6130b74e48923d'
const version = '5.0.0'

// 最终有效地址
const h5_url = process.env.VUE_APP_H5_URL
const server = process.env.VUE_APP_SITEROOT
const baseServer = process.env.VUE_APP_SITEBASE
const java_server = process.env.VUE_APP_JAVA_SERVER
// 购买页相关协议地址
const agreement = process.env.VUE_APP_CONTRACT_URL
const fintechServer = process.env.VUE_APP_FINTECH_SERVER
const fintechServerApi = process.env.VUE_APP_SERVER
// 图片地址
const baseImgUrl = process.env.VUE_APP_IMG_ROOT

export default {
	DEBUG: debug,
	VERSION: version,
	SITEBASE_TEST: sitebase_test,
	SITEROOT_TEST: siteroot_test,
	SITEBASE_REAL: sitebase_real,
	SITEROOT_REAL: siteroot_real,
	PLAT_UUID: '3f65caf6-a03e-4f74-8617-407b55c2cde8',
	// PLAT_UUID: '70a5dd8b-825d-dd66-c8ff-50c7317d9244',
	// PLAT_UUID: "ce8dd7da-1de3-2d68-6545-41b1cb28dabf",
	H5_URL: h5_url,
	QQMAPKEY: qqMapKey,
	WX_APPID: wx_appid,
	SERVER: server,
	FINTECH_SERVER: fintechServer,
	BASE_IMAGE_SERVER: baseImgUrl,
	AGREEMENT: agreement,
	JAVA_SAAS_URLS: {
		getOrders: baseServer + '/order/getOrders', //获取订单
		getAds: baseServer + '/ad/getAds', //获取首页轮播图
		getClassify: baseServer + '/categorys/getClassify', //获取首页菜单
		searchPointGoods: baseServer + '/saas_credit/Pgoods/searchPointGoods', //搜索积分商品
		getGoodsOrderByClassify: baseServer + '/good/rent/getGoodsOrderByClassify', //搜索积分商品
		getGoodsByCatId: baseServer + '/saas_credit/Pgoods/getGoodsByCatId', //搜索积分商品
		getGoods: baseServer + '/goods/getGoods', //搜索积分商品
		getUserInfo: baseServer + '/saas_credit/Puser/getUserInfo', //获取用户信息
		getDefaultAddress: baseServer + '/saas_credit/Puseraddress/getDefault', //获取默认地址
		getSetting: baseServer + '/saas_credit/Pcredit/setting', //获取配置项信息
		comfirmOrder: baseServer + '/saas_credit/Porder/comfirmOrder', //用户确认收货
		searchDetail: baseServer + '/goods/getGoodsName', //商品搜索
		generateCode: baseServer + '/user/account/generateCode', //获取用户专属推荐码
		upParentUser: baseServer + '/user/account/upParentUser',//更改上级推荐码

		//java后台
		getSaasGoods: java_server + '/goods/getSaasGoodses', //获取商品列表
		getCategoryGoods: java_server + '/good/rent/getCategoryGoods', //获取分类商品
		getKdTraces: java_server + '/api/Ckd/getKdTraces', //获取订单物流信息
		loginByWx: java_server + '/api/Cuser/loginByWx', //用户微信登录
		getOpenID: java_server + '/api/Cwx/getOpenid', //获取用户openid
		getOrder: java_server + '/api/Corder/getOrder ', //获取订单详情
		// getStage: java_server + "/api/goods/get", //获取分期设置
		getStage: java_server + '/installment/userStrategyInfo', //获取分期详情
		completeOrder: java_server + '/api/Corder/usingOrder', //确认收货
		getBanner: java_server + '/api/Cad/getAds', //获取广告板
		couponDialog: java_server + '/api/Ccoupon/getAvailableCoupons', //首页优惠券弹窗
		getCartNum: java_server + '/api/Ccart/getCartNum', //获取购物车商品数量
		classify: java_server + '/api/Cactivity/getClassify', //商品分类栏目
		getNewBuyer: java_server + '/api/Corder/getNewOrders', //获取最近购买客户
		getStoreInfo: java_server + '/api/Cshop/getStoreInfo', //获取店铺信息
		nearLeader: java_server + '/api/Cleader/getNearLeaders', //获取提货点列表
		isNewcomers: java_server + '/api/Cnewcomers/isNewComers', //新人专享列表

		goodDetail: java_server + '/goods/getGoods', //获取商品详情
		telLogin: java_server + '/user/login/wxApp', //手机登录
		bindTel: java_server + '/user/login/bindTel', //绑定手机号
		wxLogin: java_server + '/api/Cuser/loginbyunionid', //微信登录专用地址
		passLogin: java_server + '/api/Cuser/loginbyaccount', //账号密码登录
		joinCart: java_server + '/api/Ccart/joinCart', //加入购物车
		addOrder: java_server + '/api/Corder/addOrder', //下单
		updateRentOrderInfo: java_server + '/order/updateRentOrderInfo', //更新订单押金
		delCart: java_server + '/api/Ccart/deleteCarts', //删除购物车商品
		getCode: java_server + '/api/Ccode/getcode', //获取验证码
		bindTelWithoutCode: java_server + '/api/Cuser/bindTelWithoutCode', //绑定手机号码
		orderDetail: java_server + '/api/Corder/getOrder', //订单详情
		cancelOrder: java_server + '/api/Corder/cancelOrder', //取消订单
		payOrder: java_server + '/api/Corder/payOrder', //针对订单的二次付款
		decryptTel: java_server + '/api/Cwx/decrypt', //解密手机号码
		decryptTelByCode: java_server + '/api/Cwx/decryptByCode', //解密手机号码
		getCarts: java_server + '/api/Ccart/getCarts', //获取购物车商品
		getGoodAttrs: java_server + '/api/Cgoods/getGoodsAttrs', //获取商品属性栏
		updateCart: java_server + '/api/Ccart/updateCart', //更新购物车
		myInfo: java_server + '/api/Cuser/myInfo', //用户中心，获取我的信息
		orderList: java_server + '/api/Corder/getOrders', //获取订单列表
		postSaleOrderList: java_server + '/api/Corder/getPostSaleOrder', //获取可申请售后的订单列表
		postSaleRecord: java_server + '/api/Corder/getMyPostSaleRecord', //获取售后记录
		recordDetail: java_server + '/api/Corder/getPostSaleDetail', //获取售后记录
		commentOrder: java_server + '/api/Corder/comment', //给商品添加评论
		commentDetail: java_server + '/api/Corder/getComment', //获取商品评论
		messageList: java_server + '/api/Cmessage/getMessage', //获取站内信
		messageDetail: java_server + '/api/Cmessage/getMessageDetail', //获取站内信详情
		changeReadStatus: java_server + '/api/Cmessage/changeReadStatus', //修改状态为已读
		orderDetailByNo: java_server + '/api/Corder/getOrderByNo', //订单详情
		// orderList:{do:"Corder|orderList"}, //获取订单列表
		getArticle: java_server + '/article/getArticle', //获取文章详情
		applyLeader: java_server + '/api/Cleader/applyLeader', //申请提货点
		getMyLeader: java_server + '/api/Cleader/getMyLeader', //获取我的提货点信息
		getLeaderOders: java_server + '/api/Cleader/getOrders', //获取提货点订单列表
		leaderOrderDetail: java_server + '/api/Cleader/getOrder', //提货点订单详情
		userCode: java_server + '/api/Cuser/getUserCode', //用户code
		myStore: java_server + '/api/Cstore/getMyStore', //我的供应商信息
		applyStore: java_server + '/api/Cstore/applyStore', //申请供应商
		receiveGoods: java_server + '/api/Cleader/receiveGoodses', //确认收货
		getUserGoods: java_server + '/api/Cleader/getUserGoodses', //提货点获取成员货品列表
		confirmUserGoods: java_server + '/api/Corder/confirmUserGoodses', //提货点确认收货
		withdrawInfo: java_server + '/api/Cleader/getWithdrawInfo', //提现信息
		delOrder: java_server + '/api/Corder/deleteOrder', //删除订单
		refundOrder: java_server + '/api/Corder/refundOrder', //申请退款接口
		cityLeader: java_server + '/api/Cleader/getCityLeader', //根据城市获取提货点列表
		authH5: java_server + '/api/Cwx/authH5', //H5登录
		getCoupons: java_server + '/api/Ccoupon/receiveCoupon', //领取优惠券
		myCoupons: java_server + '/api/Ccoupon/getMyCoupons', //优惠券列表
		couponsInOrder: java_server + '/api/Ccoupon/isUsableCoupon', //下单查询是否有可用优惠券
		inviteDetail: java_server + '/api/Ccoupon/inviteDetail', //获取邀请的好友列表信息
		miniProgramCode: java_server + '/api/Cqrcode/getQrcode', //获取小程序码
		isRestriction: java_server + '/api/Corder/isRestriction', //限购判断
		getCity: java_server + '/api/Cshop/lists', //获取配置的城市
		getIbyCity: java_server + '/api/Ccity/getIbyCity', //根据城市获取对应的i
		getIbyLocation: java_server + '/api/Ccity/isInOperatorArea', //通过经纬度获取i值
		checkUpdate: java_server + '/api/Capp/checkUpdate', //检查更新
		newcomersList: java_server + '/api/Cactivity/getNewComersGoods', //新人专享列表
		getHoliday: java_server + '/api/Corder/getHoliday', //获取节假日
		addAddress: java_server + '/api/Cuseraddress/add', //添加地址
		getAddresses: java_server + '/api/Cuseraddress/lists', //获取地址
		addressDetail: java_server + '/api/Cuseraddress/detail', //获取地址详情
		setAddressDefault: java_server + '/api/Cuseraddress/setDefault', //设置默认
		delAddress: java_server + '/api/Cuseraddress/del', //删除地址
		editAddress: java_server + '/api/Cuseraddress/edit', //编辑地址
		editWxAddress: java_server + '/api/Cuseraddress/editWx', //编辑地址
		setDefaultLeader: java_server + '/api/Cleader/setDefaultLeader', //绑定提货点
		getDefaultLeader: java_server + '/api/Cleader/getDefaultLeader', //获取绑定的提货点
		getStoreUserInfoByCode: java_server + '/api/Cwx/getStoreUserInfoByCode', //通过code登录
		orderDeliveryPlan: java_server + '/api/Corder/orderDeliveryPlan', //获取订单配送计划
		editdeliveryPlan: java_server + '/api/Cdeliveryplan/modfigyDeliveryTime',
		bindUuid: java_server + '/api/Cuser/bindUuid', //绑定uuid
		pickUpByLeader: java_server + '/api/Cdeliery/pickUpByLeader', //提货点确认收货
		orderSetting: java_server + '/api/Corder/setting', //订单设置
		getListByDeliveryId: java_server + '/api/Cdeliveryplan/getListByDeliveryId', //获取配送计划列表
		getDeliveryUser: java_server + '/api/Cdeliveryplan/getDeliveryUser', //获取配送单商品购买用户
		userPickUp: java_server + '/api/Cdeliveryplan/pickUp', //用户确认收货
		getApplyLog: java_server + '/api/Cleader/getApplyLog', //获取提货点申请记录
		getGoodsPlan: java_server + '/api/Cdeliveryplan/getGoodsPlan', //获取配送计划
		reGeneratePlan: java_server + '/api/Cdeliveryplan/reGeneratePlan', //设置配送计划
		leaderPickup: java_server + '/api/Cdeliveryplan/leaderPickup', //确认送达
		leaderReceivingAll: java_server + '/api/Cdeliveryplan/leaderReceivingAll', //一键确认送达
		leaderPickupAll: java_server + '/api/Cdeliveryplan/leaderPickupAll', //提货点一键提货
		checkLeader: java_server + '/api/Cuser/checkLeader', //查询是否是提货点
		leaderAllConfirm: java_server + '/api/Cleader/leaderAllConfirm', //提货点一键提货
		userRefundOrder: java_server + '/api/Corder/userCancelOrder', //用户申请取消订单
		getProfitList: java_server + '/api/Cleader/getProfitList', //收益明细
		uploadImage: java_server + '/api/Cupload/upload', //上传图片
		getSassDefaultAddress: java_server + '/api/Cuseraddress/getDefault', //获取默认地址
		loginByTelWx: java_server + '/api/Cuser/loginByTelWx', //微信账号通过手机号登录
		updateOpenInfo: java_server + '/api/Cuser/updateOpenInfo', //更新用户公开信息
		reBuildPlans: java_server + "/api/Corder/reBuildPlans", //重构配送计划
		tbOrder: java_server + "/api/Corder/tbOrder", //退订订单
		queryByCode: java_server + "/api/Csalesman/queryByCode", //查询业务员
		queryByUserId: java_server + "/api/Csalesman/queryByUserId", //通过userId查询团长
		setDefaultSalesman: java_server + "/api/Csalesman/setDefaultSalesman", //绑定业务员
		version: java_server + "/api/Cuser/version", //版本号
		loginByWxapp: java_server + "/user/login/wxApp", //微信app登录
		loginByTel: java_server + "/user/login/loginByTel", //手机号登录
		getTemplate: java_server + "/specifictemplate/getTemplate", //获取模板
		getSkuList: java_server + "/specifictemplate/getSkuList", //获取skuList
		getPluginMiniAttr: java_server + "/specifictemplate/getPluginMiniAttr", //获取第一个属性作为tag
		getContact: java_server + "/config/getContact", //获取客服
		getActivityTime: java_server + "/config/getActivityTime", //获取活动倒计时
		getContactQrCode: java_server + "/config/getContactQrCode", //获取客服二维码
		parseSpecificCode: java_server + "/specifictemplate/parseSpecificCode", //解析code
		getCollection: java_server + "/user/collect/get", //获取收藏信息
		deleteCollection: java_server + "/user/collect/del", //删除收藏信息
		upsertCollection: java_server + "/user/collect/upsert", //添加或修改收藏信息
		getTodayStatis: java_server + "/user/account/getTodayStatis", //查询当天记录
		getBrokerage: java_server + "/user/account/getBrokerage", //查询账户余额

		withdraw: java_server + "/user/account/withdraw", //提现
		applySchoolManage: java_server + '/account/manager/apply', // 申请成为校园经理
		getBrokerageDetail: java_server + "/user/hierarchy/getBrokerageDetail", //分销佣金
		getWithdrawDetails: java_server + "/user/account/getWithLog", // 获取提现记录
		getLeaderHistory: java_server + "/user/account/history/get", //获取账单
		getBankCardList: java_server + "/user/bankcard/get", //获取银行卡列表
		addBankCard: java_server + "/user/bankcard/add", //添加银行卡
		delBankCard: java_server + "/user/bankcard/del", //删除银行卡
		modifyUserInfo: java_server + '/user/modifyUserInfo', //修改用户信息
		getDeliveryFee: java_server + "/config/getDeliveryFee", //获取运费
		getHierarchy: java_server + "/user/hierarchy/getListByParentKey", //获取推广人
		getAssociation: java_server + "/goods/associate/getList", //获取组合商品

		// 推广模块
		getListByParentKey: java_server + "/user/hierarchy/getListByParentKey", //获取一级推广员
		getListByParentKey2: java_server + "/user/hierarchy/getListByParentKey2", //获取一级推广员
		getSaleOrder: java_server + "/user/hierarchy/getSaleOrder", //获取分销订单
		getHierarchyStatis: java_server + "/user/account/getAccountStatis", //获取账户信息
		getisCanUpgrade: java_server + "/user/hierarchy/getListByParentKeyAll", //判断用户是否满足晋升条件
		hasAvailableOrder: java_server + "/order/hasAvailableOrder", //是否有有效订单
	},
	REQUEST_URLS: {
		getBillList: fintechServerApi + '/rent/billList', //获取账单列表
		getBillResult: fintechServerApi + '/rent/bill', //获取账单详细信息
		executeBillResult: fintechServerApi + '/rent/doPeriodPay', //账单还款
		executeRepayBefore: fintechServerApi + '/rent/doBeforePay', //提前还款
		getPayStatus: fintechServerApi + '/rent/queryPay', //查询支付状态
		executeRerent: fintechServerApi + '/rent/order/applyRent', //到期续租
		executeReturn: fintechServerApi + '/rent/return/apply/submit', //到期归还申请提交
		getReturnInfo: fintechServerApi + '/rent/return/apply/info' //获取到期归还申请信息
	},
	EVENT: {
		REFRESH_DEFAULT_LEADER: 'refresh_default_leader', //刷新绑定提货点
		WX_LOGIN_SUCCESS: 'wx_login_success', //微信嗯狗成功
		GET_SHAER_USER_SUCCESS: 'get_share_user_info', //获取分享用户成功
		REFRESH_PLANS: "refresh_plans", //刷新配送计划
	},
	XINYONG_URLS: {
		getTrialBalance: "http://service-fintech-restful.test.appkubes.com/fintech/credit/getTrialBalance", //试算接口
	},
	PAGE_LIMIT: 10,
	RECRUITE_SUPPLIER: (debug ? sitebase_test : sitebase_real) + '/index/index/supplierApply.html',
	CONTACT_URL: 'https://xiaokefu.com.cn/s/1764e5gd', //客服
	IOS_STORE: 'https://itunes.apple.com/cn/app/%E5%8F%8B%E9%82%BB%E4%BC%98%E9%80%89-%E5%A4%A7%E5%AE%B6%E9%83%BD%E5%9C%A8%E7%94%A8%E7%9A%84%E7%A4%BE%E5%8C%BA%E5%9B%A2%E8%B4%AD%E5%BA%94%E7%94%A8/id1450276973?mt=8&from=groupmessage&isappinstalled=0', //ios
	ANDROID_STORE: 'https://www.pgyer.com/xeLY', //android
	SERVICE_APPID: service_appid, //服务号appid
	H5_WX_LOGIN: 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + service_appid + '&redirect_uri=' +
		encodeURI(h5_url) + '&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect', //微信h5登录
	// #ifdef MP-WEIXIN || APP-PLUS
	QQMAP_URI: qqmap_uri, //非h5使用map地址
	// #endif
	// #ifdef H5
	QQMAP_URI: debug ? qqmap_uri_h5_test : qqmap_uri_h5_real, //h5使用map地址
	// #endif
	SERVICE_LOGO: sitebase_test + '/attachment/images/8/2019/04/jIc1CxX4whWcxxEq4i454eZLhxEx44.jpg',
	CACHE_TIMEOUT: 1800, // 12小时
}
