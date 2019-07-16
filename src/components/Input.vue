<template>
    <!-- 这是一个具有联想功能，并可多选联想列表的内容，并将选择后的项放在输入框后面。例：患者列表页面。 -->
    <div class="input-suggestion">
        <el-row class="input-suggestion-wrapper">
            <el-col class="search-text"
                    :span="12">
                <label class="condition-label">{{labelTitle}}</label>
                <el-input class="search-input"
                          type="text"
                          placeholder="请输入"
                          @focus="focus"></el-input>
                <div class="suggest-wrapper"
                     v-show="showHospitalList">
                    <ul class="suggest-list">
                        <li class="suggest-item"
                            :key="index"
                            v-for="(item, index) in dataList"
                            @click="checkedEve(item)">
                            <img src="/static/img/gou.png"
                                 v-show="item.checked"
                                 class="suggest-img">
                            <img src="/static/img/sel-unselected.png"
                                 v-show="!item.checked"
                                 class="suggest-img">
                            <span class="suggest-name">{{item.name}}</span>
                        </li>
                    </ul>
                    <div class="suggest-button">
                        <el-button type="primary"
                                   @click="clearListWrapper()">一键清空</el-button>
                        <el-button type="primary"
                                   @click="closeListWrapper()">关闭</el-button>
                    </div>
                </div>
            </el-col>
            <el-col class="checked-list">
                <el-tag v-show="checkedList.length > 0"
                        :key="item.id"
                        v-for="item in checkedList"
                        closable
                        :disable-transitions="false"
                        @close="handleClose(item)">
                    {{item.name}}
                </el-tag>
            </el-col>
        </el-row>
    </div>
</template>

<script>
export default {
    name: 'input-suggestion',
    props: {
        labelTitle: {
            type: String,
            default: ''
        },
        storeName: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            showHospitalList: false,
            checkedList: [],
            dataList: []
        }
    },
    methods: {
        handleClose(item) {
            const index = this.checkedList.findIndex(data => {
                return item === data
            })
            if (index > -1) {
                item.checked = false
                this.checkedList.splice(index, 1)
            }
        },
        focus() {
            this.showHospitalList = true
        },
        getList() {
            const data = {
                data: {
                    offset: 0,
                    count: 20
                }
            }
            this.$store.dispatch(this.storeName, data).then((res) => {
                res.data.list.forEach(item => {
                    item.checked = false
                    if (this.storeName === 'getDoctorList') {
                        item.name = item.real_name
                        item.id = item.doctor_id
                    }
                })
                this.dataList = res.data.list
            })
        },
        checkedEve(item) {
            const index = this.checkedList.findIndex(data => {
                return item === data
            })
            if (item.checked) {
                item.checked = false
                if (index > -1) {
                    this.checkedList.splice(index, 1)
                }
            } else {
                item.checked = true
                if (index < 0) {
                    this.checkedList.unshift(item)
                }
            }
        },
        closeListWrapper() {
            this.showHospitalList = false
            this.$emit('getCheckedList', this.checkedList)
        },
        clearListWrapper() {
            this.checkedList = []
            this.dataList.forEach(item => {
                item.checked = false
            })
            this.showHospitalList = false
        }
    },
    mounted() {
        this.getList()
    }
}
</script>

<style lang="less">
.input-suggestion {
    margin-bottom: 10px;
    width: 100%;
    .input-suggestion-wrapper {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;
        width: 100%;
    }
    .search-text {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        position: relative;
        margin-right: 10px;
        width: 100%;
        .suggest-wrapper {
            position: absolute;
            top: 40px;
            right: 0px;
            width: 100%;
            z-index: 9999;
            background: #fff;
            border: 1px solid #eee;
            .suggest-list {
                max-height: 400px;
                overflow-y: auto;
                padding: 0 10px 50px;
                font-size: 14px;
                &::-webkit-scrollbar {
                    width: 4px;
                }
                .suggest-item {
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    justify-content: flex-start;
                    width: 100%;
                    border-bottom: 1px solid #eee;
                    padding: 5px 0;
                    .suggest-img {
                        width: 20px;
                        height: 20px;
                        margin-right: 10px;
                    }
                    .suggest-name {
                        width: calc(100% - 20px);
                        overflow: hidden;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                    }
                }
            }
            .suggest-button {
                position: absolute;
                bottom: 0px;
                left: 0;
                width: 100%;
                background: #fff;
                padding: 5px;
            }
        }
        .search-input {
            flex: 1;
            //   max-width: 200px;
        }
    }
    .checked-list {
        display: flex;
        flex-direction: row;
        align-items: center;
        flex-wrap: nowrap;
        overflow-x: auto;
        .el-tag {
            margin-right: 5px;
        }
    }
    .condition-label {
        display: inline-block;
        width: 65px;
        margin-right: 10px;
        text-align: right;
    }
}
</style>
