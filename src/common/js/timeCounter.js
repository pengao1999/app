export default {
	data() {
		return {
			countDownDay: '-',
			countDownHour: '-',
			countDownMinute: '-',
			countDownSecond: '-',
			timer : Object,
			canBuy : true
		}
	},
	methods: {
		/**
	   * 倒计时
	   */
	  cutDown: function(endTime) {
		let self = this
		var totalSecond = endTime - Date.parse(new Date()) / 1000;

		self.timer = setInterval(function() {
		  // 秒数
		  var second = totalSecond;

		  // 天数位
		  var day = Math.floor(second / 3600 / 24);
		  var dayStr = day.toString();
		  if (dayStr.length == 1) dayStr = '0' + dayStr;

		  // 小时位
		  var hr = Math.floor((second - day * 3600 * 24) / 3600);
		  var hrStr = hr.toString();
		  if (hrStr.length == 1) hrStr = '0' + hrStr;

		  // 分钟位
		  var min = Math.floor((second - day * 3600 * 24 - hr * 3600) / 60);
		  var minStr = min.toString();
		  if (minStr.length == 1) minStr = '0' + minStr;

		  // 秒位
		  var sec = second - day * 3600 * 24 - hr * 3600 - min * 60;
		  var secStr = sec.toString();
		  if (secStr.length == 1) secStr = '0' + secStr;

		  self.countDownDay = dayStr
		  self.countDownHour = hrStr
		  self.countDownMinute = minStr
		  self.countDownSecond = secStr
		  
		  totalSecond--;
		  if (totalSecond < 0) {
			clearInterval(self.timer);
			uni.showToast({
			  title: '活动已结束',
			});
			self.canBuy = false
			self.countDownDay = '00'
			self.countDownHour = '00'
			self.countDownMinute = '00'
			self.countDownSecond = '00'
		  }
		}.bind(this), 1000);
	  },
	  clearTimerCounter() {
		  let self = this
		  clearInterval(self.timer);
		  self.countDownDay = '-'
		  self.countDownHour = '-'
		  self.countDownMinute = '-'
		  self.countDownSecond = '-'
	  },
	  timestampToTime() {
		  var date = new Date(Date.parse(new Date()) + (1 * 86400000)); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
		  var Y = date.getFullYear();
		  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
		  var D = date.getDate();

		  var week = date.getDay();
		  var str = "星期";
		  switch (week) {
			case 0:
			  str += "日";
			  break;
			case 1:
			  str += "一";
			  break;
			case 2:
			  str += "二";
			  break;
			case 3:
			  str += "三";
			  break;
			case 4:
			  str += "四";
			  break;
			case 5:
			  str += "五";
			  break;
			case 6:
			  str += "六";
			  break;
		  }

		  return M + '月' + D + '日（' + str + ')';
		}
	}
}