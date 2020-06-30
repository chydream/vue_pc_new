<template>
    <div class="current-strategy">
        <el-card class="box-card">
            <div class="item">
                <div class="item-head"><span>当前网络状态</span></div>
                <div class="item-body">{{stateStr}}</div>
            </div>
            <div class="item">
                <div class="item-head"><span>上网模式</span></div>
                <div class="item-body">{{modelStr}}</div>
            </div>
            <div class="item">
                <div class="item-head"><span>上网奖励</span></div>
                <div class="item-body">可用总时长：{{reward}}</div>
            </div>
            <div class="item">
                <div class="item-head"><span>可用时间段</span></div>
                <div class="item-body">
                    <cvue-table :option="tableOption" :data="tableData" ref="tbl1">
                        <template slot-scope="scope" slot="time">
                            <span v-html="scope.row.time"></span>
                        </template> 
                    </cvue-table> 
                </div>
            </div>
            <div class="item">
                <div class="item-head"><span>应用黑名单</span></div>
                <div class="item-body">
                    <cvue-table :option="tableOption2" :data="tableData2" ref="tbl2"></cvue-table> 
                </div>
            </div>
            <div class="btn-wrap">
                <el-button type="primary" @click="handleClear" v-hasPermission="permission.edit" :disabled="stateStr=='已到期'">清除策略</el-button>
                <el-button @click="goBack">返回</el-button>
            </div>
        </el-card>        
    </div>
</template>
<script>
import cvueTable from '@/components/cvue-table'
import cvueDialog from '@/components/cvue-dialog'
import openListAdd from './openListAdd'
import { baseUrl } from '@/config/config.js'
export default {
    name: 'currentStrategy',
    components: {
        cvueTable,
        cvueDialog,
        openListAdd
    },
    data () {
        return {
            state: '',
            model: '',
            timer: '',
            reward: '',
            tableLoading: false,
            tablePage: 1,
            page: {
                total: 1, // 总页数
                currentPage: 1, // 当前页数
                pageSize: 10, // 每页显示多少条
                pageSizes: [10, 50, 100]
            },
            tableOption: {
                stripe: true,
                width: '100%',
                border: true,
                index: false,
                cloumn: [
                    {prop: 'week', label: '星期', align: 'center', width: 200},
                    {prop: 'time', label: '时段', align: 'center', slotStatus: true}
                ]
            },
            tableData: [
                {week: '星期一', time: ''},
                {week: '星期二', time: ''},
                {week: '星期三', time: ''},
                {week: '星期四', time: ''},
                {week: '星期五', time: ''},
                {week: '星期六', time: ''},
                {week: '星期天', time: ''}
            ],
            tableOption2: {
                stripe: true,
                width: '100%',
                border: true,
                index: false,
                cloumn: [
                    {prop: 'index', label: '序号', align: 'center'},
                    {prop: 'name', label: '应用名称', align: 'center'},
                    {prop: 'type', label: '分类', align: 'center'}
                    // {prop: 'code', label: '状态', align: 'center'}
                ]
            },
            tableData2: [
            ]
        }
    },
    computed: {
        stateStr () {
            var str = ''
            if (this.state === 0) {
                str = '正常联网'
            }
            if (this.state === 1) {
                 str = '断网'
            }
            if (this.state === 2) {
                 str = '时段受限'
            }
            if (this.state === 3) {
                 str = '上网奖励'
            }
            if (this.state === 4) {
                 str = '已到期'
            }
            return str
        },
        modelStr () {
            var str = ''
            if (this.model === 1) {
                 str = '绿色上网'
            }
            if (this.model === 2) {
                 str = '教育资源'
            }
            if (this.model === 3) {
                str = '畅游模式'
            }
            if (this.model === 4) {
                str = '一键断网'
            }
            return str
        }
    },
    mounted () {
        this.handleList() // 获取列表详情
    },
    methods: {
        // 列表接口
        handleList () {
            this.tableLoading = true
            var params = {
                userId: this.$route.query.userId,
                accountId: this.$route.query.accountId
            }
            this.$store.dispatch('commonUser/GetPolicy', params).then(res => {
                // console.log(res)
                if (res.code == 1) {
                    var data = res.data
                    this.state = data.state
                    this.model = data.model
                    this.reward = Math.floor((data.reward / 60)) + '小时' + (data.reward % 60) + '分'
                    this.timer = data.timer
                    this.setTableData()
                    this.tableData2 = data.appPolicies
                } else {
                    this.$message({
                        message: res.msg,
                        duration: 2000,
                        type: 'error'
                    })
                }
                this.tableLoading = false
            }).catch(err => {
                console.log(err)
                this.tableLoading = false
            })
        },
        // 清空策略
        handleClear (row) {
            this.$confirm('确定要清除所有策略？', '清除策略', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                var params = {
                    userId: this.$route.query.userId,
                    accountId: this.$route.query.accountId
                }
                // console.log(params)
                this.$store.dispatch('commonUser/DeletePolicy', params).then(res => {
                    // console.log(res)
                    if (res.code == 1) {
                        this.$message({
                            type: 'success',
                            message: res.msg
                        })
                        // this.goBack()
                        this.handleList() // 获取列表详情
                    } else {
                        this.$message({
                            type: 'error',
                            message: res.msg
                        })
                    }
                })
            }).catch(() => {
            })
        },
        // 可用时间段修改
        setTableData () {
            var str = '["monday_0-8","monday_8-9","monday_9-10","monday_10-11","monday_11-12","monday_12-13","monday_13-14","monday_14-15","monday_15-16","monday_16-17","monday_17-18","monday_18-19","monday_19-20","monday_20-21","monday_21-22","monday_22-23","monday_23-24","tuesday_0-8","tuesday_8-9","tuesday_9-10","tuesday_10-11","tuesday_11-12","tuesday_12-13","tuesday_13-14","tuesday_14-15","tuesday_15-16","tuesday_16-17","tuesday_17-18","tuesday_18-19","tuesday_19-20","tuesday_20-21","tuesday_21-22","tuesday_22-23","tuesday_23-24","wednesday_0-8","wednesday_8-9","wednesday_9-10","wednesday_10-11","wednesday_11-12","wednesday_12-13","wednesday_13-14","wednesday_14-15","wednesday_15-16","wednesday_16-17","wednesday_17-18","wednesday_18-19","wednesday_19-20","wednesday_20-21","wednesday_21-22","wednesday_22-23","wednesday_23-24","thursday_0-8","thursday_8-9","thursday_9-10","thursday_10-11","thursday_11-12","thursday_12-13","thursday_13-14","thursday_14-15","thursday_15-16","thursday_16-17","thursday_17-18","thursday_18-19","thursday_19-20","thursday_20-21","thursday_21-22","thursday_22-23","thursday_23-24","friday_0-8","friday_8-9","friday_9-10","friday_10-11","friday_11-12","friday_12-13","friday_13-14","friday_14-15","friday_15-16","friday_16-17","friday_17-18","friday_18-19","friday_19-20","friday_20-21","friday_21-22","friday_22-23","friday_23-24","saturday_0-8","saturday_8-9","saturday_9-10","saturday_10-11","saturday_11-12","saturday_12-13","saturday_13-14","saturday_14-15","saturday_15-16","saturday_16-17","saturday_17-18","saturday_18-19","saturday_19-20","saturday_20-21","saturday_21-22","saturday_22-23","saturday_23-24","sunday_0-8","sunday_8-9","sunday_9-10","sunday_10-11","sunday_11-12","sunday_12-13","sunday_13-14","sunday_14-15","sunday_15-16","sunday_16-17","sunday_17-18","sunday_18-19","sunday_19-20","sunday_20-21","sunday_21-22","sunday_22-23","sunday_23-24"]' 
            var strArr = JSON.parse(str)
            var timerArr = this.timer.split('')
            var objArr = []
            timerArr.forEach((item, index) => {
                if (item == 1) {
                    objArr.push(strArr[index])
                }
            })
            if (objArr.length > 0) {
                var mainArr = []
                mainArr[0] = []
                mainArr[1] = []
                mainArr[2] = []
                mainArr[3] = []
                mainArr[4] = []
                mainArr[5] = []
                mainArr[6] = []
                objArr.forEach((item, index) => {               
                    if (item.indexOf('monday') >= 0) {
                        mainArr[0].push(item.split('_')[1])
                    }
                    if (item.indexOf('tuesday') >= 0) {
                        mainArr[1].push(item.split('_')[1])
                    }
                    if (item.indexOf('wednesday') >= 0) {
                        mainArr[2].push(item.split('_')[1])
                    }
                    if (item.indexOf('thursday') >= 0) {
                        mainArr[3].push(item.split('_')[1])
                    }
                    if (item.indexOf('friday') >= 0) {
                        mainArr[4].push(item.split('_')[1])
                    }
                    if (item.indexOf('saturday') >= 0) {
                        mainArr[5].push(item.split('_')[1])
                    }
                    if (item.indexOf('sunday') >= 0) {
                        mainArr[6].push(item.split('_')[1])
                    }
                })
                this.tableData.forEach((item, index) => {
                    this.tableData[index].time = mainArr[index].join('&nbsp;&nbsp;&nbsp;&nbsp;')
                })
            }
        },
        goBack () {
            this.closeTagTo('/user/open-list', true, {userId: this.$route.query.userId, userName: this.$route.query.userName})
        }
    }
}
</script>
<style lang="scss">
    .current-strategy{
        padding: 0px!important;
        height: auto!important;
        // .item{
        //     margin-bottom: 20px;
        // }
        .item-head{
            height: 20px;
            position: relative;
            border-bottom: 1px dashed #ccc;
            margin-bottom: 12px;
            margin-top: -10px;
        }
        .item-head span{
            display:inline-block;
            position: absolute;
            left: 0;
            bottom: -10px;
            background: #fff;
            font-size: 16px;
            padding: 0 10px 0 0;
            height: 18px;
            border-left: 5px solid #66b1ff;
            text-indent: 15px;
            line-height: 18px
        }
        .item-body{
            padding: 20px 30px;
            font-size: 14px;
        }
        .el-card__body{
            padding: 30px;
        }
        .btn-wrap{
            text-align: center;
        }
    }
</style>
