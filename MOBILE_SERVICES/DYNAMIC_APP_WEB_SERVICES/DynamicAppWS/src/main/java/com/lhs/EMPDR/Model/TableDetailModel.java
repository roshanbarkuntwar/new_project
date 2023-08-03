/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.lhs.EMPDR.Model;

/**
 *
 * @author premkumar.agrawal
 */
public class TableDetailModel {

    String table_name;
    String table_desc;
    String updation_typ;
    String updation_process;
    String Duplicate_row_value_allow;
    String update_key;
    String where_clause;
    String order_clause;
    String status;
    String mandatory_to_start_portal;
    String display_clause;
    String unique_clause;
    String unique_message;
    String replicate_rec;
    String replicate_fields;
    String portlet_Id;
    String List_columns_update;
    String list_columns_order_by;
    String DATA_UPLOAD;
    String excel_template;
    String seqNo;
    String access_contrl;
    String screen_orientation_view;
    String default_populate_data;
    String offline_flag_app_run;
    String data_save_client_app;
    String dependent_next_entry_seq;
    String selection_clause;

    //////Dashboard Module
    String view_type;
    String view_group;
    String view_desc;
    Object view_data;

    public String getOffline_flag_app_run() {
        return offline_flag_app_run;
    }

    public String getDependent_next_entry_seq() {
        return dependent_next_entry_seq;
    }

    public void setDependent_next_entry_seq(String dependent_next_entry_seq) {
        this.dependent_next_entry_seq = dependent_next_entry_seq;
    }

    public void setOffline_flag_app_run(String offline_flag_app_run) {
        this.offline_flag_app_run = offline_flag_app_run;
    }

    public String getData_save_client_app() {
        return data_save_client_app;
    }

    public void setData_save_client_app(String data_save_client_app) {
        this.data_save_client_app = data_save_client_app;
    }

    public String getDefault_populate_data() {
        return default_populate_data;
    }

    public void setDefault_populate_data(String default_populate_data) {
        this.default_populate_data = default_populate_data;
    }

    public String getAccess_contrl() {
        return access_contrl;
    }

    public void setAccess_contrl(String access_contrl) {
        this.access_contrl = access_contrl;
    }

    public String getScreen_orientation_view() {
        return screen_orientation_view;
    }

    public void setScreen_orientation_view(String screen_orientation_view) {
        this.screen_orientation_view = screen_orientation_view;
    }
    String reportCount;

    public String getReportCount() {
        return reportCount;
    }

    public void setReportCount(String reportCount) {
        this.reportCount = reportCount;
    }

    public String getSeqNo() {
        return seqNo;
    }

    public void setSeqNo(String seqNo) {
        this.seqNo = seqNo;
    }

    String firstScreen;
    byte[] image;

    public String getFirstScreen() {
        return firstScreen;
    }

    public void setFirstScreen(String firstScreen) {
        this.firstScreen = firstScreen;
    }

    public byte[] getImage() {
        return image;
    }

    public void setImage(byte[] image) {
        this.image = image;
    }

    public String getTable_name() {
        return table_name;
    }

    public void setTable_name(String table_name) {
        this.table_name = table_name;
    }

    public String getTable_desc() {
        return table_desc;
    }

    public void setTable_desc(String table_desc) {
        this.table_desc = table_desc;
    }

    public String getUpdation_typ() {
        return updation_typ;
    }

    public void setUpdation_typ(String updation_typ) {
        this.updation_typ = updation_typ;
    }

    public String getUpdation_process() {
        return updation_process;
    }

    public void setUpdation_process(String updation_process) {
        this.updation_process = updation_process;
    }

    public String getDuplicate_row_value_allow() {
        return Duplicate_row_value_allow;
    }

    public void setDuplicate_row_value_allow(String Duplicate_row_value_allow) {
        this.Duplicate_row_value_allow = Duplicate_row_value_allow;
    }

    public String getUpdate_key() {
        return update_key;
    }

    public void setUpdate_key(String update_key) {
        this.update_key = update_key;
    }

    public String getWhere_clause() {
        return where_clause;
    }

    public void setWhere_clause(String where_clause) {
        this.where_clause = where_clause;
    }

    public String getOrder_clause() {
        return order_clause;
    }

    public void setOrder_clause(String order_clause) {
        this.order_clause = order_clause;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getMandatory_to_start_portal() {
        return mandatory_to_start_portal;
    }

    public void setMandatory_to_start_portal(String mandatory_to_start_portal) {
        this.mandatory_to_start_portal = mandatory_to_start_portal;
    }

    public String getDisplay_clause() {
        return display_clause;
    }

    public void setDisplay_clause(String display_clause) {
        this.display_clause = display_clause;
    }

    public String getUnique_clause() {
        return unique_clause;
    }

    public void setUnique_clause(String unique_clause) {
        this.unique_clause = unique_clause;
    }

    public String getUnique_message() {
        return unique_message;
    }

    public void setUnique_message(String unique_message) {
        this.unique_message = unique_message;
    }

    public String getReplicate_rec() {
        return replicate_rec;
    }

    public void setReplicate_rec(String replicate_rec) {
        this.replicate_rec = replicate_rec;
    }

    public String getReplicate_fields() {
        return replicate_fields;
    }

    public void setReplicate_fields(String replicate_fields) {
        this.replicate_fields = replicate_fields;
    }

    public String getPortlet_Id() {
        return portlet_Id;
    }

    public void setPortlet_Id(String portlet_Id) {
        this.portlet_Id = portlet_Id;
    }

    public String getList_columns_update() {
        return List_columns_update;
    }

    public void setList_columns_update(String List_columns_update) {
        this.List_columns_update = List_columns_update;
    }

    public String getList_columns_order_by() {
        return list_columns_order_by;
    }

    public void setList_columns_order_by(String list_columns_order_by) {
        this.list_columns_order_by = list_columns_order_by;
    }

    public String getDATA_UPLOAD() {
        return DATA_UPLOAD;
    }

    public void setDATA_UPLOAD(String DATA_UPLOAD) {
        this.DATA_UPLOAD = DATA_UPLOAD;
    }

    public String getExcel_template() {
        return excel_template;
    }

    public void setExcel_template(String excel_template) {
        this.excel_template = excel_template;
    }

    public String getView_type() {
        return view_type;
    }

    public void setView_type(String view_type) {
        this.view_type = view_type;
    }

    public String getView_group() {
        return view_group;
    }

    public void setView_group(String view_group) {
        this.view_group = view_group;
    }

    public String getView_desc() {
        return view_desc;
    }

    public void setView_desc(String view_desc) {
        this.view_desc = view_desc;
    }

    public Object getView_data() {
        return view_data;
    }

    public void setView_data(Object view_data) {
        this.view_data = view_data;
    }

    public String getSelection_clause() {
        return selection_clause;
    }

    public void setSelection_clause(String selection_clause) {
        this.selection_clause = selection_clause;
    }
    
    
}
