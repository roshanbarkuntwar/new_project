/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.lhs.EMPDR.JSONResult;

import com.lhs.EMPDR.Model.ListOfApprovalsModel;
import com.lhs.EMPDR.Model.PartyListModel;
import com.lhs.EMPDR.Model.TableDetailModel;
import com.lhs.EMPDR.Model.UserListModel;
import java.util.HashMap;
import java.util.List;

/**
 *
 * @author premkumar.agrawal
 */
public class TableDetailJSON {

    private String nextSeqNo;
    List<TableDetailModel> table_Detail;
    List<PartyListModel> party_Detail;
    String view_mode;
    String displayValue;
     List<HashMap<String,List<PartyListModel>>> sideMenuObjectList;
     List<UserListModel> user_Detail;
  List<ListOfApprovalsModel> approvalsList;
  String todayDate;

    public String getTodayDate() {
        return todayDate;
    }

    public void setTodayDate(String todayDate) {
        this.todayDate = todayDate;
    }

  
  
    public List<ListOfApprovalsModel> getApprovalsList() {
        return approvalsList;
    }

    public void setApprovalsList(List<ListOfApprovalsModel> approvalsList) {
        this.approvalsList = approvalsList;
    }
  
  
    public String getDisplayValue() {
        return displayValue;
    }

    public void setDisplayValue(String displayValue) {
        this.displayValue = displayValue;
    }
    
    

    public List<PartyListModel> getParty_Detail() {
        return party_Detail;
    }

    public void setParty_Detail(List<PartyListModel> party_Detail) {
        this.party_Detail = party_Detail;
    }

    
    
    public List<TableDetailModel> getTable_Detail() {
        return table_Detail;
    }

    public String getView_mode() {
        return view_mode;
    }

    public void setView_mode(String view_mode) {
        this.view_mode = view_mode;
    }

    public void setTable_Detail(List<TableDetailModel> table_Detail) {
        this.table_Detail = table_Detail;
    }
    
    
    public String getNextSeqNo() {
        return nextSeqNo;
    }

    public void setNextSeqNo(String nextSeqNo) {
        this.nextSeqNo = nextSeqNo;
    }

    public List<HashMap<String, List<PartyListModel>>> getSideMenuObjectList() {
        return sideMenuObjectList;
    }

    public void setSideMenuObjectList(List<HashMap<String, List<PartyListModel>>> sideMenuObjectList) {
        this.sideMenuObjectList = sideMenuObjectList;
    }

    public List<UserListModel> getUser_Detail() {
        return user_Detail;
    }

    public void setUser_Detail(List<UserListModel> user_Detail) {
        this.user_Detail = user_Detail;
    }
    
    

}
