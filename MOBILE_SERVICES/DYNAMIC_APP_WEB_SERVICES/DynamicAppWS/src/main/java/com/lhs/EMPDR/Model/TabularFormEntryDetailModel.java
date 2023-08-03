/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.lhs.EMPDR.Model;

import com.lhs.EMPDR.JSONResult.RecordInfoJSON;
import java.util.ArrayList;
import java.util.List;

/**
 *
 * @author premkumar.agrawal
 */
public class TabularFormEntryDetailModel {

    List<ArrayList> tableData = new ArrayList<ArrayList>();

    RecordInfoJSON tableHeader;

    public List<ArrayList> getTableData() {
        return tableData;
    }

    public void setTableData(List<ArrayList> tableData) {
        this.tableData = tableData;
    }

    public RecordInfoJSON getTableHeader() {
        return tableHeader;
    }

    public void setTableHeader(RecordInfoJSON tableHeader) {
        this.tableHeader = tableHeader;
    }

}
