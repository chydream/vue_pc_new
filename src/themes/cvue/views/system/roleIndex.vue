<template>
    <div class="role-index">
        <el-card class="box-card">
            <!-- 头部 -->
            <div slot="header" class="clearfix fix-lh">
                <span>系统角色列表</span>
                <div class="btn-list">
                    <el-button @click="handleAdd" v-hasPermission="permission.add">新增</el-button>
                </div>
            </div>
            <div class="home-body">
                <cvue-table :option="tableOption" :data="tableData" ref="tbl1"
                            :isShowAdd="false" :page="page" 
                            :tablePage="tablePage" :pageSize="page.pageSize"
                            :loading="tableLoading"
                            :isShowPage="false">
                    <!-- 操作按钮 -->
                    <el-table-column fixed="right" slot="actionMenu" label="操作" align="center"
                        header-align="center"  width="160">
                        <template slot-scope="scope">
                            <el-button type="text" size="small" @click="handleEdit(scope.row)" v-hasPermission="permission.edit">编辑</el-button>
                            <el-button type="text" size="small" @click="handleDelete(scope.row)" v-hasPermission="permission.edit">删除</el-button>
                        </template>
                    </el-table-column>
                </cvue-table>
            </div>
        </el-card>        
        <!-- 新增弹窗 -->
        <role-add
            @closeDialog="closeDialog('add')"
            @confirmDialog="confirmDialog('add')"
            @handleClose="closeDialog('add')"
            :dialogVisible="dialogVisibleAdd">
        </role-add>
        <!-- 新增弹窗 -->
        <role-edit
            @closeDialog="closeDialog('edit')"
            @confirmDialog="confirmDialog('edit')"
            @handleClose="closeDialog('edit')"
            :dialogVisible="dialogVisibleEdit">
        </role-edit>
    </div>
</template>
<script>
import {mapGetters} from 'vuex'
import cvueTable from '@/components/cvue-table'
import cvueDialog from '@/components/cvue-dialog'
import roleAdd from './roleAdd'
import roleEdit from './roleEdit'
import indexPasswordReset from './indexPasswordReset'
import { baseUrl } from '@/config/config.js'
export default {
    name: 'roleIndex',
    components: {
        cvueTable,
        cvueDialog,
        roleAdd,
        indexPasswordReset,
        roleEdit
    },
    data () {
        return {
            roleId: '',
            keyword: '',
            tableLoading: false,
            dialogVisibleAdd: false,
            dialogVisibleEdit: false,
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
                    {prop: 'roleName', label: '角色', align: 'center'},
                    {prop: 'createTime', label: '创建时间', align: 'center'},
                    {prop: 'updateTime', label: '更新时间', align: 'center'},
                    {prop: 'describe', label: '角色描述', align: 'center'}
                ]
            },
            tableData: [
                {
                  roleName: '1', createTime: '网吧1', updateTime: '在线', describe: '5555'
                }
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
        // 列表接口
        handleList (keyword) {
            this.tableLoading = true
            this.$store.dispatch('demo/GetRoleList').then(res => {
                // console.log(res)
                if (res.success) {
                    var data = res.data
                    this.tableData = data
                    this.tableData.forEach((item, index) => {
                        if (item.describe == '') {
                            this.tableData[index].describe = '-'
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
            if (params == 'edit') {
                this.dialogVisibleEdit = false
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
        },
        // 新增
        handleAdd () {
            this.dialogVisibleAdd = true
        },
        // 编辑
        handleEdit (row) {
            this.roleId = row.roleId
            this.dialogVisibleEdit = true
        },
        // 删除
        handleDelete (row) {
            this.$confirm('确定要删除吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$store.dispatch('system/DeleteSysroles', {roleId: row.roleId}).then(res => {
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
    .role-index{
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
