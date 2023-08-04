/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.lhs.EMPDR.JSONResult;

import com.lhs.EMPDR.Model.TableDescModel;
import java.util.ArrayList;
import java.util.List;

/**
 *
 * @author premkumar.agrawal
 */
public class TableDescGridJSON {
    List<String>tableHeader;
    List<ArrayList>tableData;
    String para_desc;
    String valueFormatFlag;

    public String getValueFormatFlag() {
        return valueFormatFlag;
    }

    public void setValueFormatFlag(String valueFormatFlag) {
        this.valueFormatFlag = valueFormatFlag;
    }

    public void setTableHeader(List<String> tableHeader) {
        this.tableHeader = tableHeader;
    }

    public void setTableData(List<ArrayList> tableData) {
        this.tableData = tableData;
    }

    public List<String> getTableHeader() {
        return tableHeader;
    }

    public List<ArrayList> getTableData() {
        return tableData;
    }

    public String getPara_desc() {
        return para_desc;
    }

    public void setPara_desc(String para_desc) {
        this.para_desc = para_desc;
    }
}
