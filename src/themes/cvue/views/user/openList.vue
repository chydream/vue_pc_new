<template>
    <div class="open-list">
        <el-card class="box-card">
            <!-- 头部 -->
            <div slot="header" class="clearfix fix-lh">
                <span>开通列表-<em style="font-size:12px;">APP账号{{$route.query.userName}}</em></span>
                <div class="btn-list">
                    <el-button @click="handleRecord">开通记录</el-button>
                    <el-button @click="handleAdd" v-if="getPermisson">新增</el-button>
                    <el-button @click="goBack">返回</el-button>
                </div>
            </div>
            <div class="home-body">
                <cvue-table :option="tableOption" :data="tableData" ref="tbl1"
                            :isShowAdd="false" :page="page" 
                            :tablePage="tablePage" :pageSize="page.pageSize"
                            :loading="tableLoading"
                            :isShowPage="false">
                    <template slot-scope="scope" slot="state">
                        <span v-if="scope.row.state == 0">正常</span>
                        <span v-else-if="scope.row.state == 1" style="color:#db5b5a">到期</span>
                        <span v-else-if="scope.row.state == 2" style="color:#fc8902">退订</span>
                    </template> 
                     <template slot-scope="scope" slot="productName">
                         <el-tooltip class="item" effect="dark" :content="scope.row.describes" placement="top-start" v-if="scope.row.productName != '-'">
                            <span>{{scope.row.productName}}</span>
                        </el-tooltip>
                        <span v-else>{{scope.row.productName}}</span>
                    </template> 
                    <template slot-scope="scope" slot="openChannel">
                        <span v-if="scope.row.openChannel === 0">后台</span>
                        <span v-else-if="scope.row.openChannel == 1">小程序</span>
                        <span v-else-if="scope.row.openChannel == 2">Android</span>
                        <span v-else-if="scope.row.openChannel == 3">Ios</span>
                    </template>       
                    <!-- 操作按钮 -->
                    <el-table-column fixed="right" slot="actionMenu" label="操作" align="center"
                        header-align="center"  width="180">
                        <template slot-scope="scope">
                            <el-button type="text" size="small" @click="getCurrentStrategy(scope.row)" v-hasPermission="permission.edit">当前策略</el-button>
                            <el-button type="text" size="small" @click="handleOrder(scope.row)" >订单信息</el-button>
                            <el-button type="text" size="small" @click="handleCancel(scope.row)" v-if="getPermisson">退订</el-button>
                        </template>
                    </el-table-column>
                </cvue-table>
            </div>
        </el-card>        
        <!-- 新增弹窗 -->
        <open-list-add
            @closeDialog="closeDialog('add')"
            @confirmDialog="confirmDialog('add')"
            @handleClose="closeDialog('add')"
            :dialogVisible="dialogVisibleAdd">
        </open-list-add>
        <!-- 开通历史记录 -->
        <open-record
            @closeDialog="closeDialog('record')"
            @confirmDialog="confirmDialog('record')"
            @handleClose="closeDialog('record')"
            :dialogVisible="dialogVisibleRecord">
        </open-record>
    </div>
</template>
<script>
import {mapGetters} from 'vuex'
import cvueTable from '@/components/cvue-table'
import cvueDialog from '@/components/cvue-dialog'
import openListAdd from './openListAdd'
import openRecord from './openRecord'
import { baseUrl } from '@/config/config.js'
export default {
    name: 'openList',
    components: {
        cvueTable,
        cvueDialog,
        openListAdd,
        openRecord
    },
    data () {
        return {
            keyword: '',
            tableLoading: false,
            dialogVisibleAdd: false,
            dialogVisibleRecord: false,
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
                    {prop: 'index', label: '序号', align: 'center', width: 80},
                    {prop: 'accountId', label: '手机号码', align: 'center'},
                    {prop: 'state', label: '状态', align: 'center', slotStatus: true},
                    {prop: 'createdTime', label: '开通时间', align: 'center'},
                    {prop: 'productName', label: '当前套餐', align: 'center', slotStatus: true},
                    {prop: 'openChannel', label: '开通渠道', align: 'center', slotStatus: true},
                    {prop: 'expiredDate', label: '到期时间', align: 'center'}
                ]
            },
            tableData: [
            ]
        }
    },
    mounted () {
        this.handleList(this.keyword) // 获取列表详情
    },
    computed: {
        ...mapGetters(['permissionList']),
        getPermisson () {
            var permisson = ''
            this.permissionList.forEach((item, index) => {
                if (item.code == 12000) {
                    permisson = item.permissions
                }
            })
            return permisson.indexOf('edit') >= 0
        }
    },
    methods: {
        // 列表接口
        handleList (keyword) {
            this.tableLoading = true
            this.$store.dispatch('commonUser/GetAccountList', {userId: this.$route.query.userId}).then(res => {
                // console.log(res)
                if (res.code == 1) {
                    var data = res.data
                    this.tableData = data.list
                    this.tableData.forEach((item, index) => {
                        if (item.productName == '' || item.productName == null) {
                            this.tableData[index].productName = '-'
                        }
                    })
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
        // 关闭弹窗
        closeDialog (params) {
            if (params == 'add') {
                this.dialogVisibleAdd = false
            }
            if (params == 'record') {
                this.dialogVisibleRecord = false
            }
        },
        // 确认
        confirmDialog (params) {
             if (params == 'add') {
                this.dialogVisibleAdd = false
                this.keyword = ''
                this.tablePage = 1
                this.handleList(this.keyword)
            }
        },
        // 新增
        handleAdd () {
            this.dialogVisibleAdd = true
        },
        // 开通记录
        handleRecord () {
            this.dialogVisibleRecord = true
        },
        // 退订
        handleCancel (row) {
            var text = '是否退订手机号为' + row.accountId + '的账号？'
            this.$confirm(text, '密码重置', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                var params = {
                    userId: this.$route.query.userId,
                    accountId: row.accountId
                }
                this.$store.dispatch('commonUser/DeleteBusiness', params).then(res => {
                    // console.log(res)
                    if (res.code == 1) {
                        this.$message({
                            type: 'success',
                            message: res.msg
                        })
                        this.keyword = ''
                        this.tablePage = 1
                        this.handleList(this.keyword)
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
        // 当前策略
        getCurrentStrategy (row) {
            this.goUrl('current-strategy', {userId: this.$route.query.userId, accountId: row.accountId, userName: this.$route.query.userName})
        },
        // 订单信息
        handleOrder (row) {
            this.goUrl('/order/order-detail', {accountId: row.accountId, userName: this.$route.query.userName})
        },
        goBack () {
            this.closeTagTo('/user/index')
        }
    }
}
</script>
<style lang="scss">
    .open-list{
        padding: 0px!important;
        height: auto!important;
        .home-body{
            margin-top: -15px;
        }
        .btn-list{
            float: right;
        }
        .el-card__header{
            border-bottom: none;
        }
        .fix-lh{
            line-height: 32px;
        }
        .text-right{
            text-align: right;
        }
        .el-card__header,.el-card__body{
            padding: 15px;
        }
        .el-input.is-disabled .el-input__inner{
            color: #606266;
        }
        .el-table__body{
            tr td:nth-child(2) span{
                // color: #409EFF;
                // cursor: pointer;
            }
        }
        .table-body{
            margin-top: 20px;
        }
    }
</style>
