<template>
    <layout id="column_list">
        <div style="padding: 10px;"
             v-show="id">所属学院：{{collegeName}}</div>
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
        <el-dialog title="修改学院"
                   :visible.sync="dialogVisible"
                   width="30%"
                   :before-close="handleClose">
            <el-form ref="form"
                     :model="form"
                     label-width="80px">
                <el-form-item label="栏目名称">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer"
                  class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary"
                           @click="updateColumn()">确 定</el-button>
            </span>
        </el-dialog>
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
            form: { name: '' },
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
                    displayName: '栏目类型',
                    key: 'name',
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
                    operations: ['修改', '查看栏目内容'],
                    width: 200
                }
            ],
            dialogVisible: false,
            checkedColumn: null
        }
    },

    computed: {
        id: function() {
            return this.$route.query.id
        },
        collegeName: function() {
            return this.$route.query.collegeName
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
                key: this.id || 0
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
        handleClose() {
            this.dialogVisible = false
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
            if (item === '查看栏目内容') {
                this.jumpToDetails(props)
            } else if (item === '修改') {
                this.form.name = props.row.columnName
                this.dialogVisible = true
                this.checkedColumn = props.row
            }
        },
        jumpToDetails(props) {
            this.$router.push({
                path: '/columncontent/list',
                query: {
                    id: props.row.id,
                    collegeId: props.row.collegeId,
                    columnName: props.row.columnName
                }
            })
        },
        updateColumn() {
            if (!this.form.name) {
                this.$notify.error({
                    message: '请填写栏目名称',
                    duration: '1000'
                })
                return
            }
            const data = {
                collegeId: Number(this.id) || 0,
                id: this.checkedColumn.id,
                columnName: this.form.name
            }
            this.$store.dispatch('editSchoolColumn', data).then(res => {
                if (res.code === 200) {
                    this.$notify.success({
                        message: '修改成功！',
                        duration: '1000'
                    })
                    this.dialogVisible = false
                    this.currentPage = 1
                    if (this.id) {
                        this.getColumnListById()
                    } else {
                        this.getList()
                    }
                } else if (res.code === 401) {
                    this.$store.dispatch('manuallyLoginOut')
                    this.$router.push({
                        path: '/login',
                        query: {
                            redirect: this.$route.path
                        }
                    })
                } else {
                    this.$notify.error({
                        message: res.msg || '修改失败！',
                        duration: '1000'
                    })
                }
            })
        }
    },
    mounted() {
        // this.getColumnListById()
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
