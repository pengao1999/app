<template>
	<view>
		<block>
		<view class='top' @tap="isLogout">
			<image class='head' :src='userInfo.img?userInfo.img:"/static/ic_default_head.png"' :lazy-load="true"></image>
			<view class='info' v-if="userInfo.name!=null">
				<text class='name'>昵称：{{userInfo.name?userInfo.name:'点击登录'}}</text>
				<text class='community' v-if="userInfo.community">小区：{{userInfo.community}}</text>
				<!-- <view class='address' @tap="openMap">
					{{group.address}}
					<image src='/static/ic_coordinate.png' :lazy-load="true"></image>
				</view> -->
			</view>
			<view class="info" v-else>
				<view class="round" style="width: 260upx;height: 80upx;background:#1dc422;color:white;margin-top: 20upx;text-align: left;">点击登录</view>
			</view>
			<view>
				<text class="message_tip" v-if="message_total>0">{{message_total}}</text>
			</view>
			<image class='message' src='../../static/ic_message.png' @tap="toMessage"></image>
		</view>
		<view class='top-bg-img'></view>

		<view class='order-box' v-if="showOrder">
			<view class='all-order' @tap="toList(0)">
				我的订单
				<image src='/static/ic_arrow_right.png' :lazy-load="true" class='arrow'></image>
				<text>全部订单</text>
			</view>
			<view class='items'>
				<view class='item' @tap="toList(1)">
					<image src='/static/ic_pay.png' :lazy-load="true"></image>
					<text>待付款</text>
					<text class='tag' v-if="order_count.state1>0">{{order_count.state1}}</text>
				</view>
				<view class='item' @tap="toList(2)">
					<image src='/static/ic_send.png' :lazy-load="true"></image>
					<text>待配送</text>
					<text class='tag' v-if="order_count.state2>0">{{order_count.state2}}</text>
				</view>
				<view class='item' @tap="toList(3)">
					<image src='/static/ic_sended.png' :lazy-load="true"></image>
					<text>配送中</text>
					<text class='tag' v-if="order_count.state3>0">{{order_count.state3}}</text>
				</view>
				<view class='item' @tap="toList(4)">
					<image src='/static/ic_take.png' :lazy-load="true"></image>
					<text>待自提</text>
					<text class='tag' v-if="order_count.state4>0">{{order_count.state4}}</text>
				</view>
				<view class='item' @tap="toList(5)">
					<image src='/static/ic_finish.png' :lazy-load="true"></image>
					<text>已完成</text>
					<text class='tag' v-if="order_count.state5>0">{{order_count.state5}}</text>
				</view>
			</view>
		</view>

		<!-- 导航栏板块 -->
		<view class="nav-box" v-if="showNav">
			<nav-list :propData="navlist" @navClick="navClick"></nav-list>
		</view>
		<!-- 导航栏板块 -->


		<view class='columns' v-if="showColoum">
			<view class='column' @tap="toApply(userInfo.is_leader)">
				<view class='left'>
					<image src='/static/ic_group_apply.png' :lazy-load="true"></image>
					<text>{{userInfo.is_leader?"配送点后台":"提货点加盟"}}</text>
				</view>
				<image class='arrow' src='/static/ic_arrow_right.png' :lazy-load="true"></image>
			</view>
			<view class='column' @tap="recruitSupplier">
				<view class='left'>
					<image src='/static/ic_supplier_apply.png' :lazy-load="true"></image>
					<text>{{userInfo.has_store?"代理商后台":"代理商招募"}}</text>
				</view>
				<image class='arrow' src='/static/ic_arrow_right.png' :lazy-load="true"></image>
			</view>
			<view class='column' @tap="toPostsale">
				<view class='left'>
					<image src='/static/postsale.png' :lazy-load="true"></image>
					<text>申请售后</text>
				</view>
				<image class='arrow' src='/static/ic_arrow_right.png' :lazy-load="true"></image>
			</view>
			<!-- #ifdef MP-WEIXIN -->
			 <!-- <button class='column' style="display:inline-flex;" open-type="contact">
				<view class='left'>
					<image src='../../static/ic_service.png'></image>
					<text>联系客服</text>
				</view>
				<image class='arrow' src='../../static/ic_arrow_right.png'></image>
			</button> -->
			<!-- #endif -->
			<!-- #ifdef APP-PLUS -->
			 <!-- <button class='column' style="display:inline-flex;" @tap="toContact">
				<view class='left'>
					<image src='../../static/ic_service.png'></image>
					<text>联系客服</text>
				</view>
				<image class='arrow' src='../../static/ic_arrow_right.png'></image>
			</button> -->
			<!-- #endif -->
			<view class='column' @tap="toProtocol">
				<view class='left'>
					<image src='/static/ic_protocol.png' :lazy-load="true"></image>
					<text>用户协议与政策</text>
				</view>
				<image class='arrow' src='/static/ic_arrow_right.png' :lazy-load="true"></image>
			</view>
			<!-- <view class='column'>
				<view class='left'>
					<image src='/static/bind.png' :lazy-load="true"></image>
					<text>绑定当前提货点</text>
				</view>
				<view class="rf">
					<switch @change="bindLeader" :checked="!couldModifyGroup"></switch>
				</view>
			</view> -->
		</view>
		<view class='delivery-code' v-if="showCode" @tap.stop='generateCode'>
			<view class='code'>
				<!-- <tki-qrcode v-if="false" :val="qrval" :size="qrsize" :background="qrbackground" :foreground="qrforeground" :pdground="qrpdground" :icon="qricon" :iconSize="qriconsize" :lv="qrlv" ref="qrcode" @result="qrR"></tki-qrcode> -->
				<image src='/static/ewm.png' :lazy-load="true"></image>
			</view>

			<view class='info'>
				<text class='take-text'>提货码</text>
				<!-- <text class='take-code'>或出示提货码</text> -->
				<text class='get-code'>使用提货码</text>
			</view>
		</view>

		<view class="mask" @tap.stop="codeDialog" v-if="showCodeDialog"></view>
		<view class='code-dialog' @tap="getCode" v-if="showCodeDialog">
		  <view class='dialog-title'>
			<text class='space'></text>
			<text>提货码（点击刷新）</text>
			<image src='/static/ic_close.png' class='close' @tap.stop='codeDialog' :lazy-load="true"></image>
		  </view>
		  <!-- <tki-qrcode :val="qrval" :size="qrsize" :background="qrbackground" :foreground="qrforeground" :pdground="qrpdground" :icon="qricon" :iconSize="qriconsize" :lv="qrlv" ref="qrcode" @result="qrR"></tki-qrcode> -->
		  <qrcode :val="qrval" :size="qrsize" :background="qrbackground" :foreground="qrforeground" :pdground="qrpdground" :icon="qricon" :iconSize="qriconsize" :lv="qrlv" ref="qrcode" @result="qrR"></qrcode>
		  <view class='desc'>向提货点出示二维码提货</view>
		</view>
		</block>
		<view class='ad-box' v-if="banner && banner.pic != undefined">
			<image class='ad' :src='image_root+banner.pic' @tap='adClick'></image>
		</view>
		<view style="width:100%;position:relative;">
			<official-account style=""></official-account>
		</view>
		<view class="version-container">友邻优选商城版本号：{{version}}</view>
		<!--  #ifdef  MP-WEIXIN -->
		<my-wx-login :propData="loginDialogData" @handleClose="handleClose" @getUserInfoSuccess="getUserInfoSuccess"></my-wx-login>
		<!--  #endif -->
	</view>
</template>

<script>
	import Config from '../../common/js/Config.js'
	import Toast from '../../common/js/toast.js'
	import Auth from '../auth.js'
	import Util from '../../common/js/util.js'
	import navList from '../../components/yx_view/navList.vue'
	// import tkiQrcode from '../../common/third/qrcode/tki-qrcode.vue'
	import qrcode from '../../common/third/qrcode/qrcode.vue'
	// #ifdef  MP-WEIXIN
	import MyWxLogin from '../../components/yx_dialog/myWXLoginDialog.vue'
	// #endif
	import {mapMutations} from 'vuex'
	export default {
		data() {
			return {
				order_count: [],
				message_total:0,
				info: {},
				qrcode: {},
				qrval: '二维码', // 要生成的二维码值
				qrsize: 200, // 二维码大小
				qrbackground: '#FFFFFF', // 背景色
				qrforeground: '#000000', // 前景色
				qrpdground: '#000000', // 角标色
				qricon: '', // 二维码图标
				qriconsize: 25, // 二维码图标大小
				qrlv: 3, // 二维码容错级别 ， 一般不用设置，默认就行
				qrSrc: '',
				showCodeDialog: false,
				loginDialogData: {
					show: false
				},
				navlist: [
					{
						image: "/static/coupons.png",
						title: "优惠券",
						tap: 'coupons'
					},
					{
						image: "/static/service.png",
						title: "联系客服"
					},
					{
						tap: 'friend',
						image: "/static/friends.png",
						title: "邀请好友"
					},
					{
						tap: 'service',
						image: "/static/public_account.png",
						title: "服务号"
					}

				],
				banner: {},
				image_root: '',
				timer: {},
				version: '',
				showOrder: false,
				showNav: false,
				showColoum: false,
				showCode: false
			}
		},
		onLoad() {
			let self = this
			if (!self.checkLogin()) return //判断是否登录

			self.version = Config.VERSION
			//#ifdef APP-PLUS
			plus.runtime.getProperty(plus.runtime.appid, function(widgetInfo) {
				self.version = widgetInfo.version
			})
			//#endif

			setTimeout(()=>{
				self.showOrder = true
			}, 80)
			setTimeout(()=>{
				self.showNav = true
			}, 120)
			setTimeout(()=>{
				self.showColoum = true
			}, 160)
			setTimeout(()=>{
				self.showCode = true
			}, 200)
		},
		onShow() {
			if (Util.containsKey(this.userInfo, 'user_key')) {
				this.GetMyInfo();
			}
			if (this.showCodeDialog) {
				this.autoRefreshCode()
			}
		},
		mixins:[Toast, Auth],
		components:{
			// tkiQrcode
			qrcode,
			navList
			// #ifdef  MP-WEIXIN
			, MyWxLogin
			// #endif
		},
		watch: {
			userInfo: {
				handler() {
					if ((this.userInfo === undefined)
						|| (this.userInfo != undefined && !Util.containsKey(this.userInfo, 'user_key'))) {
					} else {
						this.loginDialogData = Object.assign({}, this.loginDialogData, {
							show: false
						})
					}
				},
				immediate: true
			},
			ads: {
				handler() {
					if (this.ads !== undefined) {
						this.getBanner()
					}
				},
				immediate: true
			},
		},
		computed: {
			userInfo() {
				return this.$store.state.userInfo
			},
			isTryGetUserInfo() {
				return this.$store.state.isTryGetUserInfo
			},
			group() {
				return this.$store.state.group
			},
			ads() {
				return this.$store.state.ads
			},
			globalI() {
				return this.$store.state.globalI
			},
			couldModifyGroup() {
				return this.$store.state.couldModifyGroup
			}
		},
		methods: {
			...mapMutations(['logout', 'setUserInfo', 'setLoginWx', 'setCouldModifyGroup']),
			GetMyInfo(){
				let self = this
				let data = {
					i:self.globalI,
					user_key: self.userInfo.user_key,
				}
				self.$http.post(Config.URLS.myInfo, data).then((res) => {
					uni.stopPullDownRefresh()
					res = res.data
					self.order_count = res.data.order_count
					self.message_total = res.data.message_total
					self.info = res.data
					self.image_root = res.other.img_root
					self.setUserInfo(res.data.userinfo)
				})
			},
			getBanner: function() {
				this.banner = this.ads.userBanner
			},
			login(){
				uni.navigateTo({
					url: '../../pages/profile/login/login'
				});
			},
			toList: function(status) {
				let self = this
				if (!self.isUserLogin()) {
					this.loginDialogData = Object.assign({}, this.loginDialogData, {
						show: true
					})
					return
				}
				uni.navigateTo({
					url: '/pages/order/list?status='+status+'&leader_key=-1'
				})
			},
			recruitSupplier: function() {
				let self = this
				if (!self.isUserLogin()) {
					this.loginDialogData = Object.assign({}, this.loginDialogData, {
						show: true
					})
					return
				}
				if (this.info.has_store) {
					uni.navigateTo({
						url: '/pkLeaderInfo/store/center'
					})
				} else {
					console.log(Config.RECRUITE_SUPPLIER)
					uni.navigateTo({
						url: '/pkMain/profile/webview?url='+Config.RECRUITE_SUPPLIER
					})
				}
			},
			isUserLogin: function() {
				let self = this
				if ((self.userInfo === undefined)
					|| (self.userInfo != undefined && !Util.containsKey(self.userInfo, 'user_key'))) {
						return false
				}
				return true
			},
			toApply: function(isLeader) {
				let self = this
				if (!self.isUserLogin()) {
					this.loginDialogData = Object.assign({}, this.loginDialogData, {
						show: true
					})
					return
				}
				if (isLeader) {
					uni.navigateTo({
						url: '/pkLeaderInfo/center/index'
					})
				} else {
					uni.navigateTo({
						url: '/pkUserInfo/info/apply'
					})
				}
			},
			toProtocol: function() {
				let self = this
				uni.navigateTo({
					url: '/pkUserInfo/info/protocol'
				})
			},
			toPostsale: function() {
				let self = this
				uni.navigateTo({
					url: '/pkPostsale/postsale/postsale'
				})
			},
			generateCode: function() {
				let self = this
				if (!self.isUserLogin()) {
					this.loginDialogData = Object.assign({}, this.loginDialogData, {
						show: true
					})
					return
				}
				this.getCode()
				this.autoRefreshCode()
			},
			getCode: function() {
				let self = this
				if (!self.isUserLogin()) {
					this.loginDialogData = Object.assign({}, this.loginDialogData, {
						show: true
					})
					return
				}
				let data = {
					i:self.globalI,
					user_key: self.userInfo.user_key
				}
				self.$http.post(Config.URLS.userCode, data).then((res) => {
					res = res.data
					if (res.code === 0) {
						self.qrval = 'code-' + res.data
						self.showCodeDialog = true
						setTimeout(()=>{
							self.showCodeDialog = true
							self.$refs.qrcode.creatQrcode()
						}, 100)
					}
				})
			},
			bindLeader: function(e) {
				let self = this
				if (!self.isUserLogin()) {
					this.loginDialogData = Object.assign({}, this.loginDialogData, {
						show: true
					})
					return
				}
				this.setCouldModifyGroup(!e.detail.value)
			},
			handleClose: function() {
				this.loginDialogData.show = false
			},
			codeDialog: function() {
				let self = this
				self.clearTimer()
				self.showCodeDialog = Object.assign(false)
				for (var i=0; i< 4; i++) {
					setTimeout(()=>{
						self.showCodeDialog = Object.assign(false)
					}, 100)
				}
				self.clearTimer()
				self.$refs.qrcode.clearQrcode()
			},
			toContact: function() {
				let self = this
				if (!self.isUserLogin()) {
					this.loginDialogData = Object.assign({}, this.loginDialogData, {
						show: true
					})
					return
				}
				uni.navigateTo({
					url: '/pkMain/profile/webview?url='+Config.CONTACT_URL
				})
			},
			toMessage(){
				uni.navigateTo({
					url: '/pkMessage/message/message'
				})
			},
			openMap: function() {
				let self = this
				if (!self.isUserLogin()) {
					this.loginDialogData = Object.assign({}, this.loginDialogData, {
						show: true
					})
					return
				}
				uni.openLocation({
					name: this.group.community,
					latitude: parseFloat(this.group.latitude),
					longitude: parseFloat(this.group.longitude),
					success: () => {
						console.log('open map.')
					}
				});
			},
			isLogout: function() {
				// #ifdef MP-WEIXIN
				let self = this
				if (!self.isUserLogin()) {
					this.loginDialogData = Object.assign({}, this.loginDialogData, {
						show: true
					})
					return
				}
				// #endif
				// #ifdef APP-PLUS || H5
				uni.showModal({
					title: '提示',
					content: '是否登出本账号？',
					confirmColor: '#1dc422',
					success: (res) => {
						if ( res.confirm ) {

							this.logout()
							// #ifdef APP-PLUS
							uni.reLaunch({
								url: '/pkUserInfo/info/login'
							})
							// #endif
							// #ifdef H5
							uni.reLaunch({
								url: '/pages/index/main'
							})
							//#endif
						}
					},
				})
			// #endif
			},
			getUserInfoSuccess: function(userInfo) {
				this.setUserInfo(userInfo)
				this.setLoginWx(true)
				this.GetMyInfo();
			},
			navClick: function(tap) {
				let self = this
				if (!self.isUserLogin()) {
					this.loginDialogData = Object.assign({}, this.loginDialogData, {
						show: true
					})
					return
				}
				switch( tap ) {
					case 'coupons':
						uni.navigateTo({
							url: '/pkMain/profile/coupons'
						})
						break
					case 'friend':
						uni.navigateTo({
							url: '/pkUserInfo/info/friends'
						})
						break
					case 'service':
						uni.previewImage({
							count:1,
							urls: [Config.SERVICE_LOGO]
						})

				}
			},
			adClick: function() {
				uni.navigateTo({
					url: '/pages/index/product?id='+this.banner.param
				})
			},
			autoRefreshCode: function() {
				let self = this
				self.timer = setInterval(()=>{
					self.$refs.qrcode.creatQrcode()
				}, 8000)
			},
			clearTimer: function() {
				if (!Util.isEmptyObject(this.timer))
					clearInterval(this.timer)
			}
		},
		onHide() {
			console.log('onHide')

			this.clearTimer()
		},
		onPullDownRefresh() {
			console.log('onPullDownRefresh')
			if ((this.userInfo === undefined && this.isTryGetUserInfo)
				|| (this.userInfo != undefined && !Util.containsKey(this.userInfo, 'nickName') && this.isTryGetUserInfo)) {

			} else {
				console.log('hideLogin')
				this.loginDialogData = Object.assign({}, this.loginDialogData, {
					show: false
				})
			}

			if (!this.loginDialogData.show && this.userInfo.user_key !== undefined) {
				this.GetMyInfo();
			}
		},
		onShareAppMessage() {
			return {
				title: '友邻优选-大家都在用的社区团购APP',
				path: '/pages/index/main?user_key='+this.userInfo.user_key+'&i='+this.globalI
			}
		}
	}
</script>

<style>
	page{
		display: flex;
		background:white;
		flex-direction: column;
	}
	.top-bg-img {
	  width: 100%;
	  height: 60rpx;
	  background-attachment: fixed;
	  background-repeat: no-repeat;
	  background-size: cover;
	  background-image: url(../../static/top_bg.png);
	}

	.top {
		width: 100%;
		height: 240rpx;
		background: #1dc422;
		display: flex;
		padding-top: 30rpx;
	}

	.top .head {
		width: 120rpx;
		height: 100rpx;
		margin-left: 40rpx;
		border-radius: 50%;
	}

	.top .info {
		width: calc(100% - 210rpx);
		margin-left: 30rpx;
		display: flex;
		flex-direction: column;
	}

	.top .info .name {
		font-size: 30rpx;
		line-height: 50rpx;
		font-weight: bold;
		margin-top: 20rpx;
		color: #fff;
	}

	.top .info .community {
		font-size: 28rpx;
		line-height: 36rpx;
		color: #fff;
	}

	.top .info .address {
		font-size: 24rpx;
		line-height: 36rpx;
		color: #fff;
	}

	.top .info .address image {
		width: 26rpx;
		height: 26rpx;
		margin-left: 10rpx;
		margin-bottom: -4rpx;
	}
	.top .message {
		width: 50rpx;
		height: 50rpx;
		/* margin-left: 25rpx; */
		margin-top: 22rpx;
		margin-right: 20px;

	}
	.message_tip{
		width: 30upx;
		height: 30upx;
		line-height: 30upx;
		text-align: center;
		background: #E84118;
		border-radius: 15upx;
		color: #fff;
		position: absolute;
		font-size: 20upx;
		margin-left: 25upx;
		margin-top: 15upx;
	}

	.order-box {
		width: calc(100% - 60rpx);
		height: 222rpx;
		margin-top: -120rpx;
		margin-left: 30rpx;
		margin-right: 30rpx;
		background: #fff;
		border-radius: 20rpx;
		display: flex;
		flex-direction: column;
		box-shadow:0px 10px 20px 0px rgba(0, 0, 0, 0.02);
		z-index:1000 ;
	}

	.order-box .all-order {
		width: calc(100% - 40rpx);
		height: 90rpx;
		line-height: 90rpx;
		padding-left: 20rpx;
		padding-right: 20rpx;
		font-size: 32rpx;
		color: #333;
		font-weight: bold;
		border-bottom: solid 1rpx #eee;
		background: #fff;
		border-top-left-radius: 20rpx;
		border-top-right-radius: 20rpx;
	}

	.order-box .all-order text {
		font-size: 28rpx;
		color: #999;
		float: right;
		font-weight: 400;
		margin-right: 20rpx;
	}

	.order-box .all-order .arrow {
		width: 22rpx;
		height: 22rpx;
		margin-top: 34rpx;
		float: right;
	}

	.order-box .items {
		width: 100%;
		height: 150rpx;
		display: inline-flex;
		background: #fff;
		border-bottom-left-radius: 20rpx;
		border-bottom-right-radius: 20rpx;
	}

	.order-box .items .item {
		width: 20%;
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.order-box .items .item image {
		width: 60rpx;
		height: 60rpx;
		margin-top: 20rpx;
	}

	.order-box .items .item text {
		font-size: 20rpx;
		color: #333;
		font-weight: 500;
	}

	.order-box .items .item .tag {
		width: 30upx;
		height: 30upx;
		line-height: 30upx;
		text-align: center;
		background: #E84118;
		border-radius: 15upx;
		color: #fff;
		position: absolute;
		font-size: 20upx;
		margin-left: 25upx;
		margin-top: 15upx;
	}

	.nav-box {
		width: calc(100% - 60rpx);
		margin-top: 20upx;
		margin-left: 30rpx;
		margin-right: 30rpx;
		background: #fff;
		border-radius: 20rpx;
		display: flex;
		flex-direction: column;
		box-shadow:0px 10px 20px 0px rgba(0, 0, 0, 0.02);
		z-index:1000 ;
	}

	.columns {
		width: calc(100% - 60rpx);
		margin-left: 30upx;
		margin-top: 40upx;
		display: flex;
		flex-direction: column;
	}

	.column {
		width: 100%;
		height: 80rpx;
		line-height: 80rpx;
		display: inline-flex;
		align-items: center;
		justify-content: space-between;
		border-bottom: solid 1rpx #f4f4f4;
	}

	.column .left {
		display: flex;
		align-items: center;
	}

	.column .left image {
		width: 44rpx;
		height: 44rpx;
	}

	.column .left text {
		font-size: 28rpx;
		color: #333;
		font-weight: 500;
		margin-left: 20rpx;
	}

	.column .arrow {
		width: 22rpx;
		height: 22rpx;
	}

	.delivery-code {
		width: 100%;
		display: inline-flex;
		padding-top:60rpx;
		background:white;
	}

	.delivery-code .code {
		width: 200rpx;
		height: 200rpx;
		margin-left: 80rpx;
		margin-right: 40rpx;
	}

	.delivery-code .code image {
		width: calc(100% - 10rpx);
		height: calc(100% - 10rpx);
		padding: 5rpx;
	}

	.delivery-code .code canvas {
		background: #fff;
		width: 100%;
		height: 100%;
	}

	.delivery-code .info {
		width: calc(100% - 320rpx);
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.delivery-code .info .take-text {
		font-size: 30rpx;
		color: #e84118;
		margin-top: 20rpx;
	}

	.delivery-code .info .take-code {
		font-size: 22rpx;
		color: #999;
		margin-top: 10rpx;
	}

	.delivery-code .info .get-code {
		width: 180rpx;
		height: 50rpx;
		line-height: 50rpx;
		text-align: center;
		border-radius: 30rpx;
		font-size: 22rpx;
		color: #e84118;
		border: solid 1rpx #e84118;
		margin-top: 10rpx;
	}

	.columns button {
		/* position:unset; */
		display: unset;
		padding-left: unset;
		padding-right: unset;
		box-sizing: unset;
		font-size: unset;
		text-align: center;
		text-decoration: unset;
		line-height: unset;
		border-radius: unset;
		-webkit-tap-highlight-color: unset;
		overflow: unset;
		color: unset;
		background-color: unset;
	}
	switch {
		zoom: .7;
	}
	button::after {
		border: none;
	}

	.mask {
		width: 100%;
		height: 100%;
		position: fixed;
		top: 0;
		left: 0;
		background: #000;
		opacity: 0.2;
		overflow: hidden;
		z-index: 99998;
		color: #fff;
	}

	.code-dialog {
		width: calc(100% - 160rpx);
		height: 620rpx;
		left: 80rpx;
		top: calc(50% - 270rpx);
		background: #fff;
		border-radius: 20rpx;
		position: fixed;
		z-index: 99999;
	}

	.dialog-title {
		width: 100%;
		height: 100rpx;
		line-height: 100rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.dialog-title .space {
		width: 40rpx;
		height: 40rpx;
	}

	.dialog-title text {
		font-size: 30rpx;
		font-weight: bold;
		color: #333;
	}

	.dialog-title .close {
		width: 40rpx;
		height: 40rpx;
		margin-right: 20rpx;
		margin-top: -15rpx;
	}

	.code-dialog .code {
		width: 360rpx;
		height: 360rpx;
		margin-left: calc(50% - 180rpx);
	}

	.code-dialog .desc {
		width: 100%;
		height: 80rpx;
		line-height: 29rpx;
		text-align: center;
		font-size: 30rpx;
		color: #e84118;
		margin-top: 20rpx;
	}

	.isMaskPhone {
		width: 100%;
		height: 100%;
		position: fixed;
		top: 0;
		left: 0;
		z-index: 1000;
		background: #000;
		opacity: 0.5;
	}

	#isPhone {
		position: fixed;
		width: 480rpx;
		height: 250rpx;
		background: #fff;
		top: 50%;
		left: 50%;
		margin-left: -265rpx;
		margin-top: -185rpx;
		z-index: 1001;
		padding: 50rpx 50rpx;
		border-radius: 12rpx;
	}

	.isLoginBtn {
		display: flex;
		justify-content: space-around;
	}

	.isLoginBtn button,
	.isLoginBtn navigator {
		background: #fff;
		height: 68rpx;
		line-height: 68rpx;
		font-size: 28rpx;
		width: 260rpx;
		text-align: center;
		color: #4bad37;
		border: 1rpx solid #eee;
		border-radius: 12rpx;
	}

	.isLoginBtn navigator {
		margin-right: 20rpx;
		background: #f2f2f2;
		color: #999;
	}

	.loginTitle {
		font-size: 34rpx;
	}

	.shopImg {
		height: 80rpx;
		display: flex;
		align-items: center;
		padding: 20rpx 0rpx;
		justify-content: center;
		font-size: 28rpx;
	}

	.shopImg>image {
		margin: 0 14rpx 0 0;
		width: 68rpx;
		height: 68rpx;
		border-radius: 50%;
	}

	.ad-box {
		width: 100%;
		height: 120rpx;
		margin-top: 40rpx;
	}

	.ad-box .ad {
		width: 100%;
		height: 100%;
	}
	._qrCode {
		display:flex;
	align-content:center;
	justify-content:center;
	}
	.version-container {
		width: 100%;
		height: 100upx;
		line-height: 100upx;
		text-align: center;
		color: #999;
	}
</style>
