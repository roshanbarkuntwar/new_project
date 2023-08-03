/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.lhs.EMPDR.Model;

/**
 *
 * @author anjali.bhendarkar
 */
public class ApprovalStatus {
    
    String approved_by;
    String approved_by_user;
    String approved_date;
    String remark;
    String user_level;
    String amedno;

    public String getApproved_by() {
        return approved_by;
    }

    public void setApproved_by(String approved_by) {
        this.approved_by = approved_by;
    }

    public String getApproved_by_user() {
        return approved_by_user;
    }

    public void setApproved_by_user(String approved_by_user) {
        this.approved_by_user = approved_by_user;
    }

    public String getApproved_date() {
        return approved_date;
    }

    public void setApproved_date(String approved_date) {
        this.approved_date = approved_date;
    }

    public String getRemark() {
        return remark;
    }

    public void setRemark(String remark) {
        this.remark = remark;
    }

    public String getUser_level() {
        return user_level;
    }

    public void setUser_level(String user_level) {
        this.user_level = user_level;
    }

    public String getAmedno() {
        return amedno;
    }

    public void setAmedno(String amedno) {
        this.amedno = amedno;
    }
    
}
