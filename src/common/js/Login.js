function getLoginCode(callback) {
	uni.login({
		provider: 'weixin',
		success: function (loginRes) {
			// TODO:登录认证
			callback(loginRes)
		},
		fail: function(res) {
		}
	});
}

function getUserInfo(callback) {
	uni.getUserInfo({
		provider: 'weixin',
		success: function (infoRes) {
			callback(infoRes)
		},
		fail: function(infoRes) {
			callback(infoRes)
		}
	});
}

export default {
	getLoginCode: getLoginCode,
	getUserInfo: getUserInfo
}