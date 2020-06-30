<template>
    <div class="open-record">
        <!-- 开通记录 -->
        <cvue-dialog :dialogVisible="dialogVisible"
                    :isShowFoot = "false"
                    title="开通历史记录"
                    dialogWidth="660px"
                    @handleOpen="getDetail"
                    @closeDialog="closeDialog"
                    @confirmDialog="confirmDialog"
                    @handleClose="handleClose">
            <div class="dialog-body" slot="dialogBody">
                <div class="table-body">
                    <cvue-table :option="tableOption" :data="tableData" ref="tbl" 
                                :isShowAdd="false" :page="page" :layout="layout"
                                :tablePage="tablePage" :pageSize="page.pageSize"
                                :loading="dialogLoading"
                                :isShowPage="false">
                        <template slot-scope="scope" slot="operationChannel">
                            <span v-if="scope.row.operationChannel === 0">后台</span>
                            <span v-else-if="scope.row.operationChannel == 1">小程序</span>
                            <span v-else-if="scope.row.operationChannel == 2">Android</span>
                            <span v-else-if="scope.row.operationChannel == 3">Ios</span>
                        </template>
                        <template slot-scope="scope" slot="operationType">
                            <span v-if="scope.row.operationType === 0">开通</span>
                            <span v-else-if="scope.row.operationType == 1">退订</span>
                        </template>     
                    </cvue-table>
                </div>
            </div>            
        </cvue-dialog>
    </div>
</template>
<script>
import cvueDialog from '@/components/cvue-dialog'
import cvueTable from '@/components/cvue-table'
export default {
    name: 'openRecord',
    components: {
        cvueDialog,
        cvueTable
    },
    data () {
        return {
            dialogLoading: false,
            layout: 'total,sizes,prev,pager,next,jumper',
            tablePage: 1,
            page: {
                total: 1, // 总页数
                currentPage: 1, // 当前页数
                pageSize: 7, // 每页显示多少条
                pageSizes: [7, 10, 50, 100]
            },
            tableOption: {
                stripe: true,
                width: '100%',
                border: true,
                index: false,
                cloumn: [
                    {prop: 'index', label: '序号', align: 'center', width: 55},
                    {prop: 'accountId', label: '手机号', align: 'center'},
                    {prop: 'operationTime', label: '操作时间', align: 'center', width: 160},
                    {prop: 'operationChannel', label: '开通渠道', align: 'center', slotStatus: true},
                    {prop: 'operationType', label: '操作内容', align: 'center', slotStatus: true}
                ]
            },
            tableData: [
            ]
        }
    },
    props: {
        dialogVisible: {
            type: Boolean,
            default: false
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
        // 开通历史记录
        getDetail () {
            var params = {
                userId: this.$route.query.userId
            }
            this.dialogLoading = true
            this.$store.dispatch('commonUser/OpenHistory', params).then(res => {
                // console.log(res)
                if (res.code == 1) {
                    this.tableData = res.data.list
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
<style lang="scss" scoped>
.open-record{
    .el-form-item{
        margin-bottom: 0px;
    }
    .table-body{
        margin-top: 0px;
    }
}
</style>
