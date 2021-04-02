const pay = (payData, orderInfo, success, fail) => {
	// #ifdef H5
	payH5(payData, orderInfo, success, fail)
	// #endif
	// #ifdef MP-WEIXIN
	payWx(payData, orderInfo, success, fail)
	// #endif
	// #ifdef APP-PLUS
	payWxNative(payData, orderInfo, success, fail)
	// #endif
}

const payH5 = (payData, orderinfo, success, fail) => {
	if (typeof WeixinJSBridge == "undefined"){
	   if( document.addEventListener ){
		   document.addEventListener('WeixinJSBridgeReady', onBridgeReady(payData, success, fail), false);
	   }else if (document.attachEvent){
		   document.attachEvent('WeixinJSBridgeReady', onBridgeReady(payData, success, fail));
		   document.attachEvent('onWeixinJSBridgeReady', onBridgeReady(payData, success, fail));
	   }
	}else{
	   onBridgeReady(payData, success, fail);
	}
}

function onBridgeReady(payData, success, fail){
	console.log(payData)
   WeixinJSBridge.invoke(
      'getBrandWCPayRequest', payData,
      function(res){
      if(res.err_msg == "get_brand_wcpay_request:ok" ){
		  success(res)
      } else {
		  fail(res)
	  }
   });
}

const payWx = (payData, orderinfo, success, fail) => {
	uni.requestPayment({
		provider: 'wxpay',
		timeStamp: payData.timeStamp,
		nonceStr: payData.nonceStr,
		package: payData.package,
		signType: payData.signType,
		paySign: payData.paySign,
		success: function (res) {
			success(res)
		},
		fail: function (err) {
			fail(err)
		}
	});
}

const payWxNative = (payData, orderinfo, success, fail) => {
	console.log(payData)
	console.log(orderinfo)
	let order = orderinfo.provider==="alipay"?payData:JSON.stringify(payData)
	uni.requestPayment({
		provider: orderinfo.provider,
		// provider: 'wxpay',
		orderInfo: order,
		success: function (res) {
			success(res)
		},
		fail: function (err) {
			uni.showModal({
				title: "错误提示",
				content: "支付失败,请重新支付"
			})
			fail(err)
		}
	});
}

export default {
	methods: {
		pay : pay
	}
}
