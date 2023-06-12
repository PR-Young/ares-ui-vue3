<template>
  <div class="app-container">
    <el-row>
      <el-form :inline="true" style="text-align: center">
        <el-form-item>
          <el-input
            style="width: 500px"
            v-model:value="queryParams.searchValue"
            placeholder="请输入"
            clearable
            size="small"
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            :icon="ElIconSearch"
            size="mini"
            @click="handleQuery"
          ></el-button>
        </el-form-item>
      </el-form>
    </el-row>

    <template>
      <el-table :data="result.data" style="width: 100%">
        <el-table-column prop="name" label="name" width="180">
        </el-table-column>
        <el-table-column prop="key" label="key" width="180"> </el-table-column>
        <el-table-column prop="body" label="body"> </el-table-column>
        <el-table-column prop="content" label="content"> </el-table-column>
      </el-table>
    </template>
  </div>
</template>

<script>
import { Search as ElIconSearch } from '@element-plus/icons'
import { queryByKey } from '@/api/home'

export default {
  data() {
    return {
      // 遮罩层
      loading: true,
      // 查询参数
      queryParams: {
        searchValue: undefined,
      },
      result: {
        data: [],
      },
      ElIconSearch,
    }
  },
  name: 'QueryResult',
  created() {
    const data = this.$route.query && this.$route.query.data
    this.queryParams.searchValue =
      this.$route.query && this.$route.query.searchValue
    this.result.data = data.data
  },
  methods: {
    /** 搜索按钮操作 */
    handleQuery() {
      queryByKey(this.queryParams).then((res) => {
        this.result.data = res.data
      })
    },
  },
}
</script>
