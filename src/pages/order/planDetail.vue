<template>
	<view>
		<view class='record-box'>
			<view class='col-title'>
				<text>配送概要</text>
				<!-- <text class="more" @click="dataPanel()">更多</text> -->
			</view>
			<view class="h_line"></view>
			<view class='items'>
				<view class='item'>
					<text class='money'>{{totalNum}}</text>
					<text class='name'>全部(件)</text>
				</view>
				<view class='item'>
					<text class='money'>{{data.count.ready}}</text>
					<text class='name'>待配送(件)</text>
				</view>
				<view class='item'>
					<text class='money'>{{data.count.sending}}</text>
					<text class='name'>配送中(件)</text>
				</view>
				<view class='item'>
					<text class='money green'>{{data.count.complete}}</text>
					<text class='name'>已完成(件)</text>
				</view>
			</view>
		</view>
		<view class="order-head" v-if="false">
			<view class="item">
				<text>计划类型</text>
				<picker @change="bindPickerChange" :value="index" :range="array">
					<view class="uni-input">{{array[index]}}</view>
				</picker>
			</view>
			<view class="item">
				<text>开始时间</text>
				<picker mode="date" :value="date" :start="picker_start" :end="picker_end" @change="startChange">
					<text class="time-tag">{{begin}}</text>
				</picker>
			</view>
			<view class="item">
				<text>结束时间</text>
				<picker mode="date" :value="date" :start="picker_start" :end="picker_end" @change="endChange">
					<text class="time-tag">{{end}}</text>
				</picker>
			</view>
			<view class="item">
				<text>隔</text>
				<view style="display: flex; align-items: center;">
					<input style="text-align: right;" v-model="day" placeholder="请输入天数" />
					<text>天</text>
				</view>
			</view>
		</view>
		<view class='record-box' v-if="arrive_plans.length>0">
			<view class='col-title'>
				<text>已送达计划</text>
			</view>
			<view class="h_line"></view>
			<view class="plan" v-for="(item, index) in arrive_plans" :key="index">
				<view class="title">{{item.date}}</view>
				<text>{{item.num}}件</text>
			</view>
			<!-- <view class="add" v-if="showAdd" @click="showAddPlanDialog()">添加配送计划</view> -->
		</view>
		<view class='record-box' v-if="ready_plans.length>0">
			<view class='col-title'>
				<text>配送中计划</text>
			</view>
			<view class="h_line"></view>
			<view class="plan" v-for="(item, index) in ready_plans" :key="index">
				<view class="title">{{item.date}}</view>
				<text>{{item.num}}件</text>
			</view>
			<!-- <view class="add" v-if="showAdd" @click="showAddPlanDialog()">添加配送计划</view> -->
		</view>
		<view class='record-box' v-if="plan.length>0">
			<view class='col-title'>
				<text>未执行计划</text>
				<button class="cu-btn " style="margin-left: auto;" @click="resetPlans">重定计划</button>
			</view>
			<view class="h_line"></view>
			<view class="plan" v-for="(item, index) in plan" :key="index">
				<view class="title">{{item.date}}</view>
				<input type="number" style="text-align: right;" :data-index="index" :value="item.num" @input="inputNum" placeholder="请输入配送数量"
					   disabled="false" />
				<text>件</text>
				<view class="delete" @click="modify(item, index)">改期</view>
			</view>
			<!-- <view class="add" v-if="showAdd" @click="showAddPlanDialog()">添加配送计划</view> -->
		</view>
		<view class='record-box' v-if="td_plans.length>0">
			<view class='col-title'>
				<text>已退订计划</text>
			</view>
			<view class="h_line"></view>
			<view class="plan" v-for="(item, index) in td_plans" :key="index">
				<view class="title">{{item.date}}</view>
				<text>{{item.num}}件</text>
			</view>
			<!-- <view class="add" v-if="showAdd" @click="showAddPlanDialog()">添加配送计划</view> -->
		</view>
		<view style="width: 100%; height: 120px;"></view>
		<!-- <view class="save" @click="setPlan()" v-if="plan.length>0">保存配送计划</view> -->
		<add-plan-dialog ref="addPlan" :show="showAddPlan" @close="closeAddPlanDialog"></add-plan-dialog>

		<view class="cu-modal " :class="showModifyDialog?'show': ''">
			<view class="cu-dialog">
				<view class="cu-bar bg-white justify-end">
					<view class="content">修改日期</view>
					<view class="action" @click="showModifyDialog=false">
						<text class="icon-close text-red"></text>
					</view>
				</view>
				<view class="padding-xl">
					<view class="cu-form-group">
						<view class="title">日期选择</view>
						<picker mode="date" :value="modifyForm.date" :start="picker_start" end="2020-09-01" @change="DateChange">
							<view class="picker">
								{{modifyForm.date}}
							</view>
						</picker>
					</view>
				</view>
				<view class="cu-bar bg-white justify-end">
					<view class="action">
						<button class="cu-btn line-green text-green" @click="showModifyDialog=false">取消</button>
						<button class="cu-btn bg-green margin-left" style="margin-left: 10upx;" @tap="comfirm">确定</button>

					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	Date.prototype.Format = function(fmt) {
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
			if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[
					k]).substr(("" + o[k]).length)));
		return fmt;
	}

	import Toast from '@/common/js/toast.js'
	import Config from '@/common/js/Config.js'
	import Util from '@/common/js/util.js'
	import AddPlanDialog from '../../components/yx_dialog/addPlanDialog.vue'
	export default {
		data() {
			return {
				modifyForm: {
					plan_key: -1,
					date: '',
					num: 0,
					index: 0
				},
				showModifyDialog: false,
				lists: [{}, {}, {}, {}, {}, {}, {}],
				num: 0,
				displayNum: 0,
				mode: 'next',
				day: 2,
				start_timstamp: '',
				end_timestamp: '',
				array: ['隔天送', '节假日', '自定义'],
				index: 0,
				begin: '2019-08-20',
				end: '2019-09-20',
				picker_start: '2019-08-20',
				picker_end: '2019-09-20',
				planNum: 0,
				totalNum: 0,
				last: 0,
				order_key: 0,
				goods_key: 0,
				data: {},
				plan: [],
				ready_plans: [],
				arrive_plans: [],
				td_plans: [],
				showAdd: false,
				showAddPlan:false,
				config: {
					devliery_day_setting:'0', //运达天数
					devliery_cost_setting:'0', //运费
					devliery_home_switch:'1',//开启送到家
					devliery_plan_switch:'1',//开启配送计划
					devliery_leader_switch:'1',//开启送到提货点
					delivery_stocking_period: '1', //备货期
					delivery_order_plan_modify_period: '1', //修改截止日期
				},
				attr_keys: ''
			}
		},
		watch: {
			plan: {
				handler() {
					let planNum=0
					this.plan.forEach(function(item){
						planNum+=item.num
					})
					this.showAdd = (this.planNum > planNum)
				}
			},
		},
		mixins: [Toast],
		components: {AddPlanDialog},
		onLoad(options) {
			let self = this
			self.num = parseInt(options.num)
			self.displayNum = parseInt(options.num)
			// self.mode = options.mode
			// let start_timstamp = new Date(options.start.replace(/-/g, '/')).getTime()
			// let end_timestamp = new Date(options.end.replace(/-/g, '/')).getTime()
			// self.end_timestamp = end_timestamp
			// self.start_timstamp = start_timstamp
			self.order_key = options.order_key
			self.goods_key = options.goods_key
			self.attr_keys = options.attr_keys
			switch (options.mode) {
				case 'next':
					self.getAllNext(start_timstamp, end_timestamp, self.day)
					break
				case 'holiday':
					self.getAllHoliday(options.start.replace(/-/g, ''), options.end.replace(/-/g, ''))
					break
				case 'custom':
					self.getCustom(start_timstamp, end_timestamp)
					break
			}
			self.getGoodsPlan()
			self.getConfig()

			self.$event.$on(Config.EVENT.REFRESH_PLANS, () => {
				self.getGoodsPlan()
			})
		},
		methods: {
			bindPickerChange: function(e) {
				console.log('picker发送选择改变，携带值为', e.target.value)
				this.index = e.target.value
			},
			recreateTime() {
				let self = this
				self.lists = []
				self.displayNum = self.num
				self.getAllNext(self.start_timstamp, self.end_timestamp, self.day)
			},
			getAllNext(start, end, day) {
				let self = this
				self.toast({
					type: 'loading'
				})
				createTime(start)

				function createTime(timestamp) {
					if (timestamp > end) return
					if (self.lists.length >= self.num) return
					self.lists.push({
						time: new Date(timestamp).Format("yyyy-MM-dd"),
						num: '',
						type: 0
					})
					createTime(timestamp + self.day * 24 * 60 * 60 * 1000)
				}
				self.toast(true)
			},
			DateChange(e) {
				this.modifyForm.date = e.detail.value
				console.log(this.modifyForm)
			},
			modify(row, index) {
				let self = this
				if (!self.couldModify(row.date)) {
					self.toast({
						desc: self.config.delivery_stocking_period + '天备货期内的配送计划，不允许修改～'
					})
					return
				}
				self.modifyForm = Object.assign(row, {
					index: index
				})
				self.showModifyDialog = true
			},
			couldModify(date) {
				let self = this
				let planInt = self.dateToInt(date)
				let now = parseInt(new Date().getTime()) + parseInt(self.config.delivery_stocking_period)*86400*1000
				let beginDate = self.dateToInt(new Date(now).Format("yyyy-MM-dd"))

				if (planInt < beginDate+1) return false
				return true
			},
			dateToInt(date) {
				var temp = date.split("-")
				return parseInt(temp.join(""))
			},
			getCustom(start, end) {
				let self = this
				createTime(start)

				function createTime(timestamp) {
					console.log('createTime')
					if (timestamp > end) return
					if (self.lists.length >= self.num) return
					self.lists.push({
						time: new Date(timestamp).Format("yyyy-MM-dd"),
						num: '',
						type: 0
					})
					createTime(timestamp + 24 * 60 * 60 * 1000)
				}
			},
			inputNum(e) {
				let self = this
				let index = e.currentTarget.dataset.index
				let num = parseInt(e.detail.value)
				self.lists[index].num = num
				let total = 0
				self.lists.forEach((item, lIndex) => {
					total += parseInt(item.num === '' ? 0 : item.num)
				})
				if (total > self.num) {
					self.displayNum = 0
					self.toast({
						desc: '已超过商品数量，将按日期配送，数量为0截止'
					})
				} else {
					self.displayNum = self.num - total
				}
			},
			getAllHoliday(start, end) {
				console.log(start, end)
				let self = this
				self.$Phttp.post(Config.JAVA_SAAS_URLS.getHoliday, {
					start: start,
					end: end,
					count: self.num
				}).then(res => {
					res = res.data
					res.data.forEach((item, index) => {
						self.lists.push({
							time: item.date.toString().replace(/(\d{4})(\d{2})(\d{2})/g, '$1-$2-$3'),
							num: '',
							type: item.type
						})
					})
				})
			},
			getGoodsPlan: function() {
				let self = this
				let data = {
					order_key: self.order_key,
					goods_key: self.goods_key,
					attr_keys: self.attr_keys === 'null'?'':self.attr_keys
				}
				self.toast({
					type: 'loading'
				})
				self.$Phttp.post(Config.JAVA_SAAS_URLS.getGoodsPlan, data).then((res) => {
					self.toast(true)
					res = res.data
					if (res.code === 0) {
						this.data = res.data
						self.totalNum = this.data.count.ready + this.data.count.sending + this.data.count.complete
						self.planNum = this.data.count.ready
						let planArr = []
						let ready_plans = []
						let arrive_plans = []
						let td_plans = []
						for (let i = 0; i < this.data.no_ready_plans.length; i++) {
							planArr.push({
								id: this.data.no_ready_plans[i].id,
								date: Util.getDate(this.data.no_ready_plans[i].plan_time),
								num: this.data.no_ready_plans[i].plan_num
							})
						}
						for (let i = 0; i < this.data.arrive_plans.length; i++) {
							arrive_plans.push({
								id: this.data.arrive_plans[i].id,
								date: Util.getDate(this.data.arrive_plans[i].plan_time),
								num: this.data.arrive_plans[i].plan_num
							})
						}
						for (let i = 0; i < this.data.ready_plans.length; i++) {
							ready_plans.push({
								id: this.data.ready_plans[i].id,
								date: Util.getDate(this.data.ready_plans[i].plan_time),
								num: this.data.ready_plans[i].plan_num
							})
						}
						for (let i = 0; i < this.data.td_plans.length; i++) {
							td_plans.push({
								id: this.data.td_plans[i].id,
								date: Util.getDate(this.data.td_plans[i].plan_time),
								num: this.data.td_plans[i].plan_num
							})
						}
						self.plan = planArr
						self.ready_plans = ready_plans
						self.arrive_plans = arrive_plans
						self.td_plans = td_plans
					}
				})
			},
			setPlan: function() {
				let self = this
				let data = {
					order_key: self.order_key,
					goods_key: self.goods_key,
					plans:JSON.stringify(self.plan)
				}
				self.$Phttp.post(Config.JAVA_SAAS_URLS.reGeneratePlan, data).then((res) => {
					res = res.data
					if (res.code === 0) {

					}
				})
			},
			deletePlan: function(index) {
				this.plan.splice(index, 1)
			},
			showAddPlanDialog() {
				this.showAddPlan = true;
				this.$nextTick(() => {
					this.$refs.addPlan.init()
				})
			},
			getConfig: function() {
				let self = this
				self.$Phttp.post(Config.JAVA_SAAS_URLS.orderSetting, {}).then(res => {
					res = res.data
					if (res.code ===0) {
						self.config = Object.assign(self.config, res.data)
						let start = parseInt(new Date().getTime()) + parseInt(self.config.delivery_order_plan_modify_period)*86400*1000
						self.picker_start = new Date(start).Format("yyyy-MM-dd")
						console.log(self.picker_start)
					}
				})
			},
			comfirm() {
				let self = this
				console.log(self.modifyForm.date + ' 00:00:00')
				let postData = {
					plan_key: self.modifyForm.plan_key,
					plan_time: new Date(self.modifyForm.date).getTime() / 1000
				}
				self.toast({
					type: 'loading'
				})
				console.log(postData)
				self.$Phttp.post(Config.JAVA_SAAS_URLS.editdeliveryPlan, postData).then(res => {
					res = res.data
					console.log(res)
					if (res.code === 0) {
						self.showModifyDialog = false
						self.plan[self.modifyForm.index].date = self.modifyForm.date
						self.toast({
							desc: '修改成功'
						})
					}
				})
			},
			closeAddPlanDialog(obj) {
				this.showAddPlan = false
				if (obj) {
					if(Number(obj.num)>(this.planNum-this.getPlanNum())){
						uni.showToast({
							title:'添加数量已超过剩余数量',
							icon:'none'
						})
						return
					}
					this.plan.push({
						date:obj.plan_time,
						num:obj.num
					})
				}
			},
			getPlanNum(){
				let num=0
				for(let i=0;i<this.plan.length;i++){
					num+=this.plan[i].num
				}
				return num
			},
			resetPlans() {
				let self = this
				var mPlan = []
				let num = 0
				self.plan.forEach((row, index) => {
					if (self.couldModify(row.date)) {
						mPlan.push(row)
						num += row.num
					}
				})
				uni.setStorageSync("opPlans", mPlan)

				let now = parseInt(new Date().getTime()) + (parseInt(self.config.delivery_stocking_period)+1)*86400*1000
				let end = now+365*24*60*60*1000
				let beginDate = new Date(now).Format("yyyy-MM-dd")
				let endDate = new Date(end).Format("yyyy-MM-dd")
				uni.navigateTo({
					url: '/pages/order/plan?start='+beginDate+'&end='+endDate+'&num='+num + '&mode=rebuild' + '&order_key=' + self.order_key + "&goods_key=" +self.self.goods_key 
				})
			}
		}
	}
</script>

<style>
	page{
		background: #f6f6f6;
	}
	.record-box {
		width: calc(100% - 40rpx);
		margin-left: 20rpx;
		margin-right: 20rpx;
		margin-top: 20rpx;
		background: #fff;
		border-radius: 20rpx;
		display: flex;
		flex-direction: column;
		-webkit-box-shadow: 0px 10px 20px 0px rgba(0, 0, 0, 0.02);
		box-shadow: 0px 10px 20px 0px rgba(0, 0, 0, 0.02);
	}

	.record-box .col-title {
		width: calc(100% - 40rpx);
		height: 90rpx;
		line-height: 90rpx;
		padding-left: 20rpx;
		padding-right: 20rpx;
		background: #fff;
		border-top-left-radius: 20rpx;
		border-top-right-radius: 20rpx;
		font-size: 26rpx;
		color: #000000;
		font-weight: 400;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.record-box .col-title .icon{
		width: 24rpx;
		height: 24rpx;
		margin-left: 18rpx;
	}

	.record-box .col-title .more{
		margin-left: auto;
		line-height: unset;
		height: unset;
	}

	.record-box .col-title .arrow{
		width: 12rpx;
		height: 22rpx;
		margin-left: 14rpx;
	}
	.record-box .items {
		width: calc(100% - 48rpx);
		padding-left: 24rpx;
		padding-right: 24rpx;
		display: flex;
	}

	.record-box .items .item {
		width: 25%;
		height: 202rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
	}

	.record-box .items .item .money {
		font-size: 34rpx;
		color: #000000;
		font-weight: 400;
	}

	.record-box .items .item .money.green{
		color: #00BE06
	}

	.record-box .items .item .name {
		font-size: 24rpx;
		color: #666;
		margin-top: 10rpx;
		text-align: center;
	}

	.order-head {
		width: calc(100% - 60rpx);
		padding: 10rpx 30rpx;
		display: flex;
		flex-direction: column;
		border-bottom: solid 1rpx #eee;
	}

	.plan {
		width: calc(100% - 40rpx);
		padding: 0 20rpx;
		height: 80rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 28rpx;
		color: #333;
	}

	.plan .delete {
		padding:2upx 8upx;
		background: #aaa;
		border-radius: 5upx;
	}

	.fixed-btn {
		width: 690upx;
		height: 80upx;
		margin: 40upx 30upx;
		position: fixed;
		bottom: 30upx;
		z-index: 10000;
	}

	.bg-green-linear {
		color: white;
		background: linear-gradient(45deg, #39b54a, #8dc63f);
	}

	.add {
		width: calc(100% - 80rpx);
		margin-left: 40rpx;
		margin-right: 40rpx;
		height: 76rpx;
		text-align: center;
		line-height: 76rpx;
		border-radius: 40rpx;
		background: #fff;
		margin-top: 30rpx;
		margin-bottom: 30rpx;
		font-size: 28rpx;
		color: #1dc422;
		border: solid 1px #1dc422;
	}

	.save {
		width: calc(100% - 80rpx);
		left: 40rpx;
		right: 40rpx;
		bottom: 30px;
		position: fixed;
		height: 80rpx;
		text-align: center;
		line-height: 80rpx;
		border-radius: 40rpx;
		background: #1dc422;
		margin-top: 20rpx;
		font-size: 28rpx;
		color: #fff;
	}
</style>
