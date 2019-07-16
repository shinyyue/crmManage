<template>
    <layout id="column_list">1111</layout>
</template>

<script>
export default {
    data() {
        return {
            list: []
        }
    },

    methods: {
        getList() {
            const data = {
                page: 1,
                rows: 20
            }
            this.$store.dispatch('getColumnList', data).then(res => {
                if (res.code === 401) {
                    this.$store.dispatch('manuallyLoginOut')
                    this.$router.push({
                        path: '/login',
                        query: {
                            redirect: this.$route.path
                        }
                    })
                }
            })
        }
    },
    mounted() {
        this.getList()
    }
}
</script>

<style lang="less">
</style>
