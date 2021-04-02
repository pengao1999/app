<template>
	<scroll-view :scroll-y="true" :scroll-x="false" :style="myData.pageStyle">
		<slot name="content"></slot>
	</scroll-view>
</template>

<script>
	export default {
		data() {
			return {
				myData: {
					pageStyle: '',
				}
			}
		},
		props: {
			propData: Object
		},
		watch: {
			propData: {
				handler() {
					let data = {}
					data = Object.assign({}, data, this.myData, this.propData)
                    this.myData = data
				},
				immediate: true
			}
		},
		onShow() {
		}
	}
</script>

<style>
</style>
