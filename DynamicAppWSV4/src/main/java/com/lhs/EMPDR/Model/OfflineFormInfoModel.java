/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.lhs.EMPDR.Model;

import com.lhs.EMPDR.JSONResult.RecordInfoJSON;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

/**
 *
 * @author premkumar.agrawal
 */
public class OfflineFormInfoModel {

    List<TableDetailModel> table_Detail;
    String view_mode;
    List< RecordInfoJSON> addFormData;

    public String getView_mode() {
        return view_mode;
    }

    public void setView_mode(String view_mode) {
        this.view_mode = view_mode;
    }

    public List<TableDetailModel> getTable_Detail() {
        return table_Detail;
    }

    public void setTable_Detail(List<TableDetailModel> table_Detail) {
        this.table_Detail = table_Detail;
    }

    public List<RecordInfoJSON> getAddFormData() {
        return addFormData;
    }

    public void setAddFormData(List<RecordInfoJSON> addFormData) {
        this.addFormData = addFormData;
    }

}
