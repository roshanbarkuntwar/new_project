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
public class EntryListRuntimeModel {

    String value;
    String column_name;
    String column_desc;
    String column_type;
    String ref_lov_table_col;
    String displayFlag;
    String item_help_property;
    String column_select_list_value;
    String update_key;
    String codeOfvalue;
    String updationProcess;

    public String getUpdationProcess() {
        return updationProcess;
    }

    public void setUpdationProcess(String updationProcess) {
        this.updationProcess = updationProcess;
    }

    public String getDisplayFlag() {
        return displayFlag;
    }

    public String getUpdate_key() {
        return update_key;
    }

    public String getCodeOfvalue() {
        return codeOfvalue;
    }

    public void setCodeOfvalue(String codeOfvalue) {
        this.codeOfvalue = codeOfvalue;
    }

    public void setUpdate_key(String update_key) {
        this.update_key = update_key;
    }

    public String getItem_help_property() {
        return item_help_property;
    }

    public void setItem_help_property(String item_help_property) {
        this.item_help_property = item_help_property;
    }

    public String getColumn_select_list_value() {
        return column_select_list_value;
    }

    public void setColumn_select_list_value(String column_select_list_value) {
        this.column_select_list_value = column_select_list_value;
    }

    public void setDisplayFlag(String displayFlag) {
        this.displayFlag = displayFlag;
    }

    byte img[];

    public String getRef_lov_table_col() {
        return ref_lov_table_col;
    }

    public void setRef_lov_table_col(String ref_lov_table_col) {
        this.ref_lov_table_col = ref_lov_table_col;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
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

    public byte[] getImg() {
        return img;
    }

    public void setImg(byte[] img) {
        this.img = img;
    }

}
