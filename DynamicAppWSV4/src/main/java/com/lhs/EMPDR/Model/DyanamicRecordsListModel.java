/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.lhs.EMPDR.Model;

import com.lhs.EMPDR.dao.JDBCActivityListDAO;
import com.lhs.EMPDR.dao.JDBCContractorNameDAO;
import com.lhs.EMPDR.dao.JDBCProjectListDAO;
import java.sql.Connection;
import java.sql.SQLException;
import java.lang.Cloneable;

/**
 *
 * @author premkumar.agrawal
 */
public class DyanamicRecordsListModel implements Cloneable {

    public String getDependent_where_clause() {
        return dependent_where_clause;
    }

    public void setDependent_where_clause(String dependent_where_clause) {
        this.dependent_where_clause = dependent_where_clause;
    }

    String Table_name;
    String column_name;
    String column_desc;
    String column_type;
    String column_size;
    String column_catg;
    String column_default_value;

    String para_default_value;
    String para_desc;
    String Data_type;
    String para_column;

    String SLNO;

    String nullable;
    String status;
    String entry_by_user;
    String updation_process;
    Object value;
    String REF_LOV_TABLE_COL;
    String REF_LOV_WHERE_CLAUSE;
    String column_select_list_value;
    String item_help_property;
    String dependent_row;
    String dependent_row_logic;
    String codeOfValue;
    String temp;
    String from_value;
    String to_value;
    String tool_tip;
    String editor_flag;
    String decimal_digit;
    String excel_upload;
    String dropdownVal;
    String auto_calculation;
    String heading_flag;
    String dependent_nulable_logic;
    String dependent_next_entry_seq;
    String session_column_flag;
    String summary_function_flag;
    String column_validate;
    private String validate_dependent_columns;
    String dependent_column_name;
    String query_dependent_row;
    String showDataInReportHead;
    String column_description;
    String data_save_success_message;

    public String getData_save_success_message() {
        return data_save_success_message;
    }

    public void setData_save_success_message(String data_save_success_message) {
        this.data_save_success_message = data_save_success_message;
    }
    
    

    String validate_dependent_row_slno;

    public String getValidate_dependent_row_slno() {
        return validate_dependent_row_slno;
    }

    public void setValidate_dependent_row_slno(String validate_dependent_row_slno) {
        this.validate_dependent_row_slno = validate_dependent_row_slno;
    }

    private String dependent_where_clause;

    public String getColumn_description() {
        return column_description;
    }

    public void setColumn_description(String column_description) {
        this.column_description = column_description;
    }

    public String getShowDataInReportHead() {
        return showDataInReportHead;
    }

    public void setShowDataInReportHead(String showDataInReportHead) {
        this.showDataInReportHead = showDataInReportHead;
    }

    public String getQuery_dependent_row() {
        return query_dependent_row;
    }

    public void setQuery_dependent_row(String query_dependent_row) {
        this.query_dependent_row = query_dependent_row;
    }

    public String getDependent_column_name() {
        return dependent_column_name;
    }

    public void setDependent_column_name(String dependent_column_name) {
        this.dependent_column_name = dependent_column_name;
    }

    public String getColumn_validate() {
        return column_validate;
    }

    public void setColumn_validate(String column_validate) {
        this.column_validate = column_validate;
    }

    public String getSummary_function_flag() {
        return summary_function_flag;
    }

    public void setSummary_function_flag(String summary_function_flag) {
        this.summary_function_flag = summary_function_flag;
    }

    public String getSession_column_flag() {
        return session_column_flag;
    }

    public void setSession_column_flag(String session_column_flag) {
        this.session_column_flag = session_column_flag;
    }

    public String getAuto_calculation() {
        return auto_calculation;
    }

    public String getDependent_next_entry_seq() {
        return dependent_next_entry_seq;
    }

    public void setDependent_next_entry_seq(String dependent_next_entry_seq) {
        this.dependent_next_entry_seq = dependent_next_entry_seq;
    }

    public void setAuto_calculation(String auto_calculation) {
        this.auto_calculation = auto_calculation;
    }

    public String getHeading_flag() {
        return heading_flag;
    }

    public void setHeading_flag(String heading_flag) {
        this.heading_flag = heading_flag;
    }

    public String getDependent_nulable_logic() {
        return dependent_nulable_logic;
    }

    public void setDependent_nulable_logic(String dependent_nulable_logic) {
        this.dependent_nulable_logic = dependent_nulable_logic;
    }

    byte img[];

    public String getTemp() {
        return temp;
    }

    public String getDropdownVal() {
        return dropdownVal;
    }

    public void setDropdownVal(String dropdownVal) {
        this.dropdownVal = dropdownVal;
    }

    public byte[] getImg() {
        return img;
    }

    public void setImg(byte[] img) {
        this.img = img;
    }

    public void setTemp(String temp) {
        this.temp = temp;
    }

    public String getFrom_value() {
        return from_value;
    }

    public void setFrom_value(String from_value) {
        this.from_value = from_value;
    }

    public String getTo_value() {
        return to_value;
    }

    public void setTo_value(String to_value) {
        this.to_value = to_value;
    }

    public String getTool_tip() {
        return tool_tip;
    }

    public void setTool_tip(String tool_tip) {
        this.tool_tip = tool_tip;
    }

    public String getEditor_flag() {
        return editor_flag;
    }

    public void setEditor_flag(String editor_flag) {
        this.editor_flag = editor_flag;
    }

    public String getDecimal_digit() {
        return decimal_digit;
    }

    public void setDecimal_digit(String decimal_digit) {
        this.decimal_digit = decimal_digit;
    }

    public String getExcel_upload() {
        return excel_upload;
    }

    public void setExcel_upload(String excel_upload) {
        this.excel_upload = excel_upload;
    }

    public String getCodeOfValue() {
        return codeOfValue;
    }

    public void setCodeOfValue(String codeOfValue) {
        this.codeOfValue = codeOfValue;
    }

    public String getDependent_row() {
        return dependent_row;
    }

    public Object getValue() {
        return value;
    }

    public void setValue(Object value) {
        this.value = value;
    }

    public String getDependent_row_logic() {
        return dependent_row_logic;
    }

    public void setDependent_row_logic(String dependent_row_logic) {
        this.dependent_row_logic = dependent_row_logic;
    }

    public void setDependent_row(String dependent_row) {
        this.dependent_row = dependent_row;
    }

    //List<GenericCodeNameModel> LOV;
    // List<WBSGenericModel> LOVWBS;
    public String getItem_help_property() {
        return item_help_property;
    }

    public void setItem_help_property(String item_help_property) {
        this.item_help_property = item_help_property;
    }

    public String getREF_LOV_TABLE_COL() {
        return REF_LOV_TABLE_COL;
    }

    public void setREF_LOV_TABLE_COL(String REF_LOV_TABLE_COL) {
        this.REF_LOV_TABLE_COL = REF_LOV_TABLE_COL;
    }

    public String getREF_LOV_WHERE_CLAUSE() {
        return REF_LOV_WHERE_CLAUSE;
    }

    public void setREF_LOV_WHERE_CLAUSE(String REF_LOV_WHERE_CLAUSE) {
        this.REF_LOV_WHERE_CLAUSE = REF_LOV_WHERE_CLAUSE;
    }

    public String getColumn_select_list_value() {
        return column_select_list_value;
    }

    public void setColumn_select_list_value(String column_select_list_value) {
        this.column_select_list_value = column_select_list_value;
    }

    public String getTable_name() {
        return Table_name;
    }

    public void setTable_name(String Table_name) {
        this.Table_name = Table_name;
    }

    public String getColumn_name() {
        return column_name;
    }

    public void setColumn_name(String column_name) {
        this.column_name = column_name;
    }

    public String getColumn_desc() {
        return column_desc;
    }

    public void setColumn_desc(String column_desc) {
        this.column_desc = column_desc;
    }

    public String getColumn_type() {
        return column_type;
    }

    public void setColumn_type(String column_type) {
        this.column_type = column_type;
    }

    public String getColumn_size() {
        return column_size;
    }

    public void setColumn_size(String column_size) {
        this.column_size = column_size;
    }

    public String getColumn_catg() {
        return column_catg;
    }

    public void setColumn_catg(String column_catg) {
        this.column_catg = column_catg;
    }

    public String getColumn_default_value() {
        return column_default_value;
    }

    public void setColumn_default_value(String column_default_value) {
        this.column_default_value = column_default_value;
    }

    public String getNullable() {
        return nullable;
    }

    public void setNullable(String nullable) {
        this.nullable = nullable;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getEntry_by_user() {
        return entry_by_user;
    }

    public void setEntry_by_user(String entry_by_user) {
        this.entry_by_user = entry_by_user;
    }

    public String getUpdation_process() {
        return updation_process;
    }

    public void setUpdation_process(String updation_process) {
        this.updation_process = updation_process;
    }

//    public List<GenericCodeNameModel> getLOV() {
//        return LOV;
//    }
//
//    public void setLOV(List<GenericCodeNameModel> LOV) {
//        this.LOV = LOV;
//    }
//    public List<WBSGenericModel> getLOVWBS() {
//        return LOVWBS;
//    }
//
//    public void setLOVWBS(List<WBSGenericModel> LOVWBS) {
//        this.LOVWBS = LOVWBS;
//    }
//    
    public void getLOV(Connection c, String seqNo) throws SQLException {

//         JDBCgetLOVDyanamicallyDAO dao = new JDBCgetLOVDyanamicallyDAO(c);
//           setLOV( dao.getLovDyanamically(seqNo, column_name, null));
        if (column_desc.contains("Project Name")) {
            JDBCProjectListDAO dao = new JDBCProjectListDAO(c);
            //List<ProjectListModel> list=dao.getProjectList();
//             setLOV(dao.getProjectList());

//            JDBCgetLOVDyanamicallyDAO dao = new JDBCgetLOVDyanamicallyDAO(c);
//           setLOV( dao.getLovDyanamically(seqNo, column_name, null));
        }

//        if (column_desc.contains("WBS Name")) {
//            JDBCLocationWBSnameDAO dao = new JDBCLocationWBSnameDAO(c);
//            //List<ProjectListModel> list=dao.getProjectList();
//            setLOV(dao.getLocationWBSname(status));
//            setREF_LOV_WHERE_CLAUSE("Project Name");
//        }
        if (column_desc.contains("Activity Name")) {
            JDBCActivityListDAO dao = new JDBCActivityListDAO(c);
            //List<ProjectListModel> list=dao.getProjectList();
            //          setLOV(dao.getActivityList());

//            JDBCgetLOVDyanamicallyDAO dao = new JDBCgetLOVDyanamicallyDAO(c);
//          setLOV(  dao.getLovDyanamically(seqNo, column_name, null));
        }

        if (column_desc.contains("Contractor Name")) {
            JDBCContractorNameDAO dao = new JDBCContractorNameDAO(c);
            //List<ProjectListModel> list=dao.getProjectList();
            //          setLOV(dao.getContractorName("K"));

//            JDBCgetLOVDyanamicallyDAO dao = new JDBCgetLOVDyanamicallyDAO(c);
//            dao.getLovDyanamically(seqNo, column_name, null);
        }
    }

    public String getPara_default_value() {
        return para_default_value;
    }

    public void setPara_default_value(String para_default_value) {
        this.para_default_value = para_default_value;
    }

    public String getPara_desc() {
        return para_desc;
    }

    public void setPara_desc(String para_desc) {
        this.para_desc = para_desc;
    }

    public String getData_type() {
        return Data_type;
    }

    public void setData_type(String Data_type) {
        this.Data_type = Data_type;
    }

    public String getPara_column() {
        return para_column;
    }

    public void setPara_column(String para_column) {
        this.para_column = para_column;
    }

    public String getSLNO() {
        return SLNO;
    }

    public void setSLNO(String SLNO) {
        this.SLNO = SLNO;
    }

    public Object clone() throws
            CloneNotSupportedException {
        return super.clone();
    }

    public String getValidate_dependent_columns() {
        return validate_dependent_columns;
    }

    public void setValidate_dependent_columns(String validate_dependent_columns) {
        this.validate_dependent_columns = validate_dependent_columns;
    }

}
