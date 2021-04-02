<template>
  <view class="container">
    <view class="row-top" v-if="list.length===0">暂无收藏商品</view>
    <view class="row-top" v-if="list.length>0">共收藏{{list.length}}件商品</view>
    <view v-for="(item, index) in list" :key="index">
      <view class="row-wrap">
        <image :src="item.img" class="row-img" />
        <view class="row-content">
          <view class="content-title">{{item.name}}</view>
          <view class="content-action">
            <image class="del-img" src="/static/ic_delete.png" @click="handleDelete(item.goodKey)" />
            <view class="btn" @click="handleContinue(item.goodKey)">继续订单</view>
          </view>
        </view>
      </view>
    </view>

    <myDialog
	confirmColor="var(--blue)"
      title="删除"
      content="确定删除该收藏商品吗"
      :dialog-show="showDialog"
      @cancelButton="showDialog=false"
      @confirmButton="clickConfirm"
    ></myDialog>
  </view>
</template>
<script>
import Config from '../../../common/js/Config.js'
export default {
  name: 'MyLike',
  data() {
    return {
      list: [],
      map: {},
      showDialog: false,
      deletedKey: '',
    }
  },
  onLoad() {
    this.getCollections()
  },
  computed: {
    userInfo() {
      return this.$store.state.userInfo
    },
  },
  methods: {
    getCollections() {
      let self = this
      uni.showLoading({
        title: '加载中...'
      })
      const data = {
        appKey: 123,  // hard code app key here
        collectType: 'GOODS',
        userKey: self.userInfo.user_key
      }
      self.$Phttp.get(Config.JAVA_SAAS_URLS.getCollection, data).then(res => {
        res = res.data
        if (res.code === 0) {
          let goodKeys = []
          let keyMapper = {}
          res.data.forEach(element => {
            goodKeys.push(element.target_key)
            keyMapper[element.target_key] = element.collect_key
          });
          self.getGoodsDetail(goodKeys)
          self.map = keyMapper
        }
      })
    },
    getGoodsDetail(goodKeys) {
      let self = this
      console.log('keys', goodKeys)
      let goods = goodKeys.map(key => {
        return new Promise((resolve, reject) => {
          self.$Phttp.post(Config.JAVA_SAAS_URLS.getGoods, { goods_key: key }).then(res => {
            res = res.data
            if (res.code === 0) {
              resolve(res)
            } else {
              reject(res)
            }
          })
        })
      })
      Promise.all(goods).then(result => {
        console.log('result', result)
        self.list = result.map(item => {
          return {
            name: item.data.name,
            img: item.other.img_root + item.data.pic,
            goodKey: item.data.goods_key
          }
        })
        console.log('list', self.list)
      }).catch(err => {
        console.log('err', err)
        uni.showToast({
          title: '获取失败，稍后重新'
        })
      })
      uni.hideLoading()
    },
    handleDelete(key) {
      let self = this
      const data = {
        collectKey: self.map[key]
      }
      self.deletedKey = self.map[key]
      self.showDialog = true

    },
    clickConfirm() {
      console.log('confirm')
      let self = this
      const data = {
        collectKey: self.deletedKey
      }
      self.$Phttp.get(Config.JAVA_SAAS_URLS.deleteCollection, data).then(res => {
        res = res.data
        if (res.code === 0) {
          self.getCollections()
        } else {
          uni.showToast({
            title: '删除失败，请稍后重试～',
            duration: 2000,
            icon: "none"
          })
        }
      })
    },
    handleContinue(key) {
      uni.navigateTo({
        url: '/pkChaoYueZu/index/detail?key=' + key
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.container {
  background: #f4f4f4;
  height: 100%;
  display: flex;
  flex-direction: column;
  .row-top {
    height: 60rpx;
    line-height: 60rpx;
    margin-left: 20rpx;
    font-size: 28rpx;
    color: #666;
  }
  .row-wrap {
    display: flex;
    flex-direction: row;
    background: #fff;
    width: 750rpx;
    border-bottom: 1rpx solid #f4f4f4;
    .row-img {
      width: 160rpx;
      height: 160rpx;
      margin: 30rpx;
      border: 1rpx solid #f4f4f4;
    }
    .row-content {
      display: flex;
      flex-direction: column;
      margin: 30rpx 0;
      flex: 1;
      .content-title {
        height: 96rpx;
        font-size: 28rpx;
        color: #222;
        margin-right: 20rpx;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }
      .content-action {
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        margin-right: 20rpx;
        margin-top: 10rpx;
        align-items: center;
        .del-img {
          width: 45rpx;
          height: 45rpx;
          margin-right: 30rpx;
        }
        .btn {
          width: 150rpx;
          height: 56rpx;
          line-height: 56rpx;
          background:linear-gradient(90deg,rgba(82,171,252,1) 0%,rgba(6,135,255,1) 100%);
          border-radius: 24rpx;
          color: #fff;
          font-size: 28rpx;
          text-align: center;
        }
      }
    }
  }
}
</style>
