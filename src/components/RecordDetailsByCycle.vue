<template>
    <div class="record-cycle-detail">
        <!-- 上传日期 -->
        <div class="cycle-detail">
            <div class="detail-item"
                 v-if="details.upload_time">
                <span>上传日期</span>
                <span>{{details.upload_time}}</span>
            </div>
        </div>
        <!-- 建档详情展示 -->
        <div class="cycle-detail"
             v-if="cycleId === 10">
            <div class="detail-item"
                 v-if="details.build_time">
                <span>建档日期</span>
                <span>{{details.build_time}}</span>
            </div>
        </div>
        <!-- 促排详情展示 -->
        <div class="cycle-detail"
             v-if="cycleId === 11">
            <div class="detail-item"
                 v-if="details.cycle_nums">
                <span>第几次促排周期</span>
                <span>{{details.cycle_nums}}</span>
            </div>
            <div class="detail-item"
                 v-if="details.promote_plan">
                <span>本次促排方案</span>
                <span>{{details.promote_plan_name}}</span>
            </div>
            <div class="detail-item"
                 v-if="details.injection_time">
                <span>打夜针时间</span>
                <span>{{details.injection_time}}</span>
            </div>
            <div class="detail-item"
                 v-if="details.promote_time">
                <span>促排时间</span>
                <span>{{details.promote_time}}</span>
            </div>
        </div>
        <!-- 取卵详情展示 -->
        <div class="cycle-detail"
             v-if="cycleId === 12">
            <div class="detail-item"
                 v-if="details.cycle_nums">
                <span>第几次取卵周期</span>
                <span>{{details.cycle_nums}}</span>
            </div>
            <div class="detail-item"
                 v-if="details.egg_time">
                <span>本次取卵时间</span>
                <span>{{details.egg_time}}</span>
            </div>
            <div class="detail-item"
                 v-if="details.egg_nums">
                <span>本次取卵个数</span>
                <span>{{details.egg_nums}}</span>
            </div>
            <div class="detail-item"
                 v-if="details.sperm_plan">
                <span>受精方法</span>
                <span>{{details.sperm_plan}}</span>
            </div>
            <div class="detail-item"
                 v-if="details.mature_egg_nums">
                <span>成熟卵子个数</span>
                <span>{{details.mature_egg_nums}}</span>
            </div>
            <div class="detail-item"
                 v-if="details.mature_embryo_nums">
                <span>成功胚胎个数</span>
                <span>{{details.mature_embryo_nums}}</span>
            </div>
        </div>
        <!-- 移植详情展示 -->
        <div class="cycle-detail"
             v-if="cycleId === 13">
            <div class="detail-item"
                 v-if="details.cycle_nums">
                <span>第几次移植周期</span>
                <span>{{details.cycle_nums}}</span>
            </div>
            <div class="detail-item"
                 v-if="details.transplant_plan">
                <span>本次移植方案</span>
                <span>{{details.transplant_plan_name}}</span>
            </div>
            <div class="detail-item"
                 v-if="details.transplant_time">
                <span>本次移植时间</span>
                <span>{{details.transplant_time}}</span>
            </div>
            <div class="detail-item"
                 v-if="details.transplant_nums">
                <span>本次移植个数</span>
                <span>{{details.transplant_nums}}</span>
            </div>
        </div>
        <!-- 保胎详情展示 -->
        <div class="cycle-detail"
             v-if="cycleId === 15">
            <div class="detail-item"
                 v-if="details.cycle_nums">
                <span>第几次保胎周期</span>
                <span>{{details.cycle_nums}}</span>
            </div>
            <div class="detail-item"
                 v-if="details.tocolysis_time">
                <span>一超二超时间</span>
                <span>{{details.tocolysis_time}}</span>
            </div>
            <div class="detail-item"
                 v-if="details.is_intrauterine">
                <span>是否宫内宫外</span>
                <span>{{details.is_intrauterine}}</span>
            </div>
            <div class="detail-item"
                 v-if="details.is_single">
                <span>是否单胎双胎</span>
                <span>{{details.is_single}}</span>
            </div>
            <div class="detail-item"
                 v-if="details.is_heart">
                <span>有无心搏</span>
                <span>{{details.is_heart}}</span>
            </div>
        </div>
        <!-- 胚胎详情（仅取卵和保胎阶段有） -->
        <div class="detail-embryo"
             v-if="(cycleId === 12 || cycleId === 13) && details.embryoDetails && details.embryoDetails.length">
            <div class="details-title">
                <div class="inner">胚胎详情</div>
            </div>
            <div class="empryo-details-inner">
                <ul class="details-table-td th">
                    <li>序号</li>
                    <li>胚胎类型</li>
                    <li>胚胎天数</li>
                </ul>
                <ul class="details-table-td td"
                    v-for="(v ,k) in details.embryoDetails"
                    :key="k"
                    :class="{'td-sigle' : k % 2 === 0, 'td-double': k % 2 === 1}">
                    <li>{{ k+1 }}</li>
                    <li>{{ v.type}}</li>
                    <li>{{ v.date }}</li>
                </ul>
            </div>
        </div>
        <!-- 通用备注和病历 -->
        <div class="detail-img-item"
             v-if="details.img_urls && details.img_urls.length > 0">
            <span class="item-record-img"
                  v-for="(item, index) in details.img_urls"
                  :key="index"
                  @click="showPreview(details.img_urls, index)">
                <img class="record-img-inner"
                     :src="item">
            </span>
        </div>
        <div class="detail-remrk-item"
             v-if="details.remark">
            <div class="remrk-item-title">备注</div>
            <div class="remrk-item-content">{{details.remark}}</div>
        </div>
    </div>
</template>

<script>
import UploadImg from './UploadImg'
// import {
//     ImagePreview
// } from 'vant'

export default {
    name: 'cycle-detail',
    props: {
        cycleId: {
            type: Number,
            default: 10
        },
        details: {
            type: Object,
            default: function() {
                return {}
            }
        }
    },
    components: {
        [UploadImg.name]: UploadImg
    },
    methods: {
        showPreview(list, index) {
            // ImagePreview({
            //     images: list,
            //     startPosition: index
            // })
        }
    }
}
</script>

<style lang="less">
.record-cycle-detail {
    background: #fff;
    margin-bottom: 5px;
    &.record-cycle-detail:last-child {
        margin-bottom: 0;
    }
    .detail-item {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        padding: 6px 10px;
        border-bottom: 1px solid #f2f2f2;
    }
    .detail-img-item {
        padding: 10px 10px 0;
        display: flex;
        flex-wrap: wrap;
        border-bottom: 1px solid #f2f2f2;
        .item-record-img {
            width: 75px;
            height: 75px;
            overflow: hidden;
            margin: 0 10px 10px 0;
            .record-img-inner {
                width: 100%;
                height: auto;
                min-height: 75px;
            }
        }
    }
    .detail-remrk-item {
        padding: 10px;
        .remrk-item-content {
            margin-top: 5px;
        }
    }
    .detail-embryo {
        border-bottom: 1px solid #f2f2f2;
        .details-title {
            padding: 10px 0;
            .inner {
                padding: 0 10px;
            }
        }
        .empryo-details-inner {
            margin: 0 10px 10px;
            border: 1px solid #f2f2f2;
        }
        .details-table-td {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            padding-right: 16px;
            border-top: 1px solid #f2f2f3;
            > li {
                flex: 1;
                text-align: center;
                padding: 6px 0;
            }
            &.th {
                color: @default-color;
                & > li {
                    padding: 10px 0;
                    border-bottom: 1px solid #f2f2f3;
                }
            }
            &.td {
                padding-right: 10px;
            }
            &.td.td-sigle {
                background: #fef6f6;
            }
        }
    }
}
</style>
