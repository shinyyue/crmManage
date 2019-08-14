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
                <img style="width: auto; height: 148px;" :src="imgUrl" v-show="imgUrl">
                <el-upload action="http://39.104.97.6:8080/reportExperoment/fileUpload"
                           :on-preview="handlePictureCardPreview"
                           :on-remove="handleRemove"
                           :before-upload="beforeImgUpload"
                           :on-success="uploadImgDone"
                           :with-credentials="true">
                    <el-button size="small" type="primary">点击上传</el-button>
                </el-upload>
                <el-dialog title="查看大图"
                           :visible.sync="dialogVisible">
                    <img width="100%"
                         :src="dialogImageUrl"
                         alt="">
                </el-dialog>
            </el-form-item>
            <el-form-item label="上传展示视频">
                <object v-show="videoUrl"
                        data=""
                        type=""
                        style="width: 80%; height: 600px;">
                    <embed :src="videoUrl" type="audio/mpeg" style="width: 100%; height: 600px;">
                </object>
                <!-- codebase=" http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,29,0" -->
                <!-- type="application/x-shockwave-flash"  pluginspage="http://www.macromedia.com/go/getflashplayer" -->
                           <!-- type="audio/mpeg" -->
                <!-- <object v-show="videoUrl"
                        
                        classid="clsid:CFCDAA03-8BE4-11cf-B84B-0020AFBBCCFA"
                        style="width: 80%; height: 600px;"
                        >
                    <param name="movie"
                           value="static/flvplayer.swf">
                           
                    <embed :src="videoUrl" 
                            type="audio/x-pn-realaudio-plugin"  style="width: 100%; height: 600px;">
                </object> -->
                <el-upload class="upload-demo"
                           action="http://39.104.97.6:8080/reportExperoment/fileUpload"
                           :on-remove="handleVideoRemove"
                           :before-upload="beforeUpload"
                           :on-success="uploadVideoDone"
                           :with-credentials="true"
                           accept=".mp4"
                           :limit="1">
                    <el-button size="small"
                               type="primary">点击上传</el-button>
                </el-upload>
            </el-form-item>
            <el-form-item label="项目团队">
                <div class="editor-item">
                    <div ref="editorTeam"
                         style="text-align:left"></div>
                </div>
            </el-form-item>
            <el-form-item label="网络要求">
                <div class="editor-item">
                    <div ref="editorRequire"
                         style="text-align:left"></div>
                </div>
            </el-form-item>
            <el-form-item label="技术架构">
                <div class="editor-item">
                    <div ref="editorStructure"
                         style="text-align:left"></div>
                </div>
            </el-form-item>
            <el-form-item label="项目特色">
                <div class="editor-item">
                    <div ref="editorFeature"
                         style="text-align:left"></div>
                </div>
            </el-form-item>
            <el-form-item label="服务计划">
                <div class="editor-item">
                    <div ref="editorService"
                         style="text-align:left"></div>
                </div>
            </el-form-item>
            <el-form-item label="项目描述">
                <iframe v-show="descript" :src="descript" width="100%" height="500px;" frameborder="1"></iframe>
                <el-upload action="http://39.104.97.6:8080/reportExperoment/fileUpload"
                           :on-success="uploadDescDone"
                           :on-remove="handleDescRemove"
                           :before-upload="beforePdfUpload"
                           :with-credentials="true">
                    <el-button size="small"
                               type="primary">点击上传</el-button>
                    <div slot="tip"
                         class="el-upload__tip">只能上传pdf文件</div>
                </el-upload>
            </el-form-item>
            <el-form-item label="实验指导">
                <iframe v-show="guide" :src="guide" width="100%" height="500px;" frameborder="1"></iframe>
                <el-upload action="http://39.104.97.6:8080/reportExperoment/fileUpload"
                           :on-success="uploadTechDone"
                           :on-remove="handleGuideRemove"
                           :before-upload="beforePdfUpload"
                           :with-credentials="true">
                    <el-button size="small"
                               type="primary">点击上传</el-button>
                    <div slot="tip"
                         class="el-upload__tip">只能上传pdf文件</div>
                </el-upload>
            </el-form-item>
            <el-form-item  label="实验资料">
                <el-button size="small"
                           type="primary"
                           @click="addExamin()">添加实验资料</el-button>
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
            <el-form-item>
                <el-button @click="$router.go(-1)">返 回</el-button>
                <el-button type="primary"
                            @click="updateContent()">{{id ? '修改': '添加'}}</el-button>
            </el-form-item>
        </el-form>
        <el-dialog :title="!isAddExamin?'修改实验资料':'添加实验资料'"
                   :visible.sync="showExaminDialog"
                   width="60%"
                   :before-close="handleClose">
            <el-form ref="form"
                     :model="form"
                     label-width="80px">
                <el-form-item label="资源名称">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="资源地址">
                    <iframe v-show="examinType && examinType === 'pdf' && form.url" :src="form.url" width="100%" height="500px;" frameborder="1"></iframe>
                    <object v-show="examinType && examinType !== 'pdf' && form.url"
                            data=""
                            type=""
                            style="width: 100%; height: 600px;">
                        <embed :src="form.url" style="width: 100%; height: 600px;">
                    </object>
                    <el-upload class="upload-demo"
                               action="http://39.104.97.6:8080/reportExperoment/fileUpload"
                               :on-success="uploadExaminDone"
                               :before-upload="beforeExaminUpload"
                               :with-credentials="true">
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
import deepCopy from '../../utilities/deepCopy'
import vue from 'vue'

export default {
    data() {
        return {
            dialogImageUrl: '',
            dialogVisible: false,
            showExaminDialog: false,
            imgUrl: '',
            videoUrl: '',
            expName: '',
            expIntroduct: '',
            team: '',
            require: '',
            structure: '',
            descript: '',
            feature: '',
            guide: '',
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
            fileList: [],
            editorTeam: null,
            editorRequire: null,
            editorStructure: null,
            editorFeature: null,
            editorService: null,
            examinType: ''
        }
    },
    computed: {
        id() {
            return this.$route.query.id && Number(this.$route.query.id)
        }
    },
    methods: {
        handleRemove() {
            this.imgUrl = ''
        },
        handleVideoRemove() {
            this.videoUrl = ''
        },
        handleDescRemove() {
            this.descript = ''
        },
        handleGuideRemove() {
            this.guide = ''
        },
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
            const type = file.name.substring(file.name.lastIndexOf('.') + 1)
            const reg = new RegExp(/(avi|rmvb|rm|flv|mp4)$/, 'ig')
            if (!reg.test(type)) {
                this.$message({
                    message: '请上传mp4、avi、rmvb、rm、flv格式的视频',
                    type: 'warning'
                })
            }
            return reg.test(type)
        },
        beforeImgUpload(file) {
            const imgType = file.name.substring(file.name.lastIndexOf('.') + 1)
            const reg = new RegExp(/(jpeg|jpg|png|gif|bmp|raw|tiff)$/, 'ig')
            
            if (!reg.test(imgType)) {
                this.$message({
                    message: '请上传jpeg、jpg、png、gif格式的图片',
                    type: 'warning'
                })
            }
            return reg.test(imgType)
        },
        beforeExaminUpload(file) {
            // debugger

            // const type = file.name.substring(file.name.lastIndexOf('.') + 1)
            // const reg = new RegExp(/(pdf|avi|rmvb|rm|flv|mp4)$/, 'ig') 

            // if (!reg.test(type)) {
            //     this.$message({
            //         message: '请上传pdf格式的文档，或mp4、avi、rmvb、rm、flv格式的视频',
            //         type: 'warning'
            //     })
            // }
            // return reg.test(type)
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
            if (pdf !== 'pdf' && pdf !== 'PDF') {
                this.$message({
                    message: '请上传pdf格式的文件',
                    type: 'warning'
                })
            }
            return pdf === 'pdf' || pdf === 'PDF'
        },
        uploadTechDone(res, file) {
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
        initEditor(ele, keyName) {
            const editor = new E(ele)
            editor.customConfig.onchange = html => {
                this[keyName] = html
            }
            editor.customConfig.showLinkImg = false
            editor.customConfig.uploadImgServer = 'http://39.104.97.6:8080/reportExperoment/fileUpload'
            editor.customConfig.withCredentials = true
            editor.customConfig.uploadImgHooks = {
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
            editor.create()
            return editor
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
                    url: props.row.url,
                    type: props.row.url && props.row.url.substring(props.row.url.lastIndexOf('.') + 1)
                }
                this.examinType = props.row.url && props.row.url.substring(props.row.url.lastIndexOf('.') + 1)
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
                this.examinType = this.form.url.substring(this.form.url.lastIndexOf('.') + 1)
            } else {
                this.$notify.error({
                    message: res.msg || '上传实验资源失败'
                })
            }
        },
        addExamin() {
            this.showExaminDialog = true; 
            this.isAddExamin = true;
            this.form = {}; 
            this.fileList = []; 
            this.examinType = '';
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
        getDetails() {
            vue.axios.get(this.API_ROOT + 'reportExperoment/queryByReportExpId?id='+this.id).then(res => {
                if (res.code === 401) {
                    this.$store.dispatch('manuallyLoginOut')
                    this.$router.push({
                        path: '/login',
                        query: {
                            redirect: this.$route.path
                        }
                    })
                } else if (res.code === 200) {
                    this.videoUrl = res.data.videoUrl
                    this.expName = res.data.expName
                    this.expIntroduct = res.data.expIntroduct
                    this.editorTeam.txt.html(res.data.team)
                    this.team = res.data.team
                    this.editorRequire.txt.html(res.data.require)
                    this.require = res.data.require                    
                    this.editorStructure.txt.html(res.data.structure)
                    this.structure = res.data.structure
                    this.service = res.data.service
                    this.editorService.txt.html(res.data.service)
                    this.editorFeature.txt.html(res.data.feature)
                    this.feature = res.data.feature
                    this.descript = res.data.descript
                    this.guide = res.data.guide
                    this.imgUrl = res.data.imgUrl
                } else {
                    this.$notify.error({
                        message: res.msg || '获取实验资料失败'
                    })
                }
            })
        },
        updateContent() {
            this.id ? this.editContent() : this.addContent()
        },
        addContent() {
            const data = {
                team: this.team,
                descript: this.descript,
                require: this.require,
                structure: this.structure,
                feature: this.feature,
                guide: this.guide,
                service: this.service,
                expName: this.expName,
                imgUrl: this.imgUrl,
                videoUrl: this.videoUrl,
                expIntroduct: this.expIntroduct
            }
            vue.axios.post(this.API_ROOT + 'reportExperoment/addReportExp', data).then(res => {
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
                    this.$router.go(-1)
                } else {
                    this.$notify.error({
                        message: res.msg || '添加申报实验失败'
                    })
                }
            })
        },
        editContent() {
            const data = {
                id: this.id,
                team: this.team,
                descript: this.descript,
                require: this.require,
                structure: this.structure,
                feature: this.feature,
                guide: this.guide,
                service: this.service,
                expName: this.expName,
                imgUrl: this.imgUrl,
                videoUrl: this.videoUrl,
                expIntroduct: this.expIntroduct
            }
            vue.axios.put(this.API_ROOT + 'reportExperoment/updateReportExp', data).then(res => {
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
                    this.$router.go(-1)
                } else {
                    this.$notify.error({
                        message: res.msg || '修改申报实验失败'
                    })
                }
            })
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.editorTeam = this.initEditor(this.$refs.editorTeam, 'team')
            this.editorRequire = this.initEditor(this.$refs.editorRequire, 'require')
            this.editorStructure = this.initEditor(this.$refs.editorStructure, 'structure')
            this.editorFeature = this.initEditor(this.$refs.editorFeature, 'feature')
            this.editorService =  this.initEditor(this.$refs.editorService, 'service')
        })
        if (this.id) {
            this.getList();
            this.getDetails();
        }
    }
}
</script>

<style lang="less">
#examin_update {
    .el-dialog__title{
        color: #fff;
    }
    .editor-item{
        background: #fff;
    }
    .el-form-item__label {
        color: #333;
    }
}

</style>
