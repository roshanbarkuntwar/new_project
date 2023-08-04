/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.lhs.EMPDR.JSONResult;

import com.lhs.EMPDR.Model.TypesOfApprovalsModel;
import java.util.List;

/**
 *
 * @author kirti.misal
 */
public class TypeOfApprovalsJSON {
    List<TypesOfApprovalsModel> typeOfApprovalsList;
     List<TypesOfApprovalsModel> typeOfPervApprovalsList;
    String approvedApprovalCount;
    String unapprovedApprovalCount;

    public String getApprovedApprovalCount() {
        return approvedApprovalCount;
    }

    public void setApprovedApprovalCount(String approvedApprovalCount) {
        this.approvedApprovalCount = approvedApprovalCount;
    }

    public String getUnapprovedApprovalCount() {
        return unapprovedApprovalCount;
    }

    public void setUnapprovedApprovalCount(String unapprovedApprovalCount) {
        this.unapprovedApprovalCount = unapprovedApprovalCount;
    }

    public List<TypesOfApprovalsModel> getTypeOfApprovalsList() {
        return typeOfApprovalsList;
    }

    public void setTypeOfApprovalsList(List<TypesOfApprovalsModel> typeOfApprovalsList) {
        this.typeOfApprovalsList = typeOfApprovalsList;
    }

    public List<TypesOfApprovalsModel> getTypeOfPervApprovalsList() {
        return typeOfPervApprovalsList;
    }

    public void setTypeOfPervApprovalsList(List<TypesOfApprovalsModel> typeOfPervApprovalsList) {
        this.typeOfPervApprovalsList = typeOfPervApprovalsList;
    }
    
}
