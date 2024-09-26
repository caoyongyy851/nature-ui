<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item label="发布人ID" prop="uid">
        <el-input
          v-model="queryParams.uid"
          placeholder="请输入发布人ID"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="话题名称" prop="title">
        <el-input
          v-model="queryParams.title"
          placeholder="请输入话题名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item label="话题类型" prop="type">
        <el-select
          v-model="queryParams.type"
          placeholder="请选择话题类型"
          clearable
          size="small"
        >
          <el-option
            v-for="dict in typeOptions"
            :key="dict.topicType"
            :label="dict.tag"
            :value="dict.topicType"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          type="cyan"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
          >搜索</el-button
        >
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
          >重置</el-button
        >
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['nature:topic:add']"
          >新增</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['nature:topic:edit']"
          >修改</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['nature:topic:remove']"
          >删除</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['nature:topic:export']"
          >导出</el-button
        >
      </el-col>
      <div class="top-right-btn">
        <el-tooltip class="item" effect="dark" content="刷新" placement="top">
          <el-button
            size="mini"
            circle
            icon="el-icon-refresh"
            @click="handleQuery"
          />
        </el-tooltip>
        <el-tooltip
          class="item"
          effect="dark"
          :content="showSearch ? '隐藏搜索' : '显示搜索'"
          placement="top"
        >
          <el-button
            size="mini"
            circle
            icon="el-icon-search"
            @click="showSearch = !showSearch"
          />
        </el-tooltip>
      </div>
    </el-row>

    <el-table
      v-loading="loading"
      :data="topicList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"  show-overflow-tooltip="true" align="center" />
      <el-table-column label="id" align="center" prop="id" />
      <el-table-column label="发布人id" align="center" prop="uid" />
      <el-table-column label="话题名称"  align="center" prop="title"  show-overflow-tooltip="true"/>
      <el-table-column label="封面" align="center">
        <template slot-scope="scope">
          <el-image
            :src="baseUrl + scope.row.cover"
            style="width: 50px; height: 50px"
            fit="cover"
          />
        </template>
      </el-table-column>
      <el-table-column label="图片组" align="center">
        <template slot-scope="scope">
          <el-image
            :src="baseUrl + scope.row.image"
            style="width: 50px; height: 50px"
            fit="cover"
          />
        </template>
      </el-table-column>
      <el-table-column
        label="内容"
        align="center"
        prop="detail"
        show-overflow-tooltip="true"
      />
      <el-table-column label="浏览数" align="center" prop="views" />
      <el-table-column
        label="类型"
        align="center"
        prop="type"
        :formatter="typeFormatter"
      />
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['nature:topic:edit']"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['nature:topic:remove']"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改话题对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="发布人id" prop="uid">
          <el-input v-model="form.uid" placeholder="请输入发布人id" />
        </el-form-item>
        <el-form-item label="话题名称" prop="title">
          <el-input v-model="form.title" placeholder="请输入话题名称" />
        </el-form-item>
        <el-form-item label="内容" prop="detail">
          <el-input v-model="form.detail" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="浏览数" prop="views">
          <el-input v-model="form.views" placeholder="请输入浏览数" />
        </el-form-item>
        <el-form-item label="话题类型">
          <el-select v-model="form.type" placeholder="请选择话题类型">
            <el-option
              v-for="dict in typeOptions"
              :key="dict.topicType"
              :label="dict.tag"
              :value="dict.topicType"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listTopic,
  getTopic,
  delTopic,
  addTopic,
  updateTopic,
  exportTopic,
  optionList,
} from "@/api/nature/topic";

export default {
  name: "Topic",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 话题表格数据
      topicList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        uid: null,
        title: null,
        cover: null,
        image: null,
        simpleDesc: null,
        detail: null,
        views: null,
        checked: null,
        deleted: null,
        type: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {},
      baseUrl: "",
      typeOptions: [],
    };
  },
  created() {
    this.baseUrl = process.env.VUE_APP_BASE_API;
    optionList().then((res) => {
      this.typeOptions = res.data;
    });
    this.getList();
  },
  methods: {
    /** 查询话题列表 */
    getList() {
      this.loading = true;
      listTopic(this.queryParams).then((response) => {
        this.topicList = response.rows.map((item, index) => {
          if (item.image) {
            item.image = item.image.split(",")[0];
          }
          return item;
        });
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        uid: null,
        title: null,
        cover: null,
        image: null,
        simpleDesc: null,
        detail: null,
        views: null,
        checked: null,
        deleted: null,
        type: null,
        createTime: null,
        updateTime: null,
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加话题";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getTopic(id).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改话题";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id != null) {
            updateTopic(this.form).then((response) => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              }
            });
          } else {
            addTopic(this.form).then((response) => {
              if (response.code === 200) {
                this.msgSuccess("新增成功");
                this.open = false;
                this.getList();
              }
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$confirm('是否确认删除话题编号为"' + ids + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return delTopic(ids);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
        .catch(function () {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm("是否确认导出所有话题数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return exportTopic(queryParams);
        })
        .then((response) => {
          this.download(response.msg);
        })
        .catch(function () {});
    },
    typeFormatter(row, column) {
      let tagName = "";
      this.typeOptions.map((item, index) => {
        if (item.topicType == row.type) {
          tagName = item.tag;
        }
      });
      return tagName;
    },
  },
};
</script>
