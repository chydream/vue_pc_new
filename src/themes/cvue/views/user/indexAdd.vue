<template>
    <div>
        <!-- 新增弹窗 -->
        <cvue-dialog :dialogVisible="dialogVisible"
                    title="新增"
                    dialogWidth="500px"
                    @handleOpen="getDetail"
                    @closeDialog="closeDialog"
                    @confirmDialog="confirmDialog"
                    @handleClose="handleClose">
            <div class="dialog-body" slot="dialogBody">
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                    <el-row :gutter="20">
                        <el-col :span="24">
                            <el-form-item label="APP账号" prop="userName">
                                <el-input v-model.trim="ruleForm.userName" placeholder="请输入APP账号" ></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="24">
                            <el-form-item label="昵称" prop="nickName">
                                <el-input placeholder="请输入昵称" v-model.trim="ruleForm.nickName"></el-input>
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
        return {
            ruleForm: {
                userName: '',
                nickName: ''
            },
            rules: {
                userName: [
                     { required: true, trigger: 'blur', validator: validPhone }
                ],
                nickName: [
                    { required: true, message: '请输入昵称', trigger: 'blur' },
                    { min: 1, max: 8, message: '长度在 1 到 8 个字符', trigger: 'blur' }
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
                        userName: this.ruleForm.userName,
                        nickName: this.ruleForm.nickName
                    }
                    this.dialogLoading = true
                    // console.log(params)
                    this.$store.dispatch('commonUser/AddUserInfo', params).then(res => {
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
                userName: '',
                nickName: ''
            }
        }
    }
}
</script>
<style scoped>
</style>
