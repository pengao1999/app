import store from '@/store'
module.exports = {
  post: function(url, data, header, successCall, faildCall, cache=true) {
	  url = 'http://192.168.0.134:8970' + url
    data = Object.assign(data, {
		app_key: "123",
      is_register: store.state.isRegister,
      is_super_plat: process.env.VUE_APP_SUPER_PLATFORM_MODE
    })

    // header = header || 'application/x-www-form-urlencoded'
	header = header || 'application/json'
    uni.request({
      url: url,
      data: data,
      method: 'POST',
      header: {
        'content-type': header,
      },
      success: function(result) {
		  successCall(result)
		  if (cache) {
		  	uni.setStorage({
		  		key: url + JSON.stringify(data),
		  		data: JSON.stringify(result)
		  	})
		  }
	  },
	  fail: function(result) {
		  if (cache) {
		  	 let res = uni.getStorageSync(url + JSON.stringify(data))
				 if (res) {
					 res = JSON.parse(res)
					 successCall(res)
					 return
				 } else {
					 faildCall(result)
				 }
		  }
		  faildCall(result)
	  }
    })
  },
  get: function(url, data, header) {
    header = header || 'application/x-www-form-urlencoded'
    return new Promise((succ, error) => {
      uni.request({
        url: url,
        data: data,
        method: 'GET',
        header: {
          'content-type': header,
          'x-token': store.state.point_token,
					'X-UUID': store.state.uuid
        },
        success: function(result) {
					console.log(JSON.stringify(result))
          succ.call(self, result)
        },
        fail: function(e) {
          error.call(self, e)
          var pages = getCurrentPages()
          var page = pages[pages.length - 1].route
          uni.reLaunch({
            url: '/pages/error',
          })
        },
      })
    })
  },
}
