// 对象是否为空
function isEmptyObject(obj) {
	if (JSON.stringify(obj) == "{}") {
		return true
	} else {
		return false
	}
}
function isEmptyString(str) {
	if (str === null || str === undefined || str === "") {
		return true
	} else {
		return false
	}
}
// 是否包含某key
function containsKey(obj, key) {
	if (obj === undefined || obj === null) return false
	return obj.hasOwnProperty(key)
}
function obj2Array(obj) {
	if (obj) {
		var arr = []
		for (let i in obj) {
			arr.push(obj[i]);
		}
		return arr
	} else {
		return []
	}
}
// 是否方法
function isFunction (obj) {
    var type = Object.prototype.toString.call(obj)
    return type == '[object Function]'
}
  //是否对象
function isObject (obj) {
    var type = Object.prototype.toString.call(obj)
    return type == '[object Object]'
}
  // 是否数组
function isArray(obj) {
    var type = Object.prototype.toString.call(obj)
    return type == '[object Array]'
}

function groupBy(array, f) {
	const groups = {};
	array.forEach(function(o) {
		const group = JSON.stringify(f(o));
		groups[group] = groups[group] || [];
		groups[group].push(o);
	});
	return Object.keys(groups).map(function(group) {
		return groups[group];
	});
}

function timestampToDate(timestamp) {
	var now = new Date(timestamp*1000),
		y = now.getFullYear(),
		m = now.getMonth() + 1,
		d = now.getDate(),
		hh = now.getHours(),
		mm = now.getMinutes(),
		ss = now.getSeconds();
	return y + "-" + (m < 10 ? "0" + m : m) + "-" + (d < 10 ? "0" + d : d) + " " + hh + ":" + mm + ":" + ss
}

function formaeDateStr(str) {
	var now = new Date(str),
		y = now.getFullYear(),
		m = now.getMonth() + 1,
		d = now.getDate();
	return y + "-" + (m < 10 ? "0" + m : m) + "-" + (d < 10 ? "0" + d : d)
}
function formaeDateStr2(str) {
	var now = new Date(str),
		y = now.getFullYear(),
		m = now.getMonth() + 1,
		d = now.getDate(),
		hh = now.getHours(),
		mm = now.getMinutes(),
		ss = now.getSeconds();
	return y + "-" + (m < 10 ? "0" + m : m) + "-" + (d < 10 ? "0" + d : d) + " " + hh + ":" + mm + ":" + ss
}

function getDate(timestamp) {
	var now = new Date(timestamp*1000),
		y = now.getFullYear(),
		m = now.getMonth() + 1,
		d = now.getDate();
	return y + "-" + (m < 10 ? "0" + m : m) + "-" + (d < 10 ? "0" + d : d)
	 // + " " + now.toTimeString().substr(0, 8);
}

function timestampToTime(day=1) {
  console.log('day:' + day)
  var date = new Date(Date.parse(new Date()) + (day * 86400000)); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
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
function formatTime(nS) {
	return new Date(parseInt(nS) * 1000).toLocaleString().replace(/:\d{1,2}$/,' ');
}

export default {
	isEmptyObject: isEmptyObject,
	isFunction: isFunction,
	isObject: isObject,
	isArray: isArray,
	containsKey: containsKey,
	obj2Array: obj2Array,
	groupBy: groupBy,
	getDate:getDate,
	timestampToTime: timestampToTime,
	formatTime: formatTime,
	isEmptyString: isEmptyString,
	timestampToDate: timestampToDate,
	formaeDateStr: formaeDateStr,
	formaeDateStr2: formaeDateStr2
}
