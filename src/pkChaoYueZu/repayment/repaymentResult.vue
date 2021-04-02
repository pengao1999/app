<template>
    <view>
        <!--支付成功-->
        <view class="repayment-result-warp">
			<image class="icon-status" :src="imgUrl"></image>
            <view class="result-text">{{ resultText }}</view>
        </view>

       <!-- <view>
            <view>测试日志</view>
            <view>订单：{{orderId}}</view>
            <view>轮询次数：{{count_}}</view>
            <view>轮询结果：状态码{{testObj.code}}</view>
            <view>轮询结果：状态{{testObj.data.status}}</view>
            <view>详情日志: {{testObj}}</view>
        </view> -->

        <view class="flex-bottom" v-if="isShow">
            <view class="bottom" @click="handleViewDetails">返回</view>
        </view>
    </view>
</template>

<script>
import Config from '../../common/js/Config.js'
export default {
    name: "repaymentResult",
    onLoad(options) {
        console.log("----orderId-----" + options.orderId);
        this.orderId = options.orderId;
		// this.orderId =  '63c1fe85fea247bb91598c50a6b826e4';
    },
    onShow() {
        this.handlerInitPage();
    },
    // computed: {
    //     userInfo() {
    //         return this.$store.state.userInfo
    //     }
    // },
    data() {
        return {
            imgUrl: '/static/zulin/profile/loading.gif',
            resultText: '支付中',
            isShow: false,
            // userKey: this.userInfo.user_key,
            orderId: '',
            timer: null
            // testObj: {
            //     'code' : '',
            //     'data' : {
            //         'status': ''
            //     }
            // },
            // count_: 0
        }
    },
    methods: {
        /**
         * 轮询订单状态，3秒请求一次，如果请求三次无返回，则为失败
         * @param orderId
         */
        handlerInitPage() {
            const self = this;
            let count = 0;
            self.timer = setInterval(function(){
				console.log("轮询次数count：" + count);
                // self.count_ = count;

				if(self.resultText === '支付完成') {
                    clearInterval(self.timer);
				    return;
                }

                if(count > 4) { //
                    clearInterval(self.timer);
                    self.imgUrl = '/static/zulin/verify/error.png';
                    self.resultText = '支付异常，请联系客服确认！';
                    self.isShow = true;
                    return false;
                }
                count++;
                self.$Phttp.get(Config.REQUEST_URLS.getPayStatus+'?orderId='+self.orderId)
                    .then((res) => {

						console.log("支付状态接口返回："+ JSON.stringify(res))
						console.log("支付状态接口res.data.code返回："+ res.data.code)
						console.log("支付状态接口res.data.data.status返回："+ res.data.data.status)

                        // self.testObj = res.data;

                        if(res.data.code === 200) {
                            clearInterval(self.timer);
                            if(res.data.data.status === 1 || res.data.data.status === 0){
                                self.imgUrl = '/static/success.png';
                                self.resultText = '支付完成!';
                                self.isShow = true;
                            }else if (res.data.data.status === 2) {
                                self.imgUrl = '/static/zulin/verify/error.png';
                                self.resultText = '支付异常!';
                                self.isShow = true;
                            }
                        }
                    })
                    .catch(() => {
                        clearInterval(self.timer);
                        self.imgUrl = '/static/zulin/verify/error.png';
                        self.resultText = '支付异常';
                        self.isShow = true;
                    })
            }, 3000);
        },
        handleViewDetails() {
            // uni.navigateTo({
            //     url: '/pages/repayment/index?userKey=' + this.userKey
            // })
            setTimeout(function(){uni.switchTab({url: '/pkChaoYueZu/profile/profile'})}, 500)
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
    .icon-status {
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
    background: linear-gradient(90deg, #52abfc 0%, #0687ff 100%);
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
