<template>
    <div>
        <div class="full-calendar-header">
            <div class="header-left">
                <slot name="header-left">
                    <span class="prev-month"
                          @click.stop="goPrev">{{leftArrow}}</span>
                </slot>
            </div>
            <div class="header-center">
                <span class="title">{{title}}</span>
            </div>
            <div class="header-right"
                 style="text-align: right">
                <slot name="header-right">
                    <span class="next-month"
                          @click.stop="goNext">{{rightArrow}}</span>
                </slot>
            </div>
        </div>
        <div class="full-calendar-body">
            <div class="weeks">
                <strong class="week"
                        v-for="(week, index) in weekNames"
                        :key="index">{{week}}</strong>
            </div>
            <div class="dates"
                 ref="dates">
                <div class="dates-bg">
                    <div class="week-row"
                         v-for="(week, index) in currentDates"
                         :key="index">
                        <div class="day-cell"
                             v-for="(day, dIndex) in week"
                             :key="dIndex"
                             :class="{'today' : day.isToday,
                             'selected': day.selected,
              'not-cur-month' : !day.isCurMonth}"
                             @click="showalert(day, dIndex, week, index)">
                            <!-- {{currentDate.format('yyyy-MM-dd')}}{{day.date.format('yyyy-MM-dd')}} -->
                            <p class="day-number"
                               v-bind:class="[{'is-start': isStart(startdateone, startdatetwo, startdatethree, day.date) , 'is-end' : isEnd(enddateone, enddatetwo, enddatethree, day.date), 'is-limit' : isLimit(day.date), 'is-egg-start': isOut(outeggstart, day.date), 'is-egg-end': isOut(outeggend, day.date), 'is-egg-limit': isEggLimit(day.date), 'is-egg-out': isOut(outeggtime, day.date)}]">{{day.monthDay}}</p>
                            <img src="/static/img/heart@2x.png"
                                 class="heart"
                                 v-if="isImportant(day.date)">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script type="text/babel">
import dateFunc from "./dateFunc"
import langSets from "./langSets"
import event from "./Event.js"
export default {
    name: 'calendar',
    props: {
        lang: {
            type: String,
            default: "zh"
        },
        patient: {
            type: Number | String,
            default: ""
        },
        startdateone: {
            type: Number | String,
            default: ""
        },
        startdatetwo: {
            type: Number | String,
            default: ""
        },
        startdatethree: {
            type: Number | String,
            default: ""
        },
        enddatethree: {
            type: Number | String,
            default: ""
        },
        enddatetwo: {
            type: Number | String,
            default: ""
        },
        enddateone: {
            type: Number | String,
            default: ""
        },
        outeggstart: {
            type: Number | String,
            default: ""
        },
        outeggend: {
            type: Number | String,
            default: ""
        },
        outeggtime: {
            type: Number | String,
            default: ""
        },
        sepcialday: {
            type: Array,
            default: function () {
                return []
            }
        },
        firstDay: {
            type: Number | String,
            validator(val) {
                let res = parseInt(val)
                return res >= 0 && res <= 6
            },
            default: 0
        },
        titleFormat: {
            type: String,
            default() {
                return langSets[this.lang].titleFormat
            }
        },
        monthNames: {
            type: Array,
            default() {
                return langSets[this.lang].monthNames
            }
        },
        weekNames: {
            type: Array,
            default() {
                let arr = langSets[this.lang].weekNames
                return arr.slice(this.firstDay).concat(arr.slice(0, this.firstDay))
            }
        }
    },
    created() {
        this.dispatchEvent()
        this.currentDates = this.getCalendar()
    },
    data() {
        return {
            weekMask: [1, 2, 3, 4, 5, 6, 7],
            isLismit: true,
            eventLimit: 3,
            showMore: false,
            morePos: {
                top: 0,
                left: 0
            },
            selectDay: {},
            title: "",
            leftArrow: "<",
            rightArrow: ">",
            currentDate: new Date(),
            headDate: new Date(),
            currentDates: null
        }
    },
    watch: {
        currentDate(val) {
            if (!val) return
            this.headDate = val
        },
        currentDates: {
            deep: true,
            handler: val => {
                return val
            }
        }
    },
    methods: {
        changeDate(day, dIndex, week, wIndex) {
            this.currentDates.forEach((_week, _wIndex) => {
                _week.forEach((_day, _dIndex) => {
                    if (dIndex == _dIndex && wIndex == _wIndex) {
                        _day.selected = true
                    } else {
                        _day.selected = false
                    }
                })
            })
        },
        showalert(day, dIndex, week, wIndex) {
            var index = 0
            for (var i = this.sepcialday.length - 1; i >= 0; i--) {
                var time = new Date(this.sepcialday[i].time * 1000).format(
                    "yyyy-MM-dd"
                )
                if (
                    this.headDate.format("yyyy") !== day.date.format("yyyy") ||
                    this.headDate.format("MM") !== day.date.format("MM")
                ) {
                    return
                }
                if (time == day.date.format("yyyy-MM-dd")) {
                    this.changeDate(day, dIndex, week, wIndex)
                    // 有代办事项时触发的事件
                    event.$emit("showTitle", this.sepcialday[i].data, time)
                    return
                } else {
                    index = index + 1
                }
            }
            if (index == this.sepcialday.length) {
                this.changeDate(day, dIndex, week, wIndex)
                // 无代办事项时触发的事件
                event.$emit("showDynamic", day.date.format("yyyy-MM-dd"))
            }
        },
        isImportant(date) {
            for (var i = this.sepcialday.length - 1; i >= 0; i--) {
                var time = new Date(this.sepcialday[i].time * 1000).format(
                    "yyyy-MM-dd"
                )
                if (
                    time == date.format("yyyy-MM-dd") &&
                    this.headDate.format("yyyy") == time.substring(0, 4) &&
                    this.headDate.format("MM") == time.substring(5, 7)
                ) {
                    return true
                }
            }
            return false
        },
        goPrev() {
            this.headDate = this.changeMonth(this.headDate, -1)
            this.dispatchEvent()
            event.$emit("changeMonth", this.headDate)
        },
        goNext() {
            this.headDate = this.changeMonth(this.headDate, 1)
            this.dispatchEvent()
            event.$emit("changeMonth", this.headDate)
        },
        changeMonth(date, num) {
            let dt = new Date(date)
            dt.setDate(new Date().getDate())
            dt.setMonth(dt.getMonth() + num)
            return new Date(dt)
        },
        dispatchEvent() {
            this.currentDate = this.headDate
            this.title = dateFunc.format(
                this.headDate,
                this.titleFormat,
                this.monthNames
            )
            let startDate = dateFunc.getStartDate(this.headDate)
            let curWeekDay = startDate.getDay()

            // 1st day of this monthView
            let diff = parseInt(this.firstDay) - curWeekDay
            if (diff) diff -= 7
            startDate.setDate(startDate.getDate() + diff)

            // the month view is 6*7
            let endDate = dateFunc.changeDay(startDate, 41)

            // 1st day of current month
            let currentDate = dateFunc.getStartDate(this.headDate)

            this.$emit(
                "change",
                dateFunc.format(startDate, "yyyy/MM/dd"),
                dateFunc.format(endDate, "yyyy/MM/dd"),
                dateFunc.format(currentDate, "yyyy/MM/dd"),
                this.headDate
            )
            this.currentDates = this.getCalendar()
        },
        isBegin(event, date, index) {
            let st = new Date(event.start)

            if (index == 0 || st.toDateString() == date.toDateString()) {
                return event.title
            }
            return "　"
        },
        moreTitle(date) {
            let dt = new Date(date)
            return (
                this.weekNames[dt.getDay()] +
                ", " +
                this.monthNames[dt.getMonth()] +
                dt.getDate()
            )
        },
        classNames(cssClass) {
            if (!cssClass) return ""
            // string
            if (typeof cssClass == "string") return cssClass

            // Array
            if (Array.isArray(cssClass)) return cssClass.join(" ")

            // else
            return ""
        },
        getCalendar() {
            // calculate 2d-array of each month
            // first day of this month
            let now = new Date() // today
            let current = new Date(this.currentDate)

            let startDate = dateFunc.getStartDate(current) // 1st day of this month

            let curWeekDay = startDate.getDay()

            // begin date of this table may be some day of last month
            let diff = parseInt(this.firstDay) - curWeekDay
            diff = diff > 0 ? diff - 7 : diff

            startDate.setDate(startDate.getDate() + diff)
            let calendar = []

            for (let perWeek = 0; perWeek < 6; perWeek++) {
                let week = []
                for (let perDay = 0; perDay < 7; perDay++) {
                    week.push({
                        monthDay: startDate.getDate(),
                        isToday: now.toDateString() == startDate.toDateString(),
                        isCurMonth: startDate.getMonth() == current.getMonth(),
                        weekDay: perDay,
                        date: new Date(startDate),
                        selected:
                            this.headDate.format("yyyy-MM-dd") ==
                                new Date(startDate).format("yyyy-MM-dd")
                                ? true
                                : false
                        // events : this.slotEvents(startDate)
                    })
                    startDate.setDate(startDate.getDate() + 1)
                }
                calendar.push(week)
                // if (isFinal) break
            }
            return calendar
        },
        isStart(eventDate1, eventDate2, eventDate3, date) {
            let st1 = new Date(eventDate1)
            let st2 = new Date(eventDate2)
            let st3 = new Date(eventDate3)
            if (st1.toDateString() == date.toDateString()) {
                return true
            } else if (st2.toDateString() == date.toDateString()) {
                return true
            } else if (st3.toDateString() == date.toDateString()) {
                return true
            }
            return false
        },
        isEnd(eventDate1, eventDate2, eventDate3, date) {
            let ed1 = new Date(eventDate1)
            let ed2 = new Date(eventDate2)
            let ed3 = new Date(eventDate3)
            if (ed1.toDateString() == date.toDateString()) {
                return true
            } else if (ed2.toDateString() == date.toDateString()) {
                return true
            } else if (ed3.toDateString() == date.toDateString()) {
                return true
            }
            return false
        },
        isOut(eventDate1, date) {
            let ed = new Date(eventDate1)
            if (ed.toDateString() == date.toDateString()) {
                return true
            }
            return false
        },
        isLimit(date) {
            var d = new Date(date)
            var time = d.getFullYear() + "/" + (d.getMonth() + 1) + "/" + d.getDate()
            if (
                parseInt(this.getYMDFormateTimestamp(this.startdateone)) <
                parseInt(this.getYMDFormateTimestamp(time)) &&
                parseInt(this.getYMDFormateTimestamp(time)) <
                parseInt(this.getYMDFormateTimestamp(this.enddateone))
            ) {
                return true
            }
            if (
                parseInt(this.getYMDFormateTimestamp(this.startdatetwo)) <
                parseInt(this.getYMDFormateTimestamp(time)) &&
                parseInt(this.getYMDFormateTimestamp(time)) <
                parseInt(this.getYMDFormateTimestamp(this.enddatetwo))
            ) {
                return true
            }
            if (
                parseInt(this.getYMDFormateTimestamp(this.startdatethree)) <
                parseInt(this.getYMDFormateTimestamp(time)) &&
                parseInt(this.getYMDFormateTimestamp(time)) <
                parseInt(this.getYMDFormateTimestamp(this.enddatethree))
            ) {
                return true
            }
            return false
        },
        isEggLimit(date) {
            var d = new Date(date)
            var time = d.getFullYear() + "/" + (d.getMonth() + 1) + "/" + d.getDate()
            if (
                parseInt(this.getYMDFormateTimestamp(this.outeggstart)) <
                parseInt(this.getYMDFormateTimestamp(time)) &&
                parseInt(this.getYMDFormateTimestamp(time)) <
                parseInt(this.getYMDFormateTimestamp(this.outeggend))
            ) {
                return true
            }
            return false
        },
        getYMDFormateTimestamp(time) {
            time = time + " 00:00:00"
            var t = time.split(/[- :]/)
            var d = new Date(t[0], t[1] - 1, t[2], t[3], t[4], t[5])
            var timestamp = new Date(d).getTime().toString()
            timestamp = timestamp.substr(0, 10)
            return timestamp
        },
        getYMDFormateTime(time) {
            //等到年月日 格式化时间
            if (time === "" || time === "0") {
                return ""
            }
            var times = 0
            if (time.length === 13) {
                times = parseInt(time)
            } else {
                times = parseInt(time) * 1000
            }
            var date = new Date(times) //如果date为13位不需要乘1000
            var Y = date.getFullYear() + "-"
            var M =
                (date.getMonth() + 1 < 10
                    ? "0" + (date.getMonth() + 1)
                    : date.getMonth() + 1) + "-"
            var D = date.getDate() < 10 ? "0" + date.getDate() : date.getDate()
            return Y + M + D
        },
        computePos(target) {
            let eventRect = target.getBoundingClientRect()
            let pageRect = this.$refs.dates.getBoundingClientRect()
            return {
                left: eventRect.left - pageRect.left,
                top: eventRect.top + eventRect.height - pageRect.top
            }
        },
        dayClick(day, jsEvent) {
            this.$emit("dayclick", day, jsEvent)
        },
        eventClick(event, jsEvent) {
            if (!event.isShow) {
                return
            }
            jsEvent.stopPropagation()
            let pos = this.computePos(jsEvent.target)
            this.$emit("eventclick", event, jsEvent, pos)
        }
    }
}
</script>
<style lang="less" scoped>
.full-calendar-body {
    margin-top: 0px;
    padding: 0 10px 5px 10px;
    background: #f2f2f3;
    .weeks {
        display: flex;
        height: 30px;
        line-height: 30px;
        .week {
            flex: 1;
            text-align: left;
            font-size: 12px;
            font-weight: normal;
        }
        .week:first-of-type,
        .week:last-of-type {
            color: #ff6688;
        }
    }
    .dates {
        position: relative;
        .week-row {
            display: flex;
            margin-bottom: -2px;
            .heart {
                width: 13px;
                height: 10px;
                position: absolute;
                bottom: 5px;
                left: 15px;
                -webkit-transform: translateX(-50%);
                transform: translateX(-50%);
            }
            .day-cell {
                box-sizing: border-box;
                position: relative;
                flex: 1;
                padding: 2px 10px 6px 6px;
                border-radius: 8px;
                background: #fff;
                margin: 2px 1px 2px 2px;
                .day-number {
                    box-sizing: border-box;
                    text-align: left;
                    padding: 0 0 8px 0;
                    font-size: 12px;
                }
                &.today {
                    background-color: rgba(26, 179, 148, 0.3);
                }
                &.selected {
                    border: 2px solid @default-color;
                    margin: 0px -1px 0 0;
                }
                &.not-cur-month {
                    .day-number {
                        color: rgba(0, 0, 0, 0.24);
                    }
                }
            }
        }
    }
}
.is-start {
    margin-left: 10px;
    border-top-left-radius: 15px;
    background-color: #ff7a8d;
    border-bottom-left-radius: 15px;
}
.is-end {
    margin-right: 10px;
    border-top-right-radius: 15px;
    background-color: #ff7a8d;
    border-bottom-right-radius: 15px;
}
.is-limit {
    background-color: #ff7a8d;
}
.is-egg-start {
    margin-left: 10px;
    border-top-left-radius: 15px;
    background-color: #80e8d0;
    border-bottom-left-radius: 15px;
}
.is-egg-end {
    margin-right: 10px;
    border-top-right-radius: 15px;
    background-color: #80e8d0;
    border-bottom-right-radius: 15px;
}
.is-egg-limit {
    background-color: #80e8d0;
}
.is-egg-out {
    background-color: #8091e8;
}
.full-calendar-header {
    display: flex;
    align-items: center;
    background-color: #fff;
    padding: 9px 10px;
    color: @default-color;
    font-size: 14px;
    font-weight: 400;
    .prev-month,
    .next-month {
        padding: 2px 7px;
        background: @default-color;
        color: #fff;
        border-radius: 5px;
    }
    .header-left,
    .header-right {
        flex: 1;
    }
    .header-center {
        flex: 3;
        text-align: center;
        .title {
            margin: 0 10px;
            font-size: 22px;
        }
        .prev-month,
        .next-month {
            cursor: pointer;
        }
    }
}
</style>
