/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.lhs.EMPDR.JSONResult;

import com.lhs.EMPDR.Model.DyanamicRecordsListModel;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

/**
 *
 * @author ranjeet.kumar
 */
public class DataInfoListJSON {
  private List<List<DyanamicRecordsListModel>> recordsInfo;
    private HashMap<String, ArrayList<String>> defaultPopulateData;

    public List<List<DyanamicRecordsListModel>> getRecordsInfo() {
        return recordsInfo;
    }
    public void setRecordsInfo(List<List<DyanamicRecordsListModel>> recordsInfo) {
        this.recordsInfo = recordsInfo;
    }

    public HashMap<String, ArrayList<String>> getDefaultPopulateData() {
        return defaultPopulateData;
    }
    public void setDefaultPopulateData(HashMap<String, ArrayList<String>> defaultPopulateData) {
        this.defaultPopulateData = defaultPopulateData;
    }  
}
