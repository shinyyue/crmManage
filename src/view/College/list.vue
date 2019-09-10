<template>
    <layout id="college_list">
        <div style="text-align: right; padding: 10px;">
            <el-button type="primary"
                       @click="addCollegeEvt">添加学院</el-button>
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
        <el-dialog :title="dialogTitle"
                   :visible.sync="dialogVisible"
                   width="30%"
                   :before-close="handleClose">
            <el-form ref="form"
                     :model="form"
                     label-width="80px">
                <el-form-item label="学院名称"
                              prop="name">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="学院编号"
                              prop="code">
                    <el-input v-model="form.code"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer"
                  class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary"
                           @click="updateCollege()">确 定</el-button>
            </span>
        </el-dialog>
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
                    operations: ['修改信息', '查看栏目', '删除学院'],
                    width: 200
                }
            ],
            dialogVisible: false,
            form: {
                name: '',
                code: ''
            },
            curCollege: null,
            isAddOrEdit: true,
            dialogTitle: '添加学院'
        }
    },
    watch: {
        isAddOrEdit(val) {
            this.dialogTitle = val ? '添加学院' : '修改学院'
        }
    },
    methods: {
        addCollegeEvt() {
            this.dialogVisible = true
            this.isAddOrEdit = true
            this.form = {}
        },
        handleSizeChange() {},
        handleCurrentChange(page) {
            this.currentPage = page
            this.getList()
        },
        operateClick(props, item) {
            if (item === '查看栏目') {
                this.jumpToDetails(props)
            } else if (item === '修改信息') {
                this.dialogVisible = true
                this.isAddOrEdit = false
                this.curCollege = props.row
                this.form.name = props.row.collegeName
                this.form.code = props.row.collegeCode
            } else if (item === '删除学院') {
                this.$confirm('是否删除该学院?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
                    .then(() => {
                        this.deleteCollege(props.row)
                    })
                    .catch()
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
        jumpToDetails(props) {
            this.$router.push({
                path: '/column/list',
                query: {
                    id: props.row.id,
                    collegeName: props.row.collegeName
                }
            })
        },
        handleClose() {
            this.dialogVisible = false
        },
        updateCollege() {
            if (!this.form.name) {
                this.$notify.error({
                    message: '请填写学院名称',
                    duration: '1000'
                })
                return
            }
            if (!this.form.code) {
                this.$notify.error({
                    message: '请填写学院编码',
                    duration: '1000'
                })
                return
            }
            this.isAddOrEdit ? this.addCollege() : this.editCollege()
        },
        addCollege() {
            const data = {
                collegeCode: this.form.code,
                collegeName: this.form.name
            }
            this.$store.dispatch('addCollege', data).then(res => {
                if (res.code === 200) {
                    this.$notify.success({
                        message: '添加成功！',
                        duration: '1000'
                    })
                    this.dialogVisible = false
                    this.currentPage = 1
                    this.getList()
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
                        message: res.msg || '添加失败！',
                        duration: '1000'
                    })
                }
            })
        },
        editCollege() {
            const data = {
                id: this.curCollege.id,
                collegeName: this.form.name,
                collegeCode: this.form.code
            }
            this.$store.dispatch('updateCollege', data).then(res => {
                if (res.code === 200) {
                    this.$notify.success({
                        message: '修改成功！',
                        duration: '1000'
                    })
                    this.dialogVisible = false
                    this.getList()
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
        },
        deleteCollege(item) {
            this.$store
                .dispatch('deleteCollege', {
                    params: {
                        collegeId: item.id
                    }
                })
                .then(res => {
                    if (res.code === 200) {
                        this.$notify.success({
                            message: '删除成功！',
                            duration: '1000'
                        })
                        this.dialogVisible = false
                        this.currentPage = 1
                        this.getList()
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
                            message: res.msg || '删除失败！',
                            duration: '1000'
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
#college_list {
    .el-dialog__title {
        color: #fff;
    }
}
</style>
