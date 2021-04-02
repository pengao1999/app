<template>
	<view class="">
		<QSTabsWxsListRefresh ref="QSTabsWxs" minWidth="125rpx" fontSize="28rpx" activeFontSize="36rpx" activeFontColor="#222"
		 type="default" tabsSticky refreshImage="/static/chaoyuezu/refresh.png" :height="windowHeight">
			<view class="" style="width: 100%;" slot="pre">
				<view class="topView"></view>
			</view>
			<view :style="{height: windowHeight - statusBarHeight + 'px'}" style="height:1000px;width: 100%;" slot="pos"></view>
		</QSTabsWxsListRefresh>
	</view>
</template>

<script>
	import QSTabsWxs from '../components/QS-tabs-wxs-list/QS-tabs-wxs-list.vue';
	import QSTabsWxsListRefresh from '../components/QS-tabs-wxs-list/QS-tabs-wxs-list-refresh.vue';
	const {
		windowHeight,
		statusBarHeight
	} = uni.getSystemInfoSync();

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
			QSTabsWxsListRefresh
		},
		data() {
			return {
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
						name: '悦机',
						id: "tab_1",
						hasRefreshContainerBackgroundColor: "#40d2ef",
						type: 'yueji'
					},
					// {
					// 	name: '购机',
					// 	id: "tab_2",
					// 	hasRefreshContainerBackgroundColor: "#40d2ef",
					// 	type: 'zulin'
					// },
					{
						name: '维修',
						id: "tab_2",
						hasRefreshContainerBackgroundColor: "#40d2ef",
						type: 'weixiu'
					},
					{
						name: '回收',
						id: "tab_3",
						hasRefreshContainerBackgroundColor: "#40d2ef",
						type: 'zulin'
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
		methods: {
			getTopViewHeight() {
				let view = uni.createSelectorQuery().in(this);
				view.select('.topView').boundingClientRect();
				view.exec(res => {
					console.log('总高度:' + JSON.stringify(res));
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
