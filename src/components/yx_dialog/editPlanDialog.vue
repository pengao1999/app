<template>
	<view v-if="show" class="dialog-main">
		<view class="mask" @click="close()"></view>
		<view class="content">
			<view class="title">修改配送计划</view>
			<view class="col">
				<view class="col-name">
					配送日期
				</view>
				<view class="col-content">
					<picker mode="date" :value="date" :start="startDate" :end="endDate" @change="bindDateChange">
						<text>{{date}}</text>
					</picker>
				</view>
			</view>
			<view class="bottom">
				<view class="btn" @click="close()">取消</view>
				<view class="line"></view>
				<view class="btn" @click="submit()">确认</view>
			</view>
		</view>
	</view>
</template>

<script>
	import Config from '../../common/js/Config.js'
	import Util from '../../common/js/util.js'
	export default {
		props: {
			show: {
				type: Boolean,
				default: false
			},
			item:{
				type:Object
			},
			index:{
				type:Number,
				default:0
			},
			curIndex:{
				type:Number,
				default:0
			}
		},
		data() {
			const currentDate = this.getDate({
				format: true
			})
			return {
				date: currentDate,
			}
		},
		created() {
			this.calcTime()
		},
		computed: {
			startDate() {
				return this.getDate('start');
			},
			endDate() {
				return this.getDate('end');
			}
		},
		methods: {
			init(item){
				this.date=item.plan_time
			},
			calcTime: function() {
				let self = this
				let now = new Date().getTime()
				let end = new Date().getTime() + 365 * 24 * 60 * 60 * 1000
				self.begin = new Date(now).Format("yyyy-MM-dd")
				self.picker_start = self.begin
				self.picker_end = new Date(end).Format("yyyy-MM-dd")
			},
			bindDateChange: function(e) {
				this.date = e.target.value
			},
			startChange: function(e) {
				this.begin = e.detail.value
			},
			endChange: function(e) {
				this.end = e.detail.value
			},
			getDate(type) {
				const date = new Date();
				let year = date.getFullYear();
				let month = date.getMonth() + 1;
				let day = date.getDate()+1;

				if (type === 'start') {
					year = year;
				} else if (type === 'end') {
					year = year + 2;
				}
				month = month > 9 ? month : '0' + month;;
				day = day > 9 ? day : '0' + day;
				return `${year}-${month}-${day}`;
			},
			close() {
				this.$emit('close')
			},
			submit(){
				let self = this
				let plan_time=Date.parse(self.date)/1000
				let data = {
					plan_id:self.item.id,
					plan_time:plan_time,
				}
				console.log(plan_time);
				self.$http.post(Config.URLS.editdeliveryPlan, data).then((res) => {
					res = res.data
					if (res.code === 0) {
						uni.showToast({
							title:'修改成功',
							icon:'none'
						})
						let obj={
							curIndex:self.curIndex,
							index:self.index,
							plan_time:self.date
						}
						this.$emit('close',obj)
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	.dialog-main {
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		position: fixed;
		top: 0;
		left: 0;
	}

	.dialog-main .mask {
		width: 100%;
		height: 100%;
		position: absolute;
		top: 0;
		left: 0;
		z-index: 1000;
		background: #000;
		opacity: 0.5;
	}

	.dialog-main .content {
		width: 80%;
		background: #fff;
		z-index: 1001;
		border-radius: 12rpx;
	}

	.dialog-main .content .title {
		width: calc(100% - 80rpx);
		height: 100rpx;
		line-height: 100rpx;
		padding: 0 40rpx;
		font-size: 32rpx;
		color: #222;
	}

	.dialog-main .content .col {
		width: calc(100% - 80rpx);
		padding: 0 40rpx;
		height: 100rpx;
		display: flex;
		align-items: center;
	}

	.dialog-main .content .col .col-name {
		width: 160rpx;
		height: 100rpx;
		line-height: 100rpx;
		font-size: 28rpx;
		color: #222;
	}

	.dialog-main .content .col .col-content {
		flex: 1;
		height: 100rpx;
		font-size: 28rpx;
		color: #222;
		display: flex;
		align-items: center;
	}

	.dialog-main .content .col .col-content picker {
		
	}

	.dialog-main .content .col .col-content text {
		height: 100%;
		width: 100%;
		font-size: 28rpx;
		color: #666;
	}

	.dialog-main .bottom {
		width: 100%;
		height: 80rpx;
		display: flex;
		border-top: solid 1rpx #eee;
		align-items: center;
	}

	.dialog-main .bottom .btn {
		flex: 1;
		height: 80rpx;
		line-height: 80rpx;
		text-align: center;
		font-size: 28rpx;
		color: #666;
	}

	.dialog-main .bottom .line {
		width: 1rpx;
		height: 40rpx;
		background: #eee;
	}
</style>
