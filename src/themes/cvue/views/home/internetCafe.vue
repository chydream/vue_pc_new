<template>
    <div>
        <!-- 网吧ID信息 -->
        <cvue-dialog :dialogVisible="dialogVisible"
                    :title="title"
                    :isShowFoot = false
                    dialogWidth="500px"
                    @handleOpen="getDetail"
                    @closeDialog="closeDialog"
                    @confirmDialog="confirmDialog"
                    @handleClose="handleClose">
            <div class="dialog-body" slot="dialogBody">
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                    <el-row :gutter="20">
                        <el-col :span="24">
                            <el-form-item label="网吧ID" prop="id">
                                <el-input v-model="ruleForm.id" :disabled="disabled"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="24">
                            <el-form-item label="网吧名称" prop="name">
                                <el-input v-model="ruleForm.name" :disabled="disabled"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="24">
                            <el-form-item label="网吧地址" prop="address">
                                <el-input v-model="ruleForm.address" :disabled="disabled"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="24">
                            <el-form-item label="联系人" prop="contacts">
                                <el-input v-model="ruleForm.contacts" :disabled="disabled"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="24">
                            <el-form-item label="联系方式" prop="tel">
                                <el-input v-model="ruleForm.tel" :disabled="disabled"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="24">
                            <el-form-item label="联系邮箱" prop="email">
                                <el-input v-model="ruleForm.email" :disabled="disabled"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="24">
                            <el-form-item label="本网DNS" prop="ownDNS">
                                <el-input v-model="ruleForm.ownDNS" :disabled="disabled"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="24">
                            <el-form-item label="出口DNS" prop="thirdDNS">
                                <el-input v-model="ruleForm.thirdDNS" :disabled="disabled"></el-input>
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
                thirdDNS: ''
            },
            rules: {},
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
    computed: {
        title () {
            return this.$parent.rowTitle + ' 网吧详情'
        }
    },
    methods: {
        // 触发事件
        handleClose () {
            this.$emit('handleClose')
        },
        closeDialog () {
            this.$emit('closeDialog')
        },
        confirmDialog () {
            this.$emit('confirmDialog')
        },
        // 获取网吧详情
        getDetail () {
            var params = this.$parent.rowId
            this.dialogLoading = true
            this.$store.dispatch('home/GetCybercafesDetail', params).then(res => {
                // console.log(res)
                if (res.code == 1) {
                    this.ruleForm = res.data
                    // console.log(this.ruleForm)
                    this.ruleForm.id = params
                    // 拼接地址
                    if (res.data.province == 360000) {
                        var city = res.data.cityName ? res.data.cityName : ''
                        this.ruleForm.address = '江西省' + city + res.data.address
                    }
                } else {
                    this.$message({
                        message: res.msg,
                        duration: 2000,
                        type: 'error'
                    })
                }
                this.dialogLoading = false
            })
        }
    }
}
</script>
<style lang="sass" scoped>
</style>
