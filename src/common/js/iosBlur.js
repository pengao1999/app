/**
 * IOS输入框唤起键盘再收起后，webview回弹不正常，导致页面按钮定位不准确问题的解决
 */
export default {
  methods: {
    iosBlur: function() {
      window.scrollTo(0, 0)
    },
  },
}
