// #ifdef APP-PLUS
plus.navigator.setStatusBarStyle('dark');
var user_phone = '';
var phone_verify = '';

//以下为计算菜单的nview绘制布局，为固定算法，使用者无关关心
let screenWidth = plus.screen.resolutionWidth
let screenHeight = plus.screen.resolutionHeight
let statusBarHegith = plus.navigator.__statusBarHeight__
let title = {
	tag: 'font',//菜单顶部的分割灰线
	color: '#333333',
	text: '验证码登录',
	position: {
		top: 14+statusBarHegith,
		height: '17px',
		width: '100%',
	},
	textStyles: {
		align: 'center',
		weight: 'bold'
	}
}
let closeButton = {
	tag: 'img',
	id: 'closeLoginView',
	src: '/static/ic_close.png',
	position: {
		top: 15+statusBarHegith,
		right: '15px',
		width: '15px',
		height: '15px'
	}
}
let welcome_tip1 = {
	tag: 'font',
	color: '#000000',
	text: '您好,',
	position: {
		top: 88+statusBarHegith,
		left: '33px',
		height: '21px',
		width: '50px'
	},
	textStyles: {
		size: '20px',
		weight: 'bold'
	}
}
let welcome_tip2 = {
	tag: 'font',
	color: '#707070',
	text: '欢迎加入友邻优选商城',
	position: {
		top: 117+statusBarHegith,
		left: '33px',
		height: '14px',
		width: '140px'
	},
	textStyles: {
		size: '14px'
	}
}
let tel_input = {
	tag: 'input',
	position: {
		top:195+statusBarHegith,
		left:'33px',
		width:'320px',
		height:'20px'
	},
	inputStyles: {
		type: 'number',
		placeholder: '请输入手机号',
		fontSize: '20px',
		borderColor: '#FFFFFF'
	}
}
let tel_rec = {
	tag: 'rect',
	color: '#DAE0E6',
	position: {
		top: 226+statusBarHegith,
		width: '320px',
		height: '1px',
		left: '28px'
	}
}
let verify_input = {
	tag: 'input',
	position: {
		top:238+statusBarHegith,
		left:'33px',
		width:'320px',
		height:'20px'
	},
	inputStyles: {
		type: 'number',
		placeholder: '短信验证码',
		fontSize: '20px',
		borderColor: '#FFFFFF'
	}
}
var nvPage = new plus.nativeObj.View("nvPage", { //先创建页面层
	top: '0px',
	left: '0px',
	height: '100%',
	width: '100%',
	backgroundColor: '#FFFFFF'
});
// nvPage.draw([title, closeButton, welcome_tip1, welcome_tip2, tel_input, tel_rec, verify_input])
var richtext = '<div style="width:100%;text-align:center;padding:20px auto;">验证码登录<div>';
nvPage.drawRichText(richtext, {top:'100px',left:'100px',width:'100%',height:'100%'}, {family:'Times New Roman'})
function setStatusBarStyle(isLight) {
	if (isLight) {
		plus.navigator.setStatusBarStyle('light');
	} else {
		plus.navigator.setStatusBarStyle('light')
	}
}
// #endif
export default {
	data() {
		return {
			
		}
	},
	methods: {
		showLoginView() {
			// #ifdef APP-PLUS
			setStatusBarStyle(true)
			nvPage.show()
			// #endif
		},
		hideLoginView() {
			// #ifdef APP-PLUS
			setStatusBarStyle(false)
			nvPage.hide()
			
			// #endif
		}
	}
}