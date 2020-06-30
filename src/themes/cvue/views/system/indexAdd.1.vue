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
                                <el-input v-model.trim="ruleForm.userName"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="24">
                            <el-form-item label="姓名" prop="name">
                                <el-input placeholder="请输入详细地址" v-model.trim="ruleForm.name"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="24">
                            <el-form-item label="联系电话" prop="phone">
                                <el-input v-model.trim="ruleForm.phone"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="24">
                            <el-form-item label="角色" prop="rodeId">
                                <el-select placeholder="请选择" v-model="ruleForm.rodeId" class="select-width" @change="selectRole">
                                    <el-option v-for="item in roleType" :key="item.rodeId" :label="item.roleName" :value="item.rodeId"></el-option>
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
                                <cvue-table :option="tableOption" :data="tableData" ref="tbl1">
                                    <template slot-scope="scope" slot="edit">
                                        <el-checkbox v-model="scope.row.edit" v-if="scope.row.describe != '用户反馈' && scope.row.describe != '日志管理' && scope.row.describe != '系统设置'"></el-checkbox>
                                    </template>
                                    <template slot-scope="scope" slot="view">
                                        <el-checkbox v-model="scope.row.view" v-if="scope.row.describe != '用户反馈' && scope.row.describe != '日志管理' && scope.row.describe != '系统设置'"></el-checkbox>
                                    </template>
                                </cvue-table>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </div>            
        </cvue-dialog>
    </div>
</template>
<script>
import cvueDialog from '@/components/cvue-dialog'
import cvueTable from '@/components/cvue-table'
import {validPhone, validIp} from '@/util/validator.js'
export default {
    name: 'indexAdd',
    components: {
        cvueDialog,
        cvueTable
    },
    data () {
        var validatePass = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入密码'))
            } else {
                if (this.ruleForm.checkPassword !== '') {
                    this.$refs.ruleForm.validateField('checkPassword')
                }
                callback()
            }
        }
        var validatePass2 = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请再次输入密码'))
            } else if (value !== this.ruleForm.password) {
                callback(new Error('两次输入密码不一致!'))
            } else {
                callback()
            }
        }
        return {
            ruleForm: {
                userName: '',
                name: '',
                phone: '',
                rodeId: '',
                state: 1,
                password: '',
                checkPassword: ''
            },
            rules: {
                userName: [
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                    { min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'blur' }
                ],
                name: [
                    { required: true, message: '请输入网吧名称', trigger: 'blur' },
                    { min: 1, max: 5, message: '长度在 1 到 5 个字符', trigger: 'blur' }
                ],
                phone: [
                    { required: true, trigger: 'blur', validator: validPhone }
                ],
                // rodeId: [
                //     { required: true, message: '请选择角色', trigger: 'change' }
                // ],
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
            ]
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
        // 触发事件
        handleClose () {
            this.$refs['ruleForm'].clearValidate()
            this.$refs['ruleForm'].resetFields()
            this.$emit('handleClose')
        },
        closeDialog () {
            this.$refs['ruleForm'].clearValidate()
            this.$refs['ruleForm'].resetFields()
            this.$emit('closeDialog')
        },
        confirmDialog () {
            this.$refs.ruleForm.validate((valid) => {
                if (valid) {
                    var authority = this.tableData.map((item) => {
                        var arr = []
                        if (item.view) {
                            arr.push('view')
                        }
                        if (item.edit) {
                            arr.push('edit')
                        }
                        var permissions = arr.join(',')
                        return {
                            code: item.code,
                            permissions: permissions
                        }
                    })
                    var params = {
                        userName: this.ruleForm.userName,
                        name: this.ruleForm.name,
                        phone: this.ruleForm.phone,
                        roleId: this.ruleForm.roleId,
                        state: this.ruleForm.state,
                        password: this.ruleForm.password,
                        authority: authority
                    }
                    this.dialogLoading = true
                    this.$store.dispatch('system/AddSysuser', params).then(res => {
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
            this.ruleForm = {
                userName: '',
                name: '',
                phone: '',
                roleId: 1,
                state: 1
            }
            this.$store.dispatch('system/GetSysroles').then(res => {
                // console.log(res)
                if (res.code == 1) {
                    this.roleType = res.data
                    this.ruleForm.roleId = 1
                    this.selectRole(1)
                } else {
                    console.log(res.msg)
                }
            })
        },
        selectRole (roleId) {
            this.$store.dispatch('user/GetAuthority').then((res) => {
                if (res.code == 1) {
                    this.tableData = res.data
                    // console.log(JSON.stringify(this.tableData))
                    // [{"code":"11000","describe":"运营报表","remarks":null,"pcode":"0"},{"code":"12000","describe":"用户管理","remarks":null,"pcode":"0"},{"code":"13000","describe":"订单管理","remarks":null,"pcode":"0"},{"code":"14000","describe":"套餐管理","remarks":null,"pcode":"0"},{"code":"15000","describe":"用户反馈","remarks":null,"pcode":"0"},{"code":"15010","describe":"意见反馈","remarks":null,"pcode":"15000"},{"code":"15020","describe":"管控异常反馈","remarks":null,"pcode":"15000"},{"code":"16000","describe":"日志管理","remarks":null,"pcode":"0"},{"code":"16010","describe":"操作日志","remarks":null,"pcode":"16000"},{"code":"16020","describe":"系统日志","remarks":null,"pcode":"16000"},{"code":"17000","describe":"系统设置","remarks":null,"pcode":"0"},{"code":"17010","describe":"系统用户管理","remarks":null,"pcode":"17000"},{"code":"17020","describe":"角色管理","remarks":null,"pcode":"17000"}]
                    this.$store.dispatch('system/GetUserAuth', {roleId: roleId}).then(res => {
                        function getAuth (item, action) {
                            var bool = false
                            res.data.authority.forEach((auth, index) => {
                                if (item.code == auth.code) {
                                    bool = auth.permissions.indexOf(action) >= 0
                                }
                            })
                            return bool
                        }
                        if (res.code == 1) {
                            this.tableData = this.tableData.map((item) => {
                                 var edit = getAuth(item, 'edit')
                                 var view = getAuth(item, 'view')
                                 return {
                                    code: item.code,
                                    describe: item.describe,
                                    edit: edit,
                                    view: view
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
