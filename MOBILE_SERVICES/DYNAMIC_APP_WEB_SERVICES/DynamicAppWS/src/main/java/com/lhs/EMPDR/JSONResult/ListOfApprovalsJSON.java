/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.lhs.EMPDR.JSONResult;

import com.lhs.EMPDR.Model.ListOfApprovalsModel;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

/**
 *
 * @author kirti.misal
 */
public class ListOfApprovalsJSON {
    
    
    

    public List<ListOfApprovalsModel> getListOfApprovals() {
        return listOfApprovals;
    }

    public void setListOfApprovals(List<ListOfApprovalsModel> listOfApprovals) {
        this.listOfApprovals = listOfApprovals;
    }

    public String getPaginationFlag() {
        return paginationFlag;
    }

    public void setPaginationFlag(String paginationFlag) {
        this.paginationFlag = paginationFlag;
    }

    public ArrayList<HashMap<String, String>> getDynamicList() {
        return dynamicList;
    }

    public void setDynamicList(ArrayList<HashMap<String, String>> dynamicList) {
        this.dynamicList = dynamicList;
    }

    public String getTextColor() {
        return textColor;
    }

    public void setTextColor(String textColor) {
        this.textColor = textColor;
    }

    public int getNoOfColumns() {
        return noOfColumns;
    }

    public void setNoOfColumns(int noOfColumns) {
        this.noOfColumns = noOfColumns;
    }
    
    
    
    ArrayList<HashMap<String, String>> dynamicList;

    List<ListOfApprovalsModel> listOfApprovals;
    String paginationFlag;
    String textColor;
    int noOfColumns;

}
