<template>
    <div class="user">
        <!-- 表单 -->
        <el-card class="box-card mt-15">
            <div class="home-form">
                <el-form ref="ruleForm" label-width="60px" @submit.native.prevent>
                    <el-row :gutter="10">
                        <el-col :span="5">
                            <el-form-item label="关键字" prop="keyword">
                                <el-input  placeholder="请输入账号/昵称" size="mini" v-model.trim="keyword" clearable></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="3">
                            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleSearch" class="search-btn">搜索</el-button>
                        </el-col>
                    </el-row>
                </el-form>
            </div>
        </el-card>
        <el-card class="box-card">
            <!-- 头部 -->
            <div slot="header" class="clearfix fix-lh">
                <span>用户列表</span>
                <div class="btn-list">
                    <el-button @click="handleAdd" v-hasPermission="permission.add">新增</el-button>
                </div>
            </div>
            <div class="home-body">
                <cvue-table :option="tableOption" :data="tableData" ref="tbl1"
                            :isShowAdd="false" :page="page"
                            :tablePage="tablePage" :pageSize="page.pageSize"
                            :loading="tableLoading"
                            @current-change="handleCurrentChange"
                            @size-change="handleSizeChange"
                            :isShowPage="true">
                    <template slot-scope="scope" slot="openInfo">
                        <span @click="handleOpenList(scope.row)">{{scope.row.openInfo}}</span>
                    </template>
                    <!-- 操作按钮 -->
                    <el-table-column fixed="right" slot="actionMenu" label="操作" align="center"
                        header-align="center"  width="100">
                        <template slot-scope="scope">
                            <el-button type="text" size="small" @click="handleReset(scope.row)" v-hasPermission="permission.edit">密码重置</el-button>
                        </template>
                    </el-table-column>
                </cvue-table>
            </div>
        </el-card>
        <!-- 新增弹窗 -->
        <index-add
            @closeDialog="closeDialog('add')"
            @confirmDialog="confirmDialog('add')"
            @handleClose="closeDialog('add')"
            :dialogVisible="dialogVisibleAdd">
        </index-add>
    </div>
</template>
<script>
import cvueTable from '@/components/cvue-table'
import cvueDialog from '@/components/cvue-dialog'
import indexAdd from './indexAdd'
import { baseUrl } from '@/config/config.js'
export default {
    name: 'user',
    components: {
        cvueTable,
        cvueDialog,
        indexAdd
    },
    data () {
        return {
            userId: '',
            keyword: '',
            tableLoading: false,
            dialogVisibleAdd: false,
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
                    {prop: 'userName', label: 'APP账号', align: 'center'},
                    {prop: 'nickName', label: '昵称', align: 'center'},
                    {prop: 'createdTime', label: '注册时间', align: 'center'},
                    {prop: 'openInfo', label: '开通信息', align: 'center', slotStatus: true}
                ]
            },
            tableData: [
            ]
        }
    },
    mounted () {
        this.handleList(this.keyword) // 获取列表详情
    },
    methods: {
        // 改变pagesize
        handleSizeChange (val) {
            this.page.pageSize = val
            this.handleList(this.keyword)
        },
        // 改变页码
        handleCurrentChange (val) {
            this.tablePage = val
            this.handleList(this.keyword)
        },
        // 网吧搜索
        handleSearch () {
            this.tablePage = 1
            this.handleList(this.keyword)
        },
        // 列表接口
        handleList (keyword) {
            this.tableLoading = true
            var params = {
                pageIndex: this.tablePage,
                pageSize: this.page.pageSize,
                keyword: keyword
            }
            this.$store.dispatch('demo/GetUserList', params).then(res => {
                // console.log(res)
                if (res.success) {
                    var data = res.data
                    this.tableData = data
                    this.page.total = data.total
                    this.page.currentPage = this.tablePage
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
        // 单元格单击
        handleOpenList (row) {
            // console.log(row)
            // this.goUrl('open-list', {userId: row.userId, userName: row.userName})
        },
        // 关闭弹窗
        closeDialog (params) {
            if (params == 'add') {
                this.dialogVisibleAdd = false
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
        // 密码重置
        handleReset (row) {
            this.$confirm('是否将密码重置并发送至App关联手机号？', '密码重置', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$store.dispatch('commonUser/ResetUserInfo', {userId: row.userId}).then(res => {
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
        }
    }
}
</script>
<style lang="scss">
    .user{
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
            tr td:nth-child(5) span{
                color: #409EFF;
                cursor: pointer;
            }
        }
        .table-body{
            margin-top: 20px;
        }
    }
</style>
