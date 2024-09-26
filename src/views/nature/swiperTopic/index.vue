<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item label="话题ID" prop="topicId">
        <el-input
          v-model="queryParams.topicId"
          placeholder="请输入话题ID"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="排序" prop="swiperOrder">
        <el-input
          v-model="queryParams.swiperOrder"
          placeholder="请输入排序"
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
          v-hasPermi="['nature:swiperTopic:add']"
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
          v-hasPermi="['nature:swiperTopic:edit']"
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
          v-hasPermi="['nature:swiperTopic:remove']"
          >删除</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['nature:swiperTopic:export']"
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
      :data="swiperTopicList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="id" align="center" prop="id" />
      <el-table-column label="话题ID" align="center" prop="topicId" />
      <el-table-column label="排序" align="center" prop="swiperOrder" />
      <el-table-column label="标题" align="center" prop="title" />
      <el-table-column label="内容" align="center" prop="remark" show-overflow-tooltip="true"/>
       <el-table-column label="类型" align="center" prop="topicType" :formatter="formatterTopicType"/>
      <el-table-column label="封面图" align="center">
        <template slot-scope="scope">
          <el-image
            :src="baseUrl + scope.row.image"
            style="width: 100px; height: 100px"
            fit="cover"
          />
        </template>
      </el-table-column>

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
            v-hasPermi="['nature:swiperTopic:edit']"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['nature:swiperTopic:remove']"
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

    <!-- 添加或修改帖子轮播图对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
       
     
        <el-form-item label="轮播类型">
          <el-select v-model="form.topicType" placeholder="请选择轮播类型">
            <el-option label="话题" value="0" />
            <el-option label="自定义" value="1" />
          </el-select>
        </el-form-item>
         <el-form-item label="话题ID" prop="topicId">
          <el-input
            v-model="form.topicId"
            placeholder="请输入话题ID，前往帖子页复制粘贴"
          />
        </el-form-item>
         <el-form-item label="标题" prop="title">
          <el-input
            v-model="form.title"
            placeholder="请输入标题"
          />
        </el-form-item>
        <el-form-item label="内容" prop="remark">
          <el-input
            v-model="form.remark"
            placeholder="内容"
          />
        </el-form-item> 
        <el-form-item label="排序" prop="swiperOrder">
          <el-input
            v-model="form.swiperOrder"
            placeholder="请输入排序值越大越靠前"
          />
        </el-form-item>

        <el-form-item label="轮播图" prop="image">
          <el-upload
            :action="baseUrl + '/nature/swiperTopic/file'"
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
  listSwiperTopic,
  getSwiperTopic,
  delSwiperTopic,
  addSwiperTopic,
  updateSwiperTopic,
  exportSwiperTopic,
} from "@/api/nature/swiperTopic";

export default {
  name: "SwiperTopic",
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
      // 帖子轮播图表格数据
      swiperTopicList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        topicId: null,
        swiperOrder: null,
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
    /** 查询帖子轮播图列表 */
    getList() {
      this.loading = true;
      listSwiperTopic(this.queryParams).then((response) => {
        this.swiperTopicList = response.rows;
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
        topicId: null,
        swiperOrder: null,
        topicType: null,
        image: null,
        title: null,
        remark: null,
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
      this.title = "添加帖子轮播图";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getSwiperTopic(id).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改帖子轮播图";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id != null) {
            updateSwiperTopic(this.form).then((response) => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              }
            });
          } else {
            addSwiperTopic(this.form).then((response) => {
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
        '是否确认删除帖子轮播图编号为"' + ids + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return delSwiperTopic(ids);
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
      this.$confirm("是否确认导出所有帖子轮播图数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return exportSwiperTopic(queryParams);
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
      if (this.form.image) {
        this.form.image = this.form.image + "," + response.imgUrl;
      } else {
        this.form.image = response.imgUrl;
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
      this.form.image = imgUrl;
    },

    formatterTopicType(row, column) {
      if (row.topicType == 0) {
        return "话题";
      } else if (row.topicType == 1) {
        return "自定义";
      }
    },
  },
};
</script>
