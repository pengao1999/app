<template>
	<view>
		<view class="state_bar"></view>
		<scroll-view class="scrollView" scroll-y="true" :style="'height:'+windowHeight+'px;'">
			<view class="bg-white">
				<swiper class="screen-swiper round-dot" :indicator-dots="true" :circular="true" :autoplay="true" interval="5000"
				 duration="500">
					<swiper-item v-for="(item,index) in swiperList" :key="index">
						<image :src="item" style="width: 100%; height: 100%;" mode="aspectFit" @click="preview(index)" />
					</swiper-item>
				</swiper>
				<view class="text-hd">{{goods.name}}</view>
				<view class="align-end row-wrap row-container" style="width: 690upx;" v-if="periodsConfig.periods">
					<view class="text-goods-price">
						<!-- <text class="num" v-if="selectshop.price && periodsConfig.periods">¥{{(selectshop.price/periodsConfig.periods + selectshop.price*goods.rent_interest_rate*0.01).toFixed(2) || 0 }}</text> -->
						<text class="num" v-if="selectshop.price && periodsConfig.periods">¥{{(((selectshop.price/periodsConfig.periods + selectshop.price*goods.rent_interest_rate*0.01).toFixed(2) || 0)/30).toFixed(2) }}</text>
						<text class="num" v-else>计算中...</text>
						<!-- /{{periodsConfig.unit}} -->
						/天
					</view>
					<div class="cu-tag" style="margin-left: 10upx;background: #10D9D7;color: white;-webkit-border-radius: 10upx;-moz-border-radius: 10upx;border-radius: 10upx;"
					 v-if="main_tag">
						{{main_tag}}起租
					</div>
					<div style="color:#808080;font-size: 24upx;margin-left: auto;" v-if="selectshop.origin_price">
						市场价 ¥{{selectshop.origin_price.toFixed(2)}}
					</div>
					<div style="color:#808080;font-size: 24upx;margin-left: auto;" v-else-if="goods.original_price">
						市场价 ¥{{goods.original_price.toFixed(2)}}
					</div>
					<div style="color:#808080;font-size: 24upx;margin-left: auto;" v-else>
						市场价 ¥{{0}}
					</div>
				</view>
				<!-- <view class="align-end mrg-top-20 row-container" style="padding: 10rpx 0; border-top: 1px solid #E6E6E6">

					<div class="text-center" style="width:374upx">
						认证会员免押金
					</div>
					<div style="width: 2upx;height: 38upx;background: #F8F8F8;"></div>
					<div class="text-center" style="width:374upx">
						正品保障</text>
					</div>
				</view> -->
				<view>
					<image lazy-load class="bg-gray" mode="aspectFill" v-if="banner" :src="banner.pic" @click="clickIndexAd(banner)"
					 @error="imageError(banner)" style="width: 690upx;height:120upx;margin:30upx;border-radius: 10rpx;"></image>
				</view>
			</view>

			<view class="list-container">
				<!--        <view class="list-row" @click="showServiceModal">-->
				<!--          <text class="row-left">活动</text>-->
				<!--          <text class="row-center">{{serviceData.name}}</text>-->
				<!--          <text class="row-right">></text>-->
				<!--        </view>-->
				<view class="list-row" @click="zulin()">
					<text class="row-left">套餐</text>
					<!-- <text class="row-center" v-if="main_tag">{{main_tag}}起租</text> -->
					<text class="row-center" @click="zulin">{{ selectArr.join(' ') }}</text>
					<text class="row-right icon-right"></text>
				</view>
				<view class="list-row">
					<text class="row-left">说明</text>
					<text class="row-center">
						超悦租发货&售后
						<br />
						safe双重隐私擦除技术/隐私保障
					</text>
					<!-- <text class="row-right icon-right"></text> -->
				</view>
				<!-- <view class="list-row" @click="showSpecificationModal">
          <text class="row-left">规格</text>
          <text class="row-right">></text>
        </view>-->
				<!-- <view>
			<image class="bg-gray round" mode="aspectFill" v-if="banners" :src="image_root + banners.pic" @click="clickBanner(banners)" style="width: 710upx;height:160upx;margin:20upx;"></image>
		</view> -->
			</view>


			<scroll-view scroll-x class="bg-white nav text-center">
				<view class="cu-item" :class="0==TabCur?'text-red cur':''" @click="TabCur=0">
					商品介绍
				</view>
				<view class="cu-item" :class="1==TabCur?'text-red cur':''" @click="TabCur=1">
					规格参数
				</view>
				<view class="cu-item" :class="2==TabCur?'text-red cur':''" @click="TabCur=2">
					租赁必读
				</view>
			</scroll-view>
			<view class="rent-wrap" v-if="2==TabCur">
				<rich-text :nodes="zulinbidu" />
				<!-- <view class="rent-cycle-wrap">
					<text style="margin: 0 0 10rpx 20rpx;">租赁周期</text>
					<view>
						<view class="rent-cycle-bar">
							<text class="bar1">运输中</text>
							<text class="bar2">租赁中</text>
							<text class="bar3">到期</text>
						</view>
						<view class="rent-cycle-pointer">
							<view class="triangle-up-left"></view>
							<view class="triangle-up-right"></view>
						</view>
						<view class="rent-cycle-comment">
							<view class="text-block-1">
								<text>快递签收日</text>
								<text style="font-size: 20rpx;">租期开始</text>
							</view>
							<view class="text-block-2">
								<text>租赁到期</text>
								<text style="font-size: 20rpx;">可买断/续租/归还</text>
							</view>
						</view>
					</view>
					<text style="margin: 20rpx 0 0 20rpx; font-size: 26rpx;">租期结束后可选方案</text>
				</view>
				<view class="rent-continue-wrap">
					<view class="rent-continue-title">
						<text>续租</text>
						<text style="font-size: 24rpx; color: grey; margin-top: 10rpx;">延长租期 随时可还 租满即还</text>
					</view>
					<view class="rent-continue-container">
						<view class="rent-continue-block">
							<view class="block-num">1</view>
							<view class="block-text">续租下单</view>
						</view>
						<view class="connect-line"></view>
						<view class="rent-continue-block">
							<view class="block-num">2</view>
							<view class="block-text">下单成功</view>
						</view>
						<view class="connect-line"></view>
						<view class="rent-continue-block">
							<view class="block-num">3</view>
							<view class="block-text">订单完结</view>
						</view>
						<view class="connect-line"></view>
						<view class="rent-continue-block">
							<view class="block-num">4</view>
							<view class="block-text">续租成功</view>
						</view>
						<view class="connect-line"></view>
						<view class="rent-continue-block">
							<view class="block-num">5</view>
							<view class="block-text">租满即送</view>
						</view>
					</view>
				</view>
				<view class="rent-continue-wrap">
					<view class="rent-continue-title">
						<text>买断</text>
						<text style="font-size: 24rpx; color: grey; margin-top: 10rpx;">支付买断尾款 终生拥有</text>
					</view>
					<view class="rent-continue-container">
						<view class="rent-continue-block">
							<view class="block-num">1</view>
							<view class="block-text">申请买断</view>
						</view>
						<view class="connect-line"></view>
						<view class="rent-continue-block">
							<view class="block-num">2</view>
							<view class="block-text">支付尾款</view>
						</view>
						<view class="connect-line"></view>
						<view class="rent-continue-block">
							<view class="block-num">3</view>
							<view class="block-text">买断成功</view>
						</view>
						<view class="connect-line"></view>
						<view class="rent-continue-block">
							<view class="block-num">4</view>
							<view class="block-text">押金释放</view>
						</view>
					</view>
				</view>
				<view class="rent-continue-wrap">
					<view class="rent-continue-title">
						<text>还机</text>
						<text style="font-size: 24rpx; color: grey; margin-top: 10rpx;">归还旧机 下单享新机</text>
					</view>
					<view class="rent-continue-container">
						<view class="rent-continue-block">
							<view class="block-num">1</view>
							<view class="block-text">邮寄还机</view>
						</view>
						<view class="connect-line"></view>
						<view class="rent-continue-block">
							<view class="block-num">2</view>
							<view class="block-text">质检无误</view>
						</view>
						<view class="connect-line"></view>
						<view class="rent-continue-block">
							<view class="block-num">3</view>
							<view class="block-text">擦除隐私</view>
						</view>
						<view class="connect-line"></view>
						<view class="rent-continue-block">
							<view class="block-num">4</view>
							<view class="block-text">还机成功</view>
						</view>
					</view>
				</view> -->
			</view>

			<view class="main-center-page" style="background: white; align-items: flex-start; width: 750upx" v-if="0==TabCur">

				<rich-text :nodes="goods.details" style="width:750upx;"> </rich-text>
				<!--        <uParse :content="goods.details" @preview="preview" @navigate="navigate" />-->
			</view>

			<view class="main-center-page" style="background: white; align-items: flex-start; width: 750upx;" v-if="1==TabCur">

				<rich-text :nodes="goods.specifications" style="width:750upx;"> </rich-text>
				<!--        <uParse :content="goods.details" @preview="preview" @navigate="navigate" />-->
			</view>
			<view style="height: 100rpx;"></view>
			<view class="fixed-btn row-container" style="font-size: 40rpx;width: 100%;height: 100rpx; background: white">
				<!-- <uni-goods-nav :fill="true" :options="options" :button-group="buttonGroup" @click="handleBtn" @buttonClick="zulin()" /> -->
				<!--        <view-->
				<!--          class="icon-home"-->
				<!--          style="font-size: 50rpx; color: #ef4136; width: 100%; margin-left: 30rpx"-->
				<!--          @click="toHome"-->
				<!--        ></view>-->
				<!--        <view-->
				<!--          class="normal-btn"-->
				<!--          style="width: 100%; height: 100rpx;line-height: 100rpx; background: #ef4136"-->
				<!--          @click="toOrder"-->
				<!--        >立即租</view>-->
				<view class="bottom-block" @click="toHome">
					<image class="block-icon" src="/static/zulin/tabbar/home.png" />
					<text class="block-text">首页</text>
				</view>
				<view class="bottom-block" @click="contactUs">
					<image class="block-icon" src="/static/zulin/zixun.png" />
					<text class="block-text">咨询</text>
				</view>
				<view class="bottom-block" @click="handleCollection">
					<image class="block-icon" src="/static/zulin/collect-success.png" v-if="collectionObj.isCollected" />
					<image class="block-icon" src="/static/zulin/collect.png" v-else />
					<text class="block-text">收藏</text>
				</view>
				<view class="bottom-btn" @click="zulin">
					免押租赁
				</view>
			</view>
		</scroll-view>

		<service-modal :show="isShowService" :service="serviceData" @close="hideServiceModal"></service-modal>
		<staging-modal v-if="isShowStaging" :propsData="stageData" :activeIdx="stageIdx" @close="hideStagingModal" @select="selectStage"></staging-modal>
		<coupon-modal :show="isShowCouponModal" @close="hideCouponModal"></coupon-modal>
		<!--    <view v-if="isShowSpecification">-->
		<!--      <view class="mask" @click="hideSpecificationModal"></view>-->
		<!--      <view class="container">-->
		<!--        <view class="head">-->
		<!--          <image :src="swiperList[0]" />-->
		<!--          <text>¥{{goods.price}}</text>-->
		<!--        </view>-->
		<!--        <view class="content">-->
		<!--          <view class="content-row" v-for="specification in specifications" :key="specification.id">-->
		<!--            <view class="title">{{specification.name}}</view>-->
		<!--            <view class="cards">-->
		<!--              <view-->
		<!--                class="card"-->
		<!--                v-for="item in specification.attrs"-->
		<!--                :key="item.id"-->
		<!--                :class="cAttr[specification.id]===item.id?'card-high-light':''"-->
		<!--                @click="selectSpecific(specification.id, item.name, item.id)"-->
		<!--              >{{item.name}}</view>-->
		<!--            </view>-->
		<!--          </view>-->
		<!--          <view class="content-row" v-if="specifications.length===0">暂无可选规格</view>-->
		<!--        </view>-->
		<!--        <view class="bottom-btn" @click="hideSpecificationModal">确定</view>-->
		<!--      </view>-->
		<!--    </view>-->

		<!-- sku弹出层 -->
		<view class="popup" catchtouchmove="true" :class="specClass" @touchmove.stop.prevent="moveHandle">
			<view class="mask"></view>
			<view class="layer attr-content">
				<view class="specification-wrapper">
					<block>
						<view class="top-wrap" style="background-color: #F0F0F0;" v-if="periodsConfig.periods">
							<view class="top-block">
								<!-- <view style="color: #FF4230; font-size: 32rpx; font-weight: bold">{{ (selectshop.price/periodsConfig.periods + selectshop.price*goods.rent_interest_rate*0.01).toFixed(2) || 0 }}</view> -->
								<view style="color: #FF4230; font-size: 32rpx; font-weight: bold">{{(((selectshop.price/periodsConfig.periods + selectshop.price*goods.rent_interest_rate*0.01).toFixed(2) || 0)/30).toFixed(2)}}</view>
								<!-- <view style="color: #666; font-size: 24rpx">{{goods.unit}}租金（元/{{goods.unit}}）</view> -->
								<view style="color: #666; font-size: 24rpx">日租金（元/日）</view>
							</view>
							<!-- <view class="top-block">
							<view style="color: #222; font-size: 32rpx; font-weight: bold">{{ (periodsConfig.periods*(selectshop.price/periodsConfig.periods + selectshop.price*goods.rent_interest_rate*0.01)).toFixed(2) || 0 }}</view>
							<view style="color: #666; font-size: 24rpx">总租金</view>
						</view> -->
							<view class="top-block">
								<view ref="skuGoodsPrice" style="color: #222; font-size: 32rpx; font-weight: bold" v-if="selectshop.origin_price">{{ selectshop.origin_price.toFixed(2) || 0 }}</view>
								<view ref="skuGoodsPrice" style="color: #222; font-size: 32rpx; font-weight: bold" v-else-if="goods.original_price">{{ goods.original_price.toFixed(2) || 0 }}</view>
								<view style="color: #666; font-size: 24rpx">市场价</view>
							</view>
						</view>
					</block>
					<scroll-view class="specification-wrapper-content" scroll-y="true">
						<view class="specification-header">
							<view class="specification-left">
								<image v-if="colors.length==0" @click="previewSkuImage(selectshop.pic?image_root+selectshop.pic:image_root+goods.pic)"
								 class="product-img" :src="selectshop.pic?image_root+selectshop.pic:image_root+goods.pic"></image>
								<image v-else @click="previewSkuImage(image_root+colors[colorIndex].pic)" class="product-img" :src="image_root+colors[colorIndex].pic"></image>
							</view>
							<view class="specification-right">
								<view class="price-content">
									<text class="sign">¥</text>
									<text class="price" v-if="periodsConfig.periods">{{ (selectshop.price/ periodsConfig.periods+ selectshop.price*goods.rent_interest_rate*0.01).toFixed(2) || 0 }}<text
										 style="font-size: 30upx;">/{{periodsConfig.unit}}</text></text>
								</view>
								<view class="inventory">库存：{{ selectshop.stock || 0 }} 件</view>
								<view class="choose">已选：{{ selectArr.join(' ') }}</view>
							</view>
						</view>
						<view class="specification-content">
							<view class="specification-item" v-for="(item, index1) in specifications" :key="index1">
								<view class="item-title">{{ item.name }}</view>
								<view class="item-wrapper">
									<view class="item-content" @tap="skuClick(item_value, index1, $event, index2)" v-for="(item_value, index2) in item.item"
									 :key="index2" :class="[item_value.ishow ? '' : 'noactived', subIndex[index1] == index2 ? 'actived' : '']">
										{{ item_value.name }}
									</view>
								</view>
							</view>
							<view class="specification-item" v-if="colors.length">
								<view class="item-title">颜色</view>
								<view class="item-wrapper">
									<view class="item-content" v-for="(color, cIndex) in colors" :key="cIndex" @click="changeColorIndex(cIndex)"
									 :class="[colorIndex==cIndex ? 'actived' : '']">
										{{ color.name }}
									</view>
								</view>
							</view>
							<view class="specification-item coloum-container" v-if="associations.length>0">
								<view class="row-container align-center">
									<view class="item-title">{{associations[0].name}}（必选）</view>
									<image src="/static/question.png" @click="toArticle('e53ccf867415436e97f2a44b0f5ed273', '关于碎屏宝')" style="width: 36rpx;margin-bottom: 20rpx;"
									 mode="widthFix" v-if="associations[0].name == '碎屏宝'"></image>
									<image src="/static/question.png" @click="toArticle('e53ccf867415436e97f2a44b0f5ed273', '关于意外保障')" style="width: 36rpx;margin-bottom: 20rpx;"
									 mode="widthFix" v-else></image>
									<!--                  <view class="item-wrapper" style="margin-left: auto;">-->
									<!--                    <radio :checked="ifCheck" style="margin-right: 10rpx;" @click="ifCheck = !ifCheck" color="#FB2622"></radio>-->
									<!--                  </view>-->
								</view>
								<view class="item-wrapper">
									<view class="item-content" :class="ifCheck?'actived':''" @click="ifCheck=!ifCheck" v-for="(item, index) in associations"
									 :key="index">
										一次性支付 | {{item.price + ' 元'}}<!-- {{item.name + '（' + item.price + '）元'}} -->
									</view>
								</view>
							</view>
							<!-- 增值服务-->
							<view class="specification-item coloum-container" v-if="goods.prefers.length>0">
								<view class="row-container align-center">
									<view class="item-title">增值服务套餐（可选）</view>
									<!-- <image src="/static/question.png" style="width: 36rpx;margin-bottom: 20rpx;" mode="widthFix"></image> -->
									<!--                  <view class="item-wrapper" style="margin-left: auto;">-->
									<!--                    <radio :checked="ifCheck" style="margin-right: 10rpx;" @click="ifCheck = !ifCheck" color="#FB2622"></radio>-->
									<!--                  </view>-->
								</view>
								<view class="item-wrapper">
									<view class="item-content" :class="ifChoose[index].index == index?'actived':''" @click="Chooseindex(index)"
									 v-for="(item, index) in goods.prefers" :key="index">
										{{item.name + '（' + item.price + '）元'}}
									</view>
								</view>
							</view>
							<!-- 溢价费 -->
							<view class="specification-item coloum-container" v-if="goods.bargain_fee && goods.bargain_fee !== 0">
								<view class="row-container align-center">
									<view class="item-title" style="margin-right: 20rpx;">商品溢价 </view>
									<image src="/static/question.png" @click="toArticle('ae077daf7482436e9f2afbee5e95914a', '关于商品溢价')" style="width: 36rpx;margin-bottom: 20rpx;"
									 mode="widthFix"></image>
									<!--                  <view class="item-wrapper" style="margin-left: auto;">-->
									<!--                    <radio :checked="ifCheck" style="margin-right: 10rpx;" @click="ifCheck = !ifCheck" color="#FB2622"></radio>-->
									<!--                  </view>-->
								</view>
								<!-- <view class="item-wrapper">
									<view class="item-content" :class="ifCheck?'actived':''" @click="ifCheck=!ifCheck" v-for="(item, index) in associations"
									 :key="index">
										{{item.name + '（' + item.price + '）元'}}
									</view>
								</view> -->
								<view class="item-wrapper">
									<!-- <view class="item-content" :class="ifCheck?'actived':''" @click="ifCheck=!ifCheck" v-for="(item, index) in associations"
									 :key="index">
										{{item.name + '（' + item.price + '）元'}}
									</view> -->
									溢出价:{{goods.bargain_fee}}元
								</view>
							</view>
							<view class="specification-item row-container">
								<view class="item-title">租赁数量</view>
								<view class="item-wrapper" style="margin-left: auto;">
									<!-- <stepper size="small" :min="1" :max="selectshop.stock" :defaultValue="selectNum" :display="canCount" @change="changeNum"></stepper> -->
									<!-- <uni-number-box :min="1" :max="selectshop.stock" :value="selectNum" @change="changeNum" /> -->
									<view class="uni-numbox">
										<view @click="_calcValue('minus')" class="uni-numbox__minus uni-cursor-point">
											<text class="uni-numbox--text" :class="{ 'uni-numbox--disabled': selectNum <= 1 || disabled }">-</text>
										</view>
										<input :disabled="disabled" @focus="_onFocus" @blur="_onBlur" class="uni-numbox__value" type="number" v-model="selectNum" />
										<view @click="_calcValue('plus')" class="uni-numbox__plus uni-cursor-point">
											<text class="uni-numbox--text" :class="{ 'uni-numbox--disabled': selectNum >= selectshop.stock || disabled }">+</text>
										</view>
									</view>
								</view>
							</view>
						</view>
					</scroll-view>
					<view class="close" @click="hideSku">
						<image class="close-item" src="../../static/zulin/close.png"></image>
					</view>
				</view>
				<view class="btn-wrapper"><button class="sure" @click="toOrder">确认</button></view>
			</view>
		</view>
		<view class="wxpopup" v-if="show">
			<view class="cust-ser-box" v-if="show">
				<view class="csb-card" @click="handleCopyWxID('CYZ2018001')">
					<image src="../../static/wechat.png" mode="" class="cc-wechat-img"></image>
					店小二 CYZ2018001（租前咨询）
				</view>
				<view class="csb-card" @click="handleCopyWxID('cyzcyzcy888')">
					<image src="../../static/wechat.png" mode="" class="cc-wechat-img"></image>
					包租公 cyzcyzcy888（交租咨询）
				</view>
				<view class="csb-card" @click="handleCopyWxID('CYZ2018003')">
					<image src="../../static/wechat.png" mode="" class="cc-wechat-img"></image>
					产品售后 CYZ2018003（产品售后）
				</view>

				<view class="csb-card">
					点击可复制微信号→打开微信→搜索添加
				</view>
			</view>
			<view class="btn-close-mask" @click="show = false" v-if="show">
				<image src="../../static/ic_circle_close.png" class="icon-closed"></image>
			</view>
		</view>
		<myDialog title="提示" content="请先完成认证" confirmColor="var(--blue)" :dialog-show="verifyDialog" @cancelButton="verifyDialog=false"
		 @confirmButton="confirmVerify"></myDialog>
		<myDialog :title="dialogTitle" confirmColor="var(--blue)" :content="dialogContent" :dialog-show="showDialog"
		 @cancelButton="showDialog=false" @confirmButton="confirmAuth"></myDialog>
	</view>
</template>

<script>
	import Config from "@/common/js/Config.js";
	import CreditConfig from '../verify/config'
	import Toast from "@/common/js/toast.js";
	import Util from "@/common/js/util.js";
	import CopyRight from "../../components/yx_view/myCopyRight.vue";
	import uParse from "../../common/third/uParse/src/wxParse.vue";
	import ServiceModal from './ServiceModal.vue'
	import StagingModal from './StagingModal.vue'
	import SpecificationModal from './SpecificationModal.vue'
	import CouponModal from '../order/CouponModal.vue'
	import uniCollapse from '../../components/uni-collapse.vue'
	import uniCollapseItem from '../../components/uni-collapse-item.vue'
	import UniGoodsNav from '../../components/uni-goods-nav/uni-goods-nav'
	import uniNumberBox from '../../components/yx_view/steppercopy'
	import Auth from '../auth'
	import ImageCache from '@/common/js/ImageCache.js'
	import {
		mapMutations
	} from 'vuex'


	const htmlBeautify = (html, rule) => {
		if (!rule) {
			rule = {
				img: {
					"max-width": "100%"
				}
			}
		}

		for (const key in rule) {
			if (rule.hasOwnProperty(key)) {
				const element = rule[key];
				let style = ';'
				for (const k in element) {
					if (element.hasOwnProperty(k)) {
						const v = element[k];
						style += `${k}:${v};`
					}
				}

				// let reg = new RegExp(`<${key}>`, 'g')
				var reg = new RegExp(`(i?)(\<${key})(?!(.*?style=[\'\"](.*)[\'\"])[^\>]+\>)`, "gmi");
				let reg1 = new RegExp(`<${key}(.*?)style=[\'\"](.*?)[\'\"]`, 'gmi')

				html = html.replace(reg, `$2 style="" $3`).replace(reg1, `<${key} $1 style="$2${style}"`)
			}
		}
		// html = html.replace(/<p>/, '<p style="">').replace(/<p(.*?)style=[\'\"](.*?)[\'\"]/g, `<p $1 style="$2;max-width:100%;background:#333;"`)

		// console.log(html)
		return html
	}

	export default {
		data() {
			return {
				key: 0,
				windowHeight: 0,
				systemInfo: {},
				cardCur: 0,
				swiperList: [],
				image_root: "",
				goods: {},
				specificationIdx: [],
				isShowService: false,
				isShowStaging: false,
				isShowSpecification: false,
				stageData: [],
				stageIdx: 0,
				serviceData: {
					name: '一键变现',
					desc: '一键变现是由第三方平台（回收宝）提供的商品回收服务，用户在本平台购买的商品可一键将商品出售给第三方兑换成现金。'
				},
				main_tag: '',
				attrs: '',
				cAttr: {},
				cAttrName: {},
				isShowCouponModal: false,
				accordion: [{
						id: 0,
						title: '标题文字',
						content: '手风琴效果',
						animation: true
					},
					{
						id: 1,
						title: '标题文字',
						content: '手风琴效果',
						animation: true
					},
					{
						id: 2,
						title: '标题文字',
						content: '手风琴效果',
						animation: true
					}
				],
				TabCur: 0,
				options: [{
					icon: '/static/zulin/tabbar/home.png',
					text: '首页'
				}, {
					icon: '/static/zulin/zixun.png',
					text: '咨询'
				}, {
					icon: '/static/zulin/shoucang.png',
					text: '收藏'
				}],
				buttonGroup: [{
					text: '立即租',
					backgroundColor: '#1677FF',
					color: '#fff'
				}],
				//sku
				showSet: false,
				specClass: 'none',
				specifications: {}, //spu规格列表
				difference: [], //sku列表
				shopItemInfo: {}, //存放要和选中的值进行匹配的数据
				selectArr: [], //存放被选中的值
				subIndex: [], //是否选中 因为不确定是多规格还是但规格，所以这里定义数组来判断
				selectshop: {
					origin_price: 0
				}, //存放最后选中的商品
				selectNum: 1, //选中数量
				verifyDialog: false,
				periodsConfig: {
					periods: -1,
					unit: '周'
				},
				contactPhone: '',
				isCollected: false,
				collectionObj: {
					isCollected: false,
					collectKey: '',
					targetKey: ''
				},
				ifCheck: true,
				ifChoose: [0],
				associations: [],
				banner: {},
				colors: [],
				colorIndex: 0,
				zulinbidu: "",
				show: false,
				
				
				
				value:1,
				min:1,
				max:100,
				step:1,
				disabled:false,
				inputValue:0
			};
		},
		mixins: [Toast, Auth],
		components: {
			uParse,
			CopyRight,
			ServiceModal,
			StagingModal,
			SpecificationModal,
			CouponModal,
			uniCollapse,
			uniCollapseItem,
			UniGoodsNav,
			// stepper,
			uniNumberBox
		},
		onLoad(options) {
			console.log(options)
			let self = this;
			uni.setNavigationBarTitle({
				title: "商品详情"
			});
			this.getAd()
			this.getContact()
			this.getArticle("b5c8b3cd30864cb89e18b170b2c9902e")
			this.key = options.key;
			// this.getContact()
			this.getProductDetail(options.key);
			uni.getSystemInfo({
				success(system) {
					if (system.errMsg === "getSystemInfo:ok") {
						self.systemInfo = system;
					}
				}
			});
			this.getAssociation()
			// this.specifications.map(item => {
			//   this.selectArr.push('');
			//   this.subIndex.push(-1);
			// });
			this.checkCollected()
		},
		watch: {
			systemInfo: {
				handler() {
					if (!Util.isEmptyObject(this.systemInfo)) {
						this.windowHeight = this.systemInfo.windowHeight;
						console.log("windowHeight:" + this.windowHeight);
					}
				}
			}
		},
		computed: {
			// systemInfo() {
			// 	return this.$store.state.systemInfo
			// }
			point_token() {
				return this.$store.state.point_token
			},
			canCount() {
				return this.subIndex.some(item => item === -1);
			}
		},
		mounted() {
			console.log(this.goods)
		},
		methods: {
			...mapMutations(['setUserInfo']),
			getAd() {
				let self = this
				self.$Phttp.post(Config.JAVA_SAAS_URLS.getAds, {}).then(res => {
					console.log(res)
					res = res.data
					if (res.code === 0) {
						let goodBanner = res.data.goodBanner
						if (goodBanner.length > 0) {
							let banner = goodBanner[Math.floor(Math.random() * goodBanner.length)]
							let name = banner.pic
							let imageUrl = res.other.img_root + banner.pic
							banner.pic = ImageCache.get(name, imageUrl)
							banner.picName = name
							banner.originalPic = imageUrl
							self.banner = banner
						}
						console.log(self.banner)
					}
				})
			},
			clickBanner: function(curBanner) {
				if (curBanner.param !== '') {
					uni.navigateTo({
						url: '/pkChaoYueZu/index/detail?key=' + curBanner.param
					})
				}
			},
			changeColorIndex(index) {
				this.colorIndex = index
			},
			getAssociation() {
				let self = this
				const param = {
					appKey: 123,
					goodsKey: self.key
				}
				self.$Phttp.get(Config.JAVA_SAAS_URLS.getAssociation, param).then(res => {
					res = res.data
					if (res.code === 0) {
						console.log('data', res.data)
						self.associations = res.data || []
					}
					uni.hideLoading();
					console.log(self.associations, 'associations')
				})
			},
			hideSku() {
				this.specClass = 'none'
			},
			checkCollected() {
				let self = this
				const data = {
					appKey: 123, // hard code app key here
					collectType: 'GOODS',
					userKey: self.userInfo.user_key
				}
				self.$Phttp.get(Config.JAVA_SAAS_URLS.getCollection, data).then(res => {
					res = res.data
					if (res.code === 0) {
						res.data.forEach(item => {
							if (item.target_key === self.key) {
								self.collectionObj = {
									isCollected: true,
									collectKey: item.collect_key,
									targetKey: item.target_key
								}
							}
						})
						console.log('obj', self.collectionObj)
					}
				})
			},
			getContact() {
				let self = this
				self.$Phttp.post(Config.JAVA_SAAS_URLS.getContact, {}).then(res => {
					console.log(res)
					res = res.data
					if (res.code === 0) {
						self.contactPhone = res.msg
					}
				})
			},
			selectSpecific(specificationId, name, itemId) {
				this.$set(this.cAttr, specificationId, itemId)
				this.$set(this.cAttrName, specificationId, name)
				let cAttr = []
				let cAttrName = []
				Object.values(this.cAttr).map(value => cAttr.push(value))
				Object.values(this.cAttrName).map(value => cAttrName.push(value))
				this.goods['attr_ids'] = `,${cAttr.join(',')},`
				this.goods['attr_names'] = `,${cAttrName.join(',')},`
			},
			getArticle: function(article_key) {
				let self = this
				let data = {
					article_key: article_key
				}
				self.$Phttp.post(Config.JAVA_SAAS_URLS.getArticle, data).then((res) => {
					console.log(res)
					res = res.data
					self.zulinbidu = htmlBeautify(res.data.content)
				})
			},
			getProductDetail: function(good_key) {
				let self = this;
				// self.toast({
				// 	type: "loading", 
				// 	desc: "努力加载中..."
				// });
				let data = {
					goods_key: good_key
				};
				self.$Phttp.post(Config.JAVA_SAAS_URLS.getGoods, data).then(res => {
						console.log(res, '747')
						self.toast(true);
						// #ifdef MP-ALIPAY 
						console.log('123456')
						uni.hideLoading()
						// #endif 
						res = res.data;
						if (res.code === 0) {
							self.image_root = res.other.img_root;
							self.goods = Object.assign(res.data, {
								num: 1
							});
							if (res.data.pics && res.data.pics.length > 0) {
								for (let i = 0; i < res.data.pics.length; i++) {
									self.swiperList.push(self.image_root + res.data.pics[i]);
								}
							} else {
								self.swiperList.push(self.image_root + res.data.pic);
							}
							self.goods["goods_key"] = self.goods.goods_key;
							self.goods["activity_key"] = 0;
							self.goods["activity_endtime"] = 0;
							self.getTemplate(good_key)
							self.getSkuList(good_key, self.goods["specific_template_key"])
							self.colors = res.data.colors
							self.colors.forEach((color, index) => {
								if (color.is_default === '1') {
									self.colorIndex = index
								}
							})

							if (self.goods['details']) {
								self.goods['details'] = this.goods['details'] = htmlBeautify(this.goods['details'], {
									img: {
										"max-width": "100%",
										"display": "flex"
									}
								})
							}
							if (self.goods['specifications']) {
								self.goods['specifications'] = this.goods['specifications'] = htmlBeautify(this.goods['specifications'], {
									img: {
										"max-width": "100%"
									}
								})
							}
							let ifChooseobj = []
							self.goods.prefers.forEach((item, index) => {
								console.log(index)
								let obj = {}
								if (index == 0) {
									obj.index = 0
									ifChooseobj.push(obj)
								} else {
									obj.index = -1
									ifChooseobj.push(obj)
								}
							})
							self.ifChoose = ifChooseobj
							console.log(self.goods, 'goods')
							// self.specifications = res.data.attrgroups
							// console.log('spec', self.specifications)
						}
					})
					.catch(err => {
						console.log(err)
						uni.showModal({
							title: "温馨提示",
							content: "抱歉，获取商品详情失败，请检查网络！",
							showCancel: false,
							comfirmText: "返回",
							success: res => {
								uni.navigateBack();
							}
						});
					});
			},
			getPluginMiniAttr(templateKey) {
				let self = this
				let postData = {
					template_key: templateKey
				}
				self.$Phttp.post(Config.JAVA_SAAS_URLS.getPluginMiniAttr, postData).then(res => {
					res = res.data
					if (res.code === 0) {
						self.main_tag = res.data.specific_attribute_name
					}
				})
			},
			getSkuList(goodsKey, templateKey) {
				let self = this
				let postData = {
					goods_key: goodsKey,
					specific_template_key: templateKey
				}
				self.$Phttp.post(Config.JAVA_SAAS_URLS.getSkuList, postData).then(res => {
					console.log(res)
					res = res.data
					if (res.code === 0) {
						self.difference = res.data
						if (res.data.length === 0) {
							uni.setStorageSync("dialogData", {
								title: '提示',
								desc: '商品已停售，返回首页',
								page: 'closePage'
							})
							uni.navigateTo({
								url: '/pkChaoYueZu/dialog/popup'
							})
						}
						if (self.difference.length > 0) {
							self.checkItem(); //计算sku里面规格形成路径
							self.checkInpath(-1); //传-1是为了不跳过循环
							self.chooseDefault();
						}
					}
				})
			},
			zulin() {
				let self = this
				// self.checkItem(); //计算sku里面规格形成路径
				// self.checkInpath(-1); //传-1是为了不跳过循环
				self.specClass = 'show'
			},
			checkSelectArr() {
				let self = this
				let isOk = true
				self.selectArr.forEach((arr, index) => {
					if (arr === "") {
						isOk = false
					}
				})
				return isOk
			},
			toOrder: function() {
				let self = this
				if (!self.hasRegister()) return;
				if (!this.hasBindTel()) return
				const data = {
					userKey: self.userInfo.user_key,
					appKey: 123,
					skuGoodsPrice: self.selectshop.origin_price ? self.selectshop.origin_price : self.goods.original_price ? self.goods
						.original_price : '',
				}
				if (!self.checkSelectArr()) {
					self.toast({
						desc: '请完成规格选取'
					})
					return;
				}
				if (!self.ifCheck && self.associations.length > 0) {
					self.toast({
						desc: '请选择增值服务'
					})
					return
				}
				self.toast({
					type: 'loading',
					time: 8000
				})
				self.$Phttp.get(CreditConfig.REQUEST_URLS.creditStatus, data).then(res => {
					self.toast(true)
					res = res.data
					if (res.code !== 200 || res.data.isAllCertificate !== 1) {
						if (self.waitPass(res.data)) {
							uni.setStorageSync("dialogData", {
								title: '提示',
								desc: '请等待额度审核',
								page: 'closeDialog'
							})
							uni.navigateTo({
								url: '/pkChaoYueZu/dialog/popup'
							})
							return
						}
						uni.setStorageSync("dialogData", {
							title: '提示',
							desc: '请先完成认证',
							page: '/pkChaoYueZu/verify/verify'
						})
						uni.navigateTo({
							url: '/pkChaoYueZu/dialog/popup'
						})
						return
					} else {
						let zuqiCode = ""
						let zuqiValue = ""
						let preferJson = []
						self.ifChoose.forEach((item, index) => {
							console.log(item)
							if (item.index >= 0) {
								preferJson.push(self.goods.prefers[item.index])
							}
						})
						self.specifications.forEach((type, tIndex) => {
							if (type.plugin_ref === "RENT") {
								zuqiValue = self.selectArr[tIndex]
								type.item.forEach((attr, aIndex) => {
									if (attr.name === self.selectArr[tIndex]) {
										zuqiCode = attr.code
									}
								})
							}
						})
						let json = {}
						self.specifications.forEach((item, index) => {
							json[item.name] = item.item[self.subIndex[index]].name
						})
						self.goods.attr_json = json
						self.goods.attr_names = self.selectArr.join(' ')
						self.goods.price = self.selectshop.price
						self.goods.num = self.selectNum
						self.goods.rent_code = zuqiCode
						self.goods.rent_value = zuqiValue
						self.goods.preferJson = preferJson
						self.goods.original_price = self.selectshop.origin_price
						self.goods.cost_money = self.selectshop.buy_out_amount
						self.associations.length > 0 ? self.associations[0].num = self.selectNum : 0
						if (self.colors && self.colors.length > 0) {
							self.goods.pic = self.colors[self.colorIndex].pic
							self.goods.attr_names += " " + self.colors[self.colorIndex].name
						}
						console.log(this.goods)
						console.log(this.cAttr)
						uni.setStorageSync("goods", self.goods);
						uni.setStorageSync("image_root", self.image_root);
						uni.setStorageSync('cAttr', self.cAttr);
						uni.setStorageSync('associations', self.associations);
						let dims = ''
						self.specifications.forEach((item, index) => {
							if (index !== self.specifications.length - 1) {
								dims += item.name + '-'
							} else {
								dims += item.name
							}
						})
						uni.navigateTo({
							url: "/pkChaoYueZu/order/create?way=2&rentCode=" + zuqiCode + '&dims=' + dims + '&skuGoodsPrice=' + self.selectshop
								.origin_price
						});
					}
				}).catch(err => {

				})

			},
			toArticle(id, title) {
				uni.navigateTo({
					url: "/pkUserInfo/info/protocolDetails?id=" + id + "&title=" + title
				})
			},
			waitPass(creditObj) {
				if (creditObj.isAllCertificate === 0 && creditObj.isBaseInfoCertificate === 1 && creditObj.isBaseInfo === 1 &&
					creditObj.isEmergency === 1 && creditObj.isRealNameCertificate === 2 &&
					creditObj.isBankCardCertificate === 1 && creditObj.isOperatorGet === 1) {
					return true
				}
				return false;
			},
			confirmVerify() {
				uni.navigateTo({
					url: '/pkChaoYueZu/verify/verify'
				})
			},
			preview(index) {
				let self = this;
				uni.previewImage({
					urls: self.swiperList,
					current: index
				});
			},
			previewSkuImage(url) {
				uni.previewImage({
					urls: [url],
					current: 0
				})
			},
			backHome() {
				uni.navigateBack();
			},
			showStagingModal() {
				this.isShowStaging = true
			},
			hideStagingModal() {
				this.isShowStaging = false
			},
			showSpecificationModal() {
				this.isShowSpecification = true
			},
			hideSpecificationModal() {
				this.isShowSpecification = false
			},
			showServiceModal() {
				this.isShowService = true
			},
			hideServiceModal() {
				this.isShowService = false
			},
			selectStage(stageIdx) {
				this.stageIdx = stageIdx
			},
			showCouponModal() {
				this.isShowCouponModal = true
			},
			hideCouponModal() {
				this.isShowCouponModal = false
			},
			toHome() {
				uni.switchTab({
					url: '/pkChaoYueZu/index/main'
				})
			},
			handleBtn(e) {
				switch (parseInt(e.index)) {
					case 0:
						this.toHome()
						break
					case 1:
						uni.setStorageSync("dialogData", {
							title: '联系我们',
							desc: this.contactPhone,
							page: 'call'
						})
						uni.navigateTo({
							url: '/pkChaoYueZu/dialog/popup'
						})
						break
					case 2:
						this.addCollection()
						break
				}
			},
			contactUs() {
				// uni.setStorageSync("dialogData", {
				// 	title: '联系我们',
				// 	desc: this.contactPhone,
				// 	page: 'call'
				// })
				// uni.navigateTo({
				// 	url: '/pkChaoYueZu/dialog/popup'
				// })
				this.show = true
			},
			handleCollection() {
				let self = this
				if (self.collectionObj.isCollected) {
					self.deleteCollection()
					return
				} else {
					self.addCollection()
				}
			},
			deleteCollection() {
				let self = this
				const data = {
					collectKey: self.collectionObj.collectKey
				}
				self.$Phttp.get(Config.JAVA_SAAS_URLS.deleteCollection, data).then(res => {
					res = res.data
					if (res.code === 0) {
						self.collectionObj = {
							isCollected: false,
							collectKey: '',
							targetKey: ''
						}
						uni.showToast({
							title: '您已取消收藏该商品',
							icon: "none"
						})
						return
					}
				})
			},
			addCollection() {
				let self = this
				const data = {
					app_key: 123,
					collect_type: 'GOODS',
					target_key: self.key,
					user_key: self.userInfo.user_key
				}
				console.log('data', data)
				self.$Phttp.post(Config.JAVA_SAAS_URLS.upsertCollection, data).then(res => {
					res = res.data
					if (res.code === 0) {
						console.log(res.data)
						self.collectionObj = {
							isCollected: true,
							collectKey: res.data.collect_key,
							targetKey: self.key
						}
						uni.showToast({
							title: '收藏成功',
							duration: 2000,
							icon: "none"
						})
						return
					} else {
						uni.showToast({
							title: '添加收藏失败，请稍后重试～',
							duration: 2000,
							icon: "none"
						})
					}
				})
			},
			checkItem() {
				console.log('计算有多小种可选路径需要的时间是');
				//计算有多小种可选路径
				let result = this.difference.reduce(
					(arrs, items) => {
						return arrs.concat(
							items.difference.reduce(
								(arr, item) => {
									return arr.concat(
										arr.map(item2 => {
											//利用对象属性的唯一性实现二维数组去重
											if (!this.shopItemInfo.hasOwnProperty([...item2, item])) {
												this.shopItemInfo[[...item2, item]] = items;
											}
											return [...item2, item];
										})
									);
								},
								[
									[]
								]
							)
						);
					},
					[
						[]
					]
				);
				console.log(this.shopItemInfo)
				// console.timeEnd('计算有多小种可选路径需要的时间是');
			},
			checkInpath(clickIndex) {
				console.log(clickIndex)
				console.log(this.specifications.length)
				// console.time('筛选可选路径需要的时间是');
				//循环所有属性判断哪些属性可选
				//当前选中的兄弟节点和已选中属性不需要循环

				for (let i = 0, len = this.specifications.length; i < len; i++) {
					if (i == clickIndex) {
						continue;
					}
					let len2 = this.specifications[i].item.length;
					console.log(len2)
					for (let j = 0; j < len2; j++) {
						if (this.subIndex[i] != -1 && j == this.subIndex[i]) {
							continue;
						}
						let choosed_copy = [...this.selectArr];
						this.$set(choosed_copy, i, this.specifications[i].item[j].name);
						let choosed_copy2 = choosed_copy.filter(item => item !== '' && typeof item !== 'undefined');
						console.log(choosed_copy2)
						if (this.shopItemInfo.hasOwnProperty(choosed_copy2)) {
							this.$set(this.specifications[i].item[j], 'ishow', true);
						} else {
							this.$set(this.specifications[i].item[j], 'ishow', false);
						}
					}
				}
				console.log(this.specifications, 'specifications')
				// console.timeEnd('筛选可选路径需要的时间是');
			},
			moveHandle() {
				//禁止父元素滑动
			},
			chooseDefault() {
				let self = this
				console.log(self.specifications)
				let difference = self.difference[0].difference
				console.log(difference)
				console.log("difference:" + JSON.stringify(difference) + ",specifications:" + self.specifications.length)
				self.specifications.forEach((type, tIndex) => {
					type.item.forEach((attr, aIndex) => {
						console.log(attr)
						console.log(aIndex)
						if (difference[tIndex] === attr.name) {
							// console.log("click:" + JSON.stringify(attr))
							self.skuClick(attr, tIndex, null, aIndex)
						}
					})
				})
			},
			Chooseindex(index) {
				let self = this
				if (self.ifChoose[index].index == index) {
					self.$set(self.ifChoose[index], 'index', -1)
				} else {
					self.$set(self.ifChoose[index], 'index', index)
				}
			},
			parseUnit(unit) {
				switch (unit) {
					case "DAY":
						return '日'
					case "WEEK":
						return '周'
					case "MONTH":
						return '月'
					case "YEAR":
						return '年'
				}
			},
			skuClick(value, index1, event, index2) {
				console.log(value, index1, index2)
				if (value.ishow) {
					if (this.selectArr[index1] != value.name) {
						console.log('进1了')
						this.$set(this.selectArr, index1, value.name);
						this.$set(this.subIndex, index1, index2);
					} else {
						console.log('进2了')
						this.$set(this.selectArr, index1, '');
						this.$set(this.subIndex, index1, -1);
					}
					if (value.periods) {
						this.periodsConfig.periods = value.periods
						this.periodsConfig.unit = this.parseUnit(value.unit)
						console.log(this.periodsConfig)
					}
					console.log(this.periodsConfig, 'periodsConfig')
					this.checkInpath(index1);
					//如果全部选完
					console.log(this.selectArr);
					if (this.selectArr.every(item => item != '')) {
						console.log("selectArr")
						console.log(this.shopItemInfo)
						console.log(this.selectArr)
						this.selectshop = this.shopItemInfo[this.selectArr];
						console.log(this.selectshop, 'selectshop')
						if (this.selectshop.origin_price === null) {
							this.selectshop.origin_price = 0
						}
						this.selectNum = 1;
					}
				}
			},
			changeNum(val) {
				this.selectNum = parseInt(val);
			},
			getTemplate(key) {
				let self = this
				let postData = {
					key: key
				}
				self.$Phttp.post(Config.JAVA_SAAS_URLS.getTemplate, postData).then(res => {
					console.log(res.data)
					res = res.data
					if (res.code === 0) {
						self.specifications = res.data
						this.specifications.map(item => {
							this.selectArr.push('');
							this.subIndex.push(-1);
						});
						console.log(this.selectArr)
						console.log(this.subIndex)
						if (self.difference.length > 0) {
							console.log('这里');
							self.checkItem(); //计算sku里面规格形成路径
							self.checkInpath(-1); //传-1是为了不跳过循环
							self.chooseDefault();
						}
					}
				})
			},
			imageError(e) {
				e.pic = e.originalPic
				ImageCache.remove(e.picName)
			},
			handleCopyWxID(id) {
				uni.setClipboardData({
					data: id,
					success: function() {
						uni.showToast({
							title: '微信号复制成功',
							duration: 3000
						})
					}
				});
			},
			clickIndexAd(banner) {
				uni.navigateTo({
					url: '/pkChaoYueZu/index/cyzoneminute'
				})
			},
			
			
			
			
			
			
			
			//组件样式不生效
			_calcValue(type) {
				console.log('点击事件生效')
				if (this.disabled) {
					return;
				}
				const scale = this._getDecimalScale();
				let value = this.selectNum * scale;
				let step = this.step * scale;
				if (type === "minus") {
					console.log('1')
					if(this.selectNum == 1){
						return
					}
					value -= step;
					if (value < (this.min * scale)) {
						return;
					}
					if (value > (this.selectshop.stock * scale)) {
						value = this.selectshop.stock * scale
					}
				} else if (type === "plus") {
					console.log('2')
					if(this.selectNum == this.selectshop.stock){
						return
					}
					value += step;
					if (value > (this.selectshop.stock * scale)) {
						return;
					}
					if (value < (this.min * scale)) {
						value = this.min * scale
					}
				}
			
				this.selectNum = String(value / scale);
			},
			_getDecimalScale() {
				let scale = 1;
				// 浮点型
				if (~~this.step !== this.step) {
					scale = Math.pow(10, (this.step + "").split(".")[1].length);
				}
				return scale;
			},
			_onBlur(event) {
				// this.$emit('blur', event)
				let value = event.detail.value;
				if (!value) {
					// this.selectNum = 0;
					return;
				}
				value = +value;
				if (value > this.selectshop.stock) {
					value = this.selectshop.stock;
				} else if (value < this.min) {
					value = this.min;
				}
				this.selectNum = value;
			},
			_onFocus(event) {
				this.$emit('focus', event)
			}
		}
	};
</script>

<style lang="scss" scoped>
	page {
		background: #f8f8f8;
	}

	.wxpopup {
		position: fixed;
		z-index: 999;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, .6);
		display: flex;
		justify-content: center;
		align-items: center;

		.cust-ser-box {
			position: fixed;
			top: 300rpx;
			left: 50%;
			z-index: 102;
			margin-left: -325rpx;
			padding: 30rpx 50rpx;
			width: 650rpx;
			height: 440rpx;
			background-color: #fff;
			border-radius: 10rpx;
			box-sizing: border-box;

			.csb-card {
				height: 100rpx;
				line-height: 100rpx;
				border-bottom: 1px solid #eee;
				display: flex;
				align-items: center;
				font-size: 28rpx;
				color: #666;

				&:last-child {
					border-bottom: 0;
				}

				.cc-wechat-img {
					width: 60rpx;
					height: 60rpx;
					margin-right: 20rpx;
				}
			}
		}

		.btn-close-mask {
			position: fixed;
			top: 750rpx;
			left: 50%;
			z-index: 102;
			margin-left: -30rpx;
			width: 60rpx;
			height: 60rpx;

			.icon-closed {
				width: 60rpx;
				height: 60rpx;
			}
		}
	}

	.state_bar {
		width: 100%;
		height: var(--status-bar-height);
	}

	.scrollView {
		width: 100%;
		display: flex;
		flex-direction: column;
	}

	.screen-swiper {
		height: 668rpx;
	}

	.product-detail-logo:after {
		content: "";
		height: 2rpx;
		width: 61rpx;
		position: absolute;
		background: #bfbfbf;
		margin-top: 24rpx;
		margin-left: 46rpx;
	}

	.product-detail-logo:before {
		content: "";
		height: 2rpx;
		width: 61rpx;
		position: absolute;
		background: #bfbfbf;
		margin-top: 24rpx;
		margin-left: -106rpx;
	}

	._image {
		width: 100%;
		display: flex;
	}

	.col-title {
		width: 100%;
		height: 100rpx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.col-title .title {
		font-size: 28rpx;
		font-weight: bold;
		color: #333;
	}

	.col-title .title .point {
		font-size: 20rpx;
		color: #ddd;
		margin-left: 10rpx;
		margin-right: 10rpx;
	}

	.col-title .sub-title {
		font-size: 12rpx;
		font-weight: bold;
		color: #bbb;
		letter-spacing: 3rpx;
		margin-top: 10rpx;
	}

	.text-right {
		position: absolute;
		right: 30rpx;
		font-size: 30rpx;
		height: 60rpx;
		line-height: 60rpx;
	}

	.list-container {
		border-top: 20upx solid #F8F8F8;
		border-bottom: 20upx solid #F8F8F8;
		display: flex;
		flex-direction: column;
		background: #ffffff;
	}

	.list-row {
		border-bottom: solid 1rpx #f4f4f4;
		/*height: 100rpx;*/
		// line-height: 100rpx;
		display: flex;
		flex-direction: row;
		/*align-items: center;*/

		.row-left {
			margin-left: 30rpx;
			width: 80rpx;
			color: #222;
			font-size: 28rpx;
		}

		.row-center {
			// margin-left: 30rpx;
			width: 550rpx;
			color: #333;
			margin-left: 10rpx;
		}

		.row-right {
			position: absolute;
			right: 30rpx;
		}
	}

	.mask {
		position: fixed;
		top: 0;
		z-index: 100;
		width: 100%;
		height: 100vh;
		left: 0;
		background: black;
		overflow: hidden;
		opacity: 0.3;
	}

	.container {
		width: 100%;
		min-height: 700rpx;
		overflow: hidden;
		position: fixed;
		bottom: 0;
		left: 0;
		z-index: 10001;
		background: #fff;
		border-top-left-radius: 20rpx;
		border-top-right-radius: 20rpx;

		.head {
			width: 100%;
			height: 200rpx;
			display: flex;
			flex-direction: row;
			justify-content: flex-start;
			margin: 20rpx;
			border-bottom: 1rpx solid #f4f4f4;

			image {
				margin: 10rpx;
				height: 150rpx;
				width: 150rpx;
			}

			text {
				font-size: 50rpx;
				font-weight: bold;
				color: #f37b1d;
				margin-left: 50rpx;
			}
		}

		.content {
			margin: 16rpx 40rpx;
			display: flex;
			flex-direction: column;

			.content-row {
				margin: 30rpx 20rpx;

				.title {}

				.cards {
					display: flex;
					flex-direction: row;
					justify-content: flex-start;
					flex-wrap: wrap;

					.card {
						height: 50rpx;
						line-height: 50rpx;
						width: 180rpx;
						border: 1rpx solid #333;
						border-radius: 10rpx;
						background: #fff;
						color: #333;
						text-align: center;
						margin: 10rpx 20rpx;
					}

					.card-high-light {
						background: #f37b1d;
						color: #fff;
						border: none;
					}
				}
			}
		}

		.bottom-btn {
			height: 100rpx;
			width: 100%;
			line-height: 100rpx;
			background: var(--chaoyueGradualTheme);
			color: #fff;
			font-size: 28rpx;
			position: absolute;
			bottom: 0;
			text-align: center;
		}
	}

	.row-wrap {
		padding: 12rpx 30rpx;
		height: 50rpx;
		line-height: 50rpx;
	}

	.text-hd {
		padding: 0rpx 30rpx;
		font-size: 32rpx;
		color: #333;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		font-weight: 500;
	}

	.text-goods-price {
		font-size: 36rpx;
		height: 50rpx;
		line-height: 50rpx;
		color: #1677FF;
		font-weight: 600;
	}

	.text-origin-price {
		margin-left: 20rpx;
		font-size: 28rpx;
		font-weight: 400;
	}

	.text-official-price {
		padding-left: 30rpx;
		font-size: 24rpx;
	}

	.text-charge {
		flex: 1;
		text-align: end;
		font-size: 24rpx;
		margin-right: 20rpx;
	}

	.home-wrap {
		height: 100rpx;
		line-height: 100rpx;
		width: 100%;
		display: flex;
		flex-direction: column;

		.home-icon {
			height: 50rpx;
			width: 50rpx;
		}
	}

	.rent-wrap {
		background: #fff;
		align-items: flex-start;
		padding: 20rpx 0;
		font-size: 48rpx;
		color: #000;
		width: 100%;

		.rent-cycle-wrap {
			display: flex;
			flex-direction: column;
			width: 100%;
			justify-content: center;
			font-size: 32rpx;

			.rent-cycle-bar {
				width: 100%;
				height: 70rpx;
				line-height: 70rpx;
				display: flex;
				flex-direction: row;
				justify-content: center;

				.bar1 {
					width: 120rpx;
					background: #f4f4f4;
					text-align: center;
				}

				.bar2 {
					width: 400rpx;
					background: #fadbd9;
					text-align: center;
				}

				.bar3 {
					width: 120rpx;
					background: #f4f4f4;
					text-align: center;
				}
			}

			.rent-cycle-pointer {
				height: 16rpx;
				display: flex;
				flex-direction: row;

				.triangle-up-left {
					width: 0;
					height: 0;
					border-right: 12rpx solid transparent;
					border-left: 12rpx solid transparent;
					border-bottom: 12rpx solid #ef4136;
					margin-left: 166rpx;
				}

				.triangle-up-right {
					width: 0;
					height: 0;
					border-right: 12rpx solid transparent;
					border-left: 12rpx solid transparent;
					border-bottom: 12rpx solid #ef4136;
					margin-left: 372rpx;
				}
			}

			.rent-cycle-comment {
				display: flex;
				flex-direction: row;
				width: 100%;
				color: #ef4136;

				.text-block-1 {
					margin-left: 176rpx;
					flex: 1;
					display: flex;
					flex-direction: column;
					line-height: 1.3;
				}

				.text-block-2 {
					margin-right: 176rpx;
					text-align: end;
					display: flex;
					flex-direction: column;
					line-height: 1.3;
				}
			}
		}

		.rent-continue-wrap {
			margin: 20rpx 20rpx;
			background: #f4f4f4;
			border-radius: 8rpx;
			display: flex;
			flex-direction: column;

			.rent-continue-title {
				display: flex;
				flex-direction: column;
				margin: 10rpx 20rpx;
				line-height: 1.3;
			}

			.rent-continue-container {
				margin: 10rpx 20rpx;
				display: flex;
				flex-direction: row;
				justify-content: space-between;

				.rent-continue-block {
					width: 100rpx;
					height: 100rpx;
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;
					line-height: 1.5;

					.block-num {
						width: 30rpx;
						height: 30rpx;
						line-height: 30rpx;
						text-align: center;
						border: 1rpx solid #333;
						border-radius: 50%;
						font-size: 20rpx;
					}

					.block-text {
						font-size: 24rpx;
						font-weight: 400;
						// margin-top: 10rpx;
					}
				}
			}
		}
	}

	.connect-line {
		width: 40rpx;
		height: 1rpx;
		background: gray;
		margin-top: 28rpx;
	}

	/*  弹出层 */
	.popup {
		position: fixed;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		z-index: 999;
		overflow: hidden;

		&.show {
			display: block;

			.mask {
				animation: showPopup 0.2s linear both;
			}

			.layer {
				animation: showLayer 0.2s linear both;
			}
		}

		&.hide {
			.mask {
				animation: hidePopup 0.2s linear both;
			}

			.layer {
				animation: hideLayer 0.2s linear both;
			}
		}

		&.none {
			display: none;
		}

		.mask {
			position: fixed;
			top: 0;
			width: 100%;
			height: 100%;
			z-index: 1;
			background-color: rgba(0, 0, 0, 0.3);
		}

		.layer {
			display: flex;
			width: 100%;
			// height: 1014rpx;
			flex-direction: column;
			// min-height: 40vh;
			// max-height: 1014rpx;
			position: fixed;
			z-index: 99;
			bottom: 0;
			border-radius: 20upx 20upx 0 0;
			background-color: #fff;

			.specification-wrapper {
				width: 100%;
				box-sizing: border-box;

				.top-wrap {
					display: flex;
					flex-direction: row;
					margin-bottom: 20rpx;
					border-top-left-radius: 20upx;
					border-top-right-radius: 20upx;
					padding: 15upx;

					.top-block {
						display: flex;
						flex-direction: column;
						align-items: center;
						width: 100%;
					}
				}

				.specification-wrapper-content {
					width: 94%;
					margin-left: 3%;
					max-height: 900rpx;
					min-height: 600rpx;

					&::-webkit-scrollbar {
						/*隐藏滚轮*/
						display: none;
					}

					.specification-header {
						width: 100%;
						display: flex;
						flex-direction: row;
						position: relative;
						margin-bottom: 40rpx;

						.specification-left {
							width: 180rpx;
							height: 180rpx;
							flex: 0 0 180rpx;

							.product-img {
								width: 180rpx;
								height: 180rpx;
								background-color: #999999;
							}
						}

						.specification-right {
							flex: 1;
							padding: 0 35rpx 0 28rpx;
							box-sizing: border-box;
							display: flex;
							flex-direction: column;
							justify-content: flex-end;
							font-weight: 500;

							.price-content {
								color: #1677FF;
								margin-bottom: 10rpx;

								.sign {
									font-size: 28rpx;
								}

								.price {
									font-size: 36rpx;
								}
							}

							.inventory {
								font-size: 24rpx;
								color: #999999;
							}

							.choose {
								font-size: 26rpx;
								color: #333333;
							}
						}
					}

					.specification-content {
						font-weight: 500;

						.specification-item {
							margin-bottom: 40rpx;

							&:last-child {
								margin-bottom: 0;
							}

							.item-title {
								margin-bottom: 20rpx;
								font-size: 28rpx;
								font-weight: bold;
							}

							.item-wrapper {
								display: flex;
								flex-direction: row;
								flex-flow: wrap;
							}
						}
					}
				}

				.close {
					position: absolute;
					top: 150rpx;
					right: 25rpx;
					width: 50rpx;
					height: 50rpx;
					text-align: center;
					line-height: 50rpx;

					.close-item {
						width: 50rpx;
						height: 50rpx;
					}
				}
			}

			.item-content {
				display: inline-block;
				padding: 4rpx 20rpx;
				border-radius: 12rpx;
				color: #666666;
				background: #F0F0F0;
				font-size: 28rpx;
				margin-right: 20rpx;
				box-sizing: border-box;
				border: 2upx solid #FFF;
				margin-bottom: 10upx;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;

				&.actived {
					background: rgba(22, 119, 255, 0.1);
					border: 2upx solid #1677ff;
					color: #1677ff;
				}

				&.noactived {
					color: #CCCCCC;
					background: #F8F8F8;
				}
			}

			.btn-wrapper {
				display: flex;
				width: 100%;
				height: 120rpx;
				flex: 0 0 120rpx;
				align-items: center;
				justify-content: space-between;
				padding: 0 26rpx;
				box-sizing: border-box;

				.layer-btn {
					width: 335rpx;
					height: 76rpx;
					border-radius: 38rpx;
					color: #fff;
					line-height: 76rpx;
					text-align: center;
					font-weight: 500;
					font-size: 28rpx;

					&.add-cart {
						background: #ffbe46;
					}

					&.buy {
						background: #fe3a3a;
					}
				}

				.sure {
					width: 650rpx;
					height: 80rpx;
					border-radius: 40rpx;
					color: #fff;
					line-height: 80rpx;
					text-align: center;
					font-weight: 500;
					font-size: 30rpx;
					background: linear-gradient(180deg, rgba(82, 171, 252, 1) 0%, rgba(6, 135, 255, 1) 100%);
				}
			}
		}

		@keyframes showPopup {
			0% {
				opacity: 0;
			}

			100% {
				opacity: 1;
			}
		}

		@keyframes hidePopup {
			0% {
				opacity: 1;
			}

			100% {
				opacity: 0;
			}
		}

		@keyframes showLayer {
			0% {
				transform: translateY(120%);
			}

			100% {
				transform: translateY(0%);
			}
		}

		@keyframes hideLayer {
			0% {
				transform: translateY(0);
			}

			100% {
				transform: translateY(120%);
			}
		}
	}

	.bottom-block {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 130rpx;
		margin-top: 6rpx;

		.block-icon {
			width: 50rpx;
			height: 50rpx;
		}

		.block-text {
			font-size: 20rpx;
		}
	}

	.bottom-btn {
		width: 300rpx;
		height: 86rpx;
		line-height: 86rpx;
		background: linear-gradient(90deg, rgba(82, 171, 252, 1) 0%, rgba(6, 135, 255, 1) 100%);
		border-radius: 43rpx;
		color: #fff;
		text-align: center;
		font-size: 34rpx;
		margin-left: 30rpx;
		margin-top: 10rpx;
	}

	uni-radio::before {
		top: 40%;
	}
	
	
	
	
	
	$box-height: 35px;
	/* #ifdef APP-NVUE */
	$box-line-height: 35px;
	/* #endif */
	$box-line-height: 26px;
	$box-width: 35px;
	
	.uni-numbox {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		display: flex;
		flex-direction: row;
		height: $box-height;
		line-height: $box-height;
		width: 120px;
	}
	
	.uni-cursor-point {
		/* #ifdef H5 */
		cursor: pointer;
		/* #endif */
	}
	
	.uni-numbox__value {
		background-color: $uni-bg-color;
		width: 40px;
		height: $box-height;
		text-align: center;
		font-size: $uni-font-size-lg;
		border-width: 1rpx;
		border-style: solid;
		border-color: $uni-border-color;
		border-left-width: 0;
		border-right-width: 0;
	}
	
	.uni-numbox__minus {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		width: $box-width;
		height: $box-height;
		// line-height: $box-line-height;
		// text-align: center;
		font-size: 20px;
		color: $uni-text-color;
		background-color: $uni-bg-color-grey;
		border-width: 1rpx;
		border-style: solid;
		border-color: $uni-border-color;
		border-top-left-radius: $uni-border-radius-base;
		border-bottom-left-radius: $uni-border-radius-base;
		border-right-width: 0;
	}
	
	.uni-numbox__plus {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		width: $box-width;
		height: $box-height;
		border-width: 1rpx;
		border-style: solid;
		border-color: $uni-border-color;
		border-top-right-radius: $uni-border-radius-base;
		border-bottom-right-radius: $uni-border-radius-base;
		background-color: $uni-bg-color-grey;
		border-left-width: 0;
	}
	
	.uni-numbox--text {
		font-size: 20px;
		color: $uni-text-color;
	}
	
	.uni-numbox--disabled {
		color: $uni-text-color-disable;
		/* #ifdef H5 */
		cursor: not-allowed;
		/* #endif */
	}
</style>
