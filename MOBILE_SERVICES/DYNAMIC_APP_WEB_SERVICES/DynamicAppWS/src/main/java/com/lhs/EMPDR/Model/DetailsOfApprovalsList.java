/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.lhs.EMPDR.Model;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;

/**
 *
 * @author kirti.misal
 */
public class DetailsOfApprovalsList {

//    ArrayList<ArrayList<LinkedHashMap<String, String>>> detailsOfApprovals;
//
//    public ArrayList<ArrayList<LinkedHashMap<String, String>>> getDetailsOfApprovals() {
//        return detailsOfApprovals;
//    }
//
//    public void setDetailsOfApprovals(ArrayList<ArrayList<LinkedHashMap<String, String>>> detailsOfApprovals) {
//        this.detailsOfApprovals = detailsOfApprovals;
//    }

    ArrayList<DetailsOfApprovals> approvalDetails;

    public ArrayList<DetailsOfApprovals> getApprovalDetails() {
        return approvalDetails;
    }

    public void setApprovalDetails(ArrayList<DetailsOfApprovals> approvalDetails) {
        this.approvalDetails = approvalDetails;
    }

}
