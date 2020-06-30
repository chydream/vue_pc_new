<template>
    <div class="fault-analysis">
        <!-- 故障分析 -->
        <cvue-dialog :dialogVisible="dialogVisible"
                    :isShowFoot = false
                    :title="title"
                    dialogWidth="760px"
                    @handleOpen="setDetail"
                    @closeDialog="closeDialog"
                    @confirmDialog="confirmDialog"
                    @handleClose="handleClose">
            <div class="dialog-body" slot="dialogBody">
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="demo-ruleForm">
                    <el-row :gutter="20">
                        <el-col :span="7">
                            <el-select placeholder="请选择" v-model="selectValue" @change="changeSelect">
                                <el-option label="PING" value="investigate_ping"></el-option>
                                <el-option label="路由跟踪" value="investigate_trace_route"></el-option>
                            </el-select>
                        </el-col>
                        <el-col :span="7">
                            <el-form-item prop="ip">
                                <el-input v-model.trim="ruleForm.ip" placeholder="请输入ip地址"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="4">
                            <el-form-item prop="number" v-if="selectValue == 'investigate_ping'">
                                <el-input v-model.trim="ruleForm.number" placeholder="数字"><template slot="append">次</template></el-input>
                            </el-form-item>
                            <el-form-item v-else>
                                <span style="font-size:12px;color:#ccc;">请3分钟后刷新</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6" class="text-right">
                            <div v-if="selectValue == 'investigate_ping'">
                                <el-button type="danger" size="mini" @click="start" v-if="startStatus">开始</el-button>
                                <el-button type="danger" size="mini" @click="stop" v-else>停止</el-button>
                            </div>
                            <div v-else>
                                <div v-if="!countdownStatus">
                                    <el-button type="danger" size="mini" @click="tracerouteStart" >
                                        <em>开始</em>
                                    </el-button>
                                    <el-button type="danger" size="mini" @click="refreshData">
                                        <em>刷新</em>
                                    </el-button>
                                </div>
                                <div v-else>
                                    <el-button type="danger" size="mini"  disabled>
                                        <em>{{countdown}}</em>
                                    </el-button>
                                    <el-button type="danger" size="mini" @click="refreshData">
                                        <em>刷新</em>
                                    </el-button>
                                </div>
                            </div>
                        </el-col>
                    </el-row>
                </el-form>
                <div class="fault-wrap" v-loading="dialogLoading" v-if="selectValue == 'investigate_ping'">
                    <div class="fault-body">
                        <p v-for="(item, index) in resultArr" :key="index" v-html="item"></p>
                    </div>
                </div>
                <div class="fault-wrap" v-else style="min-height:390px;">
                    <cvue-table :option="tableOption" :data="tableData" ref="tbl" 
                                :isShowAdd="false" :page="page" :layout="layout"
                                :tablePage="tablePage" :pageSize="page.pageSize"
                                :loading="tableLoading"
                                @current-change="handleCurrentChange"
                                @size-change="handleSizeChange"
                                :isShowPage="true">
                         <!-- 操作按钮 -->
                        <el-table-column fixed="right" slot="actionMenu" label="操作" align="center"
                            header-align="center"  width="120">
                            <template slot-scope="scope">
                                <el-button type="text" size="small" @click="previewData(scope.row)">预览</el-button>
                                <el-button type="text" size="small" @click="deleteData(scope.row)">删除</el-button>
                            </template>
                        </el-table-column>
                    </cvue-table>
                </div>
            </div>            
        </cvue-dialog>
        <cvue-dialog :dialogVisible="previewDialog"
                    title="路由详情"
                    dialogWidth="760px"
                    :isShowFoot = "false"
                    @handleClose="closeDialogTraceroute">
            <div class="dialog-body" slot="dialogBody">
                <div class="fault-body">
                    <p v-for="(item, index) in previewArr" :key="index" v-html="item"></p>
                </div>
            </div>            
        </cvue-dialog>
    </div>
</template>
<script>
import cvueDialog from '@/components/cvue-dialog'
import cvueTable from '@/components/cvue-table'
import {socketUrl} from '@/config/config'
import {validIp, validNum} from '@/util/validator.js'
var socket
export default {
    name: 'internetCafe',
    components: {
        cvueDialog,
        cvueTable
    },
    data () {
        return {
            previewArr: [],
            countdown: 60,
            countdownStatus: false,
            previewDialog: false,
            startStatus: true,
            dialogLoading: false,
            tableLoading: false,
            seq: 0,
            uuid: '',
            selectValue: 'investigate_ping',
            ruleForm: {
                ip: '192.168.10.207',
                number: 5
            },
            rules: {
                ip: [
                     { required: true, message: 'ip地址不能为空', trigger: 'blur' }
                ],
                number: [
                    { required: true, trigger: 'blur', validator: validNum }
                ]
            },
            resultArr: [],
            layout: 'total,sizes,prev,pager,next,jumper',
            tablePage: 1,
            page: {
                total: 1, // 总页数
                currentPage: 1, // 当前页数
                pageSize: 6, // 每页显示多少条
                pageSizes: [6, 10, 50, 100]
            },
            tableOption: {
                stripe: true,
                width: '100%',
                border: true,
                index: false,
                cloumn: [
                    {prop: 'index', label: '序号', align: 'center', width: 55},
                    {prop: 'address', label: '路由地址', align: 'center'},
                    {prop: 'createTime', label: '时间', align: 'center'},
                    {prop: 'barId', label: '网吧ID', align: 'center', width: 80}
                ]
            },
            tableData: [
                // {
                //   createTime: '2019.04.08 16:00:00', address: '5555', barId: '555'
                // },
                // {
                //   createTime: '2019.04.08 16:00:00', address: '5555', barId: '555'
                // },
                // {
                //   createTime: '2019.04.08 16:00:00', address: '5555', barId: '555'
                // }
            ]
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
            return this.$parent.rowTitle + ' 网吧故障分析'
        }
    },
    methods: {
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
            this.$emit('confirmDialog')
        },
        // 故障分析
        start () {
            var self = this
            if (self.$parent.lineStatus == 1) {
                self.$refs.ruleForm.validate((valid) => {
                    if (valid) {
                        self.startStatus = false
                        self.seq++
                        var sid = self.uuid
                        self.resultArr = []
                        var params
                        var sendMsg
                        self.dialogLoading = true
                        if (self.selectValue == 'investigate_ping') {
                            params = {
                                sid: sid,
                                method: self.selectValue,
                                barId: self.$parent.rowId,
                                target: self.ruleForm.ip,
                                number: self.ruleForm.number,
                                seq: self.seq
                            }
                            sendMsg = JSON.stringify(params)
                        } else {
                            params = {
                                sid: sid,
                                method: self.selectValue,
                                barId: self.$parent.rowId,
                                target: self.ruleForm.ip,
                                seq: self.seq
                            }
                            sendMsg = JSON.stringify(params)
                        }
                        var resultArr = []
                        if ('WebSocket' in window) {
                            // console.log(typeof socket != 'object')
                            socket = new WebSocket(socketUrl + '/ws/' + sid)
                            socket.onopen = function () {
                                socket.send(sendMsg)
                            }
                            socket.onmessage = function (msg) {
                                // console.log(msg.data)
                                self.dialogLoading = false
                                // console.log(JSON.parse(msg.data).seq)
                                // console.log(self.seq)
                                if (JSON.parse(msg.data).seq == self.seq) {
                                    resultArr.push(JSON.parse(msg.data).result)
                                    self.$nextTick(function () {
                                        self.resultArr = resultArr.join('&nbsp;&nbsp;&nbsp;').split('Enter')
                                        if (self.resultArr.length == self.ruleForm.number) {
                                            self.startStatus = true
                                        }
                                    }) 
                                }
                            }
                            socket.onclose = function () {
                                console.log('连接正在关闭')
                            }
                            socket.onerror = function () {
                                self.stop()
                                self.dialogLoading = false
                                self.$message({
                                    message: 'websocket 连接失败',
                                    duration: 2000,
                                    type: 'error'
                                })
                            }
                            // setTimeout(() => {
                            //     socket.close()
                            //     console.log(socket)
                            // }, 6000)
                        } else {
                            self.$message({
                                message: '当前浏览器不支持websock',
                                duration: 2000,
                                type: 'error'
                            })
                        }
                    } else {
                        console.log('error submit!!')
                        return false
                    }
                })
                // self.seq++
            } else {
                self.tip('当前网吧不在线', 'error')
            }
        },
        stop () {
            // console.log(this.seq)
            this.dialogLoading = false
            this.startStatus = true
            this.resultArr = []
            this.seq++
        },
        changeSelect () {
            this.$refs['ruleForm'].clearValidate()
            // this.$refs['ruleForm'].resetFields()
            this.resultArr = []
            this.ruleForm.ip = ''
            this.stop()
            this.tablePage = 1
            this.handleTableList()
        },
        // 初始化
        setDetail () {
            this.uuid = this.generateUUID()
            this.resultArr = []
            this.ruleForm.ip = ''
            this.ruleForm.number = 5
            this.stop()
            this.selectValue = 'investigate_ping'
        },
        // 生成唯一标识uuid
        generateUUID () {
            var d = new Date().getTime()
            if (window.performance && typeof window.performance.now === 'function') {
                d += performance.now()
            }
            var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = (d + Math.random() * 16) % 16 | 0
                d = Math.floor(d / 16)
                return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16)
            })
            return uuid
        },
        // 改变pageSize
        handleSizeChange (val) {
            this.page.pageSize = val
            this.handleTableList()
        },
        // 改变页码
        handleCurrentChange (val) {
            this.tablePage = val
            this.handleTableList()   
        },
        // 路由情况
        handleTableList () {
            var params = {
                pageSize: this.page.pageSize,
                pageIndex: this.tablePage,
                barId: this.$parent.rowId
            }
            this.tableLoading = true
            this.$store.dispatch('home/TracerouteResults', params).then(res => {
                // console.log(res)
                if (res.code == 1) {
                    this.tableData = res.data.list
                    this.page.total = res.data.total
                    this.page.currentPage = this.tablePage 
                } else {
                    this.$message({
                        message: res.msg,
                        duration: 2000,
                        type: 'error'
                    })
                }
                this.tableLoading = false
            })
        },
        // 路由 开始
        tracerouteStart () {
            var self = this
            self.start()
            if (self.$parent.lineStatus == 1) {
                self.$refs.ruleForm.validate((valid) => {
                    if (valid) {
                        self.countdownStatus = true
                        var timer = null
                        timer = setInterval(() => {
                            if (self.countdown > 0) {
                                self.countdown--
                            } else {
                                self.countdown = 60
                                self.countdownStatus = false
                                self.tablePage = 1
                                self.handleTableList()
                                clearInterval(timer)
                            }
                        }, 1000)
                        self.tablePage = 1
                        self.handleTableList()
                    } else {
                        console.log('error submit!!')
                        return false
                    }
                })
            } else {
                self.tip('当前网吧不在线', 'error')
            }   
        },
        // 删除路由记录
        deleteData (row) {
            this.$confirm('确定要删除吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$store.dispatch('home/DeleteTracerouteResults', row.id).then(res => {
                    // console.log(res)
                    if (res.code == 1) {
                        this.$message({
                            type: 'success',
                            message: res.msg
                        })
                        this.tablePage = 1
                        this.handleTableList()
                    } else {
                        this.$message({
                            type: 'error',
                            message: res.msg
                        })
                    }
                })
            }).catch(() => {
            })
        },
        // 预览路由
        previewData (row) {
            this.previewDialog = true
            this.getDetailTraceroute(row)
        },
        // 预览详情
        getDetailTraceroute (row) {
            this.$store.dispatch('home/PreviewTracerouteResults', row.id).then(res => {
                // console.log(JSON.stringify(res.data.result))
                if (res.code == 1) {
                    if (res.data.result.indexOf('Enter') >= 0) {
                        this.previewArr = res.data.result.split('Enter')
                    } else {
                        this.previewArr = res.data.result.split('\r\n')
                    }
                   
                //    console.log(this.previewArr)
                } else {
                    this.$message({
                        message: res.msg,
                        duration: 2000,
                        type: 'error'
                    })
                }
            })
        },
        // 关闭预览
        closeDialogTraceroute () {
           this.previewDialog = false
        },
        // 刷新列表
        refreshData () {
            this.tablePage = 1
            this.handleTableList()
        }
     }
}
</script>
<style lang="scss">
.fault-analysis{
    .el-form-item{
        margin-bottom: 0px!important;
    }

    .fault-body{
        height: 390px;
        overflow: auto
    }
    .fault-body p{
        letter-spacing: 1px;
        line-height: 30px;
        white-space: nowrap;
    }
    .el-input-group__append, .el-input-group__prepend{
        padding: 0 10px;
    }
    .el-dialog__body{
        padding: 20px 20px;
    }
    .fault-wrap .page{
        position: absolute;
        bottom: 10px;
        right: 10px;
    }
}
</style>
