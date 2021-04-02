<template>
	<view style="width: 750upx">
		<rich-text :nodes="article" />
		<!--先简单放个webview进去了，后面再优化-->
		<!-- <web-view :src="webViewUrl"></web-view> -->
		<view class="btn" @click.stop="godetails" v-if="isshow">
			<button type="default">点击成为校园大使</button>
		</view>
	</view>
</template>

<script>
	import Config from '../../common/js/Config.js'

	import uParse from '../../common/third/uParse/src/wxParse.vue'

	const htmlBeautify = (html, rule) => {
		if (!rule) {
			rule = {
				img: {
					"max-width": "100%"
				}
			}
		}

		for (const key in rule) {
			if (rule.hasOwnProperty(key)) {
				const element = rule[key];
				let style = ';'
				for (const k in element) {
					if (element.hasOwnProperty(k)) {
						const v = element[k];
						style += `${k}:${v};`
					}
				}

				// let reg = new RegExp(`<${key}>`, 'g')
				var reg = new RegExp(`(i?)(\<${key})(?!(.*?style=[\'\"](.*)[\'\"])[^\>]+\>)`, "gmi");
				let reg1 = new RegExp(`<${key}(.*?)style=[\'\"](.*?)[\'\"]`, 'gmi')

				html = html.replace(reg, `$2 style="" $3`).replace(reg1, `<${key} $1 style="$2${style}"`)
			}
		}
		// html = html.replace(/<p>/, '<p style="">').replace(/<p(.*?)style=[\'\"](.*?)[\'\"]/g, `<p $1 style="$2;max-width:100%;background:#333;"`)

		console.log(html)
		return html
	}

	export default {
		data() {
			return {
				article: '',
				isshow: false
			}
		},
		components: {
			uParse
		},
		onLoad(options) {
			console.log(options);
			if (options.title) {
				uni.setNavigationBarTitle({
					title: options.title
				})
			}
			if (options.isshow == 'true') {
				this.isshow = true
			}
			this.initPage(options)
		},
		computed: {
			userInfo() {
				return this.$store.state.userInfo
			},
			globalI() {
				return this.$store.state.globalI
			},
			webViewUrl() {
				return "http://res.test.appkubes.com/fintech/template.pdf"
			}
		},
		methods: {
			initPage: function(options) {
				this.getArticle(options.id)
			},
			getArticle: function(article_key) {
				let self = this
				let data = {
					article_key: article_key
				}
				self.$Phttp.post(Config.JAVA_SAAS_URLS.getArticle, data).then((res) => {
					res = res.data
					self.article = htmlBeautify(res.data.content)
				})
			},
			godetails: function() {
				uni.navigateTo({
					url: '/pkChaoYueZu/index/saledetail?key=' + '2eb1a1914f376c1de1d3e5654e25c2cd'
				})
			}
		},
		onShareAppMessage() {
			return {
				title: '友邻优选-大家都在用的社区团购APP',
				path: '/pages/index/main?user_key=' + this.userInfo.user_key + '&i=' + this.globalI
			}
		}
	}
</script>

<style lang="scss" scoped>
	image {
		width: 28px;
		height: 28px;
		background-position: 0% 0%;
		background-repeat: no-repeat;
	}

	.btn {
		width: 100%;
		padding: 0 25rpx;
		box-sizing: border-box;

		button {
			font-weight: bolder;
			color: grey;
		}
	}
</style>
