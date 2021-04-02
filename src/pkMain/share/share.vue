<template>
	<!-- 分享朋友圈 -->
	<view class="Share-page">
		<view class="tip0">友邻优选</view>
		<view class="tip1">YOULINYOUXUAN</view>
		<canvas class="myCanvas" :style="'width:'+canvasWidth+'px'" canvas-id="myCanvas" @tap="preView()"></canvas>
		<view class="tip2">点击预览，保存图片</view>
	</view>
</template>

<script>
	import Config from '../../common/js/Config.js'
	import Toast from '../../common/js/toast.js'
	export default {
		data() {
			return {
				goods_key: 0,
				goodInfo: {},
				code_local_url: '',
				good_local_url: '',
				myCanvas: Object,
				image_root: '',
				system: {},
				canvasWidth: 0,
				isReadyPreView: false,
				isReadyCode: false,
				isReadyGood: false,
				isReadyBack: false,
				isDrawing: false
			}
		},
		mixins: [Toast],
		watch: {
			code_local_url : {
				handler() {
					if (this.good_local_url !== '' && this.code_local_url !== '' && !this.isDrawing) {
						this.drawShareCard()
					}
				},
				immediate: true
			},
			good_local_url : {
				handler() {
					if (this.good_local_url !== '' && this.code_local_url !== '' && !this.isDrawing) {
						this.drawShareCard()
					}
				},
				immediate: true
			}
		},
		computed: {
			systemInfo() {
				return this.$store.state.systemInfo
			},
			userInfo() {
				return this.$store.state.userInfo
			},
			acts() {
				return this.$store.state.acts
			},
			globalI() {
				return this.$store.state.globalI
			}
		},
		onLoad(options) {
			this.toast({
				type: 'loading',
				desc: '努力加载中...',
				time: 5000
			})
			this.goods_key = options.goods_key
			this.myCanvas = uni.createCanvasContext('myCanvas', this)
			this.measureScreen()
		},
		methods: {
			preView: function() {
				uni.canvasToTempFilePath({
					canvasId: 'myCanvas',
					success: (res) => {
						console.log(res)
						uni.previewImage({
							count:1,
							urls: [res.tempFilePath]
						})
					}
				})
			},
			measureScreen: function() {
				let self = this
				uni.getSystemInfo({
					success: (res) => {
						self.system = res
						self.canvasWidth = this.system.screenWidth-60
						self.getGoodDetail(self.goods_key)
						
					}
				})
			},
			getGoodDetail: function(goods_key) {
				let self = this
				let data = {
					i:self.globalI,
					goods_key : goods_key
				}
				self.$http.post(Config.URLS.goodDetail, data).then((res) => {
					res = res.data
					if (res.code === 0) {
						self.goodInfo = res.data
						self.image_root = res.other.img_root
						self.downLoadImg(res.other.img_root+res.data.pic, 'good')
						self.getMiniProgramCode(good_id)
					}
				})
			},
			getMiniProgramCode: function(good_id) {
				let self = this
				let data = {
					i:self.globalI,
					page : 'pages/index/product',
					scene: self.userInfo.user_key +'-'+good_id +'-'+this.acts.id + '-'+this.acts.end_time+'-'+self.globalI
				}
				self.$http.post(Config.URLS.miniProgramCode, data).then((res) => {
					res = res.data
					if (res.code === 0) {
						self.downLoadImg(res.other.img_root+res.data, 'code')
					}
				})
			},
			downLoadImg: function(uri, way) {
				let self = this
				uni.getImageInfo({
					src: uri,
					success: (res) => {
						if (way === 'good') {
							self.good_local_url = res.path
						} else if (way === 'code') {
							self.code_local_url = res.path
						}
						
					}
				})
			},
			drawShareCard: function() {
				this.isDrawing = true
				this.fillRoundRect(0, 0, this.system.screenWidth-60, 250, 10, '#F8F8F8', false, true, this.good_local_url)
				this.fillBottomCard(0, 250, this.system.screenWidth-60, 140, 10, '#FFFFFF')
				this.myCanvas.drawImage(this.code_local_url, this.system.screenWidth-160, 280, 80, 80)
				this.myCanvas.draw()
				this.toast(true)
			},
			drawMiniProgramCode: function(img_path) {
				console.log('img_path:'+ img_path)
				this.myCanvas.save()
				// this.myCanvas.translate(0, 0)
				this.myCanvas.drawImage(img_path,this.system.screenWidth-150, 350, 100, 100)
				this.myCanvas.restore();
			},
			/**该方法用来绘制一个有填充色的圆角矩形 
			 *@param cxt:canvas的上下文环境 
			 *@param x:左上角x轴坐标 
			 *@param y:左上角y轴坐标 
			 *@param width:矩形的宽度 
			 *@param height:矩形的高度 
			 *@param radius:圆的半径 
			 *@param fillColor:填充颜色 
			 **/
			fillRoundRect: function(x, y, width, height, radius, fillColor, isDrawBottom, isDrawTop, background_img) {
				this.myCanvas.save()
				this.myCanvas.translate(x, y)
				this.drawRoundRectPath(width, height, radius, isDrawBottom, isDrawTop)
				console.log(this.systemInfo)
				if (this.systemInfo.SDKVersion  < "1.9.9") {
					this.myCanvas.setFillStyle(fillColor || "#000")
				} else {
					this.myCanvas.fillStyle = fillColor || "#000";
				}
				this.myCanvas.fill();
				if (background_img !== undefined) {
					this.myCanvas.beginPath(0);
					this.myCanvas.arc(width, height, 0, 0, Math.PI / 2);
					this.myCanvas.lineTo(0, height);
					this.myCanvas.arc(0, height, 0, Math.PI / 2, Math.PI);
					this.myCanvas.lineTo(0, 0);
					//左上角圆弧，弧度从PI到3/2PI  
					this.myCanvas.arc(radius, radius, radius, Math.PI, Math.PI * 3 / 2);
					//上边线  
					this.myCanvas.lineTo(width - radius, 0);
					//右上角圆弧  
					this.myCanvas.arc(width - radius, radius, radius, Math.PI * 3 / 2, Math.PI * 2);
					//右边线  
					this.myCanvas.lineTo(width, height - radius);
					this.myCanvas.clip();
					this.myCanvas.drawImage(background_img, 0, 0, width, height)
					this.myCanvas.closePath();
				}
				this.myCanvas.restore();
			},
			fillBottomCard: function(x, y, width, height, radius, fillColor) {
				this.myCanvas.save()
				this.myCanvas.translate(x, y)
				this.drawRoundRectPath(width, height, radius, true, false)
				if (this.systemInfo.SDKVersion  < "1.9.9") {
					console.log('< 1.9.9')
					this.myCanvas.setFillStyle(fillColor || "#000")
				} else {
					console.log('> 1.9.9')
					this.myCanvas.fillStyle = fillColor || "#000";
				}
				this.myCanvas.fill();
				
				// 绘制文字
				this.drawText('¥', 12, 10, 22,100, '#FF4500')
				this.drawText(this.goodInfo.price, 20, 20, 20, 110, '#FF4500')
				this.drawText(this.goodInfo.name, 12, 10, 40, 150, '#333333')
				console.log('this.system.screenWidth-160:'+(this.system.screenWidth-160))
				this.drawText('长按识别抢购',10, this.system.screenWidth-150, 105, 120, '#333333')
				this.myCanvas.restore();
			},
			drawRoundRectPath: function(width, height, radius, isDrawBottom, isDrawTop) {
				this.myCanvas.beginPath(0);
				//从右下角顺时针绘制，弧度从0到1/2PI  
				if (isDrawBottom) {
					this.myCanvas.arc(width - radius, height - radius, radius, 0, Math.PI / 2);
					//矩形下边线  
					this.myCanvas.lineTo(radius, height);
					//左下角圆弧，弧度从1/2PI到PI  
					this.myCanvas.arc(radius, height - radius, radius, Math.PI / 2, Math.PI);
					//矩形左边线  
					this.myCanvas.lineTo(0, radius);
				} else {
					this.myCanvas.arc(width, height, 0, 0, Math.PI / 2);
					this.myCanvas.lineTo(0, height);
					this.myCanvas.arc(0, height, 0, Math.PI / 2, Math.PI);
					this.myCanvas.lineTo(0, 0);
				}
				if (isDrawTop) {
					//左上角圆弧，弧度从PI到3/2PI  
					this.myCanvas.arc(radius, radius, radius, Math.PI, Math.PI * 3 / 2);
					//上边线  
					this.myCanvas.lineTo(width - radius, 0);
					//右上角圆弧  
					this.myCanvas.arc(width - radius, radius, radius, Math.PI * 3 / 2, Math.PI * 2);
					//右边线  
					this.myCanvas.lineTo(width, height - radius);
				} else {
					this.myCanvas.arc(0, 0, 0, Math.PI, Math.PI * 3 / 2);
					this.myCanvas.lineTo(width, 0);
					this.myCanvas.arc(width, 0, 0, Math.PI * 3 / 2, Math.PI * 2);
					this.myCanvas.lineTo(width, height);
				}
				
				this.myCanvas.closePath();
			},
			drawCircleImg: function(img, x, y, r) {
				this.myCanvas.save();
				var d =2 * r;
				var cx = x + r;
				var cy = y + r;
				this.myCanvas.arc(cx, cy, r, 0, 2 * Math.PI);
				this.myCanvas.clip();
				this.myCanvas.drawImage(img, x, y, d, d);
				this.myCanvas.restore();
			},
			drawText: function(t,s,x,y,w, fillColor){
	
				var chr = t.split("");
				var temp = "";				
				var row = [];
				
				this.myCanvas.setFontSize(s);
				if (this.systemInfo.SDKVersion  < "1.9.9") {
					this.myCanvas.setFillStyle(fillColor || "#000")
				} else {
					this.myCanvas.fillStyle = fillColor || "#000";
				}
				this.myCanvas.textBaseline = "middle";
				
				for(var a = 0; a < chr.length; a++){
					var isTryChangeLine = false
					if (this.systemInfo.SDKVersion  < "1.9.9") {
						if (temp.length < 15) {
							isTryChangeLine = true
						}
					} else {
						if( this.myCanvas.measureText(temp).width < w ){
							isTryChangeLine = true
						}
					}
					if( isTryChangeLine ){
						;
					}
					else{
						row.push(temp);
						temp = "";
					}
					temp += chr[a];
				}
				
				row.push(temp);
				
				for(var b = 0; b < row.length; b++){
					this.myCanvas.fillText(row[b],x,y+(b+1)*20);
				}
			}
		}
	}
</script>

<style>
	page {
		background: #1dc422;
	}
	.Share-page {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
	.tip0 {
		font-size:30upx;
		margin-top: 110upx;
		font-family:MicrosoftYaHei-Bold;
		font-weight:bold;
		color:rgba(255,255,255,1);
	}
	.tip1 {
		margin-top: -10upx;
		font-size:10upx;
		font-family:MicrosoftYaHei;
		font-weight:400;
		color:rgba(255,255,255,1);
	}
	.tip2 {
		margin-top: 20upx;
		font-size:28upx;
		font-family:MicrosoftYaHei;
		font-weight:400;
		color:rgba(255,255,255,1);
	}
	.tipText {
		font-size: 28upx;
		margin-left: 20upx;
		margin-top: 20upx;
		color: #333333;
	}
	.myCanvas {
		border-radius: 40upx;
		margin-top: 20upx;
		height: 390px;
		background: #F8F8F8;
	}
</style>
