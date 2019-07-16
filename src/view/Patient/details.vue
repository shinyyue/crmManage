<template>
    <layout id="patient-details">
        <div class="page-title">用户详情</div>
        <div class="patient-info">
            <el-row :gutter="20">
                <el-col :xs="24"
                        :sm="10"
                        :md="8"
                        :lg="6"
                        :xl="6"
                        class="info-item">
                    <div>姓名：
                        <span class="info-item-name">{{pDetails.name || '-'}}</span>
                    </div>
                    <div>微信昵称：
                        <span class="info-item-name">{{pDetails.nickname || '-'}}</span>
                    </div>
                    <div>性别：
                        <span class="info-item-name">{{pDetails.sex === 1 ? '男' : (pDetails.sex === 2 ? '女' : '-')}}</span>
                    </div>
                    <div>年龄：
                        <span class="info-item-name">{{pDetails.birth}}岁</span>
                    </div>
                    <div>联系电话：
                        <span class="info-item-name">{{pDetails.phone || '-'}}</span>
                    </div>
                    <div>
                        <span>医院：
                            <span class="info-item-name">{{pDetails.hospital_name}}</span>
                        </span>
                        <!-- <el-button class=""
                                   type="text"
                                   @click="changeDoctor()">点击绑定医生</el-button> -->
                    </div>
                    <div>
                        <span>医生：
                            <span class="info-item-name">{{pDetails.real_name}}</span>
                        </span>
                    </div>
                </el-col>
                <el-col :xs="24"
                        :sm="11"
                        :md="13"
                        :lg="6"
                        :xl="6"
                        class="info-item">
                    <div>
                        <span>周期状态：
                            <span class="info-item-name">{{pDetails.cycle_name}}</span>
                        </span>
                        <!-- <el-button class=""
                                   type="text"
                                   @click="showCycleDialog = true">切换周期</el-button> -->
                    </div>
                    <div>是否关注：
                        <span class="info-item-name">{{pDetails.subscribe === 1 ? '已关注': '未关注'}}</span>
                    </div>
                    <div>是否完善信息：
                        <span class="info-item-name">{{pDetails.is_complete === 1 ? '已完善' : '未完善'}}</span>
                    </div>
                    <div>加入时间：
                        <span class="info-item-name">{{pDetails.create_time}}</span>
                    </div>
                    <div>
                        <el-button type="primary"
                                   @click="jumpToContact()">和我联系</el-button>
                    </div>
                    <!-- <div>
                        <span>医生自定义分类：
                            <span class="info-item-name">{{pDetails.name || '暂无'}}</span>
                        </span>
                    </div>
                    <div>
                        <span>顾问定义标签：
                            <span class="info-item-name">{{pDetails.tag || '暂无'}}</span>
                        </span>
                        <el-button class=""
                                   type="text"
                                   @click="showSystemTag = true">标签管理</el-button>
                    </div> -->
                </el-col>
            </el-row>
        </div>
        <div class="history-list">
            <el-tabs v-model="activeTabs"
                     @tab-click="handleClick">
                <!-- <el-tab-pane label="健康档案"
                             name="0">
                    <healthlist :pId="pId"
                                :pDetails="pDetails"
                                @saveSuccess="saveHealthSuccess"></healthlist>
                </el-tab-pane> -->
                <el-tab-pane label="试管档案"
                             name="0"
                             class="record-message">
                    <record-list :pId="pId"></record-list>
                </el-tab-pane>
                <!-- <el-tab-pane label="待办事项"
                             name="2">
                    <todolist :pId="pId"
                              :tabType="2"></todolist>
                </el-tab-pane>
                <el-tab-pane label="推送通知"
                             name="3">
                    <tableList @handleSizeChange="handleSizeChange"
                               @handleCurrentChange="handleCurrentChange"
                               :loading="loading"
                               :tableData="pushList"
                               :totalNum="totalNum"
                               :colNameMap="colNameMap"
                               :currentPage="currentPage"
                               :pageSizes="[10, 25, 50, 100]"
                               :pageSize="currentPageSize"
                               ref="allPatientTable"></tableList>
                </el-tab-pane> -->
            </el-tabs>
        </div>
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
                    <img v-show="(pDetails && pDetails.current_cycle_type) === item.option_id"
                         src="/static/img/singlebox-checked.svg"
                         class="cycle-checked-icon">
                    <img v-show="(pDetails && pDetails.current_cycle_type) !== item.option_id"
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
        <el-dialog :visible.sync="showSystemTag"
                   class="tag-dialog"
                   @close="sysTagCloseHandle"
                   width="80%">
            <div slot="title">系统标签</div>
            <div>
                <el-button @click="checkedSysTag(item)"
                           class="tag-item"
                           :class="{'active': item.checked}"
                           v-for="(item, index) in systemTagList"
                           :key="index">{{item.name}}</el-button>
            </div>
            <span slot="footer"
                  class="dialog-footer">
                <el-button type="primary"
                           plain
                           @click="changeSysTagCancle()">取 消</el-button>
                <el-button type="primary"
                           @click="changeSysTagConfirm()">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog :visible.sync="showDoctorListDialog"
                   class="doctor-dialog"
                   width="80%"
                   @close="doctorCloseHandle">
            <div slot="title">切换绑定医生</div>
            <div>
                <tableList ref="doctorTable"
                           @rowClick="rowClick"
                           @handleCurrentChange="handleDoctorCurrentChange"
                           :loading="doctorLoading"
                           :tableData="doctorList"
                           :totalNum="doctorTotalNum"
                           :colNameMap="doctorColNameMap"
                           :currentPage="doctorCurrentPage"
                           :pageSizes="[10]"
                           :pageSize="currentPageSize"></tableList>
            </div>
            <span slot="footer"
                  class="dialog-footer">
                <el-button type="primary"
                           plain
                           @click="showDoctorListDialog = false">取 消</el-button>
                <el-button type="primary"
                           @click="changeDoctorConfirm()">确 定</el-button>
            </span>
        </el-dialog>
    </layout>
</template>

<script>
import RecordList from '../../components/PatientRecordList'
import TodoList from '../../components/PatientTodoList'
import HealthList from '../../components/PatientHealthList'


export default {
    data() {
        return {
            pId: '',
            pDetails: {},
            activeTabs: '0',
            loading: false,
            doctorLoading: false,
            pushList: [],
            totalNum: 0,
            colNameMap: [{
                displayName: '标题',
                key: 'title',
                align: 'center',
                type: 'linnk'
            }, {
                displayName: '内容',
                key: 'content',
                align: 'center'
            }, {
                displayName: '发送时间',
                key: 'sendTime',
                align: 'center'
            }, {
                displayName: '发送者',
                key: 'sender',
                align: 'center'
            }],
            doctorColNameMap: [{
                displayName: '选择',
                key: 'checked',
                align: 'center',
                type: 'radio',
                width: '50px'
            }, {
                displayName: '姓名',
                key: 'real_name',
                align: 'center',
                width: '100px'
            }, {
                displayName: '所属医院',
                key: 'h_name',
                align: 'center'
            }, {
                displayName: '所属科室',
                key: 'h_name',
                align: 'center'
            }],
            currentPage: 1,
            currentPageSize: 10,
            showCycleDialog: false,
            showDoctorListDialog: false,
            cycleList: [],
            doctorList: [],
            systemTagList: [],
            showSystemTag: false,
            doctorTotalNum: 0,
            doctorCurrentPage: 1,
            checkedDoctor: null
        }
    },
    filters: {
        age(val) {
            if (val && val.length > 5) {
                const currentYear = Number(new Date().format('yyyy'))
                const birthYear = Number(val.substring(0, 4))
                return currentYear - birthYear > 0 ? currentYear - birthYear : 0
            }
            return ''
        },
        timeFormat(val) {
            if (val) {
                return new Date(val * 1000).format('yyyy-MM-dd hh:mm:ss')
            }
            return ''
        }
    },
    components: {
        [RecordList.name]: RecordList,
        [TodoList.name]: TodoList,
        [HealthList.name]: HealthList
    },
    methods: {
        handleClick(tab) {
        },
        handleSizeChange() { },
        handleCurrentChange() { },
        getPatientInfo() {
            const data = {
                data: {
                    pid: this.pId
                }
            }
            this.$store.dispatch('getPaitentDetails', data).then(res => {
                if (res.data) {
                    res.data.current_cycle_type = res.data.current_cycle
                    this.pDetails = res.data
                    if (this.cycleList && this.cycleList.length > 0) {
                        this.cycleList.forEach(item => {
                            if (item.option_id === res.data.current_cycle) {
                                this.pDetails.current_cycle_name = item.name
                            }
                        })
                    }
                }
            })
        },
        getDoctorList() {
            const data = {
                data: {
                    offset: 0,
                    count: 10
                }
            }
            this.$store.dispatch('getDoctorList', data).then((res) => {
                if (res.list && res.list.length > 0) {
                    res.list.forEach(item => {
                        if (item.doctor_id === this.pDetails.current_doctor_id) {
                            item.checked = 1
                        } else {
                            item.checked = 0
                        }
                    })
                }
                this.doctorList = res.list
                this.doctorTotalNum = res.total
            })
        },
        getCycleList() {
            const data = {
                data: {}
            }
            this.$store.dispatch('getCycleList', data).then(res => {
                this.cycleList = res.data
                this.getPatientInfo()
            })
        },
        getSystemTagList() {
            const data = {
                data: {}
            }
            this.$store.dispatch('getSystemTagList', data).then((res) => {
                if (res.data && res.data.length > 0) {
                    res.data.forEach((item) => {
                        // todo 患者已选标签checked设置为1
                        item.checked = 0
                        this.systemTagList.push(item)
                    })
                }
            })
        },
        // 点击某状态事件checkCycleItem
        checkCycleItem(item) {
            this.pDetails.current_cycle_type = item.option_id
        },
        closeHandle() {
            this.showCycleDialog = false
            this.pDetails.current_cycle_type = this.pDetails.current_cycle
        },
        sysTagCloseHandle() {},
        // 确认切换状态
        changeCycleConfirm() {
            const data = {
                data: {
                    pid: this.pId,
                    cycle_type: this.pDetails.current_cycle_type
                }
            }
            this.$store.dispatch('changePatientCycle', data).then((res) => {
                if (res.data) {
                    this.$notify({
                        message: '切换状态成功！'
                    })
                    this.showCycleDialog = false
                    this.getPatientInfo()
                }
            })
        },
        // 选择系统标签
        checkedSysTag(item) {
            if (item.checked === 0) {
                item.checked = 1
            } else {
                item.checked = 0
            }
        },
        // 保存用户信息成功后更新患者信息
        saveHealthSuccess() {
            this.getPatientInfo()
        },
        handleDoctorCurrentChange() { },
        changeDoctor() {
            this.showDoctorListDialog = true
            this.getDoctorList()
        },
        // 选中绑定医生
        rowClick(row) {
            this.doctorList.forEach(item => {
                if (item.doctor_id === row.doctor_id) {
                    item.checked = 1
                    this.checkedDoctor = item
                } else {
                    item.checked = 0
                }
            })
        },
        changeSysTagConfirm() {
            const checkedTags = []
            this.systemTagList.forEach((item) => {
                if (item.checked) {
                    checkedTags.push(item)
                }
            })
            // todo 调用顾问为定义打标签接口
        },
        changeSysTagCancle() {
            this.showSystemTag = false
        },
        changeDoctorConfirm() {
            const data = {
                data: {
                    pid: this.pId,
                    did: this.checkedDoctor.doctor_id
                }
            }
            this.$store.dispatch('changeCurrentDoctor', data).then((res) => {
                if (res.status === 0) {
                    this.$notify({
                        message: '切换成功！'
                    })
                    this.showDoctorListDialog = false
                    this.getPatientInfo()
                }
            })
        },
        doctorCloseHandle() {
            this.checkedDoctor = null
        },
        getPatientDetails() {
            const data = {
                data: {
                    patient_id: Number(this.pId)
                }
            }
            this.$store.dispatch('getPatientDetails', data).then(res => {
                this.pDetails = res.data
            })
        },
        jumpToContact() {
            this.$router.push({
                path: '/im_index',
                query: {
                    patientId: Number(this.pId)
                }
            })
        }
    },
    mounted() {
        const query = this.$route.query
        if (query && query.id) {
            this.pId = query.id
            this.getPatientDetails()
            // this.getCycleList()
            // this.getSystemTagList()
        } else {
            this.$notify.error({
                message: '找不到该用户'
            })
            return false
        }
    }
}
</script>

<style lang="less">
#patient-details {
    .patient-info {
        background: #fff;
        margin: 10px 0;
        padding: 20px;
        .info-item {
            font-size: 14px;
            line-height: 1.6;
            .info-item-name {
                color: #666;
            }
            .patient-avator {
                max-width: 132px;
                width: 100%;
                // height: 100px;
                border: 1px solid #ccc;
            }
        }
        .el-button {
            padding: 2px 10px;
        }
    }
    .history-list {
        background: #fff;
        padding: 10px 20px;
        .male-message {
            .message-list {
                margin-bottom: 10px;
            }
        }
        .message-editor {
            float: right;
        }
        .message-list {
            font-size: 14px;
            color: #666;
        }
        .change-hospital {
            padding-top: 10px;
            border-top: 1px solid #ccc;
        }
        .save-message {
            text-align: center;
            margin: 20px 0 10px;
            .el-button {
                padding: 6px 30px;
            }
        }
        .record-message {
            .message-title {
                margin-bottom: 10px;
            }
            .record-list-title {
                margin-bottom: 10px;
                .el-collapse-item__content {
                    padding: 10px;
                    border: 1px solid #f2f2f3;
                }
                .el-icon-arrow-right:before {
                    content: "";
                }
            }
        }
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
    .tag-dialog {
        .tag-item {
            margin: 0 10px 10px 0;
            &.active {
                background: @default-color;
                color: #fff;
            }
        }
    }
    .doctor-dialog {
        .el-table--border th,
        .el-table--border td {
            border-right: none;
        }
    }
}
</style>
