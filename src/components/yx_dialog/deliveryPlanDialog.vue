<template>
	<view class="cu-modal bottom-modal" @click="hide" :class="show?'show':''">
		<view class="cu-dialog bg-white" @click.stop="donthide" style="min-height:820upx;">
			<view class="cu-bar">
				<view class="title text-black" style="margin-left: 30upx;">配送计划</view>
				<text class="icon-close" style="margin-right: 20upx;font-size: 40upx;float: right;" @click="hide"></text>
			</view>
			<view class="cu-form-group">
				<view class="title">普通配送</view>
				<view>
					<radio class="select round" :class="deliveryKey=='normal'?'checked': ''" @click="clickRidio('normal')" :checked="deliveryKey=='normal'" value="normal"></radio>
				</view>
			</view>
			<view class="cu-form-group">
				<view class="title">隔天配送</view>
				<view>
					<radio class="select round" :class="deliveryKey=='next'?'checked': ''" @click="clickRidio('next')" :checked="deliveryKey=='next'" value="next"></radio>
				</view>
			</view>
			<view class="cu-form-group" v-if="deliveryKey=='next'" style="border-top: 0upx solid white;">
				<view class="action">
					<view class="time-setter">
						<picker mode="date" :value="date" :start="picker_start" :end="picker_end" @change="startChange">
							<text class="time-tag">{{begin}}</text>
						</picker>
						<text style="margin-left: 10upx;margin-right: 10upx;">至</text>
						<picker mode="date" :value="date" :start="picker_start" :end="picker_end" @change="endChange">
							<text class="time-tag">{{end}}</text>
						</picker>
					</view>
				</view>
				<view class="action" @click="toPlan" style="font-size: 24upx;">
					{{last}}件商品未制定计划 >
				</view>
			</view>
			<block v-if="deliveryKey=='next' && planMode=='next'" >
				<scroll-view scroll-y style="max-height: 400upx;width: 100%;margin-bottom:0upx;">
					<view class="cu-form-group" v-for="(item, index) in plan" :key="index" style="border-top: 0upx solid white;">
						<view class="title">{{item.date}}</view>
						<view class="action">{{item.num}}</view>
					</view>
				</scroll-view>
			</block>
			<view class="cu-form-group">
				<view class="title">节假日配送</view>
				<view>
					<radio class="select round" :class="deliveryKey=='holiday'?'checked': ''" @click="clickRidio('holiday')" :checked="deliveryKey=='holiday'" value="holiday"></radio>
				</view>
			</view>
			<view class="cu-form-group" v-if="deliveryKey=='holiday'" style="border-bottom: 0upx;">
				<view class="action">
					<view class="time-setter">
						<picker mode="date" :value="date" :start="picker_start" :end="picker_end" @change="startChange">
							<text class="time-tag">{{begin}}</text>
						</picker>
						<text style="margin-left: 10upx;margin-right: 10upx;">至</text>
						<picker mode="date" :value="date" :start="picker_start" :end="picker_end" @change="endChange">
							<text class="time-tag">{{end}}</text>
						</picker>
					</view>
				</view>
				<view class="action" @click="toPlan" style="font-size: 24upx;">
					{{last}}件商品未制定计划 >
				</view>
			</view>
			<block v-if="deliveryKey=='holiday' && planMode=='holiday'" >
				<scroll-view scroll-y style="max-height: 400upx;width: 100%;margin-bottom:0upx;">
					<view class="cu-form-group" v-for="(item, index) in plan" :key="index" style="border-top: 0upx solid white;">
						<view class="title">{{item.date}}</view>
						<view class="action">{{item.num}}</view>
					</view>
				</scroll-view>
			</block>
			<view class="cu-form-group">
				<view class="title">自定义配送计划</view>
				<view>
					<radio class="select round" :class="deliveryKey=='custom'?'checked': ''" @click="clickRidio('custom')" :checked="deliveryKey=='custom'" value="custom"></radio>
				</view>
			</view>
			<view class="cu-form-group" v-if="deliveryKey=='custom'">
				<view class="action">
					<view class="time-setter">
						<picker mode="date" :value="date" :start="picker_start" :end="picker_end" @change="startChange">
							<text class="time-tag">{{begin}}</text>
						</picker>
						<text style="margin-left: 10upx;margin-right: 10upx;">至</text>
						<picker mode="date" :value="date" :start="picker_start" :end="picker_end" @change="endChange">
							<text class="time-tag">{{end}}</text>
						</picker>
					</view>
				</view>
				<view class="action" @click="toPlan" style="font-size: 24upx;">
					{{last}}件商品未制定计划 >
				</view>
			</view>
			<block v-if="deliveryKey=='custom' && planMode=='custom'" >
				<scroll-view scroll-y style="max-height: 400upx;width: 100%;margin-bottom:0upx;">
					<view class="cu-form-group" v-for="(item, index) in plan" :key="index" style="border-top: 0upx solid white;">
						<view class="title">{{item.date}}</view>
						<view class="action">{{item.num}}</view>
					</view>
				</scroll-view>
			</block>
			<view style="height: 140upx;"></view>
			<button class="cu-btn round bg-green-linear safe-area" style="height:80upx;width: 690upx;margin:40upx 30upx;position:fixed;bottom:0upx;left:0upx" @click="submit">完成</button>
		</view>
	</view>
</template>

<script>
	import Toast from '../../common/js/toast.js'
	Date.prototype.Format = function (fmt) {
		var o = {
			"M+": this.getMonth() + 1, //月份
			"d+": this.getDate(), //日
			"H+": this.getHours(), //小时
			"m+": this.getMinutes(), //分
			"s+": this.getSeconds(), //秒
			"q+": Math.floor((this.getMonth() + 3) / 3), //季度
			"S": this.getMilliseconds() //毫秒
		};
		if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
		for (var k in o)
			if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
		return fmt;
	}
	export default {
		data() {
			return {
				begin: '2019-08-20',
				end: '2019-12-20',
				picker_start: '2019-08-20',
				picker_end: '2019-12-20',
				planNum: 0,
				last: 0
			}
		},
		mixins: [Toast],
		props: {
			show: {
				type: Boolean,
				default: true
			},
			deliveryKey: {
				type: String,
				default: 'normal'
			},
			num: {
				type: Number,
				default: 0
			},
			name: {
				type: String,
				default: ''
			},
			index: {
				type: Number,
				default: 0
			},
			plan: {
				type: Array,
				default() {
					return []
				}
			},
			planMode: {
				type: String,
				default: 'normal'
			},
			delivery_stocking_period: {
				type: String,
				default: '1'
			}
		},
		watch: {
			plan: {
				handler() {
					this.planNum = 0
					this.plan.forEach((item, index) => {
						this.planNum += parseInt(item.num)
					})
					if (this.deliveryKey === this.planMode) {
						this.last = this.num - this.planNum
					} else {
						this.last = this.num
					}
				},
				immediate: true
			},
			deliveryKey: {
				handler() {
					this.planNum = 0
					this.plan.forEach((item, index) => {
						this.planNum += parseInt(item.num)
					})
					if (this.deliveryKey === this.planMode) {
						this.last = this.num - this.planNum
					} else {
						this.last = this.num
					}
				},
				immediate: true
			},
			delivery_stocking_period: {
				handler() {
					this.calcTime()
				},
				immediate: true
			}
		},
		mounted() {
		},
		methods: {
			calcTime: function() {
				let self = this
				let now = parseInt(new Date().getTime()) + (parseInt(self.delivery_stocking_period)+1)*86400*1000
				let end = now+365*24*60*60*1000
				self.begin = new Date(now).Format("yyyy-MM-dd")
				self.end = new Date(end).Format("yyyy-MM-dd")
				self.picker_start = self.begin
				self.picker_end = new Date(end).Format("yyyy-MM-dd")
			},
			hide: function() {
				this.$emit('hide')
			},
			clickRidio: function(key) {
				this.$emit('clickRidio', key)
			},
			donthide: function() {

			},
			toPlan: function() {
				console.log('/pages/order/plan?start='+this.begin+'&end='+this.end+'&mode='+this.deliveryKey+'&num='+this.num)
				uni.navigateTo({
					url: '/pages/order/plan?start='+this.begin+'&end='+this.end+'&mode='+this.deliveryKey+'&num='+this.num
				})
			},
			startChange: function(e) {
				this.begin = e.detail.value
			},
			endChange: function(e) {
				this.end = e.detail.value
			},
			submit: function() {
				if (this.last !== 0 && this.deliveryKey !== 'normal') {
					this.toast({
						desc: '您还有'+this.last+'件商品未加入配送计划～'
					})
					return
				}
				this.$emit('generatePlan')
			}
		}
	}
</script>

<style>
	.time-tag {
		background: rgba(0,0,0,0.2);
		padding: 0 15upx;
		border-radius: 20upx;
	}
	.time-setter {
		display: flex;
		flex-direction: row;
	}
	.bg-green-linear {
		color: white;
		background: linear-gradient(45deg, #39b54a, #8dc63f);
	}
</style>
