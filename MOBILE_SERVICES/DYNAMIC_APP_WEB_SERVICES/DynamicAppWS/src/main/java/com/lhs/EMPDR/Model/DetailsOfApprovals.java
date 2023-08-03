/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.lhs.EMPDR.Model;

import java.util.ArrayList;
import java.util.LinkedHashMap;

/**
 *
 * @author kirti.misal
 */
public class DetailsOfApprovals {

    public String heading;
    public String seqId;
    ArrayList<ArrayList<LinkedHashMap<String, String>>> Values;

    public String getSeqId() {
        return seqId;
    }

    public void setSeqId(String seqId) {
        this.seqId = seqId;
    }

    public ArrayList<ArrayList<LinkedHashMap<String, String>>> getValues() {
        return Values;
    }

    public void setValues(ArrayList<ArrayList<LinkedHashMap<String, String>>> Values) {
        this.Values = Values;
    }

    public String getHeading() {
        return heading;
    }

    public void setHeading(String heading) {
        this.heading = heading;
    }

//      HashMap<String, String> details;
//      HashMap<String, String> breakAmount;
//       HashMap<String, String> termsConditions;
//    String accName;
//    String partyrefno;
//    String amendno;
//    String vrno;
//    String paymentDewDays;
//    String paymentMode;
//    String dewDate;
//    String itemName;
//    String qtyOrder;
//    String um;
//    String aqtyOrder;
//    String aum;
//    String rate;
//
//    public String getAccName() {
//        return accName;
//    }
//
//    public void setAccName(String accName) {
//        this.accName = accName;
//    }
//
//    public String getPartyrefno() {
//        return partyrefno;
//    }
//
//    public void setPartyrefno(String partyrefno) {
//        this.partyrefno = partyrefno;
//    }
//
//    public String getAmendno() {
//        return amendno;
//    }
//
//    public void setAmendno(String amendno) {
//        this.amendno = amendno;
//    }
//
//    public String getVrno() {
//        return vrno;
//    }
//
//    public void setVrno(String vrno) {
//        this.vrno = vrno;
//    }
//
//    public String getPaymentDewDays() {
//        return paymentDewDays;
//    }
//
//    public void setPaymentDewDays(String paymentDewDays) {
//        this.paymentDewDays = paymentDewDays;
//    }
//
//    public String getPaymentMode() {
//        return paymentMode;
//    }
//
//    public void setPaymentMode(String paymentMode) {
//        this.paymentMode = paymentMode;
//    }
//
//    public String getDewDate() {
//        return dewDate;
//    }
//
//    public void setDewDate(String dewDate) {
//        this.dewDate = dewDate;
//    }
//
//    public String getItemName() {
//        return itemName;
//    }
//
//    public void setItemName(String itemName) {
//        this.itemName = itemName;
//    }
//
//    public String getQtyOrder() {
//        return qtyOrder;
//    }
//
//    public void setQtyOrder(String qtyOrder) {
//        this.qtyOrder = qtyOrder;
//    }
//
//    public String getUm() {
//        return um;
//    }
//
//    public void setUm(String um) {
//        this.um = um;
//    }
//
//    public String getAqtyOrder() {
//        return aqtyOrder;
//    }
//
//    public void setAqtyOrder(String aqtyOrder) {
//        this.aqtyOrder = aqtyOrder;
//    }
//
//    public String getAum() {
//        return aum;
//    }
//
//    public void setAum(String aum) {
//        this.aum = aum;
//    }
//
//    public String getRate() {
//        return rate;
//    }
//
//    public void setRate(String rate) {
//        this.rate = rate;
//    }
//    
//    
//    public HashMap<String, String> getDetails() {
//        return details;
//    }
//
//    public void setDetails(HashMap<String, String> details) {
//        this.details = details;
//    }
//
//    public HashMap<String, String> getBreakAmount() {
//        return breakAmount;
//    }
//
//    public void setBreakAmount(HashMap<String, String> breakAmount) {
//        this.breakAmount = breakAmount;
//    }
//
//    public HashMap<String, String> getTermsConditions() {
//        return termsConditions;
//    }
//
//    public void setTermsConditions(HashMap<String, String> termsConditions) {
//        this.termsConditions = termsConditions;
//    }    
}
