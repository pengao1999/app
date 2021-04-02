<template>
    <div class="main-center-page" style="background: white;">
        <!-- 搜索框开始 -->
        <view class='top'>
            <view class='search'>
                <input class='keyword' type='text' bindconfirm="search" v-model="inputKeyword"  placeholder='请输入编号'  placeholder-style='placeholder' @confirm='queryLeaderByCode()'></input>
                <!-- <view class = "search-button" @tap='searchGoods()'> -->
                <image class='button' @tap='queryLeaderByCode()' src='../../static/ic_search.png'></image>
                <!-- 	</view> -->
            </view>
            <view style="width: 690upx;font-size: 22upx;margin-left: 60upx;">该业务员编号仅作记录作用，不作其他用途，可向业务员索要</view>
        </view>

        <img class="cu-avatar mrg-top-60" :src="formItem.avatar"/>
        <view class="mrg-top-10">{{formItem.name}}</view>

        <view class="cu-btn fixed-bttom round bg-green" style="width: 690upx;bottom: 50upx;height: 80upx;" @click="bindleader">保存</view>
        <!-- 搜索框结束 -->
    </div>
</template>

<script>
    import Config from '../../common/js/Config'
    import Toast from '../../common/js/toast'
    export default {
        name: "leader",
        data() {
            return {
                inputKeyword: "",
                formItem: {
                    leader_key: -1,
                    avatar: '',
                    name: ''
                }
            }
        },
        computed: {
            userInfo() {
                return this.$store.state.userInfo
            }
        },
        mixins: [Toast],
        methods: {
            queryLeaderByCode: function () {
                let self = this
                self.formItem.avatar = ""
                self.formItem.name = ""
                self.formItem.leader_key = -1
                let postData = {
                    code : self.inputKeyword
                }
                self.toast({
                    type: "loading"
                })
                self.$Phttp.post(Config.JAVA_SAAS_URLS.queryByCode, postData).then(res => {
                    res = res.data
                    self.toast(true)
                    if (res.code === 0) {
                        self.formItem.avatar = res.data.user.img
                        self.formItem.name = res.data.salesman.name
                        self.formItem.leader_key = res.data.salesman.user_key
                    } else {
                        self.toast({
                            desc: '编号错误'
                        })
                    }
                })
            },
            bindleader() {
                let self = this
                if (self.formItem.leader_key <= 0) {
                    self.toast({
                        desc: '无可绑定的业务员'
                    })
                    return
                }
                let postData = {
                    user_key: self.userInfo.user_key,
                    leader_key: self.formItem.leader_key
                }
                self.toast({
                    type: "loading"
                })
                self.$Phttp.post(Config.JAVA_SAAS_URLS.setDefaultSalesman, postData).then(res => {
                    console.log(res)
                    res = res.data
                    self.toast(true)
                    if (res.code === 0) {
                        uni.navigateBack();
                    } else {
                        self.toast({
                            desc: res.msg
                        })
                    }
                })
            }
        }
    }
</script>

<style scoped>
    .top {
        margin-top: 200upx;
        width: 100%;
        height: 120upx;
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    .top  .search {
        width: calc(100% - 60upx);
        height: 88upx;
        border-radius: 34upx;
        background: #F8F8F8;
        margin-left: 30upx;
        margin-right: 30upx;
        margin-top: 10upx;
        display: flex;
        align-items: center;
        /* background:rgba(244,244,244,1); */
    }

    .top  .search .keyword {
        height: 68upx;
        line-height: 68upx;
        font-size: 24upx;
        color: #666;
        width: calc(100% - 90upx);
        margin-left: 35upx;
    }

    .top .search .button {
        width: 48upx;
        height: 48upx;
        padding: 10upx 20upx;
    }
    .cu-avatar {
        width: 120upx;
        height: 120upx;
        -webkit-border-radius: 120upx;
        -moz-border-radius: 120upx;
        border-radius: 120upx;
    }
</style>
