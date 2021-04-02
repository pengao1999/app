<template>
	<view class="container" style="position: relative;">
		<view class="searchheader" style="position: sticky;top: 0;">
			<view class="searchinput">
				<input @input='inputValue' style="text-align: center;width: 100%;height: 100%;" type="text" focus="true"
				 placeholder="请输入商品名" value="" />
			</view>
			<view class="searchbtn" @click.stop="detailSearch">
				搜索
			</view>
		</view>
		<view class="resultValue" v-if="resultRes.length > 0">
			<block v-for="(item,index) in resultRes">
				<view class="shopcard" @click.stop="toshopdetails(item,index)" v-if="item.unit !== '周'">
					<view class="shopcard_img">
						<image :src="image_root + item.pic" mode=""></image>
					</view>
					<view class="shopcard_msg">
						<view class="msg_title">
							{{item.name}}
						</view>
						<view class="msg_icon" v-if="item.tags">
							<view class="icon">
								{{item.tags}}
							</view>
						</view>
						<view class="msg_money">
							{{item.price}}/{{item.unit}}
						</view>
					</view>
				</view>
			</block>
		</view>
		<view class="resultValueDelete" v-else>
			<view class="resultValueDelete_img">
				<image src="/static/zulin/profile/empty.png" mode=""></image>
			</view>
			<view class="resultValue_msg">
				暂无产品,请重新搜索
			</view>
		</view>
	</view>
</template>

<script>
	import Config from '../../../common/js/Config'
	export default {
		data() {
			return {
				searchValue: '',
				image_root: 'https://res.chaoyuezu.cn/attachment',
				resultRes: []
			};
		},
		onLoad() {
			console.log(Config);
			console.log(this.$Phttp)
		},
		methods: {
			inputValue(e) {
				this.searchValue = e.detail.value
			},
			detailSearch() {
				let self = this
				if(!self.searchValue){
					return false
				}
				let parme = {
					goodName: self.searchValue
				}
				self.$Phttp.get(Config.JAVA_SAAS_URLS.searchDetail, parme).then((res) => {
					console.log(res)
					if (res.data.code == 0) {
						this.resultRes = res.data.data
					}
				})
			},
			toshopdetails(item, index) {
				console.log(item, index)
				uni.navigateTo({
					url: '/pkChaoYueZu/index/detail?key=' + item.goods_key
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.searchheader {
		width: 100%;
		display: flex;
		padding: 0 25rpx;
		box-sizing: border-box;
		background-color: #FFFFFF;

		.searchinput {
			flex: 1;
			margin-right: 20rpx;
		}

		.searchbtn {
			padding: 0 30rpx;
			border-radius: 40rpx;
			background: linear-gradient(270deg, #6cb5f8 0%, #329cfe 100%);
			color: #FFFFFF;
		}
	}

	.resultValue {
		width: 100%;

		.shopcard {
			width: 100%;
			padding: 20rpx 25rpx;
			background-color: #FFFFFFF;
			display: flex;
			justify-content: flex-start;
			align-items: center;

			.shopcard_img {
				width: 200rpx;
				height: 200rpx;
				margin-right: 20rpx;

				image {
					width: 200rpx;
					height: 200rpx;
				}
			}

			.shopcard_msg {
				flex: 1;
				height: 200rpx;
				display: flex;
				flex-direction: column;
				justify-content: space-around;
				align-items: flex-start;

				.msg_title {
					font-size: 30rpx;
					line-height: 1.5;
					text-overflow: -o-ellipsis-lastline;
					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-line-clamp: 2;
					-webkit-box-orient: vertical;
				}

				.msg_icon {
					display: flex;

					.icon {
						display: inline-block;
						background: linear-gradient(270deg, #6cb5f8 0%, #329cfe 100%);
						padding: 0 20rpx;
						border-radius: 40rpx;
						margin-right: 10rpx;
						color: #FFFFFF;
					}
				}

				.msg_money {}
			}
		}
	}
	.resultValueDelete{
		width: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 100rpx 0;
		.resultValueDelete_img{
			image{
				width: 400rpx;
				height: 300rpx;
			}
		}
		.resultValue_msg{
			margin-top: 25rpx;
			color: #000000;
			font-size: 30rpx;
		}
	}
</style>
