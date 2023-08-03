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
    HashMap<String, ArrayList<Object>> defaultPopulateData;
    String seqNo;
    String SLNO;
    String access_control;
    String newFormInstance;
    // List<DyanamicRecordsListModel> dependentNextEntryInfo;

//     List< List<DyanamicRecordsListModel>> populatedEntry;
    public List<DyanamicRecordsListModel> getRecordsInfo() {
        return recordsInfo;
    }

    public String getSeqNo() {
        return seqNo;
    }

    public String getNewFormInstance() {
        return newFormInstance;
    }

    public void setNewFormInstance(String newFormInstance) {
        this.newFormInstance = newFormInstance;
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
    public HashMap<String, ArrayList<Object>> getDefaultPopulateData() {
        return defaultPopulateData;
    }

    public void setDefaultPopulateData(HashMap<String, ArrayList<Object>> defaultPopulateData) {
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

    public String getAccess_control() {
        return access_control;
    }

    public void setAccess_control(String access_control) {
        this.access_control = access_control;
    }

}
