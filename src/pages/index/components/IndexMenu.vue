<template>
  <div>
    <my-menu
      :propData="menuData"
      :style="{
        background: menuFormat.background,
        color: menuFormat.color,
        marginTop: menuFormat.marginTop,
        marginBottom: menuFormat.marginBottom,
        marginLeft: menuFormat.marginLeftRight,
        marginRight: menuFormat.marginLeftRight
      }"
      @clickNavList="clickNavList"
    ></my-menu>
    <new-comers-card
      v-if="isNewcomers"
      :propData="group"
      :pickData="pickData"
      :activity_key="activity_key"
      :activity_endtime="activity_endtime"
      :userdata="userInfo"
      @setNewPageTag="setNewPageTag"
      :cardI="globalI"
    ></new-comers-card>
  </div>
</template>

<script>
import MyMenu from '@/components/yx_view/myMenu.vue'
import NewComersCard from '@/components/yx_view/newcomersCard.vue'

export default {
  name: 'IndexMenu',
  components: {
    MyMenu,
    NewComersCard
  },
  methods: {
    clickNavList(index) {
      this.$emit('clickNavList', index)
    },
    setNewPageTag() {
      this.$emit('setNewPageTag')
    }
  },
  props: {
    menuData: {
      type: Array,
      default() {
        return []
      }
    },
    menuFormat: {
      type: Object,
      default() {
        return {}
      }
    },
    isNewcomers: {
      type: Number,
      default: 0
    },
    group: {
      type: Object,
      default() {
        return {}
      }
    },
    pickData: {
      type: Object,
      default() {
        return {}
      }
    },
    activity_key: {
      type: String,
      default: '-'
    },
    activity_endtime: {
      type: String,
      default: '-'
    },
    userInfo: {
      type: Object,
      default() {
        return {}
      }
    },
    globalI: {
      type: Number,
      default: 0
    }
  }
}
</script>

<style lang="scss" scoped>
</style>