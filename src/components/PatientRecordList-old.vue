<template>
    <el-row class="patient-record">
        <!-- 历史记录列表 -->
        <el-col :span="12"
                :xs="24"
                :sm="12"
                class="record-list-wrapper">
            <h5 class="message-title">历史记录信息</h5>
            <div class="query-condition">
                <el-select v-model="checkedType"
                           placeholder="请选择">
                    <el-option v-for="item in searchTypeList"
                               :key="item.value"
                               :label="item.label"
                               :value="item.value">
                    </el-option>
                </el-select>
                <el-button type="primary">搜索</el-button>
            </div>
            <el-collapse class="record-collapse">
                <el-collapse-item class="record-list-title"
                                  v-for="(item, index) in recordList"
                                  :key="index">
                    <template slot="title"
                              class="title-wrapper">
                        <span>{{item.c_time.substring(0, 16)}}</span>
                        <span>上传xxx</span>
                        <span>{{item.r_status ? '已录入': '未录入'}}</span>
                    </template>
                    <div>22222</div>
                </el-collapse-item>
            </el-collapse>
            <span>总数：{{totalNum}}</span>
            <el-pagination @current-change="handleCurrentChange"
                           :current-page.sync="pageValue"
                           :page-sizes="pageSizes"
                           :page-size="pageSize"
                           layout="sizes, prev, pager, next"
                           :total="totalNum"
                           ref="pagination">
            </el-pagination>
        </el-col>
        <!-- 日历 -->
        <el-col :span="12"
                :xs="24"
                :sm="12"
                class="calendar-wrapper">
            <calendar ref="canlendar"
                      :startdateone="startTime"
                      :enddateone="endTime"
                      :outeggtime="outEggTime"
                      :sepcialday="sepcial_days"></calendar>
        </el-col>
    </el-row>
</template>

<script>
import Calendar from './Calendar/body.vue'

export default {
    name: 'recordlist',
    data() {
        return {
            recordList: [],
            pageValue: 1,
            pageSizes: [10],
            pageSize: 10,
            totalNum: 0,
            demoEvents: [],
            startTime: '',
            endTime: '',
            outEggTime: '',
            sepcial_days: [],
            checkedType: '全部',
            searchTypeList: [{
                label: '全部',
                value: '全部'
            }, {
                label: '用药',
                value: '用药'
            }, {
                label: '检查',
                value: '检查'
            }, {
                label: '手术',
                value: '手术'
            }, {
                label: '就诊',
                value: '就诊'
            }]
        }
    },
    props: {
        pId: ''
    },
    methods: {
        handleDayChange() {
        },
        getCycleRecorList() {
            const data = {
                data: {
                    pid: this.$route.query.id,
                    page: this.pageValue,
                    count: this.pageSize
                }
            }
            this.$store.dispatch('getCycleRecorList', data).then((res) => {
                this.recordList = res.data.list
                this.totalNum = res.data.page.total || 0
            })
        },
        handleCurrentChange(val) {
            this.pageValue = val
            this.getCycleRecorList()
        }
    },
    components: {
        [Calendar.name]: Calendar
    },
    mounted() {
        this.getCycleRecorList()
    }
}
</script>

<style lang="less">
@media screen and (min-width: 768px) {
    .__vev_calendar-wrapper {
        // box-shadow: #ccc -7px -7px 4px;
        box-shadow: -4px -7px 5px #bdbdbd;
    }
    .__vev_calendar-wrapper .cal-wrapper {
        width: 100%;
        padding: 0px;
        border: 1px solid rgba(153, 153, 153, 0.4);
    }
}
.patient-record {
    .cal-wrapper {
        width: 100%;
        box-shadow: 2px 4px 5px #bdbdbd;
    }
    .events-wrapper {
        display: none;
    }
    .record-list-wrapper {
        padding: 0px 20px 20px 0;
        .record-collapse {
            margin: 20px 0;
        }
    }
    .calendar-wrapper {
        padding: 0 10px;
        border: 1px solid rgba(153, 153, 153, 0.5);
        box-shadow: rgba(153, 153, 153, 1) 0px 7px 15px;
    }
    .el-collapse {
        border-top: 0;
        border-bottom: 0;
    }
    .el-collapse-item__header {
        background: rgba(26, 179, 148, 0.25);
        height: 30px;
        line-height: 30px;
        padding: 0 10px;
    }
    .record-list-title {
        width: 100%;
        .title-wrapper {
            width: 100%;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
        }
        .el-collapse-item {
            > div {
                width: 100%;
            }
        }
        .el-collapse-item__header {
            width: 100%;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            .el-collapse-item__arrow {
                display: none;
            }
        }
    }
}
</style>
