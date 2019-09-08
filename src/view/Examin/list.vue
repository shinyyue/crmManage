<template>
    <layout id="examin-list">
        <div style="text-align: right; padding: 10px; display: flex; flex-direction: row; justify-content: space-between; ">
            <el-button type="primary"
                       @click="addExamin()">添加申报实验</el-button>
        </div>
        <tableList @handleSizeChange="handleSizeChange"
                   @handleCurrentChange="handleCurrentChange"
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
import vue from 'vue'
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
                    displayName: '实验名称',
                    key: 'expName',
                    width: '80px',
                    align: 'center'
                },
                {
                    displayName: '实验简介',
                    key: 'expIntroduct',
                    align: 'center'
                },
                {
                    displayName: '实验图片',
                    key: 'imgUrlAll',
                    align: 'center',
                    type: 'image'
                },
                {
                    displayName: '操作',
                    align: 'center',
                    fixed: 'right',
                    type: 'operation',
                    operations: ['修改', '删除'],
                    width: 100
                }
            ]
        }
    },
    methods: {
        getList() {
            vue.axios
                .post(this.API_ROOT + 'reportExperoment/queryReportExpList', {
                    page: 1,
                    rows: 20
                })
                .then(res => {
                    if (res.code === 401) {
                        this.$store.dispatch('manuallyLoginOut')
                        this.$router.push({
                            path: '/login',
                            query: {
                                redirect: this.$route.path
                            }
                        })
                    } else if (res.code === 200) {
                        res.data && res.data.items.forEach(item => {
                            item.imgUrlAll = 'http://47.105.130.130:8001/' + item.imgUrl 
                        })
                        this.list = (res.data && res.data.items) || []
                        this.totalNum = (res.data && res.data.total) || 0
                    }
                })
        },
        handleSizeChange() {},
        handleCurrentChange(page) {
            this.currentPage = page
            this.getList()
        },
        operateClick(props, item) {
            if (item === '修改') {
                this.jumpToDetails(props.row.id)
            } else if (item === '删除') {
                this.$confirm('是否删除该栏目内容?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
                    .then(() => {
                        this.deleteContent(props.row.id)
                    })
                    .catch()
            }
        },
        deleteContent(id) {
            vue.axios.delete(this.API_ROOT + 'reportExperoment/deleteReportExp?id='+id)
                .then(res => {
                    if (res.code === 401) {
                        this.$store.dispatch('manuallyLoginOut')
                        this.$router.push({
                            path: '/login',
                            query: {
                                redirect: this.$route.path
                            }
                        })
                    } else if (res.code === 200) {
                        this.$notify.success({
                            message: '删除成功'
                        })
                        this.getList()
                    }
                })
        },
        addExamin(data) {
            this.$router.push({
                path: '/examin/update'
            })
        },
        jumpToDetails(id) {
            this.$router.push({
                path: '/examin/update',
                query: {
                    id
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
#examin-list {
    .table-list .table-content-img{
        width: 100px;
        height: 100px;
    }
}

</style>
