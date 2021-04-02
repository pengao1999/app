<template>
	<view v-if="propData.show">
		<view class="mask" @tap="close"></view>
		<view class="select-window">
		  <image class='close' @tap='close' src='../../static/ic_close.png'></image>
		  <image class='image' :lazy-load="true" :src='propData.image_root+propData.pic'></image>
		  <text class='title'>{{propData.name}}</text>
		  <view class='price-box'>
			<text class='price'>￥{{integerPrice}}</text>
			<text class='sub-price'>.</text>
			<text class='sub-price'>{{decimalPrice}}</text>
			<text class='cost-price'>￥{{propData.original_price}}</text>
			<text class='stock'>剩余 {{propData.stock}}</text>
		  </view>
		  <text class='select-text' v-if="propData.chooseSpec!=null">已选择：{{propData.chooseSpec}}</text>
		  <text class='select-text' v-else-if="propData.attrgroups.length>0">未选择</text>
		  <view style='width:100%;height:20upx;float:left;'></view>
		  <block v-for="(item, index) in propData.attrgroups" :key="index">
			<view class='column'>
			  <text class='name'>{{item.name}}</text>
			  <view class='content'>
				<block v-for="(attr, idx) in item.attrs" :key="idx">
				  <text class="spec" :class='{"select":attr.status}' @tap="spTap(index, idx)">{{attr.name}}</text>
				</block>
			  </view>
			</view>
		  </block>
		  <view class='column'>
			<text class='name'>数量</text>
			<view class='content'>
			  <image class='reduce' @tap.stop='reduce' src='../../static/ic_reduce.png'></image>
			  <text class='num'>{{propData.num}}</text>
			  <image class='add' @tap.stop='add' src='../../static/ic_add.png'></image>
			</view>
		  </view>
		  <button class='submit cu-btn' @tap.stop='submit' :style='stock<1?"background:#ccc":""'>确 定</button>
		</view>
	</view>
</template>

<script>
	import Util from '../../common/js/util.js'
	export default {
		data() {
			return {
				myData: {},
				integerPrice: '0',
				decimalPrice: '0',
			}
		},
		props: {
			propData: {
				type: Object,
				default() {
					return {}
				}
			}
		},
		watch:{
			propData: {
				handler() {
					let self = this
					if ( !Util.isEmptyObject(self.propData) && self.propData.show ) {
						var price = self.propData.price.toFixed(2)
						var priceArr = price.split('.')
						self.integerPrice = priceArr[0]
						var decimalPrice = '00'
						if (priceArr[1]) {
						  self.decimalPrice = priceArr[1]
						}
						self.myData = Object.assign({}, self.propData)
					}
				},
				immediate: true
			}
		},
		methods: {
			close: function() {
				this.$emit('close', '')
			},
			reduce: function() {
				this.$emit('reduce', '')
			},
			add: function() {
				this.$emit('add', '')
			},
			submit: function() {
				this.$emit('submit', '')
			},
			spTap: function(groups_idx, attrs_idx) {
				let data = {
					groups_idx: groups_idx,
					attrs_idx: attrs_idx
				}
				this.$emit('selectAttrItem', data)
			}
		}
	}
</script>

<style>
	@import url("../../common/css/animation.css");
	.mask {
	  width: 100%;
	  height: 100%;
	  position: fixed;
	  top: 0;
	  left: 0;
	  background: #000;
	  opacity: 0.2;
	  overflow: hidden;
	  z-index: 98;
	  color: #fff;
	}

	.select-window {
	  width: 100%;
	  overflow: hidden;
	  position: fixed;
	  bottom: 0;
	  left: 0;
	  z-index: 10001;
	  background: #fff;
	  border-top-left-radius: 20rpx;
	  border-top-right-radius: 20rpx;
	}

	.select-window .close {
	  width: 30rpx;
	  height: 30rpx;
	  position: absolute;
	  top: 40rpx;
	  right: 30rpx;
	}

	.select-window .image {
	  width: 160rpx;
	  height: 160rpx;
	  margin-left: 40rpx;
	  margin-top: 40rpx;
	  border-radius: 20rpx;
	  float: left;
	}

	.select-window .title {
	  width: calc(100% - 290rpx);
	  font-size: 28rpx;
	  color: #333;
	  float: left;
	  padding-right: 40rpx;
	  margin-top: 40rpx;
	  margin-left: 30rpx;
	  overflow: hidden;
	  text-overflow: ellipsis;
	  white-space: nowrap;
	  font-weight: bold;
	}

	.select-window .price-box {
	  width: calc(100% - 290rpx);
	  margin-top: 120rpx;
	  margin-left: 30rpx;
	  display: flex;
	  align-items: flex-end;
	}

	.select-window .price {
	  font-size: 36rpx;
	  color: #e84118;
	  font-weight: bold;
	  margin-left: 30rpx;
	  margin-bottom: -5rpx;
	  float: left;
	}

	.select-window .sub-price {
	  font-size: 18rpx;
	  color: #e84118;
	  font-weight: bold;
	  float: left;
	}

	.select-window .cost-price {
	  font-size: 18rpx;
	  color: #888;
	  text-decoration: line-through;
	  margin-left: 20rpx;
	  float: left;
	  font-weight: 500;
	}

	.select-window .stock {
	  font-size: 20rpx;
	  color: #888;
	  margin-left: 20rpx;
	  float: left;
	  font-weight: 500;
	}

	.select-window .select-text {
	  width: calc(100% - 300rpx);
	  font-size: 22rpx;
	  color: #333;
	  margin-left: 20rpx;
	  float: left;
	  font-weight: 500;
	}

	.select-window .column {
	  width: calc(100% - 80rpx);
	  padding-top: 10rpx;
	  padding-bottom: 10rpx;
	  margin-left: 40rpx;
	  margin-right: 40rpx;
	  display: inline-flex;
	}

	.select-window .column .name {
	  width: 80rpx;
	  height: 40rpx;
	  line-height: 40rpx;
	  font-size: 20rpx;
	  color: #333;
	  font-weight: 500;
	}

	.select-window .column .content {
	  width: calc(100% - 80rpx);
	  display: flex;
	  flex-wrap: wrap;
	}

	.select-window .column .content .spec {
	  height: 40rpx;
	  line-height: 40rpx;
	  border: solid 1rpx #ccc;
	  padding-left: 25rpx;
	  padding-right: 25rpx;
	  font-size: 20rpx;
	  color: #ccc;
	  border-radius: 30rpx;
	  margin: 5rpx 10rpx 5rpx 10rpx;
	}

	.select-window .column .content .select {
	  border: solid 1rpx #1dc422;
	  color: #1dc422;
	}

	.select-window .column .content .reduce, .select-window .column .content .add {
	  width: 60rpx;
	  height: 60rpx;
	  float: left;
	}

	.select-window .column .content .num {
	  width: 60rpx;
	  height: 60rpx;
	  text-align: center;
	  line-height: 60rpx;
	  font-size: 30rpx;
	  color: #333;
	  font-weight: 500;
	  float: left;
	}

	.select-window .submit {
	  width: 100%;
	  height: 88rpx;
	  line-height: 88rpx;
	  background: #e84118;
	  text-align: center;
	  font-size: 28rpx;
	  color: #fff;
	  margin-top: 30rpx;
	  font-weight: bold;
	}

</style>
