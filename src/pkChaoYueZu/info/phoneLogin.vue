<template>
    <div class="main-center-page" style="background: white;">
        <error-tip :propData="errorData" @hide="errorHide"></error-tip>
        <img class="login-logo" src="../../static/chaoyuezu/logo.png">
        <div class='content mrg-top-60'>
            <form @submit="formSubmit">
                <div class='column-box'>
                    <div class='col'>
                        <text class='name'>手机号码</text>
                        <input v-model="mobile" name="mobile" class='input' type="number" placeholder='请填写手机号码' />
                    </div>
                    <div class='col'>
                        <text class='name'>验证码</text>
                        <input name="code" class='input' placeholder='请填写手机验证码' @input="codeInput" />
                        <div class="btn round" @tap='verify'>{{countDownNum>0?'剩余'+countDownNum+'秒':'获取验证码'}}</div>
                    </div>
                </div>
                <button class="formBtn bg-blue round" formType="submit">登 录</button>
            </form>
        </div>
    </div>
</template>

<script>
    import Config from '../../common/js/Config.js'
    import toast from '../../common/js/toast.js'
    import Util from '../../common/js/util.js'

    import ErrorTip from '../../components/yx_dialog/myErrorTip.vue'

    import {mapMutations} from 'vuex'
    export default {
        data() {
            return {
                mobile: '',
                countDownNum: 0,
                timer: Object,
                // 错误提示
                errorData: {
                    show: false,
                    desc: ''
                },
                code: ''
            }
        },
        mixins:[toast],
        components: {ErrorTip},
        watch: {
            userInfo: {
                handler() {
                    console.log(this.userInfo)

                },
                immediate: true
            }
        },
        computed: {
            userInfo() {
                return this.$store.state.userInfo
            },
            globalI() {
                return this.$store.state.globalI
            }
        },
        onLoad() {

        },
        methods: {
            ...mapMutations(['setUserInfo']),
            verify: function() {
                let self = this
                if (self.countDownNum > 0) {
                    self.errorData = Object.assign({}, self.errorData, {
                        show: true,
                        desc: "还需要等待" + self.countDownNum + "秒"
                    })
                    return
                }
                if (!(/^1(1|2|3|4|5|6|7|8|9)\d{9}$/.test(self.mobile))) {
                    self.errorData = Object.assign({}, self.errorData, {
                        show: true,
                        desc: "请输入正确的手机号码"
                    })
                    return
                }

                // get code.
                let data = {
                    tel: self.mobile,
                    m: 'sqtg_sun'
                }
                self.$Phttp.post(Config.JAVA_SAAS_URLS.getCode, data).then((res) => {
                    res = res.data
                    if (res.code === 0) {
                        self.countDownNum = 120
                        self.countDown()
                    } else {
                        self.errorData = Object.assign({}, self.errorData, {
                            show: true,
                            desc: res.msg
                        })
                    }
                })
            },
            countDown: function() {
                let self = this;
                //如果将定时器设置在外面，那么用户就看不到countDownNum的数值动态变化，所以要把定时器存进data里面
                self.timer = setInterval(function() {
                    self.countDownNum --;
                    if (self.countDownNum == 0) {
                        self.clearTimer()
                    }
                }, 1000)
            },
            clearTimer: function() {
                if (!Util.isEmptyObject(this.timer))
                    clearInterval(this.timer)
            },
            // 错误隐藏
            errorHide: function (e) {
                if (!e.detail) {
                    this.errorData.show = false;
                    return
                }
                this.errorData = e.detail
            },
            mobileInput: function(e) {
                console.log(e)
                this.mobile = e.detail.value
            },
            codeInput: function(e) {
                this.code = e.detail.code
            },
            formSubmit: function(e) {
                let self = this
                let mobile = e.detail.value.mobile
                let code = e.detail.value.code
                if (!(/^1(1|2|3|4|5|6|7|8|9)\d{9}$/.test(mobile))) {
                    self.errorData = Object.assign({}, self.errorData, {
                        show: true,
                        desc: "请输入正确的手机号码"
                    })
                    return
                }
                if (code == '') {
                    self.errorData = Object.assign({}, self.errorData, {
                        show: true,
                        desc: "请输入验证码"
                    })
                    return
                }
				let clientId=this.$store.state.clientId
                let postData = Object.assign(self.userInfo, {
                    tel : mobile,
                    sms_code: code,
					client_id: clientId
                })
				console.log(JSON.stringify(postData))
                self.$Phttp.post(Config.JAVA_SAAS_URLS.loginByTel, postData).then((res) => {
                    res = res.data
                    if (res.code === 0) {
                        delete res.data.openid
                        self.setUserInfo(Object.assign(res.data, {
                            avatarUrl : res.data.avatar_url,
                            nickName: res.data.nick_name
                        }))

                        uni.navigateBack();
                    } else {
						self.toast({
							desc: '登录失败'
						})
					}
                })
            }
        },
        onUnload() {
            this.clearTimer()
        },
        onShareAppMessage() {
            return {
                title: '友邻优选-大家都在用的社区团购APP',
                path: '/pages/index/main?user_id='+this.userInfo.id+'&i='+this.globalI
            }
        }
    }
</script>

<style>

    .top {
        width: 100%;
        height: 240rpx;
        background: #ef4136;
        display: flex;
        padding-top: 30rpx;
        flex-direction: column;
    }

    .top .title {
        font-size: 46rpx;
        line-height: 50rpx;
        font-weight: bold;
        color: #fff;
        margin-left: 60rpx;
        margin-top: 40rpx;
    }

    .top .desc {
        font-size: 30rpx;
        line-height: 36rpx;
        color: #fff;
        margin-left: 60rpx;
        margin-top: 15rpx;
    }

    .top-bg-img {
        width: 100%;
        height: 60rpx;
        background-repeat: no-repeat;
        background-size: 100% 100%;
        -moz-background-size: 100% 100%;
    }

    .content {
        width: 100%;
    }

    .login-logo {
        width: 364upx;
        height: 208upx;
        margin-top: 80upx;
        border-radius: 20rpx;
    }

    .column-box {
        width: calc(100% - 40rpx);
        margin-left: 20rpx;
        margin-right: 20rpx;
        background: #fff;
        border-radius: 20rpx;
        display: flex;
        flex-direction: column;
    }

    .column-box .col {
        width: calc(100% - 48rpx);
        height: 100rpx;
        line-height: 100rpx;
        margin-left: 24rpx;
        margin-right: 24rpx;
        border-bottom: solid 1rpx #F0F0F0;
        display: flex;
        align-items: center;
    }

    .column-box .col:last-child {
        border-bottom: 0;
    }

    .column-box .col .name {
        width: 160rpx;
        font-size: 28rpx;
        color: #333;
    }

    .column-box .col .input {
        flex: 1;
        height: 80rpx;
        font-size: 28rpx;
        color: #666;
    }

    .column-box .col .btn{
        width: 140rpx;
        height: 60rpx;
        line-height: 60rpx;
        font-size: 24rpx;
        color: rgba(22,119,255,1);;
        text-align: center;
        border: 1px solid rgba(22,119,255,1);
    }

    .formBtn {
        width: calc(100% - 60rpx);
        margin-left: 30rpx;
        margin-right: 30rpx;
        height: 100rpx;
        line-height: 100rpx;
        margin: 0 auto;
        margin-top: 100rpx;
        color: #fff;
        font-size: 30rpx;
    }

</style>
