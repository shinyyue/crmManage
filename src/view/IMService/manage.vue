<template>
    <layout id="quick-reply">
        <div class="content-title">
            <span>医学顾问系统快捷回复</span>
            <ul class="reply-tab">
                <li class="tab-item"
                    :class="{'active': tabIndex === 0}"
                    @click="changeTab(0)">语句</li>
                <li class="tab-item"
                    :class="{'active': tabIndex === 1}"
                    @click="changeTab(1)">跳转</li>
            </ul>
        </div>
        <div class="quick-search"
             v-show="tabIndex === 0">
            <input type="text"
                   v-model="searchReplyText">
            <el-button type="primary"
                       @click="searchReply()">搜索</el-button>
        </div>
        <div class="content-wrapper"
             v-if="tabIndex === 0">
            <div class="wrapper-title">
                <span>语句</span>
                <el-button @click="addReply()"
                           type="primary">添加语句</el-button>
            </div>
            <div class="wrapper-list">
                <tableList @handleCurrentChange="handleCurrentChange"
                           @operateClick="operateClick"
                           :loading="loading"
                           :tableData="replyList"
                           :totalNum="textTotalNum"
                           :colNameMap="colNameMap"
                           :currentPage="textCurrentPage"
                           :pageSize="textPageSize"
                           ref="replyTable"
                           :pageSizes="[10, 25, 50, 100]"></tableList>
            </div>
        </div>
        <div class="content-wrapper"
             v-else>
            <div class="wrapper-title">
                <span>跳转</span>
                <el-button @click="addLink()"
                           type="primary">添加跳转</el-button>
            </div>
            <div class="wrapper-list">
                <tableList @handleCurrentChange="handleCurrentChangeLink"
                           @operateClick="operateClickLink"
                           :loading="loading"
                           :tableData="linkList"
                           :totalNum="linkTotalNum"
                           :colNameMap="linkColNameMap"
                           :currentPage="linkCurrentPage"
                           :pageSize="linkPageSize"
                           ref="linkTable"
                           :pageSizes="[10, 25, 50, 100]"></tableList>
            </div>
        </div>
        <el-dialog :visible.sync="showAddReply"
                   @close="cancleAddText()"
                   class="reply-dialog"
                   :center="true"
                   width="60%"
                   :close-on-click-modal="false"
                   :close-on-press-escape="false">
            <div slot="title"
                 class="reply-error"
                 v-if="showTextError">输入的内容不能为空</div>
            <el-input :rows="10"
                      class="reply-input"
                      type="textarea"
                      placeholder="请输入内容"
                      v-model="replyText"></el-input>
            <span slot="footer"
                  class="dialog-footer">
                <el-button type="primary"
                           plain
                           @click="cancleAddText()">取 消</el-button>
                <el-button type="primary"
                           @click="saveAddText()">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog :visible.sync="showAddLink"
                   @close="cancleAddLink()"
                   class="reply-dialog"
                   :center="true"
                   width="60%"
                   :close-on-click-modal="false"
                   :close-on-press-escape="false">
            <div slot="title"
                 class="reply-error">{{linkErrorText}}</div>
            <el-input :rows="2"
                      autosize
                      class="reply-input"
                      type="textarea"
                      placeholder="内容"
                      v-model="linkDesc"></el-input>
            <el-input :rows="2"
                      autosize
                      class="reply-input"
                      type="textarea"
                      placeholder="跳转到"
                      v-model="linkPage"></el-input>
            <el-input :rows="2"
                      autosize
                      class="reply-input"
                      type="textarea"
                      placeholder="链接"
                      v-model="linkUrl"></el-input>
            <span slot="footer"
                  class="dialog-footer">
                <el-button type="primary"
                           plain
                           @click="cancleAddLink()">取 消</el-button>
                <el-button type="primary"
                           @click="saveAddLink()">确 定</el-button>
            </span>
        </el-dialog>
    </layout>
</template>

<script>
// import vue from 'vue'

export default {
    data() {
        return {
            tabIndex: 0,
            loading: false,
            replyList: [],
            linkList: [],
            textTotalNum: 0,
            linkTotalNum: 0,
            colNameMap: [
                {
                    displayName: '内容',
                    align: 'center',
                    key: 'content'
                }, {
                    displayName: '操作',
                    align: 'center',
                    type: 'operation',
                    operations: ['删除', '修改']
                }
            ],
            linkColNameMap: [
                {
                    displayName: '内容',
                    align: 'center',
                    key: 'content'
                }, {
                    displayName: '跳转到',
                    align: 'center',
                    key: 'href_text'
                }, {
                    displayName: '链接',
                    align: 'center',
                    key: 'href',
                    type: 'link'
                }, {
                    displayName: '操作',
                    align: 'center',
                    type: 'operation',
                    operations: ['删除', '修改']
                }
            ],
            textCurrentPage: 1,
            linkCurrentPage: 1,
            pageSize: 10,
            textPageSize: 10,
            linkPageSize: 10,
            showAddReply: false,
            showAddLink: false,
            replyText: '',
            textId: '',
            showTextError: false,
            linkDesc: '',
            linkPage: '',
            linkUrl: '',
            linkId: '',
            linkErrorText: '',
            showTextAdd: true, // true: 语句添加; false: 语句详情
            showLinkAdd: true, // true: 链接添加; false: 链接详情
            isTextAddOrEdit: true,
            isLinkAddOrEdit: true,
            searchReplyText: ''
        }
    },
    methods: {
        addReply() {
            this.showAddReply = true
            this.isTextAddOrEdit = true
        },
        addLink() {
            this.showAddLink = true
            this.isLinkAddOrEdit = true
        },
        changeTab(index) {
            this.tabIndex = index
        },
        handleCurrentChange(val) {
            this.textCurrentPage = val
            this.getReplyTextList()
        },
        handleCurrentChangeLink(val) {
            this.linkCurrentPage = val
            this.getReplyLinkList()
        },
        operateClick(info, operation) {
            const row = info.row
            const column = info.column
            if (column.label === '操作' && operation === '删除') {
                this.$confirm('是否删除?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(res => {
                    this.delReplyText(row.id)
                })
            } else if (column.label === '操作' && operation === '修改') {
                this.showTextAdd = false
                this.showAddReply = true
                this.replyText = row.content
                this.textId = row.id
                this.isTextAddOrEdit = false
            }
        },
        operateClickLink(info, operation) {
            const column = info.column
            const row = info.row
            if (column.label === '操作' && operation === '删除') {
                this.$confirm('是否删除?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(res => {
                    this.delReplyLink(row.id)
                })
            } else if (column.label === '操作' && operation === '修改') {
                this.showLinkAdd = false
                this.showAddLink = true
                this.linkDesc = row.content
                this.linkPage = row.href_text
                this.linkUrl = row.href
                this.linkId = row.id
                this.isLinkAddOrEdit = false
            }
        },
        saveAddText() {
            if (!this.replyText || !this.replyText.trim()) {
                this.showTextError = true
            } else {
                this.isTextAddOrEdit ? this.addReplyText() : this.editReplyText()
            }
        },
        saveAddLink() {
            if (!this.linkDesc || !this.linkDesc.trim()) {
                this.linkErrorText = '请输入内容'
            } else if (!this.linkPage || !this.linkPage.trim()) {
                this.linkErrorText = '请输入跳转名称'
            } else if (!this.linkUrl || !this.linkUrl.trim()) {
                this.linkErrorText = '请输入跳转链接'
            } else {
                this.isLinkAddOrEdit ? this.addReplyLink() : this.editReplyLink()
            }
        },
        addReplyText() {
            const data = {
                data: {
                    content: this.replyText,
                    type: 0,
                    createrid: Number(window.localStorage.getItem('userId'))
                }
            }
            this.$store.dispatch('addReplyText', data).then(res => {
                if (res.data) {
                    this.showAddReply = false
                    this.getReplyTextList()
                    this.$notify({
                        message: '添加成功'
                    })
                }
            })
        },
        editReplyText() {
            const data = {
                data: {
                    content: this.replyText,
                    id: this.textId
                }
            }
            this.$store.dispatch('editReplyText', data).then(res => {
                if (res.data) {
                    this.showAddReply = false
                    this.getReplyTextList()
                    this.$notify({
                        message: '修改成功'
                    })
                }
            })
        },
        editReplyLink() {
            const data = {
                data: {
                    content: this.linkDesc,
                    hreftext: this.linkPage,
                    href: this.linkUrl,
                    createrid: 0,
                    id: this.linkId
                }
            }
            this.$store.dispatch('editReplyLink', data).then(res => {
                if (res.data) {
                    this.showAddLink = false
                    this.$notify({
                        message: '修改成功'
                    })
                    this.getReplyLinkList()
                }
            })
        },
        addReplyLink() {
            const data = {
                data: {
                    content: this.linkDesc,
                    hreftext: this.linkPage,
                    href: this.linkUrl,
                    createrid: Number(window.localStorage.getItem('userId'))
                }
            }
            this.$store.dispatch('addReplyLink', data).then(res => {
                if (res.data) {
                    this.showAddLink = false
                    this.getReplyLinkList()
                    this.$notify({
                        message: '添加成功'
                    })
                }
            })
        },
        delReplyText(id) {
            const data = {
                data: {
                    id: id
                }
            }
            this.$store.dispatch('delReplyText', data).then(res => {
                if (res.status === 0) {
                    this.getReplyTextList()
                    this.$notify({
                        message: '删除成功'
                    })
                }
            })
        },
        delReplyLink(id) {
            const data = {
                data: {
                    id: id
                }
            }
            this.$store.dispatch('delReplyLink', data).then(res => {
                if (res.status === 0) {
                    this.getReplyLinkList()
                    this.$notify({
                        message: '删除成功'
                    })
                }
            })
        },
        getReplyTextList() {
            // str为搜索条件
            const data = {
                data: {
                    str: this.searchReplyText || '',
                    page: this.textCurrentPage,
                    count: this.textPageSize
                }
            }
            this.loading = true
            this.$store.dispatch('getReplyTextList', data).then(res => {
                this.loading = false
                if (res.data.list) {
                    this.replyList = res.data.list
                } else {
                    this.replyList = []
                }
                this.textTotalNum = (res.data.page && res.data.page.total) || 1
                this.textPageSize = (res.data.page && res.data.page.count) || 10
            })
        },
        getReplyLinkList() {
            const data = {
                data: {
                    page: this.linkCurrentPage,
                    count: this.linkPageSize
                }
            }
            this.loading = true
            this.$store.dispatch('getReplyLinkList', data).then(res => {
                this.loading = false
                if (res.data.list) {
                    this.linkList = res.data.list
                } else {
                    this.linkList = []
                }
                this.linkTotalNum = (res.data.page && res.data.page.total) || 1
                this.textPageSize = (res.data.page && res.data.page.count) || 10
            })
        },
        cancleAddText() {
            this.showTextError = false
            this.replyText = ''
            this.showAddReply = false
            this.isTextAddOrEdit = true
        },
        cancleAddLink() {
            this.showAddLink = false
            this.linkErrorText = ''
            this.linkDesc = ''
            this.linkPage = ''
            this.linkUrl = ''
            this.isLinkAddOrEdit = true
        },
        searchReply() {
            this.textCurrentPage = 0
            this.getReplyTextList()
        }
    },
    mounted() {
        this.getReplyTextList()
        this.getReplyLinkList()
    }
}
</script>

<style lang="less">
#quick-reply {
    .content-title {
        border-bottom: 1px solid #ccc;
        padding-bottom: 10px;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        .reply-tab {
            display: flex;
            flex-direction: row;
            justify-content: flex-start;
            align-items: center;
            margin-left: 100px;
            .tab-item {
                display: flex;
                flex-direction: row;
                justify-content: flex-start;
                align-items: center;
                margin-left: 20px;
                &.active {
                    color: @default-color;
                    border-bottom: 3px solid @default-color;
                }
            }
        }
    }
    .quick-search {
        margin: 20px 0 0px;
        input {
            width: 70%;
            padding: 6px 0;
            //   height: 30px;
        }
    }
    .content-wrapper {
        margin-top: 10px;
        // border: 1px solid #ccc;
        .wrapper-title {
            background: #f2f2f3;
            padding: 10px;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            button {
                background: @default-color;
                color: #fff;
                padding: 4px 10px;
                outline: none;
            }
        }
    }
    .reply-dialog {
        .reply-error {
            color: red;
        }
        .reply-input {
            margin-bottom: 10px;
        }
    }
}
</style>
