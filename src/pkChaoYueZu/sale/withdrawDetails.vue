<template>
	<mescroll-uni ref="mescrollRef" @init="mescrollInit" @down="downCallback" @up="upCallback" :down="downOption" :up="upOption" >
		<view class="withdraw-tip">累计佣金：{{total || 0}} 元</view>
		<view class="withdrawList" v-for="(item, index) in dataList" :key="index">
			<view class="split10"></view>
			<view class="withdraw-lineA">
				<view class="withdraw-A1">
					<view class="title">提现到{{ item.bank_name }}</view>
					<view class="money">+{{ item.withdraw_money }}元</view>
				</view>
				<view class="withdraw-A1">
					<view class="time">{{ item.create_time }}</view>
					<view class="state" :class="item.state === '待审核' ? 'fcred' : ''">{{ item.state }}</view>
				</view>
			</view>
			<view class="withdraw-lineB">
				<view class="withdraw-B1">
					<view class="value">{{ item.withdraw_money }}</view>
					<view class="title">申请佣金</view>
				</view>
				<view class="withdraw-B1">
					<view class="value">{{ item.withdraw_money }}</view>
					<view class="title">实际金额</view>
				</view>
				<view class="withdraw-B1">
					<view class="value">0</view>
					<view class="title">提现手续费</view>
				</view>
			</view>
		</view>
	</mescroll-uni>

</template>

<script>
import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins.js"
import MescrollUni from "@/components/mescroll-uni/mescroll-uni.vue"
import Config from '../../common/js/Config.js'
import Util from '../../common/js/util.js'
import Toast from '../../common/js/toast.js'
import StatusFilter from '@/common/js/StatusFilter.js'

export default {
	mixins: [MescrollMixin], // 使用mixin (在main.js注册全局组件)
	components: {
		MescrollUni
	},
	onLoad(options) {
			this.total = options.total
		},
		computed: {
			userInfo() {
				return this.$store.state.userInfo
			}
		},
	data() {
		return {
			total: 0,
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
			dataList: []
		}
	},
	methods: {
		/*下拉刷新的回调 */
		downCallback() {
			let self = this;
			self.dataList = [];
			self.mescroll.resetUpScroll()
		},
		/*上拉加载的回调: 其中page.num:当前页 从1开始, page.size:每页数据条数,默认10 */
		upCallback(page) {
			let self = this;

			let params = {
				page: page.num, // 页码, 默认从1开始
				size: page.size, // 页长, 默认每页10条
				userKey: self.userInfo.user_key
			}

			console.log('upCallback调用接口-获取提现明细：' + Config.JAVA_SAAS_URLS.getWithdrawDetails);
			console.log('upCallback传递参数：' + JSON.stringify(params))
			self.$Phttp.get(Config.JAVA_SAAS_URLS.getWithdrawDetails, params).then(curPageData => {

				console.log('返回数据' + JSON.stringify(curPageData));
				let records = curPageData.data.data.records; // 列表数据
				let curPageLen = records.length; 			 // 当前页数据长度
				let totalPage = curPageData.data.data.pages; // 接口返回总页数
				let totalSize = curPageData.data.data.total; // 接口返回的总数据量

				if(page.num == 1) self.dataList = []; //如果是第一页需手动置空列表

				records.forEach((record, rIndex) => {
					// record.create_time = Util.formaeDateStr(record.create_time)
					record.state = StatusFilter.statusName(record.state)
				})

				//设置列表数据
				self.dataList=self.dataList.concat(records); //追加新数据
				this.mescroll.endBySize(curPageLen, totalSize);

			}).catch(()=>{
				//联网失败, 结束加载
				this.mescroll.endErr();
			})
		}
	}

}
</script>

<style lang="scss" scoped>
page {
    background: #f8f8f8;
}
.fcred {
	color: #F24D4D !important;
}
.withdraw-tip {
    padding: 24rpx 30rpx;
    font-size: 30rpx;
    font-weight:400;
    box-sizing: border-box;
    color: #fff;
    background: #1677FF;
}
.withdrawList {
	background: #fff;
	.withdraw-lineA {
		display: flex;
		flex-direction: column;
		padding: 36rpx 30rpx;
		width: 100%;
		height: 160rpx;
		box-sizing: border-box;
		.withdraw-A1 {
			display: flex;
			align-items: center;
			justify-content: space-between;
			.title, .money {
				font-size:30rpx;
				font-weight:500;
				color:rgba(34,34,34,1);
			}
			.money {}
			.time {
				font-size:24rpx;
				color:rgba(153,153,153,1);
			}
			.state {
				font-size:24rpx;
				color:rgba(102,198,102,1);
			}
		}
	}
	.withdraw-lineB {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 36rpx 60rpx;
		box-sizing: border-box;
		border-top: 1px solid #efefef;
		text-align: center;
		.withdraw-B1 {
			width: 30%;
			padding: 0 20rpx;
			border-right: 1px solid #efefef;
			&:last-child {
				border-right: 0;
			}
			.value {
				color: #222222;
				font-size: 30rpx;
			}
			.title {
				font-size: 26rpx;
				color:rgba(153,153,153,1);
			}
		}
	}
}
.split10 {
	width: 100%;
	height: 20rpx;
	background: #f8f8f8;
}

</style>
