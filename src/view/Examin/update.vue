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
        </el-form>
    </layout>
</template>

<script>
import E from 'wangeditor'

export default {
    data() {
        return {
            imgList: [],
            expName: '',
            expIntroduct: '',
            dialogImageUrl: '',
            dialogVisible: false,
            videoUrl: '',
            editorContent: '',
            descript: ''
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
        }
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
    }
}
</script>

<style lang="less">
</style>
