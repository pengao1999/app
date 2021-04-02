<template>
    <view class="uni-icon" :class="['uni-icon-'+type]" :style="{color:color,'font-size':fontSize}" @tap.stop="onClick()"></view>
</template>

<script>
    export default {
        props: {
            /**
             * 图标类型
             */
            type: {
				type: String,
				default: ''
			},
            /**
             * 图标颜色
             */
            color: {
				type: String,
				default: ''
			},
            /**
             * 图标大小
             */
            size: {
				type: [Number, String],
				default: 0
			}
        },
        computed: {
            fontSize() {
                return `${this.size}px`
            }
        },
        methods: {
            onClick() {
				console.log('lhjkalhsdkl')
                this.$emit('click')
            }
        }
    }
</script>

