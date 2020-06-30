<template>
    <div class="role-edit">
        <!-- 编辑弹窗 -->
        <cvue-dialog :dialogVisible="dialogVisible"
                    title="编辑"
                    dialogWidth="550px"
                    @handleOpen="getDetail"
                    @closeDialog="closeDialog"
                    @confirmDialog="confirmDialog"
                    @handleClose="handleClose">
            <div class="dialog-body" slot="dialogBody">
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="80px" class="demo-ruleForm">
                    <el-row :gutter="20">
                        <el-col :span="24">
                            <el-form-item label="角色名称" prop="roleName">
                                <el-input v-model.trim="ruleForm.roleName" placeholder="请输入角色名称"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="24">
                            <el-form-item label="角色描述" prop="describe">
                                <el-input placeholder="请输入角色描述" v-model.trim="ruleForm.describe"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="24">
                            <el-form-item label="页面权限" prop="authority">
                                <!-- <cvue-table :option="tableOption" :data="tableData" ref="tbl1">
                                    <template slot-scope="scope" slot="edit">
                                        <el-checkbox v-model="scope.row.edit" v-if="scope.row.describe != '用户反馈' && scope.row.describe != '日志管理' && scope.row.describe != '系统设置'"></el-checkbox>
                                    </template>
                                    <template slot-scope="scope" slot="view">
                                        <el-checkbox v-model="scope.row.view" v-if="scope.row.describe != '用户反馈' && scope.row.describe != '日志管理' && scope.row.describe != '系统设置'"></el-checkbox>
                                    </template>
                                </cvue-table> -->
                                <cvue-tree-grid :option="option">
                                     <template slot-scope="scope" slot="edit">
                                        <el-checkbox v-model="scope.row.edit" v-if="checkScope(scope.row)" @change="editChange(scope.row)"></el-checkbox>
                                    </template>
                                    <template slot-scope="scope" slot="view">
                                        <el-checkbox v-model="scope.row.view" v-if="checkScope(scope.row)" @change="viewChange(scope.row)"></el-checkbox>
                                    </template>
                                </cvue-tree-grid>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </div>            
        </cvue-dialog>
    </div>
</template>
<script>
import cvueTreeGrid from '@/components/cvue-tree-grid'
import cvueDialog from '@/components/cvue-dialog'
import cvueTable from '@/components/cvue-table'
import {validPhone, validIp} from '@/util/validator.js'
export default {
    name: 'roleEdit',
    components: {
        cvueDialog,
        cvueTable,
        cvueTreeGrid
    },
    data () {
        var validUserName = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入角色名称'))
            } else if (value === undefined) {
                callback(new Error('请输入角色名称'))
            } else if (value.length < 1 || value.length > 10) {
                callback(new Error('长度在 1 到 10 个字符'))
            } else {
                this.$store.dispatch('system/CheckSysroles', {roleName: value}).then((res) => {
                    if (!res.data) {
                        if (value == this.roleName) {
                            callback()
                        } else {
                            callback(new Error('角色名称已经存在'))
                        }
                    } else {
                        callback()
                    }
                })
            }
        }
        return {
            roleName: '',
            ruleForm: {
                roleName: '',
                describe: ''
            },
            rules: {
                roleName: [
                    { required: true, trigger: 'blur', validator: validUserName }
                    // { required: true, message: '请输入角色名称', trigger: 'blur' },
                    // { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
                ],
                describe: [
                    {min: 0, max: 100, message: '长度在 0 到 100 个字符', trigger: 'blur'}
                ]
            },
            disabled: true,
            dialogLoading: false,
            tableOption: {
                stripe: true,
                width: '100%',
                border: true,
                index: false,
                cloumn: [
                    {prop: 'describe', label: '模块', align: 'center'},
                    {prop: 'edit', label: '编辑权限', align: 'center', slotStatus: true},
                    {prop: 'view', label: '查看权限', align: 'center', slotStatus: true}
                ]
            },
            tableData: [
                {
                  code: '运营报表', edit: false, view: true
                }
            ],
            option: {
                expandAll: true,
                columns: [
                    {
                        text: '模块',
                        value: 'describe',
                        width: 200
                    },
                    {
                        text: '编辑权限',
                        value: 'edit',
                        slotStatus: true,
                        align: 'center'
                    },
                    {
                        text: '查看权限',
                        value: 'view',
                        slotStatus: true,
                        align: 'center'
                    }
                ],
                data: [
                ]
            }
        }
    },
    props: {
        dialogVisible: {
            type: Boolean,
            default: false
        }
    },
    mounted () {
    },
    methods: {
        // 复选change事件
        editChange (row) {
            // console.log(row)
            if (row.edit) {
                this.$set(row, 'view', true)
            } else {
                this.$set(row, 'view', false)
            }
        },
        viewChange (row) {
            // console.log(row)
            if (!row.view) {
               this.$set(row, 'edit', false)
            } 
        },
        // 是否显示父级互选框
        checkScope (row) {
            if (row.children && row.children.length === 0) {
                return true
            } else {
                return false
            }
        },
        // 触发事件
        handleClose () {
            this.$refs['ruleForm'].clearValidate()
            // this.$refs['ruleForm'].resetFields()
            this.$emit('handleClose')
        },
        closeDialog () {
            this.$refs['ruleForm'].clearValidate()
            // this.$refs['ruleForm'].resetFields()
            this.$emit('closeDialog')
        },
        confirmDialog () {
            // 扁平化树数组
            function mapData (arr) {
                var newArr = []
                arr.map((item) => {
                    var arr = []
                    if (item.view) {
                        arr.push('view')
                    }
                    if (item.edit) {
                        arr.push('edit')
                    }
                    var permissions = arr.join(',')
                    if (item.children && item.children.length > 0) {
                        newArr.push({
                            code: item.code,
                            permissions: ''
                        })
                        newArr = newArr.concat(mapData(item.children))
                    } else {
                        newArr.push({
                            code: item.code,
                            permissions: permissions
                        })
                    }
                })
                return newArr
            }
            this.$refs.ruleForm.validate((valid) => {
                if (valid) {
                    var authority = mapData(this.option.data)
                    var newAuthority = []
                    authority.forEach((item, index) => {
                        if (item.permissions != '') {
                            newAuthority.push(item)
                        }
                    })
                    var params = {
                        roleName: this.ruleForm.roleName,
                        describe: this.ruleForm.describe,
                        authority: newAuthority
                    }
                    params.roleId = this.$parent.roleId
                    this.dialogLoading = true
                    this.$store.dispatch('system/EditSysroles', params).then(res => {
                        // console.log(res)
                        if (res.code == 1) {
                            this.$message({
                                message: res.msg,
                                duration: 2000,
                                type: 'success'
                            })
                            this.$emit('confirmDialog')
                        } else {
                            this.$message({
                                message: res.msg,
                                duration: 2000,
                                type: 'error'
                            })
                        }
                        this.dialogLoading = false
                    })
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },
        // 初始化弹窗
        getDetail () {
            // 获取权限列表
            // this.$store.dispatch('user/GetAuthority').then((res) => {
            //     if (res.code == 1) {
            //         this.option.data = res.data
            //         // 获取当前角色详情
            //         this.$store.dispatch('system/GetSysrolesDetail', {roleId: this.$parent.roleId}).then(res => {
            //             if (res.code == 1) {
            //                 // console.log(res)
            //                 this.ruleForm = res.data
            //                 this.roleName = res.data.roleName
            //                 // 数据递归处理
            //                 this.option.data.forEach((item, index) => {
            //                     if (item.children && item.children.length > 0) {
            //                         item.children.forEach((child, j) => {
            //                             res.data.authority.forEach((auth, i) => {
            //                                 if (child.code == auth.code) {
            //                                     this.$set(this.option.data[index].children[j], 'permissions', auth.permissions)
            //                                     this.$set(this.option.data[index].children[j], 'edit', auth.permissions.indexOf('edit') >= 0)
            //                                     this.$set(this.option.data[index].children[j], 'view', auth.permissions.indexOf('view') >= 0)
            //                                 }
            //                             })
            //                         })                
            //                     } else {
            //                         res.data.authority.forEach((auth, i) => {
            //                             if (item.code == auth.code) {
            //                                 this.$set(this.option.data[index], 'permissions', auth.permissions)
            //                                 this.$set(this.option.data[index], 'edit', auth.permissions.indexOf('edit') >= 0)
            //                                 this.$set(this.option.data[index], 'view', auth.permissions.indexOf('view') >= 0)
            //                             }
            //                         })
            //                     }
            //                 })
            //             } else {
            //                 console.log(res.msg)
            //             }
            //         })
            //     }
            // })
        }
    }
}
</script>
<style scoped lang="scss">
.role-edit{
    .dialog-body{
        height: 400px;
        overflow: auto;
    }
}
</style>
