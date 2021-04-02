<template>
    <view class="content">
        <!-- 菜单 (悬浮,预先隐藏)-->
        <app-tabs v-if="isShowSticky" v-model="tabIndex" :fixed="true" :tabs="tabs" @change="tabChange"></app-tabs>

        <mescroll-body ref="mescrollRef" @init="mescrollInit" @down="downCallback" @up="upCallback" :up="upOption" @scroll="scroll" @topclick="topClick">

            <view class="demo-tip">未到账佣金+{{total}}</view>

            <!-- 菜单 (在mescroll-uni中不能使用fixed,否则iOS滚动时会抖动, 所以需在mescroll-uni之外存在一个一样的菜单) -->
            <view id="tabInList">
                <app-tabs v-model="tabIndex" :tabs="tabs" @change="tabChange"></app-tabs>
            </view>

            <!-- 数据列表 -->
            <good-list :list="goods"></good-list>
        </mescroll-body>
    </view>
</template>

<script>
    import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins.js";
    import MescrollBody from "@/components/mescroll-uni/mescroll-body.vue";
    import Config from '../../common/js/Config.js'
    import Util from '../../common/js/util.js'
    import Toast from '../../common/js/toast.js'
    import AppTabs from "./components/app-tabs.vue";
    import GoodList from "./components/good-list.vue";
	import StatusFilter from '@/common/js/StatusFilter.js'
    export default {
        name: "SaleOrderList",
        mixins: [MescrollMixin], // 使用mixin (在main.js注册全局组件)
        components: {
            AppTabs,
            GoodList,
            MescrollBody
        },
        data() {
            return {
                goods: [], // 数据列表
                upOption: {
                    // 如果用mescroll-uni 则需要onScroll: true, 且需要 @scroll="scroll"; 而mescroll-body最简单只需在onPageScroll处理即可
                    // onScroll: true // 是否监听滚动事件, 默认false (配置为true时,可@scroll="scroll"获取到滚动条位置和方向)
                },
                tabs: [{
					name: '全部',
					key: 'ALL'
				}, {
					name: '待付款',
					key: 'unPay'
				}, {
					name: '已付款',
					key: 'paySuccess'
				}, {
					name: '已完成',
					key: 'compeleted'
				}],
                tabIndex: 0, // tab下标
                navTop: null, // nav距离到顶部的距离 (如计算不准确,可直接写死某个值)
                isShowSticky: false, // 是否悬浮
				total: 0
            }
        },
		onLoad(options) {
			this.total = options.total
		},
		computed: {
			userInfo() {
				return this.$store.state.userInfo
			}
		},
        methods: {
            /*下拉刷新的回调 */
            downCallback() {
                // 这里加载你想下拉刷新的数据, 比如刷新轮播数据
                // loadSwiper();
                // 下拉刷新的回调,默认重置上拉加载列表为第一页 (自动执行 page.num=1, 再触发upCallback方法 )
                this.mescroll.resetUpScroll()
            },
            /*上拉加载的回调: 其中page.num:当前页 从1开始, page.size:每页数据条数,默认10 */
            upCallback(page) {
                let self = this;
                //联网加载数据
                if(this.isChangeTab){
                    this.mescroll.hideUpScroll(); // 切换菜单,不显示mescroll进度, 显示系统进度条
                    uni.showLoading();
                }
                let status = this.tabs[this.tabIndex].key

                let params = {
                    page: page.num, // 页码, 默认从1开始
                    size: page.size, // 页长, 默认每页10条
                    status: status,
					userKey: this.userInfo.user_key
                }

                // self.$Phttp.post(Config.URLS.getSaleOrder, params).then(res => {
                //     res = res.data
                //     if (res.code === 0) {
                //         self.olist[cur][index].pay_amount = res.data.pay_amount
                //     }
                // })
				console.log("传递接口参数:" + JSON.stringify(params));
                console.log('Config.URLS.getSaleOrder-->' + Config.JAVA_SAAS_URLS.getSaleOrder);
                self.$Phttp.get(Config.JAVA_SAAS_URLS.getSaleOrder, params).then(curPageData => {
                    //联网成功的回调
                    //设置列表数据
                    if(page.num == 1) this.goods = []; //如果是第一页需手动制空列表
					let records = curPageData.data.data.records
					// console.log("返回列表数据:"+ JSON.stringify(records))
					records.forEach((record, rIndex) => {
						record.create_time = Util.timestampToDate(record.create_time)
						record.lev = self.getLev(record.lev)
						record.status = StatusFilter.statusName(record.status)
					})
                    this.goods=this.goods.concat(records); //追加新数据
					console.log(this.goods)
                    // 数据渲染完毕再隐藏加载状态
                    this.$nextTick(()=>{
                        this.mescroll.endSuccess(records.length);
                        // 设置nav到顶部的距离 (需根据自身的情况获取navTop的值, 这里放到列表数据渲染完毕之后)
                        // 也可以放到onReady里面,或者菜单顶部的数据(轮播等)加载完毕之后..
                        if(!this.navTop) this.setNavTop()
                        // 保持tab悬浮,列表数据显示第一条
                        if(this.isChangeTab){
                            this.isChangeTab = false;
                            uni.hideLoading();
                            if(this.isShowSticky) this.mescroll.scrollTo(this.navTop, 0)
                        }
                    })
                }).catch(()=>{
                    //联网失败, 结束加载
                    this.mescroll.endErr();
                })
            },
			getLev(lev) {
				let levName = '一级'
				switch(lev) {
					case 'LEV1':
						levName = '一级'
						break
					case 'LEV2':
						levName = '二级'
						break
				}
				return levName;
			},
            // 设置nav到顶部的距离 (滚动条为0, 菜单顶部的数据加载完毕获取到的navTop数值是最精确的)
            setNavTop(){
                let view = uni.createSelectorQuery().select('#tabInList');
                view.boundingClientRect(data => {
                    console.log('tabInList基本信息 = ' + JSON.stringify(data));
                    this.navTop = data.top // 到屏幕顶部的距离
                }).exec();
            },
            // mescroll-uni的滚动事件 (需在up配置onScroll:true才生效)
            // 而mescroll-body最简单只需在onPageScroll处理即可
            scroll(){
                console.log('滚动条位置 = ' + this.mescroll.getScrollTop() + ', navTop = ' + this.navTop);
                // 菜单悬浮的原理: 监听滚动条的位置大于某个值时,控制顶部菜单的显示和隐藏
                if (this.mescroll.getScrollTop() >= this.navTop) {
                    this.isShowSticky = true // 显示悬浮菜单
                } else {
                    this.isShowSticky = false // 隐藏悬浮菜单
                }
            },
            // 点击回到顶部按钮时,先隐藏悬浮菜单,避免闪动
            topClick(){
                this.isShowSticky = false
            },
            // 切换菜单
            tabChange (e) {
                console.log('eeeee-->'+ e);
                this.isChangeTab = true;
                this.mescroll.resetUpScroll()
            }
        },
        // 使用mescroll-body最简单只需在onPageScroll处理即可
        onPageScroll(e){
            console.log('滚动条位置 = ' + e.scrollTop + ', navTop = ' + this.navTop);
            if (e.scrollTop >= this.navTop) {
                this.isShowSticky = true // 显示悬浮菜单
            } else {
                this.isShowSticky = false // 隐藏悬浮菜单
            }
        }
    }
</script>

<style lang="scss" scoped>
page {
    background: #f8f8f8;
}
.content {
	// width: 100%;
	// height:1000rpx;
}
.demo-tip {
    padding: 24rpx 30rpx;
    font-size: 30rpx;
    font-weight:400;
    box-sizing: border-box;
    color: #fff;
    background: #1677FF;
}
</style>
