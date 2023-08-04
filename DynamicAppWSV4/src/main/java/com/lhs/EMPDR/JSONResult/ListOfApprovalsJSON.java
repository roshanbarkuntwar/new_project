/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.lhs.EMPDR.JSONResult;

import com.lhs.EMPDR.Model.ListOfApprovalsModel;
import java.util.List;

/**
 *
 * @author kirti.misal
 */
public class ListOfApprovalsJSON {
    String cardButtonName;
    String statusFlag;
    String statusColorBand;
     List <ListOfApprovalsModel> listOfApprovals;

    public List<ListOfApprovalsModel> getListOfApprovals() {
        return listOfApprovals;
    }

    public void setListOfApprovals(List<ListOfApprovalsModel> listOfApprovals) {
        this.listOfApprovals = listOfApprovals;
    }

    public String getCardButtonName() {
        return cardButtonName;
    }

    public void setCardButtonName(String cardButtonName) {
        this.cardButtonName = cardButtonName;
    }

    public String getStatusFlag() {
        return statusFlag;
    }

    public void setStatusFlag(String statusFlag) {
        this.statusFlag = statusFlag;
    }

    public String getStatusColorBand() {
        return statusColorBand;
    }

    public void setStatusColorBand(String statusColorBand) {
        this.statusColorBand = statusColorBand;
    }

   
}
