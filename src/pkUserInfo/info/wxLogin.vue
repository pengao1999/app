<template>
    <div class="main-center-page bg-white" style="background: white;">
        <img class="login-logo" src="../../static/wechat.png">
        <button class="cu-btn round bg-gray mrg-top-60" style="width: 690upx;height: 80upx;" @click="toTelLogin">登录/注册</button>
        <button @getphonenumber="getPhoneNumber" open-type="getPhoneNumber" class="cu-btn round bg-green mrg-top-10" style="width: 690upx;height: 80upx;">微信手机号快捷登录</button>
    </div>
</template>

<script>
    import Config from "../../common/js/Config"
    import Toast from "../../common/js/toast"
    import Login from "../../common/js/Login"

    import { mapMutations } from "vuex";
    export default {
        name: "wxLogin",
        mixins: [Toast],
        computed: {
            userInfo() {
                return this.$store.state.userInfo
            }
        },
        methods: {
            ...mapMutations(['setUserInfo']),
            toTelLogin() {
                uni.redirectTo({
                    url: "/pkUserInfo/info/phone"
                })
            },
            wxLogin() {
                let self = this
            },
            getPhoneNumber: function(e) {
                let self = this
                console.log(e)
                if (e.detail.errMsg === 'getPhoneNumber:ok') {
                    var detail = e.detail
                    self.toast({
                        desc: '加载中...',
                        type: 'loading',
                        time: 8000
                    })
                    Login.getLoginCode(loginRes => {
                        console.log(loginRes)
                        let data = {
                            data: detail.encryptedData,
                            iv: detail.iv,
                            code: loginRes.code
                        }
                        self.$Phttp.post(Config.JAVA_SAAS_URLS.decryptTelByCode, data).then((res) => {
                            res = res.data
                            if (res.code === 0) {
                                self.telLogin(res.data.phoneNumber)
                            }
                        })
                    })
                }
            },
            telLogin: function (tel) {
                let self = this
                let postData = Object.assign(self.userInfo, {
                    tel : tel
                })
                self.$Phttp.post(Config.JAVA_SAAS_URLS.loginByTelWx, postData).then(res => {
                    res = res.data
                    if (res.code === 0) {
                        delete res.data.openid
                        self.setUserInfo(res.data)

                        if (res.data.img === null) {
                            uni.redirectTo({
                                url: '/pkUserInfo/info/wxInfoAuth'
                            })
                        } else {
                            uni.navigateBack();
                        }
                    }
                })
            }
        }
    }
</script>

<style scoped>
    .login-logo {
        width: 200upx;
        height: 200upx;
        margin-top: 200upx;
    }
</style>
