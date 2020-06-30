<template>
  <div>
    <template>
      <el-table
        :data="tableData"
        style="width: 100%"
        @sort-change="handleSortChange"
        >
        <el-table-column
          prop="date"
          label="日期"
          sortable
          width="180">
        </el-table-column>
        <el-table-column
          prop="name"
          label="姓名"
          sortable
          :sort-method = "nameSort"
          width="180">
        </el-table-column>
        <el-table-column
          prop="address"
          label="地址"
          :formatter="formatter">
        </el-table-column>
      </el-table>
    </template>
  </div>
</template>
<script>
export default {
  name: 'table',
  data () {
    return {
      tableData: [{
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-04',
        name: '林小虎',
        address: '上海市普陀区金沙江路 1517 弄'
      }, {
        date: '2016-05-01',
        name: '陈小虎',
        address: '上海市普陀区金沙江路 1519 弄'
      }, {
        date: '2016-05-03',
        name: '吴小虎',
        address: '上海市普陀区金沙江路 1516 弄'
      }]
    }
  },
  mounted () {
    this.tableData = this.sortChinese(this.tableData)
    console.log(this.tableData)
  },
  methods: {
    formatter (row, column) {
      return row.address
    },
    nameSort (a, b) {
       return (a.name).localeCompare(b.name, 'zh-CN')
    },
    sortNum (arr) {
      arr.sort(function (item1, item2) {
        if (item1.seatNumber > item2.seatNumber) {
          return 1
        } else if (item1.seatNumber < item2.seatNumber) {
          return -1
        } else {
          return 0
        }
      })
      return arr
    },
    sortNumRevert (arr) {
      arr.sort(function (item1, item2) {
        if (item1.seatNumber > item2.seatNumber) {
          return -1
        } else if (item1.seatNumber < item2.seatNumber) {
          return 1
        } else {
          return 0
        }
      })
      return arr
    },
    sortChinese (arr) {
      arr.sort(function (item1, item2) {
        return (item1.name).localeCompare(item2.name, 'zh-CN')
      })
      return arr
    },
    sortChineseRevert (arr) {
      arr.sort(function (item1, item2) {
        return (item2.name).localeCompare(item1.name, 'zh-CN')
      })
      return arr
    },
    handleSortChange ({ column, prop, order }) {
      if (prop == 'name' && order == 'descending') {
        this.tableData = this.sortChinese(this.tableData)
      } else {
        this.tableData = this.sortChineseRevert(this.tableData)
      }
    }
  }
}
</script>
<style scoped>

</style>
