<template>
    <layout id="column_content_list">
        <div style="text-align: right; padding: 10px; display: flex; flex-direction: row; justify-content: space-between; ">
            <span>所属栏目：{{columnName}}</span>
            <el-button type="primary"
                       @click="addColumnContent">添加栏目内容</el-button>
        </div>
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
                   :customize="true"
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
                    displayName: '内容ID',
                    key: 'id',
                    width: '80px',
                    align: 'center'
                },
                {
                    displayName: '内容标题',
                    key: 'title',
                    align: 'center'
                },
                {
                    displayName: '栏目内容',
                    key: 'content',
                    align: 'center',
                    type: 'htmlParse'
                },
                {
                    displayName: '栏目类型',
                    key: 'columnType',
                    align: 'center'
                },
                {
                    displayName: '展示图',
                    key: 'showImg',
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
            ],
            dialogVisible: false,
            dialogTitle: '添加栏目内容',
            form: {
                title: '',
                content: ''
            }
        }
    },

    computed: {
        id: function() {
            return Number(this.$route.query.id)
        },
        collegeId: function() {
            return Number(this.$route.query.collegeId)
        },
        columnName: function() {
            return this.$route.query.columnName
        }
    },

    methods: {
        handleClose() {
            this.dialogVisible = false
        },
        getList() {
            const data = {
                page: this.currentPage,
                rows: this.currentPageSize,
                collegeId: this.collegeId,
                columnId: this.id
            }
            this.$store.dispatch('getColumnContentList', data).then(res => {
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
                            item.columnType = this.format(item.columnType)
                            item.content = item.content.replace(' ', '')
                            console.log(111, item.content)
                            item.content =
                                item.content.substring(0, 30) +
                                (item.content.length > 30 ? '...' : '')
                        })
                    this.list = (res.data && res.data.items) || []
                    this.totalNum = (res.data && res.data.total) || 0
                }
            })
        },
        format(type) {
            let str = ''
            switch (Number(type)) {
            case 1:
                str = '文章'
                break
            case 2:
                str = '图片'
                break
            case 3:
                str = '视频'
                break
            default:
                str = ''
                break
            }
            return str
        },
        handleSizeChange() {},
        handleCurrentChange(page) {
            this.currentPage = page
            this.getList()
        },
        operateClick(props, item) {
            if (item === '修改') {
                this.jumpToDetails(props.row)
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
            this.$store
                .dispatch('delColumnContent', {
                    params: {
                        id
                    }
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
                        this.$notify.success({
                            message: '删除成功'
                        })
                        this.getList()
                    }
                })
        },
        addColumnContent() {
            this.$router.push({
                path: '/columncontent/update',
                query: {
                    columnId: this.id,
                    collegeId: this.collegeId
                }
            })
        },
        jumpToDetails(data) {
            this.$router.push({
                path: '/columncontent/update',
                query: {
                    columnId: data.columnId,
                    collegeId: data.collegeId,
                    id: data.id
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
