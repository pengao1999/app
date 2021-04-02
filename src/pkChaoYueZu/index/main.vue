<template>
	<view>
		<QSTabsWxsListRefresh ref="QSTabsWxs" minWidth="125rpx" fontSize="28rpx" activeFontSize="36rpx" activeFontColor="#222"
		 type="default" tabsSticky refreshImage="/static/chaoyuezu/refresh.png" :height="windowHeight">
			<view class="" style="width: 100%;" slot="pre">
				<view class="topView"></view>
			</view>
			<view :style="{height: windowHeight - statusBarHeight + 'px'}" style="height:1000px;width: 100%;" slot="pos"></view>
		</QSTabsWxsListRefresh>
		<update-dialog :show="showUpdate" :updateInfo="updateInfo" @close="closeUpdateDialog"></update-dialog>
		<customer-service></customer-service>
	</view>
</template>

<script>
	import Config from "../../common/js/Config"
	import QSTabsWxs from '../components/QS-tabs-wxs-list/QS-tabs-wxs-list.vue';
	import QSTabsWxsListRefresh from '../components/QS-tabs-wxs-list/QS-tabs-wxs-list-refresh.vue';
	import CustomerService from '../../components/customer-service/customer-service.vue';
	const {
		windowHeight,
		statusBarHeight
	} = uni.getSystemInfoSync();
	import UpdateDialog from '@/components/yx_dialog/updateDialog.vue'

	function randomColor1() {
		var r = Math.floor(Math.random() * 256);
		var g = Math.floor(Math.random() * 256);
		var b = Math.floor(Math.random() * 256);

		if (r < 16) {
			r = "0" + r.toString(16);
		} else {
			r = r.toString(16);
		}
		if (g < 16) {
			g = "0" + g.toString(16);
		} else {
			g = g.toString(16);
		}
		if (b < 16) {
			b = "0" + b.toString(16);
		} else {
			b = b.toString(16);
		}

		return "#" + r + g + b;
	}
	export default {
		components: {
			QSTabsWxs,
			QSTabsWxsListRefresh,
			UpdateDialog,
			CustomerService
		},
		data() {
			return {
				showUpdate: false,
				updateInfo: {},
				title: 'Hello',
				topViewHeight: 44,
				windowHeight,
				tabs: [{
						name: '租赁',
						id: "tab_0",
						hasRefreshContainerBackgroundColor: "#40d2ef",
						type: 'zulin'
					},
					{
						name: '悦品',
						id: "tab_3",
						hasRefreshContainerBackgroundColor: "#40d2ef",
						type: 'zhishou'
					},
					// {
					// 	name: '悦品',
					// 	id: "tab_1",
					// 	hasRefreshContainerBackgroundColor: "#40d2ef",
					// 	type: 'yueji'
					// },
					// {
					// 	name: '购机',
					// 	id: "tab_2",
					// 	hasRefreshContainerBackgroundColor: "#40d2ef",
					// 	type: 'zulin'
					// },
					// {
					// 	name: '维修',
					// 	id: "tab_2",
					// 	hasRefreshContainerBackgroundColor: "#40d2ef",
					// 	type: 'weixiu'
					// },
					{
						name: '回收',
						id: "tab_3",
						hasRefreshContainerBackgroundColor: "#40d2ef",
						type: 'huishou'
					},
					// {
					// 	name: '百业联盟',
					// 	id: "tab_5",
					// 	hasRefreshContainerBackgroundColor: "#40d2ef",
					// 	type: 'zulin'
					// }

				]
			}
		},
		onReady() {
			let n = 0;
			this.getTopViewHeight();
			this.$refs.QSTabsWxs.setTabs(this.tabs);
		},
		onLoad() {
			let self = this;
			// #ifdef APP-PLUS
			plus.runtime.getProperty(plus.runtime.appid, function(widgetInfo) {
				setTimeout(() => {
					self.checkUpdate(widgetInfo)
				}, 500)
			})
			// #endif
		},
		methods: {
			closeUpdateDialog() {
				this.showUpdate = false
			},
			checkUpdate(widgetInfo) {
				return false
				let self = this
				let version = widgetInfo.version
				let getData = {
					platform: plus.os.name, //plus.os.name
					version: version
				}
				self.$Phttp.get(Config.JAVA_SAAS_URLS.checkUpdate, getData).then((res) => {
					res = res.data
					if (res.code === 0) {
						self.showUpdate = true;
						self.updateInfo = res.data
						if (self.updateInfo.is_force == 1) {
							uni.hideTabBar({
								animation: false
							})
						}
					}
					if (res.code === 200) {
						uni.showModal({
							title: '提示',
							content: '检测到新版本，移步到下载',
							success: function(res) {
								if (res.confirm) {
									plus.runtime.openURL("http://download.chaoyuezu.cn/cyz.apk");
								} else if (res.cancel) {
									plus.runtime.quit();
								}
							}
						})
					}
				})
			},
			getTopViewHeight() {
				let view = uni.createSelectorQuery().in(this);
				view.select('.topView').boundingClientRect();
				view.exec(res => {
					this.topViewHeight = res[0].height;
				})
			},
			back() {
				uni.navigateBack();
			}
		}
	}
</script>

<style>
	.content {
		width: 100%;
	}

	.topView {
		width: 100%;
		height: var(--status-bar-height);
		background-color: white;
	}

	.topViewItem {
		font-size: 16px;
		color: #999;
		width: 15%;
	}
</style>
