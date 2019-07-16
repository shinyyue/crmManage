<template>
    <div id="upload-record">
        <van-tabs v-model="currentTab"
                  v-if="cycleNumList && cycleNumList.length > 0"
                  :line-width="60">
            <van-tab v-for="(item, index) in cycleNumList"
                     :title="`第${index + 1}周期`"
                     :key="index">
                <ul class="cycle-item"
                    v-for="(cItem, cIndex) in recordList"
                    :key="`cycle_${cIndex}`">
                    <div class="cycle-item-title"
                         v-show="cItem.list && cItem.list.length > 0">{{cItem.item_name}}</div>
                    <div class="cycle-item-content"
                         v-if="cItem.list && cItem.list.length > 0">
                        <cycle-detail :cycleId="cItem.item"
                                      :details="rItem"
                                      v-for="(rItem, rIndex) in cItem.list"
                                      :key="`record_${rIndex}`"></cycle-detail>
                    </div>
                </ul>
            </van-tab>
        </van-tabs>
        <div class="record-list-none"
             v-else>暂无数据</div>
    </div>
</template>

<script>
import CycleDetail from './RecordDetailsByCycle'
import { Tab, Tabs } from 'vant'
import 'vant/lib/index.css'

export default {
    name: 'record-list',
    data() {
        return {
            currentTab: 0,
            cycleNumList: [],
            recordList: []
        }
    },
    props: {
        pId: {}
    },
    components: {
        [Tab.name]: Tab,
        [Tabs.name]: Tabs,
        [CycleDetail.name]: CycleDetail
    },
    watch: {
        currentTab: {
            handler(val) {
                this.getRecordList()
            }
        },
        pId: {
            handler(val) {
                if (val) {
                    this.getPatientCycleList()
                }
            },
            immediate: true
        }
    },
    methods: {
        getRecordList() {
            const data = {
                data: {
                    patient_id: Number(this.pId),
                    cycle_index: this.cycleNumList[this.currentTab]
                }
            }
            this.$store.dispatch('getRecordList', data).then(res => {
                this.recordList = res.data
            })
        },
        getPatientCycleList() {
            const data = {
                data: {
                    patient_id: Number(this.pId)
                }
            }
            this.$store.dispatch('getPatientCycleList', data).then(res => {
                if (res.status === 1 && res.data && res.data.length > 0) {
                    this.cycleNumList = res.data
                    this.currentTab = res.data.length - 1
                } else {
                    this.recordList = []
                }
            })
        }
    },
    mounted() {
    }
}
</script>

<style lang="less">
#upload-record {
    .cycle-item {
        background: #f2f2f2;
        .cycle-item-title {
            padding: 6px 10px;
            background: #f2f2f2;
            border-bottom: 1px solid #f2f2f2;
            font-size: 16px; /*px*/
            font-weight: bold;
        }
    }
    .record-list-none {
        padding: 20px 0;
        text-align: center;
        color: #666;
    }
    .van-tab,
    .van-tab--active,
    .van-tabs__line {
        max-width: 130px;
    }
    .van-tabs__wrap {
        border-bottom: 1px solid #f2f2f2;
    }
    .van-tab--active {
        color: @default-color;
    }
    .van-tabs__line {
        background-color: @default-color;
    }
}
</style>
