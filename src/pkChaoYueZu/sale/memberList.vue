<template>
	<view class="content">
		<view class="swiper-tab">
		  <view v-for="(item, index) in tabs" :key="index" :class="{'swiper-tab-item':true,'active':curIndex===item.status}" @tap="clickTab(index)">
			{{item.title}} ({{item.numb}})
		  </view>
		</view>
		<view class="readme-block">
			<image class="list-grid-item-img" src="/static/chaoyuezu/profile/icon-red-star.png"></image>
			代表已经成为校园大使
		</view>
		<mescroll-uni ref="mescrollRef" v-if="curIndex==0" @init="mescrollInit" :down="downOption" @down="downCallback" :up="upOption" @up="upCallback" top="150">
			<view v-for="(item, index) in dataList" :key="index" class="memberlist-item-card">
				<view class="mm-col3">
					<image class="mm-face-img" v-if="item.img" :src="item.img"></image>
					<image class="mm-face-img" v-else src="/static/ic_default_head.png"></image>
				</view>
				<view class="mm-col6">
					<view class="text-title">
						<image class="list-grid-item-img" src="/static/chaoyuezu/profile/icon-red-star.png" v-if="item.role == 'staff'"></image>
						{{item.name?item.name + ' - ':''}}{{item.tel}}</view>
					<view class="text-subtitle">成为分销商时间：{{item.create_time}}</view>
				</view>
				<!-- <view class="mm-col3 tr">
					<view class="text-title">+23</view>
					<view class="text-subtitle">0个成员</view>
				</view> -->
			</view>
		</mescroll-uni>
		<mescroll-uni ref="mescrollRef" v-if="curIndex==1" @init="mescrollInit" :down="downOption" @down="downCallback" :up="upOption" @up="upCallback" top="150">
			<view v-for="(item, index) in dataList2" :key="index" class="memberlist-item-card">
				<view class="mm-col3">
					<image class="mm-face-img" v-if="item.img" :src="item.img"></image>
					<image class="mm-face-img" v-else src="/static/ic_default_head.png"></image>
				</view>
				<view class="mm-col6">
					<view class="text-title">
						<image class="list-grid-item-img" src="/static/chaoyuezu/profile/icon-red-star.png" v-if="item.role == 'staff'"></image>
						{{item.name?item.name:''}} {{item.tel}}</view>
					<view class="text-subtitle">成为分销商时间：{{item.create_time}}</view>
				</view>
				<!-- <view class="mm-col3 tr">
					<view class="text-title">+23</view>
					<view class="text-subtitle">0个成员</view>
				</view> -->
			</view>
		</mescroll-uni>
	</view>
</template>

<script>
import Config from "@/common/js/Config.js";
import Toast from '@/common/js/toast.js'
import Util from '@/common/js/util.js'
// 引入mescroll-mixins.js
import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins.js";
import MescrollUni from "@/components/mescroll-uni/mescroll-uni.vue";

export default {
	mixins: [MescrollMixin, Toast], // 使用mixin
	components: {
		MescrollUni
	},
	onLoad(options) {
		let self = this;
		uni.setNavigationBarTitle({
		      title: "我的会员"
		});
		self.getListByParentKey22()
	},
	computed: {
		userInfo() {
			return this.$store.state.userInfo
		}
	},
	onShow() {},
	data() {
		return {
			tabs: [{title: '一级', numb: '*', status: 0},{title: '二级', numb: '*', status: 1}],
			curIndex: 0,
			downOption: {
				auto: false //是否在初始化后,自动执行downCallback; 默认true
			},
			upOption:{
				// page: {
				// 	num: 0, // 当前页码,默认0,回调之前会加1,即callback(page)会从1开始
				// 	size: 10 // 每页数据的数量
				// },
				noMoreSize: 4, //如果列表已无数据,可设置列表的总数量要大于半页才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看; 默认5
				empty:{
					tip: '~ 暂无数据 ~',
					icon : '/static/chaoyuezu/order/empty.png'
				},
				textNoMore: '我是有底线的!'
			},
			// 列表数据
			dataList: [],
			pageConf: {
				page: 1,
				size: 20
			},
			dataList2: [],
			pageConf2: {
				page: 1,
				size: 20
			}
		}
	},
	methods:{
		getListByParentKey(isInit = false, page) {
			let self = this
			// if (isInit) {
			// 	self.dataList = []
			// 	self.pageConf.page = 1
			// }
			let params = {
				page: page.num || 1, // 页码, 默认从1开始
				size: page.size || 10, // 页长, 默认每页10条
				userKey: self.userInfo.user_key
			}
			self.toast({
				type: 'loading',
				time: 3000
			})
			console.log('调用接口：' + Config.JAVA_SAAS_URLS.getListByParentKey);
			console.log('传递参数：' + JSON.stringify(params))
			self.$Phttp.get(Config.JAVA_SAAS_URLS.getListByParentKey, params).then(res => {
				console.log('返回数据' + JSON.stringify(res));
				self.toast(true)
				let records = res.data.data.records; // 列表数据
				let curPageLen = records.length; 	 // 当前页数据长度
				let totalSize = res.data.data.total; // 接口返回的总数据量

				if (res.data.code === 0) {
					records.forEach((item, index) => {
						item.create_time = Util.timestampToDate(item.create_time)
					})
					self.tabs[0].numb = totalSize
					self.dataList = self.dataList.concat(records)
					this.mescroll.endBySize(curPageLen, totalSize);
				}
				console.log(self.dataList)
			}).catch(()=>{
				//联网失败, 结束加载
				this.mescroll.endErr();
			})
		},
		getListByParentKey2(isInit = false, page) {
			let self = this
			let params = {
				page: page.num, // 页码, 默认从1开始
				size: page.size, // 页长, 默认每页10条
				userKey: self.userInfo.user_key
			}
			self.toast({
				type: 'loading',
				time: 3000
			});
			console.log('调用接口：' + Config.JAVA_SAAS_URLS.getListByParentKey2);
			console.log('传递参数：' + JSON.stringify(params))
			self.$Phttp.get(Config.JAVA_SAAS_URLS.getListByParentKey2, params).then(res => {
				console.log('返回数据' + JSON.stringify(res));
				self.toast(true)
				let records = res.data.data.records; // 列表数据
				let curPageLen = records.length; 	 // 当前页数据长度
				let totalSize = res.data.data.total; // 接口返回的总数据量

				if (res.data.code === 0) {
					records.forEach((item, index) => {
						item.create_time = Util.timestampToDate(item.create_time)
					})
					self.tabs[1].numb = totalSize
					self.dataList2 = self.dataList2.concat(records)
					this.mescroll.endBySize(curPageLen, totalSize);
				}
			}).catch(()=>{
				//联网失败, 结束加载
				this.mescroll.endErr();
			})
		},
		getListByParentKey22() {

			let self = this;
			let Tparams = {
				page: 1, // 页码, 默认从1开始
				size: 10, // 页长, 默认每页10条
				userKey: self.userInfo.user_key
			}
			console.log('初始化2调用接口：' + Config.JAVA_SAAS_URLS.getListByParentKey2);
			console.log('初始化2传递参数：' + JSON.stringify(Tparams))
			self.$Phttp.get(Config.JAVA_SAAS_URLS.getListByParentKey2, Tparams).then(res => {
				console.log('初始化2返回数据' + JSON.stringify(res));
				self.toast(true)
				let records = res.data.data.records; // 列表数据
				let curPageLen = records.length; 	 // 当前页数据长度
				let totalSize = res.data.data.total; // 接口返回的总数据量

				if (res.data.code === 0) {
					self.tabs[1].numb = totalSize
				}
			}).catch(()=>{

			})
		},
		/*下拉刷新的回调 */
		downCallback() {
			let self = this;
			if(self.curIndex === 0) {
				self.dataList = [];
			}else {
				self.dataList2 = [];
			}

			self.mescroll.resetUpScroll()
		},
		/*上拉加载的回调: 其中page.num:当前页 从1开始, page.size:每页数据条数,默认10 */
		upCallback(page) {
			let self = this;

			if(self.curIndex === 0) {
				self.getListByParentKey(true, page);
			}else {
				self.getListByParentKey2(true, page);
			}
		},
		clickTab(curIndex) {
			this.curIndex = curIndex;
			this.dataList = [];
			this.dataList2 = [];
			this.downCallback();
		}
	}
}
</script>

<style lang="scss" scoped>
@import url("../../common/css/animation.css");
page {
  background: #f8f8f8;
}
.content {
	background: #f8f8f8;
}
.tr {
	text-align: right;
}
.swiper-tab {
  width: calc(100% - 60rpx);
  padding-left: 30rpx;
  padding-right: 30rpx;
  text-align: center;
  height: 80rpx;
  line-height: 80rpx;
  display: flex;
  flex-flow: row;
  justify-content: center;
  background: #fff;
}

.swiper-tab-item {
  width: 40%;
  color: #333;
  font-size: 28rpx;
  font-weight: 500;
}

.active {
  color: #1677FF;
  border-bottom: 4rpx solid #1677FF;
}
.readme-block {
	display: flex;
	align-items: center;
	justify-content: flex-start;
	padding-top: 10rpx;
	font-size: 30rpx;
	color: #666;
	background-color: #f8f8f8;
}
.list-grid-item-img {
		margin: 0 15rpx;
		width: 40rpx;
		height: 40rpx;
	}
.memberlist-item-card {
	display: flex;
	align-items: center;
	justify-content: flex-start;
	padding: 36rpx 30rpx;
	background: #fff;
	border-bottom: 1rpx solid #f0f0f0;
	box-sizing: border-box;
	.mm-col3 {
		width: 20%;
		.mm-face-img {
			width: 88rpx;
			height: 88rpx;
			border-radius: 88rpx;
		}
	}
	.mm-col6 {
		flex: 1;
	}
	.text-title {
		display: flex;
		align-items: center;
		font-size: 30rpx;
		font-weight: 600;
		color: #222;
	}
	.text-subtitle {
		font-size: 24rpx;
		color: #999;
	}
}

</style>
