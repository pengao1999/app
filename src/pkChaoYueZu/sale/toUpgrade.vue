<template>
	<view class="coloum-container" style="padding: 20rpx 30rpx 30rpx 30rpx;">
		<view style="text-align: center;color: #000000;font-size: 36rpx;font-weight: 800;">
			校园经理晋升细则
		</view>
		<view style="width: 100%;margin-bottom: 40upx;">
			<view class="title">一 、晋升标准</view>
			<view class="msg">1.招聘校园大使5人</view>
			<view class="msg">2.直接出租赁单一单</view>
			<view class="title">二 、经理晋升细则</view>
			<view class="msg">1.平台服务费：因为公司会给你提供(场地、平台、新人培训、经理晋升培训、销售体系和财务系统、寒暑假集训、创业指导、经理各种奖励与福利).直接交1000元
				直接交200元，经理为单位租赁单代扣100元，扣满1500元为止</view>
			<view class="msg">2.待遇细节：</view>
			<view class="msgtable" style="grid-template-columns: 1fr 1fr 1fr;">
				<view class="table-cel">

				</view>
				<view class="table-cel">
					校园经理
				</view>
				<view class="table-cel">
					校园大使
				</view>
				<view class="table-cel">
					手机租赁
				</view>
				<view class="table-cel">
					240
				</view>
				<view class="table-cel">
					120
				</view>
				<view class="table-cel">
					电脑租赁
				</view>
				<view class="table-cel">
					360
				</view>
				<view class="table-cel">
					180
				</view>
			</view>
			<view class="title">三 、福利</view>
			<view class="msg">1.佩戴经理职位专用工牌，着经理正装,拍创业者艺术照上文化墙</view>
			<view class="msg">2.获得户外活动，省内旅游，自驾游,出国旅游奖励</view>
			<view class="msg">3.可参加经理会议，获得了解公司内部重要信息的资格</view>
			<view class="msg">4.得到命名自己团队的机会,并获得团队管理奖金</view>
			<view class="msg">5.享受节假日礼品发放</view>
			<view class="msg">6.可开出公司优秀实习证明和创业证明，向老师和企业证明你的优势和能力</view>
			<view class="title">四 、奖励</view>
			<view class="msg">1.冲刺成为校园合伙人</view>
			<view class="msg">2.得到公司重点培养,获得片区经理,市场部负责人一对一创业指导</view>
			<view class="title">五 、培养经理奖励</view>
			<view class="msg">1.冲刺成为校园合伙人</view>
			<view class="msgtable" style="grid-template-columns: auto auto auto auto auto;">
				<view class="table-cel">
					平台服务费
				</view>
				<view class="table-cel">
					直接
				</view>
				<view class="table-cel">
					扣满后
				</view>
				<view class="table-cel">
					校园合伙人
				</view>
				<view class="table-cel">
					片区经理
				</view>
				<view class="table-cel">
					1000元
				</view>
				<view class="table-cel">
					200
				</view>
				<view class="table-cel">
					0
				</view>
				<view class="table-cel">
					100
				</view>
				<view class="table-cel">
					100
				</view>
				<view class="table-cel">
					200元
				</view>
				<view class="table-cel">
					100
				</view>
				<view class="table-cel">
					30%
				</view>
				<view class="table-cel">
					10%
				</view>
				<view class="table-cel">
					10%
				</view>
			</view>
			<view class="msg">2.培养新经理是校园合伙人评选的最重要指标</view>
			<view class="title">六 、通过谈单考核及片区经理评估可进入报价群</view>
		</view>
		<view class="btn" @click.stop="tosaledetails">
			<button type="default">立即晋升</button>
		</view>
	</view>
</template>

<script>
	export default {
		components: {

		},
		data() {
			return {

			}
		},
		methods: {
			tosaledetails() {
				uni.navigateTo({
					url:'/pkChaoYueZu/index/saledetail?key=' + 'fdbf2965eb1fbbf284774f949f32e20b'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.title {
		font-size: 30rpx;
		font-weight: 600;
	}

	.msg {
		text-indent: 2em;
		font-size: 24rpx;
	}

	.msgtable {
		width: 100%;
		border-top: 1rpx solid black;
		border-left: 1rpx solid black;
		display: inline-grid;

		.table-cel {
			font-size: 24rpx;
			text-align: center;
			border-right: 1rpx solid black;
			border-bottom: 1rpx solid black;
		}
	}

	.btn {
		width: 100%;
		padding: 0 25rpx;
		box-sizing: border-box;

		button {
			font-weight: bolder;
			color: grey;
		}
	}
</style>
