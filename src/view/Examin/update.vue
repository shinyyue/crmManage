<template>
    <layout id="examin_update">
        <div class="column-content-title">{{id ? '修改申报实验' :'添加申报实验'}}</div>
        <el-form ref="form"
                 class="column-content"
                 label-width="120px">
            <el-form-item label="实验名称"
                          prop="expName">
                <el-input v-model="expName"></el-input>
            </el-form-item>
            <el-form-item label="实验简介"
                          prop="expIntroduct">
                <el-input v-model="expIntroduct"></el-input>
            </el-form-item>
            <el-form-item label="实验图片">
                <el-upload action="http://39.104.97.6:8080/reportExperoment/fileUpload"
                           list-type="picture-card"
                           :limit="1"
                           :file-list="imgList"
                           :on-preview="handlePictureCardPreview"
                           :on-remove="handleRemove"
                           :on-success="uploadImgDone"
                           :with-credentials="true">
                    <i class="el-icon-plus"></i>
                </el-upload>
                <el-dialog title="查看大图"
                           :visible.sync="dialogVisible">
                    <img width="100%"
                         :src="dialogImageUrl"
                         alt="">
                </el-dialog>
            </el-form-item>
            <el-form-item label="上传展示视频">
                <el-upload class="upload-demo"
                           action="http://39.104.97.6:8080/reportExperoment/fileUpload"
                           :on-remove="handleRemove"
                           :before-upload="beforeUpload"
                           :on-success="uploadVideoDone"
                           :with-credentials="true"
                           accept=".mp4"
                           :limit="1">
                    <el-button size="small"
                               type="primary">点击上传</el-button>
                </el-upload>
                <!-- <video :src="showImg"></video> -->
            </el-form-item>
            <el-form-item label="项目团队">
                <div>
                    <div ref="editor1"
                         style="text-align:left"></div>
                </div>
            </el-form-item>
            <!-- <el-form-item label="项目团队">
                <div>
                    <div ref="editor1"
                         style="text-align:left"></div>
                </div>
            </el-form-item> -->
            <el-form-item label="项目描述">
                <el-upload action="http://39.104.97.6:8080/reportExperoment/fileUpload"
                           :on-success="uploadDescDone"
                           :before-upload="beforePdfUpload"
                           :with-credentials="true">
                    <el-button size="small"
                               type="primary">点击上传</el-button>
                    <div slot="tip"
                         class="el-upload__tip">只能上传pdf文件</div>
                </el-upload>
            </el-form-item>
            <el-form-item label="实验指导">
                <el-upload action="http://39.104.97.6:8080/reportExperoment/fileUpload"
                           :on-success="uploadDescDone"
                           :before-upload="beforeExaminTEchUpload"
                           :with-credentials="true">
                    <el-button size="small"
                               type="primary">点击上传</el-button>
                    <div slot="tip"
                         class="el-upload__tip">只能上传pdf文件</div>
                </el-upload>
            </el-form-item>
            <el-form-item label="实验资料">
                <el-button size="small"
                           type="primary"
                           @click="showExaminDialog = true; isAddExamin = true; form = {}; fileList = []">添加实验资料</el-button>
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
            </el-form-item>
        </el-form>
        <el-dialog :title="!isAddExamin?'修改实验资料':'添加实验资料'"
                   :visible.sync="showExaminDialog"
                   width="30%"
                   :before-close="handleClose">
            <el-form ref="form"
                     :model="form"
                     label-width="80px">
                <el-form-item label="资源名称">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="资源地址">
                    <el-upload class="upload-demo"
                               action="http://39.104.97.6:8080/reportExperoment/fileUpload"
                               :on-success="uploadExaminDone"
                               :with-credentials="true"
                               :limit="1"
                               :file-list="fileList">
                        <el-button size="small"
                                   type="primary">点击上传</el-button>
                    </el-upload>
                </el-form-item>

            </el-form>
            <span slot="footer"
                  class="dialog-footer">
                <el-button @click="showExaminDialog = false">取 消</el-button>
                <el-button type="primary"
                           @click="updateExamin()">确 定</el-button>
            </span>
        </el-dialog>
    </layout>
</template>

<script>
import E from 'wangeditor'

import vue from 'vue'

export default {
    data() {
        return {
            imgList: [],
            expName: '',
            expIntroduct: '',
            dialogImageUrl: '',
            dialogVisible: false,
            showExaminDialog: false,
            videoUrl: '',
            editorContent: '',
            descript: '',
            list: [],
            loading: false,
            totalNum: 0,
            currentPageSize: 20,
            currentPage: 1,
            colNameMap: [
                {
                    displayName: '资料名称',
                    key: 'name',
                    width: '80px',
                    align: 'center'
                },
                {
                    displayName: '资料地址',
                    key: 'url',
                    align: 'center'
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
            form: {
                name: '',
                url: ''
            },
            isAddExamin: true,
            examinInfo: null,
            fileList: []
        }
    },
    computed: {
        id() {
            return Number(this.$route.query.id)
        }
    },
    methods: {
        handleRemove() {},
        handlePictureCardPreview(file) {
            this.dialogImageUrl = file.url
            this.dialogVisible = true
        },
        uploadImgDone(res, file) {
            if (res.code === 401) {
                this.$store.dispatch('manuallyLoginOut')
                this.$router.push({
                    path: '/login',
                    query: {
                        redirect: this.$route.path
                    }
                })
            } else if (res.code === 200) {
                this.imgUrl = 'http://39.104.97.6:8001/' + res.data
            } else {
                this.$notify.error({
                    message: res.msg || '上传图片失败'
                })
            }
        },
        beforeUpload(file) {
            const mp4 = file.name.substring(file.name.lastIndexOf('.') + 1)
            if (!mp4) {
                this.$message({
                    message: '请上传.mp4格式的视频',
                    type: 'warning'
                })
            }
            return mp4 === 'mp4'
        },
        uploadVideoDone(res, file) {
            if (res.code === 401) {
                this.$store.dispatch('manuallyLoginOut')
                this.$router.push({
                    path: '/login',
                    query: {
                        redirect: this.$route.path
                    }
                })
            } else if (res.code === 200) {
                this.videoUrl = 'http://39.104.97.6:8001/' + res.data
            } else {
                this.$notify.error({
                    message: res.msg || '上传图片失败'
                })
            }
        },
        beforePdfUpload(file) {
            const pdf = file.name.substring(file.name.lastIndexOf('.') + 1)
            if (pdf !== 'pdf' || pdf !== 'PDF') {
                this.$message({
                    message: '请上传.pdf格式的文件',
                    type: 'warning'
                })
            }
            return pdf === 'pdf' || pdf === 'PDF'
        },
        uploadDescDone(res, file) {
            if (res.code === 401) {
                this.$store.dispatch('manuallyLoginOut')
                this.$router.push({
                    path: '/login',
                    query: {
                        redirect: this.$route.path
                    }
                })
            } else if (res.code === 200) {
                this.descript = 'http://39.104.97.6:8001/' + res.data
            } else {
                this.$notify.error({
                    message: res.msg || '上传项目描述失败'
                })
            }
        },
        beforeExaminTEchUpload(res, file) {
            if (res.code === 401) {
                this.$store.dispatch('manuallyLoginOut')
                this.$router.push({
                    path: '/login',
                    query: {
                        redirect: this.$route.path
                    }
                })
            } else if (res.code === 200) {
                this.guide = 'http://39.104.97.6:8001/' + res.data
            } else {
                this.$notify.error({
                    message: res.msg || '上传项目描述失败'
                })
            }
        },
        getList() {
            vue.axios
                .post(this.API_ROOT + 'reportDate/queryReportDataList', {
                    page: 1,
                    rows: 10,
                    key: this.id
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
                this.isAddExamin = false
                this.showExaminDialog = true
                this.examinInfo = props.row
                this.form = {
                    name: props.row.name,
                    url: props.row.url
                }
            } else if (item === '删除') {
                this.$confirm('是否删除该实验资料?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
                    .then(() => {
                        this.deleteExamin(props.row.id)
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
        deleteExamin(id) {
            vue.axios
                .delete(this.API_ROOT + 'reportDate/deleteReportData?id=' + id)
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
        handleClose() {
            this.showExaminDialog = false
        },
        uploadExaminDone(res) {
            if (res.code === 401) {
                this.$store.dispatch('manuallyLoginOut')
                this.$router.push({
                    path: '/login',
                    query: {
                        redirect: this.$route.path
                    }
                })
            } else if (res.code === 200) {
                this.form.url = 'http://39.104.97.6:8001/' + res.data
            } else {
                this.$notify.error({
                    message: res.msg || '上传实验资源失败'
                })
            }
        },
        updateExamin() {
            if (!this.form.name || !this.form.url) {
                this.$notify({
                    message: '请填写完整！',
                    type: 'error'
                })
                return
            }
            if (this.isAddExamin) {
                vue.axios
                    .post(this.API_ROOT + 'reportDate/addReportData', {
                        reportId: this.id,
                        name: this.form.name,
                        url: this.form.url
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
                            this.$notify({
                                message: '添加成功！',
                                type: 'success'
                            })
                            this.getList()
                            this.showExaminDialog = false
                        } else {
                            this.$notify.error({
                                message: res.msg || '添加实验资料失败'
                            })
                        }
                    })
            } else {
                vue.axios
                    .put(this.API_ROOT + 'reportDate/updateReportData', {
                        id: this.examinInfo.id,
                        name: this.form.name,
                        url: this.form.url
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
                            this.$notify({
                                message: '修改成功！',
                                type: 'success'
                            })
                            this.getList()
                            this.showExaminDialog = false
                        } else {
                            this.$notify.error({
                                message: res.msg || '修改实验资料失败'
                            })
                        }
                    })
            }
        },
        getDetails() {}
    },
    mounted() {
        this.editor = new E(this.$refs.editor1)
        this.editor.customConfig.onchange = html => {
            this.editorContent = html
        }
        // this.id && this.getDetails()
        this.editor.customConfig.showLinkImg = false
        this.editor.customConfig.uploadImgServer =
            'http://39.104.97.6:8080/reportExperoment/fileUpload'
        this.editor.customConfig.withCredentials = true
        this.editor.customConfig.uploadImgHooks = {
            customInsert: function(insertImg, res, editor) {
                if (res.code === 401) {
                    this.$store.dispatch('manuallyLoginOut')
                    this.$router.push({
                        path: '/login',
                        query: {
                            redirect: this.$route.path
                        }
                    })
                } else if (res.code === 200) {
                    const url = 'http://39.104.97.6:8001/' + res.data
                    insertImg(url)
                } else {
                    this.$notify.error({
                        message: res.msg || '上传失败'
                    })
                }
            }
        }
        this.editor.create()

        this.id ? this.getList() : this.getDetails()
    }
}
</script>

<style lang="less">
</style>
