<template>
    <layout id="column_content_update">
        <div class="column-content-title">{{id ? '修改栏目' :'添加栏目'}}</div>
        <el-form ref="form"
                 class="column-content"
                 label-width="120px">
            <el-form-item label="栏目内容类型"
                          prop="columnType">
                <el-select v-model="columnType"
                           placeholder="请选择栏目内容类型">
                    <el-option label="文章"
                               value="1"></el-option>
                    <el-option label="图片"
                               value="2"></el-option>
                    <el-option label="视频 "
                               value="3"></el-option>
                    <!-- <el-option label="链接 "
                               value="4"></el-option> -->
                </el-select>
            </el-form-item>
            <el-form-item label="标题"
                          prop="title">
                <el-input v-model="title"></el-input>
            </el-form-item>
            <el-form-item label="内容"
                          prop="content"
                          v-show="columnType != 1">
                <el-input v-model="content"></el-input>
            </el-form-item>

            <el-form-item label="上传图片">
                <el-upload action="http://47.105.130.130:8100/dataBank/oneFileUpload"
                           list-type="picture-card"
                           :limit="1"
                           :data="{type: 2}"
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
            <el-form-item label="文章"
                          v-show="columnType == 1">
                <div>
                    <div ref="editor"
                         style="text-align:left"></div>
                </div>
            </el-form-item>
            <!-- <el-form-item label="链接地址"
                          v-show="columnType == 4">
                <el-input v-model="link"></el-input>
            </el-form-item> -->
            <el-form-item label="上传视频"
                          prop="columnType"
                          v-show="columnType == 3">
                <el-upload class="upload-demo"
                           action="http://47.105.130.130:8100/dataBank/oneFileUpload"
                           :on-remove="handleRemove"
                           :before-upload="beforeUpload"
                           :on-success="uploadVideoDone"
                           :with-credentials="true"
                           :data="{type: 3}"
                           accept=".mp4"
                           :limit="1">
                    <el-button size="small"
                               type="primary">点击上传</el-button>
                </el-upload>
                <video v-show="videoUrl" :src="videoUrl" controls="controls"></video>
            </el-form-item>
            <el-form-item label="链接"
                          prop="content">
                <el-input v-model="linkUrl"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button @click="$router.go(-1)">返 回</el-button>
                <el-button type="primary"
                           @click="updateContent()">{{id ? '修改': '添加'}}</el-button>
            </el-form-item>
        </el-form>

    </layout>
</template>


<script>
import E from 'wangeditor'
export default {
    data() {
        return {
            title: '',
            content: '',
            columnType: '',
            link: '',
            disabled: false,
            dialogVisible: false,
            dialogImageUrl: '',
            // fileUrl: '',
            imgUrl: '',
            videoUrl: '',
            editorContent: '',
            imgList: [],
            editor: null,
            customConfig: [
                'head', // 标题
                'bold', // 粗体
                'fontSize', // 字号
                'fontName', // 字体
                'italic', // 斜体
                'underline', // 下划线
                'strikeThrough', // 删除线
                'foreColor', // 文字颜色
                'backColor', // 背景颜色
                'link', // 插入链接
                'list', // 列表
                'justify', // 对齐方式
                'quote', // 引用
                'image', // 插入图片
                'table', // 表格
                'video', // 插入视频
                'undo', // 撤销
                'redo' // 重复
            ],
            linkUrl: ''
        }
    },
    computed: {
        // editor() {
        //     return this.$refs.myTextEditor.quillEditor
        // },
        id() {
            return Number(this.$route.query.id)
        },
        collegeId() {
            return Number(this.$route.query.collegeId)
        },
        columnId() {
            return Number(this.$route.query.columnId)
        }
    },
    methods: {
        handleRemove(file) {
            this.imgList = []
            this.imgUrl = ''
        },
        handlePictureCardPreview(file) {
            this.dialogImageUrl = file.url
            this.dialogVisible = true
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
                this.imgUrl = 'http://47.105.130.130:8001/' + res.data
            } else {
                this.$notify.error({
                    message: res.msg || '上传图片失败'
                })
            }
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
                this.videoUrl = 'http://47.105.130.130:8001/' + res.data
            } else {
                this.$notify.error({
                    message: res.msg || '上传图片失败'
                })
            }
        },
        updateContent() {
            if (!this.columnType) {
                this.$notify.error({
                    message: '请选择栏目内容类型'
                })
                return
            }
            this.id ? this.editContent() : this.addContent()
        },
        addContent() {
            const data = {
                title: this.title,
                content:
                    Number(this.columnType) !== 1
                        ? this.content
                        : this.editorContent,
                collegeId: this.collegeId,
                columnId: this.columnId,
                columnType: this.columnType,
                showImg: this.imgUrl,
                videoUrl: this.videoUrl,
                linkUrl: this.linkUrl
            }
            this.$store.dispatch('addColumnContent', data).then(res => {
                if (res.code === 401) {
                    this.$store.dispatch('manuallyLoginOut')
                    this.$router.push({
                        path: '/login',
                        query: {
                            redirect: this.$route.path
                        }
                    })
                } else if (res.code === 200) {
                    this.$router.go(-1)
                    this.$notify.success({
                        message: '添加栏目内容成功！'
                    })
                } else {
                    this.$notify.error({
                        message: res.msg || '添加栏目内容失败'
                    })
                }
            })
        },
        editContent() {
            const data = {
                title: this.title,
                content:
                    Number(this.columnType) !== 1
                        ? this.content
                        : this.editorContent,
                columnType: Number(this.columnType),
                collegeId: this.collegeId,
                id: this.id,
                crmUserId: Number(localStorage.getItem('userId')),
                showImg: this.imgUrl,
                videoUrl: this.videoUrl,
                linkUrl: this.linkUrl
            }
            this.$store.dispatch('editColumnContent', data).then(res => {
                if (res.code === 401) {
                    this.$store.dispatch('manuallyLoginOut')
                    this.$router.push({
                        path: '/login',
                        query: {
                            redirect: this.$route.path
                        }
                    })
                } else if (res.code === 200) {
                    this.$router.go(-1)
                    this.$notify.success({
                        message: '修改栏目内容成功！'
                    })
                } else {
                    this.$notify.error({
                        message: res.msg || '修改栏目内容失败'
                    })
                }
            })
        },
        getDetails() {
            const data = {
                id: this.id
                // collegeId: this.collegeId
            }
            this.$store
                .dispatch('getColumnContentDetails', {
                    params: data
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
                        this.columnType = String(res.data.columnType)
                        this.title = res.data.title
                        this.content = res.data.content
                        this.editor.txt.html(res.data.content)
                        this.linkUrl = res.data.linkUrl
                        this.videoUrl = res.data.videoUrl
                        this.imgList = (res.data.showImg && [{ url: res.data.showImg }]) || []
                        this.imgUrl = res.data.showImg
                    } else {
                        this.$notify.error({
                            message: res.msg || '修改栏目内容失败'
                        })
                    }
                })
        }
    },
    mounted() {
        this.editor = new E(this.$refs.editor)
        this.editor.customConfig.onchange = html => {
            this.editorContent = html
        }
        this.id && this.getDetails()
        this.editor.customConfig.showLinkImg = false
        this.editor.customConfig.uploadImgServer =
            'http://47.105.130.130:8100/dataBank/oneFileUpload'
        this.editor.customConfig.withCredentials = true
        this.editor.customConfig.uploadImgParams = {
            type: 2
        }
        this.editor.customConfig.uploadFileName = 'file'
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
                    const url = 'http://47.105.130.130:8001/' + res.data
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
.column-content-title {
    padding: 10px;
    background: #fff;
    margin-bottom: 20px;
    font-weight: bold;
}
.column-content {
    background: #fff;
    padding: 20px;
}
</style>