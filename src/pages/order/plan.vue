<template>
	<view>
		<view class="cu-form-group">
			<view class="title">{{}}</view>
			<view>剩余{{displayNum}}件</view>
		</view>
		<view class="cu-form-group">
			<view class="title">已分配</view>
			<view>{{num-displayNum}}件</view>
		</view>
		<view class="cu-form-group">
			<view class="title">待分配</view>
			<view>{{displayNum}}件</view>
		</view>
		<view class="cu-form-group">
			<view class="title">每次配送</view>
			<view  style="text-align: right;">
				<uni-number-box :min="1" :max="20" :value="perNum" @change="numChange"></uni-number-box> <text style="margin-left: 10upx;">件</text>
			</view>
		</view>
		<view class="cu-form-group" v-if="mode=='next'">
			<view class="title">相隔天数</view>
			<view  style="text-align: right;">
				<uni-number-box :min="1" :max="20" :value="day" @change="dayChange"></uni-number-box> <text style="margin-left: 10upx;">天</text>
			</view>
		</view>
		<view class="cu-form-group" v-if="mode=='next'">
			<view class="title">隔</view>
			<input style="text-align: right;" v-model="day" placeholder="请输入天数" />天
		</view>
		<image class='line' src='../../static/line.png'></image>
		<view style="height: 20upx;"></view>
		<!-- <view class="cu-form-group" v-for="(item, index) in lists" :key="index">
			<view class="title">{{item.time}}{{mode=='holiday'?item.type==2?'(假)':'(休)':''}}</view>
			<input type="number" style="text-align: right;" :data-index="index" :value="item.num" @input="inputNum" placeholder="请输入配送数量"/>
		</view>
		<view style="height:200upx">
		</view> -->
		<uni-calendar :insert="true" :disable-before="tags[3].checked" :range="tags[5].checked" :date="selectedDay" :start-date="startDate" :end-date="endDate" :selected="selected" @change="change" />
		<view class="cu-form-group">
			<view class="title">{{timeData.fulldate}}</view>
			<view class="flex-container align-center justify-center" style="text-align: right;">
				<uni-number-box :index="index" :min="0" :max="20" :lastNum="displayNum" :value="getNumByMap()" @tip="tip()" @change="inputNum"></uni-number-box> <text style="margin-left: 10upx;">件</text>

			</view>
		</view>
		<view style="height:300upx">
		</view>
<!--		&ndash;&gt;-->
<!--		<uni-calendar :insert="true" :disable-before="tags[3].checked" :range="tags[5].checked" :start-date="startDate" :end-date="endDate" :date="timeData.fulldate" :selected="selected" @change="change" />-->
<!--		<view class="cu-form-group">-->
<!--			<view class="title">{{timeData.fulldate}}</view>-->
<!--			<view class="flex-container align-center justify-center" style="text-align: right;">-->
<!--				<uni-number-box :index="index" :min="0" :max="20" :lastNum="displayNum" :value="getNumByMap()" @tip="tip()" @change="inputNum"></uni-number-box> <text style="margin-left: 10upx;">件</text>-->
<!--			-->
<!--			</view>-->
<!--		</view>-->
<!--		<view style="height:280upx">-->
<!--		</view>-->

		<view class="safe-area fixed-btn" v-if="mode=='next'">
			<button class="cu-btn" @click="recreateTime" style="height:80upx;color:white;width: 345upx;background:#007AFF;border-radius:0upx;border-top-left-radius: 20upx;border-bottom-left-radius: 20upx;">刷新</button>
			<button class="cu-btn" @click="confirm" style="height:80upx;color:white;width: 345upx;background:#05BF0A;border-radius:0upx;border-top-right-radius: 20upx;border-bottom-right-radius: 20upx;">完成</button>
		</view>
		<view v-else class="safe-area fixed-btn">
			<button class="cu-btn" @click="recreateTime" style="height:80upx;color:white;width: 345upx;background:#007AFF;border-radius:0upx;border-top-left-radius: 20upx;border-bottom-left-radius: 20upx;">刷新</button>
			<button class="cu-btn" @click="confirm" style="height:80upx;color:white;width: 345upx;background:#05BF0A;border-radius:0upx;border-top-right-radius: 20upx;border-bottom-right-radius: 20upx;">完成</button>
		</view>
	</view>
</template>

<script>
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

	import UniNumberBox from '@/components/uni-number-box.vue'
	import uniCalendar from '@/components/uni-calendar/uni-calendar.vue'
	import Toast from '@/common/js/toast.js'
	import Config from '@/common/js/Config.js'
	export default {
		data() {
			/**
			 * 时间计算
			 */
			function getDate(date, AddMonthCount = 0, AddDayCount = 0) {
				if (typeof date !== 'object') {
					date = date.replace(/-/g, '/')
				}
				let dd = new Date(date)
				dd.setMonth(dd.getMonth() + AddMonthCount) // 获取AddDayCount天后的日期
				dd.setDate(dd.getDate() + AddDayCount) // 获取AddDayCount天后的日期
				let y = dd.getFullYear()
				let m = dd.getMonth() + 1 < 10 ? '0' + (dd.getMonth() + 1) : dd.getMonth() + 1 // 获取当前月份的日期，不足10补0
				let d = dd.getDate() < 10 ? '0' + dd.getDate() : dd.getDate() // 获取当前几号，不足10补0
				return y + '-' + m + '-' + d
			}
			let tags = [{
					id: 0,
					name: '农历',
					checked: false,
					attr: 'lunar'
				},
				{
					id: 1,
					name: '开始日期(' + getDate(new Date(), -1) + ')',
					checked: false,
					value: getDate(new Date(), -1),
					attr: 'startDate'
				},
				{
					id: 2,
					name: '结束日期(' + getDate(new Date(), 2) + ')',
					value: getDate(new Date(), 2),
					checked: false,
					attr: 'endDate'
				},
				{
					id: 3,
					name: '禁用今天之前的日期',
					checked: false,
					attr: 'disableBefore'
				},
				{
					id: 4,
					name: '自定义当前日期(' + getDate(new Date(), 1) + ')',
					value: getDate(new Date(), 1),
					checked: false,
					attr: 'date'
				},
				{
					id: 5,
					name: '范围选择',
					checked: false,
					attr: 'range'
				},
				{
					id: 6,
					name: '打点',
					value: [{
							date: getDate(new Date(), 0, -1),
							info: '打卡'
						},
						{
							date: getDate(new Date(), 0),
							info: '签到',
							data: {
								custom: '自定义信息',
								name: '自定义消息头'
							}
						},
						{
							date: getDate(new Date(), 0, 1),
							info: '已打卡'
						}
					],
					checked: false,
					attr: 'selected'
				}
			]
			return {
				lists: [],
				mapLists: new Map(),
				num: 0,
				displayNum: 0,
				mode: 'normal',
				day: 2,
				start_timstamp: '',
				end_timestamp: '',
				perNum: 1,
				// 日历相关
				tags,
				date: '',
				startDate: getDate(new Date()),
				endDate: '',
				timeData: {
					clockinfo: '',
					date: '',
					fulldate: '',
					lunar: '',
					month: '',
					range: '',
					year: ''
				},
				selected: [],
				planIds: '',
				order_key: -1,
				goods_key: -1,
				selectedDay: ''
			}
		},
		components: {UniNumberBox, uniCalendar},
		mixins: [Toast],
		onLoad(options) {
			let self = this
			self.num = parseInt(options.num)
			self.displayNum = parseInt(options.num)
			self.mode = options.mode
			let start_timstamp = new Date(options.start.replace(/-/g,'/')).getTime()
			let end_timestamp = new Date(options.end.replace(/-/g,'/')).getTime()
			self.end_timestamp = end_timestamp
			self.start_timstamp = start_timstamp
			self.startDate = options.start
			self.selectedDay = self.startDate
			self.endDate = options.end
			switch(options.mode) {
				case 'next' :
					self.getAllNext(start_timstamp, end_timestamp, self.day)
					break
				case 'holiday':
					self.getAllHoliday(options.start, options.end)
					break
				case 'custom' :
					self.getCustom(start_timstamp, end_timestamp)
					break
				case 'rebuild' :
					self.order_key = options.order_key;
					self.goods_key = options.goods_key
					self.checkCache()
			}
		},
		methods: {
			hasCache(op_mode) {
				let self = this
				let plans = self.$cache.get("plans_"+op_mode, false)
				if (!plans) {
					return false
				}
				self.lists = plans
				self.mode = mode
				console.log('hasCache reCalc')
				self.reCalc()
				return true
			},
			checkCache() {
				let self = this
				let plans = uni.getStorageSync("opPlans")
				var ids = []
				plans.forEach((plan, index) => {
					ids.push(plan.id)
					self.lists.push({
						time: plan.date,
						num: plan.num,
						type: 0
					})
					self.mapLists.set(plan.date, self.lists.length-1)
					self.selected.push({
						date: plan.date,
						info: ''
					})
				})
				self.planIds = ids.join(",")
				self.reCalc()
			},
			recreateTime() {
				let self = this
				self.lists = []
				self.selected = []
				self.displayNum = self.num
				self.mapLists.clear()
				switch(self.mode) {
					case 'next' :
						self.getAllNext(self.start_timstamp, self.end_timestamp, self.day)
						break
					case 'holiday':
						self.getAllHoliday(self.startDate, self.endDate)
						break
					case 'custom' :
						self.getCustom(self.start_timstamp, self.end_timestamp)
						break
				}
			},
			getAllNext(start, end, day) {
				let self = this
				self.toast({
					type: 'loading'
				})
				let num = self.num
				createTime(start)
				function createTime(timestamp) {
					if (timestamp > end) return
					if ( num <= 0) return
					let date = new Date(timestamp).Format("yyyy-MM-dd")
					let addNum = num >= self.perNum ? self.perNum : num
					self.lists.push({
						time: date,
						num: addNum,
						type: 0
					})
					self.mapLists.set(date, self.lists.length-1)
					self.selected.push({
						date: date,
						info: ''
					})
					num -= addNum
					createTime(timestamp+self.day*24*60*60*1000)
				}
				self.toast(true)
				console.log('getAllNext reCalc')
				self.reCalc()
			},
			getCustom(start, end) {
				let self = this
				let num = parseInt(self.num)
				createTime(start)
				function createTime(timestamp) {
					if (timestamp > end) return
					if ( num <= 0) return
					let date = new Date(timestamp).Format("yyyy-MM-dd")
					let addNum = num-self.perNum >= 0 ? self.perNum : num

					self.lists.push({
						time: date,
						num: addNum,
						type: 0
					})
					self.mapLists.set(date, self.lists.length-1)
					self.selected.push({
						date: date,
						info: ''
					})
					num -= parseInt(addNum)
					createTime(timestamp+24*60*60*1000)
				}
				self.toast(true)
				self.reCalc()
			},
			dayChange(data) {
				this.day=data.newVal
			},
			numChange(data) {
				this.perNum=data.newVal
			},
			confirm() {
				let self = this
				if (self.mode === 'rebuild') {
					self.reBuildPlan()
					return;
				}
				let plan = []
				let total = 0
				if (self.displayNum !== 0) {
					self.toast({
						desc: '生成失败，您还有' + self.displayNum + '件商品未添加计划～'
					})
					return
				}
				createDeliveryPlan()
				function createDeliveryPlan() {
					self.lists.forEach((item, index) => {
						if (self.num-total <= 0) return
						if (item.num < self.num-total) {
							plan.push({
								date: item.time,
								num: item.num
							})
						} else if (item.num >= self.num-total) {
							plan.push({
								date:item.time,
								num: self.num-total
							})
						}
						total += item.num
					})
				}
				self.$event.$emit('planChange', plan)
				uni.navigateBack()
			},
			inputNum(data) {
				let self = this
				let num = parseInt(data.newVal)
				if (num > 0) {
					if (this.mapLists.get(this.timeData.fulldate) === undefined) {
						self.lists.push({
							time: this.timeData.fulldate,
							num: num,
							type: 0
						})
						self.selected.push({
							date: this.timeData.fulldate,
							info: ''
						})
						self.mapLists.set(this.timeData.fulldate, self.lists.length-1)
					} else {
						self.lists[this.mapLists.get(this.timeData.fulldate)].num = num
					}
				} else {
					if (this.mapLists.get(this.timeData.fulldate) === undefined) {

					} else {
						self.lists.splice(this.mapLists.get(this.timeData.fulldate), 1)
						self.selected.splice(this.mapLists.get(this.timeData.fulldate), 1)
						self.generateMap()
					}
				}

				self.reCalc()
			},
			generateMap() {
				let self = this
				self.mapLists.clear()
				self.lists.forEach((item, index) => {
					self.mapLists.set(item.time, index)
				})
			},
			reCalc() {
				let self = this
				let total = 0
				self.lists.forEach((item, lIndex) => {
					total += parseInt(item.num===''?0:item.num)
				})
				console.log('total:' + total)
				if (total > self.num) {
					self.displayNum = 0
					self.toast({
						desc: '已超过商品数量，将按日期配送，数量为0截止'
					})
				} else {
					self.displayNum = self.num - total
				}
			},
			reducePlat(item, index) {
				let self = this
				self.lists.splice(index, 1)
				console.log('reducePlat reCalc')
				self.reCalc()
			},
			getAllHoliday(start, end) {
				start = new Date(start).getTime() / 1000
				end = new Date(end).getTime() / 1000
				let self = this
				self.$Phttp.post(Config.JAVA_SAAS_URLS.getHoliday, {
					start: start,
					end: end,
					count:self.num
				}).then(res => {
					res = res.data
					let num = self.num
					res.data.forEach((item, index) => {
						let addNum = num - self.perNum >= 0? self.perNum: num
						self.lists.push({
							time: item.holiday,
							num: addNum,
							type: item.type
						})
						self.mapLists.set(item.holiday, self.lists.length-1)
						self.selected.push({
							date: item.holiday,
							info: '假期'
						})
						num -= addNum;
					})
				})
			},
			getNumByMap() {
				if (this.mapLists.get(this.timeData.fulldate) === undefined) return 0
				return this.lists[this.mapLists.get(this.timeData.fulldate)].num
			},
			change(e) {
				this.selectedDay = e.fulldate
				let day = new Date(this.formatDate(e.fulldate)).Format("yyyy-MM-dd")
				this.timeData = Object.assign(e, {
					fulldate: day
				})
			},
			formatDate(fulldate) {
				let self = this
				let dateArr = fulldate.split("-")
				for(var i=1; i<dateArr.length; i++) {
					if (dateArr[i].length === 1) {
						dateArr[i] = '0' + dateArr[i]
					}
				}
				return dateArr.join("-")
			},
			tip() {
				this.toast({
					desc: '已达上限～'
				})
			},
			reBuildPlan() {
				let self = this
				if (self.displayNum !== 0) {
					self.toast({
						desc: '存在未分配的商品～'
					})
					return
				}
				let postData = {
					order_key : self.order_key,
					goods_key : self.goods_key,
					ids: self.planIds,
					plans: JSON.stringify(self.lists)
				}
				self.$Phttp.post(Config.JAVA_SAAS_URLS.reBuildPlans, postData).then(res => {
					res = res.data
					if (res.code === 0) {
						self.$event.$emit(Config.EVENT.REFRESH_PLANS, {});
						uni.navigateBack();
					}
				})
			}
		}
	}
</script>

<style>
	.fixed-btn {
		width: 690upx;
		height: 80upx;
		margin: 40upx 30upx;
		position: fixed;
		bottom: 20upx;
		z-index: 10000;
	}
	.bg-green-linear {
		color: white;
		background: linear-gradient(45deg, #39b54a, #8dc63f);
	}
	.line {
	  width: 100%;
	  height: 4rpx;
	  margin: 0;
	  display: block;
	}
</style>
