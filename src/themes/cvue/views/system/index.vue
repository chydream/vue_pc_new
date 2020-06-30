<template>
    <div class="system-user">
        <!-- 表单 -->
        <el-card class="box-card mt-15">
            <div class="home-form">
                <el-form ref="ruleForm" label-width="60px" @submit.native.prevent>
                    <el-row :gutter="10">
                        <el-col :span="5">
                            <el-form-item label="关键字" prop="keyword">
                                <el-input  placeholder="请输入用户名/姓名" size="mini" v-model.trim="keyword" clearable></el-input>
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
                <span>系统用户列表</span>
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
                    <template slot-scope="scope" slot="state">
                        <span v-if="scope.row.state == 1" style="color:#2ead85">启用</span>
                        <span v-else style="color:#db5b5a">禁用</span>
                    </template>
                    <template slot-scope="scope" slot="roleName">
                        <span>{{scope.row.roleName == null ?'-':scope.row.roleName}}</span>
                    </template>
                    <!-- 操作按钮 -->
                    <el-table-column fixed="right" slot="actionMenu" label="操作" align="center"
                        header-align="center"  width="160">
                        <template slot-scope="scope">
                            <el-button type="text" size="small" @click="handleEdit(scope.row)" v-hasPermission="permission.edit" :disabled="isAdmin(scope.row)">编辑</el-button>
                            <el-button type="text" size="small" @click="handleReset(scope.row)" :disabled="isAdmin(scope.row)" v-hasPermission="permission.edit">密码重置</el-button>
                            <el-button type="text" size="small" @click="handleDelete(scope.row)" v-hasPermission="permission.delete"  :disabled="isSelf(scope.row)">删除</el-button>
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
        <!-- 编辑弹窗 -->
        <index-edit
            @closeDialog="closeDialog('edit')"
            @confirmDialog="confirmDialog('edit')"
            @handleClose="closeDialog('edit')"
            :dialogVisible="dialogVisibleEdit">
        </index-edit>
        <!-- 密码重置 -->
        <index-password-reset
            @closeDialog="closeDialog('reset')"
            @confirmDialog="confirmDialog('reset')"
            @handleClose="closeDialog('reset')"
            :dialogVisible="dialogVisibleReset">
        </index-password-reset>
    </div>
</template>
<script>
import {mapGetters} from 'vuex'
import cvueTable from '@/components/cvue-table'
import cvueDialog from '@/components/cvue-dialog'
import indexAdd from './indexAdd'
import indexEdit from './indexEdit'
import indexPasswordReset from './indexPasswordReset'
import { baseUrl } from '@/config/config.js'
export default {
    name: 'system',
    components: {
        cvueTable,
        cvueDialog,
        indexAdd,
        indexPasswordReset,
        indexEdit
    },
    data () {
        return {
            isYou: false,
            rowData: [],
            userName: '',
            userId: '',
            keyword: '',
            tableLoading: false,
            dialogVisibleAdd: false,
            dialogVisibleEdit: false,
            dialogVisibleReset: false,
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
                    {prop: 'userName', label: '用户名', align: 'center'},
                    {prop: 'createTime', label: '创建时间', align: 'center', width: 170},
                    {prop: 'name', label: '姓名', align: 'center'},
                    {prop: 'phone', label: '联系电话', align: 'center'},
                    {prop: 'roleName', label: '角色', align: 'center', slotStatus: true},
                    {prop: 'state', label: '状态', align: 'center', slotStatus: true}
                ]
            },
            tableData: [
                // {
                //   id: '1', name: '网吧1', region: '在线', status: '5555'
                // }
            ]
        }
    },
    mounted () {
        this.handleList(this.keyword) // 获取列表详情
    },
    computed: {
        ...mapGetters(['userInfo'])
    },
    methods: {
        isAdmin (row) {
            if (row.userId == 1) {
                return true
            } else {
                return false
            }
        },
        isSelf (row) {
            if (row.userId == 1) {
                return true
            } else if (row.userId == this.userInfo.userId) {
                return true
            } else {
                return false
            }
        },
        isAdminOld (row) {
            // console.log(this.userInfo.userId)
            if (this.userInfo.userId == 1 && row.userId != this.userInfo.userId) {
                return true
            } else {
                return false
            }
        },
        isSelfOld (row) {
            if (this.userInfo.userId == 1 && row.userId != this.userInfo.userId) {
                return true
            } else if (row.userId == this.userInfo.userId && this.userInfo.userId != 1) {
                return true
            } else {
                return false
            }
        },
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
        // 用户搜索
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
                keywords: keyword
            }
            this.$store.dispatch('demo/GetSystemList', params).then(res => {
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
        handleOpenList (id) {
            this.goUrl('open-list')
        },
        // 关闭弹窗
        closeDialog (params) {
            if (params == 'add') {
                this.dialogVisibleAdd = false
            }
            if (params == 'edit') {
                this.dialogVisibleEdit = false
            }
            if (params == 'reset') {
                this.dialogVisibleReset = false
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
            if (params == 'edit') {
                this.dialogVisibleEdit = false
                this.keyword = ''
                this.tablePage = 1
                this.handleList(this.keyword)
            }
            if (params == 'reset') {
                this.dialogVisibleReset = false
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
            this.userId = row.userId
            this.userName = row.userName
            this.dialogVisibleReset = true
        },
        // 编辑
        handleEdit (row) {
            this.rowData = row
            this.userId = row.userId
            this.isYou = row.userId == this.userInfo.userId
            this.userName = row.userName
            this.dialogVisibleEdit = true
        },
        // 删除
        handleDelete (row) {
            this.$confirm('确定要删除该用户吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$store.dispatch('system/DeleteSysuser', {userId: row.userId}).then(res => {
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
    .system-user{
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
                // color: #409EFF;
                // cursor: pointer;
            }
        }
        .table-body{
            margin-top: 20px;
        }
    }
</style>
