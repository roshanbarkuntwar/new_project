/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.lhs.EMPDR.Model;

import java.util.List;

/**
 *
 * @author premkumar.agrawal
 */
public class LoginModel {

    String userName;
    String user_code;
    String message;
    String module;
    String entity_code;
    String division;
    String acc_year;
    String dept_code;
    String acc_code;
    String dashboardLink;
    String notif_topic;
    String tracking_interval;

    public String getDashboardLink() {
        return dashboardLink;
    }

    public void setDashboardLink(String dashboardLink) {
        this.dashboardLink = dashboardLink;
    }

    public String getAcc_code() {
        return acc_code;
    }

    public void setAcc_code(String acc_code) {
        this.acc_code = acc_code;
    }

    public String getModule() {
        return module;
    }

    public String getEntity_code() {
        return entity_code;
    }

    public void setEntity_code(String entity_code) {
        this.entity_code = entity_code;
    }

    public String getDivision() {
        return division;
    }

    public void setDivision(String division) {
        this.division = division;
    }

    public String getAcc_year() {
        return acc_year;
    }

    public void setAcc_year(String acc_year) {
        this.acc_year = acc_year;
    }

    public String getDept_code() {
        return dept_code;
    }

    public void setDept_code(String dept_code) {
        this.dept_code = dept_code;
    }

    public void setModule(String module) {
        this.module = module;
    }

//List<TableDetailModel> tableData;
//    public List<TableDetailModel> getTableData() {
//        return tableData;
//    }
//
//    public void setTableData(List<TableDetailModel> tableData) {
//        this.tableData = tableData;
//    }
    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getUser_code() {
        return user_code;
    }

    public void setUser_code(String user_code) {
        this.user_code = user_code;
    }

    public String getNotif_topic() {
        return notif_topic;
    }

    public void setNotif_topic(String notif_topic) {
        this.notif_topic = notif_topic;
    }

    public String getTracking_interval() {
        return tracking_interval;
    }

    public void setTracking_interval(String tracking_interval) {
        this.tracking_interval = tracking_interval;
    }
    
    
}
