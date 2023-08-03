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
 * @author premkumar.agrawal
 */
public class RecordInfoJSON {

    List<DyanamicRecordsListModel> recordsInfo;
    HashMap<String, ArrayList<String>> defaultPopulateData;
    String seqNo;
    String SLNO;
    String sqlData;
    String newFormInstance;
    // List<DyanamicRecordsListModel> dependentNextEntryInfo;

//     List< List<DyanamicRecordsListModel>> populatedEntry;
    public List<DyanamicRecordsListModel> getRecordsInfo() {
        return recordsInfo;
    }

    public String getSeqNo() {
        return seqNo;
    }

    public void setSeqNo(String seqNo) {
        this.seqNo = seqNo;
    }

//    public List<List<DyanamicRecordsListModel>> getPopulatedEntry() {
//        return populatedEntry;
//    }
//
//    public void setPopulatedEntry(List<List<DyanamicRecordsListModel>> populatedEntry) {
//        this.populatedEntry = populatedEntry;
//    }
    public HashMap<String, ArrayList<String>> getDefaultPopulateData() {
        return defaultPopulateData;
    }

    public void setDefaultPopulateData(HashMap<String, ArrayList<String>> defaultPopulateData) {
        this.defaultPopulateData = defaultPopulateData;
    }

    public void setRecordsInfo(List<DyanamicRecordsListModel> recordsInfo) {
        this.recordsInfo = recordsInfo;
    }

    public String getSLNO() {
        return SLNO;
    }

    public void setSLNO(String SLNO) {
        this.SLNO = SLNO;
    }

    public String getSqlData() {
        return sqlData;
    }

    public void setSqlData(String sqlData) {
        this.sqlData = sqlData;
    }

    public String getNewFormInstance() {
        return newFormInstance;
    }

    public void setNewFormInstance(String newFormInstance) {
        this.newFormInstance = newFormInstance;
    }
    
}
