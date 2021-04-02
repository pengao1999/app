<template>
	<view class="content">
		<view class="main-block">
			<view class="text">违约总金额(元)</view>
			<view class="money-text">{{listObject.surFineAmt}}</view>
		</view>

		<view class="overduel-list-box">
			<view class="overduel-list-item" v-for="(item, index) in listObject.detailList" v-if="item.status === '02'" :key="index">
				<view class="oli-inner">
					<view class="oli-inner-line">
						<view class="oil-text oil-w1">
							{{item.periods}} 期
						</view>
						<view class="oil-text oil-w2">
							违约 <text class="fs32"> {{item.overDueDays}} </text> 天
						</view>
					</view>
					<view class="oli-inner-line mt24">
						<view>
							<view class="fs24 fc999">待交租金(元）</view>
							<view class="mt24 fs28 fb600 fc222">{{item.surAmt+item.surInterestAmt}}</view>
						</view>
						<view>
							<view class="fs24 fc999">违约金(元）</view>
							<view class="mt24 fs28 fb600 fc222">{{item.surFineAmt}}</view>
						</view>
						<view class="mt24 btn-submit" @click="onRepaymentEvent(item)">立即交租</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import iosBlur from '../../common/js/iosBlur.js'
import Config from '../../common/js/Config.js'
export default {
	name: 'baseInfo',
	mixins: [iosBlur],
	data() {
		return {
			userKey: '',
			listObject: {}
		}
	},
	onLoad(options) {
	  this.userKey = options.userKey;
	  this.billKey = options.billKey;
	  // 解决ios兼容性
	  // #ifdef H5
	  document.body.addEventListener('focusout', () => {
	    this.iosBlur()
	  })
	  document.body.addEventListener('focusin', () => {
	    this.iosBlur()
	  })
	  // #endif
	},
	onShow() {
		let self = this
		if(self.userKey==undefined){
			self.userKey='';
			return ;
		}
		this.onInitPage();
	},
	methods: {
		/**
		 * 初始化数据
		 */
		onInitPage() {
			let self = this;
			uni.showLoading({ title: '加载中' });

			this.$Phttp.get(Config.REQUEST_URLS.getBillResult,{ billKey: self.billKey })
					.then(res => {
						res = res.data;
						if(res.code === 200) {
							console.log("response" + JSON.stringify(res));
							self.listObject = res.data;
						}
						uni.hideLoading();
					})
		},
		/**
		 * 立即交租
		 * @params {Object} 当期对象
		 * @return {}
		 */
		onRepaymentEvent(obj) {
			let self = this;
			let params = {
				billKey: self.billKey, // 账单id
				period: obj.periods, // 期数Id
				payAmt: obj.surTotalAmtt, // 还款金额
				payType: "02",
				userKey: self.userKey
			};
			console.log('请求参数：' + JSON.stringify(params));
			this.$Phttp.post(Config.REQUEST_URLS.executeBillResult, params)
				.then(res => {
					console.log('返回结果：' + JSON.stringify(res));
					if(res.data.code === 200) {
						this.payUrl = res.data.data.payData;
						window.location.href = this.payUrl;
						uni.setStorage({
							key: 'rent_orderId',
							data: res.data.data.orderId,
						});
						uni.setStorage({
							key: 'rent_userKey',
							data: self.userKey
						});
					}else {
						uni.showToast({
							title: res.data.message,
							icon: 'none',
							duration: 3000
						});
					}
				})
		}
	}
}
</script>

<style lang="scss" scoped>
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: calc(100vh - 88rpx);
  background: #f4f4f4;
  .main-block {
	width: 100%;
	height: 316rpx;
	background: #fff;
	display: flex;
	flex-direction: column;
	align-items: center;
	.text {
		font-size: 28rpx;
		color: #999;
		margin: 76rpx 0 0;
	}
	.money-text {
		font-size: 92rpx;
		font-weight: 600;
		color: #FF4230;
		margin: 18rpx 0 0;
	}
  }
  .overduel-list-box {
	  margin-top: 42rpx;
	  width: 100%;
	  .overduel-list-item {
		  margin-bottom: 22rpx;
		  padding: 24rpx 0;
		  box-sizing: border-box;
		  background: #fff;
		  .oli-inner {
			  padding: 0 48rpx;
			  width: 100%;
			  height: 176rpx;
			  box-sizing: border-box;
			  border-left: 8rpx solid #FF4330;
			  .oli-inner-line {
				  display: flex;
				  justify-content: space-between;
				  align-items: center;
				  .oil-text {

				  }
				  .oil-w1 {
					  width: 70%;
					  font-size: 32rpx;
					  font-weight: 600;
					  color: #222;
				  }
				  .oil-w2 {
					  flex: 1;
					  font-size: 24rpx;
					  color: #FF4230;
					  text-align: right;
					  .fs32 {
						  margin: 0 12rpx;
						  font-size: 32rpx;
					  }
				  }
			  }
		  }
	  }
  }
}
.btn-submit {
	background: linear-gradient(
	  90deg,
	  rgba(251, 38, 34, 1) 0%,
	  rgba(255, 131, 18, 1) 100%
	);
	border-radius: 50rpx;
	width: 188rpx;
	height: 56rpx;
	line-height: 56rpx;
	color: #fff;
	font-size: 26rpx;
	font-weight: 400;
	align-items: center;
	text-align: center;
}
.mt24 {
	margin-top: 24rpx;
}
.fs24 {
	font-size: 24rpx;
}
.fs28 {
	font-size: 28rpx;
}
.fc222 {
	color: #222;
}
.fc999 {
	color: #999;
}
.fb600 {
	font-weight: 600;
}
</style>
