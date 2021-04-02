<template>
    <view class="content">
        <view class="details-card" v-for="(item, index) in billDetailsList" :key="index">
            <view class="details-card-title">第{{item.periods}}期 <view class="">{{ statusToValue(item.status) }}</view></view>
            <view class="details-card-body">
                <view class="details-card-time">还款日: {{item.repayDate}}</view>
                <view class="details-card-money">金额: ￥{{item.payAmt+item.payInterestAmt}}</view>
            </view>
        </view>
    </view>
</template>

<script>
import iosBlur from '../../common/js/iosBlur.js'
import Config from '../../common/js/Config.js'
export default {
    name: "billDetails",
    mixins: [iosBlur],
    data() {
        return {
            userKey: '',
            billKey: '',
            billDetailsList: []
        }
    },
    onLoad(options) {
        this.userKey = options.userKey;
        this.billKey = options.billKey;
        // 解决ios兼容性
        // #ifdef H5
        document.body.addEventListener('focusout', () => {
            this.iosBlur()
        })
        document.body.addEventListener('focusin', () => {
            this.iosBlur()
        })
        // #endif
    },
    onShow() {
        this.initBillDetails();
    },
    methods: {
        initBillDetails() {
            let self = this;
            uni.showLoading({ title: '加载中' });
            console.log("请求接口：" + Config.REQUEST_URLS.getBillResult);
            console.log("请求参数：billKey=" + self.billKey);
            this.$Phttp.get(Config.REQUEST_URLS.getBillResult,{ billKey: self.billKey })
                .then(res => {
                    console.log("接口数据返回-->" + JSON.stringify(res));
                    res = res.data;
                    if(res.code === 200 && res.data.detailList) {
                        self.billDetailsList = res.data.detailList;
                        if(Object.keys(self.billDetailsList).length === 0) {
                            self.isShowDefault = true;
                        }else {
                            self.isShowDefault = false;
                        }
                    }
                    uni.hideLoading();
                })
        },
        statusToValue(status) {
            let bval = '';
            switch (status) {
                case '00':
                    bval = "未开始"
                    break
                case '01':
                    bval = "交租中"
                    break
                case '02':
                    bval = "已违约"
                    break
                case '03':
                    bval = "交租完毕"
                    break
                case '04':
                    bval = "已提还"
                    break
                case '05':
                    bval = "违约完成"
                    break
            }
            return bval;
        }
    }
}
</script>

<style lang="scss" scoped>
.content {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    /*height: calc(100vh - 88rpx);*/
    background: #f4f4f4;
    .details-card {
        width: 100%;
        margin-top: 20rpx;
        padding: 25rpx 20px;
        border-bottom: 1px solid #eee;
        box-sizing: border-box;
        background: #fff;
        .details-card-title {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font: 600 28rpx/56rpx "Microsoft YaHei";
            border-bottom: 1px solid #eee;
            margin-bottom: 20rpx;
        }
        .details-card-body {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 28rpx;
            .details-card-time {
                width: 50%;
            }
            .details-card-money {
                flex: 1;
                text-align: right;
            }
        }
    }

}
</style>
