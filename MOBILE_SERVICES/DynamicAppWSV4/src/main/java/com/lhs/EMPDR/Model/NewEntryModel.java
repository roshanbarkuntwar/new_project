/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.lhs.EMPDR.Model;

import oracle.sql.DATE;

/**
 *
 * @author premkumar.agrawal
 */
public class NewEntryModel {

    String userCode;
    String dateTime;
    String projectCode;
    String activityCode;
    String WBSName;
    String contractorCode;
    String remark;
    String seqId;
    String message;

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    byte dp[];

    public byte[] getDp() {
        return dp;
    }

    public void setDp(byte[] dp) {
        this.dp = dp;
    }

//    String userCode;
//    String dateTime;
//    String transId;
//    String desc;
//    String nextDesc;
//    String imgFileId;
//    String imgDesc;
//    String message;
//byte dp[];
//
//    public byte[] getDp() {
//        return dp;
//    }
//
//    public void setDp(byte[] dp) {
//        this.dp = dp;
//    }
//
//    public String getDateTime() {
//        return dateTime;
//    }
//
//    public void setDateTime(String dateTime) {
//        this.dateTime = dateTime;
//    }
//
//    public String getMessage() {
//        return message;
//    }
//
//    public void setMessage(String message) {
//        this.message = message;
//    }
//
//    public String getUserCode() {
//        return userCode;
//    }
//
//    public void setUserCode(String userCode) {
//        this.userCode = userCode;
//    }
//
//  
//
//    public String getTransId() {
//        return transId;
//    }
//
//    public void setTransId(String transId) {
//        this.transId = transId;
//    }
//
//    public String getDesc() {
//        return desc;
//    }
//
//    public void setDesc(String desc) {
//        this.desc = desc;
//    }
//
//    public String getNextDesc() {
//        return nextDesc;
//    }
//
//    public void setNextDesc(String nextDesc) {
//        this.nextDesc = nextDesc;
//    }
//
//    public String getImgFileId() {
//        return imgFileId;
//    }
//
//    public void setImgFileId(String imgFileId) {
//        this.imgFileId = imgFileId;
//    }
//
//    public String getImgDesc() {
//        return imgDesc;
//    }
//
//    public void setImgDesc(String imgDesc) {
//        this.imgDesc = imgDesc;
//    }
//
    public String getUserCode() {
        return userCode;
    }

    public void setUserCode(String userCode) {
        this.userCode = userCode;
    }

    public String getDateTime() {
        return dateTime;
    }

    public void setDateTime(String dateTime) {
        this.dateTime = dateTime;
    }

    public String getProjectCode() {
        return projectCode;
    }

    public void setProjectCode(String projectCode) {
        this.projectCode = projectCode;
    }

    public String getActivityCode() {
        return activityCode;
    }

    public void setActivityCode(String activityCode) {
        this.activityCode = activityCode;
    }

    public String getWBSName() {
        return WBSName;
    }

    public void setWBSName(String WBSName) {
        this.WBSName = WBSName;
    }

    public String getContractorCode() {
        return contractorCode;
    }

    public void setContractorCode(String contractorCode) {
        this.contractorCode = contractorCode;
    }

    public String getRemark() {
        return remark;
    }

    public void setRemark(String remark) {
        this.remark = remark;
    }

    public String getSeqId() {
        return seqId;
    }

    public void setSeqId(String seqId) {
        this.seqId = seqId;
    }

}
