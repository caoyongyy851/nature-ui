<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item label="评论人id" prop="uid">
        <el-input
          v-model="queryParams.uid"
          placeholder="请输入评论人id"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="活动id" prop="aid">
        <el-input
          v-model="queryParams.aid"
          placeholder="请输入活动id"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="父id" prop="pid">
        <el-input
          v-model="queryParams.pid"
          placeholder="请输入父id"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="是否已读" prop="isread">
        <el-select
          v-model="queryParams.isread"
          placeholder="请选择是否已读"
          clearable
          size="small"
          style="width: 240px"
          @change="handleQuery"
        >
          <el-option
            v-for="dict in logicOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue === '1'"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="是否审核" prop="checked">
        <el-select
          v-model="queryParams.checked"
          placeholder="请选择是否审核"
          clearable
          size="small"
          style="width: 240px"
          @change="handleQuery"
        >
          <el-option
            v-for="dict in logicOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue === '1'"
          />
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
          v-hasPermi="['nature:comment:add']"
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
          v-hasPermi="['nature:comment:edit']"
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
          v-hasPermi="['nature:comment:remove']"
          >删除</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['nature:comment:export']"
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
      :data="commentList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="id" align="center" prop="id" />
      <el-table-column label="评论人id" align="center" prop="uid" />
      <el-table-column label="活动id" align="center" prop="aid" />
      <el-table-column label="父id" align="center" prop="pid" />
      <el-table-column label="点赞数" align="center" prop="likes" />
      <el-table-column label="点踩数" align="center" prop="unlikes" />
      <el-table-column label="回复数" align="center" prop="replies" />
      <el-table-column label="评论" align="center" prop="content" />
      <el-table-column label="评论时间" align="center" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime, "{y}-{m}-{d}") }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="是否已读"
        align="center"
        prop="isread"
        :formatter="formatterIsRead"
      />
      <el-table-column
        label="是否审核"
        align="center"
        prop="checked"
        :formatter="formatterChecked"
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
            v-hasPermi="['nature:comment:edit']"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['nature:comment:remove']"
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

    <!-- 添加或修改评论对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="评论人id" prop="uid">
          <el-input v-model="form.uid" placeholder="请输入评论人id" />
        </el-form-item>
        <el-form-item label="活动id" prop="aid">
          <el-input v-model="form.aid" placeholder="请输入活动id" />
        </el-form-item>
        <el-form-item label="父id" prop="pid">
          <el-input v-model="form.pid" placeholder="请输入父id" />
        </el-form-item>
        <el-form-item label="点赞数" prop="likes">
          <el-input v-model="form.likes" placeholder="请输入点赞数" />
        </el-form-item>
        <el-form-item label="点踩数" prop="unlikes">
          <el-input v-model="form.unlikes" placeholder="请输入点踩数" />
        </el-form-item>
        <el-form-item label="回复数" prop="replies">
          <el-input v-model="form.replies" placeholder="请输入回复数" />
        </el-form-item>
        <el-form-item label="评论" prop="content">
          <el-input v-model="form.content" placeholder="请输入评论" />
        </el-form-item>
        <el-form-item label="是否已读" prop="isread">
          <el-select
            v-model="form.isread"
            placeholder="请选择是否已读"
            clearable
            size="small"
            style="width: 240px"
          >
            <el-option
              v-for="dict in logicOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue === '1'"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="是否审核" prop="checked">
          <el-select
            v-model="form.checked"
            placeholder="请选择是否审核"
            clearable
            size="small"
            style="width: 240px"
          >
            <el-option
              v-for="dict in logicOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue === '1'"
            />
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
  listComment,
  getComment,
  delComment,
  addComment,
  updateComment,
  exportComment,
} from "@/api/nature/comment";

export default {
  name: "Comment",
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
      // 评论表格数据
      commentList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        deleted: null,
        uid: null,
        aid: null,
        pid: null,
        likes: null,
        unlikes: null,
        replies: null,
        content: null,
        isread: null,
        checked: null,
      },
      // 表单参数
      form: {},
      logicOptions: [],
      // 表单校验
      rules: {
        createTime: [
          { required: true, message: "创建时间不能为空", trigger: "blur" },
        ],
        updateTime: [
          { required: true, message: "修改时间不能为空", trigger: "blur" },
        ],
        deleted: [
          { required: true, message: "逻辑删除不能为空", trigger: "blur" },
        ],
        uid: [{ required: true, message: "评论人id不能为空", trigger: "blur" }],
        aid: [{ required: true, message: "活动id不能为空", trigger: "blur" }],
        pid: [{ required: true, message: "父id不能为空", trigger: "blur" }],
        likes: [{ required: true, message: "点赞数不能为空", trigger: "blur" }],
        unlikes: [
          { required: true, message: "点踩数不能为空", trigger: "blur" },
        ],
        replies: [
          { required: true, message: "回复数不能为空", trigger: "blur" },
        ],
        content: [{ required: true, message: "评论不能为空", trigger: "blur" }],
        isread: [
          { required: true, message: "是否已读不能为空", trigger: "blur" },
        ],
        checked: [
          { required: true, message: "是否审核不能为空", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getList();
    this.getDicts("sys_logic").then((response) => {
      this.logicOptions = response.data;
    });
  },
  methods: {
    /** 查询评论列表 */
    getList() {
      this.loading = true;
      listComment(this.queryParams).then((response) => {
        this.commentList = response.rows;
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
        createTime: null,
        updateTime: null,
        deleted: null,
        uid: null,
        aid: null,
        pid: null,
        likes: null,
        unlikes: null,
        replies: null,
        content: null,
        isread: null,
        checked: null,
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
      this.title = "添加评论";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getComment(id).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改评论";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id != null) {
            updateComment(this.form).then((response) => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              }
            });
          } else {
            addComment(this.form).then((response) => {
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
      this.$confirm('是否确认删除评论编号为"' + ids + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return delComment(ids);
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
      this.$confirm("是否确认导出所有评论数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return exportComment(queryParams);
        })
        .then((response) => {
          this.download(response.msg);
        })
        .catch(function () {});
    },
    formatterIsRead(row, column) {
      return row.isread ? "已读" : "未读";
    },
    formatterChecked(row, column) {
      return row.checked ? "已审核" : "未审核";
    },
  },
};
</script>
