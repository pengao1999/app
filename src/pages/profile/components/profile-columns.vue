<template>
  <view class="columns" :style="{background: customStyle.background, color: customStyle.color, borderRadius: customStyle.borderRadius, marginLeft: customStyle.marginLeft, marginRight: customStyle.marginRight, marginTop: customStyle.marginTop, marginBottom: customStyle.marginBottom}">
    <!-- <view class="column" v-if="customItem.leader" @tap.stop="toApply(userInfo.is_leader)">
      <view class="left">
        <image :src="customItem.leader.image" :lazy-load="true" />
        <text>{{customItem.leader.title ? customItem.leader.title : (userInfo.is_leader ? "提货点后台" : "提货点招募")}}</text>
      </view>
      <image class="arrow" src="/static/ic_arrow_right.png" :lazy-load="true" />
    </view>
    <view class="column" v-if="customItem.supplier" @tap.stop="recruitSupplier">
      <view class="left">
        <image :src="customItem.supplier.image" :lazy-load="true" />
        <text>{{customItem.supplier.title ? customItem.supplier.title : (userInfo.has_store ? "供应商后台" : "供应商招募")}}</text>
      </view>
      <image class="arrow" src="/static/ic_arrow_right.png" :lazy-load="true" />
    </view>
    <view class="column" v-if="customItem.postsale" @tap.stop="toPostsale">
      <view class="left">
        <image :src="customItem.postsale.image" :lazy-load="true" />
        <text>{{customItem.postsale.title ? customItem.postsale.title : '申请售后'}}</text>
      </view>
      <image class="arrow" src="/static/ic_arrow_right.png" :lazy-load="true" />
    </view>

    <view class="column" v-if="customItem.protocol" @tap.stop="toProtocol">
      <view class="left">
        <image :src="customItem.protocol.image" :lazy-load="true" />
        <text>{{customItem.protocol.title ? customItem.protocol.title : '用户协议与政策'}}</text>
      </view>
      <image class="arrow" src="/static/ic_arrow_right.png" :lazy-load="true" />
    </view> -->
    <view v-for="(item, index) in customItem" :key="index">
      <view class="column" v-if="item.type==='group-manager'" @tap.stop="toApply(userInfo.is_leader)">
        <view class="left">
          <image :src="item.icon" :lazy-load="true" />
          <text>{{item.name ? item.name : (userInfo.is_leader ? "提货点后台" : "提货点招募")}}</text>
        </view>
        <image class="arrow" src="/static/ic_arrow_right.png" :lazy-load="true" />
      </view>
      <view class="column" v-if="item.type==='supplier-manager'" @tap.stop="recruitSupplier">
        <view class="left">
          <image :src="item.icon" :lazy-load="true" />
          <text>{{item.name ? item.name : (userInfo.has_store ? "供应商后台" : "供应商招募")}}</text>
        </view>
        <image class="arrow" src="/static/ic_arrow_right.png" :lazy-load="true" />
      </view>
      <view class="column" v-if="item.type==='postsale'" @tap.stop="toPostsale">
        <view class="left">
          <image :src="item.icon" :lazy-load="true" />
          <text>{{item.name ? item.name : '申请售后'}}</text>
        </view>
        <image class="arrow" src="/static/ic_arrow_right.png" :lazy-load="true" />
      </view>

      <view class="column" v-if="item.type==='leader'" @tap.stop="toLeader">
        <view class="left">
          <image :src="item.icon" :lazy-load="true" />
          <text>{{item.name ? item.name : '绑定业务员'}}</text>
        </view>
        <image class="arrow" src="/static/ic_arrow_right.png" :lazy-load="true" />
      </view>

      <view class="column" v-if="item.type==='protocol'" @tap.stop="toProtocol">
        <view class="left">
          <image :src="item.icon" :lazy-load="true" />
          <text>{{item.name ? item.name : '用户协议与政策'}}</text>
        </view>
        <image class="arrow" src="/static/ic_arrow_right.png" :lazy-load="true" />
      </view>

      <view class="column" v-if="item.type==='logout'&&isRegister" @tap.stop="logout">
        <view class="left">
          <image :src="item.icon" :lazy-load="true" />
          <text>{{item.name ? item.name : '退出登录'}}</text>
        </view>
        <image class="arrow" src="/static/ic_arrow_right.png" :lazy-load="true" />
      </view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    userInfo: {
      type: Object,
      default() {
        return {};
      }
    },
    customStyle: {
      type: Object,
      default(){
        return {}
      }
    },
    customItem: {
      type: Array,
      default() {
        return [];
      }
    },
    isRegister: {
      type:Boolean,
      default() {
        return false;
      }
    }
  },
  methods: {
    toApply(is_leader) {
      this.$emit("toApply", is_leader);
    },
    recruitSupplier() {
      this.$emit("recruitSupplier");
    },
    toPostsale() {
      this.$emit("toPostsale");
    },
    toProtocol() {
      this.$emit("toProtocol");
    },
    toLeader() {
      this.$emit("toLeader");
    },
    logout() {
      this.$emit("logout");
    }
  }
};
</script>

<style lang="scss">
.columns {
  // margin-left: 30rpx;
  // margin-top: 40rpx;
  width: calc(100% - 60rpx);
  display: flex;
  flex-direction: column;

  button {
    /* position:unset; */
    display: unset;
    padding-left: unset;
    padding-right: unset;
    box-sizing: unset;
    font-size: unset;
    text-align: center;
    text-decoration: unset;
    line-height: unset;
    border-radius: unset;
    -webkit-tap-highlight-color: unset;
    overflow: unset;
    color: unset;
    background-color: unset;
  }

  .column {
    width: 100%;
    height: 80rpx;
    line-height: 80rpx;
    display: inline-flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: solid 1rpx #f4f4f4;

    .left {
      display: flex;
      align-items: center;

      image {
        width: 44rpx;
        height: 44rpx;
      }

      text {
        font-size: 28rpx;
        color: #333;
        font-weight: 500;
        margin-left: 20rpx;
      }
    }

    .arrow {
      width: 22rpx;
      height: 22rpx;
    }
  }
}
</style>
