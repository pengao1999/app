import Config from './Config.js'
import store from '../../store'
import Toast from '../../common/js/toast.js'
module.exports = {
  post: function(doFun, data, header) {
    data = Object.assign(data, doFun, {
      m: 'sqtg_sun',
      i: store.state.globalI,
      uuid: store.state.uuid,
    })
    header = header || 'application/x-www-form-urlencoded'
    console.log(Config.SERVER + doFun.do.replace('|', '/'))
    return new Promise((succ, error) => {
      uni.request({
        url: Config.SERVER + doFun.do.replace('|', '/'),
        data: data,
        method: 'POST',
        header: {
          'content-type': header,
          'X-TOKEN': store.state.point_token,
        },
        success: function(result) {
          // console.log('success:' + JSON.stringify(result))
          succ.call(self, result)
        },
        fail: function(e) {
          console.log('fail:' + JSON.stringify(e))
          uni.showToast({
            title: '网络异常～',
            image: '',
            icon: 'none',
          })
          error.call(self, e)
        },
      })
    })
  },
  get: function(doFcun, data, header) {
	  console.log(doFun,data)
    data = Object.assign(data, doFun, {
      m: 'sqtg_sun',
      i: store.state.globalI,
    })
    header = header || 'application/x-www-form-urlencoded'
    return new Promise((succ, error) => {
      uni.request({
        url: Config.SERVER,
        data: data,
        method: 'GET',
        header: {
          'content-type': header,
          'x-token': store.state.point_token,
        },
        success: function(result) {
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
