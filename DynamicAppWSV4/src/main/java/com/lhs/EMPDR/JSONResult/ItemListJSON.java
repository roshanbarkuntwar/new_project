/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.lhs.EMPDR.JSONResult;

import com.lhs.EMPDR.Model.DyanamicRecordsListModel;
import com.lhs.EMPDR.Model.ParentChildItemListModel;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

/**
 *
 * @author kirti.misal
 */
public class ItemListJSON {
      ArrayList< ArrayList<DyanamicRecordsListModel>> recordsInfo;//array of item list
    HashMap<String, ArrayList<String>> defaultPopulateData;
    String seqNo;
    String SLNO;
   
     ArrayList<ParentChildItemListModel> prntchild=null;

    public ArrayList<ParentChildItemListModel> getPrntchild() {
        return prntchild;
    }

    public void setPrntchild(ArrayList<ParentChildItemListModel> prntchild) {
        this.prntchild = prntchild;
    }    
    
    
    public ArrayList<ArrayList<DyanamicRecordsListModel>> getRecordsInfo() {
        return recordsInfo;
    }

    public void setRecordsInfo(ArrayList<ArrayList<DyanamicRecordsListModel>> recordsInfo) {
        this.recordsInfo = recordsInfo;
    }

    public HashMap<String, ArrayList<String>> getDefaultPopulateData() {
        return defaultPopulateData;
    }

    public void setDefaultPopulateData(HashMap<String, ArrayList<String>> defaultPopulateData) {
        this.defaultPopulateData = defaultPopulateData;
    }

    public String getSeqNo() {
        return seqNo;
    }

    public void setSeqNo(String seqNo) {
        this.seqNo = seqNo;
    }

    public String getSLNO() {
        return SLNO;
    }

    public void setSLNO(String SLNO) {
        this.SLNO = SLNO;
    }
    
    
    
}
