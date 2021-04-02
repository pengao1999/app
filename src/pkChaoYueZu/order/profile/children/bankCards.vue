<template>
  <div class="main-page bg-white coloum-container">
    <div style="margin-left: 30upx;margin-top: 30upx;">
      <span style="font-size: 34upx;color: #000;">我的卡</span>
      <span style="font-size: 28upx;color: #999;margin-left: 15upx;">共{{cards.length}}张</span>
    </div>

    <div style="width: 100%;text-align: center;margin-top: 280upx;" v-if="cards.length==0">暂无卡片</div>
    <div class="Card-40 info-card" v-for="card in cards" style="margin-left: 40upx;margin-top: 55upx;">
      <img class="info-card lf" src="/static/zulin/profile/jingjiren/bank-card.png" />
      <div class="fix-top info-card Card-40">
        <div class="row-container line-140 align-center">
          <div class="coloum-container text-white" style="margin-left: 20upx;">
            <div style="font-size: 36upx;">{{card.bank_card_name}}</div>
            <div style="font-style: 26upx;">储蓄卡</div>
          </div>
          <div class="text-white" style="margin-left: auto;font-style: 40upx;">{{card.hideNumber}}</div>
        </div>
      </div>
    </div>
    <button
      class="cu-btn bg-gradual-orange btn fixed-bttom safe-area round"
      @click="addBankCard"
    >添加银行卡</button>
  </div>
</template>

<script>
  import Config from '../../../common/js/Config'
  import Toast from '../../../common/js/toast'
  export default {
    name: "bankCards",
    mixins: [Toast],
    data() {
      return {
        cards: []
      }
    },
    onShow() {
      this.getBankCardsList()
    },
    computed: {
      userInfo() {
        return this.$store.state.userInfo
      }
    },
    methods: {
      getBankCardsList() {
        let self = this

        let postData = {
          appKey: '123',
          userKey: self.userInfo.user_key
        }
        self.toast({
          type: 'loading'
        })
        self.$Phttp.get(Config.JAVA_SAAS_URLS.getBankCardList, postData).then(res => {
          res = res.data
          self.toast(true)
          if (res.code === 0) {
            res.data.forEach((card, index)=>{
              card.hideNumber = self.changeStr(card.bank_bind_phone, 0, "*******")
            })
            self.cards = res.data
          }
        })
      },
      addBankCard() {
          console.log('add')
        uni.navigateTo({
          url: '/pkChaoYueZu/profile/children/addBankCard'
        })
      },
      changeStr(str,index,changeStr){
        return str.substr(0, index) + changeStr+ str.substr(index + changeStr.length);
      }
    }
  }
</script>

<style scoped>
page {
  background: white;
}
.Card-40 {
  border-radius: 40upx;
}
.info-card {
  width: 670upx;
  height: 272upx;
}
.fix-top {
  position: absolute;
  margin-top: -282upx;
  margin-left: 0upx;
}
.line-140 {
  height: 140upx;
  width: 96%;
}
.avatar {
  width: 100upx;
  height: 100upx;
  background: white;
  -webkit-border-radius: 100upx;
  -moz-border-radius: 100upx;
  border-radius: 100upx;
}
.btn {
  width: 690upx;
  height: 80upx;
  margin-left: 30upx;
  bottom: 30upx;
}
</style>
