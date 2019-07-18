<template>
    <layout id="college_list">
        <div style="text-align: right; padding: 10px;">
            <el-button type="primary"
                       @click="addCollege">添加学院</el-button>
        </div>
        <tableList @handleSizeChange="handleSizeChange"
                   @handleCurrentChange="handleCurrentChange"
                   @operateImg="jumpToDetails"
                   @operateClick="operateClick"
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
            totalNum: 0,
            currentPageSize: 20,
            currentPage: 1,
            colNameMap: [
                {
                    displayName: '学院ID',
                    key: 'id',
                    width: '80px',
                    align: 'center'
                },
                {
                    displayName: '学院名称',
                    key: 'collegeName',
                    align: 'center'
                },
                {
                    displayName: '学院编码',
                    key: 'collegeCode',
                    align: 'center'
                },
                {
                    displayName: '操作',
                    align: 'center',
                    fixed: 'right',
                    type: 'operation',
                    operations: ['查看栏目'],
                    width: 100
                }
            ]
        }
    },
    methods: {
        handleSizeChange() {},
        handleCurrentChange(page) {
            this.currentPage = page
            this.getList()
        },
        operateClick(props, item) {
            if (item === '查看栏目') {
                this.jumpToDetails(props)
            }
        },
        getList() {
            const data = {
                page: 1,
                rows: 20
            }
            this.$store.dispatch('getCollegeList', data).then(res => {
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
        addCollege() {},
        jumpToDetails(props) {
            this.$router.push({
                path: '/column/list',
                query: {
                    id: props.row.id
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
