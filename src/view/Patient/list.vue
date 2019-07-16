<template>
    <layout id="patient">
        <div class="page-title">用户列表</div>
        <div class="query-condition">
            <el-row :gutter="40"
                    class="query-condition-group">
                <el-col :span="12"
                        class="condition-item">
                    <label class="condition-item-label">患者姓名</label>
                    <el-input v-model="queryName"
                              placeholder="请输入内容"
                              class="query-theme"></el-input>
                </el-col>
                <el-col :span="12"
                        class="condition-item">
                    <label class="condition-item-label">患者微信昵称</label>
                    <el-input v-model="queryNickName"
                              placeholder="请输入内容"
                              class="query-theme"></el-input>
                </el-col>
            </el-row>
            <el-row :gutter="40"
                    class="query-condition-group">
                <el-col :span="12"
                        class="condition-item">
                    <label class="condition-item-label">患者手机号</label>
                    <el-input v-model="queryPhone"
                              placeholder="请输入内容"
                              class="query-theme"></el-input>
                </el-col>
                <el-col :span="12"
                        class="condition-item">
                    <label class="condition-item-label">所属周期</label>
                    <el-select class="query-theme"
                               clearable
                               v-model="currentCycle">
                        <el-option v-for="item in cycleList"
                                   :key="item.name"
                                   :label="item.name"
                                   :value="item.id">
                        </el-option>
                    </el-select>
                </el-col>
            </el-row>
            <el-row :gutter="40"
                    class="query-condition-group">
                <el-col :span="12"
                        class="condition-item">
                    <label class="condition-item-label">请输入医院</label>
                    <el-input v-model="queryHospital"
                              placeholder="请输入医院"
                              class="query-theme"></el-input>
                </el-col>
                <el-col :span="12"
                        class="condition-item">
                    <label class="condition-item-label">请输入医生姓名</label>
                    <el-input v-model="queryDoctor"
                              placeholder="请输入医生姓名"
                              class="query-theme"></el-input>
                </el-col>
            </el-row>
            <el-row :gutter="40"
                    class="query-condition-group">
                <el-col :span="12"
                        class="condition-item">
                    <label class="condition-item-label">注册状态</label>
                    <el-select class="query-theme"
                               clearable
                               v-model="isComplete"
                               placeholder="请选择">
                        <el-option v-for="item in regStatus"
                                   :key="item.status"
                                   :label="item.name"
                                   :value="item.status">
                        </el-option>
                    </el-select>
                </el-col>
                <el-col :span="12"
                        class="condition-item">
                    <label class="condition-item-label">关注状态</label>
                    <el-select class="query-theme"
                               clearable
                               v-model="isSubscribe"
                               placeholder="请选择">
                        <el-option v-for="item in subsStatus"
                                   :key="item.status"
                                   :label="item.name"
                                   :value="item.status">
                        </el-option>
                    </el-select>
                </el-col>
            </el-row>
            <el-row :gutter="40"
                    class="query-condition-group">
                <el-col :span="12"
                        class="condition-item">
                    <label class="condition-item-label">加入时间</label>
                    <el-date-picker class="query-theme"
                                    v-model="joinTime"
                                    type="daterange"
                                    :editable="false"
                                    range-separator="至"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期">
                    </el-date-picker>
                </el-col>
                <el-col :span="12"
                        class="condition-item">
                    <label class="condition-item-label">用户注册时间</label>
                    <el-date-picker class="query-theme"
                                    v-model="regTime"
                                    type="daterange"
                                    :editable="false"
                                    range-separator="至"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期">
                    </el-date-picker>
                </el-col>
            </el-row>
            <el-button type="primary"
                       @click="search()">搜索</el-button>
            <el-button type="primary"
                       plain
                       @click="clearQuery()">清空条件</el-button>
        </div>
        <!-- <div class="send-notice">
             <el-button type="primary">管理</el-button>
        </div> -->
        <tableList @handleSizeChange="handleSizeChange"
                   @handleCurrentChange="handleCurrentChange"
                   @operateImg="jumpToDetails"
                   @operateClick="operateClick"
                   :loading="loading"
                   :tableData="patientList"
                   :totalNum="totalNum"
                   :colNameMap="colNameMap"
                   :currentPage="currentPage"
                   :pageSizes="[10, 25]"
                   :pageSize="currentPageSize"
                   ref="allPatientTable">
        </tableList>
        <el-dialog class="cycle-dialog"
                   :visible.sync="showCycleDialog"
                   :center="true"
                   :modal="true"
                   @close="closeHandle"
                   width="80%">
            <div slot="title">切换状态</div>
            <ul class="cycle-list">
                <li class="list-item"
                    v-for="(item, index) in cycleList"
                    :key="index"
                    @click="checkCycleItem(item)">
                    <div class="cycle-message">
                        <span class="cycle-name">{{item.name}}</span>
                        <span>{{item.description}}</span>
                    </div>
                    <img v-show="(checkedPatient && checkedPatient.current_cycle_type) === item.option_id"
                         src="/static/img/singlebox-checked.svg"
                         class="cycle-checked-icon">
                    <img v-show="(checkedPatient && checkedPatient.current_cycle_type) !== item.option_id"
                         src="/static/img/singlebox.svg"
                         class="cycle-checked-icon">
                </li>
            </ul>
            <span slot="footer"
                  class="dialog-footer">
                <el-button type="primary"
                           plain
                           @click="showCycleDialog = false">取 消</el-button>
                <el-button type="primary"
                           @click="changeCycleConfirm()">确 定</el-button>
            </span>
        </el-dialog>
    </layout>
</template>

<script>
import InputSuggestion from '../../components/Input.vue'

export default {
    data() {
        return {
            patientList: [],
            loading: true,
            totalNum: 0,
            colNameMap: [
                {
                    displayName: '患者ID',
                    key: 'patient_id',
                    width: '80px',
                    align: 'center'
                },
                {
                    displayName: '姓名',
                    key: 'name',
                    width: '100px',
                    align: 'center',
                    type: 'operation'
                },
                {
                    displayName: '微信昵称',
                    key: 'nickname',
                    width: '100px',
                    align: 'center',
                    type: 'operation'
                },
                {
                    displayName: '性别',
                    key: 'sexName',
                    width: '50px',
                    align: 'center'
                },
                {
                    displayName: '年龄',
                    key: 'user_id',
                    width: '50px',
                    align: 'center'
                },
                {
                    displayName: '头像',
                    key: 'head_img',
                    width: '80px',
                    align: 'center',
                    type: 'image'
                },
                {
                    displayName: '手机号',
                    key: 'phone',
                    width: '110px',
                    align: 'center'
                },
                {
                    displayName: '绑定医生',
                    key: 'real_name',
                    minWidth: '110px',
                    align: 'center'
                },
                {
                    displayName: '所属医院',
                    key: 'hospital_name',
                    align: 'center'
                },
                {
                    displayName: '周期状态',
                    key: 'cycle_name',
                    width: '110px',
                    align: 'center'
                },
                // {
                //     displayName: '来源',
                //     key: '',
                //     minWidth: '100px',
                //     align: 'center'
                // },
                {
                    displayName: '是否关注',
                    key: 'subscribe',
                    width: '100px',
                    align: 'center',
                    type: 'customize'
                },
                {
                    displayName: '是否注册',
                    key: 'is_complete',
                    width: '100px',
                    align: 'center',
                    type: 'customize'
                },
                {
                    displayName: '问诊次数',
                    key: 'qa_nums',
                    width: '100px',
                    align: 'center'
                },
                {
                    displayName: '加入时间',
                    key: 'create_time',
                    width: 80,
                    align: 'center'
                },
                {
                    displayName: '注册时间',
                    key: 'register_time',
                    width: 80,
                    align: 'center'
                },
                {
                    displayName: '操作',
                    align: 'center',
                    fixed: 'right',
                    type: 'operation',
                    operations: ['和我联系'],
                    width: 100
                }
            ],
            currentPage: 1,
            currentPageSize: 10,
            joinTime: ['', ''],
            regTime: ['', ''],
            // checkedHos: '',
            // hospitalList: [],
            queryName: '',
            queryNickName: '',
            queryHospital: '',
            queryPhone: '',
            queryDoctor: '',
            // checkedDoc: '',
            // doctorList: [],
            isComplete: '',
            regStatus: [
                {
                    name: '未注册',
                    status: 0
                },
                {
                    name: '已注册',
                    status: 1
                }
            ],
            isSubscribe: '',
            subsStatus: [{
                name: '未关注',
                status: 0
            },
            {
                name: '已关注',
                status: 1
            }],
            currentCycle: '',
            cycleList: [],
            showCycleDialog: false,
            checkedPatient: null
        }
    },
    components: {
        [InputSuggestion.name]: InputSuggestion
    },
    methods: {
        jumpToDetails(props) {
            this.$router.push({
                path: '/patient_list/patient_details',
                query: {
                    id: props.row.patient_id
                }
            })
        },
        operateClick(props, item) {
            if (props.column.label === '姓名' || props.column.label === '微信昵称') {
                this.jumpToDetails(props)
            } else if (props.column.label === '操作') {
                if (item === '和我联系') {
                    this.$router.push({
                        path: '/im_index',
                        query: {
                            patientId: props.row.patient_id,
                            currentPage: this.currentPage,
                            currentPageSize: this.currentPageSize
                        }
                    })
                } else if (item === '切换状态') {
                    this.showCycleDialog = true
                    props.row.current_cycle_type = props.row.cycle_type
                    this.checkedPatient = Object.assign({}, props.row)
                }
            }
        },
        // 切换页数
        handleCurrentChange(page) {
            this.currentPage = page
            this.getPatientList()
        },
        // 切换一页显示数量
        handleSizeChange(count) {
            this.currentPageSize = count
            this.getPatientList()
        },
        clearQuery() {
            this.isComplete = ''
            this.isSubscribe = ''
            this.queryDoctor = ''
            this.queryHospital = ''
            this.currentCycle = ''
            this.joinTime = ['', '']
            this.regTime = ['', '']
            this.queryName = ''
            this.queryNickName = ''
            this.currentPage = 1
            this.currentPageSize = 10
            this.getPatientList()
        },
        search() {
            this.currentPage = 1
            this.getPatientList()
        },
        getPatientList() {
            const data = {
                data: {
                    pageinfo: {
                        page: this.currentPage,
                        count: this.currentPageSize
                    },
                    condations: [],
                    nickname: this.queryNickName,
                    h_name: this.queryHospital,
                    d_name: this.queryDoctor,
                    cycleid: this.currentCycle,
                    subscribe: this.isSubscribe
                }
            }
            if (this.queryName) {
                data.data.condations.push({
                    name: `%${this.queryName}%`,
                    opt: 'like'
                })
            }
            if (this.queryPhone) {
                data.data.condations.push({
                    phone: `%${this.queryPhone}%`,
                    opt: 'like'
                })
            }
            if (this.isComplete || this.isComplete === 0) {
                data.data.condations.push({
                    is_complete: this.isComplete,
                    opt: '='
                })
            }
            if (this.joinTime) {
                this.joinTime[0] = this.joinTime[0] ? new Date(this.joinTime[0]).format('yyyy-MM-dd') : ''
                this.joinTime[1] = this.joinTime[1] ? new Date(this.joinTime[1]).format('yyyy-MM-dd') : ''
                if (this.joinTime[0]) {
                    data.data.condations.push({
                        create_time: this.joinTime[0],
                        opt: '>='
                    })
                }
                if (this.joinTime && this.joinTime[1]) {
                    data.data.condations.push({
                        create_time: this.joinTime[1],
                        opt: '<='
                    })
                }
            }
            if (this.regTime) {
                this.regTime[0] = this.regTime[0] ? new Date(this.regTime[0]).format('yyyy-MM-dd') : ''
                this.regTime[1] = this.regTime[1] ? new Date(this.regTime[1]).format('yyyy-MM-dd') : ''
                if (this.regTime[0]) {
                    data.data.is_regist = 1
                    data.data.condations.push({
                        register_time: this.regTime[0],
                        opt: '>='
                    })
                }
                if (this.regTime && this.regTime[1]) {
                    data.data.is_regist = 1
                    data.data.condations.push({
                        register_time: this.regTime[1],
                        opt: '<='
                    })
                }
            }
            this.loading = true
            this.$store.dispatch('getPatientLists', data).then(res => {
                this.loading = false
                if (res.data.list) {
                    res.data.list.forEach(item => {
                        item.subscribe =
                            item.subscribe === 0 ? '未关注' : '已关注'
                        item.is_complete =
                            item.is_complete === 0 ? '未注册' : '已注册'
                        item.name = item.name || ''
                        item.sexName =
                            item.sex === 1 ? '男' : item.sex === 2 ? '女' : ''
                        item.create_time = new Date(
                            item.create_time * 1000
                        ).format('yyyy-MM-dd hh:mm')
                        item.register_time = new Date(
                            item.register_time * 1000
                        ).format('yyyy-MM-dd hh:mm')
                    })
                    this.patientList = res.data.list
                } else {
                    this.patientList = []
                }
                // this.currentPageSize =
                //     (res.data.page && res.data.page.count) || 10
                this.totalNum = (res.data && res.data.total) || 0
                this.$refs.allPatientTable.$refs.pagination.internalCurrentPage =
                    this.currentPage
            })
        },

        getCycleList() {
            const data = {
                data: {
                    type: 'patient_cycle'
                }
            }
            this.$store.dispatch('getCycleList', data).then(res => {
                this.cycleList = res.data
            })
        },
        // getHospitalList() {
        //     const data = {
        //         data: {
        //             offset: 0,
        //             count: 20
        //         }
        //     }
        //     this.$store.dispatch('getHospitalList', data).then(res => {
        //         this.hospitalList = res.data
        //     })
        // },
        // getDoctorList() {
        //     const data = {
        //         data: {
        //             offset: 0,
        //             count: 100
        //         }
        //     }
        //     this.$store.dispatch('getDoctorList', data).then(res => {
        //         this.doctorList = res.data
        //     })
        // },
        closeHandle() {
            this.showCycleDialog = false
            this.checkedPatient = null
        },
        // 点击某状态事件checkCycleItem
        checkCycleItem(item) {
            this.checkedPatient.current_cycle_type = item.option_id
        },
        // 确认切换状态
        changeCycleConfirm() {
            const data = {
                data: {
                    pid: this.checkedPatient.patient_id,
                    cycle_type: this.checkedPatient.current_cycle_type
                }
            }
            this.$store.dispatch('changePatientCycle', data).then(res => {
                if (res.status === 0) {
                    this.$notify({
                        message: '切换状态成功！'
                    })
                    this.showCycleDialog = false
                    this.checkedPatient = null
                    this.getPatientList()
                }
            })
        }
    },
    mounted() {
        if (
            this.$route.query &&
            (this.$route.query.currentPage ||
                this.$route.query.currentPage === 1)
        ) {
            this.currentPage = this.$route.query.currentPage
            this.currentPageSize = this.$route.query.currentPageSize
        }

        this.getPatientList()
        this.getCycleList()
        // this.getHospitalList()
        // this.getDoctorList()
    }
}
</script>

<style lang="less">
#patient {
    .query-condition {
        padding: 10px;
        // .condition-list {
        //     padding: 0 0 10px 0;
        //     &.last {
        //         margin: 4px 0;
        //     }
        //     label {
        //         margin-right: 5px;
        //     }
        //     .condition-label {
        //         display: inline-block;
        //         width: 65px;
        //         text-align: right;
        //     }
        //     .query-theme {
        //         max-width: 200px;
        //     }
        // }
    }
    .table-content-img {
        max-width: 60px;
        min-width: 50px;
        border-radius: 50%;
        cursor: pointer;
    }
    .cycle-dialog {
        .cycle-list {
            border-bottom: 1px solid #f2f2f3;
            .list-item {
                cursor: pointer;
                border-top: 1px solid #f2f2f3;
                padding: 15px 0;
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                align-items: center;
                .cycle-message {
                    display: flex;
                    flex-direction: column;
                    .cycle-name {
                        font-weight: bold;
                        font-size: 16px;
                    }
                }
                .cycle-checked-icon {
                    width: 30px;
                }
            }
        }
    }
    .send-notice {
        background: #fff;
        text-align: right;
        padding: 10px 10px 0;
    }
    .el-table--border th:first-child .cell,
    .el-table--border td:first-child .cell {
        padding-left: 0px;
    }
    .el-table--border td .cell {
        padding: 0 4px;
    }
}
</style>
