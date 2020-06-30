<template>
    <div class="exit-quality">
        <!-- 出口历史延时数据 -->
        <cvue-dialog :dialogVisible="dialogVisible"
                    :isShowFoot = false
                    :title="title"
                    dialogWidth="800px"
                    @handleOpen="openDialog"
                    @closeDialog="closeDialog"
                    @confirmDialog="confirmDialog"
                    @handleClose="handleClose">
            <div class="dialog-body" slot="dialogBody">
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="demo-ruleForm">
                    <el-row :gutter="20">
                        <el-col :span="14">
                            <el-form-item prop="dateTime">
                                <el-date-picker
                                    :picker-options="datePicker"
                                    v-model="ruleForm.dateTime"
                                    type="datetimerange"
                                    range-separator="至"
                                    value-format="yyyy-MM-dd HH:mm:ss"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期">
                                    </el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="10" class="text-right">
                            <el-button type="danger" icon="el-icon-search" size="mini" @click="handleSearch">搜索</el-button>
                        </el-col>
                    </el-row>
                </el-form>
                <div class="table-body">
                    <cvue-table :option="tableOption" :data="tableData" ref="tbl" 
                                :isShowAdd="false" :page="page" :layout="layout"
                                :tablePage="tablePage" :pageSize="page.pageSize"
                                :loading="dialogLoading"
                                @current-change="handleCurrentChange"
                                @size-change="handleSizeChange"
                                :isShowPage="true">
                    </cvue-table>
                </div>
            </div>            
        </cvue-dialog>
    </div>
</template>
<script>
import cvueDialog from '@/components/cvue-dialog'
import cvueTable from '@/components/cvue-table'
export default {
    name: 'internetCafe',
    components: {
        cvueDialog,
        cvueTable
    },
    data () {
        return {
            dialogLoading: false,
            start: '',
            end: '',
            firstId: '',
            lastId: '',
            ruleForm: {
                dateTime: [this.getDateTime(0, 0, 0, -10, 0), this.getDateTime(0, 0, 0, 0, 0)]
            },
            rules: {
                dateTime: [
                    { required: true, message: '请选择日期', trigger: 'change' }
                ]
            },
            disabled: true,
            layout: 'total,sizes,prev,pager,next,jumper',
            tablePage: 1,
            page: {
                total: 100000, // 总页数
                currentPage: 1, // 当前页数
                pageSize: 7, // 每页显示多少条
                pageSizes: [7, 10, 50, 100]
            },
            tableOption: {
                stripe: true,
                width: '100%',
                border: true,
                index: false,
                cloumn: [
                    {prop: 'index', label: '序号', align: 'center', width: 70},
                    {prop: 'createTime', label: '时间', align: 'center'},
                    {prop: 'dnsAddress', label: 'DNS', align: 'center'},
                    {prop: 'delay', label: '时延(ms)', align: 'center', multiple: true}
                ]
            },
            tableData: [
                // {
                //   dateTime: '2019.04.08 16:00:00', DNS: '5555', delayed: '555'
                // },
                // {
                //   dateTime: '2019.04.08 16:00:00', DNS: '5555', delayed: '555'
                // },
                // {
                //   dateTime: '2019.04.08 16:00:00', DNS: '5555', delayed: '555'
                // }
            ]
        }
    },
    computed: {
        datePicker () {
            return this.datePickerLimit()
        },
        title () {
            return this.$parent.rowTitle + ' 出口历史时延数据'
        }
    },
    props: {
        dialogVisible: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        handleClose () {
            this.$refs['ruleForm'].clearValidate()
            // this.ruleForm.dateTime = [this.getDateTime(0, 0, 0, -10, 0), this.getDateTime(0, 0, 0, 0, 0)]
            this.$emit('handleClose')
        },
        closeDialog () {
            this.$refs['ruleForm'].clearValidate()
            // this.ruleForm.dateTime = [this.getDateTime(0, 0, 0, -10, 0), this.getDateTime(0, 0, 0, 0, 0)]
            this.$emit('closeDialog')
        },
        confirmDialog () {
            this.$emit('confirmDialog')
        },
        // 改变pageSize
        handleSizeChange (val) {
            this.page.pageSize = val
            this.getDetail(this.ruleForm.dateTime[0], this.ruleForm.dateTime[1])
        },
        // 改变页码
        handleCurrentChange (val) {
            this.tablePage = val
            this.getDetail(this.ruleForm.dateTime[0], this.ruleForm.dateTime[1])   
        },
        // 搜索
        handleSearch () {
            this.$refs.ruleForm.validate((valid) => {
                if (valid) {
                    // console.log(this.ruleForm.dateTime)
                    this.tablePage = 1
                    this.start = this.ruleForm.dateTime[0]
                    this.end = this.ruleForm.dateTime[1]
                    this.getDetail(this.start, this.end)
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },
        // 网吧在线情况
        getDetail (beginTime, endTime) {
            var params = {
                pageSize: this.page.pageSize,
                pageIndex: this.tablePage,
                barId: this.$parent.rowId,
                beginTime: beginTime,
                endTime: endTime,
                ping_way: 1
            }
            this.dialogLoading = true
            this.$store.dispatch('home/PingHistoricRecords', params).then(res => {
                // console.log(res)
                if (res.code == 1) {
                    this.tableData = res.data.list
                    this.tableData.forEach((item, index) => {
                        this.tableData[index].delay = this.tableData[index].delay == null ? '-' : parseFloat(this.tableData[index].delay).toFixed(2)
                    })
                    this.page.total = res.data.total
                    this.page.currentPage = this.tablePage 
                } else {
                    this.$message({
                        message: res.msg,
                        duration: 2000,
                        type: 'error'
                    })
                }
                this.dialogLoading = false
            })
        },
        // 初始化弹窗
        openDialog () {
            this.tablePage = 1
            this.ruleForm.dateTime = [this.getDateTime(0, 0, 0, -10, 0), this.getDateTime(0, 0, 0, 0, 0)]
            this.getDetail(this.getDateTime(0, 0, 0, -10, 0), this.getDateTime(0, 0, 0, 0, 0))
        },
        // 获取最近月日期
        getLatestMonthDate (days, months) {
            var now = new Date()
            var nYear = now.getFullYear()
            var nMonth = now.getMonth()
            var nDay = now.getDate()
            var Latest = new Date(nYear, nMonth + months, nDay + days)
            var sMonth = (Latest.getMonth() + 1)
            var sDay = Latest.getDate()
            if (sMonth < 10) {
                sMonth = '0' + sMonth
            }
            if (sDay < 10) {
                sDay = '0' + sDay
            }
            return Latest.getFullYear() + '-' + sMonth + '-' + sDay + ' ' + '00:00:00'
        },
        // 获取最近月日时
        getDateTime (months, days, hours, minutes, seconds) {
            function setData (params) {
                if (params < 10) {
                    params = '0' + params 
                }
                return params
            }
            var now = new Date()
            var nYear = now.getFullYear()
            var nMonth = now.getMonth()
            var nDay = now.getDate()
            var nHour = now.getHours()
            var nMinute = now.getMinutes()
            var nSecond = now.getSeconds()
            var Latest = new Date(nYear, nMonth + months, nDay + days, nHour + hours, nMinute + minutes, nSecond + seconds)
            var sYear = Latest.getFullYear()
            var sMonth = setData(Latest.getMonth() + 1)
            var sDay = setData(Latest.getDate())
            var sHour = setData(Latest.getHours())
            var sMinute = setData(Latest.getMinutes())
            var sSecond = setData(Latest.getSeconds())
            var sTime = sYear + '-' + sMonth + '-' + sDay + ' ' + sHour + ':' + sMinute + ':' + sSecond
            return sTime
        },
        datePickerLimit () {
            let self = this
            var curDate = new Date()
            var preDate = new Date(curDate.getTime()) // 前一天
            return {
                disabledDate (time) {
                    return time.getTime() > preDate
                }
            } 
        }
    }
}
</script>
<style lang="scss" scoped>
.exit-quality{
    .el-form-item{
        margin-bottom: 0px;
    }
}
</style>
