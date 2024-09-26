<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="公司/机构名称" prop="companyName">
        <el-input
          v-model="queryParams.companyName"
          placeholder="请输入公司/机构名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="公司电话" prop="phone">
        <el-input
          v-model="queryParams.phone"
          placeholder="请输入公司电话"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="申请人id" prop="userId">
        <el-input
          v-model="queryParams.userId"
          placeholder="请输入申请人id"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="启用状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择启用状态" clearable size="small">
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="cyan" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['nature:company:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['nature:company:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['nature:company:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['nature:company:export']"
        >导出</el-button>
      </el-col>
      <div class="top-right-btn">
        <el-tooltip class="item" effect="dark" content="刷新" placement="top">
          <el-button size="mini" circle icon="el-icon-refresh" @click="handleQuery" />
        </el-tooltip>
        <el-tooltip class="item" effect="dark" :content="showSearch ? '隐藏搜索' : '显示搜索'" placement="top">
          <el-button size="mini" circle icon="el-icon-search" @click="showSearch=!showSearch" />
        </el-tooltip>
      </div>
    </el-row>

    <el-table v-loading="loading" :data="companyList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="id" align="center" prop="id" />
      <el-table-column label="公司/机构名称" align="center" prop="companyName" />
      <el-table-column label="公司地址" align="center" prop="address" />
      <el-table-column label="公司电话" align="center" prop="phone" />
      <el-table-column label="公司简介" align="center" prop="remark" show-overflow-tooltip="true"/>
      <el-table-column label="申请人id" align="center" prop="userId" />
      <el-table-column label="是否删除" align="center" prop="deleted" />
      <el-table-column label="启用状态" align="center" prop="status" />

       <el-table-column
        label="提价审核"
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

      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['nature:company:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['nature:company:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改公司/机构对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="公司/机构名称" prop="companyName">
          <el-input v-model="form.companyName" placeholder="请输入公司/机构名称" />
        </el-form-item>
        <el-form-item label="公司地址" prop="address">
          <el-input v-model="form.address" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="公司电话" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入公司电话" />
        </el-form-item>
        <el-form-item label="申请人id" prop="userId">
          <el-input v-model="form.userId" placeholder="请输入申请人id" />
        </el-form-item>
        <el-form-item label="0：待审核，1：启用，2：禁用">
          <el-radio-group v-model="form.status">
            <el-radio label="1">请选择字典生成</el-radio>
          </el-radio-group>
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
      <span>确认同意申请</span>
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
      <span>确认拒绝申请</span>
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
import { listCompany, getCompany, delCompany, addCompany, updateCompany, exportCompany, audit } from "@/api/nature/company";

export default {
  name: "Company",
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
      // 公司/机构表格数据
      companyList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        companyName: null,
        address: null,
        phone: null,
        userId: null,
        deleted: null,
        status: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      },
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
    /** 查询公司/机构列表 */
    getList() {
      this.loading = true;
      listCompany(this.queryParams).then(response => {
        this.companyList = response.rows;
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
        companyName: null,
        address: null,
        phone: null,
        remark: null,
        userId: null,
        createTime: null,
        updateTime: null,
        deleted: null,
        status: 0
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
      this.ids = selection.map(item => item.id)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加公司/机构";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getCompany(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改公司/机构";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateCompany(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              }
            });
          } else {
            addCompany(this.form).then(response => {
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
      this.$confirm('是否确认删除公司/机构编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delCompany(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有公司/机构数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportCompany(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
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
    
  }
};
</script>
