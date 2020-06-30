<template>
    <div>
        <!-- 密码重置 -->
        <cvue-dialog :dialogVisible="dialogVisible"
                    title="密码重置"
                    dialogWidth="500px"
                    @handleOpen="getDetail"
                    @closeDialog="closeDialog"
                    @confirmDialog="confirmDialog"
                    @handleClose="handleClose">
            <div class="dialog-body" slot="dialogBody">
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                    <el-row :gutter="20">
                        <el-col :span="24">
                            <el-form-item label="用户名" prop="userName">
                                <el-input v-model.trim="ruleForm.userName" disabled></el-input>
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
                    </el-row>
                </el-form>
            </div>            
        </cvue-dialog>
    </div>
</template>
<script>
import cvueDialog from '@/components/cvue-dialog'
import cvueTable from '@/components/cvue-table'
export default {
    name: 'indexPasswordReset',
    components: {
        cvueDialog,
        cvueTable
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
        return {
            ruleForm: {
                userName: this.$parent.userName,
                password: '',
                checkPassword: ''
            },
            rules: {
                password: [
                    { required: true, validator: validatePass, trigger: 'blur' }
                ],
                checkPassword: [
                    { required: true, validator: validatePass2, trigger: 'blur' }
                ]
            },
            disabled: true,
            dialogLoading: false
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
                    var params = {
                        userId: this.$parent.userId,
                        password: this.ruleForm.checkPassword,
                        userName: this.ruleForm.userName
                    }
                    this.dialogLoading = true
                    this.$store.dispatch('system/ResetPassword', params).then(res => {
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
            this.ruleForm = {
               userName: this.$parent.userName,
               password: '',
               checkPassword: ''
            }
        }
    }
}
</script>
<style scoped>
</style>
