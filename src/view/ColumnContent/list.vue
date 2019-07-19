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
                   ref="allPatientTable">
        </tableList>
        <!-- <el-dialog :title="dialogTitle"
                   :visible.sync="dialogVisible"
                   width="30%"
                   :before-close="handleClose">
            <el-form ref="form"
                     :model="form"
                     label-width="80px">
                <el-form-item label="标题"
                              prop="title">
                    <el-input v-model="form.title"></el-input>
                </el-form-item>
                <el-form-item label="内容"
                              prop="content">
                    <el-input v-model="form.content"></el-input>
                </el-form-item>
                <el-form-item label="栏目内容类型"
                              prop="content">
                    <el-input v-model="form.content"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer"
                  class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary"
                           @click="updateCollege()">确 定</el-button>
            </span>
        </el-dialog> -->
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
            console.log(111, item, props.column.label)
            // if (item === '详情') {
            //     this.jumpToDetails(props)
            // }
        },
        addColumnContent(props) {
            this.$router.push({
                path: '/columncontent/update',
                query: {
                    columnId: props.id,
                    collegeId: props.collegeId
                }
            })
        },
        jumpToDetails() {}
    },
    mounted() {
        this.getList()
    }
}
</script>

<style lang="less">
</style>
