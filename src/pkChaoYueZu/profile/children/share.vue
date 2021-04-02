<template>
  <view class="container">
    <image
      src="/static/share-bg.png"
      :style="{height: positionSize.height + 'px', width: positionSize.width + 'px'}"
    />
    <view class="qrcode" :style="{left: positionSize.left + 'px', top: positionSize.top + 'px'}">
      <!-- <qrcode ref="qrcode" :val="qrval" :size="qrsize"></qrcode> -->
      <tki-qrcode
        ref="qrcode"
        :val="val"
        :size="size"
        :unit="unit"
        :background="background"
        :foreground="foreground"
        :pdground="pdground"
        :icon="icon"
        :iconSize="iconsize"
        :lv="lv"
        :onval="onval"
        :loadMake="loadMake"
        :usingComponents="true"
        @result="qrR"
      />
    </view>
    <button @click="save2Local" class="bottom-btn" v-if="isBtnShow">保存二维码</button>
  </view>
</template>
<script>
import qrcode from '../../../common/third/qrcode/qrcode.vue'
import tkiQrcode from '../../../common/third/tki-qrcode/tki-qrcode.vue'
export default {
  name: 'Share',
  components: { qrcode, tkiQrcode },
  data() {
    return {
      qrval: '123',
      qrsize: 200,
      positionSize: {
        height: 0,
        width: 0,
        left: 0,
        top: 0
      },

      val: '', // 要生成的二维码值
      size: 200, // 二维码大小
      unit: 'px', // 单位
      background: '#FFFFFF', // 背景色
      foreground: '#000000', // 前景色
      pdground: '#000000', // 角标色
      icon: '', // 二维码图标
      iconsize: 40, // 二维码图标大小
      lv: 3, // 二维码容错级别 ， 一般不用设置，默认就行
      onval: true, // val值变化时自动重新生成二维码
      loadMake: true, // 组件加载完成后自动生成二维码
      src: '',// 二维码生成后的图片地址或base64
      isBtnShow: false,
    }
  },
  computed: {
    userInfo() {
      return this.$store.state.userInfo
    }
  },
  onShow() {
    let self = this

    let h, w
    // magic code: 基于设计图计算二维码位置及大小
    // #ifdef H5
    w = screen.width
    // #endif
    // #ifdef APP-PLUS
    w = plus.screen.resolutionWidth
    // #endif

    self.positionSize = {
      width: w,	                //屏幕宽度
      height: w * (1070 / 750),	//按图片宽高比算出高度
      left: 90 * (w / 360),		  //按图片比例算出二维码左移大小
      top: 150 * (w * (1070 / 750) / 510)//按图片比例算出二维码下移大小
    }
    self.size = 200 * (w / 410)

    console.log('pos', self.positionSize)
  },
  onLoad(options) {
    this.val = options.url
  },
  methods: {
    qrR(res) {
      let self = this
      this.src = res
      setTimeout(() => {
        self.isBtnShow = true
      }, 1000)
    },
    save2Local() {
      let pages = getCurrentPages();
      let page = pages[pages.length - 1];
      let ws = page.$getAppWebview();
      let bitmap = new plus.nativeObj.Bitmap('drawScreen');
      // 将webview内容绘制到Bitmap对象中  
      ws.draw(bitmap, () => {
        // 保存图片到本地  
        bitmap.save("_doc/drawScreen.jpg", {
          overwrite: true,
		  format: "jpg"
        }, res => {
          console.log(res.target); // 图片地址 
          uni.saveImageToPhotosAlbum({
            filePath: res.target,
            success: function () {
              bitmap.recycle()
              uni.showToast({
                title: '保存图片成功',
                mask: false,
                duration: 1500
              });
            },
            fail: function () {
			  bitmap.recycle()
              uni.showToast({
                title: '保存到本地失败, 请返回重试～',
                mask: false,
                duration: 1500,
                icon: 'none'
              })
            }
          });

          // const imgOptions = {
          //   src: res.target,
          //   dst: res.target,
          //   overwrite: true,
          //   format: 'png',
          //   quality: 50,
          //   clip: {
          //     top: "10%",
          //     left: "0px",
          //     width: "auto",
          //     height: "auto"
          //   }
          // }
          // plus.zip.compressImage(imgOptions, function (evt) {
          //   bitmap.clear(); //销毁Bitmap图片 
          //   uni.saveImageToPhotosAlbum({
          //     filePath: evt.target,
          //     success: function () {
          //       uni.showToast({
          //         title: '保存图片成功',
          //         mask: false,
          //         duration: 1500
          //       });
          //     }
          //   });
          // }, function (err) {
          //   console.log('失败', JSON.stringify(err))
          // })
        }, error => {
		  bitmap.recycle()
          console.log(JSON.stringify(error)); // 保存失败信息  
          uni.showToast({
            title: '保存失败，请返回重试～' + JSON.stringify(error),
            duration: 2000,
            icon: "none"
          })
        });
      }, error => {
        console.log(JSON.stringify(error)); // 绘制失败
        uni.showToast({
          title: '绘制失败，请返回重试～' + JSON.stringify(error),
          duration: 2000,
          icon: "none"
        })
      }, {
        check: true, // 设置为检测白屏  
      });
    },
    saveQrcode() {
      debugger
      let self = this
      const file = self.$refs.qrcode.getImg()
      console.log('file', file)
      uni.saveImageToPhotosAlbum({
        filePath: file,
        success: function () {
          uni.showToast({
            title: 'success'
          })
        },
        fail: function () {
          uni.showToast({
            title: 'fail'
          })
        }
      })
      return
    }
  }
}
</script>
<style lang="scss" scoped>
.container {
  height: 100%;
  position: relative;
  .qrcode {
    position: absolute;
  }
}

.bottom-btn {
  width: 600rpx;
  height: 80rpx;
  line-height: 80rpx;
  background:linear-gradient(180deg,rgba(82,171,252,1) 0%,rgba(6,135,255,1) 100%);
  border-radius: 40rpx;
  font-size: 30rpx;
  color: #fff;
  margin-top: 40rpx;
  text-align: center;
}
</style>