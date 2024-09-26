<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item label="话题类型" prop="topicType">
        <el-select
          v-model="queryParams.topicType"
          placeholder="请选择话题类型"
          clearable
          size="small"
        >
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="封面图" prop="coverImg">
        <el-input
          v-model="queryParams.coverImg"
          placeholder="请输入封面图"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="是否删除" prop="deleted">
        <el-input
          v-model="queryParams.deleted"
          placeholder="请输入是否删除"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
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
          v-hasPermi="['nature:topicCover:add']"
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
          v-hasPermi="['nature:topicCover:edit']"
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
          v-hasPermi="['nature:topicCover:remove']"
          >删除</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['nature:topicCover:export']"
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

    <el-row>
      <el-col :span="24">
        <el-alert title="固定为四条数据，分别为活动、任务、知识、公益，只可修改，不能新增" type="error"> </el-alert>
      </el-col>
    </el-row>

    <el-table
      v-loading="loading"
      :data="topicCoverList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="id" align="center" prop="id" />
      <!-- <el-table-column
        label="话题类型"
        align="center"
        prop="topicType"
        :formatter="formatterTopicType"
      /> -->
      <el-table-column label="标签" align="center" prop="tag" />
      <el-table-column label="英文标签" align="center" prop="tagEn" />
      <el-table-column label="分类名称" align="center" prop="tagName" />
      <el-table-column label="封面图" align="center">
        <template slot-scope="scope">
          <el-image
            :src="baseUrl + scope.row.coverImg"
            style="width: 100px; height: 100px"
            fit="cover"
          />
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" prop="remark" />
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
            v-hasPermi="['nature:topicCover:edit']"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['nature:topicCover:remove']"
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

    <!-- 添加或修改话题封面对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="话题类型">
          <el-select v-model="form.topicType" placeholder="请选择话题类型">
            <el-option label="活动" value="1" />
            <el-option label="任务" value="2" />
            <el-option label="知识" value="3" />
            <el-option label="公益" value="4" />
          </el-select>
        </el-form-item>
         <el-form-item label="标签" prop="tag">
          <el-input
            v-model="form.tag"
            type="text"
            placeholder="请输入标签"
          />
        </el-form-item>
         <el-form-item label="英文标签" prop="tagEn">
          <el-input
            v-model="form.tagEn"
            type="text"
            placeholder="请输入英文标签"
          />
        </el-form-item>
        <el-form-item label="分类名称" prop="tagName">
          <el-input
            v-model="form.tagName"
            type="text"
            placeholder="请输入分类名称"
          />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="form.remark"
            type="textarea"
            placeholder="请输入备注（可不填）"
          />
        </el-form-item>

        <el-form-item label="封面" prop="images">
          <el-upload
            :action="baseUrl + '/nature/topicCover/file'"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :on-success="handleSuccess"
            :before-remove="beforeRemove"
            :file-list="fileList"
            :limit="1"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="" />
          </el-dialog>
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
  listTopicCover,
  getTopicCover,
  delTopicCover,
  addTopicCover,
  updateTopicCover,
  exportTopicCover,
} from "@/api/nature/topicCover";

export default {
  name: "TopicCover",
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
      // 话题封面表格数据
      topicCoverList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        topicType: null,
        coverImg: null,
        deleted: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {},
      fileList: [],
      dialogImageUrl: "",
      dialogVisible: false,
      // 服务器url
      baseUrl: "",
    };
  },
  created() {
    this.baseUrl = process.env.VUE_APP_BASE_API;
    this.getList();
  },
  methods: {
    /** 查询话题封面列表 */
    getList() {
      this.loading = true;
      listTopicCover(this.queryParams).then((response) => {
        this.topicCoverList = response.rows;
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
        topicType: null,
        coverImg: null,
        deleted: null,
        createTime: null,
        updateTime: null,
        remark: null,
        tag: null,
        tagEn: null,
        tagName:null,
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
      this.fileList = [];
      this.open = true;
      this.title = "添加话题封面";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getTopicCover(id).then((response) => {
        this.form = response.data;
        if (this.form.coverImg) {
          let coverImg = this.form.coverImg.split(",");

          this.fileList = coverImg.map((item, index) => {
            return { url: this.baseUrl + item };
          });
        }
        this.open = true;
        this.title = "修改话题封面";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id != null) {
            updateTopicCover(this.form).then((response) => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              }
            });
          } else {
            addTopicCover(this.form).then((response) => {
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
      this.$confirm(
        '是否确认删除话题封面编号为"' + ids + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return delTopicCover(ids);
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
      this.$confirm("是否确认导出所有话题封面数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return exportTopicCover(queryParams);
        })
        .then((response) => {
          this.download(response.msg);
        })
        .catch(function () {});
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handleSuccess(response, file, fileList) {
      if (this.form.coverImg) {
        this.form.coverImg = this.form.coverImg + "," + response.imgUrl;
      } else {
        this.form.coverImg = response.imgUrl;
      }
    },
    beforeRemove(file, fileList) {
      let imgUrl = "";
      fileList.map((item, index) => {
        if (file.uid == item.uid) {
          return;
        }
        if (!imgUrl) {
          imgUrl = item.response.imgUrl;
        } else {
          imgUrl = imgUrl + "," + item.response.imgUrl;
        }
      });
      this.form.coverImg = imgUrl;
      console.log(this.form.images);
    },
    formatterTopicType(row, column) {
      if (row.topicType == 1) {
        return "活动";
      } else if (row.topicType == 2) {
        return "任务";
      } else if (row.topicType == 3) {
        return "知识";
      } else if (row.topicType == 4) {
        return "公益";
      }
    },
  },
};
</script>
