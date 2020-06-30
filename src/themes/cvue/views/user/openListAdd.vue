<template>
    <div class="add-open-list">
        <!-- 新增弹窗 -->
        <cvue-dialog :dialogVisible="dialogVisible"
                    title="新增"
                    dialogWidth="500px"
                    @handleOpen="getDetail"
                    @closeDialog="closeDialog"
                    @confirmDialog="confirmDialog"
                    @handleClose="handleClose">
            <div class="dialog-body" slot="dialogBody">
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="90px" class="demo-ruleForm">
                    <el-row :gutter="20">
                        <el-col :span="24">
                            <el-form-item label="手机号" prop="phone">
                                <el-input v-model.trim="ruleForm.phone" placeholder="请输入手机号"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="24">
                            <el-form-item label="套餐" prop="productId">
                                <el-select placeholder="请选择" v-model="ruleForm.productId" class="select-width">
                                    <el-option v-for="item in saleType" :key="item.productId" :label="item.productName" :value="item.productId"></el-option>
                                </el-select>
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
import {validPhone} from '@/util/validator.js'
export default {
    name: 'openListAdd',
    components: {
        cvueDialog,
        cvueTable
    },
    data () {
        return {
            ruleForm: {
                phone: '',
                productId: ''
            },
            rules: {
                phone: [
                    { required: true, trigger: 'blur', validator: validPhone }
                ],
                productId: [
                    { required: true, message: '请选择套餐', trigger: 'change' }
                ]
            },
            disabled: true,
            dialogLoading: false,
            saleType: [
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
                    var params = {
                        userId: this.$route.query.userId,
                        phone: this.ruleForm.phone,
                        productId: this.ruleForm.productId
                    }
                    this.dialogLoading = true
                    this.$store.dispatch('commonUser/OpenBusiness', params).then(res => {
                        console.log(res)
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
                phone: '',
                productId: ''
            }
            this.getProductType()
        },
        // 获取套餐信息
        getProductType () {
            this.$store.dispatch('product/ViewProductData').then(res => {
                if (res.code == 1) {
                    this.saleType = res.data
                }  
            })
        }
    }
}
</script>
<style lang="scss" scoped>
.add-open-list{
    .select-width{
        width: 100%;
    }
}
</style>
