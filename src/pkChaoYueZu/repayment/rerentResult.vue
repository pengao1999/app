<template>
    <view>
        <!--申请成功-->
        <view class="repayment-result-warp">
            <img :src=imgUrl alt="">
            <view class="result-text">{{ resultText }}</view>
        </view>
        <view class="flex-bottom">
            <view class="bottom" @click="handleViewDetails">返回</view>
        </view>
    </view>
</template>

<script>
import Config from '../../common/js/Config.js'
export default {
    name: "repaymentResult",
    onLoad(options) {
        this.userKey = options.userKey;
    },
    onShow() {
        this.handlerInitPage();
    },
    data() {
        return {
            imgUrl: '/static/zulin/verify/success.png',
            resultText: '',
            userKey:''
        }
    },
    methods: {
        /**
         * 初始化页面
         * @param orderId
         */
        handlerInitPage() {
            const self = this;
            self.resultText = '申请续租成功!';
        },
        handleViewDetails() {
            // uni.navigateTo({
            //     url: '/pages/repayment/index?userKey=' + this.userKey
            // })
            window.history.go(-3);
        }
    }
}
</script>

<style lang="scss" scoped>
.repayment-result-warp {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    img {
        margin-top: 100rpx;
        width: 160rpx;
        height: 160rpx;
    }
    .result-text {
        margin-top: 30rpx;
        font-size: 32rpx;
        font-weight: 600;
        color: #222;
    }
}
.flex-bottom {
    margin-top: 140rpx;
    padding: 12rpx 0;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    background-color: #fff;
}
.bottom {
    background: linear-gradient(
                    90deg,
                    rgba(255, 131, 18, 1) 0%,
                    rgba(251, 38, 34, 1) 100%
    );
    border-radius: 50rpx;
    width: 622rpx;
    height: 84rpx;
    line-height: 84rpx;
    color: #fff;
    font-size: 30rpx;
    font-weight: 400;
    align-items: center;
    text-align: center;
}
</style>
