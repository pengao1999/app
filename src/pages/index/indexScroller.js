export default {
	data() {
		return {
			isNearTop: true,
			swiperHeight: 0,
		}
	},
	onPageScroll(e) {
		let self = this
		if (e.scrollTop <= 100) {
			self.isNearTop = true
		} else {
			self.isNearTop = false
		}
		
		if (e.scrollTop <= self.swiperHeight) {
			self.pickData.isFixed = false
		} else {
			self.pickData.isFixed = true
		}
	},
	methods: {
		doScrollTop() {
			uni.pageScrollTo({
				scrollTop: 0,
				duration: 300
			})
		}
	}
}