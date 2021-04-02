<template>
  <view>
    <view class="cu-bar bg-orange search">
      <view @click="backHome" style="padding-left: 20upx;height: 80upx;line-height: 80upx;">返回</view>
      <view
        class="search-form round"
        style="height: 80upx;display: flex;justify-content: center;align-items: center;"
      >
        <text class="icon-search" style="font-size: 32upx;"></text>
        <input
          :placeholder="searchKey"
          v-model="keyword"
          style="font-size: 30upx;"
          confirm-type="search"
          @confirm="search(true)"
        />
      </view>
    </view>
    <!-- <view style="height: 100upx;"></view> -->
    <scroll-view
      scroll-y="true"
      style="width: 100%; display: flex; flex-direction: column; "
      :style="'height:'+(windowHeight-50)+'px;'"
      upper-threshold="50"
      @scrolltolower="loadMore()"
    >
      <view
        class="good-container row-container"
        v-for="(good, index) in lists"
        @click="toDetail(good.id)"
        v-bind:key="index"
      >
        <image class="good-logo" :src="image_root+good.pic" />
        <view class="coloum-container justify-center" style="margin-left: 20upx;max-width: 490upx;">
          <view class="good-title two-line-dot">{{good.name}}</view>
          <view class="row-container align-center">
            <view class="text-red" style="font-size: 36upx;">¥{{good.price}}</view>
            <view class="text-gray" style="font-size: 32upx;margin-left: 20upx;">
              原价¥
              <text style="text-decoration: line-through;">{{good.original_price}}</text>
            </view>
          </view>
        </view>
      </view>
      <uni-load-more :loadingType="loadingType" :contentText="contentText" v-if="currentPage>1"></uni-load-more>
    </scroll-view>
  </view>
</template>

<script>
import Config from '@/common/js/Config.js'
import Toast from '@/common/js/toast.js'
import Util from '@/common/js/util.js'
import UniLoadMore from '@/components/uni-load-more.vue'
export default {
  data() {
    return {
      lists: [],
      image_root: '',
      keyword: '',
      currentPage: 1,
      windowHeight: 600,
      systemInfo: {},
      loadingType: 1,
      contentText: {
        contentdown: "上拉显示更多",
        contentrefresh: "正在加载...",
        contentnomore: "没有更多数据了"
      },
      searchKey: ''
    }
  },
  watch: {
    systemInfo: {
      handler() {
        if (!Util.isEmptyObject(this.systemInfo)) {
          this.windowHeight = this.systemInfo.windowHeight
          console.log("windowHeight:" + this.windowHeight)
        }
      }
    }
  },
  mixins: [Toast],
  components: {
    UniLoadMore
  },
  onLoad(options) {
    let self = this
    uni.setNavigationBarTitle({
      title: '搜索'
    })
    uni.getSystemInfo({
      success(system) {
        console.log(JSON.stringify(system))
        if (system.errMsg === "getSystemInfo:ok") {
          self.systemInfo = system
        }
      }
    })
    self.searchKey = options.key
    // self.getSetting()
  },
  methods: {
    search: function (isForce = false) {
      let self = this
      if (self.loadingType === 2) return
      if (isForce) {
        this.currentPage = 1;
        this.lists = []
      }
      let postData = {
        key: self.keyword,
        page: self.currentPage,
        limit: Config.PAGE_LIMIT
      }
      self.$Phttp.post(Config.JAVA_SAAS_URLS.searchPointGoods, postData).then(res => {
        res = res.data
        if (res.data.length < Config.PAGE_LIMIT) {
          self.loadingType = 2
        } else {
          self.loadingType = 0
        }
        if (res.code === 0) {
          self.lists = self.lists.concat(res.data)
          self.image_root = res.other.img_root
        }
      })
    },
    getSetting: function () {
      let self = this
      self.$Phttp.post(Config.JAVA_SAAS_URLS.getSetting, {}).then(res => {
        res = res.data
        if (res.code === 0) {
          let keys = res.data.credit_search_holder
          if (keys === '') {
            self.searchKey = "请输入搜索内容"
            return
          }
          keys = keys.split(',')
          var n = Math.floor(Math.random() * keys.length + 1) - 1;
          self.searchKey = '大家都在搜"' + keys[n] + '"'
        }
      })
    },
    toDetail: function (id) {
      uni.navigateTo({
        url: '/pkPointMall/index/detail?id=' + id
      })
    },
    loadMore() {
      console.log("loadMore")
      this.currentPage++
      this.search()
    },
    backHome() {
      uni.navigateBack()
    }
  },
  onReachBottom() {
    console.log('onReachBottom')
    this.search(false)
  }
}
</script>

<style lang="scss" scoped>
.good-container {
  padding: 20upx 0;
  width: 690upx;
  margin-left: 30upx;
  border-bottom: 1upx solid #f8f8f8;

  .good-logo {
    width: 180upx;
    height: 180upx;
    background: #f8f8f8;
  }

  .good-title {
    font-size: 32upx;
    color: #333;
  }
}
</style>
