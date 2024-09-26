<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item label="订单id" prop="orderId">
        <el-input
          v-model="queryParams.orderId"
          placeholder="请输入订单id"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="订单号" prop="orderNo">
        <el-input
          v-model="queryParams.orderNo"
          placeholder="请输入订单号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="退款状态" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="请选择退款状态0：待审核 1：退款成功 2：拒绝退款"
          clearable
          size="small"
        >
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="退款类型" prop="type">
        <el-select
          v-model="queryParams.type"
          placeholder="请选择退款类型0：预约退款"
          clearable
          size="small"
        >
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="退款时间" prop="refundTime">
        <el-date-picker
          clearable
          size="small"
          style="width: 200px"
          v-model="queryParams.refundTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择退款时间"
        >
        </el-date-picker>
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
          v-hasPermi="['nature:refundAudit:add']"
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
          v-hasPermi="['nature:refundAudit:edit']"
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
          v-hasPermi="['nature:refundAudit:remove']"
          >删除</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['nature:refundAudit:export']"
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
      :data="refundAuditList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="id" align="center" prop="id" />
      <el-table-column label="订单id" align="center" prop="orderId" />
      <el-table-column label="订单号" align="center" prop="orderNo" />
      <el-table-column label="退款原因" align="center" prop="remark" />
      <el-table-column label="退款状态" align="center" prop="status" />
      <el-table-column label="退款类型" align="center" prop="type" />
      <el-table-column
        label="退款时间"
        align="center"
        prop="refundTime"
        width="180"
      >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.refundTime, "{y}-{m}-{d}") }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="审核"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="small"
            type="primary"
            @click="handleYes(scope.row)"
            v-if="scope.row.status == 0"
            >同意</el-button
          >
          <el-button
            size="small"
            type="danger"
            v-if="scope.row.status == 0"
            @click="handleNo(scope.row)"
            >拒绝</el-button
          >
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
            v-hasPermi="['nature:refundAudit:edit']"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['nature:refundAudit:remove']"
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

    <!-- 添加或修改退款审核对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="订单id" prop="orderId">
          <el-input v-model="form.orderId" placeholder="请输入订单id" />
        </el-form-item>
        <el-form-item label="订单号" prop="orderNo">
          <el-input v-model="form.orderNo" placeholder="请输入订单号" />
        </el-form-item>
        <el-form-item label="退款状态0：待审核 1：退款成功 2：拒绝退款">
          <el-radio-group v-model="form.status">
            <el-radio label="1">请选择字典生成</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="退款类型0：预约退款">
          <el-select
            v-model="form.type"
            placeholder="请选择退款类型0：预约退款"
          >
            <el-option label="请选择字典生成" value="" />
          </el-select>
        </el-form-item>
        <el-form-item label="退款时间" prop="refundTime">
          <el-date-picker
            clearable
            size="small"
            style="width: 200px"
            v-model="form.refundTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择退款时间"
          >
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="提示"
      :visible.sync="dialogYes"
      width="30%"
      :before-close="handleClose"
    >
      <span>确认同意退款</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogYes = false">取 消</el-button>
        <el-button type="primary" @click="yesComfirm"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <el-dialog
      title="提示"
      :visible.sync="dialogNo"
      width="30%"
      :before-close="handleClose"
    >
      <span>确认拒绝退款</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogNo = false">取 消</el-button>
        <el-button type="primary" @click="noComfirm"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  listRefundAudit,
  getRefundAudit,
  delRefundAudit,
  addRefundAudit,
  updateRefundAudit,
  exportRefundAudit,
  audit
} from "@/api/nature/refundAudit";

export default {
  name: "RefundAudit",
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
      // 退款审核表格数据
      refundAuditList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        orderId: null,
        orderNo: null,
        status: null,
        type: null,
        refundTime: null,
        deleted: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {},
      dialogYes: false,
      dialogNo: false,
      auditForm: {
        id: null,
        status: null
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询退款审核列表 */
    getList() {
      this.loading = true;
      listRefundAudit(this.queryParams).then((response) => {
        this.refundAuditList = response.rows;
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
        orderId: null,
        orderNo: null,
        remark: null,
        status: 0,
        type: null,
        refundTime: null,
        createTime: null,
        deleted: null,
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
      this.title = "添加退款审核";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getRefundAudit(id).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改退款审核";
      });
    },
    /** 同意操作 */
    handleYes(row) {
      this.auditForm = {
        id: row.id,
        status: 1
      }
      this.dialogYes = true
    },
    // 同意
    yesComfirm(){
      audit(this.auditForm.id, this.auditForm.status).then((response) => {
          this.dialogYes = false
          this.auditForm = {
            id: null,
            status: null
          }
          this.$message({
            type: 'success',
            message: '操作成功!'
          });
            this.getList();
      });
    },
    /** 拒绝操作 */
    handleNo(row) {
       this.auditForm = {
        id: row.id,
        status: 2
      }
      this.dialogNo = true
    },
      // 拒绝
    noComfirm(){
      audit(this.auditForm.id, this.auditForm.status).then((response) => {
          this.dialogNo = false
          this.auditForm = {
            id: null,
            status: null
          }
          this.$message({
            type: 'success',
            message: '操作成功!'
          });
            this.getList();
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id != null) {
            updateRefundAudit(this.form).then((response) => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              }
            });
          } else {
            addRefundAudit(this.form).then((response) => {
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
        '是否确认删除退款审核编号为"' + ids + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return delRefundAudit(ids);
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
      this.$confirm("是否确认导出所有退款审核数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return exportRefundAudit(queryParams);
        })
        .then((response) => {
          this.download(response.msg);
        })
        .catch(function () {});
    },
  },
};
</script>
