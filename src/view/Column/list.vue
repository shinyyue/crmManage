<template>
    <layout id="column_list">
        <tableList @handleSizeChange="handleSizeChange"
                   @handleCurrentChange="handleCurrentChange"
                   @operateImg="jumpToDetails"
                   @operateClick="operateClick"
                   :loading="loading"
                   :tableData="list"
                   :totalNum="totalNum"
                   :colNameMap="colNameMap"
                   :currentPage="currentPage"
                   :pageSizes="[20]"
                   :pageSize="currentPageSize"
                   ref="allPatientTable">
        </tableList>
    </layout>
</template>

<script>
export default {
    data() {
        return {
            list: [],
            loading: false,
            totalNum: 0,
            currentPageSize: 20,
            currentPage: 1,
            colNameMap: [
                {
                    displayName: '栏目ID',
                    key: 'id',
                    width: '80px',
                    align: 'center'
                },
                {
                    displayName: '栏目名称',
                    key: 'columnName',
                    align: 'center'
                },
                {
                    displayName: '所属学院',
                    key: 'collegeId',
                    align: 'center'
                },
                {
                    displayName: '更新时间',
                    key: 'updateTime',
                    align: 'center'
                },
                {
                    displayName: '操作',
                    align: 'center',
                    fixed: 'right',
                    type: 'operation',
                    operations: ['详情'],
                    width: 100
                }
            ]
        }
    },

    computed: {
        id: function() {
            console.log(2222, this.$route.query)
            return this.$route.query.id
        },
        collegeId: function() {
            return this.$route.query.collegeId
        }
    },

    methods: {
        getList() {
            const data = {
                page: this.currentPage,
                rows: this.currentPageSize
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
                } else if (res.code === 200) {
                    res.data &&
                        res.data.items &&
                        res.data.items.forEach(item => {
                            item.updateTime = new Date(item.updateTime).format(
                                'yyyy-MM-dd hh:mm:ss'
                            )
                        })
                    this.list = (res.data && res.data.items) || []
                    this.totalNum = (res.data && res.data.total) || 0
                }
            })
        },
        getColumnListById() {
            const data = {
                page: this.currentPage,
                rows: this.currentPageSize,
                key: this.id
            }
            this.$store.dispatch('getColumnListById', data).then(res => {
                if (res.code === 401) {
                    this.$store.dispatch('manuallyLoginOut')
                    this.$router.push({
                        path: '/login',
                        query: {
                            redirect: this.$route.path
                        }
                    })
                } else if (res.code === 200) {
                    res.data &&
                        res.data.items &&
                        res.data.items.forEach(item => {
                            item.updateTime = new Date(item.updateTime).format(
                                'yyyy-MM-dd hh:mm:ss'
                            )
                        })
                    this.list = (res.data && res.data.items) || []
                    this.totalNum = (res.data && res.data.total) || 0
                }
            })
        },
        handleSizeChange() {},
        handleCurrentChange(page) {
            this.currentPage = page
            if (this.id) {
                this.getColumnListById()
            } else {
                this.getList()
            }
        },
        operateClick(props, item) {
            console.log(111, item, props.column.label)
            if (item === '详情') {
                this.jumpToDetails(props)
            }
        },
        jumpToDetails(props) {
            this.$router.push({
                path: '/columncontent/list',
                query: {
                    id: props.row.id,
                    collegeId: props.row.collegeId
                }
            })
        }
    },
    mounted() {
        if (this.id) {
            this.getColumnListById()
        } else {
            this.getList()
        }
    }
}
</script>

<style lang="less">
</style>
