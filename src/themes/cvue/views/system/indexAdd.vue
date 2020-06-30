<template>
    <div class="index-add">
        <!-- 新增弹窗 -->
        <cvue-dialog :dialogVisible="dialogVisible"
                    title="新增"
                    dialogWidth="600px"
                    @handleOpen="getDetail"
                    @closeDialog="closeDialog"
                    @confirmDialog="confirmDialog"
                    @handleClose="handleClose">
            <div class="dialog-body" slot="dialogBody">
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="80px" class="demo-ruleForm">
                    <el-row :gutter="20">
                        <el-col :span="24">
                            <el-form-item label="用户名" prop="userName">
                                <el-input v-model.trim="ruleForm.userName" placeholder="请输入用户名" @input.native="checkLen" ref="userName"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="24">
                            <el-form-item label="姓名" prop="name">
                                <el-input placeholder="请输入姓名" v-model.trim="ruleForm.name"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="24">
                            <el-form-item label="联系电话" prop="phone">
                                <el-input v-model.trim="ruleForm.phone" placeholder="请输入联系电话"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="24">
                            <el-form-item label="角色" prop="roleId">
                                <el-select placeholder="请选择" v-model="ruleForm.roleId" class="select-width" @change="selectRole">
                                    <el-option v-for="item in roleType" :key="item.roleId" :label="item.roleName" :value="item.roleId"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="24">
                            <el-form-item label="状态" prop="state">
                                <el-radio-group v-model="ruleForm.state">
                                    <el-radio :label="1">启用</el-radio>
                                    <el-radio :label="0">禁用</el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                        <el-col :span="24">
                            <el-form-item label="输入密码" prop="password">
                                <el-input placeholder="请输入密码" v-model.trim="ruleForm.password" type="password"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="24">
                            <el-form-item label="确认密码" prop="checkPassword">
                                <el-input placeholder="请输入密码" v-model.trim="ruleForm.checkPassword" type="password"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="24">
                            <el-form-item label="页面权限" prop="authority">
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
    name: 'indexAdd',
    components: {
        cvueDialog,
        cvueTable,
        cvueTreeGrid
    },
    data () {
        var validatePass = (rule, value, callback) => {
            var reg = /^[0-9A-Za-z]+$/
            if (value === '') {
                callback(new Error('请输入密码'))
            } else if (value === undefined) {
                callback(new Error('请输入密码'))
            } else if (value.length < 8 || value.length > 16) {
                callback(new Error('长度在 8 到 16 个字符'))
            } else if (!reg.test(value)) {
                callback(new Error('只允许输入数字和字母'))
            } else {
                // if (this.ruleForm.checkPassword !== '') {
                //     this.$refs.ruleForm.validateField('checkPassword')
                // }
                callback()
            }
        }
        var validatePass2 = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请再次输入密码'))
            } else if (value === undefined) {
                callback(new Error('请再次输入密码'))
            } else if (value !== this.ruleForm.password) {
                callback(new Error('两次输入密码不一致!'))
            } else {
                callback()
            }
        }
        var validUserName = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入用户名'))
                } else if (value === undefined) {
                    callback(new Error('请输入用户名'))
                } else if (value.length < 5 || value.length > 16) {
                    callback(new Error('长度在 5 到 16 个字符'))
                } else {
                    this.$store.dispatch('system/CheckSysuser', {userName: value}).then((res) => {
                        if (!res.data) {
                            callback(new Error('用户名已经存在'))
                        } else {
                            callback()
                        }
                    })
                }
        }
        return {
            ruleForm: {
                userName: '',
                name: '',
                phone: '',
                roleId: '',
                state: 1,
                password: '',
                checkPassword: ''
            },
            rules: {
                userName: [
                    { required: true, trigger: 'blur', validator: validPhone }
                    // { required: true, message: '请输入用户名', trigger: 'blur' },
                    // { min: 5, max: 16, message: '长度在 5 到 16 个字符', trigger: 'blur' }
                ],
                name: [
                    { required: true, message: '请输入姓名', trigger: 'blur' },
                    { min: 1, max: 5, message: '长度在 1 到 5 个字符', trigger: 'blur' }
                ],
                phone: [
                    { required: true, trigger: 'blur', validator: validPhone }
                ],
                roleId: [
                    { required: true, message: '请选择角色', trigger: 'change' }
                ],
                password: [
                    { required: true, validator: validatePass, trigger: 'blur' }
                ],
                checkPassword: [
                    { required: true, validator: validatePass2, trigger: 'blur' }
                ]
            },
            disabled: true,
            dialogLoading: false,
            provinces: '',
            citys: [],
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
                // {
                //   code: '运营报表', edit: false, view: true
                // }
            ],
            roleType: [
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
        checkLen () {
            if (this.ruleForm.userName.length > 11) {
                this.$nextTick(function () {
                    // this.ruleForm.userName = this.ruleForm.userName.substring(0, 11)
                })
            }
        },
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
            this.$refs['ruleForm'].resetFields()
            this.$emit('handleClose')
            this.option.data = []
        },
        closeDialog () {
            this.$refs['ruleForm'].clearValidate()
            this.$refs['ruleForm'].resetFields()
            this.$emit('closeDialog')
            this.option.data = []
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
                        userName: this.ruleForm.userName,
                        name: this.ruleForm.name,
                        phone: this.ruleForm.phone,
                        roleId: this.ruleForm.roleId,
                        state: this.ruleForm.state,
                        password: this.ruleForm.password,
                        authority: newAuthority
                    }
                    this.dialogLoading = true
                    // console.log(params)
                    this.$store.dispatch('system/AddSysuser', params).then(res => {
                        if (res.code == 1) {
                            this.$message({
                                message: res.msg,
                                duration: 2000,
                                type: 'success'
                            })
                            this.$refs['ruleForm'].clearValidate()
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
            this.ruleForm = {
                userName: '',
                name: '',
                phone: '',
                roleId: '',
                state: 1
            }
            // 获取角色列表
            // this.$store.dispatch('system/GetSysroles').then(res => {
            //     // console.log(res)
            //     if (res.code == 1) {
            //         this.roleType = res.data
            //         this.$store.dispatch('user/GetAuthority').then((res) => {
            //             // console.log(res)
            //             if (res.code == 1) {
            //                 this.option.data = res.data
            //             }
            //         })
            //         // console.log(this.option.data)
            //         // this.ruleForm.roleId = 27
            //         // this.selectRole(27)
            //     } else {
            //         console.log(res.msg)
            //     }
            // })
        },
        // 角色选择
        selectRole (roleId) {
            // 获取权限列表
            this.$store.dispatch('user/GetAuthority').then((res) => {
                // console.log(res)
                if (res.code == 1) {
                    var newData = JSON.parse(JSON.stringify(res.data))
                    this.option.data = res.data
                    // 根据对应角色返回对应角色权限
                    this.$store.dispatch('system/GetSysrolesDetail', {roleId: roleId}).then(res => {
                        // console.log(res)
                        if (res.code == 1) {
                            // 数据递归处理
                            this.option.data.forEach((item, index) => {
                                if (item.children && item.children.length > 0) {
                                    item.children.forEach((child, j) => {
                                        this.$set(this.option.data[index].children[j], 'edit', false)
                                        this.$set(this.option.data[index].children[j], 'view', false)
                                        res.data.authority.forEach((auth, i) => {
                                            if (child.code == auth.code) {
                                                this.$set(this.option.data[index].children[j], 'permissions', auth.permissions)
                                                this.$set(this.option.data[index].children[j], 'edit', auth.permissions.indexOf('edit') >= 0)
                                                this.$set(this.option.data[index].children[j], 'view', auth.permissions.indexOf('view') >= 0)
                                            }
                                        })
                                    })
                                } else {
                                    this.$set(this.option.data[index], 'edit', false)
                                    this.$set(this.option.data[index], 'view', false)
                                    res.data.authority.forEach((auth, i) => {
                                        if (item.code == auth.code) {
                                            this.$set(this.option.data[index], 'permissions', auth.permissions)
                                            this.$set(this.option.data[index], 'edit', auth.permissions.indexOf('edit') >= 0)
                                            this.$set(this.option.data[index], 'view', auth.permissions.indexOf('view') >= 0)
                                        }
                                    })
                                }
                            })
                        } else {
                            console.log(res.msg)
                        }
                    })
                }
            })
        }
    }
}
</script>
<style lang="scss" scoped>
.select-width{
    width: 100%;
}
.index-add{
    .dialog-body{
        height: 400px;
        overflow: auto;
    }
}
</style>
