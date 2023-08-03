/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.lhs.EMPDR.Model;

/**
 *
 * @author dhanshri.paradkar
 */
public class ReportingSummaryByDate {

//    String col1 = "";
//    String userCode = "";
//    String dateTime = "";
//    String transId= "";
//    String description = "";
//    String nextDesc = "";
//    String imageFileID = "";
//    String imageFileDescription= "";
//    String seqId="";
    String fileId = "";
    String userCode;
    String dateTime;
    String projectCode;
    String activityCode;
    String WBSName;
    String contractorCode;
    String remark;
    String seqId;

    byte dp[];

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

//    public String getSeqId() {
//        return seqId;
//    }
//
//    public void setSeqId(String seqId) {
//        this.seqId = seqId;
//    }
    public String getFileId() {
        return fileId;
    }

    public void setFileId(String fileId) {
        this.fileId = fileId;
    }

//
    public byte[] getDp() {
        return dp;
    }

    public void setDp(byte[] dp) {
        this.dp = dp;
    }

//
//    public String getCol1() {
//        return col1;
//    }
//
//    public void setCol1(String col1) {
//        this.col1 = col1;
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
//    public String getDateTime() {
//        return dateTime;
//    }
//
//    public void setDateTime(String dateTime) {
//        this.dateTime = dateTime;
//    }
//
//    public String getTransId() {
//        return transId;
//    }
//
//    public void setTransId(String transId) {
//        this.transId = transId;
//    }
//
//    public String getDescription() {
//        return description;
//    }
//
//    public void setDescription(String description) {
//        this.description = description;
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
//    public String getImageFileID() {
//        return imageFileID;
//    }
//
//    public void setImageFileID(String imageFileID) {
//        this.imageFileID = imageFileID;
//    }
//
//    public String getImageFileDescription() {
//        return imageFileDescription;
//    }
//
//    public void setImageFileDescription(String imageFileDescription) {
//        this.imageFileDescription = imageFileDescription;
//    }
}
