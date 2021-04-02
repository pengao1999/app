<template>
    <view class="container main-page"  :class="getFixedClass">
        <scroll-view scroll-y class="scrollView" lower-threshold="200" :scroll-top="scrollTop" @scroll="scrollFn($event)">

            <!-- 保证性能勿删 -->
            <view class="scroll-container" style="padding-top: 0px;">
                <!-- 保证性能勿删 -->
                <block v-if="getShow">

                    <!-- <view class="bg-white" style="width: 750upx;padding: 20upx 0 20upx 30upx;">
                        <swiper class="bg-white" style="width: 690rpx;height:312rpx;border-radius: 12rpx;" autoplay indicator-dots="true">
                            <swiper-item v-for="(item, key) in swiperList" :key="key"><image style="width: 100%; max-height: 100%;border-radius: 12rpx;" :src="imgRoot+item.pic" @click="clickBanner(item)" mode="aspectFill"/></swiper-item>
                        </swiper>
                    </view> -->
					
					<image style="width:690upx;border-radius: 12rpx;margin-top: 20upx;" mode="widthFix" src="/static/chaoyuezu/index/weixiu-banner.png"></image>

					<view class="block-container mrg-top-20" style="width: 690upx;">
						<view class="menu-contaner bg-white row-container align-center" @click="toProblem('PH', '手机')">
							<image style="width:96upx;height: 96upx;margin-left: 40upx;" mode="widthFix" src="/static/chaoyuezu/index/weixiu/weixiu1.png"></image>
							<view class="coloum-container" style="margin-left: 20upx;">
								<view style="color: #222;font-size: 26upx;">手机</view>
								<view style="color: #999;font-size: 22upx;">Mobile</view>
							</view>
						</view>
						<view class="menu-contaner bg-white row-container align-center" style="margin-left: 18upx;" @click="toProblem('BJ', '电脑')">
							<image style="width:96upx;height: 96upx;margin-left: 40upx;" mode="widthFix" src="/static/chaoyuezu/index/weixiu/weixiu2.png"></image>
							<view class="coloum-container" style="margin-left: 20upx;">
								<view style="color: #222;font-size: 26upx;">电脑</view>
								<view style="color: #999;font-size: 22upx;">Computer</view>
							</view>
						</view>
						<view class="menu-contaner bg-white row-container align-center mrg-top-10" @click="toProblem('XJ', '相机')">
							<image style="width:96upx;height: 96upx;margin-left: 40upx;" mode="widthFix" src="/static/chaoyuezu/index/weixiu/weixiu3.png"></image>
							<view class="coloum-container" style="margin-left: 20upx;">
								<view style="color: #222;font-size: 26upx;">相机</view>
								<view style="color: #999;font-size: 22upx;">Camera</view>
							</view>
						</view>
						<view class="menu-contaner bg-white row-container align-center mrg-top-10" style="margin-left: 18upx;" @click="toProblem('SM', '平板')">
							<image style="width:96upx;height: 96upx;margin-left: 40upx;" mode="widthFix" src="/static/chaoyuezu/index/weixiu/weixiu4.png"></image>
							<view class="coloum-container" style="margin-left: 20upx;">
								<view style="color: #222;font-size: 26upx;">平板</view>
								<view style="color: #999;font-size: 22upx;">Ipad</view>
							</view>
						</view>
					</view>
					<!-- <view class="flex-container justify-center align-center mrg-top-30" style="width: 750upx;color: #222222;font-size: 32upx;font-weight:500;font-family:PingFangSC-Medium,PingFang SC;">热门维修</view>
                    <view class="block-container mrg-top-20" style="width: 750upx;">
                        <view class="justify-center" v-for="(product,index) in productList[0].goods" :key="index" @click="toProblem('PH', product.name)" style="width:50%;display: flex;margin-bottom: 20upx;">
							<view class="bg-white coloum-container align-center" style="width: 336upx;height: 336upx;">
								<image style="width: 180upx;height: 180upx;margin-top: 34upx;" :src="imgRoot+product.pic"></image>
								<view class="mrg-top-20" style="color: #222;font-size: 28upx;">{{product.name}}</view>
							</view>
                        </view>
                    </view> -->
                    <view style="height: 100upx;"></view>
                </block>
            </view>
        </scroll-view>
    </view>
</template>

<script>
    import Config from '@/common/js/Config.js'
    import Toast from '@/common/js/toast.js'
    import myMenu from '@/components/yx_view/myMenu.vue'
    import ProductCard from '../../productCard/productCard'
    import Util from '@/common/js/util.js'
	import Auth from '@/pkChaoYueZu/auth.js'

    // 组件必须
    import { QSTabsWxsListMixin } from '../mixins/QS-tabs-wxs-list-mixin.js';
    export default {
        components: {myMenu, ProductCard},
        mixins: [QSTabsWxsListMixin(), Toast, Auth],// 组件必须
        data() {
            return {
                list: [],
                sendData: {
                    pageNum: 1,
                    pageSize: 50,
                    tabId: this.tab.id
                },
                statusText: {},
                refreshClear: false,
                imgRoot: '',
                swiperList: [
                    {
                        pic: '/static/chaoyuezu/index/weixiu-banner.png'
                    }
                ],
                menuData: [
                    {
                        id: 1,
                        cate_img: '',
                        name: ''
                    },
                    {
                        id: 2,
                        cate_img: '',
                        name: ''
                    },
                    {
                        id: 3,
                        cate_img: '',
                        name: ''
                    },
                    {
                        id: 4,
                        cate_img: '',
                        name: ''
                    },
                    {
                        id: 5,
                        cate_img: '',
                        name: ''
                    },
                    {
                        id: 6,
                        cate_img: '',
                        name: ''
                    },
                    {
                        id: 7,
                        cate_img: '',
                        name: ''
                    },
                    {
                        id: 8,
                        cate_img: '',
                        name: ''
                    }
                ],
                productList: [
                    {
                        name: '',
                        goods: [
                            {
                                name: '',
                                pic: '',
                                price: '',
                                original_price: ''
                            },
                            {
                                name: '',
                                pic: '',
                                price: '',
                                original_price: ''
                            },
                            {
                                name: '',
                                pic: '',
                                price: '',
                                original_price: ''
                            },
                            {
                                name: '',
                                pic: '',
                                price: '',
                                original_price: ''
                            },
                            {
                                name: '',
                                pic: '',
                                price: '',
                                original_price: ''
                            },
                            {
                                name: '',
                                pic: '',
                                price: '',
                                original_price: ''
                            }
                        ]
                    }
                ],
            }
        },
        computed: {
            getColor() {
                let color;
                switch (this.type) {
                    case 'setColor':
                        color = '#fff';
                        break;
                    case 'index':
                        color = '#fff';
                        break;
                    default:
                        color = '#999';
                        break;
                }
                return color;
            }
        },
        created() {
        },
        methods: {
            init(refresh) {	//若是用户触发下拉刷新则refresh为true
				let self = this
				if (!self.refreshClear) self.oldScrollTop = 0;
				self.toast({
				    type: 'loading'
				})
				self.getGoodsOrderByClassify()
				setTimeout(()=>{
					self.$emit('refreshEnd');
				}, 1500)
            },
            getAd() {
                let self = this
                self.$Phttp.post(Config.JAVA_SAAS_URLS.getAds, {}).then(res => {
                    self.toast(true)
                    res = res.data
                    if (res.code === 0) {
                        self.imgRoot = res.other.img_root
                        self.swiperList = res.data.banner
                    }
                })
            },
            getClassify: function () {
                let self = this
                self.$Phttp.post(Config.JAVA_SAAS_URLS.getClassify, {}).then((res) => {
                    res = res.data
                    if (res.code === 0) {
                        self.menuData = []
                        let img_root = res.other.img_root
                        res.data.main.forEach((item, index) => {
                            item.cate_img = img_root + item.cate_img
                            if (self.menuData.length < 8) {
                                self.menuData.push(item)
                            }
                        })
                    }
                })
            },
            getGoodsOrderByClassify: function () {
                let self = this
                self.$Phttp.post(Config.JAVA_SAAS_URLS.getGoodsOrderByClassify, {}).then(res => {
                    self.toast(true)
                    res = res.data
                    if (res.code === 0) {
                        res.data.forEach((item, index) => {
                            item.unit = self.parseUnit(item.periodType) || item.unit
                        })
                        self.imgRoot = res.other.img_root
                        self.productList = res.data
                    }
                })
            },
            parseUnit(peroidType) {
                let unit = ''
                switch(peroidType) {
                    case 1:
                        unit='日'
                        break;
                    case 2:
                        unit='周'
                    case 3:
                        unit='月'
                        break;
                    case 4:
                        unit='年'
                        break;
                }
                return unit;
            },
            toProduct: function (key) {
                console.log(key)
                // window.location.href = 'http://www.baidu.com'
                // window.open('http://h5app.test.youxuanbest.com/#/pkPointMall/index/detail?id='+id+'&token=' + this.point_token, '商品详情')
                uni.navigateTo({
                    url: '/pkChaoYueZu/index/detail?key=' + key
                })
            },
			toProblem(code, name) {
				if (!this.hasRegister()) return;
				uni.navigateTo({
					url: '/pkChaoYueZu/index/children/problems?code='+code + '&name='+name
				})
			}
        }
    }
</script>

<style scoped>
    @import url("../css/QS-tabs-wxs-list-components.css");
    .main-page {
        background: #F8F8F8
    }
    swiper,
    .img-view {
        width: 750upx;
        height: 500upx;
    }
    .Card {
        padding:40upx;
    }
    .Card-img {
        margin-top: 50upx;
        width: 100upx;
        height: 120upx;
    }
    .border-20 {
        -webkit-border-radius: 20upx;
        -moz-border-radius: 20upx;
        border-radius: 20upx;
    }
    .tabs-scroll {
        width: 100%;
        white-space: nowrap;
        position: relative;
    }
    .page-section-title {
        margin-top: 50upx;
    }
    .tower-swiper .tower-item {
        transform: scale(calc(0.5 + var(--index) / 10));
        margin-left: calc(var(--left) * 100upx - 150upx);
        z-index: var(--index);
    }

    .list-title {
        font-size: 40upx;
        font-weight: bold;
        margin-left: 20upx;
    }

    .list-title::before {
        content: "";
        left: 0upx;
        top: 0upx;
        height: 50upx;
        width: 4upx;
        background: #00be06;
    }

    /* ==================
                 轮播
         ==================== */
    swiper .a-swiper-dot {
        display: inline-block;
        width: 16upx;
        height: 16upx;
        background: rgba(0, 0, 0, 0.3);
        border-radius: 50%;
        vertical-align: middle;
    }

    swiper .wx-swiper-dots,
    swiper .a-swiper-dots,
    swiper .uni-swiper-dots {
        display: flex;
        align-items: center;
        width: 100%;
        justify-content: center;
    }

    swiper.square-dot .wx-swiper-dot,
    swiper.square-dot .a-swiper-dot,
    swiper.square-dot .uni-swiper-dot {
        background-color: var(--white);
        opacity: 0.4;
        width: 10upx;
        height: 10upx;
        border-radius: 20upx;
        margin: 0 8upx !important;
    }
    .product-banner {
        width: 690upx;
        height: 160upx;
    }

    swiper.square-dot .wx-swiper-dot.wx-swiper-dot-active,
    swiper.square-dot .a-swiper-dot.a-swiper-dot-active,
    swiper.square-dot .uni-swiper-dot.uni-swiper-dot-active {
        opacity: 1;
        width: 30upx;
    }

    swiper.round-dot .wx-swiper-dot,
    swiper.round-dot .a-swiper-dot,
    swiper.round-dot .uni-swiper-dot {
        width: 10upx;
        height: 10upx;
        position: relative;
        margin: 4upx 8upx !important;
    }

    swiper.round-dot .wx-swiper-dot.wx-swiper-dot-active::after,
    swiper.round-dot .a-swiper-dot.a-swiper-dot-active::after,
    swiper.round-dot .uni-swiper-dot.uni-swiper-dot-active::after {
        content: "";
        position: absolute;
        width: 10upx;
        height: 10upx;
        top: 0upx;
        left: 0upx;
        right: 0;
        bottom: 0;
        margin: auto;
        background-color: var(--white);
        border-radius: 20upx;
    }

    swiper.round-dot .wx-swiper-dot.wx-swiper-dot-active,
    swiper.round-dot .a-swiper-dot.a-swiper-dot-active,
    swiper.round-dot .uni-swiper-dot.uni-swiper-dot-active {
        width: 18upx;
        height: 18upx;
    }

    .screen-swiper {
        min-height: 375upx;
    }

    .screen-swiper image,
    .screen-swiper video,
    .swiper-item image,
    .swiper-item video {
        width: 100%;
        display: block;
        height: 100%;
        margin: 0;
        pointer-events: none;
    }

    .card-swiper {
        height: 420upx !important;
    }

    .card-swiper swiper-item {
        width: 610upx !important;
        left: 70upx;
        box-sizing: border-box;
        padding: 40upx 0upx 20upx;
        overflow: initial;
    }

    .card-swiper swiper-item .swiper-item {
        width: 100%;
        display: block;
        height: 100%;
        border-radius: 10upx;
        transform: scale(0.9);
        transition: all 0.2s ease-in 0s;
        overflow: hidden;
    }

    .card-swiper swiper-item.cur .swiper-item {
        transform: none;
        transition: all 0.2s ease-in 0s;
    }

    .tower-swiper {
        height: 420upx;
        position: relative;
        max-width: 750upx;
        overflow: hidden;
    }

    .tower-swiper .tower-item {
        position: absolute;
        width: 300upx;
        height: 380upx;
        top: 0;
        bottom: 0;
        left: 50%;
        margin: auto;
        transition: all 0.2s ease-in 0s;
        opacity: 1;
    }

    .tower-swiper .tower-item.none {
        opacity: 0;
    }

    .tower-swiper .tower-item .swiper-item {
        width: 100%;
        height: 100%;
        border-radius: 6upx;
        overflow: hidden;
    }
    .btn-container {
        width: 40upx;
        height: 50upx;
        line-height: 50upx;
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center;
    }
	.menu-contaner {
		width: 336upx;
		height: 140upx;
	}
</style>
