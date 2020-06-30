<template>
  <div>
    <label class="file-wrap" for="file-selector">
      <i class="el-icon-plus"></i>
      <input type="file" accept="image/*" id="myFile" value="" onchange="uploadImg()"/>
    </label>

    <el-upload
      ref="upload"
      class="upload-demo"
      :action="actionUrl"
      :before-upload="handleBeforeupload"
      :on-remove="handleRemove"
      :before-remove="beforeRemove"
      :on-change="handleChange"
      :limit="1"
      :headers="token"
      :file-list="fileList"
      name="MS_HttpContext"
      :http-request="uploadSectionFile"
      :auto-upload="false"
      accept=".xls, .xlsx">
      <el-button type="primary">点击上传</el-button>
      <div slot="tip" class="el-upload__tip">上传文件不能超过30M</div>
    </el-upload>
  </div>
</template>
<script>
export default {
  name: 'index',
  data() {
    return {
      msg: '123',
      fileList: [],
      actionUrl: 'http://api-oa-salary.xueerqin.net/api/TeachSalary/AddTeachSalaryFile',
    }
  },
  computed: {
    fileParams () {
      var params =
      {
        groupId: this.$parent.importId,
        monthTime: this.form.value
      }
      return {
        data: JSON.stringify(params)
      }
    },
    token () {
      var token = {
        loginName: this.cookieStart.loginName,
        roleCode: this.cookieStart.roleCode,
        Token: this.cookieStart.Token
      }
      return token
    }
  },
  methods: {
    uploadImg () {
      var self = this
      var imgFiles = document.getElementById('myFile').files
      for (var i = 0; i < imgFiles.length; i++) {
        var reader = new FileReader()
        var imgSrc
        reader.onload = function (e) {
          imgSrc = e.target.result
          self.payImage.push(imgSrc)
        }
        reader.readAsDataURL(imgFiles[i])
      }
    },
    handleFileChange (file, fileList) {
      // console.log(file)
    },
    handleChange (file, fileList) {
      // console.log(file,fileList)
      this.fileList = fileList
    },
    // 上传前
    handleBeforeupload (file) {
      // console.log(file)
      var m = (file.size / (1024 * 1024)).toFixed(2)
      if (m > 30) {
        this.$message({ message: '最大限制30M', type: 'error' })
        return false
      }
      // console.log(file.name.indexOf('.xlsx') < 0)
      if (file.name.indexOf('.xls') < 0 && file.name.indexOf('.xlsx') < 0) {
        this.$message({ message: '上传文件格式错误', type: 'error' })
        return false
      }
      return true
    },
    // 成功
    handleSuccess (response, file, fileList) {
      // console.log(response)
      // this.excelData = .
      var result = JSON.parse(response)
      this.excelData = result.Data
      this.dialogVisiblePreview = true
      console.log(this.excelData)
      if (result.Code == '200') {
        this.fileData = result.Data
        // console.log(this.fileData)
        this.$message({ message: '上传成功', duration: 2000, type: 'success' })
      } else {
        this.$message({ message: '上传失败', duration: 2000, type: 'error' })
      }
    },
    handleRemove (file, fileList) {
      console.log(file, fileList)
    },
    beforeRemove (file, fileList) {
      // console.log(file)
      var m = (file.size / (1024 * 1024)).toFixed(2)
      if (m > 30) {
        return true
      } else {
        return this.$confirm(`确定移除 ${file.name}？`)
      }
    },
    uploadSectionFile: function (param) { // 自定义文件上传
      var fileObj = param.file
      // formDataCheck 对象
      var formDataCheck = new FormData()
      formDataCheck.append('MS_HttpContext', fileObj)
      let data = {
        groupId: this.$parent.importId,
        monthTime: this.form.value
      }
      formDataCheck.append('data', JSON.stringify(data))
      // FormData 对象
      var formData = new FormData()
      formData.append('MS_HttpContext', fileObj)
      var params =
      {
        groupId: this.$parent.importId,
        monthTime: this.form.value
      }
      formData.append('data', JSON.stringify(params))
      // console.log(formData)
      if (this.buttonType == 'confirm') {
        // 获取是否存在历史数据
        let paramsObj = {
          groupId: this.$parent.importId,
          monthTime: this.form.value
        }
        this.$store.dispatch('payroll/GetMonthHistory', paramsObj).then(res => {
          let result = JSON.parse(res)
          if (result.Code == '200' && result.Data) {
            this.$confirm('该月已有数据，是否覆盖?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              // 校验Excel上传人数
              this.$store.dispatch('payroll/CheckExcel', formDataCheck).then(resData => {
                var resultData = JSON.parse(resData)
                // console.log(resultData)
                if (resultData.Code == '200') {
                  // 附件上传
                  this.$store.dispatch('payroll/AddTeachSalaryFile', formData).then(resDataChild => {
                    var resultDataChild = JSON.parse(resDataChild)
                    if (resultDataChild.Code == '200') {
                      this.$message({ message: '上传成功', duration: 2000, type: 'success' })
                      this.$emit('confirmDialog')
                    } else {
                      this.$message({ message: resultDataChild.Msg, duration: 2000, type: 'error' })
                    }
                  }).catch(error => {
                    console.log(error)
                    this.$message({ message: '服务器错误', duration: 2000, type: 'error' })
                  })
                } else if (resultData.Code == '202') {
                  this.$confirm('表格中部分人员数据不在关联人员中,是否继续导入?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                  }).then(() => {
                    this.$store.dispatch('payroll/AddTeachSalaryFile', formData).then(resDataChild => {
                      var resultDataChild = JSON.parse(resDataChild)
                      if (resultDataChild.Code == '200') {
                        this.$message({ message: '上传成功', duration: 2000, type: 'success' })
                        this.$emit('confirmDialog')
                      } else {
                        this.$message({ message: resultDataChild.Msg, duration: 2000, type: 'error' })
                      }
                    }).catch(error => {
                      console.log(error)
                      this.$message({ message: '服务器错误', duration: 2000, type: 'error' })
                    })
                  }).catch(() => {
                    this.$message({
                      type: 'info',
                      message: '已取消导入'
                    })
                  })
                } else if (resultData.Code == '203') {
                  this.$confirm('工资组部分关联人员没有数据，确认导入么?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                  }).then(() => {
                    this.$store.dispatch('payroll/AddTeachSalaryFile', formData).then(resDataChild => {
                      var resultDataChild = JSON.parse(resDataChild)
                      if (resultDataChild.Code == '200') {
                        this.$message({ message: '上传成功', duration: 2000, type: 'success' })
                        this.$emit('confirmDialog')
                      } else {
                        this.$message({ message: resultDataChild.Msg, duration: 2000, type: 'error' })
                      }
                    }).catch(error => {
                      console.log(error)
                      this.$message({ message: '服务器错误', duration: 2000, type: 'error' })
                    })
                  }).catch(() => {
                    this.$message({
                      type: 'info',
                      message: '已取消导入'
                    })
                  })
                } else {
                  this.$message({ message: resultData.Msg, duration: 2000, type: 'error' })
                }
              })
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消覆盖'
              })
            })
          } else {
            // 校验Excel上传人数
            this.$store.dispatch('payroll/CheckExcel', formDataCheck).then(resData => {
              var resultData = JSON.parse(resData)
              // console.log(resultData)
              if (resultData.Code == '200') {
                // 附件上传
                this.$store.dispatch('payroll/AddTeachSalaryFile', formData).then(resDataChild => {
                  var resultDataChild = JSON.parse(resDataChild)
                  if (resultDataChild.Code == '200') {
                    this.$message({ message: '上传成功', duration: 2000, type: 'success' })
                    this.$emit('confirmDialog')
                  } else {
                    this.$message({ message: resultDataChild.Msg, duration: 2000, type: 'error' })
                  }
                }).catch(error => {
                  // console.log(error)
                  this.$message({ message: '服务器错误', duration: 2000, type: 'error' })
                })
              } else if (resultData.Code == '202') {
                this.$confirm('表格中部分人员数据不在关联人员中,是否继续导入?', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                  this.$store.dispatch('payroll/AddTeachSalaryFile', formData).then(resDataChild => {
                    var resultDataChild = JSON.parse(resDataChild)
                    if (resultDataChild.Code == '200') {
                      this.$message({ message: '上传成功', duration: 2000, type: 'success' })
                      this.$emit('confirmDialog')
                    } else {
                      this.$message({ message: resultDataChild.Msg, duration: 2000, type: 'error' })
                    }
                  }).catch(error => {
                    console.log(error)
                    this.$message({ message: '服务器错误', duration: 2000, type: 'error' })
                  })
                }).catch(() => {
                  this.$message({
                    type: 'info',
                    message: '已取消导入'
                  })
                })
              } else if (resultData.Code == '203') {
                this.$confirm('工资组部分关联人员没有数据，确认导入么?', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                  this.$store.dispatch('payroll/AddTeachSalaryFile', formData).then(resDataChild => {
                    var resultDataChild = JSON.parse(resDataChild)
                    if (resultDataChild.Code == '200') {
                      this.$message({ message: '上传成功', duration: 2000, type: 'success' })
                      this.$emit('confirmDialog')
                    } else {
                      this.$message({ message: resultDataChild.Msg, duration: 2000, type: 'error' })
                    }
                  }).catch(error => {
                    console.log(error)
                    this.$message({ message: '服务器错误', duration: 2000, type: 'error' })
                  })
                }).catch(() => {
                  this.$message({
                    type: 'info',
                    message: '已取消导入'
                  })
                })
              } else {
                this.$message({ message: resultData.Msg, duration: 2000, type: 'error' })
              }
            })
          }
        })
      } else {
        this.$store.dispatch('payroll/ExcelFilePreview', formData).then(res => {
          var result = JSON.parse(res)
          if (result.Code == '200') {
            this.excelData = result.Data
            this.dialogVisiblePreview = true
          }
        })
      }
    }
  },
}
</script>
<style>
.file-wrap i{
    border: 1px dashed #d9d9d9;
    border-radius: 50px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    font-size: 28px;
    color: #8c939d;
    width: 100px;
    height: 100px;
    line-height: 100px;
    text-align: center;
    border-radius: 100px;
    display: inline-block;
  }
  .file-wrap i:before {
    content: "\E6D9";
  }
  .file-wrap input{
    display: none;
  }
</style>
