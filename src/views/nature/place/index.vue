<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item label="场地名" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入场地名"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="分类id" prop="categoryId">
        <el-input
          v-model="queryParams.categoryId"
          placeholder="请输入分类id"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="状态"
          clearable
          size="small"
        >
        </el-select>
      </el-form-item>
      <el-form-item label="地址" prop="address">
        <el-input
          v-model="queryParams.address"
          placeholder="请输入地址"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="开放时间" prop="dayType">
        <el-select
          v-model="queryParams.dayType"
          placeholder="开放时间"
          clearable
          size="small"
        >
        </el-select>
      </el-form-item>
      <el-form-item label="档期类型" prop="scheType">
        <el-select
          v-model="queryParams.scheType"
          placeholder="档期类型"
          clearable
          size="small"
        >
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
          v-hasPermi="['nature:place:add']"
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
          v-hasPermi="['nature:place:edit']"
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
          v-hasPermi="['nature:place:remove']"
          >删除</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['nature:place:export']"
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
      :data="placeList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="id" align="center" prop="id" />
      <el-table-column label="场地名" align="center" prop="name" />
      <el-table-column label="分类id" align="center" prop="categoryId" />
      <el-table-column
        label="场地详情"
        align="center"
        prop="detail"
        show-overflow-tooltip="true"
      />
      <el-table-column
        label="状态"
        align="center"
        prop="status"
        :formatter="formatterStatus"
      />
      <el-table-column label="描述" align="center" prop="describle" />
      <el-table-column label="添加人" align="center" prop="operator" />
      <el-table-column label="主图" align="center">
        <template slot-scope="scope">
          <el-image
            :src="baseUrl + scope.row.images"
            style="width: 50px; height: 50px"
            fit="cover"
          />
        </template>
      </el-table-column>
      <el-table-column label="点击数" align="center" prop="views" />
      <el-table-column label="收藏数" align="center" prop="collects" />
      <el-table-column label="购买数" align="center" prop="bugs" />
      <el-table-column label="地址" align="center" prop="address" />
      <el-table-column label="开始时间" align="center" prop="start" />
      <el-table-column label="结束时间" align="center" prop="end" />
      <el-table-column
        label="时段"
        align="center"
        prop="dayType"
        :formatter="formatterDay"
      />
      <el-table-column
        label="档期类型"
        align="center"
        prop="scheType"
        :formatter="formatterSche"
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
            v-if="scope.row.scheType == 1"
            @click="handleSche(scope.row)"
            v-hasPermi="['nature:place:edit']"
            >设置档期</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['nature:place:edit']"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['nature:place:remove']"
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

    <!-- 添加或修改场地对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="700px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="场地名" prop="name">
              <el-input v-model="form.name" placeholder="请输入场地名" />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="玩场分类">
              <el-select v-model="form.categoryId" placeholder="请选择">
                <el-option
                  v-for="item in categoryOptions"
                  :key="item.id"
                  :label="item.topicName"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="允许取消">
              <el-select v-model="form.allowReturn" placeholder="请选择">
                <el-option
                  v-for="dict in allowOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="上架/下架">
              <el-select v-model="form.status" placeholder="请选择">
                <el-option
                  v-for="dict in statusOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24"></el-col>
          <el-form-item label="描述" prop="describle">
            <el-input v-model="form.describle" placeholder="请输入描述" />
          </el-form-item>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="场地详情" prop="detail">
              <el-input
                v-model="form.detail"
                type="textarea"
                placeholder="请输入场地详情"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="玩场标签" prop="label">
              <el-input
                v-model="form.label"
                placeholder="请输入玩场标签（多个以英文','分开）"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="玩场用途" prop="used">
              <el-input
                v-model="form.used"
                placeholder="请输入玩场用途（多个以英文','分开）"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="点击数" prop="views">
              <el-input v-model="form.views" placeholder="请输入点击数" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="收藏数" prop="collects">
              <el-input v-model="form.collects" placeholder="请输入收藏数" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="购买数" prop="bugs">
              <el-input v-model="form.bugs" placeholder="请输入购买数" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="预约价" prop="planPrice">
              <el-input v-model="form.planPrice" placeholder="请输入购买数" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>

          <el-col :span="24">
            <el-form-item label="地址" prop="address">
              <el-input v-model="form.address" placeholder="请输入地址" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="时段">
              <el-select v-model="form.dayType" placeholder="请选择">
                <el-option
                  v-for="dict in dayOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="档期类型">
              <el-select v-model="form.scheType" placeholder="请选择">
                <el-option
                  v-for="dict in scheOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="form.scheType == 0">
          <el-col :span="8">
            <el-form-item label="延续天数" prop="days">
              <el-input v-model="form.days" placeholder="请输入延续天数" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="单日票数" prop="surplus">
              <el-input v-model="form.surplus" placeholder="请输入单日票数" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="预约价" prop="price">
              <el-input v-model="form.price" placeholder="请输入预约价" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="图片" prop="images">
              <el-upload
                :action="baseUrl + '/nature/place/file'"
                list-type="picture-card"
                :on-preview="handlePictureCardPreview"
                :on-remove="handleRemove"
                :on-success="handleSuccess"
                :before-remove="beforeRemove"
                :file-list="fileList"
              >
                <i class="el-icon-plus"></i>
              </el-upload>
              <el-dialog :visible.sync="dialogVisible">
                <img width="100%" :src="dialogImageUrl" alt="" />
              </el-dialog>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="视频" prop="videos">
              <el-upload
                :action="baseUrl + '/nature/place/file_video'"
                :on-progress="uploadVideoProcess"
                :on-success="handleVideoSuccess"
                :on-error="handleVideoError"
                :before-upload="beforeUploadVideo"
                :show-file-list="false"
              >
                <i
                  v-if="!form.videos && !videoFlag"
                  class="el-icon-plus avatar-uploader-icon"
                ></i>
                <el-progress
                  v-if="videoFlag"
                  type="circle"
                  :percentage="videoUploadPercent"
                  style="margin-top: 7px"
                ></el-progress>
                <span
                  v-if="videoErrorTip"
                  class="error"
                  style="font-size: 12px; color: #f56c6c"
                  >（视频上传失败，请重新上传！）</span
                >
                <div slot="tip" class="el-upload__tip">
                  最多可上传1个视频，建议10M，推荐mp4
                </div>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 添加或修改场地对话框 -->
    <el-dialog
      title="手动设置档期"
      :visible.sync="dialogSche"
      width="700px"
      append-to-body
    >
      <el-form
        :model="scheListForm"
        ref="scheListForm"
        label-width="100px"
        class="demo-dynamic"
      >
        <template v-for="domain in scheListForm.domains">
          <el-row>
            <el-col :span="6">
              <el-date-picker
                v-model="domain.ytd"
                type="date"
                placeholder="选择日期"
              >
              </el-date-picker>
            </el-col>
            <el-col :span="6">
              <el-input v-model="domain.surplus" placeholder="请输入票数" />
            </el-col>
            <el-col :span="6">
              <el-input v-model="domain.price" placeholder="请输入金额" />
            </el-col>
            <el-col :span="6">
              <el-button @click.prevent="removeDomain(domain)">删除</el-button>
            </el-col>
          </el-row>
        </template>

        <el-form-item>
          <el-button type="primary" @click="submitSche('scheListForm')"
            >提交</el-button
          >
          <el-button @click="addDomain">新增档期</el-button>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogSche = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listPlace,
  getPlace,
  delPlace,
  addPlace,
  updatePlace,
  exportPlace,
  getCategoryList,
  saveSche,
} from "@/api/nature/place";

export default {
  name: "Place",
  data() {
    return {
      videoUploadPercent: 0,
      videoErrorTip: false,
      videoFlag: false,
      fileList: [],
      dialogImageUrl: "",
      dialogVisible: false,
      // 分类选项
      categoryOptions: [],
      // 服务器url
      baseUrl: "",
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
      // 场地表格数据
      placeList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        name: null,
        categoryId: null,
        detail: null,
        status: null,
        allowReturn: null,
        describle: null,
        operator: null,
        images: null,
        views: null,
        collects: null,
        bugs: null,
        coordinate: null,
        address: null,
        start: null,
        end: null,
        dayType: null,
        scheType: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {},
      statusOptions: [],
      allowOptions: [],
      dayOptions: [],
      scheOptions: [],
      dialogSche: false,
      scheListForm: {
        id: null,
        domains: [],
      },
    };
  },
  created() {
    this.baseUrl = process.env.VUE_APP_BASE_API;
    this.getList();
    this.getDicts("cli_place_status").then((response) => {
      this.statusOptions = response.data;
    });
    this.getDicts("cli_place_allow").then((response) => {
      this.allowOptions = response.data;
    });
    this.getDicts("cli_place_day").then((response) => {
      this.dayOptions = response.data;
    });
    this.getDicts("cli_place_sche").then((response) => {
      this.scheOptions = response.data;
    });
  },
  methods: {
    /** 查询场地列表 */
    getList() {
      this.loading = true;
      listPlace(this.queryParams).then((response) => {
        this.placeList = response.rows.map((item, index) => {
          if (item.images) {
            item.images = item.images.split(",")[0];
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
        name: null,
        categoryId: null,
        detail: null,
        status: null,
        allowReturn: null,
        describle: null,
        operator: null,
        images: null,
        videos: null,
        views: null,
        collects: null,
        bugs: null,
        coordinate: null,
        address: null,
        start: null,
        end: null,
        dayType: null,
        scheType: null,
        createTime: null,
        updateTime: null,
        planPrice: null,
        label: null,
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
      this.fileList = [];
      getCategoryList().then((res) => {
        this.categoryOptions = res.data;
      });
      this.title = "添加场地";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getCategoryList().then((res) => {
        this.categoryOptions = res.data;
      });
      getPlace(id).then((response) => {
        this.form = response.data;
        if (this.form.images) {
          let images = this.form.images.split(",");

          this.fileList = images.map((item, index) => {
            return { url: this.baseUrl + item };
          });
        }
        this.open = true;
        this.title = "修改场地";
      });
    },
    /** 手动设置档期操作 */
    handleSche(row) {
      const id = row.id;
      this.dialogSche = true;
      this.scheListForm.id = id;
      this.scheListForm.domains = [];
    },

    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id != null) {
            updatePlace(this.form).then((response) => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              }
            });
          } else {
            addPlace(this.form).then((response) => {
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
      this.$confirm('是否确认删除场地编号为"' + ids + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return delPlace(ids);
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
      this.$confirm("是否确认导出所有场地数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return exportPlace(queryParams);
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
      if (this.form.images) {
        this.form.images = this.form.images + "," + response.imgUrl;
      } else {
        this.form.images = response.imgUrl;
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
      this.form.images = imgUrl;
      console.log(this.form.images);
    },
    formatterStatus(row, column) {
      if (row.status == 0) {
        return "准备中";
      } else if (row.status == 1) {
        return "上架";
      } else if (row.status == 2) {
        return "下架";
      }
    },
    formatterDay(row, column) {
      if (row.allowReturn == 0) {
        return "全天";
      } else if (row.allowReturn == 1) {
        return "白天";
      } else if (row.allowReturn == 2) {
        return "晚上";
      }
    },
    formatterSche(row, column) {
      if (row.scheType == 0) {
        return "自动延期";
      } else if (row.scheType == 1) {
        return "手动设置";
      }
    },
    beforeUploadVideo(file) {
      const fileSize = file.size / 1024 / 1024 < 300;
      if (
        [
          "video/mp4",
          "video/ogg",
          "video/flv",
          "video/avi",
          "video/wmv",
          "video/rmvb",
          "video/mov",
        ].indexOf(file.type) === -1
      ) {
        this.$message.error("请上传正确的视频格式");
        return false;
      }
      if (!fileSize) {
        this.$message.error("视频大小不能超过300MB");
        return false;
      }
    },
    uploadVideoProcess(event, file, fileList) {
      this.videoErrorTip = false;
      this.videoFlag = true;
      this.videoUploadPercent = file.percentage.toFixed(0) * 1;
    },
    handleVideoSuccess(response, file) {
      this.videoFlag = false;
      this.videoUploadPercent = 0;
      this.form.videos = response.videoUrl;
    },
    handleVideoError() {
      this.videoErrorTip = true;
      this.videoFlag = false;
      this.videoUploadPercent = 0;
      this.$message.error("上传失败!");
    },
    handleRemoveGoodsVideo() {
      this.videoFlag = false;
      this.form.videos = "";
    },
    submitSche() {
      saveSche(this.scheListForm).then((res) => {
        this.$message.success("操作成功!");
        this.dialogSche = false
      });
    },
    removeDomain(item) {
      var index = this.scheListForm.domains.indexOf(item);
      if (index !== -1) {
        this.scheListForm.domains.splice(index, 1);
      }
    },
    addDomain() {
      this.scheListForm.domains.push({});
    },
    scheComfirm() {},
  },
};
</script>
