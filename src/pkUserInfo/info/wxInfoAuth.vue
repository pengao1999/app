<template>
    <div class="main-center-page">
        <div class="main-center-page bg-gray" style="width: 100%;height: 300upx;">
            <img class="cu-avatar mrg-top-30" style="width: 100upx;height: 100upx;" src="../../static/ic_wecaht-range.png">
            <div class="mrg-top-10">微信个人信息授权</div>
        </div>

        <div class="bg-white" style="width: 100%;">
        <div class="cu-form-group" style="width: 98%;margin-left: 2%;padding-left: 0upx;">
            <div class="title">你同意 缪可周期购 获取以下权限</div>
        </div>
        <div class="cu-form-group" style="width: 98%;margin-left: 2%;min-height: 60upx;padding-left: 0upx;">
            <div class="title text-green" style="font-size: 26upx;">
                获取你的公开信息（昵称、头像、性别等）
            </div>
        </div>
        </div>
        <div class="main-center-page" style="width: 100%;background: #FFF;">
            <button @getuserinfo="onLoginTab" openType="getUserInfo" class="cu-btn mrg-top-30 bg-green Card" style="width: 690upx;height: 80upx;">确认授权</button>
            <div class="cu-btn mrg-top-10 bg-white Card" style="width: 200upx;height: 80upx;" @click="reback">咱不授权</div>
        </div>
    </div>
</template>

<script>
    import Config from '../../common/js/Config'
    import { mapMutations } from "vuex";
    export default {
        name: "wxInfoAuth",
        computed: {
            userInfo() {
                return this.$store.state.userInfo
            }
        },
        methods: {
            ...mapMutations(['setUserInfo']),
            onLoginTab: function(res) {
                let self = this
                let userInfo = res.detail.userInfo
                let postData = Object.assign(self.userInfo, {
                    name : userInfo.nickName,
                    city : userInfo.city,
                    gender: userInfo.gender,
                    img: userInfo.avatarUrl,
                })
                self.$Phttp.post(Config.JAVA_SAAS_URLS.updateOpenInfo, postData).then(res => {
                    res = res.data
                    if (res.code === 0) {
                        self.setUserInfo(postData)

                        uni.navigateBack();
                    }
                })
            },
            reback: function () {
                uni.navigateBack();
            }
        }
    }
</script>

<style scoped>
    .Card {
        -webkit-border-radius: 10upx;
        -moz-border-radius: 10upx;
        border-radius: 10upx;
    }
</style>
