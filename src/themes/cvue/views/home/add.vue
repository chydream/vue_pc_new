<template>
    <div>
        <!-- 编辑弹窗 -->
        <cvue-dialog :dialogVisible="dialogVisible"
                    title="新增网吧"
                    dialogWidth="500px"
                    @handleOpen="getDetail"
                    @closeDialog="closeDialog"
                    @confirmDialog="confirmDialog"
                    @handleClose="handleClose">
            <div class="dialog-body" slot="dialogBody">
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                    <el-row :gutter="20">
                        <!-- <el-col :span="24">
                            <el-form-item label="网吧ID" prop="id">
                                <el-input v-model="ruleForm.id" :disabled="disabled"></el-input>
                            </el-form-item>
                        </el-col> -->
                        <el-col :span="24">
                            <el-form-item label="网吧名称" prop="name">
                                <el-input v-model.trim="ruleForm.name"></el-input>
                            </el-form-item>
                        </el-col>
                        <!-- 网吧地址旧版 -->
                        <!-- <el-col :span="24">
                            <el-form-item label="网吧地址" prop="address">
                                <el-input v-model.trim="ruleForm.address"></el-input>
                            </el-form-item>
                        </el-col> -->

                        <!-- 网吧详情 -->
                        <el-col :span="24">
                            <el-form-item label="网吧地址" required>
                                <!-- <province-city @selectChange = "selectChange"></province-city> -->
                                <div class="city-box">
                                    <el-form-item prop="province">
                                        <!-- 省份选择器 -->
                                        <el-select v-model.trim="provinces" disabled placeholder="请选择省份" style="width:170px;">
                                        <!-- <el-select v-model.trim="provinces" placeholder="请选择省份" @change="provinceChanged" style="width:170px;"> -->
                                            <!-- <el-option :key="''" :label="provinces" :value="provinces"></el-option> -->
                                            <!-- <el-option :label="provinces" :value="provinces"></el-option> -->
                                        </el-select>
                                    </el-form-item>           
                                    <el-form-item prop="city">
                                        <!-- 城市选择器 -->
                                        <el-select v-model.trim="ruleForm.city" placeholder="请选择城市" style="width:170px;" value-key="code">
                                        <!-- <el-select v-model.trim="ruleForm.city" @change="cityChanged" placeholder="请选择城市" style="width:170px;" value-key="code"> -->
                                            <!-- <el-option :key="''" :label="'请选择城市'" :value="''"></el-option> -->
                                            <el-option v-for="item in citys" :key="item.code" :label="item.name" :value="item"></el-option>
                                        </el-select>
                                    </el-form-item>           
                                </div>
                            </el-form-item>            
                        </el-col>

                        <el-col :span="24">
                            <el-form-item label="" prop="address">
                                <el-input placeholder="请输入详细地址" v-model.trim="ruleForm.address"></el-input>
                            </el-form-item>
                        </el-col>

                        <el-col :span="24">
                            <el-form-item label="联系人" prop="contacts">
                                <el-input v-model.trim="ruleForm.contacts"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="24">
                            <el-form-item label="联系方式" prop="tel">
                                <el-input v-model.trim="ruleForm.tel"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="24">
                            <el-form-item label="联系邮箱" prop="email">
                                <el-input v-model.trim="ruleForm.email"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="24">
                            <el-form-item label="本网DNS" prop="ownDNS">
                                <el-input v-model.trim="ruleForm.ownDNS"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="24">
                            <el-form-item label="出口DNS" prop="thirdDNS">
                                <el-input v-model.trim="ruleForm.thirdDNS"></el-input>
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
    name: 'internetCafe',
    components: {
        cvueDialog,
        cvueTable
    },
    data () {
        return {
            ruleForm: {
                name: '',
                address: '',
                contacts: '',
                tel: '',
                email: '',
                ownDNS: '',
                thirdDNS: '',
                province: '', // 省份编码
                city: '' // 城市选择器的绑定值
            },
            rules: {
                name: [
                    { required: true, message: '请输入网吧名称', trigger: 'blur' },
                    { min: 1, max: 8, message: '长度在 1 到 8 个字符', trigger: 'blur' }
                ],
                // province: [
                //     { required: true, message: '请选择省份', trigger: 'change' }
                // ],
                city: [
                    { required: true, message: '请选择城市', trigger: 'change' }
                ],
                address: [
                    { required: true, message: '请输入网吧详细地址', trigger: 'blur' },
                    { min: 1, max: 25, message: '长度在 1 到 25 个字符', trigger: 'blur' }
                ],
                contacts: [
                    { required: true, message: '请输入网吧联系人', trigger: 'blur' },
                    { min: 1, max: 5, message: '长度在 1 到 5 个字符', trigger: 'blur' }
                ],
                tel: [
                    { required: true, trigger: 'blur', validator: validPhone }
                ],
                email: [
                    { required: true, message: '请输入联系邮箱', trigger: 'blur' },
                    { type: 'email', message: '请输入正确的联系邮箱', trigger: 'blur' }
                ],
                ownDNS: [
                    { required: true, trigger: 'blur', validator: validIp }
                ],
                thirdDNS: [
                    { required: true, trigger: 'blur', validator: validIp }
                ]
            },
            disabled: true,
            dialogLoading: false,
            provinces: '',
            citys: []
        }
    },
    props: {
        dialogVisible: {
            type: Boolean,
            default: false
        }
    },
    mounted () {
        // this.getCitys() // 获取城市列表
    },
    methods: {
        getCitys () {
            var params = {}
            // var _self = this
            this.$store.dispatch('home/GetCitys', params).then(res => {
                // console.log(res)
                if (res.code == 1) {
                    for (var i = 0; i < res.data.length; i++) {
                        if (res.data[i].pcode == 0) {
                            this.provinces = res.data[i].name
                        } else {
                            this.citys.push(res.data[i])  
                        }
                    }
                    // this.city=res.data.filter(function (item) {return res.da});
                    // this.provinces = res.data
                }
            })
        },
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
                    // var params = this.ruleForm
                    var params = {
                        name: this.ruleForm.name,
                        address: this.ruleForm.address,
                        contacts: this.ruleForm.contacts,
                        tel: this.ruleForm.tel,
                        email: this.ruleForm.email,
                        ownDNS: this.ruleForm.ownDNS,
                        thirdDNS: this.ruleForm.thirdDNS,
                        province: 360000, // 省份
                        city: this.ruleForm.city.code // 城市
                    }
                    // console.log(params)
                    this.dialogLoading = true
                    this.$store.dispatch('home/AddCybercafesDetail', params).then(res => {
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
                name: '',
                address: '',
                contacts: '',
                tel: '',
                email: '',
                ownDNS: '',
                thirdDNS: ''
            }
        }
        // ,
        // provinceChanged (value) {
        //     console.log(value)
        // },
        // cityChanged (value) {
        //     console.log(value)
        // }
        // 省市选择器组件的返回值
        // selectChange (data) {
        //     console.log(data)
        // }
    }
}
</script>
<style scoped>
    .city-box{
        display: flex;
        justify-content: space-between;
        height: 30px;
    }
</style>
