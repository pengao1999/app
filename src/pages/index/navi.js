export default {
	data() {
		return {
			isToProduct: false
		}
	},
	methods: {
		toAddress: function() {
			uni.navigateTo({
				url: '/pkUserInfo/address/address?way=2'
			});
		},
		toProduct: function(good,activity_key,activity_endtime) {
			let self = this
			self.setInChooseProductCartNum(good.cart_num)
			if (self.isToProduct) return
			self.isToProduct = true
			setTimeout(()=> {
				self.isToProduct = false
			}, 800)
			uni.navigateTo({
				// url: '/pages/index/product?goods_key='+good.goods_key+"&activity_key="+activity_key+"&activity_endtime="+activity_endtime
				url: '/pages/index/product_new?goods_key='+good.goods_key
			})
		},
		toArea: function() {
			uni.navigateTo({
				url: '/pkUserInfo/address/area?page=1'
			})
		}
	}
}


// {
// 	"isReady":true,
// 	"tools":{
// 		"__UUID__":5,
// 		"UNKNOWN":-1,
// 		"IOS":0,
// 		"ANDROID":1,
// 		"platform":0,
// 		"debug":true,
// 	},
// 	"bridge":{
// 		"NO_RESULT":0,
// 		"OK":1,
// 		"CLASS_NOT_FOUND_EXCEPTION":2,
// 		"ILLEGAL_ACCESS_EXCEPTION":3,
// 		"INSTANTIATION_EXCEPTION":4,
// 		"MALFORMED_URL_EXCEPTION":5,
// 		"IO_EXCEPTION":6,
// 		"INVALID_ACTION":7,
// 		"JSON_EXCEPTION":8,
// 		"ERROR":9,
// 		"callbacks":{
// 			"plus21551592251884":{},
// 			"plus41551592251898":{},
// 		},
// 		"commandQueue":[
// 			"[\"HBuilder\",\"Console\",\"logLevel\",null,[\"LOG\",\"undefined\",null]]",
// 			"[\"HBuilder\",\"Console\",\"logLevel\",null,[\"LOG\",\"[object Object]\",null]]",
// 			"[\"HBuilder\",\"Console\",\"logLevel\",null,[\"LOG\",\"App Launch\",null]]",
// 			"[\"HBuilder\",\"Console\",\"logLevel\",null,[\"LOG\",\"App Show\",null]]",
// 		],
// 		"isInEvalJs":0,
// 		"synExecXhr":{},
// 		"execIframe":null,
// 		"execImg":null,
// 	},
// 	"obj":{},
// 	"accelerometer":{},
// 	"audio":{
// 		"ROUTE_SPEAKER":0,
// 		"ROUTE_EARPIECE":1,
// 	},
// 	"barcode":{
// 		"QR":0,
// 		"EAN13":1,
// 		"EAN8":2,
// 		"AZTEC":3,
// 		"DATAMATRIX":4,
// 		"UPCA":5,
// 		"UPCE":6,
// 		"CODABAR":7,
// 		"CODE39":8,
// 		"CODE93":9,
// 		"CODE128":10,
// 		"ITF":11,
// 		"MAXICODE":12,
// 		"PDF417":13,
// 		"RSS14":14,
// 		"RSSEXPANDED":15,
// 	},
// 	"cache":{},
// 	"camera":{},
// 	"console":{},
// 	"contacts":{
// 		"ADDRESSBOOK_PHONE":0,
// 		"ADDRESSBOOK_SIM":1,
// 	},
// 	"downloader":{
// 		"__taskList__":[],
// 	},
// 	"fingerprint":{},
// 	"gallery":{
// 		"__galleryStatus":0,
// 		"onPickImageFinished":null,
// 	},
// 	"geolocation":{
// 		"lastPosition":null,
// 	},
// 	"io":{
// 		"PRIVATE_WWW":1,
// 		"PRIVATE_DOC":2,
// 		"PUBLIC_DOCUMENTS":3,
// 		"PUBLIC_DOWNLOADS":4,
// 	},
// 	"android":{
// 		"__Tool":{
// 			"undefObjectHash":{},
// 		},
// 	},
// 	"ios":{
// 		"__Tool":{
// 			"undefObjectHash":{},
// 		},
// 	},
// 	"maps":{
// 		"MapType":{
// 			"MAPTYPE_SATELLITE":"MAPTYPE_SATELLITE",
// 			"MAPTYPE_NORMAL":"MAPTYPE_NORMAL",
// 		},
// 		"SearchPolicy":{
// 			"TRANSIT_TIME_FIRST":"TRANSIT_TIME_FIRST",
// 			"TRANSIT_TRANSFER_FIRST":"TRANSIT_TRANSFER_FIRST",
// 			"TRANSIT_WALK_FIRST":"TRANSIT_WALK_FIRST",
// 			"TRANSIT_FEE_FIRST":"TRANSIT_FEE_FIRST",
// 			"DRIVING_TIME_FIRST":"DRIVING_TIME_FIRST",
// 			"DRIVING_NO_EXPRESSWAY":"DRIVING_NO_EXPRESSWAY",
// 			"DRIVING_FEE_FIRST":"DRIVING_FEE_FIRST",
// 		},
// 		"__bridge__":{
// 			"callback":[],
// 		},
// 	},
// 	"messaging":{
// 		"TYPE_SMS":1,
// 		"TYPE_MMS":2,
// 		"TYPE_EMAIL":3,
// 	},
// 	"nativeUI":{},
// 	"nativeObj":{},
// 	"navigator":{
// 		"__statusBarHeight__":44,
// 	},"oauth":{},"orientation":{},"payment":{},"key":{},"proximity":{},"push":{},"runtime":{"arguments":"","version":"9.1.40","innerVersion":"1.9.9.58828","launchLoadedTime":0,"launcher":"default","origin":"default","processId":"358","startupTime":1551591211881,"appid":"HBuilder","channel":""},"share":{},"speech":{},"statistic":{},"storage":{},"stream":{},"ui":{"__nviews__":{}},"uploader":{"__taskList__":{}},"video":{},"webview":{"__JSON_Window_Stack":{"HBuilder":{"__view_array__":[],"__IDENTITY__":"NWindow","__uuid__":"HBuilder","__callbacks__":{"back":[null]},"__callback_id__":"plus21551592251884","id":"HBuilder"}}},"widget":{},"net":{},"zip":{},"shortvideo":{},"ibeacon":{},"bluetooth":{},"Media":{},"device":{"imei":" ","imsi":[],"model":"iPhoneX","vendor":"Apple","uuid":"BAB35758-58E5-43B5-AC34-5DBD2E85442B"},"os":{"language":"zh-Hans-CN","version":"12.1.4","name":"iOS","vendor":"Apple"},"screen":{"resolutionHeight":812,"resolutionWidth":375,"scale":3,"dpiX":458,"dpiY":458},"display":{"resolutionHeight":768,"resolutionWidth":375},"networkinfo":{"CONNECTION_TYPE":3,"CONNECTION_UNKNOW":0,"CONNECTION_NONE":1,"CONNECTION_ETHERNET":2,"CONNECTION_WIFI":3,"CONNECTION_CELL2G":4,"CONNECTION_CELL3G":5,"CONNECTION_CELL4G":6},"_plusready_dispatch":"Y"}
