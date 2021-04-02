<template>
	<view>
	  <!-- <view class='pullmask' hidden='{{!isTop}}'></view>  -->
	  <scroll-view scroll-y="auto" :scroll-top="topNum" :style="'height:'+wH+'px'" class="page-body-info" bindscrolltolower="sloadmore" bindscroll="doScrollTop">
		<slot></slot>
		{{loadMore}}
		<view class="i-class i-load-more {{ loadMoreIng ? '' : 'i-load-more-line' }}">
		  <view class="i-load-more-loading" wx:if="{{ loadMoreIng }}"></view>
		  <view class="i-load-more-tip">
			<view wx:if="{{loadMoreIng}}">正在加载</view>
			<view class='no-more' wx:else>{{noMore?'没有更多数据了~':''}}</view>
		  </view>
		</view>
		<view class='to-top' wx:if="{{showToTop}}" bindtap='toTop'>
		  <image src='../../static/ic_to_top.png'></image>
		</view>
	  </scroll-view>
	</view>
</template>

<script>
	import {mapState} from 'vuex'
	export default {
		data() {
			return {
				topNum: 0,
				wh: 0,
			}
		},
		props: {
			isTop: { //滚动条是否在顶部
			  type: Boolean,
			  value: true
			}, 
			loadMoreIng: { //加载中
			  type: Boolean,
			  value: false
			},
			showTop: {
			  type: Boolean,
			  value: false
			},
			wH: {//高度
			  type: Number,
			  value: 400
			},
			noMore:{//数据长度
			  type: Boolean,
			  value: false
			}
		},
		computed: mapState(['systemInfo']),
		onLoad() {
			this.wH = this.systemInfo.windowHeight;
		},
		methods: {
			sloadmore() {
			  this.triggerEvent('onloadMore')
			},
			//滚动条到top
			doScrollTop(e) {
			  var scrollTop=e.detail.scrollTop
			  // console.log(scrollTop)
			  this.triggerEvent('onScroll', { scrollTop })
			  let istop = this.data.isTop
			  if (e.detail.scrollTop < 10) {
				if (!istop) {
				  this.setData({
					isTop: true
				  })
				}
			  } else {
				if (istop) {
				  this.setData({
					isTop: false
				  })
				}
			  }
			  if (this.data.showTop){
				if (e.detail.scrollTop > 300) {
				  this.setData({
					showToTop: true
				  })
				} else {
				  this.setData({
					showToTop: false
				  })
				}
			  }
			},
			toTop(){
			  this.setData({
				topNum: 0
			  })
			}
		}
	}
</script>

<style>
	page,
	weui-tab__content{
		height: 100%;
		padding: 0
	}
	.weui-navbar{
	  background: #fff;
	}

	.weui-tab__content{
		padding-top: 10px;
		/* text-align: center; */
	}
	.pullmask{
	  position: absolute;
	  height: 300rpx;
	  width: 100%;
	  background: green;
	  z-index: 30;
	  opacity:0;
	}

	.to-top{
	  position:fixed;
	  bottom: 40rpx;
	  right: 40rpx;
	  width: 80rpx;
	  height: 80rpx;
	}

	.to-top image{
	  width: 80rpx;
	  height: 80rpx;
	}

	.i-load-more {
	  width: 60%;
	  height: 100rpx;
	  padding-left: 20%;
	  padding-right: 20%;
	  font-size: 28rpx;
	  display: flex;
	  justify-content: center;
	  align-items: center;
	}

	.i-load-more-loading {
	  display: inline-block;
	  margin-right: 12px;
	  vertical-align: middle;
	  width: 14px;
	  height: 14px;
	  background: 0 0;
	  border-radius: 50%;
	  border: 2px solid #e9eaec;
	  border-color: #e9eaec #e9eaec #e9eaec #05bf0a;
	  animation: btn-spin 0.6s linear;
	  animation-iteration-count: infinite;
	}

	.i-load-more-tip {
	  display: inline-block;
	  vertical-align: middle;
	  color: #495060;
	}

	.i-load-more-empty {
	  width: 4px;
	  height: 4px;
	  border-radius: 50%;
	  background-color: #e5e5e5;
	  display: inline-block;
	  position: relative;
	  vertical-align: 0;
	  top: -.16em;
	}

	.no-more{
	  font-size: 24rpx;
	  color: #999;
	}

	@keyframes btn-spin {
	  0% {
		transform: rotate(0);
	  }

	  100% {
		transform: rotate(360deg);
	  }
	}

</style>
